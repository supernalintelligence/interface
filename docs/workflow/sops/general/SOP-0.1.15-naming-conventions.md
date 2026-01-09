---
type: sop
category: ai-technique
sop_id: SOP-0.1.15
title: Naming Conventions Reference
phase: null
group: C
part_number: 15
audience: [developers, ai-agents, architects]
read_time: 20
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1]
prerequisites: []
tags: [naming, conventions, standards, reference]
---

# Naming Conventions Reference

**Type**: Reference  
**Group**: C. Reference & Standards

---

## Complete Naming Conventions

This document consolidates all naming conventions used across the project.

### Traceability IDs

| Artifact              | Format                | Example                    | Location                        |
| --------------------- | --------------------- | -------------------------- | ------------------------------- |
| **Requirement**       | REQ-{CATEGORY}-{NNN}  | REQ-INFRA-097              | docs/requirements/{category}/   |
| Architecture Decision | ADR-NNN               | ADR-042                    | docs/architecture/decisions/    |
| Design Decision       | DDD-feature-topic     | DDD-auth-tokens            | docs/features/feature/design/   |
| Micro-Decision        | DEC-NNN               | DEC-042                    | Within decisions.md             |
| Change Request        | CHG-YYYY-NNN          | CHG-2024-042               | docs/changes/                   |
| Security Requirement  | SEC-NNN               | SEC-003                    | docs/security/                  |

#### Requirement ID Categories

| Category    | Directory               | ID Format               | Example                          |
| ----------- | ----------------------- | ----------------------- | -------------------------------- |
| INFRA       | infrastructure/         | REQ-INFRA-NNN           | REQ-INFRA-097                    |
| WORKFLOW    | workflow/               | REQ-WORKFLOW-NNN        | REQ-WORKFLOW-092                 |
| CORE        | core/                   | REQ-CORE-NNN            | REQ-CORE-001                     |
| TESTING     | testing/                | REQ-TESTING-NNN         | REQ-TESTING-002                  |
| CONTENT     | content-management/     | REQ-CONTENT-NNN         | REQ-CONTENT-001                  |
| COMPLIANCE  | compliance/             | REQ-COMPLIANCE-NNN      | REQ-COMPLIANCE-001               |
| CODE        | code/                   | REQ-CODE-NNN            | REQ-CODE-001                     |

**Important:**
- IDs are unique within their category namespace
- Legacy simple format (REQ-NNN) is deprecated; use category-prefixed format
- Filename must match ID: `req-{category}-{nnn}-{title-kebab}.md`
- `sc requirement new` automatically assigns the next available ID in the category

### Code Organization

#### Folders

```
src/
├── features/          ← Feature-based (PREFER)
│   └── feature-name/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── utils/
├── shared/            ← Shared code
└── lib/               ← Core libraries
```

#### Files

| Type            | Convention           | Example            |
| --------------- | -------------------- | ------------------ |
| React Component | PascalCase.tsx       | `UserProfile.tsx`  |
| Hook            | camelCase with 'use' | `useAuthToken.ts`  |
| Service         | camelCase + Service  | `authService.ts`   |
| Type/Interface  | PascalCase.ts        | `User.ts`          |
| Utility         | camelCase.ts         | `formatDate.ts`    |
| Constant        | SCREAMING_SNAKE      | `API_ENDPOINTS.ts` |
| Config          | lowercase.config.ts  | `jest.config.ts`   |

#### Functions/Variables

```typescript
// Functions: camelCase, verb-first
function calculateTotal(items: Item[]): number { }
const getUserById = (id: string) => { };

// Variables: camelCase, noun-first
const userName = 'John';
const isAuthenticated = true;

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// Private: prefix with _
private _internalState = {};

// Boolean: prefix with is/has/should/can
const isValid = true;
const hasPermission = false;
const shouldRetry = true;
const canEdit = false;
```

#### Classes/Interfaces

```typescript
// Classes: PascalCase, noun
class UserService {}
class AuthenticationError extends Error {}

// Interfaces: PascalCase, descriptive
interface User {}
interface AuthTokens {}

// Type aliases: PascalCase
type UserId = string;
type AuthState = 'authenticated' | 'unauthenticated';
```

### Test Files

| Type        | Convention                    | Location           | Example                    |
| ----------- | ----------------------------- | ------------------ | -------------------------- |
| Unit Test   | filename.test.ts                | Next to source     | `authService.test.ts`      |
| Integration | feature.integration.test.ts | tests/integration/ | `auth.integration.test.ts` |
| E2E Test    | feature.spec.ts             | tests/e2e/         | `auth.spec.ts`             |

### Git Conventions

#### Branches

**Format**: `type/ticket-description`

```
feature/US-2024-101-enable-mfa
fix/BR-2024-042-token-refresh
refactor/auth-service-cleanup
docs/api-documentation
test/add-e2e-auth-tests
chore/update-dependencies
```

#### Commits

**Format**: `type(scope): description` (Conventional Commits)

**Scope** (IMPORTANT):
- **Feature name** (primary) - Use when unique: `feat(auth):`
- **Domain/feature** - ONLY when duplicate names: `feat(workflow-management/planning):`
- **Domain** - ONLY for cross-feature work: `feat(workflow-management):`
- **Component** - For infrastructure: `feat(api):`, `feat(ui):`

```
# Feature name (primary pattern)
feat(auth): implement JWT token rotation (REQ-042)
fix(wip-registry): resolve user tracking race condition (REQ-144)
docs(telemetry): update tracking documentation
test(auth): add E2E tests for MFA flow
refactor(auth): extract token service

# Domain/feature (only when disambiguating)
feat(workflow-management/planning): update workflow docs (REQ-042)
feat(dashboard-platform/planning): add planning view (REQ-043)

# Component (infrastructure)
chore(deps): update dependencies
```

#### Tags

**Format**: `vMAJOR.MINOR.PATCH` (Semantic Versioning)

```
v1.0.0
v1.2.3
v2.0.0-beta.1
v2.0.0-rc.1
```

### Documentation Files

| Type           | Convention                               | Location                          | Example                                     |
| -------------- | ---------------------------------------- | --------------------------------- | ------------------------------------------- |
| Feature README | README.md                                | docs/features/feature-name/          | README.md                                   |
| Architecture   | ARCHITECTURE.md                          | docs/features/feature-name/          | ARCHITECTURE.md                             |
| API Docs       | API.md                                   | docs/features/feature-name/          | API.md                                      |
| Changelog      | CHANGELOG.md                             | docs/features/feature-name/          | CHANGELOG.md                                |
| ADR            | ADR-NNN-title.md                       | docs/architecture/decisions/      | ADR-042-jwt-auth.md                         |
| Co-Planning    | co-planning-YYYY-MM-DD.md                | docs/features/feature-name/planning/ | co-planning-2024-11-22.md                   |
| Evaluation     | evaluation-feature-YYYY-MM-DD.md       | docs/features/feature-name/          | evaluation-auth-2024-11-22.md               |
| Retrospective  | retrospective-sprint-N-YYYY-MM-DD.md   | docs/retrospectives/              | retrospective-sprint-23-2024-11-22.md       |
| Incident       | incident-severity-YYYY-MM-DD-desc.md | docs/incidents/                   | incident-critical-2024-11-22-auth-outage.md |

### Database

#### Tables

```sql
-- Snake case, plural
users
refresh_tokens
user_sessions
oauth_providers
```

#### Columns

```sql
-- Snake case
user_id
created_at
updated_at
email_verified
is_active
```

### API Endpoints

#### REST

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/users/:id
GET    /api/users
POST   /api/users
PUT    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

#### GraphQL

```graphql
# Queries: camelCase
query {
  user(id: "123")
  users(limit: 10)
}

# Mutations: camelCase
mutation {
  createUser(input: {...})
  updateUser(id: "123", input: {...})
}
```

### Environment Variables

```bash
# SCREAMING_SNAKE_CASE
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
API_BASE_URL=https://...
NODE_ENV=production
```

---

## Quick Reference

**When naming something new**:

1. Check this document for the pattern
2. Look for similar existing names
3. Follow the established convention
4. If unsure, ask in code review

**Remember**:

- Consistency > personal preference
- Clarity > brevity
- Follow existing patterns first

---

## Navigation

← Previous: [Part 14: Evaluation & Learning](SOP-0.1.14-evaluation-learning.md)
→ Next: [Part 16: Roles & Responsibilities](SOP-0.1.16-roles-responsibilities.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
