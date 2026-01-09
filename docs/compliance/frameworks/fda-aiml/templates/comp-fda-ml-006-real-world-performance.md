---
id: COMP-FDA-ML-006
framework: FDA-AIML
category: Post-Market Surveillance
title: Real-World Performance Monitoring
description: Monitor AI/ML device performance in real-world clinical settings and respond to performance changes
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-FDA-ML-001
  - COMP-FDA-ML-005
  - COMP-EN18031-023
  - COMP-EN18031-026
tags:
  - performance-monitoring
  - medical-devices
  - ai-ml
  - fda
  - model-drift
  - post-market
priority: critical
---

# COMP-FDA-ML-006: Real-World Performance Monitoring

## Overview

Defines requirements for continuous monitoring of AI/ML device performance in real-world clinical settings, detecting model drift, and implementing appropriate responses to performance changes. Real-world performance monitoring is a cornerstone of FDA's AI/ML regulatory approach.

**Regulatory Context:** FDA GMLP Principles, FDA Total Product Lifecycle (TPLC) approach, 21 CFR Part 820.

---

## Real-World Performance Requirements

### 1. Performance Monitoring Framework

#### Acceptance Criteria
```gherkin
Feature: Performance Monitoring Framework

  Scenario: Establish KPI dashboard
    Given an AI/ML device deployed in clinical use
    When establishing performance monitoring
    Then the monitoring system MUST include:
      | Component                            | Implementation              |
      |--------------------------------------|----------------------------|
      | Key performance indicators (KPIs) matching clinical validation metrics | Automated data collection   |
      | Statistical process control (SPC) charts | SPC implementation          |
      | Performance alert thresholds         | Alert system                |
      | Real-time data collection            | Data pipeline               |
      | Automated reporting                  | Report generation           |
    And KPIs MUST be reviewed quarterly (minimum)
    And performance data MUST be accessible to regulatory affairs

  Scenario: Define performance metrics
    Given clinical validation results
    When defining monitoring metrics
    Then metrics MUST include:
      | Metric Type                          | Examples                    |
      |--------------------------------------|----------------------------|
      | Clinical performance (primary endpoint) | Sensitivity, specificity, AUC |
      | Operational performance              | Inference latency, uptime   |
      | Data quality metrics                 | Missing data rate, outliers |
      | User interaction metrics             | Override rate, usage patterns |
      | Demographic performance              | Performance by subgroup     |
    And baseline performance MUST be established from clinical validation
    And alert thresholds MUST be statistically justified
```

**Key Controls:**
- KPI dashboard with SPC charts
- Automated data collection and reporting
- Alert system with defined thresholds
- Quarterly performance review process

**Metrics:**
- All clinical performance metrics from validation study
- Inference latency (p95, p99)
- System uptime (%)
- Clinician override rate (%)
- Performance trends (slope, variance)

---

### 2. Model Drift Detection

#### Acceptance Criteria
```gherkin
Feature: Model Drift Detection

  Scenario: Detect data drift
    Given incoming real-world data
    When monitoring for data drift
    Then drift detection MUST evaluate:
      | Drift Type                           | Detection Method            |
      |--------------------------------------|----------------------------|
      | Input distribution drift             | Statistical tests (KS test, Chi-square) |
      | Covariate shift                      | Distribution comparison     |
      | Missing data pattern changes         | Missing data analysis       |
      | Data quality degradation             | Quality metric trends       |
    And drift detection MUST run automatically (at least weekly)
    And significant drift MUST trigger investigation
    And drift trends MUST be reported quarterly

  Scenario: Detect performance drift
    Given real-world performance data
    When monitoring for performance drift
    Then drift detection MUST evaluate:
      | Performance Aspect                   | Detection Method            |
      |--------------------------------------|----------------------------|
      | Overall performance degradation      | SPC charts, trend analysis  |
      | Subgroup performance changes         | Subgroup monitoring         |
      | Calibration drift                    | Calibration plots           |
      | Prediction distribution changes      | Output distribution analysis |
    And performance drift MUST trigger investigation when thresholds exceeded
    And root cause analysis MUST be conducted
```

**Key Controls:**
- Automated drift detection algorithms
- Statistical tests for distribution changes
- Performance trend analysis
- Root cause analysis procedures

**Metrics:**
- Data drift score (KS statistic, PSI)
- Performance drift magnitude (delta from baseline)
- Calibration error (ECE, MCE)
- Frequency of drift alerts

---

### 3. Adverse Event Monitoring and Reporting

#### Acceptance Criteria
```gherkin
Feature: Adverse Event Monitoring

  Scenario: Monitor for adverse events
    Given deployed AI/ML device
    When monitoring for adverse events
    Then the system MUST:
      | Requirement                          | Implementation              |
      |--------------------------------------|----------------------------|
      | Collect adverse event reports        | AE reporting system         |
      | Assess device-relatedness            | Causality assessment        |
      | Classify event severity              | Severity classification     |
      | Report to FDA per MDR requirements   | MDR process                 |
      | Investigate root cause               | RCA procedures              |
    And adverse events MUST be reviewed by clinical and regulatory teams
    And serious adverse events MUST be reported to FDA within regulatory timelines

  Scenario: Respond to safety signals
    Given an adverse event or safety signal
    When assessing device risk
    Then the response MUST include:
      | Action                               | Timeline                    |
      |--------------------------------------|----------------------------|
      | Risk assessment                      | Within 48 hours             |
      | Clinical expert review               | Within 7 days               |
      | Regulatory notification (if required) | Per MDR timelines           |
      | Corrective action (if needed)        | Based on risk level         |
      | Update risk management file          | Within 30 days              |
    And all actions MUST be documented
```

**Key Controls:**
- Adverse event reporting system
- MDR (Medical Device Reporting) compliance process
- Risk assessment procedures
- Clinical and regulatory review boards
- Risk management file updates

**Metrics:**
- Adverse event rate (events per 1000 uses)
- Device-related adverse event rate
- Serious adverse event rate
- MDR report timeliness (% on-time)
- CAPA closure rate

---

### 4. Corrective Actions and Model Updates

#### Acceptance Criteria
```gherkin
Feature: Corrective Actions and Model Updates

  Scenario: Implement corrective actions
    Given performance degradation or safety concern
    When implementing corrective action
    Then the action MUST follow:
      | Step                                 | Requirement                 |
      |--------------------------------------|----------------------------|
      | Root cause analysis                  | RCA documentation           |
      | Corrective action plan               | CAPA plan                   |
      | Regulatory impact assessment         | Regulatory review           |
      | Implementation and validation        | Validation testing          |
      | Effectiveness check                  | Post-implementation monitoring |
    And CAPA process MUST be followed
    And effectiveness MUST be validated

  Scenario: Evaluate need for model update
    Given performance drift or corrective action
    When considering model update
    Then the evaluation MUST assess:
      | Consideration                        | Decision Criteria           |
      |--------------------------------------|----------------------------|
      | Magnitude of performance change      | Clinical significance       |
      | Risk to patients                     | Risk assessment             |
      | Regulatory pathway (510(k), PMA supplement) | Regulatory affairs review   |
      | Validation requirements              | Validation plan             |
      | Clinical impact                      | Clinical expert review      |
    And if significant change: regulatory submission MUST be prepared
    And model update MUST be validated per original validation plan
```

**Key Controls:**
- CAPA (Corrective and Preventive Action) system
- Root cause analysis procedures
- Regulatory change control process
- Model update validation procedures
- Regulatory submission process (if applicable)

**Metrics:**
- CAPA initiation frequency
- CAPA closure time (median, p95)
- CAPA effectiveness rate (%)
- Model update frequency
- Regulatory submission frequency

---

## Implementation Guidelines

### Performance Monitoring System Architecture

```yaml
performance_monitoring:
  data_collection:
    - real_time_inputs: ["patient_data", "model_predictions", "clinician_actions"]
    - batch_data: ["performance_outcomes", "adverse_events"]
    - frequency: "continuous"
  
  kpi_dashboard:
    - clinical_performance: ["sensitivity", "specificity", "AUC", "calibration"]
    - operational: ["latency_p95", "uptime", "throughput"]
    - data_quality: ["missing_rate", "outlier_rate"]
    - user_interaction: ["override_rate", "usage_volume"]
  
  drift_detection:
    - data_drift: ["KS_test", "PSI", "covariate_shift"]
    - performance_drift: ["SPC_charts", "trend_analysis"]
    - frequency: "weekly"
  
  alerting:
    - performance_degradation: "threshold: 2 std deviations"
    - data_drift: "threshold: PSI > 0.2"
    - adverse_events: "immediate"
  
  reporting:
    - quarterly_performance_review: true
    - annual_regulatory_report: true
    - ad_hoc_investigation_reports: true
```

### Monitoring Workflow

1. **Data Collection:** Continuously collect real-world performance data
2. **Analysis:** Compute KPIs, run drift detection (weekly)
3. **Alerting:** Trigger alerts when thresholds exceeded
4. **Investigation:** Conduct root cause analysis for alerts
5. **Response:** Implement corrective actions (CAPA)
6. **Validation:** Validate effectiveness of actions
7. **Reporting:** Quarterly reviews, regulatory reporting

---

## Integration Points

- **COMP-FDA-ML-005:** Real-world monitoring continues clinical validation
- **COMP-EN18031-023:** Model drift detection methods
- **COMP-EN18031-026:** AI system monitoring requirements
- **COMP-IEC62304-014:** Change control for model updates

---

## Audit Evidence

1. **Monitoring System:**
   - [ ] Performance monitoring plan
   - [ ] KPI dashboard documentation
   - [ ] Drift detection algorithms and thresholds
   - [ ] Alert system configuration

2. **Performance Data:**
   - [ ] Quarterly performance reports
   - [ ] Drift detection reports
   - [ ] Performance trend analysis

3. **Adverse Events:**
   - [ ] Adverse event reports
   - [ ] MDR submissions
   - [ ] Causality assessments

4. **Corrective Actions:**
   - [ ] CAPA records
   - [ ] Root cause analysis reports
   - [ ] Validation reports for corrective actions

---

## References

- FDA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
- FDA (2021). "Artificial Intelligence/Machine Learning (AI/ML)-Based Software as a Medical Device (SaMD) Action Plan"
- FDA (2023). "Marketing Submission Recommendations for a Predetermined Change Control Plan"
- 21 CFR Part 803 (Medical Device Reporting)
- 21 CFR Part 806 (Medical Device Corrections and Removals)

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |

---

## Notes

- **Status:** Pending verification with authoritative FDA sources
- **Priority:** CRITICAL - Required for post-market surveillance and FDA Total Product Lifecycle approach
- **Dependencies:** Requires deployed device with established baseline performance (COMP-FDA-ML-005)



