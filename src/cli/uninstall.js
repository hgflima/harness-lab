import { fetchCatalog } from '../core/catalog.js';
import { uninstallHarness } from '../core/installer.js';
import { parseScope } from '../core/scope.js';

export async function uninstall(args) {
  const name = args.find((a) => !a.startsWith('--'));
  if (!name) {
    throw new Error('Usage: harness-lab uninstall <harness-name> [--scope global|project|local]');
  }

  const scope = parseScope(args);
  const catalog = await fetchCatalog();
  const entry = catalog.harnesses.find((h) => h.name === name);

  if (!entry) {
    throw new Error(`Harness not found: ${name}. Run "harness-lab list" to see available harnesses.`);
  }

  console.log(`\n  Uninstalling ${name} (scope: ${scope})...\n`);

  const removed = await uninstallHarness(name, entry.path, scope);

  for (const item of removed) {
    console.log(`    ✓ Removed ${item}`);
  }

  console.log(`\n  Done.\n`);
}
