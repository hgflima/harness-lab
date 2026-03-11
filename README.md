<div align="center">

# harness-lab

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen)](https://github.com/hgflima/harness-lab)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude-Code-blueviolet?logo=anthropic&logoColor=white)](https://claude.com/claude-code)

**Curated public registry of AI agent harnesses for Claude Code**

[Install](#getting-started) · [Report Bug](https://github.com/hgflima/harness-lab/issues) · [Request Feature](https://github.com/hgflima/harness-lab/issues)

</div>

## Screenshot

<!-- Add a screenshot of your app here -->
<!-- ![Screenshot](screenshot.png) -->

## About

harness-lab is a curated public registry of AI agent harnesses (skills, commands, agents, hooks) for Claude Code. It includes a zero-dependency Node.js CLI for browsing, installing, and managing harnesses from GitHub directly into `.claude/` directories.

- Browse harnesses by category (Product, Software Engineering, Design, Harness Engineering)
- Install skills, commands, agents, and hooks with a single command
- Three installation scopes: global, project, or local
- Always fetches the latest versions from GitHub — no local cache

### Available Harnesses

| Harness | Description | Author |
|---------|-------------|--------|
| **prd-generator** | Context engineering PRD generator for AI-driven software development | hgflima |
| **agent-md-writer** | Generate and maintain high-quality CLAUDE.md and AGENT.md files | hgflima |
| **rules-generator** | Analyze a project's stack and generate tailored .claude/rules/ files | hgflima |
| **github-readme-writer** | Generate comprehensive, professional README.md files for any project | alfredang |

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | JavaScript (ESM) |
| Runtime | Node.js >= 18 |
| Dependencies | Zero — Node.js built-ins only |
| Data Source | GitHub Raw + GitHub REST API |
| Distribution | npm / npx |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   User Layer                     │
│                                                  │
│   npx harness-lab          /harness-lab:install  │
│   (Terminal CLI)           (Slash Commands)       │
└────────────┬──────────────────────┬──────────────┘
             │                      │
             ▼                      ▼
┌─────────────────────────────────────────────────┐
│                 CLI Layer (src/cli/)              │
│                                                  │
│   categories · list · install · uninstall · update│
└────────────────────────┬────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│               Core Layer (src/core/)             │
│                                                  │
│   catalog.js     installer.js     scope.js       │
│   (fetch index)  (download/remove) (resolve path)│
└────────────────────────┬────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│              GitHub (Remote Data)                 │
│                                                  │
│   raw.githubusercontent.com   api.github.com     │
│   (catalog.json, artifacts)   (directory listings)│
└─────────────────────────────────────────────────┘
```

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
│   └── harness-lab/            — 5 .md files → .claude/commands/harness-lab/
├── harnesses/                  — The curated harness collection
│   └── <name>/
│       ├── harness.json        — Metadata: name, version, categories, artifact list
│       ├── skills/             — Skill files (SKILL.md, prompt.md, references/, scripts/)
│       ├── commands/           — Slash command files (<name>.md)
│       ├── agents/             — Subagent files (<name>.md)
│       ├── rules/              — Rule files (<name>.md)
│       └── hooks/              — Hook scripts and config
├── catalog.json                — Registry index (categories + harness entries)
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0

### Quick Install (via npx)

```bash
npx github:hgflima/harness-lab@latest
```

This bootstraps the CLI by installing it globally and copying slash commands to your project.

### Manual Install

```bash
# Clone the repository
git clone https://github.com/hgflima/harness-lab.git
cd harness-lab

# Install globally
npm install -g .
```

### Usage

```bash
# List all categories
harness-lab categories

# List harnesses in a category
harness-lab list software-engineering

# Install a harness into your project
harness-lab install prd-generator --scope project

# Uninstall a harness
harness-lab uninstall prd-generator

# Update a harness (or all harnesses)
harness-lab update
harness-lab update prd-generator
```

### Using with Claude Code Slash Commands

After running `harness-lab init`, you get slash commands inside Claude Code:

```
/harness-lab:categories     — List available categories
/harness-lab:list           — List harnesses
/harness-lab:install        — Install a harness
/harness-lab:uninstall      — Uninstall a harness
/harness-lab:update         — Update harnesses
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a Pull Request

For questions and discussions, visit [GitHub Issues](https://github.com/hgflima/harness-lab/issues).

## Developed By

[hgflima](https://github.com/hgflima)

## Acknowledgements

- [Anthropic](https://www.anthropic.com/) for Claude Code
- [alfredang](https://github.com/alfredang) for the github-readme-writer harness
- All contributors who submit harnesses to the registry

---

<div align="center">

If you find this useful, please give it a star!

</div>
