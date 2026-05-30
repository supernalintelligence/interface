---
type: sop
category: ai-technique
sop_id: SOP-0.1.03
title: Prompting Patterns
phase: null
group: A
part_number: 3
audience: [developers, ai-agents]
read_time: 25
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.02]
prerequisites: [SOP-0.1.01]
tags: [ai, prompting, patterns, investigation]
---

# Prompting Patterns

**Part of**: [SOP-0.1: AI-Accelerated Workflow](../SOP-0.1-ai-accelerated-workflow-overview.md)
**Sections**: 10, 11, 12, 13, 14

---

## 10. Investigation Prompts

### Research Pattern

```
"Research [topic]:

Context:
- We're building [system]
- Current approach: [what we're doing now]
- Problem: [what's not working]

Investigation:
- What are current best practices?
- What open source / closed source solutions exist?
- What packages/libraries are commonly used?
- What patterns are recommended?
- What security concerns exist?
- What performance implications?

Provide:
- Options with trade-offs
- Recommendations with rationale
- Sources/references"
```

### Competitor Intelligence Pattern

```
"Analyze [competitors/solutions] for [feature]:

Investigate:
- Open source projects doing [similar thing]
- Closed source products with [feature]
- Common patterns across solutions
- Innovative approaches
- What works well
- What doesn't work well

Provide:
- Feature comparison table
- Pattern analysis
- Recommendations for our implementation"
```

### Example Usage

```
"Research real-time collaboration solutions:

Context:
- Building document editor
- Need multi-user simultaneous editing
- Must handle conflicts

Investigation:
- OT vs CRDT approaches
- WebSocket vs WebRTC
- Yjs, Automerge, ShareDB packages
- Conflict resolution strategies
- Performance at scale

Provide options with trade-offs."
```

---

## 11. Planning Prompts

### System Architecture Pattern

```
"Design system architecture for [feature]:

Requirements:
- [Requirement 1]
- [Requirement 2]

Constraints:
- Tech stack: [technologies]
- Scale: [expected load]
- Budget: [cost constraints]

Provide:
- Component diagram
- Responsibility breakdown
- Integration points
- Data flow
- Technology recommendations
- Trade-offs"
```

### Implementation Planning Pattern

```
"Create implementation plan for [feature]:

Context:
- Architecture: [approved architecture]
- Existing code: [relevant files]
- Patterns: [patterns to follow]

Plan:
- File/folder structure
- Components to create/modify
- Order of implementation
- Test strategy
- Migration steps (if applicable)

Show plan first, don't generate code yet."
```

### Example Usage

```
"Design authentication system:

Requirements:
- Email/password login
- OAuth (Google, GitHub)
- JWT tokens
- Refresh token rotation

Constraints:
- Node.js + Express
- PostgreSQL
- Redis for sessions
- Must be GDPR compliant

Provide complete architecture plan."
```

---

## 12. Clarification Prompts

### Understanding Pattern

```
"Explain [concept/code]:

What I don't understand:
- [Specific confusion point]

Help me understand:
- What problem does this solve?
- How does it work?
- Why this approach vs alternatives?
- What are the trade-offs?
- How does it integrate with [related component]?"
```

### Code Review Pattern

```
"Review this code and explain:

[Code snippet]

Questions:
- What does this do?
- Why is it structured this way?
- What could go wrong?
- How could it be improved?
- Are there edge cases not handled?"
```

### Example Usage

```
"Explain this authentication flow:

[Code showing OAuth redirect handling]

I don't understand:
- Why do we need state parameter?
- What's the security risk without it?
- How does it prevent CSRF?
- Are there other security considerations?"
```

---

## 13. Simplification Prompts

### Complexity Reduction Pattern

```
"Simplify this [code/design]:

[Current approach]

This feels too complex because:
- [Reason 1]
- [Reason 2]

Analyze:
- Identify unnecessary complexity
- Propose simpler alternatives
- Show what can be eliminated
- Explain trade-offs

Goal: Simplest solution that works."
```

### Refactoring Pattern

```
"Refactor [code/component]:

Current issues:
- [Issue 1]
- [Issue 2]

Desired:
- More readable
- Easier to test
- Fewer dependencies
- Better separation of concerns

Show before/after with explanation."
```

### Example Usage

```
"Simplify this authentication middleware:

[Current middleware with 200 lines]

Too complex because:
- Mixes authorization and authentication
- Hard to test
- Lots of nested conditionals

Propose simpler approach with better separation."
```

---

## 14. Re-evaluation Prompts

### Critical Review Pattern

```
"Critically review [plan/code]:

[Current approach]

Analyze:
- Potential bugs
- Security vulnerabilities
- Performance issues
- Maintainability concerns
- Better approaches

Be harsh. What would fail in production?"
```

### Second Opinion Pattern

```
"Second opinion on [decision]:

Decision made:
- [What was decided]
- [Rationale]

Challenge this:
- What are we missing?
- What could go wrong?
- Are there better alternatives?
- What assumptions are we making?

Play devil's advocate."
```

### Example Usage

```
"Review this authentication design:

[Design doc]

Critically analyze:
- Security: What attacks are possible?
- Performance: Where are bottlenecks?
- Scalability: What breaks at scale?
- Maintainability: What's hard to change?

What would you do differently?"
```

---

## Quick Reference

For practical, immediately-usable prompts organized by workflow phase, see:

**[AI Prompting Guide](../../../guides/ai-prompting-guide.md)** - Tactical prompts for developers including:
- Universal prompts (brainstorm, evaluate, audit, debug, recover)
- Phase-specific prompts (Discovery → Operations)
- Compliance checkpoints
- Recovery patterns for mistakes
- Anti-patterns to avoid

---

## Navigation

← Previous: [Part 2](SOP-0.1.02-chat-management.md)
→ Next: [Part 4](SOP-0.1.04-validation-quality.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
