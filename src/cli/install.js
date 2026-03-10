import { fetchCatalog } from '../core/catalog.js';
import { installHarness } from '../core/installer.js';
import { parseScope } from '../core/scope.js';

export async function install(args) {
  const name = args.find((a) => !a.startsWith('--'));
  if (!name) {
    throw new Error('Usage: harness-lab install <harness-name> [--scope global|project|local]');
  }

  const scope = parseScope(args);
  const catalog = await fetchCatalog();
  const entry = catalog.harnesses.find((h) => h.name === name);

  if (!entry) {
    throw new Error(`Harness not found: ${name}. Run "harness-lab list" to see available harnesses.`);
  }

  console.log(`\n  Installing ${name} v${entry.version} (scope: ${scope})...\n`);

  const installed = await installHarness(name, entry.path, scope);

  for (const item of installed) {
    console.log(`    ✓ Installed ${item}`);
  }

  console.log(`\n  Done. Installed to scope: ${scope}\n`);
}
