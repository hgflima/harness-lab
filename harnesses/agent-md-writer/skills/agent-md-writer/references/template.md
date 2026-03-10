# Agent Onboarding File Template

This template works for both CLAUDE.md and AGENT.md — they share the same structure. Adapt it to each project. Not every section is needed, and some projects need sections not listed here. Comments in `<!-- -->` are guidance for you (the skill); do not include them in the output.

---

# [Project Name]

<!-- WHY section: 1-3 sentences. What it does, who it's for, why it exists. -->

[One-liner description of the project and its purpose.]

## Tech Stack

<!-- WHAT section: Only list what's not obvious from package.json/Cargo.toml/go.mod/Gemfile/etc. -->
<!-- Focus on non-obvious choices and key architectural decisions. -->

- **Language:** [e.g., TypeScript 5.x]
- **Framework:** [e.g., Next.js 14 (App Router)]
- **Database:** [e.g., PostgreSQL via Prisma]
- **Key libraries:** [only the ones that shape how code is written]

## Project Structure

<!-- WHAT section: Only document non-obvious conventions. -->
<!-- Skip boilerplate folders that follow framework defaults. -->

```
src/
├── app/          — Pages and routing
├── lib/          — Shared utilities and business logic
├── components/   — UI components (organized by feature)
└── db/           — Database schema and migrations
```

<!-- Add notes about structural conventions that aren't obvious: -->
<!-- e.g., "Feature folders contain their own types, hooks, and tests" -->

## Development

<!-- HOW section: The commands someone needs on day one. -->

```bash
# Install dependencies
[command]

# Run development server
[command]

# Run tests
[command]

# Run linter/formatter
[command]

# Build for production
[command]
```

<!-- If environment variables are needed, mention .env.example -->
<!-- If database setup is needed, mention briefly and point to docs -->

## Key Conventions

<!-- Only include conventions that: -->
<!-- 1. Are NOT enforced by a linter/formatter -->
<!-- 2. Apply to EVERY session (not task-specific) -->
<!-- 3. Would cause real problems if violated -->

- [Convention 1 — e.g., "All API responses use the ApiResponse<T> wrapper type"]
- [Convention 2 — e.g., "Database migrations are created via `prisma migrate dev`, never edited by hand"]
- [Convention 3 — e.g., "Error handling uses the Result pattern, not try/catch"]

## Additional Context

<!-- Progressive disclosure: point to separate files for task-specific knowledge. -->
<!-- Only include this section if there are additional docs. -->
<!-- Use clear descriptions so the agent knows WHEN to read each file. -->

For task-specific guidance, see:

- `agent_docs/testing.md` — Test patterns, fixtures, and integration test setup
- `agent_docs/deploying.md` — Deployment pipeline, staging vs production, rollback
- `agent_docs/api-design.md` — API versioning, error codes, pagination patterns

---

## Sizing Guide

| Project Complexity | Target Lines | Sections to Include |
|---|---|---|
| Small (script, CLI tool) | 30-60 | Description, Dev commands, 1-2 conventions |
| Medium (web app, API) | 60-150 | All sections, light progressive disclosure |
| Large (monorepo, platform) | 150-300 | All sections, heavy progressive disclosure |

Line count covers the onboarding file only. Progressive disclosure files don't count against this budget.

## Progressive Disclosure File Template

Each file should follow this structure:

```markdown
# [Topic]

<!-- When should the agent read this file? -->

## Overview
[2-3 sentences on what this covers]

## [Main Content Sections]
[Organized by what someone needs to know to do the task]

## Common Pitfalls
[Things that go wrong and how to avoid them]
```

Keep each file focused on one topic. Target 50-150 lines. If a file grows beyond 300 lines, split it or add a table of contents.
