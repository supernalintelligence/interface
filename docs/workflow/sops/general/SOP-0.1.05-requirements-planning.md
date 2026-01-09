---
type: sop
category: ai-technique
sop_id: SOP-0.1.05
title: Requirements & Planning
phase: null
group: B
part_number: 5
audience: [developers, product-owners, architects]
read_time: 30
created: 2025-11-21
updated: 2025-12-02
status: needs_approval
version: '1.1'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.04]
prerequisites: [SOP-0.1.01]
tags: [requirements, planning, discovery, research, hierarchy, epic, feature]
---

# Requirements & Planning

**Part of**: [SOP-0.1: AI-Accelerated Workflow](../SOP-0.1-ai-accelerated-workflow-overview.md)
**Sections**: 7, 8, 9

---

## 7. Planning Hierarchy

### The Epic-Feature-Requirement Model

```
Milestone (business timeline)
└── Epic (planning initiative, cross-cutting concern)
    ├── Features (domain-based capabilities)
    │   └── Requirements (feature-specific, testable specs)
    │       └── Tests (validation)
    │           └── Implementation (code)
    └── Integration Requirements (epic-level, cross-feature)
        └── Integration Tests (e2e, cross-feature validation)
            └── Integration Code (glue code, orchestration)
```

**Key Principles**:
- Epics can have BOTH features AND integration requirements
- Features contain feature-specific requirements
- Integration requirements span multiple features
- All requirements must be testable (Gherkin format)

### Frontmatter Structure

**Epic**:
```yaml
---
id: epic-001
title: Requirements Management System
features:           # Features belonging to this epic
  - workflow-management/wip-registry
  - workflow-management/test-traceability
requirements:       # Integration requirements (epic-level)
  - REQ-INFRA-070  # Traceability Matrix (spans features)
---
```

**Feature**:
```yaml
---
feature_id: 'wip-registry'
domain: 'workflow-management'
epic: 'epic-002-git-safety-workflow'
requirements:       # Feature-specific requirements
  - REQ-WORKFLOW-004
  - REQ-WORKFLOW-005
---
```

**Requirement**:
```yaml
---
id: REQ-WORKFLOW-004
feature: 'workflow-management/wip-registry'  # Parent feature
epic: 'epic-002-git-safety-workflow'         # Parent epic
tests:              # Test files
  - tests/wip/wip-manager.test.js
---
```

### The Five-Level Planning Model (AI Workflow)

```
Level 1: System Architecture
  ↓ (AI proposes → Team evaluates, questions, refines → Team approves)

Level 2: Feature Breakdown
  ↓ (AI proposes → Team evaluates, questions, refines → Team approves)

Level 3: Component Design
  ↓ (Person + AI proposes → Team evaluates, questions, refines → Team approves)

Level 4: Implementation Plan
  ↓ (AI proposes → Person/pair reviews → Approves)

Level 5: Code Generation
  ↓ (AI generates → Person reviews → Tests → Approves)
```

**Never skip levels.** Each level must be approved before next.

### Level 1: System Architecture

**What**: High-level system design

**Includes**:

- Major components and boundaries
- Technology choices
- Integration points
- Deployment architecture
- Security model

**Who Approves**: Tech lead + architect + relevant stakeholders

**Output**: Architecture Decision Records (ADRs)

**Example Question**: "Should we use microservices or modular monolith?"

### Level 2: Feature Breakdown

**What**: Decompose feature into implementable chunks

**Includes**:

- User-facing capabilities
- Backend services needed
- Data model changes
- API endpoints
- UI components

**Who Approves**: Product + engineering lead

**Output**: Feature plan with epics/stories

**Example Question**: "How do we split 'user authentication' into stories?"

### Level 3: Component Design

**What**: Detailed component architecture

**Includes**:

- Component responsibilities
- Interfaces/contracts
- Data flow
- State management
- Error handling

**Who Approves**: Engineering team

**Output**: Component design doc

**Example Question**: "How should AuthService interact with UserService?"

### Level 4: Implementation Plan

**What**: Specific implementation approach

**Includes**:

- File/folder structure
- Class/function names
- Module organization
- Test strategy
- Migration plan

**Who Approves**: Developer + pair/lead

**Output**: Implementation checklist

**Example Question**: "Which files need changes for OAuth integration?"

### Level 5: Code Generation

**What**: Actual code

**Includes**:

- Implementation code
- Tests
- Documentation
- Type definitions

**Who Approves**: Developer (via review + tests)

**Output**: Working, tested code

---

## 8. Approval Gates

### What Must Be Approved Before Implementation

**Critical Elements**:

- ✅ **Names**: Entities, models, services, routes, functions
- ✅ **Types**: Data structures, interfaces, enums, schemas
- ✅ **Containers**: Components, modules, packages, directories
- ✅ **Modals**: UI patterns, state management, workflows
- ✅ **Routes**: URL structure, API endpoints, navigation
- ✅ **Test Data**: Fixtures, mocks, test scenarios
- ✅ **Coupling**: How systems interact, dependencies
- ✅ **Separation**: Layer boundaries, front-end/back-end split

### Why Approval Gates Matter

**Changing names later impacts**:

- Multiple files
- Database migrations
- API contracts
- Documentation
- Tests

**Cost**: Hours to days of refactoring

**Prevention**: Get it right first

### Approval Process

```
1. AI + Person proposes complete system plan
2. Team reviews ALL names, types, structure
3. Team asks clarifying questions:
   - "Why this name vs that name?"
   - "How does this integrate with existing?"
   - "What happens if we need to extend?"
4. Team requests refinements
5. AI revises based on feedback
6. Repeat until team approves
7. Plan becomes reference doc
8. Implementation follows plan
```

### Approval Checklist

**Before approving plan**:

- [ ] All names are clear and consistent
- [ ] Follows existing naming conventions
- [ ] Types are appropriate for data
- [ ] Integrations are well-defined
- [ ] Error handling is considered
- [ ] Test strategy is outlined
- [ ] Migration path is clear (if applicable)
- [ ] Team has no more questions

---

## 9. Documentation Patterns

### Code in Plans: When and How

**Code is easier to write than pseudocode**, so plans often include code.

**When to include code**:

- ✅ Interface contracts (APIs, types)
- ✅ Pattern demonstrations
- ✅ Complex logic that's hard to describe

**When NOT to include code**:

- ❌ Full implementations (wasteful)
- ❌ Code that will be regenerated
- ❌ Anything that might change

### Extractable Code Pattern

**If writing complete code in docs**, use extraction-friendly format:

````markdown
## File: src/services/auth.service.ts

```typescript
// This code can be extracted using sc extract-code or text extraction tools

export interface AuthService {
  login(email: string, password: string): Promise<AuthToken>;
  logout(token: string): Promise<void>;
  verify(token: string): Promise<User>;
}

export class AuthServiceImpl implements AuthService {
  async login(email: string, password: string): Promise<AuthToken> {
    // Implementation
  }

  async logout(token: string): Promise<void> {
    // Implementation
  }

  async verify(token: string): Promise<User> {
    // Implementation
  }
}
```

**Usage**: Run `sc extract-code plan.md` to extract into files
````

### Plan Documentation Structure

```markdown
# Feature: [Name]

## 1. Overview

[What we're building and why]

## 2. Architecture

[High-level design, diagrams]

## 3. Components

### Component A

- Responsibility: [what it does]
- Interface: [API/contract]
- Dependencies: [what it needs]

## 4. Data Model

[Types, schemas, migrations]

## 5. API Endpoints

[Routes, request/response formats]

## 6. Implementation Checklist

- [ ] Task 1
- [ ] Task 2

## 7. Test Strategy

[What to test, how to test]

## 8. Deployment

[How to deploy, rollback plan]
```

---

## Traceability & Naming Conventions

### Business Requirements (BR-YYYY-NNN)

**Format**: `BR-2024-042`

- Year: 4 digits
- Sequential number: 3 digits
- Example: `BR-2024-042: Enable Multi-Factor Authentication`

### User Stories (US-YYYY-NNN)

**Format**: `US-2024-101`

- Derived from business requirements
- Example: `US-2024-101: As a user, I want to enable MFA`

### Acceptance Criteria (AC-XXX)

**Format**: `AC-1`, `AC-2` (within user story)

- Numbered sequentially within story
- Example: `AC-1: User can scan QR code with authenticator app`

### File Naming

**Requirements**:

```
docs/requirements/
├── BR-2024-042-multi-factor-auth.md
├── US-2024-101-enable-mfa.md
└── US-2024-102-disable-mfa.md
```

---

## Navigation

← Previous: [Part 4](SOP-0.1.04-validation-quality.md)
→ Next: [Part 6](SOP-0.1.06-design-architecture.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
