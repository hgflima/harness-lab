# harness.json Contract

`harness.json` lives at the root of each harness directory (`harnesses/<name>/harness.json`). It is the manifest that the installer reads to know which artifacts to copy and the uninstaller reads to know what to remove.

## Schema

```json
{
  "name": "<slug>",
  "version": "<semver>",
  "description": "<one-line description>",
  "categories": ["<category-id>", ...],
  "author": "<github-username>",
  "artifacts": {
    "skills": ["<skill-slug>", ...],
    "commands": ["<command-slug>", ...],
    "agents": ["<agent-slug>", ...],
    "hooks": ["<hook-slug>", ...]
  }
}
```

## Field Rules

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Lowercase slug. MUST match the parent directory name under `harnesses/`. |
| `version` | string (semver) | yes | MUST match the corresponding entry in `catalog.json`. |
| `description` | string | yes | Full description of the harness. Can be longer than the `catalog.json` summary. |
| `categories` | string[] | yes | Zero or more category slugs. These are local tags and may differ from `catalog.json` categories. |
| `author` | string | yes | GitHub username of the harness author. |
| `artifacts` | object | yes | Declares every installable artifact. All four keys MUST be present. |

### Artifacts Object

| Field | Type | Required | Notes |
|---|---|---|---|
| `artifacts.skills` | string[] | yes | Each entry maps to a directory at `skills/<slug>/` containing at minimum a `SKILL.md` file. |
| `artifacts.commands` | string[] | yes | Each entry maps to a file at `commands/<slug>.md`. |
| `artifacts.agents` | string[] | yes | Each entry maps to a file at `agents/<slug>.md`. |
| `artifacts.hooks` | string[] | yes | Each entry maps to a hook definition. |

All four arrays MUST exist even if empty (`[]`).

## Artifact Directory Conventions

### Skills (`skills/<slug>/`)
```
skills/<slug>/
├── SKILL.md              — Required. The skill prompt file.
├── references/           — Optional. Reference documents loaded by the skill.
├── scripts/              — Optional. Scripts invoked by the skill.
└── evals/                — Optional. Eval definitions (evals.json + fixtures).
```

### Commands (`commands/<slug>.md`)
A single Markdown file per command. The file name (without `.md`) is the command slug.

### Agents (`agents/<slug>.md`)
A single Markdown file per agent. The file name (without `.md`) is the agent slug.

### Hooks
Hook artifacts follow the convention defined by the harness author.

## Invariants

1. `name` MUST equal the directory name: `harnesses/<name>/harness.json`.
2. Every slug in `artifacts.skills` MUST have a corresponding `skills/<slug>/SKILL.md` file.
3. Every slug in `artifacts.commands` MUST have a corresponding `commands/<slug>.md` file.
4. Every slug in `artifacts.agents` MUST have a corresponding `agents/<slug>.md` file.
5. If an artifact file exists on disk but is NOT listed in `artifacts`, the installer will NOT copy it. The `artifacts` object is the authoritative list.
6. `version` in `harness.json` and `catalog.json` MUST stay in sync for the same harness.
