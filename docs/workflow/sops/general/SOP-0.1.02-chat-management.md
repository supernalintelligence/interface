---
type: sop
category: ai-technique
sop_id: SOP-0.1.02
title: Chat Management
phase: null
group: A
part_number: 2
audience: [developers, ai-agents]
read_time: 15
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.01]
prerequisites: [SOP-0.1.01]
tags: [ai, chat, context, isolation]
---

# Chat Management

**Part of**: [SOP-0.1: AI-Accelerated Workflow](../SOP-0.1-ai-accelerated-workflow-overview.md)
**Sections**: 4, 5, 6

---

## 4. Chat Isolation Strategy

### When to Start New Chat

**Start new chat when**:

1. **Starting different feature/epic**
   - Completely separate functionality
   - Different domain context
   - New architectural decisions

2. **Need fresh perspective**
   - Validation/review of existing work
   - Second opinion on approach
   - Design alternatives

3. **Context has drifted**
   - Chat approaches 80% token usage after summarization
   - AI starts behaving oddly
   - Producing incorrect/inconsistent results
   - Too many tangents from original goal

4. **Handoff to different role**
   - Implementation → Review
   - Backend → Frontend
   - Development → Testing

### When to Continue Same Chat

**Continue chat when**:

1. **Iterating on same feature**
   - Refinement and debugging
   - Building on previous decisions
   - Consistent context valuable

2. **Sequential phases**
   - Planning → Implementation
   - Implementation → Testing
   - Testing → Documentation

3. **Troubleshooting**
   - Debugging specific issue
   - Fixing failing tests
   - Resolving errors

### The Cost of Context Switching

**New chat**:

- ✅ Fresh perspective
- ✅ No accumulated confusion
- ❌ Must re-establish context
- ❌ Loses implementation history

**Same chat**:

- ✅ Maintains context
- ✅ Remembers decisions
- ❌ Can accumulate errors
- ❌ Token usage grows

**Rule**: Use same chat until context becomes burden, then start fresh

---

## 5. Context Establishment

### Starting New Chat: Context Template

```markdown
[New Chat]

## Context

**Working On**: [Feature/Epic name]

**System**: [Brief system description]

**Already Complete**:

- [What's implemented]
- [Key decisions made]

**Current Task**: [Specific goal for this chat]

**Constraints**:

- Tech stack: [languages, frameworks]
- Patterns: [architectural patterns in use]
- Requirements: [must-haves for this task]

**Relevant Files**:

- [file/path/one.ts] - [what it does]
- [file/path/two.ts] - [what it does]

**Documentation**:

- See [docs/architecture/decisions/001-auth.md] for auth approach
- See [docs/features/user-management/planning/plan.md] for feature plan

## Task

[Specific thing you need AI to do]
```

### Why This Works

**AI gets**:

- ✅ Full context without reading entire history
- ✅ Clear constraints and requirements
- ✅ Pointers to relevant documentation
- ✅ Specific, actionable task

**You get**:

- ✅ Focused responses
- ✅ Consistent with existing patterns
- ✅ Less back-and-forth clarification

### Reusing Context Across Chats

**Save reusable context in**:

- `docs/architecture/decisions/` - ADRs
- `docs/architecture/domain-model.md` - Domain concepts
- `docs/features/\{feature\}/planning/` - Feature plans
- `.cursor/rules/` - Coding patterns
- `docs/reference/system-context.md` - System overview

**Reference in new chats**:

- "See [file] for [context]"
- "Follow pattern from [file]"
- "Based on decision in [ADR]"

---

## 6. Progressive Summarization

### Managing Long Chats

**When chat exceeds ~50 messages**:

1. **Request summary**:

   ```
   "Summarize our conversation:
   - Key decisions made
   - Current implementation status
   - Outstanding tasks
   - Important context to preserve"
   ```

2. **Save summary** to feature documentation

3. **Continue or start fresh**:
   - If < 80% token usage → continue
   - If ≥ 80% token usage → new chat with summary

### Summary Template

```markdown
# Chat Summary: [Feature] - [Date]

## Key Decisions

- [Decision 1 and rationale]
- [Decision 2 and rationale]

## Current Status

- ✅ Completed: [what's done]
- 🔄 In Progress: [what's being worked on]
- ⏸️ Blocked: [what's waiting]

## Technical Details

- Architecture: [approach taken]
- Patterns: [patterns used]
- Dependencies: [key dependencies]

## Outstanding Tasks

- [ ] [Task 1]
- [ ] [Task 2]

## Context for Next Chat

[Critical information needed to continue]
```

---

---

## Navigation

← Previous: [Part 1](SOP-0.1.01-foundation.md)
→ Next: [Part 3](SOP-0.1.03-prompting-patterns.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
