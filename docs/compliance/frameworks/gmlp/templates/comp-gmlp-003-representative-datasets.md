---
id: COMP-GMLP-003
framework: GMLP
category: Data Quality
title: Representative Clinical Datasets
description: Ensure clinical study participants and datasets are representative of the intended patient population
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-FDA-ML-002
  - COMP-FDA-ML-004
  - COMP-EN18031-009
  - COMP-EN18031-010
tags:
  - gmlp
  - data-quality
  - representativeness
  - medical-devices
  - bias-mitigation
priority: critical
---

# COMP-GMLP-003: Representative Clinical Datasets

## Overview

**GMLP Principle 3:** "Clinical study participants and data sets are representative of the intended patient population."

Defines requirements for ensuring training, validation, and test datasets accurately represent the target patient population, clinical conditions, and use environment. Representative datasets are critical to model fairness, generalizability, and safety.

**Regulatory Context:** FDA GMLP Principles, FDA AI/ML SaMD Action Plan

---

## Dataset Representativeness Requirements

### 1. Demographic Representativeness

#### Acceptance Criteria
```gherkin
Feature: Demographic Representativeness

  Scenario: Dataset demographics match target population
    Given a target patient population definition
    When evaluating training dataset demographics
    Then the dataset MUST be representative across:
      | Demographic Factor                   | Assessment Method           | Acceptance Criteria         |
      |--------------------------------------|----------------------------|-----------------------------|
      | Age distribution                     | Statistical comparison      | KS test p > 0.05 OR documented justification |
      | Sex/gender distribution              | Chi-square test             | p > 0.05 OR documented justification |
      | Race/ethnicity distribution          | Chi-square test             | p > 0.05 OR documented justification |
      | Geographic diversity                 | Descriptive analysis        | Multiple regions represented |
    And representativeness assessment MUST be documented
    And gaps MUST be documented with mitigation plans
    And subgroup performance MUST be evaluated

  Scenario: Address demographic gaps
    Given demographic gaps in training data
    When gaps are identified
    Then the mitigation plan MUST include:
      | Gap Type                             | Mitigation Strategy         |
      |--------------------------------------|----------------------------|
      | Under-represented age group          | Targeted data collection OR labeling restriction |
      | Under-represented sex/gender         | Targeted data collection OR labeling restriction |
      | Under-represented race/ethnicity     | Targeted data collection OR labeling restriction |
      | Missing geographic region            | Document generalizability limits |
    And mitigation plan MUST be approved by multi-disciplinary team
    And limitations MUST be stated in device labeling
```

**Key Controls:**
- Target population specification (COMP-FDA-ML-002)
- Demographic representativeness analysis
- Statistical comparison tests
- Demographic gap mitigation plan
- Labeling of population limitations

**Metrics:**
- Demographic match score (target vs. training data)
- P-values for statistical tests (age, sex, race)
- Number of under-represented subgroups
- Subgroup sample sizes

---

### 2. Clinical Representativeness

#### Acceptance Criteria
```gherkin
Feature: Clinical Representativeness

  Scenario: Dataset reflects clinical variability
    Given an intended clinical use
    When evaluating clinical representativeness
    Then the dataset MUST include:
      | Clinical Factor                      | Representation Requirement  |
      |--------------------------------------|----------------------------|
      | Disease severity spectrum            | Mild, moderate, severe cases |
      | Common comorbidities                 | Prevalence-matched comorbidities |
      | Atypical presentations               | Edge cases and rare variants |
      | Clinical setting variability         | Inpatient, outpatient, emergency (as applicable) |
      | Treatment variability                | Standard treatments represented |
    And clinical representativeness MUST be validated by clinical experts
    And clinical variability MUST be documented
    And limitations MUST be stated in labeling

  Scenario: Validate clinical data quality
    Given clinical training data
    When assessing data quality
    Then the assessment MUST evaluate:
      | Quality Aspect                       | Method                      | Target                      |
      |--------------------------------------|----------------------------|-----------------------------|
      | Clinical annotation accuracy         | Clinical expert review      | Inter-rater reliability ≥ 0.75 (Kappa) |
      | Data completeness                    | Missing data analysis       | ≥ 95% completeness          |
      | Clinical relevance                   | Clinical expert validation  | Expert consensus approval   |
      | Ground truth validity                | Reference standard review   | High-quality reference standard |
    And data quality issues MUST be resolved
    And data quality report MUST be documented
```

**Key Controls:**
- Clinical representativeness analysis
- Clinical expert review of dataset composition
- Inter-rater reliability analysis (Kappa ≥ 0.75)
- Data completeness analysis (≥ 95%)
- Clinical Advisory Board review

**Metrics:**
- Disease severity distribution
- Comorbidity prevalence match
- Inter-rater reliability (Kappa)
- Data completeness rate (%)
- Clinical expert approval status

---

### 3. Bias Detection and Mitigation

#### Acceptance Criteria
```gherkin
Feature: Bias Detection and Mitigation

  Scenario: Detect dataset biases
    Given a training dataset
    When evaluating for biases
    Then bias assessment MUST evaluate:
      | Bias Type                            | Detection Method            |
      |--------------------------------------|----------------------------|
      | Selection bias                       | Enrollment analysis, source comparison |
      | Measurement bias                     | Data collection protocol review |
      | Label bias                           | Inter-rater reliability, annotation review |
      | Historical bias                      | Temporal trend analysis     |
      | Aggregation bias                     | Subgroup analysis           |
    And identified biases MUST be documented
    And mitigation strategies MUST be defined
    And residual biases MUST be stated in labeling

  Scenario: Mitigate identified biases
    Given identified dataset biases
    When implementing mitigation
    Then strategies MUST include:
      | Bias Type                            | Mitigation Strategy         |
      |--------------------------------------|----------------------------|
      | Under-representation                 | Targeted data collection, resampling, OR labeling restriction |
      | Label bias                           | Improved annotation guidelines, consensus labeling |
      | Historical bias                      | Temporal validation, dataset updates |
    And mitigation effectiveness MUST be validated
    And subgroup performance MUST be monitored post-deployment
```

**Key Controls:**
- Bias assessment report
- Bias mitigation plan
- Subgroup performance evaluation
- Post-market subgroup monitoring

**Metrics:**
- Number of identified biases (by type)
- Bias mitigation implementation rate
- Performance variance across subgroups (disparity metrics)
- Post-market subgroup performance trends

---

## Implementation Guidelines

### Dataset Representativeness Validation

```yaml
representativeness_assessment:
  target_population:
    age_range: "18-80 years"
    sex_distribution: "50% male, 50% female"
    race_ethnicity:
      white: 60%
      black: 15%
      hispanic: 15%
      asian: 8%
      other: 2%
    clinical_setting: "Hospital inpatient"
  
  training_dataset:
    total_samples: 10000
    demographics:
      age:
        mean: 55.2
        distribution: [...]
        ks_test_p_value: 0.12  # > 0.05, representative
      sex:
        male: 4800
        female: 5200
        chi_square_p_value: 0.45  # > 0.05, representative
      race_ethnicity:
        white: 6200
        black: 1400
        hispanic: 1400
        asian: 900
        other: 100
        chi_square_p_value: 0.08  # > 0.05, representative
  
  gaps_and_mitigation:
    - gap: "Under-representation of age 18-30 (only 500 samples)"
      mitigation: "Targeted data collection for 500 additional samples"
      status: "In progress"
    - gap: "Limited Asian population representation (9% vs 8% target)"
      mitigation: "Document in labeling, monitor post-market performance"
      status: "Documented"
  
  bias_assessment:
    - bias_type: "Selection bias (single hospital)"
      mitigation: "Collect data from 3 additional hospitals"
      status: "Completed"
    - bias_type: "Historical bias (2018-2020 data)"
      mitigation: "Temporal validation on 2021-2022 data"
      status: "Completed"
```

---

## Integration Points

- **COMP-FDA-ML-002:** Target population definition drives dataset selection
- **COMP-FDA-ML-004:** Dataset relevance and representativeness overlap
- **COMP-EN18031-009:** Training data quality requirements
- **COMP-EN18031-010:** Bias detection methods

---

## Audit Evidence

1. **Representativeness Analysis:**
   - [ ] Target population specification
   - [ ] Demographic representativeness report
   - [ ] Statistical comparison tests (KS, Chi-square)
   - [ ] Clinical representativeness analysis

2. **Gap Mitigation:**
   - [ ] Demographic gap documentation
   - [ ] Mitigation plans
   - [ ] Mitigation implementation records
   - [ ] Labeling of limitations

3. **Bias Assessment:**
   - [ ] Bias assessment report
   - [ ] Bias mitigation plan
   - [ ] Subgroup performance evaluation
   - [ ] Post-market monitoring plan

---

## References

- FDA, Health Canada, MHRA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
- FDA (2021). "Artificial Intelligence/Machine Learning (AI/ML)-Based Software as a Medical Device (SaMD) Action Plan"
- IMDRF (2014). "Software as a Medical Device (SaMD): Clinical Evaluation"

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |

---

## Notes

- **Status:** Pending verification with authoritative sources
- **Priority:** CRITICAL - Representativeness directly impacts model safety and fairness
- **Implementation Note:** Representativeness cannot be assumed; it must be demonstrated with statistical evidence



