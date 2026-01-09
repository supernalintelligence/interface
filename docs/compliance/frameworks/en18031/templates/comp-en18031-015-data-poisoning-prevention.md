---
id: comp-en18031-015-data-poisoning-prevention
title: COMP-EN18031-015 - Data Poisoning Prevention
purpose: Prevent adversarial data poisoning attacks that corrupt training data to manipulate AI model behavior
en18031Control: 6.2.6
category: ai-security
priority: high
framework: EN 18031
sidebar_label: COMP-EN18031-015
sidebar_position: 15
crossFramework:
  iso42001: 8.27 (AI System Security)
  euAiAct: Article 15 (Accuracy, Robustness, Cybersecurity)
  nistAiRmf: Manage 4.2, Measure 2.13
  iso27001: 066 (Protection against Malware), 067 (Management of Technical Vulnerabilities)
status: pending-verification
references: []
---

# COMP-EN18031-015: Data Poisoning Prevention

## Overview

**Purpose**: Prevent adversarial data poisoning attacks that inject malicious or corrupted data into training datasets to manipulate AI model behavior, degrade performance, or introduce backdoors  
**EN 18031 Control**: 6.2.6 - Data Poisoning Prevention  
**Category**: ai-security  
**Priority**: high  
**Framework**: EN 18031

## Regulatory Context

### EN 18031 Alignment

- **6.2.6**: Data Poisoning Prevention - Protect training data integrity
- **Related Controls**:
  - 6.2.1: Training Data Quality (poisoning degrades quality)
  - 6.3.4: Model Security Scanning (detect poisoned model behaviors)
  - 6.5.1: AI System Monitoring (detect poisoning in production)

### Cross-Framework Mapping

- **ISO/IEC 42001**: 
  - 8.27: AI System Security - Protect against AI-specific threats
  - 6.1.2: Risk Assessment - Include data poisoning risks

- **EU AI Act**: 
  - Article 15: Accuracy, Robustness, and Cybersecurity - Resilience to attacks
  - Recital 74: Cybersecurity measures for high-risk AI

- **NIST AI RMF**: 
  - MANAGE-4.2: Strategies to maximize AI system resilience are directed and monitored
  - MEASURE-2.13: AI system resilience is characterized

- **ISO 27001**: 
  - A.8.7 (066): Protection against Malware
  - A.8.8 (067): Management of Technical Vulnerabilities

## Description

Implements EN 18031 Section 6.2.6 to protect AI training data from poisoning attacks. Data poisoning is an adversarial attack where an attacker injects malicious data into the training dataset to:

1. **Degrade Model Performance**: Cause model to perform poorly overall
2. **Targeted Misclassification**: Cause model to misclassify specific inputs
3. **Backdoor Attacks**: Introduce hidden triggers that cause specific behaviors
4. **Bias Injection**: Amplify bias against specific groups
5. **Availability Attacks**: Cause model training to fail or take excessive time

### Types of Data Poisoning

1. **Label Flipping**: Change correct labels to incorrect labels
2. **Data Injection**: Add malicious samples to training data
3. **Feature Manipulation**: Modify features in existing samples
4. **Backdoor Poisoning**: Inject trigger patterns linked to target labels
5. **Clean-Label Poisoning**: Poison data without changing labels
6. **Availability Poisoning**: Inject data that makes training unstable

### Attack Vectors

- **Untrusted Data Sources**: Publicly available datasets, web scraping
- **User-Generated Content**: Crowdsourced labels, user uploads
- **Third-Party Data Providers**: Compromised or malicious vendors
- **Insider Threats**: Malicious employees or contractors
- **Supply Chain Attacks**: Compromised data processing tools

## Acceptance Criteria

```gherkin
Feature: Data Source Trust and Validation
  As an AI Security Engineer
  I want to validate and trust data sources
  So that only high-quality, untampered data enters training pipeline

  Background:
    Given the organization trains AI models
    And training data comes from multiple sources
    And EN 18031 requires data poisoning prevention

  Scenario: Data Source Assessment
    Given a new data source is proposed
    When data source is assessed
    Then source trustworthiness shall be evaluated
    And source shall be classified by risk level (trusted, semi-trusted, untrusted)
    And source security practices shall be reviewed
    And source integrity guarantees shall be verified
    And risk assessment shall be documented
    And only approved sources shall be used

  Scenario: Data Integrity Verification
    Given data is received from external source
    When data integrity is verified
    Then data provenance shall be validated
    And data checksums or signatures shall be verified
    And data tampering shall be detected
    And tampered data shall be rejected
    And verification shall be logged
    And integrity failures shall trigger investigation

  Scenario: Data Source Monitoring
    Given data sources are in use
    When data sources are monitored
    Then source reliability shall be tracked
    And anomalies in source behavior shall be detected
    And source reputation shall be updated
    And compromised sources shall be identified
    And monitoring alerts shall be generated
    And sources shall be re-assessed periodically

Feature: Anomaly Detection in Training Data
  As an AI Data Scientist
  I want to detect anomalies in training data
  So that poisoned data is identified before model training

  Scenario: Statistical Anomaly Detection
    Given training data is prepared
    When anomalies are detected
    Then outliers shall be identified using statistical methods
    And distribution shifts shall be detected
    And label distribution anomalies shall be flagged
    And feature correlation anomalies shall be detected
    And anomalies shall be reviewed by humans
    And anomalous data shall be quarantined

  Scenario: Clustering-Based Poisoning Detection
    Given training data contains potential poisoning
    When clustering analysis is performed
    Then data shall be clustered by similarity
    And isolated clusters shall be flagged as suspicious
    And samples far from cluster centers shall be reviewed
    And backdoor triggers (patterns) shall be detected
    And suspicious samples shall be investigated
    And confirmed poisoning shall be removed

  Scenario: Label Consistency Validation
    Given labeled training data is available
    When label consistency is validated
    Then labels shall be checked against heuristics
    And conflicting labels for similar samples shall be identified
    And label flipping patterns shall be detected
    And suspicious labels shall be re-annotated
    And label quality shall be measured
    And label inconsistencies shall be resolved

Feature: Robust Training Techniques
  As an ML Engineer
  I want to use robust training techniques
  So that models are resilient to poisoned data

  Scenario: Robust Loss Functions
    Given model training uses loss function
    When robust loss function is selected
    Then loss function shall be resistant to outliers
    And loss function shall down-weight suspicious samples
    And robust loss (e.g., MAE, Huber) shall be preferred over MSE
    And loss function resilience shall be validated
    And training robustness shall be measured

  Scenario: Data Sanitization Before Training
    Given training data may contain poisoning
    When data is sanitized before training
    Then outliers shall be removed or down-weighted
    And anomalous samples shall be filtered
    And high-loss samples shall be reviewed
    And iterative sanitization shall be performed
    And sanitization effectiveness shall be measured
    And sanitized dataset shall be documented

  Scenario: Robust Training Algorithms
    Given model training is susceptible to poisoning
    When robust training algorithm is used
    Then algorithm shall detect and reject poisoned samples during training
    And algorithm (e.g., RONI, Certified Defenses) shall be selected
    And algorithm robustness shall be validated
    And training with and without poisoning shall be compared
    And robustness guarantees shall be documented

Feature: Backdoor Detection in Models
  As an AI Security Analyst
  I want to detect backdoors in trained models
  So that backdoored models are not deployed

  Scenario: Model Behavior Analysis
    Given model is trained on potentially poisoned data
    When model behavior is analyzed
    Then model predictions shall be tested on diverse inputs
    And unexpected predictions shall be flagged
    And model shall be tested for trigger patterns
    And backdoor triggers shall be discovered (if present)
    And trigger discovery techniques (e.g., Neural Cleanse) shall be used
    And backdoored models shall be rejected

  Scenario: Model Weight Analysis
    Given model weights may indicate backdoor
    When model weights are analyzed
    Then weight distributions shall be examined
    And anomalous neurons shall be identified
    And neuron activation patterns shall be analyzed
    And backdoor neurons shall be detected and pruned
    And model performance after pruning shall be validated
    And weight analysis results shall be documented

  Scenario: Model Provenance Verification
    Given model training process is recorded
    When model provenance is verified
    Then training data lineage shall be verified
    And training process integrity shall be validated
    And training logs shall be audited for anomalies
    And model provenance shall be complete and tamper-evident
    And provenance gaps shall trigger re-training
    And provenance shall support backdoor investigation

Feature: Access Control and Data Pipeline Security
  As a Platform Security Engineer
  I want to secure data pipelines and access
  So that unauthorized data poisoning is prevented

  Scenario: Data Pipeline Access Control
    Given data flows through pipelines to training
    When access controls are enforced
    Then only authorized users shall modify training data
    And data pipeline access shall be logged
    And least privilege principle shall be enforced
    And access reviews shall be conducted regularly
    And unauthorized access attempts shall be detected and blocked
    And access control compliance shall be verified

  Scenario: Data Immutability and Versioning
    Given training data is finalized
    When data immutability is enforced
    Then training data shall be stored immutably
    And data changes shall be prevented
    And data versions shall be tracked (see comp-en18031-014)
    And unauthorized modifications shall be detected
    And data integrity shall be cryptographically verified
    And immutability shall be enforced by infrastructure

  Scenario: Secure Data Storage
    Given training data is stored
    When data storage security is implemented
    Then data shall be encrypted at rest
    And data access shall be authenticated and authorized
    And data storage shall be tamper-evident
    And storage access logs shall be monitored
    And storage security shall meet security standards
    And security configuration shall be audited regularly

Feature: Monitoring and Incident Response
  As an AI Ops Engineer
  I want to monitor for poisoning and respond to incidents
  So that poisoning attacks are detected and mitigated quickly

  Scenario: Continuous Monitoring for Poisoning
    Given AI system is in production
    When continuous monitoring is performed
    Then data sources shall be monitored for changes
    And model performance shall be monitored for degradation
    And unexpected model behaviors shall be detected
    And poisoning indicators shall trigger alerts
    And monitoring dashboard shall show poisoning metrics
    And monitoring shall be automated

  Scenario: Poisoning Incident Response
    Given potential poisoning is detected
    When incident response is initiated
    Then poisoning shall be investigated immediately
    And affected models shall be quarantined
    And poisoning source shall be identified
    And compromised data shall be removed
    And models shall be retrained on clean data
    And incident shall be documented
    And lessons learned shall be incorporated

  Scenario: Model Rollback on Poisoning Detection
    Given deployed model is suspected to be poisoned
    When poisoning is confirmed
    Then model shall be rolled back to previous clean version
    And rollback shall be executed quickly (minutes)
    And rollback process shall be tested regularly
    And rollback shall be documented
    And root cause shall be investigated
    And preventive measures shall be implemented

Feature: Adversarial Testing for Poisoning Resilience
  As an AI Red Team Member
  I want to test models against poisoning attacks
  So that poisoning resilience is validated

  Scenario: Simulated Poisoning Attacks
    Given model is ready for adversarial testing
    When poisoning attacks are simulated
    Then various poisoning attack types shall be tested
    And poisoning attack success rate shall be measured
    And model resilience shall be quantified
    And attack simulations shall be realistic
    And testing shall cover multiple threat scenarios
    And test results shall inform defenses

  Scenario: Poisoning Detection Validation
    Given poisoning detection mechanisms are in place
    When detection mechanisms are validated
    Then detection shall be tested with known poisoning
    And detection accuracy (true positive, false positive rate) shall be measured
    And detection performance shall meet requirements
    And detection blind spots shall be identified
    And detection shall be continuously improved
    And validation results shall be documented

  Scenario: Compliance Verification
    Given EN 18031 and EU AI Act require security
    When compliance audit is performed
    Then data poisoning prevention measures shall be documented
    And data source validation shall be demonstrated
    And anomaly detection shall be operational
    And access controls shall be verified
    And incident response procedures shall be tested
    And compliance with EN 18031 6.2.6 shall be verified
```

## Technical Context

### Data Poisoning Attack Surface

```
┌─────────────────────────────────────────────────────┐
│            Attack Vectors                           │
├─────────────┬───────────────┬───────────────────────┤
│ Untrusted   │ User Content  │ Third-Party Providers │
│ Sources     │               │                       │
└──────┬──────┴───────┬───────┴───────────┬───────────┘
       │              │                   │
       ▼              ▼                   ▼
┌──────────────────────────────────────────────────────┐
│         Data Ingestion & Validation                  │
│  • Source verification                               │
│  • Integrity checks                                  │
│  • Anomaly detection                                 │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│         Training Data Store                          │
│  • Access control                                    │
│  • Immutability                                      │
│  • Versioning                                        │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│         Model Training                               │
│  • Robust training                                   │
│  • Sanitization                                      │
│  • Monitoring                                        │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│         Model Validation                             │
│  • Backdoor detection                                │
│  • Behavior testing                                  │
│  • Provenance verification                           │
└──────────────────────────────────────────────────────┘
```

### Implementation Pattern: Anomaly Detection for Poisoning

```python
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.cluster import DBSCAN
from scipy.stats import zscore

class DataPoisoningDetector:
    def __init__(self):
        self.anomaly_detector = IsolationForest(contamination=0.01)
        self.label_consistency_checker = LabelConsistencyChecker()
    
    def detect_statistical_anomalies(self, dataset):
        """Detect statistical outliers in dataset"""
        anomalies = []
        
        # Z-score based outlier detection
        for column in dataset.select_dtypes(include=[np.number]).columns:
            z_scores = np.abs(zscore(dataset[column]))
            outlier_indices = np.where(z_scores > 3)[0]
            anomalies.extend([
                {
                    'index': idx,
                    'type': 'statistical_outlier',
                    'column': column,
                    'z_score': z_scores[idx]
                }
                for idx in outlier_indices
            ])
        
        return anomalies
    
    def detect_clustering_anomalies(self, features, labels):
        """Detect samples far from their class cluster"""
        anomalies = []
        
        for label in np.unique(labels):
            # Get samples for this class
            class_indices = np.where(labels == label)[0]
            class_features = features[class_indices]
            
            # Clustering to find outliers
            clustering = DBSCAN(eps=0.5, min_samples=5).fit(class_features)
            
            # Samples labeled as noise (-1) are anomalies
            noise_indices = np.where(clustering.labels_ == -1)[0]
            
            anomalies.extend([
                {
                    'index': class_indices[idx],
                    'type': 'clustering_outlier',
                    'label': label
                }
                for idx in noise_indices
            ])
        
        return anomalies
    
    def detect_label_flipping(self, features, labels):
        """Detect potential label flipping attacks"""
        anomalies = []
        
        # Train model on data
        from sklearn.ensemble import RandomForestClassifier
        model = RandomForestClassifier()
        model.fit(features, labels)
        
        # Get prediction confidence
        probabilities = model.predict_proba(features)
        predicted_labels = model.predict(features)
        
        # Samples where predicted label differs from actual and confidence is high
        for idx in range(len(labels)):
            if predicted_labels[idx] != labels[idx]:
                confidence = probabilities[idx][predicted_labels[idx]]
                if confidence > 0.8:  # High confidence but wrong label
                    anomalies.append({
                        'index': idx,
                        'type': 'label_flipping',
                        'actual_label': labels[idx],
                        'predicted_label': predicted_labels[idx],
                        'confidence': confidence
                    })
        
        return anomalies
    
    def detect_backdoor_triggers(self, features, labels):
        """Detect potential backdoor trigger patterns"""
        # Activation Clustering: cluster by model activations
        # Neural Cleanse: reverse-engineer triggers
        # Implementation depends on model architecture
        
        trigger_candidates = []
        
        # Example: Look for rare but consistent patterns
        from sklearn.cluster import KMeans
        kmeans = KMeans(n_clusters=10)
        clusters = kmeans.fit_predict(features)
        
        for cluster_id in range(10):
            cluster_indices = np.where(clusters == cluster_id)[0]
            cluster_labels = labels[cluster_indices]
            
            # If small cluster with uniform label (potential trigger)
            if len(cluster_indices) < 0.01 * len(labels):
                if len(np.unique(cluster_labels)) == 1:
                    trigger_candidates.append({
                        'cluster_id': cluster_id,
                        'size': len(cluster_indices),
                        'target_label': cluster_labels[0],
                        'indices': cluster_indices.tolist()
                    })
        
        return trigger_candidates
    
    def sanitize_dataset(self, features, labels, anomalies):
        """Remove or down-weight anomalous samples"""
        anomaly_indices = set([a['index'] for a in anomalies])
        
        # Option 1: Remove anomalies
        clean_indices = [i for i in range(len(labels)) if i not in anomaly_indices]
        clean_features = features[clean_indices]
        clean_labels = labels[clean_indices]
        
        # Option 2: Down-weight anomalies (using sample weights)
        sample_weights = np.ones(len(labels))
        for idx in anomaly_indices:
            sample_weights[idx] = 0.1  # Lower weight for anomalies
        
        return clean_features, clean_labels, sample_weights
    
    def comprehensive_poisoning_detection(self, features, labels):
        """Run all poisoning detection methods"""
        all_anomalies = []
        
        # Statistical outliers
        stat_anomalies = self.detect_statistical_anomalies(
            pd.DataFrame(features)
        )
        all_anomalies.extend(stat_anomalies)
        
        # Clustering outliers
        cluster_anomalies = self.detect_clustering_anomalies(features, labels)
        all_anomalies.extend(cluster_anomalies)
        
        # Label flipping
        label_anomalies = self.detect_label_flipping(features, labels)
        all_anomalies.extend(label_anomalies)
        
        # Backdoor triggers
        trigger_candidates = self.detect_backdoor_triggers(features, labels)
        
        report = {
            'total_anomalies': len(all_anomalies),
            'anomalies_by_type': self.group_by_type(all_anomalies),
            'trigger_candidates': trigger_candidates,
            'recommended_action': self.recommend_action(all_anomalies, trigger_candidates)
        }
        
        return all_anomalies, report

class BackdoorDetector:
    def detect_backdoor_in_model(self, model, test_data):
        """Detect if trained model contains backdoor"""
        # Neural Cleanse algorithm
        trigger = self.reverse_engineer_trigger(model, test_data)
        
        if trigger['confidence'] > 0.9:
            return {
                'backdoor_detected': True,
                'trigger_pattern': trigger['pattern'],
                'target_label': trigger['target_label'],
                'confidence': trigger['confidence']
            }
        else:
            return {'backdoor_detected': False}
    
    def reverse_engineer_trigger(self, model, test_data):
        """Attempt to find minimal perturbation that causes misclassification"""
        # Implementation of Neural Cleanse or similar
        # This is a simplified placeholder
        pass
```

### Implementation Requirements

#### Anomaly Detection Thresholds

- **Statistical Outliers**: Z-score > 3
- **Clustering Outliers**: Samples far from cluster (DBSCAN noise)
- **Label Flipping**: High model confidence (>80%) but label mismatch
- **Contamination Rate**: Assume 1-5% anomalies

#### Robust Training Techniques

- **Robust Loss Functions**: MAE, Huber loss, Trimmed loss
- **Sample Weighting**: Down-weight suspicious samples
- **Certified Defenses**: Certified robustness guarantees (if available)
- **RONI (Reject On Negative Impact)**: Reject samples that harm performance

## Validation Strategy

### Testing Approach

1. **Red Team Testing**: Simulate poisoning attacks
2. **Anomaly Detection Validation**: Test detection accuracy
3. **Backdoor Detection**: Test backdoor discovery techniques
4. **Robust Training**: Compare poisoned vs. unpoisoned performance
5. **Incident Response Drill**: Test response procedures

### Metrics

- **Anomaly Detection Accuracy**: True positive rate, false positive rate
- **Backdoor Detection Rate**: % of backdoors successfully detected
- **Model Robustness**: Performance degradation with X% poisoning
- **Incident Response Time**: Time to detect, investigate, and remediate

## Evidence Requirements

### Required Documentation

1. **Data Source Trust Assessment**: Risk classification of sources
2. **Anomaly Detection Results**: Detected anomalies, actions taken
3. **Backdoor Testing Results**: Backdoor detection test outcomes
4. **Access Control Audit**: Verification of data pipeline security
5. **Incident Response Logs**: Poisoning incident handling

### Evidence Collection

**Metrics**:
- Number of anomalies detected
- Backdoor detection test results
- Model robustness scores
- Incident response times

**Audit Trail**:
- Data source validation logs
- Anomaly detection logs
- Model validation results
- Access control logs

## Related Controls

### Within EN 18031

- **comp-en18031-009-training-data-quality**: Quality includes freedom from poisoning
- **comp-en18031-022-model-security-scanning**: Detect poisoned model behaviors
- **comp-en18031-026-ai-system-monitoring**: Detect poisoning effects in production

### Cross-Framework

- **ISO 27001 A.8.7**: Protection against malware
- **NIST AI RMF MANAGE-4.2**: Maximize AI system resilience

## Implementation Notes

### Best Practices

1. **Defense in Depth**: Multiple layers of poisoning detection
2. **Trust but Verify**: Even trusted sources can be compromised
3. **Continuous Monitoring**: Detect poisoning early in pipeline
4. **Robust Training**: Use techniques resilient to some poisoning
5. **Red Team Testing**: Regularly test defenses with simulated attacks

### Common Pitfalls

- **Pitfall**: Relying solely on anomaly detection (high false positives)
  - **Solution**: Combine multiple detection methods; human review of anomalies

- **Pitfall**: Not detecting clean-label or backdoor poisoning
  - **Solution**: Use advanced detection (clustering, backdoor detection)

- **Pitfall**: No incident response plan
  - **Solution**: Define and test response procedures; automate rollback

- **Pitfall**: Trusting all data from "trusted" sources
  - **Solution**: Validate all data; monitor source behavior

### ML/AI Tooling

**Poisoning Detection**:
- **ART (Adversarial Robustness Toolbox)**: Poisoning detection and defenses
- **CleverHans**: Adversarial attacks and defenses
- **TextAttack**: Poisoning for NLP models

**Backdoor Detection**:
- **Neural Cleanse**: Reverse-engineer backdoor triggers
- **Activation Clustering**: Detect backdoors via clustering

**Robust Training**:
- **RONI (Reject On Negative Impact)**: Reject harmful samples
- **Certified Defenses**: Provable robustness

## Status

- [ ] Data source trust assessment completed
- [ ] Anomaly detection mechanisms implemented
- [ ] Label consistency validation operational
- [ ] Robust training techniques deployed
- [ ] Backdoor detection procedures established
- [ ] Data pipeline access controls configured
- [ ] Data immutability and versioning enforced
- [ ] Continuous monitoring for poisoning operational
- [ ] Incident response procedures defined and tested
- [ ] Red team poisoning tests conducted
- [ ] Documentation completed
- [ ] Compliance with EN 18031 6.2.6 verified
