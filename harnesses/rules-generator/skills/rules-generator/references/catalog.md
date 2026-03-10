# Rules Catalog

Reference catalog of rule categories. Use as a starting point — always adapt to the specific project context, stack, and developer preferences. Never copy templates verbatim.

## Table of Contents

1. [Language Rules](#language-rules)
2. [Framework Rules](#framework-rules)
3. [Testing Rules](#testing-rules)
4. [Architecture & Design Rules](#architecture--design-rules)
5. [Security Rules](#security-rules)
6. [Infrastructure & DevOps Rules](#infrastructure--devops-rules)
7. [Universal Rules](#universal-rules)

---

## Language Rules

### TypeScript / JavaScript
**Detect:** `tsconfig.json`, `package.json`, `*.ts`, `*.tsx`, `*.js`, `*.jsx`
**Paths:** `"**/*.{ts,tsx}"` or `"**/*.{js,jsx}"`

Key topics:
- Naming conventions (PascalCase types/interfaces, camelCase functions/variables)
- Type safety (`any` prohibition, `unknown` preference, explicit return types)
- Import organization (external → internal → relative, named exports)
- Async patterns (error handling, no floating promises)
- Null handling (`nullish coalescing` over `||`, optional chaining)
- Strict mode enforcement

### Python
**Detect:** `pyproject.toml`, `setup.py`, `requirements.txt`, `Pipfile`, `*.py`
**Paths:** `"**/*.py"`

Key topics:
- PEP 8 naming (snake_case functions/variables, PascalCase classes)
- Type hints on all public functions
- Docstring convention (Google, NumPy, or Sphinx style)
- Import ordering (stdlib → third-party → local, use `isort` convention)
- Context managers for resources (`with` statements)
- Exception handling (specific exceptions, no bare `except`)
- f-strings over `.format()` or `%`

### Go
**Detect:** `go.mod`, `go.sum`, `*.go`
**Paths:** `"**/*.go"`

Key topics:
- Exported vs unexported naming (capitalization convention)
- Error handling patterns (check errors immediately, wrap with context)
- Interface design (small interfaces, accept interfaces return structs)
- Package organization (one package per directory, meaningful names)
- Go idioms (table-driven tests, `defer` for cleanup)
- No `init()` unless absolutely necessary

### Rust
**Detect:** `Cargo.toml`, `*.rs`
**Paths:** `"**/*.rs"`

Key topics:
- Ownership and borrowing patterns
- Error handling (`Result<T, E>`, custom error types, `thiserror`/`anyhow`)
- Naming conventions (snake_case functions, PascalCase types, SCREAMING_SNAKE constants)
- `clippy` lint compliance
- Documentation with `///` doc comments
- Avoid `.unwrap()` in production code

### Java / Kotlin
**Detect:** `pom.xml`, `build.gradle`, `*.java`, `*.kt`
**Paths:** `"**/*.java"` or `"**/*.kt"`

Key topics:
- Naming conventions (PascalCase classes, camelCase methods)
- Annotation usage patterns
- Exception handling (checked vs unchecked, custom exceptions)
- Dependency injection patterns
- Builder pattern for complex objects
- Stream API / collection patterns

### Ruby
**Detect:** `Gemfile`, `*.rb`
**Paths:** `"**/*.rb"`

Key topics:
- Ruby style (snake_case methods, PascalCase classes)
- Blocks, procs, and lambdas usage
- Rails conventions (if applicable)
- Metaprogramming guidelines (use sparingly)

---

## Framework Rules

### React
**Detect:** `react` in package.json dependencies, `*.tsx`, `*.jsx`
**Paths:** `"src/components/**/*.{tsx,jsx}"` or `"**/*.{tsx,jsx}"`

Key topics:
- Component structure (functional components only, no class components)
- Hooks patterns (custom hooks extraction, dependency arrays)
- State management (local vs global, when to lift state)
- Props (interface definitions, destructuring, default values)
- Avoid `useEffect` for derived values (use `useMemo` instead)
- Event handler naming (`handleX` / `onX` pattern)
- Key prop usage (no array index as key for dynamic lists)
- Conditional rendering patterns

### Next.js
**Detect:** `next.config.*`, `next` in package.json
**Paths:** `"src/app/**/*"` or `"app/**/*"` (App Router) / `"pages/**/*"` (Pages Router)

Key topics:
- App Router vs Pages Router conventions
- Server Components vs Client Components (`"use client"` directive)
- Data fetching patterns (Server Components, `fetch` with caching)
- Route organization (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)
- Metadata and SEO
- Image optimization (`next/image`)
- API routes organization

### Vue
**Detect:** `vue` in package.json, `*.vue`
**Paths:** `"**/*.vue"`

Key topics:
- Composition API (preferred over Options API)
- `<script setup>` syntax
- Reactive patterns (`ref`, `reactive`, `computed`)
- Component naming (PascalCase, multi-word)
- Props and emits definitions (typed)

### Angular
**Detect:** `angular.json`, `@angular/core` in package.json
**Paths:** `"src/app/**/*.ts"`

Key topics:
- Module organization
- Service injection patterns
- Reactive forms vs template-driven
- Observable patterns (RxJS best practices, unsubscribe)
- Component lifecycle management

### Express / Fastify / NestJS
**Detect:** `express`, `fastify`, or `@nestjs/core` in package.json
**Paths:** `"src/api/**/*"` or `"src/routes/**/*"` or `"src/controllers/**/*"`

Key topics:
- Route organization
- Middleware patterns
- Request validation
- Error handling middleware
- Response format consistency

### Django
**Detect:** `django` in requirements, `manage.py`, `settings.py`
**Paths:** `"**/*.py"` (scoped to app directories if possible)

Key topics:
- Model design (field types, relationships, meta options)
- View patterns (class-based vs function-based)
- Serializer conventions (DRF)
- URL naming patterns
- Migration management
- QuerySet optimization (select_related, prefetch_related)

### FastAPI
**Detect:** `fastapi` in requirements/pyproject
**Paths:** `"src/api/**/*.py"` or `"app/**/*.py"`

Key topics:
- Router organization
- Pydantic model patterns
- Dependency injection
- Response models and status codes
- Background tasks usage

### Spring Boot
**Detect:** `spring-boot-starter` in pom.xml/build.gradle
**Paths:** `"src/main/java/**/*.java"`

Key topics:
- Layer architecture (controller → service → repository)
- Bean configuration
- Exception handling (`@ControllerAdvice`)
- DTO patterns
- Configuration management

---

## Testing Rules

### Unit Testing
**Detect:** Jest, Vitest, pytest, Go test files, JUnit
**Paths:** Adapt to project's test file patterns (`**/*.test.*`, `**/*.spec.*`, `tests/**/*`, `*_test.go`)

Key topics:
- Test structure (AAA: Arrange-Act-Assert, or Given-When-Then)
- One logical assertion per test
- Descriptive test names (explain the scenario, not the implementation)
- Mocking strategy (mock external deps, never mock the unit under test)
- Test data management (factories/fixtures, avoid shared mutable state)
- Edge cases (empty, null, boundary values, error paths)
- Reset state between tests

### Integration Testing
**Detect:** Database test utilities, API test clients, `supertest`, `httpx`
**Paths:** `"tests/integration/**/*"` or `"**/*.integration.test.*"`

Key topics:
- Database setup/teardown (transactions, test databases)
- API endpoint testing patterns
- External service mocking (at the boundary)
- Test isolation

### E2E Testing
**Detect:** Playwright, Cypress, Selenium
**Paths:** `"e2e/**/*"` or `"tests/e2e/**/*"` or `"**/*.e2e.*"`

Key topics:
- Page Object Model pattern
- Selector strategy (data-testid, role-based)
- Wait strategies (no arbitrary sleeps)
- Test independence (each test self-contained)
- Visual regression considerations

---

## Architecture & Design Rules

### API Design
**Detect:** Route handlers, OpenAPI specs, GraphQL schemas
**Paths:** `"src/api/**/*"` or `"src/routes/**/*"`

Key topics:
- REST conventions (resource naming, HTTP verbs, status codes)
- Response format consistency (`{ data, error, meta }` or similar)
- Pagination patterns
- Versioning strategy
- Input validation at the boundary
- Rate limiting considerations

### Database & ORM
**Detect:** Prisma, Drizzle, SQLAlchemy, TypeORM, ActiveRecord, GORM
**Paths:** Adapt to ORM file locations (`prisma/**/*`, `src/models/**/*`, etc.)

Key topics:
- Migration naming and ordering
- Query optimization (N+1 prevention, indexing strategy)
- Transaction boundaries
- Soft delete patterns
- Seed data management
- Schema naming conventions

### Error Handling
**Detect:** Universal — every project needs this
**Paths:** Global (no paths frontmatter) or scoped to source code

Key topics:
- Custom error classes/types hierarchy
- Error propagation strategy (throw vs return)
- Logging requirements (structured logs, correlation IDs)
- User-facing vs internal error messages
- Recovery patterns (retry, fallback, circuit breaker)
- Never swallow errors silently

### State Management (Frontend)
**Detect:** Redux, Zustand, Pinia, MobX, Jotai, Recoil
**Paths:** `"src/store/**/*"` or `"src/state/**/*"`

Key topics:
- Store organization (feature-based slices)
- Action naming conventions
- Selector patterns (memoization)
- Side effect management
- State shape design

---

## Security Rules

### General Security
**Detect:** Universal
**Paths:** Global (no paths frontmatter)

Key topics:
- Never commit secrets, tokens, API keys, or passwords
- Input validation on all external data
- Output encoding for XSS prevention
- SQL injection prevention (parameterized queries)
- Authentication patterns (JWT handling, session management)
- Authorization checks (RBAC, resource ownership)
- CORS configuration
- Dependency vulnerability awareness
- HTTPS enforcement
- Sensitive data handling (PII, encryption at rest)

### Environment & Secrets
**Detect:** `.env.example`, vault configs, secrets management
**Paths:** `"*.env*"` or global

Key topics:
- `.env` files never committed
- All secrets via environment variables
- `.env.example` maintained with dummy values
- Different configs per environment (dev/staging/prod)
- Secret rotation awareness

---

## Infrastructure & DevOps Rules

### Docker
**Detect:** `Dockerfile`, `docker-compose.*`
**Paths:** `"**/Dockerfile*"` or `"**/docker-compose*"`

Key topics:
- Multi-stage builds
- Minimal base images
- Layer ordering (dependencies before source code)
- Non-root user
- `.dockerignore` maintenance
- Health checks
- No secrets in build args

### CI/CD
**Detect:** `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`
**Paths:** `".github/workflows/**/*"` or CI config paths

Key topics:
- Pipeline stage organization
- Cache strategies
- Secret management in CI
- Test requirements before merge
- Deployment approval gates
- Branch protection alignment

### Infrastructure as Code
**Detect:** `*.tf`, `pulumi/`, `cdk/`
**Paths:** `"**/*.tf"` or IaC directory paths

Key topics:
- Resource naming conventions
- Module organization
- State management
- Variable and output patterns
- Tagging strategy
- Least privilege principle

---

## Universal Rules

These categories apply to virtually every project. Consider including them by default.

### Comments & Documentation
**Detect:** Universal
**Paths:** Global (no paths frontmatter)

Key topics:
- Code should be self-documenting
- No commented-out code (delete it, git has history)
- No obvious comments ("increment counter")
- Comment the WHY, not the WHAT
- Document public APIs and non-obvious decisions
- Keep comments up-to-date (stale comments are worse than none)

### Git Conventions
**Detect:** `.git/` directory
**Paths:** Global (no paths frontmatter)

Key topics:
- Commit message format (Conventional Commits or project standard)
- Branch naming convention
- PR/MR description requirements
- No large binary files
- Rebase vs merge strategy
- Atomic commits (one logical change per commit)

### Code Organization
**Detect:** Universal
**Paths:** Global or scoped to source directories

Key topics:
- File length limits (suggest splitting over 200-300 lines)
- Function length limits (suggest splitting over 30-50 lines)
- Single Responsibility Principle
- DRY with judgment (don't over-abstract)
- Consistent file structure within feature modules
- Barrel exports (index files) — use or avoid based on project convention

### Performance
**Detect:** Large-scale projects, SPAs, APIs with high traffic
**Paths:** Scoped to relevant code areas

Key topics:
- Memoization patterns
- Lazy loading and code splitting
- Database query optimization
- Caching strategy
- Bundle size awareness
- Memory leak prevention

### Accessibility (Frontend)
**Detect:** Frontend UI code, React/Vue/Angular components
**Paths:** Component file paths

Key topics:
- Semantic HTML elements
- ARIA attributes when needed
- Keyboard navigation support
- Color contrast requirements
- Alt text for images
- Focus management
- Screen reader testing
