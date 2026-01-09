---
type: sop
category: ai-technique
sop_id: SOP-0.1.01
title: Foundation
phase: null
group: A
part_number: 1
audience: [developers, ai-agents, architects, product-owners]
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
tags: [ai, foundation, principles, collaboration]
---

# Foundation

**Part of**: [SOP-0.1: AI-Accelerated Workflow](../SOP-0.1-ai-accelerated-workflow-overview.md)
**Sections**: 1, 2, 3

---

## 1. Core Principle

**AI accelerates development when given clear context and structured tasks.**

### What AI Does Well

✅ **Research & Intelligence**

- Gather best practices, patterns, libraries
- Compare approaches with trade-offs
- Find security/performance considerations

✅ **Planning & Design**

- Propose system architectures
- Design component structures
- Model data relationships
- Map out file/folder organization

✅ **Code Generation**

- Generate boilerplate following patterns
- Create type definitions
- Write test scaffolding
- Produce documentation

✅ **Analysis & Review**

- Review code for issues
- Investigate bugs
- Analyze performance
- Audit security

### What AI Doesn't Do Well

❌ **Critical Decisions**

- Business logic correctness (Person must verify)
- Security architecture (Person must review)
- Compliance requirements (Person must approve)
- Trade-off decisions (Person makes final call)

❌ **Execution**

- Production deployments (Person executes)
- Data migrations (Person oversees)
- Credential management (Person handles)
- Risk acceptance (Person decides)

### The Acceleration Pattern

1. Person/team defines the problem or goal.
2. Person and AI collaborate to clarify requirements and context.
3. AI and Person jointly research and propose potential solutions, with open dialogue to refine ideas.
4. Person challenges, questions, and iterates on solutions with AI support and feedback.
5. Together, Person and AI develop a detailed plan—AI drafts, Person edits, both discuss.
6. Team reviews and approves the plan.
7. AI generates code/components as appropriate, Person customizes or directs as needed.
8. Person and team review, test, and further iterate with AI assistance until satisfaction is achieved.

**Key**: AI proposes, Person/team approves, AI executes, Person verifies

---

## 2. When to Use AI vs Not

### ✅ Use AI For

**Discovery & Research**

- "What are current best practices for [X]?"
- "Compare [A] vs [B] for [use case]"
- "What security concerns exist for [feature]?"
- "Research open source/closed source solutions for [problem]"

**Planning & Architecture**

- "Propose system architecture for [feature]"
- "Design data model for [domain]"
- "Plan file/folder structure for [component]"
- "Outline API endpoints for [service]"

**Implementation**

- "Generate [component] following [pattern]"
- "Create tests for [module]"
- "Write documentation for [API]"
- "Implement [feature] according to [plan]"

**Analysis & Improvement**

- "Review this code for issues"
- "Find performance bottlenecks"
- "Suggest simplifications"
- "Identify security vulnerabilities"

### ❌ Don't Use AI For

**Sensitive Operations**

- Production data secret access (Code and env managers control)
- User PII handling (Person oversees)
- Financial transactions (Person executes)
- Security credentials (Person manages)

**Blind Execution**

- Running code without understanding it
- Accepting first output without review
- Implementing without planning
- Deploying without testing

---

## 3. AI's Role in Development

### AI as Research Assistant

**Pattern**: Person asks questions → AI researches → Person evaluates

Person: "What's the best way to handle real-time collaboration?"
AI: [Researches CRDTs, OT, WebSockets, WebRTC]
AI: [Presents options with trade-offs]
Person: [Evaluates based on requirements]
Person: "Let's use WebSockets with operational transform"

### AI as Design Partner

**Pattern**: Person defines requirements → AI proposes designs → Team refines

Person: "We need user authentication with social login"
AI: [Proposes architecture: OAuth, JWT, session management]
Team: [Reviews, questions, refines]
Team: [Approves design]
AI: [Generates implementation plan]

### AI as Implementation Accelerator

**Pattern**: Plan approved → AI generates code → Person reviews → Iterate

[Plan approved]
Person: "Implement auth service per approved plan"
AI: [Generates code following patterns]
Person: [Reviews, tests, requests changes]
AI: [Refines based on feedback]
Person: [Approves, merges]

### AI as Quality Checker

**Pattern**: Code complete → AI reviews → Person addresses issues

Person: "Review this authentication implementation"
AI: [Finds issues: missing rate limiting, weak token validation]
Person: [Evaluates criticality, prioritizes fixes]
Person: "Add rate limiting, keep token validation"
AI: [Implements fixes]

---

---

## Navigation

← Previous: Start
→ Next: [Part 2](SOP-0.1.02-chat-management.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
