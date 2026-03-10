# PRD: harness-lab CLI - Curated AI Agent Harness Registry & Installer

**Created:** 2026-03-10
**Last Updated:** 2026-03-10
**Status:** 🔄 In Progress

---

## Git Strategy

**Approach:** Single branch (solo developer)

---

## Quick Navigation

### Requirements Documentation

1. [**Overview & Goals**](requirements/01-overview-and-goals.md)
   - Product vision, objectives, success metrics, scope

2. [**User Stories**](requirements/02-user-stories.md)
   - End-user personas, stories with acceptance criteria

3. [**Technical Architecture**](requirements/03-technical-architecture.md)
   - Technology stack, system design, CLI structure, GitHub API integration

4. [**Security & Performance**](requirements/04-security-and-performance.md)
   - Rate limiting, error handling, performance targets

5. [**E2E Test Specifications**](requirements/05-e2e-test-specs.md)
   - Story-to-test traceability matrix, test execution strategy

### Task Assignments

1. [**Task Breakdown**](task_assignments/01-task-breakdown.md)
   - Agent-assignable tasks by epic, complexity estimates

2. [**Dependencies & Critical Path**](task_assignments/02-dependencies-critical-path.md)
   - Dependency mapping, critical path, interface contracts

3. [**Timeline Estimates**](task_assignments/03-timeline-estimates.md)
   - Execution batches, milestones, go-live checklist

---

## Feature Summary

harness-lab CLI is a Node.js command-line tool and slash command interface for browsing, installing, updating, and uninstalling curated AI agent harnesses (skills, commands, agents, hooks) from a public GitHub repository into Claude Code's `.claude/` directory structure.

### Core Capabilities

1. **Registry Browsing** - List categories and harnesses from the remote catalog
2. **Harness Installation** - Fetch and install harness artifacts to global/project/local scope
3. **Harness Management** - Uninstall, update individual or all harnesses
4. **Dual Interface** - CLI terminal commands and Claude Code slash commands (slash commands delegate to CLI)
5. **Initial Setup** - `npx` bootstrap that installs CLI globally and deploys slash commands

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js >= 18 | CLI execution, native fetch API |
| Package | npm (ESM modules) | Distribution via npx/npm install -g |
| Data Source | GitHub Raw + API | Fetch catalog.json, harness.json, artifact files |
| Target | Claude Code .claude/ | Installation destination for skills/commands/agents/hooks |

---

## Execution Status

*Updated by: developer*

| Phase | Status | Progress |
|-------|--------|----------|
| Requirements & PRD | 🔄 In Progress | 80% |
| Scaffold (existing) | ✅ Complete | 100% |
| Core Implementation | ⏳ Planning | 0% |
| Testing | ⏳ Planning | 0% |
| Documentation | ⏳ Planning | 0% |

### Documentation Statistics

- **Total Documents:** 8 files
- **Total Tasks Defined:** 18 tasks in 4 epics
- **E2E Tests:** 12 test specs mapped to 10 user stories
- **CLI Commands:** 6 (init, categories, list, install, uninstall, update)

---

## Document History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-03-10 | 0.1 | hgflima + Claude | Initial PRD from conversation design |
