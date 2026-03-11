import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI = join(__dirname, '..', '..', 'bin', 'cli.js');

async function run(...args) {
  return execFileAsync('node', [CLI, ...args], { timeout: 30_000 });
}

describe('E2E: errors, help, and version', { timeout: 30_000 }, () => {
  describe('help (E2E-011)', () => {
    it('--help exits 0 and lists all commands', async () => {
      const { stdout } = await run('--help');
      assert.ok(stdout.includes('init'));
      assert.ok(stdout.includes('categories'));
      assert.ok(stdout.includes('list'));
      assert.ok(stdout.includes('install'));
      assert.ok(stdout.includes('uninstall'));
      assert.ok(stdout.includes('update'));
    });
  });

  describe('version (E2E-012)', () => {
    it('--version exits 0 and prints semver', async () => {
      const { stdout } = await run('--version');
      assert.match(stdout.trim(), /^\d+\.\d+\.\d+$/);
    });
  });

  describe('unknown command', () => {
    it('exits 1 with "Unknown command" on stderr', async () => {
      await assert.rejects(
        run('foobar'),
        (err) => {
          assert.ok(err.stderr.includes('Unknown command'));
          assert.equal(err.code, 1);
          return true;
        }
      );
    });
  });

  describe('install errors (E2E-010)', () => {
    it('nonexistent harness exits 1 with guidance', async (t) => {
      try {
        await run('install', 'nonexistent-harness');
        assert.fail('should have exited with non-zero');
      } catch (err) {
        if (!err.stderr || err.stderr.includes('Failed to fetch catalog')) {
          t.skip('requires network (catalog unreachable)');
          return;
        }
        assert.equal(err.code, 1);
        assert.ok(err.stderr.includes('Harness not found'));
        assert.ok(err.stderr.includes('harness-lab list'));
      }
    });

    it('invalid scope exits 1 with valid scope list', async (t) => {
      try {
        await run('install', 'prd-generator', '--scope', 'invalid');
        assert.fail('should have exited with non-zero');
      } catch (err) {
        if (!err.stderr || err.stderr.includes('Failed to fetch catalog')) {
          t.skip('requires network (catalog unreachable)');
          return;
        }
        assert.equal(err.code, 1);
        assert.ok(err.stderr.includes('Invalid scope') || err.stderr.includes('global, project, or local'));
      }
    });
  });
});
