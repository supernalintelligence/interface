---
title: COMP-EN18031-020: Model Explainability
type: documentation
created: 2025-12-17
updated: 2025-12-17
---

# COMP-EN18031-020: Model Explainability

---
id: comp-en18031-020-model-explainability
title: COMP-EN18031-020 - Model Explainability
framework: en18031
category: Model Interpretability
priority: high
status: pending-verification
references: []
relatedControls:
  - comp-en18031-006-ai-transparency-requirements
  - comp-gdpr-013-right-to-explanation
  - comp-iso27001-040-information-security-awareness-education-and-training
linkedRequirements: []
---

## Overview

**Purpose**: Ensure AI models provide interpretable explanations for predictions to enable trust, debugging, regulatory compliance, and accountability.

**Scope**: Covers explainability techniques (SHAP, LIME, attention), model-agnostic methods, faithfulness validation, and user-facing explanations.

**Regulatory Context**:
- EN 18031 §5.6: Explainability Requirements
- GDPR Article 22: Right to explanation for automated decisions
- FDA AI/ML Guidance: Transparency and explainability
- EU AI Act: Transparency obligations

## Acceptance Criteria

```gherkin
Feature: Model Explainability
  As a Clinical User
  I need understandable explanations for AI predictions
  So that I can trust and validate model decisions

  Scenario: Feature Importance Explanation (Global)
    Given a trained model
    When generating global explanations
    Then SHAP global importance SHALL be computed
    And top 20 features SHALL be ranked
    And feature contribution direction SHALL be indicated (+/-)
    And explanation SHALL be visualized
    And explanation SHALL be versioned with model
    
    Global Explanation Metrics:
      | Feature | SHAP Value | Direction | Interpretation |
      | Age | 0.42 | Positive | Older → higher risk |
      | HbA1c | 0.38 | Positive | Higher glucose → higher risk |
      | BMI | 0.28 | Positive | Higher BMI → higher risk |

  Scenario: Instance-Level Explanation (Local)
    Given a specific prediction
    When explaining the prediction
    Then SHAP local explanation SHALL be generated
    And top contributing features SHALL be identified (top 5)
    And baseline prediction SHALL be shown
    And feature contribution SHALL be quantified
    And explanation SHALL be human-readable
    
    Example: Diabetes Risk Prediction
      | Feature | Value | Contribution | Explanation |
      | Age | 65 | +0.15 | Age increases risk |
      | HbA1c | 7.2% | +0.22 | Elevated glucose |
      | BMI | 32 | +0.08 | Overweight |
      | Exercise | 0 hrs/week | +0.05 | No exercise |
      | **Prediction** | **0.82** | **High Risk** | **82% probability** |

  Scenario: Counterfactual Explanations
    Given a negative prediction
    When user requests "what would change the outcome"
    Then counterfactual examples SHALL be generated
    And minimal changes SHALL be identified
    And actionable recommendations SHALL be provided
    And feasibility SHALL be assessed
    
    Counterfactual Example:
      Current: Age=65, HbA1c=7.2%, Exercise=0 → Risk=82%
      Counterfactual: Age=65, HbA1c=6.5%, Exercise=3hrs/week → Risk=48%
      Recommendation: "Reduce HbA1c by 0.7% AND exercise 3hrs/week to reduce risk to 48%"

  Scenario: Attention Visualization (Deep Learning)
    Given a vision or NLP model
    When explaining predictions
    Then attention weights SHALL be visualized
    And input regions SHALL be highlighted
    And Grad-CAM heatmaps SHALL be generated (vision)
    And token importance SHALL be shown (NLP)
    
    Vision Example: Diabetic Retinopathy Detection
      - Heatmap highlights: Microaneurysms, hemorrhages
      - Attention focus: Retinal blood vessels
      - Confidence: 95%

  Scenario: Explanation Faithfulness Validation
    Given generated explanations
    When validating faithfulness
    Then perturbation tests SHALL be performed
    And explanation stability SHALL be measured
    And correlation with model SHALL be verified
    And faithfulness score SHALL exceed 0.80
    
    Faithfulness Tests:
      | Test | Method | Pass Threshold |
      | Perturbation fidelity | Mask top features, measure Δ prediction | Δ > 20% |
      | Explanation stability | Add noise, measure Δ explanation | Δ < 10% |
      | Model correlation | Compare explanation rank vs gradient rank | Correlation > 0.80 |

  Scenario: User-Facing Explanation Interface
    Given a deployed model with explanations
    When user views prediction
    Then plain-language explanation SHALL be shown
    And visual explanations SHALL be provided
    And confidence level SHALL be displayed
    And data sources SHALL be cited
    And limitations SHALL be disclosed
    
    Explanation UI Components:
      - **Prediction**: "High risk of diabetic retinopathy (82% confidence)"
      - **Key Factors**: Visual importance chart (top 5 features)
      - **Plain Language**: "Your HbA1c is elevated, which increases risk"
      - **Counterfactual**: "Lowering HbA1c to 6.5% could reduce risk"
      - **Confidence**: Progress bar + uncertainty bounds
      - **Limitations**: "Model trained on adults 18-80; consult physician"

  Scenario: Explanation Audit Trail
    Given explanations provided to users
    When logging explanations
    Then explanation SHALL be stored with prediction
    And user SHALL be identified
    And timestamp SHALL be recorded
    And explanation version SHALL be tracked
    And audit log SHALL be searchable
    
    Audit Log Entry:
      - User ID: user@example.com
      - Timestamp: 2025-12-13T10:30:00Z
      - Model Version: v2.1.0
      - Prediction ID: pred-abc123
      - Explanation Method: SHAP
      - Top Features: [Age, HbA1c, BMI]
      - User Action: Viewed explanation, requested counterfactual

  Scenario: Explanation for High-Stakes Decisions
    Given a high-risk prediction (e.g., deny loan, medical diagnosis)
    When generating explanation
    Then human review SHALL be required
    And multiple explanation methods SHALL be used (SHAP + LIME)
    And subgroup fairness SHALL be checked
    And right to human review SHALL be offered
    And explanation SHALL be auditable
    
    High-Stakes Requirements:
      - Primary: SHAP local explanation
      - Secondary: LIME for validation
      - Tertiary: Counterfactual for actionability
      - Review: Clinical expert validation
      - Appeal: Human override mechanism
```

## Technical Context

### Explainability Methods

**1. SHAP (SHapley Additive exPlanations)**

```python
# SHAP Implementation for Model Explainability
import shap
import numpy as np
import matplotlib.pyplot as plt

class ModelExplainer:
    def __init__(self, model, data, feature_names):
        self.model = model
        self.data = data
        self.feature_names = feature_names
        self.explainer = None
    
    def initialize_explainer(self, method='tree'):
        """Initialize SHAP explainer"""
        if method == 'tree':
            # For tree models (XGBoost, Random Forest)
            self.explainer = shap.TreeExplainer(self.model)
        elif method == 'deep':
            # For deep learning models
            self.explainer = shap.DeepExplainer(self.model, self.data)
        elif method == 'kernel':
            # Model-agnostic (slower)
            self.explainer = shap.KernelExplainer(self.model.predict, self.data)
        else:
            raise ValueError(f"Unknown method: {method}")
    
    def explain_instance(self, instance):
        """Generate local explanation for single instance"""
        shap_values = self.explainer.shap_values(instance)
        
        # Extract top contributing features
        feature_contributions = list(zip(
            self.feature_names,
            shap_values[0] if isinstance(shap_values, list) else shap_values
        ))
        feature_contributions.sort(key=lambda x: abs(x[1]), reverse=True)
        
        return {
            'shap_values': shap_values,
            'top_features': feature_contributions[:5],
            'base_value': self.explainer.expected_value,
            'prediction': self.model.predict(instance)[0]
        }
    
    def explain_global(self):
        """Generate global feature importance"""
        shap_values = self.explainer.shap_values(self.data)
        
        # Compute mean absolute SHAP values
        if isinstance(shap_values, list):
            # Multi-class: use class 1 (positive class)
            shap_values = shap_values[1]
        
        feature_importance = np.abs(shap_values).mean(axis=0)
        
        importance_dict = dict(zip(self.feature_names, feature_importance))
        sorted_importance = sorted(
            importance_dict.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return sorted_importance
    
    def visualize_instance(self, instance, save_path=None):
        """Visualize local explanation"""
        shap_values = self.explainer.shap_values(instance)
        
        shap.force_plot(
            self.explainer.expected_value[1],
            shap_values[1][0],
            instance[0],
            feature_names=self.feature_names,
            matplotlib=True,
            show=False
        )
        
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=150)
        plt.close()
    
    def visualize_global(self, save_path=None):
        """Visualize global importance"""
        shap_values = self.explainer.shap_values(self.data)
        
        shap.summary_plot(
            shap_values[1] if isinstance(shap_values, list) else shap_values,
            self.data,
            feature_names=self.feature_names,
            show=False
        )
        
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=150)
        plt.close()
    
    def generate_plain_language_explanation(self, instance):
        """Convert SHAP to plain language"""
        explanation = self.explain_instance(instance)
        
        top_features = explanation['top_features']
        prediction = explanation['prediction']
        
        # Generate natural language
        text = f"Prediction: {prediction:.2%} risk\n\n"
        text += "Key factors:\n"
        
        for feature, contribution in top_features:
            direction = "increases" if contribution > 0 else "decreases"
            text += f"- {feature}: {direction} risk by {abs(contribution):.3f}\n"
        
        return text

# Usage
import xgboost as xgb

# Train model
model = xgb.XGBClassifier()
model.fit(X_train, y_train)

# Initialize explainer
explainer = ModelExplainer(
    model=model,
    data=X_train[:100],  # Background data
    feature_names=['Age', 'HbA1c', 'BMI', 'BP', 'Cholesterol']
)
explainer.initialize_explainer(method='tree')

# Explain single prediction
instance = X_test[0:1]
local_explanation = explainer.explain_instance(instance)
print("Top contributing features:")
for feature, value in local_explanation['top_features']:
    print(f"  {feature}: {value:.4f}")

# Plain language
plain_text = explainer.generate_plain_language_explanation(instance)
print(plain_text)

# Global importance
global_importance = explainer.explain_global()
print("\nGlobal feature importance:")
for feature, importance in global_importance[:10]:
    print(f"  {feature}: {importance:.4f}")

# Visualizations
explainer.visualize_instance(instance, 'local_explanation.png')
explainer.visualize_global('global_importance.png')
```

**2. LIME (Local Interpretable Model-agnostic Explanations)**

```python
# LIME for Model-Agnostic Explanations
from lime import lime_tabular
from lime.lime_text import LimeTextExplainer
from lime.lime_image import LimeImageExplainer

class LIMEExplainer:
    def __init__(self, model, training_data, feature_names, class_names):
        self.model = model
        self.feature_names = feature_names
        self.class_names = class_names
        
        # Initialize LIME explainer
        self.explainer = lime_tabular.LimeTabularExplainer(
            training_data=training_data,
            feature_names=feature_names,
            class_names=class_names,
            mode='classification'
        )
    
    def explain_instance(self, instance, num_features=5):
        """Generate LIME explanation"""
        explanation = self.explainer.explain_instance(
            data_row=instance,
            predict_fn=self.model.predict_proba,
            num_features=num_features
        )
        
        # Extract feature contributions
        feature_weights = explanation.as_list()
        
        return {
            'explanation': explanation,
            'feature_weights': feature_weights,
            'prediction': self.model.predict_proba([instance])[0]
        }
    
    def visualize(self, explanation, save_path=None):
        """Visualize LIME explanation"""
        fig = explanation.as_pyplot_figure()
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=150)
        plt.close()
    
    def validate_faithfulness(self, instance, explanation):
        """Validate explanation faithfulness"""
        # Perturb top features and measure prediction change
        top_features = [f[0] for f in explanation['feature_weights'][:3]]
        
        original_pred = self.model.predict_proba([instance])[0][1]
        
        # Mask top features
        perturbed = instance.copy()
        for feature_name in top_features:
            feature_idx = self.feature_names.index(feature_name)
            perturbed[feature_idx] = 0  # Zero out
        
        perturbed_pred = self.model.predict_proba([perturbed])[0][1]
        
        # Compute faithfulness score
        prediction_change = abs(original_pred - perturbed_pred)
        
        return {
            'original_prediction': original_pred,
            'perturbed_prediction': perturbed_pred,
            'prediction_change': prediction_change,
            'faithful': prediction_change > 0.10  # >10% change expected
        }

# Usage
lime_explainer = LIMEExplainer(
    model=model,
    training_data=X_train.values,
    feature_names=['Age', 'HbA1c', 'BMI'],
    class_names=['Low Risk', 'High Risk']
)

# Explain instance
instance = X_test.iloc[0].values
lime_result = lime_explainer.explain_instance(instance, num_features=5)

print("LIME Feature Weights:")
for feature, weight in lime_result['feature_weights']:
    print(f"  {feature}: {weight:.4f}")

# Validate faithfulness
faithfulness = lime_explainer.validate_faithfulness(instance, lime_result)
print(f"\nFaithfulness: {faithfulness['faithful']}")
print(f"Prediction change: {faithfulness['prediction_change']:.2%}")
```

**3. Counterfactual Explanations**

```python
# Counterfactual Explanation Generation
from sklearn.neighbors import NearestNeighbors
import numpy as np

class CounterfactualExplainer:
    def __init__(self, model, data, target_class=1):
        self.model = model
        self.data = data
        self.target_class = target_class
    
    def generate_counterfactual(self, instance, max_changes=3, max_iterations=100):
        """Generate counterfactual by minimal changes"""
        instance = instance.copy()
        original_pred = self.model.predict([instance])[0]
        
        # If already target class, no counterfactual needed
        if original_pred == self.target_class:
            return None
        
        # Find nearest neighbor from target class
        target_data = self.data[self.model.predict(self.data) == self.target_class]
        
        nn = NearestNeighbors(n_neighbors=1)
        nn.fit(target_data)
        _, indices = nn.kneighbors([instance])
        
        nearest_target = target_data[indices[0][0]]
        
        # Compute feature differences
        differences = np.abs(nearest_target - instance)
        top_features = np.argsort(differences)[:max_changes]
        
        # Generate counterfactual
        counterfactual = instance.copy()
        for feature_idx in top_features:
            counterfactual[feature_idx] = nearest_target[feature_idx]
        
        # Verify counterfactual works
        cf_pred = self.model.predict([counterfactual])[0]
        
        if cf_pred == self.target_class:
            return {
                'counterfactual': counterfactual,
                'changed_features': top_features,
                'original_prediction': original_pred,
                'counterfactual_prediction': cf_pred,
                'num_changes': len(top_features)
            }
        else:
            return None  # Failed to generate valid counterfactual
    
    def explain_counterfactual(self, instance, cf_result, feature_names):
        """Generate plain-language counterfactual explanation"""
        if cf_result is None:
            return "No actionable changes identified."
        
        text = "To change the prediction:\n"
        
        for feature_idx in cf_result['changed_features']:
            feature_name = feature_names[feature_idx]
            original_value = instance[feature_idx]
            cf_value = cf_result['counterfactual'][feature_idx]
            
            change = cf_value - original_value
            direction = "increase" if change > 0 else "decrease"
            
            text += f"- {direction.capitalize()} {feature_name} from {original_value:.2f} to {cf_value:.2f}\n"
        
        return text

# Usage
cf_explainer = CounterfactualExplainer(model, X_train.values, target_class=0)

instance = X_test.iloc[0].values
cf_result = cf_explainer.generate_counterfactual(instance, max_changes=3)

if cf_result:
    explanation = cf_explainer.explain_counterfactual(
        instance, cf_result, X_train.columns
    )
    print(explanation)
else:
    print("No valid counterfactual found")
```

**4. Attention Visualization (Vision Models)**

```python
# Grad-CAM for Vision Model Explainability
import torch
import torch.nn.functional as F
import cv2
import numpy as np

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        
        # Register hooks
        self.target_layer.register_forward_hook(self.save_activation)
        self.target_layer.register_backward_hook(self.save_gradient)
    
    def save_activation(self, module, input, output):
        self.activations = output.detach()
    
    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()
    
    def generate_heatmap(self, input_image, class_idx=None):
        """Generate Grad-CAM heatmap"""
        self.model.eval()
        
        # Forward pass
        output = self.model(input_image)
        
        if class_idx is None:
            class_idx = output.argmax(dim=1).item()
        
        # Backward pass
        self.model.zero_grad()
        one_hot = torch.zeros_like(output)
        one_hot[0][class_idx] = 1
        output.backward(gradient=one_hot, retain_graph=True)
        
        # Compute weights
        weights = self.gradients.mean(dim=(2, 3), keepdim=True)
        
        # Compute weighted combination
        cam = (weights * self.activations).sum(dim=1, keepdim=True)
        cam = F.relu(cam)  # ReLU to keep positive contributions
        
        # Normalize
        cam = cam.squeeze().cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min())
        
        return cam, class_idx
    
    def overlay_heatmap(self, image, heatmap, alpha=0.4):
        """Overlay heatmap on original image"""
        # Resize heatmap to image size
        heatmap_resized = cv2.resize(heatmap, (image.shape[1], image.shape[0]))
        
        # Apply colormap
        heatmap_colored = cv2.applyColorMap(
            np.uint8(255 * heatmap_resized),
            cv2.COLORMAP_JET
        )
        
        # Overlay
        overlayed = cv2.addWeighted(image, 1 - alpha, heatmap_colored, alpha, 0)
        
        return overlayed

# Usage
import torchvision.models as models

model = models.resnet50(pretrained=True)
target_layer = model.layer4[-1]

gradcam = GradCAM(model, target_layer)

# Load image
image = load_image('fundus_image.jpg')  # Your image loading function
input_tensor = preprocess(image).unsqueeze(0)

# Generate heatmap
heatmap, predicted_class = gradcam.generate_heatmap(input_tensor)

# Overlay
overlayed_image = gradcam.overlay_heatmap(image, heatmap)

# Save
cv2.imwrite('gradcam_explanation.jpg', overlayed_image)
```

## Implementation Guidance

### Explainability Requirements by Risk Level

| Risk Level | Explanation Requirement | Methods | Validation |
|------------|-------------------------|---------|------------|
| **Critical** (Medical, Legal) | Detailed + Multi-method + Human review | SHAP + LIME + Counterfactual | Faithfulness >0.85, Expert review |
| **High** (Financial) | Detailed | SHAP + Counterfactual | Faithfulness >0.80 |
| **Medium** (Recommendations) | Basic | SHAP or LIME | Faithfulness >0.75 |
| **Low** (Content filtering) | Optional | Feature importance | N/A |

### Tools and Frameworks

| Tool | Purpose | Model Support |
|------|---------|---------------|
| **SHAP** | Unified framework | Tree, deep learning, any |
| **LIME** | Model-agnostic | Any black-box model |
| **InterpretML** | Glass-box models | EBM, linear, trees |
| **Captum** | PyTorch models | Deep learning |
| **Grad-CAM** | Vision models | CNNs |

## Evidence Requirements

1. **Explainability Report**
   - Methods used (SHAP, LIME, etc.)
   - Faithfulness validation results
   - Example explanations

2. **User Interface**
   - Screenshots of explanation UI
   - User testing results
   - Accessibility compliance

3. **Audit Logs**
   - Explanation generation logs
   - User interactions with explanations
   - Explanation versioning

## Related Controls

- **COMP-EN18031-006**: AI Transparency Requirements
- **COMP-GDPR-013**: Right to Explanation

## Status Checklist

- [ ] Explainability methods implemented (SHAP/LIME)
- [ ] Global feature importance computed
- [ ] Local explanations generated
- [ ] Counterfactual explanations available
- [ ] Attention visualizations (if applicable)
- [ ] Faithfulness validation performed
- [ ] User-facing explanation UI designed
- [ ] Plain-language explanations generated
- [ ] Explanation audit trail enabled
- [ ] High-stakes review process established

---

**Last Updated**: 2025-12-13  
**Status**: Pending Verification  
**Priority**: High
