---
description: "harness-lab:list — List available harnesses, optionally filtered by category"
arguments:
  - name: category
    description: Category to filter by (optional). Run /harness-lab:categories to see options.
    required: false
---

Run the following command and show the output to the user:

If a category argument was provided:
```bash
harness-lab list $ARGUMENTS.category
```

If no category argument was provided, run without filtering:
```bash
harness-lab list
```
