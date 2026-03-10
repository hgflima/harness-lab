# Templates: Security & Performance

Use this template when generating `requirements/04-security-and-performance.md`.

---

```markdown
# Security & Performance

## Security Requirements

### Authentication

**Method:** [JWT / Session-based / OAuth]

**Implementation:**
- Token expiration: [Duration]
- Refresh token: [Yes/No and details]
- Token storage: [Where and how]
- Logout mechanism: [How it works]

**MFA:**
- Required for: [Which user types]
- Methods: [SMS / Email / Authenticator app]

### Authorization

**Model:** [RBAC / ABAC / ACL]

| Role | Permissions | Description |
|------|------------|-------------|
| [Role] | [Permissions] | [Description] |

### Data Protection

#### Data at Rest
- **Encryption:** [Algorithm and key management]
- **Database:** [Encryption method]
- **File Storage:** [Encryption method]

#### Data in Transit
- **HTTPS/TLS:** [Version]
- **Certificate Management:** [Process]

#### Sensitive Data Handling

| Data Type | Classification | Handling |
|-----------|---------------|----------|
| Passwords | Critical | Bcrypt/Argon2, never logged |
| PII | High | Encrypted, access logged |
| [Type] | [Level] | [Requirements] |

**Compliance:**
- GDPR: [Measures]
- CCPA: [Measures]
- [Other]: [Measures]

### Input Validation

**Frontend:**
- [Field]: [Rules]

**Backend:**
- Schema validation: [Tool]
- SQL injection: Parameterized queries/ORM
- XSS prevention: [Sanitization approach]
- CSRF protection: [Token-based]

**File Uploads:**
- Allowed types: [List]
- Max size: [Size]
- Virus scanning: [Yes/No]

### API Security

**Rate Limiting:**
- Anonymous: [X] req/[timeframe]
- Authenticated: [Y] req/[timeframe]

**CORS:**
- Allowed origins: [List]
- Allowed methods: [List]
- Credentials: [Yes/No]

---

## Performance Requirements

### Response Time Targets

| Operation | Target (p50) | Target (p95) | Target (p99) |
|-----------|-------------|-------------|-------------|
| Page load | [X]ms | [Y]ms | [Z]ms |
| API response | [X]ms | [Y]ms | [Z]ms |
| Search | [X]ms | [Y]ms | [Z]ms |
| File upload | [X]s | [Y]s | [Z]s |

### Throughput

- **Concurrent users:** [Target]
- **Requests/second:** [Target]
- **Data processing:** [Volume/timeframe]

### Scalability

**Horizontal scaling:**
- [Component]: [How it scales]

**Vertical scaling:**
- [Component]: [Resource limits]

**Auto-scaling triggers:**
- CPU > [X]%
- Memory > [X]%
- Request queue > [X]

### Caching Strategy

| Layer | Tool | TTL | Invalidation |
|-------|------|-----|-------------|
| CDN | [Tool] | [Duration] | [Strategy] |
| Application | [Tool] | [Duration] | [Strategy] |
| Database | [Tool] | [Duration] | [Strategy] |

### Database Performance

- **Connection pooling:** [Min/Max connections]
- **Query optimization:** [N+1 prevention, indexing strategy]
- **Read replicas:** [Yes/No, configuration]

---

## Monitoring & Observability

### Application Monitoring

**Tool:** [Datadog / New Relic / Grafana]

**Key Metrics:**
- Error rate (target: < [X]%)
- Response time (target: p95 < [X]ms)
- Throughput (target: [X] req/s)
- Saturation (CPU, memory, disk)

### Logging

**Tool:** [ELK / CloudWatch / Datadog]
**Level:** [What gets logged at each level]
**Retention:** [Duration]
**PII:** [Scrubbing approach]

### Alerting

| Alert | Condition | Severity | Notification |
|-------|-----------|----------|-------------|
| High error rate | > [X]% for [Y]min | Critical | [Channel] |
| Slow responses | p95 > [X]ms | Warning | [Channel] |
| Service down | No heartbeat [Y]min | Critical | [Channel] |

### Health Checks

- **Endpoint:** `/health` or `/api/health`
- **Checks:** Database connectivity, external services, disk space
- **Frequency:** [Interval]

---

## Automated Verification Gates

These gates run automatically in the CI/CD pipeline. Each gate must pass before the next execution batch proceeds.

### Gate 1: Unit Tests (coder-agent responsibility)

- **Coverage target:** [X]% (lines), [Y]% (branches)
- **Framework:** [Jest / pytest / etc.]
- **Focus:** Business logic, data transformations, edge cases
- **Runs:** On every task completion, before reviewer-agent gate

### Gate 2: Integration Tests (coder-agent responsibility)

- **Scope:** API endpoints, database operations, external service mocks
- **Framework:** [Supertest / pytest / etc.]
- **Database:** [Test database strategy]
- **Runs:** On every task completion

### Gate 3: E2E Tests (tester-agent responsibility)

- **Tool:** [Cypress / Playwright / Selenium]
- **Spec source:** requirements/05-e2e-test-specs.md
- **Runs:** At batch exit criteria, against integrated system
- **Critical:** tester-agent writes these from spec only, never from implementation code

### Gate 4: Performance Tests (tester-agent or infra-agent responsibility)

- **Tool:** [k6 / JMeter / Artillery]
- **Scenarios:**
  - Baseline: [X] users, [Y] duration
  - Stress: [X] users, ramp to [Y]
  - Spike: [X] → [Y] users instantly
- **Runs:** At integration milestone and pre-deployment

### Gate 5: Security Scanning (automated)

- **SAST:** [Tool] — runs on every commit
- **DAST:** [Tool] — runs at integration milestone
- **Dependency scanning:** [Tool] — runs on every commit
- **Runs:** Continuously in CI/CD pipeline
```
