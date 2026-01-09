---
id: comp-iec62304-003
framework: iec62304
title: Software Requirements Analysis
version: 1.0.0
effectiveDate: 2025-12-13T00:00:00.000Z
status: pending-verification
owner: compliance-team
category: lifecycle-process
phase:
  - 2-research
  - 3-design
  - 5-requirements
severity: critical
auditFrequency: per-release
relatedCards:
  - comp-iec62304-001
  - comp-iec62304-002
  - comp-iec62304-009
  - comp-iec62304-004
linkedRequirements: []
linkedRisks: []
tags:
  - medical-device
  - software-requirements
  - traceability
  - IEC-62304
  - verification
references: []
---

# IEC 62304-003: Software Requirements Analysis

## Regulatory Context

**Standard**: IEC 62304:2006+AMD1:2015 - Medical Device Software Lifecycle Processes  
**Section**: §5.2 - Software Requirements Analysis  
**Classification**: Class A, B, C (All)  
**Regulatory Impact**: HIGH

### Why This Matters

Software requirements are the foundation for safe medical device software. Clear, complete, and verifiable requirements ensure that:
- Software correctly implements system requirements
- Safety hazards are identified and controlled
- Software functionality is traceable and verifiable
- Regulatory compliance can be demonstrated

Poor requirements are the #1 cause of medical device recalls and FDA Warning Letters.

## Standard Requirements

### IEC 62304 §5.2.1 - Define and Document Software Requirements

**SHALL Requirements**:
1. **Define and document software requirements** from:
   - System requirements allocated to software
   - Risk control measures
   - User interface requirements
   - Data definitions and database requirements
   - Installation and acceptance requirements
   - Requirements related to methods of operation and maintenance
   - User documentation requirements
   - Requirements related to regulatory compliance

### IEC 62304 §5.2.2 - Content of Software Requirements

**SHALL Requirements**:
1. **Software requirements SHALL**:
   - Implement system requirements and risk controls
   - NOT conflict with each other
   - Be stated in terms that permit verification
   - Have unique identifiers for traceability

### IEC 62304 §5.2.3 - Include Risk Control Measures

**SHALL Requirements**:
1. **Include risk control measures** from risk management process
2. **Document traceability** from risk controls to software requirements

### IEC 62304 §5.2.4 - Re-evaluate Medical Device Risk Analysis

**SHALL Requirements**:
1. **Re-evaluate risk analysis** when defining software requirements
2. **Document any new hazards** or update existing hazard analysis

### IEC 62304 §5.2.5 - Update System Requirements (if needed)

**SHALL Requirements**:
1. **Update system requirements** if software requirements cannot be satisfied
2. **Obtain approval** for system requirements changes

### IEC 62304 §5.2.6 - Verify Software Requirements

**SHALL Requirements**:
1. **Verify software requirements** using appropriate methods:
   - Reviews
   - Prototyping
   - Modeling
   - Simulation
   - Other techniques

## Implementation Requirements

### 1. Requirements Documentation

**Requirement**: Define and document all software requirements

**Acceptance Criteria**:

```gherkin
Feature: Software Requirements Documentation
  As a requirements engineer
  I need all software requirements documented
  So that software functionality is clearly specified and verifiable

  Scenario: Document Software Requirements
    Given a medical device system
    When defining software requirements
    Then each requirement SHALL have a unique identifier (e.g., REQ-WORKFLOW-001)
    And each requirement SHALL be derived from system requirements
    And each requirement SHALL be stated in verifiable terms
    And each requirement SHALL be categorized (functional, performance, safety, etc.)
    And each requirement SHALL have a priority (critical, high, medium, low)
    And each requirement SHALL reference source (system req, risk control, regulation)

  Scenario: Requirement Structure (Gherkin Format)
    Given a functional requirement
    When documenting in Gherkin format
    Then it SHALL use Given/When/Then structure
    And it SHALL include acceptance criteria
    And it SHALL be machine-readable and executable (if possible)

    Example:
      """gherkin
      Feature: User Authentication
        Scenario: Successful login
          Given a valid user with username "doctor@hospital.com"
          And the user's password is "SecurePass123!"
          When the user submits login credentials
          Then the system SHALL authenticate the user
          And the system SHALL create a session token
          And the system SHALL log the login event (audit trail)
      """
```

### 2. Requirements Categories (§5.2.1)

**Requirement**: Address all required requirement categories

**Acceptance Criteria**:

```gherkin
Feature: Requirements Categories
  As a requirements manager
  I need requirements in all IEC 62304 categories
  So that nothing is missed

  Scenario: Functional Requirements from System Requirements
    Given system requirements allocated to software
    When defining software functional requirements
    Then each system requirement SHALL be traced to software requirements
    And all system functions SHALL be implemented in software requirements
    And traceability matrix SHALL be maintained

  Scenario: Risk Control Requirements
    Given identified hazards and risk controls (ISO 14971)
    When defining software risk control requirements
    Then each risk control SHALL be traced to software requirements
    And risk control requirements SHALL be marked as safety-critical
    And risk control verification SHALL be defined

  Scenario: User Interface Requirements
    Given user interface needs
    When defining UI requirements
    Then UI workflows SHALL be documented
    And accessibility requirements SHALL be included (if applicable)
    And usability requirements SHALL be defined (IEC 62366)
    And error handling SHALL be specified

  Scenario: Data Requirements
    Given data storage needs
    When defining data requirements
    Then data structures SHALL be documented
    And data validation rules SHALL be specified
    And data persistence requirements SHALL be defined
    And data migration requirements SHALL be included (if applicable)

  Scenario: Installation and Acceptance Requirements
    Given deployment needs
    When defining installation requirements
    Then installation procedures SHALL be specified
    And system configuration SHALL be documented
    And acceptance criteria SHALL be defined
    And rollback procedures SHALL be specified

  Scenario: Operational and Maintenance Requirements
    Given operational needs
    When defining operational requirements
    Then normal operation SHALL be documented
    And abnormal operation handling SHALL be specified
    And maintenance procedures SHALL be defined
    And backup and restore requirements SHALL be included

  Scenario: Regulatory Compliance Requirements
    Given regulatory obligations (FDA, MDR, HIPAA)
    When defining compliance requirements
    Then regulatory requirements SHALL be documented
    And audit trail requirements SHALL be specified
    And electronic signature requirements SHALL be included (21 CFR Part 11)
    And data privacy requirements SHALL be defined (GDPR, HIPAA)
```

### 3. Requirements Quality (§5.2.2)

**Requirement**: Ensure requirements are complete, consistent, and verifiable

**Acceptance Criteria**:

```gherkin
Feature: Requirements Quality
  As a quality assurance engineer
  I need high-quality requirements
  So that verification is possible and unambiguous

  Scenario: Requirements Implement System Requirements
    Given system requirements
    When reviewing software requirements
    Then all system requirements SHALL be traced to software requirements
    And no system requirement SHALL be missing
    And bidirectional traceability SHALL be maintained

  Scenario: Requirements Do Not Conflict
    Given a set of software requirements
    When checking for conflicts
    Then no two requirements SHALL contradict each other
    And conflicting scenarios SHALL be resolved before approval
    And conflict resolution SHALL be documented

  Scenario: Requirements Are Verifiable
    Given a software requirement
    When assessing verifiability
    Then the requirement SHALL be testable
    And acceptance criteria SHALL be defined
    And verification method SHALL be specified (test, inspection, analysis)
    And ambiguous terms SHALL NOT be used ("user-friendly", "fast", "reliable")

    Examples of BAD (not verifiable):
      | bad_requirement                           |
      | "The system shall be fast"               |
      | "The UI shall be user-friendly"          |
      | "The system shall be highly available"   |

    Examples of GOOD (verifiable):
      | good_requirement                                          | verification_method |
      | "Login shall complete within 2 seconds (95th percentile)"| Performance test    |
      | "UI shall pass WCAG 2.1 Level AA accessibility checks"   | Inspection          |
      | "System uptime shall be >= 99.5% over 30-day period"    | Monitoring analysis |

  Scenario: Requirements Have Unique Identifiers
    Given software requirements
    When assigning identifiers
    Then each requirement SHALL have a unique ID
    And ID format SHALL follow naming convention (REQ-CATEGORY-NNN)
    And IDs SHALL be stable (not change after approval)
    And deprecated requirements SHALL be marked, not deleted
```

### 4. Risk Control Integration (§5.2.3, §5.2.4)

**Requirement**: Integrate risk controls into requirements and re-evaluate risks

**Acceptance Criteria**:

```gherkin
Feature: Risk Control Integration
  As a risk manager
  I need risk controls implemented in software requirements
  So that identified hazards are mitigated

  Scenario: Trace Risk Controls to Requirements
    Given identified risk controls (ISO 14971)
    When defining software requirements
    Then each risk control SHALL be traced to software requirements
    And requirements SHALL be marked as safety-critical
    And risk control verification SHALL be planned

    Example:
      | hazard                     | risk_control                       | software_requirement              |
      | Incorrect drug dose        | Dose range validation              | REQ-SAFETY-001: Validate dose range |
      | Unauthorized access to PHI | Role-based access control          | REQ-SECURITY-010: Implement RBAC  |
      | Data loss during update    | Automated backup before update     | REQ-DATA-005: Pre-update backup   |

  Scenario: Re-evaluate Risk Analysis
    Given software requirements are defined
    When reviewing requirements
    Then new hazards introduced by software SHALL be identified
    And existing risk analysis SHALL be updated
    And new risks SHALL be assessed (ISO 14971)
    And risk re-evaluation SHALL be documented

  Scenario: Identify Software-Introduced Hazards
    Given software requirements
    When analyzing for new hazards
    Then potential software failures SHALL be identified
    And SOUP (off-the-shelf software) risks SHALL be assessed
    And integration risks SHALL be identified
    And cybersecurity risks SHALL be assessed

    Examples of software-introduced hazards:
      | hazard                          | source                     |
      | SQL injection vulnerability     | Data input validation gap  |
      | Race condition in dose calc     | Multi-threading requirement|
      | Unencrypted PHI transmission    | Network communication req  |
      | Memory leak in long-running svc | Resource management req    |
```

### 5. System Requirements Updates (§5.2.5)

**Requirement**: Update system requirements if software cannot satisfy them

**Acceptance Criteria**:

```gherkin
Feature: System Requirements Feedback
  As a systems engineer
  I need to update system requirements if software cannot implement them
  So that requirements remain feasible and traceable

  Scenario: Identify Unsatisfiable System Requirements
    Given system requirements allocated to software
    When analyzing feasibility
    Then unsatisfiable requirements SHALL be identified
    And technical limitations SHALL be documented
    And alternative solutions SHALL be proposed

  Scenario: Update System Requirements
    Given an unsatisfiable system requirement
    When proposing system requirement update
    Then change request SHALL be created
    And impact analysis SHALL be performed
    And system requirements owner SHALL approve changes
    And updated system requirements SHALL be documented
    And traceability SHALL be maintained

  Scenario: Document Rationale
    Given a system requirement update
    When documenting the change
    Then technical rationale SHALL be provided
    And risk impact SHALL be assessed
    And approval records SHALL be retained
```

### 6. Requirements Verification (§5.2.6)

**Requirement**: Verify software requirements

**Acceptance Criteria**:

```gherkin
Feature: Requirements Verification
  As a V&V engineer
  I need to verify software requirements
  So that they are correct, complete, and implementable

  Scenario: Requirements Review
    Given documented software requirements
    When conducting requirements review
    Then completeness SHALL be verified (all categories addressed)
    And correctness SHALL be verified (accurate and unambiguous)
    And consistency SHALL be verified (no conflicts)
    And traceability SHALL be verified (to system requirements and risk controls)
    And verifiability SHALL be verified (testable acceptance criteria)
    And review participants SHALL include stakeholders (engineering, QA, regulatory)
    And review results SHALL be documented

  Scenario: Prototyping for Requirements Validation
    Given complex or novel requirements
    When uncertainty exists
    Then prototypes MAY be developed
    And prototypes SHALL be reviewed with stakeholders
    And prototype feedback SHALL be incorporated into requirements
    And prototype results SHALL be documented

  Scenario: Requirements Modeling and Simulation
    Given performance or timing requirements
    When verification is needed
    Then models or simulations MAY be used
    And modeling assumptions SHALL be documented
    And simulation results SHALL be documented
    And results SHALL validate feasibility

  Scenario: Verification Methods
    Given a software requirement
    When selecting verification method
    Then method SHALL be appropriate for requirement type

    Examples:
      | requirement_type           | verification_method                    |
      | Functional                 | Requirements review, prototyping       |
      | Performance                | Modeling, simulation                   |
      | Safety-critical            | Formal review with risk management     |
      | User interface             | Prototyping, usability review          |
      | Data                       | Data model review, schema validation   |
      | Regulatory compliance      | Compliance review with regulatory team |

  Scenario: Document Verification Results
    Given requirements verification activities
    When verification is complete
    Then verification results SHALL be documented
    And issues SHALL be tracked to resolution
    And verification approval SHALL be obtained
    And verification records SHALL be retained
```

## Technical Implementation

### Requirements File Structure (Gherkin)

```gherkin
---
id: req-workflow-087
title: Story to Implementation to Test to Metrics Traceability Chain
status: approved
priority: critical
category: traceability
phase: [5-requirements, 6-tests, 7-build]
safetyClassification: class-b
derivedFrom:
  - systemReq: SYS-REQ-015
  - riskControl: RC-012 (Ensure audit trail completeness)
relatedRisks:
  - RISK-DATA-003
verificationMethod: automated-test
tests:
  - tests/requirements/req-087/*.test.js
  - tests/integration/traceability.integration.test.js
---

Feature: Story to Implementation to Test to Metrics Traceability Chain
  As a compliance officer
  I need complete traceability from user stories to metrics
  So that regulatory audits can demonstrate requirements implementation

  Background:
    Given the Supernal Coding system is operational
    And user stories, requirements, tests, and metrics are defined

  Scenario: Trace User Story to Requirements
    Given a user story "As a developer, I want automated test traceability"
    When I query the traceability system
    Then I SHALL see all requirements derived from the story
    And each requirement SHALL have a unique REQ-XXX identifier
    And requirements SHALL be traceable back to the story

  Scenario: Trace Requirements to Implementation
    Given a requirement REQ-WORKFLOW-087
    When I query the implementation
    Then I SHALL see all source files implementing the requirement
    And implementation SHALL be traceable via test imports
    And code coverage SHALL be >= 80% for Class B requirements

  Scenario: Trace Requirements to Tests
    Given a requirement REQ-WORKFLOW-087
    When I query the test suite
    Then I SHALL see all tests verifying the requirement
    And tests SHALL be documented in requirement frontmatter
    And test results SHALL be logged with requirement ID

  Scenario: Trace Tests to Metrics
    Given executed tests for REQ-WORKFLOW-087
    When I query metrics
    Then I SHALL see pass/fail rates
    And I SHALL see code coverage metrics
    And I SHALL see performance metrics (if applicable)
    And metrics SHALL be timestamped and auditable

  Scenario: Bidirectional Traceability
    Given any artifact (story, requirement, test, implementation, metric)
    When I navigate the traceability chain
    Then I SHALL be able to trace upstream (to source)
    And I SHALL be able to trace downstream (to implementation/tests)
    And traceability gaps SHALL be identified and flagged
```

### Requirements Traceability Matrix (RTM)

```typescript
interface RequirementTraceability {
  requirementId: string;               // REQ-WORKFLOW-087
  title: string;
  status: 'draft' | 'approved' | 'implemented' | 'verified';
  priority: 'critical' | 'high' | 'medium' | 'low';
  safetyClassification: 'class-a' | 'class-b' | 'class-c';
  
  // Upstream traceability
  derivedFrom: {
    systemRequirements: string[];      // SYS-REQ-015
    riskControls: string[];            // RC-012
    regulations: string[];             // FDA 21 CFR 820, EU MDR
  };
  
  // Downstream traceability
  implementedIn: {
    sourceFiles: string[];             // Discovered from test imports
    testFiles: string[];               // From frontmatter tests:
    verificationRecords: string[];     // Test result logs
  };
  
  // Verification
  verificationMethod: 'test' | 'inspection' | 'analysis' | 'demonstration';
  verificationStatus: 'not-started' | 'in-progress' | 'passed' | 'failed';
  verificationDate?: Date;
  
  // Risk linkage
  relatedRisks: string[];              // RISK-DATA-003
  riskMitigationStatus: 'open' | 'mitigated' | 'accepted';
}

// Auto-generate RTM
async function generateRTM(): Promise<RequirementTraceability[]> {
  const requirements = await loadAllRequirements();
  const traceabilityMatrix: RequirementTraceability[] = [];

  for (const req of requirements) {
    const traces = await traceRequirement(req.id);
    traceabilityMatrix.push({
      requirementId: req.id,
      title: req.title,
      status: req.status,
      priority: req.priority,
      safetyClassification: req.safetyClassification || 'class-a',
      derivedFrom: {
        systemRequirements: req.derivedFrom?.systemReq || [],
        riskControls: req.derivedFrom?.riskControl || [],
        regulations: req.derivedFrom?.regulations || []
      },
      implementedIn: {
        sourceFiles: traces.implementations,
        testFiles: req.tests || [],
        verificationRecords: await getTestResults(req.id)
      },
      verificationMethod: req.verificationMethod || 'test',
      verificationStatus: await getVerificationStatus(req.id),
      relatedRisks: req.relatedRisks || [],
      riskMitigationStatus: await getRiskStatus(req.relatedRisks)
    });
  }

  return traceabilityMatrix;
}
```

### Requirements Verification Checklist

```markdown
# Software Requirements Verification Checklist (IEC 62304 §5.2.6)

**Requirement ID**: REQ-WORKFLOW-087  
**Review Date**: 2025-12-13  
**Reviewers**: Engineering Lead, QA Lead, Risk Manager  

## Completeness
- [x] All system requirements traced to software requirements
- [x] All risk controls traced to software requirements
- [x] All requirement categories addressed (functional, data, UI, regulatory)
- [x] Installation and operational requirements defined
- [x] User documentation requirements defined

## Correctness
- [x] Requirements accurately reflect system requirements
- [x] Requirements correctly implement risk controls
- [x] Technical terminology is correct
- [x] Acceptance criteria are correct

## Consistency
- [x] No conflicting requirements
- [x] Terminology is consistent across requirements
- [x] Requirements align with system architecture
- [x] Requirements align with regulatory obligations

## Traceability
- [x] Each requirement has unique identifier
- [x] Traceability to system requirements documented
- [x] Traceability to risk controls documented
- [x] Traceability to regulations documented

## Verifiability
- [x] Each requirement is testable
- [x] Acceptance criteria are defined
- [x] Verification method is specified
- [x] No ambiguous terms ("fast", "user-friendly", etc.)

## Risk Assessment
- [x] Risk analysis re-evaluated
- [x] New software hazards identified
- [x] Risk controls implemented in requirements
- [x] Safety-critical requirements marked

## Approval
- [ ] Engineering Lead: _______________  Date: _______
- [ ] QA Lead: _______________  Date: _______
- [ ] Risk Manager: _______________  Date: _______
- [ ] Regulatory Affairs: _______________  Date: _______

## Issues Identified
| Issue | Severity | Resolution | Assigned To | Status |
|-------|----------|------------|-------------|--------|
| REQ-087 missing performance criteria | Medium | Add 95th percentile latency requirement | Engineering | Resolved |
```

## Compliance Evidence

### Required Records

1. **Software Requirements Specification (SRS)** - All documented requirements
2. **Requirements Traceability Matrix (RTM)** - Upstream and downstream traceability
3. **Requirements Verification Report** - Verification results
4. **Risk Analysis Update** - Re-evaluation of risks based on requirements
5. **System Requirements Updates** - Changes to system requirements (if any)
6. **Requirements Review Records** - Review meeting minutes, approvals
7. **Prototype/Modeling Results** - If used for verification

### Audit Expectations

**Auditor Will Check**:
1. All requirements documented with unique IDs
2. Requirements traced to system requirements and risk controls
3. Requirements are verifiable (testable)
4. Risk analysis re-evaluated
5. Requirements verified (review records)
6. No conflicting requirements
7. All requirement categories addressed (§5.2.1)

**Common Findings**:
- ❌ Requirements not verifiable (ambiguous, untestable)
- ❌ Missing traceability to risk controls
- ❌ Risk analysis not re-evaluated
- ❌ Requirements missing acceptance criteria
- ❌ Conflicting requirements not resolved
- ❌ Missing requirement categories (e.g., maintenance, installation)

## Related Standards

- **ISO 13485** §7.3.3 - Design and development inputs
- **FDA 21 CFR 820.30(c)** - Design input
- **EU MDR 2017/745** Annex I, Chapter I, 17.2 - Software requirements
- **IEC 62366** - Usability requirements
- **ISO 14971** - Risk control requirements
- **IEEE 29148** - Systems and software engineering - Life cycle processes - Requirements engineering

## Integration with Other Cards

- **COMP-IEC62304-001**: Safety classification determines requirements rigor
- **COMP-IEC62304-002**: Requirements defined per Development Plan
- **COMP-IEC62304-009**: Risk controls integrated into requirements
- **COMP-IEC62304-004**: Requirements drive architectural design
- **COMP-EN18031-017**: Model validation requirements
- **COMP-FDA-ML-001**: GMLP clinical objective requirements

## Revision History

| Version | Date       | Changes                          | Author |
|---------|------------|----------------------------------|--------|
| 1.0.0   | 2025-12-13 | Initial compliance card creation | AI/ML Compliance Team |

---

**Document Control**: This compliance card is maintained under configuration management. Updates require approval from Quality Assurance and Regulatory Affairs.

**Next Review Date**: 2026-12-13 or upon standard update


