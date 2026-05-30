---
id: comp-iso-005-design-planning
title: COMP-ISO-005 - Design Planning
sidebar_label: COMP-ISO-005 Design Planning
sidebar_position: 5
status: pending-verification
references: []
---

# COMP-ISO-005: Design Planning

## Overview

**Purpose**: Design and development planning procedures  
**ISO Clause**: 7.3.1 Design and Development Planning  
**Category**: design-controls, planning  
**Priority**: High  
**Framework**: ISO 13485

## Description

Establishes planning for design and development activities, including stages, reviews, verification, validation, and responsibilities.

## Acceptance Criteria

```gherkin
Feature: Design Planning Compliance Validation
  As a compliance auditor
  I want to validate design planning processes
  So that I can verify ISO 13485 design control requirements

  Background:
    Given the organization develops medical devices
    And design control processes are implemented
    And a design planning audit is being conducted

  Scenario: Design Plan Documentation Audit
    Given a design planning review is conducted
    When design plan documents are examined
    And planning activities are reviewed
    And stage definitions are verified
    Then design plans shall be documented for each product
    And design stages shall be clearly defined
    And planning activities shall be appropriate for the product

  Scenario: Design Responsibility Assignment Audit
    Given design responsibility processes exist
    When responsibility assignments are reviewed
    And authority definitions are examined
    And interface management is assessed
    Then design responsibilities shall be clearly assigned
    And design authorities shall be defined and communicated
    And organizational interfaces shall be managed effectively

  Scenario: Design Review Planning Audit
    Given design review planning is operational
    When review schedules are examined
    And review criteria are verified
    And review participants are assessed
    Then design reviews shall be planned at appropriate stages
    And review criteria shall be defined for each stage
    And review participants shall have appropriate competence
```

## Technical Context

### Implementation Requirements

- **Design Plans**: Documented plans for each design and development project
- **Design Stages**: Clearly defined stages with appropriate activities and deliverables
- **Responsibilities**: Assigned responsibilities and authorities for design activities
- **Review Planning**: Planned design reviews at appropriate stages
- **Verification Planning**: Planned verification activities and methods
- **Validation Planning**: Planned validation activities and acceptance criteria

### System Architecture

```typescript
interface DesignPlanningSystem {
  designPlans: DesignPlan[];
  designStages: DesignStage[];
  responsibilities: ResponsibilityAssignment[];
  reviewSchedule: ReviewSchedule;
  verificationPlan: VerificationPlan;
  validationPlan: ValidationPlan;
}

interface DesignPlan {
  projectId: string;
  productName: string;
  designStages: DesignStage[];
  responsibilities: ResponsibilityAssignment[];
  reviewPoints: ReviewPoint[];
  verificationActivities: VerificationActivity[];
  validationActivities: ValidationActivity[];
}

interface DesignStage {
  stageId: string;
  stageName: string;
  objectives: string[];
  deliverables: Deliverable[];
  acceptanceCriteria: AcceptanceCriteria[];
  duration: Duration;
}
```

### Validation Strategy

1. **Plan Documentation**: Verify design plans are documented and approved
2. **Stage Definition**: Assess design stage definitions and appropriateness
3. **Responsibility Verification**: Confirm responsibility assignments and authorities
4. **Review Planning**: Evaluate design review planning and scheduling
5. **Integration Assessment**: Verify integration with overall development process

## Compliance Evidence

### Required Documentation

- Design and Development Plans for each product
- Design stage definitions and gate criteria
- Responsibility and authority assignments
- Design review schedules and criteria
- Verification and validation planning documents
- Interface management procedures

### Audit Trail

- Design plan approval and revision records
- Design stage gate review records
- Responsibility assignment and change records
- Design review planning and execution records
- Verification and validation plan updates

## Related Requirements

- REQ-ISO-006: Design Inputs
- REQ-ISO-007: Design Outputs
- REQ-ISO-008: Design Review
- REQ-ISO-009: Design Verification
- REQ-ISO-010: Design Validation

_Note: Individual requirement template files are generated when using `sc init --framework=iso13485`_

## Usage Examples

### CLI Commands

```bash
# Generate this requirement
sc req new --template=REQ-ISO-005 --title="Design Planning"

# Validate design planning implementation
sc req validate REQ-ISO-005 --framework=iso13485

# Generate design plan templates
sc docs generate --type=design-plan --requirement=REQ-ISO-005
```
