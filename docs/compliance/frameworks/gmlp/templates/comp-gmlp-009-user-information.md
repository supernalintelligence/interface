---
id: COMP-GMLP-009
framework: GMLP
category: Transparency & Labeling
title: User Information and Transparency
description: Provide clear, essential information to enable informed clinical decision-making
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-FDA-ML-007
  - COMP-GMLP-007
  - COMP-EN18031-006
tags:
  - gmlp
  - transparency
  - labeling
  - medical-devices
  - user-information
priority: high
---

# COMP-GMLP-009: User Information and Transparency

## Overview

**GMLP Principle 9:** "Users are provided clear, essential information."

Defines requirements for providing transparent, clinically relevant information to users (clinicians, patients) to enable informed decision-making. Transparency is essential for appropriate use and clinical trust.

**Regulatory Context:** FDA GMLP Principles, FDA Labeling Guidance

---

## User Information Requirements

### 1. Device Labeling

#### Acceptance Criteria
```gherkin
Feature: Comprehensive Device Labeling

  Scenario: Provide essential device information in labeling
    Given AI/ML medical device
    When creating device labeling
    Then labeling MUST include:
      | Information Type                     | Content Requirement         |
      |--------------------------------------|----------------------------|
      | Intended use and indications         | Clear clinical use statement |
      | Target population                    | Patient population specification |
      | Performance metrics                  | Sensitivity, specificity, etc. (with CI) |
      | Limitations and contraindications    | Explicit limitations        |
      | Failure modes and error rates        | Known failure modes         |
      | Training data characteristics        | Dataset description         |
      | Model version and update history     | Version information         |
    And labeling MUST be reviewed by regulatory affairs
    And labeling MUST be validated with clinical users

  Scenario: Document model limitations
    Given AI/ML model
    When documenting limitations
    Then documentation MUST include:
      | Limitation Type                      | Example                     |
      |--------------------------------------|----------------------------|
      | Population limitations               | "Not validated in pediatric patients" |
      | Clinical setting limitations         | "Validated for hospital inpatient use only" |
      | Input data limitations               | "Requires high-quality images" |
      | Performance limitations              | "Sensitivity 92% (95% CI: 0.89-0.95)" |
    And limitations MUST be clinically accurate
```

**Key Controls:**
- Device labeling document
- Regulatory affairs review
- Clinical user validation of labeling
- Labeling update procedures

**Metrics:**
- Labeling completeness score
- Clinical user comprehension rate (%)
- Labeling update frequency

---

### 2. Model Transparency

#### Acceptance Criteria
```gherkin
Feature: Model Transparency for Clinical Users

  Scenario: Provide model explanation
    Given model predictions
    When presenting to clinicians
    Then explanation MUST include:
      | Explanation Type                     | Method                      |
      |--------------------------------------|----------------------------|
      | Feature importance (global)          | SHAP, feature importance    |
      | Prediction rationale (local)         | SHAP, attention, Grad-CAM   |
      | Confidence/uncertainty               | Calibrated probabilities    |
    And explanations MUST be clinically interpretable
    And explanations MUST be validated with clinical users

  Scenario: Communicate model updates
    Given model update
    When deploying update
    Then communication MUST include:
      | Information                          | Requirement                 |
      |--------------------------------------|----------------------------|
      | Update rationale                     | Why update needed           |
      | Performance changes                  | Before/after metrics        |
      | Clinical impact                      | Expected clinical effect    |
      | User actions required                | Workflow changes            |
    And users MUST be notified before deployment
```

**Key Controls:**
- Explainability methods (SHAP, LIME, etc.)
- Clinical user validation of explanations
- Model update communication plan
- User training materials

**Metrics:**
- Explanation accuracy (faithfulness)
- Clinical user satisfaction with explanations (%)
- Model update communication timeliness

---

## Implementation Guidelines

```yaml
user_information:
  labeling:
    intended_use: "Diagnostic support for condition X in hospital inpatient setting"
    target_population: "Adults age 18-80 with suspected condition X"
    performance: "Sensitivity: 92% (95% CI: 0.89-0.95), Specificity: 88% (95% CI: 0.85-0.91)"
    limitations:
      - "Not validated in pediatric population (age < 18)"
      - "Requires high-quality input data (specified quality criteria)"
    training_data: "10,000 samples from 5 hospitals, 2018-2022"
    model_version: "v2.1 (released 2025-01-15)"
  
  transparency:
    explanation_method: "SHAP values + attention heatmap"
    confidence_display: "Probability + 95% confidence interval"
    uncertainty_threshold: "Alert if prediction uncertainty > 0.3"
  
  model_updates:
    communication_plan: "Email notification 14 days before deployment"
    training_materials: "Online training module + user guide"
```

---

## Integration Points

- **COMP-FDA-ML-007:** Model transparency supports user information
- **COMP-GMLP-007:** User information enables effective human-AI teamwork

---

## Audit Evidence

1. [ ] Device labeling document
2. [ ] Regulatory affairs review
3. [ ] Clinical user validation of labeling
4. [ ] Explainability implementation
5. [ ] Model update communication records

---

## References

- FDA, Health Canada, MHRA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
- FDA (2014). "Labeling for Medical Devices: Guidance for Industry and FDA Staff"

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |
