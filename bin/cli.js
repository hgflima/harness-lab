#!/usr/bin/env node

// harness-lab CLI
// Entry point for both terminal usage and slash command delegation

import { parseArgs } from 'node:util';
import { init } from '../src/setup/init.js';
import { categories } from '../src/cli/categories.js';
import { list } from '../src/cli/list.js';
import { install } from '../src/cli/install.js';
import { uninstall } from '../src/cli/uninstall.js';
import { update } from '../src/cli/update.js';

const COMMANDS = {
  init,
  categories,
  list,
  install,
  uninstall,
  update,
};

const command = process.argv[2];
const args = process.argv.slice(3);

if (!command || command === '--help' || command === '-h') {
  console.log(`
  harness-lab v1.0.0

  Usage:
    harness-lab init                    Install slash commands (global/project/local)
    harness-lab categories              List available categories
    harness-lab list [category]         List harnesses (optionally filtered by category)
    harness-lab install <name>          Install a harness
    harness-lab uninstall <name>        Uninstall a harness
    harness-lab update [name]           Update a harness (or all if no name)

  Options:
    --scope <global|project|local>      Installation scope (default: project)
    --help, -h                          Show this help
    --version, -v                       Show version
  `);
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  console.log('1.0.0');
  process.exit(0);
}

const handler = COMMANDS[command];

if (!handler) {
  console.error(`Unknown command: ${command}`);
  console.error('Run "harness-lab --help" for usage.');
  process.exit(1);
}

handler(args).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
