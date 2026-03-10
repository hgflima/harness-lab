# Dependencies & Critical Path

## Dependency Map

### Visual Overview

```
TASK-001 (catalog.js) ──┐
                        ├──→ TASK-003 (installer.js) ──→ TASK-007 (install cmd) ──→ TASK-009 (update cmd)
TASK-002 (scope.js) ────┘                             └──→ TASK-008 (uninstall cmd) ──┘
    │
    └──→ TASK-010 (init cmd)

TASK-001 ──→ TASK-005 (categories cmd)
TASK-001 ──→ TASK-006 (list cmd)

TASK-004 (cli router) ← depends on all command handlers

TASK-011 (slash commands) ← no dependencies (static files)
```

### Dependency Table

| Task | Depends On | Blocks | Type |
|------|-----------|--------|------|
| TASK-001 (catalog.js) | None | TASK-003, TASK-005, TASK-006 | — |
| TASK-002 (scope.js) | None | TASK-003, TASK-010 | — |
| TASK-003 (installer.js) | TASK-001, TASK-002 | TASK-007, TASK-008 | Hard |
| TASK-004 (cli router) | TASK-005..TASK-010 | None | Hard |
| TASK-005 (categories) | TASK-001 | TASK-004, TASK-014 | Hard |
| TASK-006 (list) | TASK-001 | TASK-004, TASK-014 | Hard |
| TASK-007 (install) | TASK-003 | TASK-004, TASK-009, TASK-015 | Hard |
| TASK-008 (uninstall) | TASK-003 | TASK-004, TASK-009, TASK-015 | Hard |
| TASK-009 (update) | TASK-007, TASK-008 | TASK-004 | Hard |
| TASK-010 (init) | TASK-002 | TASK-004, TASK-016 | Hard |
| TASK-011 (slash cmds) | None | TASK-010 | Soft |
| TASK-012..018 (tests) | Respective implementations | None | Hard |

---

## Critical Path

**Total Duration:** 5 batches

```
START → TASK-001 (S) → TASK-003 (L) → TASK-007 (M) → TASK-009 (M) → TASK-004 (M) → END
```

| Task | Complexity | Batch | Cumulative |
|------|-----------|-------|-----------|
| TASK-001 catalog.js | S | Batch 1 | 1 |
| TASK-003 installer.js | L | Batch 2 | 2 |
| TASK-007 install cmd | M | Batch 3 | 3 |
| TASK-009 update cmd | M | Batch 4 | 4 |
| TASK-004 cli router | M | Batch 5 | 5 |

---

## Parallel Execution Plan

Since this is a solo developer project, parallelization is between implementation and testing, and between independent tasks within the same batch.

### Batch 1: Foundations (no dependencies)

| Task | Complexity | Notes |
|------|-----------|-------|
| TASK-001 catalog.js | S | Can start immediately |
| TASK-002 scope.js | S | Can start immediately |
| TASK-011 slash commands | S | Static files, no deps |

### Batch 2: Core + Simple Commands

| Task | Complexity | Notes |
|------|-----------|-------|
| TASK-003 installer.js | L | Needs TASK-001 + TASK-002 |
| TASK-005 categories cmd | S | Needs TASK-001 only |
| TASK-006 list cmd | S | Needs TASK-001 only |
| TASK-010 init cmd | L | Needs TASK-002 only |

### Batch 3: Install & Uninstall Commands

| Task | Complexity | Notes |
|------|-----------|-------|
| TASK-007 install cmd | M | Needs TASK-003 |
| TASK-008 uninstall cmd | M | Needs TASK-003 |
| TASK-012 test infra | M | Can start in parallel |

### Batch 4: Update + CLI Router + Tests

| Task | Complexity | Notes |
|------|-----------|-------|
| TASK-009 update cmd | M | Needs TASK-007 + TASK-008 |
| TASK-004 cli router | M | Can finalize once all handlers exist |
| TASK-013 unit tests | M | Test core modules |
| TASK-014 E2E browsing | M | Test categories + list |

### Batch 5: Integration Testing + Polish

| Task | Complexity | Notes |
|------|-----------|-------|
| TASK-015 E2E install/uninstall | L | Full integration tests |
| TASK-016 E2E init | M | Test init flow |
| TASK-017 E2E error handling | M | Error scenarios |
| TASK-018 polish | S | Error messages + help |

---

## Dependency Matrix

**Legend:** ✅ No dependency · 🔴 Hard dependency

|       | T-001 | T-002 | T-003 | T-004 | T-005 | T-006 | T-007 | T-008 | T-009 | T-010 | T-011 |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| T-001 | -     | ✅    | 🔴    | ✅    | 🔴    | 🔴    | ✅    | ✅    | ✅    | ✅    | ✅    |
| T-002 | ✅    | -     | 🔴    | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    | 🔴    | ✅    |
| T-003 | ✅    | ✅    | -     | ✅    | ✅    | ✅    | 🔴    | 🔴    | ✅    | ✅    | ✅    |
| T-007 | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    | -     | ✅    | 🔴    | ✅    | ✅    |
| T-008 | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    | -     | 🔴    | ✅    | ✅    |
