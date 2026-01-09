---
id: comp-iec62304-002
framework: iec62304
title: Software Development Planning
version: 1.0.0
effectiveDate: 2025-12-13T00:00:00.000Z
status: pending-verification
owner: compliance-team
category: lifecycle-process
phase:
  - 2-research
  - 3-design
  - 4-planning
severity: critical
auditFrequency: per-release
relatedCards:
  - comp-iec62304-001
  - comp-iec62304-009
  - comp-iec62304-014
linkedRequirements: []
linkedRisks: []
tags:
  - medical-device
  - software-lifecycle
  - development-planning
  - IEC-62304
  - quality-management
references: []
---

# IEC 62304-002: Software Development Planning

## Regulatory Context

**Standard**: IEC 62304:2006+AMD1:2015 - Medical Device Software Lifecycle Processes  
**Section**: §5.1 - Software Development Planning  
**Classification**: Class A, B, C (All)  
**Regulatory Impact**: HIGH

### Why This Matters

Software development planning is the foundation for medical device software safety and quality. Without a documented, risk-based development plan, organizations cannot demonstrate systematic control over the software lifecycle, leading to:
- Regulatory non-compliance (FDA 21 CFR 820.30, ISO 13485)
- Uncontrolled development processes
- Missing traceability and verification
- Inability to demonstrate safety assurance

## Standard Requirements

### IEC 62304 §5.1.1 - Software Development Plan

**SHALL Requirements**:
1. **Document a software development plan** that addresses:
   - Software development activities
   - Deliverables
   - Software development standards, methods, and tools
   - Software configuration management activities
   - Software problem resolution process
   - Supporting items (verification, validation, risk management)

### IEC 62304 §5.1.2 - Keep Software Development Plan Updated

**SHALL Requirements**:
1. **Update the plan** when:
   - Software development activities change
   - Project scope changes
   - Risks change
   - Standards or regulations change

### IEC 62304 §5.1.3 - Software Development Plan - Safety Class C Only

**Additional Requirements for Class C**:
1. **Document procedures for:**
   - Software verification
   - Software validation
   - Handling known anomalies
   - Risk management activities

## Implementation Requirements

### 1. Development Plan Documentation

**Requirement**: Maintain a comprehensive Software Development Plan (SDP)

**Acceptance Criteria**:

```gherkin
Feature: Software Development Plan Documentation
  As a medical device manufacturer
  I need a documented software development plan
  So that I can demonstrate systematic control over the software lifecycle

  Scenario: Create Software Development Plan
    Given a medical device software project
    When the development plan is created
    Then it SHALL include software safety classification
    And it SHALL define development activities and deliverables
    And it SHALL specify development standards and methods
    And it SHALL define tools and tool validation approach
    And it SHALL address configuration management
    And it SHALL address problem resolution
    And it SHALL address verification activities
    And it SHALL address validation activities
    And it SHALL address risk management integration
    And it SHALL define document management procedures
    And it SHALL be reviewed and approved before development starts

  Scenario: Class-Specific Plan Requirements
    Given a software safety classification of <class>
    When the development plan is reviewed
    Then it SHALL meet class-specific requirements for <class>

    Examples:
      | class   | requirement                                          |
      | Class A | Basic plan with activities and deliverables         |
      | Class B | Class A + verification procedures                    |
      | Class C | Class B + validation + anomaly handling procedures  |
```

### 2. Development Activities Definition

**Requirement**: Document all software development activities

**Acceptance Criteria**:

```gherkin
Feature: Development Activities Definition
  As a medical device development team
  I need clearly defined development activities
  So that the process is repeatable and auditable

  Scenario: Define Lifecycle Activities
    Given a software development plan
    When defining development activities
    Then it SHALL include requirements analysis
    And it SHALL include architectural design
    And it SHALL include detailed design
    And it SHALL include unit implementation and verification
    And it SHALL include integration and integration testing
    And it SHALL include system testing
    And it SHALL include release activities
    And each activity SHALL have entry criteria
    And each activity SHALL have exit criteria
    And each activity SHALL have defined outputs (deliverables)

  Scenario: Activity Sequencing
    Given development activities are defined
    When reviewing the plan
    Then activity dependencies SHALL be documented
    And critical path SHALL be identified
    And parallel activities SHALL be justified
```

### 3. Standards, Methods, and Tools

**Requirement**: Document standards, methods, and tools to be used

**Acceptance Criteria**:

```gherkin
Feature: Development Standards and Tools
  As a quality assurance manager
  I need documented standards and tools
  So that development is consistent and traceable

  Scenario: Specify Development Standards
    Given a software development plan
    When specifying standards
    Then it SHALL reference IEC 62304:2006+AMD1:2015
    And it SHALL reference applicable regional standards (FDA, MDR)
    And it SHALL specify coding standards (e.g., MISRA C, CWE)
    And it SHALL specify documentation standards
    And it SHALL specify testing standards
    And it SHALL specify design standards (architecture patterns)

  Scenario: Document Development Methods
    Given a software development plan
    When documenting methods
    Then it SHALL define software development methodology (Agile, V-Model, hybrid)
    And it SHALL define requirements management methodology
    And it SHALL define design methodology (UML, diagrams)
    And it SHALL define verification methodology
    And it SHALL define validation methodology

  Scenario: Tool Validation and Control
    Given a list of development tools
    When specifying tools in the plan
    Then each tool SHALL be listed with name and version
    And each tool SHALL have a defined purpose
    And critical tools SHALL have validation records
    And tool change procedures SHALL be defined
    And SOUP tools SHALL be documented (IEC 62304 §8)

    Examples:
      | tool_type         | validation_required | rationale                          |
      | IDE               | No                  | Not part of build chain            |
      | Compiler          | Yes                 | Directly affects binary output     |
      | Static Analyzer   | Yes                 | Verification output used for safety|
      | Version Control   | No (validated use)  | Configuration management critical  |
      | Test Framework    | Yes                 | Test results used for verification |
```

### 4. Configuration Management Integration

**Requirement**: Reference configuration management procedures

**Acceptance Criteria**:

```gherkin
Feature: Configuration Management Integration
  As a configuration manager
  I need CM procedures integrated into the development plan
  So that software items are controlled throughout the lifecycle

  Scenario: Define CM Activities
    Given a software development plan
    When defining configuration management
    Then it SHALL reference the Configuration Management Plan
    And it SHALL define configuration items (code, docs, tests)
    And it SHALL define version control procedures
    And it SHALL define branch management strategy
    And it SHALL define build and release procedures
    And it SHALL define traceability requirements
    And it SHALL define change control procedures

  Scenario: CM Tool Integration
    Given configuration management procedures
    When integrating with development plan
    Then CM tools SHALL be listed in the plan
    And CM tool access controls SHALL be defined
    And CM backup and recovery procedures SHALL be referenced
```

### 5. Problem Resolution Integration

**Requirement**: Reference problem resolution procedures

**Acceptance Criteria**:

```gherkin
Feature: Problem Resolution Integration
  As a software engineer
  I need a defined problem resolution process
  So that defects and issues are systematically addressed

  Scenario: Define Problem Resolution Process
    Given a software development plan
    When defining problem resolution
    Then it SHALL reference the Problem Resolution Process (IEC 62304 §9)
    And it SHALL define problem reporting procedures
    And it SHALL define problem classification criteria
    And it SHALL define problem investigation procedures
    And it SHALL define problem resolution verification
    And it SHALL define problem closure criteria

  Scenario: Problem Resolution Tool Integration
    Given problem resolution procedures
    When integrating with development plan
    Then issue tracking tools SHALL be listed
    And defect workflow SHALL be defined
    And severity classification SHALL be mapped to safety classes
```

### 6. Verification and Validation Planning

**Requirement**: Reference verification and validation procedures (Class B, C)

**Acceptance Criteria**:

```gherkin
Feature: Verification and Validation Planning
  As a V&V engineer
  I need defined verification and validation procedures
  So that software correctness and intended use are demonstrated

  Scenario: Verification Planning (Class B, C)
    Given software safety classification is Class B or C
    When defining verification in the development plan
    Then it SHALL reference the Software Verification Plan
    And it SHALL define verification methods (inspection, analysis, test)
    And it SHALL define verification activities per lifecycle phase
    And it SHALL define verification documentation requirements
    And it SHALL define anomaly handling during verification

  Scenario: Validation Planning (Class C)
    Given software safety classification is Class C
    When defining validation in the development plan
    Then it SHALL reference the Software Validation Plan
    And it SHALL define validation methods (clinical simulation, user testing)
    And it SHALL define validation environment requirements
    And it SHALL define validation acceptance criteria
    And it SHALL define validation documentation requirements

  Scenario: V&V Traceability
    Given verification and validation activities are defined
    When reviewing the development plan
    Then requirements-to-tests traceability SHALL be required
    And tests-to-code traceability SHALL be required
    And verification records SHALL be defined as deliverables
```

### 7. Risk Management Integration

**Requirement**: Reference risk management procedures

**Acceptance Criteria**:

```gherkin
Feature: Risk Management Integration
  As a risk manager
  I need software risk management integrated into development
  So that software hazards are controlled throughout the lifecycle

  Scenario: Define Risk Management Activities
    Given a software development plan
    When defining risk management
    Then it SHALL reference the Software Risk Management Plan (ISO 14971)
    And it SHALL reference IEC 62304 §7 Software Risk Management
    And it SHALL define when risk analysis is performed (per phase)
    And it SHALL define risk control verification procedures
    And it SHALL define risk traceability requirements

  Scenario: Safety Classification Integration
    Given software safety classification (COMP-IEC62304-001)
    When integrating risk management
    Then the plan SHALL reference the safety classification rationale
    And the plan SHALL define how classification affects activities
    And the plan SHALL define re-classification triggers
```

### 8. Plan Updates and Change Control

**Requirement**: Maintain the development plan current

**Acceptance Criteria**:

```gherkin
Feature: Development Plan Updates
  As a project manager
  I need to keep the development plan current
  So that it reflects actual development activities

  Scenario: Trigger Plan Updates
    Given a software development plan
    When any of the following occur:
      | trigger                          |
      | Change in software activities    |
      | Change in project scope          |
      | Change in standards/regulations  |
      | Change in tools                  |
      | Change in safety classification  |
      | Change in risk profile           |
    Then the development plan SHALL be reviewed
    And necessary updates SHALL be made
    And updates SHALL be approved
    And updates SHALL be distributed to affected parties

  Scenario: Version Control of Plan
    Given a software development plan
    When the plan is updated
    Then the plan SHALL be version controlled
    And changes SHALL be documented in revision history
    And previous versions SHALL be retained
    And affected parties SHALL be notified of changes

  Scenario: Audit Trail
    Given development plan updates
    When reviewing plan history
    Then all versions SHALL be retrievable
    And change rationale SHALL be documented
    And approval records SHALL be retained
```

## Technical Implementation

### Plan Template Structure

```markdown
# Software Development Plan

## 1. Project Overview
- Product name and version
- Safety classification (COMP-IEC62304-001)
- Regulatory jurisdiction (FDA 510(k), MDR, etc.)
- Development team and roles

## 2. Development Activities
- Requirements Analysis (§5.2)
- Architectural Design (§5.3)
- Detailed Design (§5.4)
- Unit Implementation and Verification (§5.5)
- Integration and Integration Testing (§5.6)
- System Testing (§5.7)
- Software Release (§5.8)

## 3. Development Standards
- IEC 62304:2006+AMD1:2015
- ISO 13485:2016
- FDA 21 CFR Part 820
- EU MDR 2017/745
- Coding standards (MISRA C, CWE Top 25)
- Documentation standards (IEEE 1016, IEEE 1012)

## 4. Development Methods
- Agile with IEC 62304 compliance
- Requirements management (Gherkin, DOORS)
- Design methodology (UML, C4 diagrams)
- Version control (Git, branching strategy)
- CI/CD pipeline (automated testing)

## 5. Development Tools
| Tool | Version | Purpose | Validation Required |
|------|---------|---------|---------------------|
| GCC  | 11.2    | Compiler| Yes                 |
| Git  | 2.40    | VCS     | No (validated use)  |
| Jest | 29.5    | Testing | Yes                 |
| SonarQube | 9.9 | Static Analysis | Yes |

## 6. Configuration Management
- Reference: Configuration Management Plan v1.2
- Configuration items: Source code, documentation, tests, build scripts
- Version control: Git with semantic versioning
- Branch strategy: GitFlow with IEC 62304 gate checks
- Build automation: CI/CD with traceability

## 7. Problem Resolution
- Reference: Problem Resolution Process v1.1 (§9)
- Issue tracking: JIRA with IEC 62304 workflow
- Severity classification: Critical, Major, Minor (mapped to safety class)
- Resolution verification: Automated regression tests
- Closure criteria: V&V sign-off required

## 8. Verification
- Reference: Software Verification Plan v1.0
- Methods: Code review, static analysis, unit tests, integration tests
- Coverage requirements: 80% statement coverage (Class B), 95% (Class C)
- Verification per phase: Design review, code review, test execution
- Anomaly handling: JIRA workflow with risk assessment

## 9. Validation
- Reference: Software Validation Plan v1.0 (Class C only)
- Methods: User acceptance testing, clinical simulation
- Environment: Production-equivalent environment
- Acceptance criteria: All critical use cases pass, no open critical defects
- Documentation: Validation report with traceability matrix

## 10. Risk Management
- Reference: Software Risk Management Plan v1.1 (ISO 14971)
- Risk analysis per phase: Requirements, design, integration, release
- Risk control verification: V&V activities
- Traceability: Hazards → risks → controls → verification
- Re-classification triggers: New hazard identified, control failure

## 11. Supporting Processes
- Document Management: Quality Management System
- Training: IEC 62304 training required for all developers
- Audits: Internal audits per ISO 13485 schedule

## 12. Plan Maintenance
- Plan owner: Project Manager
- Review frequency: Per milestone or on trigger events
- Version control: Git with semantic versioning
- Approval: Quality Manager, Regulatory Affairs

---

## Revision History
| Version | Date       | Author | Changes              |
|---------|------------|--------|----------------------|
| 1.0     | 2025-01-15 | PM     | Initial plan         |
| 1.1     | 2025-03-22 | PM     | Updated tools, added CI/CD |
```

### Plan Update Workflow

```typescript
// Example: Automated plan update trigger
interface DevelopmentPlanUpdate {
  trigger: 'scope-change' | 'tool-change' | 'risk-change' | 'standard-update';
  description: string;
  impactedSections: string[];
  requiredApprovers: string[];
}

async function triggerPlanUpdate(update: DevelopmentPlanUpdate): Promise<void> {
  // 1. Create change request
  const changeRequest = await createChangeRequest({
    document: 'Software Development Plan',
    currentVersion: '1.1',
    trigger: update.trigger,
    description: update.description,
    impactedSections: update.impactedSections
  });

  // 2. Notify affected parties
  await notifyStakeholders({
    changeRequestId: changeRequest.id,
    approvers: update.requiredApprovers,
    dueDate: addDays(new Date(), 5)
  });

  // 3. Track approval
  await trackApprovalWorkflow(changeRequest.id);

  // 4. On approval, update plan and version
  // 5. Distribute updated plan
}
```

## Compliance Evidence

### Required Records

1. **Software Development Plan** (current version)
2. **Plan approval records** (initial and updates)
3. **Plan update history** (version control)
4. **Change justification** (for each update)
5. **Distribution records** (who received the plan)
6. **Tool validation records** (for critical tools)

### Audit Expectations

**Auditor Will Check**:
1. Plan exists and is current
2. Plan addresses all IEC 62304 §5.1 requirements
3. Plan matches actual development activities
4. Updates are documented when triggers occur
5. Approvals are documented
6. Plan is distributed to development team

**Common Findings**:
- ❌ Plan is outdated (doesn't reflect current activities)
- ❌ Tool validation records missing for compilers/test tools
- ❌ Configuration management not referenced
- ❌ Risk management integration not defined
- ❌ Verification procedures not defined for Class B/C

## Related Standards

- **ISO 13485** §7.3.1 - Design and development planning
- **FDA 21 CFR 820.30** - Design controls
- **EU MDR 2017/745** Annex I, Chapter I, 17.1 - Software development lifecycle
- **IEC 62304** §5.1 - Software development planning
- **ISO 14971** - Risk management integration

## Integration with Other Cards

- **COMP-IEC62304-001**: Safety classification determines plan rigor
- **COMP-IEC62304-009**: Risk management procedures referenced in plan
- **COMP-IEC62304-014**: Change control applies to plan updates
- **COMP-IEC62304-010**: Configuration management procedures referenced in plan
- **COMP-IEC62304-011**: Problem resolution procedures referenced in plan

## Revision History

| Version | Date       | Changes                          | Author |
|---------|------------|----------------------------------|--------|
| 1.0.0   | 2025-12-13 | Initial compliance card creation | AI/ML Compliance Team |

---

**Document Control**: This compliance card is maintained under configuration management. Updates require approval from Quality Assurance and Regulatory Affairs.

**Next Review Date**: 2026-12-13 or upon standard update


