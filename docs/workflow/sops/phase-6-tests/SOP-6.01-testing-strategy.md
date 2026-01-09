---
type: sop
category: phase-workflow
sop_id: SOP-6.01
title: Testing Strategy
phase: 6
group: null
part_number: null
audience: [developers, qa, ai-agents]
read_time: 30
created: 2025-11-21
updated: 2025-11-28
status: needs_approval
version: '1.0'
author: Supernal Coding Team
template_source: https://github.com/supernalintelligence/supernal-coding
template_version: 'main@920d12c'
project_name: 'supernal-coding'
reviewedBy: []
reviewDates: []
related_sops: [SOP-0, SOP-6.02]
prerequisites: [SOP-5.01]
tags: [testing, unit-tests, integration, e2e, type-checking, phase-6]
---

# Testing Strategy

**Applies To**: Phase 4: Implementation & Testing

**Type**: Phase-Specific

---

## 23. Automated Testing Strategy

### Testing is Core to AI-Accelerated Development

**Why testing matters MORE with AI**:

- AI generates code quickly
- Humans can't manually verify everything
- Automated tests catch AI mistakes
- Enables fast iteration with confidence

### Three Layers of Testing

```
1. Pre-commit hooks    ← Local, fast, prevent bad commits
2. Pre-push hooks       ← Local, comprehensive, prevent bad pushes
3. GitHub workflows     ← External, complete, prevent bad merges
```

### Layer 1: Pre-Commit Hooks

**Install once**:

```bash
sc git-hooks install
```

**What they do**:

- ✅ Lint code (ESLint, Prettier)
- ✅ Type-check (TypeScript)
- ✅ Run fast unit tests (< 10 seconds)
- ✅ Validate commit message format
- ✅ Check for sensitive data (secrets, keys)

**When they run**: Every `git commit`

**Why they matter**: Catch issues BEFORE they enter history

**Example**:

```bash
git add src/auth.service.ts
git commit -m "Add login"

# Pre-commit hook runs:
# ✅ ESLint passed
# ✅ TypeScript check passed
# ✅ Unit tests passed (3 tests, 0.8s)
# ✅ Commit message OK
# Commit succeeded
```

### Layer 2: Pre-Push Hooks

**What they do**:

- ✅ Run full test suite
- ✅ Integration tests
- ✅ Build verification
- ✅ Security checks (npm audit)
- ✅ Documentation validation

**When they run**: Every `git push`

**Why they matter**: Comprehensive validation before sharing code

**Example**:

```bash
git push origin feature/auth-login

# Pre-push hook runs:
# ✅ All tests passed (127 tests, 12.3s)
# ✅ Build successful
# ✅ No security vulnerabilities
# ✅ Documentation valid
# Push succeeded
```

### Layer 3: GitHub Workflows (CI/CD)

**What they do**:

- ✅ Run tests in clean environment
- ✅ Multi-platform testing (Linux, macOS, Windows)
- ✅ Cross-version testing (Node 18, 20, 22)
- ✅ End-to-end tests
- ✅ Deploy to staging/preview
- ✅ Performance benchmarks
- ✅ Security scanning

**When they run**: Every push, every PR

**Why they matter**: External validation, no local environment issues

**Example**:

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      - run: npm run build
```

### Never Bypass Hooks (Except Emergency)

**❌ BAD**:

```bash
git commit --no-verify  # Skips pre-commit hooks
git push --no-verify    # Skips pre-push hooks
```

**Why**: Bypassing hooks defeats automated quality

**When to bypass** (rare):

- Emergency hotfix (fix production outage)
- Hook is broken (fix the hook first)
- Metadata-only commit (documentation, no code)

**If you must bypass**:

```bash
# Document WHY in commit message
git commit --no-verify -m "docs: Update README

BYPASS REASON: Documentation only, no code changes"
```

### Test-Driven with AI

**Pattern**:

1. Write test (or have AI write test from requirements)
2. Run test (fails, as expected)
3. AI generates implementation
4. Run test (passes)
5. Refactor if needed
6. Commit when green

**Example**:

```typescript
// 1. Test first (AI generates from requirement)
describe('AuthService.login', () => {
  it('should return token for valid credentials', async () => {
    const token = await authService.login('user@example.com', 'password');
    expect(token).toBeDefined();
    expect(token.expiresAt).toBeGreaterThan(Date.now());
  });
});

// 2. Run test (RED)
// ❌ Test failed: login method not implemented

// 3. AI implements
// 4. Run test (GREEN)
// ✅ Test passed

// 5. Commit
git add src/auth.service.ts tests/auth.service.test.ts
git commit -m "feat: Add AuthService.login method"
```

---

---

## Type Checking with `sc type-check`

### Why Type Checking Matters

**Problem**: TypeScript errors caught late slow development

- Runtime errors that could be caught at compile time
- Type mismatches between components
- Breaking changes not detected early
- Refactoring becomes risky

**Solution**: Run type checking before committing

### Using `sc type-check`

```bash
# Check all TypeScript files
sc type-check

# Check specific directory
sc type-check src/features/auth

# Watch mode (continuous checking)
sc type-check --watch

# Include declaration files
sc type-check --declaration
```

### Integration with Pre-Commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run type checking
echo "🔍 Type checking..."
sc type-check

if [ $? -ne 0 ]; then
  echo "❌ Type check failed. Fix errors before committing."
  exit 1
fi

echo "✅ Type check passed"
```

### Common Type Errors AI Creates

1. **Missing Type Definitions**

```typescript
// ❌ AI might generate
function processUser(user) {
  return user.name.toUpperCase();
}

// ✅ Should be
function processUser(user: User): string {
  return user.name.toUpperCase();
}
```

2. **Type Assertions Without Validation**

```typescript
// ❌ AI might generate
const data = (await fetchData()) as UserData;

// ✅ Should validate
const data = await fetchData();
if (!isUserData(data)) {
  throw new Error('Invalid user data');
}
```

3. **Any Type Abuse**

```typescript
// ❌ AI might generate
function transform(data: any): any {
  return data.map((x) => x * 2);
}

// ✅ Should be specific
function transform(data: number[]): number[] {
  return data.map((x) => x * 2);
}
```

### Type Checking Strategy

**Before Implementation**:

- [ ] Review AI-generated types
- [ ] Ensure no `any` types without justification
- [ ] Check for proper null/undefined handling

**During Implementation**:

- [ ] Run `sc type-check --watch` in background
- [ ] Fix type errors as they appear
- [ ] Don't use type assertions as shortcuts

**Before Committing**:

- [ ] Run `sc type-check` (automated in pre-commit)
- [ ] Review any `@ts-ignore` comments
- [ ] Ensure all exports have proper types

### When to Use Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true, // Enable all strict checks
    "noImplicitAny": true, // No implicit any
    "strictNullChecks": true, // No null/undefined issues
    "strictFunctionTypes": true, // Function type safety
    "noUnusedLocals": true, // Catch unused variables
    "noUnusedParameters": true // Catch unused parameters
  }
}
```

**When to enable strict mode**:

- ✅ New projects (start strict)
- ✅ New features in existing projects
- ✅ Critical business logic
- ⚠️ Gradual migration for legacy code

### AI Pattern: Fix Type Errors

```
Person: "I'm getting these type errors:

[paste error output]

Fix them properly - no type assertions or any types."

AI: [Analyzes errors, proposes proper type fixes]

Person: [Reviews, applies fixes]
```

---

## 📁 Documentation Artifacts for This Phase

### What to Document

- Test plans and results
- Testing decisions (framework choices, test patterns)
- Pre-commit/pre-push hook configurations
- CI/CD pipeline setup

### Where to Document

```
docs/features/\{feature\}/
├── testing/
│   ├── test-plan.md          ← E2E test scenarios
│   ├── unit-test-plan.md     ← Unit test coverage
│   └── ci-config.md          ← CI/CD setup decisions
```

### When to Document

- **Before implementation**: Create test plan
- **During testing**: Document test results and issues
- **After testing**: Update with lessons learned

## Test File Naming Conventions

### Unit Tests

**Format**: `{filename}.test.ts`

- Location: Next to source file or `tests/unit/`
- Example: `authService.test.ts`

### Integration Tests

**Format**: `\{feature\}.integration.test.ts`

- Location: `tests/integration/`
- Example: `auth.integration.test.ts`

### E2E Tests

**Format**: `\{feature\}.spec.ts`

- Location: `tests/e2e/`
- Example: `auth.spec.ts`, `checkout.spec.ts`

### Test Naming Pattern

```typescript
describe('AuthService', () => {
  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      // Test
    });

    it('should throw error for invalid credentials', async () => {
      // Test
    });
  });
});
```

---

## Expected Documentation

### Architecture/Planning

- **Test Strategy**: `docs/planning/testing/test-strategy.md` - Overall testing approach
- **Test Coverage**: `docs/planning/testing/coverage-report.md` - Coverage metrics and goals

### Feature-Specific

- **Feature Folder**: `docs/features/\{domain\}/{feature-name}/` (phase: implementing)
  - `test-plan.md` - Feature test planning
  - `test-results.md` - Test execution results

---

## Test Evidence Logging (REQ-106)

### Why Log Test Evidence?

For compliance (FDA, SOC2, ISO), you must prove tests were run:

- **What** was tested (command, code)
- **When** it was tested (timestamp)
- **Who** ran it (executor)
- **What state** the code was in (git commit)
- **What happened** (pass/fail, output)

### Using `sc test run`

```bash
# Run any test command with evidence logging
sc test run 'npm test'

# Output:
# 📋 Test ID: test-2025-12-03-001
#    Command: npm test
#    Branch: main @ abc1234
#
# [test output]
#
# ✅ Test passed in 2341ms
# 📄 Result logged: .supernal/test-results/test-2025-12-03-001.json
```

### Linking Tests to Requirements

```bash
# Link test to requirement (triggers compliance evidence)
sc test run 'npm test -- doc-history' --req REQ-101

# Link to feature
sc test run 'npm test' --feature approval-workflow

# Explicit compliance flag
sc test run 'pnpm playwright test' --compliance
```

### Viewing Test Results

```bash
# List recent results
sc test results

# Show specific result
sc test results show test-2025-12-03-001

# Export for compliance report
sc test results export --since 2025-12-01
```

### Compliance vs Routine Tests

| Type | Trigger | Auto-Deleted? | Storage |
|---|---|---|---|
| **Routine** | Work session or development branch, no flags | Yes (30 days) | `.supernal/test-results/` |
| **Compliance** | `--req`, `--compliance`, main/release branch | Never | `.supernal/test-results/` |

### What Gets Logged

```json
{
  "id": "test-2025-12-03-001",
  "command": "npm test",
  "timestamp": "2025-12-03T10:30:00Z",
  "exit_code": 0,
  "duration_ms": 2341,
  "executor": "Ian Derrington",
  "git_branch": "main",
  "git_commit": "abc1234",
  "requirement_id": "REQ-101",
  "is_compliance_evidence": true,
  "evidence_reason": "linked to REQ-101, main branch"
}
```

### Manual Evidence Cleanup

**Compliance evidence requires explicit confirmation**:

```bash
# This will FAIL without --confirm
sc test evidence cleanup --before 2024-01-01

# This requires explicit confirmation and warns about compliance
sc test evidence cleanup --before 2024-01-01 --confirm
# WARNING: This may violate regulatory requirements!
```

---

## Navigation

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
