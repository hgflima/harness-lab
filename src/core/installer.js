// Install/uninstall harness artifacts to/from .claude/ directory

import { mkdir, writeFile, rm, readdir, readFile, mkdtemp, cp, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fetchHarnessJson, getRepoTarballUrl } from './catalog.js';
import { resolveTarget } from './scope.js';

const execFileAsync = promisify(execFile);

// Downloads the whole repo as a single tarball and extracts it to a temp dir.
// codeload.github.com is not subject to the GitHub REST API rate limit
// (60 req/h unauthenticated) that per-directory content listings hit.
export async function downloadRepoSnapshot() {
  const url = getRepoTarballUrl();
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download repository archive (${res.status}): ${url}`);
  }

  const tempDir = await mkdtemp(join(tmpdir(), 'harness-lab-'));
  const tarPath = join(tempDir, 'repo.tar.gz');
  await writeFile(tarPath, Buffer.from(await res.arrayBuffer()));

  const repoDir = join(tempDir, 'repo');
  await mkdir(repoDir);
  await execFileAsync('tar', ['-xzf', tarPath, '-C', repoDir, '--strip-components=1']);

  return {
    dir: repoDir,
    cleanup: () => rm(tempDir, { recursive: true, force: true }),
  };
}

async function copyArtifact(srcPath, destPath, label) {
  try {
    await access(srcPath);
  } catch {
    throw new Error(`${label} is declared in harness.json but missing from the repository archive`);
  }
  await mkdir(dirname(destPath), { recursive: true });
  await cp(srcPath, destPath, { recursive: true });
}

// repoDir: optional path to an already-extracted repo snapshot, so callers
// installing multiple harnesses (e.g. update) download the tarball only once.
export async function installHarness(harnessName, harnessPath, scope, repoDir = null) {
  const target = resolveTarget(scope);
  const snapshot = repoDir ? null : await downloadRepoSnapshot();
  const repo = repoDir ?? snapshot.dir;
  const installed = [];

  try {
    let manifestRaw;
    try {
      manifestRaw = await readFile(join(repo, harnessPath, 'harness.json'), 'utf-8');
    } catch {
      throw new Error(`harness.json not found in repository archive at ${harnessPath}`);
    }
    const harness = JSON.parse(manifestRaw);

    for (const skillName of harness.artifacts.skills) {
      await copyArtifact(
        join(repo, harnessPath, 'skills', skillName),
        join(target, 'skills', skillName),
        `Skill "${skillName}"`
      );
      installed.push(`skill: ${skillName}`);
    }

    for (const cmdName of harness.artifacts.commands) {
      await copyArtifact(
        join(repo, harnessPath, 'commands', `${cmdName}.md`),
        join(target, 'commands', `${cmdName}.md`),
        `Command "${cmdName}"`
      );
      installed.push(`command: ${cmdName}`);
    }

    for (const agentName of harness.artifacts.agents) {
      await copyArtifact(
        join(repo, harnessPath, 'agents', `${agentName}.md`),
        join(target, 'agents', `${agentName}.md`),
        `Agent "${agentName}"`
      );
      installed.push(`agent: ${agentName}`);
    }

    // Install directories (shared resources like templates, adapters, references)
    if (harness.artifacts.directories) {
      for (const dirName of harness.artifacts.directories) {
        await copyArtifact(
          join(repo, harnessPath, dirName),
          join(target, dirName),
          `Directory "${dirName}"`
        );
        installed.push(`directory: ${dirName}`);
      }
    }
  } finally {
    if (snapshot) await snapshot.cleanup();
  }

  return installed;
}

export async function uninstallHarness(harnessName, harnessPath, scope) {
  const target = resolveTarget(scope);
  const harness = await fetchHarnessJson(harnessPath);
  const removed = [];

  for (const skillName of harness.artifacts.skills) {
    const localPath = join(target, 'skills', skillName);
    await rm(localPath, { recursive: true, force: true });
    removed.push(`skill: ${skillName}`);
  }

  for (const cmdName of harness.artifacts.commands) {
    const localPath = join(target, 'commands', `${cmdName}.md`);
    await rm(localPath, { force: true });
    removed.push(`command: ${cmdName}`);
  }

  // Clean up empty namespace directories left by commands (e.g. commands/ui/)
  const cmdNamespaces = new Set(
    harness.artifacts.commands
      .filter(c => c.includes('/'))
      .map(c => join(target, 'commands', c.split('/')[0]))
  );
  for (const nsDir of cmdNamespaces) {
    try {
      const entries = await readdir(nsDir);
      if (entries.length === 0) await rm(nsDir, { recursive: true, force: true });
    } catch {}
  }

  for (const agentName of harness.artifacts.agents) {
    const localPath = join(target, 'agents', `${agentName}.md`);
    await rm(localPath, { force: true });
    removed.push(`agent: ${agentName}`);
  }

  // Uninstall directories
  if (harness.artifacts.directories) {
    for (const dirName of harness.artifacts.directories) {
      const localPath = join(target, dirName);
      await rm(localPath, { recursive: true, force: true });
      removed.push(`directory: ${dirName}`);
    }
  }

  return removed;
}
