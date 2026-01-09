---
title: Multi-Feature Branch Workflow
sop_id: SOP-T.07
version: 1.0
status: needs_approval
created: 2025-12-02
updated: 2025-12-02
category: tools
applies_to: [features, branches, workflow, git]
---

# SOP-T.07: Multi-Feature Branch Workflow

## Purpose

Define the workflow for working on multiple related features within the same branch, using WIP tracking and feature tagging to maintain clarity and enable parallel development.

## Workflow Evolution

**This SOP describes the pattern now formalized as "Work Sessions".**

**Recommended Approach** (2025-12-15):
- **Work Sessions** (REQ-WORKFLOW-139): Personal session branches for multi-feature work
- See: `docs/features/workflow-management/work-sessions/README.md`

**This SOP remains valid** for understanding the multi-feature pattern and WIP tracking, but work sessions provide:
- Clearer naming conventions (`session-{person}-{date}`)
- Better tooling (`sc session start/finish`)
- Lifecycle management
- Multi-person coordination

**Use this SOP for**: Understanding the pattern
**Use work sessions for**: Implementation

## Core Principle

**SPEED: Work on multiple features simultaneously for maximum velocity.**

Work on multiple features on the SAME BRANCH to move fast. Features can be:
- ✅ **Unrelated domains** (no dependencies)
- ✅ **Related domains with defined contracts** (API interfaces, types, schemas established first)
- ✅ **Same domain** (if interfaces are clear)

**Key constraint**: Define interfaces/contracts FIRST. Then develop in parallel independently.

## When to Use Multi-Feature Branches

### ✅ **Best: Contract-First Development**

```bash
# Payment System - Define contract first
feature/payment-system
  - payment-types     (REQ-099) - Define interfaces FIRST
  - payment-api       (REQ-100) - Implements contract
  - payment-ui        (REQ-101) - Uses contract
  - payment-tests     (REQ-102) - Tests contract
```

**Why This Works**:
1. Define shared types/interfaces first:
```typescript
// Step 1: Define contract (commit this first)
interface PaymentRequest {
  amount: number;
  currency: string;
  customerId: string;
}

interface PaymentResponse {
  transactionId: string;
  status: 'success' | 'failed';
  timestamp: string;
}
```

2. Both teams work independently:
- **API team**: Implements `PaymentRequest → PaymentResponse`
- **UI team**: Uses `PaymentRequest` and `PaymentResponse` types
- **No blocking dependencies** - both work in parallel

### ✅ **Unrelated Domains**

```bash
# Sprint Work - Completely independent
feature/sprint-1
  - payment-api      (REQ-100) - src/payment/
  - auth-dashboard   (REQ-101) - src/dashboard/
  - email-templates  (REQ-102) - src/email/
```

**Why This Works**:
- Different folders = no file conflicts
- No shared dependencies
- Maximum parallelism too much simultaneously 

### ❌ **DON'T: Undefined Interfaces**

```bash
# BAD - No contract defined
feature/payment-flow
  - payment-api      (undefined interface)
  - payment-ui       (doesn't know what API will return)
```

**Why This Fails**:
- payment-ui doesn't know request/response format
- API changes break UI unexpectedly
- Back-and-forth dependency hell

**Fix**: Define contract first!

```bash
# GOOD - Contract-first
feature/payment-flow
  1. payment-types.ts    (Define interfaces FIRST - commit this)
  2. payment-api         (Implements interfaces)
  3. payment-ui          (Uses interfaces)
  # Both api and ui developed independently in parallel!
```

## Complete Workflow

### 1. Create Feature Branch

```bash
# Name by domain/sprint
git checkout -b feature/payment-sprint

# Or by epic
git checkout -b feature/auth-implementation
```

### 2. Register Multiple Features

```bash
# Contract-first: Define types first
sc fbc add payment-types \
  --description="Payment API contract (interfaces, types)" \
  --requirements=REQ-099

# Then register features that use the contract
sc fbc add payment-api \
  --description="Payment processing API (implements contract)" \
  --requirements=REQ-100

sc fbc add payment-ui \
  --description="Checkout UI (uses contract)" \
  --requirements=REQ-101

sc fbc add payment-tests \
  --description="Contract validation tests" \
  --requirements=REQ-102
```

### 3. Work on Multiple Features with WIP Tracking

```bash
# STEP 1: Define contract FIRST (commit this immediately)
touch src/payment/types.ts
cat > src/payment/types.ts << 'EOF'
// Payment API Contract - REQ-099
export interface PaymentRequest {
  amount: number;
  currency: string;
  customerId: string;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  errorMessage?: string;
}

export interface PaymentAPI {
  processPayment(req: PaymentRequest): Promise<PaymentResponse>;
}
EOF

git add src/payment/types.ts
git commit -m "[FEATURE:payment-types] REQ-099: Define payment API contract

✅ Establishes interface for parallel development
- PaymentRequest interface
- PaymentResponse interface  
- PaymentAPI contract

API and UI teams can now work independently"

# STEP 2: Now work on API and UI IN PARALLEL (no blocking!)

# API Team - implements contract
touch src/payment/api.ts
vim src/payment/api.ts  # Implements PaymentAPI
npm test -- src/payment/api.test.ts  # Test against contract

git add src/payment/api.ts
git commit -m "[FEATURE:payment-api] REQ-100: Implement payment API

✅ Tests passing - implements PaymentAPI contract
- POST /api/payment/charge
- Validates PaymentRequest
- Returns PaymentResponse"

# UI Team - uses contract (developed simultaneously!)
touch src/payment/CheckoutForm.tsx
vim src/payment/CheckoutForm.tsx  # Uses PaymentRequest/Response
npm test -- src/payment/CheckoutForm.test.tsx  # Mock API with contract

git add src/payment/CheckoutForm.tsx
git commit -m "[FEATURE:payment-ui] REQ-101: Build checkout form

✅ Tests passing - uses PaymentAPI contract
- Form validates PaymentRequest format
- Handles PaymentResponse states
- No dependency on API implementation"
```

**Key**: Define contract first, then both teams work independently. No blocking!

### 4. See What You're Working On

```bash
# List all WIP files
sc wip list

# Output:
# src/payment/api.ts         payment-api | 1h ago
# src/payment/types.ts       payment-api | 1h ago
# src/payment/Checkout.tsx   payment-ui  | 30m ago
# src/payment/audit.ts       payment-compliance | 10m ago

# See commits by feature
git log --grep="[FEATURE:payment-api]"
git log --grep="[FEATURE:payment-ui]"

# Or use the command
sc fbc commits payment-api
sc fbc list  # Show all features
```

### 5. Create PR When Domain Work Complete

```bash
# Test everything
npm test
npm run build

# Create PR with all features
gh pr create --title "Payment Sprint: API + UI + Compliance" \
  --body "Implements:
- REQ-100: Payment API endpoint
- REQ-101: Checkout UI
- REQ-102: Audit logging

All features tested and integrated."
```

## Key Principles

### 1. **Contract-First Development**

Define interfaces/types/schemas FIRST:
```typescript
// 1. Define contract (commit immediately)
interface UserAPI {
  getUser(id: string): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
}

// 2. Multiple teams work in parallel
// - Backend implements UserAPI
// - Frontend uses UserAPI (with mocks)
// - QA tests against UserAPI contract
// NO BLOCKING DEPENDENCIES
```

### 2. **Speed Through Parallel Work**

Work on multiple features simultaneously:
- **Contract-first**: Same domain, parallel development
- **Unrelated domains**: Different folders, no conflicts
- **Key**: Clear interfaces enable parallelism

### 3. **Same Domain is FINE if Contract is Clear**

```bash
# GOOD - Contract defined, parallel work
feature/payment-system
  - payment-types      (Contract - commit first)
  - payment-api        (Implements contract)
  - payment-ui         (Uses contract)
  - payment-tests      (Validates contract)
  # All developed in parallel after types committed!
```

### 4. **Commit Frequently: Only Tested Code**

```bash
# ✅ DO: Test before committing
npm test -- src/payment/api.test.ts
git commit -m "[FEATURE:payment-api] REQ-100: Add endpoint ✅ Tests passing"

# ❌ DON'T: Commit untested code
git commit -m "[FEATURE:payment-api] REQ-100: Add endpoint (untested)"
```

### 5. **Feature Tagging for Clarity**

Every commit tagged with `[FEATURE:name]`:
- Clear what each commit does
- Can filter by feature
- Track progress independently

## Examples

### Example 1: Contract-First Payment System (Same Domain - Parallel!)

```bash
git checkout -b feature/payment-system

# Define contract FIRST
sc fbc add payment-types --requirements=REQ-099
# ... write types.ts, commit immediately

# Now work on everything in parallel
sc fbc add payment-api --requirements=REQ-100
sc fbc add payment-ui --requirements=REQ-101
sc fbc add payment-tests --requirements=REQ-102

# All three developed simultaneously - no blocking!
git commit -m "[FEATURE:payment-types] REQ-099: Define contract ✅"
git commit -m "[FEATURE:payment-api] REQ-100: Implement API ✅ Tests passing"
git commit -m "[FEATURE:payment-ui] REQ-101: Build UI ✅ Tests passing"
git commit -m "[FEATURE:payment-tests] REQ-102: E2E tests ✅ Tests passing"

gh pr create --title "Payment System: API + UI + Tests"
```

### Example 2: Sprint Work (Unrelated Domains)

```bash
git checkout -b feature/sprint-3

# Three unrelated features, no shared contracts needed
sc fbc add payment-api --requirements=REQ-100
sc fbc add dashboard-metrics --requirements=REQ-101
sc fbc add email-notifications --requirements=REQ-102

# Work on all three in parallel
git commit -m "[FEATURE:payment-api] REQ-100: Add endpoint ✅ Tests passing"
git commit -m "[FEATURE:dashboard-metrics] REQ-101: Add charts ✅ Tests passing"
git commit -m "[FEATURE:email-notifications] REQ-102: Add templates ✅ Tests passing"

gh pr create --title "Sprint 3: Payment + Dashboard + Email"
```

### Example 3: DON'T Do This (No Contract)

```bash
# BAD - No contract, UI blocks on API
git checkout -b feature/payment-system

sc fbc add payment-api
sc fbc add payment-ui  # Blocks! Doesn't know API format

# Problem: UI team waits for API team to finish
# Solution: Define contract first, then parallel work!
```

## Integration with Other Tools

### WIP Registry

```bash
# Register files by feature
sc wip register <file> --feature=<feature-name> --requirement=REQ-XXX
```

### Feature-Based Commits

```bash
# Tag commits by feature
git commit -m "[FEATURE:name] REQ-XXX: Description"
```

### sc git-smart

```bash
# Safe merge when ready
sc git-smart check-branch
sc git-smart merge --push --delete-local
```

## Related SOPs

- [SOP-T.06: Feature Branch Workflow](SOP-T.06-feature-branch-workflow.md) - Single-feature workflow
- [SOP-0.1.12: Git Workflow](../general/SOP-0.1.12-git-workflow.md) - General git practices
- [WIP Registry Rule](../../../../.cursor/rules/wip-registry.mdc) - WIP tracking system

---

**Created**: 2025-12-02  
**Status**: Draft  
**Key Principles**: 
- **CONTRACT-FIRST**: Define interfaces/types first, then parallel development
- **SPEED**: Work on multiple features simultaneously (same or different domains)
- **NO BLOCKING**: Clear contracts eliminate dependencies
- **COMMIT**: Only tested, working code frequently

