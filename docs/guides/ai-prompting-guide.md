---
type: guide
title: AI Prompting Guide for Developers
status: draft
created: 2025-12-03
updated: 2025-12-03
audience: [developers, ai-agents]
_template_source:
  repository: supernal-coding
  source_path: supernal-code-package/documentation/docs/guides/ai-prompting-guide.md
  copied_at: 2025-12-11
  version: '1.0'
  note: 'Installed via sc init. Updates should be pulled from supernal-coding.'
---

# AI Prompting Guide for Developers

Practical prompts and patterns for effective AI-assisted development.

---

## Quick Reference: Universal Prompts

These work in any phase:

| Intent | Prompt |
|--------|--------|
| **Explore** | "Brainstorm with me..." |
| **Evaluate** | "Evaluate this approach..." |
| **Audit** | "Audit our..." |
| **Checkpoint** | "Before we continue, have we considered..." |
| **Compliance** | "Have we evaluated this for compliance?" |
| **Debug** | "This didn't work, here's the error..." |
| **Summarize** | "Summarize where we are and what's next" |
| **Recover** | "Something went wrong. Let's step back..." |
| **Pushback** | "That doesn't seem right. Justify this." |
| **Be Curious** | "Why did you choose X? What alternatives exist?" |

---

## Meta-Prompts (Use Anytime)

### Brainstorming
```
Brainstorm with me [topic]:
- Current situation: [what we have]
- Goal: [what we want]
- Constraints: [limitations]

Give me 5+ options with trade-offs.
```

### Evaluation
```
Evaluate this [approach/code/design]:

[paste content]

Consider:
- Does it solve the actual problem?
- What could go wrong?
- Is there a simpler way?
- What are we missing?
```

### Auditing
```
Audit our [codebase/architecture/tests/docs] for:
- [specific concern 1]
- [specific concern 2]

Be critical. What would fail in production?
```

### Debugging
```
This didn't work. Here's the error:

[paste error]

Context:
- What I was trying: [action]
- What I expected: [expected]
- What happened: [actual]

Investigate root cause, don't just patch symptoms.
```

 ### Compliance Evaluation

Use after design/implementation to catch compliance gaps:

```
Evaluate [feature/design] for compliance:

What we're building: [description]
Data involved: [data types]
Users: [who uses it]

Check:
- Privacy: What personal data? Consent? Retention?
- Security: Access controls? Encryption? Audit logs?
- Regulatory: GDPR? HIPAA? SOC2? Industry-specific?
- Accessibility: WCAG compliance?

What would an auditor flag? What documentation do we need?
```

### Recovery from Mistakes

**FAQ: It worked, now it doesn't. What do I do?**

When debugging attempts make things worse, you need to rollback cleanly.

**Step 1: Get a summary before rolling back**
```
Stop. It was working and now it isn't. We've tried to fix it but it's getting worse.

Before we rollback, summarize:
1. What you tried and why it didn't work
2. What files you changed (related and unrelated to this issue)
3. Any progress worth preserving
4. Your best guess at the root cause

I need this summary to avoid repeating these mistakes.
```

**Step 2: Preserve and rollback**
1. **Copy the AI's response** - you'll need this context later
2. **Commit only changed files** (never `git add .`):
   ```bash
   git add [specific-files-only]
   git commit -m "WIP: recovery point before rollback"
   ```
3. **Restore to last working state** (conversation checkpoint or git)
4. **Paste the summary** into the fresh context

**Step 3: Try again with lessons learned**
```
Something went wrong during [task]. Here's where we are:
- Started with: [initial state]
- Tried to: [goal]
- Now: [current mess]

Previous attempts that failed:
[paste summary from step 1]

Help me:
1. Understand what actually went wrong
2. Decide: fix forward or rollback?
3. Get back to a good state without repeating mistakes
```

**Pro tip**: Before rollback, commit any unrelated progress you want to keep. Restoring will overwrite files, so preserve valuable work on a branch first. 

---

## Phase-Specific Prompts

### Phase 1: Discovery

**Explore the problem:**
```
Help me understand the problem space for [project]:
- Who has this problem?
- How painful is it?
- What do they do today?
- Why hasn't it been solved?
```

**Challenge assumptions:**
```
I think we should build [solution] because [reason].
Challenge this. What am I missing? Is there a simpler approach?
```

**Scope check:**
```
Here's our scope: [scope]
Is this too big for [timeframe]? What's the MVP?
```

### Phase 2: Research

**User story generation:**
```
Generate user stories for [feature]:
- Target user: [persona]
- Core need: [what they want]

Format: As a [role], I want [action] so that [benefit]
Include edge cases and unhappy paths.
```

**Technical research:**
```
Research options for [technical need]:
- Our stack: [technologies]
- Constraints: [requirements]

Compare: [option A] vs [option B] vs [option C]
Which fits our situation best?
```

### Phase 3: Design

**Architecture review:**
```
Review this architecture:

[paste or describe]

Check for:
- Single responsibility
- Proper layering
- Testability
- Over-engineering
```

**Security analysis:**
```
Security review for [feature]:
- Data involved: [data types]
- Access patterns: [who accesses what]

What attacks are possible? What controls do we need?
```

**Compliance checkpoint:**

After initial design, always ask:
```
Have we evaluated this for compliance requirements?

Feature: [feature]
Data involved: [data types]
Users affected: [user types]

Check against:
- GDPR (if EU users or personal data)
- HIPAA (if health data)
- SOC2 (audit trails, access controls)
- Industry-specific regulations

What controls, documentation, or audit trails do we need?
What would an auditor ask about this feature?
```

**Compliance-aware design:**
```
We're building [feature] that handles [data type].

Before we finalize design:
1. What data are we collecting/storing/processing?
2. What's the legal basis for each data element?
3. How long do we retain it?
4. Who can access it and why?
5. How do users delete/export their data?
6. What audit trail do we need?

Integrate compliance into the design, not as an afterthought.
```

**Simplification:**
```
This feels too complex:

[paste design/code]

How can we simplify while keeping the core functionality?
```

### Phase 4: Planning

**Task breakdown:**
```
Break down [feature] into tasks:
- Must complete by: [deadline]
- Available effort: [hours/days]

Include: implementation, tests, docs, review
Estimate each task (S/M/L).
```

**Dependency mapping:**
```
What's the right order for implementing:
- [task A]
- [task B]
- [task C]

What depends on what? What can parallelize?
```

### Phase 5: Requirements

**Acceptance criteria:**
```
Write acceptance criteria for: [user story]

Format as Gherkin scenarios:
- Happy path
- Error cases
- Edge cases
- Authorization checks
```

**Edge case discovery:**
```
What edge cases should we handle for [feature]?

Consider:
- Boundary values
- Empty/null inputs
- Concurrent access
- Network failures
- Permission combinations
```

### Phase 6: Tests

**Test strategy:**
```
What tests do we need for [component]?

Current coverage: [what exists]
Code: [paste or reference]

Identify gaps. Prioritize by risk.
```

**Test case generation:**
```
Generate test cases for:

[paste function/component]

Include:
- Multiple input scenarios (not just happy path)
- Boundary conditions
- Error handling
- Mocks needed
```

### Phase 7: Build

**Implementation guidance:**
```
Implement [feature]:
- Requirements: [link or summary]
- Patterns to follow: [existing patterns]
- Files involved: [relevant files]

Start with the interface, then implementation.
Show plan before code.
```

**Code review:**
```
Review this code:

[paste code]

Check:
- Correctness
- Edge cases
- Error handling
- Performance
- Maintainability
```

**Refactoring:**
```
Refactor this:

[paste code]

Issues:
- [issue 1]
- [issue 2]

Keep behavior identical. Show before/after.
```

### Phase 8-9: Integration

**Integration testing:**
```
Design integration tests for [components joining]:
- Component A: [what it does]
- Component B: [what it does]
- Integration point: [how they connect]

What could break? What data flows need testing?
```

**Conflict resolution:**
```
We have a conflict between:
- [component A behavior]
- [component B expectation]

Which is correct? How do we resolve?
```

### Phase 10-11: Staging/Production

**Deployment checklist:**
```
Create deployment checklist for [release]:
- Changes: [summary]
- Dependencies: [new deps]
- Migrations: [db changes]

What could go wrong? What's the rollback plan?
```

**Verification:**
```
How do we verify [feature] works in production?
- Key user flows to test
- Metrics to watch
- Alerts to set up
```

### Phase 12: Operations

**Incident response:**
```
We're seeing [problem] in production:
- Symptoms: [what's happening]
- Impact: [who's affected]
- Started: [when]

Help triage: severity, likely cause, immediate actions.
```

**Performance investigation:**
```
[Component] is slow:
- Expected: [target]
- Actual: [current]
- Context: [load, data size]

Where should we look? What metrics matter?
```

---

## Phase Transition Checkpoints

Before moving to the next phase, verify you haven't missed critical considerations.

### After Design, Before Build

```
Before we start building, checkpoint:

Design: [summary]

Have we considered:
- [ ] Security implications?
- [ ] Compliance requirements (GDPR, HIPAA, SOC2)?
- [ ] Accessibility requirements?
- [ ] Performance requirements?
- [ ] Error handling strategy?
- [ ] Audit trail needs?
- [ ] Data retention policy?

What's missing from our design?
```

### After Build, Before Integration

```
Before we integrate, checkpoint:

What we built: [summary]

Verify:
- [ ] Tests cover happy path AND error cases?
- [ ] Security controls implemented?
- [ ] Logging/audit trails in place?
- [ ] Documentation updated?
- [ ] No hardcoded secrets or config?
- [ ] Error messages don't leak sensitive info?

What would break in production?
```

### Before Deployment

```
Pre-deployment checkpoint:

Changes: [summary]

Verify:
- [ ] All tests passing?
- [ ] Security scan clean?
- [ ] Compliance requirements met?
- [ ] Rollback plan documented?
- [ ] Monitoring/alerts configured?
- [ ] Data migration tested?

What's the worst that could happen?
```

---

## Workflow Patterns

### Working on Multiple Things in Parallel

**Setup:**
```
I'm working on two features in parallel:
1. [Feature A] on branch [branch-a]
2. [Feature B] on branch [branch-b]

Help me context-switch cleanly. What state am I in?
```

**Context switch:**
```
Switching from [Feature A] to [Feature B].

Current state of A:
- Done: [completed items]
- In progress: [wip]
- Next: [next steps]

Commit message for WIP: "[WIP] Feature A - [state]"
```

### Recovering from Mistakes

**Assess damage:**
```
I made a mistake. Before we fix anything:
1. What files changed? (git status)
2. What was the last good state?
3. What did I try to do?
4. What actually happened?

Don't fix yet—understand first.
```

**Safe recovery pattern:**
```
Let's recover safely:

1. Create recovery branch: git checkout -b recovery-attempt-[date]
2. Commit current mess: git add [ONLY changed files] && git commit -m "WIP: recovery point"
3. Go back to good state: git checkout [last-good-branch]
4. Start fresh from there

Never git add . during recovery!
```

**Learning from mistakes:**
```
After recovering, help me understand:
- What went wrong?
- What was the root cause?
- How do we prevent this?
- Should we add a test/check?
```

### Handling Stuck Situations

**When nothing works:**
```
I've tried:
- [approach 1] - failed because [reason]
- [approach 2] - failed because [reason]
- [approach 3] - failed because [reason]

Are we solving the right problem?
Is there a completely different approach?
```

**When scope creeps:**
```
This task keeps growing:
- Original: [what we started with]
- Now: [current scope]

What's actually required vs nice-to-have?
Can we split this?
```

### Handoff Patterns

**End of session:**
```
I need to stop. Summarize:
1. What we accomplished
2. Current state (what's done, what's in progress)
3. Next steps
4. Any blockers or decisions needed

Format for easy pickup later.
```

**Starting fresh:**
```
Continuing from last session. Context:

[paste previous summary or handoff doc]

Where did we leave off? What's the next action?
```

---

## Anti-Patterns to Avoid

### Don't:

❌ **Vague requests**
```
"Fix this code"  # Bad - fix what?
```

✅ **Be specific**
```
"This function returns null when input is empty. It should return []. Fix the edge case handling."
```

---

❌ **Too much at once**
```
"Build the entire auth system with OAuth, MFA, password reset, and admin management"
```

✅ **Break it down**
```
"Let's start with basic email/password auth. What's the minimum we need?"
```

---

❌ **Accepting first response without pushback**
```
AI: "Here's the solution: [code]"
You: "Looks good, ship it"
```

The first response is often wrong, incomplete, or over-engineered. AI tends to be confidently wrong.

✅ **Push back and ask for justification**
```
"Wait, this looks odd to me:
- Why did you use [X] instead of [Y]?
- This doesn't match what I asked for because [reason]
- Explain why this approach is better than [alternative]
- What could go wrong with this?"
```

**Pushback prompts:**
- "That doesn't seem right. Justify this choice."
- "This looks inconsistent with [earlier decision]. Explain."
- "I'm skeptical. What's the downside of this approach?"
- "Before I accept this, convince me it's correct."

---

❌ **Accepting without understanding**
```
"Looks good, ship it"  # Without reviewing
```

✅ **Verify and understand**
```
"Before we proceed, explain why you chose [approach] over [alternative]"
```

---

❌ **Experimental debugging**
```
"Try adding console.logs everywhere and see what happens"
```

✅ **Systematic debugging**
```
"Let's trace the data flow from [input] to [output]. Where does it diverge from expected?"
```

---

❌ **Letting AI make decisions you should own**
```
"Just do whatever you think is best"
```

✅ **Stay in control**
```
"Give me 3 options with trade-offs. I'll decide which direction to go."
```

---

❌ **Not questioning confident statements**

AI will say things like "This is the correct approach" or "This will definitely work." These are often wrong.

✅ **Challenge confidence**
```
"You seem very confident. What assumptions are you making? What could prove you wrong?"
```

---

❌ **Not being curious about alternatives**
```
AI: "Here's the solution using [approach X]"
You: "OK, let's do it"
```

✅ **Be curious - explore the space**
```
"Why did you choose [X] over [Y]?"
"What other approaches did you consider?"
"What are the trade-offs between these options?"
"Is there a simpler way to achieve this?"
"What would a senior engineer do differently?"
```

Being curious often uncovers better solutions than the first suggestion.

---

## Quick Tips

1. **Context is king** - More context = better responses
2. **Show, don't tell** - Paste actual code/errors, not descriptions
3. **One thing at a time** - Complex tasks need decomposition
4. **Be curious** - Ask "why?" and "what else?" to explore options
5. **Push back** - First response is often wrong; challenge assumptions
6. **Demand justification** - "Explain why this is better than [alternative]"
7. **Verify before shipping** - Don't blindly accept generated code
8. **Stay skeptical** - AI is confidently wrong more often than you'd expect
9. **You own decisions** - AI advises, you decide
10. **Document decisions** - "We chose X because Y, not Z because..."
11. **Iterate** - First response is starting point, not final answer

---

## Related

- [SOP-0.1.03: Prompting Patterns](../workflow/sops/general/SOP-0.1.03-prompting-patterns.md) - Detailed prompt templates
- [REQ-099: Prompt Management System](repo:docs/requirements/workflow/req-workflow-099-prompt-management-system.md) - Future `sc prompts` command
- [REQ-100: Workflow Navigation](repo:docs/requirements/workflow/req-workflow-100-workflow-navigation-system.md) - Future `sc next` command

