# Templates: E2E Test Specifications

Use this template when generating `requirements/05-e2e-test-specs.md`.

**This is the PRIMARY VERIFICATION ARTIFACT of the entire PRD.** In AI-driven development, this file determines whether the software works. It provides a direct, traceable mapping from every user story to its E2E test specification. The tester-agent (which must be a different agent from the coder-agent) reads this file and writes complete E2E tests without access to the implementation code. If the coder-agent's implementation passes the tester-agent's tests, the feature works. If not, the coder-agent iterates. This independent verification loop is the quality guarantee.

---

```markdown
# E2E Test Specifications

## Overview

This document maps every user story to its end-to-end test specification. Each test is designed for independent verification — the tester-agent implements these tests using ONLY this spec and the running application, never the implementation source code. This separation ensures the tests verify actual behavior, not implementation details.

### Coverage Summary

| Epic | Stories | E2E Tests | Coverage |
|------|---------|-----------|----------|
| [Epic 1] | [X] | [Y] | [Z]% |
| [Epic 2] | [X] | [Y] | [Z]% |
| **Total** | **[X]** | **[Y]** | **[Z]%** |

### Test Environment

- **Base URL:** [http://localhost:3000 or staging URL]
- **Test Framework:** [Cypress / Playwright / etc.]
- **Browser Targets:** [Chrome, Firefox, Safari, etc.]
- **Authentication:** [How test users are provisioned]

---

## Test Data & Fixtures

Define shared test data used across multiple tests. This ensures consistency and makes tests reproducible.

### Test Users

| User | Role | Email | Password | Purpose |
|------|------|-------|----------|---------|
| test_admin | Admin | admin@test.com | [from env] | Admin flow tests |
| test_user | Regular User | user@test.com | [from env] | Standard user flows |
| test_viewer | Read-only | viewer@test.com | [from env] | Permission tests |

### Seed Data

```
[Describe the initial state the database must be in before tests run.
 E.g., "3 products in catalog, 1 active order for test_user, empty cart"]
```

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| TEST_BASE_URL | Application URL | http://localhost:3000 |
| TEST_DB_SEED | Seed script path | ./tests/seed.sql |

---

## Epic: [Epic Name]

### E2E-[XXX]: [Test Name]

**Traces to:** Story [US-XXX]: [Story Title]

**Priority:** P0 / P1 / P2 (mirrors story priority)

**Preconditions:**
- [System state required before test starts]
- [User must be logged in as: test_user]
- [Data state: e.g., "product X exists in catalog with price $29.99"]

**Test Steps:**

| Step | Action | Input/Data | Expected Result | Assertion |
|------|--------|-----------|-----------------|-----------|
| 1 | Navigate to [URL/page] | — | Page loads, [element] is visible | `expect(page.locator('[data-testid="X"]')).toBeVisible()` |
| 2 | Fill in [field] | "[value]" | Field accepts input | `expect(input).toHaveValue("[value]")` |
| 3 | Click [button/element] | — | [What happens: redirect, modal, API call] | `expect(page).toHaveURL("/expected-path")` |
| 4 | Verify [outcome] | — | [Expected state: DB record, UI element, notification] | `expect(page.locator('[data-testid="Y"]')).toContainText("Z")` |

**Data Assertions (post-test state):**
- [ ] Database: [table].[column] should equal [value]
- [ ] API: GET /api/[resource]/[id] returns status 200 with [expected fields]
- [ ] UI: [element] displays [expected content]

**Cleanup:**
- [Any state to reset after test, e.g., "delete created order"]

---

### E2E-[XXX]: [Test Name — Error Path]

**Traces to:** Story [US-XXX]: [Story Title] — Error scenario

**Preconditions:**
- [Setup for the error condition]

**Test Steps:**

| Step | Action | Input/Data | Expected Result | Assertion |
|------|--------|-----------|-----------------|-----------|
| 1 | [Trigger error condition] | [Invalid data] | [Error message / behavior] | `expect(page.locator('.error')).toContainText("[message]")` |
| 2 | Verify no side effects | — | [State unchanged] | `expect(api.get("/resource")).toEqual(originalState)` |

**Purpose:** Confirms the system handles [error condition] gracefully without corrupting data.

---

[Repeat for each story in the epic]

## Epic: [Next Epic Name]

[Repeat structure]

---

## Cross-Cutting Tests

Tests that span multiple epics or verify system-wide behaviors.

### E2E-CROSS-001: [Test Name, e.g., "Full user journey from signup to purchase"]

**Traces to:** Stories [US-001], [US-005], [US-012]

**Purpose:** Validates the complete happy path across the core user journey.

**Preconditions:**
- Clean database state
- All services running

**Test Steps:**

| Step | Action | Expected Result | Traces to |
|------|--------|----------------|-----------|
| 1 | [Action] | [Result] | US-001 |
| 2 | [Action] | [Result] | US-005 |
| 3 | [Action] | [Result] | US-012 |

---

## Test Execution Strategy

### Execution Order

Tests should run in this order to respect data dependencies:

1. **Smoke tests** (E2E-CROSS-001): Verify basic system health
2. **Epic tests by priority**: P0 first, then P1, then P2
3. **Error path tests**: After happy paths pass
4. **Cross-cutting tests**: Full journeys

### Parallel Execution

Tests within the same epic that don't share mutable state can run in parallel:

| Parallel Group | Tests | Shared State |
|---------------|-------|-------------|
| Group A | E2E-001, E2E-002 | None (independent users) |
| Group B | E2E-003, E2E-004 | Shared product catalog (read-only) |
| Sequential | E2E-005, E2E-006 | Shared order (write) — must run in order |

### CI/CD Integration

- **On PR:** Run P0 smoke + changed epic tests
- **On merge to main:** Run all P0 + P1 tests
- **Nightly:** Full suite including P2

---

## Traceability Matrix

Complete mapping from stories to tests for quick reference:

| Story ID | Story Title | E2E Test IDs | Status |
|----------|------------|-------------|--------|
| US-001 | [Title] | E2E-001, E2E-002 | ⏳ |
| US-002 | [Title] | E2E-003 | ⏳ |
| US-003 | [Title] | E2E-004, E2E-005 | ⏳ |
| US-004 | [Title] | — (no E2E, unit-only) | ⏳ |

**Coverage rules:**
- Every P0 story must have at least 1 happy path + 1 error path E2E test
- Every P1 story must have at least 1 happy path E2E test
- P2 stories: E2E tests recommended but optional
```
