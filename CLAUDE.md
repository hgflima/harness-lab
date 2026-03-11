# harness-lab

Curated public registry of AI agent harnesses (skills, commands, agents, hooks) for Claude Code. Includes a Node.js CLI for browsing, installing, and managing harnesses from GitHub into `.claude/` directories. Distributed via `npx github:hgflima/harness-lab@latest`.

## Tech Stack

- **Language:** JavaScript (ESM, Node.js >= 18)
- **Dependencies:** Zero — uses only Node.js built-ins (`node:fs/promises`, `node:path`, `node:os`, `node:readline`, `node:child_process`)
- **Data source:** GitHub Raw (`raw.githubusercontent.com`) for files, GitHub REST API (`api.github.com`) for directory listings
- **Distribution:** npm (`npx` for bootstrap, `npm install -g` for persistence)

## Project Structure

```
harness-lab/
├── bin/cli.js                  — CLI entry point (shebang, command router)
├── src/
│   ├── core/                   — Business logic (shared by CLI + slash commands)
│   │   ├── catalog.js          — Fetch catalog.json and harness.json from GitHub
│   │   ├── installer.js        — Download artifacts to .claude/, remove on uninstall
│   │   └── scope.js            — Resolve target path (global/project/local)
│   ├── cli/                    — Command handlers (parse args, call core, format output)
│   │   ├── categories.js, list.js, install.js, uninstall.js, update.js
│   └── setup/
│       └── init.js             — npx bootstrap (npm install -g + copy slash commands)
├── templates/slash-commands/
│   └── harness-lab/           — 5 .md files → .claude/commands/harness-lab/ (/harness-lab:*)
├── harnesses/                  — The curated harness collection
│   └── <name>/
│       ├── harness.json        — Metadata: name, version, categories, artifact list
│       └── skills/<name>/      — Skill files (SKILL.md, references/, scripts/, evals/)
│       └── commands/<name>.md  — Slash commands files (<name>.md, references, scripts, etc)
│       └── agents/<name>.md    — Subagent files (<name>.md, references, scripts, etc)
│       └── rules/<name>.md     — Rule files (<name>.md, references, scripts, etc)
│       └── hooks/              — Hook scripts and config (hooks.json, *.sh)
└── catalog.json                — Registry index (categories + harness entries)
```

## Development

```bash
# Test CLI locally (from repo root)
node bin/cli.js --help
node bin/cli.js categories
node bin/cli.js list product
node bin/cli.js install prd-generator --scope project

# Test npx flow (simulates what users run)
npm install -g .
harness-lab --help
```

No build step. No transpilation. Edit and run.

## Key Conventions

- **Zero dependencies.** Never add external npm packages. Everything uses Node.js built-ins. `fetch` is native since Node 18.
- **ESM only.** All files use `import`/`export`. Package has `"type": "module"`.
- **Layered architecture.** `src/core/` holds pure logic; `src/cli/` handles terminal I/O. Slash commands delegate to CLI, CLI delegates to core. Never put business logic in cli/ or bin/.
- **Always fetch from GitHub.** No local cache, no offline mode. Every operation hits the remote catalog.
- **catalog.json is the source of truth.** Must stay in sync with `harnesses/` directory. When adding a harness, update both.
- **harness.json lists all artifacts explicitly.** The uninstaller reads this to know what to remove. If an artifact isn't listed, it won't be installed or uninstalled.
- **Three scopes:** `global` (~/.claude/), `project` (<cwd>/.claude/), `local` (<cwd>/.claude/local/). Default is `project`.
- **All code and docs in English.** Even though the author writes in Portuguese, all code, comments, docs, and PRD output are in English for token economy and universal parseability.

## Rules Reference

- [catalog.json contract](.claude/rules/catalog-json-contract.md) — JSON schema and invariants for the root `catalog.json` registry file.
- [harness.json contract](.claude/rules/harness-json-contract.md) — JSON schema and invariants for `harnesses/<name>/harness.json` manifest files.
