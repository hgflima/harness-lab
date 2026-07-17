import { fetchCatalog } from '../core/catalog.js';
import { uninstallHarness, installHarness, downloadRepoSnapshot } from '../core/installer.js';
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

  // One repo snapshot shared by all installs, instead of one download per harness
  const snapshot = await downloadRepoSnapshot();
  try {
    for (const entry of targets) {
      console.log(`  ${entry.name} v${entry.version}`);

      await uninstallHarness(entry.name, entry.path, scope);
      const installed = await installHarness(entry.name, entry.path, scope, snapshot.dir);

      for (const item of installed) {
        console.log(`    ✓ ${item}`);
      }
      console.log();
    }
  } finally {
    await snapshot.cleanup();
  }

  console.log('  Done.\n');
}
