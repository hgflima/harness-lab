# Templates: Task Assignments

Use these templates when generating files in `task_assignments/`:
- `01-task-breakdown.md`
- `02-dependencies-critical-path.md`
- `03-timeline-estimates.md`

---

## task_assignments/01-task-breakdown.md

```markdown
# Task Breakdown

## Summary

| Metric | Value |
|--------|-------|
| Total Epics | [X] |
| Total Tasks | [Y] |
| Max Parallel Lanes | [Z] |
| P0 Tasks | [X] |
| P1 Tasks | [Y] |
| P2 Tasks | [Z] |

### Agent Topology

| Agent Type | Count | Responsibilities |
|-----------|-------|-----------------|
| coder-agent | [X] | Implementation tasks |
| tester-agent | [Y] | E2E test writing and execution |
| infra-agent | [Z] | CI/CD, deployment, infrastructure |
| reviewer-agent | [W] | Code review gates |

---

## Epic 1: [Epic Name]

**Goal:** [What this epic achieves]
**Total:** [X] tasks | [Y] parallel lanes

### Tasks

| ID | Task | Priority | Complexity | Dependencies | Parallel Lane | Agent Type |
|----|------|----------|-----------|-------|------|----------|
| TASK-001 | [Task name] | P0 | S | None | Lane A | coder-agent |
| TASK-002 | [Task name] | P0 | M | TASK-001 | Lane A | coder-agent |
| TASK-003 | [Task name] | P1 | M | TASK-001 (contract) | Lane B | coder-agent |
| TASK-004 | [Task name] | P0 | L | None | Lane C | tester-agent |

### Complexity Reference

| Size | Scope | Example |
|------|-------|---------|
| S | Single file, config change, copy update | Env variable, type definition |
| M | 2-5 files, single component or endpoint | API endpoint, UI component |
| L | 5-15 files, feature with multiple parts | Full CRUD feature, auth flow |
| XL | 15+ files, cross-cutting concern | Database migration + API + UI + tests |

### Task Details

#### TASK-001: [Task Name]

**Description:** [What needs to be built — precise enough for an agent to implement without clarification]

**Agent Type:** coder-agent
**Parallel Lane:** [Lane identifier — tasks in the same lane are sequential; different lanes run concurrently]
**Complexity:** [S/M/L/XL]

**Inputs:**
- [Files, specs, or artifacts this agent needs to read before starting]
- [Interface contracts it consumes]

**Outputs:**
- [Files created or modified]
- [Artifacts produced (API endpoints, types, etc.)]

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [expected result]
- [ ] Given [context], when [action], then [expected result]

**E2E Test Coverage:** [E2E-XXX, E2E-YYY] — reference test IDs from 05-e2e-test-specs.md

**Interface Contracts** (if this task produces or consumes a shared interface):
- Produces: [e.g., "POST /api/v1/orders — see API spec in 03-technical-architecture.md"]
- Consumes: [e.g., "Auth middleware — JWT token in Authorization header"]

**Verification:**
- [ ] Unit tests pass for [component]
- [ ] Integration test passes for [flow]
- [ ] E2E tests: [E2E-XXX] (written by tester-agent from spec)
- [ ] reviewer-agent approval gate

---

[Repeat for each task]

## Epic 2: [Epic Name]

[Repeat structure]
```

---

## task_assignments/02-dependencies-critical-path.md

```markdown
# Dependencies & Critical Path

## Dependency Map

### Visual Overview

```
TASK-001 ──→ TASK-003 ──→ TASK-005 ──→ TASK-008
    │                         │
    └──→ TASK-002 ──→ TASK-004    └──→ TASK-006 ──→ TASK-007
```

### Dependency Table

| Task | Depends On | Blocks | Type |
|------|-----------|--------|------|
| TASK-001 | None | TASK-002, TASK-003 | — |
| TASK-002 | TASK-001 | TASK-004 | Hard |
| TASK-003 | TASK-001 | TASK-005 | Hard |
| TASK-004 | TASK-002 | None | Soft |
| TASK-005 | TASK-003 | TASK-006, TASK-008 | Contract |

**Dependency Types:**
- **Hard:** Cannot start until predecessor completes fully
- **Contract:** Can start once the interface contract is defined (types, API spec, mock data) — predecessor doesn't need to be fully implemented. This is the key to AI parallelization: define contracts early, implement in parallel.
- **Soft:** Can start with partial output from predecessor

---

## Critical Path

The critical path determines minimum project duration. Any delay here delays the whole project.

**Total Duration:** [X] execution batches

```
START → TASK-001 (M) → TASK-003 (L) → TASK-005 (M) → END
```

| Task | Complexity | Batch | Cumulative Batches |
|------|-----------|-------|-------------------|
| TASK-001 | M | Batch 1 | 1 |
| TASK-003 | L | Batch 2 | 2 |
| TASK-005 | M | Batch 3 | 3 |

### Near-Critical Paths

Sequences almost as long as the critical path — monitor closely:

**Path A** (Slack: [X] batches):
TASK-002 → TASK-004 → TASK-006

---

## Parallel Execution Lanes

AI agents work simultaneously at near-100% utilization. Organize tasks into independent lanes that can execute concurrently. Each lane should have clear boundaries and interface contracts so agents don't need to coordinate during implementation — only at integration points.

### Lane Definition

| Lane | Focus | Agent Type | Branch/Worktree | Tasks | Interface Contracts | Integration Point |
|------|-------|-----------|----------------|-------|--------------------|--------------------|
| Lane A | Backend API | coder-agent | `feature/*/lane-a-backend` | TASK-001, TASK-002, TASK-005 | Produces: REST API endpoints (see API spec) | TASK-008 (integration) |
| Lane B | Frontend UI | coder-agent | `feature/*/lane-b-frontend` | TASK-010, TASK-011, TASK-012 | Consumes: REST API (uses mocks until Lane A delivers) | TASK-008 (integration) |
| Lane C | Infrastructure | infra-agent | `feature/*/lane-c-infra` | TASK-020, TASK-021 | Produces: CI/CD pipeline, deployment config | TASK-022 (deploy) |
| Lane D | E2E Tests | tester-agent | `feature/*/lane-d-e2e` | TASK-030, TASK-031 | Consumes: E2E test specs (from PRD) | TASK-032 (test run) |
| Lane E | Code Review | reviewer-agent | (reads from all lanes) | Review gates | Consumes: outputs from Lanes A, B | Batch exit criteria |

### Interface Contracts (Define Before Parallel Work Begins)

These contracts must be finalized as the FIRST tasks in the project. They unblock all parallel lanes.

#### Contract 1: [API Contract]

**Defined in:** requirements/03-technical-architecture.md → API Specifications
**Consumed by:** Lane B (Frontend), Lane D (E2E Tests)
**Format:** [OpenAPI spec / TypeScript interfaces / JSON examples]

```
[Key contract details — e.g., endpoint signatures, request/response shapes]
```

#### Contract 2: [Data Model Contract]

**Defined in:** requirements/03-technical-architecture.md → Database Schema
**Consumed by:** Lane A (Backend), Lane D (E2E Tests)

### Lane Execution Timeline

```
Batch 0:  [Contract Definitions] ────────────────────
Batch 1+: [Lane A: Backend] ───────────────────┐
          [Lane B: Frontend (with mocks)] ──────┤──→ [Integration]
          [Lane C: Infra] ─────────────────────┘
          [Lane D: E2E Tests (from spec)] ──────────→ [Test Run]
          [Lane E: Review Gates] ───────────────────→ [Continuous]
```

### Integration Points

| Point | After Batch | Lanes Merging | Git Action | Verification |
|-------|------------|--------------|-----------|-------------|
| TASK-008 | Batch [X] | A + B | Merge lane-a → feature branch, then merge lane-b | Frontend connects to real API; smoke tests pass |
| TASK-032 | Batch [X] | All + D | Merge all lanes → feature branch (order: C → A → B → D) | Full E2E test suite runs on merged branch |

**Merge order matters:** Infra first (defines deployment), then backend (defines APIs), then frontend (consumes APIs), then tests (validates everything). This minimizes conflict resolution.

### Parallelization Metrics

| Metric | Value |
|--------|-------|
| Total tasks | [X] |
| Max parallel lanes | [Y] |
| Sequential bottleneck (critical path) | [Z] tasks |
| Theoretical speedup vs sequential | [W]x |

---

## Cross-Lane Dependencies

### Lane A → Lane B

| Lane A Task | Produces | Lane B Task | Contract Available |
|------------|---------|-------------|-------------------|
| TASK-005 | API endpoints | TASK-015 | Batch 0 (mock) → Batch [X] (real) |

### External Dependencies

| Dependency | Required For | Owner | Status | Risk if Delayed |
|-----------|-------------|-------|--------|----------------|
| [Service/API] | TASK-XXX | [External provider] | ⏳ | [Impact on lane execution] |

---

## Dependency Matrix

**Legend:** ✅ No dependency · ⚠️ Soft dependency · 🔴 Hard dependency · 📝 Contract dependency

|       | T-001 | T-002 | T-003 | T-004 | T-005 |
|-------|-------|-------|-------|-------|-------|
| T-001 | -     | 🔴    | 🔴    | ✅    | ✅    |
| T-002 | ✅    | -     | 📝    | 🔴    | ✅    |
| T-003 | ✅    | ✅    | -     | ⚠️    | 🔴    |
```

---

## task_assignments/03-timeline-estimates.md

```markdown
# Timeline Estimates

## Overview

Timeline based on: task breakdown, complexity estimates, agent throughput, parallel lane configuration, and risk buffers.

---

## Agent Configuration

| Agent Type | Count | Throughput (tasks/batch) | Notes |
|-----------|-------|------------------------|-------|
| coder-agent | [X] | [Y] M-complexity tasks | [Constraints: e.g., shared DB access] |
| tester-agent | [X] | [Y] M-complexity tasks | Writes E2E tests from spec |
| infra-agent | [X] | [Y] M-complexity tasks | CI/CD and deployment |
| reviewer-agent | [X] | [Y] reviews/batch | Review gates between batches |

**Batch Definition:** A batch is one execution cycle where all available agents work in parallel on their assigned lanes. Batch boundaries are defined by integration points and review gates.

---

## Execution Plan

### Batch 0: Contract Definitions (Foundation)

**Goal:** Define all interface contracts that unblock parallel lanes.

| Task ID | Task | Complexity | Agent Type | Produces |
|---------|------|-----------|-----------|----------|
| TASK-000 | Define API contracts | M | coder-agent | OpenAPI spec, TypeScript interfaces |
| TASK-001 | Define data model | M | coder-agent | DB schema, seed data |
| TASK-002 | Define E2E test data fixtures | S | tester-agent | Test users, seed data |

**Batch Exit Criteria:**
- [ ] All interface contracts reviewed and agreed
- [ ] Mock data available for all lanes
- [ ] E2E test fixtures defined

### Batch 1: [Focus Area] — Parallel Execution

**Active Lanes:** A, B, C, D
**Agent Utilization:** [X]/[Y] agents active

| Task ID | Task | Complexity | Lane | Agent Type | Notes |
|---------|------|-----------|------|-----------|-------|
| TASK-010 | [Name] | M | Lane A | coder-agent | |
| TASK-011 | [Name] | L | Lane B | coder-agent | Uses mocks from Batch 0 |
| TASK-020 | [Name] | M | Lane C | infra-agent | |
| TASK-030 | [Name] | M | Lane D | tester-agent | From E2E spec |

**Batch Exit Criteria:**
- [ ] All P0 tasks in this batch pass their acceptance criteria
- [ ] reviewer-agent approves all outputs
- [ ] E2E tests for this batch written and passing against mocks

### Batch 2: [Focus Area]

[Repeat structure]

### Batch N: Integration & Verification

**Goal:** Merge all lanes, run full E2E suite against integrated system.

| Task ID | Task | Complexity | Agent Type | Notes |
|---------|------|-----------|-----------|-------|
| TASK-080 | Integration wiring | L | coder-agent | Connect real APIs, remove mocks |
| TASK-081 | Full E2E test run | L | tester-agent | Complete suite against real system |
| TASK-082 | Performance validation | M | tester-agent | Load tests against targets |

**Batch Exit Criteria:**
- [ ] All E2E tests pass against integrated system
- [ ] Performance targets met (see 04-security-and-performance.md)
- [ ] No critical/high severity issues open

---

## Milestones

| Milestone | Target Batch | Criteria | Status |
|-----------|-------------|----------|--------|
| M1: Contracts Complete | Batch 0 | All interface contracts defined and mocks available | ⏳ |
| M2: [Name] | Batch [X] | [What "done" means] | ⏳ |
| M3: Integration Complete | Batch [X] | All lanes merged, smoke tests pass | ⏳ |
| M4: E2E Verified | Batch [X] | Full E2E suite green | ⏳ |
| M5: Production Ready | Batch [X] | Go-live checklist complete | ⏳ |

---

## Risk Assessment

### Risk 1: [Description]

**Impact:** [Schedule impact in batches]
**Probability:** [Low/Medium/High]
**Affected Lanes:** [Which parallel lanes are impacted]

**Mitigation:**
- [Action 1]
- [Action 2]

---

## Buffers

### Project-Level
- **Integration Buffer:** [X] batches after lane merge
- **Verification Buffer:** [X] batches for E2E failures and fixes
- **Deployment Buffer:** [X] batches for production readiness

### Batch-Level
Each batch reserves capacity for: rework from reviewer-agent feedback, E2E test failures that require implementation fixes, and contract renegotiation between lanes.

---

## Go-Live Checklist

**Verification (Agent-Executable):**
- [ ] All P0 tasks complete
- [ ] Full E2E test suite passing (see 05-e2e-test-specs.md)
- [ ] Performance benchmarks met (see 04-security-and-performance.md)
- [ ] Security scanning gates passed
- [ ] Deployment pipeline validated

**Human Review Gates:**
- [ ] Final human review of integrated system
- [ ] Production deployment authorization
- [ ] Rollback plan documented and tested

**Operational:**
- [ ] Monitoring configured
- [ ] Alerting rules active
- [ ] Runbooks created

---

## Post-Launch

### Batch N+1: Stability Monitoring
- Monitor metrics against targets in 04-security-and-performance.md
- tester-agent runs E2E suite on production (read-only tests)
- Fix critical issues (P0 bugs get immediate batch)

### Batch N+2+: Iteration
- P1 features from backlog
- Performance optimization based on production data
- E2E test suite expansion

---

## Execution Summary

| Metric | Value |
|--------|-------|
| Total Batches | [X] |
| Total Tasks | [Y] |
| Max Parallel Agents | [Z] |
| Critical Path Length | [W] batches |
| Theoretical Sequential Time | [V] batches |
| Parallelization Speedup | [V/X]x |
```
