---
id: comp-en18031-002-ai-risk-management
title: COMP-EN18031-002 - AI Risk Management
purpose: Establish systematic AI risk identification, assessment, and mitigation processes
en18031Control: 5.1.2
category: ai-governance
priority: critical
framework: EN 18031
sidebar_label: COMP-EN18031-002
sidebar_position: 2
crossFramework:
  iso42001: 6.1 (Risk Assessment)
  euAiAct: Article 9 (Risk Management System)
  iso24028: Robustness
  nistAiRmf: MAP 1.1, MEASURE 2.1
status: pending-verification
references: []
---

# COMP-EN18031-002: AI Risk Management

## Overview

**Purpose**: Establish systematic AI risk identification, assessment, mitigation, and monitoring processes throughout the AI system lifecycle  
**EN 18031 Control**: 5.1.2 - AI Risk Management  
**Category**: ai-governance  
**Priority**: critical  
**Framework**: EN 18031

## Regulatory Context

### EN 18031 Alignment

- **5.1.2**: AI Risk Management - Systematic identification and mitigation of AI-specific risks
- **Related Controls**:
  - 5.1.1: AI Governance Framework (risk management within governance)
  - 5.4.4: Model Adversarial Testing (risk mitigation for security)
  - 5.5.6: Robustness Testing (risk mitigation for reliability)
  - 5.7.1: Safety Requirements (risk mitigation for safety)

### Cross-Framework Mapping

- **ISO/IEC 42001**:
  - 6.1: Actions to address risks and opportunities
  - 8.2: AI system risk assessment
  - 8.3: AI system validation and risk mitigation

- **EU AI Act**:
  - Article 9: Risk Management System for high-risk AI
  - Article 15: Accuracy, robustness, cybersecurity requirements
  - Annex III: High-risk AI systems classification

- **ISO 24028**:
  - Section 5.4: Robustness (addressing system failures)
  - Section 5.6: Reliability (consistent performance)
  - Section 5.7: Safety (harm prevention)

- **NIST AI RMF**:
  - MAP-1.1: Potential benefits and costs mapped
  - MEASURE-2.1: Test sets, metrics validated
  - MANAGE-1.1: AI risks assessed regularly
  - MANAGE-4.1: Risks tracked over time

## Description

Implements EN 18031 Section 5.1.2 to establish comprehensive AI risk management processes covering the entire AI system lifecycle. This includes systematic identification of AI-specific risks (bias, drift, adversarial attacks, safety failures), quantitative and qualitative risk assessment methodologies, risk mitigation strategies, and continuous risk monitoring.

The risk management framework must address:

1. **Risk Identification**: Systematic discovery of AI-specific risks throughout lifecycle
   - Data risks (quality, bias, poisoning)
   - Model risks (overfitting, underfitting, adversarial vulnerabilities)
   - Deployment risks (drift, performance degradation, safety failures)
   - Ethical risks (fairness, transparency, accountability gaps)

2. **Risk Assessment**: Quantitative scoring using likelihood and impact matrices
   - Severity classification (catastrophic, major, moderate, minor, negligible)
   - Likelihood estimation (frequent, probable, occasional, remote, improbable)
   - Risk prioritization matrix
   - Residual risk evaluation

3. **Risk Mitigation**: Specific controls and safeguards for identified risks
   - Technical controls (testing, monitoring, failsafes)
   - Process controls (reviews, approvals, audits)
   - Organizational controls (training, policies, responsibilities)
   - Risk acceptance criteria and approval workflows

4. **Risk Monitoring**: Continuous tracking of risk indicators and emerging threats
   - Real-time risk dashboards
   - Risk indicator thresholds and alerts
   - Periodic risk reassessments
   - Incident analysis and risk updates

5. **Risk Communication**: Transparent reporting to stakeholders and governance
   - Risk registers and heat maps
   - Executive risk summaries
   - Stakeholder notifications for high-severity risks
   - Public disclosures as required by regulations

6. **Risk Documentation**: Comprehensive audit trail of risk decisions
   - Risk assessment records
   - Mitigation implementation evidence
   - Risk acceptance approvals
   - Risk monitoring reports

## Acceptance Criteria

```gherkin
Feature: AI Risk Management System
  As an AI Risk Manager
  I want to systematically identify, assess, and mitigate AI-specific risks
  So that AI systems are deployed safely and in compliance with EN 18031

  Background:
    Given organization develops or deploys AI systems
    And EN 18031 Section 5.1.2 compliance is required
    And risk management framework is established per ISO 31000
    And AI governance committee is operational

  Scenario: AI-Specific Risk Identification
    Given new AI system "HealthDiagnosticAI" is planned
    When systematic risk identification is performed
    And AI-specific risk categories are reviewed:
      | Risk Category | Specific Risks |
      | Data | Bias, quality, poisoning, privacy |
      | Model | Adversarial, overfitting, drift, explainability |
      | Deployment | Safety, reliability, performance, security |
      | Ethical | Fairness, transparency, accountability |
    And domain experts identify risks specific to diagnostic AI
    And historical incident data is reviewed
    Then comprehensive risk register shall be created
    And each identified risk shall have description and source
    And risks shall be categorized by AI lifecycle phase
    And risk register shall be reviewed by governance committee

  Scenario: Quantitative Risk Assessment
    Given AI risks are identified for "HealthDiagnosticAI"
    When risk "Misdiagnosis due to model bias" is assessed
    And severity is determined: "Major" (incorrect diagnosis, delayed treatment)
    And likelihood is estimated: "Probable" (bias detected in training data)
    And risk score is calculated: Likelihood × Severity = 15 (High Risk)
    Then risk shall be classified as "High Priority" (score >12)
    And executive notification shall be triggered
    And mitigation plan shall be required within 30 days
    And risk owner shall be assigned
    And risk shall be tracked in governance dashboard

  Scenario: Risk Mitigation Strategy Development
    Given high-priority risk "Misdiagnosis due to model bias" identified
    When mitigation strategies are developed
    And technical controls proposed: bias testing, fairness metrics, model retraining
    And process controls proposed: regular fairness audits, diverse test sets
    And organizational controls proposed: bias awareness training, ethics review
    Then mitigation plan shall address root causes
    And residual risk shall be calculated post-mitigation
    And mitigation cost-benefit analysis shall be performed
    And mitigation timeline shall be defined
    And mitigation plan shall be approved by risk owner and governance committee

  Scenario: Risk Mitigation Implementation and Verification
    Given mitigation plan approved for "Misdiagnosis due to model bias"
    When technical controls are implemented (bias testing pipeline)
    And process controls are implemented (quarterly fairness audits)
    And organizational controls are implemented (training completed)
    And mitigation effectiveness is tested
    Then bias metrics shall meet defined thresholds (demographic parity ±5%)
    And residual risk score shall be reduced to acceptable level (<8)
    And mitigation evidence shall be documented
    And risk status shall be updated to "Mitigated" in risk register

  Scenario: Continuous Risk Monitoring
    Given AI system "HealthDiagnosticAI" is deployed to production
    When continuous monitoring systems track risk indicators
    And model performance metrics are monitored (accuracy, precision, recall)
    And fairness metrics are tracked (demographic parity, equalized odds)
    And drift detection monitors data distribution shifts
    And incident reports are analyzed for emerging risks
    Then risk indicators exceeding thresholds shall trigger alerts
    And risk register shall be updated with new or changed risks
    And quarterly risk reviews shall be conducted
    And governance committee shall receive risk status reports

  Scenario: Risk Acceptance for Residual Risks
    Given mitigation strategies reduce risk score but cannot eliminate it
    When residual risk "Rare edge cases with reduced accuracy" remains
    And residual risk score is 6 (Moderate)
    And further mitigation is not cost-effective or technically feasible
    Then risk acceptance process shall be initiated
    And risk acceptance requires governance committee approval
    And acceptance rationale shall document why risk is acceptable
    And risk monitoring plan shall be established for accepted risks
    And risk acceptance shall be time-limited (annual revalidation required)
```

## Technical Context

### Implementation Requirements

**Risk Management System Components**:

1. **Risk Register**
   - Unique risk identifier
   - Risk description and category
   - Likelihood and severity scores
   - Risk owner and assigned mitigations
   - Status tracking (identified, assessed, mitigated, accepted, closed)

2. **Risk Assessment Methodology**
   - Likelihood scale (1-5): Improbable to Frequent
   - Severity scale (1-5): Negligible to Catastrophic
   - Risk matrix: Likelihood × Severity
   - Priority thresholds: Critical (>15), High (12-15), Medium (6-11), Low (<6)

3. **AI-Specific Risk Categories**
   - **Data Risks**: Bias, quality, poisoning, privacy breaches, provenance loss
   - **Model Risks**: Adversarial attacks, overfitting, drift, backdoors, explainability failures
   - **Deployment Risks**: Safety failures, reliability issues, security breaches, performance degradation
   - **Ethical Risks**: Unfairness, lack of transparency, accountability gaps, unintended consequences

4. **Risk Mitigation Strategies**
   - **Preventive**: Design choices preventing risk occurrence
   - **Detective**: Monitoring and testing to detect risks early
   - **Corrective**: Procedures to correct when risks occur
   - **Recovery**: Rollback and failover procedures

### Risk Management Architecture

```typescript
interface AIRiskManagementSystem {
  riskRegister: RiskRegister;
  assessmentMethodology: RiskAssessmentMethodology;
  mitigationStrategies: MitigationStrategy[];
  monitoring: RiskMonitoringSystem;
  governance: RiskGovernanceProcess;
}

interface RiskRegister {
  risks: AIRisk[];
  riskCategories: RiskCategory[];
  riskMatrix: RiskPriorityMatrix;
  updateFrequency: 'real-time' | 'daily' | 'weekly' | 'monthly';
}

interface AIRisk {
  id: string; // e.g., "RISK-AI-001"
  title: string;
  description: string;
  category: 'data' | 'model' | 'deployment' | 'ethical';
  lifecycle Phase: 'development' | 'validation' | 'deployment' | 'monitoring';
  
  // Assessment
  likelihood: 1 | 2 | 3 | 4 | 5;
  severity: 1 | 2 | 3 | 4 | 5;
  riskScore: number; // likelihood × severity
  priority: 'critical' | 'high' | 'medium' | 'low';
  
  // Ownership
  owner: string;
  reviewers: string[];
  lastAssessmentDate: Date;
  nextReviewDate: Date;
  
  // Mitigation
  mitigations: Mitigation[];
  residualRisk: number;
  status: 'identified' | 'assessed' | 'mitigating' | 'monitoring' | 'accepted' | 'closed';
  
  // Traceability
  relatedHazards: string[]; // ISO 14971 hazards if applicable
  relatedControls: string[]; // EN 18031 controls
  incidentHistory: Incident[];
}

interface Mitigation {
  id: string;
  type: 'preventive' | 'detective' | 'corrective' | 'recovery';
  description: string;
  implementation: string;
  effectiveness: number; // reduction in risk score
  cost: 'low' | 'medium' | 'high';
  timeline: string;
  status: 'planned' | 'in-progress' | 'implemented' | 'verified';
  verificationEvidence: string[];
}

interface RiskMonitoringSystem {
  indicators: RiskIndicator[];
  dashboards: RiskDashboard[];
  alerts: RiskAlert[];
  reportingSchedule: ReportingSchedule;
}

interface RiskIndicator {
  name: string;
  description: string;
  metric: string;
  threshold: number;
  currentValue: number;
  trend: 'improving' | 'stable' | 'degrading';
  linkedRisks: string[];
}
```

### AI-Specific Risk Assessment

**Data Risk Examples**:
```python
# Training data bias assessment
def assess_data_bias_risk(dataset, protected_attributes):
    """
    Assess risk of biased training data affecting model fairness
    """
    # Check representation balance
    representation_imbalance = calculate_representation_imbalance(
        dataset, protected_attributes
    )
    
    # Check label distribution
    label_bias_score = calculate_label_bias(
        dataset, protected_attributes
    )
    
    # Risk scoring
    if representation_imbalance > 0.3 or label_bias_score > 0.25:
        likelihood = 5  # Frequent - bias will affect model
        severity = 4    # Major - discriminatory outcomes likely
        risk_score = likelihood * severity  # 20 = Critical
        return {
            'risk_id': 'RISK-DATA-001',
            'risk': 'Training data bias leading to discriminatory model',
            'likelihood': likelihood,
            'severity': severity,
            'score': risk_score,
            'priority': 'critical',
            'mitigation_required': True
        }
    return None
```

**Model Risk Examples**:
```python
# Adversarial robustness risk assessment
def assess_adversarial_risk(model, test_data, attack_methods):
    """
    Assess risk of adversarial attacks causing model failures
    """
    from art.attacks.evasion import FastGradientMethod
    from art.estimators.classification import PyTorchClassifier
    
    # Test with FGSM attack
    attack = FastGradientMethod(estimator=model, eps=0.1)
    adversarial_examples = attack.generate(x=test_data)
    
    # Calculate accuracy drop
    original_accuracy = model.evaluate(test_data)
    adversarial_accuracy = model.evaluate(adversarial_examples)
    accuracy_drop = original_accuracy - adversarial_accuracy
    
    # Risk scoring
    if accuracy_drop > 0.15:  # >15% accuracy loss
        likelihood = 4  # Probable - attacks are feasible
        severity = 5    # Catastrophic - safety-critical system
        risk_score = 20  # Critical
        return {
            'risk_id': 'RISK-MODEL-001',
            'risk': 'Adversarial attacks cause critical misclassifications',
            'likelihood': likelihood,
            'severity': severity,
            'score': risk_score,
            'priority': 'critical',
            'mitigation': 'Adversarial training, input validation, ensemble methods'
        }
    return None
```

## Validation Strategy

### Testing Approach

1. **Risk Register Completeness Testing**
   - Verify all AI lifecycle phases have risk analysis
   - Check coverage of all risk categories (data, model, deployment, ethical)
   - Validate risk descriptions are specific and actionable
   - Test traceability to AI system components

2. **Risk Assessment Methodology Testing**
   - Validate likelihood and severity scoring consistency
   - Test risk matrix calculations
   - Verify risk prioritization logic
   - Check assessment documentation completeness

3. **Mitigation Effectiveness Testing**
   - Measure residual risk after mitigation implementation
   - Verify mitigation reduces risk to acceptable levels
   - Test mitigation verification procedures
   - Validate mitigation evidence collection

4. **Risk Monitoring System Testing**
   - Test real-time risk indicator tracking
   - Verify alert thresholds trigger appropriately
   - Check dashboard accuracy and timeliness
   - Validate periodic reassessment procedures

5. **Governance Integration Testing**
   - Test risk escalation workflows
   - Verify governance committee receives risk reports
   - Check risk acceptance approval workflows
   - Validate audit trail integrity

### Risk Management Testing

**Risk Register Quality Check**:
```python
def validate_risk_register(risk_register):
    """
    Validate risk register meets EN 18031 requirements
    """
    issues = []
    
    # Check completeness
    if len(risk_register.risks) == 0:
        issues.append("No risks identified - incomplete analysis")
    
    # Check categorization
    categories = set(r.category for r in risk_register.risks)
    required_categories = {'data', 'model', 'deployment', 'ethical'}
    if not required_categories.issubset(categories):
        issues.append(f"Missing risk categories: {required_categories - categories}")
    
    # Check assessment completeness
    for risk in risk_register.risks:
        if not risk.likelihood or not risk.severity:
            issues.append(f"Risk {risk.id} missing likelihood or severity")
        
        if risk.priority in ['critical', 'high'] and not risk.mitigations:
            issues.append(f"High-priority risk {risk.id} has no mitigations")
        
        if not risk.owner:
            issues.append(f"Risk {risk.id} has no assigned owner")
    
    # Check monitoring
    monitored_risks = [r for r in risk_register.risks if r.status == 'monitoring']
    if not risk_register.monitoring or len(monitored_risks) == 0:
        issues.append("No risk monitoring system configured")
    
    return {
        'valid': len(issues) == 0,
        'issues': issues,
        'risk_count': len(risk_register.risks),
        'high_priority_count': len([r for r in risk_register.risks if r.priority in ['critical', 'high']])
    }
```

## Evidence Requirements

### Required Documentation

**Risk Assessment Evidence**:
- AI Risk Register with all identified risks
- Risk assessment methodology documentation
- Likelihood and severity scoring criteria
- Risk matrix and prioritization rules
- Risk assessment records for each identified risk
- Risk traceability matrix (risks → hazards → controls)

**Mitigation Evidence**:
- Risk mitigation plans for high-priority risks
- Mitigation implementation records
- Mitigation effectiveness testing results
- Residual risk calculations
- Cost-benefit analysis for mitigation strategies
- Mitigation approval records

**Monitoring Evidence**:
- Risk monitoring dashboard and metrics
- Risk indicator definitions and thresholds
- Risk monitoring reports (weekly/monthly)
- Risk reassessment records (quarterly minimum)
- Incident reports linked to risks
- Trend analysis showing risk evolution

**Governance Evidence**:
- Governance committee risk review minutes
- Risk escalation records
- Risk acceptance approvals with rationale
- Executive risk summaries
- Stakeholder risk communications
- Audit findings related to risk management

### Evidence Collection and Retention

```yaml
risk_management_evidence:
  risk_register:
    format: YAML or database
    update_frequency: real-time
    retention: permanent
    
  risk_assessments:
    format: PDF with digital signatures
    update_frequency: quarterly_minimum
    retention: 7_years_post_decommission
    
  mitigation_plans:
    format: structured_documents
    approval_required: risk_owner_and_governance
    retention: 7_years
    
  monitoring_reports:
    format: automated_dashboards_and_reports
    frequency: weekly_summary_monthly_detailed
    retention: 3_years
    
  incident_records:
    format: incident_management_system
    linkage: risk_register_entries
    retention: 10_years
```

## Related Controls

### Within EN 18031

- **comp-en18031-001**: AI Governance Framework (governance enables risk management)
- **comp-en18031-009**: Training Data Quality (mitigates data risks)
- **comp-en18031-010**: Data Bias Detection (mitigates bias risks)
- **comp-en18031-019**: Model Adversarial Testing (mitigates security risks)
- **comp-en18031-023**: Model Drift Detection (mitigates deployment risks)

### Cross-Framework

- **comp-iso27001-006**: Information Security Risk Assessment (parallel risk process)
- **comp-iso14971-001**: Medical Device Risk Management (if AI in medical devices)
- **comp-gdpr-024**: Data Protection Impact Assessment (privacy risk integration)
- **comp-soc2-010**: Risk Assessment (trust services risk process)

### AI-Specific Standards

- **ISO/IEC 42001**: 6.1 Risk Assessment
- **ISO 24028**: AI trustworthiness characteristics and risks
- **ISO 23894**: AI risk management guidance
- **NIST AI RMF**: Govern and Manage functions
- **EU AI Act**: Article 9 (Risk Management System)

## Implementation Notes

### Best Practices

**Risk Identification**:
- Use AI-specific risk taxonomies (MITRE ATLAS, NIST AI RMF)
- Conduct threat modeling for AI systems (STRIDE-AI)
- Include ML engineers, data scientists, domain experts in risk workshops
- Review academic literature on AI failures and incidents
- Analyze near-misses and incidents from similar AI systems

**Risk Assessment**:
- Use quantitative methods where possible (failure rates, error rates)
- Consider cascading risks (one failure triggers others)
- Assess both technical and societal risks
- Factor in regulatory penalties for non-compliance
- Update severity as regulations evolve (EU AI Act enforcement)

**Risk Mitigation**:
- Prioritize preventive controls (design for safety from start)
- Layer mitigations (defense in depth)
- Test mitigation effectiveness before relying on them
- Document why specific mitigations were chosen
- Track mitigation costs and ROI

**Risk Monitoring**:
- Automate risk indicator collection where possible
- Set thresholds conservatively (fail-safe)
- Integrate risk monitoring with MLOps pipelines
- Trend risk indicators over time (detect degradation)
- Correlate risks with actual incidents

### Common Pitfalls

❌ **Generic Risk Statements**:
- Don't: "AI model may fail"
- Do: "Diagnostic AI misclassifies melanoma as benign due to underrepresentation of dark skin tones in training data"

❌ **Ignoring Cascading Risks**:
- Don't: Assess each risk in isolation
- Do: Model how one risk (e.g., data drift) triggers other risks (e.g., safety failures)

❌ **Static Risk Assessment**:
- Don't: Assess risks once during development
- Do: Continuously monitor and reassess as AI system evolves

❌ **Insufficient Mitigation**:
- Don't: Accept high residual risks without strong justification
- Do: Layer multiple mitigations until residual risk is acceptable

❌ **Poor Documentation**:
- Don't: Informal risk discussions without records
- Do: Comprehensive risk documentation with audit trails

### Recommended Tools

**Risk Register & Management**:
- **Credo AI**: AI-specific risk management platform
- **Arthur AI**: ML risk monitoring and management
- **Fiddler AI**: Model risk management
- **JIRA/ServiceNow**: Adapted for AI risk tracking

**Risk Assessment**:
- **MITRE ATLAS**: AI threat knowledge base
- **NIST AI RMF Playbook**: Risk assessment templates
- **IBM AI Fairness 360**: Bias risk assessment
- **Microsoft Counterfit**: Adversarial risk testing

**Risk Monitoring**:
- **Arize AI**: ML observability and drift detection
- **WhyLabs**: Data quality and model monitoring
- **Evidently AI**: ML monitoring with alerting
- **Prometheus + Grafana**: Custom risk metrics dashboards

**Documentation**:
- **Confluence/SharePoint**: Risk register documentation
- **Git**: Version-controlled risk assessments
- **Compliance management platforms**: OneTrust, TrustArc

## Status Checklist

- [ ] Risk management methodology documented and approved
- [ ] AI-specific risk taxonomy defined
- [ ] Risk register template created
- [ ] Risk assessment training completed for AI teams
- [ ] Initial AI risk identification workshop conducted
- [ ] Risk register populated with identified risks
- [ ] Likelihood and severity assessed for all risks
- [ ] High-priority risks have mitigation plans
- [ ] Mitigation strategies implemented and tested
- [ ] Risk monitoring system operational
- [ ] Risk dashboards available to governance committee
- [ ] Quarterly risk review process established
- [ ] Risk acceptance workflow defined and tested
- [ ] Risk documentation integrated with audit processes
- [ ] Risk management effectiveness measured (target: >85% risks mitigated within SLA)

---

**Implementation Timeline**: 2-4 months for full risk management system  
**Maintenance Effort**: 1-2 FTE ongoing for risk monitoring and governance  
**First Risk Review**: 30 days post-deployment for new AI systems  
**Risk Register Target**: >90% of AI systems with complete risk assessments
