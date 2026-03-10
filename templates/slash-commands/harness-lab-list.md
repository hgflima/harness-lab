---
description: List available harnesses from harness-lab, optionally filtered by category
arguments:
  - name: category
    description: Category to filter by (optional). Run /harness-lab-categories to see options.
    required: false
---

Run the following command and show the output to the user:

```bash
harness-lab list $ARGUMENTS.category
```
