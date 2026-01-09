# Good Machine Learning Practice (GMLP) - Compliance Cards Index

## Framework Overview

**Framework:** Good Machine Learning Practice (GMLP) for Medical Device Development  
**Authority:** FDA, Health Canada, UK MHRA (International Consensus)  
**Document:** Guiding Principles (October 2021)  
**Status:** Active, Pending Source Verification

[See Full Overview](./overview/index.md)

---

## Compliance Cards

### By GMLP Principle

#### Principle 1: Multi-Disciplinary Expertise
- [COMP-GMLP-001: Multi-Disciplinary Expertise](./templates/comp-gmlp-001-multidisciplinary-expertise.md) - **HIGH**

#### Principle 2: Good Software Engineering
- [COMP-GMLP-002: Good Software Engineering & Security Practices](./templates/comp-gmlp-002-software-engineering.md) - **HIGH**

#### Principle 3: Representative Data
- [COMP-GMLP-003: Representative Clinical Datasets](./templates/comp-gmlp-003-representative-datasets.md) - **CRITICAL**

#### Principle 4: Data Independence
- [COMP-GMLP-004: Training/Test Set Independence](./templates/comp-gmlp-004-data-independence.md) - **CRITICAL**

#### Principle 5: Reference Datasets
- [COMP-GMLP-005: Reference Dataset Selection & Quality](./templates/comp-gmlp-005-reference-datasets.md) - **HIGH**

#### Principle 6: Model Design
- [COMP-GMLP-006: Model Design Alignment with Data & Use](./templates/comp-gmlp-006-model-design.md) - **HIGH**

#### Principle 7: Human-AI Team
- [COMP-GMLP-007: Human-AI Team Performance Evaluation](./templates/comp-gmlp-007-human-ai-team.md) - **CRITICAL**

#### Principle 8: Clinically Relevant Testing
- [COMP-GMLP-008: Testing in Clinically Relevant Conditions](./templates/comp-gmlp-008-clinical-testing.md) - **CRITICAL**

#### Principle 9: User Information
- [COMP-GMLP-009: User Information & Transparency](./templates/comp-gmlp-009-user-information.md) - **HIGH**

#### Principle 10: Post-Market Monitoring
- [COMP-GMLP-010: Post-Market Monitoring & Re-Training Management](./templates/comp-gmlp-010-postmarket-monitoring.md) - **CRITICAL**

---

## By Priority

### CRITICAL (5 cards)
- COMP-GMLP-003: Representative Clinical Datasets
- COMP-GMLP-004: Training/Test Set Independence
- COMP-GMLP-007: Human-AI Team Performance
- COMP-GMLP-008: Testing in Clinically Relevant Conditions
- COMP-GMLP-010: Post-Market Monitoring & Re-Training

### HIGH (5 cards)
- COMP-GMLP-001: Multi-Disciplinary Expertise
- COMP-GMLP-002: Good Software Engineering
- COMP-GMLP-005: Reference Dataset Selection
- COMP-GMLP-006: Model Design Alignment
- COMP-GMLP-009: User Information & Transparency

---

## By Lifecycle Phase

### Planning & Design
- COMP-GMLP-001: Multi-Disciplinary Expertise
- COMP-GMLP-006: Model Design Alignment

### Data Management
- COMP-GMLP-003: Representative Datasets
- COMP-GMLP-004: Training/Test Set Independence
- COMP-GMLP-005: Reference Dataset Selection

### Development
- COMP-GMLP-002: Good Software Engineering
- COMP-GMLP-006: Model Design Alignment

### Validation
- COMP-GMLP-007: Human-AI Team Performance
- COMP-GMLP-008: Testing in Clinically Relevant Conditions

### Deployment & Operations
- COMP-GMLP-009: User Information & Transparency
- COMP-GMLP-010: Post-Market Monitoring

---

## Integration with Other Frameworks

### FDA AI/ML Framework
- GMLP provides guiding principles
- FDA AI/ML cards implement specific requirements
- High overlap and mutual reinforcement

### IEC 62304 (Medical Device Software)
- GMLP Principle 2 aligns with IEC 62304 software lifecycle
- GMLP Principles 8, 10 extend IEC 62304 validation and maintenance

### EN 18031 (AI Trustworthiness)
- GMLP focuses on medical device ML
- EN 18031 provides broader AI governance framework
- Complementary requirements

### ISO 13485 (Quality Management)
- GMLP integrates with QMS requirements
- Design controls apply to ML models
- Risk management (ISO 14971) spans both

---

## Quick Reference

### For Medical Device Manufacturers

**Starting a New AI/ML Medical Device Project?**
1. Form multi-disciplinary team (COMP-GMLP-001)
2. Define clinical objectives (FDA-ML-002)
3. Ensure representative data collection (COMP-GMLP-003, FDA-ML-004)
4. Implement data segregation (COMP-GMLP-004)
5. Select reference datasets (COMP-GMLP-005)
6. Design model aligned with data/use (COMP-GMLP-006)
7. Apply software engineering best practices (COMP-GMLP-002)
8. Test human-AI team performance (COMP-GMLP-007)
9. Validate in clinically relevant conditions (COMP-GMLP-008)
10. Provide transparent user information (COMP-GMLP-009)
11. Establish post-market monitoring (COMP-GMLP-010)

**Preparing for Regulatory Submission?**
- Review all 10 GMLP cards
- Document evidence for each principle
- Prepare pre-submission meeting materials
- Address FDA pre-submission feedback

**Post-Market Surveillance?**
- Focus on COMP-GMLP-010
- Implement performance monitoring (FDA-ML-006)
- Manage model updates (FDA guidance on PCCP)

### For Regulatory Reviewers

**Evaluating AI/ML Medical Device Submission?**
- Use GMLP principles as evaluation criteria
- Check for evidence of each principle
- Assess lifecycle integration
- Review post-market monitoring plan

---

## Status

- **Total Cards:** 10
- **Status:** All cards pending source verification
- **Priority Breakdown:**
  - CRITICAL: 5 cards
  - HIGH: 5 cards
- **Last Updated:** 2025-12-13

---

## References

- [GMLP Framework Overview](./overview/index.md)
- [FDA AI/ML Framework](../fda-aiml/INDEX.md)
- [IEC 62304 Framework](../iec62304/INDEX.md)
- [Main Compliance Index](../../COMPLIANCE_INDEX.md)

---

## Notes

- **All cards pending verification:** Reference Manager will be used to fetch and verify authoritative sources
- **Deferred Implementation:** Cards 001-010 will be generated after Reference Manager documentation is complete
- **Integration:** GMLP principles are foundational; FDA AI/ML cards provide detailed implementation guidance



