---
id: comp-fda-ml-001-good-machine-learning-practice
title: COMP-FDA-ML-001 - Good Machine Learning Practice (GMLP)
sidebar_label: COMP-FDA-ML-001
sidebar_position: 1
status: pending-verification
references: []
---

# COMP-FDA-ML-001: Good Machine Learning Practice (GMLP)

## Overview

**Purpose**: Establish Good Machine Learning Practice principles for ML-enabled medical devices  
**FDA Guidance**: AI/ML-Based Software as a Medical Device (SaMD) Action Plan (January 2021)  
**Category**: gmlp, ml-development  
**Priority**: CRITICAL  
**Framework**: FDA + GMLP Consortium (Nature npj Digital Medicine, 2021)

## Description

Good Machine Learning Practice (GMLP) provides a framework for developing safe, effective, and high-quality ML-enabled medical devices. GMLP was developed by a consortium of 10+ organizations including FDA, academic institutions, and industry leaders (Philips, GE Healthcare, Siemens) to address unique challenges in ML medical device development.

GMLP establishes 10 guiding principles covering the complete ML lifecycle: from clinical objective definition through data collection, model development, validation, deployment, and post-market monitoring. These principles ensure ML models are developed with appropriate rigor, validated for clinical use, and monitored for performance degradation.

## Regulatory Context

### FDA Requirements
- **Discussion Paper**: "Good Machine Learning Practice for Medical Device Development" (October 2021)
- **AI/ML Action Plan**: Total Product Lifecycle (TPLC) approach
- **Guidance**: Clinical Decision Support Software
- **510(k)**: Premarket submissions must demonstrate GMLP adherence

### GMLP Consortium
- **Publication**: Nature npj Digital Medicine (2021)
- **Authors**: FDA, MIT, Philips, GE Healthcare, Siemens, Google Health
- **Scope**: 10 guiding principles for ML in healthcare

## Acceptance Criteria

```gherkin
Feature: Good Machine Learning Practice (GMLP)
  As an ML Engineer developing medical device software
  I want to follow GMLP principles
  So that I can develop safe and effective ML-enabled medical devices

  Background:
    Given ML-enabled medical device is under development
    And FDA premarket submission is planned
    And GMLP compliance is required
    And 10 GMLP principles have been established

  Scenario: P1 - Clinical Objective Definition
    Given ML model will be used in clinical setting
    When clinical objective is defined
    Then intended use shall be clearly specified
    And target condition shall be identified
    And target population shall be defined (age, demographics)
    And clinical benefit shall be articulated
    And contraindications shall be documented
    And clinical workflow integration shall be described
    
  Scenario: P2 - Data Quality (ALCOA+)
    Given training data is collected for ML model
    When data quality is assessed
    Then data shall be Attributable (source documented)
    And data shall be Legible (clear, standardized)
    And data shall be Contemporaneous (collected at event time)
    And data shall be Original (primary data)
    And data shall be Accurate (validated by experts)
    And data shall be Complete (no critical missing fields)
    And data shall be Consistent (standardized across sites)
    And data shall be Enduring (durable storage)
    And data shall be Available (accessible for audit)
    
  Scenario: P3 - Dataset Relevance to Deployment
    Given ML model is trained on clinical dataset
    When dataset relevance is assessed
    Then demographic distribution shall match target population
    And disease prevalence shall match deployment setting
    And clinical workflows shall match deployment context
    And equipment/imaging shall match deployment hardware
    And dataset biases shall be identified and documented
    
  Scenario: P7 - Clinical Performance Evaluation
    Given ML model is validated
    When clinical performance is evaluated
    Then sensitivity shall meet clinical threshold (e.g., ≥95% for screening)
    And specificity shall minimize false positives
    And positive predictive value (PPV) shall be calculated
    And negative predictive value (NPV) shall be calculated
    And subgroup performance shall be evaluated (age, sex, race)
    And clinical utility vs standard of care shall be demonstrated
    
  Scenario: P8 - Clinical Validation Studies
    Given ML model passes technical validation
    When clinical validation is performed
    Then prospective clinical study shall be conducted
    And study shall be at representative clinical sites (≥3 sites)
    And clinicians shall use model in real workflow
    And clinical outcomes shall be measured
    And adverse events shall be tracked
    And study shall be IRB-approved
    
  Scenario: P10 - Real-World Performance Monitoring
    Given ML model is deployed to clinical use
    When post-market monitoring is active
    Then clinical performance metrics shall be tracked
    And subgroup performance shall be monitored
    And adverse events shall be reported to FDA
    And user feedback shall be collected
    And retraining triggers shall be defined
    And FDA shall be notified of significant performance changes
```

## Technical Implementation

### 10 GMLP Principles Implementation

```yaml
gmlp_principles:
  p1_clinical_objective:
    requirement: "Define clear clinical objective and intended use"
    implementation:
      - clinical_indication: "Specific condition/disease"
      - target_population: "Age, demographics, clinical characteristics"
      - clinical_benefit: "Measurable improvement vs standard of care"
      - contraindications: "Populations/conditions where not applicable"
    documentation: "Clinical Evaluation Plan, Intended Use Statement"
    
  p2_data_quality:
    requirement: "Ensure high-quality, representative training data"
    implementation:
      - data_collection: "Standardized protocols, multiple sites"
      - data_annotation: "Expert review, inter-rater reliability"
      - data_validation: "Quality checks, outlier detection"
      - data_provenance: "Source tracking, audit trail"
    documentation: "Data Management Plan, Data Quality Report"
    
  p3_dataset_relevance:
    requirement: "Training data matches deployment population"
    implementation:
      - demographic_matching: "Age, sex, race distribution"
      - prevalence_matching: "Disease rates similar to deployment"
      - equipment_matching: "Same imaging devices, protocols"
      - workflow_matching: "Clinical context similarity"
    documentation: "Dataset Characterization Report"
    
  p4_feature_engineering:
    requirement: "Select clinically relevant, robust features"
    implementation:
      - clinical_relevance: "Features align with clinical knowledge"
      - robustness: "Features stable across sites, equipment"
      - explainability: "Features interpretable by clinicians"
    documentation: "Feature Engineering Report"
    
  p5_model_selection:
    requirement: "Choose appropriate ML algorithm"
    implementation:
      - algorithm_justification: "Why this algorithm for this task"
      - complexity_appropriateness: "Model complexity vs data size"
      - interpretability_consideration: "Explainability requirements"
    documentation: "Model Selection Rationale"
    
  p6_training_strategy:
    requirement: "Use appropriate training procedures"
    implementation:
      - train_val_test_split: "Proper data splitting, no leakage"
      - hyperparameter_tuning: "Systematic optimization"
      - overfitting_prevention: "Regularization, early stopping"
      - cross_validation: "K-fold or similar"
    documentation: "Training Procedure Document"
    
  p7_performance_evaluation:
    requirement: "Evaluate using clinically relevant metrics"
    implementation:
      - clinical_metrics: "Sensitivity, specificity, PPV, NPV"
      - subgroup_analysis: "Performance across demographics"
      - confidence_intervals: "Statistical uncertainty"
      - clinical_utility: "Impact on clinical decisions"
    documentation: "Performance Evaluation Report"
    
  p8_clinical_validation:
    requirement: "Demonstrate clinical utility in real setting"
    implementation:
      - prospective_study: "Real-world clinical use"
      - multi_site: "Representative sites (≥3)"
      - clinical_outcomes: "Patient outcomes, not just model metrics"
      - irb_approval: "Ethics review"
    documentation: "Clinical Validation Study Report"
    
  p9_interpretability:
    requirement: "Provide model explainability for clinicians"
    implementation:
      - feature_importance: "SHAP, LIME, attention maps"
      - decision_transparency: "Why model made this prediction"
      - uncertainty_quantification: "Confidence scores, prediction intervals"
    documentation: "Interpretability Report"
    
  p10_monitoring:
    requirement: "Monitor real-world performance"
    implementation:
      - performance_tracking: "Sensitivity, specificity over time"
      - drift_detection: "Data distribution changes"
      - adverse_event_reporting: "FDA reporting (MedWatch)"
      - retraining_triggers: "Performance thresholds"
    documentation: "Post-Market Surveillance Plan"
```

## Validation Strategy

```yaml
gmlp_compliance_verification:
  p1_clinical_objective_check:
    - [ ] Intended use clearly documented
    - [ ] Target population defined
    - [ ] Clinical benefit articulated
    
  p2_data_quality_check:
    - [ ] ALCOA+ criteria met
    - [ ] Data quality metrics documented
    - [ ] Data provenance tracked
    
  p7_clinical_performance_check:
    - [ ] Clinically relevant metrics (not just accuracy)
    - [ ] Subgroup analysis performed
    - [ ] Clinical utility demonstrated
    
  p8_clinical_validation_check:
    - [ ] Prospective study conducted
    - [ ] Multi-site validation
    - [ ] Clinical outcomes measured
    
  p10_monitoring_check:
    - [ ] Post-market surveillance plan exists
    - [ ] Performance monitoring active
    - [ ] Adverse event reporting process established
```

## Evidence Requirements

- **P1**: Clinical Evaluation Plan, Intended Use Statement
- **P2**: Data Management Plan, Data Quality Report
- **P3**: Dataset Characterization Report
- **P7**: Performance Evaluation Report with clinical metrics
- **P8**: Clinical Validation Study Report (IRB-approved)
- **P10**: Post-Market Surveillance Plan, Performance Monitoring Reports

## Related Controls

- **COMP-GMLP-001 through 010**: Individual GMLP principles
- **COMP-FDA-ML-002**: Data Quality Assurance
- **COMP-FDA-ML-008**: Clinical Validation Studies
- **COMP-IEC62304-013**: ML Model as Software Item

---

**Last Updated**: 2025-12-13  
**Maintained by**: Supernal Coding Compliance Team

