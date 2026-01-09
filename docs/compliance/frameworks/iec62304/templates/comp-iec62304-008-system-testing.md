---
id: comp-iec62304-008
framework: iec62304
title: Software System Testing
version: 1.0.0
effectiveDate: 2025-12-13T00:00:00.000Z
status: pending-verification
owner: compliance-team
category: lifecycle-process
phase:
  - 8-integration
  - 9-milestone
severity: critical
auditFrequency: per-release
relatedCards:
  - comp-iec62304-001
  - comp-iec62304-003
  - comp-iec62304-007
  - comp-iec62304-012
linkedRequirements: []
linkedRisks: []
tags:
  - medical-device
  - system-testing
  - verification
  - IEC-62304
sourceVerification:
  primarySource: iec62304-2015
  sections:
    - §5.7
  verifiedDate: null
  confidence: medium
  notes: Generated from implicit memory - REQUIRES SOURCE VERIFICATION
references: []
---

# IEC 62304-008: Software System Testing

## Regulatory Context

**Standard**: IEC 62304:2006+AMD1:2015  
**Section**: §5.7 - Software System Testing  
**Classification**: Class A, B, C (All)  
**Regulatory Impact**: CRITICAL

⚠️ **VERIFICATION STATUS**: This card requires verification against authoritative source IEC 62304:2015 §5.7

## Standard Requirements

### IEC 62304 §5.7.1 - Establish Tests from Software Requirements

**SHALL Requirements**:
1. **Establish tests** based on software requirements for verifying software system functions
2. **Document test procedures**, test data, expected results

### IEC 62304 §5.7.2 - Establish Adequacy of System Testing

**SHALL Requirements**:
1. **Document test plan** demonstrating that system testing is adequate

### IEC 62304 §5.7.3 - Conduct System Tests

**SHALL Requirements**:
1. **Conduct system tests**
2. **Document test results**

### IEC 62304 §5.7.4 - Evaluate Software System Test Results (Class B, C)

**SHALL Requirements** (Class B, C):
1. **Ensure all tests pass** or document rationale for accepting failed tests
2. **Re-test after defect fixes**

## Implementation Requirements

### 1. System Test Planning (§5.7.1, §5.7.2)

**Requirement**: Establish comprehensive system tests from requirements

**Acceptance Criteria**:

```gherkin
Feature: Software System Test Planning
  As a test engineer
  I need comprehensive system tests
  So that software requirements are verified in the integrated system

  Scenario: Derive System Tests from Requirements
    Given software requirements (COMP-IEC62304-003)
    When creating system test plan
    Then each requirement SHALL have one or more system tests
    And tests SHALL verify requirement in integrated system
    And test procedures SHALL be documented
    And test data SHALL be specified
    And expected results SHALL be defined
    And test environment SHALL be specified

  Scenario: System Test Coverage
    Given all software requirements
    When assessing system test coverage
    Then 100% of requirements SHALL have system tests
    And safety-critical requirements SHALL have multiple tests
    And risk controls SHALL be verified in system tests
    And test traceability matrix SHALL be maintained

  Scenario: Test Types
    Given system testing needs
    When defining test types
    Then functional tests SHALL be included
    And performance tests SHALL be included
    And security tests SHALL be included
    And usability tests SHALL be included (if applicable)
    And integration tests SHALL be included (hardware/software)
    And regression tests SHALL be included
```

### 2. System Test Execution (§5.7.3)

**Requirement**: Execute system tests and document results

**Acceptance Criteria**:

```gherkin
Feature: System Test Execution
  As a V&V engineer
  I need to execute system tests systematically
  So that verification results are complete and auditable

  Scenario: Execute System Tests
    Given documented system test procedures
    When executing tests
    Then tests SHALL be executed in test environment
    And test environment SHALL match specifications
    And test data SHALL be controlled and documented
    And test results SHALL be recorded
    And anomalies SHALL be documented
    And pass/fail criteria SHALL be applied

  Scenario: Test Environment
    Given system testing needs
    When specifying test environment
    Then environment SHALL be production-equivalent
    And environment configuration SHALL be documented
    And environment differences SHALL be justified
    And SOUP versions SHALL match production

  Scenario: Test Documentation
    Given executed system tests
    When documenting results
    Then test execution record SHALL include:
      | field | example |
      | Test ID | SYS-TEST-001 |
      | Requirement | REQ-SAFETY-001 |
      | Test date | 2025-12-13 |
      | Tester | John Doe |
      | Environment | Test-Env-v1.2 |
      | Result | PASS |
      | Anomalies | None |
      | Evidence | logs, screenshots |
```

### 3. System Test Results Evaluation (§5.7.4 - Class B, C)

**Requirement**: Evaluate test results and ensure all tests pass

**Acceptance Criteria**:

```gherkin
Feature: System Test Results Evaluation
  As a quality assurance manager
  I need to evaluate all system test results
  So that software is verified before release

  Scenario: All Tests Pass (Class B, C)
    Given executed system tests
    When evaluating results for Class B or C software
    Then all system tests SHALL pass
    OR rationale SHALL be documented for accepting failed tests
    And acceptance of failed tests SHALL be approved
    And risk analysis SHALL be updated for failed tests

  Scenario: Regression Testing After Defect Fixes (Class B, C)
    Given defects found during system testing
    When defects are fixed
    Then affected tests SHALL be re-executed
    And regression tests SHALL be executed
    And all tests SHALL pass after fixes
    And re-test results SHALL be documented

  Scenario: Test Metrics
    Given system test results
    When generating metrics
    Then total tests executed SHALL be reported
    And tests passed/failed SHALL be reported
    And requirements coverage SHALL be reported (100% required)
    And defect density SHALL be calculated
    And test metrics SHALL be part of release approval
```

## Technical Implementation

### System Test Example

```typescript
/**
 * System Test: User Authentication System
 * Requirements: REQ-SECURITY-010 through REQ-SECURITY-015
 * Safety Classification: Class C
 */

describe('System Test: User Authentication', () => {
  let testEnv: TestEnvironment;

  beforeAll(async () => {
    // Setup production-equivalent test environment
    testEnv = await setupTestEnvironment({
      database: 'postgresql-15.3',
      os: 'ubuntu-22.04',
      runtime: 'node-18-lts'
    });
    
    await testEnv.loadTestData('auth-test-dataset-v1.0');
  });

  afterAll(async () => {
    await testEnv.teardown();
  });

  test('SYS-TEST-010: Complete login flow (REQ-SECURITY-010)', async () => {
    // Test procedure
    const result = await testEnv.executeUserFlow([
      { action: 'navigate', url: '/login' },
      { action: 'input', field: 'username', value: 'doctor@hospital.com' },
      { action: 'input', field: 'password', value: 'SecurePass123!' },
      { action: 'click', element: 'login-button' },
      { action: 'wait', condition: 'authenticated' }
    ]);

    // Expected results
    expect(result.authenticated).toBe(true);
    expect(result.sessionToken).toBeDefined();
    expect(result.auditLog).toContainEntry({
      event: 'USER_LOGIN',
      username: 'doctor@hospital.com',
      timestamp: expect.any(Date),
      ipAddress: expect.any(String)
    });

    // Evidence collection
    await testEnv.captureEvidence('SYS-TEST-010', {
      screenshots: true,
      logs: true,
      networkTraffic: true
    });
  });

  test('SYS-TEST-011: Failed login with invalid credentials (REQ-SECURITY-011)', async () => {
    const result = await testEnv.executeUserFlow([
      { action: 'navigate', url: '/login' },
      { action: 'input', field: 'username', value: 'doctor@hospital.com' },
      { action: 'input', field: 'password', value: 'WRONG_PASSWORD' },
      { action: 'click', element: 'login-button' }
    ]);

    expect(result.authenticated).toBe(false);
    expect(result.errorMessage).toBe('Invalid username or password');
    expect(result.auditLog).toContainEntry({
      event: 'LOGIN_FAILED',
      username: 'doctor@hospital.com',
      reason: 'invalid-credentials'
    });
  });

  test('SYS-TEST-012: Session timeout after 30 minutes (REQ-SECURITY-012)', async () => {
    // Login
    await testEnv.login('doctor@hospital.com', 'SecurePass123!');

    // Fast-forward time 30 minutes
    await testEnv.advanceTime(30 * 60 * 1000);

    // Attempt authenticated action
    const result = await testEnv.makeAuthenticatedRequest('/api/patients');

    expect(result.status).toBe(401);
    expect(result.error).toBe('Session expired');
  });
});
```

### System Test Report Template

```markdown
# Software System Test Report

**Product**: Supernal Coding Medical Device Platform  
**Version**: 1.0.0  
**Safety Classification**: Class C  
**Test Date**: 2025-12-13

---

## Test Summary

| Metric | Value |
|--------|-------|
| Total system tests planned | 150 |
| Tests executed | 150 |
| Tests passed | 148 |
| Tests failed | 2 |
| Requirements covered | 150/150 (100%) |
| Test environment | Test-Env-v1.2 (production-equivalent) |

---

## Test Results by Category

| Category | Planned | Executed | Passed | Failed | Coverage |
|----------|---------|----------|--------|--------|----------|
| Functional | 80 | 80 | 80 | 0 | 100% |
| Performance | 20 | 20 | 19 | 1 | 95% |
| Security | 25 | 25 | 24 | 1 | 96% |
| Usability | 15 | 15 | 15 | 0 | 100% |
| Integration (HW) | 10 | 10 | 10 | 0 | 100% |

---

## Failed Tests

| Test ID | Requirement | Description | Status | Resolution |
|---------|-------------|-------------|--------|------------|
| SYS-TEST-045 | REQ-PERF-002 | Login latency > 2s | FAILED | Fix scheduled, re-test planned |
| SYS-TEST-089 | REQ-SEC-018 | Password complexity not enforced | FAILED | Defect DEF-123, fix in progress |

**Acceptance Rationale**: Both failures are non-safety-critical (Class B components). Risk analysis updated (RISK-PERF-001, RISK-SEC-005). Fixes scheduled for v1.0.1 patch release. Release approval granted with conditions.

**Approval**: QA Manager (Jane Smith), 2025-12-13

---

## Requirements Traceability

All 150 software requirements verified via system testing:

| Requirement | Tests | Result | Evidence |
|-------------|-------|--------|----------|
| REQ-SECURITY-010 | SYS-TEST-010, SYS-TEST-011 | PASS | Test-evidence-010.zip |
| REQ-SECURITY-012 | SYS-TEST-012 | PASS | Test-evidence-012.zip |
| ... | ... | ... | ... |

---

## Test Environment

**Configuration**:
- OS: Ubuntu 22.04 LTS
- Runtime: Node.js 18.17 LTS
- Database: PostgreSQL 15.3
- Hardware: x86_64, 4GB RAM, 20GB disk
- Network: Isolated test network

**Differences from Production**: None

---

## Approval

**Test Lead**: _______________  Date: _______  
**QA Manager**: _______________  Date: _______  
**Regulatory Affairs**: _______________  Date: _______
```

## Compliance Evidence

### Required Records
1. **Software System Test Plan**
2. **Test Procedures**
3. **Test Execution Records**
4. **Test Results Documentation**
5. **Anomaly Reports** (defects found)
6. **Re-test Results** (after fixes)
7. **Requirements Traceability Matrix** (requirement → tests)
8. **Test Environment Specification**

### Audit Expectations

**Auditor Will Check**:
1. All requirements have system tests (100% coverage)
2. Test procedures documented
3. Tests executed and results documented
4. All tests passed (or rationale for acceptance)
5. Re-testing performed after fixes (Class B, C)
6. Test environment appropriate
7. Traceability maintained

**Common Findings**:
- ❌ Incomplete requirements coverage (<100%)
- ❌ No re-testing after defect fixes
- ❌ Test environment not production-equivalent
- ❌ Failed tests accepted without rationale

## Integration with Other Cards

- **COMP-IEC62304-003**: Requirements drive system tests
- **COMP-IEC62304-007**: Integration testing precedes system testing
- **COMP-IEC62304-012**: System testing is part of verification, validation is separate
- **COMP-EN18031-041**: Numerical performance regression testing
- **COMP-EN18031-042**: Stochastic system validation (Monte Carlo)

## Revision History

| Version | Date       | Changes | Author |
|---------|------------|---------|--------|
| 1.0.0   | 2025-12-13 | Initial (pending source verification) | AI/ML Compliance Team |

---

⚠️ **SOURCE VERIFICATION REQUIRED**: This card must be verified against IEC 62304:2015 §5.7

