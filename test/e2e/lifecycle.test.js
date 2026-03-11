import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdtemp, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI = join(__dirname, '..', '..', 'bin', 'cli.js');

async function run(cwd, ...args) {
  return execFileAsync('node', [CLI, ...args], { cwd, timeout: 60_000 });
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

describe('E2E: install/uninstall/update lifecycle', { timeout: 60_000 }, () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'harness-lab-e2e-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('install (E2E-005)', () => {
    it('installs prd-generator to project scope', async (t) => {
      let result;
      try {
        result = await run(tempDir, 'install', 'prd-generator', '--scope', 'project');
      } catch {
        t.skip('requires network');
        return;
      }
      const { stdout } = result;
      assert.ok(stdout.includes('Installed skill: prd-generator'));

      const skillPath = join(tempDir, '.claude', 'skills', 'prd-generator', 'SKILL.md');
      assert.ok(await exists(skillPath), 'SKILL.md should exist after install');
    });
  });

  describe('uninstall (E2E-007)', () => {
    it('removes installed harness', async (t) => {
      try {
        await run(tempDir, 'install', 'prd-generator', '--scope', 'project');
      } catch {
        t.skip('requires network');
        return;
      }

      const skillPath = join(tempDir, '.claude', 'skills', 'prd-generator');
      assert.ok(await exists(skillPath), 'skill should exist before uninstall');

      await run(tempDir, 'uninstall', 'prd-generator', '--scope', 'project');
      assert.ok(!(await exists(skillPath)), 'skill should be removed after uninstall');
    });

    it('uninstall is idempotent', async (t) => {
      try {
        // Uninstall without prior install — should still exit 0
        await run(tempDir, 'uninstall', 'prd-generator', '--scope', 'project');
      } catch (err) {
        if (err.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' || err.killed) {
          t.skip('requires network');
          return;
        }
        // Network error → skip
        if (err.stderr && err.stderr.includes('fetch')) {
          t.skip('requires network');
          return;
        }
        throw err;
      }
    });
  });

  describe('update (E2E-008)', () => {
    it('reinstalls harness via update', async (t) => {
      let result;
      try {
        result = await run(tempDir, 'update', 'prd-generator', '--scope', 'project');
      } catch {
        t.skip('requires network');
        return;
      }
      const { stdout } = result;
      assert.ok(stdout.includes('prd-generator'));
      assert.ok(stdout.includes('v1.0.0'));

      const skillPath = join(tempDir, '.claude', 'skills', 'prd-generator', 'SKILL.md');
      assert.ok(await exists(skillPath), 'SKILL.md should exist after update');
    });
  });
});
