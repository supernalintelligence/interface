---
id: gdpr-templates
title: GDPR Template Requirements
sidebar_label: Templates
sidebar_position: 1
---

# GDPR Template Requirements

The following template requirements are automatically generated when initializing a project with `sc init --framework=gdpr`. Each requirement follows the standard See requirement template in supernal-code-package format with GDPR-specific content.

## Data Processing Principles Requirements

### [REQ-GDPR-001: Lawful Basis for Processing](./comp-gdpr-001-lawful-basis-for-processing.md)

**Purpose**: Legal basis identification and documentation  
**GDPR Article**: Article 6 - Lawfulness of Processing  
**Category**: data-processing, legal-basis  
**Priority**: High

Establishes procedures to identify, document, and maintain appropriate lawful basis for all personal data processing activities in accordance with GDPR Article 6.

### [REQ-GDPR-002: Data Minimization](./comp-gdpr-002-data-minimization.md)

**Purpose**: Data collection limitation implementation  
**GDPR Article**: Article 5(1)(c) - Data Minimization  
**Category**: data-processing, minimization  
**Priority**: High

Implements data minimization principles ensuring personal data is adequate, relevant, and limited to what is necessary for the specified processing purposes.

### [REQ-GDPR-003: Purpose Limitation](./comp-gdpr-003-purpose-limitation.md)

**Purpose**: Processing purpose controls and restrictions  
**GDPR Article**: Article 5(1)(b) - Purpose Limitation  
**Category**: data-processing, purpose  
**Priority**: High

Ensures personal data is collected for specified, explicit, and legitimate purposes and not further processed in a manner incompatible with those purposes.

### [REQ-GDPR-004: Data Accuracy](./comp-gdpr-004-data-accuracy.md)

**Purpose**: Data accuracy maintenance procedures  
**GDPR Article**: Article 5(1)(d) - Accuracy  
**Category**: data-processing, accuracy  
**Priority**: Medium

Implements procedures to ensure personal data is accurate and, where necessary, kept up to date with appropriate measures to rectify or erase inaccurate data.

### [REQ-GDPR-005: Storage Limitation](./comp-gdpr-005-storage-limitation.md)

**Purpose**: Data retention and deletion procedures  
**GDPR Article**: Article 5(1)(e) - Storage Limitation  
**Category**: data-processing, retention  
**Priority**: High

Establishes data retention policies ensuring personal data is kept only for as long as necessary for the specified processing purposes.

## Data Subject Rights Requirements

### [REQ-GDPR-006: Right of Access](./comp-gdpr-006-right-of-access.md)

**Purpose**: Data access request handling and response  
**GDPR Article**: Article 15 - Right of Access  
**Category**: subject-rights, access  
**Priority**: High

Implements procedures to handle data subject access requests, providing individuals with information about processing and copies of their personal data.

### [REQ-GDPR-007: Right to Rectification](./comp-gdpr-007-right-to-rectification.md)

**Purpose**: Data correction and update procedures  
**GDPR Article**: Article 16 - Right to Rectification  
**Category**: subject-rights, rectification  
**Priority**: High

Establishes procedures to enable data subjects to obtain rectification of inaccurate personal data and completion of incomplete data.

### [REQ-GDPR-008: Right to Erasure](./comp-gdpr-008-right-to-erasure.md)

**Purpose**: Right to be forgotten implementation  
**GDPR Article**: Article 17 - Right to Erasure  
**Category**: subject-rights, erasure  
**Priority**: High

Implements the right to erasure ("right to be forgotten") enabling data subjects to obtain deletion of their personal data under specified circumstances.

### [REQ-GDPR-009: Data Portability](./comp-gdpr-009-right-to-data-portability.md)

**Purpose**: Data export and transfer functionality  
**GDPR Article**: Article 20 - Right to Data Portability  
**Category**: subject-rights, portability  
**Priority**: Medium

Enables data subjects to receive their personal data in a structured, commonly used, and machine-readable format and transmit it to another controller.

### [REQ-GDPR-010: Right to Object](./comp-gdpr-010-right-to-object.md)

**Purpose**: Processing objection handling procedures  
**GDPR Article**: Article 21 - Right to Object  
**Category**: subject-rights, objection  
**Priority**: Medium

Implements procedures to handle data subject objections to processing, including direct marketing and processing based on legitimate interests.

## Technical and Organizational Measures

### [REQ-GDPR-011: Privacy by Design](./comp-gdpr-011-privacy-by-design.md)

**Purpose**: Privacy by design implementation  
**GDPR Article**: Article 25 - Data Protection by Design and by Default  
**Category**: technical-measures, privacy-design  
**Priority**: High

Implements privacy by design principles, integrating data protection measures into system design and development from the earliest stages.

### [REQ-GDPR-012: Privacy by Default](./comp-gdpr-012-privacy-by-default.md)

**Purpose**: Privacy by default configuration  
**GDPR Article**: Article 25 - Data Protection by Design and by Default  
**Category**: technical-measures, privacy-default  
**Priority**: High

Ensures that by default, only personal data necessary for each specific purpose is processed, covering amount, extent, period, and accessibility.

### [REQ-GDPR-013: Encryption and Pseudonymization](./comp-gdpr-013-encryption-and-security.md)

**Purpose**: Data protection technical measures  
**GDPR Article**: Article 32 - Security of Processing  
**Category**: technical-measures, security  
**Priority**: High

Implements appropriate technical measures including encryption and pseudonymization to ensure security of personal data processing.

### [REQ-GDPR-014: Data Breach Notification](./comp-gdpr-014-data-breach-response.md)

**Purpose**: Breach detection and notification procedures  
**GDPR Article**: Article 33-34 - Notification of Data Breach  
**Category**: technical-measures, breach-response  
**Priority**: High

Establishes procedures for detecting, investigating, and notifying data breaches to supervisory authorities and affected data subjects.

## Consent Management Requirements

### [REQ-GDPR-015: Consent Collection](./comp-gdpr-015-consent-management.md)

**Purpose**: Consent collection and documentation  
**GDPR Article**: Article 7 - Conditions for Consent  
**Category**: consent, collection  
**Priority**: High

Implements procedures for obtaining, recording, and managing valid consent from data subjects with clear consent mechanisms and documentation.

### [REQ-GDPR-016: Consent Withdrawal](./comp-gdpr-016-consent-withdrawal.md)

**Purpose**: Consent withdrawal mechanisms  
**GDPR Article**: Article 7(3) - Withdrawal of Consent  
**Category**: consent, withdrawal  
**Priority**: High

Provides data subjects with easy mechanisms to withdraw consent and ensures withdrawal is as easy as giving consent.

## Cross-Border Transfer Requirements

### [REQ-GDPR-017: Transfer Safeguards](./comp-gdpr-017-international-data-transfers.md)

**Purpose**: International data transfer safeguards  
**GDPR Article**: Chapter V - Transfers to Third Countries  
**Category**: transfers, safeguards  
**Priority**: Medium

Implements appropriate safeguards for international data transfers including adequacy decisions, standard contractual clauses, or binding corporate rules.

## Usage Instructions

### Generating Templates

```bash
# Initialize project with GDPR templates
sc init --framework=gdpr

# Copy specific template to project
sc req template --id=REQ-GDPR-001 --copy-to=./requirements/

# Validate GDPR compliance
sc req validate --framework=gdpr

# Generate privacy impact assessment
sc compliance pia --framework=gdpr --output=./assessments/
```

### Privacy Impact Assessment

Generate and manage Privacy Impact Assessments:

```bash
# Generate DPIA template
sc privacy dpia-template --requirements=REQ-GDPR-001,REQ-GDPR-002

# Conduct privacy risk assessment
sc privacy risk-assessment --scope=all-requirements

# Generate privacy documentation package
sc docs generate --type=privacy-package --framework=gdpr
```

### Customizing Templates

Each template can be customized while maintaining GDPR compliance:

1. **Processing Context**: Adapt templates for specific data processing activities
2. **Legal Basis Selection**: Choose appropriate lawful basis for each processing purpose
3. **Risk Assessment**: Adjust measures based on privacy impact assessment results
4. **Organizational Measures**: Include organization-specific policies and procedures

### Template Structure

Each GDPR template includes:

- **GDPR Article Mapping**: Direct reference to applicable GDPR articles and recitals
- **Legal Basis Analysis**: Guidance for selecting appropriate lawful basis
- **Gherkin Specifications**: BDD-style acceptance criteria for privacy controls
- **Technical Context**: Implementation guidance for privacy-preserving systems
- **Risk Assessment**: Privacy risk identification and mitigation measures
- **Compliance Evidence**: Required documentation and audit trails

## Data Protection Officer (DPO) Integration

### DPO Responsibilities

- **Compliance Monitoring** - Monitor compliance with GDPR requirements
- **Risk Assessment** - Conduct privacy impact assessments and risk evaluations
- **Training and Awareness** - Provide data protection training and guidance
- **Stakeholder Liaison** - Serve as contact point for supervisory authorities

### DPO Involvement in Requirements

- **Requirement Review** - DPO review and approval of privacy requirements
- **Implementation Oversight** - Monitor implementation of privacy controls
- **Compliance Validation** - Validate ongoing compliance with GDPR requirements
- **Incident Response** - Lead data breach response and notification procedures

## Related Documentation

> **Note**: When implementing in your project, add links to your actual documentation:
> - GDPR implementation guides
> - Privacy by Design documentation
> - Data Subject Rights procedures
> - Privacy Impact Assessment templates
