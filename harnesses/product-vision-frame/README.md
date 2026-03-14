# product-vision-frame

Define a product's singular purpose and ruthlessly align all decisions to that vision, rejecting good ideas that do not serve the core.

## Based on

This harness is a curated derivative of the original work by **[sethmblack](https://github.com/sethmblack)**.

- **Original repository:** [sethmblack/paks-skills](https://github.com/sethmblack/paks-skills)
- **Author profile:** [github.com/sethmblack](https://github.com/sethmblack)

The original skill was imported, analyzed, and improved as part of the harness-lab curation process.

## Curation Analysis

### Score Comparison

| Criterion | Before | After |
|-----------|--------|-------|
| Frontmatter completeness | 7 | 9 |
| Trigger clarity (When to Use) | 8 | 8 |
| Input specification | 7 | 7 |
| Framework depth | 9 | 9 |
| Output format quality | 8 | 8 |
| Constraints & guardrails | 7 | 7 |
| Error handling | 7 | 7 |
| Example quality | 8 | 8 |
| Token economy | 5 | 9 |
| Reusability & modularity | 3 | 9 |

**Overall score: 6.9 → 8.7**

### Pros

1. **Strong conceptual framework** — The Jobs Vision Framework is well-structured and provides genuine strategic value
2. **Excellent output template** — The output format is comprehensive and actionable, covering problem, vision, focus grid, and elimination list
3. **Good error handling table** — Anticipates common objections and provides clear responses
4. **Rich example** — The TaskFlow example demonstrates the full output format with realistic content
5. **Clear constraints** — The constraints section prevents common pitfalls like accepting vague multi-segment visions

### Cons (before curation)

1. **Boilerplate-heavy frontmatter** — Contained unnecessary fields (`license`, `repository`, `keywords`) that added tokens without value for the runtime
2. **No harness.json manifest** — Missing the manifest file required by the harness-lab installer contract
3. **Monolithic structure** — Single file with no separation into the harness-lab artifact structure (skills/, commands/, etc.)
4. **Incorrect frontmatter author field** — Used `metadata.author` nesting instead of the flat `author` field expected by the skill contract
5. **Missing repository_url in catalog** — No proper link back to the harness-lab registry path

### Improvements Applied

1. **Cleaned frontmatter** — Removed `license`, `repository`, and `keywords` fields; kept only fields used by the runtime (`name`, `description`, `metadata.version`, `metadata.author`)
2. **Fixed author nesting** — Corrected `metadata.author` to use the proper frontmatter structure
3. **Created harness.json** — Added manifest with name, version, description, categories, author, and artifacts declaration
4. **Structured as harness** — Organized into `skills/product-vision-frame/SKILL.md` following harness-lab conventions
5. **Registered in catalog.json** — Added entry with proper category, author, repository_url, and path
6. **Updated author to curator** — Changed author from `sethmblack` to `hgflima` to reflect the curated derivative
7. **Added attribution** — Created this README with full credit to the original author and repository
8. **Updated repository_url** — Points to the harness-lab registry path instead of the original repository
