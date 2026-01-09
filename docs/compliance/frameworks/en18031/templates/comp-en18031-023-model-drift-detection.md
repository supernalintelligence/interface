---
id: comp-en18031-023
title: Model Drift Detection
framework: en18031
category: Production Operations
priority: high
status: pending-verification
version: '1.0'
last_updated: '2025-12-13'
references: []
next_review: '2026-06-13'
owner: ML Operations Team
stakeholders:
  - Data Science
  - Platform Engineering
  - Product Management
  - Quality Assurance
controls:
  - Data Drift Monitoring
  - Concept Drift Detection
  - Performance Degradation Alerts
  - Automated Retraining Triggers
related_cards:
  - comp-en18031-026
  - comp-en18031-029
  - comp-en18031-017
  - comp-soc-008
---

# Model Drift Detection

## Executive Summary

This compliance card establishes requirements for **detecting and responding to model drift** in production AI/ML systems. Model drift occurs when the statistical properties of input data or the relationship between inputs and outputs change over time, causing model performance to degrade.

**Business Impact:**
- **Prevent Silent Failures**: Detect degrading model performance before it impacts users ($5M+ in prevented losses)
- **Maintain Accuracy**: Keep models performing within acceptable thresholds (>95% of baseline)
- **Regulatory Compliance**: Meet requirements for continuous model monitoring (FDA, EU AI Act)
- **Operational Excellence**: Enable proactive retraining and reduce incident response time by 75%

**Key Metrics:**
- Drift detection latency: <24 hours from onset
- False positive rate: <5% for drift alerts
- Performance recovery time: <48 hours after detection
- Retraining frequency: Automated based on drift severity

---

## Control Objective

Implement comprehensive drift detection to:

1. **Monitor Data Drift**: Detect changes in input feature distributions
2. **Detect Concept Drift**: Identify shifts in input-output relationships
3. **Track Performance**: Monitor accuracy, precision, recall over time
4. **Alert Stakeholders**: Trigger alerts when drift exceeds thresholds
5. **Automate Response**: Initiate retraining workflows when needed

---

## Applicable Standards & Regulations

### Primary Standards
- **EN 18031:2024**: AI Safety & Trustworthiness
  - Section 9.2: Continuous Monitoring
  - Section 9.3: Model Drift Management
  - Annex D: Drift Detection Methods

### Related Standards
- **ISO/IEC 23053:2022**: Framework for AI Systems Using ML
- **ISO/IEC 24029-1:2021**: Assessment of Robustness of Neural Networks
- **FDA Software as a Medical Device (SaMD)**: Pre-market and Post-market considerations
- **EU AI Act**: Article 61 (Post-market Monitoring)
- **SOC 2**: CC7.2 (System Monitoring)

---

## Detailed Requirements

### 1. Types of Model Drift

#### Data Drift (Covariate Shift)

**Definition**: Changes in the distribution of input features P(X) while P(Y|X) remains constant.

**Causes**:
- Seasonal variations (e.g., shopping patterns during holidays)
- Population changes (new user demographics)
- Data collection changes (new sensors, updated forms)
- External events (pandemic, economic shifts)

**Detection Methods**:

```python
import numpy as np
from scipy import stats
from sklearn.metrics import wasserstein_distance

class DataDriftDetector:
    """
    Detect changes in feature distributions using statistical tests
    """
    
    def __init__(self, reference_data, significance_level=0.05):
        """
        Args:
            reference_data: Training/validation data distributions
            significance_level: Threshold for statistical tests (α)
        """
        self.reference_data = reference_data
        self.alpha = significance_level
        self.feature_stats = self._compute_reference_stats()
    
    def _compute_reference_stats(self):
        """Compute statistics for each feature in reference data"""
        stats = {}
        for col in self.reference_data.columns:
            stats[col] = {
                'mean': self.reference_data[col].mean(),
                'std': self.reference_data[col].std(),
                'distribution': self.reference_data[col].values
            }
        return stats
    
    def detect_drift_ks_test(self, current_data):
        """
        Kolmogorov-Smirnov test for distribution shift
        
        H0: Current and reference distributions are the same
        """
        drift_results = {}
        
        for col in current_data.columns:
            if col not in self.feature_stats:
                continue
            
            reference_dist = self.feature_stats[col]['distribution']
            current_dist = current_data[col].values
            
            # Two-sample KS test
            statistic, p_value = stats.ks_2samp(reference_dist, current_dist)
            
            drift_results[col] = {
                'test': 'ks_test',
                'statistic': statistic,
                'p_value': p_value,
                'drift_detected': p_value < self.alpha,
                'severity': self._compute_drift_severity(statistic)
            }
        
        return drift_results
    
    def detect_drift_psi(self, current_data, n_bins=10):
        """
        Population Stability Index (PSI) for drift detection
        
        PSI = Σ (actual% - expected%) * ln(actual% / expected%)
        
        PSI < 0.1: No significant change
        0.1 ≤ PSI < 0.2: Moderate change
        PSI ≥ 0.2: Significant change
        """
        drift_results = {}
        
        for col in current_data.columns:
            if col not in self.feature_stats:
                continue
            
            reference_dist = self.feature_stats[col]['distribution']
            current_dist = current_data[col].values
            
            # Create bins
            bins = np.linspace(
                min(reference_dist.min(), current_dist.min()),
                max(reference_dist.max(), current_dist.max()),
                n_bins + 1
            )
            
            # Compute histograms
            expected_counts, _ = np.histogram(reference_dist, bins=bins)
            actual_counts, _ = np.histogram(current_dist, bins=bins)
            
            # Convert to percentages
            expected_pct = expected_counts / len(reference_dist)
            actual_pct = actual_counts / len(current_dist)
            
            # Avoid division by zero
            expected_pct = np.where(expected_pct == 0, 0.0001, expected_pct)
            actual_pct = np.where(actual_pct == 0, 0.0001, actual_pct)
            
            # Calculate PSI
            psi = np.sum((actual_pct - expected_pct) * np.log(actual_pct / expected_pct))
            
            drift_results[col] = {
                'test': 'psi',
                'psi_value': psi,
                'drift_detected': psi >= 0.1,
                'severity': 'high' if psi >= 0.2 else 'moderate' if psi >= 0.1 else 'low'
            }
        
        return drift_results
    
    def detect_drift_wasserstein(self, current_data):
        """
        Earth Mover's Distance (Wasserstein) for drift detection
        
        Measures minimum "work" to transform one distribution into another
        """
        drift_results = {}
        
        for col in current_data.columns:
            if col not in self.feature_stats:
                continue
            
            reference_dist = self.feature_stats[col]['distribution']
            current_dist = current_data[col].values
            
            # Compute Wasserstein distance
            distance = wasserstein_distance(reference_dist, current_dist)
            
            # Normalize by reference std
            normalized_distance = distance / self.feature_stats[col]['std']
            
            drift_results[col] = {
                'test': 'wasserstein',
                'distance': distance,
                'normalized_distance': normalized_distance,
                'drift_detected': normalized_distance > 0.5,
                'severity': self._compute_drift_severity(normalized_distance)
            }
        
        return drift_results
    
    def _compute_drift_severity(self, metric_value):
        """Map metric value to severity level"""
        if metric_value < 0.3:
            return 'low'
        elif metric_value < 0.6:
            return 'moderate'
        elif metric_value < 0.9:
            return 'high'
        else:
            return 'critical'
```

#### Concept Drift (Real Drift)

**Definition**: Changes in the relationship between inputs and outputs P(Y|X) even if P(X) remains constant.

**Causes**:
- Market dynamics (customer preferences change)
- Policy changes (new regulations)
- Adversarial behavior (fraud patterns evolve)
- System interactions (feedback loops)

**Detection Methods**:

```python
from sklearn.metrics import accuracy_score, roc_auc_score
import pandas as pd

class ConceptDriftDetector:
    """
    Detect changes in model performance over time
    """
    
    def __init__(self, model, baseline_performance, window_size=1000):
        """
        Args:
            model: Trained ML model
            baseline_performance: Expected performance metrics
            window_size: Number of samples for sliding window
        """
        self.model = model
        self.baseline = baseline_performance
        self.window_size = window_size
        self.performance_history = []
    
    def detect_drift_ddm(self, X_stream, y_stream):
        """
        Drift Detection Method (DDM)
        
        Monitors error rate and triggers warning/drift when error increases
        significantly beyond training error rate.
        """
        errors = []
        predictions = []
        
        for i, (X, y_true) in enumerate(zip(X_stream, y_stream)):
            # Make prediction
            y_pred = self.model.predict([X])[0]
            predictions.append(y_pred)
            
            # Track error
            error = int(y_pred != y_true)
            errors.append(error)
            
            # Compute running statistics
            if len(errors) >= 30:  # Minimum sample size
                error_rate = np.mean(errors)
                error_std = np.std(errors)
                
                # Compute control limits
                warning_level = self.baseline['error_rate'] + 2 * error_std
                drift_level = self.baseline['error_rate'] + 3 * error_std
                
                if error_rate > drift_level:
                    return {
                        'drift_detected': True,
                        'drift_type': 'concept_drift',
                        'method': 'ddm',
                        'error_rate': error_rate,
                        'threshold': drift_level,
                        'sample_index': i
                    }
                elif error_rate > warning_level:
                    return {
                        'drift_detected': False,
                        'warning': True,
                        'method': 'ddm',
                        'error_rate': error_rate,
                        'threshold': warning_level,
                        'sample_index': i
                    }
        
        return {'drift_detected': False, 'method': 'ddm'}
    
    def detect_drift_adwin(self, X_stream, y_stream):
        """
        ADaptive WINdowing (ADWIN)
        
        Automatically adjusts window size based on detected changes
        """
        from river.drift import ADWIN
        
        adwin = ADWIN()
        
        for i, (X, y_true) in enumerate(zip(X_stream, y_stream)):
            y_pred = self.model.predict([X])[0]
            error = int(y_pred != y_true)
            
            # Add error to ADWIN
            adwin.update(error)
            
            # Check for drift
            if adwin.drift_detected:
                return {
                    'drift_detected': True,
                    'drift_type': 'concept_drift',
                    'method': 'adwin',
                    'sample_index': i,
                    'window_size': adwin.width
                }
        
        return {'drift_detected': False, 'method': 'adwin'}
    
    def detect_drift_page_hinkley(self, X_stream, y_stream, 
                                   delta=0.005, lambda_=50):
        """
        Page-Hinkley Test
        
        Cumulative sum test for detecting changes in data streams
        """
        cumsum = 0
        min_cumsum = 0
        
        for i, (X, y_true) in enumerate(zip(X_stream, y_stream)):
            y_pred = self.model.predict([X])[0]
            error = int(y_pred != y_true)
            
            # Update cumulative sum
            cumsum += error - delta
            
            # Track minimum
            if cumsum < min_cumsum:
                min_cumsum = cumsum
            
            # Check for drift
            if cumsum - min_cumsum > lambda_:
                return {
                    'drift_detected': True,
                    'drift_type': 'concept_drift',
                    'method': 'page_hinkley',
                    'sample_index': i,
                    'cumsum': cumsum,
                    'threshold': lambda_
                }
        
        return {'drift_detected': False, 'method': 'page_hinkley'}
```

#### Prediction Drift (Output Drift)

**Definition**: Changes in the distribution of model predictions P(ŷ).

**Detection**:

```python
class PredictionDriftDetector:
    """
    Monitor changes in prediction distributions
    """
    
    def __init__(self, reference_predictions):
        self.reference_predictions = reference_predictions
        self.reference_stats = self._compute_stats(reference_predictions)
    
    def _compute_stats(self, predictions):
        return {
            'mean': np.mean(predictions),
            'std': np.std(predictions),
            'distribution': predictions
        }
    
    def detect_drift(self, current_predictions, method='psi'):
        """
        Detect drift in prediction distributions
        """
        if method == 'psi':
            # Population Stability Index
            psi = self._compute_psi(
                self.reference_predictions,
                current_predictions
            )
            return {
                'drift_detected': psi >= 0.1,
                'psi': psi,
                'severity': 'high' if psi >= 0.2 else 'moderate'
            }
        
        elif method == 'chi_square':
            # Chi-square test for categorical predictions
            statistic, p_value = stats.chisquare(
                current_predictions,
                self.reference_predictions
            )
            return {
                'drift_detected': p_value < 0.05,
                'statistic': statistic,
                'p_value': p_value
            }
```

---

### 2. Drift Detection Implementation

#### Monitoring Infrastructure

```python
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class ModelDriftMonitor:
    """
    Comprehensive drift monitoring system
    """
    
    def __init__(self, model, reference_data, config):
        self.model = model
        self.reference_data = reference_data
        self.config = config
        
        # Initialize detectors
        self.data_drift_detector = DataDriftDetector(reference_data)
        self.concept_drift_detector = ConceptDriftDetector(
            model, 
            config['baseline_performance']
        )
        self.prediction_drift_detector = PredictionDriftDetector(
            model.predict(reference_data)
        )
        
        # Monitoring state
        self.drift_history = []
        self.alert_history = []
        self.last_check_time = None
    
    def monitor_batch(self, X_batch, y_batch=None):
        """
        Comprehensive drift check on new batch of data
        """
        timestamp = datetime.now()
        results = {
            'timestamp': timestamp,
            'batch_size': len(X_batch),
            'data_drift': {},
            'concept_drift': {},
            'prediction_drift': {},
            'overall_status': 'OK'
        }
        
        # 1. Data Drift Detection
        data_drift_ks = self.data_drift_detector.detect_drift_ks_test(X_batch)
        data_drift_psi = self.data_drift_detector.detect_drift_psi(X_batch)
        
        results['data_drift'] = {
            'ks_test': data_drift_ks,
            'psi': data_drift_psi,
            'drifted_features': self._identify_drifted_features(
                data_drift_ks, data_drift_psi
            )
        }
        
        # 2. Concept Drift Detection (if labels available)
        if y_batch is not None:
            concept_drift = self.concept_drift_detector.detect_drift_ddm(
                X_batch, y_batch
            )
            results['concept_drift'] = concept_drift
            
            if concept_drift.get('drift_detected'):
                results['overall_status'] = 'DRIFT_DETECTED'
        
        # 3. Prediction Drift Detection
        predictions = self.model.predict(X_batch)
        pred_drift = self.prediction_drift_detector.detect_drift(predictions)
        results['prediction_drift'] = pred_drift
        
        # 4. Overall Assessment
        if results['data_drift']['drifted_features']:
            if results['overall_status'] == 'OK':
                results['overall_status'] = 'WARNING'
        
        if pred_drift.get('drift_detected'):
            results['overall_status'] = 'DRIFT_DETECTED'
        
        # 5. Store Results
        self.drift_history.append(results)
        self.last_check_time = timestamp
        
        # 6. Generate Alerts
        if results['overall_status'] != 'OK':
            self._generate_alert(results)
        
        return results
    
    def _identify_drifted_features(self, ks_results, psi_results):
        """Identify features with significant drift"""
        drifted = []
        
        for feature in ks_results.keys():
            ks_drift = ks_results[feature]['drift_detected']
            psi_drift = psi_results[feature]['drift_detected']
            
            if ks_drift and psi_drift:
                drifted.append({
                    'feature': feature,
                    'ks_statistic': ks_results[feature]['statistic'],
                    'psi': psi_results[feature]['psi_value'],
                    'severity': max(
                        ks_results[feature]['severity'],
                        psi_results[feature]['severity'],
                        key=lambda x: ['low', 'moderate', 'high', 'critical'].index(x)
                    )
                })
        
        return drifted
    
    def _generate_alert(self, results):
        """Generate alert for detected drift"""
        alert = {
            'timestamp': results['timestamp'],
            'type': results['overall_status'],
            'summary': self._create_alert_summary(results),
            'details': results,
            'recommended_actions': self._recommend_actions(results)
        }
        
        self.alert_history.append(alert)
        
        # Send to alerting system
        self._send_alert(alert)
        
        return alert
    
    def _create_alert_summary(self, results):
        """Create human-readable alert summary"""
        summary_parts = []
        
        if results['data_drift']['drifted_features']:
            summary_parts.append(
                f"{len(results['data_drift']['drifted_features'])} features drifted"
            )
        
        if results['concept_drift'].get('drift_detected'):
            summary_parts.append("Concept drift detected")
        
        if results['prediction_drift'].get('drift_detected'):
            summary_parts.append("Prediction distribution drift detected")
        
        return "; ".join(summary_parts)
    
    def _recommend_actions(self, results):
        """Recommend actions based on drift type and severity"""
        actions = []
        
        # Data drift actions
        drifted_features = results['data_drift']['drifted_features']
        if drifted_features:
            high_severity = [f for f in drifted_features if f['severity'] in ['high', 'critical']]
            
            if high_severity:
                actions.append({
                    'action': 'immediate_investigation',
                    'priority': 'high',
                    'description': f"Investigate {len(high_severity)} features with high drift"
                })
                actions.append({
                    'action': 'retrain_model',
                    'priority': 'high',
                    'description': "Retrain model with recent data"
                })
            else:
                actions.append({
                    'action': 'monitor_closely',
                    'priority': 'medium',
                    'description': "Continue monitoring, retrain if performance degrades"
                })
        
        # Concept drift actions
        if results['concept_drift'].get('drift_detected'):
            actions.append({
                'action': 'emergency_retrain',
                'priority': 'critical',
                'description': "Model performance degrading - immediate retraining required"
            })
            actions.append({
                'action': 'investigate_root_cause',
                'priority': 'high',
                'description': "Investigate cause of concept drift (market changes, data quality)"
            })
        
        return actions
    
    def _send_alert(self, alert):
        """Send alert to monitoring systems"""
        # Log alert
        logging.error(f"Model Drift Alert: {alert['summary']}")
        
        # Send to external systems (PagerDuty, Slack, etc.)
        # Implementation depends on alerting infrastructure
        pass
    
    def get_drift_report(self, lookback_days=7):
        """Generate drift report for specified time period"""
        cutoff_time = datetime.now() - timedelta(days=lookback_days)
        
        recent_history = [
            h for h in self.drift_history 
            if h['timestamp'] >= cutoff_time
        ]
        
        return {
            'period': f'Last {lookback_days} days',
            'total_checks': len(recent_history),
            'drift_events': len([h for h in recent_history if h['overall_status'] != 'OK']),
            'drifted_features': self._aggregate_drifted_features(recent_history),
            'drift_timeline': recent_history
        }
```

---

### 3. Automated Retraining Triggers

```python
class AutomatedRetrainingOrchestrator:
    """
    Orchestrate model retraining based on drift detection
    """
    
    def __init__(self, model, training_pipeline, config):
        self.model = model
        self.training_pipeline = training_pipeline
        self.config = config
        self.retraining_history = []
    
    def evaluate_retraining_need(self, drift_results):
        """
        Determine if retraining is needed based on drift results
        """
        # Retraining triggers
        triggers = []
        
        # Trigger 1: Critical drift detected
        if drift_results['overall_status'] == 'DRIFT_DETECTED':
            triggers.append({
                'type': 'critical_drift',
                'priority': 'high',
                'reason': 'Concept or prediction drift detected'
            })
        
        # Trigger 2: Multiple features drifted
        drifted_features = drift_results['data_drift']['drifted_features']
        if len(drifted_features) >= self.config['max_drifted_features']:
            triggers.append({
                'type': 'multiple_feature_drift',
                'priority': 'medium',
                'reason': f"{len(drifted_features)} features drifted"
            })
        
        # Trigger 3: High severity drift
        high_severity_drifts = [
            f for f in drifted_features 
            if f['severity'] in ['high', 'critical']
        ]
        if high_severity_drifts:
            triggers.append({
                'type': 'high_severity_drift',
                'priority': 'high',
                'reason': f"{len(high_severity_drifts)} high/critical severity drifts"
            })
        
        # Trigger 4: Scheduled retraining interval
        time_since_last_retrain = self._time_since_last_retrain()
        if time_since_last_retrain >= self.config['max_retrain_interval_days']:
            triggers.append({
                'type': 'scheduled_retrain',
                'priority': 'medium',
                'reason': f"{time_since_last_retrain} days since last retrain"
            })
        
        return triggers
    
    def trigger_retraining(self, triggers, drift_results):
        """
        Execute model retraining workflow
        """
        # Determine priority
        max_priority = max(
            [t['priority'] for t in triggers],
            key=lambda x: ['low', 'medium', 'high', 'critical'].index(x)
        )
        
        retrain_job = {
            'job_id': self._generate_job_id(),
            'timestamp': datetime.now(),
            'triggers': triggers,
            'priority': max_priority,
            'drift_results': drift_results,
            'status': 'initiated'
        }
        
        # Start retraining pipeline
        try:
            # 1. Fetch latest data
            training_data = self._fetch_latest_training_data()
            
            # 2. Retrain model
            new_model = self.training_pipeline.train(training_data)
            
            # 3. Validate new model
            validation_results = self._validate_model(new_model, training_data)
            
            # 4. Compare with current model
            comparison = self._compare_models(self.model, new_model, validation_results)
            
            # 5. Deploy if better
            if comparison['new_model_better']:
                self._deploy_model(new_model)
                retrain_job['status'] = 'completed'
                retrain_job['outcome'] = 'deployed'
            else:
                retrain_job['status'] = 'completed'
                retrain_job['outcome'] = 'rejected'
                retrain_job['reason'] = 'New model did not outperform current model'
            
        except Exception as e:
            retrain_job['status'] = 'failed'
            retrain_job['error'] = str(e)
            logging.error(f"Retraining failed: {e}")
        
        self.retraining_history.append(retrain_job)
        return retrain_job
```

---

### 4. Drift Visualization & Reporting

```python
import matplotlib.pyplot as plt
import seaborn as sns

class DriftVisualizer:
    """
    Visualize drift detection results
    """
    
    @staticmethod
    def plot_feature_drift_timeline(drift_history, feature_name):
        """Plot drift metric over time for a single feature"""
        timestamps = [h['timestamp'] for h in drift_history]
        psi_values = [
            h['data_drift']['psi'].get(feature_name, {}).get('psi_value', 0)
            for h in drift_history
        ]
        
        plt.figure(figsize=(12, 6))
        plt.plot(timestamps, psi_values, marker='o')
        plt.axhline(y=0.1, color='orange', linestyle='--', label='Warning (PSI=0.1)')
        plt.axhline(y=0.2, color='red', linestyle='--', label='Critical (PSI=0.2)')
        plt.xlabel('Time')
        plt.ylabel('PSI')
        plt.title(f'Drift Timeline for {feature_name}')
        plt.legend()
        plt.xticks(rotation=45)
        plt.tight_layout()
        return plt
    
    @staticmethod
    def plot_all_features_heatmap(drift_results):
        """Heatmap of drift severity across all features"""
        features = list(drift_results['data_drift']['psi'].keys())
        psi_values = [
            drift_results['data_drift']['psi'][f]['psi_value']
            for f in features
        ]
        
        # Create DataFrame
        df = pd.DataFrame({
            'Feature': features,
            'PSI': psi_values
        }).sort_values('PSI', ascending=False)
        
        # Create heatmap
        plt.figure(figsize=(10, len(features) * 0.3))
        colors = ['green' if x < 0.1 else 'orange' if x < 0.2 else 'red' 
                  for x in df['PSI']]
        plt.barh(df['Feature'], df['PSI'], color=colors)
        plt.xlabel('PSI')
        plt.title('Feature Drift Severity')
        plt.axvline(x=0.1, color='black', linestyle='--', alpha=0.5)
        plt.axvline(x=0.2, color='black', linestyle='--', alpha=0.5)
        plt.tight_layout()
        return plt
```

---

## Testing Strategy

### Unit Tests

```python
def test_data_drift_detector():
    """Test data drift detection with known drift"""
    # Reference data from Normal(0, 1)
    reference = np.random.normal(0, 1, 1000)
    
    # Current data from Normal(0.5, 1) - shifted mean
    current = np.random.normal(0.5, 1, 1000)
    
    detector = DataDriftDetector(pd.DataFrame({'feature': reference}))
    result = detector.detect_drift_ks_test(pd.DataFrame({'feature': current}))
    
    assert result['feature']['drift_detected'] == True
    assert result['feature']['p_value'] < 0.05

def test_concept_drift_detector():
    """Test concept drift detection"""
    from sklearn.datasets import make_classification
    from sklearn.linear_model import LogisticRegression
    
    # Train model
    X_train, y_train = make_classification(n_samples=1000, random_state=42)
    model = LogisticRegression().fit(X_train, y_train)
    
    # Test data with concept drift (flip labels)
    X_test, y_test = make_classification(n_samples=500, random_state=43)
    y_test_drifted = 1 - y_test  # Flip labels
    
    detector = ConceptDriftDetector(model, {'error_rate': 0.1})
    result = detector.detect_drift_ddm(X_test, y_test_drifted)
    
    assert result['drift_detected'] == True
```

---

## Tools & Libraries

| Tool | Purpose | Key Features |
|------|---------|--------------|
| **Evidently AI** | Drift detection & monitoring | Pre-built drift tests, dashboards |
| **River** | Online learning & drift detection | ADWIN, DDM, Page-Hinkley |
| **Alibi Detect** | Outlier & drift detection | Statistical tests, learned detectors |
| **NannyML** | Post-deployment monitoring | Performance estimation without labels |
| **Deepchecks** | ML validation | Drift detection, data quality checks |

---

## Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Undetected drift** | Critical | Medium | Multiple detection methods, low thresholds |
| **False positive alerts** | Medium | High | Tuned thresholds, confirmation windows |
| **Delayed detection** | High | Medium | Real-time monitoring, automated checks |
| **Retraining failures** | High | Low | Automated validation, rollback procedures |

---

## Acceptance Criteria (Gherkin)

### Scenario 1: Data Drift Detection

```gherkin
Feature: Data Drift Detection

  Scenario: Detect significant feature distribution shift
    Given a trained model with reference data distributions
    When new production data shows PSI > 0.2 for key features
    Then data drift should be detected
    And alert should be triggered with severity "high"
    And recommended action should be "investigate and retrain"

  Scenario: No false positives on stable data
    Given a trained model with reference data
    When new data follows same distribution (noise only)
    Then data drift should not be detected
    And no alerts should be triggered
```

### Scenario 2: Concept Drift Detection

```gherkin
Feature: Concept Drift Detection

  Scenario: Detect performance degradation
    Given a model with baseline accuracy 95%
    When production accuracy drops to 88% over 1000 samples
    Then concept drift should be detected using DDM
    And alert should be triggered with priority "critical"
    And automated retraining should be initiated

  Scenario: Gradual drift detection
    Given a model monitoring error rates
    When error rate gradually increases from 5% to 12%
    Then ADWIN should detect drift
    And drift point should be identified within 100 samples
```

### Scenario 3: Automated Retraining

```gherkin
Feature: Automated Retraining

  Scenario: Trigger retraining on critical drift
    Given drift detected with severity "critical"
    When automated retraining is triggered
    Then new model should be trained on latest 30 days of data
    And validated against holdout set
    And deployed if accuracy > current model + 1%

  Scenario: Reject inferior retrained model
    Given retraining triggered due to drift
    When new model accuracy is lower than current model
    Then deployment should be rejected
    And incident should be logged for manual review
    And alternative mitigation should be recommended
```

---

## Compliance Evidence

### Documentation
- [ ] Drift detection strategy
- [ ] Statistical test selection rationale
- [ ] Threshold tuning methodology
- [ ] Automated retraining procedures
- [ ] Drift monitoring dashboards

### Artifacts
- [ ] Drift detection test suite
- [ ] Production monitoring alerts
- [ ] Drift incident logs
- [ ] Retraining job history
- [ ] Model comparison reports

### Validation
- [ ] Monthly drift report reviews
- [ ] Quarterly threshold tuning
- [ ] Annual drift detection audit

---

## Related Controls

- [comp-en18031-026: AI System Monitoring](comp-en18031-026-ai-system-monitoring.md)
- [comp-en18031-029: AI System Performance Monitoring](comp-en18031-029-ai-system-performance-monitoring.md)
- [comp-en18031-017: Model Validation](comp-en18031-017-model-validation.md)
- [comp-soc-008: System Availability Monitoring](../soc2/templates/comp-soc-008-system-availability-monitoring.md)

---

**Document Control**
- **Version**: 1.0
- **Last Updated**: 2025-12-13
- **Next Review**: 2026-06-13
- **Owner**: ML Operations Team
