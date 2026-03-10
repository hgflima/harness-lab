# Templates: README.md & Overview and Goals

Use these templates when generating the README.md (navigation hub) and `requirements/01-overview-and-goals.md`.

---

## README.md — Central Navigation Hub

This is the main file agents and humans read first. It provides quick orientation and links to everything else.

```markdown
# PRD: [Project Name] - [Brief Description]

**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Status:** [✅ Complete | 🔄 In Progress | ⏳ Planning | ⚠️ Blocked]

---

## Git Strategy

**Approach:** [Worktrees (recommended) / Branch-per-agent / Single branch]

### Worktree Layout (Recommended for Parallel Lanes)

Git worktrees allow each agent to have its own working directory and branch while sharing the same repository. This eliminates merge conflicts during parallel implementation — agents only merge at explicit integration points.

| Lane | Branch | Worktree Path | Agent Type |
|------|--------|-------------|-----------|
| Base | `feature/{feature-name}` | (main checkout) | project-manager-agent |
| Lane A | `feature/{feature-name}/lane-a-{focus}` | `.worktrees/lane-a` | coder-agent |
| Lane B | `feature/{feature-name}/lane-b-{focus}` | `.worktrees/lane-b` | coder-agent |
| Lane C | `feature/{feature-name}/lane-c-{focus}` | `.worktrees/lane-c` | infra-agent |
| Lane D | `feature/{feature-name}/lane-d-e2e` | `.worktrees/lane-d` | tester-agent |

### Merge Strategy

| Integration Point | Source Branches | Target Branch | Merge Order | Verification |
|-------------------|----------------|--------------|-------------|-------------|
| Batch 0 complete | Base | All lanes rebase | — | Contracts available in all worktrees |
| Integration batch | All lane branches | `feature/{feature-name}` | [C → A → B → D] (infra first, then backend, frontend, tests) | E2E suite passes on merged branch |
| Feature complete | `feature/{feature-name}` | `main` / `develop` | — | Full E2E + human review gate |

### Conflict Resolution

- **Prevention:** Interface contracts defined in Batch 0 minimize cross-lane file overlap
- **When conflicts occur:** Merge infra and backend first (they define APIs), then frontend (consumes APIs), then tests (validates everything)
- **Shared files** (e.g., package.json, schema files): Owned by one lane only; other lanes consume via contract dependency

---

## Quick Navigation

### Requirements Documentation

1. [**Overview & Goals**](requirements/01-overview-and-goals.md)
   - Product vision, objectives, success metrics, scope

2. [**User Stories**](requirements/02-user-stories.md)
   - End-user personas, stories with acceptance criteria (coder-tester agent contracts), user flows

3. [**Technical Architecture**](requirements/03-technical-architecture.md)
   - Technology stack, system design, database schema, API specs (interface contracts)

4. [**Security & Performance**](requirements/04-security-and-performance.md)
   - Security requirements, performance targets, monitoring, automated verification gates

5. [**E2E Test Specifications**](requirements/05-e2e-test-specs.md)
   - Story-to-test traceability matrix, test data fixtures, execution strategy

### Task Assignments

1. [**Task Breakdown**](task_assignments/01-task-breakdown.md)
   - Agent-assignable tasks by epic, complexity estimates, parallel lanes

2. [**Dependencies & Critical Path**](task_assignments/02-dependencies-critical-path.md)
   - Dependency mapping, critical path, parallelization lanes, interface contracts

3. [**Timeline Estimates**](task_assignments/03-timeline-estimates.md)
   - Execution batches, agent configuration, milestones, go-live checklist

---

## Feature Summary

[2-3 sentences: what this feature/project does and why it matters]

### Core Capabilities

1. **[Capability 1]** - [Brief description]
2. **[Capability 2]** - [Brief description]
3. **[Capability 3]** - [Brief description]

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | [Technology] | [Why] |
| Backend | [Technology] | [Why] |
| Database | [Technology] | [Why] |
| Infrastructure | [Technology] | [Why] |

---

## Agent Topology

| Agent Type | Count | Assigned Lanes | Primary Artifacts |
|-----------|-------|---------------|-------------------|
| coder-agent | [X] | Lanes A, B | Implementation code |
| tester-agent | [Y] | Lane D | E2E tests from 05-e2e-test-specs.md |
| infra-agent | [Z] | Lane C | CI/CD, deployment |
| reviewer-agent | [W] | Review gates | Code review between batches |
| project-manager-agent | 1 | Orchestration | This README (status tracking) |

---

## Execution Status

*Updated by: project-manager-agent*

| Phase | Status | Progress |
|-------|--------|----------|
| Requirements & PRD | ⏳/🔄/✅ | 0-100% |
| Contract Definitions (Batch 0) | ⏳/🔄/✅ | 0-100% |
| Parallel Implementation | ⏳/🔄/✅ | 0-100% |
| Integration | ⏳/🔄/✅ | 0-100% |
| E2E Verification | ⏳/🔄/✅ | 0-100% |
| Deployment | ⏳/🔄/✅ | 0-100% |

### Documentation Statistics

- **Total Documents:** [X] files
- **Total Tasks Defined:** [X] tasks in [Y] epics
- **Parallel Lanes:** [X] concurrent lanes
- **E2E Tests:** [X] test specs mapped to [Y] user stories
- **API Endpoints:** [X] endpoints (contracts defined)
- **Database Models:** [X] models

---

## Implementation Progress

*Maintained by: project-manager-agent after each execution batch*

### Epic 1: [Epic Name] ([X] tasks | [Y] lanes)

**Status:** ⏳ Not Started | **Progress:** 0/[X] tasks

| Task ID | Task | Lane | Agent Type | Status | Batch |
|---------|------|------|-----------|--------|-------|
| [ID] | [Task name] | [Lane] | [Agent] | ⏳/🔄/✅/⚠️ | [N] |

[Repeat for each epic]

**Legend:** ⏳ Not Started · 🔄 In Progress · ✅ Complete · ⚠️ Blocked

---

## Document History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| YYYY-MM-DD | 1.0 | [Author/Agent] | Initial PRD |

---

## Next Steps

### Immediate Actions

1. [Action 1] - [Details]
2. [Action 2] - [Details]
3. [Action 3] - [Details]
```

---

## requirements/01-overview-and-goals.md

```markdown
# Overview & Goals

## Executive Summary

[2-3 paragraph overview of the project: what it is, why it matters, who it serves]

## Product Vision

### Problem Statement
[What problem are we solving? Why does it matter? What's the cost of not solving it?]

### Solution Overview
[How does this feature/project solve the problem?]

### Target End-Users
[Primary and secondary personas — brief description, not full persona docs (those go in 02-user-stories)]

## Goals & Objectives

### Primary Goals
1. **[Goal 1]**: [Specific, measurable outcome]
2. **[Goal 2]**: [Specific, measurable outcome]

### Secondary Goals
1. **[Goal 1]**: [Specific, measurable outcome]

## Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Current Baseline | Target | Measurement Method |
|--------|-----------------|--------|-------------------|
| [Metric 1] | [Value] | [Target] | [How to measure] |
| [Metric 2] | [Value] | [Target] | [How to measure] |

### Success Criteria

**Must Have (Launch Blockers):**
- [ ] [Criterion 1 — phrased as verifiable assertion]
- [ ] [Criterion 2 — phrased as verifiable assertion]

**Should Have (Post-Launch):**
- [ ] [Criterion 1]

## Scope

### In Scope
- [Feature/functionality 1]
- [Feature/functionality 2]

### Out of Scope
- [Feature 1] - [Reason]
- [Feature 2] - [Reason]

### Future Considerations
- [Feature for future phases]

## Constraints

### Technical Constraints
- [Constraint]: [Impact and mitigation]

### Business Constraints
- **Budget**: [Limitations]
- **Timeline**: [Constraints]
- **Agent Capacity**: [Number and types of agents available]

### Regulatory/Compliance
- [Requirement]: [Impact]

## Assumptions

1. **[Assumption]**: [Description and risk if invalid]
2. **[Assumption]**: [Description and risk if invalid]

## Dependencies

### External
- **[Dependency]**: [Description, owner, risk level]

### Internal
- **[Dependency]**: [Description, owner, risk level]
```
