---
type: sop
category: phase-workflow
sop_id: SOP-7.01
title: AI-Assisted Implementation
phase: 7
group: null
part_number: null
audience: [developers, ai-agents]
read_time: 45
created: 2025-11-23
updated: 2025-11-28
status: needs_approval
version: '1.0'
author: Supernal Coding Team
template_source: https://github.com/supernalintelligence/supernal-coding
template_version: 'main@130c177'
project_name: '@supernal/interface'
reviewedBy: []
reviewDates: []
related_sops: [SOP-0, SOP-6.02, SOP-8.01]
prerequisites: [SOP-6.01, SOP-6.02]
tags: [implementation, coding, ai-pair-programming, phase-7]
---

# AI-Assisted Implementation

## Purpose

Build features using AI pair programming while maintaining code quality, testing, and documentation standards.

## Scope

- Code implementation with AI assistance
- Behavior and Test-driven development (BDD & TDD)
- Code review and quality assurance
- Documentation generation
- Git workflow integration

## Prerequisites

- [ ] Tests defined (SOP-6.01, SOP-6.02)
- [ ] Requirements validated (SOP-5.01)
- [ ] Development environment ready
- [ ] [Coding Standards](../../../docs/architecture/patterns/coding-standards.md) reviewed

## Key References

| Document | Purpose |
|----------|---------|
| [AI Prompting Guide](../../../guides/ai-prompting-guide.md) | Practical prompts for implementation, debugging, recovery |
| [Coding Standards](../../../docs/architecture/patterns/coding-standards.md) | Architecture patterns, style guide, code quality tools |
| [Testing Guide](../../../architecture/TESTING_GUIDE.md) | Test structure, naming, quality requirements |
| [SOP-0.1.07: AI Safeguards](../general/SOP-0.1.07-ai-implementation-safeguards.md) | Safety guidelines for AI-generated code |

## Process Overview

### Step 1: Start Development Work

### Step 2: AI-Assisted Implementation

**Best Practices**:

- Share requirements file with AI
- Provide relevant code context
- Request code with tests
- Ask for documentation
- Validate security implications

**AI Collaboration Patterns**:

- **Exploration**: "What's the best approach for X?"
- **Generation**: "Implement Y following the layered architecture pattern"
- **Review**: "Review this code for complexity and architecture violations"
- **Refactoring**: "Refactor to reduce cyclomatic complexity below 15"
- **Documentation**: "Generate docs for this module"

**Architecture Direction for AI**:

When asking AI to refactor, provide clear direction based on [Coding Standards](../../../docs/architecture/patterns/coding-standards.md):
- "Follow layered architecture: domain logic in domain/, infrastructure in infrastructure/"
- "Check cyclomatic complexity with `lizard` and refactor functions >15"
- "Ensure tests have multiple input scenarios, not just happy path"

### Step 3: Test-Driven Development

Follow [Coding Standards](../../../docs/architecture/patterns/coding-standards.md) for architecture and quality requirements.

```bash
# Write tests first with multiple data scenarios
npm run test:watch

# Implement feature following architecture patterns
# Run tests continuously
# Check complexity: lizard src/ --CCN 15
# Refactor when green
```

**Test Quality Requirements** (see [Coding Standards](../../../docs/architecture/patterns/coding-standards.md#test-quality-standards)):
- Multiple input scenarios per test (not just happy path)
- Edge cases covered (empty, null, boundary values)
- Error conditions tested
- No hardcoded/always-passing assertions

### Step 4: Code Review

**Self-Review Checklist** (see [Coding Standards](../../../docs/architecture/patterns/coding-standards.md)):

- [ ] Tests pass with multiple data scenarios
- [ ] Code follows [style guide](../../../docs/architecture/patterns/coding-standards.md#core-principles)
- [ ] Code complexity acceptable (cyclomatic ≤15, run `lizard src/`)
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance acceptable
- [ ] Error handling complete
- [ ] Logging follows [standards](../../../docs/architecture/patterns/coding-standards.md#logging)

**AI-Assisted Review**:

- Ask AI to review for common issues
- Check for anti-patterns
- Verify best practices
- Validate error handling

### Step 5: Commit Changes

```bash
# Supernal git hooks run automatically
git add .
git commit -m "REQ-001: Implement user authentication

- Add login endpoint
- Implement JWT tokens
- Add tests
- Update documentation"

# Hooks validate:
# - Code formatting (Biome)
# - Linting (Biome)
# - Type checking (TypeScript)
# - Requirement linking
```

## Safety Guardrails

Follow [SOP-0.1.07: AI Implementation Safeguards](../general/SOP-0.1.07-ai-implementation-safeguards.md):

- **Never blindly accept AI code**
- **Always review generated code**
- **Test everything**
- **Validate security implications**
- **Check for data leaks**

## Outputs

- **Working Code**: Implements requirements
- **Tests**: Unit, integration, E2E
- **Documentation**: Inline comments, README updates
- **Git Commits**: Linked to requirements

## Quality Gates

- [ ] All tests pass (with multiple input scenarios)
- [ ] Test quality validated (no empty/hardcoded tests)
- [ ] Code complexity acceptable (cyclomatic ≤15)
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Documentation complete
- [ ] Security validated
- [ ] Requirement linked in commits

**Complexity Check**:
```bash
# Check function complexity (requires: pip install lizard)
lizard src/ --CCN 15 --length 100

# Lint and format with Biome
npx biome check --write .
```

**Test Quality Check**:
```bash
# Detect potential empty tests
grep -rn "test\|it\(" tests/ | grep -v "expect" | head -20

# Detect always-true assertions  
grep -rn "expect(true)" tests/
```

## Expected Documentation

### Architecture/Planning (Broad-scale)

- **Architecture Decisions**: `docs/architecture/decisions/ADR-[num]-[name].md`
- **System Design Updates**: `docs/architecture/system/` - When implementation affects system design

### Feature-Specific

- **Feature Folder**: `docs/features/\{domain\}/{feature-name}/` (phase: implementing)
  - `implementation.md` - Implementation progress, decisions, challenges
  - `architecture.md` - Feature-specific architecture decisions
  - `integration-notes.md` - Integration points and dependencies discovered
  - `performance.md` - Performance considerations and optimizations

### Documentation-Driven Development

For multi-file features, use planning documents that generate code:

1. **Write Implementation Plan**: Create `planning/implementation-plan.md` with code blocks:
   ```markdown
   **File**: `src/services/auth.ts`
   
   ```typescript
   export class AuthService { /* ... */ }
   ```
   ```

2. **Review Plan**: AI or team reviews the implementation plan before files are created

3. **Process Documentation**: Generate all files atomically:
   ```bash
   sc docs process docs/features/auth/planning/implementation-plan.md
   ```

4. **Iterate**: Fill in implementation details, add tests, fix types

**Benefits**:
- Atomic file creation from approved plans
- Natural review checkpoint before implementation
- Documentation IS the implementation spec
- Conflict detection for existing files

See [Documentation Processor Feature](../../../docs/features/README.md) for full details.

### Code Documentation

- **Inline Comments**: Complex logic, business rules, workarounds
- **JSDoc/TypeDoc**: Function and class documentation
- **README Updates**: Usage examples, setup instructions

### Small Changes

- Implementation notes in commit messages (REQ-XXX: Description)
- Inline code comments for non-obvious logic

## Related SOPs

- **References**:
  - [SOP-0.1.07: AI Safeguards](../general/SOP-0.1.07-ai-implementation-safeguards.md)
  - [SOP-0.1.12: Git Workflow](../general/SOP-0.1.12-git-workflow.md)

## AI Techniques

See general SOPs:

- [Foundation](../general/SOP-0.1.01-foundation.md)
- [AI Implementation Safeguards](../general/SOP-0.1.07-ai-implementation-safeguards.md)
- [Git Workflow & Code Review](../general/SOP-0.1.12-git-workflow.md)
