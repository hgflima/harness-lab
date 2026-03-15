# Harness Lifecycle

This rule describes how harnesses are created from scratch, added to the registry, and imported from external GitHub repositories. Every path leads to the same end state: a fully registered harness with all required files and references in sync.

## The Three Paths

### Path 1: Create a new harness from scratch

When building a new harness inside this repo (e.g. a new skill, command, or agent):

1. **Create the artifact files** under `harnesses/<name>/`:
   - Skills go in `skills/<slug>/SKILL.md` (with optional `references/`, `scripts/`, `evals/`)
   - Commands go in `commands/<slug>.md`
   - Agents go in `agents/<slug>.md`
   - Hooks go in `hooks/`

2. **Create `harnesses/<name>/harness.json`** — the manifest that tells the installer what to copy. Must declare every artifact explicitly in the `artifacts` object. See [harness.json contract](harness-json-contract.md) for the full schema.

3. **Add an entry to `catalog.json`** — the root registry index. Version, name, and categories must match `harness.json`. See [catalog.json contract](catalog-json-contract.md) for the full schema.

4. **Add a row to `README.md`** — in the "Available Harnesses" table with name, description, and author.

All four steps are required. A harness is not available to users until all four are complete.

### Path 2: Import from an external GitHub repository (`/hlab:import`)

The `/hlab:import` slash command automates most of the lifecycle. Given a GitHub URL, it:

1. Clones the repo (shallow, single branch)
2. Detects artifact types (harness.json, SKILL.md, commands/, agents/, rules/)
3. Copies artifacts into `harnesses/<name>/`
4. Generates `harness.json` if the source didn't have one
5. Updates `catalog.json` with the new entry
6. Updates `README.md` with a new table row
7. Cleans up the temp clone

After import, review the generated files — especially `harness.json` categories and description — and adjust as needed.

### Path 3: Add a harness manually from external source

Same as Path 1, but the artifact files are copied or adapted from an external source rather than written from scratch. The registration steps (harness.json, catalog.json, README.md) are identical.

## Checklist

Every harness in the registry MUST have all of the following. If any is missing, the harness is incomplete:

| # | File / Entry | Purpose |
|---|---|---|
| 1 | `harnesses/<name>/` directory | Contains all artifact files |
| 2 | `harnesses/<name>/harness.json` | Manifest listing all artifacts for install/uninstall |
| 3 | Entry in root `catalog.json` | Makes the harness discoverable via CLI and slash commands |
| 4 | Row in root `README.md` table | Makes the harness visible to humans browsing the repo |

## Sync Invariants

These values must stay in sync across files:

| Value | `harness.json` | `catalog.json` | Directory |
|---|---|---|---|
| Name | `name` field | `harnesses[].name` | `harnesses/<name>/` dirname |
| Version | `version` field | `harnesses[].version` | — |
| Categories | `categories` array | `harnesses[].categories` | — |
| Artifacts | `artifacts` object | — | Actual files on disk |

If you change any of these values, update all locations. The contracts ([harness.json](harness-json-contract.md), [catalog.json](catalog-json-contract.md)) define the full schemas and field rules.

## Common Mistakes

- **Forgetting `harness.json`** — The skill/command works locally but users can't install it because the installer doesn't know what to copy.
- **Forgetting `catalog.json` entry** — The harness exists on disk but `harness-lab list` doesn't show it.
- **Forgetting `README.md` row** — Users browsing the repo on GitHub don't know the harness exists.
- **Version mismatch** — `harness.json` says `1.0.0` but `catalog.json` says `1.1.0`. The installer may behave unexpectedly.
- **Artifact not listed in `harness.json`** — The file exists on disk but the installer ignores it. Always declare every artifact explicitly.
