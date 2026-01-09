---
id: comp-iec62304-012
framework: iec62304
title: Software Release and Validation
version: 1.0.0
effectiveDate: 2025-12-13T00:00:00.000Z
status: pending-verification
owner: compliance-team
category: lifecycle-process
phase:
  - 9-milestone
  - 10-staging
  - 11-production
severity: critical
auditFrequency: per-release
relatedCards:
  - comp-iec62304-001
  - comp-iec62304-008
  - comp-iso14971-001
linkedRequirements: []
linkedRisks: []
tags:
  - medical-device
  - validation
  - release
  - IEC-62304
sourceVerification:
  primarySource: iec62304-2015
  sections:
    - §5.8
  verifiedDate: null
  confidence: medium
  notes: Generated from implicit memory - REQUIRES SOURCE VERIFICATION
references: []
---

# IEC 62304-012: Software Release and Validation

## Regulatory Context

**Standard**: IEC 62304:2006+AMD1:2015  
**Section**: §5.8 - Software Release  
**Classification**: All Classes  
**Regulatory Impact**: CRITICAL

**Related Standards**:
- IEC 62304 §5.7 (System Testing - verification)
- ISO 13485 §7.3.6 (Design and Development Validation)
- ISO 14971 (Risk Management - validation of risk controls)

⚠️ **VERIFICATION STATUS**: This card requires verification against authoritative source IEC 62304:2015 §5.8

---

## Key Distinction: Verification vs. Validation

**Verification** (§5.7 - System Testing):
- "Are we building the product right?"
- Testing against requirements/specifications
- Objective: Confirm software meets requirements

**Validation** (§5.8 - Release):
- "Are we building the right product?"
- Testing in intended use environment
- Objective: Confirm software meets user needs and is safe/effective

---

## Standard Requirements

### IEC 62304 §5.8.1 - Ensure Software Verification is Complete

**SHALL Requirements** (All Classes):
1. **Ensure all verification tasks complete** before release
2. **Document verification completion**

### IEC 62304 §5.8.2 - Document Known Residual Anomalies

**SHALL Requirements** (All Classes):
1. **Document all known residual anomalies**
2. **Analyze anomalies** for safety/security impact
3. **Justify release** despite anomalies

### IEC 62304 §5.8.3 - Evaluate Known Residual Anomalies (Class B, C)

**SHALL Requirements** (Class B, C):
1. **Evaluate known anomalies** that could contribute to hazardous situations
2. **Document evaluation** in risk management file

### IEC 62304 §5.8.4 - Document Released Versions

**SHALL Requirements** (All Classes):
1. **Maintain version documentation** for each release
2. **Include configuration items, SOUP versions**

### IEC 62304 §5.8.5 - Document How Released Version was Created

**SHALL Requirements** (Class B, C):
1. **Document build procedure** for released software
2. **Include tools, environment, configuration**

### IEC 62304 §5.8.6 - Ensure Activities are Complete

**SHALL Requirements** (All Classes):
1. **Ensure all development activities complete** per plan
2. **Document completion**

### IEC 62304 §5.8.7 - Archive Software (Class B, C)

**SHALL Requirements** (Class B, C):
1. **Archive released software**
2. **Ensure reproducibility** (can rebuild from archive)

### IEC 62304 §5.8.8 - Assure Reliable Delivery

**SHALL Requirements** (All Classes):
1. **Ensure software delivered without corruption**
2. **Document delivery procedures**

---

## Implementation Requirements

### 1. Validation Planning and Execution

**Requirement**: Validate software in intended use environment

**Acceptance Criteria**:

```gherkin
Feature: Software Validation (User Needs Verification)
  As a validation engineer
  I need to validate software in the intended use environment
  So that user needs are met and software is safe/effective

  Scenario: Define Validation Plan
    Given software ready for validation
    When creating validation plan
    Then intended use environment SHALL be specified
    And user profiles SHALL be defined
    And clinical workflows SHALL be documented
    And validation acceptance criteria SHALL be defined
    And validation SHALL be independent from development

  Scenario: Conduct User Acceptance Testing (UAT)
    Given validation plan
    When conducting UAT with real users
    Then tests SHALL be performed in intended use environment
    And typical clinical scenarios SHALL be tested
    And users SHALL perform realistic tasks
    And user feedback SHALL be documented
    And safety-critical workflows SHALL be validated
    And acceptance criteria SHALL be met

  Scenario: Validate Risk Controls
    Given risk management file (ISO 14971)
    When validating risk controls
    Then all risk controls SHALL be tested in real-world scenarios
    And residual risks SHALL be acceptable
    And risk-benefit analysis SHALL be positive
```

### 2. Release Readiness Review (§5.8.1, §5.8.6)

**Requirement**: Ensure all activities complete before release

**Acceptance Criteria**:

```gherkin
Feature: Release Readiness Review
  As a release manager
  I need to ensure all activities complete
  So that software is ready for safe release

  Scenario: Verification Complete (§5.8.1)
    Given software development lifecycle
    When reviewing verification completion
    Then all unit tests SHALL pass (COMP-IEC62304-006)
    And all integration tests SHALL pass (COMP-IEC62304-007)
    And all system tests SHALL pass (COMP-IEC62304-008)
    And all validation tests SHALL pass
    And verification completion SHALL be documented

  Scenario: All Activities Complete (§5.8.6)
    Given development plan
    When reviewing activity completion
    Then software development plan SHALL be complete
    And requirements analysis SHALL be complete
    And architectural design SHALL be complete
    And detailed design SHALL be complete (Class B, C)
    And implementation SHALL be complete
    And verification SHALL be complete
    And validation SHALL be complete
    And risk management SHALL be complete

  Scenario: Documentation Complete
    Given release package
    When reviewing documentation
    Then user manual SHALL be complete
    And technical documentation SHALL be complete
    And IFU (Instructions for Use) SHALL be complete
    And labeling SHALL be complete
    And all SOPs SHALL be documented
```

### 3. Residual Anomalies Documentation (§5.8.2, §5.8.3)

**Requirement**: Document and evaluate known anomalies

**Acceptance Criteria**:

```gherkin
Feature: Residual Anomalies Management
  As a quality manager
  I need to document all known anomalies
  So that release decision is informed and justified

  Scenario: Document Known Anomalies (§5.8.2 - All Classes)
    Given software ready for release
    When documenting anomalies
    Then all known bugs SHALL be listed
    And severity/priority SHALL be assigned
    And safety impact SHALL be analyzed
    And workarounds SHALL be documented (if applicable)
    And fix status SHALL be documented (fixed, deferred, accepted)

  Scenario: Evaluate Safety Impact (§5.8.3 - Class B, C)
    Given known residual anomalies for Class B or C software
    When evaluating safety impact
    Then each anomaly SHALL be analyzed for hazardous situations
    And risk analysis SHALL be updated
    And residual risks SHALL be acceptable
    And justification SHALL be documented in risk management file
    And release decision SHALL be approved by safety officer

  Scenario: Release with Known Anomalies (Example)
    Given bug BUG-123: "Export PDF occasionally times out"
    When evaluating for release
    Then safety impact: None (functionality degradation, not hazardous)
    And workaround: "Retry export"
    And fix: Scheduled for v1.1.0
    And approval: QA Manager + Safety Officer
    Then release is APPROVED
```

### 4. Version Documentation and Archival (§5.8.4, §5.8.5, §5.8.7)

**Requirement**: Document and archive released versions

**Acceptance Criteria**:

```gherkin
Feature: Version Documentation and Archival
  As a configuration manager
  I need to document and archive released versions
  So that software is reproducible and traceable

  Scenario: Document Released Version (§5.8.4 - All Classes)
    Given released software version
    When documenting version
    Then version identifier SHALL be assigned (e.g., v1.0.0)
    And configuration items SHALL be listed (all source files, assets)
    And SOUP versions SHALL be documented (dependencies)
    And build date/time SHALL be recorded
    And release notes SHALL be created

  Scenario: Document Build Procedure (§5.8.5 - Class B, C)
    Given released version for Class B or C software
    When documenting build procedure
    Then build tools SHALL be documented (compiler, bundler, etc.)
    And build environment SHALL be documented (OS, versions)
    And build configuration SHALL be documented (flags, settings)
    And build steps SHALL be documented (reproducible procedure)
    And build artifacts SHALL be documented (checksums)

  Scenario: Archive Released Software (§5.8.7 - Class B, C)
    Given released version for Class B or C software
    When archiving
    Then source code SHALL be archived (Git tag/commit)
    And dependencies SHALL be archived (lockfiles, vendored libs)
    And build scripts SHALL be archived
    And configuration SHALL be archived
    And archive SHALL be immutable (read-only, checksummed)
    And archive SHALL enable rebuild (reproducible builds)
    And archive retention SHALL be defined (e.g., 10 years)
```

### 5. Delivery Assurance (§5.8.8)

**Requirement**: Ensure reliable delivery without corruption

**Acceptance Criteria**:

```gherkin
Feature: Reliable Software Delivery
  As a deployment manager
  I need to ensure software delivered without corruption
  So that users receive authentic, uncorrupted software

  Scenario: Delivery Integrity (§5.8.8 - All Classes)
    Given released software
    When delivering to users
    Then delivery mechanism SHALL be documented (download, CD, USB)
    And checksums SHALL be provided (SHA256)
    And digital signatures SHALL be used (code signing)
    And delivery verification SHALL be documented
    And delivery procedures SHALL prevent tampering

  Scenario: Download Delivery (Example)
    Given web-based software delivery
    When user downloads software
    Then HTTPS SHALL be used (encrypted transfer)
    And SHA256 checksum SHALL be published
    And code signature SHALL be verified by OS
    And user manual SHALL include verification steps
```

## Technical Implementation

### Release Checklist Template

```markdown
# Software Release Checklist - v1.0.0

**Product**: Supernal Coding Platform  
**Version**: 1.0.0  
**Safety Classification**: Class C  
**Release Date**: 2025-12-13  
**Release Manager**: Jane Smith

---

## 1. Verification Complete (§5.8.1)

- [x] All unit tests passed (1,250 tests)
- [x] All integration tests passed (80 tests)
- [x] All system tests passed (150 tests)
- [x] Verification report signed off (John Doe, 2025-12-10)

---

## 2. Validation Complete

- [x] Validation plan approved (VAL-PLAN-001)
- [x] User acceptance testing complete (15 users, 50 scenarios)
- [x] Clinical workflow validation complete
- [x] Validation report signed off (Dr. Sarah Lee, 2025-12-11)

---

## 3. Residual Anomalies (§5.8.2, §5.8.3)

| Bug ID | Description | Severity | Safety Impact | Status | Justification |
|--------|-------------|----------|---------------|--------|---------------|
| BUG-123 | PDF export timeout | Low | None | Deferred to v1.1.0 | Non-safety-critical, workaround available |
| BUG-456 | UI glitch on mobile | Low | None | Accepted | Cosmetic only, no functional impact |

**Safety Evaluation**: No residual anomalies pose safety risks. Risk analysis updated (RISK-SOFT-045).  
**Approval**: Safety Officer (John Doe), 2025-12-12

---

## 4. All Activities Complete (§5.8.6)

- [x] Software development plan complete
- [x] Requirements analysis complete (150 requirements)
- [x] Architectural design complete (ARCH-v1.0)
- [x] Detailed design complete (Class C)
- [x] Implementation complete
- [x] Verification complete
- [x] Validation complete
- [x] Risk management complete (RISK-MGMT-v1.0)

---

## 5. Documentation Complete

- [x] User manual (DOC-USER-v1.0)
- [x] Technical documentation (DOC-TECH-v1.0)
- [x] IFU (Instructions for Use) (DOC-IFU-v1.0)
- [x] Release notes (RELEASE-NOTES-v1.0.0)

---

## 6. Version Documentation (§5.8.4)

**Version**: v1.0.0  
**Git Commit**: a1b2c3d4e5f6  
**Build Date**: 2025-12-13T10:30:00Z

**SOUP Versions**:
- Node.js: 18.17.0 LTS
- PostgreSQL: 15.3
- bcrypt: 5.1.0
- Stripe SDK: 12.9.0
- jwt (jose): 5.1.0

---

## 7. Build Procedure (§5.8.5 - Class C)

**Build Environment**:
- OS: Ubuntu 22.04 LTS
- Node.js: 18.17.0
- pnpm: 8.6.0
- TypeScript: 5.2.0

**Build Steps**:
```bash
# 1. Checkout source
git clone https://github.com/org/repo.git
git checkout v1.0.0

# 2. Install dependencies
pnpm install --frozen-lockfile

# 3. Build
pnpm build

# 4. Generate checksums
sha256sum dist/*

# 5. Sign artifacts
codesign --sign "Developer ID" dist/app.dmg
```

**Build Output Checksums**:
- `app-v1.0.0.dmg`: `sha256:abc123...`
- `app-v1.0.0.exe`: `sha256:def456...`

---

## 8. Archive (§5.8.7 - Class C)

- [x] Source code archived (Git tag v1.0.0)
- [x] Dependencies archived (pnpm-lock.yaml committed)
- [x] Build scripts archived
- [x] Archive is immutable (Git tag signed)
- [x] Archive retention: 10 years

---

## 9. Delivery Assurance (§5.8.8)

**Delivery Method**: HTTPS download from https://releases.example.com/v1.0.0/

**Integrity Verification**:
- [x] SHA256 checksums published
- [x] Code signing certificate applied
- [x] User manual includes verification steps
- [x] Delivery procedure documented (SOP-DELIVERY-001)

---

## 10. Regulatory Approval

- [x] QA Manager approval: _______________ Date: _______
- [x] Safety Officer approval: _______________ Date: _______
- [x] Regulatory Affairs approval: _______________ Date: _______

---

## Release Authorization

**Authorized by**: _______________  
**Date**: _______  
**Signature**: _____________

---

**RELEASE APPROVED FOR DISTRIBUTION**
```

## Compliance Evidence

### Required Records
1. **Verification Completion Documentation** (§5.8.1)
2. **Residual Anomalies List** (§5.8.2)
3. **Safety Evaluation of Anomalies** (§5.8.3 - Class B, C)
4. **Version Documentation** (§5.8.4)
5. **Build Procedure Documentation** (§5.8.5 - Class B, C)
6. **Activity Completion Documentation** (§5.8.6)
7. **Software Archive** (§5.8.7 - Class B, C)
8. **Delivery Assurance Documentation** (§5.8.8)
9. **Validation Report** (User needs verification)

### Audit Expectations

**Auditor Will Check**:
1. All verification/validation activities complete
2. Residual anomalies documented and evaluated
3. Version documentation complete (SOUP versions)
4. Build procedure documented (Class B, C)
5. Software archived and reproducible (Class B, C)
6. Delivery procedures ensure integrity

**Common Findings**:
- ❌ Residual anomalies not documented
- ❌ Safety evaluation of anomalies missing (Class B, C)
- ❌ Build procedure not documented (Class B, C)
- ❌ Software not archived or not reproducible

## Integration with Other Cards

- **COMP-IEC62304-008**: System testing (verification) precedes validation
- **COMP-ISO14971-001**: Risk controls validated during release
- **COMP-FDA-ML-001**: GMLP validation requirements for AI/ML devices

## Revision History

| Version | Date       | Changes | Author |
|---------|------------|---------|--------|
| 1.0.0   | 2025-12-13 | Initial (pending source verification) | AI/ML Compliance Team |

---

⚠️ **SOURCE VERIFICATION REQUIRED**: This card must be verified against IEC 62304:2015 §5.8

