---
id: comp-iec62304-006
framework: iec62304
title: Unit Implementation and Verification
version: 1.0.0
effectiveDate: 2025-12-13T00:00:00.000Z
status: pending-verification
owner: compliance-team
category: lifecycle-process
phase:
  - 7-build
severity: critical
auditFrequency: per-release
relatedCards:
  - comp-iec62304-001
  - comp-iec62304-003
  - comp-iec62304-004
  - comp-iec62304-005
  - comp-iec62304-007
linkedRequirements: []
linkedRisks: []
tags:
  - medical-device
  - unit-testing
  - implementation
  - IEC-62304
  - verification
references: []
---

# IEC 62304-006: Unit Implementation and Verification

## Regulatory Context

**Standard**: IEC 62304:2006+AMD1:2015 - Medical Device Software Lifecycle Processes  
**Section**: §5.5 - Software Unit Implementation and Verification  
**Classification**: Class A, B, C (All)  
**Regulatory Impact**: HIGH

### Why This Matters

Unit implementation and verification is where software design becomes executable code. Proper unit-level verification ensures:
- Each software unit correctly implements its design
- Defects are caught early (cheaper to fix)
- Code quality is maintainable
- Safety-critical units are thoroughly verified
- Regulatory traceability is established from code to requirements

Unit-level defects that escape to integration or system testing are 10-100x more expensive to fix.

## Standard Requirements

### IEC 62304 §5.5.1 - Implement Each Software Unit

**SHALL Requirements**:
1. **Implement each software unit**
2. **Establish procedures** for:
   - Coding standards
   - Code reviews
   - Version control

### IEC 62304 §5.5.2 - Establish Software Unit Acceptance Criteria

**SHALL Requirements**:
1. **Establish acceptance criteria** for each software unit
2. **Criteria SHALL**:
   - Ensure correct implementation of detailed design
   - Be verifiable

### IEC 62304 §5.5.3 - Additional Unit Acceptance Criteria (Class C)

**SHALL Requirements** (Class C):
1. **Include additional acceptance criteria**:
   - Proper event sequence handling
   - Data and control flow
   - Planned resource allocation
   - Fault handling (exception handling, error recovery)
   - Initialization and finalization

### IEC 62304 §5.5.4 - Software Unit Verification Process (Class B, C)

**SHALL Requirements** (Class B, C):
1. **Verify each software unit** using:
   - Testing
   - Code reviews
   - Other appropriate methods

### IEC 62304 §5.5.5 - Software Unit Verification (All Classes)

**SHALL Requirements**:
1. **Verify each software unit**:
   - Meets acceptance criteria
   - Correctly implements detailed design
2. **Document verification results**

## Implementation Requirements

### 1. Unit Implementation with Coding Standards (§5.5.1)

**Requirement**: Implement software units following coding standards

**Acceptance Criteria**:

```gherkin
Feature: Unit Implementation with Coding Standards
  As a software developer
  I need clear coding standards
  So that code is consistent, maintainable, and safe

  Scenario: Establish Coding Standards
    Given a software development project
    When defining coding standards
    Then standards SHALL be documented in Development Plan (COMP-IEC62304-002)
    And standards SHALL address language-specific safety (MISRA C, CWE Top 25)
    And standards SHALL address naming conventions
    And standards SHALL address code structure and formatting
    And standards SHALL address comment requirements
    And standards SHALL address error handling patterns
    And standards SHALL address security practices

    Examples of coding standards:
      | language   | standard                                      |
      | C          | MISRA C:2012, CWE Top 25                      |
      | C++        | MISRA C++:2008, Autosar C++14                 |
      | JavaScript | ESLint Airbnb, CWE Top 25                     |
      | TypeScript | TSLint/ESLint, strict mode                    |
      | Python     | PEP 8, Pylint, Bandit (security)              |

  Scenario: Implement Software Unit
    Given detailed design for a software unit
    When implementing the unit
    Then code SHALL follow coding standards
    And code SHALL implement all design specifications
    And code SHALL include inline comments for complex logic
    And code SHALL include function/method documentation
    And code SHALL be under version control (Git)
    And code SHALL be linked to requirement/design (traceability)

  Scenario: Code Review Process
    Given implemented software unit
    When code is ready for review
    Then code SHALL be reviewed by peer (not author)
    And reviewer SHALL check coding standards compliance
    And reviewer SHALL check design implementation correctness
    And reviewer SHALL check error handling
    And reviewer SHALL check security vulnerabilities
    And review results SHALL be documented
    And defects SHALL be tracked to resolution
```

### 2. Unit Acceptance Criteria (§5.5.2, §5.5.3)

**Requirement**: Establish acceptance criteria for each software unit

**Acceptance Criteria**:

```gherkin
Feature: Software Unit Acceptance Criteria
  As a quality assurance engineer
  I need clear acceptance criteria for units
  So that I can verify correct implementation

  Scenario: Define Basic Acceptance Criteria (All Classes)
    Given a software unit
    When defining acceptance criteria
    Then criteria SHALL ensure correct implementation of detailed design
    And criteria SHALL be verifiable (testable or inspectable)
    And criteria SHALL include functional correctness
    And criteria SHALL include interface compliance
    And criteria SHALL include error handling requirements

    Example:
      """
      Unit: calculateDose(patientWeight, drugId, indication)
      
      Acceptance Criteria:
      AC-001: Returns valid dose recommendation for valid inputs
      AC-002: Throws InvalidParameterError for patientWeight < 0.5kg or > 300kg
      AC-003: Throws DrugInteractionError for contraindicated drugs
      AC-004: Completes within 500ms (95th percentile)
      AC-005: Logs all calculations to audit trail
      """

  Scenario: Additional Acceptance Criteria (Class C)
    Given software safety classification is Class C
    When defining acceptance criteria
    Then criteria SHALL include proper event sequence handling
    And criteria SHALL include data flow correctness
    And criteria SHALL include control flow correctness
    And criteria SHALL include planned resource allocation (memory, CPU)
    And criteria SHALL include fault handling (exceptions, errors)
    And criteria SHALL include initialization requirements
    And criteria SHALL include cleanup/finalization requirements

    Example (Class C):
      """
      Unit: DoseCalculationService (Class C - safety-critical)
      
      Additional Acceptance Criteria:
      AC-C-001: Event Sequence - Drug database must be loaded before calculations
      AC-C-002: Data Flow - Patient weight validated before passing to algorithm
      AC-C-003: Control Flow - No early returns that bypass audit logging
      AC-C-004: Resource Allocation - Max 10MB memory per calculation
      AC-C-005: Fault Handling - Division by zero handled with error, not crash
      AC-C-006: Initialization - Database connection verified on startup
      AC-C-007: Finalization - All in-progress calculations saved on shutdown
      """
```

### 3. Unit Verification Process (§5.5.4, §5.5.5)

**Requirement**: Verify each software unit meets acceptance criteria

**Acceptance Criteria**:

```gherkin
Feature: Software Unit Verification
  As a V&V engineer
  I need to verify each software unit
  So that correctness is demonstrated before integration

  Scenario: Unit Testing (Primary Method for Class B, C)
    Given a software unit with acceptance criteria
    When verifying the unit
    Then automated unit tests SHALL be written
    And each acceptance criterion SHALL have corresponding tests
    And tests SHALL cover normal cases
    And tests SHALL cover boundary cases
    And tests SHALL cover error cases
    And test coverage SHALL be measured (line, branch, condition)
    And test results SHALL be documented

    Example:
      """typescript
      // Unit: calculateDose
      describe('DoseCalculationService.calculateDose', () => {
        // AC-001: Normal case
        it('returns valid dose for valid inputs', async () => {
          const result = await service.calculateDose(70, 'DRUG-001', 'hypertension');
          expect(result.dose).toBeGreaterThan(0);
          expect(result.unit).toBe('mg');
        });

        // AC-002: Boundary case (weight too low)
        it('throws InvalidParameterError for weight < 0.5kg', async () => {
          await expect(service.calculateDose(0.4, 'DRUG-001', 'hypertension'))
            .rejects.toThrow(InvalidParameterError);
        });

        // AC-002: Boundary case (weight too high)
        it('throws InvalidParameterError for weight > 300kg', async () => {
          await expect(service.calculateDose(301, 'DRUG-001', 'hypertension'))
            .rejects.toThrow(InvalidParameterError);
        });

        // AC-003: Error case (drug interaction)
        it('throws DrugInteractionError for contraindicated drugs', async () => {
          await expect(service.calculateDose(70, 'DRUG-CONTRAINDICATED', 'hypertension'))
            .rejects.toThrow(DrugInteractionError);
        });

        // AC-004: Performance
        it('completes within 500ms', async () => {
          const start = Date.now();
          await service.calculateDose(70, 'DRUG-001', 'hypertension');
          const duration = Date.now() - start;
          expect(duration).toBeLessThan(500);
        });
      });
      """

  Scenario: Code Review (Complementary Method)
    Given implemented software unit
    When conducting code review
    Then reviewer SHALL verify coding standards compliance
    And reviewer SHALL verify design implementation correctness
    And reviewer SHALL verify acceptance criteria implementation
    And reviewer SHALL verify error handling completeness
    And reviewer SHALL check for security vulnerabilities
    And review checklist SHALL be completed
    And review results SHALL be documented

  Scenario: Static Analysis (Complementary Method for Class C)
    Given software unit code
    When running static analysis
    Then linters SHALL check coding standards (ESLint, Pylint, etc.)
    And static analyzers SHALL check for defects (SonarQube, CodeQL)
    And security scanners SHALL check for vulnerabilities (Snyk, Bandit)
    And results SHALL be reviewed and defects SHALL be fixed
    And analysis results SHALL be documented

  Scenario: Test Coverage Requirements
    Given software unit tests
    When measuring test coverage
    Then coverage SHALL meet minimum thresholds

    Examples:
      | safety_class | line_coverage | branch_coverage | condition_coverage |
      | Class A      | 70%           | N/A             | N/A                |
      | Class B      | 80%           | 70%             | N/A                |
      | Class C      | 95%           | 90%             | 85%                |

  Scenario: Verification Documentation
    Given unit verification activities
    When verification is complete
    Then verification results SHALL be documented
    And test execution results SHALL be recorded
    And code review results SHALL be recorded
    And static analysis results SHALL be recorded
    And coverage metrics SHALL be recorded
    And defects SHALL be tracked to resolution
    And traceability SHALL be maintained (unit → acceptance criteria → design → requirements)
```

## Technical Implementation

### Unit Test Example (TypeScript/Jest)

```typescript
/**
 * Unit: DoseCalculationService
 * Design: SDD-001
 * Requirements: REQ-SAFETY-001 through REQ-SAFETY-010
 * Safety Classification: Class C
 */

import { DoseCalculationService } from '../services/DoseCalculationService';
import { InvalidParameterError, DrugInteractionError } from '../errors';

describe('DoseCalculationService (Class C)', () => {
  let service: DoseCalculationService;

  beforeEach(() => {
    service = new DoseCalculationService();
  });

  describe('AC-001: Normal Operation', () => {
    it('calculates correct dose for standard patient', async () => {
      const result = await service.calculateDose(70, 'ASPIRIN-100', 'cardioprotection');
      
      expect(result).toMatchObject({
        dose: 100,
        unit: 'mg',
        frequency: '1x daily',
        warnings: [],
        contraindications: []
      });
    });

    it('adjusts dose for pediatric patients', async () => {
      const result = await service.calculateDose(15, 'ASPIRIN-100', 'fever');
      
      expect(result.dose).toBeLessThan(100); // Pediatric dose adjustment
      expect(result.warnings).toContain('Pediatric dosing applied');
    });
  });

  describe('AC-002: Input Validation (Boundary Cases)', () => {
    it('accepts minimum valid weight (0.5kg)', async () => {
      await expect(service.calculateDose(0.5, 'DRUG-001', 'indication'))
        .resolves.toBeDefined();
    });

    it('rejects weight below minimum (0.49kg)', async () => {
      await expect(service.calculateDose(0.49, 'DRUG-001', 'indication'))
        .rejects.toThrow(InvalidParameterError);
      await expect(service.calculateDose(0.49, 'DRUG-001', 'indication'))
        .rejects.toThrow('Patient weight must be between 0.5kg and 300kg');
    });

    it('accepts maximum valid weight (300kg)', async () => {
      await expect(service.calculateDose(300, 'DRUG-001', 'indication'))
        .resolves.toBeDefined();
    });

    it('rejects weight above maximum (300.1kg)', async () => {
      await expect(service.calculateDose(300.1, 'DRUG-001', 'indication'))
        .rejects.toThrow(InvalidParameterError);
    });

    it('rejects invalid drug ID', async () => {
      await expect(service.calculateDose(70, 'INVALID', 'indication'))
        .rejects.toThrow(InvalidParameterError);
    });

    it('rejects empty indication', async () => {
      await expect(service.calculateDose(70, 'DRUG-001', ''))
        .rejects.toThrow(InvalidParameterError);
    });
  });

  describe('AC-003: Drug Interactions', () => {
    it('detects contraindicated drug combinations', async () => {
      await expect(service.calculateDose(70, 'WARFARIN', 'anticoagulation'))
        .rejects.toThrow(DrugInteractionError);
      await expect(service.calculateDose(70, 'WARFARIN', 'anticoagulation'))
        .rejects.toThrow('Contraindicated for patients with active bleeding');
    });

    it('warns about potential interactions', async () => {
      const result = await service.calculateDose(70, 'ASPIRIN-100', 'cardioprotection');
      
      // Check if warnings include interaction with NSAIDs
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          type: 'INTERACTION',
          severity: 'MODERATE',
          message: expect.stringContaining('NSAID')
        })
      );
    });
  });

  describe('AC-004: Performance Requirements', () => {
    it('completes within 500ms (95th percentile)', async () => {
      const measurements: number[] = [];
      
      // Run 100 iterations
      for (let i = 0; i < 100; i++) {
        const start = Date.now();
        await service.calculateDose(70, 'DRUG-001', 'indication');
        measurements.push(Date.now() - start);
      }
      
      // Calculate 95th percentile
      measurements.sort((a, b) => a - b);
      const p95 = measurements[Math.floor(measurements.length * 0.95)];
      
      expect(p95).toBeLessThan(500);
    });
  });

  describe('AC-005: Audit Logging', () => {
    it('logs all dose calculations', async () => {
      const auditSpy = jest.spyOn(service['auditLog'], 'log');
      
      await service.calculateDose(70, 'DRUG-001', 'indication');
      
      expect(auditSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'DOSE_CALCULATION',
          patientWeight: 70,
          drugId: 'DRUG-001',
          indication: 'indication',
          timestamp: expect.any(Date),
          userId: expect.any(String)
        })
      );
    });

    it('logs calculation errors', async () => {
      const auditSpy = jest.spyOn(service['auditLog'], 'log');
      
      await expect(service.calculateDose(0.4, 'DRUG-001', 'indication'))
        .rejects.toThrow();
      
      expect(auditSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'DOSE_CALCULATION_ERROR',
          error: expect.stringContaining('weight')
        })
      );
    });
  });

  describe('AC-C-001: Event Sequence (Class C)', () => {
    it('requires drug database to be loaded before calculations', async () => {
      const uninitializedService = new DoseCalculationService();
      // Don't call initialize()
      
      await expect(uninitializedService.calculateDose(70, 'DRUG-001', 'indication'))
        .rejects.toThrow('Drug database not initialized');
    });

    it('allows calculations after database is loaded', async () => {
      await service.initialize();
      
      await expect(service.calculateDose(70, 'DRUG-001', 'indication'))
        .resolves.toBeDefined();
    });
  });

  describe('AC-C-005: Fault Handling (Class C)', () => {
    it('handles division by zero gracefully', async () => {
      // Simulate edge case where calculation involves division
      await expect(service.calculateDose(70, 'DRUG-WITH-ZERO-CLEARANCE', 'indication'))
        .rejects.toThrow(InvalidParameterError);
      // Should NOT crash, should throw error
    });

    it('handles database connection failure', async () => {
      // Simulate database failure
      jest.spyOn(service['drugDatabase'], 'query').mockRejectedValue(new Error('Connection lost'));
      
      await expect(service.calculateDose(70, 'DRUG-001', 'indication'))
        .rejects.toThrow('Database connection error');
      // Should NOT crash, should throw error
    });
  });

  describe('AC-C-006: Initialization (Class C)', () => {
    it('verifies database connection on startup', async () => {
      const service = new DoseCalculationService();
      
      await expect(service.initialize()).resolves.toBeUndefined();
      expect(service.isInitialized()).toBe(true);
    });

    it('fails initialization if database is unavailable', async () => {
      const service = new DoseCalculationService();
      jest.spyOn(service['drugDatabase'], 'connect').mockRejectedValue(new Error('Connection refused'));
      
      await expect(service.initialize()).rejects.toThrow('Failed to initialize drug database');
    });
  });
});

/**
 * Coverage Report:
 * 
 * File: DoseCalculationService.ts
 * Statements: 98.5% (131/133)
 * Branches: 95.2% (80/84)
 * Functions: 100% (12/12)
 * Lines: 98.5% (129/131)
 * 
 * ✅ Meets Class C coverage requirements (95% line, 90% branch)
 */
```

### Code Review Checklist

```markdown
# Software Unit Code Review Checklist

**Unit**: DoseCalculationService  
**Reviewer**: Jane Smith  
**Date**: 2025-12-13  
**Safety Classification**: Class C

---

## 1. Coding Standards Compliance

- [x] Code follows TypeScript style guide (ESLint Airbnb)
- [x] Naming conventions followed (camelCase, PascalCase)
- [x] No linter warnings
- [x] No security vulnerabilities (Snyk scan clean)

## 2. Design Implementation Correctness

- [x] Implements detailed design SDD-001
- [x] All public methods match interface IDoseCalculation
- [x] All acceptance criteria implemented (AC-001 through AC-C-007)
- [x] Traceability to requirements (REQ-SAFETY-001 through REQ-SAFETY-010)

## 3. Error Handling

- [x] All inputs validated
- [x] Exceptions defined and thrown appropriately (InvalidParameterError, DrugInteractionError)
- [x] No uncaught exceptions
- [x] Error messages are clear and actionable

## 4. Security

- [x] No hardcoded credentials
- [x] No SQL injection vulnerabilities (uses parameterized queries)
- [x] No sensitive data in logs
- [x] Input sanitization performed

## 5. Class C Specific

- [x] Event sequence enforced (database must be initialized)
- [x] Resource allocation bounded (max 10MB per calculation)
- [x] Fault handling complete (division by zero, connection failures)
- [x] Initialization requirements met
- [x] Cleanup/finalization implemented

## 6. Comments and Documentation

- [x] Public methods have JSDoc comments
- [x] Complex logic has inline comments
- [x] TODOs resolved or tracked

---

## Issues Found

| Issue | Severity | Description | Resolution |
|-------|----------|-------------|------------|
| None  | -        | -           | -          |

---

## Approval

**Reviewer Signature**: Jane Smith  
**Date**: 2025-12-13  
**Status**: ✅ Approved
```

## Compliance Evidence

### Required Records

1. **Source Code** - Version-controlled code for all units
2. **Unit Test Code** - Automated tests for all units
3. **Test Execution Results** - Test pass/fail results, coverage metrics
4. **Code Review Records** - Review checklists, approvals
5. **Static Analysis Results** - Linter, security scanner, code analyzer outputs
6. **Acceptance Criteria** - Documented for each unit
7. **Traceability Matrix** - Unit → Design → Requirements

### Audit Expectations

**Auditor Will Check**:
1. All software units implemented and under version control
2. Coding standards documented and followed
3. Acceptance criteria defined for each unit
4. Additional acceptance criteria for Class C units (event sequence, fault handling, etc.)
5. Unit tests exist and cover acceptance criteria
6. Test coverage meets thresholds (Class A: 70%, Class B: 80%, Class C: 95%)
7. Code reviews performed and documented
8. Static analysis performed (Class B, C)
9. Verification results documented

**Common Findings**:
- ❌ Insufficient test coverage (below thresholds)
- ❌ Missing acceptance criteria for Class C units (event sequence, resource allocation)
- ❌ No code review records
- ❌ No static analysis for Class C units
- ❌ Tests don't cover error cases
- ❌ Traceability missing (unit → design → requirements)

## Related Standards

- **ISO 13485** §7.5.5 - Particular requirements for sterile medical devices (verification)
- **FDA 21 CFR 820.70** - Production and process controls
- **EU MDR 2017/745** Annex I, Chapter I, 17.3 - Verification and validation
- **IEC 62304** §5.5 - Software unit implementation and verification

## Integration with Other Cards

- **COMP-IEC62304-001**: Safety classification determines verification rigor
- **COMP-IEC62304-003**: Requirements flow to unit acceptance criteria
- **COMP-IEC62304-004**: Architecture defines software units
- **COMP-IEC62304-005**: Detailed design specifies unit implementation
- **COMP-IEC62304-007**: Unit verification precedes integration testing
- **COMP-EN18031-041**: Numerical performance regression testing at unit level
- **COMP-EN18031-042**: Stochastic system validation includes unit-level Monte Carlo

## Revision History

| Version | Date       | Changes                          | Author |
|---------|------------|----------------------------------|--------|
| 1.0.0   | 2025-12-13 | Initial compliance card creation | AI/ML Compliance Team |

---

**Document Control**: This compliance card is maintained under configuration management. Updates require approval from Quality Assurance and Regulatory Affairs.

**Next Review Date**: 2026-12-13 or upon standard update

