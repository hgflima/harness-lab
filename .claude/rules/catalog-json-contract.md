# catalog.json Contract

`catalog.json` is the source of truth for the harness registry. It lives at the repository root and MUST follow this exact JSON schema.

## Schema

```json
{
  "version": "<semver>",
  "categories": [
    {
      "id": "<slug>",
      "name": "<Display Name>",
      "description": "<one-line description>"
    }
  ],
  "harnesses": [
    {
      "name": "<slug>",
      "version": "<semver>",
      "description": "<one-line description>",
      "categories": ["<category-id>", ...],
      "author": "<github-username>",
      "repository_url": "<full GitHub URL to the harness directory>",
      "path": "harnesses/<name>"
    }
  ]
}
```

## Field Rules

### Root
| Field | Type | Required | Notes |
|---|---|---|---|
| `version` | string (semver) | yes | Registry schema version |
| `categories` | array | yes | At least one category |
| `harnesses` | array | yes | Can be empty |

### Category Object
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Lowercase slug, used as reference key (e.g. `"product"`, `"software-engineering"`) |
| `name` | string | yes | Human-readable display name |
| `description` | string | yes | One sentence describing the category |

### Harness Object
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Lowercase slug matching the directory under `harnesses/` |
| `version` | string (semver) | yes | Must match `harness.json` version inside the harness directory |
| `description` | string | yes | One sentence — same as or shorter than `harness.json` description |
| `categories` | string[] | yes | One or more `category.id` values from the `categories` array |
| `author` | string | yes | GitHub username of the harness author |
| `repository_url` | string | yes | Full GitHub URL pointing to the harness source directory |
| `path` | string | yes | Relative path from repo root (always `harnesses/<name>`) |

## Invariants

1. Every `harness.categories` entry MUST reference an existing `categories[].id`.
2. Every `harness.name` MUST have a corresponding directory at `harnesses/<name>/` containing a valid `harness.json`.
3. `harness.path` MUST equal `"harnesses/<harness.name>"`.
4. No duplicate `name` values in `harnesses` array.
5. No duplicate `id` values in `categories` array.
6. When adding or removing a harness, ALWAYS update both `catalog.json` and the `harnesses/` directory.
