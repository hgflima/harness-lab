# Templates: Technical Architecture

Use this template when generating `requirements/03-technical-architecture.md`.

---

```markdown
# Technical Architecture

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

AI agents working in parallel lanes need isolated workspaces to avoid conflicts during implementation. The recommended approach is **git worktrees** — each agent gets its own working directory and branch from the same repository.

### Worktree Setup

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
```
