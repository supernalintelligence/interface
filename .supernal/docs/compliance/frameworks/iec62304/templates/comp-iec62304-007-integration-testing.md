---
id: comp-iec62304-007
framework: iec62304
title: Software Integration and Integration Testing
version: 1.0.0
effectiveDate: 2025-12-13T00:00:00.000Z
status: pending-verification
owner: compliance-team
category: lifecycle-process
phase:
  - 8-integration
severity: high
auditFrequency: per-release
relatedCards:
  - comp-iec62304-001
  - comp-iec62304-004
  - comp-iec62304-006
  - comp-iec62304-008
linkedRequirements: []
linkedRisks: []
tags:
  - medical-device
  - integration
  - testing
  - IEC-62304
sourceVerification:
  primarySource: iec62304-2015
  sections:
    - §5.6
  verifiedDate: null
  confidence: medium
  notes: Generated from implicit memory - REQUIRES SOURCE VERIFICATION
references: []
---

# IEC 62304-007: Software Integration and Integration Testing

## Regulatory Context

**Standard**: IEC 62304:2006+AMD1:2015  
**Section**: §5.6 - Software Integration and Integration Testing  
**Classification**: Class B, C (Class A: integration strategy required, testing optional)  
**Regulatory Impact**: HIGH

⚠️ **VERIFICATION STATUS**: This card requires verification against IEC 62304:2015 §5.6

## Standard Requirements

### IEC 62304 §5.6.1 - Integrate Software Units

**SHALL Requirements**:
1. **Integrate software units** according to integration plan
2. **Document integration results**

### IEC 62304 §5.6.2 - Verify Software Integration (Class B, C)

**SHALL Requirements** (Class B, C):
1. **Conduct integration testing** based on integration plan
2. **Document test results**
3. **Verify interfaces** between software units
4. **Verify integration** with SOUP (Software of Unknown Provenance)

### IEC 62304 §5.6.3 - Software Integration Testing Content

**SHALL Requirements** (Class B, C):
1. **Test interfaces** between integrated units
2. **Document test procedures, inputs, outputs**

### IEC 62304 §5.6.4 - Evaluate Integration Test Results (Class B, C)

**SHALL Requirements** (Class B, C):
1. **Ensure all tests pass** or document rationale for accepting failed tests
2. **Re-test** after defect fixes

### IEC 62304 §5.6.5 - Integration Test Record (Class B, C)

**SHALL Requirements** (Class B, C):
1. **Maintain record** of integration testing
2. **Include test results, anomalies**

## Implementation Requirements

### 1. Software Integration Strategy (§5.6.1)

**Requirement**: Integrate software units systematically

**Acceptance Criteria**:

```gherkin
Feature: Software Integration Strategy
  As a system integrator
  I need a documented integration strategy
  So that software units are integrated systematically and safely

  Scenario: Define Integration Strategy (All Classes)
    Given software units and architecture
    When defining integration strategy
    Then integration order SHALL be specified (bottom-up, top-down, incremental)
    And integration sequence SHALL be documented
    And integration environment SHALL be specified
    And SOUP integration SHALL be planned
    And interface verification SHALL be planned

  Scenario: Incremental Integration (Recommended)
    Given multiple software units
    When integrating
    Then units SHALL be integrated incrementally
    And each integration step SHALL be tested
    And integration SHALL follow dependency order
    And critical paths SHALL be integrated early

  Scenario: SOUP Integration
    Given SOUP components (third-party libraries)
    When integrating SOUP
    Then SOUP versions SHALL be documented
    And SOUP interfaces SHALL be verified
    And SOUP risks SHALL be assessed (COMP-IEC62304-001)
    And SOUP change control SHALL be established
```

### 2. Integration Testing (§5.6.2, §5.6.3 - Class B, C)

**Requirement**: Verify software integration through testing

**Acceptance Criteria**:

```gherkin
Feature: Software Integration Testing
  As a test engineer
  I need to verify integration between software units
  So that interfaces and interactions are validated

  Scenario: Integration Test Planning (Class B, C)
    Given integrated software units
    When planning integration tests
    Then interface tests SHALL be defined for all unit interfaces
    And data flow tests SHALL be defined
    And control flow tests SHALL be defined
    And error propagation tests SHALL be defined
    And SOUP integration tests SHALL be defined

  Scenario: Execute Integration Tests (Class B, C)
    Given integration test procedures
    When executing integration tests
    Then tests SHALL verify interface contracts
    And tests SHALL verify data transformation across boundaries
    And tests SHALL verify error handling across units
    And tests SHALL verify SOUP integration
    And test results SHALL be documented

  Scenario: Interface Testing Example
    Given two integrated units: AuthService and UserDB
    When testing AuthService → UserDB interface
    Then valid user lookup SHALL return user data
    And invalid user lookup SHALL return NULL
    And database timeout SHALL be handled gracefully
    And connection errors SHALL be retried (3x)
    And all error codes SHALL be propagated correctly
```

### 3. Integration Test Results Evaluation (§5.6.4 - Class B, C)

**Requirement**: Evaluate integration test results

**Acceptance Criteria**:

```gherkin
Feature: Integration Test Results Evaluation
  As a verification engineer
  I need to evaluate integration test results
  So that integration is verified before system testing

  Scenario: All Integration Tests Pass (Class B, C)
    Given executed integration tests
    When evaluating results for Class B or C software
    Then all integration tests SHALL pass
    OR rationale SHALL be documented for accepting failed tests
    And acceptance of failed tests SHALL be approved
    And risk analysis SHALL be updated for failed tests

  Scenario: Re-testing After Fixes (Class B, C)
    Given defects found during integration testing
    When defects are fixed
    Then affected tests SHALL be re-executed
    And regression tests SHALL be executed
    And all tests SHALL pass after fixes
```

## Technical Implementation

### Integration Test Example

```typescript
/**
 * Integration Test: Authentication Service ↔ User Database
 * Units: AuthService, UserDB
 * Safety Classification: Class C
 */

describe('Integration Test: AuthService ↔ UserDB', () => {
  let authService: AuthService;
  let userDB: UserDB;

  beforeAll(async () => {
    // Setup integration test environment
    userDB = new UserDB({ connectionString: TEST_DB_URL });
    authService = new AuthService({ userDB });

    await userDB.connect();
    await userDB.seedTestData();
  });

  afterAll(async () => {
    await userDB.disconnect();
  });

  test('INT-TEST-001: Valid user lookup returns user data', async () => {
    // Test interface: authService.authenticate() → userDB.findUserByEmail()
    const result = await authService.authenticate(
      'doctor@hospital.com',
      'SecurePass123!'
    );

    expect(result.success).toBe(true);
    expect(result.userId).toBeDefined();
    expect(result.token).toBeDefined();
  });

  test('INT-TEST-002: Invalid user returns AUTH_INVALID_CREDENTIALS', async () => {
    const result = await authService.authenticate(
      'nonexistent@hospital.com',
      'password'
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('AUTH_INVALID_CREDENTIALS');
  });

  test('INT-TEST-003: Database timeout handled gracefully', async () => {
    // Simulate database timeout
    jest.spyOn(userDB, 'findUserByEmail').mockImplementation(() =>
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), 5000)
      )
    );

    const result = await authService.authenticate(
      'doctor@hospital.com',
      'password'
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('AUTH_INTERNAL_ERROR');
    expect(result.details).toContain('Database timeout');
  });

  test('INT-TEST-004: Connection errors retried 3 times', async () => {
    let attemptCount = 0;
    jest.spyOn(userDB, 'findUserByEmail').mockImplementation(() => {
      attemptCount++;
      return Promise.reject(new Error('CONNECTION_ERROR'));
    });

    await authService.authenticate('doctor@hospital.com', 'password');

    expect(attemptCount).toBe(3); // Initial attempt + 2 retries
  });

  test('INT-TEST-005: SOUP integration (bcrypt) verified', async () => {
    // Verify bcrypt (SOUP) correctly integrated
    const user = await userDB.findUserByEmail('doctor@hospital.com');
    const isValid = await authService['verifyPassword'](
      'SecurePass123!',
      user.passwordHash
    );

    expect(isValid).toBe(true);
    expect(user.passwordHash).toMatch(/^\$2[aby]\$12\$/); // bcrypt format
  });
});

/**
 * Integration Test: Payment Service ↔ Stripe API (SOUP)
 * Units: PaymentService, Stripe SDK
 * Safety Classification: Class B
 */

describe('Integration Test: PaymentService ↔ Stripe API', () => {
  let paymentService: PaymentService;

  beforeAll(() => {
    paymentService = new PaymentService({
      stripeApiKey: TEST_STRIPE_KEY,
      environment: 'test'
    });
  });

  test('INT-TEST-010: Create payment intent with Stripe', async () => {
    const result = await paymentService.createPaymentIntent({
      amount: 10000, // $100.00
      currency: 'usd',
      customerId: 'cus_test123'
    });

    expect(result.success).toBe(true);
    expect(result.paymentIntentId).toMatch(/^pi_/);
  });

  test('INT-TEST-011: Handle Stripe rate limit errors', async () => {
    // Simulate rate limit by making 100 rapid requests
    const promises = Array(100).fill(null).map(() =>
      paymentService.createPaymentIntent({ amount: 100, currency: 'usd' })
    );

    const results = await Promise.allSettled(promises);
    const rateLimitErrors = results.filter(
      r => r.status === 'rejected' && r.reason.code === 'rate_limit'
    );

    expect(rateLimitErrors.length).toBeGreaterThan(0);
    // Verify exponential backoff retry logic
  });
});
```

### Integration Test Report Template

```markdown
# Software Integration Test Report

**Product**: Supernal Coding Platform  
**Version**: 1.0.0  
**Safety Classification**: Class C  
**Test Date**: 2025-12-13

---

## Integration Summary

| Metric | Value |
|--------|-------|
| Software units integrated | 25 |
| Integration tests executed | 80 |
| Tests passed | 78 |
| Tests failed | 2 |
| Interfaces verified | 40 |
| SOUP integrations verified | 5 |

---

## Integration Tests by Component

| Component Integration | Tests | Passed | Failed | Status |
|-----------------------|-------|--------|--------|--------|
| AuthService ↔ UserDB | 15 | 15 | 0 | ✅ PASS |
| PaymentService ↔ Stripe | 20 | 19 | 1 | ⚠️  CONDITIONAL |
| ReportGenerator ↔ PDF Library | 10 | 10 | 0 | ✅ PASS |
| APIGateway ↔ Microservices | 25 | 24 | 1 | ⚠️  CONDITIONAL |
| NotificationService ↔ SendGrid | 10 | 10 | 0 | ✅ PASS |

---

## Failed Integration Tests

| Test ID | Integration | Failure | Resolution |
|---------|-------------|---------|------------|
| INT-TEST-045 | PaymentService ↔ Stripe | Rate limit handling incomplete | Fix in DEF-456, re-test scheduled |
| INT-TEST-078 | APIGateway ↔ Auth | Timeout not handled | Fix in DEF-457, re-test scheduled |

**Acceptance Rationale**: Both failures are non-safety-critical (Class B components). Risk analysis updated. Fixes scheduled for v1.0.1. Release approval conditional on re-test.

---

## SOUP Integration Verification

| SOUP | Version | Interface | Result | Evidence |
|------|---------|-----------|--------|----------|
| bcrypt | 5.1.0 | Password hashing | ✅ PASS | INT-TEST-005 |
| Stripe SDK | 12.9.0 | Payment processing | ⚠️  CONDITIONAL | INT-TEST-010, INT-TEST-011 |
| pdf-lib | 1.17.1 | PDF generation | ✅ PASS | INT-TEST-025 |
| nodemailer | 6.9.0 | Email sending | ✅ PASS | INT-TEST-060 |
| jose (JWT) | 5.1.0 | Token generation | ✅ PASS | INT-TEST-015 |

---

## Approval

**Test Lead**: _______________  Date: _______  
**Integration Manager**: _______________  Date: _______
```

## Compliance Evidence

### Required Records
1. **Integration Plan**
2. **Integration Test Plan**
3. **Integration Test Procedures**
4. **Integration Test Results** (Class B, C)
5. **Interface Verification Results**
6. **SOUP Integration Verification**
7. **Anomaly Reports**
8. **Re-test Results**

### Audit Expectations

**Auditor Will Check**:
1. Integration strategy documented
2. Integration tests conducted (Class B, C)
3. All interfaces verified
4. SOUP integrations verified
5. Test results documented
6. All tests passed or rationale documented
7. Re-testing after fixes (Class B, C)

**Common Findings**:
- ❌ Missing integration tests for interfaces
- ❌ SOUP not verified during integration
- ❌ No re-testing after defect fixes

## Integration with Other Cards

- **COMP-IEC62304-006**: Unit implementation feeds integration
- **COMP-IEC62304-008**: Integration testing precedes system testing
- **COMP-IEC62304-001**: SOUP risks assessed during integration

## Revision History

| Version | Date       | Changes | Author |
|---------|------------|---------|--------|
| 1.0.0   | 2025-12-13 | Initial (pending source verification) | AI/ML Compliance Team |

---

⚠️ **SOURCE VERIFICATION REQUIRED**: This card must be verified against IEC 62304:2015 §5.6

