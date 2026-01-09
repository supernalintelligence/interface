---
id: comp-iec62304-001-software-safety-classification
title: COMP-IEC62304-001 - Software Safety Classification
sidebar_label: COMP-IEC62304-001
sidebar_position: 1
status: pending-verification
references: []
---

# COMP-IEC62304-001: Software Safety Classification

## Overview

**Purpose**: Classify medical device software by safety class (A, B, or C) based on potential harm  
**IEC 62304 Section**: §4.3 - Software safety classification  
**Category**: software-lifecycle, classification  
**Priority**: CRITICAL  
**Framework**: IEC 62304:2006+AMD1:2015

## Description

Software safety classification is the foundation of IEC 62304 compliance, determining the rigor of documentation and testing requirements for medical device software. Classification is based on the potential for software failure to result in harm to patients, users, or others.

The standard defines three safety classes:
- **Class A**: No injury or damage to health is possible from software failure
- **Class B**: Non-serious injury is possible from software failure  
- **Class C**: Death or serious injury is possible from software failure

Classification integrates directly with ISO 14971 risk management. Each software item is assigned a safety class based on hazard analysis results. When a software system contains multiple software items with different classifications, the system's overall classification is determined by the highest class of any individual item. This ensures that appropriate controls are applied throughout the system.

For AI/ML medical devices, classification considers both traditional software failure modes and ML-specific risks such as model misclassification, data quality issues, and performance degradation. ML models that influence clinical decisions typically require Class C classification due to the severity of potential harm from incorrect outputs.

## Regulatory Context

### IEC 62304 Requirements
- **§4.3**: Software safety classification process and criteria
- **§5**: Software development process (requirements vary by class)
- **§7**: Risk management activities (ISO 14971 integration)
- **Annex B**: Guidance on determining software safety class

### FDA Recognition
- FDA recognizes IEC 62304 as a consensus standard
- Software classification affects premarket submission requirements
- Class C software requires most rigorous validation evidence
- FDA CDRH Software Guidance references IEC 62304 classification

### EU MDR
- IEC 62304 is harmonized standard under EU MDR 2017/745
- Software classification links to device risk classification
- Class III medical devices typically require Class C software
- Essential Requirements (Annex I) reference software safety

### ISO 14971 Integration
- Software classification based on hazard analysis results
- Severity assessment determines software class
- Risk control measures may affect classification
- Residual risk evaluation considers software class

## Acceptance Criteria

```gherkin
Feature: Software Safety Classification
  As a Medical Device Regulatory Affairs Specialist
  I want to classify medical device software by safety class
  So that I can determine appropriate IEC 62304 documentation and testing requirements

  Background:
    Given medical device software is under development
    And IEC 62304:2006+AMD1:2015 compliance is required
    And ISO 14971 risk management process is established
    And hazard analysis has been performed for the device
    And software architecture defines software items

  Scenario: Class C - Death or Serious Injury Possible
    Given software item "InsulinDosageCalculator" performs dose calculations
    And hazard analysis identifies hazard "Incorrect insulin dose calculation"
    And hazard severity is assessed as "Death" (insulin overdose/underdose)
    And probability of harm occurrence is "Medium" (calculation errors possible)
    And no risk control measures fully eliminate software contribution to hazard
    When software safety classification is performed per IEC 62304 §4.3
    Then software item shall be classified as Class C
    And classification rationale shall document hazard-severity linkage
    And full IEC 62304 development process shall be required
    And Class C testing rigor shall apply (unit, integration, system)
    And classification decision shall be approved by quality management
    And classification shall be traceable to ISO 14971 risk file

  Scenario: Class B - Non-Serious Injury Possible
    Given software item "BloodPressureDataLogger" records BP measurements
    And hazard analysis identifies hazard "Data logging failure"
    And hazard severity is "Non-serious injury" (delayed diagnosis possible)
    And probability is "Low" (redundant storage, error detection present)
    When software safety classification is performed
    Then software item shall be classified as Class B
    And moderate IEC 62304 documentation shall be required
    And integration testing shall be mandatory
    And system testing shall verify all requirements
    And classification shall consider risk control measures

  Scenario: Class A - No Injury Possible
    Given software item "UIThemeManager" controls visual appearance only
    And hazard analysis reviews all potential software failure modes
    And no hazard scenarios result in injury (cosmetic changes only)
    And software does not process clinical data or control device functions
    When software safety classification is performed
    Then software item shall be classified as Class A
    And reduced IEC 62304 documentation shall be acceptable
    And simplified testing approach shall be sufficient
    And classification shall document "no injury" rationale

  Scenario: System Classification - Highest Class Wins
    Given software system "DiabetesManagementApp" has multiple items
    And software item "DataDisplay" is classified as Class A
    And software item "DataLogger" is classified as Class B  
    And software item "DoseCalculator" is classified as Class C
    And software item "UIControls" is classified as Class A
    When system-level classification is determined per IEC 62304 §4.3
    Then system shall be assigned classification Class C
    And Class C requirements shall apply to entire system development
    And rationale shall state "system contains Class C items"
    And all software items shall be developed under Class C process

  Scenario: Classification Change Due to Risk Analysis Update
    Given software item "ReportGenerator" was initially Class A
    And initial hazard analysis found no injury scenarios
    And new hazard "Incorrect report affects treatment decision" is identified
    And hazard severity is re-assessed as "Serious injury"
    And updated risk analysis shows non-serious injury is possible
    When classification re-evaluation is triggered per change control
    Then software item shall be reclassified from Class A to Class B
    And affected documentation shall be updated to Class B requirements
    And additional testing shall be planned and executed
    And change shall follow IEC 62304 §6 maintenance process
    And reclassification shall be approved by quality management
    And impact on development timeline shall be assessed

  Scenario: ML Model Classification - Diagnostic AI
    Given ML model "ChestXRayDiagnostic" classifies chest X-rays
    And model output influences physician diagnosis decisions
    And hazard analysis identifies "Misclassification (false negative)"
    And severity is "Serious injury or death" (missed critical finding)
    And probability is "Medium" (model accuracy 92%, false negatives occur)
    When ML model classification is performed
    Then ML model shall be classified as Class C software item
    And model architecture shall be documented per §5.3
    And training data shall be managed as configuration item per §8
    And model validation shall meet Class C requirements
    And classification shall account for ML-specific failure modes

  Scenario: ML Model Classification - Wellness App
    Given ML model "FitnessActivityPredictor" suggests exercises
    And model output does not influence medical treatment
    And hazard analysis finds no injury scenarios (wellness use only)
    And incorrect predictions do not affect health decisions
    When ML model classification is performed
    Then ML model may be classified as Class A or non-device
    And FDA/MDR pre-market review may not be required
    And documentation may follow reduced requirements
    And classification shall consider intended use and user population

  Scenario: Classification Documentation and Traceability
    Given software item "VentilatorController" is classified as Class C
    When classification documentation is prepared
    Then Software Safety Classification Report shall be created
    And report shall include software item identification and version
    And report shall reference ISO 14971 hazard analysis (specific hazard IDs)
    And report shall document severity assessment with rationale
    And report shall state assigned class (A/B/C) with justification
    And report shall identify applicable IEC 62304 requirements
    And report shall be approved by regulatory affairs and quality assurance
    And traceability matrix shall link classification to hazards and requirements
```

## Technical Implementation

### Classification Process Workflow

```yaml
software_safety_classification_process:
  step_1_identify_software_items:
    description: "Identify all software items in system architecture"
    inputs:
      - software_architecture_document
      - system_design_specification
    outputs:
      - list_of_software_items_with_descriptions
    activities:
      - review_architecture_diagrams
      - identify_discrete_software_components
      - define_software_item_boundaries_and_interfaces
    
  step_2_perform_hazard_analysis:
    description: "Analyze each software item for potential hazards per ISO 14971"
    inputs:
      - list_of_software_items
      - device_hazard_analysis (ISO 14971)
      - clinical_workflow_analysis
    outputs:
      - hazards_per_software_item
      - severity_assessments
      - probability_estimates
    activities:
      - identify_software_failure_modes
      - assess_clinical_consequences
      - evaluate_severity_per_ISO_14971
      - estimate_occurrence_probability
      - document_hazard_scenarios
      
  step_3_assign_safety_class:
    description: "Assign class based on severity of worst-case hazard"
    classification_rules:
      - if: "any_hazard_severity == 'death_or_serious_injury'"
        then: "assign_class_c"
      - if: "any_hazard_severity == 'non_serious_injury' AND no_class_c_hazards"
        then: "assign_class_b"
      - if: "all_hazards_severity == 'no_injury'"
        then: "assign_class_a"
    considerations:
      - consider_all_identified_hazards
      - use_worst_case_severity
      - account_for_risk_control_measures
      - document_rationale_for_assignment
      
  step_4_document_classification:
    description: "Create Software Safety Classification Report"
    required_content:
      - software_item_name_and_identifier
      - software_item_version
      - hazard_analysis_reference (ISO 14971 file section)
      - severity_assessment_summary
      - assigned_safety_class (A/B/C)
      - classification_rationale
      - applicable_IEC_62304_requirements
      - approver_name_title_signature_date
    traceability:
      - link_to_risk_management_file
      - link_to_software_architecture
      - link_to_requirements_specification
      
  step_5_determine_system_classification:
    description: "System class = MAX(item classes)"
    rule: |
      IF system contains ANY Class C item THEN system_class = C
      ELSE IF system contains ANY Class B item THEN system_class = B  
      ELSE system_class = A
    rationale: "Ensures appropriate rigor for highest-risk components"
```

### Classification Decision Matrix

```yaml
classification_examples:
  # Software Item → Failure Mode → Hazard → Severity → Class
  
  example_1_insulin_pump:
    software_item: "Dose Calculation Algorithm"
    failure_mode: "Incorrect calculation due to algorithm error"
    hazard: "Insulin overdose or underdose"
    severity: "Death (overdose) or Serious Injury (underdose)"
    class: C
    rationale: "Calculation directly affects insulin delivery; errors life-threatening"
    
  example_2_blood_pressure_monitor:
    software_item: "Measurement Data Logger"
    failure_mode: "Data not logged or logged incorrectly"
    hazard: "Delayed diagnosis due to missing data"
    severity: "Non-serious injury (temporary delay in treatment adjustment)"
    class: B
    rationale: "Data loss may delay treatment but unlikely to cause serious harm"
    
  example_3_fitness_app:
    software_item: "Exercise Recommendation Engine"
    failure_mode: "Incorrect exercise suggestion"
    hazard: "User performs unsuitable exercise"
    severity: "No injury (wellness context, user discretion)"
    class: A_or_non_device
    rationale: "Wellness application, no medical decision-making"
    
  example_4_radiology_ai:
    software_item: "Chest X-Ray Classification Model"
    failure_mode: "False negative (misses pneumothorax)"
    hazard: "Delayed treatment of life-threatening condition"
    severity: "Death or serious injury"
    class: C
    rationale: "Diagnostic AI output influences critical medical decisions"
    
  example_5_ecg_display:
    software_item: "ECG Waveform Display Renderer"
    failure_mode: "Display artifact or distortion"
    hazard: "Physician misreads ECG"
    severity: "Serious injury (misdiagnosis, wrong treatment)"
    class: C
    rationale: "Display integrity critical for diagnosis; errors affect clinical decisions"
    
  example_6_patient_portal:
    software_item: "Appointment Scheduling Module"
    failure_mode: "Scheduling error (wrong time/date)"
    hazard: "Patient misses appointment"
    severity: "No injury (administrative inconvenience)"
    class: A
    rationale: "Scheduling errors do not directly affect medical treatment"
```

### ML-Specific Classification Guidance

```yaml
ml_model_classification_considerations:
  treat_model_as_software_item:
    - ML model is a software item per IEC 62304 §5.1
    - Model architecture = software architecture
    - Model weights/parameters = software code
    - Training process = software implementation
    
  ml_failure_modes_to_consider:
    - misclassification (false positives, false negatives)
    - out_of_distribution_inputs (model confidence collapse)
    - adversarial_inputs (intentional manipulation)
    - data_quality_degradation (distribution shift)
    - model_drift (performance decay over time)
    
  severity_assessment_factors:
    clinical_indication:
      - diagnostic_ai: "Affects diagnosis → high severity"
      - treatment_recommendation: "Affects treatment → high severity"
      - monitoring_ai: "Affects ongoing care → medium severity"
      - wellness_ai: "No medical decision → low/no severity"
      
    error_type_consequences:
      - false_negative: "May delay treatment (high severity)"
      - false_positive: "May lead to unnecessary procedures (medium severity)"
      - confidence_mis_calibration: "Affects physician trust (variable severity)"
      
    human_oversight:
      - physician_review_required: "Severity may be reduced (Class B vs C)"
      - automated_action: "Severity typically higher (Class C)"
      - patient_facing: "Consider patient safety and behavior"
    
  typical_ml_classifications:
    class_c_examples:
      - diagnostic_ai_high_risk: "Cancer detection, stroke identification"
      - treatment_ai: "Radiation therapy planning, drug dosing"
      - automated_diagnosis: "No physician review required"
      
    class_b_examples:
      - diagnostic_ai_low_risk: "Skin lesion triage (physician confirms)"
      - monitoring_ai: "Vital sign trend detection (alerts only)"
      - decision_support: "Recommendations reviewed by clinician"
      
    class_a_examples:
      - wellness_ml: "Fitness tracking, sleep analysis"
      - administrative_ml: "Scheduling optimization, resource allocation"
      - non_clinical_predictions: "Patient satisfaction surveys"
```

### Documentation Template

```markdown
# Software Safety Classification Report

## Software Item Identification
- **Software Item Name**: [Name]
- **Software Item ID**: [Unique identifier per configuration management]
- **Version**: [x.y.z]
- **Description**: [Brief functional description]
- **Intended Use**: [Clinical or operational purpose]

## Hazard Analysis Summary (ISO 14971)
| Hazard ID | Hazard Description | Failure Mode | Severity | Occurrence | Risk Level | Risk Controls |
|-----------|-------------------|--------------|----------|------------|------------|---------------|
| HAZ-001   | [Description]     | [Mode]       | [Class]  | [P1-P5]    | [H/M/L]    | [Controls]    |
| HAZ-002   | [Description]     | [Mode]       | [Class]  | [P1-P5]    | [H/M/L]    | [Controls]    |

## Severity Assessment
- **Worst-Case Hazard**: [Hazard ID and description]
- **Worst-Case Severity**: [Death / Serious Injury / Non-Serious Injury / No Injury]
- **Clinical Scenario**: [Describe how software failure leads to harm]
- **Risk Controls**: [Mitigation measures, residual risk]

## Classification Decision
- **Assigned Safety Class**: [A / B / C]
- **Rationale**: 
  [Detailed explanation of why this class was assigned based on severity assessment,
   considering all hazards, failure modes, and risk controls. Reference specific hazard
   IDs and severity levels. Explain why Class C if applicable (death/serious injury possible),
   Class B (non-serious injury only), or Class A (no injury).]

## Applicable IEC 62304 Requirements
Based on Class [A/B/C] assignment, the following IEC 62304 requirements apply:

### Development Process
- [ ] §5.1 Software Development Planning
- [ ] §5.2 Software Requirements Analysis
- [ ] §5.3 Software Architectural Design
- [ ] §5.4 Software Detailed Design (Class B/C only)
- [ ] §5.5 Software Unit Implementation and Verification (Class B/C)
- [ ] §5.6 Software Integration and Integration Testing (Class B/C)
- [ ] §5.7 Software System Testing (All classes)
- [ ] §5.8 Software Release (All classes)

### Testing Rigor
- **Class A**: System testing required
- **Class B**: Integration and system testing required
- **Class C**: Unit, integration, and system testing required

### Documentation Detail
- **Class A**: Minimal documentation (plans, requirements, test reports)
- **Class B**: Moderate documentation (architecture, test coverage)
- **Class C**: Comprehensive documentation (detailed design, traceability matrix)

## Traceability
- **Risk Management File**: [ISO 14971 file reference, section]
- **Software Architecture**: [Document reference]
- **Requirements Specification**: [Document reference]
- **Change Control**: [If reclassification, reference change request]

## Approval
- **Prepared by**: [Name, Title] | Date: [YYYY-MM-DD]
- **Reviewed by (Engineering)**: [Name, Title] | Date: [YYYY-MM-DD]
- **Reviewed by (Quality Assurance)**: [Name, Title] | Date: [YYYY-MM-DD]
- **Approved by (Regulatory Affairs)**: [Name, Title] | Date: [YYYY-MM-DD]

## Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0     | [Date] | [Name] | Initial classification |
```

## Validation Strategy

### Classification Review Checklist

```yaml
validation_activities:
  documentation_review:
    - [ ] All software items from architecture are classified
    - [ ] Each software item has unique identifier
    - [ ] ISO 14971 hazard analysis covers all software items
    - [ ] Hazard severity assessments documented with clinical rationale
    - [ ] Classification rules (§4.3) correctly applied
    - [ ] Worst-case severity determines class assignment
    - [ ] System classification = MAX(item classifications)
    
  traceability_verification:
    - [ ] Classification traceable to specific hazards in ISO 14971 file
    - [ ] Hazard IDs referenced in classification report
    - [ ] Software item IDs match architecture document
    - [ ] Version control for classification documents
    
  approval_verification:
    - [ ] Classification approved by quality management
    - [ ] Regulatory affairs sign-off obtained
    - [ ] Engineering review completed
    - [ ] Approval dates and signatures recorded
    
  requirements_mapping:
    - [ ] Applicable IEC 62304 sections identified for each class
    - [ ] Development process matches assigned class
    - [ ] Testing rigor appropriate for class
    - [ ] Documentation level appropriate for class
    
  change_control:
    - [ ] Classification changes follow §6 maintenance process
    - [ ] Reclassification triggers re-evaluation of development artifacts
    - [ ] Impact assessment for class changes documented
```

### Audit Evidence

**Required Documentation**:
- Software Architecture Document (list of software items)
- ISO 14971 Risk Management File (hazard analysis with severities)
- Software Safety Classification Report (per software item)
- Approval records (QA, RA signatures)
- Traceability matrix (items ↔ hazards ↔ requirements ↔ tests)

**Verification Activities**:
- Design review of classification decisions
- Audit of classification against hazard analysis
- Verification that IEC 62304 process matches assigned class
- Review of classification rationale for clinical accuracy

**Common Audit Findings**:
- ❌ Classification not traceable to specific hazards
- ❌ Class assignment does not match severity (e.g., Class B for death hazard)
- ❌ System classification not highest of item classes
- ❌ No approval signatures or dates
- ❌ Classification not updated after risk analysis changes

## Evidence Requirements

### For Class A Software
- Software Requirements Specification
- Software System Test Plan and Report
- Software Release documentation
- Classification Report with rationale

### For Class B Software (All of Class A plus)
- Software Architectural Design
- Software Integration Test Plan and Report
- Traceability: Requirements → Architecture → Integration Tests → System Tests

### For Class C Software (All of Class A and B plus)
- Software Detailed Design
- Software Unit Test Plan and Report (for each unit)
- Source Code with comments
- Traceability: Requirements → Architecture → Detailed Design → Code → Unit Tests → Integration Tests → System Tests → Risk Controls

### For ML Models (Class C)
- Model Architecture Document (network topology, layers)
- Training Data Management Plan (versioning, quality)
- Model Validation Report (performance, fairness, robustness)
- Training Procedure Documentation
- Model Risk Assessment (failure modes, severity)

## Related Controls

### IEC 62304
- **COMP-IEC62304-002**: Software Development Planning (uses classification to determine plan rigor)
- **COMP-IEC62304-003**: Software Requirements Analysis (traceability from classification)
- **COMP-IEC62304-004**: Software Architectural Design (software items defined here)
- **COMP-IEC62304-009**: Risk Management Integration (classification based on hazards)
- **COMP-IEC62304-013**: ML Model as Software Item (ML-specific classification guidance)

### ISO 14971
- Risk Management File (source of hazard analysis for classification)
- Hazard Analysis (defines severity used for classification)
- Risk Control Measures (may affect classification)

### FDA
- **COMP-FDA-ML-001**: GMLP (Good Machine Learning Practice) - applies to Class B/C ML
- **COMP-FDA-ML-008**: Clinical Validation Studies (required for Class C ML models)

### EU MDR
- Essential Requirements (Annex I, Section 17.2 - Software)
- Classification of medical devices (links to software class)

---

**Last Updated**: 2025-12-13  
**Standard Version**: IEC 62304:2006+AMD1:2015  
**Maintained by**: Supernal Coding Compliance Team

