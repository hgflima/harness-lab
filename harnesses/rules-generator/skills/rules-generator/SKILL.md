---
name: rules-generator
description: Analyze a project's stack and generate tailored .claude/rules/ files. Use this skill whenever the user wants to set up, scaffold, or improve their .claude/rules/ directory, or when they mention "rules files", "claude rules", "project rules", "generate rules", "rules generator", or ask things like "what rules should I have for this project". Also trigger when the user says they want Claude to better understand their codebase conventions, or asks about organizing coding standards for Claude Code.
context: fork
---

# Rules Generator

Analyze a project's codebase, understand its technology stack, interview the developer about their preferences, and generate a complete set of `.claude/rules/` files tailored to the project.

## Why this matters

`.claude/rules/` files are how you give Claude persistent, scoped instructions for a project. But most developers don't know which rules they need, or they forget important ones. This skill closes that gap: it reads the project, asks smart questions, and produces a full set of rule files — with proper `paths` frontmatter so each rule only activates when relevant.

## Instructions

Follow these four phases in order. Interact with the developer throughout — this is a collaborative process, not a silent generation.

**Language detection:** Detect the developer's language from their first message (or from CLAUDE.md if it contains language cues). Conduct the entire interaction in that language. Write rule file *content* in English (since rules are typically committed to repos with international teams), but all conversation, explanations, and questions should be in the developer's language.

---

## Phase 1: Discovery

Goal: understand the project's stack, structure, and existing conventions.

### Step 1.1 — Read project memory files

Read these files if they exist (silently skip missing ones):

- `CLAUDE.md` or `.claude/CLAUDE.md`
- `AGENT.md`
- `CLAUDE.local.md`
- Any existing files in `.claude/rules/`

Extract: tech stack, languages, frameworks, build tools, test frameworks, coding standards already documented, project structure patterns.

### Step 1.2 — Scan project signals

Look for these files to detect the stack automatically:

| Signal file | What it reveals |
|---|---|
| `package.json` | JS/TS ecosystem, frameworks (React, Next, Vue, Angular, Express, Nest), test runners (Jest, Vitest, Playwright), linters |
| `tsconfig.json` | TypeScript usage and config |
| `pyproject.toml`, `setup.py`, `requirements.txt` | Python ecosystem, frameworks (Django, FastAPI, Flask) |
| `go.mod` | Go modules and dependencies |
| `Cargo.toml` | Rust crates and features |
| `Gemfile` | Ruby/Rails ecosystem |
| `pom.xml`, `build.gradle` | Java/Kotlin ecosystem (Spring, etc.) |
| `.eslintrc*`, `biome.json`, `.prettierrc*` | Linting and formatting config |
| `Dockerfile`, `docker-compose*` | Containerization |
| `.github/workflows/`, `.gitlab-ci.yml` | CI/CD pipeline |
| `terraform/`, `*.tf` | Infrastructure as Code |
| `prisma/`, `drizzle.config.*` | ORM / database layer |
| `openapi.yaml`, `swagger.*` | API specification |
| `.env.example` | Environment variable patterns |
| `tailwind.config.*` | CSS framework |
| `next.config.*`, `nuxt.config.*`, `vite.config.*` | Meta-framework config |
| `jest.config.*`, `vitest.config.*`, `pytest.ini`, `playwright.config.*` | Test configuration |
| `monorepo signals` (`pnpm-workspace.yaml`, `lerna.json`, `nx.json`, `turbo.json`) | Monorepo structure |

Also scan the top-level directory structure (`ls -la` and key subdirectories) to understand the project layout.

### Step 1.3 — Check existing rules

If `.claude/rules/` already exists, read all files there. Note:
- Which topics are already covered
- Quality level of existing rules (specific vs vague)
- Any gaps based on the detected stack

Summarize what you found to the developer before moving to Phase 2.

---

## Phase 2: Interview

Goal: understand the developer's preferences, team conventions, and priorities.

Ask questions ONE AT A TIME. Don't dump a wall of questions. Adapt based on the stack you detected in Phase 1.

### Core questions (always ask)

1. **Team context**: "Is this a solo project or team project? If team, roughly how many developers?" — This affects whether rules should be strict or flexible, and whether to include onboarding-friendly comments.

2. **Existing standards**: "Do you have coding standards documented elsewhere (wiki, Confluence, linter configs)? Should I incorporate them?" — Avoid duplicating what linters already enforce.

3. **Pain points**: "What mistakes does Claude (or your team) make most often in this codebase? What would you most want rules to prevent?" — This is gold for prioritizing rules.

4. **Testing philosophy**: "How do you approach testing? (TDD, test-after, coverage targets, specific patterns like AAA or Given-When-Then?)" — Only ask if test files were detected.

5. **Strictness level**: "Do you prefer strict, opinionated rules (Claude follows exactly) or flexible guidelines (Claude uses judgment)?" — This shapes the tone of every rule file.

### Conditional questions (ask based on detected stack)

- **If API code detected**: "Do you follow REST conventions? Do you have a standard response format or error handling pattern?"
- **If database/ORM detected**: "Any database conventions? (migration naming, query patterns, N+1 prevention?)"
- **If frontend framework detected**: "Component structure preferences? State management patterns? Accessibility requirements?"
- **If monorepo detected**: "Should rules be scoped per package/app, or shared across the monorepo?"
- **If Docker/infra detected**: "Any deployment conventions or security hardening patterns you want enforced?"
- **If multiple languages detected**: "Should each language have its own rule files, or do you prefer consolidated rules?"

### Closing question

"Anything else you want Claude to always keep in mind when working on this project? Any pet peeves or non-obvious conventions?"

---

## Phase 3: Generation

Goal: produce a tailored set of rule files based on everything learned.

### Step 3.1 — Consult the catalog

Read `references/catalog.md` from this skill's directory. It contains rule templates organized by category. Use it as a starting point — never copy templates verbatim. Every rule file must be adapted to the specific project context, stack, and developer preferences gathered in Phases 1-2.

### Step 3.2 — Select which rules to generate

Based on the discovered stack and developer answers, select which rule categories apply. Consider:

- **Always relevant**: comments, error-handling, security-basics, git-conventions
- **Language-specific**: one file per primary language (typescript, python, go, rust, etc.)
- **Framework-specific**: only if that framework is actually used (react, nextjs, django, etc.)
- **Testing**: if test files or test config exist
- **API design**: if API endpoints exist
- **Database**: if ORM/database code exists
- **Infrastructure**: if Docker/CI/CD/IaC files exist
- **Accessibility**: if frontend UI code exists
- **Performance**: if the developer mentioned performance concerns or if the project is large-scale

Don't over-generate. 5-10 rule files is usually the sweet spot. More than 12 and the developer probably won't maintain them.

### Step 3.3 — Draft rule files

For each selected category, write a rule file following this format:

```markdown
---
paths:
  - "glob/pattern/here"
---

## [Topic] Rules

### [Section]
- Specific, actionable instruction
- Another instruction with rationale when not obvious

### [Section]
- More instructions
```

**Quality checklist for each rule file:**

- [ ] Has `paths` frontmatter with accurate glob patterns (omit paths only for truly global rules like comments or git conventions)
- [ ] Instructions are specific enough to verify ("use 2-space indentation" not "format nicely")
- [ ] No duplication with what linters/formatters already enforce
- [ ] Doesn't contradict other rule files
- [ ] Under 50 lines (concise rules get better adherence)
- [ ] Includes an example when the pattern isn't obvious
- [ ] Adapts to the project's actual structure (correct directory paths in globs)

### Step 3.4 — Organize the directory structure

Suggest a directory layout. For most projects, a flat structure works:

```
.claude/rules/
├── typescript.md
├── react.md
├── testing.md
├── api-design.md
├── error-handling.md
├── comments.md
└── security.md
```

For monorepos or large projects, use subdirectories:

```
.claude/rules/
├── shared/
│   ├── comments.md
│   └── security.md
├── frontend/
│   ├── react.md
│   └── styling.md
└── backend/
    ├── api-design.md
    └── database.md
```

---

## Phase 4: Approval & Creation

Goal: present the full plan, get approval, then create the files.

### Step 4.1 — Present the plan

Show the developer:
1. The proposed directory structure
2. For each rule file: the filename, what it covers, and the full content

Format the presentation clearly. Group related files together. Highlight any rules that were directly inspired by their pain points or preferences.

### Step 4.2 — Collect feedback

Ask: "Would you like to approve all of these, modify any, or remove some?"

Common feedback patterns:
- "Remove X" → drop that file
- "Merge X and Y" → combine into one file
- "Make X stricter/looser" → adjust tone and specificity
- "Add a rule about Z" → draft an additional file

Iterate until the developer is satisfied.

### Step 4.3 — Create the files

Once approved:
1. Create `.claude/rules/` directory if it doesn't exist
2. Write each approved rule file
3. Confirm creation with a summary: "Created N rule files in `.claude/rules/`"

If existing rules files would be overwritten, ALWAYS ask for explicit confirmation first.

---

## Examples

### Example rule file: TypeScript

```markdown
---
paths: "**/*.{ts,tsx}"
---

## TypeScript Rules

### Naming Conventions
- PascalCase for interfaces, types, classes, components
- camelCase for functions, variables, methods
- SCREAMING_SNAKE_CASE for constants
- kebab-case for file names

### Type Safety
- NO `any` without explicit justification comment
- NO `@ts-ignore` or `@ts-expect-error` without explanation
- Prefer `unknown` over `any` when type is truly unknown
- Use explicit return types on exported functions

### Imports
- Group imports: external → internal → relative
- Use named exports over default exports
- No circular dependencies
```

### Example rule file: Testing

```markdown
---
paths: "**/*.{test,spec}.{ts,tsx,js,jsx}"
---

## Testing Rules

### Structure
- Use BDD-style comments: #given, #when, #then
- One logical assertion per test
- Descriptive test names that explain the scenario

### Mocking
- Mock external dependencies (APIs, databases)
- Don't mock the unit under test
- Reset mocks between tests

### Coverage
- Test happy path AND error cases
- Test edge cases (empty, null, boundary values)
- Test async behavior (loading, success, error states)
```

### Example rule file: Comments (global, no paths)

```markdown
## Comment Policy

### Unacceptable Comments
- Comments that repeat what code does
- Commented-out code (delete it)
- Obvious comments ("increment counter")
- Comments instead of good naming

### Principle
Code should be self-documenting. If you need a comment to explain WHAT the code does, consider refactoring to make it clearer.
```
