---
description: "agent-md:update — Update an existing CLAUDE.md or AGENTS.md with drift detection against the current codebase and best-practice gaps"
arguments:
  - name: file
    description: "Path of a specific file to update. Omit to auto-detect CLAUDE.md/AGENTS.md/AGENT.md."
    required: false
---

<objective>
Imperative entry point for updating an existing agent onboarding file. Runs drift detection (existing file vs current codebase state) and best-practice checks (missing Karpathy section, missing tooling references, legacy filename) in parallel, then proposes targeted edits without a full rewrite.
</objective>

<when_to_use>
- Existing `CLAUDE.md`, `AGENTS.md`, or legacy `AGENT.md` that hasn't been revisited in a while.
- Project that recently added a new framework, database, or directory structure.
- User just installed `context7` or created a `DESIGN.md` and wants the onboarding file to reflect it.
- Migration from legacy `AGENT.md` (singular) to `AGENTS.md` (plural).
</when_to_use>

<process>

## Step 1 — Locate the target file

If `$ARGUMENTS.file` is provided, use that path. Otherwise:

1. Scan project root for `CLAUDE.md`, `AGENTS.md`, and `AGENT.md` (legacy singular).
2. If none found: stop and redirect to `/agent-md:create`.
3. If multiple found: ask the user which to update, or offer to consolidate (via the skill's Step 0 "both exist" path).
4. If legacy `AGENT.md` found: propose rename to `AGENTS.md` before proceeding.

## Step 2 — Parallelized drift detection

Launch **four Explore subagents in a single message** (multiple `Task` tool calls in one response). Prompt files live in the skill's `agents/` directory. Substitute `{project_path}` and `{target_file}` before spawning.

1. **`agents/audit-analyzer.md`** — read the existing file and produce a structured diagnostic. Pass `{target_file}` = absolute path. Pass `{context7_available}` and `{design_md_exists}` as "unknown" — they'll be filled by the other detectors; the audit will re-run its section checks when those return.

2. **`agents/context7-detector.md`** — fresh check in case tooling changed since the file was written.

3. **`agents/design-md-detector.md`** — fresh check for DESIGN.md and UI frameworks.

4. **`agents/stack-scanner.md`** — fresh codebase scan to compare against the file's current tech stack claims.

All four run in parallel. Main context only sees the aggregated reports.

## Step 3 — Diff existing vs current

Compare the `audit-analyzer` findings with the fresh detections:

**Tech stack drift**
- `stack-scanner.LANGUAGE` / `FRAMEWORK` vs what the file currently says. New dependency? Framework upgrade? Database change?

**Structure drift**
- `stack-scanner.FOLDER_STRUCTURE` vs the file's Project Structure section. New top-level dirs? Removed dirs?

**Missing sections (best-practice gaps)**
- `Agent Behavior` — if `audit-analyzer` flagged it missing, propose adding the Karpathy inline snippet from `references/karpathy-principles.md`.
- `Documentation Lookup` — if `context7-detector` returned `yes` and `audit-analyzer` flagged section missing, propose adding the 2-line snippet from `references/project-tooling-snippets.md`.
- `UI Generation` — if `design-md-detector` returned `DESIGN_MD_FOUND=yes` and section missing, propose adding the snippet. If `RECOMMENDATION=suggest-creating-design-md`, ask the user whether they want a placeholder reminder.

**Filename drift**
- If `FILENAME_STATUS=legacy-singular`, propose rename + update any references in `CLAUDE.md` or other docs.

**Linter-rule violations**
- If `audit-analyzer.LINTER_RULE_VIOLATIONS` is non-empty, propose removing them with a note: "These belong in your linter config, not here."

**Instruction overload**
- If `INSTRUCTION_COUNT_ESTIMATE > 150`, flag and propose moving task-specific content to `agent_docs/`.

## Step 4 — Present the delta

Show the user a categorized list of proposed changes:

```
Proposed updates to <target_file>:

[ADD]
  • Agent Behavior section (Karpathy principles, inline compressed)
  • Documentation Lookup section (context7 detected at <path>)

[CHANGE]
  • Tech Stack: add "Prisma 5.x" (found in package.json, not in file)
  • Project Structure: add `app/api/` directory

[REMOVE]
  • Line X: "Use 2-space indentation" (linter rule)
  • Line Y: "Always prefer const over let" (linter rule)

[RENAME]
  • AGENT.md → AGENTS.md

Total: N additions, M changes, K removals, 1 rename.
```

Ask the user to confirm all, select a subset, or cancel.

## Step 5 — Apply changes

For each confirmed change:
- **ADD**: insert at the correct position per the skill's ordering rules (`references/template.md`).
- **CHANGE**: edit in place, preserve surrounding context.
- **REMOVE**: delete the flagged lines.
- **RENAME**: rename the file and update any references in other docs (CLAUDE.md pointer, README, etc.).

Use the `Edit` tool for precise changes. Do **not** rewrite the whole file unless the user explicitly opted in to a full regeneration.

## Step 6 — Present and iterate

Show the updated file (or just the changed sections for brevity) and enter the skill's Step 5 iteration loop.

</process>

<success_criteria>
- Four detectors ran in parallel, not sequentially.
- The user saw a categorized diff and had the option to cherry-pick changes.
- No full-file rewrite unless the user explicitly asked for one.
- Legacy `AGENT.md` was flagged and renamed if present.
- New tooling (context7, DESIGN.md) that was installed after the file was written got added.
</success_criteria>

<notes>
- Preserve the user's voice. If the file has a particular tone or structure choice, keep it unless it violates a core principle.
- Skip drift checks that would produce noise. If the stack scanner reports `unknown`, don't flag the existing file's entry as "drift" — you don't have enough data to compare.
- The underlying logic lives in the `agent-md-writer` skill. Consult `SKILL.md` for edge cases (both files existing, dual-file consolidation, etc.).
</notes>
