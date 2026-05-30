---
title: COMP-EN18031-019: Model Adversarial Testing
type: documentation
created: 2025-12-17
updated: 2025-12-17
---

# COMP-EN18031-019: Model Adversarial Testing

---
id: comp-en18031-019-model-adversarial-testing
title: COMP-EN18031-019 - Model Adversarial Testing
framework: en18031
category: Model Security
priority: high
status: pending-verification
references: []
relatedControls:
  - comp-en18031-017-model-validation
  - comp-en18031-022-model-security-scanning
  - comp-en18031-039-robustness-testing
  - comp-iso27001-067-management-of-technical-vulnerabilities
linkedRequirements: []
---

## Overview

**Purpose**: Systematically test AI models against adversarial attacks to ensure robustness, identify vulnerabilities, and implement defenses before deployment.

**Scope**: Covers adversarial attack types, defense mechanisms, robustness testing, certification, and continuous adversarial monitoring.

**Regulatory Context**:
- EN 18031 §7.4: Model Security Testing
- NIST AI RMF: Trustworthy and Secure characteristics
- ISO/IEC 24029-1: Assessment of robustness of neural networks
- EU AI Act: Robustness requirements

## Acceptance Criteria

```gherkin
Feature: Adversarial Robustness Testing
  As a Security Engineer
  I need to test models against adversarial attacks
  So that vulnerabilities are identified and mitigated before deployment

  Scenario: White-Box Adversarial Attack Testing
    Given a trained model with full access to architecture and weights
    When conducting white-box attacks
    Then FGSM (Fast Gradient Sign Method) attacks SHALL be tested
    And PGD (Projected Gradient Descent) attacks SHALL be tested
    And C&W (Carlini & Wagner) attacks SHALL be tested
    And attack success rate SHALL be measured
    And adversarial examples SHALL be collected for analysis
    And perturbation magnitude SHALL be minimized (L∞ < 0.1)
    
    Examples: Attack Success Rates
      | Attack Type | Epsilon | Original Accuracy | Adversarial Accuracy | Success Rate |
      | FGSM | 0.01 | 95% | 92% | 3% |
      | FGSM | 0.05 | 95% | 78% | 17% |
      | PGD | 0.01 | 95% | 88% | 7% |
      | C&W | 0.01 | 95% | 65% | 30% |

  Scenario: Black-Box Adversarial Testing
    Given a deployed model with API access only
    When conducting black-box attacks
    Then query-based attacks SHALL be tested
    And transfer attacks SHALL be tested
    And decision boundary attacks SHALL be tested
    And query budget SHALL be limited (< 10,000 queries)
    And attack effectiveness SHALL be measured
    
    Black-Box Attack Types:
      | Attack | Method | Query Budget | Success Rate Threshold |
      | ZOO | Zeroth-order optimization | 5,000 | < 10% |
      | HopSkipJump | Decision boundary | 10,000 | < 15% |
      | Transfer | Substitute model | N/A | < 20% |

  Scenario: Adversarial Training for Defense
    Given a model vulnerable to adversarial examples
    When applying adversarial training
    Then adversarial examples SHALL be generated during training
    And model SHALL be trained on clean + adversarial examples
    And robust accuracy SHALL be measured
    And clean accuracy degradation SHALL be minimized (< 2%)
    And adversarial accuracy SHALL improve by ≥ 20%
    
    Training Regimen:
      | Epoch Range | Adversarial Ratio | Attack Type | Epsilon |
      | 1-10 | 0% | None | N/A |
      | 11-30 | 30% | FGSM | 0.01 |
      | 31-50 | 50% | PGD | 0.03 |

  Scenario: Input Validation and Sanitization
    Given input data before model inference
    When validating inputs
    Then input bounds SHALL be checked (valid ranges)
    And suspicious patterns SHALL be detected
    And input transformations SHALL be applied (JPEG compression, quantization)
    And ensemble predictions SHALL be used for high-risk inputs
    And anomaly detection SHALL flag out-of-distribution inputs
    
    Sanitization Techniques:
      | Technique | Purpose | Impact on Clean Accuracy |
      | JPEG compression | Remove high-freq noise | < 1% |
      | Bit depth reduction | Quantize inputs | < 0.5% |
      | Random smoothing | Average over noise | < 2% |

  Scenario: Certified Robustness Testing
    Given a model requiring robustness guarantees
    When certifying robustness
    Then randomized smoothing SHALL be applied
    And certified accuracy SHALL be computed
    And certification radius SHALL be determined
    And confidence bounds SHALL be established
    And certification report SHALL be generated
    
    Certification Levels:
      | Radius (ε) | Certified Accuracy | Confidence | Use Case |
      | 0.01 | 92% | 95% | High-risk medical AI |
      | 0.05 | 85% | 90% | Financial fraud detection |
      | 0.10 | 78% | 90% | Content moderation |

  Scenario: Robustness Across Data Subgroups
    Given a model deployed for diverse populations
    When testing adversarial robustness
    Then robustness SHALL be evaluated per demographic group
    And worst-case subgroup performance SHALL be identified
    And fairness in robustness SHALL be ensured
    And disparate robustness SHALL be mitigated
    
    Subgroup Analysis:
      | Subgroup | Clean Accuracy | Adversarial Accuracy (ε=0.03) | Robustness Gap |
      | Overall | 95% | 85% | 10% |
      | Male | 96% | 86% | 10% |
      | Female | 94% | 82% | 12% |
      | Age 18-40 | 96% | 87% | 9% |
      | Age 60+ | 93% | 80% | 13% |

  Scenario: Physical-World Adversarial Testing
    Given a model processing real-world inputs (images, audio)
    When testing physical adversarial examples
    Then printed adversarial images SHALL be tested
    And 3D adversarial objects SHALL be tested
    And adversarial audio SHALL be tested
    And environmental conditions SHALL be varied (lighting, angles)
    And physical robustness SHALL be quantified
    
    Physical Attack Examples:
      | Domain | Attack Type | Success Rate | Mitigation |
      | Vision | Adversarial patch | 15% | Patch detection |
      | Vision | Adversarial glasses | 8% | Face verification ensemble |
      | Audio | Universal perturbation | 20% | Audio fingerprinting |
```

## Technical Context

### Adversarial Attack Implementation

**1. FGSM and PGD Attacks**

```python
# Adversarial Attack Implementation
import torch
import torch.nn as nn
import numpy as np

class AdversarialAttacker:
    def __init__(self, model, device='cuda'):
        self.model = model
        self.device = device
        self.model.eval()
    
    def fgsm_attack(self, images, labels, epsilon=0.03):
        """Fast Gradient Sign Method"""
        images = images.clone().detach().to(self.device)
        labels = labels.clone().detach().to(self.device)
        images.requires_grad = True
        
        outputs = self.model(images)
        loss = nn.CrossEntropyLoss()(outputs, labels)
        
        self.model.zero_grad()
        loss.backward()
        
        # Craft adversarial examples
        data_grad = images.grad.data
        perturbed_images = images + epsilon * data_grad.sign()
        perturbed_images = torch.clamp(perturbed_images, 0, 1)
        
        return perturbed_images.detach()
    
    def pgd_attack(self, images, labels, epsilon=0.03, alpha=0.01, iterations=10):
        """Projected Gradient Descent Attack"""
        images = images.clone().detach().to(self.device)
        labels = labels.clone().detach().to(self.device)
        
        # Random initialization
        perturbed_images = images + torch.empty_like(images).uniform_(-epsilon, epsilon)
        perturbed_images = torch.clamp(perturbed_images, 0, 1).detach()
        
        for i in range(iterations):
            perturbed_images.requires_grad = True
            outputs = self.model(perturbed_images)
            loss = nn.CrossEntropyLoss()(outputs, labels)
            
            self.model.zero_grad()
            loss.backward()
            
            # Update perturbation
            data_grad = perturbed_images.grad.data
            perturbed_images = perturbed_images.detach() + alpha * data_grad.sign()
            
            # Project back to epsilon ball
            perturbation = torch.clamp(perturbed_images - images, -epsilon, epsilon)
            perturbed_images = torch.clamp(images + perturbation, 0, 1).detach()
        
        return perturbed_images
    
    def cw_attack(self, images, labels, c=1.0, kappa=0, max_iterations=100):
        """Carlini & Wagner L2 Attack"""
        images = images.clone().detach().to(self.device)
        labels = labels.clone().detach().to(self.device)
        
        # Initialize perturbation
        w = torch.zeros_like(images, requires_grad=True)
        optimizer = torch.optim.Adam([w], lr=0.01)
        
        for iteration in range(max_iterations):
            perturbed = torch.tanh(w) / 2 + 0.5  # Map to [0,1]
            
            outputs = self.model(perturbed)
            
            # C&W loss: minimize distance + maximize attack success
            l2_distance = torch.sum((perturbed - images) ** 2)
            
            # f(x') = max(Z(x')_target - max(Z(x')_i for i != target), -kappa)
            target_logits = outputs.gather(1, labels.view(-1, 1))
            max_other_logits = (outputs - 1000 * torch.eye(outputs.shape[1])[labels]).max(1)[0]
            f_loss = torch.clamp(max_other_logits - target_logits.squeeze() + kappa, min=0)
            
            loss = l2_distance + c * f_loss.sum()
            
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
        
        return perturbed.detach()

# Usage
attacker = AdversarialAttacker(model, device='cuda')

# Test FGSM
adv_images_fgsm = attacker.fgsm_attack(clean_images, labels, epsilon=0.03)

# Test PGD
adv_images_pgd = attacker.pgd_attack(clean_images, labels, epsilon=0.03, iterations=20)

# Evaluate robustness
clean_acc = evaluate_accuracy(model, clean_images, labels)
adv_acc_fgsm = evaluate_accuracy(model, adv_images_fgsm, labels)
adv_acc_pgd = evaluate_accuracy(model, adv_images_pgd, labels)

print(f"Clean Accuracy: {clean_acc:.2%}")
print(f"FGSM Accuracy: {adv_acc_fgsm:.2%}")
print(f"PGD Accuracy: {adv_acc_pgd:.2%}")
```

**2. Adversarial Training**

```python
# Adversarial Training for Robustness
class AdversarialTrainer:
    def __init__(self, model, device='cuda'):
        self.model = model
        self.device = device
        self.attacker = AdversarialAttacker(model, device)
    
    def train_adversarial(self, train_loader, epochs=50, epsilon=0.03, 
                          adv_ratio=0.5, attack_type='pgd'):
        """Train with adversarial examples"""
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)
        criterion = nn.CrossEntropyLoss()
        
        for epoch in range(epochs):
            self.model.train()
            total_loss = 0
            clean_correct = 0
            adv_correct = 0
            total = 0
            
            for batch_idx, (images, labels) in enumerate(train_loader):
                images, labels = images.to(self.device), labels.to(self.device)
                batch_size = images.size(0)
                
                # Determine number of adversarial examples
                num_adv = int(batch_size * adv_ratio)
                
                # Generate adversarial examples for portion of batch
                if num_adv > 0:
                    adv_images_batch = images[:num_adv]
                    adv_labels_batch = labels[:num_adv]
                    
                    if attack_type == 'fgsm':
                        adv_examples = self.attacker.fgsm_attack(
                            adv_images_batch, adv_labels_batch, epsilon
                        )
                    else:  # PGD
                        adv_examples = self.attacker.pgd_attack(
                            adv_images_batch, adv_labels_batch, epsilon
                        )
                    
                    # Combine clean and adversarial examples
                    mixed_images = torch.cat([images[num_adv:], adv_examples], dim=0)
                    mixed_labels = torch.cat([labels[num_adv:], adv_labels_batch], dim=0)
                else:
                    mixed_images = images
                    mixed_labels = labels
                
                # Train on mixed batch
                optimizer.zero_grad()
                outputs = self.model(mixed_images)
                loss = criterion(outputs, mixed_labels)
                loss.backward()
                optimizer.step()
                
                total_loss += loss.item()
                _, predicted = outputs.max(1)
                total += mixed_labels.size(0)
                clean_correct += predicted[num_adv:].eq(mixed_labels[num_adv:]).sum().item()
                if num_adv > 0:
                    adv_correct += predicted[:num_adv].eq(mixed_labels[:num_adv]).sum().item()
            
            # Epoch summary
            avg_loss = total_loss / len(train_loader)
            clean_acc = 100. * clean_correct / (total - num_adv * len(train_loader))
            adv_acc = 100. * adv_correct / (num_adv * len(train_loader)) if num_adv > 0 else 0
            
            print(f"Epoch {epoch+1}/{epochs}: Loss={avg_loss:.4f}, "
                  f"Clean Acc={clean_acc:.2f}%, Adv Acc={adv_acc:.2f}%")
        
        return self.model

# Usage
trainer = AdversarialTrainer(model, device='cuda')
robust_model = trainer.train_adversarial(
    train_loader, 
    epochs=50, 
    epsilon=0.03, 
    adv_ratio=0.5,
    attack_type='pgd'
)
```

**3. Certified Robustness (Randomized Smoothing)**

```python
# Randomized Smoothing for Certified Robustness
import scipy.stats as stats

class RandomizedSmoothing:
    def __init__(self, model, num_classes, sigma=0.25):
        self.model = model
        self.num_classes = num_classes
        self.sigma = sigma  # Noise std dev
    
    def predict(self, x, n=1000, alpha=0.001):
        """Predict class with certification"""
        self.model.eval()
        
        # Sample predictions with Gaussian noise
        counts = np.zeros(self.num_classes)
        
        with torch.no_grad():
            for _ in range(n):
                # Add Gaussian noise
                noisy_x = x + torch.randn_like(x) * self.sigma
                noisy_x = torch.clamp(noisy_x, 0, 1)
                
                # Predict
                output = self.model(noisy_x)
                pred = output.argmax(dim=1).item()
                counts[pred] += 1
        
        # Compute confidence bounds
        top_class = counts.argmax()
        p_lower = self._lower_confidence_bound(counts[top_class], n, alpha)
        
        return top_class, p_lower
    
    def certify(self, x, n0=100, n=10000, alpha=0.001):
        """Certify robustness radius"""
        # Selection: determine predicted class
        top_class, _ = self.predict(x, n=n0, alpha=alpha)
        
        # Certification: compute certified radius
        counts = np.zeros(self.num_classes)
        
        with torch.no_grad():
            for _ in range(n):
                noisy_x = x + torch.randn_like(x) * self.sigma
                noisy_x = torch.clamp(noisy_x, 0, 1)
                
                output = self.model(noisy_x)
                pred = output.argmax(dim=1).item()
                counts[pred] += 1
        
        # Confidence intervals
        p_A = counts[top_class] / n
        p_A_lower = self._lower_confidence_bound(counts[top_class], n, alpha)
        
        if p_A_lower < 0.5:
            return top_class, 0.0  # Cannot certify
        
        # Compute certified radius
        radius = self.sigma * stats.norm.ppf(p_A_lower)
        
        return top_class, radius
    
    def _lower_confidence_bound(self, count, n, alpha):
        """Clopper-Pearson confidence interval"""
        return stats.binom.ppf(alpha, n, count / n) / n

# Usage
smoother = RandomizedSmoothing(model, num_classes=10, sigma=0.25)

# Certify single example
pred_class, certified_radius = smoother.certify(image, n=10000, alpha=0.001)
print(f"Predicted: {pred_class}, Certified Radius: {certified_radius:.4f}")

# Batch certification
certified_accuracies = []
for radius in [0.0, 0.25, 0.5, 1.0]:
    correct = 0
    total = 0
    for images, labels in test_loader:
        for image, label in zip(images, labels):
            pred, cert_radius = smoother.certify(image.unsqueeze(0))
            if pred == label and cert_radius >= radius:
                correct += 1
            total += 1
    
    cert_acc = 100. * correct / total
    certified_accuracies.append((radius, cert_acc))
    print(f"Certified Accuracy at radius {radius}: {cert_acc:.2f}%")
```

**4. Adversarial Detection**

```python
# Detect adversarial examples before inference
class AdversarialDetector:
    def __init__(self, model, clean_data_loader):
        self.model = model
        self.model.eval()
        
        # Compute statistics on clean data
        self.compute_clean_statistics(clean_data_loader)
    
    def compute_clean_statistics(self, data_loader):
        """Compute feature statistics from clean data"""
        activations = []
        
        # Hook to extract features
        def hook(module, input, output):
            activations.append(output.detach().cpu())
        
        # Register hook on penultimate layer
        handle = list(self.model.children())[-2].register_forward_hook(hook)
        
        with torch.no_grad():
            for images, _ in data_loader:
                _ = self.model(images)
        
        handle.remove()
        
        # Compute mean and std of activations
        all_activations = torch.cat(activations, dim=0)
        self.clean_mean = all_activations.mean(dim=0)
        self.clean_std = all_activations.std(dim=0)
    
    def detect(self, x, threshold=3.0):
        """Detect if input is adversarial"""
        activations = []
        
        def hook(module, input, output):
            activations.append(output.detach().cpu())
        
        handle = list(self.model.children())[-2].register_forward_hook(hook)
        
        with torch.no_grad():
            _ = self.model(x)
        
        handle.remove()
        
        # Compute Mahalanobis distance
        activation = activations[0]
        diff = activation - self.clean_mean
        mahal_dist = torch.sqrt(torch.sum((diff / self.clean_std) ** 2))
        
        is_adversarial = mahal_dist > threshold
        
        return is_adversarial.item(), mahal_dist.item()

# Usage
detector = AdversarialDetector(model, clean_train_loader)

# Test on clean and adversarial examples
clean_detected = 0
adv_detected = 0

for images, labels in test_loader:
    # Clean examples
    for image in images:
        is_adv, distance = detector.detect(image.unsqueeze(0))
        if is_adv:
            clean_detected += 1
    
    # Adversarial examples
    adv_images = attacker.pgd_attack(images, labels, epsilon=0.03)
    for adv_image in adv_images:
        is_adv, distance = detector.detect(adv_image.unsqueeze(0))
        if is_adv:
            adv_detected += 1

print(f"Clean examples flagged: {clean_detected} (FPR)")
print(f"Adversarial examples detected: {adv_detected} (TPR)")
```

## Implementation Guidance

### Adversarial Testing Workflow

1. **Pre-Deployment Testing**
   - White-box attacks (FGSM, PGD, C&W)
   - Black-box attacks (query-based)
   - Physical adversarial testing
   - Certified robustness evaluation

2. **Defense Implementation**
   - Adversarial training
   - Input preprocessing (JPEG, quantization)
   - Ensemble methods
   - Adversarial detection

3. **Continuous Monitoring**
   - Detect adversarial inputs in production
   - Log suspicious patterns
   - Retrain with new adversarial examples
   - Update defenses

### Tools and Frameworks

| Tool | Purpose | Attacks Supported |
|------|---------|-------------------|
| **Adversarial Robustness Toolbox (ART)** | Comprehensive attack/defense library | 40+ attacks |
| **CleverHans** | Adversarial examples library | FGSM, PGD, C&W, etc. |
| **Foolbox** | Adversarial attacks | 30+ attacks |
| **RobustBench** | Standardized robustness benchmarks | Evaluation |

## Evidence Requirements

1. **Adversarial Test Report**
   - Attack types tested
   - Success rates per attack
   - Robustness metrics
   - Subgroup analysis

2. **Defense Validation**
   - Adversarial training logs
   - Clean vs robust accuracy
   - Defense effectiveness

3. **Certification Records**
   - Certified accuracy at various radii
   - Confidence bounds
   - Certification method

4. **Monitoring Logs**
   - Adversarial detection events
   - False positive rate
   - Model retraining triggers

## Related Controls

- **COMP-EN18031-017**: Model Validation
- **COMP-EN18031-022**: Model Security Scanning
- **COMP-EN18031-039**: Robustness Testing

## Status Checklist

- [ ] Adversarial attack library integrated
- [ ] White-box attacks tested (FGSM, PGD, C&W)
- [ ] Black-box attacks tested
- [ ] Adversarial training implemented
- [ ] Input defenses deployed
- [ ] Certified robustness computed
- [ ] Adversarial detection operational
- [ ] Subgroup robustness evaluated
- [ ] Physical adversarial testing conducted
- [ ] Continuous monitoring enabled

---

**Last Updated**: 2025-12-13  
**Status**: Pending Verification  
**Priority**: High
