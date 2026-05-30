---
id: comp-en18031-021
title: Model Fairness Testing
framework: en18031
category: Model Development & Validation
priority: high
status: pending-verification
version: '1.0'
last_updated: '2025-12-13'
references: []
next_review: '2026-06-13'
owner: AI Safety Team
stakeholders:
  - Data Science
  - Ethics Board
  - Legal & Compliance
  - Product Management
controls:
  - Fairness Metrics
  - Bias Detection
  - Disparate Impact Analysis
  - Fairness Constraints
related_cards:
  - comp-en18031-010
  - comp-en18031-019
  - comp-soc-013
  - comp-gdpr-011
---

# Model Fairness Testing

## Executive Summary

This compliance card establishes requirements for **systematic fairness testing** of AI/ML models to detect and mitigate bias across protected groups and sensitive attributes. Fairness testing ensures models produce equitable outcomes and do not perpetuate or amplify societal biases.

**Business Impact:**
- **Risk Mitigation**: Prevents discriminatory outcomes that could lead to legal liability ($10M+ settlements)
- **Trust & Reputation**: Demonstrates commitment to ethical AI and social responsibility
- **Regulatory Compliance**: Satisfies emerging AI fairness regulations (EU AI Act, NYC Local Law 144)
- **Market Access**: Required for deployment in regulated sectors (finance, healthcare, employment)

**Key Metrics:**
- Demographic parity: ≤5% difference across groups
- Equalized odds: TPR/FPR within 5% across groups
- Calibration: Predicted probabilities accurate within 2% across groups
- Fairness audit frequency: Quarterly for production models

---

## Control Objective

Implement comprehensive fairness testing to:

1. **Detect Bias**: Identify unfair treatment across demographic groups
2. **Measure Fairness**: Quantify fairness using multiple metrics
3. **Mitigate Discrimination**: Apply fairness constraints and interventions
4. **Monitor Continuously**: Track fairness metrics in production
5. **Document Decisions**: Maintain audit trail of fairness trade-offs

---

## Applicable Standards & Regulations

### Primary Standards
- **EN 18031:2024**: AI Safety & Trustworthiness
  - Section 7.4: Fairness and Non-Discrimination
  - Section 8.2: Bias Testing
  - Annex C: Fairness Metrics

### Related Standards
- **ISO/IEC 23894:2023**: AI Risk Management - Guidance on Bias
- **IEEE 7010:2020**: Recommended Practice for Assessing Well-being Impact
- **EU AI Act**: Article 10 (Data and Data Governance) - Fairness Requirements
- **NYC Local Law 144**: Automated Employment Decision Tools
- **Equal Credit Opportunity Act (ECOA)**: Fair lending requirements
- **Title VII Civil Rights Act**: Employment discrimination

---

## Detailed Requirements

### 1. Protected Attribute Identification

**Requirement**: Identify all protected attributes relevant to the model's use case.

**Protected Attributes**:
- **Demographics**: Race, ethnicity, gender, age, national origin
- **Legal**: Disability status, religion, veteran status
- **Contextual**: Geography, language, socioeconomic indicators
- **Proxy Variables**: Features correlated with protected attributes

**Implementation**:
```python
# Define protected attributes for fairness testing
PROTECTED_ATTRIBUTES = {
    'demographic': ['race', 'ethnicity', 'gender', 'age_group'],
    'legal': ['disability', 'religion', 'veteran_status'],
    'geographic': ['zip_code', 'state', 'urban_rural'],
    'proxy': ['name', 'address', 'education_level']
}

# Identify intersectional groups
INTERSECTIONAL_GROUPS = [
    ('race', 'gender'),
    ('age_group', 'disability'),
    ('ethnicity', 'geography')
]
```

**Validation**:
- [ ] All legally protected attributes identified
- [ ] Proxy variables documented with correlation analysis
- [ ] Intersectional groups defined for high-risk applications
- [ ] Attribute identification reviewed by legal team

---

### 2. Fairness Metric Selection

**Requirement**: Select appropriate fairness metrics based on use case and stakeholder values.

**Fairness Metrics**:

#### Group Fairness Metrics

**Demographic Parity** (Statistical Parity):
```python
def demographic_parity(y_pred, protected_attr):
    """
    P(ŷ=1 | A=a) = P(ŷ=1 | A=b) for all groups a, b
    
    Measures: Equal selection rates across groups
    Use case: Opportunity allocation (loans, jobs, college admissions)
    """
    rates = {}
    for group in protected_attr.unique():
        mask = protected_attr == group
        rates[group] = y_pred[mask].mean()
    
    # Calculate max difference
    max_diff = max(rates.values()) - min(rates.values())
    return rates, max_diff
```

**Equalized Odds**:
```python
def equalized_odds(y_true, y_pred, protected_attr):
    """
    P(ŷ=1 | A=a, Y=y) = P(ŷ=1 | A=b, Y=y) for all groups a, b and outcomes y
    
    Measures: Equal TPR and FPR across groups
    Use case: Risk assessment (recidivism, credit default, medical diagnosis)
    """
    metrics = {}
    for group in protected_attr.unique():
        mask = protected_attr == group
        metrics[group] = {
            'tpr': recall_score(y_true[mask], y_pred[mask]),
            'fpr': fpr_score(y_true[mask], y_pred[mask]),
            'tnr': tnr_score(y_true[mask], y_pred[mask]),
            'fnr': fnr_score(y_true[mask], y_pred[mask])
        }
    return metrics
```

**Equal Opportunity**:
```python
def equal_opportunity(y_true, y_pred, protected_attr):
    """
    P(ŷ=1 | A=a, Y=1) = P(ŷ=1 | A=b, Y=1) for all groups a, b
    
    Measures: Equal true positive rates (recall) across groups
    Use case: Benefit allocation where false negatives are costly
    """
    tpr_by_group = {}
    for group in protected_attr.unique():
        mask = (protected_attr == group) & (y_true == 1)
        tpr_by_group[group] = y_pred[mask].mean()
    return tpr_by_group
```

**Predictive Parity**:
```python
def predictive_parity(y_true, y_pred, protected_attr):
    """
    P(Y=1 | ŷ=1, A=a) = P(Y=1 | ŷ=1, A=b) for all groups a, b
    
    Measures: Equal precision (PPV) across groups
    Use case: When false positives have severe consequences
    """
    ppv_by_group = {}
    for group in protected_attr.unique():
        mask = (protected_attr == group) & (y_pred == 1)
        if mask.sum() > 0:
            ppv_by_group[group] = y_true[mask].mean()
        else:
            ppv_by_group[group] = None
    return ppv_by_group
```

**Calibration**:
```python
def calibration_by_group(y_true, y_prob, protected_attr, n_bins=10):
    """
    P(Y=1 | ŷ=p, A=a) ≈ p for all groups a and probabilities p
    
    Measures: Predicted probabilities match actual outcomes across groups
    Use case: When probability estimates are used for decision-making
    """
    calibration_curves = {}
    for group in protected_attr.unique():
        mask = protected_attr == group
        prob_true, prob_pred = calibration_curve(
            y_true[mask], y_prob[mask], n_bins=n_bins
        )
        calibration_curves[group] = {
            'prob_true': prob_true,
            'prob_pred': prob_pred,
            'ece': expected_calibration_error(prob_true, prob_pred)
        }
    return calibration_curves
```

#### Individual Fairness Metrics

**Similarity-Based Fairness**:
```python
def individual_fairness(X, y_pred, similarity_metric='cosine'):
    """
    Similar individuals should receive similar predictions
    
    d(x_i, x_j) small => |ŷ_i - ŷ_j| small
    """
    from sklearn.metrics.pairwise import cosine_similarity
    
    # Compute pairwise similarities
    similarities = cosine_similarity(X)
    
    # Compute prediction differences
    pred_diffs = np.abs(y_pred[:, None] - y_pred[None, :])
    
    # Fairness violation: high similarity, large prediction difference
    violations = (similarities > 0.9) & (pred_diffs > 0.2)
    
    return {
        'violation_rate': violations.sum() / (len(X) * (len(X)-1)),
        'avg_pred_diff_for_similar': pred_diffs[similarities > 0.9].mean()
    }
```

**Counterfactual Fairness**:
```python
def counterfactual_fairness(model, X, protected_attr):
    """
    Prediction should remain the same if protected attribute is changed
    
    P(ŷ | X, A=a) = P(ŷ | X, A=b) for individual X
    """
    predictions_original = model.predict_proba(X)
    
    counterfactuals = []
    for alt_value in protected_attr.unique():
        X_counterfactual = X.copy()
        X_counterfactual[protected_attr.name] = alt_value
        pred_cf = model.predict_proba(X_counterfactual)
        counterfactuals.append(pred_cf)
    
    # Measure prediction stability across counterfactuals
    max_deviation = np.max(np.abs(
        predictions_original[:, None, :] - 
        np.array(counterfactuals).transpose(1, 0, 2)
    ), axis=1)
    
    return {
        'avg_max_deviation': max_deviation.mean(),
        'high_deviation_rate': (max_deviation > 0.1).mean()
    }
```

**Validation**:
- [ ] Fairness metrics aligned with use case and legal requirements
- [ ] Multiple metrics used to capture different fairness notions
- [ ] Metric thresholds defined based on risk assessment
- [ ] Trade-offs between metrics documented

---

### 3. Fairness Testing Implementation

**Requirement**: Implement systematic fairness testing across model development lifecycle.

#### Pre-Training: Data Fairness Audit

```python
def audit_training_data_fairness(data, protected_attrs):
    """
    Audit training data for representation and label bias
    """
    audit_results = {
        'representation_bias': {},
        'label_bias': {},
        'feature_correlation': {}
    }
    
    # Representation bias: Check group sizes
    for attr in protected_attrs:
        counts = data[attr].value_counts()
        audit_results['representation_bias'][attr] = {
            'counts': counts.to_dict(),
            'min_representation': counts.min() / len(data),
            'imbalance_ratio': counts.max() / counts.min()
        }
    
    # Label bias: Check outcome rates by group
    for attr in protected_attrs:
        label_rates = data.groupby(attr)['label'].mean()
        audit_results['label_bias'][attr] = {
            'rates': label_rates.to_dict(),
            'max_diff': label_rates.max() - label_rates.min()
        }
    
    # Feature correlation: Identify proxy variables
    for attr in protected_attrs:
        correlations = data.corrwith(
            pd.get_dummies(data[attr], drop_first=True).iloc[:, 0]
        ).abs().sort_values(ascending=False)
        audit_results['feature_correlation'][attr] = \
            correlations.head(10).to_dict()
    
    return audit_results
```

#### Post-Training: Model Fairness Evaluation

```python
def evaluate_model_fairness(model, X_test, y_test, protected_attrs):
    """
    Comprehensive fairness evaluation of trained model
    """
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    fairness_report = {}
    
    for attr in protected_attrs:
        attr_values = X_test[attr]
        
        fairness_report[attr] = {
            'demographic_parity': demographic_parity(y_pred, attr_values),
            'equalized_odds': equalized_odds(y_test, y_pred, attr_values),
            'equal_opportunity': equal_opportunity(y_test, y_pred, attr_values),
            'predictive_parity': predictive_parity(y_test, y_pred, attr_values),
            'calibration': calibration_by_group(y_test, y_prob, attr_values),
            'group_sizes': attr_values.value_counts().to_dict()
        }
    
    # Overall fairness score
    fairness_report['overall_score'] = compute_fairness_score(fairness_report)
    fairness_report['violations'] = identify_fairness_violations(fairness_report)
    
    return fairness_report
```

#### Production: Continuous Fairness Monitoring

```python
class FairnessMonitor:
    """
    Monitor fairness metrics in production with alerting
    """
    def __init__(self, protected_attrs, thresholds):
        self.protected_attrs = protected_attrs
        self.thresholds = thresholds
        self.baseline_metrics = None
        
    def set_baseline(self, model, X_baseline, y_baseline):
        """Set baseline fairness metrics from validation data"""
        self.baseline_metrics = evaluate_model_fairness(
            model, X_baseline, y_baseline, self.protected_attrs
        )
    
    def monitor_batch(self, model, X_batch, y_batch):
        """Monitor fairness for new batch of predictions"""
        current_metrics = evaluate_model_fairness(
            model, X_batch, y_batch, self.protected_attrs
        )
        
        # Detect fairness drift
        drift_detected = self._detect_fairness_drift(
            self.baseline_metrics, current_metrics
        )
        
        # Check threshold violations
        violations = self._check_thresholds(current_metrics)
        
        if drift_detected or violations:
            self._trigger_alert(current_metrics, drift_detected, violations)
        
        return {
            'metrics': current_metrics,
            'drift': drift_detected,
            'violations': violations
        }
    
    def _detect_fairness_drift(self, baseline, current):
        """Detect significant changes in fairness metrics"""
        drift = {}
        for attr in self.protected_attrs:
            # Compare demographic parity
            baseline_dp = baseline[attr]['demographic_parity'][1]
            current_dp = current[attr]['demographic_parity'][1]
            
            if abs(current_dp - baseline_dp) > 0.02:  # 2% threshold
                drift[attr] = {
                    'metric': 'demographic_parity',
                    'baseline': baseline_dp,
                    'current': current_dp,
                    'change': current_dp - baseline_dp
                }
        return drift
```

**Validation**:
- [ ] Fairness testing integrated into CI/CD pipeline
- [ ] Pre-training data audits performed
- [ ] Post-training model fairness evaluated
- [ ] Production monitoring with alerting configured

---

### 4. Bias Mitigation Strategies

**Requirement**: Apply appropriate bias mitigation techniques when fairness violations are detected.

#### Pre-Processing: Data-Level Mitigation

**Reweighting**:
```python
def reweight_training_data(X, y, protected_attr):
    """
    Assign weights to balance outcomes across groups
    """
    from sklearn.utils.class_weight import compute_sample_weight
    
    # Create stratification key combining protected attr and label
    stratify_key = protected_attr.astype(str) + '_' + y.astype(str)
    
    # Compute balanced weights
    weights = compute_sample_weight('balanced', stratify_key)
    
    return weights
```

**Resampling**:
```python
def fairness_aware_resampling(X, y, protected_attr, strategy='oversample'):
    """
    Resample data to achieve demographic parity
    """
    from imblearn.over_sampling import SMOTE
    from imblearn.under_sampling import RandomUnderSampler
    
    # Combine features and protected attribute
    X_combined = pd.concat([X, protected_attr], axis=1)
    
    if strategy == 'oversample':
        sampler = SMOTE(sampling_strategy='auto')
    elif strategy == 'undersample':
        sampler = RandomUnderSampler(sampling_strategy='auto')
    
    X_resampled, y_resampled = sampler.fit_resample(X_combined, y)
    
    return X_resampled, y_resampled
```

#### In-Processing: Algorithm-Level Mitigation

**Fairness Constraints**:
```python
from fairlearn.reductions import ExponentiatedGradient, DemographicParity

def train_with_fairness_constraints(X, y, protected_attr, base_model):
    """
    Train model with fairness constraints using reduction methods
    """
    # Define fairness constraint
    constraint = DemographicParity()
    
    # Wrap base model with fairness-aware training
    mitigator = ExponentiatedGradient(
        estimator=base_model,
        constraints=constraint,
        eps=0.05  # Maximum allowed fairness violation
    )
    
    # Train with fairness constraints
    mitigator.fit(X, y, sensitive_features=protected_attr)
    
    return mitigator
```

**Adversarial Debiasing**:
```python
import tensorflow as tf

class AdversarialDebiasing(tf.keras.Model):
    """
    Train model to maximize accuracy while preventing predictor from
    identifying protected attribute from predictions
    """
    def __init__(self, input_dim, protected_dim):
        super().__init__()
        
        # Predictor network
        self.predictor = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        
        # Adversary network (tries to predict protected attribute)
        self.adversary = tf.keras.Sequential([
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(protected_dim, activation='softmax')
        ])
    
    def call(self, inputs):
        predictions = self.predictor(inputs)
        return predictions
    
    def train_step(self, data):
        X, (y, protected_attr) = data
        
        with tf.GradientTape() as tape:
            # Forward pass
            y_pred = self.predictor(X)
            protected_pred = self.adversary(y_pred)
            
            # Losses
            prediction_loss = tf.keras.losses.binary_crossentropy(y, y_pred)
            adversary_loss = tf.keras.losses.categorical_crossentropy(
                protected_attr, protected_pred
            )
            
            # Combined loss: maximize prediction accuracy, minimize
            # adversary's ability to predict protected attribute
            total_loss = prediction_loss - 0.5 * adversary_loss
        
        # Update weights
        grads = tape.gradient(total_loss, self.trainable_variables)
        self.optimizer.apply_gradients(zip(grads, self.trainable_variables))
        
        return {'loss': total_loss}
```

#### Post-Processing: Prediction-Level Mitigation

**Threshold Optimization**:
```python
from fairlearn.postprocessing import ThresholdOptimizer

def optimize_thresholds_for_fairness(y_true, y_prob, protected_attr):
    """
    Find group-specific thresholds that optimize fairness
    """
    optimizer = ThresholdOptimizer(
        estimator=None,  # Already have predictions
        constraints='equalized_odds',
        objective='accuracy_score'
    )
    
    # Fit threshold optimizer
    optimizer.fit(y_prob, y_true, sensitive_features=protected_attr)
    
    # Get optimal thresholds
    thresholds = optimizer.interpolated_thresholder_.interpolation_dict
    
    return thresholds
```

**Calibrated Equalized Odds**:
```python
def calibrated_equalized_odds_postprocess(y_true, y_prob, protected_attr):
    """
    Post-process predictions to achieve equalized odds while preserving calibration
    """
    from fairlearn.postprocessing import plot_threshold_optimizer
    
    # Find optimal decision rules per group
    adjusted_predictions = {}
    
    for group in protected_attr.unique():
        mask = protected_attr == group
        
        # Compute group-specific ROC curve
        fpr, tpr, thresholds = roc_curve(y_true[mask], y_prob[mask])
        
        # Find threshold that balances TPR/FPR with other groups
        optimal_threshold = find_equalized_odds_threshold(
            fpr, tpr, thresholds, y_true, y_prob, protected_attr, group
        )
        
        adjusted_predictions[group] = (y_prob[mask] >= optimal_threshold).astype(int)
    
    # Combine adjusted predictions
    y_adjusted = np.zeros_like(y_prob)
    for group in protected_attr.unique():
        mask = protected_attr == group
        y_adjusted[mask] = adjusted_predictions[group]
    
    return y_adjusted
```

**Validation**:
- [ ] Mitigation strategy selected based on use case and constraints
- [ ] Pre-processing, in-processing, and post-processing options evaluated
- [ ] Fairness-accuracy trade-offs documented
- [ ] Mitigation effectiveness validated on held-out test set

---

### 5. Intersectional Fairness

**Requirement**: Evaluate fairness for intersectional groups (e.g., race × gender).

```python
def intersectional_fairness_analysis(model, X, y, protected_attrs):
    """
    Analyze fairness across intersections of protected attributes
    """
    # Create intersectional groups
    X['intersectional_group'] = ''
    for attr in protected_attrs:
        X['intersectional_group'] += X[attr].astype(str) + '_'
    
    # Evaluate fairness for intersectional groups
    y_pred = model.predict(X.drop('intersectional_group', axis=1))
    
    results = {}
    for group in X['intersectional_group'].unique():
        mask = X['intersectional_group'] == group
        
        if mask.sum() >= 30:  # Minimum sample size
            results[group] = {
                'size': mask.sum(),
                'selection_rate': y_pred[mask].mean(),
                'accuracy': accuracy_score(y[mask], y_pred[mask]),
                'tpr': recall_score(y[mask], y_pred[mask]),
                'fpr': fpr_score(y[mask], y_pred[mask])
            }
    
    # Identify most disadvantaged groups
    disadvantaged_groups = identify_disadvantaged_groups(results)
    
    return results, disadvantaged_groups
```

**Validation**:
- [ ] Intersectional groups identified for high-risk applications
- [ ] Minimum sample sizes enforced (n≥30 per group)
- [ ] Most disadvantaged intersections documented
- [ ] Mitigation strategies address intersectional bias

---

### 6. Fairness Documentation & Reporting

**Requirement**: Maintain comprehensive documentation of fairness testing and decisions.

**Fairness Report Template**:
```yaml
fairness_report:
  model_id: "credit-risk-model-v2.1"
  report_date: "2025-12-13"
  use_case: "Credit underwriting"
  
  protected_attributes:
    - name: "race"
      values: ["White", "Black", "Hispanic", "Asian", "Other"]
      legal_basis: "ECOA, Fair Lending Laws"
    - name: "gender"
      values: ["Male", "Female", "Non-binary"]
      legal_basis: "ECOA"
    - name: "age_group"
      values: ["18-25", "26-40", "41-60", "60+"]
      legal_basis: "Age Discrimination Act"
  
  fairness_metrics:
    demographic_parity:
      race:
        max_difference: 0.043
        threshold: 0.05
        status: "PASS"
      gender:
        max_difference: 0.028
        threshold: 0.05
        status: "PASS"
    
    equalized_odds:
      race:
        tpr_max_diff: 0.052
        fpr_max_diff: 0.031
        threshold: 0.05
        status: "FAIL"
      gender:
        tpr_max_diff: 0.035
        fpr_max_diff: 0.018
        status: "PASS"
  
  mitigation_applied:
    - method: "Threshold Optimization"
      target_metric: "Equalized Odds"
      effectiveness: "Reduced TPR gap from 5.2% to 3.1%"
      trade_off: "Overall accuracy reduced by 0.8%"
  
  fairness_trade_offs:
    decision: "Prioritize equalized odds over demographic parity"
    justification: >
      Use case involves risk assessment where equal error rates
      across groups are more important than equal selection rates.
      False negatives (denying credit to qualified applicants) and
      false positives (approving unqualified applicants) should
      occur at similar rates across protected groups.
    stakeholder_approval: "Ethics Board, Legal Team, Product Owner"
  
  residual_risks:
    - risk: "Intersectional bias for Black women"
      mitigation: "Additional data collection and targeted retraining"
      acceptance: "Risk accepted with quarterly monitoring"
```

**Validation**:
- [ ] Fairness reports generated for all production models
- [ ] Trade-off decisions documented with stakeholder approval
- [ ] Residual risks identified and monitored
- [ ] Reports available for regulatory inspection

---

## Testing Strategy

### Unit Tests

```python
def test_demographic_parity_calculation():
    """Test demographic parity metric calculation"""
    y_pred = np.array([1, 1, 0, 0, 1, 1, 0, 0])
    protected_attr = np.array(['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B'])
    
    rates, max_diff = demographic_parity(y_pred, protected_attr)
    
    assert rates['A'] == 0.5
    assert rates['B'] == 0.5
    assert max_diff == 0.0

def test_equalized_odds_calculation():
    """Test equalized odds metric calculation"""
    y_true = np.array([1, 1, 0, 0, 1, 1, 0, 0])
    y_pred = np.array([1, 0, 0, 1, 1, 0, 0, 1])
    protected_attr = np.array(['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B'])
    
    metrics = equalized_odds(y_true, y_pred, protected_attr)
    
    assert 'A' in metrics and 'B' in metrics
    assert 'tpr' in metrics['A'] and 'fpr' in metrics['A']

def test_fairness_constraint_training():
    """Test training with fairness constraints"""
    X = np.random.randn(1000, 10)
    y = np.random.randint(0, 2, 1000)
    protected_attr = np.random.choice(['A', 'B'], 1000)
    
    base_model = LogisticRegression()
    fair_model = train_with_fairness_constraints(X, y, protected_attr, base_model)
    
    # Verify fairness improved
    y_pred_fair = fair_model.predict(X)
    _, dp_diff_fair = demographic_parity(y_pred_fair, protected_attr)
    
    y_pred_base = base_model.fit(X, y).predict(X)
    _, dp_diff_base = demographic_parity(y_pred_base, protected_attr)
    
    assert dp_diff_fair < dp_diff_base
```

### Integration Tests

```python
def test_end_to_end_fairness_evaluation():
    """Test complete fairness evaluation pipeline"""
    # Load test data
    X, y, protected_attrs = load_fairness_test_data()
    
    # Train model
    model = train_model(X, y)
    
    # Evaluate fairness
    fairness_report = evaluate_model_fairness(
        model, X, y, ['race', 'gender']
    )
    
    # Verify all metrics calculated
    assert 'race' in fairness_report
    assert 'demographic_parity' in fairness_report['race']
    assert 'equalized_odds' in fairness_report['race']
    assert 'overall_score' in fairness_report

def test_fairness_monitoring_pipeline():
    """Test production fairness monitoring"""
    monitor = FairnessMonitor(['race', 'gender'], thresholds={'dp': 0.05})
    
    # Set baseline
    monitor.set_baseline(model, X_baseline, y_baseline)
    
    # Monitor new batch
    results = monitor.monitor_batch(model, X_new, y_new)
    
    assert 'metrics' in results
    assert 'drift' in results
    assert 'violations' in results
```

---

## Tools & Libraries

### Fairness Testing Frameworks

| Tool | Purpose | Key Features |
|------|---------|--------------|
| **Fairlearn** | Comprehensive fairness toolkit | Metrics, mitigation, visualization |
| **AIF360** (IBM) | AI Fairness 360 | 70+ metrics, 10+ mitigation algorithms |
| **What-If Tool** (Google) | Interactive fairness exploration | Visual analysis, counterfactuals |
| **Aequitas** | Bias audit toolkit | Automated reports, actionable insights |
| **FairML** | Model inspection | Feature importance, proxy detection |

### Implementation Example

```python
from fairlearn.metrics import MetricFrame, demographic_parity_difference
from fairlearn.reductions import ExponentiatedGradient, DemographicParity

# Evaluate fairness with Fairlearn
metric_frame = MetricFrame(
    metrics={
        'accuracy': accuracy_score,
        'precision': precision_score,
        'recall': recall_score
    },
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=protected_attr
)

print(metric_frame.by_group)
print(f"Demographic Parity Difference: {demographic_parity_difference(y_test, y_pred, sensitive_features=protected_attr)}")

# Train fair model
constraint = DemographicParity()
mitigator = ExponentiatedGradient(LogisticRegression(), constraint)
mitigator.fit(X_train, y_train, sensitive_features=protected_attr_train)
```

---

## Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Discriminatory outcomes** | Critical | Medium | Comprehensive fairness testing + mitigation |
| **Legal liability** | Critical | Medium | Compliance with fairness regulations |
| **Reputational damage** | High | Medium | Transparent fairness reporting |
| **Fairness-accuracy trade-off** | Medium | High | Document trade-offs, stakeholder approval |
| **Intersectional bias** | High | Medium | Evaluate intersectional groups |
| **Gaming fairness metrics** | Medium | Low | Use multiple complementary metrics |

---

## Acceptance Criteria (Gherkin)

### Scenario 1: Demographic Parity Evaluation

```gherkin
Feature: Demographic Parity Fairness Testing

  Scenario: Evaluate demographic parity across protected groups
    Given a trained credit risk model
    And test data with protected attribute "race"
    When I calculate demographic parity across racial groups
    Then selection rates should differ by no more than 5%
    And results should be documented in fairness report

  Scenario: Detect demographic parity violation
    Given a model with selection rate 60% for Group A
    And selection rate 48% for Group B
    When I calculate demographic parity difference
    Then difference should be 12%
    And violation should be flagged (> 5% threshold)
    And alert should be triggered for fairness review
```

### Scenario 2: Equalized Odds Testing

```gherkin
Feature: Equalized Odds Fairness Testing

  Scenario: Evaluate equalized odds across gender
    Given a trained hiring model
    And test data with protected attribute "gender"
    When I calculate true positive rates by gender
    Then TPR for Male should be within 5% of TPR for Female
    And FPR for Male should be within 5% of FPR for Female
    And results should pass equalized odds test

  Scenario: Apply mitigation for equalized odds violation
    Given a model with TPR gap of 8% between groups
    When I apply threshold optimization for equalized odds
    Then TPR gap should be reduced to ≤5%
    And overall accuracy should remain ≥baseline - 2%
    And mitigation should be documented with trade-offs
```

### Scenario 3: Fairness Mitigation

```gherkin
Feature: Fairness Mitigation Implementation

  Scenario: Apply reweighting to balance training data
    Given training data with label imbalance across groups
    When I apply fairness-aware reweighting
    Then positive label rates should be balanced across groups
    And model trained on reweighted data should improve fairness
    And performance should not degrade by >3%

  Scenario: Train model with fairness constraints
    Given training data and protected attribute "age_group"
    When I train model with demographic parity constraints
    Then resulting model should satisfy demographic parity (≤5% gap)
    And model should achieve ≥90% of unconstrained accuracy
    And fairness-accuracy trade-off should be documented
```

### Scenario 4: Intersectional Fairness

```gherkin
Feature: Intersectional Fairness Analysis

  Scenario: Evaluate fairness for intersectional groups
    Given a model and protected attributes "race" and "gender"
    When I create intersectional groups (race × gender)
    And evaluate fairness metrics for each intersection
    Then all groups with n≥30 should be evaluated
    And most disadvantaged groups should be identified
    And targeted mitigation should be applied if needed

  Scenario: Address intersectional bias
    Given fairness analysis showing Black women disadvantaged
    When I apply targeted resampling for underrepresented group
    And retrain model with balanced intersectional data
    Then selection rate for Black women should improve by ≥5%
    And fairness across all intersections should improve
```

### Scenario 5: Continuous Fairness Monitoring

```gherkin
Feature: Production Fairness Monitoring

  Scenario: Monitor fairness metrics in production
    Given a production model with baseline fairness metrics
    When new batch of predictions is made
    And fairness metrics are calculated for the batch
    Then metrics should be compared to baseline
    And drift should be detected if metrics deviate >2%
    And alert should be triggered if violations occur

  Scenario: Respond to fairness drift alert
    Given a fairness drift alert for demographic parity
    When fairness engineer investigates the alert
    Then root cause analysis should be performed
    And corrective action should be taken (retrain/adjust thresholds)
    And incident should be documented in audit log
```

### Scenario 6: Fairness Report Generation

```gherkin
Feature: Fairness Documentation and Reporting

  Scenario: Generate comprehensive fairness report
    Given a production model evaluated for fairness
    When fairness report is generated
    Then report should include all protected attributes
    And multiple fairness metrics (DP, EO, PP, Calibration)
    And mitigation strategies applied
    And fairness-accuracy trade-offs documented
    And stakeholder approvals recorded

  Scenario: Regulatory fairness audit
    Given a fairness report for credit underwriting model
    When regulator requests fairness documentation
    Then report should demonstrate compliance with fair lending laws
    And show equalized odds across protected groups
    And document residual risks and monitoring plan
    And be available within 24 hours
```

---

## Compliance Evidence

### Documentation
- [ ] Fairness testing strategy document
- [ ] Protected attribute identification and justification
- [ ] Fairness metric selection rationale
- [ ] Fairness reports for all production models
- [ ] Mitigation strategy evaluation and selection
- [ ] Fairness-accuracy trade-off analysis
- [ ] Intersectional fairness analysis
- [ ] Stakeholder approval records

### Artifacts
- [ ] Fairness test suites (unit + integration)
- [ ] Fairness monitoring dashboards
- [ ] Automated fairness report generation
- [ ] Fairness audit logs
- [ ] Incident response records for fairness violations

### Validation
- [ ] Annual fairness audit by external expert
- [ ] Legal review of fairness compliance
- [ ] Ethics board approval of fairness trade-offs
- [ ] Quarterly fairness metric reviews

---

## Related Controls

### Upstream Dependencies
- [comp-en18031-010: Data Bias Detection](comp-en18031-010-data-bias-detection.md) - Detect bias in training data
- [comp-en18031-009: Training Data Quality](comp-en18031-009-training-data-quality.md) - Ensure representative data
- [comp-en18031-011: Data Labeling Quality](comp-en18031-011-data-labeling-quality.md) - Prevent label bias

### Downstream Dependents
- [comp-en18031-019: Model Adversarial Testing](comp-en18031-019-model-adversarial-testing.md) - Test for fairness attacks
- [comp-en18031-036: Human Oversight](comp-en18031-036-human-oversight.md) - Human review of fairness decisions
- [comp-soc-013: Data Validation Controls](../soc2/templates/comp-soc-013-data-validation-controls.md) - Validate fairness in production

### Cross-Framework Mappings
- **GDPR**: Article 22 (Automated Decision-Making), Recital 71 (Profiling)
- **SOC 2**: CC6.1 (Logical Access - Non-discrimination)
- **ISO 27001**: A.18.1.4 (Privacy and Protection of PII)

---

## References

### Standards
- EN 18031:2024 Section 7.4: Fairness and Non-Discrimination
- ISO/IEC 23894:2023: AI Risk Management - Bias
- IEEE 7010:2020: Well-being Impact Assessment

### Regulations
- EU AI Act Article 10: Data and Data Governance
- NYC Local Law 144: Automated Employment Decision Tools
- Equal Credit Opportunity Act (ECOA)
- Fair Housing Act

### Research
- Mehrabi et al. (2021): "A Survey on Bias and Fairness in Machine Learning"
- Barocas et al. (2019): "Fairness and Machine Learning" (fairmlbook.org)
- Dwork et al. (2012): "Fairness Through Awareness"
- Hardt et al. (2016): "Equality of Opportunity in Supervised Learning"

### Tools
- **Fairlearn**: https://fairlearn.org/
- **AIF360**: https://aif360.mybluemix.net/
- **What-If Tool**: https://pair-code.github.io/what-if-tool/
- **Aequitas**: http://aequitas.dssg.io/

---

**Document Control**
- **Version**: 1.0
- **Last Updated**: 2025-12-13
- **Next Review**: 2026-06-13
- **Owner**: AI Safety Team
- **Approved By**: Ethics Board, Legal, Product Management
