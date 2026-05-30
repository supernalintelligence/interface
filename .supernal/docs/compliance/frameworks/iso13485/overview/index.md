---
id: iso13485-overview
title: ISO 13485 Medical Device Compliance
sidebar_label: Overview
sidebar_position: 1
---

# ISO 13485 Medical Device Compliance

ISO 13485 is an international standard that specifies requirements for a quality management system (QMS) for medical device organizations. Supernal Coding provides comprehensive template requirements to ensure your software development process meets ISO 13485 standards.

## Framework Overview

### 🏥 **ISO 13485 Requirement Template Flow**

<SimpleMermaid chart={`
flowchart TD
A["🎯 sc init --framework=iso13485<br/>Initialize project with ISO templates"] --> B["📋 Template Generation<br/>Create REQ-ISO-XXX requirements"]

    B --> C["📝 REQ-ISO-001: Quality Management System<br/>Establish QMS framework"]
    B --> D["📝 REQ-ISO-002: Management Responsibility<br/>Define quality policy & objectives"]
    B --> E["📝 REQ-ISO-003: Resource Management<br/>Allocate resources & competence"]
    B --> F["📝 REQ-ISO-004: Design Controls<br/>Design & development process"]

    F --> G["📝 REQ-ISO-005: Design Planning<br/>Define design inputs"]
    F --> H["📝 REQ-ISO-006: Design Inputs<br/>Gather requirements"]
    F --> I["📝 REQ-ISO-007: Design Outputs<br/>Create specifications"]
    F --> J["📝 REQ-ISO-008: Design Review<br/>Validate design"]
    F --> K["📝 REQ-ISO-009: Design Verification<br/>Test implementation"]
    F --> L["📝 REQ-ISO-010: Design Validation<br/>User validation"]

    C --> M["✅ sc req validate REQ-ISO-001<br/>Automated compliance checking"]
    D --> M
    E --> M
    G --> M
    H --> M
    I --> M
    J --> M
    K --> M
    L --> M

    M --> N{"🏆 All Templates Validated?"}

    N -->|"❌ Gaps Found"| O["🔧 sc req update REQ-ISO-XXX<br/>Address compliance gaps"]
    O --> M

    N -->|"✅ Compliant"| P["🎉 ISO 13485 Ready<br/>All requirements implemented"]

    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style M fill:#e8f5e8
    style P fill:#e8f5e8

`} />

## Key Requirements Areas

### Core Quality Management System

- **Quality Management System** - Establish and maintain QMS documentation
- **Management Responsibility** - Define quality policy and management commitment
- **Resource Management** - Ensure adequate human and infrastructure resources
- **Document Control** - Implement document and record control procedures

### Design Controls (Clause 7.3)

- **Design Planning** - Plan and control design and development activities
- **Design Inputs** - Identify and document design input requirements
- **Design Outputs** - Define design outputs and specifications
- **Design Review** - Conduct systematic design reviews
- **Design Verification** - Verify design outputs meet input requirements
- **Design Validation** - Validate design meets user needs and intended use

### Risk Management

- **Risk Management Process** - Implement ISO 14971 risk management
- **Risk Analysis** - Identify and analyze potential hazards
- **Risk Controls** - Implement risk control measures
- **Post-Market Surveillance** - Monitor and evaluate post-market data

## Getting Started

### Initialize ISO 13485 Project

```bash
# Initialize project with ISO 13485 templates
sc init --framework=iso13485

# Validate all ISO requirements
sc req validate --framework=iso13485

# Generate compliance report
sc compliance report --framework=iso13485
```

### Template Requirements

All ISO 13485 template requirements follow the standard See requirement template in supernal-code-package format and include:

- **Gherkin Specifications** - BDD-style acceptance criteria
- **Technical Context** - Implementation guidance
- **Testing Strategy** - Validation approach
- **Traceability** - Links to ISO 13485 clauses

## Quick Start

Get started with ISO 13485 compliance in minutes:

### 1. Initialize ISO 13485 Project

```bash
# Create new ISO 13485 compliance project
sc init --framework=iso13485 --name="Medical Device QMS"

# Generate initial requirements
sc req generate --framework=iso13485 --category=design-controls
```

### 2. Set Up Design Controls

```bash
# Create design control requirements
sc req new "Design Input Requirements" --framework=iso13485 --priority=high
sc req new "Design Output Specifications" --framework=iso13485 --priority=high
sc req new "Design Review Process" --framework=iso13485 --priority=medium
```

### 3. Validate Compliance

```bash
# Check compliance status
sc compliance check --framework=iso13485

# Generate compliance report
sc compliance report --framework=iso13485 --format=pdf
```

### 4. Monitor Progress

```bash
# View requirement status
sc req list --framework=iso13485 --status=pending

# Track compliance score
sc compliance score --framework=iso13485
```

## Related Documentation

- [ISO 13485 Template Requirements](../templates/index.md) - Complete list of template requirements
- See requirement template in supernal-code-package - Standard requirement structure
- [CLI Commands](./index.md) - Available sc commands for compliance

## Compliance Benefits

### Regulatory Advantages

- **FDA Recognition** - ISO 13485 is recognized by FDA as a consensus standard
- **Global Market Access** - Facilitates medical device registration worldwide
- **Audit Readiness** - Maintains continuous audit-ready documentation

### Development Benefits

- **Structured Process** - Clear development lifecycle with defined gates
- **Risk Mitigation** - Systematic risk management throughout development
- **Quality Assurance** - Built-in quality controls and validation processes
- **Traceability** - Complete requirement-to-implementation traceability
