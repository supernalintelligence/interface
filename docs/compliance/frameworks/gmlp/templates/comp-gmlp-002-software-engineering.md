---
id: COMP-GMLP-002
framework: GMLP
category: Software Quality
title: Good Software Engineering and Security Practices
description: Apply software engineering best practices and cybersecurity controls throughout AI/ML medical device development
status: pending-verification
version: 1.0.0
last_updated: 2025-12-13
owner: compliance-team
references: []
related_cards:
  - COMP-GMLP-001
  - COMP-IEC62304-002
  - COMP-IEC62304-006
  - COMP-ISO27001-084
tags:
  - gmlp
  - software-engineering
  - cybersecurity
  - medical-devices
  - sdlc
priority: high
---

# COMP-GMLP-002: Good Software Engineering and Security Practices

## Overview

**GMLP Principle 2:** "Good software engineering and security practices are implemented to ensure that ML models are developed, deployed, and maintained in a secure, reliable, and maintainable manner."

Defines requirements for applying software engineering best practices, secure development lifecycle, and cybersecurity controls to AI/ML medical device development.

**Regulatory Context:** FDA GMLP Principles, IEC 62304, FDA Cybersecurity Guidance

---

## Software Engineering Requirements

### 1. Software Development Lifecycle (SDLC)

#### Acceptance Criteria
```gherkin
Feature: SDLC Implementation

  Scenario: Follow structured software development lifecycle
    Given AI/ML medical device development
    When implementing SDLC
    Then the process MUST include:
      | SDLC Phase                           | Required Activities         |
      |--------------------------------------|----------------------------|
      | Requirements Analysis                | Software requirements specification (SRS) |
      | Design                               | Architecture design, detailed design |
      | Implementation                       | Coding standards, code reviews |
      | Verification & Validation            | Unit testing, integration testing, system testing |
      | Release                              | Release documentation, validation |
      | Maintenance                          | Change control, post-market updates |
    And SDLC MUST comply with IEC 62304
    And software lifecycle plan MUST be documented
    And phase gate reviews MUST be conducted

  Scenario: Version control and configuration management
    Given software development activities
    When managing code and artifacts
    Then the system MUST provide:
      | Requirement                          | Implementation              |
      |--------------------------------------|----------------------------|
      | Version control system (e.g., Git)   | All code, configs, docs versioned |
      | Branch management strategy           | Feature branches, main/release branches |
      | Commit message standards             | Traceable to requirements   |
      | Artifact versioning                  | Models, datasets, configs   |
      | Build reproducibility                | Deterministic builds        |
    And version control history MUST be maintained
    And releases MUST be tagged
```

**Key Controls:**
- Software lifecycle plan (per IEC 62304)
- Version control system (Git)
- Configuration management plan
- Release management procedures

**Metrics:**
- SDLC phase completion rate
- Code review coverage (%)
- Version control commit frequency
- Build success rate

---

### 2. Code Quality and Testing

#### Acceptance Criteria
```gherkin
Feature: Code Quality Assurance

  Scenario: Implement coding standards
    Given software development
    When writing code
    Then developers MUST follow:
      | Standard                             | Enforcement Method          |
      |--------------------------------------|----------------------------|
      | Coding style guide (e.g., PEP 8)     | Linters (flake8, pylint)    |
      | Code complexity limits               | Cyclomatic complexity < 10  |
      | Documentation standards              | Docstrings for all functions |
      | Type annotations (if applicable)     | mypy or similar             |
    And linters MUST be integrated into CI/CD
    And code reviews MUST enforce standards
    And violations MUST be resolved before merge

  Scenario: Comprehensive testing strategy
    Given software components
    When testing software
    Then tests MUST include:
      | Test Level                           | Coverage Target             | Tools                       |
      |--------------------------------------|----------------------------|-----------------------------|
      | Unit tests                           | ≥ 80% code coverage        | pytest, unittest            |
      | Integration tests                    | All component interfaces   | pytest, integration framework |
      | System tests                         | All requirements           | End-to-end test suite       |
      | Model-specific tests                 | Performance, drift, bias   | ML test framework           |
    And tests MUST be automated
    And tests MUST run in CI/CD pipeline
    And test failures MUST block deployment
```

**Key Controls:**
- Coding standards document
- Automated linters and formatters
- Code review checklist
- Automated test suite
- CI/CD pipeline with quality gates

**Metrics:**
- Code coverage (unit tests ≥ 80%)
- Linter violation rate
- Code review completion rate
- Test pass rate

---

### 3. Cybersecurity Practices

#### Acceptance Criteria
```gherkin
Feature: Cybersecurity Controls

  Scenario: Secure development practices
    Given software development activities
    When implementing security controls
    Then the process MUST include:
      | Security Practice                    | Implementation              |
      |--------------------------------------|----------------------------|
      | Threat modeling                      | STRIDE or similar framework |
      | Secure coding practices              | OWASP Top 10 mitigation     |
      | Dependency vulnerability scanning    | Automated scanning (e.g., Snyk) |
      | Secrets management                   | No hardcoded credentials    |
      | Security code review                 | Dedicated security review   |
    And threat model MUST be documented
    And vulnerabilities MUST be remediated
    And security testing MUST be performed

  Scenario: Data protection and privacy
    Given AI/ML system handling patient data
    When implementing data protection
    Then controls MUST include:
      | Control                              | Requirement                 |
      |--------------------------------------|----------------------------|
      | Data encryption (at rest, in transit) | AES-256 or equivalent       |
      | Access controls                      | Role-based access control (RBAC) |
      | Audit logging                        | All data access logged      |
      | Data anonymization/de-identification | PHI/PII protection          |
      | Secure data disposal                 | Secure deletion procedures  |
    And encryption keys MUST be managed securely
    And access logs MUST be retained per policy
```

**Key Controls:**
- Threat model document
- Secure coding guidelines
- Dependency vulnerability scanning
- Secrets management system (e.g., AWS Secrets Manager)
- Security testing (SAST, DAST, penetration testing)

**Metrics:**
- Threat model coverage
- Vulnerability count (by severity)
- Mean time to remediate (MTTR) vulnerabilities
- Security test pass rate
- Encryption coverage (% of data encrypted)

---

## Implementation Guidelines

### Software Development Standards

```yaml
software_engineering_practices:
  version_control:
    system: "Git"
    hosting: "GitHub / GitLab / Bitbucket"
    branching_strategy: "GitFlow or trunk-based"
    commit_standards: "Conventional Commits"
  
  code_quality:
    language: "Python"
    style_guide: "PEP 8"
    linters: ["flake8", "pylint", "black"]
    type_checking: "mypy"
    complexity_limit: 10
  
  testing:
    unit_tests:
      framework: "pytest"
      coverage_target: 80
      execution: "CI/CD pipeline"
    integration_tests:
      framework: "pytest"
      scope: "Component interfaces"
    system_tests:
      framework: "End-to-end test suite"
      scope: "All requirements"
  
  ci_cd:
    platform: "GitHub Actions / GitLab CI / Jenkins"
    pipeline_stages: ["lint", "test", "build", "security_scan", "deploy"]
    quality_gates: ["lint_pass", "test_pass", "coverage_80", "security_pass"]
  
  cybersecurity:
    threat_modeling: "STRIDE"
    secure_coding: "OWASP Top 10 guidelines"
    dependency_scanning: "Snyk / Dependabot"
    secrets_management: "AWS Secrets Manager / HashiCorp Vault"
    security_testing: ["SAST", "DAST", "penetration_testing"]
```

---

## Integration Points

- **COMP-IEC62304-002:** Software development planning aligns with IEC 62304
- **COMP-IEC62304-006:** Unit implementation and verification includes testing
- **COMP-ISO27001-084:** Secure development lifecycle aligns with ISO 27001

---

## Audit Evidence

1. **SDLC Documentation:**
   - [ ] Software lifecycle plan
   - [ ] Software requirements specification (SRS)
   - [ ] Design documentation
   - [ ] Phase gate review records

2. **Code Quality:**
   - [ ] Coding standards document
   - [ ] Linter configuration and reports
   - [ ] Code review records
   - [ ] Test coverage reports

3. **Cybersecurity:**
   - [ ] Threat model document
   - [ ] Vulnerability scan reports
   - [ ] Security test results
   - [ ] Secrets management audit logs

---

## References

- FDA, Health Canada, MHRA (2021). "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
- IEC 62304:2006+AMD1:2015 (Medical Device Software - Software Life Cycle Processes)
- FDA (2018). "Content of Premarket Submissions for Management of Cybersecurity in Medical Devices"
- OWASP (2021). "OWASP Top 10"

---

## Revision History

| Version | Date       | Author            | Changes                                    |
|---------|------------|-------------------|--------------------------------------------|
| 1.0.0   | 2025-12-13 | Compliance Team   | Initial version - pending source verification |

---

## Notes

- **Status:** Pending verification with authoritative sources
- **Priority:** HIGH - Software quality and security are critical to device safety
- **Implementation Note:** Good software engineering is not negotiable for medical devices



