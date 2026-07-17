import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { installHarness, uninstallHarness, downloadRepoSnapshot } from '../../src/core/installer.js';

const execFileAsync = promisify(execFile);

describe('installer', () => {
  let originalFetch;
  let originalCwd;
  let tempDir;

  const mockHarness = {
    name: 'test-harness',
    version: '1.0.0',
    artifacts: {
      skills: ['test-skill'],
      commands: ['test-cmd'],
      agents: ['test-agent'],
    },
  };

  // Writes the given files under a fake repo root, tars it up like GitHub's
  // codeload archive (single top-level dir), and returns the tarball bytes.
  async function buildRepoTarball(files) {
    const stageDir = join(tempDir, 'tar-stage');
    const repoRoot = join(stageDir, 'harness-lab-main');
    for (const [relPath, content] of Object.entries(files)) {
      const abs = join(repoRoot, relPath);
      await mkdir(dirname(abs), { recursive: true });
      await writeFile(abs, content, 'utf-8');
    }
    const tarPath = join(stageDir, 'repo.tar.gz');
    await execFileAsync('tar', ['-czf', tarPath, '-C', stageDir, 'harness-lab-main']);
    return readFile(tarPath);
  }

  function mockTarballFetch(tarBuf) {
    globalThis.fetch = async (url) => {
      if (url.includes('codeload.github.com')) {
        return {
          ok: true,
          arrayBuffer: async () =>
            tarBuf.buffer.slice(tarBuf.byteOffset, tarBuf.byteOffset + tarBuf.byteLength),
        };
      }
      return { ok: false, status: 404 };
    };
  }

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
    originalCwd = process.cwd();
    tempDir = await mkdtemp(join(tmpdir(), 'harness-lab-test-'));
    process.chdir(tempDir);
  });

  afterEach(async () => {
    globalThis.fetch = originalFetch;
    process.chdir(originalCwd);
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('installHarness', () => {
    it('copies skills, commands, and agents from the repo tarball', async () => {
      const tarBuf = await buildRepoTarball({
        'harnesses/test/harness.json': JSON.stringify(mockHarness),
        'harnesses/test/skills/test-skill/SKILL.md': '# Test content',
        'harnesses/test/skills/test-skill/references/ref.md': '# ref',
        'harnesses/test/commands/test-cmd.md': '# Test content',
        'harnesses/test/agents/test-agent.md': '# Test content',
      });
      mockTarballFetch(tarBuf);

      const installed = await installHarness('test-harness', 'harnesses/test', 'project');

      assert.ok(installed.includes('skill: test-skill'));
      assert.ok(installed.includes('command: test-cmd'));
      assert.ok(installed.includes('agent: test-agent'));

      const skillContent = await readFile(join(tempDir, '.claude', 'skills', 'test-skill', 'SKILL.md'), 'utf-8');
      assert.equal(skillContent, '# Test content');

      // Nested skill directories come along
      const refContent = await readFile(
        join(tempDir, '.claude', 'skills', 'test-skill', 'references', 'ref.md'),
        'utf-8'
      );
      assert.equal(refContent, '# ref');

      const cmdContent = await readFile(join(tempDir, '.claude', 'commands', 'test-cmd.md'), 'utf-8');
      assert.equal(cmdContent, '# Test content');

      const agentContent = await readFile(join(tempDir, '.claude', 'agents', 'test-agent.md'), 'utf-8');
      assert.equal(agentContent, '# Test content');
    });

    it('handles namespaced command slugs (e.g. devy/loop/run)', async () => {
      const tarBuf = await buildRepoTarball({
        'harnesses/test/harness.json': JSON.stringify({
          ...mockHarness,
          artifacts: { skills: [], commands: ['devy/loop/run'], agents: [] },
        }),
        'harnesses/test/commands/devy/loop/run.md': '# run',
      });
      mockTarballFetch(tarBuf);

      const installed = await installHarness('test', 'harnesses/test', 'project');
      assert.ok(installed.includes('command: devy/loop/run'));

      const content = await readFile(
        join(tempDir, '.claude', 'commands', 'devy', 'loop', 'run.md'),
        'utf-8'
      );
      assert.equal(content, '# run');
    });

    it('throws when a declared artifact is missing from the archive', async () => {
      const tarBuf = await buildRepoTarball({
        'harnesses/test/harness.json': JSON.stringify({
          ...mockHarness,
          artifacts: { skills: ['ghost-skill'], commands: [], agents: [] },
        }),
      });
      mockTarballFetch(tarBuf);

      await assert.rejects(
        installHarness('test', 'harnesses/test', 'project'),
        /Skill "ghost-skill" is declared in harness.json but missing/
      );
    });

    it('throws when the tarball download fails instead of reporting success', async () => {
      globalThis.fetch = async () => ({ ok: false, status: 403 });

      await assert.rejects(
        installHarness('test', 'harnesses/test', 'project'),
        /Failed to download repository archive \(403\)/
      );
    });

    it('throws when harness.json is missing from the archive', async () => {
      const tarBuf = await buildRepoTarball({
        'harnesses/other/harness.json': JSON.stringify(mockHarness),
      });
      mockTarballFetch(tarBuf);

      await assert.rejects(
        installHarness('test', 'harnesses/test', 'project'),
        /harness.json not found in repository archive at harnesses\/test/
      );
    });

    it('reuses a provided repo snapshot without fetching', async () => {
      globalThis.fetch = async () => {
        throw new Error('fetch should not be called when repoDir is provided');
      };

      const repoDir = join(tempDir, 'snapshot');
      const files = {
        'harnesses/test/harness.json': JSON.stringify({
          ...mockHarness,
          artifacts: { skills: [], commands: ['test-cmd'], agents: [] },
        }),
        'harnesses/test/commands/test-cmd.md': '# from snapshot',
      };
      for (const [relPath, content] of Object.entries(files)) {
        const abs = join(repoDir, relPath);
        await mkdir(dirname(abs), { recursive: true });
        await writeFile(abs, content, 'utf-8');
      }

      const installed = await installHarness('test', 'harnesses/test', 'project', repoDir);
      assert.ok(installed.includes('command: test-cmd'));

      const content = await readFile(join(tempDir, '.claude', 'commands', 'test-cmd.md'), 'utf-8');
      assert.equal(content, '# from snapshot');
    });
  });

  describe('downloadRepoSnapshot', () => {
    it('extracts the tarball and cleans up after itself', async () => {
      const tarBuf = await buildRepoTarball({
        'catalog.json': '{}',
        'harnesses/test/harness.json': JSON.stringify(mockHarness),
      });
      mockTarballFetch(tarBuf);

      const snapshot = await downloadRepoSnapshot();
      const manifest = await readFile(join(snapshot.dir, 'harnesses', 'test', 'harness.json'), 'utf-8');
      assert.equal(JSON.parse(manifest).name, 'test-harness');

      await snapshot.cleanup();
      await assert.rejects(readFile(join(snapshot.dir, 'catalog.json')), { code: 'ENOENT' });
    });
  });

  describe('uninstallHarness', () => {
    it('removes installed artifacts', async () => {
      // Pre-create files
      const skillDir = join(tempDir, '.claude', 'skills', 'test-skill');
      const cmdPath = join(tempDir, '.claude', 'commands', 'test-cmd.md');
      const agentPath = join(tempDir, '.claude', 'agents', 'test-agent.md');

      await mkdir(skillDir, { recursive: true });
      await writeFile(join(skillDir, 'SKILL.md'), '# skill', 'utf-8');
      await mkdir(join(tempDir, '.claude', 'commands'), { recursive: true });
      await writeFile(cmdPath, '# cmd', 'utf-8');
      await mkdir(join(tempDir, '.claude', 'agents'), { recursive: true });
      await writeFile(agentPath, '# agent', 'utf-8');

      globalThis.fetch = async (url) => {
        if (url.includes('harness.json')) {
          return { ok: true, json: async () => mockHarness };
        }
        return { ok: false, status: 404 };
      };

      const removed = await uninstallHarness('test-harness', 'harnesses/test', 'project');

      assert.ok(removed.includes('skill: test-skill'));
      assert.ok(removed.includes('command: test-cmd'));
      assert.ok(removed.includes('agent: test-agent'));

      // Verify files removed
      await assert.rejects(readFile(cmdPath), { code: 'ENOENT' });
      await assert.rejects(readFile(agentPath), { code: 'ENOENT' });
    });

    it('is idempotent — removing nonexistent files does not throw', async () => {
      globalThis.fetch = async (url) => {
        if (url.includes('harness.json')) {
          return { ok: true, json: async () => mockHarness };
        }
        return { ok: false, status: 404 };
      };

      // Should not throw even when files don't exist
      const removed = await uninstallHarness('test-harness', 'harnesses/test', 'project');
      assert.equal(removed.length, 3);
    });
  });
});
