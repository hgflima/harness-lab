---
description: "hlab:delete-harness — Remove a harness from the project registry (directory, catalog entry, README row)"
arguments:
  - name: harness_name
    description: Name of the harness to delete (must match the harnesses/<name> directory)
    required: true
---

You are removing a harness from this project's registry. This is a **maintenance tool** for the harness-lab registry — it is the inverse of `/hlab:import`. It deletes the harness directory and cleans up every registration (catalog.json, README.md) so the registry stays consistent with `.claude/rules/harness-lifecycle.md`.

The operation is destructive. Never skip the confirmation step.

Follow these steps exactly:

## Step 1 — Validate input

Read `$ARGUMENTS.harness_name`.

- If empty, stop with: `Usage: /hlab:delete-harness <harness-name>`.
- If it contains `/`, `\`, `..`, or any whitespace, stop with: `Invalid harness name: "<value>". Expected a plain slug (e.g. "prd-generator").` This guards against accidental paths that could escape `harnesses/`.

## Step 2 — Verify the harness exists

Check the three registration surfaces. The harness is considered "clean" only when ALL of them are removed, but it is valid to run this command even if the state is already partially clean (e.g. previous run failed mid-way).

1. Does the directory exist? `test -d harnesses/<harness-name>`
2. Is there a `catalog.json` entry with matching `name`?
3. Is there a `README.md` row starting with `| **<harness-name>** |`?

If NONE of the three exist, stop with an error listing the harnesses that DO exist (from `ls harnesses/` and `jq '.harnesses[].name' catalog.json`):

```
Harness "<harness-name>" not found.

Existing harnesses on disk: <list>
Existing entries in catalog.json: <list>
```

If at least one surface has it, proceed to Step 3. In Step 6 the summary will note which surfaces were already clean.

## Step 3 — Show the removal plan and ask for confirmation

Collect the concrete evidence that will be removed:

- **Directory**: `harnesses/<harness-name>/` — include the file count via `find harnesses/<harness-name> -type f | wc -l`.
- **catalog.json entry**: the full JSON object for the matching `harnesses[]` element (use `jq '.harnesses[] | select(.name == "<harness-name>")' catalog.json`).
- **README.md row**: the single line that starts with `| **<harness-name>** |` inside the `### Available Harnesses` table.

Present this preview to the user in a single block, then ask for explicit confirmation:

```
About to delete harness: <harness-name>

  Directory:     harnesses/<harness-name>/ (<file-count> files)
  catalog.json:  <matched JSON entry, or "— already absent">
  README.md:     <matched row, or "— already absent">

This cannot be undone (until the next git commit). Type the harness name to confirm, or anything else to abort.
```

Wait for the user's reply. Proceed ONLY if the reply matches `<harness-name>` exactly. Otherwise stop with `Aborted. No changes made.` and make no modifications.

## Step 4 — Remove the entry from `catalog.json`

Do NOT use `jq` to rewrite `catalog.json` in place. `jq` does not preserve the original formatting — it will expand inline arrays (like `"categories": ["product", "design"]`) into multiline form across unrelated entries, producing a huge, noisy diff. Instead, delete the entry as a contiguous block of lines, keeping the rest of the file byte-identical.

Procedure:

1. Read `catalog.json` to locate the target object. Find the line `"name": "<harness-name>"` and expand selection to the enclosing block: from the preceding `{` line (usually `    {`) through the closing `},` or `}` line of that object.
2. Remove that block — *and* the trailing comma on the previous `}` if the target was the last entry, so the JSON stays valid. If the target is not the last entry, the trailing comma belongs to the target's `},` and is removed with it.
3. Validate with `jq . catalog.json > /dev/null`. If invalid, revert and retry.

Use the Edit tool (or equivalent surgical edit) — not a full rewrite. The `git diff` on `catalog.json` should show only the removed block (typically 9 lines) and nothing else.

If no entry was matched, note it for the summary and continue — do not fail.

## Step 5 — Remove the row from `README.md`

Delete the single line in `README.md` that starts with `| **<harness-name>** |` inside the `### Available Harnesses` table. Leave the rest of the file untouched.

If no line matched, note it for the summary and continue.

## Step 6 — Delete the harness directory

Run the directory removal LAST, so that if anything in Steps 4–5 failed, the on-disk files still exist for diagnosis.

```bash
rm -rf harnesses/<harness-name>
```

If the directory did not exist (Step 2 flagged it as already clean), skip this step.

## Step 7 — Report results

Show the user a terse summary, flagging any surface that was already clean:

```
Removed harness: <harness-name>

Deleted:    harnesses/<harness-name>/ (<file-count> files)    ← or "— already absent"
Updated:    catalog.json                                       ← or "— entry already absent"
Updated:    README.md                                          ← or "— row already absent"

Next steps: review with `git status` / `git diff` and commit when ready.
```

Do NOT run `git add`, `git commit`, or `git push`. Deletion is local only; the user commits manually.
