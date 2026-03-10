---
description: Uninstall a harness from your project
arguments:
  - name: harness_name
    description: Name of the harness to uninstall
    required: true
  - name: scope
    description: "Scope to uninstall from: global, project, or local (default: project)"
    required: false
---

Run the following command and show the output to the user:

```bash
harness-lab uninstall $ARGUMENTS.harness_name --scope $ARGUMENTS.scope
```

If no scope argument was provided, run without the --scope flag (defaults to project):

```bash
harness-lab uninstall $ARGUMENTS.harness_name
```
