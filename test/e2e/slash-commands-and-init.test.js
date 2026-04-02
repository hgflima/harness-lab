import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const TEMPLATES_DIR = join(ROOT, 'templates', 'slash-commands', 'harness-lab');

describe('slash command templates (E2E-009)', () => {
  const expectedFiles = ['categories.md', 'list.md', 'install.md', 'uninstall.md', 'update.md'];

  it('all 5 template files exist', async () => {
    const files = await readdir(TEMPLATES_DIR);
    for (const f of expectedFiles) {
      assert.ok(files.includes(f), `Missing template: ${f}`);
    }
  });

  it('install.md references "harness-lab install"', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'install.md'), 'utf-8');
    assert.ok(content.includes('harness-lab install'));
  });

  it('uninstall.md references "harness-lab uninstall"', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'uninstall.md'), 'utf-8');
    assert.ok(content.includes('harness-lab uninstall'));
  });

  it('list.md references "harness-lab list"', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'list.md'), 'utf-8');
    assert.ok(content.includes('harness-lab list'));
  });

  it('list.md uses conditional blocks for optional category argument', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'list.md'), 'utf-8');
    assert.ok(
      content.includes('harness-lab list\n'),
      'list.md must include a bare "harness-lab list" block without arguments'
    );
  });

  it('categories.md references "harness-lab categories"', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'categories.md'), 'utf-8');
    assert.ok(content.includes('harness-lab categories'));
  });

  it('update.md references "harness-lab update"', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'update.md'), 'utf-8');
    assert.ok(content.includes('harness-lab update'));
  });
});

describe('init slash-command copy logic (E2E-001, E2E-002)', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'harness-lab-init-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('copies all 5 .md templates to commands/harness-lab/', async () => {
    // Simulate the file-copy portion of init (skip npm install -g)
    const destDir = join(tempDir, '.claude', 'commands', 'harness-lab');
    await mkdir(destDir, { recursive: true });

    const srcDir = TEMPLATES_DIR;
    const srcFiles = await readdir(srcDir);

    for (const file of srcFiles) {
      if (!file.endsWith('.md')) continue;
      const content = await readFile(join(srcDir, file), 'utf-8');
      await writeFile(join(destDir, file), content, 'utf-8');
    }

    const destFiles = await readdir(destDir);
    assert.equal(destFiles.length, 5);
    assert.ok(destFiles.includes('install.md'));
    assert.ok(destFiles.includes('uninstall.md'));
    assert.ok(destFiles.includes('list.md'));
    assert.ok(destFiles.includes('categories.md'));
    assert.ok(destFiles.includes('update.md'));
  });

  it('copied files have the same content as templates', async () => {
    const destDir = join(tempDir, '.claude', 'commands', 'harness-lab');
    await mkdir(destDir, { recursive: true });

    const srcDir = TEMPLATES_DIR;
    const file = 'install.md';
    const srcContent = await readFile(join(srcDir, file), 'utf-8');
    await writeFile(join(destDir, file), srcContent, 'utf-8');

    const destContent = await readFile(join(destDir, file), 'utf-8');
    assert.equal(destContent, srcContent);
  });
});
