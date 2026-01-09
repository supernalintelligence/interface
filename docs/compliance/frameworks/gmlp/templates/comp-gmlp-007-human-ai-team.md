---
id: COMP-GMLP-007
framework: GMLP
category: Clinical Validation
title: Human-AI Team Performance Evaluation
description: Evaluate performance of the human-AI team, not AI alone, in realistic clinical workflows
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-FDA-ML-005
  - COMP-FDA-ML-007
  - COMP-GMLP-008
tags:
  - gmlp
  - human-ai-interaction
  - clinical-validation
  - medical-devices
  - usability
priority: critical
---

# COMP-GMLP-007: Human-AI Team Performance Evaluation

## Overview

**GMLP Principle 7:** "Focus is placed on the performance of the human-AI team."

Defines requirements for evaluating the combined performance of clinicians and AI working together, not AI in isolation. Human-AI team performance is the true measure of clinical effectiveness.

**Regulatory Context:** FDA GMLP Principles, FDA Human Factors Guidance

---

## Human-AI Team Requirements

### 1. Human-AI Interaction Design

#### Acceptance Criteria
```gherkin
Feature: Human-AI Interaction Design

  Scenario: Design for clinical workflow integration
    Given intended clinical use
    When designing human-AI interaction
    Then design MUST address:
      | Design Element                       | Requirement                 |
      |--------------------------------------|----------------------------|
      | AI output presentation               | Clinically interpretable    |
      | Clinician decision support           | Actionable recommendations  |
      | Override capability                  | Clinician can override AI   |
      | Explanation/rationale                | AI reasoning provided       |
      | Uncertainty communication            | Confidence/uncertainty clear |
    And usability testing MUST be conducted with clinical users
    And workflow integration MUST be validated

  Scenario: Evaluate human-AI team performance
    Given clinical validation study
    When measuring performance
    Then evaluation MUST include:
      | Metric                               | Measurement                 |
      |--------------------------------------|----------------------------|
      | Human-AI team accuracy               | Combined diagnostic accuracy |
      | Time to decision                     | Decision time with AI       |
      | Clinician trust/reliance             | Survey, override rate       |
      | User satisfaction                    | Usability score             |
    And comparator MUST be clinician performance without AI
    And improvement over standard of care MUST be demonstrated
```

**Key Controls:**
- Human-AI interaction design document
- Usability testing protocol and results
- Human-AI team performance study
- Comparator study (clinician alone vs. clinician + AI)

**Metrics:**
- Human-AI team accuracy vs. clinician alone
- Decision time (with AI vs. without)
- Override rate (%)
- User satisfaction score (SUS, NASA-TLX)

---

### 2. Usability and Human Factors

#### Acceptance Criteria
```gherkin
Feature: Usability Validation

  Scenario: Conduct usability testing
    Given AI-assisted clinical workflow
    When conducting usability testing
    Then testing MUST evaluate:
      | Usability Factor                     | Method                      |
      |--------------------------------------|----------------------------|
      | Ease of use                          | SUS questionnaire           |
      | Cognitive workload                   | NASA-TLX                    |
      | Error prevention                     | Use error analysis          |
      | Learnability                         | Time to proficiency         |
    And representative clinical users MUST participate
    And usability issues MUST be addressed before deployment
```

**Key Controls:**
- Usability testing protocol
- Representative clinical user recruitment
- Usability issue tracking and resolution
- Human factors validation report

**Metrics:**
- System Usability Scale (SUS) score (target ≥ 68)
- NASA Task Load Index (NASA-TLX) score
- Use errors per session
- Time to proficiency (hours)

---

## Implementation Guidelines

```yaml
human_ai_team_evaluation:
  interaction_design:
    output_presentation: "Risk score + confidence interval + explanation"
    clinician_workflow: "Review AI recommendation → Confirm/Override → Document decision"
    override_capability: "Clinician can always override"
    explanation: "SHAP values + attention heatmap"
  
  performance_study:
    design: "Randomized controlled trial"
    comparator: "Clinician alone (standard of care)"
    intervention: "Clinician + AI"
    primary_endpoint: "Diagnostic accuracy"
    secondary_endpoints: ["Decision time", "User satisfaction"]
    participants: 30 clinicians
  
  usability_testing:
    method: "Think-aloud protocol + SUS questionnaire"
    participants: 15 representative clinicians
    tasks: ["Review case with AI", "Override AI", "Document decision"]
    metrics:
      sus_score: 72  # Target ≥ 68
      nasa_tlx: 35  # Lower is better
      use_errors: 0.5 per session
```

---

## Integration Points

- **COMP-FDA-ML-005:** Clinical validation includes human-AI team performance
- **COMP-FDA-ML-007:** Model transparency supports human-AI interaction

---

## Audit Evidence

1. [ ] Human-AI interaction design document
2. [ ] Usability testing protocol and results
3. [ ] Human-AI team performance study
4. [ ] Comparator study results
5. [ ] Human factors validation report

---

## References

- FDA, Health Canada, MHRA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
- FDA (2016). "Applying Human Factors and Usability Engineering to Medical Devices"

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |
