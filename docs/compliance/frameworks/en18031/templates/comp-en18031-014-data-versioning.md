---
id: comp-en18031-014-data-versioning
title: COMP-EN18031-014 - Data Versioning
purpose: Implement comprehensive version control for AI training datasets to enable reproducibility, traceability, and change management
en18031Control: 6.2.5
category: ai-data
priority: high
framework: EN 18031
sidebar_label: COMP-EN18031-014
sidebar_position: 14
crossFramework:
  iso42001: 7.4 (Data Management), 8.3 (Data for AI System)
  euAiAct: Article 10 (Data and Data Governance), Article 11 (Technical Documentation)
  nistAiRmf: Map 3.4, Govern 4.1
  iso27001: 003 (Document Control System)
  iso13485: 004 (Record Control System)
status: pending-verification
references: []
---

# COMP-EN18031-014: Data Versioning

## Overview

**Purpose**: Implement robust version control for AI training datasets to ensure reproducibility, enable traceability, and support effective change management throughout the AI lifecycle  
**EN 18031 Control**: 6.2.5 - Data Versioning  
**Category**: ai-data  
**Priority**: high  
**Framework**: EN 18031

## Regulatory Context

### EN 18031 Alignment

- **6.2.5**: Data Versioning - Track dataset changes over time
- **Related Controls**:
  - 6.2.1: Training Data Quality (version control supports quality)
  - 6.3.1: Model Development Lifecycle (data versions linked to models)
  - 5.2.3: AI Audit Trail (data version history in audit trail)

### Cross-Framework Mapping

- **ISO/IEC 42001**: 
  - 7.4: Data Management - Manage data throughout lifecycle
  - 8.3: Data for AI System - Control and version data

- **EU AI Act**: 
  - Article 10: Data and Data Governance - Dataset management and documentation
  - Article 11: Technical Documentation - Document data used in training
  - Annex IV: Dataset versioning as part of technical documentation

- **NIST AI RMF**: 
  - MAP-3.4: Training, validation, and testing data sets are documented
  - GOVERN-4.1: Organizational practices are in place to enable data lineage and provenance

- **ISO 27001**: 
  - A.5.10 (003): Document Control - Control documented information

- **ISO 13485**: 
  - 4.2.4 (004): Control of Records - Maintain and control records

## Description

Implements EN 18031 Section 6.2.5 to establish comprehensive version control for AI datasets. Data versioning is critical for:

1. **Reproducibility**: Recreate model training exactly as it occurred
2. **Traceability**: Track which data version was used for which model
3. **Change Management**: Understand impact of data changes on models
4. **Compliance**: Demonstrate proper data management to regulators
5. **Debugging**: Investigate issues by identifying data version differences
6. **Rollback**: Revert to previous dataset versions if needed

### What to Version

1. **Raw Data**: Original source data before preprocessing
2. **Processed Data**: Data after cleaning, transformation, feature engineering
3. **Training/Validation/Test Splits**: How data was split
4. **Labels/Annotations**: Labeled data for supervised learning
5. **Metadata**: Data schemas, statistics, provenance
6. **Data Processing Code**: Scripts that generated/transformed data

### Data Version Properties

- **Immutable**: Once created, version cannot be modified
- **Uniquely Identified**: Each version has unique identifier (hash, semantic version)
- **Traceable**: Lineage from source to processed version
- **Documented**: Changes, rationale, statistics captured
- **Linked**: Connected to models trained on that version

## Acceptance Criteria

```gherkin
Feature: Dataset Versioning System Implementation
  As an AI Data Engineer
  I want a robust dataset versioning system
  So that all datasets are tracked, reproducible, and traceable

  Background:
    Given the organization trains AI models
    And EN 18031 compliance requires data versioning
    And reproducibility and traceability are required

  Scenario: Dataset Version Creation
    Given a new dataset is created or modified
    When dataset version is created
    Then dataset shall be assigned unique version identifier
    And version identifier shall be based on content hash or semantic versioning
    And dataset content shall be immutable (cannot be changed)
    And dataset shall be stored with version metadata
    And version creation shall be logged
    And dataset version shall be retrievable by identifier

  Scenario: Dataset Version Metadata Capture
    Given a dataset version is created
    When metadata is captured
    Then metadata shall include version ID, timestamp, creator
    And metadata shall include source (origin of data)
    And metadata shall include lineage (parent versions, transformations)
    And metadata shall include statistics (row count, distribution, etc.)
    And metadata shall include schema (columns, types, constraints)
    And metadata shall include changes from previous version (changelog)
    And metadata shall include data quality metrics
    And metadata shall be searchable

  Scenario: Dataset Lineage Tracking
    Given dataset undergoes transformations
    When dataset lineage is tracked
    Then source dataset version shall be recorded
    And transformation steps shall be documented
    And transformation code version shall be linked
    And intermediate dataset versions shall be captured
    And final processed dataset version shall be traceable to source
    And lineage graph shall be queryable
    And lineage shall support root cause analysis

  Scenario: Dataset Version Immutability
    Given dataset version is stored
    When attempt to modify dataset version is made
    Then modification shall be rejected
    And new version shall be created instead
    And immutability shall be enforced by storage system
    And version integrity shall be verifiable (checksums)
    And tampering shall be detectable
    And audit log shall record access attempts

Feature: Dataset Version Discovery and Retrieval
  As an AI Model Developer
  I want to easily discover and retrieve dataset versions
  So that I can reproduce model training and experiments

  Scenario: Dataset Version Discovery
    Given multiple dataset versions exist
    When dataset versions are searched
    Then versions shall be searchable by name, tags, date
    And versions shall be filterable by properties
    And version history shall be viewable
    And version diffs shall be viewable
    And latest version shall be easily identifiable
    And version catalog shall be browsable

  Scenario: Dataset Version Retrieval
    Given a dataset version identifier is known
    When dataset version is retrieved
    Then exact dataset content shall be returned
    And retrieval shall be performant
    And retrieval shall be reliable (no corruption)
    And metadata shall be included
    And retrieval shall be audited
    And version integrity shall be verified on retrieval

  Scenario: Dataset Version Comparison
    Given two dataset versions exist
    When versions are compared
    Then differences in data content shall be identified
    And differences in schema shall be highlighted
    And differences in statistics shall be reported
    And changes in distribution shall be detected
    And comparison report shall be generated
    And comparison shall support impact analysis

Feature: Dataset-Model Linkage
  As an MLOps Engineer
  I want to link models to dataset versions
  So that I know exactly which data trained which model

  Scenario: Recording Dataset-Model Linkage
    Given a model is trained on a dataset version
    When training is recorded
    Then dataset version ID shall be stored in model metadata
    And model version shall reference dataset version
    And linkage shall be bidirectional (dataset → models, model → dataset)
    And linkage shall include training/validation/test split versions
    And linkage shall be immutable
    And linkage shall be auditable

  Scenario: Querying Dataset-Model Linkage
    Given dataset-model linkages exist
    When linkages are queried
    Then all models trained on a dataset version shall be retrievable
    And all dataset versions used for a model shall be retrievable
    And lineage from raw data to deployed model shall be traceable
    And impact analysis shall be supported (which models affected by data change)
    And queries shall be efficient
    And linkage graph shall be visualizable

  Scenario: Model Reproducibility via Dataset Versioning
    Given a deployed model needs to be reproduced
    When model reproduction is attempted
    Then exact dataset version used for training shall be retrieved
    And exact training/validation/test splits shall be recreated
    And exact preprocessing steps shall be reapplied
    And reproduced model shall match original model
    And reproduction process shall be documented
    And reproducibility shall be verified

Feature: Dataset Change Management
  As an AI Data Scientist
  I want to manage dataset changes systematically
  So that impacts are understood and controlled

  Scenario: Dataset Change Proposal
    Given dataset modification is needed
    When dataset change is proposed
    Then change rationale shall be documented
    And expected impact shall be assessed
    And affected models shall be identified
    And change approval shall be required
    And change shall follow established process
    And change shall be traceable

  Scenario: Dataset Version Release
    Given new dataset version is created
    When dataset version is released
    Then version shall be tagged (e.g., v2.1.0, prod-2025-01-15)
    And release notes shall be created
    And changelog shall be published
    And affected teams shall be notified
    And dataset shall be validated before release
    And release shall be approved by authorized personnel
    And release shall be documented

  Scenario: Dataset Version Deprecation
    Given old dataset version is no longer needed
    When dataset version is deprecated
    Then deprecation notice shall be issued
    And deprecation timeline shall be communicated
    And dependent models shall be identified
    And migration plan shall be provided
    And deprecated version shall remain accessible for period
    And eventual deletion shall follow retention policy
    And deprecation shall be documented

Feature: Dataset Version Storage and Performance
  As a Platform Engineer
  I want efficient dataset version storage
  So that versioning system is performant and cost-effective

  Scenario: Efficient Dataset Storage
    Given multiple dataset versions exist
    When dataset versions are stored
    Then deduplication shall be used (store only diffs)
    And compression shall be applied
    And storage shall be tiered (hot/warm/cold)
    And frequently accessed versions shall be cached
    And storage costs shall be optimized
    And storage shall scale with data volume

  Scenario: Fast Dataset Retrieval
    Given dataset version is requested
    When dataset retrieval occurs
    Then retrieval shall complete within SLA (e.g., <1min for typical dataset)
    And retrieval shall support streaming for large datasets
    And retrieval shall support partial retrieval (specific columns/rows)
    And caching shall accelerate repeated access
    And retrieval performance shall be monitored
    And performance bottlenecks shall be identified and resolved

  Scenario: Dataset Version Retention
    Given dataset versions accumulate over time
    When retention policy is applied
    Then retention periods shall be defined per dataset type
    And critical versions (prod models) shall be retained longer
    And old versions shall be archived to cold storage
    And archived versions shall remain retrievable
    And very old versions shall be deleted per policy
    And retention policy shall be enforced automatically
    And retention shall comply with regulatory requirements

Feature: Dataset Versioning Governance and Compliance
  As an AI Compliance Officer
  I want to ensure dataset versioning supports compliance
  So that regulatory requirements are met

  Scenario: Dataset Version Documentation for Compliance
    Given AI system requires regulatory approval
    When compliance documentation is prepared
    Then all dataset versions used in model development shall be documented
    And dataset lineage shall be traceable to source
    And data quality metrics shall be available
    And dataset changes and their rationale shall be documented
    And dataset version documentation shall support regulatory submissions
    And documentation shall meet EN 18031 and EU AI Act requirements

  Scenario: Dataset Version Audit Trail
    Given dataset versions are created and used
    When audit trail is maintained
    Then all dataset version creation events shall be logged
    And all dataset retrievals shall be logged
    And all dataset-model linkages shall be logged
    And audit logs shall be immutable
    And audit logs shall support compliance investigations
    And audit trail shall meet regulatory requirements

  Scenario: Compliance Verification
    Given EN 18031 and EU AI Act require data management
    When compliance audit is performed
    Then dataset versioning system shall be demonstrated
    And dataset traceability shall be verified
    And model reproducibility shall be demonstrated
    And dataset documentation shall be reviewed
    And compliance with EN 18031 6.2.5 shall be verified
    And EU AI Act Article 10 requirements shall be met
```

## Technical Context

### Data Versioning Architecture

```
┌─────────────────────────────────────────────────────┐
│          Data Sources                               │
│  (Raw Data: Databases, Files, APIs, Streams)        │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Data Ingestion & Versioning                      │
│  • Ingest raw data                                   │
│  • Compute content hash (version ID)                 │
│  • Store immutably                                   │
│  • Capture metadata                                  │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Data Transformation Pipeline                     │
│  • Cleaning, normalization                           │
│  • Feature engineering                               │
│  • Each step creates new version                     │
│  • Lineage tracked                                   │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Versioned Dataset Registry                       │
│  • Dataset catalog                                   │
│  • Version metadata                                  │
│  • Lineage graph                                     │
│  • Search & discovery                                │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│     Model Training                                   │
│  • Retrieve dataset version                          │
│  • Train model                                       │
│  • Link model to dataset version                     │
│  • Store model with dataset reference                │
└──────────────────────────────────────────────────────┘
```

### Implementation Pattern: DVC (Data Version Control)

```python
import hashlib
import json
from datetime import datetime
from pathlib import Path

class DataVersionControl:
    def __init__(self, storage_backend):
        self.storage = storage_backend  # S3, GCS, local, etc.
        self.registry = DatasetRegistry()
        self.lineage_tracker = LineageTracker()
    
    def create_dataset_version(self, dataset, metadata=None):
        """Create immutable dataset version"""
        # Compute content hash as version ID
        version_id = self.compute_content_hash(dataset)
        
        # Check if version already exists
        if self.registry.version_exists(version_id):
            return self.registry.get_version(version_id)
        
        # Store dataset immutably
        storage_path = self.storage.store(dataset, version_id)
        
        # Capture metadata
        version_metadata = {
            'version_id': version_id,
            'timestamp': datetime.utcnow().isoformat(),
            'creator': metadata.get('creator'),
            'source': metadata.get('source'),
            'lineage': metadata.get('lineage', []),
            'schema': self.extract_schema(dataset),
            'statistics': self.compute_statistics(dataset),
            'row_count': len(dataset),
            'column_count': len(dataset.columns) if hasattr(dataset, 'columns') else None,
            'size_bytes': dataset.memory_usage().sum() if hasattr(dataset, 'memory_usage') else None,
            'storage_path': storage_path,
            'changelog': metadata.get('changelog', ''),
            'tags': metadata.get('tags', []),
            'quality_metrics': metadata.get('quality_metrics', {})
        }
        
        # Register version
        self.registry.register_version(version_id, version_metadata)
        
        # Update lineage
        if version_metadata['lineage']:
            self.lineage_tracker.record_lineage(
                child_version=version_id,
                parent_versions=version_metadata['lineage']
            )
        
        return {
            'version_id': version_id,
            'metadata': version_metadata
        }
    
    def get_dataset_version(self, version_id):
        """Retrieve immutable dataset version"""
        # Get metadata
        metadata = self.registry.get_version(version_id)
        
        # Retrieve dataset from storage
        dataset = self.storage.retrieve(metadata['storage_path'])
        
        # Verify integrity
        retrieved_hash = self.compute_content_hash(dataset)
        if retrieved_hash != version_id:
            raise IntegrityError(f"Dataset corrupted: expected {version_id}, got {retrieved_hash}")
        
        # Log retrieval for audit
        self.log_retrieval(version_id)
        
        return dataset, metadata
    
    def compute_content_hash(self, dataset):
        """Compute deterministic content hash"""
        # For pandas DataFrame
        if hasattr(dataset, 'to_csv'):
            content = dataset.to_csv(index=False).encode('utf-8')
        else:
            content = str(dataset).encode('utf-8')
        
        return hashlib.sha256(content).hexdigest()
    
    def track_lineage(self, child_dataset, parent_versions, transformation):
        """Track dataset lineage through transformations"""
        lineage_record = {
            'child_version': self.compute_content_hash(child_dataset),
            'parent_versions': parent_versions,
            'transformation': {
                'type': transformation['type'],
                'code_version': transformation.get('code_version'),
                'parameters': transformation.get('parameters'),
                'timestamp': datetime.utcnow().isoformat()
            }
        }
        
        self.lineage_tracker.record_lineage(lineage_record)
        
        return lineage_record
    
    def link_dataset_to_model(self, model_id, dataset_versions):
        """Link model to dataset versions used for training"""
        linkage = {
            'model_id': model_id,
            'training_data_version': dataset_versions['train'],
            'validation_data_version': dataset_versions.get('validation'),
            'test_data_version': dataset_versions.get('test'),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        self.registry.store_model_dataset_linkage(linkage)
        
        return linkage
    
    def compare_versions(self, version_id_1, version_id_2):
        """Compare two dataset versions"""
        dataset_1, metadata_1 = self.get_dataset_version(version_id_1)
        dataset_2, metadata_2 = self.get_dataset_version(version_id_2)
        
        comparison = {
            'version_1': version_id_1,
            'version_2': version_id_2,
            'schema_changes': self.compare_schemas(metadata_1['schema'], metadata_2['schema']),
            'statistics_changes': self.compare_statistics(metadata_1['statistics'], metadata_2['statistics']),
            'row_count_diff': metadata_2['row_count'] - metadata_1['row_count'],
            'content_diff': self.compute_content_diff(dataset_1, dataset_2)
        }
        
        return comparison
    
    def get_models_using_dataset(self, dataset_version_id):
        """Find all models trained on specific dataset version"""
        models = self.registry.query_models_by_dataset(dataset_version_id)
        return models
    
    def reproduce_model(self, model_id):
        """Reproduce model by retrieving exact dataset versions"""
        # Get model-dataset linkage
        linkage = self.registry.get_model_dataset_linkage(model_id)
        
        # Retrieve exact dataset versions
        train_data, train_metadata = self.get_dataset_version(linkage['training_data_version'])
        val_data, val_metadata = self.get_dataset_version(linkage['validation_data_version'])
        test_data, test_metadata = self.get_dataset_version(linkage['test_data_version'])
        
        reproduction_package = {
            'model_id': model_id,
            'datasets': {
                'train': (train_data, train_metadata),
                'validation': (val_data, val_metadata),
                'test': (test_data, test_metadata)
            },
            'lineage': self.lineage_tracker.get_full_lineage(linkage['training_data_version'])
        }
        
        return reproduction_package
```

### Implementation Requirements

#### Storage Backend

- **Immutable Storage**: S3 with object lock, GCS, Azure Blob (immutable blobs)
- **Deduplication**: Store only diffs between versions (e.g., using DVC, git-lfs)
- **Compression**: Compress datasets to save storage
- **Tiered Storage**: Hot (recent), Warm (older), Cold (archived)

#### Version Identifier

- **Content-Based**: SHA-256 hash of dataset content
- **Semantic Versioning**: Major.Minor.Patch (e.g., v2.1.0)
- **Timestamp-Based**: YYYY-MM-DD-HHMMSS

#### Metadata Schema

```json
{
  "version_id": "sha256:abc123...",
  "timestamp": "2025-12-13T19:00:00Z",
  "creator": "user@example.com",
  "source": "production_db",
  "lineage": ["sha256:parent1", "sha256:parent2"],
  "schema": {...},
  "statistics": {...},
  "row_count": 1000000,
  "quality_metrics": {...},
  "tags": ["prod", "2025-Q1"],
  "changelog": "Added new features X, Y, Z"
}
```

## Validation Strategy

### Testing Approach

1. **Version Creation**: Test immutability, uniqueness
2. **Version Retrieval**: Test integrity, performance
3. **Lineage Tracking**: Test traceability end-to-end
4. **Model Linkage**: Test bidirectional linkage
5. **Reproducibility**: Test exact model reproduction

### Metrics

- **Version Creation Time**: < 1min for typical dataset
- **Version Retrieval Time**: < 1min for typical dataset
- **Storage Efficiency**: Compression ratio, deduplication savings
- **Lineage Completeness**: 100% of datasets have lineage
- **Model Linkage Coverage**: 100% of models linked to dataset versions

## Evidence Requirements

### Required Documentation

1. **Data Versioning Policy**: Standards, procedures, retention
2. **Dataset Catalog**: All versions, metadata, lineage
3. **Model-Dataset Linkage**: Complete linkage records
4. **Lineage Graphs**: Visual representation of data flow
5. **Reproducibility Tests**: Evidence of successful reproduction

### Evidence Collection

**Metrics**:
- Number of dataset versions
- Storage size and efficiency
- Version retrieval performance
- Model-dataset linkage coverage

**Audit Trail**:
- Version creation logs
- Version retrieval logs
- Lineage tracking records
- Model training logs with dataset references

## Related Controls

### Within EN 18031

- **comp-en18031-009-training-data-quality**: Version control supports quality
- **comp-en18031-016-model-development-lifecycle**: Dataset versions linked to models
- **comp-en18031-007-ai-audit-trail**: Data version history in audit

### Cross-Framework

- **ISO 27001 A.5.10**: Document control
- **ISO 13485 4.2.4**: Record control

## Implementation Notes

### Best Practices

1. **Version Everything**: Raw data, processed data, splits, labels
2. **Use Content Hashing**: Deterministic, collision-resistant version IDs
3. **Track Lineage**: Every transformation recorded
4. **Link Models**: Every model linked to exact dataset versions
5. **Test Reproducibility**: Regularly verify model reproduction works

### Common Pitfalls

- **Pitfall**: Mutable datasets - versions can be changed
  - **Solution**: Use immutable storage; enforce versioning system

- **Pitfall**: Missing lineage - cannot trace data transformations
  - **Solution**: Automate lineage tracking in data pipelines

- **Pitfall**: Broken model-dataset links - cannot reproduce models
  - **Solution**: Enforce linkage at training time; validate links

- **Pitfall**: Storage costs explode with many versions
  - **Solution**: Use deduplication, compression, retention policies

### ML/AI Tooling

**Data Versioning Tools**:
- **DVC (Data Version Control)**: Git-like versioning for data
- **LakeFS**: Git-like operations on data lakes
- **Pachyderm**: Data versioning and pipelines
- **Delta Lake**: ACID transactions, versioning for data lakes
- **MLflow Data**: Track datasets in MLflow

**Storage Backends**:
- **S3, GCS, Azure Blob**: Cloud object storage
- **MinIO**: On-prem S3-compatible storage

## Status

- [ ] Data versioning system selected and deployed
- [ ] Immutable dataset storage configured
- [ ] Version metadata schema defined
- [ ] Dataset registry and catalog operational
- [ ] Lineage tracking implemented in data pipelines
- [ ] Model-dataset linkage automated in training workflows
- [ ] Version comparison tools available
- [ ] Reproducibility tested and verified
- [ ] Retention policies defined and enforced
- [ ] Documentation completed
- [ ] Compliance with EN 18031 6.2.5 verified
