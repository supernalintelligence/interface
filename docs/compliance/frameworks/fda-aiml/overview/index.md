---
title: FDA AI/ML Medical Device Guidance - Compliance Framework
type: documentation
created: 2025-12-17
updated: 2025-12-17
---

# FDA AI/ML Medical Device Guidance - Compliance Framework

## Overview

This directory contains compliance cards implementing the FDA's guidance on Artificial Intelligence and Machine Learning (AI/ML)-Based Software as a Medical Device (SaMD).

### Regulatory Foundation

**Primary Guidance Documents**:
1. **"Artificial Intelligence and Machine Learning in Software as a Medical Device"** (2021)
   - Good Machine Learning Practice (GMLP) principles
   - Predetermined change control plans
   - Algorithm change protocol framework

2. **"Clinical Decision Support Software"** (2022)
   - CDS software regulatory framework
   - Non-device vs. device determination
   - CURES Act implementation

3. **"Marketing Submission Recommendations for a Predetermined Change Control Plan"** (2023)
   - SaMD Pre-Specifications (SPS)
   - Algorithm Change Protocol (ACP)
   - Pre-market submission requirements

4. **"Continuously Learning AI/ML" (Draft)**
   - Continuous learning systems
   - Post-market performance monitoring
   - Real-world performance validation

### Relationship to Other Standards

**FDA AI/ML guidance integrates with**:
- **IEC 62304**: Software lifecycle processes (device software requirements)
- **ISO 13485**: Quality management system
- **IEC 82304-1**: Health software general requirements
- **ISO 14971**: Risk management (AI/ML-specific hazards)
- **EN 18031**: AI system trustworthiness (transparency, robustness, explainability)
- **Good Machine Learning Practice (GMLP)**: Industry best practices (10 guiding principles)

### Scope

**Applies to**:
- AI/ML-based Software as a Medical Device (SaMD)
- Medical devices with AI/ML functions
- Clinical Decision Support (CDS) software (device category)
- Continuously learning AI/ML algorithms
- Predetermined change control plans

**Does NOT apply to**:
- Non-device CDS software (CURES Act exemptions)
- Traditional (non-learning) algorithms
- Pure research/investigational AI (not marketed)

---

## FDA AI/ML Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                     FDA AI/ML Lifecycle                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Clinical Objective Definition (GMLP P1)                     │
│     └─> Define intended use, clinical benefit, user population  │
│                                                                 │
│  2. Data Management (GMLP P2, P3)                              │
│     ├─> Data quality (ALCOA+ principles)                       │
│     ├─> Dataset relevance (representative of deployment)       │
│     └─> Data provenance and lineage tracking                   │
│                                                                 │
│  3. Model Development (GMLP P4, P5, P6)                        │
│     ├─> Feature engineering (clinically relevant)              │
│     ├─> Model selection (appropriate algorithms)               │
│     └─> Training strategy (prevent overfitting, bias)          │
│                                                                 │
│  4. Model Evaluation (GMLP P7)                                 │
│     ├─> Performance evaluation (clinically relevant metrics)   │
│     ├─> Bias and fairness testing                             │
│     └─> Robustness and generalization testing                 │
│                                                                 │
│  5. Clinical Validation (GMLP P8)                              │
│     ├─> Demonstrate clinical utility                           │
│     ├─> Clinical studies (if required)                         │
│     └─> Real-world evidence                                    │
│                                                                 │
│  6. Transparency & Interpretability (GMLP P9)                  │
│     ├─> Model explainability (XAI techniques)                  │
│     ├─> User documentation (clinician-facing)                  │
│     └─> Labeling (indications, limitations)                    │
│                                                                 │
│  7. Real-World Performance (GMLP P10)                          │
│     ├─> Post-market surveillance                               │
│     ├─> Performance monitoring (data drift, model drift)       │
│     ├─> Algorithm Change Protocol (ACP)                        │
│     └─> Predetermined Change Control Plan                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Compliance Cards

### Critical Cards (Must-Have for AI/ML Medical Devices)

| Card ID | Title | Phase | Audit Frequency |
|---------|-------|-------|-----------------|
| **COMP-FDA-ML-001** | Good Machine Learning Practice (GMLP) | 2-Research, 3-Design | Per Release |
| **COMP-FDA-ML-002** | Clinical Objective and Intended Use Definition | 1-Discovery, 2-Research | Per Product |
| **COMP-FDA-ML-003** | AI/ML Data Quality (ALCOA+) | 2-Research, 7-Build | Per Dataset |
| **COMP-FDA-ML-004** | Dataset Relevance and Representativeness | 2-Research, 7-Build | Per Dataset |
| **COMP-FDA-ML-005** | Clinical Validation Requirements | 8-Integration, 9-Milestone | Per Release |
| **COMP-FDA-ML-006** | Model Transparency and Interpretability | 3-Design, 7-Build | Per Model Version |
| **COMP-FDA-ML-007** | Real-World Performance Monitoring | 11-Production, 12-Operations | Quarterly |

### Predetermined Change Control Plans

| Card ID | Title | Phase | Audit Frequency |
|---------|-------|-------|-----------------|
| **COMP-FDA-ML-008** | SaMD Pre-Specifications (SPS) | 2-Research, 3-Design | Per Submission |
| **COMP-FDA-ML-009** | Algorithm Change Protocol (ACP) | 3-Design, 11-Production | Per Change Type |
| **COMP-FDA-ML-010** | Predetermined Change Control Plan Submission | 4-Planning, 9-Milestone | Per Pre-market Submission |

---

## Regulatory Submission Requirements

### 510(k) Submissions with AI/ML

**Required Documentation**:
1. **Description of AI/ML** (algorithm type, training approach)
2. **Training Dataset Description** (size, demographics, data sources)
3. **Performance Evaluation** (validation set results, confusion matrices, metrics)
4. **Clinical Validation** (clinical studies or real-world evidence)
5. **Risk Analysis** (ISO 14971 with AI/ML-specific hazards)
6. **Labeling** (indications, limitations, user qualifications)
7. **GMLP Adherence** (demonstration of 10 principles)

### De Novo Submissions with AI/ML

**Additional Requirements** (beyond 510(k)):
1. **Special Controls** (AI/ML-specific controls)
2. **Clinical Data** (often required for novel AI/ML devices)
3. **Post-market Surveillance Plan** (performance monitoring)
4. **Predetermined Change Control Plan** (if applicable)

### PMA Submissions with AI/ML

**Most Rigorous Requirements**:
1. **Comprehensive Clinical Data** (pivotal clinical trials)
2. **Manufacturing and Quality System** (ISO 13485, GMLP)
3. **Post-Approval Studies** (real-world performance)
4. **Annual Reports** (device performance, algorithm updates)

---

## Common AI/ML Hazards (ISO 14971)

| Hazard | Source | Risk Control | Card Reference |
|--------|--------|--------------|----------------|
| **Training Data Bias** | Unrepresentative training data | Dataset diversity requirements, bias testing | COMP-FDA-ML-004 |
| **Data Drift** | Real-world data differs from training data | Performance monitoring, drift detection | COMP-FDA-ML-007 |
| **Model Drift** | Model performance degrades over time | Performance monitoring, retraining triggers | COMP-FDA-ML-007 |
| **Overfitting** | Model doesn't generalize | Cross-validation, independent test set | COMP-FDA-ML-001 |
| **Adversarial Attacks** | Malicious input manipulation | Input validation, adversarial training | COMP-FDA-ML-001 |
| **Label Noise** | Incorrect training labels | Data quality assurance (ALCOA+) | COMP-FDA-ML-003 |
| **Spurious Correlations** | Model learns non-causal patterns | Feature engineering, domain expertise | COMP-FDA-ML-001 |
| **Algorithmic Opacity** | Black-box models | Explainability (XAI), transparency | COMP-FDA-ML-006 |
| **Continuous Learning Failures** | Model updates degrade performance | Algorithm Change Protocol, rollback | COMP-FDA-ML-009 |

---

## Key Definitions

**AI/ML-Based SaMD**: Software that uses machine learning algorithms to make medical decisions or recommendations.

**Good Machine Learning Practice (GMLP)**: 10 guiding principles for ML development in medical devices (FDA + industry consortium).

**SaMD Pre-Specifications (SPS)**: Types of anticipated modifications (features, inputs, use) and associated risks.

**Algorithm Change Protocol (ACP)**: Procedures for developing, validating, and implementing algorithm modifications specified in SPS.

**Predetermined Change Control Plan**: Pre-market submission describing SPS and ACP for post-market algorithm changes without new FDA submission.

**Continuous Learning**: AI/ML models that update parameters or retrain based on new data in deployment.

**Data Drift**: Change in input data distribution compared to training data.

**Model Drift**: Degradation of model performance over time (even without data drift).

**Explainability (XAI)**: Techniques to make AI/ML decision-making transparent and interpretable.

---

## References

1. **FDA (2021)**. "Artificial Intelligence and Machine Learning in Software as a Medical Device."  
   https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device

2. **FDA (2023)**. "Marketing Submission Recommendations for a Predetermined Change Control Plan for Artificial Intelligence/Machine Learning (AI/ML)-Enabled Device Software Functions."  
   https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial

3. **FDA (2022)**. "Clinical Decision Support Software: Guidance for Industry and Food and Drug Administration Staff."  
   https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software

4. **GMLP Consortium (2021)**. "Good Machine Learning Practice for Medical Device Development: Guiding Principles."  
   _npj Digital Medicine_ 4, 65 (2021). https://doi.org/10.1038/s41746-021-00549-2

5. **FDA (Draft)**. "Continuous Improvement and Monitoring of Artificial Intelligence-Enabled Device Software Functions."

---

## Maintenance

**Owner**: Compliance Team  
**Last Updated**: 2025-12-13  
**Next Review**: 2026-12-13 or upon FDA guidance update  
**Status**: Active

**Change History**:
- **2025-12-13**: Initial framework creation
- **TBD**: Update when FDA finalizes continuous learning guidance

---

**Related Frameworks**:
- [IEC 62304 Overview](../iec62304/overview/index.md)
- [EN 18031 Overview](../en18031/overview/index.md)
- [GMLP Overview](../gmlp/overview/index.md)
- [ISO 14971 (Risk Management)](../../docs/compliance/COMPLIANCE_INDEX.md)


