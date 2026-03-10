# Templates: User Stories

Use this template when generating `requirements/02-user-stories.md`.

**Key principle:** Each acceptance criterion is a **contract between the coder-agent and the tester-agent**. The coder-agent's task is done when the tester-agent's E2E tests (written independently from 05-e2e-test-specs.md) pass against the implementation. If an AC is ambiguous enough that two agents could interpret it differently, it is not done.

---

```markdown
# User Stories

## End-User Personas

These personas describe the **end-users of the product** (not the agents building it).

### Primary Persona: [Persona Name]

**Profile:**
- Role: [Job title/role]
- Technical Proficiency: [Low/Medium/High]
- Context: [Where/when they use the product]

**Goals:**
- [Primary goal 1]
- [Primary goal 2]

**Pain Points:**
- [Pain point 1]
- [Pain point 2]

**Key Behaviors:**
- [Behavior/pattern 1]
- [Behavior/pattern 2]

### Secondary Persona: [Persona Name]

[Repeat structure]

---

## User Stories

### Epic: [Epic Name]

#### Story [US-XXX]: [Story Title]

**As a** [persona]
**I want** [goal/desire]
**So that** [benefit/value]

**Priority:** P0 (Must Have) / P1 (Should Have) / P2 (Nice to Have)

**Acceptance Criteria (Coder ↔ Tester Contract):**

Each criterion below is a verifiable contract. The coder-agent implements to satisfy it; the tester-agent writes E2E tests to verify it. No ambiguity allowed.

- [ ] Given [precise context], when [specific action], then [measurable expected result]
- [ ] Given [precise context], when [specific action], then [measurable expected result]
- [ ] Given [precise context], when [specific action], then [measurable expected result]

**Complexity:** S / M / L / XL

**E2E Test Refs:** [E2E-XXX, E2E-YYY] — see 05-e2e-test-specs.md

**Technical Notes:**
[Implementation guidance, constraints, patterns to follow — context for the coder-agent]

---

[Repeat for each story in the epic]

### Epic: [Next Epic Name]

[Repeat structure]

---

## User Flows

### Flow 1: [Flow Name]

**Goal:** [What the end-user wants to accomplish]

**Steps:**

| Step | User Action | System Response | Verification (testable assertion) |
|------|------------|----------------|----------------------------------|
| 1 | [Description] | [Description] | [What the tester-agent asserts] |
| 2 | [Description] | [Description] | [What the tester-agent asserts] |
| 3 | [Description] | [Description] | [What the tester-agent asserts] |

**Happy Path:**
User → Step 1 → Step 2 → Step 3 → Success

**Alternative Paths:**
- **Path A:** [Description] → [Expected outcome]
- **Path B:** [Description] → [Expected outcome]

**Error Paths:**
- **Error 1:** [Scenario] → [System response] → [User recovery]
- **Error 2:** [Scenario] → [System response] → [User recovery]

---

## Edge Cases & Error Scenarios

### Scenario 1: [Description]

**Context:** [When does this happen?]
**Expected Behavior:** [How should the system respond?]
**Error Message:** [Exact message if applicable]
**Recovery:** [How does the end-user recover?]
**E2E Test:** [E2E-XXX — error path test in 05-e2e-test-specs.md]

---

## Non-Functional Requirements

### Accessibility
- **WCAG Level:** [A / AA / AAA]
- **Keyboard Navigation:** [Requirements]
- **Screen Reader Support:** [Requirements]
- **Color Contrast:** [Requirements]

### Internationalization (i18n)
- **Languages:** [Supported languages]
- **RTL Support:** [Yes/No]
- **Date/Time Formats:** [Requirements]
- **Currency:** [Requirements]
```
