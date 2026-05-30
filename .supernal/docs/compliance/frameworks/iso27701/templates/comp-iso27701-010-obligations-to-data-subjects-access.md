---
id: comp-iso27701-010-obligations-to-data-subjects-access
title: COMP-ISO27701-010 - Obligations to Data Subjects - Access
sidebar_label: COMP-ISO27701-010
sidebar_position: 10
status: pending-verification
references: []
---

# COMP-ISO27701-010: Obligations to Data Subjects - Access

## Overview

**Purpose**: Provide data subjects access to their PII  
**ISO 27701 Control**: 6.7.2.3  
**Category**: privacy-controller  
**Priority**: high  
**Framework**: ISO 27701 (Privacy Extension)

## Description

Implements ISO 27701 control 6.7.2.3 to provide data subjects access to their pii. This privacy-specific control extends ISO 27001 requirements to address privacy information management.

## Acceptance Criteria

```gherkin
Feature: Obligations to Data Subjects - Access
  As a privacy officer
  I want to implement obligations to data subjects - access
  So that I can meet ISO 27701 6.7.2.3 requirements

  Background:
    Given the organization has a PIMS
    And ISO 27701 certification is required
    And privacy controls are being implemented

  Scenario: Privacy Control Implementation
    Given privacy requirements are identified
    When control measures are implemented
    And procedures are documented
    And personnel are trained
    Then control shall protect PII appropriately
    And control shall meet ISO 27701 requirements
    And evidence shall be documented

  Scenario: Privacy Control Verification
    Given privacy control is implemented
    When control effectiveness is tested
    And compliance is verified
    And gaps are identified
    Then control shall demonstrate effectiveness
    And gaps shall be remediated
    And verification shall be documented
```

## Technical Context

### Implementation Requirements

- Implement privacy-specific technical and organizational measures
- Document privacy procedures
- Integrate with existing ISO 27001 ISMS controls
- Train personnel on privacy requirements
- Monitor privacy control effectiveness
- Review and update regularly

### Privacy Impact

This control addresses privacy-specific requirements that extend beyond general information security.

## Validation Strategy

### Testing Approach

1. **Privacy Documentation Review**: Verify privacy procedures are documented
2. **Technical Control Testing**: Confirm privacy controls are in place
3. **Personnel Verification**: Check privacy training and awareness
4. **Effectiveness Assessment**: Test privacy control operation
5. **Compliance Verification**: Audit against ISO 27701 requirements

## Evidence Requirements

### Required Documentation

- Privacy control procedures
- Technical privacy configuration
- Privacy training records
- Privacy compliance reports
- Privacy review and update records

### Evidence Collection

- Maintain privacy procedures in version control
- Store privacy configurations
- Track privacy training completion
- Document privacy assessments
- Archive privacy audit results

## Related Controls

### Within ISO 27701

- Related privacy controls will be identified during implementation

### ISO 27001 Base Controls

- Extends applicable ISO 27001 controls with privacy requirements

### Cross-Framework

- comp-gdpr-XXX: GDPR requirements (high alignment)
- comp-soc-XXX: SOC2 privacy criteria

## Implementation Notes

### Best Practices

- Align with GDPR and other privacy regulations
- Integrate with ISO 27001 ISMS
- Conduct regular privacy impact assessments
- Maintain comprehensive processing records
- Ensure transparency with data subjects

### Common Pitfalls

- Treating privacy as pure security issue
- Insufficient data mapping
- Weak consent mechanisms
- Poor data subject rights processes
- Inadequate third-party management

## Status

- [ ] Privacy control requirements analyzed
- [ ] Privacy implementation plan created
- [ ] Privacy technical controls deployed
- [ ] Privacy procedures documented
- [ ] Personnel trained on privacy
- [ ] Privacy control effectiveness verified
- [ ] Privacy evidence collected
