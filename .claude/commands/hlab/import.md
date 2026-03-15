---
description: "harness-lab:import — Import harnesses from any GitHub repository URL into the harnesses/ registry"
arguments:
  - name: github_url
    description: GitHub URL to a repo, branch, or subdirectory (e.g. https://github.com/user/repo/tree/main/path/to/harness)
    required: true
  - name: harness_name
    description: "Override the harness name (defaults to directory/repo name from URL)"
    required: false
---

You are importing AI agent harnesses from a GitHub URL into this project's `harnesses/` directory. This is a **curation tool** for the harness-lab registry — it copies artifacts into the project structure and updates `catalog.json`.

Follow these steps exactly:

## Step 1 — Parse the GitHub URL

Extract components from `$ARGUMENTS.github_url`:

- `owner` — GitHub user or org
- `repo` — repository name
- `branch` — branch or tag (default: `main`)
- `subpath` — subdirectory path within the repo (may be empty)

Common URL patterns:
- `https://github.com/owner/repo` → root of default branch
- `https://github.com/owner/repo/tree/branch` → root of specific branch
- `https://github.com/owner/repo/tree/branch/path/to/dir` → subdirectory

Determine the **harness name**:
1. If `$ARGUMENTS.harness_name` is provided, use it.
2. Otherwise, use the last segment of `subpath` (e.g. `path/to/readme` → `readme`).
3. If no subpath, use the `repo` name.

## Step 2 — Clone the repository

Run:
```bash
TEMP_DIR=$(mktemp -d)
git clone --depth 1 --branch <branch> https://github.com/<owner>/<repo>.git "$TEMP_DIR/repo"
```

If the URL includes a subpath, set the working root to `$TEMP_DIR/repo/<subpath>`. Otherwise use `$TEMP_DIR/repo`.

If `git clone` fails, show an error and clean up with `rm -rf "$TEMP_DIR"`.

## Step 3 — Analyze the directory structure

List the contents of the working root. Detect artifact types using these rules **in priority order**:

1. **Complete harness** — A `harness.json` file exists at the working root. Read its `artifacts` field to know what to install. Each artifact entry specifies a type and path.

2. **Skill** — Any directory containing a `SKILL.md` file. The entire directory tree is the skill (including `references/`, `scripts/`, `evals/`, and any other files/subdirs).

3. **Commands** — `.md` files inside a `commands/` directory. Each `.md` file is a command. Also include any sibling subdirectories (like `references/`, `scripts/`) that belong to the same command.

4. **Agents** — `.md` files inside an `agents/` directory. Same structure as commands.

5. **Rules** — `.md` files inside a `rules/` directory. Same structure as commands.

6. **Single command** — A single `.md` file at the root that contains YAML frontmatter with a `description:` field. This is a standalone slash command.

7. **None detected** — If none of the above patterns match, show an error:
   ```
   No valid AI agent artifacts found at the given URL.
   Expected: harness.json, SKILL.md, or .md files in commands/, agents/, or rules/ directories.
   ```
   Then clean up the temp dir and stop.

## Step 4 — Install artifacts into `harnesses/<harness-name>/`

The destination is always `harnesses/<harness-name>/` in the **project root** (the directory containing `catalog.json`).

### Complete harness (has harness.json)
Copy the **entire directory tree** from the working root into `harnesses/<harness-name>/`:
```bash
mkdir -p harnesses/<harness-name>
cp -R <working-root>/* harnesses/<harness-name>/
```

### Skills (directories containing SKILL.md)
```
harnesses/<harness-name>/skills/<skill-name>/ ← copy the ENTIRE directory tree
```
The `<skill-name>` is the directory name containing `SKILL.md`.

### Commands (.md files from commands/)
```
harnesses/<harness-name>/commands/<command-name>.md ← copy the .md file
harnesses/<harness-name>/commands/<command-name>/ ← copy any accompanying subdirectories (references/, scripts/, etc.)
```
The `<command-name>` is the .md filename without extension.

### Agents (.md files from agents/)
```
harnesses/<harness-name>/agents/<agent-name>.md ← copy the .md file
harnesses/<harness-name>/agents/<agent-name>/ ← copy any accompanying subdirectories
```

### Rules (.md files from rules/)
```
harnesses/<harness-name>/rules/<rule-name>.md ← copy the .md file
harnesses/<harness-name>/rules/<rule-name>/ ← copy any accompanying subdirectories
```

### Single root command (.md with frontmatter)
```
harnesses/<harness-name>/commands/<filename>.md ← copy the file
```
Also copy any subdirectories in the working root that look like supporting dirs (references/, scripts/, etc.) into `harnesses/<harness-name>/commands/<filename>/`.

**Important:** Always create parent directories with `mkdir -p` before copying. Use `cp -R` for directory copies to preserve structure.

## Step 4.5 — Rename artifacts if `harness_name` differs from source name

Determine the **original name**: the last segment of `subpath` (e.g. `path/to/readme` → `readme`), or the `repo` name if no subpath.

**Skip this step** if `$ARGUMENTS.harness_name` was not provided, or if `harness_name` equals `original_name`.

When renaming is needed, apply these rules inside `harnesses/<harness-name>/`:

### Skills
1. Rename directory: `skills/<original_name>/` → `skills/<harness_name>/`
2. Inside `skills/<harness_name>/SKILL.md`, replace the frontmatter `name: <original_name>` with `name: <harness_name>`

### Commands
1. Rename file: `commands/<original_name>.md` → `commands/<harness_name>.md`
2. Inside the renamed file, update any occurrence of `original_name` in the YAML frontmatter `description:` field to `harness_name`

### Agents
1. Rename file: `agents/<original_name>.md` → `agents/<harness_name>.md`
2. Inside the renamed file, update any occurrence of `original_name` in the YAML frontmatter `description:` field to `harness_name`

### Rules
1. Rename file: `rules/<original_name>.md` → `rules/<harness_name>.md`

### Complete harnesses (has harness.json)
1. Update `harness.json` field `"name"` to `harness_name`
2. Update all entries in the `artifacts` arrays (skills, commands, agents) from `original_name` to `harness_name`
3. Apply the per-type renaming rules above for each artifact listed in `harness.json`

## Step 5 — Ensure `harness.json` exists

If a `harness.json` was NOT present in the source (i.e. the source was not a complete harness), **generate one** at `harnesses/<harness-name>/harness.json`:

```json
{
  "name": "<harness-name>",
  "version": "1.0.0",
  "description": "<extracted from README.md or SKILL.md first paragraph, or leave as empty string>",
  "categories": [],
  "author": "<owner from GitHub URL>",
  "artifacts": {
    "skills": ["<detected skill names>"],
    "commands": ["<detected command names>"],
    "agents": ["<detected agent names>"],
    "hooks": []
  }
}
```

To extract the description:
1. Check for `README.md` in the working root — use the first non-heading paragraph.
2. If no README, check `SKILL.md` — use the first non-heading paragraph.
3. If neither exists, use an empty string `""`.

If a `harness.json` WAS present in the source, it was already copied in Step 4 and renamed in Step 4.5 if applicable. No action needed.

**Note:** When renaming occurred in Step 4.5, ensure artifact names in the `artifacts` arrays use `harness_name`, not `original_name`.

## Step 6 — Update `catalog.json`

Read `catalog.json` from the project root. Add a new entry to the `harnesses` array:

```json
{
  "name": "<harness-name>",
  "version": "<from harness.json>",
  "description": "<from harness.json>",
  "categories": ["<from harness.json categories>"],
  "author": "<from harness.json>",
  "path": "harnesses/<harness-name>"
}
```

**If an entry with the same `name` already exists**, update it in place instead of adding a duplicate.

Write the updated `catalog.json` back to disk.

## Step 6.5 — Update `README.md`

Open `README.md` in the project root. Find the **"Available Harnesses"** table (a Markdown table under the `### Available Harnesses` heading).

Add a new row to the table:

```
| **<harness-name>** | <description from harness.json> | <author from harness.json> |
```

**If a row with the same harness name already exists**, update it in place instead of adding a duplicate.

Keep the table sorted alphabetically by harness name.

## Step 7 — Clean up

```bash
rm -rf "$TEMP_DIR"
```

## Step 8 — Report results

Show the user a summary of what was imported:

```
Imported from: <github_url>
Target: harnesses/<harness-name>/

Installed artifacts:
  - [skill] <name>
  - [command] <name>
  - [agent] <name>
  - [rule] <name>

Renamed artifacts: <original_name> → <harness_name>   ← only if renaming occurred
Updated: catalog.json, README.md
Created: harnesses/<harness-name>/harness.json   ← only if generated
```

If any individual artifact failed to copy, report it as a warning but continue with the rest.
