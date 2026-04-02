// Install/uninstall harness artifacts to/from .claude/ directory

import { mkdir, writeFile, rm, readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fetchHarnessJson, getRepoBase } from './catalog.js';
import { resolveTarget } from './scope.js';

async function fetchFile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function fetchDirectoryListing(repoBase, dirPath) {
  // Use GitHub API to list directory contents
  const apiUrl = `https://api.github.com/repos/hgflima/harness-lab/contents/${dirPath}`;
  const res = await fetch(apiUrl);
  if (!res.ok) return [];
  const items = await res.json();
  return Array.isArray(items) ? items : [];
}

async function downloadDirectory(repoBase, remotePath, localPath) {
  const items = await fetchDirectoryListing(repoBase, remotePath);

  for (const item of items) {
    const localItemPath = join(localPath, item.name);

    if (item.type === 'file') {
      const content = await fetchFile(item.download_url);
      await mkdir(dirname(localItemPath), { recursive: true });
      await writeFile(localItemPath, content, 'utf-8');
    } else if (item.type === 'dir') {
      await downloadDirectory(repoBase, item.path, localItemPath);
    }
  }
}

export async function installHarness(harnessName, harnessPath, scope) {
  const target = resolveTarget(scope);
  const repoBase = getRepoBase();
  const harness = await fetchHarnessJson(harnessPath);
  const installed = [];

  // Install skills
  for (const skillName of harness.artifacts.skills) {
    const remotePath = `${harnessPath}/skills/${skillName}`;
    const localPath = join(target, 'skills', skillName);
    await downloadDirectory(repoBase, remotePath, localPath);
    installed.push(`skill: ${skillName}`);
  }

  // Install commands
  for (const cmdName of harness.artifacts.commands) {
    const remoteUrl = `${repoBase}/${harnessPath}/commands/${cmdName}.md`;
    const localPath = join(target, 'commands', `${cmdName}.md`);
    const content = await fetchFile(remoteUrl);
    await mkdir(dirname(localPath), { recursive: true });
    await writeFile(localPath, content, 'utf-8');
    installed.push(`command: ${cmdName}`);
  }

  // Install agents
  for (const agentName of harness.artifacts.agents) {
    const remoteUrl = `${repoBase}/${harnessPath}/agents/${agentName}.md`;
    const localPath = join(target, 'agents', `${agentName}.md`);
    const content = await fetchFile(remoteUrl);
    await mkdir(dirname(localPath), { recursive: true });
    await writeFile(localPath, content, 'utf-8');
    installed.push(`agent: ${agentName}`);
  }

  // Install directories (shared resources like templates, adapters, references)
  if (harness.artifacts.directories) {
    for (const dirName of harness.artifacts.directories) {
      const remotePath = `${harnessPath}/${dirName}`;
      const localPath = join(target, dirName);
      await downloadDirectory(repoBase, remotePath, localPath);
      installed.push(`directory: ${dirName}`);
    }
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
