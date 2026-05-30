---
type: sop
category: ai-technique
sop_id: SOP-0.1.04
title: Validation & Quality
phase: null
group: A
part_number: 4
audience: [developers, ai-agents, qa]
read_time: 20
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.03]
prerequisites: [SOP-0.1.01]
tags: [ai, validation, quality, review]
---

# Validation & Quality

**Part of**: [SOP-0.1: AI-Accelerated Workflow](../SOP-0.1-ai-accelerated-workflow-overview.md)
**Sections**: 19, 20, 21

---

## 19. Multi-Agent Validation

### When to Use Second Opinion

**Use different chat/AI for**:

- Major architectural decisions
- Security-critical code
- Complex algorithms
- Unfamiliar technology
- High-risk changes
- Compliance requirements

### Second Opinion Pattern

```

[Chat 1: Implementation]
Person: "Implement authentication system"
AI: [Generates solution]

[Chat 2: Review - Fresh Context]
Person: "Review this authentication implementation:
[Paste code/design]

Look for:

- Security vulnerabilities
- Performance issues
- Maintainability concerns
- Better approaches

Be critical."

AI: [Provides critical feedback]

[Back to Chat 1]
Person: "Reviewer found issues:

- [Issue 1]
- [Issue 2]

Address these."

AI: [Implements fixes]

```

### Multi-Model Strategy

**When available, use different models**:

- **Primary implementation**: Claude, GPT-4, etc.
- **Security review**: Specialized model or fresh instance
- **Code review**: Different model for fresh perspective
- **Architecture review**: Third opinion on major decisions

**Why**: Different models/instances catch different issues

### Team Validation

**Critical decisions validated by**:

- Pair programming
- Team review
- Architecture review board
- Security team
- Compliance team

**AI provides draft, humans make decision**

---

## 20. Verification Checklists

### For Plans

**Before approving plan**:

- [ ] All names are clear and follow conventions
- [ ] Types are appropriate for data
- [ ] Structure makes sense
- [ ] Integrations are well-defined
- [ ] Edge cases considered
- [ ] Error handling planned
- [ ] Test strategy included
- [ ] Migration path clear (if applicable)
- [ ] Team has reviewed and approved
- [ ] No outstanding questions

### For Code

**Before merging code**:

- [ ] Follows existing patterns
- [ ] All tests pass
- [ ] No linter errors
- [ ] Type-checks successfully
- [ ] Code review completed
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] Logging appropriate
- [ ] Documentation updated
- [ ] Person has reviewed and approved

### For Research

**Before acting on research**:

- [ ] Sources cited
- [ ] Multiple independent sources
- [ ] Recent information (if time-sensitive)
- [ ] Conclusions supported by evidence
- [ ] Alternatives considered
- [ ] Trade-offs analyzed
- [ ] Applicable to our context
- [ ] Team agrees with assessment

### For Architecture

**Before implementing architecture**:

- [ ] Solves stated problem
- [ ] Scales to requirements
- [ ] Fits existing system
- [ ] Technology choices justified
- [ ] Security considered
- [ ] Performance analyzed
- [ ] Cost estimated
- [ ] Team has expertise (or plan to gain it)
- [ ] Risks identified and mitigated
- [ ] Alternative approaches considered

---

## 21. Iterative Refinement

### The Refinement Loop

```

1. AI proposes solution
2. Person reviews critically
3. Person requests specific changes
4. AI refines based on feedback
5. Repeat until approved

```

**Never accept first output.** AI's first response is a draft.

### Questions to Ask Every Time

**For any AI output**:

- "Can this be simpler?"
- "What's missing?"
- "What could go wrong?"
- "Any better approaches?"
- "What are the trade-offs?"
- "Does this follow our patterns?"

### Refinement Prompts

**Simplification**:

```

"This is too complex. Simplify by:

- Removing [specific complexity]
- Consolidating [specific duplication]
- Clarifying [specific confusion]"

```

**Missing Elements**:

```

"Add:

- Error handling for [scenario]
- Tests for [edge case]
- Documentation for [component]"

```

**Alternative Approaches**:

```

"Show 3 alternative approaches:

1. Current approach
2. Simpler but [trade-off]
3. More complex but [benefit]

Compare trade-offs."

```

### Knowing When to Stop

**Refinement is complete when**:

- ✅ Solves stated problem
- ✅ No obvious improvements remain
- ✅ Team approves
- ✅ Tests pass
- ✅ Meets quality standards
- ✅ Documented appropriately

**Don't over-refine**:

- ❌ Perfect is enemy of done
- ❌ Diminishing returns
- ❌ Delaying unnecessarily

**Rule**: "Good enough to ship" beats "perfect in theory"

---

---

## Navigation

← Previous: [Part 3](SOP-0.1.03-prompting-patterns.md)
→ Next: [Part 5](SOP-0.1.05-requirements-planning.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
