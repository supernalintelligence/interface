---
type: sop
category: ai-technique
sop_id: SOP-0.1.16
title: Roles & Responsibilities
phase: null
group: C
part_number: 16
audience: [all]
read_time: 25
created: 2025-11-21
updated: 2025-11-23
status: needs_approval
version: '1.0'
author: Supernal Coding Team
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1, SOP-0.1.15]
prerequisites: []
tags: [roles, responsibilities, collaboration, reference]
---

# Roles & Responsibilities

**Type**: Reference  
**Group**: C. Reference & Standards

---

## Team Roles (Inspired by @inspiration)

### Product Owner

**Primary Responsibilities**:

- Maintain product backlog
- Define and prioritize user stories
- Accept/reject completed work
- Make product decisions
- Interface with stakeholders

**AI Assistance**:

- Generate user stories from requirements
- Prioritize backlog based on value/effort
- Draft acceptance criteria

**Artifacts Owned**:

- Business Requirements (BR-XXX)
- User Stories (US-XXX)
- Product Backlog
- Sprint Goals

---

### Architect

**Primary Responsibilities**:

- Define system architecture
- Review technical designs
- Ensure scalability/security
- Create ADRs for major decisions
- Guide technical direction

**AI Assistance**:

- Generate architecture diagrams
- Analyze architectural trade-offs
- Draft ADRs from discussions
- Suggest design patterns

**Artifacts Owned**:

- Architecture Decision Records (ADR-XXX)
- Solution Architecture Document (SAD)
- Architecture Design Documents (ADD)
- Technical Standards Document (TSD)

---

### Tech Lead

**Primary Responsibilities**:

- Lead development team
- Review code and designs
- Mentor developers
- Ensure quality standards
- Manage technical risk

**AI Assistance**:

- Review code for patterns/issues
- Generate test cases
- Suggest refactoring approaches
- Analyze code complexity

**Artifacts Owned**:

- Technical design reviews
- Code review approvals
- Team technical standards

---

### Developer

**Primary Responsibilities**:

- Implement features
- Write tests
- Document code
- Participate in code review
- Maintain code quality

**AI Assistance**:

- Generate code from requirements
- Write unit/integration tests
- Generate documentation
- Suggest optimizations

**Artifacts Owned**:

- Source code
- Unit tests
- Code comments/JSDoc
- Technical documentation

---

### QA Engineer

**Primary Responsibilities**:

- Create test plans
- Write E2E tests
- Perform manual testing
- Report bugs
- Verify fixes

**AI Assistance**:

- Generate test scenarios
- Create E2E test code
- Analyze test coverage
- Suggest edge cases

**Artifacts Owned**:

- Test plans
- E2E tests
- Bug reports
- Test results

---

### Security Engineer

**Primary Responsibilities**:

- Security reviews
- Threat modeling
- Security requirements
- Vulnerability scanning
- Security training

**AI Assistance**:

- Generate threat models
- Suggest security controls
- Analyze code for vulnerabilities
- Draft security documentation

**Artifacts Owned**:

- Security requirements (SEC-XXX)
- Threat models
- Security analysis reports
- Penetration test results

---

### Operations/DevOps

**Primary Responsibilities**:

- Infrastructure management
- CI/CD pipelines
- Monitoring and alerts
- Deployment automation
- Incident response

**AI Assistance**:

- Generate IaC code
- Suggest monitoring alerts
- Analyze performance metrics
- Draft runbooks

**Artifacts Owned**:

- Infrastructure code
- CI/CD configurations
- Deployment runbooks
- Monitoring dashboards

---

## Collaboration Model

### Daily Work

- **Developers + AI**: Implement features, write tests
- **Developers + Tech Lead**: Code review, technical decisions
- **Product Owner + Developers**: Clarify requirements

### Weekly Ceremonies

- **Sprint Planning**: Product Owner + Team
- **Backlog Refinement**: Product Owner + Tech Lead + Architect
- **Retrospective**: Entire Team

### Checkpoints (from @inspiration)

1. **Architecture & Requirements Alignment** (Phase 7)
   - Participants: Product Owner + Architect + Tech Lead
   - Purpose: Ensure architecture supports requirements

2. **Implementation Planning** (Phase 13)
   - Participants: Lead Developer + UX + Product Owner + QA + Ops
   - Purpose: Finalize implementation plan

### Approval Workflows

#### Technical Approval

- **Required for**: Code changes
- **Approvers**: Tech Lead or Senior Developer
- **Criteria**: Follows patterns, tests pass, documented

#### Architectural Approval

- **Required for**: ADRs, major design changes
- **Approvers**: Architect
- **Criteria**: Aligns with architecture, scalable, secure

#### Product Approval

- **Required for**: Feature completion, requirements changes
- **Approvers**: Product Owner
- **Criteria**: Meets acceptance criteria, user value delivered

#### Security Approval

- **Required for**: Security-related changes, external integrations
- **Approvers**: Security Engineer
- **Criteria**: Security controls in place, threats mitigated

---

## Decision Matrix

| Decision Type     | Owner             | Consulted             | Informed      |
| ----------------- | ----------------- | --------------------- | ------------- |
| Product Direction | Product Owner     | Architect, Tech Lead  | Team          |
| Architecture      | Architect         | Tech Lead, Security   | Team          |
| Technical Design  | Tech Lead         | Architect, Developers | Product Owner |
| Implementation    | Developer         | Tech Lead             | Team          |
| Testing Strategy  | QA Engineer       | Developers            | Tech Lead     |
| Deployment        | Operations        | Tech Lead             | Team          |
| Security          | Security Engineer | Architect, Operations | Team          |

---

## Communication Channels

### Synchronous

- **Daily Standup** (15 min): Team coordination
- **Pairing/Mob Sessions**: Real-time collaboration
- **Code Review**: Direct feedback

### Asynchronous

- **Pull Requests**: Code review
- **Documentation**: Decisions, designs
- **Issue Tracking**: Tasks, bugs

### AI as Team Member

- **Always Available**: No time zone issues
- **Consistent**: Same standards every time
- **Augments, Not Replaces**: Humans make final decisions

---

## Navigation

← Previous: [Part 15: Naming Conventions](SOP-0.1.15-naming-conventions.md)
→ Next: [Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)

[Back to Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
