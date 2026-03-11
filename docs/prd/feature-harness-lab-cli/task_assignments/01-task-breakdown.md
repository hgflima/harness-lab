# Task Breakdown

## Summary

| Metric | Value |
|--------|-------|
| Total Epics | 4 |
| Total Tasks | 18 |
| Max Parallel Lanes | 2 |
| P0 Tasks | 12 |
| P1 Tasks | 6 |

### Agent Topology

| Agent Type | Count | Responsibilities |
|-----------|-------|-----------------|
| coder-agent | 1 | All implementation tasks |
| tester-agent | 1 | E2E test writing and execution |

---

## Epic 1: Core Infrastructure

**Goal:** Establish the foundational modules that all commands depend on
**Total:** 4 tasks

### Tasks

| ID | Task | Priority | Complexity | Dependencies | Agent Type |
|----|------|----------|-----------|--------------|-----------|
| TASK-001 | Implement src/core/catalog.js (fetch + parse) | P0 | S | None | coder-agent |
| TASK-002 | Implement src/core/scope.js (resolve + parse) | P0 | S | None | coder-agent |
| TASK-003 | Implement src/core/installer.js (install + uninstall) | P0 | L | TASK-001, TASK-002 | coder-agent |
| TASK-004 | Implement bin/cli.js (command router) | P0 | M | None | coder-agent |

### Task Details

#### TASK-001: Implement catalog.js

**Description:** Implement `fetchCatalog()` and `fetchHarnessJson()` functions that fetch and parse JSON from GitHub Raw URLs. Include error handling for network failures and non-200 responses. Export `getRepoBase()` for URL construction.

**Complexity:** S

**Inputs:**
- catalog.json schema (see 03-technical-architecture.md)
- GitHub Raw URL pattern: `https://raw.githubusercontent.com/hgflima/harness-lab/main/`

**Outputs:**
- `src/core/catalog.js` with 3 exported functions

**Acceptance Criteria:**
- [ ] Given valid network, when `fetchCatalog()` is called, then it returns parsed catalog object
- [ ] Given network failure, when `fetchCatalog()` is called, then it throws descriptive error

#### TASK-002: Implement scope.js

**Description:** Implement `resolveTarget(scope)` that maps scope strings to filesystem paths, and `parseScope(args)` that extracts `--scope` value from CLI args array.

**Complexity:** S

**Inputs:**
- Scope mapping table (see 03-technical-architecture.md)

**Outputs:**
- `src/core/scope.js` with 2 exported functions

**Acceptance Criteria:**
- [ ] Given scope "global", when `resolveTarget()` is called, then it returns `~/.claude`
- [ ] Given scope "project", when `resolveTarget()` is called, then it returns `<cwd>/.claude`
- [ ] Given scope "local", when `resolveTarget()` is called, then it returns `<cwd>/.claude/local`
- [ ] Given invalid scope, when `resolveTarget()` is called, then it throws with valid options listed

#### TASK-003: Implement installer.js

**Description:** Implement `installHarness()` that fetches a harness's artifacts from GitHub and writes them to the target scope directory. Implement `uninstallHarness()` that reads harness.json from GitHub and removes the corresponding local files. Handle recursive directory download using GitHub API for directory listings.

**Complexity:** L

**Inputs:**
- catalog.js (TASK-001)
- scope.js (TASK-002)
- harness.json schema
- GitHub API for directory listings: `https://api.github.com/repos/hgflima/harness-lab/contents/<path>`

**Outputs:**
- `src/core/installer.js` with `installHarness()` and `uninstallHarness()` functions

**Acceptance Criteria:**
- [ ] Given a valid harness with skills, when `installHarness()` is called, then all skill files exist in target/skills/<name>/
- [ ] Given a valid harness, when `uninstallHarness()` is called, then all listed artifacts are removed
- [ ] Given a harness with nested directories (references/, scripts/), when installed, then subdirectories are preserved

#### TASK-004: Implement CLI router

**Description:** Implement bin/cli.js as the entry point. Parse the command name from process.argv, delegate to the appropriate handler, handle `--help` and `--version` flags. Catch and format errors.

**Complexity:** M

**Inputs:**
- Command handler modules (TASK-005 through TASK-010)
- package.json version field

**Outputs:**
- `bin/cli.js` with shebang, command routing, help text, version output

**Acceptance Criteria:**
- [ ] Given `harness-lab --help`, output lists all 6 commands with descriptions
- [ ] Given `harness-lab --version`, output matches package.json version
- [ ] Given unknown command, stderr shows error and suggests --help
- [ ] Given command handler throws, error message is printed and exit code is 1

---

## Epic 2: CLI Commands

**Goal:** Implement all 6 CLI command handlers
**Total:** 6 tasks

### Tasks

| ID | Task | Priority | Complexity | Dependencies | Agent Type |
|----|------|----------|-----------|--------------|-----------|
| TASK-005 | Implement categories command | P0 | S | TASK-001 | coder-agent |
| TASK-006 | Implement list command | P0 | S | TASK-001 | coder-agent |
| TASK-007 | Implement install command | P0 | M | TASK-001, TASK-002, TASK-003 | coder-agent |
| TASK-008 | Implement uninstall command | P0 | M | TASK-001, TASK-002, TASK-003 | coder-agent |
| TASK-009 | Implement update command | P1 | M | TASK-007, TASK-008 | coder-agent |
| TASK-010 | Implement init command | P0 | L | TASK-002 | coder-agent |

### Task Details

#### TASK-005: Categories command

**Description:** Fetch catalog and display all categories with id and description. Format output with aligned columns.

**Complexity:** S

**Acceptance Criteria:**
- [ ] Given valid network, when `harness-lab categories` is run, then all categories from catalog.json are printed with id and description

#### TASK-006: List command

**Description:** Fetch catalog and display harnesses. Accept optional category argument for filtering. Show name, version, categories, and description.

**Complexity:** S

**Acceptance Criteria:**
- [ ] Given no category argument, when `harness-lab list` is run, then all harnesses are listed
- [ ] Given category "product", when `harness-lab list product` is run, then only product harnesses are shown
- [ ] Given non-existent category, then "No harnesses found" message is shown

#### TASK-007: Install command

**Description:** Parse harness name and --scope from args. Look up harness in catalog. Call `installHarness()`. Print success output with each installed artifact.

**Complexity:** M

**Acceptance Criteria:**
- [ ] Given valid harness name, when install runs, then artifacts are in correct .claude/ subdirectory
- [ ] Given missing harness name, then usage error is shown
- [ ] Given non-existent harness, then error suggests running `harness-lab list`

#### TASK-008: Uninstall command

**Description:** Parse harness name and --scope from args. Look up harness in catalog. Call `uninstallHarness()`. Print removal confirmations.

**Complexity:** M

**Acceptance Criteria:**
- [ ] Given installed harness, when uninstall runs, then artifacts are removed
- [ ] Given already-uninstalled harness, then command completes without error

#### TASK-009: Update command

**Description:** Accept optional harness name. If name provided, update that harness. If no name, update all harnesses. Update = uninstall + install.

**Complexity:** M

**Acceptance Criteria:**
- [ ] Given specific harness name, when update runs, then that harness is re-fetched and reinstalled
- [ ] Given no name, when update runs, then all catalog harnesses are updated

#### TASK-010: Init command (setup)

**Description:** Run `npm install -g` on the package. Prompt user for scope (1=global, 2=project, 3=local). Copy 5 slash command templates to the chosen scope's `commands/harness-lab/` directory. The namespace directory ensures slash commands are invoked as `/harness-lab:install`, `/harness-lab:categories`, etc.

**Complexity:** L

**Acceptance Criteria:**
- [ ] Given user selects global, then slash commands are in `~/.claude/commands/harness-lab/`
- [ ] Given npm install -g succeeds, then `harness-lab` is available as global command
- [ ] Given npm install -g fails, then helpful error about sudo is shown

---

## Epic 3: Slash Commands

**Goal:** Create the 5 slash command templates that delegate to CLI
**Total:** 1 task

### Tasks

| ID | Task | Priority | Complexity | Dependencies | Agent Type |
|----|------|----------|-----------|--------------|-----------|
| TASK-011 | Create slash command templates | P0 | S | None | coder-agent |

#### TASK-011: Slash command templates

**Description:** Create 5 markdown files in `templates/slash-commands/harness-lab/` (categories.md, list.md, install.md, uninstall.md, update.md) that instruct Claude Code to run the corresponding CLI command. Each file needs proper frontmatter with description and arguments. The directory structure `commands/harness-lab/<cmd>.md` produces the slash command format `/harness-lab:<cmd>`.

**Complexity:** S

**Acceptance Criteria:**
- [ ] Given 5 files created, each contains the correct `harness-lab <command>` instruction
- [ ] Given each file, frontmatter includes description and required/optional arguments

---

## Epic 4: Testing & Polish

**Goal:** Implement E2E tests and improve error handling
**Total:** 7 tasks

### Tasks

| ID | Task | Priority | Complexity | Dependencies | Agent Type |
|----|------|----------|-----------|--------------|-----------|
| TASK-012 | Set up test infrastructure | P0 | M | None | tester-agent |
| TASK-013 | Unit tests for core modules | P0 | M | TASK-001, TASK-002, TASK-003 | tester-agent |
| TASK-014 | E2E tests for browsing commands | P0 | M | TASK-005, TASK-006 | tester-agent |
| TASK-015 | E2E tests for install/uninstall/update | P0 | L | TASK-007, TASK-008, TASK-009 | tester-agent |
| TASK-016 | E2E tests for init command | P1 | M | TASK-010 | tester-agent |
| TASK-017 | E2E tests for error handling | P1 | M | All CLI tasks | tester-agent |
| TASK-018 | Polish error messages and help text | P1 | S | All CLI tasks | coder-agent |
