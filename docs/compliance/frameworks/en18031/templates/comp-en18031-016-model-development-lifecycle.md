---
title: COMP-EN18031-016: Model Development Lifecycle
type: documentation
created: 2025-12-17
updated: 2025-12-17
---

# COMP-EN18031-016: Model Development Lifecycle

---
id: comp-en18031-016-model-development-lifecycle
title: COMP-EN18031-016 - Model Development Lifecycle
framework: en18031
category: Model Development
priority: critical
status: pending-verification
references: []
relatedControls:
  - comp-iso13485-005-design-planning
  - comp-iso13485-010-design-controls
  - comp-iec62304-002-software-development-planning
  - comp-fda-002-software-development-lifecycle
  - comp-iso27001-084-secure-development-life-cycle
linkedRequirements: []
---

## Overview

**Purpose**: Establish a structured, traceable, and compliant lifecycle for AI/ML model development from conception to deployment, ensuring quality, safety, and regulatory compliance.

**Scope**: Covers model ideation, requirements definition, architecture design, implementation, validation, deployment planning, and lifecycle management for AI systems.

**Regulatory Context**:
- EN 18031 §6.2: Model Development Process
- IEC 62304: Medical device software lifecycle
- ISO 13485 §7.3: Design and development
- FDA Guidance on Software Development Lifecycle
- ISO/IEC 42001: AI Management System
- ISO/IEC 24028: AI trustworthiness

## Acceptance Criteria

```gherkin
Feature: AI Model Development Lifecycle
  As an AI Engineering Lead
  I need a structured development lifecycle for AI models
  So that models are developed consistently, safely, and in compliance with regulations

  Background:
    Given an organization developing AI models
    And regulatory requirements apply (FDA, EN 18031, ISO 13485)
    And quality management system is in place

  Scenario: Model Ideation and Feasibility Assessment
    Given a business need or clinical problem identified
    When initiating model development
    Then use case SHALL be documented with success criteria
    And feasibility study SHALL assess technical viability
    And data availability SHALL be verified
    And regulatory pathway SHALL be determined
    And risk classification SHALL be assigned
    And stakeholder sign-off SHALL be obtained
    
    Feasibility Checklist:
      | Assessment Area | Required Documentation |
      | Problem definition | Use case document |
      | Data availability | Data inventory report |
      | Technical feasibility | Proof of concept |
      | Regulatory classification | Risk assessment |
      | Resource requirements | Project plan |
      | Success metrics | KPI definition |

  Scenario: Requirements Definition (SDLC Phase 1)
    Given an approved model development project
    When defining requirements
    Then functional requirements SHALL be specified
    And performance requirements SHALL be quantified
    And safety requirements SHALL be defined
    And data requirements SHALL be documented
    And interface requirements SHALL be specified
    And regulatory requirements SHALL be mapped
    And requirements SHALL be traceable to tests
    
    Examples: Medical AI Requirements
      | Requirement Type | Example | Acceptance Criteria |
      | Functional | Detect diabetic retinopathy | Classify fundus images into 5 DR levels |
      | Performance | Sensitivity ≥ 90% | AUC ≥ 0.95 on validation set |
      | Safety | No false negatives on severe cases | 100% recall for proliferative DR |
      | Data | Training dataset size | ≥ 10,000 labeled images |
      | Interface | Input format | DICOM images, 224x224 RGB |
      | Regulatory | FDA Class II device | Meets 510(k) substantial equivalence |

  Scenario: Architecture Design (SDLC Phase 2)
    Given approved requirements specification
    When designing model architecture
    Then model type SHALL be justified (CNN, Transformer, etc.)
    And architecture diagram SHALL be created
    And data flow SHALL be documented
    And component interfaces SHALL be specified
    And technology stack SHALL be selected and documented
    And design review SHALL be conducted with stakeholders
    And design SHALL be approved before implementation
    
    Design Artifacts:
      | Artifact | Purpose | Reviewers |
      | Architecture diagram | High-level design | Technical lead, QA |
      | Data pipeline design | ETL and preprocessing | Data engineering |
      | Model card (initial) | Model documentation | All stakeholders |
      | Interface specs | API contracts | Integration team |
      | Security design | Threat model | Security team |

  Scenario: Implementation with Version Control (SDLC Phase 3)
    Given approved design specification
    When implementing the model
    Then code SHALL be version-controlled (Git)
    And coding standards SHALL be followed
    And code reviews SHALL be conducted
    And unit tests SHALL be written (coverage ≥ 80%)
    And documentation SHALL be maintained
    And experiment tracking SHALL be enabled (MLflow, Weights & Biases)
    And model checkpoints SHALL be versioned
    
    Implementation Standards:
      | Standard | Tool/Practice | Verification |
      | Version control | Git + GitHub/GitLab | Commit history |
      | Code quality | Linters (pylint, black) | CI/CD checks |
      | Testing | pytest, unittest | Coverage report |
      | Documentation | Docstrings, README | Doc review |
      | Experiment tracking | MLflow, W&B | Experiment logs |
      | Model versioning | DVC, MLflow Model Registry | Model registry |

  Scenario: Training and Hyperparameter Tuning
    Given implemented model code
    When training the model
    Then training dataset SHALL be versioned
    And hyperparameters SHALL be tracked
    And training metrics SHALL be logged
    And model artifacts SHALL be versioned
    And training SHALL be reproducible (seed, environment)
    And resource usage SHALL be monitored
    And early stopping criteria SHALL be defined
    
    Examples: Hyperparameter Tracking
      | Experiment ID | Learning Rate | Batch Size | Epochs | Validation AUC | Best Model |
      | exp-001 | 0.001 | 32 | 50 | 0.92 | No |
      | exp-002 | 0.0005 | 64 | 100 | 0.95 | Yes |
      | exp-003 | 0.0001 | 128 | 150 | 0.94 | No |

  Scenario: Model Validation and Testing (SDLC Phase 4)
    Given a trained model
    When validating performance
    Then validation SHALL use held-out data (never seen during training)
    And performance metrics SHALL meet requirements
    And fairness metrics SHALL be evaluated
    And robustness SHALL be tested (adversarial examples)
    And edge cases SHALL be identified and tested
    And validation report SHALL be generated
    And validation SHALL be peer-reviewed
    
    Validation Test Suite:
      | Test Category | Tests | Pass Criteria |
      | Performance | AUC, F1, Sensitivity, Specificity | Meet requirements |
      | Fairness | Demographic parity, EOD | Δ < 5% across groups |
      | Robustness | Adversarial attacks | <1% performance drop |
      | Safety | Clinical edge cases | 100% recall on critical cases |
      | Calibration | Reliability diagram | ECE < 0.05 |

  Scenario: Documentation and Model Card Creation
    Given a validated model
    When preparing for deployment
    Then model card SHALL be completed (includes all metadata)
    And training data description SHALL be documented
    And performance metrics SHALL be reported (by subgroup)
    And limitations SHALL be explicitly stated
    And intended use SHALL be clearly defined
    And ethical considerations SHALL be documented
    And model card SHALL be versioned with model
    
    Model Card Sections (per Mitchell et al.):
      | Section | Required Content |
      | Model Details | Architecture, version, date |
      | Intended Use | Use cases, users, out-of-scope uses |
      | Factors | Demographic factors, evaluation factors |
      | Metrics | Performance metrics, decision thresholds |
      | Training Data | Dataset description, preprocessing |
      | Evaluation Data | Test set characteristics |
      | Quantitative Analysis | Performance by subgroup |
      | Ethical Considerations | Biases, fairness, privacy |
      | Caveats and Recommendations | Limitations, monitoring needs |

  Scenario: Deployment Planning and Approval (SDLC Phase 5)
    Given validated model and complete documentation
    When planning deployment
    Then deployment strategy SHALL be defined (canary, blue-green)
    And rollback plan SHALL be documented
    And monitoring plan SHALL be defined
    And deployment approval SHALL be obtained
    And regulatory submission SHALL be completed (if applicable)
    And deployment readiness review SHALL be conducted
    
    Deployment Checklist:
      | Item | Status | Approver |
      | Model validation report | Complete | QA Lead |
      | Model card | Complete | Product Owner |
      | Security review | Complete | CISO |
      | Regulatory submission | Submitted | Regulatory Affairs |
      | Monitoring dashboard | Configured | MLOps Engineer |
      | Rollback procedure | Documented | DevOps Lead |
      | User training | Complete | Training Team |

  Scenario: Post-Deployment Monitoring and Maintenance (SDLC Phase 6)
    Given a deployed model in production
    When model is operational
    Then performance SHALL be monitored continuously
    And data drift SHALL be detected
    And prediction quality SHALL be tracked
    And incidents SHALL be logged and reviewed
    And periodic retraining SHALL be scheduled
    And model updates SHALL follow full SDLC
    And monitoring reports SHALL be generated monthly
    
    Monitoring Metrics:
      | Metric | Threshold | Action if Exceeded |
      | Prediction latency | > 200ms | Scale infrastructure |
      | Data drift (KL divergence) | > 0.1 | Trigger retraining |
      | Performance degradation | AUC drop > 2% | Investigate root cause |
      | Prediction distribution shift | > 10% | Review input data |
      | Error rate | > 5% | Incident response |

  Scenario: Change Management for Model Updates
    Given a model requiring updates (bug fix, retraining, architecture change)
    When initiating changes
    Then change request SHALL be documented
    And impact analysis SHALL be performed
    And regulatory impact SHALL be assessed
    And change SHALL follow full SDLC (design → test → deploy)
    And regression testing SHALL be performed
    And change approval SHALL be obtained
    And change SHALL be tracked in change log
    
    Change Types and Requirements:
      | Change Type | SDLC Phases Required | Regulatory Submission |
      | Bug fix (no performance impact) | Implementation, Testing | Not required |
      | Retraining (same architecture) | Implementation, Validation, Deployment | Depends (FDA: maybe) |
      | Architecture change | All phases (Requirements → Deployment) | Required |
      | New feature addition | Requirements, Design, Implementation, Validation | Required |

  Scenario: Traceability Throughout Lifecycle
    Given model development in progress
    When progressing through SDLC phases
    Then requirements SHALL be traceable to design
    And design SHALL be traceable to code
    And code SHALL be traceable to tests
    And tests SHALL be traceable to validation
    And validation SHALL be traceable to deployment
    And traceability matrix SHALL be maintained
    
    Traceability Matrix Example:
      | Requirement ID | Design Spec | Code Module | Unit Test | Validation Test | Deployment Config |
      | REQ-001 | DESIGN-001 | model.py:classify() | test_classify.py | VAL-001 | deployment.yaml |
      | REQ-002 | DESIGN-002 | preprocessing.py | test_preproc.py | VAL-002 | deployment.yaml |
```

## Technical Context

### SDLC Framework Implementation

**1. MLOps Pipeline for Lifecycle Management**

```python
# ML Development Lifecycle Manager
from dataclasses import dataclass, field
from typing import List, Dict, Optional
from enum import Enum
from datetime import datetime
import yaml

class LifecyclePhase(Enum):
    IDEATION = "Ideation"
    REQUIREMENTS = "Requirements Definition"
    DESIGN = "Architecture Design"
    IMPLEMENTATION = "Implementation"
    VALIDATION = "Validation and Testing"
    DEPLOYMENT = "Deployment Planning"
    MAINTENANCE = "Post-Deployment Maintenance"

class RequirementType(Enum):
    FUNCTIONAL = "Functional"
    PERFORMANCE = "Performance"
    SAFETY = "Safety"
    DATA = "Data"
    INTERFACE = "Interface"
    REGULATORY = "Regulatory"

@dataclass
class Requirement:
    id: str
    type: RequirementType
    description: str
    acceptance_criteria: str
    priority: str  # Critical, High, Medium, Low
    status: str  # Draft, Approved, Implemented, Verified
    tests: List[str] = field(default_factory=list)
    design_refs: List[str] = field(default_factory=list)

@dataclass
class DesignSpec:
    id: str
    name: str
    description: str
    architecture_diagram: str
    requirements: List[str]  # Requirement IDs
    code_modules: List[str] = field(default_factory=list)
    review_status: str = "Pending"  # Pending, Approved, Rejected
    reviewers: List[str] = field(default_factory=list)

@dataclass
class ValidationResult:
    test_id: str
    test_name: str
    requirement_ids: List[str]
    pass_fail: str
    metrics: Dict[str, float]
    timestamp: datetime
    notes: str = ""

class ModelLifecycleManager:
    def __init__(self, model_name: str, project_dir: str):
        self.model_name = model_name
        self.project_dir = project_dir
        self.current_phase = LifecyclePhase.IDEATION
        self.requirements: List[Requirement] = []
        self.design_specs: List[DesignSpec] = []
        self.validation_results: List[ValidationResult] = []
        self.traceability_matrix: Dict = {}
    
    def add_requirement(self, requirement: Requirement):
        """Add requirement and update traceability"""
        self.requirements.append(requirement)
        self.traceability_matrix[requirement.id] = {
            'type': requirement.type.value,
            'description': requirement.description,
            'design_refs': [],
            'code_refs': [],
            'test_refs': [],
            'validation_refs': []
        }
        self._save_requirements()
    
    def add_design_spec(self, design: DesignSpec):
        """Link design to requirements"""
        self.design_specs.append(design)
        
        # Update traceability matrix
        for req_id in design.requirements:
            if req_id in self.traceability_matrix:
                self.traceability_matrix[req_id]['design_refs'].append(design.id)
        
        self._save_design_specs()
    
    def add_validation_result(self, result: ValidationResult):
        """Record validation and link to requirements"""
        self.validation_results.append(result)
        
        # Update traceability
        for req_id in result.requirement_ids:
            if req_id in self.traceability_matrix:
                self.traceability_matrix[req_id]['validation_refs'].append(result.test_id)
        
        self._save_validation_results()
    
    def generate_traceability_report(self) -> str:
        """Generate traceability matrix report"""
        report = f"# Traceability Matrix: {self.model_name}\n\n"
        report += f"Generated: {datetime.now().isoformat()}\n\n"
        
        report += "| Requirement ID | Type | Design | Code | Tests | Validation | Status |\n"
        report += "|----------------|------|--------|------|-------|------------|--------|\n"
        
        for req_id, trace in self.traceability_matrix.items():
            req = next((r for r in self.requirements if r.id == req_id), None)
            status = req.status if req else "Unknown"
            
            report += f"| {req_id} | {trace['type']} | "
            report += f"{', '.join(trace['design_refs'])} | "
            report += f"{', '.join(trace['code_refs'])} | "
            report += f"{', '.join(trace['test_refs'])} | "
            report += f"{', '.join(trace['validation_refs'])} | "
            report += f"{status} |\n"
        
        return report
    
    def check_readiness_for_phase(self, phase: LifecyclePhase) -> Dict[str, bool]:
        """Check if ready to progress to next phase"""
        checks = {}
        
        if phase == LifecyclePhase.DESIGN:
            checks['all_requirements_approved'] = all(
                r.status == "Approved" for r in self.requirements
            )
        
        elif phase == LifecyclePhase.IMPLEMENTATION:
            checks['all_designs_approved'] = all(
                d.review_status == "Approved" for d in self.design_specs
            )
        
        elif phase == LifecyclePhase.VALIDATION:
            checks['all_requirements_have_tests'] = all(
                len(r.tests) > 0 for r in self.requirements if r.type != RequirementType.DATA
            )
        
        elif phase == LifecyclePhase.DEPLOYMENT:
            checks['all_validations_passed'] = all(
                v.pass_fail == "Pass" for v in self.validation_results
            )
            checks['model_card_complete'] = self._check_model_card_exists()
        
        return checks
    
    def advance_phase(self, next_phase: LifecyclePhase):
        """Progress to next lifecycle phase"""
        readiness = self.check_readiness_for_phase(next_phase)
        
        if not all(readiness.values()):
            failed_checks = [k for k, v in readiness.items() if not v]
            raise ValueError(f"Cannot advance to {next_phase.value}. Failed checks: {failed_checks}")
        
        self.current_phase = next_phase
        print(f"Advanced to phase: {next_phase.value}")
    
    def _save_requirements(self):
        """Persist requirements to YAML"""
        with open(f"{self.project_dir}/requirements.yaml", 'w') as f:
            yaml.dump([{
                'id': r.id,
                'type': r.type.value,
                'description': r.description,
                'acceptance_criteria': r.acceptance_criteria,
                'priority': r.priority,
                'status': r.status,
                'tests': r.tests
            } for r in self.requirements], f)
    
    def _save_design_specs(self):
        """Persist design specs"""
        with open(f"{self.project_dir}/design_specs.yaml", 'w') as f:
            yaml.dump([{
                'id': d.id,
                'name': d.name,
                'description': d.description,
                'requirements': d.requirements,
                'review_status': d.review_status
            } for d in self.design_specs], f)
    
    def _save_validation_results(self):
        """Persist validation results"""
        with open(f"{self.project_dir}/validation_results.yaml", 'w') as f:
            yaml.dump([{
                'test_id': v.test_id,
                'test_name': v.test_name,
                'requirement_ids': v.requirement_ids,
                'pass_fail': v.pass_fail,
                'metrics': v.metrics,
                'timestamp': v.timestamp.isoformat()
            } for v in self.validation_results], f)
    
    def _check_model_card_exists(self) -> bool:
        """Check if model card is complete"""
        import os
        return os.path.exists(f"{self.project_dir}/model_card.md")

# Usage Example
lifecycle = ModelLifecycleManager(
    model_name="diabetic-retinopathy-classifier",
    project_dir="./ml_projects/dr_classifier"
)

# Phase 1: Add Requirements
lifecycle.add_requirement(Requirement(
    id="REQ-001",
    type=RequirementType.FUNCTIONAL,
    description="Classify fundus images into 5 DR severity levels",
    acceptance_criteria="Model outputs probability distribution over 5 classes",
    priority="Critical",
    status="Approved"
))

lifecycle.add_requirement(Requirement(
    id="REQ-002",
    type=RequirementType.PERFORMANCE,
    description="Achieve AUC ≥ 0.95 on validation set",
    acceptance_criteria="AUC-ROC ≥ 0.95, sensitivity ≥ 90%, specificity ≥ 90%",
    priority="Critical",
    status="Approved"
))

# Phase 2: Add Design
lifecycle.add_design_spec(DesignSpec(
    id="DESIGN-001",
    name="CNN Architecture",
    description="EfficientNet-B3 with custom classification head",
    architecture_diagram="./diagrams/architecture.png",
    requirements=["REQ-001", "REQ-002"],
    review_status="Approved"
))

# Check readiness and advance
readiness = lifecycle.check_readiness_for_phase(LifecyclePhase.DESIGN)
print(f"Ready for Design phase: {readiness}")

if all(readiness.values()):
    lifecycle.advance_phase(LifecyclePhase.DESIGN)

# Generate traceability report
print(lifecycle.generate_traceability_report())
```

**2. Experiment Tracking and Reproducibility**

```python
# MLflow Integration for Lifecycle Tracking
import mlflow
import mlflow.pytorch
import torch
from torch import nn
from datetime import datetime

class ReproducibleModelTrainer:
    def __init__(self, experiment_name: str, tracking_uri: str = "http://localhost:5000"):
        mlflow.set_tracking_uri(tracking_uri)
        mlflow.set_experiment(experiment_name)
        self.run_id = None
    
    def start_run(self, run_name: str, tags: Dict[str, str] = None):
        """Start MLflow run with lifecycle metadata"""
        default_tags = {
            'lifecycle_phase': 'training',
            'developer': 'AI Team',
            'regulatory_status': 'development'
        }
        if tags:
            default_tags.update(tags)
        
        mlflow.start_run(run_name=run_name, tags=default_tags)
        self.run_id = mlflow.active_run().info.run_id
    
    def log_requirements(self, requirements: List[Requirement]):
        """Log requirements being addressed"""
        req_dict = {
            f"requirement_{r.id}": r.description
            for r in requirements
        }
        mlflow.log_params(req_dict)
    
    def train_model(self, model, train_loader, val_loader, epochs=10):
        """Train model with full tracking"""
        # Log model architecture
        mlflow.log_param("model_architecture", str(model))
        mlflow.log_param("num_parameters", sum(p.numel() for p in model.parameters()))
        
        # Log hyperparameters
        mlflow.log_param("epochs", epochs)
        mlflow.log_param("optimizer", "Adam")
        mlflow.log_param("learning_rate", 0.001)
        
        # Log environment
        mlflow.log_param("pytorch_version", torch.__version__)
        mlflow.log_param("cuda_available", torch.cuda.is_available())
        
        optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
        criterion = nn.CrossEntropyLoss()
        
        for epoch in range(epochs):
            # Training
            model.train()
            train_loss = 0.0
            for batch in train_loader:
                # ... training code ...
                pass
            
            # Validation
            model.eval()
            val_loss = 0.0
            correct = 0
            total = 0
            with torch.no_grad():
                for batch in val_loader:
                    # ... validation code ...
                    pass
            
            val_accuracy = correct / total
            
            # Log metrics
            mlflow.log_metric("train_loss", train_loss, step=epoch)
            mlflow.log_metric("val_loss", val_loss, step=epoch)
            mlflow.log_metric("val_accuracy", val_accuracy, step=epoch)
        
        # Save model
        mlflow.pytorch.log_model(model, "model")
        
        # Log model card
        model_card = self._generate_model_card(model, val_accuracy)
        mlflow.log_text(model_card, "model_card.md")
        
        return model
    
    def log_validation_results(self, metrics: Dict[str, float]):
        """Log final validation metrics"""
        for metric_name, value in metrics.items():
            mlflow.log_metric(f"final_{metric_name}", value)
    
    def register_model(self, model_name: str, stage: str = "None"):
        """Register model in MLflow Model Registry"""
        model_uri = f"runs:/{self.run_id}/model"
        mlflow.register_model(model_uri, model_name)
        
        # Transition to stage (None, Staging, Production, Archived)
        client = mlflow.tracking.MlflowClient()
        client.transition_model_version_stage(
            name=model_name,
            version=1,
            stage=stage
        )
    
    def end_run(self):
        """End MLflow run"""
        mlflow.end_run()
    
    def _generate_model_card(self, model, accuracy):
        """Generate model card markdown"""
        return f"""
# Model Card

## Model Details
- **Model Type**: {type(model).__name__}
- **Training Date**: {datetime.now().isoformat()}
- **MLflow Run ID**: {self.run_id}

## Intended Use
- **Primary Use**: Diabetic retinopathy classification
- **Users**: Ophthalmologists, retinal specialists

## Metrics
- **Validation Accuracy**: {accuracy:.4f}

## Training Data
- **Dataset**: EyePACS, Kaggle DR Detection
- **Size**: 35,000 images

## Ethical Considerations
- **Bias**: Evaluated across demographic groups
- **Privacy**: De-identified data only

## Caveats
- **Not for primary diagnosis**: Should be used as screening tool only
"""

# Usage
trainer = ReproducibleModelTrainer("DR-Classifier-v1")
trainer.start_run("training-run-001", tags={'regulatory': 'FDA-510k'})

# Log requirements
requirements = [
    Requirement(id="REQ-001", type=RequirementType.PERFORMANCE, 
                description="AUC ≥ 0.95", acceptance_criteria="AUC ≥ 0.95",
                priority="Critical", status="Approved")
]
trainer.log_requirements(requirements)

# Train
model = torch.nn.Sequential(...)  # Your model
trained_model = trainer.train_model(model, train_loader, val_loader, epochs=50)

# Validate
validation_metrics = {
    'auc': 0.96,
    'sensitivity': 0.92,
    'specificity': 0.91
}
trainer.log_validation_results(validation_metrics)

# Register
trainer.register_model("DRClassifier", stage="Staging")
trainer.end_run()
```

**3. Model Card Template (Compliance-Ready)**

```markdown
# Model Card: [Model Name]

## Model Details

**Developed by**: [Organization]  
**Model Date**: [YYYY-MM-DD]  
**Model Version**: [v1.0.0]  
**Model Type**: [CNN / Transformer / Ensemble / etc.]  
**Framework**: [PyTorch / TensorFlow / etc.]  
**License**: [MIT / Proprietary / etc.]  
**Contact**: [email@example.com]

**Regulatory Status**:
- [ ] FDA 510(k) Clearance: [K######]
- [ ] CE Mark: [######]
- [ ] NMPA Approval: [######]
- [ ] In Development

## Intended Use

### Primary Intended Use
[Describe the primary clinical or operational use case]

### Intended Users
- [User type 1, e.g., Radiologists]
- [User type 2, e.g., Primary care physicians]

### Out-of-Scope Uses
- [Use case 1 that is NOT intended]
- [Use case 2 that is NOT intended]

## Factors

**Relevant Factors**: [Demographics, clinical factors that affect performance]
- Age: [Range]
- Sex: [Male, Female, Other]
- Race/Ethnicity: [Groups evaluated]
- Disease severity: [Stages]

**Evaluation Factors**: [Factors used to disaggregate performance]
- Subpopulation A
- Subpopulation B

## Metrics

**Performance Metrics**:
| Metric | Overall | Subgroup A | Subgroup B |
|--------|---------|------------|------------|
| AUC-ROC | 0.95 | 0.94 | 0.96 |
| Sensitivity | 0.92 | 0.90 | 0.93 |
| Specificity | 0.91 | 0.89 | 0.92 |
| PPV | 0.85 | 0.83 | 0.87 |
| NPV | 0.96 | 0.95 | 0.97 |

**Decision Thresholds**:
- Default threshold: 0.5
- High-sensitivity threshold: 0.3 (recall=0.98, precision=0.75)
- High-specificity threshold: 0.7 (recall=0.85, precision=0.92)

## Training Data

**Datasets**:
- [Dataset Name 1]: [N samples, source, collection period]
- [Dataset Name 2]: [N samples, source, collection period]

**Preprocessing**:
- [Preprocessing step 1]
- [Preprocessing step 2]

**Data Split**:
- Training: [70%, N samples]
- Validation: [15%, N samples]
- Test: [15%, N samples]

## Evaluation Data

**Test Set**:
- Source: [External validation cohort / Internal holdout]
- Size: [N samples]
- Collection Period: [YYYY-MM to YYYY-MM]
- Demographic Distribution: [Match training? Different?]

**Evaluation Protocol**:
[Describe how evaluation was conducted]

## Quantitative Analysis

### Performance by Subgroup

[Insert tables showing performance across demographic/clinical subgroups]

### Error Analysis

**Common False Positives**:
- [Pattern 1]: [Frequency]

**Common False Negatives**:
- [Pattern 1]: [Frequency]

## Ethical Considerations

**Bias and Fairness**:
- [Assessment of bias across protected groups]
- [Mitigation strategies applied]

**Privacy**:
- [Data de-identification methods]
- [Privacy-preserving techniques (DP, federated learning)]

**Transparency**:
- [Explainability methods used (SHAP, Grad-CAM)]
- [Right to explanation support]

## Caveats and Recommendations

**Limitations**:
- [Limitation 1]
- [Limitation 2]

**Monitoring Recommendations**:
- [Monitor metric 1 monthly]
- [Monitor metric 2 for drift]

**Recommended Human Oversight**:
- [When human review is required]
- [Escalation criteria]

**Contraindications**:
- [Scenario 1 where model should NOT be used]
- [Scenario 2 where model should NOT be used]

## References

- [Citation 1]
- [Citation 2]

## Model Card Authors

- [Author 1, Role]
- [Author 2, Role]

## Model Card Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-01-01 | Initial release | Team |
| 1.1 | 2025-02-01 | Updated metrics | Team |
```

## Implementation Guidance

### SDLC Phase Checklists

**Phase 1: Requirements**
- [ ] Use case defined with success criteria
- [ ] Stakeholders identified and engaged
- [ ] Regulatory pathway determined
- [ ] Functional requirements documented
- [ ] Performance requirements quantified
- [ ] Data requirements specified
- [ ] Safety requirements defined
- [ ] Requirements reviewed and approved

**Phase 2: Design**
- [ ] Architecture diagram created
- [ ] Model type justified
- [ ] Data pipeline designed
- [ ] Technology stack selected
- [ ] Interface specifications documented
- [ ] Design reviewed by stakeholders
- [ ] Design approved by technical lead

**Phase 3: Implementation**
- [ ] Code repository created (Git)
- [ ] Coding standards established
- [ ] Code review process in place
- [ ] Unit tests written (≥80% coverage)
- [ ] Experiment tracking enabled
- [ ] Model versioning implemented

**Phase 4: Validation**
- [ ] Validation plan approved
- [ ] Validation dataset prepared (held-out)
- [ ] Performance testing complete
- [ ] Fairness testing complete
- [ ] Robustness testing complete
- [ ] Validation report generated
- [ ] Peer review conducted

**Phase 5: Deployment**
- [ ] Model card complete
- [ ] Deployment strategy defined
- [ ] Monitoring plan in place
- [ ] Rollback plan documented
- [ ] Regulatory submission complete (if applicable)
- [ ] Deployment approval obtained

**Phase 6: Maintenance**
- [ ] Performance monitoring dashboard operational
- [ ] Drift detection enabled
- [ ] Retraining schedule defined
- [ ] Incident response plan in place
- [ ] Monthly performance reports generated

### Tools and Frameworks

| Category | Tool | Purpose |
|----------|------|---------|
| **Version Control** | Git, DVC | Code and data versioning |
| **Experiment Tracking** | MLflow, Weights & Biases | Hyperparameter tracking |
| **Model Registry** | MLflow Model Registry | Model versioning and stage management |
| **Pipeline Orchestration** | Kubeflow, Airflow | ML workflow automation |
| **Testing** | pytest, unittest | Unit and integration testing |
| **Documentation** | Sphinx, MkDocs | Code documentation |
| **Monitoring** | Prometheus, Grafana | Production monitoring |

## Evidence Requirements

### Documentation Artifacts

1. **Requirements Specification**
   - Functional requirements
   - Performance requirements
   - Safety requirements
   - Traceability matrix

2. **Design Specification**
   - Architecture diagrams
   - Data flow diagrams
   - Interface specifications
   - Technology justification

3. **Implementation Records**
   - Code repository (Git)
   - Code review records
   - Unit test results
   - Experiment logs (MLflow)

4. **Validation Report**
   - Test plan
   - Test results (all metrics)
   - Subgroup analysis
   - Peer review sign-off

5. **Model Card**
   - Complete model card (all sections)
   - Performance metrics
   - Limitations
   - Ethical considerations

6. **Deployment Documentation**
   - Deployment plan
   - Monitoring plan
   - Rollback procedure
   - Regulatory submission (if applicable)

### Audit Trail Requirements

- All phases documented with dates and approvers
- Traceability from requirements to deployment
- Change log for all model updates
- Version history (code, data, models)

## Related Controls

- **COMP-ISO13485-005**: Design Planning
- **COMP-ISO13485-010**: Design Controls
- **COMP-IEC62304-002**: Software Development Planning
- **COMP-FDA-002**: Software Development Lifecycle
- **COMP-ISO27001-084**: Secure Development Lifecycle

## Implementation Notes

### Regulatory Considerations

**FDA (US)**:
- Follow Software Development Lifecycle (IEC 62304)
- Maintain Design History File (DHF)
- Conduct design reviews at each phase
- Document all changes

**CE Mark (EU)**:
- Follow EN 62304 (Medical Device Software)
- Maintain Technical Documentation
- Conduct design verification and validation

**ISO 13485**:
- §7.3.2: Design and development planning
- §7.3.4: Design and development review
- §7.3.5: Design and development verification
- §7.3.6: Design and development validation

### Common Pitfalls

1. **Skipping Requirements Phase**: Leads to scope creep
   - Solution: Formal requirements review and approval

2. **Poor Traceability**: Cannot demonstrate compliance
   - Solution: Maintain traceability matrix throughout

3. **Inadequate Validation**: Model fails in production
   - Solution: Independent validation with held-out data

4. **Missing Documentation**: Delays regulatory approval
   - Solution: Document as you go, not retrospectively

## Status Checklist

- [ ] SDLC process documented and approved
- [ ] Phase gate criteria defined
- [ ] Traceability matrix template created
- [ ] Experiment tracking system operational
- [ ] Model registry configured
- [ ] Code review process in place
- [ ] Validation plan template available
- [ ] Model card template available
- [ ] Deployment checklist defined
- [ ] Change management process documented
- [ ] Training conducted for all team members

---

**Last Updated**: 2025-12-13  
**Status**: Pending Verification  
**Applies to**: All AI/ML model development projects  
**Priority**: Critical
