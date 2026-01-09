---
id: comp-en18031-041-numerical-performance-regression-testing
title: COMP-EN18031-041 - Numerical Performance Regression Testing
sidebar_label: COMP-EN18031-041
sidebar_position: 41
status: pending-verification
references: []
---

# COMP-EN18031-041: Numerical Performance Regression Testing

## Overview

**Purpose**: Ensure AI/ML models maintain numerical performance thresholds over time  
**EN 18031 Control**: 5.3.9 (Model Performance Monitoring)  
**Category**: ai-model, performance  
**Priority**: high  
**Framework**: EN 18031 + ISO 24028 (AI Trustworthiness) + ISO 23894 (AI Risk Management)

## Description

Implements continuous numerical performance regression testing for AI/ML models to detect degradation in accuracy, precision, recall, and computational performance. This control ensures models maintain required performance thresholds throughout their lifecycle and prevents silent performance degradation.

## Regulatory Context

### EN 18031 Alignment
- **5.3.9**: Model performance monitoring and maintenance
- **5.4.5**: Continuous monitoring requirements
- **5.5.5**: AI system testing (performance aspects)

### ISO Standards
- **ISO 24028**: AI trustworthiness characteristics (performance, safety)
- **ISO 23894**: AI risk management (performance risks)
- **ISO/IEC TS 6254**: Continuous AI learning systems (performance stability)

### EU AI Act
- **Article 15**: Accuracy requirements for high-risk AI
- **Article 61**: Post-market monitoring

## Acceptance Criteria

```gherkin
Feature: Numerical Performance Regression Testing
  As an ML Engineer
  I want to track numerical performance metrics over time
  So that I can detect and prevent model degradation

  Background:
    Given AI/ML model is deployed to production
    And baseline performance metrics are established
    And performance thresholds are defined
    And continuous monitoring is configured

  Scenario: Baseline Performance Establishment
    Given model training is complete
    And validation dataset is available
    When baseline performance evaluation runs
    Then accuracy baseline shall be recorded
    And precision baseline shall be recorded
    And recall baseline shall be recorded
    And F1 score baseline shall be recorded
    And inference latency baseline shall be recorded
    And computational cost baseline shall be recorded
    And all baselines shall be version controlled

  Scenario: Continuous Performance Monitoring
    Given model is deployed to production
    And baseline metrics exist
    When performance evaluation runs on schedule
    Then current metrics shall be compared to baseline
    And statistical significance shall be calculated
    And confidence intervals shall be computed
    And metrics shall be logged with timestamps

  Scenario: Performance Degradation Detection
    Given performance monitoring is active
    When accuracy drops below threshold
    Or precision drops below threshold
    Or recall drops below threshold
    Or F1 score drops below threshold
    Then alert shall be triggered immediately
    And degradation report shall be generated
    And investigation workflow shall initiate
    And stakeholders shall be notified

  Scenario: Inference Performance Regression
    Given model is serving production traffic
    When P95 latency exceeds threshold by 10%
    Or P99 latency exceeds threshold by 15%
    Or average latency increases 20% over 7 days
    Or computational cost increases 25% over 30 days
    Then performance regression alert shall trigger
    And root cause analysis shall begin
    And optimization recommendations shall be generated

  Scenario: Statistical Validation of Performance Changes
    Given performance metrics are collected over time
    When comparing current vs baseline performance
    Then statistical tests shall be applied (t-test, KS test)
    And confidence level shall be ≥95%
    And effect size shall be calculated
    And results shall be statistically significant before alerting

  Scenario: Performance Recovery Validation
    Given performance degradation was detected
    And remediation actions were taken
    When validation tests run post-remediation
    Then performance shall return to ≥baseline thresholds
    And sustained recovery shall be validated over 7 days
    And evidence shall be documented

  Scenario: Multi-Metric Performance Dashboard
    Given multiple performance metrics are tracked
    When dashboard is accessed
    Then metrics shall display with trend analysis
    And alerts shall be color-coded by severity
    And historical comparison shall be available
    And exportable reports shall be generated
```

## Technical Implementation

### Performance Metrics Definition

#### Model Quality Metrics
```yaml
performance_requirements:
  accuracy:
    baseline: 0.92
    threshold: 0.87  # Alert if drops below (baseline * 0.95)
    critical_threshold: 0.85  # Rollback if drops below
    measurement_frequency: hourly
    statistical_test: binomial_test
    confidence_level: 0.95

  precision:
    baseline: 0.90
    threshold: 0.855
    critical_threshold: 0.83
    class_specific: true  # Track per-class metrics

  recall:
    baseline: 0.88
    threshold: 0.836
    critical_threshold: 0.81

  f1_score:
    baseline: 0.89
    threshold: 0.845
    critical_threshold: 0.82

  auc_roc:
    baseline: 0.94
    threshold: 0.893
    measurement_frequency: daily
```

#### Computational Performance Metrics
```yaml
performance_requirements:
  inference_latency_p50_ms:
    baseline: 25
    threshold: 30  # +20% allowed
    critical_threshold: 37.5  # +50% triggers rollback

  inference_latency_p95_ms:
    baseline: 50
    threshold: 55  # +10% allowed
    critical_threshold: 65  # +30% triggers rollback

  inference_latency_p99_ms:
    baseline: 75
    threshold: 86.25  # +15% allowed
    critical_threshold: 105  # +40% triggers rollback

  throughput_qps:
    baseline: 1000
    threshold: 900  # -10% allowed
    critical_threshold: 800  # -20% triggers investigation

  memory_usage_mb:
    baseline: 512
    threshold: 614.4  # +20% allowed
    critical_threshold: 768  # +50% triggers alert

  computational_cost_per_1k_inferences:
    baseline: 0.05  # USD
    threshold: 0.0625  # +25% allowed
    critical_threshold: 0.075  # +50% triggers optimization
```

### Testing Infrastructure

#### Automated Regression Test Suite
```typescript
// tests/requirements/req-ml-perf-001/numerical-regression.test.ts

describe('Numerical Performance Regression Tests', () => {
  let model: MLModel;
  let baseline: PerformanceBaseline;
  let validationDataset: Dataset;

  beforeAll(async () => {
    model = await loadModel('production');
    baseline = await loadBaseline('v2.1.0');
    validationDataset = await loadDataset('validation_holdout');
  });

  describe('Model Quality Metrics', () => {
    it('should maintain accuracy above threshold', async () => {
      const results = await model.evaluate(validationDataset);
      const { accuracy } = results;
      
      expect(accuracy).toBeGreaterThanOrEqual(baseline.accuracy.threshold);
      
      // Statistical significance test
      const pValue = binomialTest(
        results.correct,
        results.total,
        baseline.accuracy.baseline
      );
      expect(pValue).toBeGreaterThan(0.05);  // Not significantly worse
      
      // Log evidence
      await logPerformanceEvidence({
        metric: 'accuracy',
        current: accuracy,
        baseline: baseline.accuracy.baseline,
        threshold: baseline.accuracy.threshold,
        pValue,
        passed: accuracy >= baseline.accuracy.threshold
      });
    });

    it('should maintain precision above threshold', async () => {
      const results = await model.evaluate(validationDataset);
      const { precision } = results;
      
      expect(precision).toBeGreaterThanOrEqual(baseline.precision.threshold);
      
      // Per-class precision check
      for (const [className, classMetrics] of Object.entries(results.perClass)) {
        expect(classMetrics.precision).toBeGreaterThanOrEqual(
          baseline.precision.perClass[className].threshold
        );
      }
    });

    it('should maintain F1 score above threshold', async () => {
      const results = await model.evaluate(validationDataset);
      const { f1Score } = results;
      
      expect(f1Score).toBeGreaterThanOrEqual(baseline.f1Score.threshold);
      
      // Effect size calculation (Cohen's d)
      const effectSize = calculateCohenD(
        f1Score,
        baseline.f1Score.baseline,
        baseline.f1Score.stdDev
      );
      
      // Ensure no large negative effect
      expect(effectSize).toBeGreaterThan(-0.5);  // Medium effect threshold
    });
  });

  describe('Computational Performance Metrics', () => {
    it('should maintain P95 latency below threshold', async () => {
      const latencies = await benchmarkInference(model, 1000);
      const p95 = percentile(latencies, 0.95);
      
      expect(p95).toBeLessThanOrEqual(baseline.latency_p95_ms.threshold);
      
      // Trend analysis: check if degrading over time
      const recentP95 = await getRecentP95Latencies(days = 7);
      const trend = linearRegressionSlope(recentP95);
      
      if (trend > 1.0) {  // Increasing by >1ms per day
        console.warn(`Latency trend increasing: ${trend}ms/day`);
      }
    });

    it('should maintain throughput above threshold', async () => {
      const throughput = await measureThroughput(model, duration = 60);
      
      expect(throughput).toBeGreaterThanOrEqual(baseline.throughput_qps.threshold);
    });

    it('should not exceed memory usage threshold', async () => {
      const memoryUsage = await measureMemoryUsage(model);
      
      expect(memoryUsage).toBeLessThanOrEqual(baseline.memory_usage_mb.threshold);
    });
  });

  describe('Statistical Validation', () => {
    it('should use statistical tests for regression detection', async () => {
      const currentMetrics = await collectMetrics(days = 7);
      const historicalMetrics = await getBaselineMetrics();
      
      // Two-sample t-test for accuracy
      const tTest = twoSampleTTest(
        currentMetrics.accuracy,
        historicalMetrics.accuracy
      );
      
      // Fail if significantly worse (p < 0.05 and current mean < baseline)
      if (tTest.pValue < 0.05 && tTest.currentMean < tTest.baselineMean) {
        throw new Error(`Significant performance degradation detected: 
          Current: ${tTest.currentMean.toFixed(4)}
          Baseline: ${tTest.baselineMean.toFixed(4)}
          p-value: ${tTest.pValue.toFixed(6)}`);
      }
      
      // Kolmogorov-Smirnov test for distribution shift
      const ksTest = kolmogorovSmirnovTest(
        currentMetrics.predictionDistribution,
        historicalMetrics.predictionDistribution
      );
      
      expect(ksTest.pValue).toBeGreaterThan(0.05);  // No significant drift
    });
  });

  describe('Continuous Monitoring Integration', () => {
    it('should log all metrics to monitoring system', async () => {
      const results = await model.evaluate(validationDataset);
      
      await logToMonitoring({
        timestamp: Date.now(),
        modelVersion: model.version,
        metrics: results,
        baseline: baseline,
        environment: 'production'
      });
      
      // Verify metrics were logged
      const logged = await queryMonitoring({
        modelVersion: model.version,
        since: Date.now() - 60000  // Last minute
      });
      
      expect(logged.length).toBeGreaterThan(0);
    });
  });
});
```

### Monitoring & Alerting Configuration

```yaml
# monitoring/performance-alerts.yaml
alerts:
  model_accuracy_degradation:
    metric: accuracy
    condition: current < threshold
    severity: critical
    notification:
      - slack: #ml-alerts
      - pagerduty: ml-oncall
      - email: ml-team@company.com
    investigation_runbook: docs/runbooks/model-degradation.md

  model_latency_regression:
    metric: inference_latency_p95_ms
    condition: current > threshold
    severity: high
    notification:
      - slack: #ml-performance
      - email: ml-team@company.com
    auto_remediation:
      - scale_up_instances: true
      - enable_model_caching: true

  statistical_drift_detected:
    metric: prediction_distribution
    condition: ks_test.pValue < 0.05
    severity: medium
    notification:
      - slack: #ml-alerts
    investigation_required: true
```

## Evidence Requirements

### Required Documentation
- Performance baseline documentation (model version, metrics, timestamp)
- Regression test results (automated, scheduled)
- Alert logs (degradation incidents, responses)
- Statistical test results (t-tests, KS tests, effect sizes)
- Remediation actions (retraining, optimization, rollback)
- Trend analysis reports (weekly, monthly)

### Evidence Collection
```bash
# Automated evidence collection
sc test run --ml-regression \
  --model-version v2.1.0 \
  --baseline baseline-v2.1.0.json \
  --evidence-type numerical-regression \
  --compliance

# Evidence stored:
# - .supernal/test-results/test-ml-regression-2025-12-12-001.json
# - .supernal/evidence/numerical-regression/2025-12-12-performance-report.pdf
```

## Related Controls

### Within EN 18031
- **comp-en18031-017**: Model Validation (initial validation)
- **comp-en18031-023**: Model Drift Detection (distribution drift)
- **comp-en18031-026**: AI System Monitoring (operational monitoring)
- **comp-en18031-038**: AI System Testing (comprehensive testing)

### Cross-Framework
- **comp-iso27001-074**: Performance monitoring
- **comp-soc2-cc7.2**: System monitoring and alerting
- **comp-fda-006**: Performance Qualification (IQ/OQ/PQ)

### AI-Specific Standards
- **ISO 24028**: AI trustworthiness (performance characteristics)
- **ISO 23894**: AI risk management (performance risks)
- **ISO/IEC TS 6254**: Continuous learning AI (stability requirements)

## Implementation Notes

### Best Practices
- ✅ **Automate regression tests** in CI/CD pipeline
- ✅ **Use statistical tests** for significance (not just thresholds)
- ✅ **Track trends** over time, not just point-in-time metrics
- ✅ **Set graduated thresholds** (warning, critical, rollback)
- ✅ **Document baselines** with model versions and datasets
- ✅ **Test on representative data** (holdout validation sets)
- ✅ **Monitor computational costs** alongside quality metrics

### Common Pitfalls
- ❌ **No baselines** - Can't detect regression without baseline
- ❌ **Threshold without statistics** - False alerts from normal variation
- ❌ **Only accuracy** - Ignoring latency, memory, cost
- ❌ **Manual testing** - Regression must be continuous and automated
- ❌ **No trend analysis** - Slow degradation goes unnoticed
- ❌ **Test data leakage** - Using training data for validation

### Tooling & Integration
```bash
# MLflow integration
mlflow run . --entry-point performance_regression_test

# Evidently AI integration
evidently test-suite --config numerical-regression.yaml

# Custom sc integration
sc test run --ml-regression --model ${MODEL_VERSION}
```

## Compliance Validation

### Audit Checklist
- [ ] Performance baselines documented and version-controlled
- [ ] Regression tests automated and scheduled (hourly/daily)
- [ ] Statistical tests configured with ≥95% confidence
- [ ] Alerting configured for degradation scenarios
- [ ] Evidence collection automated (logs, reports, metrics)
- [ ] Remediation runbooks documented and tested
- [ ] Trend analysis dashboards accessible to stakeholders

## Status
- [ ] Performance requirements defined (accuracy, latency, cost)
- [ ] Baseline metrics established from production model
- [ ] Regression test suite implemented and automated
- [ ] Monitoring infrastructure configured (metrics, alerts)
- [ ] Statistical validation integrated (t-tests, KS tests)
- [ ] Dashboards created for visualization
- [ ] Runbooks documented for degradation scenarios
- [ ] Evidence collection automated
- [ ] Audit trail verified and compliance-ready

