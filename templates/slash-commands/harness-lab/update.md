---
description: "harness-lab:update — Update harnesses to the latest version"
arguments:
  - name: harness_name
    description: Name of a specific harness to update (optional — updates all if omitted)
    required: false
  - name: scope
    description: "Scope to update in: global, project, or local (default: project)"
    required: false
---

Run the following command and show the output to the user:

If a specific harness name was provided:
```bash
harness-lab update $ARGUMENTS.harness_name --scope $ARGUMENTS.scope
```

If no harness name was provided (update all):
```bash
harness-lab update --scope $ARGUMENTS.scope
```

If no scope argument was provided, run without the --scope flag (defaults to project).
