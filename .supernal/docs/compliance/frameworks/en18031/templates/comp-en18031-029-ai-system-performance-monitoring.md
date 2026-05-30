---
id: comp-en18031-029-ai-system-performance-monitoring
title: COMP-EN18031-029 - AI System Performance Monitoring
purpose: Monitor AI system performance metrics to ensure quality and detect degradation
en18031Control: 6.4.4
category: ai-deployment
priority: high
framework: EN 18031
sidebar_label: COMP-EN18031-029
sidebar_position: 29
crossFramework:
  iso42001: 9.1 (Monitoring and Measurement)
  euAiAct: Article 72 (Post-Market Monitoring)
  nistAiRmf: Measure 2.8
status: pending-verification
references: []
---

# COMP-EN18031-029: AI System Performance Monitoring

## Overview

**Purpose**: Continuously monitor AI system performance to detect degradation, maintain quality, and trigger interventions  
**EN 18031 Control**: 6.4.4 - AI System Performance Monitoring  
**Category**: ai-deployment  
**Priority**: high  
**Framework**: EN 18031

## Regulatory Context

### EN 18031 Alignment

- **6.4.4**: AI System Performance Monitoring - Monitor AI performance metrics to maintain quality
- **Related Controls**:
  - 5.3.2: Model Validation (performance baselines)
  - 6.4.1: AI System Monitoring (comprehensive monitoring - see Card 026)
  - 6.4.2: Inference Security (performance impact of security)
  - 5.5.6: Robustness Testing (performance under stress)

### Cross-Framework Mapping

- **ISO/IEC 42001**: 9.1 - Monitoring, Measurement, Analysis and Evaluation
- **EU AI Act**: Article 72 - Post-Market Monitoring by Providers
- **NIST AI RMF**: MEASURE-2.8 (Effectiveness measurement)
- **ISO/IEC 25010**: Software Quality (performance efficiency)

## Description

### Relationship to Card 026

**Card 026 (AI System Monitoring)** provides comprehensive monitoring across all dimensions (data drift, security, system health, model behavior).

**Card 029 (Performance Monitoring)** focuses specifically on:
- Model performance metrics (accuracy, precision, recall, F1)
- System performance (latency, throughput, availability)
- Business metrics (conversion, satisfaction, ROI)
- Fairness metrics (demographic parity, equal opportunity)
- Performance degradation detection and response

**Key Difference**: Card 026 monitors "what's happening", Card 029 monitors "how well it's performing".

## Description

Comprehensive performance monitoring across: **Model Performance** (accuracy, precision, recall), **System Performance** (latency, throughput, availability), **Data Quality** (input distribution, completeness), **Business Metrics** (user satisfaction, conversion rate), **Fairness Metrics** (demographic parity, equal opportunity).

**Key Actions**:
- Establish baselines during deployment
- Set thresholds for alerts (e.g., 5% accuracy drop)
- Automated alerts and escalation
- Root cause analysis workflows
- Retraining/rollback procedures

## Acceptance Criteria

```gherkin
Feature: Model Performance Tracking
  As a Data Scientist
  I want to track model performance metrics
  So that degradation is detected early

  Scenario: Accuracy Monitoring
    Given model is in production
    When ground truth labels are available
    Then accuracy shall be computed on recent predictions
    And accuracy shall be compared to baseline
    And accuracy drop >5% shall trigger alert
    And accuracy trends shall be visualized

  Scenario: Precision/Recall/F1 Monitoring
    Given classification model is deployed
    When detailed metrics are tracked
    Then precision, recall, F1 per class shall be measured
    And metrics shall be compared to baseline
    And per-class degradation shall be detected
    And imbalanced class issues shall be identified

Feature: Latency and Throughput Monitoring
  As an Operations Engineer
  I want to monitor system performance
  So that SLAs are met

  Scenario: Latency Monitoring
    Given inference requests are served
    When latency is measured
    Then p50, p95, p99 latency shall be tracked
    And latency shall be compared to SLA (e.g., <100ms)
    And SLA violations shall trigger alerts
    And latency trends shall be visualized

  Scenario: Throughput Monitoring
    Given system handles requests
    When throughput is measured
    Then requests per second shall be tracked
    And throughput shall meet capacity requirements
    And throughput degradation shall be detected
    And bottlenecks shall be identified

Feature: Data Quality Monitoring
  As a Data Engineer
  I want to monitor input data quality
  So that poor data doesn't degrade predictions

  Scenario: Missing Value Monitoring
    Given inputs may have missing values
    When data quality is tracked
    Then missing value rate shall be measured per feature
    And baseline missing rate shall be established
    And missing rate increase shall trigger alert
    And affected predictions shall be flagged

  Scenario: Distribution Shift Detection
    Given input distribution may change
    When distribution is monitored
    Then feature distributions shall be compared to training data
    And statistical tests (KS, Chi-square) shall detect drift
    And drift severity shall be quantified
    And significant drift shall trigger retraining

Feature: Business Metric Monitoring
  As a Product Manager
  I want to track business impact
  So that AI delivers value

  Scenario: User Satisfaction Tracking
    Given users interact with AI
    When satisfaction is measured
    Then user feedback/ratings shall be collected
    And satisfaction scores shall be tracked
    And satisfaction decline shall trigger investigation
    And satisfaction correlated with model performance

  Scenario: Conversion Rate Monitoring
    Given AI impacts business outcomes
    When business metrics are tracked
    Then conversion rates shall be measured
    And conversion rates compared to baseline
    And AI attribution to conversions shall be estimated
    And business value of AI shall be quantified

Feature: Fairness Metric Monitoring
  As an AI Ethics Officer
  I want to monitor fairness
  So that bias doesn't emerge in production

  Scenario: Demographic Parity Monitoring
    Given protected attributes are tracked
    When fairness is monitored
    Then prediction rates across groups shall be measured
    And demographic parity shall be computed
    And fairness violations shall trigger alerts
    And bias mitigation shall be initiated

Feature: Alert Configuration and Response
  As an MLOps Engineer
  I want automated alerting
  So that issues are addressed quickly

  Scenario: Alert Thresholds
    Given monitoring is operational
    When alerts are configured
    Then thresholds shall be defined per metric
    And severity levels (Critical, High, Medium) shall be assigned
    And alert escalation paths shall be defined
    And alert fatigue shall be avoided (tune thresholds)

  Scenario: Automated Response Actions
    Given performance issue is detected
    When automated response is triggered
    Then degradation shall trigger investigation workflow
    And critical issues shall trigger rollback
    And persistent issues shall trigger retraining
    And response actions shall be logged

Scenario: Compliance Verification
    Given EN 18031 requires performance monitoring
    When compliance audit is performed
    Then all key metrics shall be tracked
    And baselines shall be established
    And alerts shall be configured
    And response procedures shall be documented
    And compliance with EN 18031 6.4.4 shall be verified
```

## Technical Context

### Monitoring Stack

```
Production AI System
       │
       ▼
Metrics Collection (Prometheus, Datadog)
       │
       ▼
ML Monitoring Platform (Evidently, Arize, WhyLabs)
       │
       ▼
Dashboards (Grafana, Custom)
       │
       ▼
Alerting (PagerDuty, Slack)
```

### Performance Monitoring Implementation

```python
from dataclasses import dataclass
from typing import Dict, List, Optional
import numpy as np
from sklearn.metrics import precision_recall_fscore_support, roc_auc_score
from datetime import datetime, timedelta
import pandas as pd

@dataclass
class PerformanceBaseline:
    """Performance baseline metrics"""
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    auc_roc: Optional[float]
    latency_p50: float
    latency_p95: float
    latency_p99: float
    throughput: float
    error_rate: float
    timestamp: datetime

class PerformanceMonitor:
    """
    Comprehensive performance monitoring with baselines and alerting
    """
    
    def __init__(self, baseline: PerformanceBaseline, thresholds: Dict):
        self.baseline = baseline
        self.thresholds = thresholds
        self.performance_history = []
        self.alert_manager = AlertManager()
    
    def monitor_model_performance(self, predictions, ground_truth, metadata):
        """
        Monitor model performance metrics with ground truth
        """
        # Compute current metrics
        current_metrics = self._compute_metrics(predictions, ground_truth)
        
        # Store in history
        self.performance_history.append({
            'timestamp': datetime.utcnow(),
            'metrics': current_metrics,
            'metadata': metadata
        })
        
        # Compare to baseline
        degradation_analysis = self._analyze_degradation(current_metrics)
        
        # Generate alerts if needed
        if degradation_analysis['alerts']:
            for alert in degradation_analysis['alerts']:
                self.alert_manager.send_alert(**alert)
        
        return {
            'current_metrics': current_metrics,
            'baseline_metrics': self._baseline_to_dict(),
            'degradation_analysis': degradation_analysis,
            'recommendation': self._generate_recommendation(degradation_analysis)
        }
    
    def _compute_metrics(self, predictions, ground_truth):
        """Compute comprehensive performance metrics"""
        # Classification metrics
        precision, recall, f1, _ = precision_recall_fscore_support(
            ground_truth, predictions, average='weighted'
        )
        
        accuracy = np.mean(predictions == ground_truth)
        
        # AUC-ROC (if probabilistic predictions available)
        auc_roc = None
        if hasattr(predictions, 'probabilities'):
            auc_roc = roc_auc_score(ground_truth, predictions.probabilities, 
                                    multi_class='ovr', average='weighted')
        
        # Per-class metrics
        per_class_precision, per_class_recall, per_class_f1, _ = \
            precision_recall_fscore_support(ground_truth, predictions, average=None)
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'auc_roc': auc_roc,
            'per_class': {
                'precision': per_class_precision.tolist(),
                'recall': per_class_recall.tolist(),
                'f1': per_class_f1.tolist()
            },
            'sample_count': len(predictions)
        }
    
    def _analyze_degradation(self, current_metrics):
        """Analyze performance degradation against baseline"""
        alerts = []
        degradations = {}
        
        # Check accuracy degradation
        accuracy_drop = self.baseline.accuracy - current_metrics['accuracy']
        if accuracy_drop > self.thresholds['accuracy_drop']:
            degradations['accuracy'] = accuracy_drop
            alerts.append({
                'type': 'performance_degradation',
                'severity': 'CRITICAL' if accuracy_drop > 0.10 else 'HIGH',
                'metric': 'accuracy',
                'baseline': self.baseline.accuracy,
                'current': current_metrics['accuracy'],
                'drop': accuracy_drop,
                'message': f'Accuracy degraded by {accuracy_drop:.2%}'
            })
        
        # Check F1 score degradation
        f1_drop = self.baseline.f1_score - current_metrics['f1_score']
        if f1_drop > self.thresholds['f1_drop']:
            degradations['f1_score'] = f1_drop
            alerts.append({
                'type': 'performance_degradation',
                'severity': 'HIGH',
                'metric': 'f1_score',
                'baseline': self.baseline.f1_score,
                'current': current_metrics['f1_score'],
                'drop': f1_drop,
                'message': f'F1 score degraded by {f1_drop:.2%}'
            })
        
        # Check precision/recall imbalance
        precision_recall_diff = abs(current_metrics['precision'] - current_metrics['recall'])
        if precision_recall_diff > 0.2:  # >20% imbalance
            alerts.append({
                'type': 'metric_imbalance',
                'severity': 'MEDIUM',
                'message': f'Precision/Recall imbalance: {precision_recall_diff:.2%}',
                'precision': current_metrics['precision'],
                'recall': current_metrics['recall']
            })
        
        # Check per-class degradation
        class_degradations = []
        for i, (baseline_f1, current_f1) in enumerate(zip(
            self._get_baseline_per_class_f1(),
            current_metrics['per_class']['f1']
        )):
            class_drop = baseline_f1 - current_f1
            if class_drop > 0.10:  # >10% drop for any class
                class_degradations.append({
                    'class_index': i,
                    'baseline_f1': baseline_f1,
                    'current_f1': current_f1,
                    'drop': class_drop
                })
        
        if class_degradations:
            alerts.append({
                'type': 'class_specific_degradation',
                'severity': 'HIGH',
                'message': f'{len(class_degradations)} classes degraded >10%',
                'affected_classes': class_degradations
            })
        
        return {
            'degraded': len(alerts) > 0,
            'degradations': degradations,
            'alerts': alerts,
            'class_specific_issues': class_degradations
        }
    
    def _generate_recommendation(self, degradation_analysis):
        """Generate actionable recommendations"""
        if not degradation_analysis['degraded']:
            return "Performance within acceptable range"
        
        recommendations = []
        
        # Check if retraining needed
        if degradation_analysis.get('degradations', {}).get('accuracy', 0) > 0.10:
            recommendations.append("URGENT: Model retraining required (>10% accuracy drop)")
        elif degradation_analysis.get('degradations', {}).get('accuracy', 0) > 0.05:
            recommendations.append("Model retraining recommended (>5% accuracy drop)")
        
        # Check for class-specific issues
        if degradation_analysis.get('class_specific_issues'):
            affected_classes = len(degradation_analysis['class_specific_issues'])
            recommendations.append(
                f"Investigate {affected_classes} underperforming classes - "
                "possible data distribution shift"
            )
        
        # Check for drift
        if len(self.performance_history) > 10:
            recent_trend = self._compute_trend(window=10)
            if recent_trend['declining']:
                recommendations.append("Gradual performance decline detected - monitor for drift")
        
        return " | ".join(recommendations) if recommendations else "Monitor closely"
    
    def _compute_trend(self, window=10):
        """Compute performance trend over recent window"""
        if len(self.performance_history) < window:
            return {'declining': False}
        
        recent_accuracies = [
            h['metrics']['accuracy'] 
            for h in self.performance_history[-window:]
        ]
        
        # Simple linear regression
        x = np.arange(len(recent_accuracies))
        slope = np.polyfit(x, recent_accuracies, 1)[0]
        
        return {
            'declining': slope < -0.01,  # >1% decline over window
            'slope': slope,
            'recent_accuracies': recent_accuracies
        }
    
    def monitor_system_performance(self, latencies, throughput, errors):
        """
        Monitor system performance metrics (latency, throughput, errors)
        """
        # Compute percentiles
        p50 = np.percentile(latencies, 50)
        p95 = np.percentile(latencies, 95)
        p99 = np.percentile(latencies, 99)
        
        error_rate = errors / len(latencies) if len(latencies) > 0 else 0
        
        alerts = []
        
        # Latency SLA violations
        if p95 > self.baseline.latency_p95 * (1 + self.thresholds['latency_increase']):
            alerts.append({
                'type': 'latency_degradation',
                'severity': 'HIGH',
                'metric': 'p95_latency',
                'baseline': self.baseline.latency_p95,
                'current': p95,
                'sla_violated': p95 > self.thresholds['latency_sla_p95'],
                'message': f'P95 latency: {p95:.0f}ms (baseline: {self.baseline.latency_p95:.0f}ms)'
            })
        
        # Throughput degradation
        if throughput < self.baseline.throughput * (1 - self.thresholds['throughput_drop']):
            alerts.append({
                'type': 'throughput_degradation',
                'severity': 'MEDIUM',
                'baseline': self.baseline.throughput,
                'current': throughput,
                'message': f'Throughput: {throughput:.0f} rps (baseline: {self.baseline.throughput:.0f} rps)'
            })
        
        # Error rate increase
        if error_rate > self.baseline.error_rate * 2:  # 2x baseline
            alerts.append({
                'type': 'error_rate_increase',
                'severity': 'CRITICAL',
                'baseline': self.baseline.error_rate,
                'current': error_rate,
                'message': f'Error rate: {error_rate:.2%} (baseline: {self.baseline.error_rate:.2%})'
            })
        
        # Send alerts
        for alert in alerts:
            self.alert_manager.send_alert(**alert)
        
        return {
            'latency': {'p50': p50, 'p95': p95, 'p99': p99},
            'throughput': throughput,
            'error_rate': error_rate,
            'alerts': alerts
        }
    
    def monitor_business_metrics(self, conversions, satisfaction_scores, revenue):
        """Monitor business impact metrics"""
        # Compute current business metrics
        conversion_rate = conversions / len(satisfaction_scores) if len(satisfaction_scores) > 0 else 0
        avg_satisfaction = np.mean(satisfaction_scores)
        
        alerts = []
        
        # Business metric degradation
        if hasattr(self, 'baseline_conversion_rate'):
            if conversion_rate < self.baseline_conversion_rate * 0.9:  # 10% drop
                alerts.append({
                    'type': 'business_impact',
                    'severity': 'HIGH',
                    'metric': 'conversion_rate',
                    'baseline': self.baseline_conversion_rate,
                    'current': conversion_rate,
                    'message': f'Conversion rate dropped to {conversion_rate:.2%}'
                })
        
        # Satisfaction degradation
        if hasattr(self, 'baseline_satisfaction'):
            if avg_satisfaction < self.baseline_satisfaction - 0.5:  # 0.5 point drop
                alerts.append({
                    'type': 'user_satisfaction',
                    'severity': 'MEDIUM',
                    'baseline': self.baseline_satisfaction,
                    'current': avg_satisfaction,
                    'message': f'User satisfaction: {avg_satisfaction:.2f}/5.0'
                })
        
        for alert in alerts:
            self.alert_manager.send_alert(**alert)
        
        return {
            'conversion_rate': conversion_rate,
            'avg_satisfaction': avg_satisfaction,
            'revenue_impact': revenue,
            'alerts': alerts
        }
    
    def _baseline_to_dict(self):
        return {
            'accuracy': self.baseline.accuracy,
            'precision': self.baseline.precision,
            'recall': self.baseline.recall,
            'f1_score': self.baseline.f1_score,
            'latency_p95': self.baseline.latency_p95,
            'throughput': self.baseline.throughput
        }
```

## Implementation Requirements

### Monitoring Configuration

```yaml
performance_monitoring:
  model_performance:
    metrics:
      - accuracy
      - precision
      - recall
      - f1_score
      - auc_roc
      - per_class_metrics
    
    baselines:
      accuracy: 0.85
      precision: 0.83
      recall: 0.87
      f1_score: 0.85
    
    thresholds:
      accuracy_drop: 0.05  # 5% drop triggers alert
      f1_drop: 0.05
      per_class_drop: 0.10  # 10% per-class drop
    
    evaluation_frequency:
      real_time: when_ground_truth_available
      batch: daily
      comprehensive: weekly
  
  system_performance:
    latency:
      sla_p95: 100  # milliseconds
      sla_p99: 200
      alert_threshold: 1.2  # 20% above baseline
    
    throughput:
      min_rps: 1000
      alert_threshold: 0.8  # 20% below baseline
    
    availability:
      sla: 99.9%  # 99.9% uptime
      measurement_window: 30_days
    
    error_rate:
      max: 0.001  # 0.1%
      alert_threshold: 2.0  # 2x baseline
  
  data_quality:
    missing_values:
      baseline_rate: 0.05
      alert_threshold: 2.0  # 2x baseline
    
    distribution_drift:
      method: KS_test
      threshold: 0.05
      check_frequency: hourly
  
  business_metrics:
    conversion_rate:
      track: true
      alert_on_drop: 0.10  # 10% drop
    
    user_satisfaction:
      track: true
      alert_threshold: 0.5  # 0.5 point drop
    
    revenue_per_prediction:
      track: true
      attribution_model: last_touch
  
  fairness_metrics:
    demographic_parity:
      enabled: true
      protected_attributes:
        - age_group
        - gender
        - ethnicity
      threshold: 0.1  # 10% disparity
    
    equal_opportunity:
      enabled: true
      threshold: 0.1
  
  alerting:
    channels:
      - slack
      - pagerduty
      - email
    
    escalation:
      CRITICAL: immediate
      HIGH: 15_minutes
      MEDIUM: 1_hour
      LOW: 24_hours
    
    deduplication: 5_minutes
```

## Validation Strategy

### Performance Baseline Establishment

**Initial Baseline** (at deployment):
1. Run model on validation set (1000+ samples)
2. Compute all performance metrics
3. Establish latency/throughput baselines
4. Document baseline in monitoring config
5. Set alert thresholds based on baseline

**Continuous Validation**:
- Daily performance evaluation (when ground truth available)
- Weekly comprehensive review
- Monthly baseline recalibration
- Quarterly performance audit

### Testing

```yaml
monitoring_validation:
  metrics_collection:
    verify_all_metrics_tracked: true
    sampling_rate: 100%  # For critical metrics
    latency_overhead: <5ms
  
  alert_testing:
    synthetic_degradation:
      - inject_10%_accuracy_drop
      - inject_latency_spike
      - inject_error_rate_increase
    verify_alert_triggered: <1_minute
    verify_escalation: correct_channels
  
  dashboard_validation:
    all_metrics_visible: true
    refresh_rate: <30_seconds
    historical_data: 90_days
```

## Evidence Requirements

**Performance Baselines**:
- Initial baseline documentation
- Baseline recalibration records
- Threshold justification

**Monitoring Dashboards**:
- Model performance dashboard
- System performance dashboard
- Business metrics dashboard
- Fairness metrics dashboard

**Performance Reports**:
- Daily performance summaries
- Weekly trend analysis
- Monthly performance reviews
- Quarterly audits

**Alert History**:
- All alerts (with resolution)
- Response time metrics
- Root cause analysis reports
- Remediation actions taken

**Degradation Analysis**:
- Performance degradation incidents
- Root cause investigations
- Retraining decisions and outcomes
- Rollback records

## Related Controls

### Direct Dependencies

**comp-en18031-026-ai-system-monitoring**: Comprehensive system monitoring (foundation)
**comp-en18031-023-model-drift-detection**: Drift detection (subset of performance monitoring)
**comp-en18031-033-ai-system-rollback**: Rollback on performance degradation

### Related Controls

**comp-en18031-017-model-validation**: Initial performance validation
**comp-en18031-028-model-serving-infrastructure**: Infrastructure performance
**comp-en18031-021-model-fairness-testing**: Fairness metrics monitoring

## Status

### Implementation Checklist

**Performance Metrics**:
- [ ] Model performance metrics defined (accuracy, precision, recall, F1)
- [ ] Per-class metrics tracking implemented
- [ ] System performance metrics configured (latency, throughput)
- [ ] Business metrics tracking enabled
- [ ] Fairness metrics monitoring operational

**Baseline Establishment**:
- [ ] Initial baselines computed and documented
- [ ] Baseline validation completed
- [ ] Threshold values set and justified
- [ ] Baseline recalibration schedule defined

**Monitoring Implementation**:
- [ ] Real-time metrics collection operational
- [ ] Batch evaluation configured (daily/weekly)
- [ ] Ground truth integration implemented
- [ ] Historical data storage configured (90+ days)

**Dashboards**:
- [ ] Model performance dashboard deployed
- [ ] System performance dashboard operational
- [ ] Business metrics dashboard configured
- [ ] Fairness metrics dashboard available
- [ ] Executive summary dashboard created

**Alerting**:
- [ ] Alert thresholds configured per metric
- [ ] Alert routing operational (Slack, PagerDuty)
- [ ] Escalation policies defined
- [ ] Alert deduplication active
- [ ] Alert testing completed

**Response Procedures**:
- [ ] Performance degradation runbook documented
- [ ] Retraining decision tree defined
- [ ] Rollback procedures tested
- [ ] Root cause analysis workflow established

**Validation**:
- [ ] Metrics collection validated (100% coverage)
- [ ] Alert system tested (synthetic degradation)
- [ ] Dashboard accuracy verified
- [ ] Response time targets met (alert <1 min)

**Compliance**:
- [ ] EN 18031 6.4.4 controls documented
- [ ] Performance SLAs defined
- [ ] Monitoring coverage verified
- [ ] Annual performance audit scheduled
