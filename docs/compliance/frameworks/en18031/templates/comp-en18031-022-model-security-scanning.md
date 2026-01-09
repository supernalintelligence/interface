---
id: comp-en18031-022-model-security-scanning
title: COMP-EN18031-022 - Model Security Scanning
purpose: Scan AI models for security vulnerabilities, malicious code, and backdoors before deployment
en18031Control: 6.3.6
category: ai-security
priority: high
framework: EN 18031
sidebar_label: COMP-EN18031-022
sidebar_position: 22
crossFramework:
  iso42001: 8.27 (AI System Security)
  euAiAct: Article 15 (Accuracy, Robustness, Cybersecurity)
  nistAiRmf: Manage 4.2, Measure 2.13
  iso27001: 067 (Management of Technical Vulnerabilities), 088 (Security Testing)
status: pending-verification
references: []
---

# COMP-EN18031-022: Model Security Scanning

## Overview

**Purpose**: Systematically scan AI models for security vulnerabilities, malicious code, backdoors, and supply chain risks before deployment  
**EN 18031 Control**: 6.3.6 - Model Security Scanning  
**Category**: ai-security  
**Priority**: high  
**Framework**: EN 18031

## Regulatory Context

### EN 18031 Alignment

- **6.3.6**: Model Security Scanning - Detect vulnerabilities in AI models
- **Related Controls**:
  - 6.3.3: Model Validation (security is part of validation)
  - 6.3.7: Model Supply Chain Security (scanning detects supply chain threats)
  - 6.2.6: Data Poisoning Prevention (scanning detects poisoning effects)

### Cross-Framework Mapping

- **ISO/IEC 42001**: 
  - 8.27: AI System Security - Security measures for AI
  - 6.1.2: Risk Assessment - Include AI security risks

- **EU AI Act**: 
  - Article 15: Accuracy, Robustness, and Cybersecurity
  - Recital 74: Cybersecurity measures for high-risk AI

- **NIST AI RMF**: 
  - MANAGE-4.2: Strategies to maximize AI system resilience
  - MEASURE-2.13: AI system resilience is characterized

- **ISO 27001**: 
  - A.8.8 (067): Management of Technical Vulnerabilities
  - A.8.29 (088): Security Testing in Development and Acceptance

## Description

Implements EN 18031 Section 6.3.6 to establish systematic model security scanning. Model security scanning detects:

1. **Backdoors**: Hidden triggers causing malicious behavior
2. **Malicious Code**: Embedded exploits in model or serving code
3. **Vulnerabilities**: Security weaknesses in model or dependencies
4. **Supply Chain Threats**: Compromised pre-trained models or libraries
5. **Adversarial Weaknesses**: Susceptibility to attacks
6. **Data Leakage**: Unintended memorization of sensitive data

### Scanning Scope

**Model Artifacts**:
- Model weights and parameters
- Model architecture (if code-based)
- Serialized model files (.pkl, .h5, .pt, .onnx)
- Model metadata and configuration

**Dependencies**:
- ML frameworks (TensorFlow, PyTorch, scikit-learn)
- Python packages and libraries
- Container images
- Serving infrastructure code

**Behavior**:
- Model predictions on test inputs
- Adversarial robustness
- Data extraction susceptibility
- Backdoor trigger detection

## Acceptance Criteria

```gherkin
Feature: Automated Model Security Scanning Pipeline
  As an AI Security Engineer
  I want automated security scanning in CI/CD pipeline
  So that no insecure models reach production

  Background:
    Given the organization trains and deploys AI models
    And EN 18031 requires model security
    And models must be scanned before deployment

  Scenario: Model File Security Scanning
    Given a trained model file is created
    When model file is scanned for security
    Then model file format shall be validated
    And model file shall be scanned for embedded malicious code
    And model serialization vulnerabilities shall be detected
    And pickle exploits shall be identified
    And model file integrity shall be verified
    And scan results shall be documented
    And insecure models shall be rejected

  Scenario: Model Dependency Scanning
    Given model has dependencies (packages, frameworks)
    When dependencies are scanned
    Then all dependencies shall be inventoried
    And known vulnerabilities (CVEs) shall be identified
    And outdated packages shall be flagged
    And malicious packages shall be detected
    And dependency tree shall be analyzed
    And high/critical vulnerabilities shall block deployment
    And scan results shall be actionable (version to upgrade to)

  Scenario: Model Behavioral Security Analysis
    Given model is ready for deployment
    When behavioral security analysis is performed
    Then model shall be tested for adversarial robustness
    And model shall be tested for backdoor triggers
    And model shall be tested for data extraction vulnerabilities
    And model shall be tested for bias exploitation
    And behavioral anomalies shall be detected
    And security risks shall be quantified
    And risky behaviors shall block deployment

  Scenario: Pre-Trained Model Supply Chain Validation
    Given model uses pre-trained weights or fine-tuning
    When supply chain is validated
    Then source of pre-trained model shall be verified
    And pre-trained model provenance shall be checked
    And pre-trained model integrity (checksums) shall be verified
    And pre-trained model reputation shall be assessed
    And pre-trained model shall be scanned for backdoors
    And untrusted pre-trained models shall be rejected
    And supply chain validation shall be documented

Feature: Continuous Model Security Monitoring
  As an MLOps Engineer
  I want continuous security monitoring of deployed models
  So that new vulnerabilities are detected quickly

  Scenario: Vulnerability Database Updates
    Given model security scanner is operational
    When vulnerability databases are updated
    Then scanner shall use latest CVE database
    And scanner shall use latest ML-specific vulnerability database
    And scanner shall update automatically (daily/weekly)
    And scanner shall re-scan deployed models on critical CVEs
    And scanner shall alert on newly discovered vulnerabilities
    And vulnerability tracking shall be continuous

  Scenario: Deployed Model Re-Scanning
    Given models are deployed in production
    When new vulnerabilities are discovered
    Then deployed models shall be re-scanned
    And vulnerable deployed models shall be identified
    And security impact shall be assessed
    And remediation shall be prioritized
    And vulnerable models shall be patched or rolled back
    And re-scanning shall be automated

  Scenario: Security Scanning Integration with CI/CD
    Given CI/CD pipeline deploys models
    When security scanning is integrated
    Then scanning shall occur before model deployment
    And scanning shall be automated (no manual trigger)
    And scan failures shall block deployment
    And scan results shall be reported in pipeline
    And scan results shall be stored for audit
    And scanning shall not significantly delay deployment (<5min)
    And integration shall be tested regularly

Feature: Security Scan Reporting and Remediation
  As an AI Compliance Officer
  I want comprehensive security scan reports
  So that risks are understood and remediated

  Scenario: Security Scan Report Generation
    Given model has been scanned
    When scan report is generated
    Then report shall list all identified vulnerabilities
    And report shall include severity ratings (Critical, High, Medium, Low)
    And report shall include remediation recommendations
    And report shall include CVSS scores where applicable
    And report shall include exploitability assessment
    And report shall be exportable (PDF, JSON)
    And report shall be stored for audit

  Scenario: Vulnerability Prioritization and Remediation
    Given vulnerabilities are identified
    When vulnerabilities are prioritized
    Then Critical/High vulnerabilities shall be prioritized
    And exploitable vulnerabilities shall be prioritized
    And vulnerabilities in production models shall be prioritized
    And remediation timeline shall be defined
    And remediation actions shall be tracked
    And remediation shall be verified
    And remediation shall be documented

  Scenario: Security Metrics and Dashboards
    Given models are being scanned continuously
    When security metrics are tracked
    Then total vulnerabilities per severity shall be measured
    And mean time to remediation shall be tracked
    And scan coverage (% of models scanned) shall be measured
    And security posture over time shall be visualized
    And metrics shall inform security improvements
    And metrics shall be reported to stakeholders

Feature: Advanced Threat Detection for AI Models
  As an AI Security Researcher
  I want advanced threat detection capabilities
  So that sophisticated attacks are detected

  Scenario: Backdoor Trigger Detection
    Given model may contain backdoor
    When backdoor detection is performed
    Then backdoor detection algorithms (Neural Cleanse, etc.) shall be run
    And trigger patterns shall be reverse-engineered
    And target classes shall be identified
    And backdoor confidence score shall be calculated
    And confirmed backdoors shall prevent deployment
    And backdoor detection results shall be documented

  Scenario: Model Inversion Attack Testing
    Given model may leak training data
    When model inversion testing is performed
    Then model shall be tested for data extraction vulnerability
    And ability to reconstruct training samples shall be assessed
    And privacy leakage risk shall be quantified
    And high-risk leakage shall prevent deployment
    And mitigation strategies shall be recommended
    And testing results shall be documented

  Scenario: Adversarial Robustness Testing
    Given model may be vulnerable to adversarial attacks
    When adversarial robustness is tested
    Then model shall be tested against FGSM, PGD, C&W attacks
    And adversarial examples shall be generated
    And model accuracy under attack shall be measured
    And robustness score shall be calculated
    And unacceptably vulnerable models shall be rejected
    And robustness testing shall be documented

Feature: Model Security Governance
  As an AI Governance Lead
  I want security scanning governance policies
  So that security standards are enforced

  Scenario: Security Scanning Policy Enforcement
    Given organization has model security policy
    When policy is enforced
    Then all models shall be scanned before deployment
    And scan failures shall block deployment
    And exceptions shall require explicit approval
    And exceptions shall be documented with justification
    And policy compliance shall be audited
    And policy violations shall be escalated

  Scenario: Security Exception Management
    Given a model fails security scan
    When security exception is requested
    Then exception shall require risk assessment
    And exception shall require compensating controls
    And exception shall require approval by security team
    And exception shall have expiration date
    And exception shall be documented
    And exception shall be reviewed regularly

  Scenario: Compliance Verification
    Given EN 18031 and EU AI Act require model security
    When compliance audit is performed
    Then model security scanning shall be demonstrated
    And scan coverage shall be verified (100% of production models)
    And vulnerability remediation shall be traceable
    And security governance shall be documented
    And compliance with EN 18031 6.3.6 shall be verified
    And EU AI Act cybersecurity requirements shall be met
```

## Technical Context

### Model Security Scanning Architecture

```
┌─────────────────────────────────────────────────────┐
│         Model Training Complete                     │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Model File Security Scan                         │
│  • Format validation                                 │
│  • Malicious code detection                          │
│  • Serialization vulnerability scan                  │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Dependency Security Scan                         │
│  • CVE scanning (pip-audit, safety)                  │
│  • Malicious package detection                       │
│  • Outdated package identification                   │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Behavioral Security Analysis                     │
│  • Backdoor detection                                │
│  • Adversarial robustness testing                    │
│  • Data extraction vulnerability testing             │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Security Scan Report                             │
│  • Aggregate findings                                │
│  • Severity assessment                               │
│  • Remediation recommendations                       │
└──────────────┬───────────────────────────────────────┘
               │
         Pass / Fail
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
   Pass              Fail
      │                 │
      │                 ▼
      │         Remediation Required
      │                 │
      │                 ▼
      │         Fix & Re-scan
      │
      ▼
┌──────────────────────────────────────────────────────┐
│     Deploy to Production                             │
└──────────────────────────────────────────────────────┘
```

### Implementation Pattern: Model Security Scanner

```python
import pickle
import ast
import json
from pathlib import Path

class ModelSecurityScanner:
    def __init__(self):
        self.vulnerability_db = VulnerabilityDatabase()
        self.backdoor_detector = BackdoorDetector()
        self.adversarial_tester = AdversarialRobustnessTester()
    
    def scan_model_file(self, model_path):
        """Scan model file for security issues"""
        scan_results = {
            'model_path': str(model_path),
            'format_validation': None,
            'malicious_code_detection': None,
            'serialization_vulnerabilities': None,
            'overall_status': 'PASS'
        }
        
        # Validate model file format
        scan_results['format_validation'] = self.validate_model_format(model_path)
        
        # Scan for malicious code (especially in pickle files)
        if model_path.suffix == '.pkl':
            scan_results['malicious_code_detection'] = self.scan_pickle_for_malicious_code(model_path)
        
        # Check for known serialization vulnerabilities
        scan_results['serialization_vulnerabilities'] = self.check_serialization_vulnerabilities(model_path)
        
        # Determine overall status
        if any([
            scan_results['malicious_code_detection'] and scan_results['malicious_code_detection']['found'],
            scan_results['serialization_vulnerabilities'] and scan_results['serialization_vulnerabilities']['critical_found']
        ]):
            scan_results['overall_status'] = 'FAIL'
        
        return scan_results
    
    def scan_pickle_for_malicious_code(self, pickle_path):
        """Scan pickle file for malicious operations"""
        # Pickle files can contain arbitrary code execution
        # Check for dangerous operations
        
        dangerous_ops = []
        
        try:
            with open(pickle_path, 'rb') as f:
                # Parse pickle opcodes without loading
                import pickletools
                opcodes = list(pickletools.dis(f))
                
                # Look for dangerous operations
                for opcode, arg, pos in opcodes:
                    if opcode.name in ['REDUCE', 'BUILD', 'INST', 'OBJ']:
                        # These can execute arbitrary code
                        dangerous_ops.append({
                            'opcode': opcode.name,
                            'position': pos,
                            'risk': 'HIGH'
                        })
        except Exception as e:
            return {
                'found': True,
                'error': str(e),
                'dangerous_operations': []
            }
        
        return {
            'found': len(dangerous_ops) > 0,
            'dangerous_operations': dangerous_ops,
            'recommendation': 'Use safer formats like ONNX, TorchScript' if dangerous_ops else None
        }
    
    def scan_dependencies(self, requirements_file=None, environment=None):
        """Scan model dependencies for known vulnerabilities"""
        vulnerabilities = []
        
        # Get list of installed packages
        import pkg_resources
        installed_packages = {pkg.key: pkg.version for pkg in pkg_resources.working_set}
        
        # Check each package against vulnerability database
        for package_name, version in installed_packages.items():
            vulns = self.vulnerability_db.check_package(package_name, version)
            if vulns:
                vulnerabilities.extend(vulns)
        
        # Categorize by severity
        critical = [v for v in vulnerabilities if v['severity'] == 'CRITICAL']
        high = [v for v in vulnerabilities if v['severity'] == 'HIGH']
        medium = [v for v in vulnerabilities if v['severity'] == 'MEDIUM']
        low = [v for v in vulnerabilities if v['severity'] == 'LOW']
        
        scan_results = {
            'total_vulnerabilities': len(vulnerabilities),
            'critical': len(critical),
            'high': len(high),
            'medium': len(medium),
            'low': len(low),
            'vulnerabilities': vulnerabilities,
            'overall_status': 'FAIL' if critical or len(high) > 5 else 'WARN' if high else 'PASS'
        }
        
        return scan_results
    
    def detect_backdoor(self, model, test_data):
        """Detect if model contains backdoor"""
        return self.backdoor_detector.detect(model, test_data)
    
    def test_adversarial_robustness(self, model, test_data):
        """Test model robustness against adversarial attacks"""
        robustness_results = {
            'fgsm_accuracy': None,
            'pgd_accuracy': None,
            'cw_accuracy': None,
            'overall_robustness_score': None,
            'status': 'PASS'
        }
        
        # Test FGSM (Fast Gradient Sign Method)
        fgsm_results = self.adversarial_tester.test_fgsm(model, test_data)
        robustness_results['fgsm_accuracy'] = fgsm_results['accuracy']
        
        # Test PGD (Projected Gradient Descent)
        pgd_results = self.adversarial_tester.test_pgd(model, test_data)
        robustness_results['pgd_accuracy'] = pgd_results['accuracy']
        
        # Test C&W (Carlini & Wagner)
        cw_results = self.adversarial_tester.test_cw(model, test_data)
        robustness_results['cw_accuracy'] = cw_results['accuracy']
        
        # Calculate overall robustness score
        robustness_results['overall_robustness_score'] = (
            robustness_results['fgsm_accuracy'] * 0.3 +
            robustness_results['pgd_accuracy'] * 0.4 +
            robustness_results['cw_accuracy'] * 0.3
        )
        
        # Fail if robustness too low
        if robustness_results['overall_robustness_score'] < 0.5:
            robustness_results['status'] = 'FAIL'
        elif robustness_results['overall_robustness_score'] < 0.7:
            robustness_results['status'] = 'WARN'
        
        return robustness_results
    
    def comprehensive_security_scan(self, model_path, model, test_data):
        """Run all security scans on model"""
        scan_report = {
            'model_path': str(model_path),
            'timestamp': datetime.utcnow().isoformat(),
            'scans': {}
        }
        
        # Model file security
        scan_report['scans']['file_security'] = self.scan_model_file(model_path)
        
        # Dependency security
        scan_report['scans']['dependency_security'] = self.scan_dependencies()
        
        # Backdoor detection
        scan_report['scans']['backdoor_detection'] = self.detect_backdoor(model, test_data)
        
        # Adversarial robustness
        scan_report['scans']['adversarial_robustness'] = self.test_adversarial_robustness(model, test_data)
        
        # Overall assessment
        scan_report['overall_status'] = self.determine_overall_status(scan_report['scans'])
        scan_report['deployment_recommendation'] = self.generate_deployment_recommendation(scan_report)
        
        return scan_report
    
    def determine_overall_status(self, scans):
        """Determine overall scan status"""
        # Fail if any critical issues
        for scan_name, scan_result in scans.items():
            if scan_result.get('overall_status') == 'FAIL' or scan_result.get('status') == 'FAIL':
                return 'FAIL'
        
        # Warn if any warnings
        for scan_name, scan_result in scans.items():
            if scan_result.get('overall_status') == 'WARN' or scan_result.get('status') == 'WARN':
                return 'WARN'
        
        return 'PASS'
    
    def generate_deployment_recommendation(self, scan_report):
        """Generate recommendation based on scan results"""
        if scan_report['overall_status'] == 'FAIL':
            return {
                'recommendation': 'DO NOT DEPLOY',
                'reason': 'Critical security issues detected',
                'required_actions': self.extract_required_actions(scan_report)
            }
        elif scan_report['overall_status'] == 'WARN':
            return {
                'recommendation': 'DEPLOY WITH CAUTION',
                'reason': 'Non-critical security issues detected',
                'recommended_actions': self.extract_recommended_actions(scan_report)
            }
        else:
            return {
                'recommendation': 'APPROVED FOR DEPLOYMENT',
                'reason': 'No critical security issues detected'
            }
```

### Implementation Requirements

#### Scanning Tools

**Model File Scanning**:
- Custom pickle analyzer
- Format validators
- Serialization vulnerability checkers

**Dependency Scanning**:
- `pip-audit` (Python dependency vulnerabilities)
- `safety` (Python package safety)
- `snyk` (multi-language dependency scanning)
- `trivy` (container and dependency scanning)

**Behavioral Analysis**:
- ART (Adversarial Robustness Toolbox)
- Foolbox (adversarial attack library)
- Neural Cleanse (backdoor detection)
- CleverHans (adversarial examples)

#### Vulnerability Databases

- **CVE Database**: National Vulnerability Database
- **OSV (Open Source Vulnerabilities)**: Google's vulnerability database
- **ML-specific vulnerabilities**: Custom database

## Validation Strategy

### Testing Approach

1. **Scanner Validation**: Test scanner detects known vulnerabilities
2. **False Positive Rate**: Minimize false alarms
3. **Performance Testing**: Scanner completes within time limits
4. **Integration Testing**: CI/CD integration works
5. **Red Team Testing**: Test against real attacks

### Metrics

- **Scan Coverage**: 100% of models scanned before deployment
- **Scan Time**: < 5 minutes per model
- **Mean Time to Remediation**: < 48 hours for critical vulnerabilities
- **False Positive Rate**: < 5%

## Evidence Requirements

### Required Documentation

1. **Security Scanning Policy**: Standards, procedures, thresholds
2. **Scan Reports**: All model security scans
3. **Vulnerability Remediation**: Tracking of fixes
4. **Scanner Validation**: Evidence scanner works correctly

### Evidence Collection

**Metrics**:
- Total models scanned
- Vulnerabilities detected by severity
- Vulnerabilities remediated
- Scan coverage percentage

**Audit Trail**:
- Scan execution logs
- Scan results
- Remediation actions
- Policy exceptions

## Related Controls

### Within EN 18031

- **comp-en18031-015-data-poisoning-prevention**: Scanning detects poisoning effects
- **comp-en18031-024-model-backdoor-prevention**: Scanning detects backdoors
- **comp-en18031-025-model-supply-chain-security**: Scanning validates supply chain

### Cross-Framework

- **ISO 27001 A.8.8**: Vulnerability management
- **NIST AI RMF MANAGE-4.2**: AI system resilience strategies

## Implementation Notes

### Best Practices

1. **Automate Scanning**: Integrate into CI/CD, no manual triggers
2. **Scan Early and Often**: Scan on every model version
3. **Prioritize Remediation**: Fix critical vulnerabilities first
4. **Keep Scanners Updated**: Update vulnerability databases regularly
5. **Test Scanners**: Validate scanners detect known issues

### Common Pitfalls

- **Pitfall**: Scanning only at deployment (too late)
  - **Solution**: Scan early in development, shift-left security

- **Pitfall**: Ignoring warnings (accumulate technical debt)
  - **Solution**: Track and remediate all findings, even low severity

- **Pitfall**: Scanner becomes bottleneck (slows deployment)
  - **Solution**: Optimize scanner performance, run scans in parallel

- **Pitfall**: False positives cause alert fatigue
  - **Solution**: Tune scanner thresholds, investigate and document false positives

### ML/AI Tooling

**Security Scanning**:
- **pip-audit**: Python dependency vulnerability scanner
- **Trivy**: Container and dependency scanner
- **Snyk**: Multi-language security scanner

**Adversarial Testing**:
- **ART (Adversarial Robustness Toolbox)**: Comprehensive adversarial testing
- **Foolbox**: Adversarial attacks library
- **CleverHans**: Adversarial examples

**Backdoor Detection**:
- **Neural Cleanse**: Backdoor trigger detection
- **Activation Clustering**: Backdoor detection via clustering

## Status

- [ ] Model file security scanner implemented
- [ ] Dependency vulnerability scanner integrated
- [ ] Backdoor detection capability deployed
- [ ] Adversarial robustness testing operational
- [ ] CI/CD integration complete
- [ ] Vulnerability database configured and auto-updating
- [ ] Security scan reporting system operational
- [ ] Remediation tracking process established
- [ ] Security scanning policy defined
- [ ] Scanner validation completed
- [ ] Documentation completed
- [ ] Compliance with EN 18031 6.3.6 verified
