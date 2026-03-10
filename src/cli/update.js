import { fetchCatalog } from '../core/catalog.js';
import { uninstallHarness, installHarness } from '../core/installer.js';
import { parseScope } from '../core/scope.js';

export async function update(args) {
  const name = args.find((a) => !a.startsWith('--'));
  const scope = parseScope(args);
  const catalog = await fetchCatalog();

  const targets = name
    ? catalog.harnesses.filter((h) => h.name === name)
    : catalog.harnesses;

  if (targets.length === 0) {
    throw new Error(name
      ? `Harness not found: ${name}`
      : 'No harnesses in catalog.');
  }

  console.log(`\n  Updating ${targets.length} harness(es) (scope: ${scope})...\n`);

  for (const entry of targets) {
    console.log(`  ${entry.name} v${entry.version}`);

    await uninstallHarness(entry.name, entry.path, scope);
    const installed = await installHarness(entry.name, entry.path, scope);

    for (const item of installed) {
      console.log(`    ✓ ${item}`);
    }
    console.log();
  }

  console.log('  Done.\n');
}
