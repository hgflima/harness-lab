// Fetch and parse catalog.json from GitHub

const REPO_BASE = 'https://raw.githubusercontent.com/hgflima/harness-lab/main';

export async function fetchCatalog() {
  const res = await fetch(`${REPO_BASE}/catalog.json`);
  if (!res.ok) throw new Error(`Failed to fetch catalog: ${res.status}`);
  return res.json();
}

export async function fetchHarnessJson(harnessPath) {
  const res = await fetch(`${REPO_BASE}/${harnessPath}/harness.json`);
  if (!res.ok) throw new Error(`Failed to fetch harness.json: ${res.status}`);
  return res.json();
}

export function getRepoBase() {
  return REPO_BASE;
}
