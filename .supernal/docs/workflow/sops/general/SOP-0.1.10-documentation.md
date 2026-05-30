---
type: sop
category: ai-technique
sop_id: SOP-0.1.10
title: Documentation Standards
phase: null
group: B
part_number: 10
audience: [developers, ai-agents, architects]
read_time: 30
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.09]
prerequisites: [SOP-0.1.01]
tags: [documentation, comments, jsdoc, api-docs]
---

# Documentation Standards

## 27. Documentation & Evaluation

### Documentation as Part of Quality

**Documentation is not optional** in AI-accelerated development:

- Code generates fast → Documentation must keep pace
- Multiple people/AI agents → Need shared understanding
- Future maintenance → Document decisions and patterns

### What to Document

#### Level 1: Code Comments (Inline)

**When to use**:

- Complex algorithms
- Non-obvious decisions
- Security-critical sections
- Performance optimizations

**Example**:

```typescript
// Using bcrypt with cost factor 12 (security team approved 2024-11)
// Higher cost = more secure but slower login (300ms acceptable)
const hashedPassword = await bcrypt.hash(password, 12);
```

**Don't document**:

- Obvious code (`i++` doesn't need comment)
- What code does (code should be self-documenting)
- Outdated information (remove or update)

#### Level 2: Function/Class Documentation (JSDoc)

**Always document**:

- Public APIs
- Complex functions
- Reusable utilities
- Type interfaces

**Pattern**:

```typescript
/**
 * Authenticates user with email and password
 *
 * @param email - User's email address (validated)
 * @param password - Plain text password (will be hashed)
 * @returns JWT access token + refresh token
 * @throws AuthenticationError if credentials invalid
 * @throws RateLimitError if too many attempts
 *
 * @example
 * const tokens = await authService.login('user@example.com', 'password123');
 *
 * @security Rate limited to 5 attempts per minute per IP
 * @see {@link https://docs.example.com/auth|Authentication Guide}
 */
async login(email: string, password: string): Promise<AuthTokens> {
  // Implementation
}
```

**AI can generate**: Ask AI to add JSDoc to functions

```
"Add comprehensive JSDoc comments to this function:
- Parameter descriptions
- Return type description
- Possible errors/exceptions
- Usage example
- Security considerations"
```

#### Level 3: Architecture Decision Records (ADRs)

**When to create**:

- Major architectural decisions
- Technology choices
- Design pattern selections
- Significant refactors

**Template** (`docs/architecture/decisions/ADR-NNN-title.md`):

```markdown
# ADR-042: Use JWT for Authentication

## Status

Accepted (2024-11-22)

## Context

Need secure, stateless authentication for API.
Requirements:

- Stateless (no server-side sessions)
- Scalable (multiple servers)
- Short-lived tokens with refresh capability

## Decision

Implement JWT-based authentication with:

- Access tokens (15 min expiry)
- Refresh tokens (7 day expiry, stored in database)
- HMAC SHA256 signing

## Alternatives Considered

1. **Session-based auth**: Rejected (requires server state, doesn't scale)
2. **OAuth only**: Rejected (overkill for first-party auth)
3. **API keys**: Rejected (no expiry, security risk)

## Consequences

**Positive**:

- Stateless, scales horizontally
- Industry standard
- Good library support

**Negative**:

- Token revocation requires database check
- Larger payload than session ID
- Must handle token rotation

**Mitigations**:

- Short-lived access tokens
- Refresh token rotation
- Token blacklist for revocation

## Implementation

- Library: `jsonwebtoken` (npm)
- Storage: Refresh tokens in PostgreSQL
- Security: Secret rotation every 90 days

## References

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
```

**AI can help**: Generate ADR from conversation

```
"Create an ADR from our conversation about authentication:
- Decision: JWT tokens
- Context: Why we need this
- Alternatives: What we considered
- Consequences: Trade-offs"
```

#### Level 4: Feature Documentation

**For each feature** (`docs/features/\{feature\}/README.md`):

```markdown
# Feature: User Authentication

## Overview

Email/password and OAuth authentication system

## User Flows

1. **Login**: Email + password → JWT tokens
2. **OAuth**: Redirect → callback → JWT tokens
3. **Refresh**: Expired access token → new access token

## Technical Design

- Auth Service: Handles login logic
- Token Service: Manages JWT generation/validation
- OAuth Service: Handles OAuth providers

## API Endpoints

- `POST /api/auth/login` - Email/password login
- `POST /api/auth/logout` - Logout (blacklist token)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/oauth/:provider` - OAuth redirect
- `GET /api/auth/oauth/:provider/callback` - OAuth callback

## Security

- Rate limiting: 5 attempts per minute
- Password hashing: bcrypt cost 12
- Token expiry: 15 min access, 7 day refresh

## Testing

- Unit tests: `tests/services/auth.test.ts`
- Integration tests: `tests/api/auth.test.ts`
- E2E tests: `tests/e2e/auth.spec.ts`

## Deployment

- Environment variables: `JWT_SECRET`, `JWT_REFRESH_SECRET`
- Database migrations: `migrations/042-auth-tables.sql`
```

### Evaluation Checklist

**Before marking feature complete**:

#### Code Quality Evaluation

- [ ] ESLint passes (no warnings)
- [ ] TypeScript types correct (no `any`)
- [ ] Functions < 50 lines (complexity check)
- [ ] No code duplication (DRY principle)
- [ ] Follows project patterns
- [ ] Comments where needed

#### Documentation Evaluation

- [ ] JSDoc on public functions
- [ ] README updated (if feature)
- [ ] ADR created (if architectural)
- [ ] API docs generated
- [ ] Examples provided
- [ ] Migration guide (if breaking change)

#### Testing Evaluation

- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Edge cases covered
- [ ] Error cases tested
- [ ] Performance acceptable

#### Security Evaluation

- [ ] Input validation
- [ ] Authentication/authorization
- [ ] No sensitive data logged
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection (if applicable)

#### User Experience Evaluation

- [ ] Error messages helpful
- [ ] Loading states shown
- [ ] Success feedback provided
- [ ] Keyboard accessible
- [ ] Mobile responsive
- [ ] Performance < 3s load

### AI-Assisted Documentation

**Pattern**: Generate docs as you code

```
[After implementing feature]

Person: "Generate documentation for this authentication feature:

1. JSDoc for all public functions
2. Update README with:
   - Feature overview
   - API endpoints
   - Security details
   - Testing info
3. Create ADR for JWT decision
4. Add usage examples"

AI: [Generates comprehensive documentation]

Person: [Reviews, refines, commits with code]
```

**Why this works**: Documentation created while context fresh

### Documentation Maintenance

**Keep docs current**:

- Update docs in same commit as code
- Review docs in code review
- Mark outdated docs (add WARNING)
- Remove obsolete docs (archive or delete)

**Red flags**:

- ⚠️ Code changed, docs didn't
- ⚠️ Comments contradict code
- ⚠️ Examples don't work
- ⚠️ Links broken

---

## Documentation File Naming

### Feature Documentation

```
docs/features/\{feature\}/
├── README.md                      ← Feature overview
├── ARCHITECTURE.md                ← Technical architecture
├── API.md                         ← API documentation
└── CHANGELOG.md                   ← Feature change history
```

### API Endpoint Documentation

**In code** (OpenAPI/JSDoc):

```typescript
/**
 * @route POST /api/auth/login
 * @group Authentication - User authentication operations
 * @param {LoginRequest} request.body - Login credentials
 * @returns {AuthTokens} 200 - Authentication tokens
 * @returns {Error} 401 - Invalid credentials
 * @returns {Error} 429 - Rate limit exceeded
 */
```

---

## Template Synchronization & Approval

### The Template Sync Challenge

**Problem**: Templates in `supernal-code-package/templates/` are canonical, but project docs may have approval history.

**Solution**: Smart merge preserving approval metadata while updating content.

### Template Sync Workflow

#### 1. Smart Merge Command

```bash
# Preview changes
sc docs merge-templates --dry-run

# Generate approval report
sc docs merge-templates --report

# Execute merge with approval preservation
sc docs merge-templates

# Merge specific directory
sc docs merge-templates --path docs/workflow/sops/
```

#### 2. What Gets Preserved

**From Project Docs** (preserved):
- `reviewedBy`: Who reviewed this document
- `reviewDates`: When reviews occurred
- `status`: Current approval status
- `version`: Document version
- `version_history`: All historical approvals
- `approvalNotes`: Review comments

**From Templates** (updated):
- All structural metadata (`type`, `sop_id`, `title`, etc.)
- Entire document content
- Section structure
- Examples and code blocks

#### 3. Re-Approval Triggers

**Requires Re-Approval** (>20% structural change):
- ✅ Section headings added/removed/reordered
- ✅ Major content blocks changed (>25% word count)
- ✅ Code examples or tables modified
- ✅ Process steps changed
- ✅ Approval gates or requirements updated

**No Re-Approval Needed** (minor changes):
- ✅ Typo fixes
- ✅ Formatting improvements
- ✅ Link corrections
- ✅ Minor clarifications (<25% content change)
- ✅ Grammar improvements

#### 4. Version History Tracking

**After minor sync** (no re-approval):
```yaml
version: '1.0'  # No increment
status: approved  # Stays approved
version_history:
  - version: '1.0'
    date: 2025-11-29
    changes: 'Template sync: Fixed typos'
    requiresReapproval: false
```

**After major sync** (requires re-approval):
```yaml
version: '1.1'  # Incremented
status: pending-review  # Needs re-approval
version_history:
  - version: '1.0'
    date: 2025-11-21
    approvedBy: ['@tech-lead']
    changes: 'Initial approval'
  - version: '1.1'
    date: 2025-11-29
    changes: 'Template sync: Added compliance section'
    requiresReapproval: true
```

**After re-approval**:
```yaml
version: '1.1'
status: approved
reviewedBy: ['@tech-lead', '@compliance-lead']
reviewDates: ['2025-11-21', '2025-11-30']
version_history:
  - version: '1.0'
    date: 2025-11-21
    approvedBy: ['@tech-lead']
    changes: 'Initial approval'
  - version: '1.1'
    date: 2025-11-30
    approvedBy: ['@tech-lead', '@compliance-lead']
    changes: 'Template sync: Added compliance section'
    approvalNotes: 'Approved after clarifying section 7.3'
```

### Re-Approval Process

**Step 1: Detect Changes**
```bash
sc docs merge-templates --report
```

Generates `.supernal/reports/TEMPLATE_SYNC_APPROVAL_REQUIRED.md` with:
- Files requiring re-approval
- Change summaries
- Required approvers
- Review links

**Step 2: Review**
Reviewers check:
- Technical accuracy of changes
- Consistency with related docs
- Impact on existing approvals
- Compliance requirements

**Step 3: Approve**
```bash
# Update frontmatter manually or with command
sc docs update-approval \
  --file docs/workflow/sops/general/SOP-0.1.05-requirements-planning.md \
  --approver @tech-lead \
  --status approved
```

**Step 4: Commit**
```bash
git add docs/workflow/sops/ .supernal/reports/
git commit -m "docs: Template sync approved

Approved-by: @tech-lead, @compliance-lead
Version: 1.0 → 1.1 (approved)
Changes: Added compliance section, updated approval gates"
```

### Anti-Patterns

❌ **DON'T: Direct Copy/Overwrite**
```bash
# This loses ALL approval history
rsync -av supernal-code-package/templates/workflow/ docs/workflow/
cp -r templates/docs/ docs/
```

❌ **DON'T: Skip Re-Approval**
```bash
# Never auto-approve without review
sed -i 's/status: pending-review/status: approved/' *.md
git commit -m "docs: auto-approved"  # NEVER DO THIS
```

❌ **DON'T: Reset Version History**
```yaml
# This loses historical approvals
version_history: []  # Don't reset!
```

### Best Practices

✅ **DO: Use Smart Merge**
```bash
# Always use the tool
sc docs merge-templates --dry-run
sc docs merge-templates
```

✅ **DO: Document Approval Decisions**
```yaml
version_history:
  - version: '1.1'
    date: 2025-11-29
    changes: 'Template sync: Added compliance section'
    approvalNotes: 'Approved after clarifying section 7.3 requirements'
    approvedBy: ['@tech-lead', '@compliance-lead']
    approvalDate: 2025-11-30
```

✅ **DO: Communicate Changes**
```bash
# Share approval report with team
cat .supernal/reports/TEMPLATE_SYNC_APPROVAL_REQUIRED.md
# Send to Slack/email/etc
```

### Integration with Git Workflow

See [SOP-0.1.12 Section: Template Sync Commits](SOP-0.1.12-git-workflow.md#template-sync-commits) for commit message format and merge strategy.

See [SOP-0.1.13 Section: Template Sync Changes](SOP-0.1.13-change-control.md#template-sync-changes) for change control process.

---

## Navigation

← Previous: [Part 9](../phase-6-tests/SOP-6.02-e2e-testing.md)
→ Next: [Part 11](SOP-0.1.11-decision-tracking.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
