---
type: sop
category: ai-technique
sop_id: SOP-0.1.13
title: Change Control & Deployment
phase: null
group: B
part_number: 13
audience: [developers, ops, product-owners]
read_time: 35
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.12]
prerequisites: [SOP-0.1.01]
tags: [change-control, deployment, rollback, impact-analysis]
---

# Change Control & Deployment

**Applies To**: All Phases - When Making Changes

**Type**: Phase-Specific

---

## 31. Change Control & Impact Analysis

### When Change Control is Required

**Always require change control for**:

1. **Breaking changes** to APIs, data models, interfaces
2. **Architecture changes** affecting multiple components
3. **Security changes** affecting authentication, authorization, data protection
4. **Infrastructure changes** affecting deployment, scaling, performance
5. **Database schema changes** (migrations)
6. **Third-party integrations** (new services, API changes)
7. **Compliance-related changes** (data handling, logging, auditing)

**Optional for**:

- Internal refactoring (no external impact)
- Bug fixes (small, isolated)
- Documentation updates
- Test additions

### Change Control Process

#### Step 1: Change Request

**Create**: `docs/changes/CHG-YYYY-NNN-title.md`

```markdown
# CHG-2024-042: Migrate from Sessions to JWT Authentication

## Change Metadata

**ID**: CHG-2024-042
**Type**: Architecture Change
**Priority**: High
**Requested By**: @architect
**Date**: 2024-11-22
**Status**: Proposed | Approved | In Progress | Completed | Rejected

---

## Change Description

### What's Changing

Migrating from session-based authentication to JWT-based authentication with refresh tokens.

**Current State**:

- Session cookies stored in Redis
- Server-side session management
- Session expiry: 24 hours
- No token refresh

**Proposed State**:

- JWT access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Stateless authentication
- Token rotation on refresh

### Why We're Changing

**Business Drivers**:

- Support mobile apps (sessions don't work well)
- Improve scalability (stateless)
- Enable API access for third parties

**Technical Drivers**:

- Redis sessions becoming bottleneck at scale
- Need cross-origin authentication
- Want to support multiple devices

**Requirements**:

- REQ-045: Mobile app support
- REQ-046: Third-party API access
- REQ-047: Multi-device sessions

---

## Impact Analysis

### System Impact Assessment

#### Components Affected

1. **Authentication Service** - MAJOR REWRITE
   - Current: `SessionService`
   - New: `TokenService`, `AuthService`
   - Effort: 5 days
   - Risk: High

2. **API Gateway** - BREAKING CHANGE
   - Current: Session cookie middleware
   - New: JWT bearer token middleware
   - Effort: 2 days
   - Risk: Medium

3. **Frontend (Web)** - MODERATE CHANGE
   - Current: Cookie-based auth
   - New: Token storage + refresh logic
   - Effort: 3 days
   - Risk: Medium

4. **Mobile App** - NEW FEATURE
   - Current: N/A
   - New: Token-based auth flow
   - Effort: 5 days
   - Risk: Low (new, not changing existing)

5. **Database** - SCHEMA CHANGE
   - Current: `sessions` table (Redis)
   - New: `refresh_tokens` table (PostgreSQL)
   - Migration: Required
   - Effort: 1 day
   - Risk: Medium

6. **Testing** - EXTENSIVE UPDATES
   - E2E tests: All auth tests need updates
   - Integration tests: Token flow tests needed
   - Unit tests: New token service tests
   - Effort: 4 days
   - Risk: Medium

#### Interfaces/APIs Affected

- ❌ `/api/auth/login` - Response format changes (breaking)
- ❌ `/api/auth/logout` - Token revocation replaces session destroy (breaking)
- ✅ `/api/auth/refresh` - NEW endpoint
- ⚠️ All protected endpoints - Authorization header required (breaking)

#### Data Impact

- **Session Migration**: 1,245 active sessions need migration
- **User Data**: No changes to user records
- **Audit Logs**: Need to log token issuance/refresh/revocation

#### Third-Party Integration Impact

- **OAuth Providers**: No impact (callback flow same)
- **Monitoring (DataDog)**: Update to track token metrics
- **Analytics**: Update to track token usage patterns

---

### Dependency Analysis

**Blocks**:

- REQ-045: Mobile app (waiting for this change)
- REQ-046: API access (waiting for this change)

**Blocked By**:

- None (can proceed)

**Related Changes**:

- CHG-2024-040: Rate limiting (should implement together)
- CHG-2024-041: Multi-device support (enabled by this)

---

### Risk Assessment

#### High Risks

1. **Session migration complexity**
   - **Risk**: Active users logged out during migration
   - **Probability**: High
   - **Impact**: High (bad UX)
   - **Mitigation**:
     - Implement parallel auth (sessions + tokens) during transition
     - Gradual rollout with feature flag
     - Allow 7-day overlap for migration

2. **Token revocation challenges**
   - **Risk**: Revoked tokens still valid if blacklist fails
   - **Probability**: Medium
   - **Impact**: High (security)
   - **Mitigation**:
     - Short-lived access tokens (15 min)
     - Redundant blacklist (Redis + PostgreSQL)
     - Monitoring and alerts

#### Medium Risks

1. **Frontend token refresh complexity**
   - **Risk**: Race conditions, infinite refresh loops
   - **Probability**: Medium
   - **Impact**: Medium (bugs)
   - **Mitigation**:
     - Use proven library (axios interceptors)
     - Comprehensive E2E tests
     - Monitoring for refresh failures

2. **Performance impact**
   - **Risk**: JWT verification slower than session lookup
   - **Probability**: Low
   - **Impact**: Medium (latency)
   - **Mitigation**:
     - Cache JWT public keys
     - Benchmark before/after
     - Optimize token verification

#### Low Risks

1. **Documentation debt**
   - **Risk**: Outdated docs cause confusion
   - **Probability**: High
   - **Impact**: Low (annoying)
   - **Mitigation**:
     - Update all docs as part of change
     - Add migration guide

---

### Effort Estimation

| Task                     | Owner      | Effort | Dependencies        |
| ------------------------ | ---------- | ------ | ------------------- |
| Design token system      | @architect | 1 day  | None                |
| Implement TokenService   | @dev1      | 3 days | Design complete     |
| Implement refresh logic  | @dev1      | 2 days | TokenService done   |
| Update API gateway       | @dev2      | 2 days | TokenService done   |
| Frontend token storage   | @dev3      | 2 days | API gateway done    |
| Frontend refresh logic   | @dev3      | 1 day  | Token storage done  |
| Database migration       | @dev2      | 1 day  | Design complete     |
| Update E2E tests         | @qa        | 3 days | Implementation done |
| Update integration tests | @dev1      | 1 day  | Implementation done |
| Session migration script | @dev2      | 1 day  | Parallel auth done  |
| Gradual rollout          | @ops       | 2 days | All testing done    |
| Monitoring & alerts      | @ops       | 1 day  | Deployment done     |
| Documentation            | @dev1      | 1 day  | All complete        |

**Total Effort**: 21 developer-days
**Calendar Time**: 15 days (with parallel work)
**Buffer (20%)**: +3 days
**Estimated Completion**: 18 days

---

### Rollback Plan

#### Rollback Trigger Conditions

- Token generation failure rate >1%
- Token verification failure rate >5%
- Login success rate drops below 90%
- Refresh token rotation failures >10%
- Production incidents related to auth

#### Rollback Procedure

1. **Immediate (< 5 minutes)**:
   - Toggle feature flag: `USE_JWT_AUTH=false`
   - System falls back to session auth
   - All users remain authenticated (parallel auth)

2. **Short-term (< 1 hour)**:
   - Investigate root cause
   - Decide: Fix forward or rollback completely

3. **Complete rollback (if needed)**:
   - Disable JWT endpoints
   - Keep session auth only
   - Run database rollback migration (if needed)
   - Update monitoring

#### Recovery Steps

- Active sessions preserved (parallel auth)
- No data loss (sessions + tokens both stored)
- Users may need to re-login (acceptable)

---

### Testing Strategy

#### Pre-Deployment Testing

- [ ] Unit tests (TokenService, AuthService)
- [ ] Integration tests (token flow)
- [ ] E2E tests (all auth flows)
- [ ] Load tests (1000 concurrent token refreshes)
- [ ] Security tests (token tampering, expiry)
- [ ] Migration tests (session → token)

#### Staging Validation

- [ ] Deploy to staging
- [ ] Run full test suite
- [ ] Manual testing (all browsers)
- [ ] Performance benchmarks
- [ ] Security scan
- [ ] Penetration testing

#### Production Rollout

- [ ] Deploy with feature flag OFF
- [ ] Enable for 1% of users
- [ ] Monitor for 24 hours
- [ ] Increase to 10%
- [ ] Monitor for 48 hours
- [ ] Increase to 50%
- [ ] Monitor for 72 hours
- [ ] Enable for 100%
- [ ] Remove feature flag after 1 week
- [ ] Remove parallel auth after 2 weeks

---

## Approval Workflow

### Required Approvals

- [ ] **Architect** (@architect) - Architecture design
- [ ] **Tech Lead** (@tech-lead) - Technical feasibility
- [ ] **Security** (@security) - Security implications
- [ ] **Product** (@product) - User impact
- [ ] **Operations** (@ops) - Deployment strategy

### Approval Status

#### Architect Review

**Reviewer**: @architect
**Date**: 2024-11-22
**Status**: ✅ Approved
**Comments**: "Design is sound. Token rotation pattern is correct. Parallel auth strategy mitigates risk."

#### Tech Lead Review

**Reviewer**: @tech-lead
**Date**: 2024-11-23
**Status**: ✅ Approved with conditions
**Comments**: "Approve if we add comprehensive E2E tests for race conditions in token refresh. Increase buffer to 30% for integration complexity."
**Conditions**:

- [ ] Add E2E tests for concurrent refresh
- [ ] Increase buffer to 30% (+6 days)

#### Security Review

**Reviewer**: @security
**Date**: 2024-11-23
**Status**: ⏸️ Pending
**Comments**: "Need clarification on token blacklist redundancy. How does PostgreSQL backup work?"
**Questions**:

- Token blacklist backup mechanism?
- Secret rotation strategy?
- Token signing algorithm? (Must be RS256, not HS256)

---

## Decision

**Final Decision**: [Pending Security Approval]
**Approved By**: [TBD]
**Date**: [TBD]
**Conditions**: [TBD]

---

## Implementation Tracking

### Artifacts to Create/Update

- [x] ADR-042: JWT Authentication
- [ ] DDD-auth-token-management.md
- [ ] Migration guide
- [ ] API documentation
- [ ] Frontend auth guide
- [ ] Deployment runbook
- [ ] Monitoring playbook

### Code Changes

- [ ] `src/services/TokenService.ts` (new)
- [ ] `src/services/AuthService.ts` (major rewrite)
- [ ] `src/middleware/jwt-auth.ts` (new)
- [ ] `src/api/auth/refresh.ts` (new)
- [ ] Database migration scripts
- [ ] E2E test updates

### Status Updates

**2024-11-22**: Change request created
**2024-11-23**: Architect approved, Tech Lead approved with conditions
**2024-11-24**: [Next update]
```

### Impact Analysis Tool

**AI can help analyze impact**:

```
Person: "I want to migrate from sessions to JWT authentication.

Analyze impact:
1. Which files/components affected?
2. What APIs break?
3. What's the migration path?
4. What are the risks?
5. How long will this take?

Our codebase:
[Attach relevant files or describe architecture]"

AI: [Generates comprehensive impact analysis]
"I've analyzed your codebase. Here's what I found:

**Components Affected** (8 total):
1. SessionService → Needs complete rewrite
2. AuthMiddleware → Breaking change
3. LoginForm → Moderate change
[...]

**Breaking Changes** (5 APIs):
1. POST /api/auth/login - response format changes
[...]

**Migration Path**:
1. Implement parallel auth (sessions + JWT)
2. Gradual rollout with feature flag
[...]

**Estimated Effort**: 21 developer-days

Let me create the full impact analysis document?"

Person: "Yes, create CHG-2024-042 with all details."

AI: [Generates complete change request document]
```

---

---

## 📁 Documentation Artifacts for This Phase

### What to Document

- Change requests (CHG-YYYY-NNN)
- Impact analysis results
- Risk assessments
- Rollback plans

### Where to Document

```
docs/changes/
└── CHG-YYYY-NNN-{title}.md    ← Change request document
```

### When to Document

- **Before change**: Create change request
- **During analysis**: Document impact
- **Before approval**: Complete risk assessment
- **Before implementation**: Finalize rollback plan

## Change Request Naming (CHG-YYYY-NNN)

**Format**: `CHG-2024-042-migrate-to-jwt.md`

- Year + sequential number + description
- Location: `docs/changes/`

### Change Types

- `breaking` - Breaking API changes
- `feature` - New features
- `enhancement` - Improvements
- `security` - Security updates
- `performance` - Performance improvements
- `infrastructure` - Infrastructure changes

### Change Document Structure

```markdown
# CHG-2024-042: Migrate from Sessions to JWT

**Type**: breaking
**Priority**: high
**Status**: approved
**Requestor**: @architect
**Date**: 2024-11-22

[Content...]
```

---

## Template Sync Changes

### Special Change Pattern: Template Synchronization

**Context**: Templates in `supernal-code-package/templates/` are canonical sources. When syncing to project docs, this is a controlled change that requires special handling to preserve approval history.

### Template Sync as Change Control

**Why Template Sync Needs Change Control**:
- Affects multiple documentation files simultaneously
- May invalidate existing approvals
- Changes may require re-review by stakeholders
- Must preserve historical approval records
- Needs version tracking

### Template Sync Change Request

**When to Create CHG Document**:
- Major template updates (>5 files or >20% content change)
- Breaking changes to SOP structure or process
- Compliance-related template updates

**Format**: `CHG-YYYY-NNN-template-sync-{area}.md`

```markdown
# CHG-2024-089: Template Sync - SOP Workflow Updates

**Type**: documentation
**Priority**: medium
**Status**: pending-review
**Requestor**: @supernal-coding-team
**Date**: 2025-11-29

## Summary

Synchronize project SOPs with updated templates from supernal-code-package v2.1.

## Scope

**Files Affected** (8 files):
- docs/workflow/sops/general/SOP-0.1.05-requirements-planning.md
- docs/workflow/sops/general/SOP-0.1.10-documentation.md
- docs/workflow/sops/general/SOP-0.1.11-decision-tracking.md
[...]

## Changes

### Major Changes (Require Re-Approval):
1. **SOP-0.1.05**: Added compliance section (Section 9)
2. **SOP-0.1.10**: Added template sync workflow (Section 28)
3. **SOP-0.1.11**: Restructured decision tracking process

### Minor Changes (No Re-Approval):
1. **SOP-0.1.12**: Fixed typos, updated links
2. **SOP-0.1.13**: Grammar improvements

## Impact Analysis

**Approval Status Impact**:
- 3 files will change status: approved → pending-review
- 5 files will remain approved (minor changes only)
- 2 files are new and need initial approval

**Version Impact**:
- SOP-0.1.05: 1.0 → 1.1 (requires re-approval)
- SOP-0.1.10: 1.0 → 1.1 (requires re-approval)
- SOP-0.1.11: 1.2 → 1.3 (requires re-approval)

**Process Impact**:
- New approval workflows for template syncs
- Enhanced version history tracking
- Improved compliance documentation

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Existing approvals lost | Medium | High | Smart merge preserves metadata |
| Process confusion | Low | Medium | Clear documentation in SOPs |
| Outdated practices followed | Low | Low | Version control enforced |

## Rollback Plan

**If template sync causes issues**:

1. **Immediate Rollback** (< 24 hours):
   ```bash
   git revert <template-sync-commit>
   git push
   ```

2. **Review Rollback Decision**:
   - Check what broke
   - Determine if template or implementation issue

3. **Fix Forward** (preferred):
   - Correct template issues
   - Re-sync with fixes
   - Document corrections

## Testing Strategy

- [ ] Dry-run template sync
- [ ] Review generated approval report
- [ ] Validate frontmatter preservation
- [ ] Check version history tracking
- [ ] Verify cross-references
- [ ] Test approval workflow

## Approval Workflow

### Required Approvals

- [ ] **Tech Lead** (@tech-lead) - Process changes
- [ ] **Documentation Lead** (@doc-lead) - SOP updates
- [ ] **Compliance** (@compliance) - Compliance sections

### Approval Timeline

- **Day 1**: Template sync executed, report generated
- **Day 2-3**: Review period for stakeholders
- **Day 4**: Approvals collected, frontmatter updated
- **Day 5**: Merge and close

## Implementation

**Command**:
```bash
sc docs merge-templates --report
```

**Commit Message**:
```
docs: Template sync - requires re-approval

Files updated: 8 files
Major changes: 3 files require re-approval
Report: .supernal/reports/TEMPLATE_SYNC_APPROVAL_REQUIRED.md
CHG-2024-089
```

## Artifacts

- [x] CHG-2024-089 (this document)
- [ ] `.supernal/reports/TEMPLATE_SYNC_APPROVAL_REQUIRED.md`
- [ ] Updated SOP files with preserved frontmatter
- [ ] Approval tracking in version_history
```

### Fast-Track Template Sync

**For minor changes** (typos, link fixes, formatting):

**No CHG Document Required**:
```bash
# Execute sync
sc docs merge-templates

# Verify no re-approval needed
cat .supernal/reports/TEMPLATE_SYNC_APPROVAL_REQUIRED.md
# (Should show "No files require re-approval")

# Commit directly
git add docs/workflow/
git commit -m "docs: Template sync - typo fixes, no re-approval needed"
```

**When Fast-Track is Acceptable**:
- Changes < 10% of content
- No structural changes
- No new sections
- Typos, grammar, link fixes only
- No impact on approval status

### Template Sync Approval Process

**Step 1: Execute Smart Merge**
```bash
# Generate report
sc docs merge-templates --report

# Review changes
git diff docs/workflow/
```

**Step 2: Create CHG (if major)**
```bash
# If report shows major changes:
# 1. Create CHG-YYYY-NNN document
# 2. List all affected files
# 3. Describe changes
# 4. Identify required approvers
```

**Step 3: Notify Reviewers**
```bash
# Share approval report
cat .supernal/reports/TEMPLATE_SYNC_APPROVAL_REQUIRED.md

# Notify stakeholders
# - Email/Slack with CHG document link
# - Highlight files requiring their review
# - Set review deadline
```

**Step 4: Collect Approvals**
```bash
# As approvals come in:
sc docs update-approval \
  --file docs/workflow/sops/general/SOP-0.1.05-requirements-planning.md \
  --approver @tech-lead \
  --status approved \
  --notes "Approved after clarifying section 9.2"
```

**Step 5: Commit Approvals**
```bash
git add docs/workflow/
git commit -m "docs: Approve template sync changes

Approved-by: @tech-lead, @doc-lead, @compliance
CHG-2024-089: Approved
Version: 1.0 → 1.1 (approved)"
```

### Anti-Patterns

❌ **DON'T: Skip Impact Analysis**
```bash
# Never sync without understanding impact
rsync -av templates/ docs/  # NO!
git commit -m "update docs" # NO CONTEXT!
```

❌ **DON'T: Bypass Approval for Major Changes**
```bash
# Major changes always need review
# Even if "just from templates"
sc docs merge-templates
git commit -m "template sync" # Missing approvals!
```

### Best Practices

✅ **DO: Assess Impact First**
```bash
sc docs merge-templates --dry-run
sc docs merge-templates --report
# Review report before executing
```

✅ **DO: Create CHG for Major Changes**
```bash
# If report shows >3 files need re-approval
# Create full CHG document
# Get formal approvals
# Track in version history
```

✅ **DO: Preserve History**
```bash
# Smart merge tool preserves:
# - reviewedBy
# - reviewDates
# - version_history
# - approvalNotes
```

### Related Documentation

- [SOP-0.1.10: Template Synchronization & Approval](SOP-0.1.10-documentation.md#template-synchronization--approval)
- [SOP-0.1.12: Template Sync Commits](SOP-0.1.12-git-workflow.md#template-sync-commits)
- [Cursor Rule: Template Sync Policy](../../../../.cursor/rules/template-sync-policy.mdc)

---

## Navigation

← Previous: [Part 12] (SOP-0.1.12-evaluation)
→ Next: [Part Overview] (see project documentation)

[Back to Overview] (see project documentation)
