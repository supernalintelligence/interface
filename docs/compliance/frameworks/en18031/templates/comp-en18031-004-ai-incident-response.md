---
id: comp-en18031-004-ai-incident-response
title: COMP-EN18031-004 - AI Incident Response
purpose: Establish systematic processes for detecting, responding to, and learning from AI system incidents
en18031Control: 5.1.4
category: ai-governance
priority: critical
framework: EN 18031
sidebar_label: COMP-EN18031-004
sidebar_position: 4
crossFramework:
  iso42001: 10.1 (Nonconformity and Corrective Action)
  euAiAct: Article 62 (Reporting of Serious Incidents)
  iso27035: Information Security Incident Management
  nistAiRmf: MANAGE-4.1, MANAGE-4.2
status: pending-verification
references: []
---

# COMP-EN18031-004: AI Incident Response

## Overview

**Purpose**: Establish systematic processes for detecting, responding to, investigating, and learning from AI system incidents and failures  
**EN 18031 Control**: 5.1.4 - AI Incident Response  
**Category**: ai-governance  
**Priority**: critical  
**Framework**: EN 18031

## Regulatory Context

### EN 18031 Alignment

- **5.1.4**: AI Incident Response - Systematic incident detection, response, and learning
- **Related Controls**:
  - 5.1.1: AI Governance Framework (incident response within governance)
  - 5.1.2: AI Risk Management (incidents inform risk assessments)
  - 5.1.3: AI Ethics Board (ethics board reviews serious incidents)
  - 5.6.1: Model Monitoring (monitoring detects incidents)

### Cross-Framework Mapping

- **ISO/IEC 42001**:
  - 10.1: Nonconformity and corrective action
  - 10.2: Continual improvement
  - 9.1: Monitoring, measurement, analysis, evaluation

- **EU AI Act**:
  - Article 62: Reporting of serious incidents and malfunctioning
  - Article 20: Corrective actions and duty of information
  - Article 72: Post-market monitoring system
  - Recital 86: Serious incidents reporting obligations

- **ISO 27035**:
  - Information security incident management process
  - Incident detection and reporting
  - Incident assessment and decision
  - Incident response and recovery

- **NIST AI RMF**:
  - MANAGE-4.1: Post-deployment monitoring maintained
  - MANAGE-4.2: Mechanisms for feedback and errors
  - GOVERN-3.2: Accountability structures established
  - MEASURE-4.3: Incidents logged and reviewed

## Description

Implements EN 18031 Section 5.1.4 to establish comprehensive AI incident response processes covering incident detection, classification, response, investigation, remediation, and organizational learning. The system ensures rapid response to AI failures, minimizes harm, maintains regulatory compliance, and drives continuous improvement.

The AI Incident Response system must address:

1. **Incident Detection**: Automated and manual mechanisms to identify AI failures
   - Automated monitoring alerts (accuracy drop, drift, bias)
   - User complaints and feedback channels
   - Internal staff escalations
   - External stakeholder reports
   - Regulatory notifications
   - Media and public reports

2. **Incident Classification**: Standardized severity and type categorization
   - **Severity Levels**:
     - **Critical**: Death, serious injury, major harm, regulatory breach
     - **High**: Significant harm, discrimination, privacy breach
     - **Medium**: Moderate impact, quality degradation
     - **Low**: Minor issues, cosmetic problems
   - **Incident Types**:
     - Safety failures (harm to users)
     - Bias/fairness incidents (discrimination)
     - Privacy breaches (data exposure)
     - Security incidents (adversarial attacks)
     - Performance degradation (accuracy drop)
     - Regulatory violations (non-compliance)

3. **Incident Response**: Immediate containment and mitigation actions
   - Incident triage and prioritization
   - Immediate containment (system halt, rollback)
   - Stakeholder notification (users, regulators, executives)
   - Emergency response team activation
   - Initial impact assessment
   - Communication protocols

4. **Incident Investigation**: Root cause analysis and evidence collection
   - Timeline reconstruction
   - Log analysis and data forensics
   - Root cause identification (5 Whys, Fishbone)
   - Contributing factors analysis
   - Similar incident pattern detection
   - Evidence preservation for regulatory compliance

5. **Remediation and Recovery**: Corrective actions and system restoration
   - Short-term fixes (patches, workarounds)
   - Long-term corrections (redesign, retraining)
   - Validation of fixes
   - Phased system restoration
   - Monitoring of remediated system
   - User communication and remediation

6. **Learning and Prevention**: Organizational learning and systemic improvements
   - Post-incident reviews (blameless postmortems)
   - Lessons learned documentation
   - Process improvements
   - Training updates
   - Risk register updates
   - Industry sharing (when appropriate)

## Acceptance Criteria

```gherkin
Feature: AI Incident Response System
  As an AI Operations Manager
  I want systematic processes for responding to AI incidents
  So that failures are detected quickly, harm is minimized, and learning drives improvement

  Background:
    Given organization operates AI systems in production
    And EN 18031 Section 5.1.4 compliance is required
    And incident response plan is documented and approved
    And incident response team is trained and ready

  Scenario: Automated Incident Detection via Monitoring Alert
    Given AI system "Loan Approval AI" is in production
    When automated monitoring detects fairness metric violation
    And demographic parity drops from 98% to 87% (threshold: 90%)
    And alert triggered: "CRITICAL: Fairness violation detected in Loan Approval AI"
    And alert includes:
      - Metric: Demographic parity (Black applicants)
      - Current value: 87%
      - Threshold: 90%
      - Time detected: 2025-12-13 14:32:00 UTC
      - Affected population: Black loan applicants (estimated 500 applications/day)
    Then incident shall be automatically created in incident management system
    And incident ID shall be generated: INC-2025-1234
    And incident severity shall be classified as "Critical" (fairness violation)
    And on-call incident response team shall be paged immediately
    And initial containment shall be triggered: System paused for new applications
    And stakeholders shall be notified: Product owner, Ethics board, Compliance

  Scenario: Incident Triage and Classification
    Given incident INC-2025-1234 created from fairness alert
    When incident response team reviews incident
    And team classifies incident:
      | Classification | Value |
      | Severity | Critical (discrimination risk) |
      | Type | Bias/Fairness Incident |
      | Impact Scope | Production - 500 applications/day |
      | Affected Stakeholders | Black loan applicants |
      | Regulatory Risk | EEOC violation potential |
      | Media Risk | High (public discrimination concern) |
    And team estimates:
      - Affected applications: ~500 in last 3 days (1,500 total)
      - Potential harm: Unfair denials, discrimination claims
      - Regulatory exposure: EEOC complaints, enforcement action
      - Reputational risk: High (public trust in AI fairness)
    Then incident priority shall be set to "P1 - Immediate Response"
    And incident response plan "Critical Fairness Incident" shall be activated
    And emergency response team shall be assembled:
      - Incident Commander (AI Operations Manager)
      - ML Engineer (model expert)
      - Data Scientist (fairness analysis)
      - Legal Counsel (regulatory exposure)
      - Communications (stakeholder notifications)
      - Ethics Board Representative
    And incident war room shall be established (virtual conference)

  Scenario: Immediate Containment Actions
    Given critical fairness incident INC-2025-1234 in progress
    When incident commander orders containment
    And containment actions executed:
      | Action | Status | Time |
      | Pause new loan applications | Complete | 14:35:00 |
      | Rollback to previous model version | Complete | 14:38:00 |
      | Activate human review for all decisions | Complete | 14:40:00 |
      | Freeze model deployment pipeline | Complete | 14:35:00 |
    And containment verified:
      - No new automated decisions being made ✓
      - Previous model (v2.3.1) restored ✓
      - Human reviewers activated (5 reviewers online) ✓
      - Deployment pipeline frozen ✓
    Then system shall be in "Incident Containment Mode"
    And incident log shall record all containment actions with timestamps
    And stakeholders shall be notified of containment status
    And service status page updated: "Loan approvals temporarily under manual review"

  Scenario: Stakeholder Notification
    Given critical incident INC-2025-1234 contained
    When stakeholder notification process initiated
    And notifications sent:
      | Stakeholder | Channel | Message | Time |
      | Affected Applicants | Email | "Your application under manual review" | 14:45:00 |
      | Product Owner | Phone/Email | "Critical fairness incident - system paused" | 14:35:00 |
      | Executive Leadership | Email/SMS | "P1 incident - fairness violation" | 14:36:00 |
      | Ethics Board Chair | Phone | "Critical fairness incident requires review" | 14:37:00 |
      | Legal/Compliance | Email | "Potential EEOC violation - incident INC-2025-1234" | 14:38:00 |
      | Regulators (if required) | Official channel | Per regulatory requirements | TBD |
    And communication templates used ensure consistency
    And all notifications logged in incident record
    Then stakeholders shall be informed within SLA timelines:
      - Critical stakeholders: 15 minutes ✓
      - Affected users: 30 minutes ✓
      - Regulators: As required by regulation
    And communication status tracked in incident dashboard

  Scenario: Incident Investigation and Root Cause Analysis
    Given incident INC-2025-1234 contained, investigation phase begins
    When investigation team conducts root cause analysis
    And timeline reconstructed:
      | Time | Event |
      | 2025-12-10 09:00 | Model v2.4.0 deployed (fairness validated pre-deployment) |
      | 2025-12-10-12 | Data pipeline updated (new data source added) |
      | 2025-12-13 14:00 | Fairness drift detected (demographic parity 87%) |
      | 2025-12-13 14:32 | Alert triggered, incident created |
    And data analysis reveals:
      - New data source introduced sampling bias (geographic skew)
      - Training data representativeness dropped from 95% to 78%
      - Model retrained on biased data automatically (CI/CD pipeline)
      - Fairness validation in CI/CD pipeline had threshold set to 85% (too permissive)
    And root cause identified using 5 Whys:
      - **Why did fairness drop?** Model trained on biased data
      - **Why was data biased?** New data source had geographic sampling bias
      - **Why wasn't bias detected?** Fairness validation threshold too permissive (85%)
      - **Why was threshold permissive?** Manual configuration error during pipeline update
      - **Why wasn't error caught?** No peer review required for pipeline config changes
    Then root cause documented: "CI/CD pipeline fairness threshold misconfigured + no peer review"
    And contributing factors identified:
      - New data source added without bias audit
      - Automated retraining without human oversight gate
      - Insufficient monitoring of data quality metrics
    And investigation report created with evidence, timeline, root cause

  Scenario: Remediation Planning and Implementation
    Given root cause identified for incident INC-2025-1234
    When remediation plan developed
    And short-term fixes implemented:
      | Fix | Timeline | Status |
      | Restore fairness validation threshold to 90% | Immediate | Complete |
      | Revert to previous data source | 24 hours | Complete |
      | Manual review all decisions from 2025-12-10 to 2025-12-13 | 7 days | In Progress |
      | Notify affected applicants of re-review | 3 days | In Progress |
    And long-term corrective actions planned:
      | Action | Owner | Deadline |
      | Implement peer review for all pipeline config changes | DevOps Lead | 2025-12-20 |
      | Add data source bias audits before integration | Data Team | 2025-12-27 |
      | Enhance monitoring: data quality + fairness real-time | ML Ops | 2026-01-10 |
      | Mandatory human review gate for model deployments | ML Lead | 2025-12-20 |
      | Update incident response training with case study | Training Team | 2026-01-15 |
    And remediation validated:
      - New model (v2.4.1) trained on original data source
      - Fairness metrics validated: demographic parity 96% ✓
      - Peer review process enforced for pipeline configs ✓
      - Human approval gate added to deployment pipeline ✓
    Then remediation plan approved by incident commander and ethics board
    And system restoration planned: Phased rollout with enhanced monitoring
    And remediation tracking integrated with incident record

  Scenario: Phased System Restoration
    Given incident INC-2025-1234 remediation complete and validated
    When phased restoration plan executed
    And restoration phases:
      | Phase | Scope | Monitoring | Go/No-Go Decision |
      | Phase 1 | 10% traffic, enhanced monitoring | 24 hours | Go (no issues) |
      | Phase 2 | 50% traffic, continued monitoring | 48 hours | Go (metrics stable) |
      | Phase 3 | 100% traffic, standard monitoring | 72 hours | Go (full restoration) |
    And each phase monitored for:
      - Fairness metrics (demographic parity, equalized odds)
      - Performance metrics (accuracy, precision, recall)
      - User feedback and complaints
      - System stability and errors
    And phase 1 results:
      - Demographic parity: 96% (threshold: 90%) ✓
      - User complaints: 0 ✓
      - System errors: 0 ✓
      - Performance: Nominal ✓
    Then system fully restored to production
    And "Incident Containment Mode" lifted
    And enhanced monitoring maintained for 30 days
    And incident status updated to "Resolved - Monitoring"

  Scenario: Post-Incident Review (Blameless Postmortem)
    Given incident INC-2025-1234 resolved, system restored
    When post-incident review conducted (within 7 days of resolution)
    And review team includes:
      - Incident Commander
      - All response team members
      - Engineering leadership
      - Ethics board representative
      - Independent facilitator (blameless culture)
    And review covers:
      - **Timeline**: What happened and when?
      - **Root Cause**: Why did it happen?
      - **Response**: What went well in response?
      - **Gaps**: What could be improved?
      - **Lessons**: What did we learn?
      - **Actions**: What will we change?
    And key findings documented:
      | Finding | Impact |
      | Detection was fast (automated monitoring) | Positive - limited exposure |
      | Containment was effective | Positive - prevented further harm |
      | Root cause analysis thorough | Positive - systemic fix identified |
      | Pipeline config lacked review | Negative - process gap |
      | Data source integration not audited | Negative - process gap |
    And action items identified:
      - Implement peer review for all pipeline changes (DONE)
      - Add data source bias audits (IN PROGRESS)
      - Enhance real-time monitoring (IN PROGRESS)
      - Update training with case study (PLANNED)
      - Share learnings with industry (ethics board review required)
    Then post-incident review report published internally
    And lessons learned integrated into training materials
    And process improvements tracked to completion
    And incident formally closed in incident management system

  Scenario: Regulatory Reporting (Serious Incident)
    Given incident INC-2025-1234 classified as serious (fairness violation)
    When regulatory reporting obligations triggered
    And applicable regulations reviewed:
      | Regulation | Reporting Requirement | Timeline |
      | EEOC | Potential discrimination complaint | As filed by complainants |
      | EU AI Act Article 62 | Serious incident report to market surveillance | 15 days |
      | State AI Laws | Algorithmic impact assessment update | 30 days |
    And regulatory report prepared including:
      - Incident description and timeline
      - Root cause and contributing factors
      - Impact assessment (affected individuals, potential harm)
      - Remediation actions taken
      - Preventive measures implemented
      - Validation of remediation effectiveness
    And legal review completed
    Then regulatory reports filed within required timelines
    And copies maintained in compliance documentation
    And regulator inquiries handled by legal/compliance team
    And regulatory reporting tracked in incident record

  Scenario: Organizational Learning and Prevention
    Given incident INC-2025-1234 closed, post-incident review complete
    When organizational learning process initiated
    And lessons learned documented:
      - **Lesson 1**: Automated model deployment pipelines need human oversight gates
      - **Lesson 2**: Data source integrations require bias audits before use
      - **Lesson 3**: Fairness validation thresholds must be strictly enforced
      - **Lesson 4**: Configuration changes need peer review to prevent errors
      - **Lesson 5**: Enhanced monitoring detects issues early (value demonstrated)
    And process improvements implemented:
      - Updated deployment pipeline: mandatory human approval gate
      - New process: data source bias audit checklist
      - Enhanced monitoring: real-time fairness + data quality dashboards
      - Updated configuration management: peer review required
      - Training program: incident case study added
    And risk register updated:
      - New risk: "Data source sampling bias" (mitigated by audit process)
      - Risk mitigation: "Fairness validation threshold misconfiguration" (mitigated by peer review)
    And knowledge sharing:
      - Internal: Case study presented at all-hands meeting
      - Training: Incident added to AI ethics training curriculum
      - Industry: Anonymized lessons shared at AI ethics conference (with approval)
    Then organizational resilience improved
    And similar incidents prevented through systemic changes
    And incident formally archived with full documentation

  Scenario: Incident Metrics and Reporting
    Given fiscal year complete, annual incident review conducted
    When incident metrics compiled
    And annual statistics:
      | Metric | Count |
      | Total Incidents | 18 |
      | Critical | 2 |
      | High | 5 |
      | Medium | 8 |
      | Low | 3 |
    And incident type breakdown:
      | Type | Count |
      | Performance Degradation | 7 |
      | Bias/Fairness | 3 |
      | Security | 2 |
      | Privacy | 1 |
      | Safety | 1 |
      | Regulatory | 4 |
    And response metrics:
      - Mean time to detect (MTTD): 2.3 hours
      - Mean time to contain (MTTC): 45 minutes
      - Mean time to resolve (MTTR): 5.2 days
      - Repeat incidents: 1 (5.5%)
    Then annual incident report presented to executive leadership
    And incident trends analyzed for systemic patterns
    And incident response process effectiveness assessed
    And improvements identified for next year
```

## Technical Context

### Implementation Requirements

**Incident Response System Components**:

1. **Incident Management Platform**
   - Incident ticketing system
   - Automated alert integration
   - Incident workflow management
   - Communication templates
   - Documentation repository
   - Metrics and reporting

2. **Detection Mechanisms**
   - Automated monitoring alerts (model performance, fairness, drift)
   - User complaint channels (support tickets, feedback forms)
   - Internal escalation pathways (staff reports)
   - External reporting (regulators, media, public)

3. **Response Team Structure**
   - Incident Commander (decision authority)
   - Technical responders (ML engineers, data scientists)
   - Business stakeholders (product owners, legal, compliance)
   - Communications (internal and external messaging)
   - Ethics representative (for serious incidents)

4. **Response Playbooks**
   - Incident classification matrix
   - Severity-based response procedures
   - Containment action checklists
   - Notification templates
   - Investigation methodologies
   - Remediation workflows

### Incident Response Architecture

```typescript
interface AIIncidentResponseSystem {
  incidentManagement: IncidentManagementPlatform;
  detection: DetectionMechanisms;
  classification: IncidentClassification;
  response: ResponseProcess;
  investigation: InvestigationFramework;
  remediation: RemediationProcess;
  learning: OrganizationalLearning;
}

interface Incident {
  id: string; // INC-2025-1234
  title: string;
  description: string;
  detectionSource: 'automated' | 'user_report' | 'internal' | 'external' | 'regulator';
  detectedAt: Date;
  detectedBy: string;
  
  // Classification
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'safety' | 'bias_fairness' | 'privacy' | 'security' | 'performance' | 'regulatory';
  impactScope: string;
  affectedStakeholders: string[];
  regulatoryRisk: 'none' | 'low' | 'medium' | 'high' | 'critical';
  
  // Status
  status: 'detected' | 'triaged' | 'contained' | 'investigating' | 'remediating' | 'resolved' | 'closed';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  
  // Response
  incidentCommander: string;
  responseTeam: ResponseTeamMember[];
  containmentActions: ContainmentAction[];
  notifications: Notification[];
  
  // Investigation
  timeline: TimelineEvent[];
  rootCause?: RootCause;
  contributingFactors: string[];
  evidence: Evidence[];
  
  // Remediation
  remediationPlan?: RemediationPlan;
  remediationActions: RemediationAction[];
  validationResults?: ValidationResult[];
  
  // Learning
  postIncidentReview?: PostIncidentReview;
  lessonsLearned: LessonLearned[];
  processImprovements: ProcessImprovement[];
  
  // Compliance
  regulatoryReporting: RegulatoryReport[];
  
  // Metrics
  metrics: IncidentMetrics;
}

interface IncidentClassification {
  severity: SeverityLevel;
  type: IncidentType;
  impactAssessment: ImpactAssessment;
  regulatoryExposure: RegulatoryExposure;
}

interface SeverityLevel {
  level: 'critical' | 'high' | 'medium' | 'low';
  criteria: string;
  responseTime: string; // e.g., "15 minutes"
  escalationPath: string[];
}

interface ContainmentAction {
  id: string;
  action: string; // "Pause system", "Rollback model", "Activate human review"
  executedBy: string;
  executedAt: Date;
  status: 'planned' | 'in-progress' | 'complete' | 'failed';
  verificationMethod: string;
  verificationResult?: string;
}

interface RootCause {
  description: string;
  methodology: '5_whys' | 'fishbone' | 'fault_tree' | 'other';
  analysis: string;
  contributingFactors: ContributingFactor[];
  systemicIssues: string[];
}

interface ContributingFactor {
  factor: string;
  category: 'technical' | 'process' | 'organizational' | 'external';
  description: string;
  preventable: boolean;
}

interface RemediationPlan {
  id: string;
  shortTermFixes: Fix[];
  longTermCorrections: Correction[];
  validationApproach: string;
  restorationPlan: RestorationPlan;
  timeline: string;
  approvedBy: string[];
}

interface RestorationPlan {
  phases: RestorationPhase[];
  monitoringRequirements: string[];
  rollbackCriteria: string[];
  goNoGoCriteria: string[];
}

interface RestorationPhase {
  phase: number;
  scope: string; // "10% traffic", "50% traffic", "100% traffic"
  duration: string;
  monitoring: string[];
  goNoGoDecision: 'pending' | 'go' | 'no-go';
  decisionRationale?: string;
}

interface PostIncidentReview {
  conductedDate: Date;
  facilitator: string;
  participants: string[];
  whatWentWell: string[];
  whatCouldBeImproved: string[];
  lessonsLearned: LessonLearned[];
  actionItems: ActionItem[];
  reportPublished: boolean;
}

interface LessonLearned {
  id: string;
  lesson: string;
  category: 'detection' | 'response' | 'investigation' | 'remediation' | 'prevention';
  actionable: boolean;
  processImprovement?: string;
  trainingUpdate?: string;
}

interface IncidentMetrics {
  detectionTime: number; // seconds from occurrence to detection
  containmentTime: number; // seconds from detection to containment
  resolutionTime: number; // seconds from detection to resolution
  affectedUsers: number;
  financialImpact?: number;
  reputationalImpact: 'none' | 'low' | 'medium' | 'high' | 'critical';
}
```

### Incident Response Workflow

**Automated Incident Creation**:
```python
def create_incident_from_alert(alert):
    """
    Automatically create incident from monitoring alert
    """
    incident = {
        'id': generate_incident_id(),
        'title': f"{alert['severity']}: {alert['metric']} violation in {alert['system']}",
        'description': alert['description'],
        'detectionSource': 'automated',
        'detectedAt': datetime.now(),
        'detectedBy': 'monitoring_system',
        'severity': map_alert_severity_to_incident_severity(alert['severity']),
        'type': classify_incident_type(alert),
        'status': 'detected',
        'priority': determine_priority(alert['severity'], alert['impact']),
        'aiSystem': alert['system'],
        'metrics': alert['metrics'],
        'affectedStakeholders': estimate_affected_stakeholders(alert)
    }
    
    # Automatic containment for critical incidents
    if incident['severity'] == 'critical':
        trigger_automatic_containment(incident)
    
    # Page on-call team
    page_incident_response_team(incident)
    
    # Create incident ticket
    incident_id = incident_management_system.create_incident(incident)
    
    return incident_id

def map_alert_severity_to_incident_severity(alert_severity):
    """
    Map monitoring alert severity to incident severity
    """
    mapping = {
        'CRITICAL': 'critical',
        'WARNING': 'high',
        'INFO': 'medium'
    }
    return mapping.get(alert_severity, 'medium')

def classify_incident_type(alert):
    """
    Classify incident type based on alert characteristics
    """
    if 'fairness' in alert['metric'].lower() or 'bias' in alert['metric'].lower():
        return 'bias_fairness'
    elif 'accuracy' in alert['metric'].lower() or 'performance' in alert['metric'].lower():
        return 'performance'
    elif 'drift' in alert['metric'].lower():
        return 'performance'
    elif 'security' in alert['metric'].lower():
        return 'security'
    elif 'privacy' in alert['metric'].lower():
        return 'privacy'
    else:
        return 'other'

def trigger_automatic_containment(incident):
    """
    Automatic containment for critical incidents
    """
    if incident['severity'] == 'critical':
        actions = [
            {
                'action': 'Pause new requests to AI system',
                'system': incident['aiSystem'],
                'automated': True
            },
            {
                'action': 'Freeze model deployment pipeline',
                'system': incident['aiSystem'],
                'automated': True
            },
            {
                'action': 'Activate enhanced logging',
                'system': incident['aiSystem'],
                'automated': True
            }
        ]
        
        for action in actions:
            execute_containment_action(action, incident['id'])
```

**Root Cause Analysis (5 Whys)**:
```python
def conduct_5_whys_analysis(incident):
    """
    Interactive 5 Whys root cause analysis
    """
    problem_statement = incident['description']
    
    whys = []
    current_why = problem_statement
    
    for i in range(5):
        why = input(f"Why #{i+1}: Why did {current_why}? ")
        whys.append({
            'level': i + 1,
            'question': f"Why did {current_why}?",
            'answer': why
        })
        current_why = why
    
    root_cause = {
        'methodology': '5_whys',
        'problem_statement': problem_statement,
        'analysis': whys,
        'root_cause': whys[-1]['answer'],
        'conducted_by': incident['incident_commander'],
        'conducted_at': datetime.now()
    }
    
    return root_cause
```

**Incident Metrics Calculation**:
```python
def calculate_incident_metrics(incident):
    """
    Calculate key incident response metrics
    """
    metrics = {}
    
    # Mean Time To Detect (MTTD)
    if incident['occurrence_time'] and incident['detected_at']:
        metrics['MTTD'] = (incident['detected_at'] - incident['occurrence_time']).total_seconds() / 60  # minutes
    
    # Mean Time To Contain (MTTC)
    if incident['detected_at'] and incident['contained_at']:
        metrics['MTTC'] = (incident['contained_at'] - incident['detected_at']).total_seconds() / 60  # minutes
    
    # Mean Time To Resolve (MTTR)
    if incident['detected_at'] and incident['resolved_at']:
        metrics['MTTR'] = (incident['resolved_at'] - incident['detected_at']).total_seconds() / 3600  # hours
    
    # Impact metrics
    metrics['affected_users'] = incident.get('affected_users', 0)
    metrics['financial_impact'] = incident.get('financial_impact', 0)
    metrics['reputational_impact'] = incident.get('reputational_impact', 'none')
    
    # Response effectiveness
    metrics['containment_effective'] = incident.get('containment_effective', False)
    metrics['root_cause_identified'] = incident.get('root_cause') is not None
    metrics['preventive_actions_taken'] = len(incident.get('process_improvements', []))
    
    return metrics
```

## Validation Strategy

### Testing Approach

1. **Incident Detection Testing**
   - Test automated alert creation
   - Validate severity classification
   - Test manual incident reporting workflows
   - Verify incident deduplication

2. **Response Workflow Testing**
   - Simulate critical incident response
   - Test containment automation
   - Validate notification delivery
   - Test escalation procedures

3. **Investigation Process Testing**
   - Practice root cause analysis methodologies
   - Test evidence collection procedures
   - Validate timeline reconstruction
   - Test collaboration tools

4. **Remediation Testing**
   - Test phased restoration procedures
   - Validate remediation effectiveness
   - Test rollback procedures
   - Verify monitoring integration

5. **Learning Process Testing**
   - Conduct post-incident review simulations
   - Test lessons learned documentation
   - Validate process improvement tracking
   - Test training integration

### Incident Response Drills

**Tabletop Exercise**:
```yaml
incident_response_drill:
  scenario: "Critical Fairness Violation"
  objectives:
    - Test incident detection and triage
    - Practice containment procedures
    - Validate communication protocols
    - Exercise root cause analysis
  
  participants:
    - Incident Commander
    - ML Engineers
    - Data Scientists
    - Legal/Compliance
    - Communications
    - Ethics Board Rep
  
  timeline:
    - "T+0: Monitoring alert fires (demographic parity drops to 82%)"
    - "T+5min: Incident created, team paged"
    - "T+10min: Team assembles, triage begins"
    - "T+15min: Containment actions ordered"
    - "T+30min: System contained, investigation starts"
    - "T+2hrs: Root cause identified"
    - "T+1day: Remediation plan approved"
    - "T+3days: System restored with monitoring"
  
  evaluation_criteria:
    - Response time: <15 minutes to containment
    - Communication: All stakeholders notified
    - Root cause: Identified and documented
    - Remediation: Plan approved and effective
    - Learning: Lessons documented
```

## Evidence Requirements

### Required Documentation

**Incident Records**:
- Incident reports for all incidents (detection, classification, response)
- Timeline reconstruction and chronology
- Root cause analysis reports
- Evidence logs and data forensics
- Containment action records
- Notification logs

**Remediation Evidence**:
- Remediation plans (short-term and long-term)
- Validation test results
- Phased restoration records
- Monitoring data during restoration
- Final resolution verification

**Learning Evidence**:
- Post-incident review reports (blameless postmortems)
- Lessons learned documentation
- Process improvement tracking
- Training updates (case studies)
- Risk register updates

**Regulatory Evidence**:
- Regulatory incident reports (EU AI Act Article 62, etc.)
- Compliance documentation
- Stakeholder communications
- Corrective action verification

### Evidence Collection and Retention

```yaml
incident_response_evidence:
  incident_reports:
    format: Structured JSON + PDF report
    retention: 10 years
    
  investigation_records:
    format: Timeline, root cause analysis, evidence logs
    retention: 10 years post-resolution
    
  remediation_plans:
    format: Approved documents with signatures
    retention: 7 years
    
  post_incident_reviews:
    format: Meeting minutes, lessons learned
    retention: Permanent (organizational knowledge)
    
  regulatory_reports:
    format: Official regulatory filings
    retention: Per regulatory requirements (typically 10+ years)
```

## Related Controls

### Within EN 18031

- **comp-en18031-001**: AI Governance Framework (incident response within governance)
- **comp-en18031-002**: AI Risk Management (incidents inform risk assessments)
- **comp-en18031-003**: AI Ethics Board (reviews serious incidents)
- **comp-en18031-023**: Model Drift Detection (monitoring detects incidents)
- **comp-en18031-029**: Model Monitoring (continuous monitoring for incident detection)

### Cross-Framework

- **comp-iso27035-001**: Security Incident Management (parallel process for security incidents)
- **comp-iso42001-010**: Nonconformity and Corrective Action (ISO 42001 incident handling)
- **comp-soc2-020**: Incident Response (trust services incident response)

### AI-Specific Standards

- **ISO/IEC 42001**: 10.1 Nonconformity and Corrective Action
- **ISO 27035**: Information Security Incident Management
- **EU AI Act**: Article 62 (Reporting of Serious Incidents)
- **NIST AI RMF**: MANAGE-4.1, MANAGE-4.2 (Incident management and feedback)

## Implementation Notes

### Best Practices

**Detection**:
- Automate incident detection through monitoring
- Provide multiple reporting channels (users, staff, external)
- Use severity-based alert thresholds
- Deduplicate similar incidents
- Maintain low false positive rate (alert fatigue)

**Response**:
- Pre-define containment actions for common scenarios
- Automate containment for critical incidents
- Communicate early and often (transparency)
- Empower incident commander with decision authority
- Balance speed with thoroughness

**Investigation**:
- Use structured methodologies (5 Whys, Fishbone, Fault Tree)
- Preserve evidence (logs, data, configurations)
- Reconstruct timeline accurately
- Identify systemic issues, not just proximate causes
- Avoid blame culture (focus on systems and processes)

**Remediation**:
- Prioritize short-term safety over long-term optimization
- Validate fixes rigorously before restoration
- Use phased rollout with enhanced monitoring
- Have rollback plans ready
- Document remediation effectiveness

**Learning**:
- Conduct post-incident reviews within 7 days
- Use blameless postmortem format
- Focus on systemic improvements, not individual blame
- Track process improvements to completion
- Share learnings (internal and industry, when appropriate)

### Common Pitfalls

❌ **Delayed Detection**: Insufficient monitoring leads to late incident discovery  
✅ **Solution**: Comprehensive automated monitoring with real-time alerts

❌ **Slow Containment**: Hesitation to halt systems causes more harm  
✅ **Solution**: Pre-approved containment procedures, automate for critical incidents

❌ **Blame Culture**: Fear of repercussions prevents honest analysis  
✅ **Solution**: Blameless postmortems, focus on systems not individuals

❌ **Incomplete Investigation**: Stopping at proximate cause misses systemic issues  
✅ **Solution**: Use structured root cause analysis (5 Whys, Fishbone), identify contributing factors

❌ **No Follow-Through**: Lessons learned documented but not implemented  
✅ **Solution**: Track process improvements with owners and deadlines, verify completion

### Recommended Tools

**Incident Management**:
- **PagerDuty**: On-call management and incident response
- **Opsgenie**: Alert management and escalation
- **VictorOps**: Incident response collaboration
- **JIRA Service Management**: Incident ticketing

**Investigation**:
- **ELK Stack**: Log aggregation and analysis
- **Datadog**: Monitoring and forensics
- **Splunk**: Log analysis and correlation

**Communication**:
- **Slack**: Team collaboration and war rooms
- **Zoom/Teams**: Virtual incident war rooms
- **Status Page**: Public incident status updates

**Documentation**:
- **Confluence**: Post-incident reviews and lessons learned
- **Notion**: Incident documentation repository
- **Git**: Version-controlled incident playbooks

## Status Checklist

- [ ] Incident response plan documented and approved
- [ ] Incident severity classification defined
- [ ] Incident response team roles assigned
- [ ] On-call rotation established
- [ ] Incident management platform configured
- [ ] Automated incident creation from monitoring alerts tested
- [ ] Containment playbooks created (by incident type)
- [ ] Notification templates created and tested
- [ ] Investigation methodologies documented (5 Whys, Fishbone, etc.)
- [ ] Root cause analysis training completed
- [ ] Remediation workflow established
- [ ] Phased restoration procedures documented
- [ ] Post-incident review process defined
- [ ] Blameless postmortem training completed
- [ ] Incident response drills conducted (quarterly minimum)
- [ ] Regulatory reporting procedures established
- [ ] Incident metrics dashboard created
- [ ] Annual incident review process scheduled

---

**Implementation Timeline**: 2-3 months for full incident response system  
**Maintenance Effort**: 0.5-1 FTE for incident response coordination  
**Drill Frequency**: Quarterly tabletop exercises + annual full-scale drill  
**Review Frequency**: Weekly incident review meetings, annual comprehensive review
