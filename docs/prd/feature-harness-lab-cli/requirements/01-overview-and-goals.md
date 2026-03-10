# Overview & Goals

## Executive Summary

harness-lab CLI is a distribution tool for a curated public collection of AI agent harnesses. It allows developers to browse, install, update, and uninstall harnesses (skills, commands, agents, hooks) directly into their Claude Code `.claude/` directory, with support for three installation scopes: global, project, and local.

The tool addresses the poor developer experience of Claude Code's plugin system by providing a lightweight, friction-free alternative: a simple CLI that does exactly one thing well — moves curated harness artifacts from a GitHub repository to the right place on your machine.

## Product Vision

### Problem Statement

Claude Code's plugin system is cumbersome to install, hard to discover what's inside, and unpleasant to uninstall. Developers who maintain curated collections of AI agent artifacts (skills, commands, agents, hooks) need a better way to share and distribute them. There is no simple `npm install`-like experience for Claude Code harnesses.

### Solution Overview

A CLI tool (`harness-lab`) distributed via `npx` that:
1. Installs itself globally and deploys slash commands to the user's chosen scope
2. Fetches a catalog of available harnesses from GitHub
3. Installs harness artifacts by copying them to `.claude/skills/`, `.claude/commands/`, etc.
4. Provides both terminal and slash command interfaces that share the same core logic

### Target End-Users

- **Primary:** Developers using Claude Code who want pre-built, quality harnesses without the friction of plugins
- **Secondary:** The repository author (hgflima) who curates and maintains the harness collection

## Goals & Objectives

### Primary Goals

1. **Zero-friction installation:** `npx github:hgflima/harness-lab@latest` sets up everything in under 30 seconds
2. **Discoverability:** Users can browse categories and list harnesses with descriptions and versions
3. **Scope flexibility:** Install to global (~/.claude/), project (.claude/), or local (.claude/local/) scope

### Secondary Goals

1. **Slash command parity:** Every CLI command is available as a Claude Code slash command
2. **Clean uninstall:** Remove only the exact artifacts a harness installed, nothing more

## Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Current Baseline | Target | Measurement Method |
|--------|-----------------|--------|-------------------|
| Install time (npx → ready) | N/A | < 30s | Manual testing |
| Harness install time | N/A | < 5s | Manual testing |
| CLI commands working | 0 | 6/6 | Automated tests |

### Success Criteria

**Must Have (Launch Blockers):**
- [ ] `npx` installs CLI globally and deploys slash commands
- [ ] All 6 CLI commands work (init, categories, list, install, uninstall, update)
- [ ] Slash commands correctly delegate to CLI
- [ ] Three scopes work (global, project, local)
- [ ] Installed artifacts are in correct `.claude/` subdirectories

**Should Have (Post-Launch):**
- [ ] Helpful error messages for common failures (no internet, harness not found, permission denied)
- [ ] `--help` flag on every command

## Scope

### In Scope
- CLI with 6 commands (init, categories, list, install, uninstall, update)
- 5 slash command templates
- Fetch from GitHub (always remote, no local cache)
- Three installation scopes (global, project, local)
- Support for 4 artifact types (skills, commands, agents, hooks)

### Out of Scope
- Local/offline mode
- Harness authoring tools (creating new harnesses via CLI)
- Version pinning or lockfiles
- Dependency resolution between harnesses
- Web UI or dashboard
- Authentication (public repo only)

### Future Considerations
- `harness-lab publish` for community contributions
- Version conflict detection
- Harness dependencies (harness A requires harness B)

## Constraints

### Technical Constraints
- **Node.js >= 18 required:** Uses native `fetch` API (no external HTTP dependencies)
- **ESM only:** Package uses `"type": "module"` — no CommonJS
- **GitHub API rate limits:** 60 req/hour unauthenticated. Directory listings use the API; file downloads use raw.githubusercontent.com (no rate limit)
- **No build step:** Pure JavaScript, no TypeScript, no bundler

### Business Constraints
- **Solo developer:** hgflima maintains both the CLI and the harness catalog
- **Public repo:** No authentication, no private harnesses

## Assumptions

1. **Users have Node.js >= 18:** Required for native fetch and ESM support. Risk: older Node versions will fail with unclear errors
2. **Users have npm global install permissions:** `npm install -g` may require sudo on some systems. Risk: init fails without clear guidance
3. **GitHub is available:** All operations require internet. Risk: no offline fallback
4. **Claude Code .claude/ structure is stable:** We write directly to .claude/skills/, .claude/commands/, etc. Risk: Claude Code changes their directory structure

## Dependencies

### External
- **GitHub Raw Content:** For fetching catalog.json, harness.json, and artifact files. Owner: GitHub. Risk: Low (highly available)
- **GitHub REST API:** For listing directory contents during recursive artifact download. Owner: GitHub. Risk: Medium (rate limited at 60 req/hour for unauthenticated)

### Internal
- **catalog.json:** Must be kept in sync with harnesses/ directory. Owner: hgflima
- **harness.json per harness:** Must accurately list all artifacts. Owner: hgflima
