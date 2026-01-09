---
id: comp-en18031-026-ai-system-monitoring
title: COMP-EN18031-026 - AI System Monitoring
purpose: Monitor AI systems in production to detect issues, degradation, and anomalies
en18031Control: 6.4.1
category: ai-deployment
priority: high
framework: EN 18031
sidebar_label: COMP-EN18031-026
sidebar_position: 26
crossFramework:
  iso42001: 9.1 (Monitoring, Measurement, Analysis, Evaluation)
  euAiAct: Article 72 (Post-Market Monitoring)
  nistAiRmf: Manage 4.1, Measure 2.8
  iso27001: 075 (Monitoring Activities)
status: pending-verification
references: []
---

# COMP-EN18031-026: AI System Monitoring

## Overview

**Purpose**: Continuously monitor AI systems in production to detect performance degradation, model drift, data quality issues, security threats, and operational anomalies  
**EN 18031 Control**: 6.4.1 - AI System Monitoring  
**Category**: ai-deployment  
**Priority**: high  
**Framework**: EN 18031

## Regulatory Context

### EN 18031 Alignment

- **6.4.1**: AI System Monitoring - Continuous monitoring of deployed AI systems
- **Related Controls**:
  - 5.4.1: AI System Operation (operational monitoring)
  - 5.5.6: Robustness Testing (performance monitoring)
  - 6.4.2: Model Drift Detection (drift-specific monitoring)
  - 6.4.3: Incident Management (alert response)

### Cross-Framework Mapping

- **ISO/IEC 42001**: 9.1 - Monitoring, Measurement, Analysis and Evaluation
- **ISO/IEC 27001**: A.12.4 - Logging and Monitoring
- **EU AI Act**: Article 72 - Post-Market Monitoring by Providers
- **NIST AI RMF**: MANAGE-4.1 (monitoring), MEASURE-2.8 (effectiveness)
- **NIST CSF**: DE.CM-1 (Network monitoring), DE.AE-3 (Event correlation)
- **ISO/IEC 24029**: Robustness of neural networks (performance monitoring)

## Description

Production AI systems require continuous monitoring across multiple dimensions to ensure reliability, safety, and performance. Unlike traditional software, AI systems can degrade silently due to data drift, concept drift, or environmental changes without code changes.

### Monitoring Dimensions

**Performance Monitoring**:
- **Accuracy Metrics**: Precision, recall, F1, AUC-ROC, accuracy
- **Latency**: p50, p95, p99, max response time
- **Throughput**: Requests/second, batch processing time
- **Resource Utilization**: CPU, GPU, memory, disk I/O
- **Error Rates**: Prediction failures, timeout rates, exception rates

**Data Quality Monitoring**:
- **Input Distribution**: Feature value distributions, ranges, types
- **Data Drift**: Statistical tests (KS, Chi-square, KL-divergence)
- **Anomalies**: Outliers, unusual patterns, missing values
- **Data Completeness**: Missing features, null rates, data integrity
- **Data Freshness**: Timestamp checks, staleness detection

**Model Monitoring**:
- **Prediction Distribution**: Output class distribution, confidence levels
- **Model Drift**: Prediction distribution changes over time
- **Concept Drift**: Performance on recent labeled data (delayed evaluation)
- **Confidence Calibration**: Confidence score vs actual accuracy alignment
- **Bias Monitoring**: Fairness metrics across demographic groups

**System Health**:
- **Infrastructure**: Server health, network latency, storage availability
- **Dependencies**: Database health, API availability, cache status
- **Error Tracking**: Exceptions, failures, timeout rates
- **Deployment Status**: Version tracking, rollback readiness
- **Resource Saturation**: Approaching capacity limits

**Security Monitoring**:
- **Attack Detection**: Adversarial inputs, model inversion attempts
- **Access Patterns**: Unusual API usage, rate limit violations
- **Authentication**: Failed auth attempts, suspicious tokens
- **Backdoor Activation**: Trigger patterns, targeted misclassifications
- **Data Exfiltration**: Unusual data access patterns

**Business Metrics**:
- **User Satisfaction**: Feedback scores, ratings, complaints
- **Business KPIs**: Conversion rates, revenue impact, user engagement
- **A/B Testing**: Model variant performance comparison
- **ROI**: Cost per prediction, business value generated
- **Compliance**: Regulatory metric tracking

### Consequences of Inadequate Monitoring

**Silent Degradation**: Model accuracy drops 20% over 3 months, undetected
→ Poor user experience, lost revenue, customer churn

**Data Quality Issues**: Upstream data pipeline failure introduces nulls
→ Model produces nonsensical predictions, system reputation damaged

**Security Breaches**: Adversarial attacks go undetected for weeks
→ Data exfiltration, model theft, compliance violations

**Performance Degradation**: Latency increases gradually, crosses SLA
→ User complaints, contract violations, financial penalties

**Bias Drift**: Model becomes biased against protected groups over time
→ Discrimination, regulatory action, legal liability

## Acceptance Criteria

```gherkin
Feature: AI Model Performance Monitoring
  As an MLOps Engineer
  I want to monitor model performance in production
  So that degradation is detected early

  Scenario: Prediction Quality Monitoring
    Given AI model is deployed in production
    When predictions are monitored
    Then prediction accuracy shall be measured continuously
    And accuracy metrics shall be computed (precision, recall, F1)
    And metrics shall be compared to baseline
    And degradation threshold shall be defined (e.g., 5% drop)
    And alerts shall be generated when threshold exceeded
    And monitoring shall be real-time

  Scenario: Prediction Confidence Monitoring
    Given model outputs confidence scores
    When confidence is monitored
    Then confidence distribution shall be tracked
    And low-confidence predictions shall be flagged
    And confidence drift shall be detected
    And confidence calibration shall be monitored
    And confidence anomalies shall trigger alerts

  Scenario: Latency and Throughput Monitoring
    Given model serves predictions
    When performance is monitored
    Then prediction latency (p50, p95, p99) shall be measured
    And throughput (predictions/sec) shall be tracked
    And SLA violations shall be detected
    And performance degradation shall trigger alerts
    And bottlenecks shall be identified

Feature: Data Drift Detection
  As a Data Scientist
  I want to detect data drift in production
  So that model performance issues are explained

  Scenario: Input Distribution Monitoring
    Given production input data is collected
    When distribution is monitored
    Then input feature distributions shall be tracked
    And distributions shall be compared to training data
    And statistical drift tests shall be performed (KS test, Chi-square)
    And significant drift shall trigger alerts
    And drift severity shall be quantified

  Scenario: Covariate Drift Detection
    Given input features change over time
    When covariate drift is detected
    Then feature drift shall be measured per feature
    And drifted features shall be identified
    And drift impact on predictions shall be assessed
    And alerts shall be actionable (retrain recommended)

Feature: Model Drift Detection
  As an ML Engineer
  I want to detect model drift
  So that model retraining is triggered when needed

  Scenario: Prediction Drift Monitoring
    Given model predictions are logged
    When prediction drift is monitored
    Then prediction distribution shall be tracked over time
    And distribution changes shall be detected
    And prediction drift shall be quantified
    And drift exceeding threshold shall trigger retraining

  Scenario: Concept Drift Detection
    Given ground truth labels are available (delayed)
    When concept drift is detected
    Then model performance on recent data shall be measured
    And performance compared to historical performance
    And performance degradation shall indicate concept drift
    And retraining shall be triggered

Feature: Data Quality Monitoring
  As a Data Engineer
  I want to monitor input data quality
  So that bad data is detected before predictions

  Scenario: Missing Value Detection
    Given production inputs may have missing values
    When data quality is monitored
    Then missing value rate shall be tracked
    And missing value rate increase shall trigger alerts
    And affected predictions shall be flagged
    And data quality issues shall be investigated

  Scenario: Outlier Detection
    Given production inputs may contain outliers
    When outliers are detected
    Then outliers shall be identified using statistical methods
    And outlier rate shall be tracked
    And outlier rate increase shall trigger alerts
    And outliers shall be reviewed for validity

Feature: Security and Anomaly Monitoring
  As a Security Analyst
  I want to monitor for security threats
  So that attacks are detected early

  Scenario: Adversarial Input Detection
    Given adversarial inputs may be submitted
    When adversarial detection is performed
    Then suspicious input patterns shall be detected
    And adversarial attack indicators shall be monitored
    And attack attempts shall trigger security alerts
    And affected predictions shall be invalidated

  Scenario: Model Behavior Anomaly Detection
    Given model may behave unexpectedly
    When behavior is monitored
    Then unusual prediction patterns shall be detected
    And prediction anomalies shall be investigated
    And anomalies may indicate backdoor activation
    And security incidents shall be escalated

Feature: Business Metric Monitoring
  As a Product Manager
  I want to monitor business impact of AI
  So that AI delivers business value

  Scenario: User Satisfaction Monitoring
    Given users interact with AI predictions
    When user satisfaction is monitored
    Then user feedback shall be collected
    And satisfaction scores shall be tracked
    And satisfaction decline shall trigger investigation
    And satisfaction correlated with model performance

Feature: Monitoring Dashboard and Alerting
  As an Operations Team
  I want centralized monitoring dashboard
  So that AI system health is visible

  Scenario: Monitoring Dashboard
    Given monitoring data is collected
    When dashboard is accessed
    Then dashboard shall show key metrics
    And dashboard shall visualize trends over time
    And dashboard shall support drill-down
    And dashboard shall be accessible 24/7
    And dashboard shall be role-based

  Scenario: Alert Configuration and Routing
    Given monitoring alerts are generated
    When alerts are configured
    Then alert thresholds shall be configurable
    And alert severity shall be defined (Critical, High, Medium, Low)
    And alerts shall be routed to appropriate teams
    And alert escalation shall be automated
    And alert fatigue shall be minimized (tune thresholds)

Scenario: Compliance Verification
    Given EN 18031 requires AI monitoring
    When compliance audit is performed
    Then monitoring systems shall be operational
    And key metrics shall be tracked
    And alerts shall be configured
    And monitoring data shall be retained
    And compliance with EN 18031 6.4.1 shall be verified
```

## Technical Context

### Comprehensive Monitoring Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Production AI System                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌─────────────────┐      ┌──────────────────┐                      │
│   │  Model Serving  │      │  Inference API   │                      │
│   │  (TorchServe/   │─────→│  (FastAPI/Flask) │                      │
│   │   TF Serving)   │      │                  │                      │
│   └─────────────────┘      └──────────────────┘                      │
│            │                         │                                │
│            └─────────────┬───────────┘                                │
│                          │                                            │
│                          │ Telemetry (Metrics, Logs, Traces)         │
│                          ↓                                            │
├──────────────────────────────────────────────────────────────────────┤
│                   Monitoring & Observability Layer                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────┐    ┌──────────────────┐                      │
│  │  Metrics Store     │    │  Log Aggregation │                      │
│  │  • Prometheus      │    │  • Elasticsearch │                      │
│  │  • VictoriaMetrics │    │  • Splunk        │                      │
│  │  • InfluxDB        │    │  • Loki          │                      │
│  └────────────────────┘    └──────────────────┘                      │
│            │                         │                                │
│            └─────────────┬───────────┘                                │
│                          ↓                                            │
│  ┌──────────────────────────────────────────────┐                    │
│  │       ML-Specific Monitoring Platform        │                    │
│  ├──────────────────────────────────────────────┤                    │
│  │  • Drift Detection (Evidently AI)            │                    │
│  │  • Data Quality (WhyLabs, Great Expectations)│                    │
│  │  • Model Performance (Arize AI, Fiddler)     │                    │
│  │  • Explainability (SHAP streaming)           │                    │
│  │  • Bias Monitoring (Fairlearn metrics)       │                    │
│  └──────────────────────────────────────────────┘                    │
│                          │                                            │
│                          ↓                                            │
│  ┌──────────────────────────────────────────────┐                    │
│  │         Analytics & Detection Engine         │                    │
│  ├──────────────────────────────────────────────┤                    │
│  │  • Anomaly Detection                         │                    │
│  │  • Trend Analysis                            │                    │
│  │  • Correlation Analysis                      │                    │
│  │  • Forecasting                               │                    │
│  │  • Root Cause Analysis                       │                    │
│  └──────────────────────────────────────────────┘                    │
│                          │                                            │
│                          ↓                                            │
│  ┌──────────────────────────────────────────────┐                    │
│  │           Visualization & Dashboards         │                    │
│  ├──────────────────────────────────────────────┤                    │
│  │  • Grafana (metrics visualization)           │                    │
│  │  • Kibana (log analysis)                     │                    │
│  │  • Custom Dashboards (Streamlit/Plotly)      │                    │
│  │  • Mobile Apps (on-call monitoring)          │                    │
│  └──────────────────────────────────────────────┘                    │
│                          │                                            │
│                          ↓                                            │
│  ┌──────────────────────────────────────────────┐                    │
│  │              Alerting & Response             │                    │
│  ├──────────────────────────────────────────────┤                    │
│  │  • Alert Routing (PagerDuty, Opsgenie)       │                    │
│  │  • Notification (Slack, Email, SMS)          │                    │
│  │  • Escalation (Automated escalation)         │                    │
│  │  • Incident Management (Jira, ServiceNow)    │                    │
│  │  • Auto-Remediation (Rollback, Scaling)      │                    │
│  └──────────────────────────────────────────────┘                    │
│                                                                        │
└────────────────────────────────────────────────────────────────────┘
```

### Monitoring Architecture

```
┌─────────────────────────────────────────────────┐
│         AI Model in Production                  │
│  • Serving predictions                          │
│  • Processing inputs                            │
└──────────────┬──────────────────────────────────┘
               │
               │ Telemetry (metrics, logs, traces)
               │
               ▼
┌──────────────────────────────────────────────────┐
│         Monitoring & Observability Platform      │
│  • Prometheus (metrics)                          │
│  • Elasticsearch (logs)                          │
│  • Jaeger (traces)                               │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│         ML-Specific Monitoring Tools             │
│  • Evidently AI (drift detection)                │
│  • WhyLabs (data quality)                        │
│  • Arize AI (model monitoring)                   │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│         Monitoring Dashboard                     │
│  • Grafana (visualization)                       │
│  • Custom dashboards                             │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│         Alerting System                          │
│  • PagerDuty / Opsgenie                          │
│  • Slack / Email                                 │
└──────────────────────────────────────────────────┘
```

### Comprehensive Monitoring Implementation

```python
import numpy as np
from datetime import datetime, timedelta
from scipy import stats
from sklearn.metrics import precision_recall_fscore_support
import prometheus_client as prom

class ComprehensiveAIMonitor:
    """
    Production-grade AI system monitoring with multiple detection layers
    """
    
    def __init__(self, model_name, baseline_data):
        self.model_name = model_name
        self.baseline_data = baseline_data
        
        # Prometheus metrics
        self.prediction_counter = prom.Counter(
            f'{model_name}_predictions_total',
            'Total predictions',
            ['model_version']
        )
        
        self.latency_histogram = prom.Histogram(
            f'{model_name}_latency_seconds',
            'Prediction latency',
            buckets=[0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0]
        )
        
        self.confidence_histogram = prom.Histogram(
            f'{model_name}_confidence',
            'Prediction confidence',
            buckets=[0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99]
        )
        
        self.drift_gauge = prom.Gauge(
            f'{model_name}_data_drift_score',
            'Data drift score (0-1)'
        )
        
        self.error_counter = prom.Counter(
            f'{model_name}_errors_total',
            'Total errors',
            ['error_type']
        )
        
        # Rolling windows for trend analysis
        self.prediction_window = []
        self.confidence_window = []
        self.latency_window = []
        self.window_size = 1000
        
        # Drift detection state
        self.reference_distribution = self._compute_distribution(baseline_data)
        self.drift_threshold = 0.05
        
        # Alert manager
        self.alert_manager = AlertManager()
    
    def monitor_prediction(self, input_data, prediction, confidence, 
                          latency, model_version, ground_truth=None):
        """
        Comprehensive monitoring of single prediction
        """
        timestamp = datetime.utcnow()
        
        # 1. Update metrics
        self.prediction_counter.labels(model_version=model_version).inc()
        self.latency_histogram.observe(latency)
        self.confidence_histogram.observe(confidence)
        
        # 2. Add to rolling windows
        self.prediction_window.append({
            'prediction': prediction,
            'confidence': confidence,
            'timestamp': timestamp,
            'ground_truth': ground_truth
        })
        self.latency_window.append(latency)
        
        # Maintain window size
        if len(self.prediction_window) > self.window_size:
            self.prediction_window.pop(0)
            self.latency_window.pop(0)
        
        # 3. Real-time checks
        alerts = []
        
        # Low confidence alert
        if confidence < 0.5:
            alerts.append({
                'type': 'low_confidence',
                'severity': 'MEDIUM',
                'message': f'Low confidence prediction: {confidence:.3f}',
                'details': {
                    'prediction': prediction,
                    'confidence': confidence,
                    'timestamp': timestamp
                }
            })
        
        # High latency alert
        if latency > 1.0:  # 1 second SLA
            alerts.append({
                'type': 'high_latency',
                'severity': 'HIGH',
                'message': f'High latency: {latency:.3f}s',
                'details': {
                    'latency': latency,
                    'sla': 1.0,
                    'timestamp': timestamp
                }
            })
        
        # Data quality checks
        data_quality_alerts = self._check_data_quality(input_data)
        alerts.extend(data_quality_alerts)
        
        # Security checks
        security_alerts = self._check_security_anomalies(input_data, prediction)
        alerts.extend(security_alerts)
        
        # 4. Periodic checks (every N predictions)
        if len(self.prediction_window) % 100 == 0:
            # Check for drift
            drift_alerts = self._check_drift(input_data)
            alerts.extend(drift_alerts)
            
            # Check performance degradation
            if ground_truth:
                performance_alerts = self._check_performance()
                alerts.extend(performance_alerts)
        
        # 5. Send alerts
        for alert in alerts:
            self.alert_manager.send_alert(**alert)
        
        return {
            'monitoring_status': 'success',
            'alerts_generated': len(alerts),
            'alerts': alerts
        }
    
    def _check_data_quality(self, input_data):
        """Check input data quality"""
        alerts = []
        
        # Missing values
        missing_rate = np.isnan(input_data).mean()
        if missing_rate > 0.1:  # >10% missing
            alerts.append({
                'type': 'data_quality',
                'severity': 'HIGH',
                'message': f'High missing value rate: {missing_rate:.2%}',
                'details': {'missing_rate': missing_rate}
            })
        
        # Outliers (using IQR method)
        for i, feature_value in enumerate(input_data):
            if np.isnan(feature_value):
                continue
            
            # Compare to baseline distribution
            baseline_feature = self.baseline_data[:, i]
            Q1 = np.percentile(baseline_feature, 25)
            Q3 = np.percentile(baseline_feature, 75)
            IQR = Q3 - Q1
            
            if feature_value < (Q1 - 3*IQR) or feature_value > (Q3 + 3*IQR):
                alerts.append({
                    'type': 'outlier',
                    'severity': 'LOW',
                    'message': f'Outlier detected in feature {i}',
                    'details': {
                        'feature_index': i,
                        'value': feature_value,
                        'Q1': Q1,
                        'Q3': Q3
                    }
                })
        
        return alerts
    
    def _check_drift(self, current_data):
        """Detect data drift using statistical tests"""
        alerts = []
        
        # Kolmogorov-Smirnov test for each feature
        current_distribution = self._compute_distribution(current_data)
        
        drifted_features = []
        for i in range(current_data.shape[1]):
            baseline_feature = self.baseline_data[:, i]
            current_feature = current_data[:, i]
            
            # KS test
            statistic, p_value = stats.ks_2samp(baseline_feature, current_feature)
            
            if p_value < self.drift_threshold:
                drifted_features.append({
                    'feature_index': i,
                    'ks_statistic': statistic,
                    'p_value': p_value
                })
        
        if drifted_features:
            self.drift_gauge.set(len(drifted_features) / current_data.shape[1])
            
            alerts.append({
                'type': 'data_drift',
                'severity': 'HIGH' if len(drifted_features) > 3 else 'MEDIUM',
                'message': f'Data drift detected in {len(drifted_features)} features',
                'details': {
                    'drifted_features': drifted_features,
                    'total_features': current_data.shape[1],
                    'drift_percentage': len(drifted_features) / current_data.shape[1]
                }
            })
        
        return alerts
    
    def _check_performance(self):
        """Check model performance degradation"""
        alerts = []
        
        # Get recent predictions with ground truth
        recent_with_labels = [
            p for p in self.prediction_window[-1000:]
            if p['ground_truth'] is not None
        ]
        
        if len(recent_with_labels) < 100:
            return alerts  # Not enough labeled data
        
        # Compute recent performance
        predictions = [p['prediction'] for p in recent_with_labels]
        ground_truths = [p['ground_truth'] for p in recent_with_labels]
        
        precision, recall, f1, _ = precision_recall_fscore_support(
            ground_truths, predictions, average='weighted'
        )
        
        # Compare to baseline (would be configured)
        baseline_f1 = 0.85  # Example baseline
        
        degradation = baseline_f1 - f1
        
        if degradation > 0.05:  # >5% degradation
            alerts.append({
                'type': 'performance_degradation',
                'severity': 'CRITICAL',
                'message': f'Model performance degraded by {degradation:.2%}',
                'details': {
                    'current_f1': f1,
                    'baseline_f1': baseline_f1,
                    'degradation': degradation,
                    'precision': precision,
                    'recall': recall
                },
                'recommendation': 'Consider model retraining'
            })
        
        return alerts
    
    def _check_security_anomalies(self, input_data, prediction):
        """Detect security anomalies"""
        alerts = []
        
        # Adversarial input detection (simplified)
        # In practice, use dedicated adversarial detection methods
        
        # 1. Input norm check (adversarial inputs often have unusual norms)
        input_norm = np.linalg.norm(input_data)
        baseline_norms = np.linalg.norm(self.baseline_data, axis=1)
        mean_norm = np.mean(baseline_norms)
        std_norm = np.std(baseline_norms)
        
        if input_norm > mean_norm + 3*std_norm:
            alerts.append({
                'type': 'suspicious_input',
                'severity': 'MEDIUM',
                'message': 'Unusual input norm detected',
                'details': {
                    'input_norm': input_norm,
                    'expected_norm': mean_norm,
                    'std': std_norm
                }
            })
        
        # 2. Prediction pattern anomaly
        # Check if recent predictions show unusual patterns
        if len(self.prediction_window) >= 100:
            recent_predictions = [p['prediction'] for p in self.prediction_window[-100:]]
            
            # If all recent predictions are same class (potential backdoor activation)
            from collections import Counter
            pred_counts = Counter(recent_predictions)
            most_common_count = pred_counts.most_common(1)[0][1]
            
            if most_common_count > 90:  # >90% same class
                alerts.append({
                    'type': 'prediction_anomaly',
                    'severity': 'HIGH',
                    'message': 'Unusual prediction concentration detected',
                    'details': {
                        'most_common_class': pred_counts.most_common(1)[0][0],
                        'percentage': most_common_count / 100
                    },
                    'recommendation': 'Investigate for potential backdoor activation'
                })
        
        return alerts
    
    def _compute_distribution(self, data):
        """Compute distribution statistics for data"""
        return {
            'mean': np.mean(data, axis=0),
            'std': np.std(data, axis=0),
            'percentiles': {
                25: np.percentile(data, 25, axis=0),
                50: np.percentile(data, 50, axis=0),
                75: np.percentile(data, 75, axis=0)
            }
        }
    
    def get_monitoring_dashboard_data(self):
        """Generate data for monitoring dashboard"""
        if not self.prediction_window:
            return {'status': 'no_data'}
        
        # Compute statistics from windows
        recent_confidences = [p['confidence'] for p in self.prediction_window]
        recent_latencies = self.latency_window
        
        return {
            'status': 'active',
            'window_size': len(self.prediction_window),
            'confidence_stats': {
                'mean': np.mean(recent_confidences),
                'std': np.std(recent_confidences),
                'p50': np.percentile(recent_confidences, 50),
                'p95': np.percentile(recent_confidences, 95)
            },
            'latency_stats': {
                'mean': np.mean(recent_latencies),
                'p50': np.percentile(recent_latencies, 50),
                'p95': np.percentile(recent_latencies, 95),
                'p99': np.percentile(recent_latencies, 99)
            },
            'prediction_distribution': self._get_prediction_distribution(),
            'drift_score': self.drift_gauge._value.get() if hasattr(self.drift_gauge, '_value') else 0
        }
    
    def _get_prediction_distribution(self):
        """Get distribution of recent predictions"""
        from collections import Counter
        recent_predictions = [p['prediction'] for p in self.prediction_window]
        return dict(Counter(recent_predictions))


class AlertManager:
    """Manage alerts with routing, deduplication, and escalation"""
    
    def __init__(self):
        self.alert_history = []
        self.alert_cache = {}  # For deduplication
        self.escalation_rules = {
            'CRITICAL': {'initial_notify': ['oncall', 'slack', 'email'], 
                        'escalate_after': timedelta(minutes=15)},
            'HIGH': {'initial_notify': ['slack', 'email'],
                    'escalate_after': timedelta(minutes=30)},
            'MEDIUM': {'initial_notify': ['slack'],
                      'escalate_after': timedelta(hours=2)},
            'LOW': {'initial_notify': ['email'],
                   'escalate_after': None}
        }
    
    def send_alert(self, type, severity, message, details=None, recommendation=None):
        """
        Send alert with deduplication and routing
        """
        # Create alert fingerprint for deduplication
        fingerprint = f"{type}_{severity}_{message}"
        
        # Check if similar alert recently sent (within 5 minutes)
        if fingerprint in self.alert_cache:
            last_sent = self.alert_cache[fingerprint]
            if datetime.utcnow() - last_sent < timedelta(minutes=5):
                return  # Suppress duplicate
        
        # Create alert
        alert = {
            'id': self._generate_alert_id(),
            'type': type,
            'severity': severity,
            'message': message,
            'details': details or {},
            'recommendation': recommendation,
            'timestamp': datetime.utcnow(),
            'status': 'open'
        }
        
        # Store alert
        self.alert_history.append(alert)
        self.alert_cache[fingerprint] = datetime.utcnow()
        
        # Route alert
        self._route_alert(alert)
        
        return alert
    
    def _route_alert(self, alert):
        """Route alert to appropriate channels"""
        rules = self.escalation_rules.get(alert['severity'], {})
        channels = rules.get('initial_notify', ['email'])
        
        for channel in channels:
            if channel == 'oncall':
                self._send_pagerduty(alert)
            elif channel == 'slack':
                self._send_slack(alert)
            elif channel == 'email':
                self._send_email(alert)
    
    def _send_pagerduty(self, alert):
        """Send to PagerDuty (stub)"""
        # In production: integrate with PagerDuty API
        print(f"[PAGERDUTY] {alert['severity']}: {alert['message']}")
    
    def _send_slack(self, alert):
        """Send to Slack (stub)"""
        # In production: integrate with Slack webhook
        print(f"[SLACK] {alert['severity']}: {alert['message']}")
    
    def _send_email(self, alert):
        """Send email (stub)"""
        # In production: integrate with email service
        print(f"[EMAIL] {alert['severity']}: {alert['message']}")
    
    def _generate_alert_id(self):
        """Generate unique alert ID"""
        import uuid
        return str(uuid.uuid4())
```

### Drift Detection Implementation

```python
from evidently.metrics import DataDriftPreset
from evidently.report import Report
import pandas as pd

class DriftDetectionSystem:
    """
    Production drift detection using Evidently AI
    """
    
    def __init__(self, reference_data):
        self.reference_data = reference_data
        self.drift_threshold = 0.05
    
    def detect_drift(self, current_data):
        """
        Comprehensive drift detection
        """
        # Convert to DataFrames
        reference_df = pd.DataFrame(self.reference_data)
        current_df = pd.DataFrame(current_data)
        
        # Run Evidently drift report
        report = Report(metrics=[DataDriftPreset()])
        report.run(reference_data=reference_df, current_data=current_df)
        
        # Extract results
        drift_results = report.as_dict()
        
        # Parse drift information
        drift_detected = drift_results['metrics'][0]['result']['dataset_drift']
        drifted_features = []
        
        for feature, feature_result in drift_results['metrics'][0]['result']['drift_by_columns'].items():
            if feature_result['drift_detected']:
                drifted_features.append({
                    'feature': feature,
                    'drift_score': feature_result['drift_score'],
                    'stattest': feature_result['stattest_name']
                })
        
        return {
            'drift_detected': drift_detected,
            'drifted_features': drifted_features,
            'num_drifted': len(drifted_features),
            'total_features': len(reference_df.columns),
            'drift_percentage': len(drifted_features) / len(reference_df.columns),
            'report': drift_results
        }
```

### Implementation Pattern

```python
class AIMonitoringSystem:
    def __init__(self):
        self.metrics_collector = MetricsCollector()
        self.drift_detector = DriftDetector()
        self.alert_manager = AlertManager()
    
    def monitor_prediction(self, input_data, prediction, confidence, latency):
        """Monitor individual prediction"""
        # Collect metrics
        self.metrics_collector.record_prediction(
            input=input_data,
            prediction=prediction,
            confidence=confidence,
            latency=latency,
            timestamp=datetime.utcnow()
        )
        
        # Check for anomalies
        if confidence < 0.5:
            self.alert_manager.send_alert(
                severity='MEDIUM',
                message=f'Low confidence prediction: {confidence}'
            )
        
        if latency > 1.0:  # 1 second SLA
            self.alert_manager.send_alert(
                severity='HIGH',
                message=f'High latency: {latency}s'
            )
    
    def check_data_drift(self, recent_data, reference_data):
        """Check for data drift"""
        drift_report = self.drift_detector.detect_drift(
            current_data=recent_data,
            reference_data=reference_data
        )
        
        if drift_report['drift_detected']:
            self.alert_manager.send_alert(
                severity='HIGH',
                message=f'Data drift detected: {drift_report["drifted_features"]}'
            )
    
    def check_model_performance(self, recent_accuracy, baseline_accuracy):
        """Check for model performance degradation"""
        degradation = baseline_accuracy - recent_accuracy
        
        if degradation > 0.05:  # 5% threshold
            self.alert_manager.send_alert(
                severity='CRITICAL',
                message=f'Model performance degraded by {degradation:.2%}'
            )
```

## Implementation Requirements

### Monitoring Stack

**Infrastructure Monitoring**:
- **Metrics**: Prometheus, VictoriaMetrics, InfluxDB, Datadog
- **Logs**: Elasticsearch, Splunk, Loki, CloudWatch
- **Traces**: Jaeger, Zipkin, OpenTelemetry
- **APM**: New Relic, Datadog APM, Dynatrace

**ML-Specific Monitoring**:
- **Drift Detection**: Evidently AI, WhyLabs, Fiddler AI
- **Data Quality**: Great Expectations, Deequ, WhyLabs
- **Model Performance**: Arize AI, Fiddler, TruEra
- **Explainability**: SHAP streaming, Alibi Detect
- **Bias Monitoring**: Fairlearn, AI Fairness 360

**Visualization**:
- **Dashboards**: Grafana, Kibana, Streamlit, Plotly Dash
- **Business Intelligence**: Tableau, Looker, Mode Analytics
- **Custom**: React + D3.js, Plotly

**Alerting**:
- **Incident Management**: PagerDuty, Opsgenie, VictorOps
- **Communication**: Slack, Microsoft Teams, Email, SMS
- **Ticketing**: Jira, ServiceNow, Linear

### Metrics Configuration

```yaml
monitoring_config:
  performance_metrics:
    accuracy:
      compute_interval: 1_hour  # When ground truth available
      alert_threshold: 0.05  # 5% degradation
      
    latency:
      percentiles: [50, 95, 99]
      sla: 1000  # 1 second
      alert_on_sla_violation: true
      
    throughput:
      target: 1000  # requests/sec
      alert_below: 800
  
  data_quality_metrics:
    missing_values:
      threshold: 0.10  # 10% missing
      severity: HIGH
      
    outliers:
      method: IQR
      multiplier: 3
      alert_rate: 0.05  # >5% outliers
    
    drift:
      method: KS_test
      threshold: 0.05
      features_to_monitor: all
      check_interval: 1_hour
  
  model_metrics:
    prediction_distribution:
      track: true
      alert_on_shift: true
      
    confidence:
      track_distribution: true
      low_confidence_threshold: 0.5
      alert_on_trend: true
    
    bias:
      demographic_groups: [age, gender, ethnicity]
      fairness_metrics: [demographic_parity, equal_opportunity]
      check_interval: 1_day
  
  security_metrics:
    adversarial_detection:
      enabled: true
      methods: [input_validation, STRIP_defense]
      
    access_patterns:
      track_api_usage: true
      rate_limit_violations: alert
      
    backdoor_activation:
      monitor_prediction_patterns: true
      alert_on_anomaly: true
```

### Dashboard Configuration

```yaml
dashboards:
  executive_dashboard:
    refresh_rate: 5_minutes
    panels:
      - model_accuracy_trend (30_days)
      - prediction_volume (24_hours)
      - error_rate (24_hours)
      - user_satisfaction_score
      - business_impact_metrics
    
  operations_dashboard:
    refresh_rate: 1_minute
    panels:
      - live_prediction_feed
      - latency_distribution (p50, p95, p99)
      - throughput (predictions/sec)
      - error_rate_by_type
      - infrastructure_health
      - alert_feed
    
  ml_engineering_dashboard:
    refresh_rate: 5_minutes
    panels:
      - model_performance_metrics
      - data_drift_scores
      - feature_importance_drift
      - prediction_distribution
      - confidence_calibration
      - bias_metrics
    
  security_dashboard:
    refresh_rate: 1_minute
    panels:
      - suspicious_input_detections
      - adversarial_attack_attempts
      - rate_limit_violations
      - authentication_failures
      - backdoor_activation_alerts
```

## Validation Strategy

### Performance Targets

```yaml
monitoring_sla:
  data_collection:
    prediction_instrumentation_overhead: <2%  # CPU/latency
    log_ingestion_latency: <10_seconds
    metrics_update_frequency: <1_minute
    
  detection_latency:
    real_time_alerts: <1_minute  # Critical alerts
    trend_analysis: <5_minutes
    drift_detection: <1_hour
    performance_degradation: <4_hours
    
  availability:
    monitoring_infrastructure: >99.9%
    dashboard_availability: >99.5%
    alert_delivery: >99.99%
```

### Validation Tests

- Monitor 100% of production predictions
- Test alerting system weekly (synthetic alerts)
- Validate drift detection on known drifted datasets (≥90% detection)
- Ensure monitoring overhead <5% (CPU, latency, cost)
- Test auto-remediation in staging environment

## Evidence Requirements

**Monitoring Infrastructure**:
- Monitoring architecture documentation
- Deployment topology
- Configuration files (Prometheus, Grafana)
- Availability metrics (uptime reports)

**Monitoring Dashboards**:
- Screenshots of key dashboards
- Dashboard access logs
- User roles and permissions
- Refresh frequencies and data sources

**Alert Logs**:
- Complete alert history (7 years retention)
- Alert acknowledgment records
- Response time metrics
- False positive/negative analysis

**Drift Detection Reports**:
- Periodic drift analysis reports
- Feature-level drift scores
- Trend analysis and visualizations
- Actions taken on drift detection

**Performance Metrics History**:
- Accuracy/precision/recall trends
- Latency percentile trends (p50, p95, p99)
- Throughput metrics
- Error rate trends
- Resource utilization trends

## Related Controls

### Direct Dependencies

**comp-en18031-023-model-drift-detection**: Drift detection component of monitoring
**comp-en18031-029-ai-system-performance-monitoring**: Performance-specific monitoring
**comp-en18031-027-inference-security**: Security monitoring during inference
**comp-en18031-026-ai-system-monitoring**: Production monitoring integration

### Related Controls

**comp-en18031-004-ai-incident-response**: Monitoring triggers incidents
**comp-en18031-033-ai-system-rollback**: Monitoring triggers rollbacks
**comp-en18031-007-ai-audit-trail**: Monitoring data feeds audit trail
**comp-en18031-022-model-security-scanning**: Security monitoring integration

## Status

### Implementation Checklist

**Infrastructure**:
- [ ] Metrics store deployed (Prometheus/VictoriaMetrics)
- [ ] Log aggregation operational (Elasticsearch/Splunk)
- [ ] Tracing infrastructure ready (Jaeger/OpenTelemetry)
- [ ] Storage retention configured (metrics: 90 days, logs: 365 days)

**ML-Specific Monitoring**:
- [ ] Drift detection operational (Evidently AI/WhyLabs)
- [ ] Data quality monitoring active (Great Expectations)
- [ ] Model performance tracking configured
- [ ] Bias monitoring implemented
- [ ] Explainability tracking (SHAP)

**Dashboards**:
- [ ] Executive dashboard deployed
- [ ] Operations dashboard live
- [ ] ML engineering dashboard configured
- [ ] Security dashboard operational
- [ ] Mobile access enabled

**Alerting**:
- [ ] Alert routing configured (PagerDuty/Opsgenie)
- [ ] Escalation policies defined
- [ ] Communication channels integrated (Slack, email)
- [ ] Alert deduplication active
- [ ] Weekly alerting tests scheduled

**Data Collection**:
- [ ] 100% prediction instrumentation
- [ ] Input/output logging operational
- [ ] Ground truth collection configured (where available)
- [ ] Metadata tracking (timestamps, versions, user IDs)
- [ ] Sampling strategy defined (for high-volume systems)

**Automation**:
- [ ] Auto-remediation triggers configured
- [ ] Rollback automation tested
- [ ] Scaling automation operational
- [ ] Incident creation automated (Jira/ServiceNow)

**Compliance**:
- [ ] EN 18031 6.4.1 controls documented
- [ ] Cross-framework mappings completed
- [ ] Monitoring SLA validated
- [ ] Data retention policies enforced
- [ ] Annual monitoring audit scheduled
