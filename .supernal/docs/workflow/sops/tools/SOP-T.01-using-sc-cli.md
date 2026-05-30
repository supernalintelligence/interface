---
type: sop
category: tool
sop_id: SOP-T.01
title: Using sc CLI
phase: null
group: null
part_number: null
audience: [developers, ai-agents]
read_time: 45
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0, SOP-0.1]
prerequisites: []
tags: [cli, tools, sc, commands, requirements, validation]
---

# SOP-T.01: Using `sc` with AI Agents

**Purpose**: How `sc` CLI enables AI-first development in Supernal Coding  
**Scope**: All development using `sc` commands with AI assistance  
**Prerequisites**: Read [SOP-0.1: AI-Accelerated Workflow] (see project documentation)

---

## Overview

The `sc` CLI is designed for **AI-first development**. Every command is:

- **AI-friendly**: Structured output, clear success/failure
- **Traceable**: Links requirements → git → tests → docs
- **Validated**: Built-in quality checks
- **Integrated**: Git-smart workflow automation

### Core Philosophy

```
Human: "Create requirement for user login"
AI: sc req new "User login with JWT" --epic=auth --priority=high
AI: "Created REQ-042. Ready to write requirements."
```

**Target Velocity** (per developer):

- **1 epic per week** (5-8 features)
- **Multiple features per day** (2-4 features)
- **AI accelerates**: Research, requirements, tests, implementation

---

## The `sc` Command Structure

### Requirement Lifecycle

```bash
# 1. Create requirement
sc req new "Feature title" --epic=epic-name --priority=high --request-type=feature

# 2. Validate requirement
sc req validate REQ-XXX

# 3. Create branch if needed (optional - can work on main)
# Work session: sc session start --name=alice-dec15
# Feature branch: sc git-smart branch --branch=feature/req-XXX-title

# 4. Mark in-progress and update during development
sc req update REQ-XXX --status=in-progress
sc req update REQ-XXX --prompt="Discovered X, need to handle Y"

# 5. Mark complete
sc req update REQ-XXX --status=done
```

### Git-Smart Integration

```bash
# Check context before committing
sc git-smart check-context

# Merge feature when done
sc git-smart merge --push --delete-local

# Deploy (if configured)
sc git-smart deploy --env=staging
```

### Testing Commands

```bash
# Run tests for specific requirement
sc test requirement REQ-XXX

# Check coverage
sc test coverage REQ-XXX

# Generate tests from Gherkin
sc req generate-tests REQ-XXX
```

### Test Evidence Logging (REQ-106)

```bash
# Run any test with evidence logging
sc test run 'npm test'

# Link to requirement (compliance evidence)
sc test run 'npm test' --req REQ-101

# List test results
sc test results

# Show specific result
sc test results show test-2025-12-03-001

# Export for compliance
sc test results export --since 2025-12-01
```

---

## AI + `sc` Workflows

### Workflow 1: New Feature (Full Lifecycle)

**Human initiates**:

```
Human: "Create new feature for password reset with email verification"
```

**AI executes with `sc`**:

```bash
# Step 1: Create requirement
AI: sc req new "Password reset with email verification" \
      --epic=auth \
      --priority=high \
      --request-type=feature

Output: Created REQ-043

# Step 2: AI writes requirement content (Gherkin, specs)
AI: [Writes requirement in req-043-password-reset.md]

# Step 3: Validate
AI: sc req validate 043

Output: ✅ All checks pass
- Frontmatter valid
- 5 Gherkin scenarios found
- Cross-references valid

# Step 4: Generate tests
AI: sc req generate-tests 043

Output: Created:
- tests/requirements/req-043/e2e/password-reset.spec.js
- tests/requirements/req-043/unit/email-service.test.js
- tests/requirements/req-043/fixtures/test-users.json

# Step 5: Create branch and mark in-progress
AI: sc git-smart branch --branch=feature/req-043-password-reset
AI: sc req update 043 --status=in-progress

Output:
- Created branch: feature/req-043-password-reset
- Updated requirement status: in-progress
- Ready for implementation

# Step 6: Implement (iteratively)
AI: [Implements feature, runs tests]
AI: npm test -- req-043

Output: 12/12 tests passing ✅

# Step 7: Check context before merge
AI: sc git-smart check-context

Output:
- Working tree clean
- All tests passing
- On branch: feature/req-043-password-reset
- Ready to merge

# Step 8: Merge
AI: sc git-smart merge --push --delete-local

Output:
- Merged to main
- Pushed to remote
- Deleted local branch
- REQ-043 status updated: done
```

**Result**: Complete feature in 1-2 hours (with AI assistance)

---

### Workflow 2: Bug Fix (Fast Path)

**Human reports**:

```
Human: "Users can't log in with special characters in password"
```

**AI executes**:

```bash
# Create bug requirement
AI: sc req new "Fix login with special chars" \
      --epic=auth \
      --priority=critical \
      --request-type=bug

Output: Created REQ-044

# AI writes repro steps and fix plan
AI: [Documents bug in req-044-*.md]

# Validate and begin work
AI: sc req validate 044
AI: sc git-smart branch --branch=feature/req-044-bug-fix
AI: sc req update 044 --status=in-progress

# Add test for bug
AI: [Adds failing test for bug]
AI: npm test -- req-044

Output: 1/1 failing ✅ (expected)

# Fix bug
AI: [Implements fix]
AI: npm test -- req-044

Output: 1/1 passing ✅

# Merge
AI: sc git-smart check-context
AI: sc git-smart merge --push --delete-local
```

**Result**: Bug fixed in 30-60 minutes

---

### Workflow 3: Research First (Complex Feature)

**Human requests**:

```
Human: "Research OAuth 2.1 implementation for our auth system"
```

**AI executes**:

```bash
# No sc command yet - pure research phase
AI: [Researches OAuth 2.1 best practices]
AI: [Creates research doc in docs/research_and_analysis/]

# After research, human approves feature
Human: "Create requirement based on this research"

AI: sc req new "Implement OAuth 2.1 authorization" \
      --epic=auth \
      --priority=high \
      --request-type=feature

# Continue with normal workflow...
AI: sc req validate 045
AI: sc req generate-tests 045
AI: sc git-smart branch --branch=feature/req-045-oauth
AI: sc req update 045 --status=in-progress
# ... etc
```

---

## `sc` Command Reference for AI

### Requirement Commands

```bash
# Create new requirement
sc req new "Title" --epic=name --priority=high --request-type=feature|bug|enhancement|maintenance

# List requirements
sc req list

# Show specific requirement
sc req show REQ-XXX

# Validate requirement
sc req validate REQ-XXX

# Generate tests from Gherkin
sc req generate-tests REQ-XXX

# Update requirement status
sc req update REQ-XXX --status=in-progress|done|blocked

# Update with context
sc req update REQ-XXX --prompt="Additional context about changes"
```

### Git-Smart Commands

```bash
# Create branch if needed (optional)
sc session start --name=alice-dec15  # Work session (preferred)
sc git-smart branch --branch=feature/my-feature  # Feature branch (optional)

# Check if ready to merge
sc git-smart check-context

# Check which branch you're on
sc git-smart check-branch

# Merge
sc git-smart merge --push --delete-local

# Deploy to environment
sc git-smart deploy --env=staging|production
```

### Git Hooks Commands

```bash
# Install hooks
sc git-hooks install

# Check hook status
sc git-hooks status

# Run pre-commit checks manually
sc git-hooks pre-commit

# Run pre-push checks manually
sc git-hooks pre-push

# Run safety checks
sc git-hooks safety
```

### Testing Commands

```bash
# Run tests for requirement
sc test requirement REQ-XXX

# Check test coverage
sc test coverage REQ-XXX

# Run full test suite
npm test  # or sc test if configured
```

### Documentation Commands

```bash
# Validate document structure
sc docs validate path/to/doc.md

# Process planning docs to create files (Documentation-Driven Development)
sc docs process docs/features/my-feature/planning/implementation-plan.md

# Check and fix broken links
sc docs links --fix

# Sync templates preserving approval history
sc docs merge-templates --dry-run
sc docs merge-templates

# Generate documentation
sc docs generate --milestone=q1-2025

# Update rules
sc rules update path/to/rule.mdc
```

#### Documentation-Driven Development

The `sc docs process` command enables writing implementation plans with code blocks that automatically become files:

```markdown
**File**: `src/utils/helper.ts`

```typescript
export const helper = () => 'value';
```
```

After running `sc docs process`, the system:
- Creates files at specified paths
- Creates necessary directory structures
- Marks blocks as `IMPLEMENTED` in documentation
- Removes code blocks (DRY - code lives in files, not docs)
- Detects conflicts with existing files

See [Documentation Processor Rule](../../../../.cursor/rules/documentation-processor.mdc) for full pattern details.

---

## CLI Introspection Commands

The `sc cli` command provides introspection into the CLI itself:

### Workflow Map

Generate a comprehensive map of all CLI commands and their SOP references:

```bash
# Quick ASCII tree view
sc cli workflow-map

# Full markdown with SOP references
sc cli workflow-map --format markdown

# JSON for programmatic use
sc cli workflow-map --format json

# Save to reference files
sc cli workflow-map --format markdown --output docs/reference/CLI-COMMAND-TREE.md
sc cli workflow-map --format json --output docs/reference/cli-command-tree.json
```

**Output includes**:
- All commands with descriptions and aliases
- Arguments and options for each command
- Subcommands/actions
- Cross-references to SOPs where the command is documented
- Example usages from documentation

**Use cases**:
- **AI agents**: Understanding which commands to use for tasks
- **Developers**: Finding the right command for their workflow
- **Documentation**: Ensuring SOPs reference correct commands

### Dashboard Integration

The CLI workflow map is also available in the dashboard:
1. Navigate to **CLI** section
2. Select **Workflow Map**
3. Search and explore commands interactively

---

## AI Decision Tree for `sc` Commands

```
Is this a new feature/bug?
├─ Yes → sc req new
│         └─ sc req validate
│            └─ sc req generate-tests
│               └─ sc git-smart branch
│                  └─ sc req update --status=in-progress
│                     └─ [implement]
│                        └─ sc git-smart merge
│
└─ No → Is it a git operation?
         ├─ Yes → sc git-smart [command]
         └─ No → Is it a test?
                  ├─ Yes → sc test [command]
                  └─ No → Is it documentation?
                           ├─ Yes → sc docs [command]
                           └─ No → Ask human for clarification
```

---

## Pre-Approved `sc` Commands (AI Can Run Without Asking)

These commands are **safe** for AI to run without explicit human approval:

### Always Pre-Approved

```bash
sc req list
sc req show REQ-XXX
sc req validate REQ-XXX
sc req generate-tests REQ-XXX
sc test requirement REQ-XXX
sc test coverage REQ-XXX
sc git-smart check-context
sc git-smart check-branch
sc git-hooks status
sc docs validate
```

### Pre-Approved with Context

```bash
# When creating new feature (human requested)
sc req new "Title" --epic=X --priority=Y --request-type=Z

# When beginning work on approved requirement
sc git-smart branch --branch=feature/req-XXX-title
sc req update REQ-XXX --status=in-progress

# When implementation complete and tests pass
sc req update REQ-XXX --status=done

# When ready to merge (all tests pass, clean tree)
sc git-smart merge --push --delete-local
```

### Requires Explicit Approval

```bash
# Production deployments
sc git-smart deploy --env=production

# Deleting requirements
sc req remove REQ-XXX

# Force operations
sc git-smart merge --force
```

---

## `sc` Output Parsing for AI

### Success Indicators

```bash
# Requirement created
✅ Created REQ-042: User login with JWT
   File: requirements/req-042-user-login.md
   Status: drafting

# Validation passed
✅ All checks pass
   - Frontmatter valid
   - 5 Gherkin scenarios found
   - Cross-references valid

# Tests generated
✅ Generated tests for REQ-042
   Created:
   - tests/requirements/req-042/e2e/login.spec.js
   - tests/requirements/req-042/unit/auth-service.test.js

# Branch created
✅ Started work on REQ-042
   Branch: feature/req-042-user-login
   Status: in-progress

# Merge successful
✅ Merged feature/req-042-user-login
   - Pushed to origin/main
   - Deleted local branch
   - REQ-042 status: done
```

### Error Indicators

```bash
# Validation failed
❌ Validation failed for REQ-042
   Errors:
   - Missing 'Given' step in scenario 3
   - Invalid cross-reference: ./non-existent.md

# Tests failed
❌ Tests failing: 3/12 passing
   Failures:
   - should handle expired tokens
   - should reject invalid passwords
   - should rate limit login attempts

# Merge blocked
❌ Cannot merge: uncommitted changes
   - 3 modified files
   - 1 untracked file
   Run: git status

# Branch not ready
❌ Not ready to merge
   - Tests failing: 3/12
   - Uncommitted changes: 2 files
```

---

## Velocity Targets with AI + `sc`

### Per Developer

**Daily** (8 hours):

- 2-4 features completed (small to medium)
- 8-16 requirements created
- 100-200 tests generated and passing

**Weekly** (1 sprint):

- 1 epic completed (5-8 features)
- 10-25 features across all epics
- 500+ tests generated and passing

### Example Week

```
Monday:
- Feature 1: User login (2 hours) → DONE
- Feature 2: Token refresh (1.5 hours) → DONE
- Feature 3: Password reset (2 hours) → DONE

Tuesday:
- Feature 4: Email verification (2 hours) → DONE
- Feature 5: 2FA setup (3 hours) → DONE

Wednesday:
- Feature 6: OAuth integration (4 hours) → DONE
- Feature 7: SSO support (2 hours) → DONE

Thursday:
- Feature 8: Session management (2 hours) → DONE
- Epic integration & testing (4 hours)

Friday:
- Epic review & refinements (2 hours)
- Epic merge & deployment (2 hours)
- Next epic planning (2 hours)

Result: Auth Epic COMPLETE (8 features)
```

### AI Acceleration Factors

- **Requirements**: 3-5x faster with AI generation
- **Tests**: 5-10x faster with AI generation from Gherkin
- **Implementation**: 2-4x faster with AI pair programming
- **Debug**: 3-5x faster with AI analysis

**Overall**: 3-5x faster than solo development

---

## `sc` Error Handling for AI

### When `sc` Command Fails

**Pattern**:

```
1. AI runs command
2. Command fails with error
3. AI analyzes error
4. AI attempts fix
5. AI re-runs command
6. If still fails → Ask human
```

**Example**:

```bash
# Attempt 1
AI: sc req validate 042

❌ Missing 'Given' step in scenario 3

# Fix
AI: [Adds 'Given' step to scenario 3]

# Attempt 2
AI: sc req validate 042

✅ All checks pass
```

### Common Errors and Fixes

| Error                  | Fix                                 |
| ---------------------- | ----------------------------------- |
| Missing frontmatter    | Add required frontmatter fields     |
| Invalid Gherkin        | Fix scenario syntax                 |
| Broken cross-reference | Update path or create missing file  |
| Uncommitted changes    | Commit or stash changes             |
| Tests failing          | Debug and fix implementation        |
| Branch exists          | Switch to branch or create new name |

---

## Integration with AI Workflow

### Phase 5: Requirements

```
Human: "Generate requirements for user login"
AI: sc req new "User login" --epic=auth --priority=high
AI: [Writes Gherkin scenarios]
AI: sc req validate 042
```

### Phase 6: Test Planning

```
AI: sc req generate-tests 042
AI: npm test -- req-042  # Verify tests fail
```

### Phase 7: Implementation

```
AI: sc git-smart branch --branch=feature/req-042-title
AI: sc req update 042 --status=in-progress
AI: [Implements feature iteratively]
AI: npm test -- req-042  # Verify tests pass
```

### Phase 8: Integration

```
AI: sc git-smart check-context
AI: sc git-smart merge --push --delete-local
```

---

## Best Practices

### DO

- ✅ Always validate before starting work (`sc req validate`)
- ✅ Generate tests from Gherkin (`sc req generate-tests`)
- ✅ Check context before merging (`sc git-smart check-context`)
- ✅ Use requirement traceability (REQ-XXX in commits)
- ✅ Run tests frequently during implementation
- ✅ Update requirement status as work progresses

### DON'T

- ❌ Skip validation steps
- ❌ Merge without tests passing
- ❌ Create requirements without epics
- ❌ Force operations without human approval
- ❌ Deploy to production without approval
- ❌ Bypass git hooks unnecessarily

---

## Related SOPs

- [SOP-0: Complete Development Workflow] (see project documentation)
- [SOP-0.1: AI-Driven Development Principles] (see project documentation)
- [SOP-003: Development Phase Breakdown] (see project documentation)
