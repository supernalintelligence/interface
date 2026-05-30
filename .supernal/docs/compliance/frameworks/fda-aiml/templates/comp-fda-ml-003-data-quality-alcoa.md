---
id: comp-fda-ml-003
framework: fda-aiml
title: AI/ML Data Quality (ALCOA+)
version: 1.0.0
effectiveDate: 2025-12-13T00:00:00.000Z
status: pending-verification
owner: compliance-team
category: data-management
phase:
  - 2-research
  - 7-build
severity: critical
auditFrequency: per-dataset
relatedCards:
  - comp-fda-ml-001
  - comp-fda-ml-004
  - comp-en18031-009
  - comp-en18031-010
linkedRequirements: []
linkedRisks: []
tags:
  - medical-device
  - ai-ml
  - data-quality
  - ALCOA-plus
  - FDA-guidance
  - training-data
references: []
---

# COMP-FDA-ML-003: AI/ML Data Quality (ALCOA+)

## Regulatory Context

**Standard**: FDA AI/ML Guidance (2021) - Good Machine Learning Practice Principle #2  
**Related**: 21 CFR Part 11 (Electronic Records), GxP (ALCOA+ Principles)  
**Regulatory Impact**: CRITICAL

### Why This Matters

**"Garbage in, garbage out"** - Poor training data quality directly causes:
- ❌ Model learns incorrect patterns → unsafe predictions
- ❌ Bias and discrimination → disparate impact on patient populations
- ❌ Model doesn't generalize → fails on real-world data
- ❌ Regulatory rejection → FDA 483 observations, Warning Letters

**ALCOA+ principles** ensure data integrity throughout the ML lifecycle, from collection to model deployment.

## Standard Requirements

### GMLP Principle #2: Data Quality

**FDA Guidance**: "Ensure datasets are of sufficient quality for their intended purpose"

**ALCOA+ Principles** (from 21 CFR Part 11):
1. **Attributable** - Data source is known
2. **Legible** - Data is readable and understandable
3. **Contemporaneous** - Data recorded at time of event
4. **Original** - Data is the original record (or certified copy)
5. **Accurate** - Data is correct and error-free
6. **+Complete** - All required data is present
7. **+Consistent** - Data is internally consistent
8. **+Enduring** - Data is preserved throughout retention period
9. **+Available** - Data is available for review/audit

## Implementation Requirements

### 1. Attributable (A) - Data Provenance

**Requirement**: Know the source of all training/validation data

**Acceptance Criteria**:

```gherkin
Feature: Data Provenance and Attribution
  As a data quality manager
  I need to know where every piece of training data came from
  So that I can assess data reliability and regulatory compliance

  Scenario: Document Data Sources
    Given a training dataset
    When documenting data provenance
    Then each data point SHALL have source attribution
    And source SHALL include:
      | attribute          | example                              |
      | Institution        | Johns Hopkins Hospital               |
      | Department         | Radiology                            |
      | Collection date    | 2023-01-15                          |
      | Collector          | Dr. Jane Smith                       |
      | Consent type       | Research use, de-identified          |
      | IRB approval       | IRB-2022-12345                       |
      | Data provenance ID | PROV-JHH-RAD-20230115-001           |

  Scenario: Data Lineage Tracking
    Given raw source data
    When transforming data for ML use
    Then all transformations SHALL be tracked
    And lineage SHALL include:
      - Raw data version
      - Transformation pipeline version
      - Transformation timestamp
      - Transformation author
      - Transformation justification
    And lineage SHALL be auditable

    Example:
      """
      Data Lineage:
      1. Raw DICOM images (v1.0) - Collected 2023-01-15, Dr. Smith
      2. DICOM to PNG conversion (pipeline v2.1) - 2023-02-01, Engineer A
      3. Image normalization (pipeline v2.1) - 2023-02-01, Engineer A
      4. Training set split (80/20) (script v1.5) - 2023-02-05, Data Scientist B
      """

  Scenario: External Data Sources
    Given data from external sources (public datasets, vendors)
    When incorporating external data
    Then external source SHALL be documented
    And license SHALL be verified (commercial use allowed?)
    And data quality SHALL be assessed
    And external data versioning SHALL be tracked

    Examples:
      | source              | license       | version | quality_assessment        |
      | NIH ChestX-ray14    | Public Domain | v1.0    | PASS (peer-reviewed)      |
      | Vendor dataset      | Commercial    | 2.3     | PASS (vendor validation)  |
      | Kaggle competition  | CC BY 4.0     | N/A     | FAIL (unverified quality) |
```

### 2. Legible (L) - Data Readability

**Requirement**: Data is readable, understandable, and interpretable

**Acceptance Criteria**:

```gherkin
Feature: Data Legibility and Interpretability
  As a data scientist
  I need data to be readable and understandable
  So that I can correctly use it for model training

  Scenario: Data Format Documentation
    Given a training dataset
    When documenting data format
    Then data schema SHALL be documented
    And field definitions SHALL be provided
    And units of measurement SHALL be specified
    And encoding SHALL be specified (UTF-8, etc.)
    And examples SHALL be provided

    Example:
      """yaml
      dataset: patient_vitals.csv
      schema:
        - field: patient_id
          type: string
          format: UUID v4
          example: "550e8400-e29b-41d4-a716-446655440000"
        
        - field: systolic_bp
          type: integer
          unit: mmHg
          range: [60, 250]
          example: 120
        
        - field: diastolic_bp
          type: integer
          unit: mmHg
          range: [40, 150]
          example: 80
        
        - field: measurement_timestamp
          type: datetime
          format: ISO 8601
          timezone: UTC
          example: "2023-01-15T14:30:00Z"
      """

  Scenario: Medical Terminology Standardization
    Given medical data (diagnoses, procedures, medications)
    When encoding data
    Then standard medical terminologies SHALL be used
    
    Examples:
      | data_type      | standard_terminology      |
      | Diagnoses      | ICD-10-CM                 |
      | Procedures     | CPT, ICD-10-PCS           |
      | Medications    | RxNorm                    |
      | Lab results    | LOINC                     |
      | Clinical data  | SNOMED CT                 |

  Scenario: Data Dictionary
    Given a training dataset
    When preparing documentation
    Then data dictionary SHALL be provided
    And dictionary SHALL include:
      - Field names and descriptions
      - Data types and formats
      - Valid value ranges
      - Relationships between fields
      - Missing value handling
```

### 3. Contemporaneous (C) - Timely Recording

**Requirement**: Data recorded at or near the time of the event

**Acceptance Criteria**:

```gherkin
Feature: Contemporaneous Data Recording
  As a data quality auditor
  I need data recorded at the time of the event
  So that data accuracy and reliability are ensured

  Scenario: Timestamp Verification
    Given collected medical data
    When verifying timestamps
    Then collection timestamp SHALL be within reasonable time of event
    And delayed recordings SHALL be flagged
    And reason for delay SHALL be documented

    Examples:
      | event                  | collection_time | delay  | acceptable? | reason                       |
      | Blood pressure reading | Real-time       | 0s     | ✅ Yes      | N/A                          |
      | Radiology report       | +2 hours        | 2h     | ✅ Yes      | Radiologist review time      |
      | Retrospective chart    | +6 months       | 6mo    | ⚠️ Maybe    | Must document & justify      |

  Scenario: Batch Upload Verification
    Given data uploaded in batches
    When reviewing upload logs
    Then upload timestamp SHALL be tracked
    And batch size SHALL be tracked
    And data collection date range SHALL be documented
    And batch upload delays SHALL be justified
```

### 4. Original (O) - Original Records

**Requirement**: Use original data or certified true copies

**Acceptance Criteria**:

```gherkin
Feature: Original Data Integrity
  As a regulatory compliance officer
  I need original data or certified copies
  So that data authenticity is guaranteed

  Scenario: Original Data Retention
    Given medical device training data
    When managing data
    Then original raw data SHALL be retained
    And original data SHALL NOT be modified (immutable)
    And modifications SHALL create new versions (copy-on-write)
    And original data retention period SHALL be defined (e.g., 10 years)

  Scenario: Data Copies and Transformations
    Given transformed/processed data
    When creating derived datasets
    Then original data SHALL be preserved
    And transformation SHALL create new version
    And transformation SHALL be documented
    And both original and transformed SHALL be retained

  Scenario: Data Migration
    Given data storage migration
    When migrating to new system
    Then data integrity SHALL be verified (checksums, hashes)
    And migration SHALL be audited
    And migration report SHALL document:
      - Source system
      - Destination system
      - Migration date
      - Data integrity verification results
      - Any data loss or corruption
```

### 5. Accurate (A) - Data Correctness

**Requirement**: Data is correct, complete, and error-free

**Acceptance Criteria**:

```gherkin
Feature: Data Accuracy Verification
  As a machine learning engineer
  I need accurate training data
  So that models learn correct patterns

  Scenario: Data Validation Rules
    Given incoming training data
    When validating data
    Then validation rules SHALL be applied

    Examples of validation rules:
      | field          | validation_rule                           | example_failure           |
      | age            | >= 0 AND <= 120                          | age = -5 (invalid)        |
      | blood_pressure | systolic > diastolic                     | 80/120 (reversed)         |
      | diagnosis_code | Valid ICD-10-CM code                     | "ABC123" (invalid format) |
      | lab_result     | Within physiological range               | Glucose = 10,000 (outlier)|

  Scenario: Outlier Detection
    Given numerical training data
    When detecting outliers
    Then statistical outlier detection SHALL be applied
    And outliers SHALL be reviewed by domain expert
    And outlier handling SHALL be documented (remove, keep, flag)

    Example:
      """python
      # Outlier detection for systolic blood pressure
      def detect_outliers_iqr(data, field):
          Q1 = data[field].quantile(0.25)
          Q3 = data[field].quantile(0.75)
          IQR = Q3 - Q1
          lower_bound = Q1 - 1.5 * IQR
          upper_bound = Q3 + 1.5 * IQR
          outliers = data[(data[field] < lower_bound) | (data[field] > upper_bound)]
          return outliers
      
      # Systolic BP outliers: < 70 or > 180 mmHg
      outliers = detect_outliers_iqr(patient_data, 'systolic_bp')
      # Review by cardiologist required
      """

  Scenario: Label Quality Assurance
    Given labeled training data (supervised learning)
    When assessing label quality
    Then inter-rater agreement SHALL be measured (if multiple labelers)
    And Kappa score SHALL be >= 0.8 (substantial agreement)
    And label errors SHALL be reviewed and corrected
    And label quality metrics SHALL be documented

  Scenario: Data Cleaning Documentation
    Given data cleaning activities
    When documenting cleaning
    Then all cleaning steps SHALL be documented
    And rationale for each step SHALL be provided
    And before/after statistics SHALL be recorded
    And review/approval SHALL be obtained

    Example:
      """
      Data Cleaning Log:
      1. Removed 23 records with missing diagnosis codes
         Rationale: Cannot train without labels
         Approved by: Dr. Smith (2023-02-15)
      
      2. Corrected 5 records with reversed BP values
         Rationale: Systolic < Diastolic (physiologically impossible)
         Approved by: Data Quality Team (2023-02-16)
      
      3. Capped 12 outlier glucose values at 99th percentile
         Rationale: Outliers > 1000 mg/dL likely measurement errors
         Approved by: Dr. Johnson (2023-02-17)
      """
```

### 6. Complete (+) - Data Completeness

**Requirement**: All required data fields are present

**Acceptance Criteria**:

```gherkin
Feature: Data Completeness
  As a data quality engineer
  I need complete training data
  So that models have all necessary information

  Scenario: Missing Data Assessment
    Given a training dataset
    When assessing completeness
    Then missing data percentage SHALL be calculated per field
    And acceptable missing data thresholds SHALL be defined
    And fields with excessive missing data SHALL be flagged

    Examples:
      | field                 | missing_% | threshold | action           |
      | patient_id            | 0%        | 0%        | ✅ Complete      |
      | diagnosis_code        | 2%        | 5%        | ✅ Acceptable    |
      | optional_notes        | 80%       | N/A       | ⚠️ Consider drop |
      | critical_lab_value    | 15%       | 5%        | ❌ Reject        |

  Scenario: Missing Data Handling
    Given fields with missing data
    When preparing training data
    Then missing data strategy SHALL be documented

    Examples:
      | field_type   | missing_strategy                          | justification                   |
      | Critical     | Drop records with missing values          | Cannot impute critical safety data |
      | Numerical    | Median imputation (within group)          | Preserves distribution          |
      | Categorical  | Mode imputation or "Unknown" category     | Explicit unknown handling       |
      | Time-series  | Forward-fill or interpolation             | Temporal continuity             |

  Scenario: Feature Engineering Completeness
    Given engineered features
    When creating derived features
    Then feature engineering SHALL NOT introduce missing values
    And exceptions SHALL be documented and justified
```

### 7. Consistent (+) - Data Consistency

**Requirement**: Data is internally consistent (no contradictions)

**Acceptance Criteria**:

```gherkin
Feature: Data Consistency Verification
  As a data integrity auditor
  I need consistent data
  So that data reliability is ensured

  Scenario: Cross-Field Consistency Checks
    Given multi-field medical records
    When checking consistency
    Then consistency rules SHALL be applied

    Examples of consistency rules:
      | field_1         | field_2           | consistency_rule                           |
      | age             | date_of_birth     | age = (today - DOB) / 365                  |
      | diagnosis       | medication        | medication appropriate for diagnosis        |
      | pregnancy       | sex               | pregnancy = yes → sex = female              |
      | death_date      | visit_date        | death_date >= all visit_dates               |

  Scenario: Temporal Consistency
    Given time-series medical data
    When checking temporal consistency
    Then events SHALL be in chronological order
    And timestamps SHALL be in correct timezone
    And future timestamps SHALL be flagged (data collection error)

  Scenario: Multi-Source Consistency
    Given data from multiple sources
    When integrating sources
    Then overlapping data SHALL be checked for consistency
    And conflicts SHALL be resolved with documented rationale
    And resolution SHALL be approved by domain expert
```

### 8. Enduring (+) - Data Retention

**Requirement**: Data is preserved throughout retention period

**Acceptance Criteria**:

```gherkin
Feature: Data Retention and Preservation
  As a compliance officer
  I need data preserved for regulatory retention period
  So that audits and investigations are supported

  Scenario: Define Retention Period
    Given medical device training data
    When defining retention requirements
    Then retention period SHALL be defined (e.g., 10 years post-device life)
    And retention SHALL comply with:
      - FDA 21 CFR 820.180 (device records retention)
      - HIPAA minimum necessary
      - State/local regulations
      - Institutional policies

  Scenario: Data Backup and Recovery
    Given training data storage
    When implementing data retention
    Then automated backups SHALL be configured
    And backup frequency SHALL be defined (daily/weekly)
    And backup integrity SHALL be verified
    And recovery procedures SHALL be tested
    And off-site backup SHALL be maintained (disaster recovery)

  Scenario: Data Immutability
    Given retained training data
    When storing data
    Then data SHALL be write-once (immutable after finalization)
    And modifications SHALL be prevented (technical controls)
    And any access SHALL be logged (audit trail)
```

### 9. Available (+) - Data Availability

**Requirement**: Data is available for review and audit

**Acceptance Criteria**:

```gherkin
Feature: Data Availability for Audit
  As an FDA auditor
  I need access to training data
  So that I can verify model development and compliance

  Scenario: Data Access for Regulatory Review
    Given regulatory inspection
    When auditor requests training data
    Then data SHALL be retrievable within 24-48 hours
    And data SHALL be in human-readable format
    And data dictionary SHALL be provided
    And data provenance SHALL be provided
    And access logs SHALL show who accessed data and when

  Scenario: Audit Trail
    Given training data access
    When data is accessed
    Then audit log SHALL record:
      - User ID
      - Timestamp
      - Action (read, export, transform)
      - Data subset accessed
      - IP address
      - Justification (ticket ID, audit request)
    And audit logs SHALL be immutable
    And audit logs SHALL be retained for 10+ years
```

## Technical Implementation

### Data Quality Pipeline

```python
"""
ALCOA+ Data Quality Pipeline
Ensures training data meets FDA standards
"""

import pandas as pd
import hashlib
from datetime import datetime
from typing import Dict, List, Any

class ALCOAPlusDataQuality:
    """Enforce ALCOA+ principles for ML training data"""
    
    def __init__(self, dataset_path: str, provenance_config: Dict):
        self.dataset_path = dataset_path
        self.provenance = provenance_config
        self.audit_log = []
        
    # A: Attributable
    def add_provenance(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add data provenance metadata"""
        df['data_provenance_id'] = self.provenance['provenance_id']
        df['data_source'] = self.provenance['source']
        df['collection_date'] = pd.to_datetime(self.provenance['collection_date'])
        df['irb_approval'] = self.provenance['irb_approval']
        
        self._log_action("Added provenance metadata", len(df))
        return df
    
    # L: Legible
    def validate_schema(self, df: pd.DataFrame, schema: Dict) -> pd.DataFrame:
        """Validate data against schema"""
        for field, field_schema in schema.items():
            if field not in df.columns:
                raise ValueError(f"Missing required field: {field}")
            
            # Type validation
            expected_dtype = field_schema['type']
            if df[field].dtype != expected_dtype:
                try:
                    df[field] = df[field].astype(expected_dtype)
                except:
                    raise ValueError(f"Field {field} cannot be converted to {expected_dtype}")
        
        self._log_action("Schema validation passed", len(df))
        return df
    
    # C: Contemporaneous
    def verify_timeliness(self, df: pd.DataFrame, 
                          timestamp_field: str, 
                          max_delay_hours: int = 48) -> pd.DataFrame:
        """Flag records with delayed timestamps"""
        now = pd.Timestamp.now()
        df['recording_delay_hours'] = (now - pd.to_datetime(df[timestamp_field])).dt.total_seconds() / 3600
        
        delayed = df[df['recording_delay_hours'] > max_delay_hours]
        if len(delayed) > 0:
            print(f"⚠️ Warning: {len(delayed)} records delayed > {max_delay_hours} hours")
        
        self._log_action("Timeliness verification", len(df))
        return df
    
    # O: Original
    def calculate_checksum(self, df: pd.DataFrame) -> str:
        """Calculate dataset checksum for integrity verification"""
        data_str = df.to_csv(index=False)
        checksum = hashlib.sha256(data_str.encode()).hexdigest()
        
        self._log_action("Calculated checksum", checksum=checksum)
        return checksum
    
    # A: Accurate
    def validate_data_ranges(self, df: pd.DataFrame, 
                             range_rules: Dict) -> pd.DataFrame:
        """Validate data against physiological/logical ranges"""
        invalid_records = []
        
        for field, (min_val, max_val) in range_rules.items():
            invalid = df[(df[field] < min_val) | (df[field] > max_val)]
            if len(invalid) > 0:
                print(f"❌ Invalid values in {field}: {len(invalid)} records")
                invalid_records.extend(invalid.index.tolist())
        
        if invalid_records:
            raise ValueError(f"Data validation failed: {len(set(invalid_records))} invalid records")
        
        self._log_action("Range validation passed", len(df))
        return df
    
    def detect_outliers_iqr(self, df: pd.DataFrame, 
                            field: str, 
                            multiplier: float = 1.5) -> pd.DataFrame:
        """Detect outliers using IQR method"""
        Q1 = df[field].quantile(0.25)
        Q3 = df[field].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - multiplier * IQR
        upper_bound = Q3 + multiplier * IQR
        
        outliers = df[(df[field] < lower_bound) | (df[field] > upper_bound)]
        df[f'{field}_outlier'] = df[field].apply(
            lambda x: x < lower_bound or x > upper_bound
        )
        
        print(f"ℹ️ Detected {len(outliers)} outliers in {field}")
        self._log_action(f"Outlier detection: {field}", outliers_detected=len(outliers))
        
        return df
    
    # +Complete
    def assess_completeness(self, df: pd.DataFrame, 
                           required_fields: List[str],
                           thresholds: Dict[str, float]) -> pd.DataFrame:
        """Assess data completeness"""
        completeness_report = {}
        
        for field in required_fields:
            missing_pct = df[field].isna().sum() / len(df) * 100
            completeness_report[field] = {
                'missing_pct': missing_pct,
                'threshold': thresholds.get(field, 5.0),
                'acceptable': missing_pct <= thresholds.get(field, 5.0)
            }
            
            if not completeness_report[field]['acceptable']:
                print(f"❌ {field}: {missing_pct:.2f}% missing (threshold: {thresholds[field]}%)")
        
        self._log_action("Completeness assessment", report=completeness_report)
        
        failing_fields = [f for f, r in completeness_report.items() if not r['acceptable']]
        if failing_fields:
            raise ValueError(f"Completeness check failed for fields: {failing_fields}")
        
        return df
    
    # +Consistent
    def check_consistency(self, df: pd.DataFrame, 
                         consistency_rules: List[Dict]) -> pd.DataFrame:
        """Check cross-field consistency"""
        inconsistencies = []
        
        for rule in consistency_rules:
            rule_name = rule['name']
            check_fn = rule['check']
            
            violations = df[~df.apply(check_fn, axis=1)]
            if len(violations) > 0:
                print(f"❌ Consistency rule '{rule_name}' violated: {len(violations)} records")
                inconsistencies.append({
                    'rule': rule_name,
                    'violations': len(violations),
                    'records': violations.index.tolist()
                })
        
        if inconsistencies:
            raise ValueError(f"Consistency check failed: {len(inconsistencies)} rule violations")
        
        self._log_action("Consistency check passed", len(df))
        return df
    
    # +Enduring & +Available
    def save_with_audit(self, df: pd.DataFrame, output_path: str):
        """Save dataset with audit trail"""
        # Save data
        df.to_csv(output_path, index=False)
        
        # Save metadata
        metadata = {
            'provenance': self.provenance,
            'checksum': self.calculate_checksum(df),
            'record_count': len(df),
            'created_timestamp': datetime.now().isoformat(),
            'audit_log': self.audit_log
        }
        
        metadata_path = output_path.replace('.csv', '_metadata.json')
        import json
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"✅ Dataset saved with ALCOA+ compliance: {output_path}")
        print(f"✅ Metadata saved: {metadata_path}")
    
    def _log_action(self, action: str, record_count: int = None, **kwargs):
        """Internal audit logging"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'action': action,
            'record_count': record_count,
            **kwargs
        }
        self.audit_log.append(log_entry)


# Example usage
if __name__ == "__main__":
    provenance = {
        'provenance_id': 'PROV-JHH-RAD-20230115-001',
        'source': 'Johns Hopkins Hospital - Radiology',
        'collection_date': '2023-01-15',
        'irb_approval': 'IRB-2022-12345'
    }
    
    dq = ALCOAPlusDataQuality('patient_data.csv', provenance)
    
    # Load data
    df = pd.read_csv('patient_data.csv')
    
    # Apply ALCOA+ checks
    df = dq.add_provenance(df)
    df = dq.validate_schema(df, schema={...})
    df = dq.verify_timeliness(df, 'measurement_timestamp')
    df = dq.validate_data_ranges(df, {'systolic_bp': (60, 250), 'age': (0, 120)})
    df = dq.assess_completeness(df, ['patient_id', 'diagnosis_code'], {'patient_id': 0, 'diagnosis_code': 5})
    df = dq.check_consistency(df, consistency_rules=[...])
    
    # Save with audit trail
    dq.save_with_audit(df, 'patient_data_alcoa_compliant.csv')
```

## Compliance Evidence

### Required Records

1. **Data Provenance Documentation** - Source, collection, lineage
2. **Data Schema and Dictionary** - Field definitions, formats, units
3. **Data Validation Reports** - Range checks, outlier detection
4. **Data Cleaning Logs** - All cleaning steps with rationale
5. **Completeness Assessment** - Missing data analysis
6. **Consistency Check Results** - Cross-field consistency verification
7. **Data Quality Metrics** - Accuracy, completeness, consistency scores
8. **Audit Trail** - All data access and modifications
9. **Retention Policy** - Defined retention periods and backup procedures

### Audit Expectations

**Auditor Will Check**:
1. Data provenance documented (source, collection date, IRB approval)
2. Data quality checks performed (validation, outliers, consistency)
3. Missing data assessed and handled appropriately
4. Label quality verified (inter-rater agreement if applicable)
5. Data cleaning documented with rationale
6. Original data retained (immutable)
7. Audit trail present (data access logs)
8. Data available for review

**Common Findings**:
- ❌ No data provenance documentation
- ❌ No validation of data ranges (outliers not detected)
- ❌ Missing data not assessed or handled
- ❌ No inter-rater agreement for labels
- ❌ Data cleaning not documented
- ❌ Original data not retained (only processed data)
- ❌ No audit trail for data access

## Related Standards

- **FDA 21 CFR Part 11** - Electronic records and signatures (ALCOA principles)
- **GxP** - Good Automated Manufacturing Practice (ALCOA+ principles)
- **GMLP Principle #2** - Data quality
- **ISO 15189** - Medical laboratories (data quality)
- **HIPAA** - Data integrity and availability

## Integration with Other Cards

- **COMP-FDA-ML-001**: GMLP Principle #2 (Data Quality)
- **COMP-FDA-ML-004**: Dataset Relevance (complements data quality)
- **COMP-EN18031-009**: Data Quality (trustworthiness)
- **COMP-EN18031-010**: Data Bias Detection
- **COMP-IEC62304-003**: Requirements include data quality requirements

## Revision History

| Version | Date       | Changes                          | Author |
|---------|------------|----------------------------------|--------|
| 1.0.0   | 2025-12-13 | Initial compliance card creation | AI/ML Compliance Team |

---

**Document Control**: This compliance card is maintained under configuration management. Updates require approval from Quality Assurance and Regulatory Affairs.

**Next Review Date**: 2026-12-13 or upon FDA guidance update

