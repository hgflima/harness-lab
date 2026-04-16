---
description: "agent-md:create — Create a new CLAUDE.md or AGENTS.md with Karpathy behavior principles, parallelized tooling detection, and codebase-aware content"
arguments:
  - name: target
    description: "Which file to create: claude, agents, or both (default: both)"
    required: false
---

<objective>
Imperative entry point for creating an agent onboarding file from scratch. Wraps the `agent-md-writer` skill in Create mode with parallelized detection to minimize latency and protect the main context window.
</objective>

<when_to_use>
- New project with no existing `CLAUDE.md`, `AGENTS.md`, or `AGENT.md`.
- Existing project where the user wants to start fresh (the command will warn if a file already exists and redirect to `/agent-md:update` or `/agent-md:audit`).
</when_to_use>

<process>

## Step 1 — Guard clauses

1. **Check for existing files.** Look for `CLAUDE.md`, `AGENTS.md`, and `AGENT.md` at project root.
   - If any exist, stop and tell the user: *"Found existing `<file>`. Use `/agent-md:update` to modify it, or `/agent-md:audit` for a diagnostic. Run `/agent-md:create` only after removing the existing file(s)."*
2. **Confirm target.** If `$ARGUMENTS.target` is provided, use it (`claude`, `agents`, or `both`). Otherwise default to `both` and mention the choice to the user in the next step.

## Step 2 — Parallelized detection (the main performance win)

Spawn **three Explore subagents in parallel** using the prompt templates installed with the skill. The prompt files live at `~/.claude/skills/agent-md-writer/agents/` (global scope) or `<project>/.claude/skills/agent-md-writer/agents/` (project scope) — try project first, fall back to global.

**Critical:** Launch all three in a single message with multiple `Task` tool calls. Do not run them sequentially.

1. Read the prompt file `agents/context7-detector.md`, substitute `{project_path}` with the absolute project root, and spawn:
   - `subagent_type: "Explore"`, `description: "Detect context7 availability"`.
2. Read `agents/design-md-detector.md`, substitute `{project_path}`, spawn same way with `description: "Detect DESIGN.md and UI frameworks"`.
3. Read `agents/stack-scanner.md`, substitute `{project_path}`, spawn with `description: "Scan tech stack and folder structure"`.

While the subagents run, you may ask the user Round 1 (WHY) from the skill's workflow so the human-facing conversation happens in parallel with detection work.

## Step 3 — Synthesize findings

When all three subagents return, parse their structured reports:

- From `context7-detector`: `CONTEXT7_DETECTED`, `DETECTION_METHOD`, `DETECTION_PATH`.
- From `design-md-detector`: `DESIGN_MD_FOUND`, `DESIGN_MD_PATH`, `UI_DETECTED`, `UI_FRAMEWORK`, `RECOMMENDATION`.
- From `stack-scanner`: `LANGUAGE`, `FRAMEWORK`, `RUNTIME`, `DATABASE`, `KEY_LIBRARIES`, `FOLDER_STRUCTURE`, `COMMANDS`, `OBSERVATIONS`.

Present a short detection summary to the user:

```
Detection summary:
• context7: <detected via X / not detected>
• DESIGN.md: <found at X / not present but UI detected (Y framework) / not applicable>
• Stack: <language> / <framework> / <runtime>
• Structure: <N> top-level directories
```

If the stack scanner reported `unknown` fields, ask the user to fill in the gaps (one question at a time).

## Step 4 — Continue the skill's workflow

Hand off to the `agent-md-writer` skill's Step 2, starting from Round 4 (commands — already have preliminary data from the scanner) or Round 5 (conventions). Skip Rounds 2 and 3 if the stack scanner gave complete data. Always ask Round 1 (WHY) and Round 6 (Progressive Disclosure) — those need the user's intent.

## Step 5 — Generate the file

Follow the skill's Step 3 exactly:
- Always include `Agent Behavior` (Karpathy principles from `references/karpathy-principles.md` inline snippet).
- Include `Documentation Lookup` only if `CONTEXT7_DETECTED=yes`.
- Include `UI Generation` only if `DESIGN_MD_FOUND=yes`. If UI is detected but no DESIGN.md, ask the user whether to add the section anyway (pointing at https://github.com/VoltAgent/awesome-design-md as a recource).
- Enforce the ordering: Title → Agent Behavior → Tech Stack → Project Structure → Development → Documentation Lookup → UI Generation → Key Conventions → Additional Context.
- Respect `$ARGUMENTS.target` (claude / agents / both).

## Step 6 — Progressive disclosure setup

If the user flagged task-specific workflows in Round 6, create `agent_docs/` with focused files per the skill's Step 4.

## Step 7 — Present and iterate

Show the generated file(s) and enter the skill's Step 5 iteration loop.

</process>

<success_criteria>
- Three detection subagents ran in parallel (not sequentially).
- The generated file includes `Agent Behavior` (always), plus `Documentation Lookup` and `UI Generation` only when their tooling was detected.
- Ordering matches the skill's template.
- `$ARGUMENTS.target` was respected.
- The main conversation stayed focused on user-facing questions; raw filesystem scans happened in subagent contexts.
</success_criteria>

<notes>
- This command is a **shortcut**, not a replacement. The underlying logic lives in the `agent-md-writer` skill at `SKILL.md`. When in doubt about a step, read the skill.
- The skill's `references/` directory has `template.md` (structure), `karpathy-principles.md` (inline snippet + full rationale), and `project-tooling-snippets.md` (detection heuristics + ready-to-paste snippets). Consult these for exact text.
- The parallelization is the point. If you find yourself running detectors sequentially, you're defeating the purpose of this command.
</notes>
