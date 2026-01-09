---
id: fda21cfr11-templates
title: FDA 21 CFR Part 11 Template Requirements
sidebar_label: Templates
sidebar_position: 1
---

# FDA 21 CFR Part 11 Template Requirements

The following template requirements are automatically generated when initializing a project with `sc init --framework=fda21cfr11`. Each requirement follows the standard See requirement template in supernal-code-package format with FDA 21 CFR Part 11-specific content.

## System Validation Requirements

### [REQ-FDA-001: Computer System Validation](./comp-fda-001-computer-system-validation.md)

**Purpose**: Computer system validation procedures and lifecycle  
**CFR Section**: 21 CFR 11.10(a)  
**Category**: csv, validation  
**Priority**: High

Establishes comprehensive computer system validation procedures ensuring systems are suitable for their intended use and maintain data integrity throughout the system lifecycle.

### [REQ-FDA-002: Software Development Lifecycle](./comp-fda-002-software-development-lifecycle.md)

**Purpose**: Software development and maintenance procedures  
**CFR Section**: 21 CFR 11.10(a)  
**Category**: csv, development  
**Priority**: High

Implements structured software development lifecycle procedures with appropriate controls, testing, and documentation for FDA-regulated systems.

### [REQ-FDA-003: System Requirements Specification](./comp-fda-003-system-requirements-specification.md)

**Purpose**: System requirements and functional specifications  
**CFR Section**: 21 CFR 11.10(a)  
**Category**: csv, requirements  
**Priority**: High

Defines comprehensive system requirements including functional, technical, and regulatory specifications for electronic record systems.

## Qualification Requirements (IQ/OQ/PQ)

### [REQ-FDA-004: Installation Qualification](./comp-fda-004-installation-qualification.md)

**Purpose**: IQ procedures and documentation requirements  
**CFR Section**: 21 CFR 11.10(a)  
**Category**: csv, qualification  
**Priority**: High

Establishes Installation Qualification procedures to verify that systems are installed according to specifications and design requirements.

### [REQ-FDA-005: Operational Qualification](./comp-fda-005-operational-qualification.md)

**Purpose**: OQ testing and validation procedures  
**CFR Section**: 21 CFR 11.10(a)  
**Category**: csv, qualification  
**Priority**: High

Implements Operational Qualification testing to verify that systems operate according to specifications across anticipated operating ranges.

### [REQ-FDA-006: Performance Qualification](./comp-fda-006-performance-qualification.md)

**Purpose**: PQ and ongoing performance validation  
**CFR Section**: 21 CFR 11.10(a)  
**Category**: csv, qualification  
**Priority**: High

Establishes Performance Qualification procedures to demonstrate that systems consistently perform according to specifications under routine operating conditions.

## Electronic Signature Requirements

### [REQ-FDA-007: Electronic Signature Implementation](./comp-fda-007-electronic-signature-implementation.md)

**Purpose**: Electronic signature system implementation  
**CFR Section**: 21 CFR 11.50, 11.70  
**Category**: electronic-signatures, implementation  
**Priority**: High

Implements electronic signature systems that are legally binding equivalent of handwritten signatures with appropriate security and authentication controls.

### [REQ-FDA-008: Signature Components](./comp-fda-008-signature-components.md)

**Purpose**: Biometric/token-based authentication components  
**CFR Section**: 21 CFR 11.200, 11.300  
**Category**: electronic-signatures, authentication  
**Priority**: High

Establishes signature components including biometric-based and non-biometric authentication methods with appropriate security controls.

### [REQ-FDA-009: Non-Repudiation Controls](./comp-fda-009-non-repudiation-controls.md)

**Purpose**: Signature integrity and non-repudiation mechanisms  
**CFR Section**: 21 CFR 11.50, 11.70  
**Category**: electronic-signatures, integrity  
**Priority**: High

Implements controls to ensure electronic signatures cannot be excised, copied, or transferred to falsify records, maintaining signature integrity and non-repudiation.

## Audit Trail Requirements

### [REQ-FDA-010: Automatic Audit Trails](./comp-fda-010-automatic-audit-trails.md)

**Purpose**: Automatic audit trail generation and management  
**CFR Section**: 21 CFR 11.10(e)  
**Category**: audit-trails, generation  
**Priority**: High

Establishes automatic generation of secure, computer-generated, time-stamped audit trails to independently record operator actions and system events.

### [REQ-FDA-011: Tamper Evidence](./comp-fda-011-tamper-evidence.md)

**Purpose**: Tamper-evident audit record protection  
**CFR Section**: 21 CFR 11.10(e)  
**Category**: audit-trails, security  
**Priority**: High

Implements tamper-evident controls to protect audit records from unauthorized access, modification, or deletion while maintaining data integrity.

### [REQ-FDA-012: Record Retention](./comp-fda-012-record-retention.md)

**Purpose**: Record retention, archival, and retrieval procedures  
**CFR Section**: 21 CFR 11.10(b)  
**Category**: audit-trails, retention  
**Priority**: Medium

Establishes procedures for long-term retention, archival, and retrieval of electronic records and audit trails in accordance with predicate rule requirements.

## Access Control Requirements

### [REQ-FDA-013: System Access Controls](./comp-fda-013-system-access-controls.md)

**Purpose**: System access control and user management  
**CFR Section**: 21 CFR 11.10(d)  
**Category**: access-control, security  
**Priority**: High

Implements appropriate controls over system access to ensure only authorized individuals can use the system, create, modify, or delete electronic records.

### [REQ-FDA-014: Authority Verification](./comp-fda-014-authority-checks.md)

**Purpose**: User authority verification and role management  
**CFR Section**: 21 CFR 11.10(i)  
**Category**: access-control, authorization  
**Priority**: High

Establishes procedures to verify that persons who develop, maintain, or use electronic record/signature systems have the authority to perform their assigned tasks.

## Usage Instructions

### Generating Templates

```bash
# Initialize project with FDA 21 CFR Part 11 templates
sc init --framework=fda21cfr11

# Copy specific template to project
sc req template --id=REQ-FDA-001 --copy-to=./requirements/

# Validate FDA compliance
sc req validate --framework=fda21cfr11

# Generate CSV documentation package
sc docs generate --type=csv-package --framework=fda21cfr11
```

### Validation Protocols

Generate IQ/OQ/PQ validation protocols:

```bash
# Generate Installation Qualification protocol
sc validation generate-iq --requirement=REQ-FDA-004

# Generate Operational Qualification protocol
sc validation generate-oq --requirement=REQ-FDA-005

# Generate Performance Qualification protocol
sc validation generate-pq --requirement=REQ-FDA-006

# Execute validation suite
sc validation execute --phase=all --framework=fda21cfr11
```

### Customizing Templates

Each template can be customized while maintaining FDA compliance:

1. **System-Specific Adaptation**: Modify templates for your specific system architecture
2. **Predicate Rule Integration**: Add requirements from applicable predicate rules
3. **Risk-Based Approach**: Adjust validation rigor based on system risk assessment
4. **Maintain Traceability**: Keep CFR section references and regulatory mappings

### Template Structure

Each FDA 21 CFR Part 11 template includes:

- **CFR Section Mapping**: Direct reference to applicable 21 CFR Part 11 sections
- **CSV Procedures**: Computer system validation protocols and procedures
- **Gherkin Specifications**: BDD-style acceptance criteria for validation
- **Technical Context**: Implementation guidance for electronic systems
- **Validation Strategy**: IQ/OQ/PQ approach and testing requirements
- **Regulatory Evidence**: Required documentation and compliance records

## Validation Lifecycle

### Phase-Based Validation Approach

1. **Planning Phase** (REQ-FDA-001, REQ-FDA-003)
   - System requirements specification
   - Validation master plan
   - Risk assessment

2. **Development Phase** (REQ-FDA-002)
   - Software development lifecycle
   - Design controls
   - Code reviews and testing

3. **Qualification Phase** (REQ-FDA-004, REQ-FDA-005, REQ-FDA-006)
   - Installation Qualification (IQ)
   - Operational Qualification (OQ)
   - Performance Qualification (PQ)

4. **Operation Phase** (REQ-FDA-010, REQ-FDA-011, REQ-FDA-012)
   - Ongoing monitoring
   - Change control
   - Periodic review

## Related Documentation

> **Note**: When implementing in your project, add links to your actual documentation:
> - FDA 21 CFR Part 11 compliance guides
> - Computer System Validation documentation
> - Electronic Signature implementation guides
> - Audit Trail management procedures
