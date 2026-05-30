---
title: Good Machine Learning Practice (GMLP) - Overview
type: documentation
created: 2025-12-17
updated: 2025-12-17
---

# Good Machine Learning Practice (GMLP) - Overview

## Framework Information

- **Framework Name:** Good Machine Learning Practice (GMLP) for Medical Device Development
- **Authority:** U.S. Food and Drug Administration (FDA), Health Canada, UK MHRA
- **Document:** Guiding Principles (October 2021)
- **Applicability:** AI/ML-based medical devices (Software as a Medical Device - SaMD)
- **Status:** Active, International Consensus

## Purpose

Good Machine Learning Practice (GMLP) provides guiding principles for developing safe, effective, and high-quality AI/ML-based medical devices. These principles were developed through an international collaboration between FDA (USA), Health Canada, and the UK MHRA to establish a harmonized framework for medical device machine learning.

## Scope

GMLP applies to:
- **AI/ML-Based Medical Devices (SaMD):** Software that performs medical functions
- **Machine Learning Models:** Used for clinical decision support, diagnosis, treatment planning, monitoring
- **Medical Device Manufacturers:** Developing AI/ML-based medical devices
- **Regulatory Bodies:** Reviewing AI/ML medical device submissions

## Core GMLP Principles

The GMLP framework is built on **10 guiding principles** that span the entire product lifecycle:

### 1. Multi-Disciplinary Expertise
- Leverage expertise from clinical, technical, and regulatory domains
- Ensure appropriate oversight and review
- Foster collaboration across disciplines

### 2. Good Software Engineering and Security Practices
- Apply software engineering best practices
- Implement cybersecurity controls
- Follow secure development lifecycle

### 3. Clinical Study Participants and Data Sets are Representative
- Ensure training data represents target population
- Validate performance across demographic subgroups
- Address dataset biases

### 4. Training Data Sets are Independent of Test Sets
- Maintain strict data segregation
- Prevent data leakage
- Ensure independent validation

### 5. Selected Reference Datasets are Based Upon Best Available Methods
- Use high-quality reference standards
- Document data provenance
- Validate ground truth labels

### 6. Model Design is Tailored to the Available Data and Reflects the Intended Use
- Align model complexity with data availability
- Match model architecture to clinical task
- Document model selection rationale

### 7. Focus is Placed on the Performance of the Human-AI Team
- Evaluate human-AI interaction
- Assess clinical workflow integration
- Measure combined performance (not AI alone)

### 8. Testing Demonstrates Device Performance During Clinically Relevant Conditions
- Test in realistic clinical scenarios
- Include edge cases and failure modes
- Validate across intended use conditions

### 9. Users are Provided Clear, Essential Information
- Provide transparent model information
- Communicate limitations and failure modes
- Enable informed clinical decision-making

### 10. Deployed Models are Monitored for Performance and Re-Training Risks are Managed
- Implement post-market surveillance
- Detect model drift
- Manage model updates with appropriate regulatory controls

---

## GMLP Lifecycle Integration

GMLP principles are integrated throughout the Total Product Lifecycle (TPLC):

```
┌─────────────────────────────────────────────────────────────┐
│                    GMLP Product Lifecycle                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Problem Definition & Planning                            │
│     ├─ Clinical objective definition (Principle 1, 6)        │
│     ├─ Multi-disciplinary team formation (Principle 1)       │
│     └─ Intended use specification (Principle 6, 9)           │
│                                                               │
│  2. Data Collection & Management                             │
│     ├─ Representative datasets (Principle 3)                 │
│     ├─ Reference datasets selection (Principle 5)            │
│     ├─ Data quality assurance (Principle 5)                  │
│     └─ Data provenance tracking (Principle 5)                │
│                                                               │
│  3. Model Development                                         │
│     ├─ Model design (Principle 6)                            │
│     ├─ Good software engineering (Principle 2)               │
│     ├─ Training/test set independence (Principle 4)          │
│     └─ Model selection and validation (Principle 6)          │
│                                                               │
│  4. Clinical Validation                                       │
│     ├─ Testing in clinically relevant conditions (Principle 8)│
│     ├─ Human-AI team performance (Principle 7)               │
│     └─ Subgroup performance evaluation (Principle 3)         │
│                                                               │
│  5. Regulatory Submission & Approval                          │
│     ├─ Transparent documentation (Principle 9)               │
│     ├─ Performance evidence (Principle 8)                    │
│     └─ Labeling and user information (Principle 9)           │
│                                                               │
│  6. Post-Market Surveillance                                  │
│     ├─ Deployed model monitoring (Principle 10)              │
│     ├─ Performance drift detection (Principle 10)            │
│     └─ Re-training risk management (Principle 10)            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration with Other Frameworks

GMLP principles complement and integrate with existing regulatory frameworks:

### Medical Device Quality Systems
- **ISO 13485:** Quality management for medical devices
- **21 CFR Part 820:** FDA Quality System Regulation
- **Design Controls:** Requirements, verification, validation

### Software Lifecycle Standards
- **IEC 62304:** Medical device software lifecycle
- **ISO 14971:** Risk management for medical devices

### Data Protection & Privacy
- **HIPAA:** Protected health information (USA)
- **GDPR:** Personal data protection (EU)
- **ISO 27001:** Information security management

### AI-Specific Standards
- **EN 18031:** AI system trustworthiness
- **ISO/IEC 42001:** AI management systems (emerging)

---

## Regulatory Context

### FDA Perspective

GMLP is part of FDA's comprehensive AI/ML regulatory approach:

1. **AI/ML-Based Software as a Medical Device (SaMD) Action Plan (2021)**
   - GMLP as foundational principles
   - Total Product Lifecycle (TPLC) approach
   - Predetermined Change Control Plans (PCCP)

2. **Software Pre-Certification (Pre-Cert) Program**
   - Organizational excellence assessment
   - Real-world performance monitoring

3. **Digital Health Center of Excellence**
   - Guidance development
   - Stakeholder engagement

### International Harmonization

GMLP represents international consensus:
- **FDA (USA):** Integrated into regulatory framework
- **Health Canada:** Aligned guidance documents
- **UK MHRA:** Software and AI as Medical Device guidance
- **IMDRF:** International Medical Device Regulators Forum alignment

---

## Compliance Cards in This Framework

This framework includes **10 compliance cards**, each addressing one GMLP principle:

| Card ID | Title | GMLP Principle | Priority |
|---------|-------|----------------|----------|
| COMP-GMLP-001 | Multi-Disciplinary Expertise | Principle 1 | HIGH |
| COMP-GMLP-002 | Good Software Engineering | Principle 2 | HIGH |
| COMP-GMLP-003 | Representative Datasets | Principle 3 | CRITICAL |
| COMP-GMLP-004 | Training/Test Set Independence | Principle 4 | CRITICAL |
| COMP-GMLP-005 | Reference Dataset Selection | Principle 5 | HIGH |
| COMP-GMLP-006 | Model Design Alignment | Principle 6 | HIGH |
| COMP-GMLP-007 | Human-AI Team Performance | Principle 7 | CRITICAL |
| COMP-GMLP-008 | Clinically Relevant Testing | Principle 8 | CRITICAL |
| COMP-GMLP-009 | User Information & Transparency | Principle 9 | HIGH |
| COMP-GMLP-010 | Post-Market Monitoring & Re-Training | Principle 10 | CRITICAL |

---

## References

### Primary Sources

- **FDA, Health Canada, MHRA (2021).** "Good Machine Learning Practice for Medical Device Development: Guiding Principles"
  - URL: https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles
  - Status: **Pending verification in Reference Manager**

- **FDA (2021).** "Artificial Intelligence/Machine Learning (AI/ML)-Based Software as a Medical Device (SaMD) Action Plan"
  - URL: https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices
  - Status: **Pending verification in Reference Manager**

### Supporting Guidance

- **FDA (2019).** "Content of Premarket Submissions for Device Software Functions"
- **IMDRF (2014).** "Software as a Medical Device (SaMD): Clinical Evaluation"
- **FDA (2023).** "Marketing Submission Recommendations for a Predetermined Change Control Plan"

### Best Practices

- **AdvaMed (2021).** "AI/ML Best Practices for Medical Device Manufacturers"
- **AAMI (2021).** "Consensus Report: Advancing Artificial Intelligence in Health Care"

---

## Implementation Guidance

### For Medical Device Manufacturers

1. **Establish Multi-Disciplinary Team** (GMLP Principle 1)
   - Clinical experts, ML engineers, regulatory affairs, quality assurance
   - Define roles and responsibilities

2. **Implement Software Engineering Best Practices** (GMLP Principle 2)
   - Version control, code review, testing, cybersecurity
   - Follow software development lifecycle (IEC 62304)

3. **Ensure Data Quality and Representativeness** (GMLP Principles 3, 5)
   - Collect representative datasets
   - Validate data quality (ALCOA+ principles)
   - Document data provenance

4. **Maintain Rigorous Data Segregation** (GMLP Principle 4)
   - Training, validation, and test sets must be independent
   - Prevent data leakage

5. **Design Models Thoughtfully** (GMLP Principle 6)
   - Align model complexity with data availability
   - Document model selection rationale

6. **Validate Human-AI Team Performance** (GMLP Principle 7)
   - Test in realistic clinical workflows
   - Measure combined clinician + AI performance

7. **Test in Clinically Relevant Conditions** (GMLP Principle 8)
   - Include edge cases, failure modes
   - Validate across demographic subgroups

8. **Provide Transparent Information** (GMLP Principle 9)
   - Clear labeling, limitations, failure modes
   - Enable informed clinical use

9. **Monitor Post-Market Performance** (GMLP Principle 10)
   - Real-world performance monitoring
   - Model drift detection
   - Predetermined Change Control Plans (PCCP)

### For Regulatory Bodies

- Use GMLP principles as evaluation criteria
- Assess compliance across entire product lifecycle
- Require evidence for each principle

---

## Notes

- **Status:** Pending verification with authoritative sources (Reference Manager)
- **Last Updated:** 2025-12-13
- **Maintained By:** Compliance Team
- **Review Cycle:** Annual or when FDA issues updated guidance

---

## Related Documentation

- [FDA AI/ML Framework Overview](./fda-aiml/overview/index.md)
- [IEC 62304 Framework Overview](./iec62304/overview/index.md)
- [EN 18031 Framework Overview](./en18031/overview/index.md)
- [Compliance Card Index](../../COMPLIANCE_INDEX.md)



