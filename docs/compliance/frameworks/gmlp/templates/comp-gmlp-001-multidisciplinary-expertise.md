---
id: COMP-GMLP-001
framework: GMLP
category: Organizational Excellence
title: Multi-Disciplinary Expertise
description: Ensure multi-disciplinary collaboration across clinical, technical, and regulatory domains for AI/ML medical device development
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-FDA-ML-001
  - COMP-FDA-ML-002
  - COMP-IEC62304-002
  - COMP-ISO-002
tags:
  - gmlp
  - multi-disciplinary
  - team-collaboration
  - medical-devices
  - organizational-excellence
priority: high
---

# COMP-GMLP-001: Multi-Disciplinary Expertise

## Overview

**GMLP Principle 1:** "Multi-disciplinary expertise is leveraged throughout the total product life cycle to ensure that ML models are developed, deployed, and maintained in a manner that is safe, effective, and meets the needs of patients and healthcare providers."

Defines requirements for establishing and maintaining multi-disciplinary teams with appropriate clinical, technical, and regulatory expertise throughout the AI/ML medical device lifecycle.

**Regulatory Context:** FDA GMLP Principles, 21 CFR Part 820

---

## Multi-Disciplinary Team Requirements

### 1. Team Composition

#### Acceptance Criteria
```gherkin
Feature: Multi-Disciplinary Team Formation

  Scenario: Establish core team with required expertise
    Given an AI/ML medical device development project
    When forming the core team
    Then the team MUST include:
      | Role                                 | Expertise Required          | Minimum Count |
      |--------------------------------------|----------------------------|---------------|
      | Clinical Expert                      | Clinical domain, target population | 2 |
      | ML Engineer/Data Scientist           | ML algorithms, model development | 2 |
      | Software Engineer                    | Software architecture, implementation | 2 |
      | Regulatory Affairs                   | FDA regulations, device classification | 1 |
      | Quality Assurance                    | QMS, design controls | 1 |
      | Clinical Validation Specialist       | Clinical study design, statistics | 1 |
    And each team member's qualifications MUST be documented
    And roles and responsibilities MUST be defined
    And team structure MUST be maintained throughout lifecycle

  Scenario: Document team member qualifications
    Given a multi-disciplinary team
    When documenting qualifications
    Then for each team member:
      | Documentation Required               | Validation                  |
      |--------------------------------------|----------------------------|
      | Education and credentials            | CV/resume on file           |
      | Relevant experience (years)          | Experience verification     |
      | Domain-specific expertise            | Training records            |
      | Role responsibilities                | Job description             |
    And qualifications MUST meet project requirements
    And team competency gaps MUST be addressed
```

**Key Controls:**
- Team composition matrix
- Team member qualification documentation
- Roles and responsibilities (RACI matrix)
- Competency gap analysis

**Metrics:**
- Team composition score (all required roles filled)
- Average years of experience per role
- Team turnover rate
- Cross-functional meeting frequency

---

### 2. Collaborative Decision-Making

#### Acceptance Criteria
```gherkin
Feature: Multi-Disciplinary Decision-Making

  Scenario: Major decisions require multi-disciplinary review
    Given a major project decision point
    When making the decision
    Then the decision MUST involve:
      | Decision Type                        | Required Reviewers          |
      |--------------------------------------|----------------------------|
      | Clinical objective definition        | Clinical experts, regulatory affairs |
      | Model architecture selection         | ML engineers, clinical experts |
      | Dataset selection and curation       | Clinical experts, ML engineers, data quality |
      | Validation study design              | Clinical experts, statistician, regulatory |
      | Labeling and user information        | Clinical experts, regulatory, usability |
      | Model update decisions               | All disciplines              |
    And decisions MUST be documented
    And dissenting opinions MUST be recorded
    And decision rationale MUST be traceable

  Scenario: Regular cross-functional reviews
    Given ongoing development activities
    When conducting reviews
    Then the team MUST hold:
      | Review Type                          | Frequency                   | Participants                |
      |--------------------------------------|----------------------------|-----------------------------|
      | Design review (phase gates)          | Per phase                  | All disciplines              |
      | Risk management review               | Monthly (minimum)          | Clinical, engineering, quality |
      | Clinical validation planning         | Pre-study, post-results    | Clinical, statistics, regulatory |
      | Post-market performance review       | Quarterly                  | All disciplines              |
    And review minutes MUST be documented
    And action items MUST be tracked
```

**Key Controls:**
- Decision log with multi-disciplinary sign-off
- Meeting minutes with action items
- Phase gate review process
- Escalation procedures for disagreements

**Metrics:**
- Multi-disciplinary meeting frequency
- Decision log completeness
- Action item closure rate
- Time to resolve disagreements

---

### 3. Clinical Expert Engagement

#### Acceptance Criteria
```gherkin
Feature: Clinical Expert Involvement

  Scenario: Clinical experts review critical deliverables
    Given development deliverables
    When clinical review is required
    Then clinical experts MUST review:
      | Deliverable                          | Clinical Review Focus       |
      |--------------------------------------|----------------------------|
      | Clinical objective definition        | Clinical relevance, need    |
      | Target population specification      | Clinical appropriateness    |
      | Training dataset composition         | Clinical representativeness |
      | Model output interpretation          | Clinical usability          |
      | Validation study protocol            | Clinical endpoints, feasibility |
      | Device labeling                      | Clinical accuracy, clarity  |
    And clinical expert feedback MUST be documented
    And feedback MUST be addressed before proceeding

  Scenario: Clinical advisory board
    Given an AI/ML medical device project
    When establishing clinical oversight
    Then the project MUST have:
      | Requirement                          | Specification               |
      |--------------------------------------|----------------------------|
      | Clinical Advisory Board (CAB)        | Minimum 3 clinical experts  |
      | CAB member credentials               | Board certified, relevant specialty |
      | CAB meeting frequency                | Quarterly (minimum)         |
      | CAB review scope                     | Clinical objectives, validation, labeling |
    And CAB recommendations MUST be documented
    And CAB feedback MUST be incorporated or justified
```

**Key Controls:**
- Clinical expert credentials documentation
- Clinical Advisory Board charter
- Clinical review records
- Feedback tracking and resolution

**Metrics:**
- Number of clinical experts engaged
- Clinical expert review completion rate
- Feedback incorporation rate
- CAB meeting frequency

---

## Implementation Guidelines

### Team Structure

```yaml
multi_disciplinary_team:
  clinical_experts:
    - name: "Dr. Name"
      credentials: "MD, Board Certified Cardiologist"
      role: "Clinical Lead"
      responsibilities: ["Clinical objective definition", "Dataset review", "Validation design"]
  
  ml_engineers:
    - name: "Engineer Name"
      credentials: "PhD, ML/AI"
      role: "ML Lead"
      responsibilities: ["Model architecture", "Training pipeline", "Performance optimization"]
  
  software_engineers:
    - name: "Engineer Name"
      credentials: "BS Computer Science, 10 years experience"
      role: "Software Architect"
      responsibilities: ["Software design", "Integration", "Deployment"]
  
  regulatory_affairs:
    - name: "RA Specialist"
      credentials: "RAC, 5 years medical device experience"
      role: "Regulatory Lead"
      responsibilities: ["Regulatory strategy", "Submissions", "Compliance"]
  
  quality_assurance:
    - name: "QA Manager"
      credentials: "ASQ CQE, ISO 13485 Lead Auditor"
      role: "Quality Lead"
      responsibilities: ["QMS", "Design controls", "Audits"]
  
  decision_making:
    process: "Consensus-based with documented rationale"
    escalation: "Project steering committee"
    documentation: "Decision log with sign-off"
```

---

## Integration Points

- **COMP-FDA-ML-002:** Clinical experts define clinical objectives
- **COMP-IEC62304-002:** Multi-disciplinary input to software development planning
- **COMP-ISO-002:** Management responsibility for team resourcing

---

## Audit Evidence

1. **Team Composition:**
   - [ ] Team composition matrix
   - [ ] Team member CVs and credentials
   - [ ] Roles and responsibilities (RACI matrix)
   - [ ] Competency gap analysis

2. **Collaborative Decision-Making:**
   - [ ] Decision log with multi-disciplinary sign-off
   - [ ] Meeting minutes (design reviews, risk reviews, etc.)
   - [ ] Action item tracking
   - [ ] Phase gate review records

3. **Clinical Expert Engagement:**
   - [ ] Clinical Advisory Board charter and membership
   - [ ] Clinical expert review records
   - [ ] CAB meeting minutes
   - [ ] Feedback tracking and resolution

---

## References

- FDA, Health Canada, MHRA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
- 21 CFR Part 820 (Quality System Regulation - Management Responsibility)
- ISO 13485:2016 (Medical Devices - Quality Management Systems)

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |

---

## Notes

- **Status:** Pending verification with authoritative sources
- **Priority:** HIGH - Foundational to entire GMLP framework
- **Implementation Note:** Multi-disciplinary collaboration is not optional; it is a regulatory expectation



