---
type: sop
category: ai-technique
sop_id: SOP-0.1.12
title: Git Workflow & Code Review
phase: null
group: B
part_number: 12
audience: [developers, ai-agents]
read_time: 35
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.11]
prerequisites: [SOP-0.1.01]
tags: [git, workflow, code-review, branching, commits]
---

# Git Workflow & Code Review

## 23. Selective File Commits (CRITICAL)

### Core Principle: Only Commit What You Changed

**Agents and developers MUST only commit files they have specifically modified during their work.**

### ✅ DO: Selective, Intentional Commits

```bash
# Commit only files you modified
git add src/auth.ts tests/auth.test.ts
git commit -m "feat: Add authentication (REQ-042)"

# List files explicitly
sc git commit src/feature.ts tests/feature.test.ts -m "feat: Add feature"

# Stage incrementally
git add src/auth.ts      # File I modified
git add tests/auth.test.ts  # Test I wrote
git commit -m "feat: Add authentication"
```

**Why this matters**:
- ✅ Clear attribution (know who changed what)
- ✅ Clean git history (atomic, logical changes)
- ✅ Easy rollback (revert specific changes)
- ✅ Better code review (reviewers see actual work)
- ✅ Avoid accidental commits (no unintended changes)

### ❌ DON'T: Broad, Unintentional Commits

```bash
# NEVER: Commits everything
git add .          # ❌ BAD
git add -A         # ❌ BAD
git commit -m "updates"

# NEVER: Commit files you didn't modify
git add src/unrelated-file.ts  # You didn't change this!
git commit -m "feat: My work"

# NEVER: Cleanup commits
git add old-file.ts new-file.ts unrelated-changes.ts  # Mixed purposes!
git commit -m "cleanup and feature work"
```

**Problems with broad commits**:
- ❌ Unclear attribution (can't tell who changed what)
- ❌ Messy history (unrelated changes bundled)
- ❌ Hard to rollback (can't revert cleanly)
- ❌ Poor review experience (too much to review)
- ❌ Risk of accidents (committing sensitive data, WIP, etc.)

### Exception: Explicit User Request Only

**ONLY commit files beyond your specific changes when explicitly asked:**

```
✅ User: "Commit all pending changes"
✅ User: "Add everything and commit"
✅ User: "Clean up the working directory and commit"

Otherwise: ONLY commit files you specifically modified
```

### Best Practice: Review Before Commit

```bash
# 1. Check what you changed
git status
git diff

# 2. Stage only your changes
git add <specific-files-you-modified>

# 3. Verify staged files
git diff --cached

# 4. Commit with clear message
git commit -m "feat: Description (REQ-XXX)"
```

### Using sc git commit

The `sc git commit` command helps with selective commits:

```bash
# Specify exact files
sc git commit src/auth.ts tests/auth.test.ts -m "feat: Add auth"

# Smart commit with nit detection (separates trivial changes)
sc git commit --nit

# Review changes before committing
sc git commit --dry-run
```

### Controlled Files Enforcement

**Some files require workflow approval before modification** (enforced at pre-commit):

**Three control levels**:
- **Strict**: `supernal.yaml`, `package.json`, `.husky/**/*` - CHG document required
- **Moderate**: `supernal-code-package/cli/**/*.js` - Requirement + tests required
- **Light**: `tsconfig.json`, `.eslintrc.js` - Justification required

**Workflow**:

```bash
# 1. Check if file is controlled
sc controlled check supernal.yaml

# 2. Run workflow BEFORE editing
sc controlled modify supernal.yaml
# Interactive: Create CHG or link REQ

# 3. Now modify the file
nano supernal.yaml

# 4. Commit (pre-commit validates workflow)
git commit -m "chore: Update config (CHG-000001)"
✅ Allowed
```

**Pre-commit enforcement**:
- Detects controlled file modifications
- **Hard-blocks** commits without workflow completion
- Clear error messages with fix commands
- Emergency bypass: `SC_ALLOW_CONTROLLED_EDIT=1` (audited)

**See**: 
- [controlled-files.mdc](../../../../.cursor/rules/controlled-files.mdc) - Complete reference
- REQ-WORKFLOW-144 - Full requirement

**Commands**:

```bash
sc controlled check <file>        # Check if controlled
sc controlled modify <file>       # Start workflow
sc controlled list                # List all controlled files
sc controlled audit              # View modification history
```

---

## 24. Git Branching & Commit Strategy

### Workflow Options (Ranked by Preference)

#### 1. **Trunk-Based Development** (Default)

Work directly on `main` with `feat(feature-name):` tagged commits.

```bash
# On main branch - use FEATURE names as scopes
git commit -m "feat(auth): add login endpoint (REQ-042)"
git commit -m "feat(dashboard): add widget (REQ-055)"
git commit -m "feat(auth): add validation (REQ-042)"

# Use domain/feature ONLY when feature name is duplicate
git commit -m "feat(workflow-management/planning): update docs (REQ-042)"
git commit -m "feat(dashboard-platform/planning): add view (REQ-043)"
```

**When to use**: Solo developer, small teams, rapid iteration

**Benefits**: Simplest, no branch overhead, immediate integration

#### 2. **Work Session Branches** (Preferred when branches needed)

Personal branches for multi-feature parallel work.

```bash
# Create session branch
git checkout -b session-alice-dec15

# Work on multiple FEATURES - use feature names as scopes
git commit -m "feat(auth): add login (REQ-042)"
git commit -m "feat(dashboard): add widget (REQ-055)"
git commit -m "feat(auth): add validation (REQ-042)"

# Merge all work together
git checkout main
git merge session-alice-dec15
```

**When to use**: Multiple people working simultaneously, multi-week efforts, cross-epic work

**Benefits**: Isolation, coordinate multiple features, merge all together

**See**: REQ-WORKFLOW-139, `docs/features/workflow-management/work-sessions/`

#### 3. **Feature Branches** (Optional)

Traditional one-branch-per-feature for PRs or external contributors.

```bash
feature/req-XXX-brief-description
feature/add-user-authentication
```

**When to use**: External PRs, strict review requirements, isolated experiments

**Benefits**: Traditional, familiar, good for open source

### Branch Naming Conventions

**Work session branches**:

```bash
session-{person}-{date|description}
session-alice-dec15
session-bob-auth-work
```

**Feature branches** (when used):

```bash
feature/req-XXX-brief-description
feature/add-user-authentication
```

**Epic branches** (rare - prefer sessions):

```bash
epic/epic-name-major-feature
epic/user-management-system
```

**Hotfix branches**:

```bash
hotfix/critical-issue-description
hotfix/fix-auth-token-expiry
```

**Documentation branches**:

```bash
docs/update-description
docs/add-api-reference
```

**Why naming matters**: Clear intent, easy filtering, requirement traceability

### One Feature Per Commit (Preferred)

**Good commit**:

```bash
# Single feature, complete, tested
git add src/auth.service.ts tests/auth.service.test.ts
git commit -m "feat: Add login method with JWT tokens

- Implements email/password authentication
- Returns JWT access token + refresh token
- Includes rate limiting (5 attempts per minute)
- Adds comprehensive tests

REQ-042"
```

**Why**: Atomic changes, easy revert, clear history

### Multiple Features Per Session/Branch

**When appropriate**:

- Working on a work session branch
- Features are closely related
- Cross-epic work that needs coordination
- Multi-week parallel development

**Example (Work Session)**:

```bash
# Branch: session-alice-dec15
# Use FEATURE names as scopes
git commit -m "feat(auth): add login endpoint (REQ-042)"
git commit -m "feat(dashboard): add widget (REQ-055)"
git commit -m "feat(auth): add token refresh (REQ-044)"
git commit -m "feat(dashboard): add charts (REQ-056)"
```

**Example (Feature Branch - if used)**:

```bash
# Branch: feature/epic-auth-complete
# Still use feature names even on feature branches
git commit -m "feat(auth): add login endpoint (REQ-042)"
git commit -m "feat(auth): add logout endpoint (REQ-043)"
git commit -m "feat(auth): add token refresh (REQ-044)"
```

**Why**: Easier testing, integrated deployment, coordinate related work

**Note**: Always use `feat(feature-name):` for feature tracking

### Commit Message Format

**Structure**:

```
<type>: <subject>

<body>

<footer>
```

**Types**:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructuring
- `docs:` - Documentation only
- `test:` - Adding/updating tests
- `chore:` - Maintenance (dependencies, config)

**Scope**: Use FEATURE name as primary scope

- `feat(feature-name):` - When feature name is unique (most common)
- `feat(domain/feature):` - ONLY when duplicate feature names exist
- `feat(domain):` - ONLY for cross-feature work
- `feat(component):` - For shared infrastructure (api, ui, cli)

**Example**:

```bash
git commit -m "feat(auth): implement OAuth 2.0 login flow

Add Google and GitHub OAuth providers with PKCE flow.
Includes state validation and CSRF protection.

Changes:
- Add OAuthService with provider abstraction
- Implement callback handler with security checks
- Add OAuth configuration management
- Include comprehensive integration tests

REQ-038, REQ-039
Closes #123"
```

### What to Commit Together

**✅ DO commit together** (files YOU modified):

- Implementation + tests for same feature (that you wrote)
- Code + related documentation updates (that you changed)
- Multiple files for same logical change (that you modified)
- Configuration + code that depends on it (that you added/changed)

**❌ DON'T commit together**:

- Multiple unrelated features
- Work-in-progress + complete features
- Experimental code + production code
- Code + unrelated documentation
- **Files you didn't modify** (even if they "need cleanup")
- **Other people's uncommitted changes** (coordinate first)
- **Generated files** (unless you explicitly generated them)
- **Nits + substantive changes** (use `--nit` flag to separate)

**Golden Rule**: If you didn't modify it during this work session, don't commit it (unless explicitly asked by user)

### Separating Nits (Trivial Changes)

**Use `sc git commit --nit` to automatically commit trivial changes separately**:

```bash
# After making both nits and substantive changes:

# 1. Commit nits first (trailing newlines, whitespace)
sc git commit --nit --yes

# 2. Commit substantive changes
git commit -m "feat: Add authentication (REQ-042)"
```

**What are nits?**
- Trailing newlines added to files
- Whitespace normalization
- Test fixture data updates (non-functional)

**Why separate nits?**
- ✅ Clean git history
- ✅ Easier code review (reviewers focus on logic, not formatting)
- ✅ Better bisect-ability (find bugs faster)
- ✅ Logical separation (trivial vs. substantive)

**Commands**:

```bash
# Preview what would be committed as nits
sc git commit --nit --dry-run --verbose

# Commit nits interactively (asks for confirmation)
sc git commit --nit

# Auto-commit nits (skip confirmation)
sc git commit --nit --yes
```

**Example workflow**:

```bash
# Made changes to 50 files:
# - 45 files: only trailing newlines
# - 5 files: actual code changes

# Commit nits separately
sc git commit --nit --yes
# ✅ Committed 45 files
# 📋 5 substantive files remain

# Commit substantive changes
git add src/auth/*.ts
git commit -m "feat: Add OAuth 2.0 support (REQ-042)"
```

---

## 25. Merge Strategy with sc git

### Using sc git merge

**Safe merge with automation**:

```bash
# Check repository context first
sc git check

# Safe merge with validation
sc git merge --push --delete-local
```

**What sc git merge does**:

1. ✅ Validates branch state
2. ✅ Updates main branch
3. ✅ Rebases feature branch on main
4. ✅ Runs tests
5. ✅ Merges with --no-ff
6. ✅ Pushes to remote (if --push)
7. ✅ Deletes local branch (if --delete-local)
8. ✅ Updates requirement status

### Pre-Merge Checklist

**Before merging**:

- [ ] All commits related to feature/requirement
- [ ] Feature branch up to date with main
- [ ] All tests pass locally
- [ ] Pre-push hooks pass
- [ ] GitHub workflow checks green
- [ ] Code reviewed (if team requires)
- [ ] Documentation updated
- [ ] No merge conflicts

### Merge Workflow

```bash
# 1. Final testing
npm test
npm run build

# 2. Check repository context
sc git check

# 3. Safe merge
sc git merge --push --delete-local

# Output:
# ✅ Branch validated
# ✅ Main branch updated
# ✅ Rebase successful
# ✅ Tests passed
# ✅ Merge completed
# ✅ Pushed to remote
# ✅ Local branch deleted
# ✅ Requirement REQ-042 updated to 'merged'
```

### Conflict Resolution

**When conflicts occur**:

1. **Pause**: Don't auto-resolve
2. **Analyze**: Understand both changes
3. **Resolve**: Manual edit to preserve intent
4. **Test**: Ensure merged code works
5. **Document**: Comment on complex resolutions

**Example**:

```bash
# Conflict during rebase
git rebase main

# CONFLICT in src/auth.service.ts
# <<<<<<< HEAD (main)
# Old implementation
# =======
# Your implementation
# >>>>>>> feature/auth-login

# 1. Edit file to resolve
# 2. Test resolution
npm test

# 3. Continue rebase
git add src/auth.service.ts
git rebase --continue

# 4. Complete merge
sc git merge --push
```

---

## 26. Approval Workflows (Fast-Paced Collaboration)

### The Approval Challenge

**Problem**: Multiple approvals slow down velocity

**Solution**: Tiered approval strategy

### Approval Tiers

#### Tier 1: Technical Validation (Automated)

**Always required** (no bypass):

- ✅ Tests pass
- ✅ Lints clean
- ✅ Builds successfully
- ✅ Security checks pass
- ✅ Type-checks pass

**Who approves**: Automated (hooks + CI)

**Blocks**: Cannot merge if fails

#### Tier 2: Code Quality (AI + Human)

**Required for**:

- Implementation code
- Business logic
- API changes

**Who reviews**:

1. AI review first (pattern check, security audit)
2. Human spot-check (sample review, critical paths)

**Pattern**:

```bash
# 1. AI review
Person: "Review this implementation for issues"
AI: [Provides feedback]
Person: [Addresses issues]

# 2. Human spot-check (async)
# Merge proceeds, human reviews post-merge
# Issues found → follow-up PR

# 3. Commit
git commit -m "feat: Add feature

AI-reviewed: Security, patterns, edge cases
Human-review: Deferred to post-merge"
```

**Why**: AI catches most issues, human review async

#### Tier 3: Architectural Decisions (Team Approval)

**Required for**:

- System architecture changes
- Major refactors
- Breaking API changes
- Security-critical code
- New technology adoption

**Who approves**: Tech lead + relevant team members

**Pattern**:

```markdown
# Architecture Decision Record (ADR)

## Status: Proposed → Under Review → Approved

## Decision

[What we're doing]

## Rationale

[Why we're doing it]

## Alternatives Considered

[What we didn't choose and why]

## Consequences

[Trade-offs]

## Approval

- [x] Tech Lead: @username (Approved 2024-11-22)
- [x] Backend Team: @team (Approved 2024-11-22)
- [ ] Security Team: @security (Pending)
```

**Blocks**: Implementation waits for approval

#### Tier 4: Business/Product Decisions (Stakeholder Approval)

**Required for**:

- User-facing features
- Data model changes
- Workflow changes
- Compliance requirements

**Who approves**: Product owner + stakeholders

**Pattern**: Gherkin scenarios + approval

```gherkin
Feature: User Authentication

  Scenario: User logs in with email
    Given I am on the login page
    When I enter valid credentials
    Then I should be logged in

Status: ✅ Approved by Product (2024-11-22)
Status: ✅ Approved by Security (2024-11-22)
Status: 🔄 Implementation in progress
```

### Fast-Track Approval (Post-Facto)

**When to use**:

- Low-risk changes (documentation, tests)
- Urgent fixes (hotfix, production issue)
- Experimental features (behind feature flag)
- Internal tools (not user-facing)

**Process**:

1. **Implement with AI review**
2. **Pass automated checks**
3. **Merge with notification**
4. **Team reviews post-merge**
5. **Follow-up PR if issues found**

**Example**:

```bash
# 1. AI review
# [AI feedback, implementation]

# 2. Automated checks pass
npm test  # ✅
npm run build  # ✅

# 3. Merge with notification
git commit -m "feat: Add user profile caching

Tier 2 approval: AI-reviewed, post-facto human review requested
Low risk: Behind feature flag, fully tested
Notification: @team-backend for post-merge review"

sc git merge --push

# 4. Notify team
# [Slack/Email: "New feature merged, please review when available"]

# 5. Follow-up if needed
# [Team reviews, creates follow-up PR if issues]
```

**Fast-track checklist**:

- [ ] AI review completed
- [ ] All automated checks pass
- [ ] Low risk or behind feature flag
- [ ] Team notified for post-merge review
- [ ] Ready to revert if issues found

### Balancing Speed vs Safety

**High speed, lower risk**: Post-facto approval

- Documentation changes
- Test additions
- Internal tools
- Feature-flagged experiments

**High safety, may be slower**: Pre-merge approval

- Production database migrations
- Security changes
- Breaking API changes
- Compliance-related code

### Emergency Override Process

**When**: Production outage, critical security fix

**Process**:

1. Fix implemented
2. AI review (quick check)
3. Automated tests (if possible)
4. Merge with `--no-verify` (if hooks block)
5. Immediate post-deploy verification
6. Team notification
7. Retrospective (why emergency, how to prevent)

**Example**:

```bash
# Production auth service down
git checkout -b hotfix/auth-token-validation
# [Implement fix]

npm test  # ✅ Tests pass

git commit -m "hotfix: Fix auth token validation causing 500s

EMERGENCY: Production outage
Bypassing: Pre-push hooks (time-critical)
AI-reviewed: Security check passed
Deployed to: Production immediately
Notification: @team, @oncall

Retrospective: Scheduled for 2024-11-23"

git push origin hotfix/auth-token-validation --no-verify

# Deploy immediately
# [Deploy process]

# Notify team
# [Incident report, retrospective scheduled]
```

---

## Git Naming Conventions

### Branch Naming

**Format**: `{type}/{ticket-id}-{short-description}`

**Types**:

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

**Examples**:

```
feature/US-2024-101-enable-mfa
fix/BR-2024-042-token-refresh-bug
refactor/auth-service-cleanup
docs/api-documentation-update
```

### Commit Message Format

**Pattern**: `{type}({scope}): {description}`

**Types** (Conventional Commits):

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructure
- `test` - Tests
- `chore` - Maintenance

**Scope** (IMPORTANT):

- **Feature name** (primary) - Use when feature name is unique: `feat(auth):`
- **Domain/feature** - ONLY when duplicate names: `feat(workflow-management/planning):`
- **Domain** - ONLY for cross-feature work: `feat(workflow-management):`
- **Component** - For infrastructure: `feat(api):`, `feat(ui):`

**Examples**:

```
feat(auth): implement JWT token rotation
fix(wip-registry): resolve user tracking bug
docs(telemetry): update tracking docs
test(auth): add E2E tests for MFA flow

# Only use domain/feature when disambiguating duplicates
feat(workflow-management/planning): update workflow docs
feat(dashboard-platform/planning): add planning view
```

### With Traceability

```
feat(auth): implement MFA (REQ-042)
fix(wip-registry): user tracking bug (REQ-144, closes TASK-050)
```

### Tag Naming

**Format**: `v{major}.{minor}.{patch}`

- Semantic versioning
- Example: `v1.2.3`, `v2.0.0-beta.1`

---

## Template Sync Commits

### Special Case: Template Synchronization

**Context**: When syncing canonical templates from `supernal-code-package/templates/` to project docs, special commit handling is required to preserve approval history.

### Commit Message Format

#### Minor Template Sync (No Re-Approval Needed)

```bash
docs: Template sync - typo fixes, no re-approval needed

Files updated:
- docs/workflow/sops/general/SOP-0.1.05-requirements-planning.md
- docs/workflow/sops/general/SOP-0.1.10-documentation.md

Changes: Fixed typos, updated links
Approval status: Remains approved
```

#### Major Template Sync (Re-Approval Required)

```bash
docs: Template sync - requires re-approval

Files updated:
- docs/workflow/sops/general/SOP-0.1.05-requirements-planning.md
- docs/workflow/sops/general/SOP-0.1.11-decision-tracking.md

Changes: Added compliance sections, restructured approval gates
Version: 1.0 → 1.1 (pending-review)
Status: pending-review
Required approvers: @tech-lead, @compliance-lead
Report: .supernal/reports/TEMPLATE_SYNC_APPROVAL_REQUIRED.md
```

#### Post-Approval Commit

```bash
docs: Approve template sync changes

Approved-by: @tech-lead, @compliance-lead
Date: 2025-11-30
Version: 1.1 → approved

Files approved:
- docs/workflow/sops/general/SOP-0.1.05-requirements-planning.md
- docs/workflow/sops/general/SOP-0.1.11-decision-tracking.md

Review notes: Approved after clarifying section 7.3 requirements
```

### Template Sync Workflow

**1. Before Sync**:
```bash
# Create tracking branch
git checkout -b template-sync/$(date +%Y%m%d)

# Check current approval status
sc docs list --status=approved
```

**2. Execute Sync**:
```bash
# Smart merge with approval preservation
sc docs merge-templates --report

# Review changes
git diff docs/workflow/
```

**3. Commit Changes**:
```bash
# Stage template-synced files
git add docs/workflow/sops/
git add .supernal/reports/TEMPLATE_SYNC_APPROVAL_REQUIRED.md

# Commit with appropriate message (see formats above)
git commit -m "docs: Template sync - requires re-approval

[Full message with file list and changes]"
```

**4. Review & Approval**:
```bash
# Share approval report with reviewers
cat .supernal/reports/TEMPLATE_SYNC_APPROVAL_REQUIRED.md

# Wait for approvals
# Update frontmatter when approved

# Commit approvals
git add docs/workflow/sops/
git commit -m "docs: Approve template sync changes

Approved-by: @tech-lead, @compliance-lead
..."
```

**5. Merge**:
```bash
# Merge to main
git checkout main
git merge template-sync/$(date +%Y%m%d) --no-ff

# Clean up
git branch -d template-sync/$(date +%Y%m%d)
```

### Anti-Patterns

❌ **DON'T: Bypass Approval Process**
```bash
# Never do this
rsync -av templates/ docs/
git add .
git commit -m "docs: update" # Missing approval info
```

❌ **DON'T: Skip Reporting**
```bash
# Always include the report
git add docs/
# Missing: .supernal/reports/TEMPLATE_SYNC_APPROVAL_REQUIRED.md
git commit -m "docs: template sync"
```

### Best Practices

✅ **DO: Use Smart Merge Tool**
```bash
sc docs merge-templates --dry-run  # Preview first
sc docs merge-templates --report   # Generate report
sc docs merge-templates            # Execute
```

✅ **DO: Include Full Context**
- List all affected files
- Describe changes clearly
- State approval requirements
- Reference approval report
- Tag required reviewers

✅ **DO: Separate Commits**
- Commit 1: Template sync (with pending-review status)
- Commit 2: Approvals (after review)
- Don't mix with other changes

### Related Documentation

- [SOP-0.1.10: Template Synchronization & Approval](SOP-0.1.10-documentation.md#template-synchronization--approval)
- [SOP-0.1.13: Template Sync Changes](SOP-0.1.13-change-control.md#template-sync-changes)
- [Cursor Rule: Template Sync Policy](../../../../.cursor/rules/template-sync-policy.mdc)

---

## Navigation

← Previous: [Part 11](SOP-0.1.11-decision-tracking.md)
→ Next: [Part 13](SOP-0.1.13-change-control.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
