---
title: ISO/IEC 27701:2019 Privacy Information Management System
type: documentation
created: 2025-12-17
updated: 2025-12-17
---

# ISO/IEC 27701:2019 Privacy Information Management System

## Overview

ISO/IEC 27701 is the international standard for privacy information management. It extends ISO 27001 and ISO 27002 by providing specific requirements and guidance for managing privacy as part of an information security management system (ISMS).

## Standard Information

- **Current Version**: ISO/IEC 27701:2019
- **Published**: August 2019
- **Extends**: ISO/IEC 27001:2013 and ISO/IEC 27002:2013
- **Total Controls**: 62 privacy-specific controls
- **Certification**: Available through accredited certification bodies (requires ISO 27001 first)

## Key Features

- **GDPR Alignment**: Designed to support GDPR compliance
- **Role-Based Controls**: Separate controls for PII controllers and processors
- **PIMS Framework**: Privacy Information Management System framework
- **ISO 27001 Extension**: Builds upon existing ISMS infrastructure
- **Global Applicability**: Relevant for all privacy regulations worldwide

## Control Categories

### Controller Controls (6.7.x series)

Requirements for organizations acting as PII controllers:

- Lawful basis identification and consent management
- Data subject rights (access, rectification, erasure, portability)
- Privacy notices and transparency
- Data minimization and retention
- Automated decision-making controls

### Processor Controls (6.8.x series)

Requirements for organizations processing PII on behalf of others:

- Processing agreements and limitations
- Subprocessor management
- Customer assistance with data subject requests
- Breach notification to customers
- Return/destruction of PII upon contract end

### Privacy Engineering (6.9.x)

Technical and organizational controls:

- Privacy by Design and by Default
- Privacy Impact Assessments
- Data Protection Officer requirements
- Special protections for children and sensitive data

### Privacy Governance (6.11.x, 6.13.x, 6.14.x)

Governance and oversight:

- Records of processing activities
- Transparency and privacy notices
- Complaints handling
- Privacy metrics and audit programs
- Supervisory authority cooperation

### Technical Privacy Controls (6.15.x, 6.17.x)

Technical safeguards:

- Encryption, anonymization, pseudonymization
- De-identification procedures
- Privacy monitoring and testing
- Cookie and tracking technology management

### International Transfers (6.10.x)

Cross-border data transfer controls:

- Legal basis for transfers
- Appropriate safeguards
- Transfer records and documentation

### Third-Party Management (6.12.x, 6.18.x)

Vendor and partner controls:

- Third-party PII sharing controls
- Vendor privacy assessments
- Cloud provider verification
- Marketing and analytics management

## Compliance Benefits

- **GDPR Compliance**: Structured approach to GDPR requirements
- **Global Privacy**: Applicable to CCPA, LGPD, PIPEDA, and other regulations
- **Risk Management**: Systematic privacy risk assessment
- **Customer Trust**: Demonstrates privacy commitment
- **Competitive Advantage**: Certification differentiator
- **Integrated Approach**: Combines security and privacy management
- **Audit Readiness**: Structured documentation and evidence

## Relationship with ISO 27001

ISO 27701 **extends** ISO 27001:

- Organizations must have ISO 27001 certification first
- Privacy requirements map to ISO 27001 control framework
- PIMS integrates with existing ISMS
- Shared documentation and processes
- Combined audit approach

## Implementation Approach

1. **Prerequisite**: Achieve ISO 27001 certification
2. **Gap Analysis**: Compare current privacy practices against ISO 27701
3. **Scope Definition**: Define PIMS boundaries
4. **Data Mapping**: Identify all PII processing activities
5. **Role Determination**: Clarify controller vs processor roles
6. **Control Selection**: Choose applicable 27701 controls
7. **Implementation**: Deploy privacy controls and processes
8. **Documentation**: Create privacy policies, procedures, records
9. **Training**: Privacy-specific training for all personnel
10. **Audit**: Conduct privacy audits
11. **Certification**: Extend ISO 27001 audit to cover 27701

## Supernal Coding Integration

All ISO 27701 controls are available as `comp-iso27701-XXX` templates with:

- Complete Gherkin acceptance criteria
- Privacy-specific implementation guidance
- Technical context and examples
- Validation strategies
- Evidence requirements
- Cross-references to GDPR, ISO 27001, and other frameworks

## Related Frameworks

- **ISO 27001/27002**: Base information security standards
- **GDPR**: EU General Data Protection Regulation (high alignment)
- **CCPA**: California Consumer Privacy Act
- **LGPD**: Brazilian General Data Protection Law
- **PIPEDA**: Canadian privacy legislation
- **SOC 2**: Privacy criteria alignment

## Common Use Cases

- **Software Companies**: Managing customer PII
- **Cloud Service Providers**: Acting as processors
- **Healthcare**: HIPAA + ISO 27701 combination
- **Financial Services**: Enhanced privacy for sensitive data
- **E-commerce**: Customer data protection
- **Marketing Platforms**: Consent and preference management
- **International Business**: Cross-border data transfers
