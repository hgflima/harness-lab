# Technical Architecture

## Technology Stack

### Runtime

| Technology | Version | Purpose | Justification |
|-----------|---------|---------|---------------|
| Node.js | >= 18.0.0 | CLI runtime | Native fetch API, ESM support, wide adoption |
| npm | >= 8 | Distribution | `npx` for zero-install bootstrapping, `npm install -g` for persistence |

**Key Libraries:** None. Zero external dependencies — uses only Node.js built-in modules:
- `node:fs/promises` — File operations
- `node:path` — Path resolution
- `node:os` — Home directory for global scope
- `node:util` — Argument parsing
- `node:child_process` — Running `npm install -g` during init
- `node:readline` — Interactive prompts during init
- `node:url` — `import.meta.url` resolution

### Data Source

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| GitHub Raw (raw.githubusercontent.com) | Fetch catalog.json, harness.json, individual files | Native fetch, no rate limit |
| GitHub REST API (api.github.com) | List directory contents for recursive artifact download | Native fetch, 60 req/hour unauthenticated |

---

## System Architecture

### High-Level Architecture

```
User (Terminal / Claude Code)
    │
    ├── Terminal: harness-lab <command> <args>
    │       │
    │       └── bin/cli.js → src/cli/<command>.js → src/core/<module>.js
    │
    └── Claude Code: /harness-lab:<command> <args>
            │
            └── .claude/commands/harness-lab/<command>.md
                    │
                    └── Instructs Claude to run: harness-lab <command> <args>
                            │
                            └── bin/cli.js → (same path as terminal)
```

**Architecture Pattern:** Layered CLI

**Key Layers:**

1. **bin/cli.js** — Entry point. Parses command name, delegates to handler
2. **src/cli/*.js** — Command handlers. Parse args, call core, format output for terminal
3. **src/core/*.js** — Business logic. Fetch catalog, resolve scopes, install/uninstall artifacts
4. **src/setup/init.js** — One-time bootstrap. Installs CLI globally, copies slash commands

### Data Flow

```
Command → Parse args → Fetch catalog.json (GitHub Raw)
    → Resolve harness entry → Fetch harness.json (GitHub Raw)
    → For each artifact type:
        → List directory (GitHub API) → Download files (GitHub Raw)
        → Write to target scope (.claude/)
```

---

## CLI Command Map

| Command | Entry Point | Core Modules Used | GitHub Calls |
|---------|------------|------------------|-------------|
| `init` | src/setup/init.js | scope.js | 0 (local only) |
| `categories` | src/cli/categories.js | catalog.js | 1 (catalog.json) |
| `list` | src/cli/list.js | catalog.js | 1 (catalog.json) |
| `install` | src/cli/install.js | catalog.js, installer.js, scope.js | 1 (catalog) + 1 (harness.json) + N (directory listings) + M (file downloads) |
| `uninstall` | src/cli/uninstall.js | catalog.js, installer.js, scope.js | 1 (catalog) + 1 (harness.json) |
| `update` | src/cli/update.js | catalog.js, installer.js, scope.js | Same as install × number of harnesses |

---

## File System Targets

### Scope Resolution

| Scope | Target Base Path | Example Skill Path |
|-------|-----------------|-------------------|
| global | `~/.claude/` | `~/.claude/skills/prd-generator/SKILL.md` |
| project | `<cwd>/.claude/` | `.claude/skills/prd-generator/SKILL.md` |
| local | `<cwd>/.claude/local/` | `.claude/local/skills/prd-generator/SKILL.md` |

### Artifact Type Mapping

| Artifact Type | Source in Repo | Target in .claude/ |
|--------------|---------------|-------------------|
| skills | `harnesses/<name>/skills/<skill-name>/` | `<scope>/skills/<skill-name>/` |
| commands | `harnesses/<name>/commands/<cmd>.md` | `<scope>/commands/<cmd>.md` |
| agents | `harnesses/<name>/agents/<agent>.md` | `<scope>/agents/<agent>.md` |
| hooks | `harnesses/<name>/hooks/<hook>.md` | `<scope>/hooks/<hook>.md` |

---

## Data Models

### catalog.json

```json
{
  "version": "string (semver)",
  "categories": [
    {
      "id": "string (kebab-case)",
      "name": "string (display name)",
      "description": "string"
    }
  ],
  "harnesses": [
    {
      "name": "string (kebab-case, unique)",
      "version": "string (semver)",
      "description": "string",
      "categories": ["string (category id)"],
      "author": "string",
      "path": "string (relative path in repo)"
    }
  ]
}
```

### harness.json

```json
{
  "name": "string (matches catalog entry)",
  "version": "string (semver)",
  "description": "string",
  "categories": ["string"],
  "author": "string",
  "artifacts": {
    "skills": ["string (skill directory name)"],
    "commands": ["string (command file name without .md)"],
    "agents": ["string (agent file name without .md)"],
    "hooks": ["string (hook file name without .md)"]
  }
}
```

---

## Error Handling Strategy

| Error | Source | User-Facing Message | Recovery |
|-------|--------|-------------------|----------|
| Network failure | fetch() rejects | "Failed to fetch catalog. Check your internet connection." | Retry command |
| GitHub API rate limit | 403 response | "GitHub API rate limit exceeded. Wait a few minutes and try again." | Wait or use GitHub token |
| Harness not found | catalog lookup | "Harness not found: <name>. Run 'harness-lab list' to see available harnesses." | Correct the name |
| Invalid scope | parseScope() | "Invalid scope: <scope>. Use: global, project, or local" | Use valid scope |
| Permission denied | fs.writeFile() | "Permission denied writing to <path>. Try running with sudo for global scope." | Use sudo or different scope |
| npm install -g fails | execSync() | "Failed to install globally. You may need to run with sudo." | Run with sudo |

---

## Distribution

### npx Flow

```
npx github:hgflima/harness-lab@latest
    │
    ├── npm clones repo as temporary package
    ├── Runs bin/cli.js with args: ["init"]
    │   ├── Runs npm install -g <package-path>
    │   ├── Prompts for scope
    │   └── Copies templates/slash-commands/*.md to <scope>/commands/
    └── Cleanup: npm removes temporary package
```

### Package Distribution

- **Primary:** `npx github:hgflima/harness-lab@latest` — fetches from GitHub directly
- **Optional future:** Publish to npm registry as `harness-lab` for `npx harness-lab@latest`
