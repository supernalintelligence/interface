---
id: comp-iec62304-005
framework: iec62304
title: Detailed Design
version: 1.0.0
effectiveDate: 2025-12-13T00:00:00.000Z
status: pending-verification
owner: compliance-team
category: lifecycle-process
phase:
  - 5-requirements
  - 6-tests
severity: medium
auditFrequency: per-major-release
relatedCards:
  - comp-iec62304-001
  - comp-iec62304-003
  - comp-iec62304-004
  - comp-iec62304-006
linkedRequirements: []
linkedRisks: []
tags:
  - medical-device
  - design
  - detailed-design
  - IEC-62304
sourceVerification:
  primarySource: iec62304-2015
  sections:
    - §5.4
  verifiedDate: null
  confidence: medium
  notes: Generated from implicit memory - REQUIRES SOURCE VERIFICATION
references: []
---

# IEC 62304-005: Software Detailed Design

## Regulatory Context

**Standard**: IEC 62304:2006+AMD1:2015  
**Section**: §5.4 - Software Detailed Design  
**Classification**: Class B, C (Not required for Class A)  
**Regulatory Impact**: MEDIUM (Class B), HIGH (Class C)

⚠️ **VERIFICATION STATUS**: This card requires verification against authoritative source IEC 62304:2015 §5.4

## Standard Requirements

### IEC 62304 §5.4.1 - Refine Software Architecture into Software Units

**SHALL Requirements** (Class B, C):
1. **Refine architecture** into software units that can be coded and tested
2. **Develop detailed design** for software units (interfaces, data structures, algorithms)
3. **Verify detailed design** against architecture and requirements

### IEC 62304 §5.4.2 - Develop Detailed Design for Interfaces (Class C)

**SHALL Requirements** (Class C only):
1. **Develop detailed design** for software unit interfaces
2. **Specify external interfaces** (hardware, software, user)
3. **Document interface specifications**

### IEC 62304 §5.4.3 - Develop Detailed Design for Software Units (Class C)

**SHALL Requirements** (Class C only):
1. **Develop detailed design** for each software unit
2. **Document algorithms, data structures, control flow**

### IEC 62304 §5.4.4 - Software Unit Acceptance Criteria (Class C)

**SHALL Requirements** (Class C only):
1. **Define acceptance criteria** for software units
2. **Document verification methods**

## Implementation Requirements

### 1. Detailed Design Development (§5.4.1)

**Requirement**: Refine architecture into testable software units

**Acceptance Criteria**:

```gherkin
Feature: Software Detailed Design
  As a software architect
  I need to refine architecture into detailed software units
  So that units can be coded, tested, and verified

  Scenario: Refine Architecture into Units (Class B, C)
    Given architectural design (COMP-IEC62304-004)
    When refining into software units
    Then each unit SHALL be small enough to code and test
    And unit boundaries SHALL be clearly defined
    And unit responsibilities SHALL be documented
    And unit interfaces SHALL be specified
    And units SHALL map to architectural components

  Scenario: Define Unit Interfaces (Class C)
    Given software units
    When defining interfaces for Class C software
    Then input parameters SHALL be specified (type, range, units)
    And output parameters SHALL be specified
    And error conditions SHALL be specified
    And interface contracts SHALL be documented
    And interface versioning SHALL be defined

  Scenario: Document Data Structures (Class C)
    Given software units
    When documenting data structures for Class C software
    Then data types SHALL be specified
    And data relationships SHALL be documented
    And data constraints SHALL be defined
    And data validation rules SHALL be specified
```

### 2. Detailed Design for Algorithms (§5.4.3 - Class C)

**Requirement**: Document algorithms and control flow

**Acceptance Criteria**:

```gherkin
Feature: Algorithm Design Documentation
  As a software developer
  I need detailed algorithm specifications
  So that implementation is deterministic and verifiable

  Scenario: Document Algorithms (Class C)
    Given software units with algorithms
    When documenting algorithms for Class C software
    Then algorithm logic SHALL be documented (pseudocode, flowcharts)
    And inputs/outputs SHALL be specified
    And preconditions/postconditions SHALL be defined
    And error handling SHALL be documented
    And performance characteristics SHALL be specified

  Scenario: Control Flow Documentation (Class C)
    Given software units with control logic
    When documenting control flow for Class C software
    Then state machines SHALL be documented (if applicable)
    And decision logic SHALL be documented
    And exception handling SHALL be specified
    And concurrency/synchronization SHALL be documented

  Scenario: Safety-Critical Algorithms (Class C)
    Given safety-critical software units
    When documenting algorithms
    Then safety requirements SHALL be explicitly referenced
    And risk controls SHALL be documented
    And failure modes SHALL be analyzed
    And defensive programming SHALL be specified
```

### 3. Software Unit Acceptance Criteria (§5.4.4 - Class C)

**Requirement**: Define unit-level acceptance criteria

**Acceptance Criteria**:

```gherkin
Feature: Software Unit Acceptance Criteria
  As a verification engineer
  I need acceptance criteria for each software unit
  So that unit verification is objective and complete

  Scenario: Define Unit Acceptance Criteria (Class C)
    Given software unit detailed design
    When defining acceptance criteria for Class C software
    Then functional correctness criteria SHALL be defined
    And performance criteria SHALL be defined (if applicable)
    And interface compliance criteria SHALL be defined
    And error handling criteria SHALL be defined
    And verification methods SHALL be specified (test, review, analysis)

  Scenario: Unit Test Requirements (Class C)
    Given unit acceptance criteria
    When specifying verification methods
    Then unit tests SHALL be required for all units
    And test coverage criteria SHALL be specified
    And test inputs/outputs SHALL be defined
    And boundary conditions SHALL be tested
    And error conditions SHALL be tested
```

## Technical Implementation

### Detailed Design Document Template

```markdown
# Detailed Design: Authentication Service

**Unit ID**: AUTH-SERVICE-001  
**Safety Classification**: Class C  
**Component**: Authentication System  
**Architectural Reference**: ARCH-COMP-005

---

## Unit Overview

**Purpose**: Authenticate users via username/password and issue JWT tokens  
**Responsibilities**:
- Validate user credentials
- Generate secure JWT tokens
- Implement rate limiting to prevent brute-force attacks

---

## Interface Specification

### Input Parameters

| Parameter | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| username | string | 3-50 chars, email format | User email address |
| password | string | 8-128 chars | User password (pre-hashed by client) |

### Output Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| token | string | JWT token (valid 30 min) |
| refreshToken | string | Refresh token (valid 7 days) |
| userId | UUID | User identifier |

### Error Conditions

| Error Code | Condition | HTTP Status |
|------------|-----------|-------------|
| AUTH_INVALID_CREDENTIALS | Username or password incorrect | 401 |
| AUTH_ACCOUNT_LOCKED | Account locked after 5 failed attempts | 423 |
| AUTH_RATE_LIMIT | Too many requests (>10/min) | 429 |
| AUTH_INTERNAL_ERROR | Database or service error | 500 |

---

## Algorithm Design

### Pseudocode: `authenticate(username, password)`

```
FUNCTION authenticate(username, password):
  # 1. Rate limit check
  IF rateLimitExceeded(username):
    THROW AUTH_RATE_LIMIT
  
  # 2. Retrieve user from database
  user = database.findUserByEmail(username)
  IF user == NULL:
    recordFailedAttempt(username)
    THROW AUTH_INVALID_CREDENTIALS
  
  # 3. Check account lock status
  IF user.lockedUntil > currentTime():
    THROW AUTH_ACCOUNT_LOCKED
  
  # 4. Verify password (bcrypt with 12 rounds)
  IF NOT bcrypt.verify(password, user.passwordHash):
    recordFailedAttempt(username)
    incrementFailedAttempts(user)
    
    IF user.failedAttempts >= 5:
      lockAccount(user, duration=30min)
    
    THROW AUTH_INVALID_CREDENTIALS
  
  # 5. Generate tokens
  token = jwt.sign({
    userId: user.id,
    roles: user.roles
  }, SECRET_KEY, { expiresIn: '30m' })
  
  refreshToken = generateSecureToken(32bytes)
  saveRefreshToken(refreshToken, user.id, expiresIn=7days)
  
  # 6. Reset failed attempts
  resetFailedAttempts(user)
  
  # 7. Log successful authentication
  auditLog.record({
    event: 'USER_LOGIN',
    userId: user.id,
    timestamp: currentTime(),
    ipAddress: getClientIP()
  })
  
  RETURN { token, refreshToken, userId: user.id }
END FUNCTION
```

### Control Flow Diagram

```
[Start]
   ↓
[Rate Limit Check] → (exceeded) → [Throw AUTH_RATE_LIMIT]
   ↓ (ok)
[Find User] → (not found) → [Log Failed Attempt] → [Throw AUTH_INVALID_CREDENTIALS]
   ↓ (found)
[Check Account Lock] → (locked) → [Throw AUTH_ACCOUNT_LOCKED]
   ↓ (unlocked)
[Verify Password] → (invalid) → [Increment Failed Attempts] → [Lock if ≥5] → [Throw]
   ↓ (valid)
[Generate JWT Token]
   ↓
[Generate Refresh Token]
   ↓
[Reset Failed Attempts]
   ↓
[Audit Log]
   ↓
[Return Tokens]
   ↓
[End]
```

---

## Data Structures

### User Model

```typescript
interface User {
  id: UUID;
  email: string;        // Unique, indexed
  passwordHash: string; // bcrypt, 12 rounds
  roles: Role[];        // RBAC roles
  failedAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  lastLoginAt: Date | null;
}
```

### Refresh Token Model

```typescript
interface RefreshToken {
  token: string;       // 32-byte secure random
  userId: UUID;        // Foreign key to User
  expiresAt: Date;
  createdAt: Date;
}
```

---

## Performance Requirements

| Metric | Target | Rationale |
|--------|--------|-----------|
| Response time (p95) | < 200ms | User experience |
| Throughput | > 100 req/sec | Concurrent users |
| Password hash time | ~100ms | bcrypt 12 rounds |

---

## Safety Considerations

**Risk Controls**:
- **RISK-SEC-001**: Brute-force attack → Rate limiting (10 req/min/user)
- **RISK-SEC-002**: Account enumeration → Generic error messages
- **RISK-SEC-003**: Credential stuffing → Account locking after 5 failures

---

## Unit Acceptance Criteria

| Criteria | Verification Method |
|----------|---------------------|
| Valid credentials return JWT token | Unit test |
| Invalid credentials return AUTH_INVALID_CREDENTIALS | Unit test |
| Account locked after 5 failed attempts | Unit test |
| Rate limiting enforced | Unit test |
| JWT token expires after 30 minutes | Unit test |
| Audit log created on success | Unit test |
| Password verified with bcrypt | Code review |
| 100% branch coverage | Code coverage tool |

---

## Traceability

| Requirement | Design Element |
|-------------|----------------|
| REQ-SECURITY-010 | authenticate() function |
| REQ-SECURITY-011 | Password verification logic |
| REQ-SECURITY-012 | Rate limiting |
| REQ-SECURITY-013 | Account locking |
| REQ-SECURITY-014 | Audit logging |

---

**Reviewed by**: Jane Smith (Architect), 2025-12-13  
**Approved by**: John Doe (Safety Officer), 2025-12-13
```

## Compliance Evidence

### Required Records
1. **Detailed Design Documents** (per software unit)
2. **Interface Specifications** (Class C)
3. **Algorithm Descriptions** (Class C)
4. **Data Structure Specifications** (Class C)
5. **Unit Acceptance Criteria** (Class C)
6. **Design Reviews** (Class B, C)
7. **Traceability Matrix** (requirements → detailed design)

### Audit Expectations

**Auditor Will Check**:
1. All units have detailed design documentation
2. Interfaces specified (especially Class C)
3. Algorithms documented (especially Class C)
4. Unit acceptance criteria defined (Class C)
5. Design verified against requirements
6. Traceability maintained

**Common Findings**:
- ❌ Missing detailed design for Class C units
- ❌ Interfaces not fully specified
- ❌ Algorithms not documented (pseudocode, flowcharts)
- ❌ No unit acceptance criteria

## Integration with Other Cards

- **COMP-IEC62304-003**: Requirements drive detailed design
- **COMP-IEC62304-004**: Architectural design refined into detailed design
- **COMP-IEC62304-006**: Detailed design drives unit implementation

## Revision History

| Version | Date       | Changes | Author |
|---------|------------|---------|--------|
| 1.0.0   | 2025-12-13 | Initial (pending source verification) | AI/ML Compliance Team |

---

⚠️ **SOURCE VERIFICATION REQUIRED**: This card must be verified against IEC 62304:2015 §5.4

