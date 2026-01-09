# FDA AI/ML Compliance Cards - Index

## Framework Overview

This directory contains compliance cards for FDA AI/ML guidance on medical devices with artificial intelligence and machine learning functions.

**Regulatory Foundation**: FDA Guidance Documents (2021-2023)  
**Scope**: AI/ML-Based Software as a Medical Device (SaMD)  
**Status**: Active (some guidance still in draft)

---

## Quick Navigation

### By Phase

**Phase 1-2: Discovery & Research**
- [COMP-FDA-ML-002](templates/comp-fda-ml-002-clinical-objective-intended-use.md) - Clinical Objective and Intended Use

**Phase 2-3: Research & Design**
- [COMP-FDA-ML-001](templates/comp-fda-ml-001-good-machine-learning-practice.md) - Good Machine Learning Practice (GMLP)
- [COMP-FDA-ML-003](templates/comp-fda-ml-003-data-quality-alcoa.md) - Data Quality (ALCOA+)
- [COMP-FDA-ML-004](templates/comp-fda-ml-004-dataset-relevance.md) - Dataset Relevance
- [COMP-FDA-ML-008](templates/comp-fda-ml-008-samd-pre-specifications.md) - SaMD Pre-Specifications (SPS)

**Phase 7: Build**
- [COMP-FDA-ML-006](templates/comp-fda-ml-006-model-transparency-interpretability.md) - Model Transparency & Interpretability

**Phase 8-9: Integration & Milestone**
- [COMP-FDA-ML-005](templates/comp-fda-ml-005-clinical-validation.md) - Clinical Validation
- [COMP-FDA-ML-010](templates/comp-fda-ml-010-predetermined-change-control-plan.md) - Predetermined Change Control Plan

**Phase 11-12: Production & Operations**
- [COMP-FDA-ML-007](templates/comp-fda-ml-007-real-world-performance-monitoring.md) - Real-World Performance Monitoring
- [COMP-FDA-ML-009](templates/comp-fda-ml-009-algorithm-change-protocol.md) - Algorithm Change Protocol (ACP)

---

## Cards by Category

### GMLP Principles (Core Requirements)

| Card ID | GMLP Principle | Title | Status |
|---------|----------------|-------|--------|
| COMP-FDA-ML-001 | P1-P10 | Good Machine Learning Practice (GMLP) | ✅ Complete |
| COMP-FDA-ML-002 | P1 | Clinical Objective and Intended Use | 📝 Planned |
| COMP-FDA-ML-003 | P2 | AI/ML Data Quality (ALCOA+) | 📝 Planned |
| COMP-FDA-ML-004 | P3 | Dataset Relevance and Representativeness | 📝 Planned |
| COMP-FDA-ML-005 | P8 | Clinical Validation Requirements | 📝 Planned |
| COMP-FDA-ML-006 | P9 | Model Transparency and Interpretability | 📝 Planned |
| COMP-FDA-ML-007 | P10 | Real-World Performance Monitoring | 📝 Planned |

### Predetermined Change Control Plans

| Card ID | Title | Submission Phase | Status |
|---------|-------|------------------|--------|
| COMP-FDA-ML-008 | SaMD Pre-Specifications (SPS) | Pre-market | 📝 Planned |
| COMP-FDA-ML-009 | Algorithm Change Protocol (ACP) | Post-market | 📝 Planned |
| COMP-FDA-ML-010 | Predetermined Change Control Plan Submission | Pre-market | 📝 Planned |

---

## Cards by Audit Criticality

### Critical (Audit Blockers)

These cards are **mandatory** for AI/ML medical devices and will block regulatory approval if not satisfied:

1. **COMP-FDA-ML-001**: Good Machine Learning Practice (GMLP) - Foundation for all AI/ML development
2. **COMP-FDA-ML-002**: Clinical Objective and Intended Use - Defines device purpose and scope
3. **COMP-FDA-ML-005**: Clinical Validation - Demonstrates clinical utility and safety

### High Priority (Audit Findings)

Non-compliance will result in FDA 483 observations or Warning Letters:

4. **COMP-FDA-ML-003**: Data Quality (ALCOA+) - Training data integrity
5. **COMP-FDA-ML-004**: Dataset Relevance - Training data representativeness
6. **COMP-FDA-ML-006**: Model Transparency - Explainability for clinicians
7. **COMP-FDA-ML-007**: Real-World Performance - Post-market surveillance

### Medium Priority (Post-Market Performance)

Required for continuous improvement and predetermined change control:

8. **COMP-FDA-ML-008**: SaMD Pre-Specifications (SPS) - Planned algorithm changes
9. **COMP-FDA-ML-009**: Algorithm Change Protocol (ACP) - Change implementation procedures
10. **COMP-FDA-ML-010**: Predetermined Change Control Plan - Pre-market approval for post-market changes

---

## Implementation Roadmap

### Stage 1: Foundation (Phases 1-3)

**Objective**: Establish AI/ML development framework

**Cards to Implement**:
1. COMP-FDA-ML-001 (GMLP) - Establish guiding principles
2. COMP-FDA-ML-002 (Clinical Objective) - Define intended use
3. COMP-FDA-ML-003 (Data Quality) - Set data quality requirements

**Deliverables**:
- GMLP adherence documentation
- Clinical objective statement
- Data quality assurance plan

**Timeline**: Weeks 1-4

---

### Stage 2: Development (Phases 4-7)

**Objective**: Build and train AI/ML models

**Cards to Implement**:
4. COMP-FDA-ML-004 (Dataset Relevance) - Validate training data
5. COMP-FDA-ML-006 (Model Transparency) - Implement explainability

**Deliverables**:
- Training dataset documentation
- Model architecture documentation
- Explainability (XAI) implementation

**Timeline**: Weeks 5-12

---

### Stage 3: Validation (Phases 8-9)

**Objective**: Demonstrate clinical utility and prepare submission

**Cards to Implement**:
6. COMP-FDA-ML-005 (Clinical Validation) - Conduct clinical studies
7. COMP-FDA-ML-010 (Predetermined Change Control) - Prepare submission

**Deliverables**:
- Clinical validation report
- 510(k)/De Novo/PMA submission package
- Predetermined Change Control Plan (if applicable)

**Timeline**: Weeks 13-20

---

### Stage 4: Post-Market (Phases 11-12)

**Objective**: Monitor real-world performance and manage changes

**Cards to Implement**:
8. COMP-FDA-ML-007 (Real-World Performance) - Deploy monitoring
9. COMP-FDA-ML-009 (Algorithm Change Protocol) - Implement change procedures

**Deliverables**:
- Real-world performance monitoring system
- Algorithm change log
- Post-market surveillance reports

**Timeline**: Ongoing

---

## Related Frameworks

### IEC 62304 Integration

FDA AI/ML guidance complements IEC 62304 software lifecycle requirements:

| FDA AI/ML Card | IEC 62304 Card | Integration Point |
|----------------|----------------|-------------------|
| COMP-FDA-ML-001 (GMLP) | COMP-IEC62304-002 (Development Planning) | GMLP principles inform development plan |
| COMP-FDA-ML-002 (Clinical Objective) | COMP-IEC62304-003 (Requirements) | Clinical objective drives software requirements |
| COMP-FDA-ML-005 (Clinical Validation) | COMP-IEC62304-012 (Software Validation) | Clinical validation is part of validation |
| COMP-FDA-ML-009 (ACP) | COMP-IEC62304-014 (Change Control) | ACP implements change control for ML |

### EN 18031 Integration

FDA AI/ML aligns with EN 18031 trustworthiness requirements:

| FDA AI/ML Card | EN 18031 Card | Integration Point |
|----------------|---------------|-------------------|
| COMP-FDA-ML-003 (Data Quality) | COMP-EN18031-009 (Data Quality) | ALCOA+ aligns with data quality |
| COMP-FDA-ML-004 (Dataset Relevance) | COMP-EN18031-041 (Performance Testing) | Dataset relevance ensures performance |
| COMP-FDA-ML-006 (Model Transparency) | COMP-EN18031-020 (Explainability) | XAI techniques overlap |
| COMP-FDA-ML-007 (Real-World Performance) | COMP-EN18031-023 (Model Drift) | Performance monitoring includes drift detection |

---

## Regulatory Submission Checklist

### 510(k) Submission with AI/ML

**Required Documentation**:
- [ ] Device description with AI/ML algorithm type
- [ ] Training dataset description (COMP-FDA-ML-004)
- [ ] Performance evaluation report (COMP-FDA-ML-005)
- [ ] Clinical validation evidence (COMP-FDA-ML-005)
- [ ] Risk analysis with AI/ML hazards (ISO 14971)
- [ ] Labeling (indications, limitations, user qualifications)
- [ ] GMLP adherence statement (COMP-FDA-ML-001)
- [ ] Predetermined Change Control Plan (if applicable, COMP-FDA-ML-010)

### De Novo Submission with AI/ML

**Additional Requirements** (beyond 510(k)):
- [ ] Special controls for AI/ML
- [ ] Clinical data (often required for novel AI/ML)
- [ ] Post-market surveillance plan (COMP-FDA-ML-007)

### PMA Submission with AI/ML

**Most Rigorous Requirements**:
- [ ] Pivotal clinical trials
- [ ] Manufacturing and quality system (ISO 13485)
- [ ] Post-approval studies (COMP-FDA-ML-007)
- [ ] Annual reports

---

## Frequently Asked Questions

### Q1: Do I need a Predetermined Change Control Plan?

**Answer**: Not always. You need it if:
- Your AI/ML algorithm will be updated post-market
- Updates are based on real-world data (continuous learning)
- You want to avoid new FDA submissions for planned changes

If you have a locked algorithm that never updates, you don't need a Predetermined Change Control Plan.

### Q2: What are the 10 GMLP principles?

**Answer**: See [COMP-FDA-ML-001](templates/comp-fda-ml-001-good-machine-learning-practice.md) for full details. Summary:
1. Clinical objective definition
2. Data quality
3. Dataset relevance
4. Feature engineering
5. Model selection
6. Training strategy
7. Performance evaluation
8. Clinical validation
9. Interpretability
10. Real-world monitoring

### Q3: How do I demonstrate "clinical validation"?

**Answer**: See [COMP-FDA-ML-005](templates/comp-fda-ml-005-clinical-validation.md). Options:
- **Clinical studies**: Prospective or retrospective studies with real patients
- **Real-world evidence**: Post-market surveillance data
- **Simulation studies**: Clinical simulation with validated datasets
- **User studies**: Clinician user acceptance testing

The rigor depends on device risk classification.

### Q4: What is "data drift" vs. "model drift"?

**Answer**:
- **Data drift**: Real-world input data distribution changes compared to training data (e.g., new patient demographics)
- **Model drift**: Model performance degrades over time (e.g., accuracy decreases)

Data drift can cause model drift, but not always. See [COMP-FDA-ML-007](templates/comp-fda-ml-007-real-world-performance-monitoring.md).

### Q5: Do I need explainable AI (XAI)?

**Answer**: FDA recommends transparency and interpretability ([COMP-FDA-ML-006](templates/comp-fda-ml-006-model-transparency-interpretability.md)). The level depends on:
- **Device risk**: Higher risk → more explainability required
- **Clinical use**: If clinicians need to understand decisions, XAI is critical
- **Regulatory submission**: FDA often asks for explanation of model decisions

Black-box models (deep neural networks) may need XAI techniques (SHAP, LIME, attention maps).

---

## Contact & Support

**Framework Maintainer**: Compliance Team  
**Last Updated**: 2025-12-13  
**Next Review**: 2026-12-13 or upon FDA guidance update

**Report Issues**: Create issue in compliance-cards repository  
**Request New Cards**: Contact Regulatory Affairs team

---

**Status Legend**:
- ✅ Complete: Card is fully implemented and reviewed
- 🚧 In Progress: Card is being developed
- 📝 Planned: Card is planned but not started
- ⚠️ Under Review: Card is awaiting regulatory review
- 🔄 Updating: Card is being updated for new guidance


