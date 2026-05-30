---
id: COMP-GMLP-004
framework: GMLP
category: Data Management
title: Training and Test Set Independence
description: Ensure strict independence between training and test datasets to prevent data leakage and overfitting
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-GMLP-003
  - COMP-FDA-ML-004
  - COMP-FDA-ML-005
  - COMP-EN18031-014
tags:
  - gmlp
  - data-independence
  - data-leakage
  - medical-devices
  - validation
priority: critical
---

# COMP-GMLP-004: Training and Test Set Independence

## Overview

**GMLP Principle 4:** "Training data sets are independent of test sets."

Defines requirements for maintaining strict independence between training, validation, and test datasets to ensure unbiased performance evaluation and prevent data leakage. Data independence is fundamental to valid clinical validation.

**Regulatory Context:** FDA GMLP Principles, FDA AI/ML SaMD Action Plan

---

## Data Independence Requirements

### 1. Dataset Segregation

#### Acceptance Criteria
```gherkin
Feature: Dataset Segregation

  Scenario: Establish independent dataset splits
    Given a complete dataset for model development
    When splitting data
    Then datasets MUST be:
      | Dataset Type                         | Purpose                     | Independence Requirement    |
      |--------------------------------------|----------------------------|-----------------------------|
      | Training set                         | Model training              | Never used for evaluation   |
      | Validation set                       | Hyperparameter tuning, model selection | Independent of training, never used for final evaluation |
      | Test set                             | Final performance evaluation | Completely independent, never used in development |
    And test set MUST be locked before model development
    And test set MUST never be used for training or validation
    And data splits MUST be documented and version-controlled

  Scenario: Prevent patient-level data leakage
    Given datasets with patient data
    When splitting data
    Then patient-level independence MUST ensure:
      | Leakage Type                         | Prevention Method           |
      |--------------------------------------|----------------------------|
      | Same patient in multiple sets        | Patient-level split (not sample-level) |
      | Related patients (family members)    | Family-level split (if applicable) |
      | Temporal leakage (longitudinal data) | Temporal split strategy     |
      | Site-level leakage                   | Site-stratified split (if multi-site) |
    And split strategy MUST be documented
    And split validation MUST confirm no patient overlap
```

**Key Controls:**
- Data split plan with rationale
- Patient-level split validation
- Test set lockdown procedure
- Data split audit trail

**Metrics:**
- Train/validation/test split ratio (e.g., 70/15/15)
- Patient overlap count (must be 0)
- Test set usage audit (must never be used in training)

---

### 2. Data Leakage Prevention

#### Acceptance Criteria
```gherkin
Feature: Data Leakage Prevention

  Scenario: Identify and prevent common data leakage patterns
    Given model development activities
    When implementing leakage prevention
    Then controls MUST address:
      | Leakage Type                         | Prevention Method           | Validation                  |
      |--------------------------------------|----------------------------|-----------------------------|
      | Feature leakage (target in features) | Feature review, temporal ordering | Feature engineering review  |
      | Preprocessing leakage                | Fit preprocessing on training only | Pipeline validation         |
      | Temporal leakage                     | Temporal ordering, temporal split | Temporal validation         |
      | Test set contamination               | Test set access control     | Access audit logs           |
    And leakage risks MUST be documented in risk analysis
    And leakage detection checks MUST be automated

  Scenario: Validate preprocessing independence
    Given data preprocessing pipelines
    When applying preprocessing
    Then the process MUST ensure:
      | Preprocessing Step                   | Independence Requirement    |
      |--------------------------------------|----------------------------|
      | Normalization/scaling                | Fit on training only, transform train/val/test |
      | Imputation                           | Learn strategy from training only |
      | Feature selection                    | Select features using training only |
      | Data augmentation                    | Apply to training only      |
    And preprocessing pipeline MUST be saved and versioned
    And same preprocessing MUST be applied at inference
```

**Key Controls:**
- Data leakage risk assessment
- Preprocessing pipeline implementation (sklearn Pipeline, etc.)
- Test set access controls
- Automated leakage detection tests

**Metrics:**
- Number of leakage risks identified
- Leakage prevention controls implemented
- Test set access violations (must be 0)
- Preprocessing pipeline validation pass rate

---

### 3. Test Set Management

#### Acceptance Criteria
```gherkin
Feature: Test Set Management

  Scenario: Lock test set before model development
    Given a complete dataset
    When initiating model development
    Then test set MUST be:
      | Requirement                          | Implementation              |
      |--------------------------------------|----------------------------|
      | Segregated before model development  | Test set split documented with timestamp |
      | Access-controlled                    | Limited to authorized personnel |
      | Never used in model training or tuning | Usage audit trail           |
      | Held out for final validation        | Final evaluation only       |
    And test set lockdown MUST be documented
    And test set access MUST be logged
    And unauthorized access MUST trigger alerts

  Scenario: Conduct final test set evaluation
    Given a finalized model
    When evaluating on test set
    Then evaluation MUST follow:
      | Requirement                          | Validation                  |
      |--------------------------------------|----------------------------|
      | Test set used exactly once           | Audit log confirms single use |
      | No model changes after test evaluation | Version control confirms no changes |
      | Results documented in validation report | Validation report complete  |
      | Performance meets pre-specified criteria | Acceptance criteria met     |
    And test results MUST be reported without cherry-picking
    And unexpected poor performance MUST trigger investigation
```

**Key Controls:**
- Test set lockdown procedure
- Test set access control (role-based)
- Test set usage audit logs
- Pre-specified acceptance criteria

**Metrics:**
- Test set lockdown timestamp
- Number of test set accesses (by user, timestamp)
- Test set evaluation count (must be 1)
- Performance vs. pre-specified criteria

---

## Implementation Guidelines

### Data Split Strategy

```yaml
data_independence_plan:
  dataset:
    total_samples: 10000
    total_patients: 8500  # Some patients have multiple samples
  
  split_strategy:
    method: "Patient-level stratified split"
    rationale: "Prevent patient-level leakage, maintain class distribution"
    split_ratio:
      training: 0.70  # 7000 samples, ~5950 patients
      validation: 0.15  # 1500 samples, ~1275 patients
      test: 0.15  # 1500 samples, ~1275 patients
    stratification: "Disease severity"
  
  test_set_lockdown:
    lockdown_date: "2025-01-15"
    access_control: "Data science lead only"
    usage_policy: "Final evaluation only, single use"
    audit_logging: "All access logged to audit trail"
  
  leakage_prevention:
    - type: "Patient-level leakage"
      prevention: "Patient IDs used for split, validation confirms 0 overlap"
    - type: "Preprocessing leakage"
      prevention: "sklearn Pipeline, fit on training only"
    - type: "Temporal leakage"
      prevention: "Temporal split (training: 2018-2020, val: 2021, test: 2022)"
    - type: "Feature leakage"
      prevention: "Feature engineering review, no target in features"
  
  validation:
    patient_overlap_check: "PASS (0 overlapping patients)"
    preprocessing_independence_check: "PASS (pipeline validated)"
    test_set_access_audit: "PASS (single use on final evaluation)"
```

### Example: Data Split Code

```python
from sklearn.model_selection import train_test_split

# Patient-level split to prevent leakage
unique_patients = df['patient_id'].unique()

# Split patients (not samples)
train_patients, temp_patients = train_test_split(
    unique_patients, test_size=0.30, random_state=42, stratify=patient_severity
)
val_patients, test_patients = train_test_split(
    temp_patients, test_size=0.50, random_state=42, stratify=temp_severity
)

# Create datasets
train_df = df[df['patient_id'].isin(train_patients)]
val_df = df[df['patient_id'].isin(val_patients)]
test_df = df[df['patient_id'].isin(test_patients)]

# Validate no patient overlap
assert set(train_patients).isdisjoint(val_patients)
assert set(train_patients).isdisjoint(test_patients)
assert set(val_patients).isdisjoint(test_patients)

# Lock test set (save and restrict access)
test_df.to_csv('test_set_LOCKED_2025-01-15.csv')
# Document in version control with commit message
```

---

## Integration Points

- **COMP-GMLP-003:** Representative datasets are split independently
- **COMP-FDA-ML-005:** Clinical validation uses independent test set
- **COMP-EN18031-014:** Data versioning supports reproducible splits

---

## Audit Evidence

1. **Dataset Segregation:**
   - [ ] Data split plan with rationale
   - [ ] Patient-level split validation (0 overlap)
   - [ ] Test set lockdown documentation
   - [ ] Data split version control

2. **Leakage Prevention:**
   - [ ] Data leakage risk assessment
   - [ ] Preprocessing pipeline implementation
   - [ ] Leakage detection test results
   - [ ] Test set access control configuration

3. **Test Set Management:**
   - [ ] Test set lockdown timestamp
   - [ ] Test set access audit logs
   - [ ] Test set usage documentation (single use)
   - [ ] Final validation report

---

## References

- FDA, Health Canada, MHRA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
- FDA (2021). "Artificial Intelligence/Machine Learning (AI/ML)-Based Software as a Medical Device (SaMD) Action Plan"
- Kohavi, R. (1995). "A Study of Cross-Validation and Bootstrap for Accuracy Estimation and Model Selection"

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |

---

## Notes

- **Status:** Pending verification with authoritative sources
- **Priority:** CRITICAL - Data independence is non-negotiable for valid evaluation
- **Implementation Note:** Test set must be locked before any model development begins



