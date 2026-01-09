---
id: COMP-GMLP-010
framework: GMLP
category: Post-Market Surveillance
title: Post-Market Monitoring and Re-Training Management
description: Monitor deployed model performance and manage re-training risks with appropriate regulatory controls
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-FDA-ML-006
  - COMP-GMLP-007
  - COMP-EN18031-023
  - COMP-EN18031-026
tags:
  - gmlp
  - post-market-surveillance
  - model-drift
  - re-training
  - medical-devices
priority: critical
---

# COMP-GMLP-010: Post-Market Monitoring and Re-Training Management

## Overview

**GMLP Principle 10:** "Deployed models are monitored for performance and re-training risks are managed."

Defines requirements for continuous performance monitoring of deployed AI/ML models and managing model updates (re-training) with appropriate regulatory controls. Post-market monitoring is essential to Total Product Lifecycle (TPLC) approach.

**Regulatory Context:** FDA GMLP Principles, FDA AI/ML SaMD Action Plan, FDA PCCP Guidance

---

## Post-Market Monitoring Requirements

### 1. Performance Monitoring

#### Acceptance Criteria
```gherkin
Feature: Real-World Performance Monitoring

  Scenario: Implement continuous performance monitoring
    Given deployed AI/ML device
    When establishing monitoring system
    Then monitoring MUST include:
      | Metric Type                          | Monitoring Method           | Frequency                   |
      |--------------------------------------|----------------------------|-----------------------------|
      | Clinical performance (sensitivity, specificity, etc.) | Outcome tracking            | Continuous, reported quarterly |
      | Model drift detection                | Statistical tests (KS, PSI) | Weekly                      |
      | Data quality monitoring              | Input data QC               | Real-time                   |
      | User interaction patterns            | Override rate, usage        | Continuous                  |
      | Adverse events                       | AE reporting system         | Continuous                  |
    And KPIs MUST be established from clinical validation
    And alert thresholds MUST be defined
    And performance MUST be reported quarterly (minimum)

  Scenario: Detect and respond to performance degradation
    Given performance monitoring alerts
    When degradation detected
    Then response MUST include:
      | Action                               | Timeline                    |
      |--------------------------------------|----------------------------|
      | Investigate root cause               | Within 7 days               |
      | Assess patient risk                  | Within 24 hours (if safety-related) |
      | Implement mitigation                 | Based on risk assessment    |
      | Notify FDA (if reportable)           | Per MDR requirements        |
      | Update device labeling (if needed)   | Per regulatory requirements |
    And all actions MUST be documented
```

**Key Controls:**
- Post-market surveillance plan
- KPI dashboard with statistical process control
- Alert system with defined thresholds
- Root cause analysis procedures
- MDR (Medical Device Reporting) compliance

**Metrics:**
- KPIs (sensitivity, specificity, etc.)
- Model drift score (KS statistic, PSI)
- Alert frequency and resolution time
- Adverse event rate

---

### 2. Model Update Management

#### Acceptance Criteria
```gherkin
Feature: Predetermined Change Control Plan (PCCP)

  Scenario: Define PCCP for model updates
    Given AI/ML device
    When planning model updates
    Then PCCP MUST define:
      | PCCP Element                         | Requirement                 |
      |--------------------------------------|----------------------------|
      | Types of modifications planned       | Algorithm changes, re-training, data updates |
      | Modification protocol                | Update process, validation requirements |
      | Update decision criteria             | When updates are triggered  |
      | Impact assessment                    | Risk analysis for updates   |
      | Validation requirements              | Testing before deployment   |
    And PCCP MUST be approved by FDA (if applicable)
    And PCCP MUST be followed for all updates

  Scenario: Validate model updates before deployment
    Given model update
    When validating update
    Then validation MUST include:
      | Validation Activity                  | Requirement                 |
      |--------------------------------------|----------------------------|
      | Performance validation               | Meets or exceeds baseline performance |
      | Regression testing                   | No performance degradation on existing cases |
      | Subgroup analysis                    | Performance maintained across subgroups |
      | Clinical expert review               | Clinical validation of update |
    And validation results MUST be documented
    And updates MUST not degrade performance
```

**Key Controls:**
- Predetermined Change Control Plan (PCCP)
- Model update validation protocol
- Regulatory change control process
- Model version management

**Metrics:**
- Model update frequency
- Validation pass rate for updates
- Performance delta (baseline vs. updated model)
- Regulatory submission frequency (for significant updates)

---

## Implementation Guidelines

```yaml
postmarket_monitoring:
  kpi_dashboard:
    clinical_performance:
      - metric: "Sensitivity"
        baseline: 0.92
        alert_threshold: 0.88  # Alert if < 0.88
      - metric: "Specificity"
        baseline: 0.88
        alert_threshold: 0.84
    drift_detection:
      method: "KS test + PSI"
      frequency: "Weekly"
      alert_threshold: "PSI > 0.2 or KS p < 0.05"
    data_quality:
      missing_rate_threshold: 0.05
      outlier_rate_threshold: 0.02
  
  pccp:
    modification_types:
      - "Re-training on new data"
      - "Hyperparameter tuning"
      - "Architecture changes (minor)"
    update_triggers:
      - "Performance degradation > 2 std deviations"
      - "Significant data drift (PSI > 0.2 for 4 weeks)"
      - "New clinical evidence"
    validation_requirements:
      - "Independent test set validation"
      - "Subgroup performance analysis"
      - "Clinical expert review"
    regulatory_pathway: "PCCP submission (if significant change)"
```

---

## Integration Points

- **COMP-FDA-ML-006:** Real-world performance monitoring aligns
- **COMP-GMLP-007:** Human-AI team performance monitored post-market

---

## Audit Evidence

1. [ ] Post-market surveillance plan
2. [ ] KPI dashboard and monitoring reports (quarterly)
3. [ ] Alert investigation records
4. [ ] MDR reports (if applicable)
5. [ ] PCCP documentation
6. [ ] Model update validation reports

---

## References

- FDA, Health Canada, MHRA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
- FDA (2021). "Artificial Intelligence/Machine Learning (AI/ML)-Based Software as a Medical Device (SaMD) Action Plan"
- FDA (2023). "Marketing Submission Recommendations for a Predetermined Change Control Plan"

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |
