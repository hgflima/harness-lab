---
description: "agent-md:audit — Read-only diagnostic of an existing CLAUDE.md or AGENTS.md file against core principles. No writes."
arguments:
  - name: file
    description: "Path of a specific file to audit. Omit to auto-detect CLAUDE.md/AGENTS.md/AGENT.md."
    required: false
---

<objective>
Imperative entry point for auditing an existing agent onboarding file without modifying anything. Produces a structured diagnostic report that the user can act on manually, or that can be fed into `/agent-md:update` if they want automated fixes.
</objective>

<when_to_use>
- Quick health check on an existing `CLAUDE.md` or `AGENTS.md`.
- Before code review, to confirm the onboarding file still reflects reality.
- After a major refactor, to surface drift.
- Pre-migration check (legacy `AGENT.md` → `AGENTS.md`).
- User wants a "second opinion" on their onboarding file without agreeing to any edits.
</when_to_use>

<process>

## Step 1 — Locate the target file

If `$ARGUMENTS.file` is provided, use it. Otherwise scan the project root for `CLAUDE.md`, `AGENTS.md`, and `AGENT.md` (legacy).

- If none found: inform the user there's nothing to audit and suggest `/agent-md:create`.
- If multiple found: ask which to audit, or offer to audit all in sequence.

## Step 2 — Size check (optimization)

Read the file size (line count). If under ~100 lines, **do the audit inline** instead of spawning `audit-analyzer`. For a small file the subagent startup overhead isn't justified. Still spawn `context7-detector` and `design-md-detector` in parallel — those are independent of file size.

For files ≥100 lines, proceed with full parallelization in Step 3.

## Step 3 — Parallelized audit

Launch **three Explore subagents in a single message** (multiple `Task` tool calls in one response). Prompt files live in the skill's `agents/` directory. Substitute `{project_path}` and `{target_file}` before spawning.

1. **`agents/audit-analyzer.md`** — analyze the target file against core principles. Pass `{target_file}` as the absolute path. Pass `{context7_available}` and `{design_md_exists}` as `"unknown"` — synthesis will resolve them.

2. **`agents/context7-detector.md`** — check whether context7 is available. Needed to decide whether to flag a missing `Documentation Lookup` section.

3. **`agents/design-md-detector.md`** — check whether `DESIGN.md` exists. Needed to decide whether to flag a missing `UI Generation` section.

**Do NOT** spawn `stack-scanner` here. Audit is about the file, not the codebase. Drift detection belongs in `/agent-md:update`.

## Step 4 — Synthesize the report

Merge the three (or two + inline audit) findings into a unified diagnostic. Present it as follows:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 AGENT-MD ► AUDIT REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: <path>
Filename: <ok | legacy singular — rename to AGENTS.md>

Size: <N> lines (<small|medium|large|over-budget> bucket, budget: ~75/165/315)
Instruction count: ~<N> (budget: ~150)

Structure: <WHY-BEHAVIOR-WHAT-HOW compliant | partial | non-compliant>

Sections present:
  ✓ <section 1>
  ✓ <section 2>
  ...

Sections missing:
  ✗ Agent Behavior (Karpathy principles)
  ✗ Documentation Lookup  (context7 detected at <path>)
  ✗ UI Generation  (DESIGN.md found at <path>)

Linter rules found (move to tooling):
  • "<quoted line 1>"
  • "<quoted line 2>"

Progressive disclosure candidates:
  • <section or topic that should move to agent_docs/>

Redundancy flags:
  • <pair of sections saying the same thing>

Top findings:
  1. <most critical gap>
  2. <second gap>
  3. <third gap>

OVERALL: <Compliant | Minor issues | Needs significant rewrite | Critical gaps>

───────────────────────────────────────────────────────

Next steps:
  • Run /agent-md:update to apply these findings interactively
  • Or edit the file manually — the findings above are specific enough to act on
  • Or run /agent-md:audit again after changes to confirm
```

## Step 5 — Stop here

**This command is read-only.** Do not propose specific replacement text. Do not offer to rewrite. Do not ask "should I fix this?". The user either acts on the findings manually or runs `/agent-md:update`.

If the user asks you to fix an issue in the same turn, redirect them to `/agent-md:update` — that command is built for it.

</process>

<success_criteria>
- Parallelized: audit-analyzer + context7-detector + design-md-detector ran in a single message (or inline audit + 2 detectors for small files).
- Report is structured, scannable, and quotes specific lines where relevant.
- No file modifications made.
- Tooling-specific findings (`Documentation Lookup`, `UI Generation`) are only flagged when the corresponding tool/file is actually present.
- Report ends with clear next-step options, not ambiguous suggestions.
</success_criteria>

<notes>
- Audit is a **diagnostic**, not a **prescription**. The skill's `SKILL.md` calls this "Step 1 — Audit mode". This command is a direct shortcut to that step.
- The `audit-analyzer` subagent has a strict output format — don't reformat or rewrite its findings; pass them through to the user with light synthesis.
- For very small files (<50 lines), consider skipping the subagents entirely and doing the whole audit inline. Overhead isn't worth it.
</notes>
