---
type: sop
category: ai-technique
sop_id: SOP-0.1.06
title: Design & Architecture
phase: null
group: B
part_number: 6
audience: [developers, architects]
read_time: 30
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.05]
prerequisites: [SOP-0.1.01]
tags: [design, architecture, organization, patterns]
---

# Design & Architecture

**Part of**: [SOP-0.1: AI-Accelerated Workflow](../SOP-0.1-ai-accelerated-workflow-overview.md)
**Sections**: 15, 16, 17, 18

---

## 15. Separation Strategies

### Layer Separation (Recommended)

```
┌─────────────────────┐
│   API Layer         │  ← HTTP, GraphQL, RPC
├─────────────────────┤
│   Business Layer    │  ← Domain logic, workflows
├─────────────────────┤
│   Data Layer        │  ← Database, cache, external APIs
└─────────────────────┘
```

**Benefits**:

- Layers work independently
- Can develop/test in parallel
- Clear contracts between layers
- Easy to replace implementations

**Example**:

```typescript
// API Layer (routes/auth.routes.ts)
router.post('/login', authController.login);

// Business Layer (services/auth.service.ts)
class AuthService {
  async login(email: string, password: string): Promise<AuthToken> {
    // Business logic
  }
}

// Data Layer (repositories/user.repository.ts)
class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    // Database query
  }
}
```

### Front-end/Back-end Separation

```
┌──────────────┐          ┌──────────────┐
│   Frontend   │ ←──────→ │   Backend    │
└──────────────┘          └──────────────┘
        │                        │
        └────────────────────────┘
            API Contract
      (OpenAPI / GraphQL Schema)
```

**Benefits**:

- Independent development
- Different deployment cycles
- Clear interface
- Team parallelization

**API Contract First**:

1. Define API contract (OpenAPI spec)
2. Frontend mocks API
3. Backend implements API
4. Integration testing verifies contract

### Event-Driven Separation

```
Component A  ──→  Message Bus  ←──  Component B
     ↑                                    ↓
     └────────────────────────────────────┘
              (Decoupled communication)
```

**When to use**:

- Async processing
- Scalability requirements
- Loose coupling needed
- Event sourcing

---

## 16. Coupling Principles

### When Tight Coupling is OK

**Acceptable tight coupling**:

- Components that always change together
- Strong domain relationship (Order → OrderItem)
- Performance critical (avoiding indirection)
- Small, cohesive modules

**Example**:

```typescript
// OK: Order and OrderItem tightly coupled
class Order {
  items: OrderItem[];

  addItem(item: OrderItem) {
    this.items.push(item);
    this.recalculateTotal();
  }
}
```

### When Loose Coupling Required

**Require loose coupling**:

- Multiple teams
- Independent deployment
- Different change frequencies
- External integrations

**Example**:

```typescript
// Good: Payment service loosely coupled via interface
interface PaymentGateway {
  charge(amount: Money): Promise<PaymentResult>;
}

class OrderService {
  constructor(private paymentGateway: PaymentGateway) {}

  async checkout(order: Order): Promise<void> {
    await this.paymentGateway.charge(order.total);
  }
}
```

### Dependency Direction

**Rule**: Dependencies point inward (toward business logic)

```
API Layer ──→ Business Layer ←── Data Layer
                    ↑
              (Core domain)
```

**Why**: Business logic should not depend on infrastructure

---

## 17. Pattern Consistency

### Following Established Patterns

**Before generating code**:

1. ✅ Check existing patterns in codebase
2. ✅ Ask: "Should I follow pattern from [existing file]?"
3. ✅ Generate code matching the pattern
4. ✅ Verify consistency with linter/formatter

**Example Prompt**:

```
"Generate UserService following the pattern in AuthService:
- Same error handling
- Same logging approach
- Same dependency injection
- Same test structure"
```

### When to Deviate from Patterns

**OK to deviate when**:

- Pattern is inappropriate for use case
- New pattern is significantly better
- Team discusses and approves change

**Process**:

1. Identify why current pattern doesn't fit
2. Propose new pattern with rationale
3. Team evaluates trade-offs
4. Team approves or rejects
5. If approved, document new pattern

**Not OK**:

- "This way seems better" (without analysis)
- Mixing multiple patterns
- Individual preference without team buy-in

### Pattern Documentation

**Document patterns in**:

- `.cursor/rules/` - For AI awareness
- `docs/reference/patterns/` - For team reference
- Code comments - For inline guidance

**Pattern doc structure**:

```markdown
# Pattern: [Name]

## When to Use

[Specific scenarios]

## Structure

[Code example]

## Trade-offs

[Pros and cons]

## Examples

[Links to usage in codebase]
```

---

## 18. Change Management

### Avoiding Breaking Changes

**Before changing**:

- [ ] Find all usages (`grep`, find references)
- [ ] Identify impact (which files, which teams)
- [ ] Create migration plan
- [ ] Discuss with affected teams
- [ ] Get approval for breaking change

**Process**:

1. **Parallel implementation** (old + new coexist)
2. **Gradual migration** (update usages one by one)
3. **Deprecation warning** (mark old as deprecated)
4. **Cutover period** (both work)
5. **Remove old** (after all migrated)

### Non-Breaking Change Pattern

**Add new, deprecate old**:

```typescript
// Old (deprecated)
/** @deprecated Use authenticateUser instead */
function authenticate(credentials: any): Promise<User> {
  return authenticateUser(credentials);
}

// New (recommended)
function authenticateUser(credentials: Credentials): Promise<User> {
  // Implementation
}
```

### Breaking Change Pattern

**When breaking change is necessary**:

1. Announce change to team
2. Document migration guide
3. Provide codemod/migration script if possible
4. Set deprecation timeline
5. Monitor migration progress
6. Remove old after deadline

**Migration guide template**:

````markdown
# Migration: Old API → New API

## What Changed

[Explanation]

## Why

[Rationale]

## How to Migrate

### Before

```typescript
// Old code
```
````

### After

```typescript
// New code
```

## Timeline

- [Date]: Deprecation announced
- [Date]: New API available
- [Date]: Old API removed

```

---




## Architecture Decision Records (ADR-NNN)

### Naming Convention
**Format**: `ADR-042-jwt-authentication.md`
- Sequential number: 3 digits
- Kebab-case title
- Location: `docs/architecture/decisions/`

### Status Values
- `Proposed` - Under discussion
- `Accepted` - Approved and implemented
- `Deprecated` - No longer recommended
- `Superseded` - Replaced by another ADR

### Design Decision Documents (DDD)

**Format**: `DDD-\{feature\}-\{topic\}.md`
- Example: `DDD-auth-token-management.md`
- Location: `docs/features/\{feature\}/design/`

## Code Organization Conventions

### Folder Structure
```

src/
├── features/ ← Feature-based (not type-based)
│ ├── auth/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ └── types/
├── shared/ ← Shared utilities
│ ├── components/
│ ├── hooks/
│ └── utils/
└── lib/ ← Core libraries

```

### Naming Conventions
- **Components**: PascalCase - `UserProfile.tsx`
- **Hooks**: camelCase with 'use' - `useAuthToken.ts`
- **Services**: camelCase with 'Service' - `authService.ts`
- **Types**: PascalCase - `User.ts`, `AuthTokens.ts`
- **Utils**: camelCase - `formatDate.ts`
- **Constants**: SCREAMING_SNAKE_CASE - `API_ENDPOINTS.ts`


---

## Navigation

← Previous: [Part 5](SOP-0.1.05-requirements-planning.md)
→ Next: [Part 7](SOP-0.1.07-ai-implementation-safeguards.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
```
