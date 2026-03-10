# Timeline Estimates

## Overview

Solo developer project with AI-assisted implementation. Estimated 5 batches of work, each batch representing one focused coding session.

---

## Agent Configuration

| Agent Type | Count | Throughput | Notes |
|-----------|-------|-----------|-------|
| coder-agent | 1 | 3-5 S/M tasks per batch | Implementation |
| tester-agent | 1 | 2-3 test suites per batch | Can run in parallel with coder on independent tasks |

---

## Execution Plan

### Batch 1: Foundations

**Goal:** Build all modules with zero dependencies.

| Task ID | Task | Complexity | Notes |
|---------|------|-----------|-------|
| TASK-001 | catalog.js | S | fetchCatalog, fetchHarnessJson, getRepoBase |
| TASK-002 | scope.js | S | resolveTarget, parseScope |
| TASK-011 | Slash command templates | S | 5 static .md files |

**Batch Exit Criteria:**
- [ ] catalog.js exports 3 functions with error handling
- [ ] scope.js handles all 3 scopes + invalid scope error
- [ ] 5 slash command .md files in templates/

### Batch 2: Core + Simple Commands

**Goal:** Installer logic and commands that only need catalog.

| Task ID | Task | Complexity | Notes |
|---------|------|-----------|-------|
| TASK-003 | installer.js | L | Recursive directory download via GitHub API |
| TASK-005 | categories cmd | S | Fetch + format output |
| TASK-006 | list cmd | S | Fetch + filter + format |
| TASK-010 | init cmd | L | npm install -g + interactive prompt + file copy |

**Batch Exit Criteria:**
- [ ] `harness-lab categories` works against live GitHub
- [ ] `harness-lab list` and `harness-lab list <category>` work
- [ ] installer.js can download a full harness recursively
- [ ] init flow works end-to-end

### Batch 3: Install & Uninstall + Test Setup

**Goal:** The two most important commands + test infrastructure.

| Task ID | Task | Complexity | Notes |
|---------|------|-----------|-------|
| TASK-007 | install cmd | M | Wire up installer + scope + catalog |
| TASK-008 | uninstall cmd | M | Wire up uninstaller + scope + catalog |
| TASK-012 | Test infrastructure | M | Test runner config, mock server or fetch mock, temp dirs |

**Batch Exit Criteria:**
- [ ] `harness-lab install prd-generator` creates correct files in .claude/skills/
- [ ] `harness-lab uninstall prd-generator` removes them cleanly
- [ ] Test framework ready with mock catalog and temp directory helpers

### Batch 4: Update + Router + First Tests

**Goal:** Complete all commands and begin testing.

| Task ID | Task | Complexity | Notes |
|---------|------|-----------|-------|
| TASK-009 | update cmd | M | Uninstall + install |
| TASK-004 | cli router (finalize) | M | All handlers ready, finalize routing |
| TASK-013 | Unit tests for core | M | catalog.js, scope.js, installer.js |
| TASK-014 | E2E tests for browsing | M | categories, list |

**Batch Exit Criteria:**
- [ ] All 6 commands work end-to-end
- [ ] Unit tests pass for all core modules
- [ ] E2E tests pass for categories + list

### Batch 5: Integration Tests + Polish

**Goal:** Full E2E coverage and production-ready error handling.

| Task ID | Task | Complexity | Notes |
|---------|------|-----------|-------|
| TASK-015 | E2E install/uninstall/update | L | Full integration tests |
| TASK-016 | E2E init | M | Test init flow with mock npm |
| TASK-017 | E2E error handling | M | Network errors, invalid args |
| TASK-018 | Polish error messages | S | Review all error paths |

**Batch Exit Criteria:**
- [ ] All 12 E2E test specs pass
- [ ] Error messages are clear and actionable
- [ ] `harness-lab --help` is complete and accurate

---

## Milestones

| Milestone | Target Batch | Criteria | Status |
|-----------|-------------|----------|--------|
| M1: Core modules done | Batch 2 | catalog.js, scope.js, installer.js all working | ⏳ |
| M2: All commands work | Batch 4 | All 6 commands produce correct output | ⏳ |
| M3: Tests pass | Batch 5 | All 12 E2E specs green | ⏳ |
| M4: Ready to ship | Batch 5 | README updated, help text polished, npx flow tested | ⏳ |

---

## Risk Assessment

### Risk 1: GitHub API Rate Limiting

**Impact:** Tests that hit live GitHub may exhaust 60 req/hour limit
**Probability:** Medium
**Mitigation:** Mock fetch in unit/E2E tests; only manual smoke tests hit live API

### Risk 2: npm install -g Permissions

**Impact:** Init fails on systems without global npm write access
**Probability:** Medium
**Mitigation:** Clear error message suggesting sudo; document in README

### Risk 3: Claude Code .claude/ Structure Changes

**Impact:** Installed harnesses stop working
**Probability:** Low
**Mitigation:** Monitor Claude Code releases; scope.js centralizes path logic for easy updates

---

## Go-Live Checklist

**Verification:**
- [ ] All 6 commands work (manual smoke test)
- [ ] All 12 E2E test specs pass
- [ ] `npx github:hgflima/harness-lab@latest` works from clean state
- [ ] Install/uninstall cycle is clean (no leftover files)
- [ ] Three scopes all work correctly
- [ ] Error messages are helpful for all known failure modes

**Documentation:**
- [ ] README.md with installation instructions and usage examples
- [ ] `harness-lab --help` output is complete

**Repository:**
- [ ] catalog.json is in sync with harnesses/ directory
- [ ] All harness.json files accurately list artifacts
- [ ] Old directory structure (product/, harness/) is removed

---

## Execution Summary

| Metric | Value |
|--------|-------|
| Total Batches | 5 |
| Total Tasks | 18 |
| P0 Tasks | 12 |
| P1 Tasks | 6 |
| Critical Path Length | 5 batches |
