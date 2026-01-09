---
id: iso13485-templates
title: ISO 13485 Template Requirements
sidebar_label: Templates
sidebar_position: 1
---

# ISO 13485 Template Requirements

The following template requirements are automatically generated when initializing a project with `sc init --framework=iso13485`. Each requirement follows the standard See requirement template in supernal-code-package format with ISO 13485-specific content.

## Core Quality Management System Requirements

### [REQ-ISO-001: Quality Management System](./comp-iso-001-quality-management-system.md)

**Purpose**: QMS establishment and documentation  
**ISO Clause**: 4.1 General Requirements  
**Category**: core, qms  
**Priority**: High

Establishes the overall quality management system framework, including quality policy, objectives, and organizational structure for medical device development.

### [REQ-ISO-002: Management Responsibility](./comp-iso-002-management-responsibility.md)

**Purpose**: Quality policy and management commitment  
**ISO Clause**: 5.1 Management Commitment  
**Category**: core, management  
**Priority**: High

Defines management's commitment to quality, including resource allocation, quality policy communication, and management review processes.

### [REQ-ISO-003: Document Control](./comp-iso-003-document-control-system.md)

**Purpose**: Human resources and competence requirements  
**ISO Clause**: 6.2 Human Resources  
**Category**: core, resources  
**Priority**: Medium

Ensures adequate human resources with appropriate competence, training, and awareness for medical device development activities.

### [REQ-ISO-004: Record Control](./comp-iso-004-record-control-system.md)

**Purpose**: Document and record control procedures  
**ISO Clause**: 4.2.3 Control of Documents  
**Category**: core, documentation  
**Priority**: High

Implements systematic control of documents and records throughout the medical device lifecycle, ensuring current versions are available and obsolete documents are controlled.

## Design Controls (Clause 7.3) Requirements

### [REQ-ISO-005: Design Planning](./comp-iso-005-design-planning.md)

**Purpose**: Design and development planning procedures  
**ISO Clause**: 7.3.1 Design and Development Planning  
**Category**: design-controls, planning  
**Priority**: High

Establishes planning for design and development activities, including stages, reviews, verification, validation, and responsibilities.

### [REQ-ISO-006: Resource Management](./comp-iso-006-resource-management.md)

**Purpose**: Design input identification and documentation  
**ISO Clause**: 7.3.2 Design and Development Inputs  
**Category**: design-controls, inputs  
**Priority**: High

Identifies and documents design inputs including functional, performance, usability, safety, and regulatory requirements.

### [REQ-ISO-007: Product Realization](./comp-iso-007-product-realization.md)

**Purpose**: Design output specification and verification  
**ISO Clause**: 7.3.3 Design and Development Outputs  
**Category**: design-controls, outputs  
**Priority**: High

Defines design outputs that meet design input requirements and provide appropriate information for purchasing, production, and service provision.

### [REQ-ISO-008: Measurement](./comp-iso-008-measurement-and-analysis.md)

**Purpose**: Design review process and documentation  
**ISO Clause**: 7.3.4 Design and Development Review  
**Category**: design-controls, review  
**Priority**: High

Conducts systematic reviews at suitable stages to evaluate design ability to meet requirements and identify problems and propose necessary actions.

### [REQ-ISO-009: Risk Management](./comp-iso-009-risk-management.md)

**Purpose**: Design verification testing and validation  
**ISO Clause**: 7.3.5 Design and Development Verification  
**Category**: design-controls, verification  
**Priority**: High

Performs verification to ensure design outputs meet design input requirements through appropriate methods such as design reviews, tests, and demonstrations.

### [REQ-ISO-010: Design Controls](./comp-iso-010-design-controls.md)

**Purpose**: Design validation and user needs confirmation  
**ISO Clause**: 7.3.6 Design and Development Validation  
**Category**: design-controls, validation  
**Priority**: High

Validates that the resulting product meets user needs and intended use through testing under defined operating conditions.

## Risk Management Requirements

### [REQ-ISO-011: Purchasing](./comp-iso-011-purchasing-controls.md)

**Purpose**: Risk management process (ISO 14971 integration)  
**ISO Clause**: 7.1 Planning of Product Realization  
**Category**: risk-management, process  
**Priority**: High

Establishes risk management processes in accordance with ISO 14971 for identifying, analyzing, evaluating, and controlling risks throughout the product lifecycle.

### [REQ-ISO-012: Production](./comp-iso-012-production-controls.md)

**Purpose**: Risk analysis and evaluation procedures  
**ISO Clause**: 7.1 Planning of Product Realization  
**Category**: risk-management, analysis  
**Priority**: High

Implements systematic risk analysis to identify hazards, estimate risks, and evaluate risk acceptability using appropriate risk analysis techniques.

### [REQ-ISO-013: Monitoring](./comp-iso-013-monitoring-and-measurement.md)

**Purpose**: Risk control measures implementation  
**ISO Clause**: 7.1 Planning of Product Realization  
**Category**: risk-management, controls  
**Priority**: High

Implements risk control measures to reduce risks to acceptable levels through inherent safety, protective measures, and information for safety.

### [REQ-ISO-014: Corrective Action](./comp-iso-014-corrective-and-preventive-action.md)

**Purpose**: Post-market surveillance and risk monitoring  
**ISO Clause**: 8.2.1 Feedback  
**Category**: risk-management, surveillance  
**Priority**: Medium

Establishes post-market surveillance system to collect and review experience gained from devices in the post-production phase.

## Usage Instructions

### Generating Templates

```bash
# Initialize project with ISO 13485 templates
sc init --framework=iso13485

# Copy specific template to project
sc req template --id=REQ-ISO-001 --copy-to=./requirements/

# Validate ISO 13485 compliance
sc req validate --framework=iso13485

# Generate compliance report
sc compliance report --framework=iso13485 --output=./reports/
```

### Customizing Templates

Each template can be customized for your specific project while maintaining ISO 13485 compliance:

1. **Copy Template**: Use `sc req new --template=REQ-ISO-XXX` to create customized version
2. **Modify Content**: Update title, description, and acceptance criteria for your use case
3. **Maintain Traceability**: Keep ISO clause references and compliance mappings
4. **Validate Changes**: Run `sc req validate` to ensure continued compliance

### Template Structure

Each ISO 13485 template includes:

- **ISO Clause Mapping**: Direct reference to applicable ISO 13485 clauses
- **Gherkin Specifications**: BDD-style acceptance criteria for validation
- **Technical Context**: Implementation guidance and constraints
- **Testing Strategy**: Verification and validation approach
- **Compliance Evidence**: Required documentation and records

## Related Documentation

- [ISO 13485 Overview](../overview/index.md) - Framework introduction and benefits
- See requirement template in supernal-code-package - Standard template structure
- [Compliance Validation](../../../../../docs/requirements/compliance/processes/validation/index.md) - Validation processes and tools
