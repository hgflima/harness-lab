---
description: "Release a new version of harness-lab to npm. Runs tests, validates registry sync, bumps version, commits, tags, pushes, and publishes."
arguments:
  - name: bump
    description: "Version bump type: patch, minor, or major"
    required: true
---

You are releasing a new version of harness-lab to npm. Follow these steps exactly. If any step fails, stop immediately and report the error — do not continue to the next step.

## Step 1 — Validate bump argument

Check that `$ARGUMENTS.bump` is one of: `patch`, `minor`, `major`.

If it is not, show this error and stop:

```
Error: Invalid bump type "$ARGUMENTS.bump".
Usage: /release <patch|minor|major>
```

## Step 2 — Pre-flight checks

Run these checks in sequence. Each must pass before proceeding to the next.

### 2a. Clean working tree

```bash
git status --porcelain
```

Output must be empty. If not:
```
Error: Working tree is not clean. Commit or stash your changes before releasing.
```

### 2b. Correct branch

```bash
git branch --show-current
```

Output must be `main`. If not:
```
Error: You must be on the "main" branch to release. Current branch: <branch>.
```

### 2c. npm authentication

```bash
npm whoami
```

Must succeed (exit code 0). If it fails:
```
Error: Not logged into npm. Run `npm login` first.
```

### 2d. No unpushed commits

```bash
git fetch origin main
```

Then compare:
```bash
git rev-parse HEAD
git rev-parse origin/main
```

Both must be equal. If not:
```
Error: Local main is ahead of origin. Push your commits first with `git push origin main`.
```

## Step 3 — Run tests

```bash
node --test 'test/**/*.test.js'
```

If the exit code is non-zero, show the test output and stop:
```
Error: Tests failed. Fix the failing tests before releasing.
```

## Step 4 — Verify registry sync invariants

Read `catalog.json` from the project root. For each entry in the `harnesses` array, verify:

1. **Directory exists**: `harnesses/<name>/` directory exists on disk.
2. **Manifest exists**: `harnesses/<name>/harness.json` exists and is valid JSON.
3. **Name matches**: `harness.json` `name` field matches the directory name and the `catalog.json` entry name.
4. **Version matches**: `harness.json` `version` field matches the `catalog.json` entry `version`.

Then read `README.md` and find the **"Available Harnesses"** table (under the `### Available Harnesses` heading). Verify:

5. **All harnesses listed**: Every harness `name` in `catalog.json` appears as a bold entry (`**<name>**`) in the README table.
6. **Count matches**: The number of data rows in the README table equals the number of entries in `catalog.json` `harnesses` array.

Also verify the reverse direction:

7. **No orphan directories**: Every directory under `harnesses/` that contains a `harness.json` has a corresponding entry in `catalog.json`.

If ANY invariant fails, list ALL violations in a numbered list and stop:
```
Error: Registry sync violations found:

1. harness "foo" in catalog.json has no directory at harnesses/foo/
2. harness "bar" version mismatch: catalog.json says 1.0.0, harness.json says 1.1.0
3. harness "baz" missing from README table

Fix these issues in a separate commit before releasing.
```

## Step 5 — Bump version

Read the current `version` field from `package.json`. Parse it as `major.minor.patch` and apply the bump:

- `patch`: increment patch (e.g. `1.0.2` → `1.0.3`)
- `minor`: increment minor, reset patch (e.g. `1.0.2` → `1.1.0`)
- `major`: increment major, reset minor and patch (e.g. `1.0.2` → `2.0.0`)

Update only the `version` field in `package.json`. Preserve all other content and formatting.

Display: `Version: <old> → <new>`

## Step 6 — Commit, tag, and push

```bash
git add package.json
git commit -m "release: v<new-version>"
git tag v<new-version>
git push origin main --tags
```

If the tag already exists (`git tag` fails), stop:
```
Error: Tag v<new-version> already exists. This version may have already been released.
```

## Step 7 — Publish to npm

```bash
npm publish
```

If this fails, warn the user clearly:
```
Warning: npm publish failed, but the commit and tag have already been pushed.
You can retry manually with: npm publish
```

## Step 8 — Report

Show the release summary:

```
Release complete!

  Version: <old> → <new>
  Git tag: v<new-version>
  npm: https://www.npmjs.com/package/harness-lab

  Verify: npm info harness-lab version
  GitHub Release (optional): https://github.com/hgflima/harness-lab/releases/new?tag=v<new-version>
```
