import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { fetchCatalog, fetchHarnessJson, getRepoBase } from '../../src/core/catalog.js';

describe('catalog', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('fetchCatalog', () => {
    it('returns parsed JSON on success', async () => {
      const mockData = { categories: [], harnesses: [] };
      globalThis.fetch = async (url) => {
        assert.ok(url.endsWith('/catalog.json'));
        return { ok: true, json: async () => mockData };
      };
      const result = await fetchCatalog();
      assert.deepEqual(result, mockData);
    });

    it('throws on non-200 response', async () => {
      globalThis.fetch = async () => ({ ok: false, status: 500 });
      await assert.rejects(fetchCatalog(), { message: /Failed to fetch catalog: 500/ });
    });
  });

  describe('fetchHarnessJson', () => {
    it('constructs correct URL and returns JSON', async () => {
      const mockHarness = { name: 'test', artifacts: {} };
      globalThis.fetch = async (url) => {
        assert.ok(url.includes('harnesses/test/harness.json'));
        return { ok: true, json: async () => mockHarness };
      };
      const result = await fetchHarnessJson('harnesses/test');
      assert.deepEqual(result, mockHarness);
    });

    it('throws on failure', async () => {
      globalThis.fetch = async () => ({ ok: false, status: 404 });
      await assert.rejects(fetchHarnessJson('harnesses/missing'), {
        message: /Failed to fetch harness\.json: 404/,
      });
    });
  });

  describe('getRepoBase', () => {
    it('returns the GitHub raw base URL', () => {
      const base = getRepoBase();
      assert.ok(base.includes('raw.githubusercontent.com'));
      assert.ok(base.includes('harness-lab'));
    });
  });
});
