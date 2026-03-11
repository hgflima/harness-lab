# User Stories

## End-User Personas

### Primary Persona: Dev using Claude Code

**Profile:**
- Role: Software developer using Claude Code daily
- Technical Proficiency: High
- Context: Terminal / Claude Code sessions, working on projects with AI agents

**Goals:**
- Quickly discover and install quality harnesses without friction
- Manage installed harnesses across different projects

**Pain Points:**
- Plugin system is hard to navigate and install/uninstall
- No easy way to discover what's available in a curated collection
- Installing artifacts manually requires knowing the exact directory structure

### Secondary Persona: Harness Curator (hgflima)

**Profile:**
- Role: Maintains the harness-lab repository
- Technical Proficiency: High
- Context: Adds new harnesses, updates existing ones, maintains catalog

**Goals:**
- Publish harnesses that users can install with a single command
- Maintain a clean, versioned catalog

---

## User Stories

### Epic: Initial Setup

#### Story US-001: Bootstrap via npx

**As a** developer
**I want** to run `npx github:hgflima/harness-lab@latest` and have everything set up
**So that** I can start using harness-lab immediately

**Priority:** P0 (Must Have)

**Acceptance Criteria (Coder ↔ Tester Contract):**
- [ ] Given a machine with Node.js >= 18 and npm, when the user runs `npx github:hgflima/harness-lab@latest`, then the CLI prompts for scope selection (global/project/local) and installs the `harness-lab` command globally
- [ ] Given the user selects scope "global", when init completes, then 5 slash command `.md` files exist in `~/.claude/commands/harness-lab/`
- [ ] Given the user selects scope "project", when init completes, then 5 slash command `.md` files exist in `.claude/commands/harness-lab/` relative to cwd
- [ ] Given the user selects scope "local", when init completes, then 5 slash command `.md` files exist in `.claude/local/commands/harness-lab/` relative to cwd
- [ ] Given init completed successfully, when the user runs `harness-lab --version`, then it outputs the current version

**Complexity:** L
**E2E Test Refs:** E2E-001, E2E-002

---

### Epic: Browsing

#### Story US-002: List categories

**As a** developer
**I want** to see what categories of harnesses are available
**So that** I can find harnesses relevant to my needs

**Priority:** P0 (Must Have)

**Acceptance Criteria:**
- [ ] Given the CLI is installed, when the user runs `harness-lab categories`, then all categories from catalog.json are listed with id and description
- [ ] Given no internet connection, when the user runs `harness-lab categories`, then a clear error message is shown

**Complexity:** S
**E2E Test Refs:** E2E-003

#### Story US-003: List harnesses

**As a** developer
**I want** to list available harnesses, optionally filtered by category
**So that** I can find a specific harness to install

**Priority:** P0 (Must Have)

**Acceptance Criteria:**
- [ ] Given the CLI is installed, when the user runs `harness-lab list`, then all harnesses are listed with name, version, categories, and description
- [ ] Given the CLI is installed, when the user runs `harness-lab list product`, then only harnesses in the "product" category are shown
- [ ] Given the user provides a non-existent category, when the user runs `harness-lab list nonexistent`, then a message "No harnesses found in category: nonexistent" is shown

**Complexity:** S
**E2E Test Refs:** E2E-004

---

### Epic: Installation & Removal

#### Story US-004: Install a harness

**As a** developer
**I want** to install a harness by name into a specific scope
**So that** its skills/commands/agents/hooks are available in Claude Code

**Priority:** P0 (Must Have)

**Acceptance Criteria:**
- [ ] Given the harness "prd-generator" exists in the catalog, when the user runs `harness-lab install prd-generator`, then the skill files are copied to `.claude/skills/prd-generator/` (project scope by default)
- [ ] Given the user specifies `--scope global`, when install completes, then files are in `~/.claude/skills/prd-generator/`
- [ ] Given a harness with both skills and commands artifacts, when install completes, then both `.claude/skills/` and `.claude/commands/` have the correct files
- [ ] Given a non-existent harness name, when the user runs `harness-lab install nonexistent`, then error message includes "Run harness-lab list to see available harnesses"
- [ ] Given install succeeds, when the user runs `harness-lab install prd-generator` again, then existing files are overwritten (idempotent)

**Complexity:** L
**E2E Test Refs:** E2E-005, E2E-006

#### Story US-005: Uninstall a harness

**As a** developer
**I want** to uninstall a harness cleanly
**So that** only the artifacts from that harness are removed

**Priority:** P0 (Must Have)

**Acceptance Criteria:**
- [ ] Given "prd-generator" is installed, when the user runs `harness-lab uninstall prd-generator`, then `.claude/skills/prd-generator/` is removed entirely
- [ ] Given "prd-generator" is installed with commands, when uninstall completes, then the corresponding `.claude/commands/*.md` files are also removed
- [ ] Given the harness is not installed, when uninstall runs, then it completes without error (idempotent)
- [ ] Given other harnesses are installed, when the user uninstalls one harness, then other harnesses' files are untouched

**Complexity:** M
**E2E Test Refs:** E2E-007

#### Story US-006: Update a harness

**As a** developer
**I want** to update one or all harnesses to the latest version
**So that** I have the most recent improvements

**Priority:** P1 (Should Have)

**Acceptance Criteria:**
- [ ] Given "prd-generator" is installed, when the user runs `harness-lab update prd-generator`, then the old files are removed and the latest version is fetched and installed
- [ ] Given multiple harnesses are installed, when the user runs `harness-lab update` (no name), then all installed harnesses are updated
- [ ] Given update succeeds, then the output shows the version for each updated harness

**Complexity:** M
**E2E Test Refs:** E2E-008

---

### Epic: Slash Command Integration

#### Story US-007: Slash commands delegate to CLI

**As a** developer using Claude Code
**I want** to run `/harness-lab:install prd-generator` in Claude Code
**So that** I get the same result as running `harness-lab install prd-generator` in the terminal

**Priority:** P0 (Must Have)

**Acceptance Criteria:**
- [ ] Given slash commands are installed, when Claude Code reads `commands/harness-lab/install.md`, then it contains instructions to run the `harness-lab install` CLI command
- [ ] Given slash commands are installed, when Claude Code reads `commands/harness-lab/categories.md`, then it contains instructions to run the `harness-lab categories` CLI command
- [ ] Given all 5 slash commands in `commands/harness-lab/`, when each is read, then it maps to the corresponding CLI command

**Complexity:** S
**E2E Test Refs:** E2E-009

---

### Epic: Error Handling & UX

#### Story US-008: Helpful error messages

**As a** developer
**I want** clear error messages when something goes wrong
**So that** I can fix the issue without guessing

**Priority:** P1 (Should Have)

**Acceptance Criteria:**
- [ ] Given no internet, when any fetch-based command runs, then error message says "Failed to fetch catalog. Check your internet connection."
- [ ] Given GitHub API rate limit exceeded, when a directory listing fails, then error message mentions rate limiting and suggests waiting
- [ ] Given invalid scope flag, when the user provides `--scope invalid`, then error message lists valid options

**Complexity:** M
**E2E Test Refs:** E2E-010, E2E-011

#### Story US-009: Help output

**As a** developer
**I want** `harness-lab --help` and command-level help
**So that** I can discover usage without leaving the terminal

**Priority:** P1 (Should Have)

**Acceptance Criteria:**
- [ ] Given the CLI is installed, when the user runs `harness-lab --help`, then all commands are listed with descriptions
- [ ] Given the CLI is installed, when the user runs `harness-lab --version`, then the current version is printed

**Complexity:** S
**E2E Test Refs:** E2E-012

---

## User Flows

### Flow 1: First-time Setup → Install a Harness

**Goal:** New user goes from zero to using a harness

| Step | User Action | System Response | Verification |
|------|------------|----------------|-------------|
| 1 | `npx github:hgflima/harness-lab@latest` | Prompts for scope | Prompt appears |
| 2 | Selects "1" (global) | Installs CLI + slash commands | Files in ~/.claude/commands/harness-lab/ |
| 3 | `harness-lab categories` | Lists categories | Output matches catalog.json |
| 4 | `harness-lab list product` | Lists product harnesses | Shows prd-generator |
| 5 | `harness-lab install prd-generator` | Fetches and installs | Files in .claude/skills/prd-generator/ |
| 6 | Uses skill in Claude Code | Skill is available | Claude Code sees the skill |

### Flow 2: Update and Clean Up

| Step | User Action | System Response | Verification |
|------|------------|----------------|-------------|
| 1 | `harness-lab update` | Re-fetches all harnesses | Latest files installed |
| 2 | `harness-lab uninstall rules-generator` | Removes artifacts | .claude/skills/rules-generator/ gone |
