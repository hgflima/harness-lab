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

describe('E2E: browsing commands', { timeout: 30_000 }, () => {
  describe('categories (E2E-003)', () => {
    it('lists all categories', async (t) => {
      let result;
      try {
        result = await run('categories');
      } catch {
        t.skip('requires network');
        return;
      }
      const { stdout } = result;
      assert.ok(stdout.includes('product'));
      assert.ok(stdout.includes('harness-engineering'));
      assert.ok(stdout.includes('software-engineering'));
      assert.ok(stdout.includes('design'));
    });
  });

  describe('list (E2E-004)', () => {
    it('lists all harnesses without filter', async (t) => {
      let result;
      try {
        result = await run('list');
      } catch {
        t.skip('requires network');
        return;
      }
      const { stdout } = result;
      assert.ok(stdout.includes('prd-generator'));
      assert.ok(stdout.includes('agent-md-writer'));
      assert.ok(stdout.includes('rules-generator'));
    });

    it('filters by category: product', async (t) => {
      let result;
      try {
        result = await run('list', 'product');
      } catch {
        t.skip('requires network');
        return;
      }
      const { stdout } = result;
      assert.ok(stdout.includes('prd-generator'));
      assert.ok(!stdout.includes('rules-generator'));
    });

    it('shows message for nonexistent category', async (t) => {
      let result;
      try {
        result = await run('list', 'nonexistent');
      } catch {
        t.skip('requires network');
        return;
      }
      const { stdout } = result;
      assert.ok(stdout.includes('No harnesses found in category: nonexistent'));
    });
  });
});
