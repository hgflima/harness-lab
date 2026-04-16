# Parallel Generation Strategies

This document is consulted from **Phase 3.5 (Parallel Generation)** of `SKILL.md`. It explains how the PRD files are generated in parallel by subagents instead of sequentially in the main context — the harness *practices* what it preaches in `templates-tasks.md`.

There are two transport mechanisms (Agent Teams vs Task spawn). The wave structure, contract with each subagent, and the cross-coherence pass are identical between them — only the dispatch primitive changes.

---

## 1. Detect the strategy (load-bearing)

Before dispatching anything, check tool availability in the current session:

- If both `TeamCreate` and `SendMessage` are available → **use Agent Teams** (Strategy A).
- Otherwise → **use Task spawn** (Strategy B).

Do not attempt Agent Teams if the tools are not exposed; the experimental flag (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) must be enabled in the user's settings and a restart is required to surface them. If they are not present in this session, fall back silently to Strategy B — both produce identical output.

> **Rule of thumb:** Strategy B is the safe default. Strategy A is preferred when you expect cross-subagent coordination (handoffs, mid-flight clarifications) — for one-shot file generation per subagent, the difference is mostly aesthetic.

---

## 2. The wave structure (same in both strategies)

The 8 PRD files (Standard level) split into three waves based on dependency:

### Wave 1 — Requirements (5 parallel subagents)

All five files in `requirements/` are independent of each other once the Discovery Summary is settled. Dispatch them simultaneously:

| Subagent | File generated | Template to read |
|----------|----------------|------------------|
| req-overview | `requirements/01-overview-and-goals.md` | `references/templates-overview.md` |
| req-stories | `requirements/02-user-stories.md` | `references/templates-user-stories.md` |
| req-architecture | `requirements/03-technical-architecture.md` | `references/templates-architecture.md` |
| req-security | `requirements/04-security-and-performance.md` | `references/templates-security.md` |
| req-e2e | `requirements/05-e2e-test-specs.md` | `references/templates-e2e-tests.md` |

Wait until all five complete before moving on.

### Wave 2 — Task assignments (3 parallel subagents)

These depend on Wave 1 outputs (especially user stories, architecture, and E2E specs). They read the files Wave 1 produced — they do **not** receive the content inline. Dispatch them simultaneously after Wave 1 is done:

| Subagent | File generated | Reads from Wave 1 |
|----------|----------------|-------------------|
| task-breakdown | `task_assignments/01-task-breakdown.md` | architecture + e2e-tests |
| task-deps | `task_assignments/02-dependencies-critical-path.md` | architecture + task-breakdown's draft |
| task-timeline | `task_assignments/03-timeline-estimates.md` | task-breakdown + user-stories |

### Wave 3 — Cross-coherence pass (1 sequential subagent)

A single subagent reads all 8 generated files and validates traceability. Reports inconsistencies back to the main context:

- Every user story has at least one E2E test mapped to it.
- Every task references the AC(s) it implements.
- Interface contracts in architecture match the dependency edges in `02-dependencies-critical-path.md`.
- Estimates align with the parallelization opportunities identified.
- No `<!-- TODO -->` markers were left unresolved silently (legitimate TODOs must be surfaced explicitly).

If inconsistencies are found, the main context decides whether to regenerate the affected files or surface them to the user as gaps.

### Adapting waves for Lite

Lite has 4 files. The wave structure collapses to:

- **Wave 1 (3 parallel):** `requirements/01-overview-and-stories.md`, `requirements/02-e2e-test-specs.md`, plus a placeholder for technical context (inline in 01).
- **Wave 2 (1):** `task_assignments/01-tasks-and-timeline.md`, reading Wave 1.
- **Wave 3 (optional):** skip cross-coherence if the user wants speed; the small file count makes manual review tractable.

### Adapting waves for Enterprise

Enterprise = Standard + compliance section appended to security file. Use the same Wave 1/2/3 structure; the compliance append happens in the main context after Wave 1 (or as a tiny extra subagent).

---

## 3. The contract (every subagent receives the same shape)

Every subagent prompt — whether dispatched via Task or as a teammate — MUST contain these sections, in order:

```
ROLE
You are generating ONE file of a PRD destined for AI agent consumption. Your output goes
directly into the file path below — no human will edit it before the next AI agent reads it.

DISCOVERY SUMMARY (full)
<paste the entire Discovery Summary here, including any Phase 0 ingested context,
architectural decisions from the deepened Technical Context interview, and chosen
detail level (Lite / Standard / Enterprise)>

YOUR ASSIGNMENT
- Output file path (absolute): <path>
- Template to follow: <reference path>
- Read the template in full, then generate the file by replacing every [placeholder]
  with concrete content from the Discovery Summary.
- For information not present in Discovery, insert `<!-- TODO: Need input on X -->`
  rather than inventing values.

OUTPUT CONTRACT
- Write the file to disk via Write tool.
- Do NOT echo the file content back to the chat — only confirm the path you wrote
  and a 1-2 sentence summary of what is in it.
- Do NOT modify any other files.
- If you discover that information needed for your file is missing from Discovery,
  flag it in your summary so the main context can clarify with the user.

QUALITY BAR
- Specificity over generality (quantify everything; "fast" is not acceptable, "p95 < 200ms" is).
- Testable acceptance criteria where applicable.
- Structured formats (tables, Given/When/Then) over prose.
- Output language: English (regardless of Discovery language).
```

This contract guarantees the main context never re-ingests the generated content — only paths and short summaries flow back. That is the entire point of the parallel pattern.

---

## 4. Strategy A: Agent Teams (when `TeamCreate` + `SendMessage` are available)

The full coordination protocol is documented in `parallel-plan-runner` — do **not** duplicate it here. Read it in full before using this strategy:

→ `harnesses/parallel-plan-runner/skills/parallel-plan-runner/references/agent-teams-best-practices.md`

The non-obvious rules summarized for fast reference:

- Every teammate prompt MUST include literally: *"You are in team mode. Plain-text output is orphaned — only `SendMessage` to the team-lead delivers anything. Send progress, questions, and final report exclusively via SendMessage."*
- Reference teammates **by name**, never by UUID.
- `idle_notification` ≠ done. Wait for an actual `SendMessage` reply or `TaskUpdate(status=completed)`.
- Shutdown protocol: send `shutdown_request` to each teammate in parallel → wait for all `teammate_terminated` → only then call `TeamDelete()`. Always run `TeamDelete()` even on error paths.
- Use `general-purpose` agent_type for these subagents — they need the Write tool. `Explore` is read-only and will get stuck.
- The PRD-generator harness lead is permanent for the team; do not try to rotate.

### Wave dispatch with Agent Teams

```
1. TeamCreate({ name: "prd-wave-1", members: [
     { name: "req-overview",     agent_type: "general-purpose" },
     { name: "req-stories",      agent_type: "general-purpose" },
     { name: "req-architecture", agent_type: "general-purpose" },
     { name: "req-security",     agent_type: "general-purpose" },
     { name: "req-e2e",          agent_type: "general-purpose" },
   ]})

2. For each teammate (in the same assistant turn):
   SendMessage({ to: "<name>", message: "<contract prompt from §3>" })

3. Wait for messages to arrive automatically (no polling, no sleep).
   Each teammate will SendMessage back when done with: path written + 1-2 sentence summary.

4. When all 5 have reported in, send shutdown_request to each in parallel,
   wait for teammate_terminated, then TeamDelete().

5. Repeat steps 1-4 for Wave 2 (new team "prd-wave-2", 3 members).
   Optionally Wave 3 (single member team or just a Task spawn — overhead vs benefit).
```

Use one team per wave because the experimental feature only allows a single team per session — the previous team must be deleted before the next can be created.

---

## 5. Strategy B: Task spawn (default fallback)

Use the standard Task tool with `subagent_type: "general-purpose"` (write-capable). Dispatch all subagents of a wave in a **single assistant turn** (multiple Task tool uses in one message) so they run truly in parallel.

### Wave dispatch with Task spawn

```
Wave 1 — single message, 5 Task tool uses in parallel:

Task({ description: "Generate PRD overview file",     subagent_type: "general-purpose", prompt: "<contract from §3 for req-overview>" })
Task({ description: "Generate PRD user stories file", subagent_type: "general-purpose", prompt: "<contract from §3 for req-stories>" })
Task({ description: "Generate PRD architecture file", subagent_type: "general-purpose", prompt: "<contract from §3 for req-architecture>" })
Task({ description: "Generate PRD security file",     subagent_type: "general-purpose", prompt: "<contract from §3 for req-security>" })
Task({ description: "Generate PRD E2E specs file",    subagent_type: "general-purpose", prompt: "<contract from §3 for req-e2e>" })

Wait for all 5 to return. Each returns a short summary (per the contract: path + 1-2 sentences). The file content is on disk, not in the response.

Wave 2 — single message, 3 Task tool uses in parallel.

Wave 3 — single Task call (or skip for Lite).
```

No team management overhead, no shutdown protocol. The only tradeoff vs Agent Teams is that subagents cannot mid-flight ask each other (or the lead) for clarification — they must complete with what was given.

---

## 6. When to skip the parallel pattern entirely

The user-facing trigger always wins. Skip Phase 3.5 and generate sequentially in the main context if:

- The user explicitly asks for sequential generation ("generate one at a time so I can review each").
- The Discovery Summary itself is so thin that subagents will return mostly TODOs — better to ask follow-up questions inline first.
- The PRD is Lite *and* the user has already pre-filled most fields via Phase 0 ingestion — overhead may exceed benefit at that scale.

In all other cases, dispatch in parallel. The whole point of the harness is that the main context stays uncluttered and the templates (~43 KB total) only load inside subagents.
