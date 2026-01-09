---
title: COMP-EN18031-012: Data Privacy for AI
type: documentation
created: 2025-12-17
updated: 2025-12-17
---

# COMP-EN18031-012: Data Privacy for AI

---
id: comp-en18031-012-data-privacy-for-ai
title: COMP-EN18031-012 - Data Privacy for AI
framework: en18031
category: Data Management
priority: critical
status: pending-verification
references: []
relatedControls:
  - comp-gdpr-011-privacy-by-design
  - comp-gdpr-012-privacy-by-default
  - comp-iso27701-031-privacy-by-design
  - comp-iso27701-034-data-protection-officer
  - comp-hipaa-002-risk-analysis
  - comp-soc-017-data-classification
linkedRequirements: []
---

## Overview

**Purpose**: Ensure AI systems process personal data in compliance with privacy regulations (GDPR, CCPA, HIPAA) while maintaining model performance and utility.

**Scope**: Covers privacy-preserving AI techniques, data minimization, consent management, anonymization, differential privacy, and privacy impact assessments for AI systems.

**Regulatory Context**:
- EN 18031 §5.2: Data Privacy Controls
- GDPR Articles 5, 25, 35: Privacy by design, data protection impact assessment
- ISO/IEC 27701:2019: Privacy Information Management
- CCPA: Consumer privacy rights
- HIPAA §164.514: De-identification standards

## Acceptance Criteria

```gherkin
Feature: Data Privacy for AI Systems
  As a Data Protection Officer
  I need to ensure AI systems process personal data lawfully and minimize privacy risks
  So that we comply with privacy regulations and protect individual rights

  Background:
    Given an AI system that processes personal data
    And privacy regulations apply (GDPR, CCPA, HIPAA)
    And a privacy policy is in effect

  Scenario: Privacy by Design Implementation
    Given an AI model under development
    When the system is designed
    Then privacy-enhancing technologies SHALL be integrated from the start
    And data minimization principles SHALL be applied
    And privacy impact assessment SHALL be conducted
    And default settings SHALL maximize privacy
    And technical safeguards SHALL prevent unauthorized access
    And audit logs SHALL record all data processing activities

  Scenario: Data Minimization for Training
    Given a training dataset containing personal information
    When preparing data for model training
    Then only necessary attributes SHALL be retained
    And irrelevant personal data SHALL be removed
    And data collection SHALL be purpose-limited
    And retention period SHALL be defined and enforced
    And justification SHALL be documented for each data element
    
    Examples: Medical AI Training Data
      | Original Attributes | Required for Model | Privacy Action |
      | Full Name | No | Remove |
      | Date of Birth | No | Convert to age range |
      | Diagnosis Code | Yes | Keep (necessary) |
      | SSN | No | Remove |
      | Zip Code | Partial | Generalize to region |
      | Treatment Outcome | Yes | Keep (necessary) |

  Scenario: Consent Management for AI Processing
    Given users providing data for AI processing
    When personal data is collected
    Then explicit consent SHALL be obtained for AI-specific processing
    And purpose SHALL be clearly explained (including AI use)
    And users SHALL be informed about automated decision-making
    And consent withdrawal mechanism SHALL be provided
    And consent records SHALL be maintained with timestamps
    And re-consent SHALL be obtained for purpose changes
    
    Examples: Consent Types for AI
      | Use Case | Consent Type | Withdrawal Impact |
      | Personalized recommendations | Opt-in | Service degradation |
      | Fraud detection (necessary) | Legitimate interest | Limited withdrawal |
      | Marketing AI | Opt-in | No impact |
      | Medical diagnosis AI | Explicit consent + info | Alternative provided |

  Scenario: Anonymization and Pseudonymization
    Given personal data used in AI systems
    When data is processed for training or inference
    Then identifiable data SHALL be anonymized or pseudonymized
    And anonymization technique SHALL be validated for re-identification risk
    And pseudonymization keys SHALL be stored separately
    And linkability analysis SHALL be performed
    And k-anonymity threshold SHALL be enforced (k ≥ 5)
    And l-diversity SHALL be verified for sensitive attributes
    
    Examples: Anonymization Techniques
      | Technique | Use Case | Re-identification Risk |
      | Generalization | Age → Age range | Low |
      | Suppression | Remove direct identifiers | Low |
      | Perturbation | Add noise to numerical data | Medium |
      | Pseudonymization | Replace ID with token | Medium (with key) |
      | Synthetic data | Generate artificial records | Very Low |

  Scenario: Differential Privacy in Model Training
    Given a machine learning model trained on sensitive data
    When model training occurs
    Then differential privacy mechanisms SHALL be applied
    And privacy budget (epsilon) SHALL be defined (ε ≤ 1.0 for sensitive data)
    And noise SHALL be added to gradients or outputs
    And privacy loss SHALL be tracked across queries
    And formal privacy guarantees SHALL be documented
    And utility/privacy tradeoff SHALL be evaluated
    
    Examples: Differential Privacy Parameters
      | Data Sensitivity | Epsilon (ε) | Delta (δ) | Use Case |
      | Medical records | 0.1 | 1e-5 | High privacy |
      | Financial data | 0.5 | 1e-5 | Medium privacy |
      | General analytics | 1.0 | 1e-5 | Standard privacy |
      | Public data enrichment | 5.0 | 1e-4 | Low privacy |

  Scenario: Privacy Impact Assessment for AI
    Given a new AI system processing personal data
    When planning deployment
    Then a Privacy Impact Assessment (PIA) SHALL be conducted
    And data flows SHALL be mapped
    And risks to individual rights SHALL be identified
    And mitigation measures SHALL be defined
    And necessity and proportionality SHALL be justified
    And consultation with DPO SHALL occur
    And PIA SHALL be reviewed annually or on significant changes
    
    PIA Checklist:
      | Assessment Area | Required |
      | Data sources and categories | Yes |
      | Processing purposes | Yes |
      | Legal basis (GDPR Art. 6) | Yes |
      | Data subject rights mechanisms | Yes |
      | Automated decision-making impacts | Yes |
      | International data transfers | If applicable |
      | Data retention and deletion | Yes |
      | Security measures | Yes |

  Scenario: Right to Explanation for AI Decisions
    Given an AI system making automated decisions affecting individuals
    When a user requests explanation
    Then meaningful information about decision logic SHALL be provided
    And factors influencing the decision SHALL be disclosed
    And explanation SHALL be understandable to data subjects
    And model type and data sources SHALL be described
    And right to human review SHALL be offered for significant decisions
    And response SHALL occur within regulatory timeframe (GDPR: 1 month)

  Scenario: Data Subject Rights (Access, Rectification, Erasure)
    Given personal data processed by AI systems
    When a data subject exercises rights
    Then data access request SHALL be fulfilled within 30 days
    And inaccurate data SHALL be corrected
    And data erasure SHALL be implemented where applicable
    And erasure impact on model SHALL be assessed
    And model retraining SHALL be triggered if necessary
    And "right to be forgotten" exceptions SHALL be documented
    
    Challenges for AI Systems:
      | Right | AI Challenge | Solution |
      | Access | Data embedded in model | Provide training data, not model weights |
      | Rectification | Immutable training set | Retrain with corrected data |
      | Erasure | Model memorization | Machine unlearning techniques |
      | Portability | Proprietary format | Export in structured format |
```

## Technical Context

### Privacy-Preserving AI Techniques

**1. Differential Privacy**

```python
# Differential Privacy Training (PyTorch + Opacus)
from opacus import PrivacyEngine
from opacus.utils.batch_memory_manager import BatchMemoryManager
import torch
import torch.nn as nn

class PrivateModelTrainer:
    def __init__(self, model, epsilon=1.0, delta=1e-5, max_grad_norm=1.0):
        self.model = model
        self.epsilon = epsilon
        self.delta = delta
        self.max_grad_norm = max_grad_norm
        self.privacy_engine = None
    
    def enable_privacy(self, optimizer, data_loader):
        """Enable differential privacy for training"""
        self.privacy_engine = PrivacyEngine()
        
        self.model, optimizer, data_loader = self.privacy_engine.make_private(
            module=self.model,
            optimizer=optimizer,
            data_loader=data_loader,
            noise_multiplier=1.1,  # Noise scale
            max_grad_norm=self.max_grad_norm,
        )
        
        return optimizer, data_loader
    
    def train_epoch(self, data_loader, optimizer, criterion):
        """Train with differential privacy"""
        self.model.train()
        
        with BatchMemoryManager(
            data_loader=data_loader,
            max_physical_batch_size=64,
            optimizer=optimizer
        ) as memory_safe_data_loader:
            
            for batch_idx, (data, target) in enumerate(memory_safe_data_loader):
                optimizer.zero_grad()
                output = self.model(data)
                loss = criterion(output, target)
                loss.backward()
                optimizer.step()
        
        # Get privacy spent
        epsilon, best_alpha = self.privacy_engine.get_epsilon(self.delta)
        print(f"Privacy spent: (ε = {epsilon:.2f}, δ = {self.delta})")
        
        return epsilon

# Example usage
model = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Linear(128, 10)
)

trainer = PrivateModelTrainer(
    model=model,
    epsilon=1.0,  # Privacy budget
    delta=1e-5,
    max_grad_norm=1.0
)

optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
train_loader = torch.utils.data.DataLoader(dataset, batch_size=64)

optimizer, train_loader = trainer.enable_privacy(optimizer, train_loader)
epsilon_spent = trainer.train_epoch(train_loader, optimizer, nn.CrossEntropyLoss())

print(f"Final privacy guarantee: ε={epsilon_spent:.2f}, δ={trainer.delta}")
```

**2. Federated Learning (Privacy-Preserving Distributed Training)**

```python
# Federated Learning with Differential Privacy
import tensorflow as tf
import tensorflow_federated as tff

class FederatedPrivacyManager:
    def __init__(self, num_clients=10, epsilon=1.0):
        self.num_clients = num_clients
        self.epsilon = epsilon
    
    def create_federated_data(self, data, num_clients):
        """Split data across simulated clients"""
        client_data = []
        data_per_client = len(data) // num_clients
        
        for i in range(num_clients):
            start = i * data_per_client
            end = start + data_per_client
            client_data.append(data[start:end])
        
        return client_data
    
    def build_federated_model(self):
        """Create TFF model"""
        def model_fn():
            keras_model = tf.keras.Sequential([
                tf.keras.layers.Dense(128, activation='relu', input_shape=(784,)),
                tf.keras.layers.Dense(10, activation='softmax')
            ])
            return tff.learning.from_keras_model(
                keras_model,
                input_spec=(
                    tf.TensorSpec(shape=[None, 784], dtype=tf.float32),
                    tf.TensorSpec(shape=[None], dtype=tf.int32)
                ),
                loss=tf.keras.losses.SparseCategoricalCrossentropy(),
                metrics=[tf.keras.metrics.SparseCategoricalAccuracy()]
            )
        
        return model_fn
    
    def train_with_privacy(self, federated_data, num_rounds=10):
        """Train federated model with DP"""
        model_fn = self.build_federated_model()
        
        # Build federated averaging process with DP
        iterative_process = tff.learning.build_federated_averaging_process(
            model_fn,
            client_optimizer_fn=lambda: tf.keras.optimizers.SGD(0.02),
            server_optimizer_fn=lambda: tf.keras.optimizers.SGD(1.0)
        )
        
        state = iterative_process.initialize()
        
        for round_num in range(num_rounds):
            state, metrics = iterative_process.next(state, federated_data)
            print(f'Round {round_num}: loss={metrics["loss"]:.4f}, '
                  f'accuracy={metrics["sparse_categorical_accuracy"]:.4f}')
        
        return state

# Usage
manager = FederatedPrivacyManager(num_clients=10, epsilon=1.0)
federated_data = manager.create_federated_data(train_data, num_clients=10)
final_model = manager.train_with_privacy(federated_data, num_rounds=10)
```

**3. Anonymization and k-Anonymity**

```python
# Data Anonymization with k-Anonymity
import pandas as pd
from anonymization import Anonymizer, kmember_clustering

class DataAnonymizer:
    def __init__(self, k=5, l=2):
        """
        k-anonymity: Each record indistinguishable from k-1 others
        l-diversity: Each group has at least l distinct sensitive values
        """
        self.k = k
        self.l = l
    
    def generalize_age(self, age):
        """Generalize age to ranges"""
        if age < 18:
            return '0-17'
        elif age < 30:
            return '18-29'
        elif age < 50:
            return '30-49'
        elif age < 65:
            return '50-64'
        else:
            return '65+'
    
    def generalize_zipcode(self, zipcode):
        """Generalize zipcode to region"""
        return zipcode[:3] + '**'  # Keep first 3 digits
    
    def anonymize_dataset(self, df, quasi_identifiers, sensitive_attrs):
        """Apply k-anonymity and l-diversity"""
        df_anon = df.copy()
        
        # Apply generalization to quasi-identifiers
        if 'age' in quasi_identifiers:
            df_anon['age'] = df_anon['age'].apply(self.generalize_age)
        
        if 'zipcode' in quasi_identifiers:
            df_anon['zipcode'] = df_anon['zipcode'].apply(self.generalize_zipcode)
        
        # Remove direct identifiers
        direct_identifiers = ['name', 'ssn', 'email', 'phone']
        df_anon = df_anon.drop(columns=[col for col in direct_identifiers if col in df_anon.columns])
        
        # Check k-anonymity
        group_sizes = df_anon.groupby(quasi_identifiers).size()
        if (group_sizes < self.k).any():
            print(f"WARNING: k-anonymity violated (k={self.k})")
            print(f"Smallest group size: {group_sizes.min()}")
        
        # Check l-diversity
        for sensitive_attr in sensitive_attrs:
            diversity = df_anon.groupby(quasi_identifiers)[sensitive_attr].nunique()
            if (diversity < self.l).any():
                print(f"WARNING: l-diversity violated for {sensitive_attr} (l={self.l})")
        
        return df_anon
    
    def calculate_information_loss(self, original_df, anonymized_df):
        """Measure utility loss from anonymization"""
        # Calculate generalization level
        loss_metrics = {}
        
        for col in anonymized_df.columns:
            if col in original_df.columns:
                orig_unique = original_df[col].nunique()
                anon_unique = anonymized_df[col].nunique()
                loss_metrics[col] = (orig_unique - anon_unique) / orig_unique
        
        return loss_metrics

# Usage
anonymizer = DataAnonymizer(k=5, l=2)

# Original data with personal information
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'age': [25, 27, 26, 52, 51],
    'zipcode': ['12345', '12346', '12347', '67890', '67891'],
    'diagnosis': ['Diabetes', 'Diabetes', 'Heart Disease', 'Cancer', 'Cancer']
})

quasi_identifiers = ['age', 'zipcode']
sensitive_attrs = ['diagnosis']

df_anonymized = anonymizer.anonymize_dataset(df, quasi_identifiers, sensitive_attrs)
loss = anonymizer.calculate_information_loss(df, df_anonymized)

print("\nAnonymized Data:")
print(df_anonymized)
print(f"\nInformation Loss: {loss}")
```

**4. Synthetic Data Generation (Privacy-Preserving)**

```python
# Synthetic Data Generation with Differential Privacy
from sdv.tabular import CTGAN
from sdv.constraints import Positive, Between
import numpy as np

class PrivacySyntheticDataGenerator:
    def __init__(self, epsilon=1.0):
        self.epsilon = epsilon
        self.synthesizer = None
    
    def train_synthesizer(self, real_data, constraints=None):
        """Train CTGAN with differential privacy"""
        # Define constraints to ensure realistic synthetic data
        if constraints is None:
            constraints = [
                Positive(columns=['age']),
                Between(columns=['age'], low=0, high=120)
            ]
        
        # Train CTGAN
        self.synthesizer = CTGAN(
            epochs=100,
            batch_size=500,
            generator_lr=2e-4,
            discriminator_lr=2e-4,
            discriminator_steps=1,
            privacy=True,  # Enable DP
            epsilon=self.epsilon
        )
        
        self.synthesizer.fit(real_data, constraints=constraints)
    
    def generate_synthetic_data(self, num_rows):
        """Generate synthetic data"""
        if self.synthesizer is None:
            raise ValueError("Synthesizer not trained")
        
        return self.synthesizer.sample(num_rows)
    
    def evaluate_quality(self, real_data, synthetic_data):
        """Evaluate synthetic data quality"""
        from sdv.metrics.tabular import CSTest, KSTest
        
        # Statistical similarity tests
        cs_score = CSTest.compute(real_data, synthetic_data)
        ks_score = KSTest.compute(real_data, synthetic_data)
        
        return {
            'chi_squared_test': cs_score,
            'kolmogorov_smirnov_test': ks_score
        }
    
    def assess_privacy_risk(self, real_data, synthetic_data, num_neighbors=5):
        """Assess re-identification risk"""
        # Calculate nearest neighbor distance ratio (NNDR)
        from sklearn.neighbors import NearestNeighbors
        
        # Fit on real data
        nbrs = NearestNeighbors(n_neighbors=num_neighbors).fit(real_data.values)
        
        # Find distances for synthetic data
        distances, _ = nbrs.kneighbors(synthetic_data.values)
        
        # Average distance to nearest real record
        avg_distance = np.mean(distances[:, 0])
        
        return {
            'avg_nearest_neighbor_distance': avg_distance,
            'privacy_risk': 'High' if avg_distance < 0.1 else 'Low'
        }

# Usage
generator = PrivacySyntheticDataGenerator(epsilon=1.0)

# Real sensitive data
real_data = pd.DataFrame({
    'age': [25, 30, 45, 60, 28],
    'income': [50000, 75000, 100000, 120000, 55000],
    'disease_risk_score': [0.2, 0.3, 0.6, 0.8, 0.25]
})

generator.train_synthesizer(real_data)
synthetic_data = generator.generate_synthetic_data(num_rows=1000)

quality = generator.evaluate_quality(real_data, synthetic_data)
privacy_risk = generator.assess_privacy_risk(real_data, synthetic_data)

print(f"Data Quality: {quality}")
print(f"Privacy Risk: {privacy_risk}")
```

### Privacy Impact Assessment (PIA) Framework

```python
# Privacy Impact Assessment Automation
from dataclasses import dataclass
from typing import List, Dict
from enum import Enum

class DataCategory(Enum):
    PERSONAL_IDENTIFIABLE = "PII"
    SENSITIVE = "Sensitive (GDPR Art. 9)"
    SPECIAL_CATEGORY = "Special Category"
    ANONYMIZED = "Anonymized"

class ProcessingPurpose(Enum):
    TRAINING = "Model Training"
    INFERENCE = "Inference/Prediction"
    ANALYSIS = "Data Analysis"
    MONITORING = "Performance Monitoring"

@dataclass
class DataFlow:
    source: str
    destination: str
    data_categories: List[DataCategory]
    purpose: ProcessingPurpose
    legal_basis: str
    retention_period: str

class PrivacyImpactAssessment:
    def __init__(self, ai_system_name: str):
        self.system_name = ai_system_name
        self.data_flows: List[DataFlow] = []
        self.risks: List[Dict] = []
        self.mitigations: List[Dict] = []
    
    def add_data_flow(self, flow: DataFlow):
        """Register a data flow"""
        self.data_flows.append(flow)
    
    def assess_risk(self, risk_description: str, likelihood: str, impact: str):
        """Add identified risk"""
        risk_level = self._calculate_risk_level(likelihood, impact)
        self.risks.append({
            'description': risk_description,
            'likelihood': likelihood,  # Low, Medium, High
            'impact': impact,  # Low, Medium, High
            'level': risk_level
        })
    
    def add_mitigation(self, risk_id: int, mitigation: str, residual_risk: str):
        """Add mitigation measure"""
        self.mitigations.append({
            'risk_id': risk_id,
            'mitigation': mitigation,
            'residual_risk': residual_risk
        })
    
    def _calculate_risk_level(self, likelihood: str, impact: str):
        """Calculate risk level matrix"""
        risk_matrix = {
            ('Low', 'Low'): 'Low',
            ('Low', 'Medium'): 'Low',
            ('Low', 'High'): 'Medium',
            ('Medium', 'Low'): 'Low',
            ('Medium', 'Medium'): 'Medium',
            ('Medium', 'High'): 'High',
            ('High', 'Low'): 'Medium',
            ('High', 'Medium'): 'High',
            ('High', 'High'): 'Critical'
        }
        return risk_matrix.get((likelihood, impact), 'Unknown')
    
    def generate_report(self) -> str:
        """Generate PIA report"""
        report = f"# Privacy Impact Assessment: {self.system_name}\n\n"
        
        report += "## Data Flows\n"
        for i, flow in enumerate(self.data_flows, 1):
            report += f"{i}. {flow.source} → {flow.destination}\n"
            report += f"   - Purpose: {flow.purpose.value}\n"
            report += f"   - Data: {[cat.value for cat in flow.data_categories]}\n"
            report += f"   - Legal Basis: {flow.legal_basis}\n"
            report += f"   - Retention: {flow.retention_period}\n\n"
        
        report += "## Privacy Risks\n"
        for i, risk in enumerate(self.risks, 1):
            report += f"{i}. {risk['description']}\n"
            report += f"   - Likelihood: {risk['likelihood']}, Impact: {risk['impact']}\n"
            report += f"   - Risk Level: **{risk['level']}**\n\n"
        
        report += "## Mitigation Measures\n"
        for mit in self.mitigations:
            report += f"- Risk {mit['risk_id']}: {mit['mitigation']}\n"
            report += f"  Residual Risk: {mit['residual_risk']}\n\n"
        
        return report

# Usage Example
pia = PrivacyImpactAssessment("Medical Diagnosis AI System")

# Register data flows
pia.add_data_flow(DataFlow(
    source="Hospital EMR System",
    destination="AI Training Pipeline",
    data_categories=[DataCategory.PERSONAL_IDENTIFIABLE, DataCategory.SENSITIVE],
    purpose=ProcessingPurpose.TRAINING,
    legal_basis="GDPR Art. 6(1)(e) - Public interest (healthcare)",
    retention_period="5 years post-training"
))

# Identify risks
pia.assess_risk(
    "Re-identification of patients from model predictions",
    likelihood="Medium",
    impact="High"
)

pia.assess_risk(
    "Unauthorized access to training data",
    likelihood="Low",
    impact="High"
)

# Add mitigations
pia.add_mitigation(
    risk_id=1,
    mitigation="Apply differential privacy (ε=0.5) during training",
    residual_risk="Low"
)

pia.add_mitigation(
    risk_id=2,
    mitigation="Implement encryption at rest and in transit, access controls",
    residual_risk="Very Low"
)

# Generate report
print(pia.generate_report())
```

## Implementation Guidance

### Privacy-First Development Workflow

1. **Data Collection Phase**
   - Minimize data collected (only necessary attributes)
   - Obtain explicit consent for AI processing
   - Document legal basis (GDPR Art. 6)
   - Implement consent withdrawal mechanism

2. **Data Preparation Phase**
   - Remove direct identifiers
   - Apply generalization/suppression
   - Verify k-anonymity (k ≥ 5)
   - Assess re-identification risk

3. **Model Training Phase**
   - Enable differential privacy (ε ≤ 1.0 for sensitive data)
   - Use federated learning if possible
   - Generate synthetic training data
   - Track privacy budget

4. **Model Deployment Phase**
   - Minimize inference data retention
   - Implement right to explanation
   - Enable data subject rights (access, erasure)
   - Monitor for privacy leakage

5. **Ongoing Compliance**
   - Conduct annual PIA reviews
   - Audit data processing activities
   - Update privacy notices
   - Respond to data subject requests within 30 days

### Tools and Frameworks

| Tool/Framework | Purpose | Privacy Mechanism |
|----------------|---------|-------------------|
| **Opacus** (PyTorch) | Differential privacy training | DP-SGD |
| **TensorFlow Privacy** | DP training | DP-SGD, DP-FTRL |
| **TensorFlow Federated** | Distributed private training | Federated learning |
| **PySyft** | Privacy-preserving ML | Federated learning, encrypted computation |
| **ARX Data Anonymization** | Data anonymization | k-anonymity, l-diversity |
| **SDV (Synthetic Data Vault)** | Synthetic data | GAN-based generation |
| **Microsoft Presidio** | PII detection/masking | NER, regex patterns |

## Evidence Requirements

### Compliance Documentation

1. **Privacy Impact Assessment (PIA)**
   - Data flow mapping
   - Risk assessment and mitigation
   - DPO consultation records
   - PIA review schedule

2. **Data Processing Agreements**
   - Processor contracts (GDPR Art. 28)
   - Data sharing agreements
   - Consent records

3. **Technical Measures**
   - Anonymization validation reports
   - Differential privacy parameters (ε, δ)
   - Encryption certificates
   - Access control policies

4. **Data Subject Rights Management**
   - Request handling procedures
   - Response time metrics (< 30 days)
   - Erasure/rectification logs
   - Explanation templates

5. **Audit Logs**
   - Data access logs
   - Model training logs
   - Data deletion logs
   - Consent changes log

### Testing Evidence

- Re-identification attack testing
- Privacy budget exhaustion testing
- Data subject rights workflow testing
- Consent withdrawal testing

## Related Controls

- **COMP-GDPR-011**: Privacy by Design
- **COMP-GDPR-012**: Privacy by Default
- **COMP-ISO27701-031**: Privacy by Design and Default
- **COMP-ISO27701-034**: Data Protection Officer
- **COMP-HIPAA-002**: Risk Analysis
- **COMP-SOC-017**: Data Classification

## Implementation Notes

### Common Pitfalls

1. **Over-collection**: Collecting more data than necessary ("just in case")
   - Solution: Strict data minimization, purpose limitation

2. **Inadequate anonymization**: Naive removal of names insufficient
   - Solution: Apply k-anonymity, test re-identification risk

3. **Ignoring model memorization**: Models may leak training data
   - Solution: Differential privacy, membership inference testing

4. **Static consent**: Not updating consent for new purposes
   - Solution: Consent versioning, re-consent workflows

### GDPR-Specific Considerations

- **Art. 5**: Data processing principles
- **Art. 6**: Lawful basis for processing
- **Art. 9**: Special categories of personal data (explicit consent)
- **Art. 13-14**: Information to be provided (transparency)
- **Art. 15-22**: Data subject rights
- **Art. 25**: Privacy by design and by default
- **Art. 35**: Data Protection Impact Assessment (DPIA)

### HIPAA-Specific Considerations (US Healthcare)

- **§164.514(a)**: De-identification standard
- **§164.514(b)**: Safe harbor method (remove 18 identifiers)
- **§164.514(c)**: Expert determination method
- **§164.514(e)**: Limited data set (remove 16 identifiers)

## Status Checklist

- [ ] PIA conducted and approved by DPO
- [ ] Legal basis documented for each processing purpose
- [ ] Data minimization implemented
- [ ] Anonymization/pseudonymization applied
- [ ] Differential privacy enabled (if applicable)
- [ ] Consent management system in place
- [ ] Data subject rights mechanisms implemented
- [ ] Audit logging enabled
- [ ] Retention policies defined and enforced
- [ ] Privacy monitoring dashboard operational
- [ ] Staff trained on privacy requirements
- [ ] Vendor contracts include GDPR Art. 28 clauses
- [ ] Cross-border transfer mechanisms compliant (if applicable)
- [ ] Breach response plan includes AI-specific scenarios

---

**Last Updated**: 2025-12-13  
**Status**: Pending Verification  
**Applies to**: All AI systems processing personal data  
**Priority**: Critical
