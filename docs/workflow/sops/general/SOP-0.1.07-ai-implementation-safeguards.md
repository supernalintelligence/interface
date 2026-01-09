---
type: sop
category: ai-technique
sop_id: SOP-0.1.07
title: AI Implementation Safeguards
phase: null
group: B
part_number: 7
audience: [developers, ai-agents]
read_time: 30
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.06]
prerequisites: [SOP-0.1.01]
tags: [implementation, safeguards, duplication, patterns]
---

# AI Implementation Safeguards

**Applies To**: All Phases - Before Implementation

**Type**: Phase-Specific

---

## 22. AI Pitfalls & Prevention

### The Duplication Problem

**AI's biggest pitfall**: Creating new implementations of things that already exist

**Why it happens**:

- AI doesn't see full codebase context
- Similar names in different locations
- Patterns exist but aren't obvious
- AI defaults to "create new" vs "find existing"

**Cost**:

- Duplicate logic (maintenance nightmare)
- Inconsistent behavior (different implementations)
- Wasted effort (reimplementing existing)
- Confused codebase (which one to use?)

### Prevention Strategy: Audit Before Implement

**Before implementing ANY feature**:

#### Step 1: Name & Pattern Audit

```bash
# Search for similar names
grep -r "ClassName" --include="*.ts" --include="*.js"
grep -r "functionName" --include="*.ts" --include="*.js"
grep -r "interface.*Name" --include="*.ts" --include="*.js"

# Search for similar patterns
grep -r "authentication\|auth\|login" --include="*.ts"
grep -r "validation\|validate\|validator" --include="*.ts"
```

**Ask AI**:

```
"Before implementing [feature], search the codebase for:
- Similar class names
- Similar function names
- Similar patterns or implementations
- Existing utilities we can reuse

Show me what already exists that might solve this problem."
```

#### Step 2: Location Verification

**Common mistake**: Creating in wrong location

**Correct locations**:

```
src/
├── services/        ← Business logic services
├── utils/           ← Utility functions
├── components/      ← UI components
├── hooks/           ← React hooks
├── lib/             ← Third-party integrations
├── types/           ← TypeScript types
├── constants/       ← Constants and enums
└── config/          ← Configuration
```

**Before creating**:

```
"Where should [ClassName] be located?
Check existing structure:
- Are there similar classes?
- Which directory do they live in?
- Should this be in the same location?

Show me the correct location based on existing patterns."
```

#### Step 3: Name Duplication Check

**Run name collision check**:

```bash
# Check if name already exists
find . -name "*AuthService*" -type f
find . -name "*Validator*" -type f
find . -name "*Helper*" -type f

# Check class/interface names in code
grep -r "class AuthService" --include="*.ts"
grep -r "interface IAuthService" --include="*.ts"
grep -r "export.*AuthService" --include="*.ts"
```

**Ask AI**:

```
"Is the name 'AuthService' already used?
Search for:
- class AuthService
- interface AuthService
- type AuthService
- export { AuthService }

If it exists, show me:
- Where it's defined
- What it does
- Should I reuse it or create a different name?"
```

### Prevention Checklist

**Before implementing, verify**:

- [ ] Searched for similar names (`grep -r "ClassName"`)
- [ ] Searched for similar functionality (`grep -r "feature"`)
- [ ] Checked correct location (matches existing patterns)
- [ ] No name collisions (unique names)
- [ ] Reviewed existing implementations (can reuse?)
- [ ] Asked AI to find duplicates
- [ ] Confirmed with team (if uncertain)

### AI Prompt Pattern for Prevention

**Use this pattern BEFORE generating code**:

```
"I need to implement [feature/class/function].

BEFORE generating code, help me avoid duplication:

1. Search Analysis:
   - Search codebase for similar names
   - Search for similar functionality
   - Find existing implementations we can reuse

2. Location Analysis:
   - Where do similar classes/functions live?
   - What's the correct location for this?
   - Show me the directory structure

3. Duplication Check:
   - Does this name already exist?
   - Are there similar implementations?
   - Can we reuse or extend existing code?

4. Recommendation:
   - Should I create new or reuse existing?
   - If new, what name avoids collisions?
   - If reuse, which existing code?

ONLY generate code after this analysis."
```

### Example: Preventing Duplication

**❌ BAD (No audit)**:

```
Person: "Create a user validation service"
AI: [Generates new UserValidationService]
# Oops! UserValidator already exists in src/validators/
```

**✅ GOOD (With audit)**:

```
Person: "Create a user validation service.

BEFORE generating:
1. Search for existing validation code
2. Check where validators are located
3. Find similar implementations"

AI: "Found existing code:
- src/validators/UserValidator.ts (handles user validation)
- src/validators/EmailValidator.ts (similar pattern)
- src/services/ValidationService.ts (orchestrates validators)

Recommendation: Extend existing UserValidator instead of creating new service."

Person: "Good catch! Extend UserValidator with [new feature]"
AI: [Extends existing code]
```

### Linting & Validation Tools

**We use ESLint** (standard JavaScript/TypeScript linter):

**Configuration**:

- Root: `.eslintrc.js` (project-wide rules)
- Dashboard: `apps/supernal-dashboard/.eslintrc.json` (app-specific)

**Run linting**:

```bash
# Lint all files
npm run lint

# Lint specific files
npx eslint src/services/auth.service.ts

# Auto-fix issues
npm run lint -- --fix
```

**Pre-commit hooks run ESLint automatically**:

```bash
sc git-hooks install

# Now every commit automatically:
# ✅ ESLint checks code quality
# ✅ Prettier formats code
# ✅ TypeScript checks types
```

### Name Collision Detection

**Built-in TypeScript checks**:

```typescript
// TypeScript catches duplicate declarations
class AuthService {}
class AuthService {} // ❌ Error: Duplicate identifier
```

**But doesn't catch across files**:

```typescript
// src/services/auth.service.ts
export class AuthService {}

// src/utils/auth.service.ts
export class AuthService {} // ⚠️ No error, but confusing!
```

**Manual check required**:

```bash
# Find all AuthService exports
grep -r "export.*AuthService" --include="*.ts"

# Find all AuthService classes
grep -r "class AuthService" --include="*.ts"
```

### Pattern Analysis Tool

**Use codebase search to find patterns**:

```bash
# Find all service classes
grep -r "class.*Service" --include="*.ts"

# Find all validator classes
grep -r "class.*Validator" --include="*.ts"

# Find all hook implementations
find src/hooks -name "use*.ts"

# Find all API routes
find src/app/api -name "route.ts"
```

**Ask AI to analyze patterns**:

```
"Analyze the codebase structure:

1. How are services organized?
   - Find all *Service classes
   - Where are they located?
   - What's the naming pattern?

2. What's the pattern for validators?
   - Find all *Validator classes
   - How are they structured?
   - What conventions are used?

3. Where should I put my new [ClassName]?
   Based on existing patterns."
```

### Real-World Prevention Example

**Scenario**: Need to implement email validation

**Step 1: Search**:

```bash
grep -r "email.*valid" --include="*.ts" -i

# Found:
# src/utils/emailValidator.ts
# src/validators/EmailValidator.ts
# src/lib/validation/email.ts
```

**Step 2: Analyze**:

```
Person: "Found 3 email validation implementations:
1. src/utils/emailValidator.ts
2. src/validators/EmailValidator.ts
3. src/lib/validation/email.ts

Which should I use? Are these duplicates?"

AI: [Analyzes each file]
"Analysis:
1. utils/emailValidator.ts - Old, deprecated
2. validators/EmailValidator.ts - Current, comprehensive
3. lib/validation/email.ts - Third-party wrapper

Recommendation: Use validators/EmailValidator.ts
Deprecate utils/emailValidator.ts"
```

**Step 3: Clean up**:

```bash
# Move old implementation to deprecated
git mv src/utils/emailValidator.ts src/utils/_deprecated_emailValidator.ts

# Update all imports to use canonical validator
# [Update references]

# Document canonical location
echo "Email validation: Use src/validators/EmailValidator.ts" >> docs/reference/validators.md
```

### Documentation: Canonical Locations

**Maintain a reference doc**:

```markdown
# Canonical Implementations

## Validation

- Email: `src/validators/EmailValidator.ts`
- Password: `src/validators/PasswordValidator.ts`
- User: `src/validators/UserValidator.ts`

## Services

- Auth: `src/services/auth/AuthService.ts`
- User: `src/services/user/UserService.ts`
- Email: `src/services/email/EmailService.ts`

## Utilities

- String: `src/utils/string.ts`
- Date: `src/utils/date.ts`
- Format: `src/utils/format.ts`

## When adding new code:

1. Check this list first
2. If similar exists, extend it
3. If new, add to this list
4. Update this doc with location
```

---

---

## 📁 Documentation Artifacts for This Phase

### What to Document

- Decision logs (`decisions.md`) - Record why you chose this approach
- Pattern analysis results - What patterns exist, where to add new code
- Location verification - Confirm where new files should go

### Where to Document

```
docs/features/\{feature\}/
├── planning/
│   ├── decisions.md           ← Micro-decisions during implementation
│   └── pattern-analysis.md    ← Results of duplicate checks
```

### When to Document

- **Before writing code**: Run duplicate checks, verify locations
- **During implementation**: Log decisions as you make them
- **Before committing**: Update decision log with final approach

---

## Navigation

← Previous: [Part 6](SOP-0.1.06-design-architecture.md)
→ Next: [Part 8](../phase-6-tests/SOP-6.01-testing-strategy.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
