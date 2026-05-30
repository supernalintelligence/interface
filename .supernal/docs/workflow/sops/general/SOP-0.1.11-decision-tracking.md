---
type: sop
category: ai-technique
sop_id: SOP-0.1.11
title: Decision Tracking
phase: null
group: B
part_number: 11
audience: [developers, architects, product-owners]
read_time: 35
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.10]
prerequisites: [SOP-0.1.01]
tags: [decisions, adr, design, planning]
---

# Decision Tracking

## 29. Decision Documentation & Traceability

### The Documentation Problem

**Reality**: Decisions made during implementation are often lost

- Quick chat decisions → forgotten
- AI suggestions → not recorded
- Pairing sessions → no artifacts
- "Why did we do it this way?" → no answer

**Cost**:

- Future developers confused
- Same discussions repeated
- Technical debt accumulates
- Knowledge lost when people leave

### Decision Hierarchy

#### Level 1: Architecture Decision Records (ADRs)

**When to create**:

- Major architectural decisions
- Technology stack changes
- Infrastructure patterns
- Security architecture
- Data architecture
- Breaking changes to system design

**Location**: `docs/architecture/decisions/ADR-NNN-title.md`

**Template**:

```markdown
# ADR-042: Use JWT for Authentication

## Status

Proposed | Accepted | Superseded | Deprecated

## Date

2024-11-22

## Context

Why we need to make this decision. What problem are we solving?

Requirements:

- [List specific requirements]
- [Technical constraints]
- [Business drivers]

## Decision

What we decided to do. Be specific and actionable.

Implementation:

- [Specific choices made]
- [Libraries/services selected]
- [Configuration decisions]

## Alternatives Considered

### Option 1: [Alternative name]

**Pros**:

- [Advantage 1]
- [Advantage 2]

**Cons**:

- [Disadvantage 1]
- [Disadvantage 2]

**Why rejected**: [Specific reason]

### Option 2: [Alternative name]

[Same format]

## Consequences

### Positive

- ✅ [Benefit 1]
- ✅ [Benefit 2]
- ✅ [Benefit 3]

### Negative

- ⚠️ [Trade-off 1 + mitigation]
- ⚠️ [Trade-off 2 + mitigation]

### Neutral

- ℹ️ [Impact 1]
- ℹ️ [Impact 2]

## Implementation Notes

- Library: `jsonwebtoken` v9.0.0
- Token expiry: 15 minutes (access), 7 days (refresh)
- Storage: Refresh tokens in PostgreSQL
- Rotation: Secrets rotate every 90 days

## References

- [OWASP JWT Cheat Sheet](https://...)
- [RFC 8725: JWT Best Practices](https://...)
- Related: REQ-042, SEC-003

## Participants

- @architect - Proposed
- @tech-lead - Reviewed
- @security - Approved

## Supersedes

- None

## Superseded By

- None (current)
```

**AI can help**:

```
Person: "Create an ADR for our JWT authentication decision.

Context:
- Need stateless authentication
- Multiple servers
- Mobile app support

Decision: JWT with refresh tokens

Alternatives considered:
- Session-based: rejected (doesn't scale)
- OAuth only: rejected (overkill)

Generate complete ADR."

AI: [Generates structured ADR]

Person: [Reviews, refines, commits]
```

#### Level 2: Design Decision Documents (DDD)

**When to create**:

- Feature-level design decisions
- Component architecture
- API design
- Data model design
- UI/UX patterns

**Location**: `docs/features/\{feature\}/design/DDD-\{feature\}-\{topic\}.md`

**Template**:

````markdown
# DDD: User Authentication - Token Management

## Overview

How we handle JWT token lifecycle, refresh, and revocation.

## Design Decision

Use rotating refresh tokens with blacklist for revocation.

## Components

### TokenService

```typescript
class TokenService {
  generateAccessToken(user: User): string;
  generateRefreshToken(user: User): string;
  verifyAccessToken(token: string): User;
  refreshAccessToken(refreshToken: string): TokenPair;
  revokeRefreshToken(token: string): void;
}
```
````

### TokenStore

- PostgreSQL table: `refresh_tokens`
- Redis cache: Blacklisted tokens
- TTL: 7 days (refresh), 15 min (access)

## Flow Diagrams

### Token Refresh Flow

[Mermaid diagram]

### Token Revocation Flow

[Mermaid diagram]

## Security Considerations

- Refresh token rotation on every use
- Blacklist for immediate revocation
- Short-lived access tokens
- Secure storage (httpOnly cookies)

## Related Decisions

- ADR-042: JWT Authentication
- REQ-042: User Login
- SEC-003: Rate Limiting

## Status

Approved (2024-11-22)

````

#### Level 3: Micro-Decision Log

**When to create**:
- Daily implementation choices
- Library selections
- Pattern applications
- Refactoring decisions
- Quick technical choices

**Location**: `docs/features/\{feature\}/planning/decisions.md`

**Template**:
```markdown
# Decision Log: User Authentication

## Overview
Running log of implementation decisions made during feature development.

---

## 2024-11-22: Use Zod for Validation

**Decision ID**: DEC-001

**Context**: Need form validation for login/signup forms

**Options Considered**:
1. **Yup** - Older, more examples online
2. **Zod** - TypeScript-first, better DX
3. **Joi** - Node-focused, less React support

**Decision**: Use Zod

**Rationale**:
- Better TypeScript integration (type inference)
- Smaller bundle size (12KB vs 18KB for Yup)
- Better error messages
- Active maintenance

**Participants**: @dev1, @dev2, AI (Claude)

**Impact**:
- All form validation uses Zod schemas
- Type safety for validation rules
- Consistent validation errors

**Status**: ✅ Implemented

**Files Affected**:
- `src/lib/validation/auth.schema.ts`
- `src/components/LoginForm.tsx`
- `src/components/SignupForm.tsx`

---

## 2024-11-22: Component Organization Pattern

**Decision ID**: DEC-002

**Context**: How to organize React components for auth feature

**Decision**: Feature-based folders, not type-based

**Structure**:
````

src/features/auth/
├── components/ ← All auth components
├── hooks/ ← Auth-specific hooks
├── services/ ← Auth API calls
└── types/ ← Auth types

```

**Rationale**:
- Easier to find related files
- Better encapsulation
- Clearer boundaries
- Matches domain model

**Participants**: @dev1, AI

**Status**: ✅ Implemented

---

## 2024-11-23: Password Hashing Strategy

**Decision ID**: DEC-003

**Context**: Need secure password storage

**Options Considered**:
1. **bcrypt** - Industry standard, proven
2. **argon2** - Newer, more secure, slower
3. **scrypt** - Good, less common

**Decision**: bcrypt with cost factor 12

**Rationale**:
- Proven security (20+ years)
- Good library support (`bcryptjs`)
- Cost factor 12 = ~300ms (acceptable UX)
- Easy to increase cost factor later

**Participants**: @dev1, @security, AI

**References**:
- OWASP Password Storage Cheat Sheet
- Security requirement SEC-005

**Status**: ✅ Implemented

**Test Coverage**:
- Unit tests: `tests/services/auth.test.ts`
- Security tests: `tests/security/password.test.ts`

---

## Template for New Decisions

**Decision ID**: DEC-XXX

**Date**: YYYY-MM-DD

**Context**: [Why we need to decide]

**Options Considered**:
1. [Option 1] - [Brief description]
2. [Option 2] - [Brief description]

**Decision**: [What we chose]

**Rationale**: [Why we chose it]

**Participants**: [Who was involved]

**Impact**: [What this affects]

**Status**: 🔄 In Progress | ✅ Implemented | ❌ Rejected

**References**: [Links to related docs]
```

**AI can help**:

```
Person: "Document decision: We chose Zod over Yup for validation.

Context:
- Need form validation
- Considered Yup, Zod, Joi
- Chose Zod for TypeScript integration

Add to decision log."

AI: [Adds structured entry to decisions.md]
```

### Co-Planning Artifacts

**When to create**: During pairing/mob sessions, design discussions, architecture planning

**Location**: `docs/features/\{feature\}/planning/co-planning-YYYY-MM-DD.md`

**Template**:

```markdown
# Co-Planning Session: User Authentication

## Session Info

**Date**: 2024-11-22
**Duration**: 2 hours
**Participants**: @dev1, @dev2, @architect, AI (Claude)
**Goal**: Design authentication flow and token management

## Decisions Made

### Major Decisions

1. **JWT with refresh tokens** → ADR-042
2. **Token rotation on refresh** → DDD-auth-tokens
3. **NextAuth.js for OAuth** → DEC-004

### Minor Decisions

- bcrypt cost factor 12
- Access token expiry 15 min
- Refresh token expiry 7 days
- Store refresh tokens in PostgreSQL

## What We Tried

### ❌ Passport.js

**Why tried**: Popular authentication library
**What happened**: Too many dependencies (40+ packages), complex configuration
**Time spent**: 1 hour
**Outcome**: Abandoned

### ❌ Custom OAuth Implementation

**Why tried**: Full control, no dependencies
**What happened**: Security concerns, complex state management, CSRF protection tricky
**Time spent**: 45 minutes
**Outcome**: Too risky, abandoned

### ✅ NextAuth.js

**Why tried**: Built for Next.js, handles OAuth complexity
**What happened**: Quick setup, good docs, handles edge cases
**Time spent**: 30 minutes (proof of concept)
**Outcome**: **Selected!**

## AI Contributions

### What AI Did Well

- Generated initial JWT service structure
- Suggested token rotation pattern
- Created comprehensive E2E tests
- Identified security edge cases

### What AI Struggled With

- OAuth callback flow (needed human correction)
- Token blacklist implementation (AI suggested wrong approach)
- Session management (confused with JWT approach)

### AI Prompt That Worked
```

"Generate a JWT token service with:

- Access token generation (15 min expiry)
- Refresh token generation (7 day expiry)
- Token verification
- Refresh token rotation
- Token revocation with blacklist

Use TypeScript. Follow our existing service patterns."

```

## Open Questions
- [ ] How to handle token revocation for mobile apps? (Assigned: @dev1)
- [ ] Should we support magic links? (Discuss with product)
- [ ] Rate limiting strategy? (Assigned: @security)

## Next Steps
- [x] Create ADR-042 (JWT Authentication)
- [x] Create DDD for token management
- [ ] Implement TokenService
- [ ] Add OAuth routes with NextAuth.js
- [ ] Write E2E tests for full auth flow
- [ ] Security review with @security

## Resources Referenced
- [OWASP JWT Cheat Sheet](https://...)
- [NextAuth.js Docs](https://...)
- [JWT RFC 8725](https://...)
- [Our existing auth patterns] (see project documentation)

## Artifacts Created
- `ADR-042-jwt-authentication.md`
- `DDD-auth-token-management.md`
- `decisions.md` (entries DEC-001 through DEC-004)
- `src/services/TokenService.ts` (initial implementation)

## Estimated vs Actual
- **Estimated time**: 3 hours
- **Actual time**: 2 hours
- **Why faster**: NextAuth.js eliminated OAuth complexity
```

### Traceability Convention

**Every artifact should reference related artifacts**:

```markdown
## References

- **Requirements**: REQ-042 (User Login), REQ-043 (User Logout)
- **Design**: DDD-auth-token-management
- **Decisions**: ADR-042, DEC-001, DEC-002, DEC-003
- **Security**: SEC-003 (Rate Limiting), SEC-005 (Password Storage)
- **Tests**: `tests/e2e/auth.spec.ts`, `tests/services/auth.test.ts`
- **Code**: `src/services/AuthService.ts`, `src/services/TokenService.ts`
```

**In code, use comments**:

```typescript
/**
 * Authenticates user with email/password
 *
 * @implements REQ-042 (User Login)
 * @decision ADR-042 (JWT Authentication)
 * @decision DEC-003 (bcrypt cost factor 12)
 * @security SEC-005 (Password Storage)
 * @tests tests/e2e/auth.spec.ts
 * @see docs/features/auth/design/DDD-auth-token-management.md
 */
async function login(email: string, password: string): Promise<AuthTokens> {
  // Implementation
}
```

### Documentation Index

**Create**: `docs/INDEX.md`

```markdown
# Documentation Index

**Last Updated**: 2024-11-22

## Quick Links

- [All Architecture Decisions (ADRs)](#architecture-decisions)
- [All Features](#features)
- [All Requirements](#requirements)
- [All SOPs](#sops)

---

## Architecture Decisions

### Active ADRs

- [ADR-042: JWT Authentication] (see project documentation) (Accepted 2024-11-22)
- [ADR-041: PostgreSQL for Auth Storage] (see project documentation) (Accepted 2024-11-20)

### Superseded ADRs

- [ADR-035: Session-based Auth] (see project documentation) (Superseded by ADR-042)

---

## Features

### Active Development

- [User Authentication] (see project documentation) - Status: In Progress
  - Requirements: REQ-042, REQ-043, REQ-044
  - Design: DDD-auth-tokens, ADR-042
  - Lead: @dev1

### Completed

- [User Profile] (see project documentation) - Status: Deployed
  - Deployed: 2024-11-15
  - Requirements: REQ-035, REQ-036

---

## Requirements

### By Epic

- **Authentication** (REQ-040 through REQ-049)
  - [REQ-042: User Login] (see project documentation)
  - [REQ-043: User Logout] (see project documentation)

### By Status

- **Approved**: REQ-042, REQ-043, REQ-044
- **In Progress**: REQ-045, REQ-046
- **Backlog**: REQ-047, REQ-048, REQ-049

---

## SOPs

- [SOP-0: Complete Development Workflow] (see project documentation)
- [SOP-0.1: AI-Accelerated Workflow] (see project documentation)
```

---

## Decision Document Naming

### Micro-Decisions (DEC-NNN)

**Format**: `DEC-042` (within `decisions.md`)

- Sequential within feature
- Example: `DEC-042: Use Zod for validation`

### Co-Planning Sessions

**Format**: `co-planning-YYYY-MM-DD.md`

- Date-based naming
- Location: `docs/features/\{feature\}/planning/`
- Example: `co-planning-2024-11-22.md`

### Decision Log Structure

```markdown
# Decision Log: {Feature}

## DEC-001: {Title}

**Date**: YYYY-MM-DD
**Context**: Why we need to decide
**Decision**: What we chose
**Rationale**: Why we chose it
**Status**: ✅ Implemented | 🔄 In Progress | ❌ Rejected
```

---

## Navigation

← Previous: [Part 11](SOP-0.1.11 - docs e2e)
→ Next: [Part 11](SOP-0.1.11 - evaluation change)

[Back to Overview] (see project documentation)
