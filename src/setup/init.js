// Initial setup: install CLI globally + copy slash commands to chosen scope

import { execSync } from 'node:child_process';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';
import { resolveTarget } from '../core/scope.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function init(_args) {
  console.log('\n  harness-lab v1.0.0\n');

  // Step 1: Install CLI globally
  console.log('  1. Installing CLI globally...');
  try {
    execSync(`npm install -g harness-lab`, { stdio: 'pipe' });
    console.log('     ✓ harness-lab command available\n');
  } catch (err) {
    console.error('     ✗ Failed to install globally. You may need to run with sudo.');
    console.error(`       ${err.message}\n`);
    return;
  }

  // Step 2: Ask scope for slash commands
  console.log('  2. Where should I install the slash commands?\n');
  console.log('     1) global  (~/.claude/commands/harness-lab/)');
  console.log('     2) project (.claude/commands/harness-lab/)');
  console.log('     3) local   (.claude/local/commands/harness-lab/)\n');

  const choice = await prompt('     Choose (1-3): ');
  const scopeMap = { '1': 'global', '2': 'project', '3': 'local' };
  const scope = scopeMap[choice] || 'project';

  // Step 3: Copy slash commands (templates/slash-commands/harness-lab/ → commands/harness-lab/)
  const target = resolveTarget(scope);
  const destDir = join(target, 'commands', 'harness-lab');
  await mkdir(destDir, { recursive: true });

  const srcDir = join(__dirname, '..', '..', 'templates', 'slash-commands', 'harness-lab');
  const files = await readdir(srcDir);
  let count = 0;

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const content = await readFile(join(srcDir, file), 'utf-8');
    await writeFile(join(destDir, file), content, 'utf-8');
    const cmdName = file.replace('.md', '');
    console.log(`     ✓ /harness-lab:${cmdName}`);
    count++;
  }

  console.log(`\n  ✓ Installed ${count} slash commands (${scope})`);
  console.log('\n  Try: harness-lab categories');
  console.log('  Or in Claude Code: /harness-lab:categories\n');
}
