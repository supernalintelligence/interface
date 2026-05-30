---
id: comp-en18031-018-model-versioning
title: COMP-EN18031-018 - Model Versioning
purpose: Implement comprehensive version control for AI models to enable reproducibility, traceability, and safe model deployment
en18031Control: 6.3.2
category: ai-model
priority: high
framework: EN 18031
sidebar_label: COMP-EN18031-018
sidebar_position: 18
crossFramework:
  iso42001: 7.5 (AI Model Management)
  euAiAct: Article 11 (Technical Documentation), Article 19 (Conformity Assessment)
  nistAiRmf: Govern 4.2, Manage 2.1
  iso27001: 003 (Document Control)
  iso13485: 005 (Design Planning), 014 (Change Control)
  iec62304: 002 (Software Development Planning), 014 (Change Control)
status: pending-verification
references: []
---

# COMP-EN18031-018: Model Versioning

## Overview

**Purpose**: Implement robust version control for AI models to ensure reproducibility, enable traceability, support safe deployment, and facilitate regulatory compliance  
**EN 18031 Control**: 6.3.2 - Model Versioning  
**Category**: ai-model  
**Priority**: high  
**Framework**: EN 18031

## Regulatory Context

### EN 18031 Alignment

- **6.3.2**: Model Versioning - Track model changes throughout lifecycle
- **Related Controls**:
  - 6.3.1: Model Development Lifecycle (versioning throughout lifecycle)
  - 6.2.5: Data Versioning (model versions linked to data versions)
  - 5.2.3: AI Audit Trail (model version history in audit trail)

### Cross-Framework Mapping

- **ISO/IEC 42001**: 
  - 7.5: AI Model Management - Manage models throughout lifecycle
  - 8.5: Model Development and Deployment - Control model versions

- **EU AI Act**: 
  - Article 11: Technical Documentation - Document model versions
  - Article 19: Conformity Assessment - Model version traceability for assessment
  - Annex IV: Model versioning as part of technical documentation

- **NIST AI RMF**: 
  - GOVERN-4.2: Organizational practices are in place to enable model lineage and provenance
  - MANAGE-2.1: AI system updates and changes are documented

- **ISO 27001**: 
  - A.5.10 (003): Document Control

- **ISO 13485**: 
  - 7.3 (005): Design and Development Planning
  - 7.3.9 (014): Design and Development Changes

- **IEC 62304**: 
  - 5.1 (002): Software Development Planning
  - 6.2.5 (014): Change Control

## Description

Implements EN 18031 Section 6.3.2 to establish comprehensive version control for AI models. Model versioning is critical for:

1. **Reproducibility**: Recreate exact model at any point in time
2. **Traceability**: Track model lineage from training to deployment
3. **Rollback**: Revert to previous model version if issues arise
4. **A/B Testing**: Compare model versions in production
5. **Compliance**: Demonstrate model provenance to regulators
6. **Debugging**: Investigate issues by comparing model versions

### What to Version

1. **Model Weights**: Neural network weights, tree structures, coefficients
2. **Model Architecture**: Network structure, hyperparameters
3. **Training Code**: Code used to train the model
4. **Training Configuration**: Hyperparameters, optimizer settings
5. **Training Data Version**: Link to exact data version used
6. **Model Metadata**: Performance metrics, validation results
7. **Model Artifacts**: Preprocessing pipelines, tokenizers, encoders

### Model Version Properties

- **Immutable**: Once created, version cannot be modified
- **Uniquely Identified**: Each version has unique identifier
- **Fully Reproducible**: All artifacts needed to reproduce model
- **Traceable**: Lineage from data to deployed model
- **Documented**: Training process, performance, changes captured
- **Linked**: Connected to data versions, code versions, experiments

## Acceptance Criteria

```gherkin
Feature: Model Version Creation and Storage
  As an ML Engineer
  I want to create and store model versions systematically
  So that all models are tracked, reproducible, and traceable

  Background:
    Given the organization trains and deploys AI models
    And EN 18031 compliance requires model versioning
    And reproducibility and traceability are required

  Scenario: Model Version Creation
    Given a model is trained
    When model version is created
    Then model shall be assigned unique version identifier
    And version identifier shall be based on semantic versioning or hash
    And model weights shall be stored immutably
    And model architecture shall be stored
    And training configuration shall be stored
    And model artifacts (preprocessors, etc.) shall be stored
    And version creation shall be logged
    And model version shall be retrievable by identifier

  Scenario: Model Metadata Capture
    Given a model version is created
    When metadata is captured
    Then metadata shall include version ID, timestamp, creator
    And metadata shall include training data version
    And metadata shall include training code version (git commit)
    And metadata shall include hyperparameters and configuration
    And metadata shall include performance metrics (accuracy, loss, etc.)
    And metadata shall include validation results
    And metadata shall include model lineage (parent models, experiments)
    And metadata shall include model card information
    And metadata shall be searchable

  Scenario: Model Reproducibility Package
    Given a model version is stored
    When model reproduction is needed
    Then all artifacts needed to reproduce model shall be available
    And training data version shall be retrievable
    And training code version shall be retrievable
    And environment specification (packages, versions) shall be available
    And training configuration shall be available
    And reproduction instructions shall be documented
    And reproduction shall be verified

  Scenario: Model Version Immutability
    Given model version is stored
    When attempt to modify model version is made
    Then modification shall be rejected
    And new version shall be created instead
    And immutability shall be enforced by storage system
    And version integrity shall be verifiable (checksums)
    And tampering shall be detectable
    And audit log shall record access attempts

Feature: Model Version Discovery and Retrieval
  As an MLOps Engineer
  I want to easily discover and retrieve model versions
  So that I can deploy, compare, and rollback models

  Scenario: Model Version Discovery
    Given multiple model versions exist
    When model versions are searched
    Then versions shall be searchable by name, tags, date
    And versions shall be filterable by performance metrics
    And version history shall be viewable
    And version diffs shall be viewable
    And latest version shall be easily identifiable
    And production versions shall be clearly marked
    And model registry shall be browsable

  Scenario: Model Version Retrieval
    Given a model version identifier is known
    When model version is retrieved
    Then exact model weights shall be returned
    And model architecture shall be loaded
    And model artifacts shall be retrieved
    And retrieval shall be performant
    And retrieval shall be reliable (no corruption)
    And metadata shall be included
    And retrieval shall be audited
    And version integrity shall be verified on retrieval

  Scenario: Model Version Comparison
    Given two model versions exist
    When versions are compared
    Then differences in architecture shall be highlighted
    And differences in hyperparameters shall be shown
    And differences in performance metrics shall be compared
    And differences in training data shall be identified
    And comparison report shall be generated
    And comparison shall support model selection

Feature: Model-Data-Code Linkage
  As an ML Platform Engineer
  I want complete linkage between models, data, and code
  So that model provenance is fully traceable

  Scenario: Recording Model Lineage
    Given a model is trained
    When model lineage is recorded
    Then training data version shall be linked to model version
    And training code version (git commit) shall be linked
    And parent models (if fine-tuning) shall be linked
    And experiment ID shall be linked
    And model lineage shall be complete and bidirectional
    And lineage graph shall be queryable
    And lineage shall support traceability audits

  Scenario: Model Provenance Traceability
    Given a deployed model version
    When provenance is traced
    Then complete lineage from raw data to deployed model shall be traceable
    And all data transformations shall be documented
    And all training experiments shall be recorded
    And all model validation steps shall be traceable
    And all deployment approvals shall be recorded
    And provenance shall meet regulatory requirements

  Scenario: Impact Analysis via Lineage
    Given model lineage is tracked
    When data or code changes occur
    Then affected models shall be identified
    And downstream impacts shall be assessed
    And re-training recommendations shall be generated
    And impact analysis shall be automated
    And impact reports shall be generated

Feature: Model Versioning in CI/CD Pipeline
  As a DevOps Engineer
  I want model versioning integrated into CI/CD
  So that model releases are controlled and traceable

  Scenario: Automated Model Versioning in Training Pipeline
    Given model training pipeline is automated
    When model training completes
    Then model version shall be created automatically
    And version shall follow semantic versioning scheme
    And version shall be incremented based on change type (major, minor, patch)
    And version metadata shall be captured automatically
    And version shall be registered in model registry
    And pipeline shall fail if versioning fails

  Scenario: Model Version Promotion Through Stages
    Given model version is created in development
    When model is promoted through stages (dev → staging → prod)
    Then model version shall remain unchanged
    And promotion shall be recorded in version metadata
    And stage-specific validation shall be performed
    And promotion approvals shall be required
    And promotion shall be auditable
    And only approved versions shall reach production

  Scenario: Model Version Deployment Tracking
    Given model version is deployed
    When deployment occurs
    Then deployment shall be linked to model version
    And deployment timestamp and location shall be recorded
    And deployer identity shall be recorded
    And deployment approvals shall be recorded
    And deployment status shall be tracked
    And deployed versions shall be queryable
    And rollback to previous version shall be supported

Feature: Model Version Change Management
  As an AI Product Manager
  I want to manage model version changes systematically
  So that impacts are understood and controlled

  Scenario: Model Version Release Planning
    Given new model version is ready for release
    When release is planned
    Then release notes shall be created
    And changes from previous version shall be documented
    And performance improvements shall be quantified
    And known issues or limitations shall be documented
    And rollback plan shall be prepared
    And release approval shall be obtained
    And release shall be scheduled

  Scenario: Model Version Tagging and Stages
    Given model versions exist
    When model versions are tagged
    Then versions shall be tagged by purpose (experiment, candidate, production)
    And versions shall be tagged by stage (dev, staging, prod)
    And versions shall be tagged by release (v1.0.0, v1.1.0)
    And tags shall be queryable
    And production-tagged models shall be clearly identified
    And tags shall support governance workflows

  Scenario: Model Version Deprecation and Retirement
    Given old model version is no longer needed
    When model version is deprecated
    Then deprecation notice shall be issued
    And deprecation timeline shall be communicated
    And dependent systems shall be identified
    And migration plan to new version shall be provided
    And deprecated version shall remain accessible for period
    And eventual retirement shall follow retention policy
    And deprecation shall be documented

Feature: Model Registry and Governance
  As an AI Governance Officer
  I want a model registry with governance controls
  So that model usage is controlled and compliant

  Scenario: Centralized Model Registry
    Given organization trains multiple models
    When model registry is established
    Then all model versions shall be registered
    And registry shall be searchable and browsable
    And registry shall enforce naming conventions
    And registry shall track model metadata
    And registry shall support access controls
    And registry shall provide APIs for automation
    And registry shall be highly available

  Scenario: Model Approval Workflow
    Given model version is ready for production
    When approval workflow is triggered
    Then model shall be reviewed by required approvers
    And model validation results shall be reviewed
    And model risk assessment shall be reviewed
    And model documentation shall be verified
    And approval or rejection shall be recorded
    And only approved models shall be deployable to production
    And approval audit trail shall be maintained

  Scenario: Model Version Access Control
    Given sensitive models exist
    When access controls are enforced
    Then model access shall be role-based
    And model retrieval shall require authentication
    And model downloads shall be logged
    And sensitive models shall have restricted access
    And access reviews shall be conducted regularly
    And unauthorized access shall be prevented

Feature: Model Versioning for Compliance
  As an AI Compliance Officer
  I want model versioning to support regulatory compliance
  So that compliance evidence is readily available

  Scenario: Model Version Documentation for Regulators
    Given AI system requires regulatory approval
    When compliance documentation is prepared
    Then all model versions in development shall be documented
    And production model version shall be identified
    And model validation results shall be available
    And model lineage shall be traceable
    And model performance metrics shall be documented
    And documentation shall meet regulatory requirements (FDA, EU AI Act)
    And compliance audit trail shall be complete

  Scenario: Model Version Audit Trail
    Given model versions are created and deployed
    When audit trail is maintained
    Then all model version creation events shall be logged
    And all model deployments shall be logged
    And all model retrievals shall be logged
    And all model changes shall be logged
    And audit logs shall be immutable
    And audit logs shall support compliance investigations
    And audit trail shall meet regulatory requirements

  Scenario: Compliance Verification
    Given EN 18031 and EU AI Act require model management
    When compliance audit is performed
    Then model versioning system shall be demonstrated
    Then model traceability shall be verified
    And model reproducibility shall be demonstrated
    And model documentation shall be reviewed
    And compliance with EN 18031 6.3.2 shall be verified
    And EU AI Act Article 11 requirements shall be met
```

## Technical Context

### Model Versioning Architecture

```
┌─────────────────────────────────────────────────────┐
│     Model Training & Experimentation                │
│  (MLflow, W&B, Neptune.ai)                          │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Model Version Creation                           │
│  • Assign version ID                                 │
│  • Store model weights, architecture                 │
│  • Capture metadata                                  │
│  • Link to data version, code version                │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Model Registry                                   │
│  • MLflow Model Registry                             │
│  • Seldon Core Model Manager                         │
│  • Custom Registry                                   │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Model Approval & Promotion                       │
│  • Validation checks                                 │
│  • Approval workflow                                 │
│  • Stage promotion (dev → staging → prod)            │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Model Deployment                                 │
│  • Deploy specific version                           │
│  • Track deployment                                  │
│  • Support rollback                                  │
└──────────────────────────────────────────────────────┘
```

### Implementation Pattern: MLflow Model Registry

```python
import mlflow
import mlflow.sklearn
from mlflow.tracking import MlflowClient
from datetime import datetime

class ModelVersionControl:
    def __init__(self, registry_uri):
        self.client = MlflowClient(registry_uri=registry_uri)
        mlflow.set_tracking_uri(registry_uri)
    
    def register_model_version(self, model, model_name, run_id, metadata):
        """Register new model version"""
        # Log model to MLflow
        model_uri = f"runs:/{run_id}/model"
        
        # Register model version
        model_version = mlflow.register_model(model_uri, model_name)
        
        # Add metadata as tags
        for key, value in metadata.items():
            self.client.set_model_version_tag(
                name=model_name,
                version=model_version.version,
                key=key,
                value=str(value)
            )
        
        # Set model description
        self.client.update_model_version(
            name=model_name,
            version=model_version.version,
            description=metadata.get('description', '')
        )
        
        return model_version
    
    def create_model_version_with_lineage(self, model, model_name, training_context):
        """Create model version with complete lineage"""
        # Start MLflow run
        with mlflow.start_run() as run:
            # Log model
            mlflow.sklearn.log_model(model, "model")
            
            # Log training data version
            mlflow.log_param("data_version", training_context['data_version'])
            
            # Log code version (git commit)
            mlflow.log_param("code_version", training_context['code_commit'])
            
            # Log hyperparameters
            for param, value in training_context['hyperparameters'].items():
                mlflow.log_param(param, value)
            
            # Log metrics
            for metric, value in training_context['metrics'].items():
                mlflow.log_metric(metric, value)
            
            # Log artifacts (config files, etc.)
            for artifact in training_context.get('artifacts', []):
                mlflow.log_artifact(artifact)
            
            run_id = run.info.run_id
        
        # Register model version
        metadata = {
            'data_version': training_context['data_version'],
            'code_version': training_context['code_commit'],
            'created_by': training_context['creator'],
            'training_timestamp': datetime.utcnow().isoformat(),
            'validation_accuracy': training_context['metrics'].get('accuracy'),
            'parent_model': training_context.get('parent_model')
        }
        
        model_version = self.register_model_version(
            model, model_name, run_id, metadata
        )
        
        return model_version
    
    def get_model_version(self, model_name, version=None, stage=None):
        """Retrieve specific model version"""
        if version:
            model_version = self.client.get_model_version(model_name, version)
        elif stage:
            # Get latest version in stage (e.g., "Production")
            model_versions = self.client.get_latest_versions(model_name, stages=[stage])
            if not model_versions:
                raise ValueError(f"No model found in stage: {stage}")
            model_version = model_versions[0]
        else:
            raise ValueError("Must specify version or stage")
        
        # Load model
        model_uri = f"models:/{model_name}/{model_version.version}"
        model = mlflow.sklearn.load_model(model_uri)
        
        return model, model_version
    
    def promote_model_version(self, model_name, version, stage):
        """Promote model version to stage (Staging, Production)"""
        # Validate model before promotion
        validation_results = self.validate_model_for_stage(model_name, version, stage)
        
        if not validation_results['passed']:
            raise ValueError(f"Model validation failed: {validation_results['reason']}")
        
        # Transition model to stage
        self.client.transition_model_version_stage(
            name=model_name,
            version=version,
            stage=stage,
            archive_existing_versions=True  # Archive old production models
        )
        
        # Log promotion
        self.client.set_model_version_tag(
            name=model_name,
            version=version,
            key="promoted_to_" + stage,
            value=datetime.utcnow().isoformat()
        )
        
        return {"status": "promoted", "model": model_name, "version": version, "stage": stage}
    
    def compare_model_versions(self, model_name, version1, version2):
        """Compare two model versions"""
        mv1 = self.client.get_model_version(model_name, version1)
        mv2 = self.client.get_model_version(model_name, version2)
        
        # Get runs for each version
        run1 = self.client.get_run(mv1.run_id)
        run2 = self.client.get_run(mv2.run_id)
        
        comparison = {
            'version1': version1,
            'version2': version2,
            'parameter_changes': self.compare_params(run1.data.params, run2.data.params),
            'metric_changes': self.compare_metrics(run1.data.metrics, run2.data.metrics),
            'data_version_change': {
                'v1': run1.data.params.get('data_version'),
                'v2': run2.data.params.get('data_version')
            }
        }
        
        return comparison
    
    def get_model_lineage(self, model_name, version):
        """Get complete lineage for model version"""
        model_version = self.client.get_model_version(model_name, version)
        run = self.client.get_run(model_version.run_id)
        
        lineage = {
            'model_name': model_name,
            'model_version': version,
            'data_version': run.data.params.get('data_version'),
            'code_version': run.data.params.get('code_version'),
            'parent_model': run.data.params.get('parent_model'),
            'training_run_id': model_version.run_id,
            'created_timestamp': model_version.creation_timestamp,
            'created_by': run.data.tags.get('mlflow.user')
        }
        
        return lineage
    
    def rollback_production_model(self, model_name, target_version=None):
        """Rollback production model to previous version"""
        # Get current production version
        current_production = self.client.get_latest_versions(model_name, stages=["Production"])
        
        if not current_production:
            raise ValueError("No model in production")
        
        current_version = current_production[0].version
        
        # If target version not specified, get previous production version
        if target_version is None:
            # Get archived versions (previously in production)
            archived = self.client.get_latest_versions(model_name, stages=["Archived"])
            if not archived:
                raise ValueError("No previous version to rollback to")
            target_version = archived[0].version
        
        # Promote target version to production
        self.promote_model_version(model_name, target_version, "Production")
        
        # Archive current version
        self.client.transition_model_version_stage(
            name=model_name,
            version=current_version,
            stage="Archived"
        )
        
        return {
            "status": "rolled_back",
            "from_version": current_version,
            "to_version": target_version
        }
```

### Implementation Requirements

#### Version Identifier Schemes

- **Semantic Versioning**: MAJOR.MINOR.PATCH (e.g., 2.1.3)
- **Timestamp-Based**: YYYY-MM-DD-HHMMSS
- **Hash-Based**: SHA-256 of model weights
- **Sequential**: Auto-incremented integer (e.g., v1, v2, v3)

#### Model Registry Features

- **Versioning**: Track all model versions
- **Staging**: Support dev, staging, production stages
- **Approval Workflow**: Require approvals for production
- **Metadata**: Store comprehensive metadata
- **Search & Discovery**: Query models by tags, metrics
- **APIs**: Programmatic access to registry

#### Storage Backend

- **Cloud Object Storage**: S3, GCS, Azure Blob for model artifacts
- **Model Registry**: MLflow, Seldon Core, custom registry
- **Immutable Storage**: Once registered, cannot be modified

## Validation Strategy

### Testing Approach

1. **Version Creation**: Test immutability, uniqueness
2. **Version Retrieval**: Test integrity, performance
3. **Lineage Traceability**: Test end-to-end traceability
4. **Reproducibility**: Test exact model reproduction
5. **Rollback**: Test production rollback procedures

### Metrics

- **Version Creation Time**: < 1min
- **Version Retrieval Time**: < 30sec
- **Lineage Completeness**: 100% of models have complete lineage
- **Reproducibility Success Rate**: > 99%

## Evidence Requirements

### Required Documentation

1. **Model Versioning Policy**: Standards, procedures, retention
2. **Model Registry**: All versions, metadata, lineage
3. **Approval Records**: Production model approvals
4. **Deployment History**: Which versions deployed where and when
5. **Reproducibility Tests**: Evidence of successful reproduction

### Evidence Collection

**Metrics**:
- Number of model versions
- Models in production
- Model promotion rate
- Rollback frequency

**Audit Trail**:
- Version creation logs
- Version retrieval logs
- Deployment logs
- Approval logs

## Related Controls

### Within EN 18031

- **comp-en18031-014-data-versioning**: Model versions linked to data versions
- **comp-en18031-016-model-development-lifecycle**: Versioning throughout lifecycle
- **comp-en18031-007-ai-audit-trail**: Model version history in audit

### Cross-Framework

- **ISO 27001 A.5.10**: Document control
- **IEC 62304**: Software versioning for medical devices

## Implementation Notes

### Best Practices

1. **Semantic Versioning**: Use meaningful version numbers
2. **Complete Lineage**: Link models to data, code, experiments
3. **Immutable Versions**: Never modify existing versions
4. **Test Reproducibility**: Regularly verify reproduction works
5. **Automate Versioning**: Integrate into CI/CD pipelines

### Common Pitfalls

- **Pitfall**: Manual versioning (error-prone, incomplete)
  - **Solution**: Automate versioning in training pipelines

- **Pitfall**: Missing lineage (cannot trace model provenance)
  - **Solution**: Capture lineage automatically at training time

- **Pitfall**: Cannot reproduce models (missing artifacts)
  - **Solution**: Store all artifacts (data version, code, config, environment)

- **Pitfall**: No rollback capability
  - **Solution**: Keep previous production versions; test rollback regularly

### ML/AI Tooling

**Model Versioning & Registry**:
- **MLflow Model Registry**: Open-source, widely used
- **Weights & Biases**: Experiment tracking and model versioning
- **Neptune.ai**: Model versioning and metadata management
- **Seldon Core**: Kubernetes-native model deployment and versioning

**Model Serving**:
- **TensorFlow Serving**: Version-aware serving
- **TorchServe**: PyTorch model serving
- **KServe**: Kubernetes model serving with versioning

## Status

- [ ] Model versioning system selected and deployed
- [ ] Model registry operational
- [ ] Version metadata schema defined
- [ ] Model-data-code linkage automated
- [ ] Approval workflow implemented
- [ ] Stage promotion process established
- [ ] Deployment tracking operational
- [ ] Rollback procedures tested
- [ ] Reproducibility validated
- [ ] Documentation completed
- [ ] Compliance with EN 18031 6.3.2 verified
