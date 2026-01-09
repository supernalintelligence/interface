---
id: comp-iec62304-014
framework: iec62304
title: Software Change Control Process
version: 1.0.0
effectiveDate: 2025-12-13T00:00:00.000Z
status: pending-verification
owner: compliance-team
category: maintenance-process
phase:
  - 11-production
  - 12-operations
severity: critical
auditFrequency: per-change
relatedCards:
  - comp-iec62304-001
  - comp-iso14971-001
  - comp-fda-ml-003
linkedRequirements: []
linkedRisks: []
tags:
  - medical-device
  - change-control
  - maintenance
  - IEC-62304
sourceVerification:
  primarySource: iec62304-2015
  sections:
    - §6.2
  verifiedDate: null
  confidence: medium
  notes: Generated from implicit memory - REQUIRES SOURCE VERIFICATION
references: []
---

# IEC 62304-014: Software Change Control Process

## Regulatory Context

**Standard**: IEC 62304:2006+AMD1:2015  
**Section**: §6.2 - Change Control Process  
**Classification**: All Classes  
**Regulatory Impact**: CRITICAL

**Related Standards**:
- ISO 13485 §7.3.9 (Design and Development Changes)
- ISO 14971 (Risk Management for Changes)
- FDA Guidance on AI/ML Change Control (for AI/ML devices)

⚠️ **VERIFICATION STATUS**: This card requires verification against authoritative source IEC 62304:2015 §6.2

---

## Standard Requirements

### IEC 62304 §6.2.1 - Use Change Control Process

**SHALL Requirements** (All Classes):
1. **Implement change control process** for modification requests
2. **Document process** for analyzing, approving, implementing changes

### IEC 62304 §6.2.2 - Analyze Change Requests

**SHALL Requirements** (All Classes):
1. **Analyze changes** for impact on:
   - Safety
   - Existing requirements
   - Existing design
   - Interfaces
   - Documentation
2. **Document analysis**

### IEC 62304 §6.2.3 - Integrate Change

**SHALL Requirements** (All Classes):
1. **Implement approved changes** according to software development plan
2. **Verify changes**
3. **Ensure change traceability**

### IEC 62304 §6.2.4 - Communication of Changes to Stakeholders

**SHALL Requirements** (All Classes):
1. **Communicate changes** to affected parties
2. **Document communication**

### IEC 62304 §6.2.5 - Document Change Process

**SHALL Requirements** (All Classes):
1. **Document change control process**
2. **Maintain change records**

---

## Implementation Requirements

### 1. Change Request Initiation (§6.2.1)

**Requirement**: Establish formal change control process

**Acceptance Criteria**:

```gherkin
Feature: Change Request Process
  As a developer or user
  I need a formal change request process
  So that software changes are controlled and safe

  Scenario: Submit Change Request (All Classes)
    Given need for software change
    When submitting change request
    Then request SHALL include:
      | field | example |
      | Change ID | CHG-2025-001 |
      | Requestor | Dr. Smith |
      | Date | 2025-12-13 |
      | Description | Add login timeout notification |
      | Justification | User feedback - improve UX |
      | Priority | Medium |
      | Type | Enhancement |
    And request SHALL be reviewed by change control board (CCB)

  Scenario: Change Types
    Given change request
    When categorizing change
    Then type SHALL be one of:
      | type | example |
      | Bug Fix | Fix null pointer exception |
      | Enhancement | Add new feature |
      | Security Fix | Patch XSS vulnerability |
      | Performance | Optimize database query |
      | Maintenance | Update dependencies |
```

### 2. Change Impact Analysis (§6.2.2)

**Requirement**: Analyze changes for safety and system impact

**Acceptance Criteria**:

```gherkin
Feature: Change Impact Analysis
  As a change control board member
  I need comprehensive impact analysis
  So that change risks are understood before approval

  Scenario: Analyze Change Impact (All Classes)
    Given change request CHG-2025-001
    When performing impact analysis
    Then safety impact SHALL be analyzed:
      - Could change introduce new hazards?
      - Does change affect existing hazard mitigations?
      - Are risk controls affected?
    And requirements impact SHALL be analyzed:
      - Which requirements are affected?
      - Are new requirements needed?
      - Do existing requirements need modification?
    And design impact SHALL be analyzed:
      - Which components are affected?
      - Are architectural changes needed?
      - Are interfaces affected?
    And documentation impact SHALL be analyzed:
      - User manual updates needed?
      - IFU updates needed?
      - Labeling changes needed?
    And verification/validation impact SHALL be analyzed:
      - Which tests need re-execution?
      - Are new tests needed?
      - Is validation needed?

  Scenario: Safety Classification Impact (Class B, C)
    Given change request for Class B or C software
    When analyzing safety impact
    Then risk analysis SHALL be updated (ISO 14971)
    And safety classification SHALL be reviewed
    And hazard analysis SHALL be updated if needed

  Scenario: SOUP Impact Analysis
    Given change affects SOUP (third-party components)
    When analyzing impact
    Then SOUP version changes SHALL be documented
    Then new SOUP risks SHALL be assessed
    And SOUP anomaly lists SHALL be reviewed
```

### 3. Change Approval (§6.2.1, §6.2.2)

**Requirement**: Approve changes based on analysis

**Acceptance Criteria**:

```gherkin
Feature: Change Approval Process
  As a change control board
  I need to approve/reject changes based on analysis
  So that only safe, necessary changes are implemented

  Scenario: Change Control Board Review
    Given change request with impact analysis
    When CCB reviews change
    Then CCB SHALL include:
      - Software lead
      - QA manager
      - Safety officer (for safety-critical changes)
      - Regulatory affairs (if regulatory impact)
    And CCB SHALL decide: Approve, Reject, or Defer
    And decision SHALL be documented with rationale
    And approval SHALL include verification plan

  Scenario: Approve Change (Example)
    Given CHG-2025-001: "Add login timeout notification"
    When CCB reviews
    Then safety impact: None (UI enhancement only)
    And requirements impact: Add REQ-UX-045
    And design impact: Modify AuthService component
    And verification: Re-run auth integration tests
    And validation: Not required (non-safety-critical)
    And decision: APPROVED
    And assigned to: John Doe
    And target version: v1.1.0

  Scenario: Reject Change (Example)
    Given CHG-2025-002: "Remove password complexity requirements"
    When CCB reviews
    Then safety impact: HIGH (weakens security control)
    And risk analysis: Unacceptable increase in breach risk
    And decision: REJECTED
    And rationale: "Violates HIPAA security requirements"
```

### 4. Change Implementation (§6.2.3)

**Requirement**: Implement and verify approved changes

**Acceptance Criteria**:

```gherkin
Feature: Change Implementation
  As a developer
  I need to implement approved changes systematically
  So that changes are traceable and verified

  Scenario: Implement Change (All Classes)
    Given approved change request CHG-2025-001
    When implementing change
    Then implementation SHALL follow software development plan
    And code changes SHALL be documented
    And new/modified requirements SHALL be implemented
    And design SHALL be updated
    And tests SHALL be updated/added
    And all affected tests SHALL pass
    And code review SHALL be conducted
    And traceability SHALL be maintained (CHG → REQ → Code → Tests)

  Scenario: Verification of Change (All Classes)
    Given implemented change
    When verifying change
    Then affected unit tests SHALL be re-executed
    And affected integration tests SHALL be re-executed
    And affected system tests SHALL be re-executed
    And regression tests SHALL be executed
    And verification results SHALL be documented
    And verification SHALL be approved before release

  Scenario: Validation of Change (If Required)
    Given change affecting user workflows or safety
    When change requires validation
    Then user acceptance testing SHALL be conducted
    And clinical workflow validation SHALL be conducted (if applicable)
    And validation results SHALL be documented
```

### 5. Change Communication (§6.2.4)

**Requirement**: Communicate changes to stakeholders

**Acceptance Criteria**:

```gherkin
Feature: Change Communication
  As a change manager
  I need to communicate changes to stakeholders
  So that affected parties are informed

  Scenario: Identify Affected Stakeholders
    Given implemented change
    When identifying stakeholders
    Then stakeholders SHALL include:
      - Users (if user-facing change)
      - Regulatory affairs (if regulatory impact)
      - Technical support (if support procedures affected)
      - Training (if training materials affected)
      - Marketing (if product claims affected)

  Scenario: Communicate Change
    Given change CHG-2025-001 released in v1.1.0
    When communicating change
    Then release notes SHALL include change description
    And user manual SHALL be updated (if applicable)
    And IFU SHALL be updated (if applicable)
    And regulatory notifications SHALL be filed (if applicable)
    And communication SHALL be documented
```

### 6. Change Documentation (§6.2.5)

**Requirement**: Document change control process and records

**Acceptance Criteria**:

```gherkin
Feature: Change Documentation
  As a quality manager
  I need comprehensive change records
  So that changes are auditable and traceable

  Scenario: Change Record (All Classes)
    Given completed change
    When documenting change
    Then change record SHALL include:
      | field | example |
      | Change ID | CHG-2025-001 |
      | Description | Add login timeout notification |
      | Requestor | Dr. Smith |
      | Request date | 2025-12-01 |
      | Impact analysis | Impact-analysis-001.pdf |
      | CCB decision | Approved 2025-12-02 |
      | Implementer | John Doe |
      | Implementation date | 2025-12-10 |
      | Verification results | All tests passed |
      | Released in | v1.1.0 |
      | Affected requirements | REQ-UX-045 (new) |
      | Affected code | AuthService.ts, Login.tsx |
      | Affected tests | auth.integration.test.js |

  Scenario: Change Traceability
    Given change record
    When auditing traceability
    Then CHG → Requirements SHALL be traceable
    And CHG → Design SHALL be traceable
    And CHG → Code SHALL be traceable
    And CHG → Tests SHALL be traceable
    And CHG → Release SHALL be traceable
```

## Technical Implementation

### Change Control Board (CCB) Meeting Template

```markdown
# Change Control Board Meeting Minutes

**Date**: 2025-12-02  
**Attendees**: Jane Smith (Software Lead), John Doe (QA), Dr. Sarah Lee (Safety Officer)  
**Facilitator**: Jane Smith

---

## Agenda

1. Review change requests
2. Approve/reject changes
3. Assign implementation

---

## Change Requests Reviewed

### CHG-2025-001: Add Login Timeout Notification

**Requestor**: Dr. Smith (User)  
**Description**: Add visual notification 5 minutes before session timeout  
**Justification**: Improve UX - users lose work when session expires unexpectedly  
**Priority**: Medium

**Impact Analysis**:
- **Safety**: None (UI enhancement, non-safety-critical)
- **Requirements**: Add REQ-UX-045 "Notify user 5 min before timeout"
- **Design**: Modify AuthService (add timer), add Notification component
- **Interfaces**: Add WebSocket event for timeout warning
- **Documentation**: Update user manual (session timeout section)
- **Verification**: Re-run auth integration tests, add UI test
- **Validation**: Not required

**CCB Decision**: **APPROVED**  
**Rationale**: Low risk, high user value  
**Assigned to**: John Doe  
**Target version**: v1.1.0  
**Verification plan**: Integration tests + manual UI test

---

### CHG-2025-002: Remove Password Complexity Requirements

**Requestor**: Anonymous user feedback  
**Description**: Remove requirements for uppercase, numbers, special characters  
**Justification**: "Password requirements too strict"  
**Priority**: Low

**Impact Analysis**:
- **Safety**: **HIGH** - Weakens authentication security control
- **Risk**: Increases risk of weak passwords → account breach → PHI exposure
- **Compliance**: Violates HIPAA security requirements (§164.308(a)(5)(ii)(D))

**CCB Decision**: **REJECTED**  
**Rationale**: Unacceptable safety and compliance risk  
**Alternative**: Recommend implementing passkeys (CHG-2025-003)

---

### CHG-2025-003: Upgrade PostgreSQL 15.3 → 15.4 (Security Patch)

**Requestor**: DevOps team  
**Description**: Upgrade PostgreSQL to patch CVE-2023-XXXX  
**Justification**: Critical security vulnerability  
**Priority**: **CRITICAL**

**Impact Analysis**:
- **Safety**: Positive (fixes security vulnerability)
- **Risk**: Low (patch release, backward compatible)
- **SOUP**: Update SOUP version in documentation
- **Verification**: Re-run integration tests, database performance tests
- **Validation**: Not required (infrastructure change)

**CCB Decision**: **APPROVED (Expedited)**  
**Rationale**: Critical security fix  
**Assigned to**: DevOps team  
**Target version**: v1.0.1 (hotfix)  
**Verification plan**: Full regression test suite

---

## Action Items

1. John Doe: Implement CHG-2025-001 for v1.1.0
2. DevOps: Implement CHG-2025-003 for v1.0.1 hotfix (deadline: 2025-12-05)
3. Jane Smith: Draft passkeys feature proposal (CHG-2025-003 alternative)

---

**Next Meeting**: 2025-12-09

**Minutes approved by**:  
_______________ (Jane Smith, Software Lead)  
_______________ (John Doe, QA Manager)  
_______________ (Dr. Sarah Lee, Safety Officer)
```

### Change Record Template

```yaml
# Change Record: CHG-2025-001

id: CHG-2025-001
title: "Add Login Timeout Notification"
type: enhancement  # bug-fix, enhancement, security-fix, maintenance
priority: medium   # critical, high, medium, low
safetyClassification: class-c

# Request
requestDate: '2025-12-01'
requestor:
  name: "Dr. Smith"
  role: "Physician User"
  contact: "dr.smith@hospital.com"
description: |
  Add visual notification 5 minutes before session timeout (currently 30 min).
  Users report losing work when session expires unexpectedly.
justification: "Improve user experience and prevent data loss"

# Impact Analysis
impactAnalysis:
  date: '2025-12-02'
  analyst: "John Doe (QA Manager)"
  safetyImpact: "None - UI enhancement only, non-safety-critical"
  requirementsImpact:
    - action: add
      requirement: REQ-UX-045
      description: "System SHALL notify user 5 minutes before session timeout"
  designImpact:
    affectedComponents:
      - AuthService (add timeout timer logic)
      - Notification (new component)
      - WebSocket (add timeout event)
  interfacesImpact:
    - interface: WebSocket
      change: "Add 'session-timeout-warning' event"
  documentationImpact:
    - User manual (update session timeout section)
  verificationImpact:
    - Re-run auth integration tests
    - Add UI test for notification display
  validationImpact: "Not required (non-safety-critical)"
  riskAnalysis: "No new risks identified"

# CCB Decision
ccbReview:
  date: '2025-12-02'
  attendees:
    - Jane Smith (Software Lead)
    - John Doe (QA Manager)
    - Dr. Sarah Lee (Safety Officer)
  decision: approved  # approved, rejected, deferred
  rationale: "Low risk, high user value"
  conditions: "Must pass integration tests before release"
  assignedTo: "John Doe"
  targetVersion: "v1.1.0"

# Implementation
implementation:
  startDate: '2025-12-03'
  endDate: '2025-12-10'
  implementer: "John Doe"
  affectedCode:
    - supernal-code-package/lib/auth/AuthService.js
    - apps/supernal-dashboard/components/Notification.tsx
    - apps/supernal-dashboard/lib/websocket.ts
  affectedTests:
    - tests/integration/auth.integration.test.js (modified)
    - tests/ui/timeout-notification.test.js (new)
  gitCommits:
    - a1b2c3d4: "feat: Add session timeout warning logic"
    - e5f6g7h8: "feat: Add Notification component"
    - i9j0k1l2: "test: Add timeout notification tests"

# Verification
verification:
  date: '2025-12-10'
  verifier: "Jane Smith"
  testsExecuted:
    - auth.integration.test.js (all passed)
    - timeout-notification.test.js (all passed)
    - regression suite (all passed)
  result: passed
  evidence: tests/evidence/CHG-2025-001-verification.zip

# Release
release:
  version: "v1.1.0"
  releaseDate: '2025-12-15'
  releaseNotes: "Added session timeout notification to improve user experience"
  
# Communication
communication:
  stakeholders:
    - name: "All users"
      method: "Release notes, in-app notification"
      date: '2025-12-15'
    - name: "Technical support"
      method: "Updated support documentation"
      date: '2025-12-14'

# Traceability
traceability:
  requirements:
    - REQ-UX-045 (new)
  design:
    - DESIGN-AUTH-005 (modified)
  code:
    - supernal-code-package/lib/auth/AuthService.js
    - apps/supernal-dashboard/components/Notification.tsx
  tests:
    - tests/integration/auth.integration.test.js
    - tests/ui/timeout-notification.test.js
  documentation:
    - docs/user-manual.md (updated)

# Audit Trail
auditTrail:
  - date: '2025-12-01'
    event: "Change request submitted"
    user: "Dr. Smith"
  - date: '2025-12-02'
    event: "Impact analysis completed"
    user: "John Doe"
  - date: '2025-12-02'
    event: "CCB approved change"
    user: "Jane Smith"
  - date: '2025-12-10'
    event: "Implementation complete"
    user: "John Doe"
  - date: '2025-12-10'
    event: "Verification passed"
    user: "Jane Smith"
  - date: '2025-12-15'
    event: "Released in v1.1.0"
    user: "Release Manager"

status: closed
closedDate: '2025-12-15'
```

## Compliance Evidence

### Required Records
1. **Change Control Process Documentation** (§6.2.1, §6.2.5)
2. **Change Requests**
3. **Impact Analysis Reports** (§6.2.2)
4. **CCB Meeting Minutes** (approval decisions)
5. **Implementation Records** (§6.2.3)
6. **Verification Results** (§6.2.3)
7. **Stakeholder Communication Records** (§6.2.4)
8. **Change Traceability Matrix** (CHG → REQ → Code → Tests)

### Audit Expectations

**Auditor Will Check**:
1. Change control process documented and followed
2. All changes have impact analysis
3. Changes approved by CCB before implementation
4. Changes verified before release
5. Stakeholders notified of changes
6. Traceability maintained

**Common Findings**:
- ❌ Changes implemented without CCB approval
- ❌ Missing impact analysis (especially safety impact)
- ❌ No verification of changes before release
- ❌ Poor traceability (can't link change to requirements/code)

## Integration with Other Cards

- **COMP-IEC62304-001**: Safety classification affects change analysis
- **COMP-ISO14971-001**: Risk management updated for changes
- **COMP-FDA-ML-003**: FDA AI/ML-specific change control for AI/ML devices

## Revision History

| Version | Date       | Changes | Author |
|---------|------------|---------|--------|
| 1.0.0   | 2025-12-13 | Initial (pending source verification) | AI/ML Compliance Team |

---

⚠️ **SOURCE VERIFICATION REQUIRED**: This card must be verified against IEC 62304:2015 §6.2

