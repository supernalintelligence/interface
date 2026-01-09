---
id: COMP-GMLP-005
framework: GMLP
category: Data Quality
title: Reference Dataset Selection and Quality
description: Select and validate reference datasets using best available methods and clinical standards
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-GMLP-003
  - COMP-GMLP-004
  - COMP-FDA-ML-003
  - COMP-EN18031-009
tags:
  - gmlp
  - reference-datasets
  - data-quality
  - medical-devices
  - ground-truth
priority: high
---

# COMP-GMLP-005: Reference Dataset Selection and Quality

## Overview

**GMLP Principle 5:** "Selected reference datasets are based upon best available methods."

Defines requirements for selecting high-quality reference datasets with validated ground truth labels using best available clinical methods. Reference dataset quality directly impacts model accuracy and clinical validity.

**Regulatory Context:** FDA GMLP Principles, FDA Data Quality Guidance

---

## Reference Dataset Requirements

### 1. Ground Truth Validation

#### Acceptance Criteria
```gherkin
Feature: Ground Truth Validation

  Scenario: Establish reference standard
    Given a clinical task requiring labeled data
    When selecting reference standard
    Then the standard MUST be:
      | Requirement                          | Validation Method           |
      |--------------------------------------|----------------------------|
      | Clinically accepted gold standard    | Clinical literature review  |
      | Best available method                | Clinical expert consensus   |
      | Validated for intended use           | Method validation study     |
      | Reproducible                         | Inter-rater reliability ≥ 0.75 |
    And reference standard MUST be documented
    And limitations MUST be acknowledged

  Scenario: Clinical expert annotation
    Given reference dataset labeling
    When clinical experts annotate
    Then the process MUST include:
      | Control                              | Requirement                 |
      |--------------------------------------|----------------------------|
      | Annotator credentials                | Board certified, relevant specialty |
      | Annotation guidelines (SOP)          | Detailed, version-controlled |
      | Inter-rater reliability              | Kappa ≥ 0.75                |
      | Discrepancy resolution               | Consensus process documented |
    And annotation quality MUST be audited
```

**Key Controls:**
- Reference standard documentation
- Clinical expert credentialing
- Annotation guidelines (SOP)
- Inter-rater reliability analysis

**Metrics:**
- Inter-rater reliability (Kappa ≥ 0.75)
- Annotation completeness (%)
- Clinical expert consensus rate (%)

---

### 2. Data Provenance and Quality

#### Acceptance Criteria
```gherkin
Feature: Data Provenance

  Scenario: Document data provenance
    Given reference dataset sources
    When documenting provenance
    Then documentation MUST include:
      | Element                              | Requirement                 |
      |--------------------------------------|----------------------------|
      | Data source (institution, registry)  | Clearly identified          |
      | Collection dates                     | Documented                  |
      | Collection methods                   | Protocol documented         |
      | Data quality controls                | QC procedures documented    |
      | Use permissions                      | Data use agreements         |
    And provenance MUST be traceable
    And data lineage MUST be maintained

  Scenario: Validate data quality (ALCOA+)
    Given reference dataset
    When assessing quality
    Then data MUST meet:
      | Principle                            | Validation                  |
      |--------------------------------------|----------------------------|
      | Attributable                         | Source traceable            |
      | Legible                              | Readable, interpretable     |
      | Contemporaneous                      | Timely collection           |
      | Original                             | Source data preserved       |
      | Accurate                             | Quality checks passed       |
    And quality assessment MUST be documented
```

**Key Controls:**
- Data provenance documentation
- Data use agreements
- ALCOA+ quality assessment
- Data quality audit reports

**Metrics:**
- Data provenance completeness (%)
- ALCOA+ compliance score
- Data quality audit pass rate (%)

---

## Implementation Guidelines

```yaml
reference_dataset_quality:
  ground_truth:
    reference_standard: "Biopsy confirmation (gold standard)"
    clinical_validity: "Validated in X clinical studies"
    limitations: "Not applicable for Y conditions"
  
  annotation:
    annotators:
      - credentials: "MD, Board Certified Pathologist"
        experience: "15 years"
    guidelines: "Annotation SOP v2.1"
    inter_rater_reliability:
      kappa: 0.82
      method: "Cohen's Kappa"
      raters: 3
  
  provenance:
    source: "Hospital A Medical Records"
    collection_dates: "2018-2022"
    collection_method: "Standard clinical protocol"
    data_use_agreement: "DUA-2023-045"
  
  quality_alcoa:
    attributable: "PASS"
    legible: "PASS"
    contemporaneous: "PASS"
    original: "PASS"
    accurate: "PASS"
```

---

## Integration Points

- **COMP-FDA-ML-003:** ALCOA+ data quality principles
- **COMP-GMLP-003:** Reference datasets must be representative

---

## Audit Evidence

1. [ ] Reference standard documentation
2. [ ] Clinical expert credentials
3. [ ] Annotation guidelines (SOP)
4. [ ] Inter-rater reliability analysis
5. [ ] Data provenance documentation
6. [ ] ALCOA+ quality assessment

---

## References

- FDA, Health Canada, MHRA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
- FDA (2013). "Guidance for Industry: Electronic Source Data in Clinical Investigations"

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |
