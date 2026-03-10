import { fetchCatalog } from '../core/catalog.js';

export async function categories(_args) {
  const catalog = await fetchCatalog();

  console.log('\n  Available categories:\n');
  for (const cat of catalog.categories) {
    console.log(`    ${cat.id.padEnd(25)} ${cat.description}`);
  }
  console.log();
}
