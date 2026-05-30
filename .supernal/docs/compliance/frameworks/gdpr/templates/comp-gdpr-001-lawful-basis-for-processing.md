---
id: comp-gdpr-001-lawful-basis-for-processing
title: COMP-GDPR-001 - Lawful Basis for Processing
sidebar_label: COMP-GDPR-001 Lawful Basis
sidebar_position: 2
status: pending-verification
references: []
---

# COMP-GDPR-001: Lawful Basis for Processing

## Overview

**Purpose**: Legal basis identification and documentation  
**GDPR Article**: Article 6 - Lawfulness of Processing  
**Category**: data-processing, legal-basis  
**Priority**: High  
**Framework**: GDPR

## Description

Establishes procedures to identify, document, and maintain appropriate lawful basis for all personal data processing activities in accordance with GDPR Article 6.

## Acceptance Criteria

```gherkin
Feature: Lawful Basis for Data Processing
  As a data controller
  I want to establish lawful basis for processing
  So that I can comply with GDPR Article 6 requirements

  Background:
    Given the organization processes personal data
    And GDPR compliance is required
    And data processing activities are identified

  Scenario: Lawful Basis Identification
    Given personal data processing is planned
    When the processing purpose is defined
    And the data subject category is identified
    And processing context is analyzed
    Then appropriate lawful basis shall be identified
    And legal basis shall be documented
    And processing shall be limited to stated purpose

  Scenario: Consent as Lawful Basis
    Given consent is chosen as lawful basis
    When consent is requested from data subjects
    And consent mechanism is implemented
    And consent records are maintained
    Then consent shall be freely given
    And consent shall be specific and informed
    And consent withdrawal shall be possible

  Scenario: Legitimate Interest Assessment
    Given legitimate interest is considered
    When legitimate interest is identified
    And necessity test is performed
    And balancing test is conducted
    Then legitimate interest shall be documented
    And data subject rights shall be protected
    And opt-out mechanism shall be provided

  Scenario: Legal Obligation Processing
    Given legal obligation requires processing
    When legal requirement is identified
    And processing scope is defined
    And retention period is determined
    Then legal basis shall be documented
    And processing shall be limited to legal requirement
    And data subject shall be informed

  Scenario: Vital Interest Processing
    Given vital interest processing is required
    When life-threatening situation exists
    And other lawful basis is not available
    And processing is necessary for vital interest
    Then vital interest shall be documented
    And processing shall be limited to necessity
    And data subject shall be informed when possible
```

## Technical Context

### Implementation Requirements

- **Lawful Basis Register**: Comprehensive record of all processing activities and their lawful basis
- **Consent Management System**: Technical and organizational measures for obtaining and managing consent
- **Legitimate Interest Assessment (LIA)**: Documented assessment for legitimate interest processing
- **Data Subject Information**: Clear and transparent information about processing and lawful basis
- **Processing Records**: Detailed records of processing activities under Article 30
- **Legal Compliance Monitoring**: Ongoing monitoring of lawful basis validity

### System Architecture

```typescript
interface LawfulBasisManagement {
  lawfulBasisRegister: LawfulBasisRegister;
  consentManagement: ConsentManagementSystem;
  legitimateInterestAssessment: LegitimateInterestAssessment;
  dataSubjectInformation: DataSubjectInformation;
  processingRecords: ProcessingRecord[];
  complianceMonitoring: ComplianceMonitoring;
}

interface LawfulBasisRegister {
  processingActivities: ProcessingActivity[];
  lawfulBasisMapping: LawfulBasisMapping[];
  reviewSchedule: ReviewSchedule;
  updateProcedures: UpdateProcedure[];
}

interface ProcessingActivity {
  activityId: string;
  purpose: string;
  dataCategories: DataCategory[];
  dataSubjects: DataSubjectCategory[];
  lawfulBasis: LawfulBasis;
  retentionPeriod: RetentionPeriod;
  thirdPartySharing: ThirdPartySharing[];
}

enum LawfulBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests',
}
```

### Validation Strategy

1. **Legal Basis Assessment**: Systematic evaluation of appropriate lawful basis for each processing activity
2. **Documentation Review**: Verification of comprehensive lawful basis documentation
3. **Consent Validation**: Testing of consent mechanisms and record-keeping
4. **Legitimate Interest Testing**: Validation of legitimate interest assessments and balancing tests
5. **Ongoing Monitoring**: Regular review of lawful basis validity and processing changes

## Testing Strategy

### Compliance Testing

#### Lawful Basis Documentation

- Verify all processing activities have identified lawful basis
- Validate lawful basis register completeness and accuracy
- Test lawful basis change management procedures
- Verify data subject information accuracy

#### Consent Management Testing

- Test consent collection mechanisms
- Validate consent record storage and retrieval
- Test consent withdrawal functionality
- Verify consent renewal procedures

#### Legitimate Interest Testing

- Validate legitimate interest assessments
- Test balancing test documentation
- Verify opt-out mechanism functionality
- Test legitimate interest communication to data subjects

## Implementation Notes

### Prerequisites

- Data processing inventory and mapping
- Legal analysis of applicable lawful basis options
- Data protection impact assessment (DPIA) if required
- Privacy policy and data subject information updates

### Dependencies

- Data Minimization (REQ-GDPR-002)
- Purpose Limitation (REQ-GDPR-003)
- Consent Management (REQ-GDPR-015)
- Data Subject Rights (REQ-GDPR-006 to REQ-GDPR-010)

### Constraints

- Must comply with GDPR Article 6 requirements
- Must align with data protection principles in Article 5
- Must support data subject rights under Chapter III
- Must enable lawful basis changes and updates

## Definition of Done

### Technical Implementation

- [ ] **Lawful Basis Registry**: Database/system to track lawful basis for each processing activity
- [ ] **Consent Management System**: Technical implementation for collecting, storing, and managing consent
- [ ] **Data Subject Rights Portal**: Interface for data subjects to view and manage their data processing
- [ ] **Privacy Notice Generator**: Automated system to generate privacy notices with correct lawful basis
- [ ] **Processing Activity Monitor**: System to track and log all data processing activities

### Documentation Requirements

- [ ] **Lawful Basis Assessment Document**: Completed for all processing activities
- [ ] **Data Protection Impact Assessment (DPIA)**: Where required by Article 35
- [ ] **Legitimate Interest Assessment (LIA)**: For processing based on legitimate interests
- [ ] **Privacy Notices**: Updated with clear lawful basis information
- [ ] **Processing Activity Records**: Article 30 records with lawful basis details
- [ ] **Staff Training Materials**: GDPR lawful basis training documentation

### Compliance Validation

- [ ] **Legal Review**: External legal counsel approval of lawful basis assessments
- [ ] **Technical Testing**: Consent mechanisms and data subject rights functionality tested
- [ ] **Audit Trail**: Complete logging of all lawful basis decisions and changes
- [ ] **Monitoring Procedures**: Regular review and validation processes established
- [ ] **Incident Response**: Procedures for handling lawful basis challenges or changes

## Compliance Evidence

### Dashboard Integration

```yaml
# Dashboard metrics for REQ-GDPR-001
compliance_dashboard:
  gdpr_lawful_basis:
    requirement_id: 'REQ-GDPR-001'
    framework: 'gdpr'
    metrics:
      - name: 'processing_activities_with_lawful_basis'
        description: 'Percentage of processing activities with documented lawful basis'
        target: 100
        current: '{{lawful_basis_coverage}}'
        status: '{{compliance_status}}'
        evidence_file: 'evidence/gdpr/lawful-basis-registry.json'
      - name: 'consent_collection_rate'
        description: 'Percentage of consent-based processing with valid consent'
        target: 95
        current: '{{consent_rate}}'
        status: '{{consent_status}}'
        evidence_file: 'evidence/gdpr/consent-records/'
      - name: 'privacy_notices_updated'
        description: 'Percentage of privacy notices updated with lawful basis'
        target: 100
        current: '{{notice_update_percentage}}'
        status: '{{notice_status}}'
        evidence_file: 'evidence/gdpr/privacy-notices/'
    alerts:
      - condition: 'consent_rate < 90'
        severity: 'high'
        message: 'Consent collection rate below threshold'
      - condition: 'lawful_basis_coverage < 100'
        severity: 'critical'
        message: 'Processing activities without documented lawful basis'
```

### Required Documentation

- **Lawful Basis Register**: `evidence/gdpr/lawful-basis-registry.json` - Complete registry of all processing activities and their lawful basis
- **Consent Records**: `evidence/gdpr/consent-records/` - Directory containing consent collection records
- **DPIA Reports**: `evidence/gdpr/dpia-reports/` - Data Protection Impact Assessments
- **LIA Assessments**: `evidence/gdpr/lia-assessments/` - Legitimate Interest Assessments
- **Privacy Notices**: `evidence/gdpr/privacy-notices/` - Current privacy notices with lawful basis
- **Training Records**: `evidence/gdpr/training-records.json` - Staff training completion records
- **Legal Reviews**: `evidence/gdpr/legal-reviews/` - Legal counsel review and approval documents
- **Processing Records**: `evidence/gdpr/article-30-records/` - Article 30 GDPR processing records

### Audit Trail

- **Lawful basis identification and approval records** - `audit/gdpr/lawful-basis-decisions.log`
- **Consent collection and withdrawal records** - `audit/gdpr/consent-management.log`
- **Legitimate interest assessment and review records** - `audit/gdpr/lia-reviews.log`
- **Data subject information update history** - `audit/gdpr/privacy-notice-updates.log`
- **Processing activity change records** - `audit/gdpr/processing-changes.log`

### Automated Validation

```bash
# Generate compliance evidence for dashboard
sc compliance evidence --requirement=REQ-GDPR-001 --output=evidence/gdpr/

# Validate lawful basis compliance
sc compliance validate --framework=gdpr --requirement=REQ-GDPR-001

# Update dashboard metrics
sc dashboard update --metric=gdpr_lawful_basis --framework=gdpr

# Generate compliance report
sc compliance report --framework=gdpr --requirement=REQ-GDPR-001 --format=json
```

## Related Requirements

- REQ-GDPR-002: Data Minimization
- REQ-GDPR-003: Purpose Limitation
- REQ-GDPR-015: Consent Collection
- REQ-GDPR-016: Consent Withdrawal

_Note: Individual requirement template files are generated when using `sc init --framework=gdpr`_

## Usage Examples

### Dog-Fooding: Generate Real Compliance Documentation

This template is designed to be "dog-fooded" - used to generate actual compliance documentation for your own projects.

```bash
# Initialize a new project with GDPR compliance
sc init --framework=gdpr --name="Supernal Coding Platform"

# Generate this specific requirement for your project
sc req new --template=REQ-GDPR-001 --title="User Data Lawful Basis" --project="supernal-coding"

# Generate compliance evidence files
sc compliance evidence --requirement=REQ-GDPR-001 --project="supernal-coding"

# This creates:
# - evidence/gdpr/lawful-basis-registry.json
# - evidence/gdpr/consent-records/
# - evidence/gdpr/privacy-notices/
# - audit/gdpr/lawful-basis-decisions.log
```

### Real-World Implementation Example

```yaml
# Generated: evidence/gdpr/lawful-basis-registry.json
{
  'project': 'supernal-coding',
  'requirement': 'REQ-GDPR-001',
  'processing_activities':
    [
      {
        'activity_id': 'user-registration',
        'description': 'Collection of user account information',
        'lawful_basis': 'consent',
        'article_6_basis': '6(1)(a)',
        'data_categories': ['name', 'email', 'company'],
        'consent_mechanism': 'registration_form_checkbox',
        'evidence_file': 'evidence/gdpr/consent-records/user-registration.json',
      },
      {
        'activity_id': 'security-monitoring',
        'description': 'Monitoring for security threats and system abuse',
        'lawful_basis': 'legitimate_interest',
        'article_6_basis': '6(1)(f)',
        'data_categories': ['ip_address', 'access_logs', 'usage_patterns'],
        'lia_file': 'evidence/gdpr/lia-assessments/security-monitoring.json',
      },
    ],
  'compliance_status':
    {
      'coverage': 100,
      'last_review': '2024-11-03',
      'next_review': '2024-12-03',
    },
}
```

### Dashboard Integration Example

```javascript
// Generated dashboard component
const GDPRLawfulBasisWidget = {
  requirement: 'REQ-GDPR-001',
  title: 'GDPR Lawful Basis Compliance',
  metrics: [
    {
      name: 'Processing Activities Coverage',
      value: '100%',
      status: 'compliant',
      evidence: 'evidence/gdpr/lawful-basis-registry.json',
    },
    {
      name: 'Consent Collection Rate',
      value: '97%',
      status: 'compliant',
      evidence: 'evidence/gdpr/consent-records/',
    },
    {
      name: 'Privacy Notices Updated',
      value: '100%',
      status: 'compliant',
      evidence: 'evidence/gdpr/privacy-notices/',
    },
  ],
  alerts: [
    {
      type: 'info',
      message: 'Next lawful basis review due: December 3, 2024',
    },
  ],
};
```

### Compliance Checklist Generation

```bash
# Generate a compliance checklist for this requirement
sc compliance checklist --requirement=REQ-GDPR-001 --format=markdown

# Output: compliance/checklists/REQ-GDPR-001-checklist.md
```

**Generated Checklist:**

- [ ] Document lawful basis for user registration (Article 6(1)(a) - Consent)
- [ ] Document lawful basis for security monitoring (Article 6(1)(f) - Legitimate Interest)
- [ ] Implement consent collection mechanism for user registration
- [ ] Complete LIA for security monitoring processing
- [ ] Update privacy notice with lawful basis information
- [ ] Set up automated consent rate monitoring
- [ ] Schedule quarterly lawful basis review

### Validation and Testing

```bash
# Validate current compliance status
sc compliance validate --framework=gdpr --requirement=REQ-GDPR-001

# Run automated compliance tests
sc test compliance --requirement=REQ-GDPR-001

# Generate compliance report for auditors
sc compliance report --requirement=REQ-GDPR-001 --format=pdf --output=reports/
```

This template demonstrates how compliance requirements become living documentation that:

1. **Generates real evidence files** for your project
2. **Populates dashboard metrics** for ongoing monitoring
3. **Creates actionable checklists** for implementation teams
4. **Provides audit trails** for compliance validation
5. **Integrates with CI/CD** for continuous compliance monitoring
