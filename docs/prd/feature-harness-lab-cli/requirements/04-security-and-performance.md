# Security & Performance

## Security Requirements

### Data Protection

- **No secrets handled:** CLI does not process credentials, tokens, or sensitive data
- **No authentication:** Public repo only, unauthenticated GitHub API calls
- **No user data collection:** CLI sends no telemetry, no analytics, no user data anywhere

### Input Validation

**CLI Arguments:**
- Harness name: Validated against catalog (exact match required). No shell injection risk — names are used as path segments, not shell commands
- Scope: Validated against allowlist: `["global", "project", "local"]`
- Command: Validated against allowlist of known commands

**Downloaded Content:**
- Files are written as-is from GitHub Raw. The trust boundary is the repository itself (maintained by the author)
- Directory listings are fetched from GitHub API and validated as arrays before iteration

### File System Safety

- **Write scope:** CLI only writes to `.claude/` subdirectories within the resolved scope. Never writes outside this boundary
- **Overwrite behavior:** Install is idempotent — overwrites existing files without prompting. This is intentional for update flows
- **Delete scope:** Uninstall only removes paths listed in harness.json. Never performs recursive deletion outside known artifact paths

---

## Performance Requirements

### Response Time Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| `categories` | < 2s | Single HTTP fetch (catalog.json) |
| `list` | < 2s | Single HTTP fetch (catalog.json) |
| `install` (single harness) | < 10s | 1 catalog + 1 harness.json + N directory listings + M file downloads |
| `uninstall` | < 1s | Local file deletion only (+ 1 remote fetch for harness.json) |
| `update` (single) | < 15s | Uninstall + install |
| `update` (all, 3 harnesses) | < 30s | 3× (uninstall + install) |
| `init` (npx) | < 30s | npm install -g + copy 5 files |

### GitHub API Considerations

- **Rate limit:** 60 requests/hour unauthenticated
- **Typical install cost:** ~5-15 API calls (1 catalog + 1 harness.json + directory listings per skill with subdirectories)
- **Mitigation:** Use raw.githubusercontent.com for file content (no rate limit). Only use API for directory listings
- **Future optimization:** If rate limits become an issue, add support for `GITHUB_TOKEN` env var to authenticate (5,000 req/hour)

---

## Monitoring & Observability

Not applicable for a CLI tool distributed via npm. No server-side monitoring needed.

**Local debugging:**
- Errors are printed to stderr with descriptive messages
- Exit codes: 0 (success), 1 (error)
