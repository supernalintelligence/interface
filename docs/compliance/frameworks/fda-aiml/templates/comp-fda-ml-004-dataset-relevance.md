---
id: COMP-FDA-ML-004
framework: FDA-AIML
category: Data Management
title: Dataset Relevance and Clinical Applicability
description: Ensure training and validation datasets are clinically relevant and representative of intended use population
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-FDA-ML-001
  - COMP-FDA-ML-002
  - COMP-FDA-ML-003
  - COMP-EN18031-009
  - COMP-EN18031-014
tags:
  - data-quality
  - medical-devices
  - ai-ml
  - fda
  - dataset-relevance
  - clinical-applicability
priority: high
---

# COMP-FDA-ML-004: Dataset Relevance and Clinical Applicability

## Overview

This compliance card defines requirements for ensuring that training, validation, and test datasets used for AI/ML medical devices are clinically relevant, representative of the target population, and applicable to the intended use. Dataset relevance is a core principle of FDA Good Machine Learning Practice (GMLP) and is critical to ensuring model performance in real-world clinical settings.

**Regulatory Context:**
- FDA Good Machine Learning Practice (GMLP) Principles
- FDA AI/ML-Based Software as a Medical Device (SaMD) Action Plan
- 21 CFR Part 820 (Quality System Regulation - Design Controls)
- FDA Guidance on Clinical Evaluation

**Key Principle:**
Datasets must accurately represent the clinical population, conditions, and use environment for which the AI/ML device is intended. Dataset relevance directly impacts model generalizability, fairness, and clinical safety.

---

## Dataset Relevance Requirements

### 1. Clinical Representativeness

**Requirement:** Training and validation datasets must be clinically representative of the target population and intended use.

#### Acceptance Criteria
```gherkin
Feature: Clinical Representativeness

  Scenario: Validate dataset demographic representativeness
    Given an AI/ML medical device with defined target population
    When evaluating training dataset
    Then the dataset MUST include:
      | Demographic Factor                   | Validation Method           |
      |--------------------------------------|----------------------------|
      | Age distribution matching target population | Demographic analysis        |
      | Sex/gender distribution matching target population | Demographic analysis        |
      | Race/ethnicity distribution matching target population | Demographic analysis        |
      | Geographic diversity (if clinically relevant) | Geographic analysis         |
      | Socioeconomic diversity (if clinically relevant) | Socioeconomic analysis      |
    And statistical tests MUST confirm representativeness
    And any demographic gaps MUST be documented
    And plans to address demographic gaps MUST be defined

  Scenario: Validate dataset clinical representativeness
    Given a training dataset
    When evaluating clinical characteristics
    Then the dataset MUST include:
      | Clinical Factor                      | Validation Method           |
      |--------------------------------------|----------------------------|
      | Disease severity distribution matching target population | Clinical data analysis      |
      | Comorbidity prevalence matching target population | Comorbidity analysis        |
      | Clinical setting distribution (inpatient, outpatient) matching intended use | Setting analysis            |
      | Disease stage distribution           | Clinical staging analysis   |
      | Treatment history distribution (if relevant) | Treatment history analysis  |
      | Clinical variability (atypical presentations, edge cases) | Clinical review             |
    And clinical experts MUST review dataset composition
    And clinical relevance MUST be documented

  Scenario: Document representativeness limitations
    Given a dataset representativeness analysis
    When documenting limitations
    Then the following MUST be documented:
      | Limitation Type                      | Documentation Requirement   |
      |--------------------------------------|----------------------------|
      | Under-represented demographic subgroups | Subgroup list               |
      | Missing clinical conditions or severities | Clinical gap analysis       |
      | Geographic or institutional biases   | Bias documentation          |
      | Data collection biases               | Data provenance review      |
      | Generalizability constraints         | Constraints statement       |
    And limitations MUST be stated in device labeling
    And limitations MUST be communicated to clinical users
```

**Key Controls:**
- Demographic analysis report
- Clinical representativeness analysis
- Clinical expert review of dataset composition
- Labeling of representativeness limitations

**Metrics:**
- Demographic match score (target population vs. training data)
- Clinical representativeness score
- Number of demographic subgroups evaluated
- Demographic gap count and mitigation status

---

### 2. Data Source Relevance

**Requirement:** Data sources must be clinically relevant to the intended use environment.

#### Acceptance Criteria
```gherkin
Feature: Data Source Relevance

  Scenario: Validate data source clinical relevance
    Given training data from specific sources
    When evaluating source relevance
    Then the data sources MUST:
      | Requirement                          | Validation Method           |
      |--------------------------------------|----------------------------|
      | Match intended clinical setting (e.g., hospital EHR, imaging center PACS) | Source analysis             |
      | Use equipment/protocols matching target use (e.g., imaging modality, acquisition protocols) | Equipment validation        |
      | Reflect clinical workflows matching intended use | Workflow analysis           |
      | Include data quality matching target environment | Data quality assessment     |
      | Use labeling processes matching clinical standards | Labeling validation         |
    And data source documentation MUST be maintained
    And data provenance MUST be traceable

  Scenario: Validate data collection protocols
    Given data collection protocols
    When evaluating protocol relevance
    Then protocols MUST:
      | Requirement                          | Validation Method           |
      |--------------------------------------|----------------------------|
      | Match clinical protocols in target use environment | Protocol comparison         |
      | Include standardized data collection procedures | SOP review                  |
      | Document equipment specifications    | Equipment documentation     |
      | Document acquisition parameters (e.g., imaging protocols) | Parameter documentation     |
      | Include quality control procedures   | QC documentation            |
    And deviations from target use protocols MUST be documented
    And impact of protocol differences MUST be assessed
```

**Key Controls:**
- Data source documentation
- Data provenance tracking
- Clinical protocol comparison analysis
- Equipment specification documentation

**Metrics:**
- Data source relevance score
- Protocol match score (training data vs. intended use)
- Number of data sources
- Data source diversity score

---

### 3. Dataset Size and Statistical Power

**Requirement:** Datasets must be sufficiently large to support model training, validation, and subgroup analysis.

#### Acceptance Criteria
```gherkin
Feature: Dataset Size and Statistical Power

  Scenario: Validate dataset size adequacy
    Given a dataset for model development
    When evaluating dataset size
    Then the dataset MUST meet:
      | Requirement                          | Validation Method           |
      |--------------------------------------|----------------------------|
      | Minimum sample size for model training | Power analysis              |
      | Sufficient samples per class/outcome | Class balance analysis      |
      | Sufficient samples for validation set | Validation set size analysis |
      | Sufficient samples for test set      | Test set size analysis      |
      | Sufficient samples for subgroup analysis | Subgroup sample size analysis |
    And power analysis MUST justify sample sizes
    And sample size rationale MUST be documented

  Scenario: Validate statistical power for subgroup analysis
    Given demographic subgroups of interest
    When evaluating subgroup sample sizes
    Then for each subgroup:
      | Requirement                          | Validation Method           |
      |--------------------------------------|----------------------------|
      | Minimum sample size for performance evaluation | Subgroup power analysis     |
      | Sufficient events/outcomes for statistical significance | Event rate analysis         |
      | Confidence interval width meets acceptable limits | CI width analysis           |
    And under-powered subgroups MUST be documented
    And limitations of subgroup analysis MUST be stated
    And plans to collect additional data MUST be defined (if feasible)
```

**Key Controls:**
- Statistical power analysis
- Sample size justification document
- Subgroup sample size analysis
- Data collection plan for under-represented subgroups

**Metrics:**
- Total dataset size
- Samples per class/outcome
- Minimum subgroup sample size
- Statistical power (overall and per subgroup)
- Confidence interval widths

---

### 4. Data Quality and Clinical Validity

**Requirement:** Data must meet clinical quality standards and be validated for accuracy.

#### Acceptance Criteria
```gherkin
Feature: Data Quality and Clinical Validity

  Scenario: Validate clinical data accuracy
    Given training data with clinical annotations
    When evaluating data quality
    Then the data MUST meet:
      | Quality Requirement                  | Validation Method           |
      |--------------------------------------|----------------------------|
      | Ground truth labels validated by clinical experts | Clinical expert review      |
      | Inter-rater reliability meets clinical standards | Inter-rater reliability analysis (Kappa ≥ 0.75) |
      | Data completeness meets quality standards | Completeness analysis (≥95%) |
      | Data accuracy verified against source records | Audit sample verification   |
      | Missing data patterns documented and justified | Missing data analysis       |
    And label quality MUST be audited regularly
    And data quality issues MUST be documented and resolved

  Scenario: Validate clinical annotation process
    Given a clinical annotation process
    When evaluating annotation quality
    Then the process MUST include:
      | Process Requirement                  | Validation Method           |
      |--------------------------------------|----------------------------|
      | Clinical expert annotators with documented credentials | Credentialing documentation |
      | Annotation guidelines and training   | SOP documentation           |
      | Inter-rater reliability assessment   | IRR analysis (Kappa ≥ 0.75) |
      | Discrepancy resolution process       | Resolution SOP              |
      | Annotation quality audits            | Audit reports               |
    And annotation process MUST be validated before use
    And annotation guidelines MUST be maintained and version-controlled
```

**Key Controls:**
- Clinical annotation guidelines (SOP)
- Inter-rater reliability analysis
- Data quality audit reports
- Clinical expert credentialing documentation

**Metrics:**
- Inter-rater reliability (Kappa coefficient ≥ 0.75)
- Data completeness rate (target ≥ 95%)
- Label accuracy (audit sample)
- Missing data percentage
- Annotation quality score

---

### 5. Temporal and Environmental Relevance

**Requirement:** Data must reflect the temporal and environmental characteristics of the intended use.

#### Acceptance Criteria
```gherkin
Feature: Temporal and Environmental Relevance

  Scenario: Validate temporal relevance
    Given a dataset collected over a time period
    When evaluating temporal relevance
    Then the dataset MUST:
      | Requirement                          | Validation Method           |
      |--------------------------------------|----------------------------|
      | Include data from clinically relevant time period | Temporal analysis           |
      | Reflect current clinical practices   | Clinical practice review    |
      | Account for temporal drift in data distribution | Drift analysis              |
      | Include seasonal variation (if clinically relevant) | Seasonal analysis           |
    And temporal gaps or biases MUST be documented
    And plans for temporal validation MUST be defined

  Scenario: Validate environmental relevance
    Given data collected in specific environments
    When evaluating environmental relevance
    Then the dataset MUST:
      | Requirement                          | Validation Method           |
      |--------------------------------------|----------------------------|
      | Match target use environment (e.g., imaging equipment, EHR systems) | Environment comparison      |
      | Reflect environmental variability (e.g., different hospitals, equipment vendors) | Environmental diversity analysis |
      | Account for environmental confounders | Confounder analysis         |
    And environmental limitations MUST be documented
    And generalizability across environments MUST be assessed
```

**Key Controls:**
- Temporal relevance analysis
- Environmental relevance analysis
- Drift detection monitoring plan
- Generalizability assessment

**Metrics:**
- Temporal coverage (date range)
- Environmental diversity (number of sites, equipment types)
- Temporal drift score
- Environmental generalizability score

---

## Implementation Guidelines

### Dataset Relevance Documentation

1. **Dataset Characterization Report:**
   - Data source description and provenance
   - Demographic distribution analysis
   - Clinical characteristic distribution
   - Data quality metrics
   - Representativeness analysis
   - Limitations and gaps

2. **Clinical Expert Review:**
   - Clinical expert credentials
   - Dataset composition review
   - Clinical relevance assessment
   - Recommendations and actions

3. **Statistical Analysis:**
   - Power analysis and sample size justification
   - Demographic comparison (target population vs. dataset)
   - Subgroup sample size analysis
   - Inter-rater reliability analysis
   - Missing data analysis

4. **Labeling Documentation:**
   - Dataset limitations in device labeling
   - Target population constraints
   - Generalizability limitations

### Dataset Acquisition and Curation

1. **Data Source Selection:**
   - Define data source selection criteria
   - Document data source relevance to intended use
   - Establish data use agreements
   - Document data provenance

2. **Data Collection:**
   - Develop data collection SOPs
   - Train data collection personnel
   - Monitor data quality during collection
   - Document data collection deviations

3. **Clinical Annotation:**
   - Develop annotation guidelines (SOP)
   - Train and credential annotators
   - Perform inter-rater reliability studies
   - Implement discrepancy resolution process
   - Audit annotation quality

4. **Data Curation:**
   - Implement data quality checks
   - Document data cleaning and preprocessing
   - Maintain data version control
   - Document dataset changes

---

## Integration Points

### With Other FDA AI/ML Cards

- **COMP-FDA-ML-002 (Clinical Objective):** Target population definition drives dataset selection
- **COMP-FDA-ML-003 (Data Quality ALCOA+):** Data quality principles apply to dataset curation
- **COMP-FDA-ML-005 (Clinical Validation):** Dataset relevance is validated in clinical studies
- **COMP-FDA-ML-006 (Real-World Performance):** Real-world data is compared to training data

### With EN 18031

- **COMP-EN18031-009 (Training Data Quality):** Overlapping requirements for data quality
- **COMP-EN18031-010 (Bias Detection):** Dataset representativeness impacts bias
- **COMP-EN18031-014 (Data Versioning):** Dataset versioning supports reproducibility

---

## Audit Evidence

### Documentation Requirements

1. **Dataset Characterization:**
   - [ ] Dataset characterization report
   - [ ] Data source documentation and provenance
   - [ ] Demographic distribution analysis
   - [ ] Clinical characteristic distribution analysis
   - [ ] Data quality metrics report

2. **Representativeness Analysis:**
   - [ ] Target population comparison analysis
   - [ ] Statistical tests of representativeness
   - [ ] Demographic gap documentation
   - [ ] Mitigation plans for demographic gaps

3. **Clinical Expert Review:**
   - [ ] Clinical expert credentials
   - [ ] Dataset composition review records
   - [ ] Clinical relevance assessment
   - [ ] Clinical expert recommendations and actions

4. **Statistical Analysis:**
   - [ ] Power analysis and sample size justification
   - [ ] Subgroup sample size analysis
   - [ ] Inter-rater reliability analysis
   - [ ] Missing data analysis

5. **Labeling:**
   - [ ] Dataset limitations in labeling
   - [ ] Target population constraints in labeling

### Common Audit Findings

1. **Insufficient Dataset Representativeness:**
   - Training data not representative of target population
   - Demographic gaps not documented or addressed
   - Subgroup sample sizes insufficient

2. **Poor Data Quality:**
   - Inter-rater reliability below clinical standards (Kappa < 0.75)
   - High missing data rates (>5%)
   - Lack of clinical expert validation of labels

3. **Inadequate Data Source Documentation:**
   - Data provenance not traceable
   - Data collection protocols not documented
   - Equipment specifications not documented

4. **Insufficient Statistical Power:**
   - Sample sizes not justified by power analysis
   - Subgroup analysis under-powered
   - Confidence intervals too wide

---

## Tools & Automation

### Dataset Relevance Validation

```bash
# Validate dataset representativeness
sc compliance validate-dataset-relevance \
  --dataset-file dataset-metadata.yaml \
  --target-population target-population.yaml \
  --check-demographics \
  --check-clinical-characteristics \
  --check-data-quality \
  --check-statistical-power

# Generate dataset characterization report
sc compliance report-dataset-characterization \
  --dataset-file dataset-metadata.yaml \
  --output dataset-report.pdf \
  --include-demographics \
  --include-clinical-characteristics \
  --include-quality-metrics \
  --include-representativeness-analysis
```

### Dataset Metadata Schema

```yaml
# dataset-metadata.yaml
dataset:
  id: "DATASET-001"
  version: "1.0"
  name: "Training Dataset for AI/ML Device"
  description: "Dataset description"
  
  data_sources:
    - id: "SOURCE-001"
      name: "Hospital A EHR"
      type: "electronic_health_record"
      date_range: "2018-01-01 to 2022-12-31"
      patient_count: 10000
      clinical_setting: "inpatient"
      equipment: "EHR Vendor X"
      protocols: "Standard clinical protocols"
  
  demographics:
    total_samples: 10000
    age:
      mean: 55.2
      std: 15.3
      range: "18-95"
      distribution:
        - range: "18-30"
          count: 500
        - range: "31-50"
          count: 3000
        - range: "51-70"
          count: 4500
        - range: "71-95"
          count: 2000
    sex:
      male: 4500
      female: 5500
    race_ethnicity:
      white: 6000
      black: 2000
      hispanic: 1500
      asian: 500
  
  clinical_characteristics:
    disease_severity:
      mild: 4000
      moderate: 4000
      severe: 2000
    comorbidities:
      diabetes: 3000
      hypertension: 5000
      heart_disease: 2000
  
  data_quality:
    completeness: 97.5
    missing_data_rate: 2.5
    inter_rater_reliability:
      kappa: 0.82
      method: "Cohen's Kappa"
      raters: 3
  
  annotations:
    annotators:
      - name: "Dr. Smith"
        credentials: "MD, Board Certified"
        role: "Clinical Expert"
    annotation_process:
      guidelines_version: "1.2"
      training_completed: true
      quality_audits: 5
  
  representativeness:
    target_population_match:
      demographics: 0.92
      clinical_characteristics: 0.88
    gaps:
      - subgroup: "Age 18-30"
        current_count: 500
        target_count: 1000
        mitigation: "Collect additional data"
  
  statistical_power:
    overall_power: 0.95
    subgroup_power:
      - subgroup: "Male"
        power: 0.93
      - subgroup: "Female"
        power: 0.94
```

---

## References

### Regulatory Guidance

- FDA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
- FDA (2021). "Artificial Intelligence/Machine Learning (AI/ML)-Based Software as a Medical Device (SaMD) Action Plan"
- FDA (2019). "Content of Premarket Submissions for Device Software Functions"
- 21 CFR Part 820 (Quality System Regulation)

### Standards

- ISO 5725 (Accuracy and Precision of Measurement Methods)
- ISO 13485:2016 (Medical Devices - Quality Management Systems)

### Best Practices

- IMDRF (2014). "Software as a Medical Device (SaMD): Clinical Evaluation"
- AdvaMed (2021). "AI/ML Best Practices for Medical Device Manufacturers"
- Shortliffe & Sepúlveda (2018). "Clinical Decision Support in the Era of Artificial Intelligence"

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |

---

## Notes

- **Status:** Pending verification with authoritative FDA sources
- **Priority:** HIGH - Critical to model performance and safety
- **Dependencies:** Requires completed clinical objective definition (COMP-FDA-ML-002)
- **Review Cycle:** Dataset relevance should be reviewed before model training and periodically during post-market surveillance



