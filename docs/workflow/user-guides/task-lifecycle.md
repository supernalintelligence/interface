---
id: task-lifecycle
title: Task Lifecycle
sidebar_label: Task Lifecycle
sidebar_position: 3
---

import InteractiveWorkflow from '@site/src/components/InteractiveWorkflow';

# Task Lifecycle Management

## 🎯 **Live Task Status**

<InteractiveWorkflow type="task-lifecycle" projectData={{}} />

The task lifecycle system provides structured progression from initial creation to completion, with automated transitions, quality gates, and approval workflows based on risk assessment.

## 📋 **State Definitions**

### **TODO**

- **Purpose**: Initial state for new tasks
- **Triggers**: Task creation, requirement breakdown
- **Requirements**: Clear title, description, and acceptance criteria
- **CLI Commands**:
  ```bash
  sc kanban new todo "Task title" --requirement="REQ-001"
  sc kanban list --status=todo
  ```

### **DOING**

- **Purpose**: Active development work
- **Triggers**: Developer assignment, work start
- **Requirements**: Clear understanding of acceptance criteria
- **Best Practices**:
  - Update progress regularly
  - Document blockers immediately
  - Link commits to task ID
- **CLI Commands**:
  ```bash
  sc kanban update todo-123 --status=doing
  sc kanban show todo-123
  ```

### **BLOCKED**

- **Purpose**: Work cannot proceed due to dependencies
- **Triggers**: External dependency, technical blocker, resource constraint
- **Requirements**: Document specific blocker and resolution approach
- **Escalation**: Automatic escalation after 24 hours
- **CLI Commands**:
  ```bash
  sc kanban update todo-123 --status=blocked --notes="Waiting for API design"
  sc kanban list --status=blocked
  ```

### **TESTING**

- **Purpose**: Implementation complete, undergoing verification
- **Triggers**: Developer marks implementation complete
- **Requirements**: All acceptance criteria met, tests written and passing
- **Validation**: Automated test runs, manual verification if needed
- **CLI Commands**:
  ```bash
  sc kanban update todo-123 --status=testing
  sc validate todo-123
  ```

### **NEEDS_APPROVAL**

- **Purpose**: Technical review required before completion
- **Triggers**: High-risk changes, security implications, architectural decisions
- **Approval Types**:
  - **Standard**: General code review (3 day SLA)
  - **High-Risk**: Critical system changes (1 day SLA)
  - **Security**: Security-related changes (4 hour SLA)
- **CLI Commands**:
  ```bash
  sc kanban update todo-123 --status=needs-approval --approval-type=security
  sc kanban list --needs-approval
  ```

### **APPROVED**

- **Purpose**: Approved and ready for final completion
- **Triggers**: Successful approval process
- **Requirements**: All approval criteria met
- **CLI Commands**:
  ```bash
  sc kanban approve todo-123 --approver="lead-dev"
  ```

### **REJECTED**

- **Purpose**: Approval failed, requires rework
- **Triggers**: Failed approval, feedback provided
- **Requirements**: Clear feedback and rework instructions
- **CLI Commands**:
  ```bash
  sc kanban reject todo-123 --feedback="Security concerns need addressing"
  ```

### **DONE**

- **Purpose**: Task completed and delivered
- **Triggers**: Approval completion or auto-approval
- **Requirements**: All acceptance criteria met, tests passing, approved if needed
- **Automation**: Automatic progress updates to parent requirement
- **CLI Commands**:
  ```bash
  sc kanban update todo-123 --status=done
  sc kanban archive --status=done --older-than=30days
  ```

## ⚡ **Automation Rules**

### **Automatic Transitions**

- **TODO → DOING**: When developer assigns themselves
- **TESTING → DONE**: When auto-approval criteria met (low-risk, tests pass)
- **APPROVED → DONE**: Automatic completion after approval
- **BLOCKED → DOING**: When blocker resolution confirmed

### **Escalation Triggers**

- **BLOCKED > 24 hours**: Notify team lead
- **NEEDS_APPROVAL > SLA**: Escalate based on approval type
- **DOING > 7 days**: Check for abandonment

### **Progress Tracking**

- **Requirement Progress**: Calculated from child task states
- **Epic Progress**: Rolled up from requirement completion
- **Velocity Metrics**: Historical completion times by state

## 🔄 **State Transition Commands**

### **Starting Work**

```bash
# Assign and start a task
sc kanban assign todo-123 --to=me
sc kanban update todo-123 --status=doing
```

### **Handling Blockers**

```bash
# Mark as blocked with details
sc kanban block todo-123 --reason="Waiting for API endpoint" --owner="api-team"

# Resolve blocker
sc kanban unblock todo-123 --resolution="API endpoint ready"
```

### **Testing and Approval**

```bash
# Move to testing
sc kanban test todo-123

# Request specific approval
sc kanban request-approval todo-123 --type=security --notes="New auth flow"

# Approve with comments
sc kanban approve todo-123 --comments="LGTM after security review"
```

### **Completion**

```bash
# Mark as done
sc kanban complete todo-123

# Complete with metrics
sc kanban complete todo-123 --hours=8 --complexity=medium
```

## 📊 **Live Metrics and Reporting**

### **Real-Time Task Metrics**

The live dashboard above shows current task distribution across all states. Key metrics include:

- **Cycle Time**: TODO → DONE duration (currently averaging 2.3 days)
- **Lead Time**: Creation → DONE duration
- **Blocked Time**: Total time in BLOCKED state (average 1.2 days resolution)
- **Approval Time**: NEEDS_APPROVAL → APPROVED duration

### **Team Metrics**

- **Throughput**: Tasks completed per sprint
- **Work in Progress**: Active DOING tasks (shown in live counter above)
- **Blocker Rate**: Percentage of tasks that become BLOCKED
- **Approval Efficiency**: Average approval turnaround time

### **Quality Metrics**

- **Rework Rate**: REJECTED → DOING transitions
- **Test Coverage**: Tasks with automated tests
- **Defect Rate**: Tasks requiring post-completion fixes

## 🚨 **Exception Handling**

### **Abandoned Tasks**

- **Detection**: DOING state > 7 days without updates
- **Action**: Automatic reassignment or return to TODO
- **Notification**: Team lead and original assignee

### **Stuck Approvals**

- **Detection**: NEEDS_APPROVAL beyond SLA
- **Action**: Escalate to next approval level
- **Fallback**: Auto-approve for low-risk after extended delay

### **Circular Dependencies**

- **Detection**: Task blocked by dependent task
- **Action**: Dependency graph analysis and resolution suggestions
- **Prevention**: Validation during task creation

## 🔗 **Integration with Git Workflow**

The task lifecycle integrates seamlessly with the [Git workflow](./git-integration) system:

- **Branch Creation**: Automatic feature branch creation when task moves to DOING
- **Commit Linking**: All commits must reference task ID for traceability
- **Merge Approval**: High-risk tasks require additional git-based approval
- **Completion Hooks**: DONE status triggers automatic git metadata updates

## 🎯 **Next Steps**

- Review the [Agent Handoff Process](./agent-handoffs) for task transfer workflows
- Explore [Git Integration](./git-integration) for complete development lifecycle
- Check [Architecture Overview](./architecture) for system design patterns

---

This lifecycle ensures consistent task management while providing flexibility for different types of work and approval requirements. The live dashboard above provides real-time visibility into current project state.
