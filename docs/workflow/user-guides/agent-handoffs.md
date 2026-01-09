---
id: agent-handoffs
title: Agent Handoffs
sidebar_label: Agent Handoffs
sidebar_position: 6
---

import InteractiveWorkflow from '@site/src/components/InteractiveWorkflow';

# Agent Handoff System

## 🤖 **Live Agent Handoff Process**

<InteractiveWorkflow type="agent-handoff" projectData={{}} />

The agent handoff system ensures seamless knowledge transfer between AI agents working on the Supernal Coding project. This system maintains context, preserves work progress, and enables effective collaboration across agent sessions.

## 📋 **Handoff Template**

### **Standard Handoff Format** [[memory:3763006]]

All handoff files follow the format: `YYYY-MM-DD-HH-MM-[title].md`

```markdown
# 🚀 HANDOFF: [Brief Title]

**Status**: [Current Status] → [Next Status]
**Priority**: [P1-Critical | P2-High | P3-Medium | P4-Low]
**Handoff Date**: YYYY-MM-DD-HH-MM
**From**: [Current Agent]
**To**: [Next Agent | Team]
**Branch**: [Current Git Branch]

---

## 🎯 **Task Summary**

[2-3 sentence summary of what was accomplished and what's next]

## 🔄 **Current Progress**

### **Progress Made**

- [x] **[Major Accomplishment 1]** - Brief description
- [x] **[Major Accomplishment 2]** - Brief description
- [ ] **[In Progress Item]** - Current status

### **Branch & Git Context**

- 📍 Working on feature branch: [branch-name]
- ✅ Branch status: [commits ahead, ready for merge, etc.]
- 🔄 Related PRs: [PR numbers if applicable]

### **Testing & Build Context**

- ✅/❌ Build status: [passing/failing with details]
- 🧪 Test coverage: [test status and coverage info]
- 🚀 Deployment status: [if applicable]

---

## 🎯 **IMMEDIATE NEXT PRIORITIES**

### **P1 - Critical (Start Immediately)**

1. **[Priority Task 1]**
   - **Context**: [Why this is critical]
   - **Approach**: [Recommended approach]
   - **Resources**: [Files, docs, or commands to reference]
   - **Acceptance**: [How to know it's complete]

### **P2 - High (Next in Queue)**

1. **[Priority Task 2]**
   - **Context**: [Background and importance]
   - **Dependencies**: [What needs to be done first]
   - **Estimated Effort**: [Time/complexity estimate]

---

## 📚 **Context & Background**

### **Project State**

- **Current Epic**: [Epic being worked on]
- **Active Requirements**: [REQ-XXX numbers and status]
- **Technical Context**: [Key technical details]

### **Key Decisions Made**

- **[Decision 1]**: [Rationale and implications]
- **[Decision 2]**: [Rationale and implications]

### **Known Issues**

- **[Issue 1]**: [Description and potential solutions]
- **[Issue 2]**: [Description and workarounds]

---

## 🔗 **Resources & References**

### **Critical Files**

- [File path]: [Purpose and importance]
- [File path]: [Purpose and importance]

### **Related Requirements**

- [REQ-XXX]: [Title and relevance]
- [REQ-XXX]: [Title and relevance]

### **External References**

- [Documentation links]
- [API references]
- [Design documents]

---

## 💡 **Recommendations**

### **Technical Approach**

- [Specific technical recommendations]
- [Architecture considerations]
- [Performance considerations]

### **Process Recommendations**

- [Workflow suggestions]
- [Testing strategies]
- [Quality assurance approaches]

---

**🚀 Ready for handoff to next agent**
```

## 📝 **Current Active Handoff**

### **Latest Handoff: Requirements System Complete**

**File**: `2025-07-20-22-54-requirements-system-complete-next-priorities-ready.md`

**Key Highlights**:

- ✅ **Requirements tracking automation** fully functional
- ✅ **46 requirement files** initialized with git tracking
- ✅ **Timestamp formatting** standardized across system
- 🎯 **Three high-value priorities** ready for pickup:
  1. REQ-025 documentation system (Phase 2)
  2. Enhanced Workflow System implementation
  3. REQ-011 conventional commits implementation

**Current Branch**: `feature/req-011-test-framework-improvements`
**Status**: Ready for merge with 16 commits ahead of main

## 🔄 **Handoff Process**

### **Creating a Handoff**

```bash
# Use the CLI command to create standardized handoffs
sc handoff create "Brief Title" \
  --status="Current → Next" \
  --priority="P1-Critical" \
  --branch="$(git branch --show-current)"
```

### **Handoff Review Checklist**

Before creating a handoff, ensure:

- [ ] **Code committed** - All work committed to version control
- [ ] **Tests passing** - Build and test status documented
- [ ] **Documentation updated** - READMEs, requirements, etc. current
- [ ] **Dependencies clear** - Next steps have clear prerequisites
- [ ] **Context complete** - All necessary background provided
- [ ] **Resources linked** - Files, docs, and references included

### **Reading a Handoff**

When receiving a handoff:

1. **Review Current State** - Understand what was accomplished
2. **Check Git Context** - Switch to correct branch and verify commits
3. **Validate Build** - Ensure development environment is working
4. **Understand Priorities** - Focus on P1 items first
5. **Review Resources** - Read linked files and documentation
6. **Ask Questions** - Create issues for unclear items

## 🎯 **Handoff Types**

### **Completion Handoff**

- **Purpose**: Task/requirement completed, ready for review or next phase
- **Focus**: Accomplishments, test results, deployment status
- **Next Steps**: Review, testing, or follow-up work

### **Work-in-Progress Handoff**

- **Purpose**: Ongoing work that needs to be transferred
- **Focus**: Current state, blockers, immediate next steps
- **Next Steps**: Continue implementation, resolve blockers

### **Investigation Handoff**

- **Purpose**: Research or analysis phase complete
- **Focus**: Findings, recommendations, decision points
- **Next Steps**: Implementation based on research

### **Emergency Handoff**

- **Purpose**: Urgent transfer due to issues or time constraints
- **Focus**: Critical context, immediate actions needed
- **Next Steps**: Stabilization, issue resolution

## 📊 **Handoff Metrics**

### **Handoff Quality Indicators**

- **Context Completeness**: All necessary background provided
- **Action Clarity**: Next steps clearly defined
- **Resource Availability**: All referenced materials accessible
- **Priority Accuracy**: Importance levels correctly assigned

### **Transfer Effectiveness**

- **Pickup Time**: How quickly next agent can start productive work
- **Question Count**: Number of clarifications needed
- **Context Loss**: Whether important information was missing
- **Continuity**: Smooth progression from handoff point

## 🚨 **Handoff Best Practices**

### **For the Handoff Creator**

- **Be Comprehensive**: Include all context, even if it seems obvious
- **Be Specific**: Provide exact file paths, command examples, and URLs
- **Prioritize Ruthlessly**: Clearly distinguish critical from nice-to-have
- **Test Instructions**: Verify that provided commands and references work
- **Anticipate Questions**: Address likely confusion points proactively

### **For the Handoff Recipient**

- **Read Completely**: Don't skip sections, even if they seem familiar
- **Verify Environment**: Ensure development setup matches expectations
- **Follow Priorities**: Start with P1 items, resist urge to reorganize
- **Document Issues**: Create tickets for problems or unclear instructions
- **Update Status**: Confirm receipt and provide feedback on handoff quality

## 🔗 **Integration with Requirements**

Handoffs are tightly integrated with the requirements system [[memory:2897579]]:

- **Requirement Tracking**: Handoffs reference specific REQ-XXX numbers
- **Epic Context**: Current epic and phase information included
- **Gherkin Integration**: Links to relevant feature scenarios
- **Git Coordination**: Branch names follow requirement patterns
- **CSV Export**: Handoff data included in progress reports

## 📁 **Handoff Archive**

Completed handoffs are moved to the archive directory:

- **Active**: `supernal-coding/kanban/handoffs/`
- **Archive**: `supernal-coding/kanban/handoffs/archive/`

Archive organization:

- Handoffs moved after work completion or superseding handoff created
- Searchable by date, requirement, or agent
- Preserved for project history and learning

---

The agent handoff system ensures that work context is never lost and enables seamless collaboration between AI agents working on complex, long-running projects.
