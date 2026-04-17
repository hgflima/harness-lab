---
description: "heal:migrate — Migrate a legacy `lessons-learned` installation to the new `heal` structure. Moves runtime data from `.claude/lessons-learned/` to `.claude/heal/` and removes the legacy skill install at `.claude/skills/lessons-learned/`. Safe and idempotent — detects state and confirms before acting. Run this once in each project where `lessons-learned` was previously installed, after installing `heal`."
---

You are running the `/heal:migrate` command. Your job is to migrate a legacy `lessons-learned` harness installation in the current working directory to the new `heal` structure. Act carefully — this command moves and deletes files.

## Scope

The migration only touches paths under `.claude/` in the current working directory:

- **Runtime data:** `.claude/lessons-learned/` → `.claude/heal/` (holds the changelog: `index.json` and per-component JSON files)
- **Legacy skill install:** `.claude/skills/lessons-learned/` (should be removed; the new skill lives at `.claude/skills/heal/`)

Never touch anything outside `.claude/`. Never touch the parent repo's `.git`.

## Procedure

### Step 1 — Detect state

Report the presence/absence of each of the four relevant paths:

1. `.claude/lessons-learned/` (legacy data)
2. `.claude/skills/lessons-learned/` (legacy skill)
3. `.claude/heal/` (new data — may exist from prior migration or parallel use)
4. `.claude/skills/heal/` (new skill — should already be installed via `harness-lab install heal`)

Present the findings as a short table or bullet list.

### Step 2 — Decide what to do

Based on state:

| Legacy data present? | New data present? | Action |
|---|---|---|
| Yes | No | Move legacy → new (the main case) |
| Yes | Yes (non-empty) | **Abort.** Both exist with content. Ask the user to merge manually — do not overwrite. |
| Yes | Yes (empty / only empty subdirs) | Remove empty `.claude/heal/`, then move legacy → new |
| No | Yes | Nothing to migrate. Report "already migrated" and continue to step 4 for skill cleanup. |
| No | No | Nothing to migrate. Tell the user the project has no `heal` runtime data yet — that's fine. Continue to step 4. |

Also check whether the new skill `.claude/skills/heal/` is installed. If not, warn the user to run `harness-lab install heal` before relying on the skill — but still proceed with the data migration.

### Step 3 — Confirm with the user

Before any `mv` or `rm`, present a plan like:

> I will:
> - Move `.claude/lessons-learned/` → `.claude/heal/`
> - Remove `.claude/skills/lessons-learned/` (legacy skill install)
>
> Proceed?

Wait for explicit approval. If the user declines, exit without side effects.

### Step 4 — Execute

Use the Bash tool. Keep each step one command; do not chain destructive `mv`/`rm` with other work:

```bash
# Data migration (only if legacy data exists and new data does not)
mv .claude/lessons-learned .claude/heal
```

```bash
# Legacy skill cleanup (only if the legacy skill dir exists)
rm -rf .claude/skills/lessons-learned
```

Run commands conditionally based on the state detected in step 1 — do not run a `mv` if there is nothing to move, and do not run `rm -rf` on a path that does not exist.

### Step 5 — Report

Print a concise summary:
- What was moved, what was removed, what was skipped
- Whether `.claude/skills/heal/` is present (if not, remind the user to install)
- Suggested next step: "Try invoking the `heal` skill to confirm the migration worked — your prior changelog entries under `.claude/heal/` remain intact."

## Idempotency

Running `/heal:migrate` a second time must be a no-op if the first run succeeded. Step 2's state table covers this: if legacy paths are gone and new paths exist, report "already migrated" and exit.

## What this command does NOT do

- It does not modify the content of changelog JSON files. The data format is identical between `lessons-learned` and `heal`; only the directory name changes.
- It does not install the `heal` skill. Use `harness-lab install heal` for that.
- It does not touch global (`~/.claude/`) installs — only the cwd's `.claude/`. If the user had `lessons-learned` installed globally, they must re-run `/heal:migrate` from a cwd of `~` or migrate manually.
