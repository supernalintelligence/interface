---
type: sop
category: phase-workflow
sop_id: SOP-6.02
title: E2E Testing
phase: 6
group: null
part_number: null
audience: [developers, qa]
read_time: 25
created: 2025-11-21
updated: 2025-11-28
status: needs_approval
version: '1.0'
author: Supernal Coding Team
template_source: https://github.com/supernalintelligence/supernal-coding
template_version: 'main@130c177'
project_name: '@supernal/interface'
reviewedBy: []
reviewDates: []
related_sops: [SOP-0, SOP-6.01]
prerequisites: [SOP-5.01, SOP-6.01]
tags: [testing, e2e, playwright, automation, phase-6]
---

# E2E Testing

## 28. Playwright End-to-End Testing

### Why E2E Testing Matters

**Unit tests verify**: Individual functions work  
**Integration tests verify**: Services work together  
**E2E tests verify**: **Users can actually use the feature**

**AI-generated code needs E2E tests because**:

- AI doesn't see full user flow
- Integration bugs happen
- UI/UX issues aren't caught by unit tests

### Playwright Setup

**Install** (already in supernal-dashboard):

```json
// package.json
{
  "devDependencies": {
    "@playwright/test": "^1.53.0"
  },
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

**Run tests**:

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with UI (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug -- auth.spec.ts
```

### Writing E2E Tests

**Location**: `tests/e2e/\{feature\}.spec.ts`

**Basic test structure**:

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('http://localhost:3000/login');

    // 2. Fill in form
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');

    // 3. Submit
    await page.click('[data-testid="login-button"]');

    // 4. Verify redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    // 5. Verify user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-email"]')).toHaveText(
      'user@example.com'
    );
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    // Should stay on login page
    await expect(page).toHaveURL('http://localhost:3000/login');

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Invalid credentials'
    );
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    // Then logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');

    // Verify redirected to login
    await expect(page).toHaveURL('http://localhost:3000/login');

    // Verify cannot access dashboard
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});
```

### Test Data Attributes

**Use `data-testid` for stable selectors**:

```tsx
// ✅ GOOD: Stable selector
<input data-testid="email-input" type="email" />
<button data-testid="login-button">Login</button>

// ❌ BAD: Fragile selectors
<input className="form-input" /> // Class might change
<button>Login</button> // Text might change
```

**Why**: Separates test selectors from styling/behavior

### AI-Generated E2E Tests

**Pattern**: Ask AI to generate E2E tests from requirements

```
Person: "Generate Playwright E2E tests for user authentication:

Feature: User can login, logout, and access protected pages

Scenarios:
1. Login with valid credentials → redirected to dashboard
2. Login with invalid credentials → error message shown
3. Logout → redirected to login, cannot access dashboard
4. Access dashboard without login → redirected to login
5. OAuth login (Google) → redirected to Google → callback → dashboard

Use data-testid selectors.
Include happy path and error cases."

AI: [Generates comprehensive E2E test suite]

Person: [Reviews, adjusts selectors, runs tests]
```

### E2E Test Best Practices

**✅ DO**:

- Test user flows (end-to-end journeys)
- Use `data-testid` for selectors
- Test happy path + error cases
- Verify visual feedback (loading, errors, success)
- Test keyboard navigation
- Test mobile responsive (if applicable)

**❌ DON'T**:

- Test implementation details (leave to unit tests)
- Use fragile selectors (classes, IDs)
- Make tests too long (split into multiple tests)
- Ignore test failures (fix or update test)

### Running E2E in CI/CD

**GitHub workflow** (`.github/workflows/e2e.yml`):

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Start server
        run: npm start &

      - name: Wait for server
        run: npx wait-on http://localhost:3000

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

### E2E Testing Strategy

**Test pyramid**:

```
        E2E Tests (few, slow)
           ↑
    Integration Tests (some, medium)
           ↑
      Unit Tests (many, fast)
```

**E2E test priorities**:

1. **Critical user flows** (authentication, checkout, data submission)
2. **Happy paths** (everything works as expected)
3. **Common error cases** (invalid input, network errors)
4. **Edge cases** (if time permits)

**Example test plan**:

```markdown
## E2E Test Plan: Authentication Feature

### High Priority (Must Have)

- [x] Login with valid credentials
- [x] Login with invalid credentials
- [x] Logout
- [x] Access protected page without auth → redirect

### Medium Priority (Should Have)

- [x] OAuth login (Google)
- [x] Password reset flow
- [ ] Remember me checkbox
- [ ] Rate limiting (too many attempts)

### Low Priority (Nice to Have)

- [ ] Biometric authentication
- [ ] Multiple device sessions
- [ ] Session timeout
```

### Pre-Push E2E Tests

**Add to pre-push hook**:

```bash
# .husky/pre-push

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run E2E tests for critical flows only (fast subset)
npm run test:e2e -- --grep "@critical"

# If E2E tests fail, prevent push
if [ $? -ne 0 ]; then
  echo "❌ Critical E2E tests failed. Fix tests before pushing."
  exit 1
fi
```

**Mark critical tests**:

```typescript
test('should login with valid credentials @critical', async ({ page }) => {
  // Test implementation
});
```

---

# Notify team

# [Incident report, retrospective scheduled]

```

---

## Expected Documentation

### Architecture/Planning
- **E2E Test Suite**: `tests/e2e/` - Playwright test files
- **Test Scenarios**: `docs/planning/testing/e2e-scenarios.md` - Critical user flows

### Feature-Specific
- **Feature Folder**: `docs/features/\{domain\}/{feature-name}/` (phase: implementing)
  - `e2e-tests.md` - Feature E2E test documentation
  - `test-data.md` - Test data and fixtures

---
```
