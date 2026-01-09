---
id: COMP-GMLP-006
framework: GMLP
category: Model Development
title: Model Design Alignment with Data and Use
description: Ensure model design is tailored to available data and reflects intended clinical use
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-GMLP-003
  - COMP-GMLP-004
  - COMP-FDA-ML-002
  - COMP-EN18031-016
tags:
  - gmlp
  - model-design
  - model-selection
  - medical-devices
priority: high
---

# COMP-GMLP-006: Model Design Alignment with Data and Use

## Overview

**GMLP Principle 6:** "Model design is tailored to the available data and reflects the intended use of the device."

Defines requirements for aligning model architecture and complexity with available data and clinical use case. Model design must balance performance, interpretability, and clinical applicability.

**Regulatory Context:** FDA GMLP Principles

---

## Model Design Requirements

### 1. Model Selection Rationale

####Acceptance Criteria
```gherkin
Feature: Model Selection Justification

  Scenario: Document model architecture selection
    Given clinical objective and available data
    When selecting model architecture
    Then rationale MUST address:
      | Consideration                        | Documentation Requirement   |
      |--------------------------------------|----------------------------|
      | Clinical task requirements           | Task-model alignment        |
      | Data characteristics (size, type)    | Data-model fit analysis     |
      | Interpretability requirements        | Explainability needs        |
      | Computational constraints            | Resource requirements       |
      | Prior art and benchmarks             | Literature review           |
    And alternative models MUST be considered
    And selection rationale MUST be documented
    And multi-disciplinary team MUST approve

  Scenario: Validate model complexity matches data
    Given training dataset size
    When assessing model complexity
    Then validation MUST ensure:
      | Check                                | Acceptance Criteria         |
      |--------------------------------------|----------------------------|
      | Sufficient data for model complexity | Sample-to-parameter ratio adequate |
      | Overfitting risk assessment          | Validation curve analysis   |
      | Regularization strategy              | Overfitting mitigation      |
    And complexity justification MUST be documented
```

**Key Controls:**
- Model selection rationale document
- Alternative model comparison
- Complexity-data alignment analysis
- Multi-disciplinary approval

**Metrics:**
- Sample-to-parameter ratio
- Overfitting risk score
- Model complexity (parameters, depth)

---

### 2. Clinical Use Alignment

#### Acceptance Criteria
```gherkin
Feature: Clinical Use Alignment

  Scenario: Model outputs match clinical needs
    Given intended clinical use
    When designing model outputs
    Then outputs MUST provide:
      | Clinical Need                        | Model Output Design         |
      |--------------------------------------|----------------------------|
      | Risk stratification                  | Calibrated probabilities    |
      | Diagnostic classification            | Class predictions with confidence |
      | Treatment recommendation             | Ranked options with rationale |
    And output format MUST be clinically interpretable
    And uncertainty quantification MUST be provided
    And clinical experts MUST validate output utility
```

**Key Controls:**
- Clinical use-output alignment document
- Output format specification
- Clinical expert validation of outputs

**Metrics:**
- Output interpretability score (clinical user feedback)
- Uncertainty calibration (ECE, MCE)

---

## Implementation Guidelines

```yaml
model_design:
  clinical_task: "Diagnostic classification"
  data_characteristics:
    size: 10000
    type: "Medical images (224x224 RGB)"
    quality: "High quality, annotated by experts"
  
  model_selection:
    chosen_model: "ResNet-50 (pretrained, fine-tuned)"
    rationale: "Proven architecture for image classification, sufficient data for fine-tuning, balance of performance and interpretability"
    alternatives_considered:
      - model: "Inception-v3"
        reason_not_selected: "Higher complexity, similar performance"
      - model: "Logistic regression on hand-crafted features"
        reason_not_selected: "Lower performance, insufficient feature engineering capacity"
    complexity_justification: "10M parameters, 10K samples, ratio 1:1000 acceptable with transfer learning"
  
  clinical_alignment:
    output_format: "Probability score [0,1] with 95% confidence interval"
    interpretability: "Grad-CAM heatmaps for visual explanation"
    uncertainty_quantification: "Monte Carlo dropout for prediction intervals"
```

---

## Integration Points

- **COMP-FDA-ML-002:** Clinical objectives drive model design
- **COMP-GMLP-003:** Data characteristics inform model selection

---

## Audit Evidence

1. [ ] Model selection rationale document
2. [ ] Alternative model comparison
3. [ ] Complexity-data alignment analysis
4. [ ] Clinical expert validation of outputs

---

## References

- FDA, Health Canada, MHRA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |
