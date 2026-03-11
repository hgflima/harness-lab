# E2E Test Specifications

## Overview

This document maps every user story to its end-to-end test specification. Tests verify the CLI behavior from the user's perspective — running commands and checking file system outcomes.

### Coverage Summary

| Epic | Stories | E2E Tests | Coverage |
|------|---------|-----------|----------|
| Initial Setup | 1 | 2 | 100% |
| Browsing | 2 | 2 | 100% |
| Installation & Removal | 3 | 4 | 100% |
| Slash Command Integration | 1 | 1 | 100% |
| Error Handling & UX | 2 | 3 | 100% |
| **Total** | **9** | **12** | **100%** |

### Test Environment

- **Runtime:** Node.js >= 18
- **Test Framework:** Node.js built-in test runner (`node --test`) or Vitest
- **Temp directories:** Each test creates a temp dir for scope isolation
- **Network:** Tests that require GitHub access are tagged `@network`. Unit tests mock `fetch`

---

## Test Data & Fixtures

### Mock Catalog

```json
{
  "version": "1.0.0",
  "categories": [
    { "id": "product", "name": "Product", "description": "Product harnesses" },
    { "id": "harness", "name": "Harness", "description": "Meta-harnesses" }
  ],
  "harnesses": [
    {
      "name": "test-harness",
      "version": "1.0.0",
      "description": "A test harness",
      "categories": ["product"],
      "author": "test",
      "path": "harnesses/test-harness"
    }
  ]
}
```

### Mock Harness.json

```json
{
  "name": "test-harness",
  "version": "1.0.0",
  "description": "A test harness",
  "categories": ["product"],
  "author": "test",
  "artifacts": {
    "skills": ["test-harness"],
    "commands": ["test-command"],
    "agents": [],
    "hooks": []
  }
}
```

---

## Epic: Initial Setup

### E2E-001: Init installs CLI and slash commands

**Traces to:** Story US-001

**Priority:** P0

**Preconditions:**
- Node.js >= 18 installed
- Temp directory for test scope

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run `harness-lab init` with stdin providing "2" (project scope) | CLI prompts for scope, accepts input | Process exits with code 0 |
| 2 | Check temp/.claude/commands/harness-lab/ | 5 .md files exist | `categories.md`, `list.md`, `install.md`, `uninstall.md`, `update.md` all exist inside `commands/harness-lab/` |

### E2E-002: Init creates correct directory per scope

**Traces to:** Story US-001

**Priority:** P0

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run init with scope "global" | Files in ~/.claude/commands/harness-lab/ | `~/.claude/commands/harness-lab/` contains 5 .md files |
| 2 | Run init with scope "local" | Files in .claude/local/commands/harness-lab/ | `.claude/local/commands/harness-lab/` contains 5 .md files |

---

## Epic: Browsing

### E2E-003: Categories command lists all categories

**Traces to:** Story US-002

**Priority:** P0

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run `harness-lab categories` | Output contains all category ids | stdout includes "product", "planning", "harness", "developer-experience" |
| 2 | Run `harness-lab categories` | Output contains descriptions | stdout includes description text for each category |

### E2E-004: List command with and without category filter

**Traces to:** Story US-003

**Priority:** P0

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run `harness-lab list` | All harnesses shown | stdout includes "prd-generator", "agent-md-writer", "rules-generator" |
| 2 | Run `harness-lab list product` | Filtered results | stdout includes "prd-generator", does NOT include "rules-generator" |
| 3 | Run `harness-lab list nonexistent` | No results message | stdout includes "No harnesses found in category: nonexistent" |

---

## Epic: Installation & Removal

### E2E-005: Install harness to project scope

**Traces to:** Story US-004

**Priority:** P0

**Preconditions:**
- Temp directory as cwd

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run `harness-lab install prd-generator` | Downloads and installs | Process exits 0 |
| 2 | Check .claude/skills/prd-generator/ | SKILL.md exists | `fs.existsSync('.claude/skills/prd-generator/SKILL.md')` is true |
| 3 | Check .claude/skills/prd-generator/references/ | Reference files exist | At least 6 files in references/ |
| 4 | Check stdout | Success message | stdout includes "Installed skill: prd-generator" |

### E2E-006: Install harness to global scope

**Traces to:** Story US-004

**Priority:** P0

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run `harness-lab install prd-generator --scope global` | Installs to ~/.claude/ | Files exist in `~/.claude/skills/prd-generator/` |

### E2E-007: Uninstall harness

**Traces to:** Story US-005

**Priority:** P0

**Preconditions:**
- "prd-generator" installed in project scope

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run `harness-lab uninstall prd-generator` | Removes skill directory | `.claude/skills/prd-generator/` does not exist |
| 2 | Verify other files untouched | If other harnesses installed, they remain | Other skill directories still exist |
| 3 | Run `harness-lab uninstall prd-generator` again | Idempotent — no error | Process exits 0 |

### E2E-008: Update harness

**Traces to:** Story US-006

**Priority:** P1

**Preconditions:**
- "prd-generator" installed in project scope

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run `harness-lab update prd-generator` | Re-fetches and reinstalls | Process exits 0, SKILL.md exists |
| 2 | Check stdout | Version shown | stdout includes "v1.0.0" |

---

## Epic: Slash Command Integration

### E2E-009: Slash command files contain CLI delegation

**Traces to:** Story US-007

**Priority:** P0

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Read commands/harness-lab/install.md | Contains CLI command | File content includes `harness-lab install` |
| 2 | Read commands/harness-lab/categories.md | Contains CLI command | File content includes `harness-lab categories` |
| 3 | Read all 5 files in commands/harness-lab/ | Each references its CLI counterpart | All 5 files contain `harness-lab <command>` |

---

## Epic: Error Handling & UX

### E2E-010: Unknown harness produces helpful error

**Traces to:** Story US-008

**Priority:** P1

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run `harness-lab install nonexistent` | Error message with guidance | stderr includes "Harness not found" AND "harness-lab list" |
| 2 | Check exit code | Non-zero | Process exits with code 1 |

### E2E-011: Invalid scope produces helpful error

**Traces to:** Story US-008

**Priority:** P1

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run `harness-lab install prd-generator --scope invalid` | Error with valid options | stderr includes "Invalid scope" AND "global, project, or local" |

### E2E-012: Help output shows all commands

**Traces to:** Story US-009

**Priority:** P1

**Test Steps:**

| Step | Action | Expected Result | Assertion |
|------|--------|----------------|-----------|
| 1 | Run `harness-lab --help` | Lists all commands | stdout includes "init", "categories", "list", "install", "uninstall", "update" |
| 2 | Run `harness-lab --version` | Shows version | stdout matches semver pattern |

---

## Traceability Matrix

| Story ID | Story Title | E2E Test IDs | Status |
|----------|------------|-------------|--------|
| US-001 | Bootstrap via npx | E2E-001, E2E-002 | ⏳ |
| US-002 | List categories | E2E-003 | ⏳ |
| US-003 | List harnesses | E2E-004 | ⏳ |
| US-004 | Install a harness | E2E-005, E2E-006 | ⏳ |
| US-005 | Uninstall a harness | E2E-007 | ⏳ |
| US-006 | Update a harness | E2E-008 | ⏳ |
| US-007 | Slash commands delegate | E2E-009 | ⏳ |
| US-008 | Helpful error messages | E2E-010, E2E-011 | ⏳ |
| US-009 | Help output | E2E-012 | ⏳ |
