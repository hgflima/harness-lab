---
description: "harness-lab:install — Install a harness into your project"
arguments:
  - name: harness_name
    description: Name of the harness to install. Run /harness-lab:list to see options.
    required: true
  - name: scope
    description: "Installation scope: global, project, or local (default: project)"
    required: false
---

Run the following command and show the output to the user:

If a scope argument was provided:
```bash
harness-lab install $ARGUMENTS.harness_name --scope $ARGUMENTS.scope
```

If no scope argument was provided, run without the --scope flag (defaults to project):
```bash
harness-lab install $ARGUMENTS.harness_name
```
