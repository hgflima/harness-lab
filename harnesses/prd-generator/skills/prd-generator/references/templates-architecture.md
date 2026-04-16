# Templates: Technical Architecture

Use this template when generating `requirements/03-technical-architecture.md`.

The first section, **Architectural Decisions**, captures the macro choices that shape every downstream task: code organization, branch strategy, runtime, cloud, data plane, observability and CI/CD. These are load-bearing for parallelization — e.g. a worktree branch strategy enables trivial parallel lanes; serverless runtime changes the shape of E2E jobs; chosen cloud determines IaC and IAM contracts. Capture them up front, then let the rest of the document elaborate.

---

```markdown
# Technical Architecture

## Architectural Decisions

This table is the load-bearing summary of the macro architectural choices. Every subsequent section (data flow, API design, deployment, task breakdown) flows from these decisions. Fill in concrete choices — no "TBD" allowed at this layer; if a decision is genuinely open, name the candidates and the criterion that will resolve it.

### Code Organization

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Repository layout | Monorepo (Turborepo / Nx / pnpm workspaces / Bazel) **OR** Polyrepo | [Why this fits the team and deploy model] |
| Top-level structure | [e.g. `apps/`, `packages/`, `services/`] | [How code is grouped] |
| Code sharing strategy | [Internal packages, npm registry, git submodules, none] | [Trade-off between coupling and reuse] |

### Branch Strategy

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Strategy | Git worktrees **OR** feature branches **OR** trunk-based **OR** none | [Why] |
| Implication for parallel AI agents | [worktree = trivial isolation; feature branches = serialized via conflicts; trunk = small atomic commits required] | [Direct impact on Lane design in task_assignments/] |
| Branch naming convention | [e.g. `feature/<name>/lane-<x>-<focus>`] | — |

### Runtime

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Primary runtime | Containers (Docker/K8s) **OR** Serverless (Lambda/Cloud Functions/Cloud Run) **OR** VMs **OR** Edge (Workers/Deno Deploy) **OR** Hybrid | [Why] |
| Build artifact | [container image / zip bundle / native binary / SPA bundle] | — |
| Local dev parity | [docker-compose / serverless-offline / mocked / full cloud] | [How devs reproduce prod locally] |

### Cloud Provider

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Primary provider | AWS **OR** GCP **OR** Azure **OR** Vercel/Netlify **OR** Cloudflare **OR** on-prem **OR** none | [Why this provider] |
| IaC tool | Terraform / Pulumi / CDK / SAM / Bicep / none | [How infrastructure is versioned] |
| Multi-region? | [Y/N] | [If Y, replication and failover strategy] |

### Data Plane

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Primary database | Postgres / MySQL / Mongo / DynamoDB / SQLite / other | [Why] |
| Cache | Redis / Memcached / in-memory / none | [Where caching is applied] |
| Queue / event bus | SQS / Kafka / RabbitMQ / SNS / EventBridge / Pub/Sub / none | [What flows through it] |
| Object storage | S3 / GCS / Azure Blob / local filesystem / none | [What is stored] |
| Search | Elasticsearch / Algolia / Meilisearch / DB full-text / none | [If applicable] |

### Observability

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Logs | Datadog / CloudWatch / Grafana Loki / ELK / stdout-only | — |
| Metrics | Datadog / Prometheus / CloudWatch / Grafana Cloud / none | — |
| Traces | Datadog APM / OpenTelemetry / Jaeger / Honeycomb / none | — |
| Error tracking | Sentry / Rollbar / Bugsnag / built-in / none | — |
| SLO targets | [e.g. p95 < 200ms, 99.9% availability] | [Connect to security & performance doc] |

### CI/CD

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Platform | GitHub Actions / GitLab CI / CircleCI / Buildkite / Jenkins / other | — |
| Required gates | [unit tests / lint / type-check / E2E / security scan / human review] | [What must pass before merge] |
| Deploy trigger | Auto on merge to main / tag-based / manual approval | — |
| Rollback strategy | [Blue-green / canary / instant revert / manual] | [How a bad deploy is undone] |

---

## Technology Stack

### Frontend

| Technology | Version | Purpose | Justification |
|-----------|---------|---------|---------------|
| [Framework] | [X.Y.Z] | [Purpose] | [Why chosen] |

**Key Libraries:**
- **[Library]**: [Purpose]

### Backend

| Technology | Version | Purpose | Justification |
|-----------|---------|---------|---------------|
| [Framework] | [X.Y.Z] | [Purpose] | [Why chosen] |

**Key Libraries:**
- **[Library]**: [Purpose]

### Database

| Technology | Version | Purpose | Justification |
|-----------|---------|---------|---------------|
| [Database] | [X.Y.Z] | [Purpose] | [Why chosen] |

**ORM/Query Builder:** [Tool and version]

### Infrastructure & DevOps

| Technology | Version | Purpose | Justification |
|-----------|---------|---------|---------------|
| [Tool] | [X.Y.Z] | [Purpose] | [Why chosen] |

### Third-Party Services

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| [Service] | [Purpose] | [API/SDK/Webhook] |

---

## System Architecture

### High-Level Architecture

```
[Describe architecture — e.g., Frontend ↔ API Gateway ↔ Backend Services ↔ Database]
[Include external integrations]
```

**Architecture Pattern:** [MVC / Microservices / Serverless / Monolith / etc.]

**Key Components:**
1. **[Component]**: [Purpose and responsibilities]
2. **[Component]**: [Purpose and responsibilities]

### Data Flow

```
User Action → [Component A] → [Component B] → [Database] → Response
```

**Example Flow: [Use Case]**
1. User initiates [action]
2. Frontend sends request to [endpoint]
3. Backend validates and processes
4. Database query/update
5. Response sent back
6. UI updates

---

## Database Schema

### Entity Relationship Overview

```
[Describe entity relationships]
```

### Table Definitions

#### Table: `[table_name]`

**Purpose:** [What this table stores]

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | Unique identifier |
| [column] | [type] | [constraints] | [description] |

**Indexes:**
- `idx_[name]` on `([columns])` - [Purpose]

**Relationships:**
- [table_name] → [related_table] ([relationship type])

[Repeat for each table]

### Database Migrations

**Strategy:** [Approach to schema changes]
**Versioning:** [How migrations are tracked]

---

## API Specifications

### Design Principles

- **Style:** RESTful / GraphQL / gRPC
- **Versioning:** [/v1/ in URL / Header-based]
- **Authentication:** [JWT / OAuth / API Keys]
- **Rate Limiting:** [Requests per minute/hour]

### Endpoints

#### `POST /api/v1/[resource]`

**Purpose:** [What this endpoint does]
**Authentication:** Required / Optional / Public

**Request:**
```json
{
  "field1": "value",
  "field2": 123
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "uuid", "field1": "value" }
}
```

**Error Responses:**
- 400: [When/why]
- 401: [When/why]
- 404: [When/why]

**Validation:**
- `field1`: Required, string, max 255 chars
- `field2`: Required, integer, min 1

[Repeat for each endpoint]

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

---

## Component Breakdown

### Frontend Components

#### `[ComponentName]`

**Purpose:** [What it does]
**Location:** `src/components/[path]/[ComponentName].tsx`

**Props:**
```typescript
interface ComponentNameProps {
  prop1: string;
  prop2: number;
  onAction?: () => void;
}
```

**State:** [Key state items]
**Dependencies:** [Components/hooks/services used]

[Repeat for key components]

### Backend Modules

#### `[ModuleName]`

**Purpose:** [What it does]
**Location:** `src/modules/[path]/`

**Exports:**
- `[function/class]`: [Description]

**Dependencies:** [Other modules/services]

[Repeat for key modules]

---

## Data Models & Types

### TypeScript Interfaces

```typescript
interface [ModelName] {
  id: string;
  // fields
  createdAt: Date;
  updatedAt: Date;
}
```

### Validation Schemas

**Tool:** [Zod / Yup / Joi]

```typescript
const schema = z.object({
  // validation rules
});
```

---

## Integration Points

### [Service Name]

**Purpose:** [Why we integrate]
**Type:** REST API / SDK / Webhook
**Authentication:** [Method]
**Endpoints Used:** [List]
**Error Handling:** [Failure strategy]
**Rate Limits:** [Considerations]

---

## Deployment Architecture

### Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local dev | localhost |
| Staging | Pre-production | [URL] |
| Production | Live | [URL] |

### CI/CD Pipeline

1. **Build**: [What happens]
2. **Test**: [What tests run]
3. **Deploy**: [Deployment process]

**Tools:** [CI/CD tool], [Container registry], [Deployment platform]

---

## Git Workflow for Parallel Agents

AI agents working in parallel lanes need isolated workspaces to avoid conflicts during implementation. The chosen branch strategy from **Architectural Decisions** above determines how lanes are physically isolated. Apply the section that matches the project's strategy:

### If branch strategy = Git worktrees (recommended for parallel AI agents)

Each agent gets its own working directory and branch from the same repository. This is the lowest-friction option for true parallel execution.

#### Worktree Setup

```
# Create worktrees for each lane (run from main checkout)
git worktree add .worktrees/lane-a -b feature/{name}/lane-a-backend
git worktree add .worktrees/lane-b -b feature/{name}/lane-b-frontend
git worktree add .worktrees/lane-c -b feature/{name}/lane-c-infra
git worktree add .worktrees/lane-d -b feature/{name}/lane-d-e2e
```

### Branch Naming Convention

`feature/{feature-name}/lane-{letter}-{focus}`

### Shared File Ownership

Files that multiple lanes need to modify must have a single owner to prevent merge conflicts:

| Shared File | Owner Lane | Other Lanes |
|------------|-----------|-------------|
| `package.json` / dependency files | Lane C (Infra) | Request changes via contract |
| Database schema / migrations | Lane A (Backend) | Consume via contract |
| API type definitions | Lane A (Backend) | Consume as read-only |
| Test fixtures / seed data | Lane D (E2E Tests) | Consume as read-only |
| CI/CD config | Lane C (Infra) | Consume as read-only |

### Integration Workflow

1. **Batch 0 (Contracts):** Defined on feature base branch, all lanes rebase
2. **During parallel work:** Each lane commits only to its own branch/worktree
3. **At integration point:** Merge lanes into feature branch in defined order (see task_assignments/02-dependencies-critical-path.md)
4. **After integration:** Run full E2E suite on merged branch
5. **Feature complete:** Merge feature branch into main/develop via PR

### If branch strategy = Feature branches (no worktrees)

Each lane uses a separate branch off the feature base. Agents must check out their own branch in their own checkout (multiple clones) — using the same checkout serializes their work.

- **Implication for parallelization:** physical isolation requires multiple repository clones (one per agent). If agents share a single checkout, they cannot run truly in parallel — each `git checkout` swaps the working tree.
- **Conflict surface:** higher than worktrees because branches diverge longer before integration.
- **When to choose:** team is unfamiliar with worktrees, or tooling assumes single-clone (some IDEs).

### If branch strategy = Trunk-based (no long-lived branches)

All agents commit to the same branch with very small, atomic changes. Feature flags hide incomplete work.

- **Implication for parallelization:** parallelization happens at the *commit* level, not the *branch* level. Lane decomposition must produce changes small enough to land independently behind flags.
- **Conflict surface:** highest — agents step on each other constantly. Mitigated by tiny commits and aggressive integration.
- **When to choose:** team has strong feature-flag discipline and CI is fast.

### If branch strategy = None / informal

Default to creating feature branches at minimum. Document the convention in this PRD before agents start work, or merge conflicts will dominate the timeline.
```
