import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { installHarness, uninstallHarness } from '../../src/core/installer.js';

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
    it('downloads skills, commands, and agents to target dir', async () => {
      globalThis.fetch = async (url) => {
        // harness.json
        if (url.includes('harness.json')) {
          return { ok: true, json: async () => mockHarness };
        }
        // GitHub API directory listing for skills
        if (url.includes('api.github.com') && url.includes('test-skill')) {
          return {
            ok: true,
            json: async () => [
              {
                name: 'SKILL.md',
                type: 'file',
                path: 'harnesses/test/skills/test-skill/SKILL.md',
                download_url: 'https://raw.example.com/SKILL.md',
              },
            ],
          };
        }
        // File downloads
        if (url.includes('raw.example.com') || url.includes('raw.githubusercontent.com')) {
          return { ok: true, text: async () => '# Test content' };
        }
        return { ok: false, status: 404 };
      };

      const installed = await installHarness('test-harness', 'harnesses/test', 'project');

      assert.ok(installed.includes('skill: test-skill'));
      assert.ok(installed.includes('command: test-cmd'));
      assert.ok(installed.includes('agent: test-agent'));

      // Verify command file written
      const cmdContent = await readFile(join(tempDir, '.claude', 'commands', 'test-cmd.md'), 'utf-8');
      assert.equal(cmdContent, '# Test content');

      // Verify agent file written
      const agentContent = await readFile(join(tempDir, '.claude', 'agents', 'test-agent.md'), 'utf-8');
      assert.equal(agentContent, '# Test content');
    });

    it('handles recursive directory download for skills', async () => {
      globalThis.fetch = async (url) => {
        if (url.includes('harness.json')) {
          return {
            ok: true,
            json: async () => ({
              ...mockHarness,
              artifacts: { skills: ['nested-skill'], commands: [], agents: [] },
            }),
          };
        }
        if (url.includes('api.github.com') && url.includes('nested-skill') && !url.includes('subdir')) {
          return {
            ok: true,
            json: async () => [
              { name: 'SKILL.md', type: 'file', path: 'x/SKILL.md', download_url: 'https://raw.example.com/SKILL.md' },
              { name: 'subdir', type: 'dir', path: 'harnesses/test/skills/nested-skill/subdir' },
            ],
          };
        }
        if (url.includes('api.github.com') && url.includes('subdir')) {
          return {
            ok: true,
            json: async () => [
              { name: 'ref.md', type: 'file', path: 'x/ref.md', download_url: 'https://raw.example.com/ref.md' },
            ],
          };
        }
        if (url.includes('raw.example.com')) {
          return { ok: true, text: async () => '# content' };
        }
        return { ok: false, status: 404 };
      };

      const installed = await installHarness('test', 'harnesses/test', 'project');
      assert.ok(installed.includes('skill: nested-skill'));

      // Verify nested file
      const nested = await readFile(
        join(tempDir, '.claude', 'skills', 'nested-skill', 'subdir', 'ref.md'),
        'utf-8'
      );
      assert.equal(nested, '# content');
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
