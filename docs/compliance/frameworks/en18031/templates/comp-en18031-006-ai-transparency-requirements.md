---
id: comp-en18031-006-ai-transparency-requirements
title: COMP-EN18031-006 - AI Transparency Requirements
purpose: Ensure AI systems are transparent and explainable to stakeholders
en18031Control: 5.2.2
category: ai-governance
priority: high
framework: EN 18031
sidebar_label: COMP-EN18031-006
sidebar_position: 6
crossFramework:
  iso42001: 6.2.6 (Transparency)
  euAiAct: Article 13 (Transparency and Provision of Information)
  iso24028: 5.3 (Transparency)
  gdpr: Article 13-14 (Information to Data Subjects)
  nistAiRmf: Govern 5.1, Measure 2.8
status: pending-verification
references: []
---

# COMP-EN18031-006: AI Transparency Requirements

## Overview

**Purpose**: Ensure AI systems are transparent and explainable to stakeholders, enabling understanding of AI behavior, decisions, and limitations  
**EN 18031 Control**: 5.2.2 - AI Transparency Requirements  
**Category**: ai-governance  
**Priority**: high  
**Framework**: EN 18031

## Regulatory Context

### EN 18031 Alignment

- **5.2.2**: AI Transparency Requirements - Ensuring understandability of AI systems
- **Related Controls**:
  - 5.2.1: AI Documentation Standards (documentation enables transparency)
  - 5.2.3: AI Audit Trail (transparency of decisions and actions)
  - 5.4.5: Model Explainability (technical transparency of models)

### Cross-Framework Mapping

- **ISO/IEC 42001**: 
  - 6.2.6: Transparency of AI Systems - Specific transparency requirements
  - 8.8: Human-AI Interaction - Transparent interaction design
  - 8.32: Communication - Transparency in communication

- **EU AI Act**: 
  - Article 13: Transparency and Provision of Information to Users - Mandatory transparency for high-risk AI
  - Article 52: Transparency Obligations for Certain AI Systems - Disclosure of AI use
  - Recital 47: Transparency to enable informed decisions

- **ISO 24028**: 
  - Section 5.3: Transparency - AI trustworthiness characteristic
  - Transparency dimensions: Interpretability, explainability, communication

- **GDPR**: 
  - Article 13-14: Information Provided to Data Subjects - Transparency of processing
  - Article 15: Right of Access - Transparency about personal data processing
  - Article 22: Automated Decision-Making - Right to explanation

- **NIST AI RMF**: 
  - GOVERN-5.1: Organizational policies and practices are in place to foster a culture of transparency
  - MEASURE-2.8: Risks associated with transparency and explainability are assessed and documented
  - MANAGE-3.2: Explanations are provided to affected individuals

## Description

Implements EN 18031 Section 5.2.2 to establish transparency requirements ensuring stakeholders can understand AI systems. Transparency encompasses:

1. **System-Level Transparency**: Understanding what the AI system does and how it operates
2. **Decision-Level Transparency**: Understanding why specific decisions were made
3. **Data Transparency**: Understanding what data is used and how
4. **Model Transparency**: Understanding model architecture, training, and limitations
5. **Operational Transparency**: Understanding how AI is deployed and monitored
6. **Organizational Transparency**: Understanding governance, accountability, and recourse

The transparency framework must address different stakeholder needs:

1. **End Users**: Need to understand AI outputs and know when interacting with AI
2. **Affected Individuals**: Need to understand decisions impacting them
3. **Operators**: Need to understand system behavior for effective oversight
4. **Regulators**: Need to assess compliance and risk management
5. **Technical Reviewers**: Need deep technical understanding
6. **Business Stakeholders**: Need to understand capabilities and limitations

### Why This Matters

Without adequate transparency:
- Users cannot make informed decisions about AI outputs
- Affected individuals cannot contest unfair AI decisions
- Operators cannot effectively oversee AI systems
- Regulatory non-compliance (EU AI Act Article 13, GDPR Article 22)
- Loss of trust in AI systems
- Inability to identify and correct AI errors or biases

## Acceptance Criteria

```gherkin
Feature: AI Transparency Implementation
  As an AI Governance Officer
  I want to ensure AI systems meet transparency requirements
  So that stakeholders can understand AI behavior and decisions

  Background:
    Given the organization deploys AI systems
    And stakeholders require transparency about AI
    And EN 18031 and EU AI Act compliance is required

  Scenario: AI System Disclosure to Users
    Given an AI system is deployed
    When users interact with the system
    Then users shall be informed they are interacting with AI
    And the AI system's purpose shall be clearly communicated
    And AI capabilities and limitations shall be disclosed
    And contact information for human support shall be provided
    And disclosure shall be clear, timely, and accessible
    And compliance with EU AI Act Article 52 shall be verified

  Scenario: Explainable AI Outputs
    Given an AI system provides outputs or recommendations
    When users receive AI outputs
    Then explanations of outputs shall be provided
    And key factors influencing outputs shall be identified
    And confidence levels or uncertainty shall be communicated
    And explanations shall be understandable to target audience
    And users shall be able to request additional explanation details
    And explanation quality shall meet established standards

  Scenario: Transparency for Affected Individuals
    Given an AI system makes decisions affecting individuals
    When individuals are subject to AI decisions
    Then individuals shall be informed of AI involvement
    And the logic of AI decision-making shall be explained
    And consequences and implications shall be communicated
    And individuals shall have recourse to human review
    And information shall comply with GDPR Article 22 requirements
    And transparency shall enable meaningful human oversight

  Scenario: Model Card Publication
    Given an AI model is deployed
    When model information is published
    Then a model card shall be created and published
    And model card shall include intended use, performance, limitations
    And training data characteristics shall be disclosed
    And fairness and bias analysis shall be included
    And model card shall follow standard format
    And model card shall be accessible to relevant stakeholders

  Scenario: Data Transparency
    Given an AI system uses data
    When data transparency is assessed
    Then data sources and provenance shall be documented
    And data characteristics (size, distribution) shall be disclosed
    And data quality metrics shall be available
    And sensitive data handling shall be explained
    And data transparency shall meet privacy requirements
    And data lineage shall be traceable

  Scenario: Operational Transparency
    Given an AI system is operational
    When operational transparency is evaluated
    Then monitoring and performance metrics shall be accessible
    And incident history shall be available
    And system updates and changes shall be communicated
    And operational constraints and failure modes shall be documented
    And transparency shall support effective oversight

  Scenario: Transparency Documentation
    Given AI transparency requirements are established
    When transparency documentation is created
    Then transparency policies shall be documented
    And stakeholder communication plans shall be specified
    And explanation mechanisms shall be described
    And transparency testing procedures shall be defined
    And documentation shall be maintained and updated
    And compliance with EN 18031 5.2.2 shall be verified

  Scenario: Transparency Audit and Validation
    Given AI transparency mechanisms are implemented
    When transparency audit is performed
    Then all required transparency elements shall be present
    And explanations shall be understandable and accurate
    And disclosures shall be clear and timely
    And stakeholder feedback on transparency shall be collected
    And gaps in transparency shall be identified and addressed
    And transparency effectiveness shall be measured
```

## Technical Context

### Transparency Layers

```
┌─────────────────────────────────────────────┐
│         Transparency Stack                  │
├─────────────────────────────────────────────┤
│ 1. System-Level Transparency                │
│    - What does the AI do?                   │
│    - What are its capabilities/limitations? │
├─────────────────────────────────────────────┤
│ 2. Decision-Level Transparency              │
│    - Why this output?                       │
│    - What factors were important?           │
├─────────────────────────────────────────────┤
│ 3. Model-Level Transparency                 │
│    - How does the model work?               │
│    - Training data, architecture, metrics   │
├─────────────────────────────────────────────┤
│ 4. Data-Level Transparency                  │
│    - What data is used?                     │
│    - Data quality, biases, provenance       │
├─────────────────────────────────────────────┤
│ 5. Operational Transparency                 │
│    - How is AI deployed and monitored?      │
│    - Performance, incidents, updates        │
└─────────────────────────────────────────────┘
```

### Explainability Techniques

#### 1. Local Explanations (Individual Predictions)

**SHAP (SHapley Additive exPlanations)**:
```python
import shap

explainer = shap.Explainer(model, background_data)
shap_values = explainer(input_data)

# Visualize feature importance for single prediction
shap.plots.waterfall(shap_values[0])

# Text explanation
explanation_text = generate_explanation_from_shap(shap_values[0])
# "The model predicted 'Approve' primarily because Credit Score (0.42) 
# and Income (0.31) were high, despite Debt-to-Income ratio being moderate (-0.15)"
```

**LIME (Local Interpretable Model-agnostic Explanations)**:
```python
from lime.lime_tabular import LimeTabularExplainer

explainer = LimeTabularExplainer(
    training_data,
    feature_names=feature_names,
    class_names=['Deny', 'Approve']
)

explanation = explainer.explain_instance(
    input_instance,
    model.predict_proba
)

# Show top features
explanation.show_in_notebook()
```

#### 2. Global Explanations (Model Behavior)

**Feature Importance**:
```python
import matplotlib.pyplot as plt

# Global feature importance
feature_importance = model.feature_importances_
features_df = pd.DataFrame({
    'feature': feature_names,
    'importance': feature_importance
}).sort_values('importance', ascending=False)

# Visualize
plt.barh(features_df['feature'][:10], features_df['importance'][:10])
plt.xlabel('Importance')
plt.title('Top 10 Most Important Features')
```

**Partial Dependence Plots**:
```python
from sklearn.inspection import PartialDependenceDisplay

features_to_plot = [0, 1, 2]  # Feature indices
PartialDependenceDisplay.from_estimator(
    model,
    X_train,
    features_to_plot,
    feature_names=feature_names
)
```

#### 3. Example-Based Explanations

**Similar Cases**:
```python
from sklearn.neighbors import NearestNeighbors

def find_similar_cases(input_instance, training_data, k=3):
    """Find similar past cases to explain current prediction"""
    nn = NearestNeighbors(n_neighbors=k)
    nn.fit(training_data)
    
    distances, indices = nn.kneighbors([input_instance])
    
    similar_cases = [
        {
            'case': training_data[idx],
            'outcome': training_labels[idx],
            'similarity': 1 - distances[0][i]
        }
        for i, idx in enumerate(indices[0])
    ]
    
    return similar_cases
```

**Counterfactual Explanations**:
```python
def generate_counterfactual(input_instance, model, desired_outcome):
    """Generate counterfactual: what needs to change for different outcome"""
    # Use optimization to find minimal changes
    counterfactual = optimize_counterfactual(
        input_instance,
        model,
        desired_outcome,
        constraints={'max_changes': 3, 'realistic': True}
    )
    
    changes = identify_changes(input_instance, counterfactual)
    
    explanation = f"To get '{desired_outcome}', you would need to: "
    explanation += ", ".join([
        f"increase {feature} from {old_val} to {new_val}"
        for feature, old_val, new_val in changes
    ])
    
    return explanation
```

### Transparency Implementation Patterns

#### Pattern 1: Explanation Interface

```python
class ExplanationService:
    def __init__(self, model, explainer_type='shap'):
        self.model = model
        self.explainer = self.initialize_explainer(explainer_type)
    
    def explain_prediction(self, input_data, detail_level='summary'):
        """Generate explanation for prediction"""
        # Get prediction
        prediction = self.model.predict(input_data)
        confidence = self.model.predict_proba(input_data).max()
        
        # Generate explanation
        if detail_level == 'summary':
            explanation = self.generate_summary_explanation(input_data)
        elif detail_level == 'detailed':
            explanation = self.generate_detailed_explanation(input_data)
        elif detail_level == 'technical':
            explanation = self.generate_technical_explanation(input_data)
        
        return {
            'prediction': prediction,
            'confidence': confidence,
            'explanation': explanation,
            'similar_cases': self.find_similar_cases(input_data),
            'counterfactual': self.generate_counterfactual(input_data)
        }
    
    def generate_summary_explanation(self, input_data):
        """Simple, human-readable explanation"""
        feature_contributions = self.explainer.explain(input_data)
        
        top_factors = feature_contributions.top_k(3)
        
        explanation = f"The model predicted {self.prediction_label} because:\n"
        for i, (feature, contribution) in enumerate(top_factors, 1):
            direction = "increased" if contribution > 0 else "decreased"
            explanation += f"{i}. {feature} {direction} the likelihood\n"
        
        return explanation
```

#### Pattern 2: Transparent User Interface

```python
class TransparentAIInterface:
    def display_ai_decision(self, decision_result):
        """Display AI decision with transparency elements"""
        ui_components = {
            'ai_disclosure': self.create_ai_disclosure(),
            'decision': self.format_decision(decision_result['prediction']),
            'confidence': self.format_confidence(decision_result['confidence']),
            'explanation': self.format_explanation(decision_result['explanation']),
            'factors': self.format_key_factors(decision_result['factors']),
            'uncertainty': self.format_uncertainty(decision_result['uncertainty']),
            'similar_cases': self.format_similar_cases(decision_result['similar_cases']),
            'human_contact': self.create_human_contact_info(),
            'feedback': self.create_feedback_mechanism()
        }
        
        return self.render_ui(ui_components)
    
    def create_ai_disclosure(self):
        """Clear disclosure of AI involvement"""
        return """
        <div class="ai-disclosure">
            <icon>🤖</icon>
            <text>This decision was made by an AI system.</text>
            <link>Learn more about how this AI works</link>
        </div>
        """
```

#### Pattern 3: Model Card Generation

```python
class ModelCardGenerator:
    def generate_model_card(self, model_metadata):
        """Generate comprehensive model card"""
        model_card = {
            'model_details': {
                'name': model_metadata['name'],
                'version': model_metadata['version'],
                'type': model_metadata['type'],
                'developed_by': model_metadata['team'],
                'date': model_metadata['date']
            },
            'intended_use': {
                'primary_uses': model_metadata['primary_uses'],
                'out_of_scope': model_metadata['out_of_scope'],
                'target_users': model_metadata['target_users']
            },
            'factors': {
                'relevant_factors': model_metadata['factors'],
                'evaluation_factors': model_metadata['eval_factors']
            },
            'metrics': self.generate_metrics_section(model_metadata),
            'training_data': self.generate_data_section(model_metadata),
            'evaluation_data': self.generate_eval_data_section(model_metadata),
            'ethical_considerations': self.generate_ethics_section(model_metadata),
            'caveats_and_recommendations': self.generate_caveats_section(model_metadata)
        }
        
        return self.render_model_card(model_card)
```

### Implementation Requirements

#### User-Facing Transparency

- **AI Disclosure**: Clear notification when users interact with AI
- **Purpose Statement**: Explain what AI system does
- **Capability Disclosure**: What AI can and cannot do
- **Limitations**: Known limitations and failure modes
- **Human Contact**: How to reach human support
- **Feedback Mechanism**: Allow users to provide feedback

#### Decision-Level Transparency

- **Explanation Generation**: Automatic explanations for AI outputs
- **Key Factors**: Identify most important factors in decision
- **Confidence/Uncertainty**: Communicate model confidence
- **Similar Cases**: Show similar past cases
- **Counterfactuals**: What would need to change for different outcome

#### Documentation Transparency

- **Model Cards**: Comprehensive model documentation
- **Datasheets**: Training data documentation
- **Technical Documentation**: Architecture, training, validation
- **Performance Reports**: Ongoing performance metrics
- **Incident Reports**: Transparency about failures and fixes

## Validation Strategy

### Transparency Testing

1. **Explanation Quality Testing**: Evaluate accuracy and understandability of explanations
2. **Disclosure Testing**: Verify AI disclosures are clear and timely
3. **Usability Testing**: Test transparency mechanisms with actual users
4. **Comprehension Testing**: Measure stakeholder understanding
5. **Compliance Testing**: Verify regulatory compliance

### Metrics

- **Explanation Fidelity**: How accurately explanations reflect model behavior
- **User Comprehension**: % of users who understand explanations
- **Disclosure Completeness**: % of required disclosures present
- **Response Time**: Time to generate explanations
- **Stakeholder Satisfaction**: Satisfaction with transparency

## Evidence Requirements

### Required Documentation

1. **Transparency Policy**: Organization-wide transparency standards
2. **Model Cards**: For all deployed models
3. **User Disclosures**: AI disclosure statements
4. **Explanation Procedures**: How explanations are generated
5. **Transparency Testing Reports**: Testing results and validation
6. **Stakeholder Communications**: Transparency communications sent

### Evidence Collection

**Metrics**:
- Explanation request rate
- Explanation satisfaction scores
- Disclosure view rates
- Transparency-related complaints

**Audit Trail**:
- All explanations generated (logged)
- User interactions with transparency features
- Updates to transparency documentation

## Related Controls

### Within EN 18031

- **comp-en18031-005-ai-documentation-standards**: Documentation enables transparency
- **comp-en18031-020-model-explainability**: Technical explainability methods
- **comp-en18031-036-human-oversight**: Transparency enables oversight

### Cross-Framework

- **comp-gdpr-006-right-of-access**: GDPR transparency requirements
- **comp-iso27001-042-transparency-of-processing**: ISO 27701 transparency

### AI-Specific Standards

- ISO/IEC 24028: AI Trustworthiness - Transparency
- ISO/IEC 23894: AI Risk Management - Transparency for risk management

## Implementation Notes

### Best Practices

1. **Audience-Appropriate**: Tailor explanations to audience (technical vs non-technical)
2. **Multi-Level Transparency**: Offer summary, detailed, and technical explanations
3. **Proactive Disclosure**: Disclose AI use upfront, not upon request
4. **Continuous Communication**: Update transparency as system evolves
5. **Feedback Loop**: Allow stakeholders to request more information

### Common Pitfalls

- **Pitfall**: Explanations too technical for general users
  - **Solution**: Multiple explanation levels; user testing

- **Pitfall**: AI disclosure buried in terms of service
  - **Solution**: Clear, prominent, just-in-time disclosure

- **Pitfall**: Explanations don't match actual model behavior
  - **Solution**: Validate explanation fidelity; use faithful explainability methods

- **Pitfall**: No mechanism for users to get more information
  - **Solution**: Contact info, FAQ, detailed documentation available

### ML/AI Tooling

**Explainability**:
- SHAP (feature importance)
- LIME (local explanations)
- InterpretML (glass-box models, explanations)
- Captum (PyTorch explainability)
- Alibi (black-box explanations)

**Model Cards**:
- Model Card Toolkit (Google)
- Hugging Face Model Cards (built-in)

**Transparency Platforms**:
- Fiddler AI (ML monitoring + explainability)
- Arize AI (observability + transparency)

## Status

- [ ] Transparency policy established
- [ ] AI disclosure statements created
- [ ] Explanation mechanisms implemented
- [ ] Model cards published
- [ ] User interfaces updated with transparency features
- [ ] Transparency testing conducted
- [ ] Stakeholder training completed
- [ ] Feedback mechanisms established
- [ ] Transparency effectiveness measured
- [ ] Compliance with EN 18031 5.2.2 and EU AI Act Article 13 verified
