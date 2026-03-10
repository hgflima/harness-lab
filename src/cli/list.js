import { fetchCatalog } from '../core/catalog.js';

export async function list(args) {
  const category = args[0];
  const catalog = await fetchCatalog();

  let harnesses = catalog.harnesses;
  if (category) {
    harnesses = harnesses.filter((h) => h.categories.includes(category));
    if (harnesses.length === 0) {
      console.log(`\n  No harnesses found in category: ${category}\n`);
      return;
    }
  }

  console.log('\n  Available harnesses:\n');
  for (const h of harnesses) {
    const cats = h.categories.join(', ');
    console.log(`    ${h.name.padEnd(25)} v${h.version}  [${cats}]`);
    console.log(`    ${''.padEnd(25)} ${h.description}`);
    console.log();
  }
}
