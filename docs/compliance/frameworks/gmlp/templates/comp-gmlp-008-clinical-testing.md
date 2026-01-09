---
id: COMP-GMLP-008
framework: GMLP
category: Clinical Validation
title: Testing in Clinically Relevant Conditions
description: Demonstrate device performance during clinically relevant conditions including edge cases and failure modes
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-FDA-ML-005
  - COMP-GMLP-007
  - COMP-IEC62304-008
tags:
  - gmlp
  - clinical-testing
  - validation
  - medical-devices
priority: critical
---

# COMP-GMLP-008: Testing in Clinically Relevant Conditions

## Overview

**GMLP Principle 8:** "Testing demonstrates device performance during clinically relevant conditions."

Defines requirements for comprehensive testing in realistic clinical conditions, including edge cases, failure modes, and diverse clinical scenarios. Testing must reflect real-world clinical use.

**Regulatory Context:** FDA GMLP Principles, IEC 62304

---

## Clinically Relevant Testing Requirements

### 1. Realistic Clinical Scenarios

#### Acceptance Criteria
```gherkin
Feature: Clinically Relevant Test Scenarios

  Scenario: Test across clinical use conditions
    Given intended clinical use
    When designing test scenarios
    Then testing MUST include:
      | Scenario Type                        | Coverage Requirement        |
      |--------------------------------------|----------------------------|
      | Typical clinical cases               | Representative case mix     |
      | Edge cases (atypical presentations)  | Documented edge cases       |
      | Challenging cases (high difficulty)  | High-complexity cases       |
      | Comorbidities                        | Common comorbidity combinations |
      | Clinical workflow variations         | Different use environments  |
    And test scenarios MUST be validated by clinical experts
    And test coverage MUST be documented

  Scenario: Evaluate performance across subgroups
    Given test dataset with demographic/clinical diversity
    When evaluating performance
    Then analysis MUST include:
      | Subgroup                             | Metrics                     |
      |--------------------------------------|----------------------------|
      | Age groups                           | Sensitivity, specificity by age |
      | Sex/gender                           | Performance by sex          |
      | Race/ethnicity                       | Performance by race         |
      | Disease severity                     | Performance by severity     |
    And statistically significant differences MUST be investigated
```

**Key Controls:**
- Clinical test scenario matrix
- Clinical expert validation of scenarios
- Subgroup performance evaluation
- Edge case and failure mode catalog

**Metrics:**
- Test scenario coverage (% of clinical conditions)
- Performance by subgroup (sensitivity, specificity, etc.)
- Performance on edge cases
- Performance variance across subgroups

---

### 2. Failure Mode Testing

#### Acceptance Criteria
```gherkin
Feature: Failure Mode Testing

  Scenario: Identify and test failure modes
    Given AI/ML device
    When analyzing failure modes
    Then testing MUST evaluate:
      | Failure Mode                         | Test Method                 |
      |--------------------------------------|----------------------------|
      | Input data quality issues            | Degraded input testing      |
      | Out-of-distribution inputs           | OOD detection testing       |
      | Adversarial inputs                   | Adversarial robustness testing |
      | Model uncertainty extremes           | High-uncertainty case testing |
    And failure modes MUST be documented
    And mitigation strategies MUST be defined
    And failure mode performance MUST be acceptable

  Scenario: Validate graceful degradation
    Given failure scenarios
    When system encounters failures
    Then system MUST:
      | Requirement                          | Validation                  |
      |--------------------------------------|----------------------------|
      | Detect failure condition             | Detection rate ≥ 95%        |
      | Alert clinician                      | Alert generated             |
      | Provide fallback option              | Manual workflow available   |
      | Log failure for analysis             | Audit log entry             |
    And graceful degradation MUST be validated
```

**Key Controls:**
- Failure mode and effects analysis (FMEA)
- Failure mode test cases
- Graceful degradation validation
- Failure detection and alerting system

**Metrics:**
- Failure detection rate (%)
- False alarm rate (%)
- Graceful degradation success rate (%)

---

## Implementation Guidelines

```yaml
clinically_relevant_testing:
  test_scenarios:
    typical_cases: 70%
    edge_cases: 20%
    failure_modes: 10%
  
  subgroup_evaluation:
    - subgroup: "Age 18-40"
      sensitivity: 0.90
      specificity: 0.88
    - subgroup: "Age 41-60"
      sensitivity: 0.92
      specificity: 0.89
    - subgroup: "Age 61-80"
      sensitivity: 0.91
      specificity: 0.87
  
  failure_mode_testing:
    - failure: "Low image quality"
      detection_rate: 0.96
      mitigation: "Image quality check, reject if below threshold"
    - failure: "Out-of-distribution input"
      detection_rate: 0.92
      mitigation: "OOD detector, alert clinician"
```

---

## Integration Points

- **COMP-FDA-ML-005:** Clinical validation includes clinically relevant testing
- **COMP-IEC62304-008:** System testing complements GMLP testing

---

## Audit Evidence

1. [ ] Clinical test scenario matrix
2. [ ] Subgroup performance evaluation
3. [ ] Failure mode and effects analysis (FMEA)
4. [ ] Failure mode test results
5. [ ] Graceful degradation validation

---

## References

- FDA, Health Canada, MHRA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |
