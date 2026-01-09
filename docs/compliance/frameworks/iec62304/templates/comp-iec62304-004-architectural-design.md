---
id: comp-iec62304-004
framework: iec62304
title: Architectural Design
version: 1.0.0
effectiveDate: 2025-12-13T00:00:00.000Z
status: pending-verification
owner: compliance-team
category: lifecycle-process
phase:
  - 3-design
  - 4-planning
severity: critical
auditFrequency: per-release
relatedCards:
  - comp-iec62304-001
  - comp-iec62304-002
  - comp-iec62304-003
  - comp-iec62304-005
  - comp-iec62304-009
linkedRequirements: []
linkedRisks: []
tags:
  - medical-device
  - software-architecture
  - design
  - IEC-62304
  - segregation
references: []
---

# IEC 62304-004: Architectural Design

## Regulatory Context

**Standard**: IEC 62304:2006+AMD1:2015 - Medical Device Software Lifecycle Processes  
**Section**: §5.3 - Architectural Design  
**Classification**: Class A, B, C (All)  
**Regulatory Impact**: HIGH

### Why This Matters

Software architecture is the blueprint that determines system safety, maintainability, and compliance. A well-designed architecture:
- Segregates safety-critical components from non-critical components
- Facilitates verification and validation
- Enables risk control implementation
- Supports maintenance and future changes
- Demonstrates regulatory compliance

Poor architecture is difficult to retrofit and causes most long-term quality issues.

## Standard Requirements

### IEC 62304 §5.3.1 - Transform Requirements into Architecture

**SHALL Requirements**:
1. **Develop a software architecture** from software requirements
2. **Architecture SHALL**:
   - Identify software items (components/modules)
   - Define interfaces between software items and external components
   - Support implementation of software requirements
   - Support implementation of risk controls

### IEC 62304 §5.3.2 - Develop Architecture for Interfaces

**SHALL Requirements**:
1. **Specify functional and data interfaces** between:
   - Software items
   - Software and hardware
   - Software and external software (SOUP)

### IEC 62304 §5.3.3 - Specify Functional and Performance Requirements (Class B, C)

**SHALL Requirements** (Class B, C):
1. **Specify functional and performance requirements** for SOUP (Software of Unknown Provenance)
2. **Document any known anomalies** in SOUP
3. **Document SOUP version** and any configuration

### IEC 62304 §5.3.4 - Specify System Hardware and Software Required (Class B, C)

**SHALL Requirements** (Class B, C):
1. **Identify operating system(s)**
2. **Identify hardware platforms**
3. **Identify other software dependencies**

### IEC 62304 §5.3.5 - Identify Segregation Necessary for Risk Control (Class C)

**SHALL Requirements** (Class C):
1. **Identify segregation** between software items necessary for risk control
2. **Segregation SHALL**:
   - Prevent unsafe contributions from non-critical items to critical items
   - Support independent verification of critical items

### IEC 62304 §5.3.6 - Verify Software Architecture

**SHALL Requirements**:
1. **Verify the architecture** ensures:
   - Requirements are correctly implemented
   - Requirements are traceable to software items
   - SOUP is suitable for intended use
   - Medical device risk controls are implemented

## Implementation Requirements

### 1. Architectural Documentation

**Requirement**: Document complete software architecture

**Acceptance Criteria**:

```gherkin
Feature: Architectural Documentation
  As a software architect
  I need comprehensive architectural documentation
  So that the design is clear, traceable, and verifiable

  Scenario: Document Software Architecture
    Given software requirements are defined
    When creating architectural documentation
    Then it SHALL identify all software items (components/modules)
    And it SHALL define responsibilities of each software item
    And it SHALL specify interfaces between software items
    And it SHALL specify external interfaces (hardware, SOUP)
    And it SHALL map requirements to software items (traceability)
    And it SHALL identify architectural patterns used
    And it SHALL include architecture diagrams (C4 model, UML)
    And it SHALL document design rationale for key decisions

  Scenario: Architecture Supports Safety Classification
    Given software safety classification (COMP-IEC62304-001)
    When designing architecture
    Then design rigor SHALL match safety class
    And Class C SHALL have segregation analysis
    And safety-critical components SHALL be identified
    And risk controls SHALL be mapped to software items
```

### 2. Software Item Identification

**Requirement**: Identify all software items (components, modules)

**Acceptance Criteria**:

```gherkin
Feature: Software Item Identification
  As a software architect
  I need clearly identified software items
  So that each component can be independently developed and verified

  Scenario: Define Software Items
    Given software requirements
    When decomposing into software items
    Then each software item SHALL have a unique identifier
    And each software item SHALL have defined responsibilities
    And each software item SHALL have clear boundaries
    And each software item SHALL have defined interfaces
    And software items SHALL be at appropriate granularity (not too large/small)

  Scenario: Software Item Types
    Given a software architecture
    When categorizing software items
    Then items SHALL be categorized by type

    Examples:
      | item_type          | description                              | example                    |
      | Service            | Business logic, algorithms               | DoseCalculationService     |
      | Repository         | Data access layer                        | PatientRepository          |
      | Controller         | API endpoints, UI controllers            | AuthController             |
      | Model              | Data structures, entities                | Patient, Prescription      |
      | Utility            | Helper functions, libraries              | DateUtils, Validators      |
      | Integration        | External system interfaces               | EHRIntegration, FHIRClient |
      | SOUP               | Third-party libraries                    | Express.js, React          |

  Scenario: Software Item Traceability
    Given software requirements
    When mapping requirements to software items
    Then each requirement SHALL trace to one or more software items
    And each software item SHALL trace to one or more requirements
    And traceability matrix SHALL be maintained
```

### 3. Interface Specification (§5.3.2)

**Requirement**: Specify all interfaces between software items and external components

**Acceptance Criteria**:

```gherkin
Feature: Interface Specification
  As a software architect
  I need well-defined interfaces
  So that components can interact correctly and safely

  Scenario: Define Internal Interfaces
    Given software items are identified
    When specifying interfaces between software items
    Then each interface SHALL have a name and identifier
    And each interface SHALL specify data types (inputs/outputs)
    And each interface SHALL specify protocols (sync, async, events)
    And each interface SHALL specify error handling
    And each interface SHALL specify timing constraints (if applicable)

    Example:
      """typescript
      /**
       * Interface: DoseCalculation API
       * Software Items: PrescriptionService -> DoseCalculationService
       * Safety Classification: Class C (critical)
       */
      interface DoseCalculationAPI {
        /**
         * Calculate drug dose based on patient parameters
         * @param patientWeight - Patient weight in kg (validated: 0.5-300kg)
         * @param drugId - Drug identifier (validated against formulary)
         * @param indication - Medical indication
         * @returns DoseRecommendation with range, warnings, and contraindications
         * @throws InvalidParameterError if inputs are out of range
         * @throws DrugInteractionError if contraindications detected
         * @timing Max 500ms latency (95th percentile)
         */
        calculateDose(
          patientWeight: number,
          drugId: string,
          indication: string
        ): Promise<DoseRecommendation>;
      }
      """

  Scenario: Define External Interfaces
    Given external components (hardware, SOUP, external systems)
    When specifying external interfaces
    Then each external interface SHALL be documented
    And communication protocols SHALL be specified (HTTP, MQTT, serial, etc.)
    And data formats SHALL be specified (JSON, XML, HL7, FHIR, etc.)
    And authentication/authorization SHALL be specified
    And error handling SHALL be specified

    Examples:
      | interface_type        | protocol       | data_format | auth_method           |
      | EHR Integration       | HTTPS REST API | FHIR JSON   | OAuth 2.0 + JWT       |
      | Medical Device (ECG)  | Serial RS-232  | Binary      | None (physical access)|
      | Audit Log Service     | HTTPS API      | JSON        | API Key + mTLS        |
      | Database              | PostgreSQL     | SQL         | Connection string     |
```

### 4. SOUP Specification (§5.3.3, §5.3.4 - Class B, C)

**Requirement**: Specify SOUP (Software of Unknown Provenance) functional/performance requirements and dependencies

**Acceptance Criteria**:

```gherkin
Feature: SOUP Specification
  As a software architect
  I need documented SOUP requirements and anomalies
  So that third-party software is used safely and correctly

  Scenario: Document SOUP Items (Class B, C)
    Given third-party software components are used
    When specifying SOUP in architecture
    Then each SOUP item SHALL be documented with:
      | attribute               | example                          |
      | Name                    | Express.js                       |
      | Version                 | 4.18.2                           |
      | Purpose                 | HTTP server framework            |
      | License                 | MIT                              |
      | Functional requirements | Handle HTTP requests, routing    |
      | Performance requirements| Support 1000 req/sec             |
      | Known anomalies         | CVE-2022-24999 (patched in 4.18)|
      | Risk assessment         | SOUP-RISK-001 (medium)           |
      | Mitigation              | Input validation at app layer    |

  Scenario: SOUP Suitability Analysis
    Given a SOUP item to be used
    When assessing suitability
    Then functional requirements SHALL be verified (does it do what we need?)
    And performance requirements SHALL be verified (is it fast enough?)
    And known anomalies SHALL be assessed (are there known bugs/CVEs?)
    And risk analysis SHALL be performed (what can go wrong?)
    And mitigation SHALL be planned (how do we control risks?)

  Scenario: System Dependencies (Class B, C)
    Given the software architecture
    When specifying system dependencies
    Then operating system(s) SHALL be identified (e.g., Ubuntu 22.04 LTS)
    And hardware platforms SHALL be identified (e.g., x86_64, ARM64)
    And runtime dependencies SHALL be identified (e.g., Node.js 18 LTS)
    And database systems SHALL be identified (e.g., PostgreSQL 15)
    And other software dependencies SHALL be identified
```

### 5. Segregation for Risk Control (§5.3.5 - Class C Only)

**Requirement**: Identify segregation necessary for risk control

**Acceptance Criteria**:

```gherkin
Feature: Software Segregation for Risk Control
  As a software architect
  I need segregation between critical and non-critical components
  So that failures in non-critical components cannot affect safety

  Scenario: Identify Segregation Requirements (Class C)
    Given software safety classification is Class C
    When designing architecture
    Then safety-critical software items SHALL be identified
    And non-critical software items SHALL be identified
    And segregation boundaries SHALL be defined
    And segregation mechanisms SHALL be specified

    Example:
      | critical_item               | non-critical_item          | segregation_mechanism           |
      | DoseCalculationService      | UserPreferencesService     | Separate process, no shared memory |
      | PatientDataRepository       | AuditLogService            | Separate database schemas       |
      | AuthenticationService       | NotificationService        | Separate network zones (firewall)|

  Scenario: Prevent Unsafe Contributions
    Given segregation boundaries are defined
    When implementing segregation
    Then non-critical items SHALL NOT directly modify critical item state
    And communication SHALL be through defined interfaces only
    And critical items SHALL validate all inputs from non-critical items
    And failures in non-critical items SHALL NOT propagate to critical items

  Scenario: Support Independent Verification
    Given segregated software items
    When planning verification
    Then critical items SHALL be verifiable independently
    And critical items SHALL have higher test coverage (e.g., 95% vs 80%)
    And critical items SHALL have more rigorous reviews
    And critical items SHALL have formal verification (if warranted)

  Scenario: Segregation Mechanisms
    Given segregation is required
    When selecting segregation mechanisms
    Then mechanisms SHALL be appropriate for the risk

    Examples:
      | risk_level | mechanism                                    |
      | Critical   | Separate processes, memory protection        |
      | High       | Separate modules, interface validation       |
      | Medium     | Separate classes, encapsulation              |
```

### 6. Architectural Verification (§5.3.6)

**Requirement**: Verify the software architecture

**Acceptance Criteria**:

```gherkin
Feature: Architectural Verification
  As a quality assurance engineer
  I need to verify the architecture
  So that it correctly implements requirements and supports risk control

  Scenario: Architecture Review
    Given a documented software architecture
    When conducting architecture review
    Then requirements traceability SHALL be verified (all reqs mapped to items)
    And interface specifications SHALL be verified (complete and consistent)
    And SOUP suitability SHALL be verified (meets functional/performance needs)
    And risk controls SHALL be verified (mapped to architecture)
    And segregation SHALL be verified (Class C only)
    And design patterns SHALL be verified (appropriate for use case)
    And review results SHALL be documented

  Scenario: Prototyping for Verification
    Given architectural uncertainty
    When verification is needed
    Then prototypes MAY be developed
    And prototypes SHALL demonstrate feasibility
    And prototype results SHALL be documented
    And prototypes SHALL be discarded (not production code)

  Scenario: Architecture Inspection Checklist
    Given an architecture review
    When inspecting architecture
    Then the following SHALL be checked:
      - [ ] All requirements traced to software items
      - [ ] All software items have defined responsibilities
      - [ ] All interfaces are specified (data types, protocols)
      - [ ] SOUP items documented with version, purpose, anomalies
      - [ ] System dependencies identified (OS, hardware, runtime)
      - [ ] Segregation identified (Class C)
      - [ ] Risk controls mapped to software items
      - [ ] Design patterns documented
      - [ ] Architecture diagrams provided (C4, UML)
      - [ ] Design rationale documented for key decisions

  Scenario: Verification Methods
    Given an architectural element
    When selecting verification method
    Then method SHALL be appropriate for element type

    Examples:
      | element_type           | verification_method                      |
      | Requirements traceability | Inspection of traceability matrix     |
      | Interface specification | Peer review, API documentation review   |
      | SOUP suitability        | Analysis, testing against requirements  |
      | Segregation (Class C)   | Formal review, code inspection          |
      | Performance             | Modeling, simulation, benchmarking      |
      | Risk controls           | Hazard analysis review                  |
```

## Technical Implementation

### Architecture Documentation Template

```markdown
# Software Architecture Document

**Product**: Supernal Coding Medical Device Platform  
**Version**: 1.0  
**Safety Classification**: Class C  
**Date**: 2025-12-13

---

## 1. Architectural Overview

### 1.1 System Context (C4 Level 1)

```
┌─────────────────────────────────────────────────────────────┐
│                  Supernal Coding Platform                   │
│                     (Medical Device)                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Core Services (Class C)                   │   │
│  │  - DoseCalculationService                          │   │
│  │  - PatientDataRepository                           │   │
│  │  - AuthenticationService                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Supporting Services (Class B)               │   │
│  │  - AuditLogService                                 │   │
│  │  - NotificationService                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         ↕                  ↕                    ↕
    ┌────────┐         ┌─────────┐         ┌─────────┐
    │  EHR   │         │ Medical │         │  Users  │
    │ System │         │ Devices │         │(Doctors)│
    └────────┘         └─────────┘         └─────────┘
```

### 1.2 Design Principles

1. **Segregation by Risk**: Class C components isolated from lower-risk components
2. **Defense in Depth**: Multiple layers of validation and error handling
3. **Fail-Safe Defaults**: System defaults to safe state on errors
4. **Least Privilege**: Components have minimum necessary permissions
5. **Auditability**: All safety-critical operations logged immutably

---

## 2. Software Items (Components)

### 2.1 Critical Software Items (Class C)

| Item ID | Name | Responsibility | Requirements | Interfaces |
|---------|------|----------------|--------------|------------|
| SWI-001 | DoseCalculationService | Calculate drug doses | REQ-SAFETY-001-010 | IDoseCalculation |
| SWI-002 | PatientDataRepository | Store/retrieve patient data | REQ-DATA-001-005 | IPatientData |
| SWI-003 | AuthenticationService | User authentication | REQ-SECURITY-010 | IAuth |

### 2.2 Supporting Software Items (Class B)

| Item ID | Name | Responsibility | Requirements | Interfaces |
|---------|------|----------------|--------------|------------|
| SWI-010 | AuditLogService | Immutable audit logs | REQ-AUDIT-001-005 | IAuditLog |
| SWI-011 | NotificationService | User notifications | REQ-NOTIF-001-003 | INotification |

---

## 3. Interfaces

### 3.1 Internal Interfaces

**Interface**: `IDoseCalculation`  
**Provider**: SWI-001 (DoseCalculationService)  
**Consumer**: SWI-020 (PrescriptionService)  
**Safety Classification**: Class C

```typescript
interface IDoseCalculation {
  /**
   * Calculate drug dose
   * @req REQ-SAFETY-001
   */
  calculateDose(
    patientWeight: number,  // kg, range: [0.5, 300]
    drugId: string,         // validated against formulary
    indication: string
  ): Promise<DoseRecommendation>;
  
  /**
   * Error handling: Throws InvalidParameterError, DrugInteractionError
   * Performance: Max 500ms latency (95th percentile)
   * Validation: All inputs validated before calculation
   */
}
```

### 3.2 External Interfaces

**Interface**: EHR Integration (FHIR API)  
**Type**: External System  
**Protocol**: HTTPS REST API  
**Data Format**: FHIR R4 JSON  
**Authentication**: OAuth 2.0 + JWT

**Interface**: PostgreSQL Database  
**Type**: SOUP  
**Version**: 15.3  
**Purpose**: Patient data persistence  
**Performance**: Support 1000 queries/sec

---

## 4. SOUP (Software of Unknown Provenance)

| SOUP ID | Name | Version | Purpose | Known Anomalies | Risk Assessment |
|---------|------|---------|---------|-----------------|-----------------|
| SOUP-001 | Express.js | 4.18.2 | HTTP server | CVE-2022-24999 (patched) | SOUP-RISK-001 (Medium) |
| SOUP-002 | PostgreSQL | 15.3 | Database | None critical | SOUP-RISK-002 (Low) |
| SOUP-003 | React | 18.2.0 | UI framework | None critical | SOUP-RISK-003 (Low) |

### 4.1 SOUP Risk Mitigation

**SOUP-001 (Express.js)**:
- **Risk**: Malformed HTTP requests could cause crashes
- **Mitigation**: Input validation middleware, rate limiting
- **Verification**: Integration tests with fuzzing

---

## 5. System Dependencies (Class B, C)

**Operating System**: Ubuntu 22.04 LTS  
**Hardware Platform**: x86_64 (Intel/AMD), minimum 4GB RAM, 20GB disk  
**Runtime**: Node.js 18 LTS  
**Database**: PostgreSQL 15  
**Container Platform**: Docker 24.0  

---

## 6. Segregation (Class C)

### 6.1 Segregation Boundaries

```
┌─────────────────────────────────────┐
│  Critical Components (Class C)      │  ← Segregation Boundary
│  - DoseCalculationService          │
│  - PatientDataRepository           │
│  - AuthenticationService           │
│                                     │
│  Segregation Mechanisms:           │
│  - Separate Docker containers      │
│  - No shared memory                │
│  - Validated interfaces only       │
└─────────────────────────────────────┘
         ↓ validated API calls only
┌─────────────────────────────────────┐
│  Supporting Components (Class B)    │
│  - AuditLogService                 │
│  - NotificationService             │
└─────────────────────────────────────┘
```

### 6.2 Segregation Verification

- **Independent Verification**: Critical components have 95% test coverage
- **Failure Isolation**: NotificationService crash does NOT affect DoseCalculationService
- **Input Validation**: All API calls from Class B to Class C components are validated

---

## 7. Requirements Traceability

| Requirement | Software Item | Interface | Verification |
|-------------|---------------|-----------|--------------|
| REQ-SAFETY-001 | SWI-001 | IDoseCalculation | Unit tests, integration tests |
| REQ-DATA-001 | SWI-002 | IPatientData | Repository tests |
| REQ-SECURITY-010 | SWI-003 | IAuth | Security tests |

---

## 8. Design Rationale

### 8.1 Microservices Architecture

**Decision**: Use microservices for critical components  
**Rationale**: Enables segregation (Class C requirement), independent deployment, fault isolation  
**Alternatives Considered**: Monolithic (rejected: harder to segregate)

### 8.2 PostgreSQL Database

**Decision**: Use PostgreSQL for patient data  
**Rationale**: ACID compliance, proven reliability, good SOUP track record  
**Alternatives Considered**: MongoDB (rejected: weaker consistency guarantees)

---

## 9. Architecture Diagrams

### 9.1 Container Diagram (C4 Level 2)

[Include detailed architecture diagrams here]

---

## 10. Verification Results

**Review Date**: 2025-12-13  
**Reviewers**: Software Architect, QA Lead, Risk Manager  
**Status**: ✅ Approved

**Verification Checklist**:
- [x] All requirements traced to software items
- [x] All interfaces specified
- [x] SOUP documented with versions and anomalies
- [x] System dependencies identified
- [x] Segregation boundaries defined (Class C)
- [x] Risk controls mapped to architecture
- [x] Architecture diagrams provided

**Issues**: None

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-13 | Initial architecture | Software Architect |
```

## Compliance Evidence

### Required Records

1. **Software Architecture Document** (SAD) - Complete architecture description
2. **Interface Specifications** - All internal and external interfaces
3. **SOUP List** - All third-party software with versions, anomalies
4. **System Dependencies** - OS, hardware, runtime requirements
5. **Segregation Analysis** (Class C) - Segregation boundaries and mechanisms
6. **Requirements Traceability Matrix** - Requirements to software items
7. **Architecture Verification Report** - Review results and approval
8. **Architecture Diagrams** - C4 model, UML, sequence diagrams

### Audit Expectations

**Auditor Will Check**:
1. Architecture document exists and is current
2. All software requirements traced to software items
3. All interfaces documented (internal and external)
4. SOUP items documented with versions and known anomalies (Class B, C)
5. System dependencies identified (Class B, C)
6. Segregation documented and verified (Class C)
7. Architecture verified (review records)

**Common Findings**:
- ❌ Interfaces not fully specified (missing data types, error handling)
- ❌ SOUP known anomalies not documented
- ❌ Segregation not clearly defined (Class C)
- ❌ Requirements not traceable to software items
- ❌ Architecture not verified (no review records)

## Related Standards

- **ISO 13485** §7.3.4 - Design and development outputs
- **FDA 21 CFR 820.30(d)** - Design output
- **EU MDR 2017/745** Annex I, Chapter I, 17.3 - Software architecture
- **IEC 62304** §5.3 - Architectural design
- **ISO 14971** - Risk control implementation in architecture

## Integration with Other Cards

- **COMP-IEC62304-001**: Safety classification determines segregation requirements
- **COMP-IEC62304-002**: Architecture follows Development Plan
- **COMP-IEC62304-003**: Architecture implements software requirements
- **COMP-IEC62304-005**: Architecture drives detailed design
- **COMP-IEC62304-009**: Risk controls implemented in architecture
- **COMP-EN18031-017**: ML model validation architecture

## Revision History

| Version | Date       | Changes                          | Author |
|---------|------------|----------------------------------|--------|
| 1.0.0   | 2025-12-13 | Initial compliance card creation | AI/ML Compliance Team |

---

**Document Control**: This compliance card is maintained under configuration management. Updates require approval from Quality Assurance and Regulatory Affairs.

**Next Review Date**: 2026-12-13 or upon standard update

