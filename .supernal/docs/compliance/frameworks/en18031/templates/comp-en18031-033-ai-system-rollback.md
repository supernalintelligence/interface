---
id: comp-en18031-033-ai-system-rollback
title: COMP-EN18031-033 - AI System Rollback
sidebar_label: COMP-EN18031-033
sidebar_position: 33
status: pending-verification
references:
  - comp-en18031-028-model-serving-infrastructure
  - comp-en18031-029-ai-system-performance-monitoring
---

# COMP-EN18031-033: AI System Rollback

## Overview

**Purpose**: Implement automated rollback procedures for AI systems  
**EN 18031 Control**: 5.4.8  
**Category**: ai-operations  
**Priority**: high  
**Framework**: EN 18031

## Regulatory Context

Automated rollback capabilities are essential for AI system resilience and safety, mandated by multiple frameworks:

### EN 18031:2024 - Artificial Intelligence Management System

**Control 5.4.8 - AI System Rollback**: Organizations shall implement automated procedures to rollback AI systems to previous stable versions when:
- Performance degradation is detected
- Safety incidents occur
- Compliance violations are identified
- Adversarial attacks are detected
- Unexpected behavior is observed

### Related Frameworks

**ISO/IEC 42001:2023** - Clause 8.2 (AI System Deployment and Maintenance):
- Organizations must maintain capability to revert to previous AI system versions
- Rollback procedures must be tested and documented

**EU AI Act** - Article 15 (Accuracy, Robustness, Cybersecurity):
- High-risk AI systems must have "resilience to attempts by unauthorized third parties to alter their use or performance"
- Rollback is a key resilience mechanism

**NIST AI RMF** - MANAGE 4.1:
- "Negative feedback and other mechanisms for detecting and responding to failures are implemented"
- Rollback is a primary failure response mechanism

**ISO 9001:2015** - Clause 8.5.6 (Control of Changes):
- Changes to production systems must be controllable and reversible
- Applies to AI model deployments

## Description

AI system rollback ensures that when a deployed model exhibits degraded performance, safety issues, or unexpected behavior, the system can automatically revert to a known-good previous version with minimal disruption.

### Rollback Trigger Scenarios

1. **Performance Degradation**:
   - Accuracy drops below threshold (e.g., 5% degradation)
   - Latency exceeds SLA (e.g., p99 > 500ms)
   - Error rate spikes (e.g., > 5% of requests)
   - Throughput drops significantly

2. **Model Drift Detection**:
   - Data distribution shift detected (KS test p-value < 0.05)
   - Prediction distribution anomalies
   - Feature importance changes
   - Concept drift indicators

3. **Safety Incidents**:
   - Safety constraint violations exceed threshold
   - High-risk predictions without human review
   - Unexpected model outputs (e.g., hallucinations in LLMs)
   - User-reported safety concerns

4. **Security Incidents**:
   - Adversarial attack detection
   - Model extraction attempts
   - Data poisoning indicators
   - Unauthorized model access

5. **Operational Issues**:
   - Infrastructure failures (GPU/memory issues)
   - Dependency failures
   - Integration failures with downstream systems
   - Resource exhaustion

### Rollback Strategies

**Blue-Green Deployment**:
- Maintain two identical production environments (blue and green)
- New version deployed to inactive environment
- Traffic switched atomically to new version
- Instant rollback by switching traffic back

**Canary Deployment with Automatic Rollback**:
- New version receives small percentage of traffic (e.g., 5%)
- Metrics monitored in real-time
- Automatic rollback if canary metrics degrade
- Gradual rollout if canary succeeds

**Shadow Deployment with Validation**:
- New version runs in parallel, receiving same traffic
- Outputs compared to production version
- No user-facing impact during validation
- Rollout only if shadow version performs better

**Version Pinning**:
- Each prediction includes model version metadata
- Critical paths can pin to specific model versions
- Allows gradual migration with per-client rollback

## Acceptance Criteria

```gherkin
Feature: AI System Rollback
  As an AI system operator
  I want automated rollback capabilities
  So that I can quickly recover from model failures

  Background:
    Given multiple AI model versions are deployed
    And rollback procedures are automated
    And performance monitoring is active

  Scenario: Automatic Rollback on Performance Degradation
    Given model v2.5 is deployed and serving 100% traffic
    And model v2.4 is the previous stable version
    When model v2.5 accuracy drops from 92% to 85% (> 5% degradation)
    And performance monitoring detects the degradation
    Then automatic rollback shall be triggered within 60 seconds
    And traffic shall be shifted back to model v2.4
    And rollback shall complete within 5 minutes
    And no requests shall be lost during rollback
    And ops team shall be notified of rollback
    And incident ticket shall be created automatically

  Scenario: Canary Deployment with Automatic Rollback
    Given model v3.0 (canary) is deployed to 10% of traffic
    And model v2.8 (stable) is serving 90% of traffic
    And canary monitoring is active with 5-minute evaluation window
    When canary error rate is 8% vs stable 2% (> 2x degradation)
    And canary evaluation window completes
    Then automatic rollback of canary shall be triggered
    And all traffic shall route to stable version v2.8
    And canary deployment shall be marked as failed
    And detailed failure analysis shall be generated
    And canary version shall be quarantined

  Scenario: Rollback on Model Drift Detection
    Given production model is serving traffic
    And data drift monitoring is active
    And baseline data distribution is established
    When KS test detects distribution shift (p-value < 0.05)
    And drift persists for 3 consecutive checks (15 minutes)
    Then drift alert shall be raised
    And automatic rollback shall be triggered
    And previous model version trained on recent data shall be deployed
    And drift investigation shall be initiated
    And retraining pipeline shall be triggered

  Scenario: Emergency Manual Rollback
    Given a critical model issue is discovered
    And immediate rollback is required
    When operator executes manual rollback command
    Then rollback shall initiate within 10 seconds
    And traffic shall shift to previous version within 2 minutes
    And rollback confirmation shall be displayed
    And audit log shall record manual rollback with operator ID and reason
    And post-rollback validation shall verify system health

  Scenario: Rollback with State Management
    Given the model maintains user context state
    And rollback to previous version is triggered
    When traffic shifts to previous model version
    Then in-flight requests shall be drained gracefully (30s timeout)
    And user session state shall be migrated to previous version
    And stateful predictions shall maintain consistency
    And no user shall experience session loss

  Scenario: Failed Rollback Recovery
    Given automatic rollback is triggered
    When rollback attempt fails due to infrastructure issue
    Then fallback to emergency read-only mode shall activate
    And cached predictions shall be served where available
    And degraded service banner shall be displayed to users
    And critical alerts shall be escalated to on-call engineer
    And incident commander shall be paged

  Scenario: Multi-Region Coordinated Rollback
    Given AI system is deployed in 3 regions (US, EU, APAC)
    And performance degradation is detected in US region
    When automatic rollback is triggered in US
    And rollback completes successfully
    Then rollback decision shall be evaluated for EU and APAC
    And if issue is model-related (not infrastructure), all regions shall rollback
    And regional rollbacks shall be coordinated to prevent cascade failures
    And global rollback status dashboard shall be updated

  Scenario: Rollback Testing (Chaos Engineering)
    Given monthly rollback drills are scheduled
    When rollback drill is initiated
    And synthetic performance degradation is injected
    Then automatic rollback procedure shall trigger correctly
    And rollback shall complete within SLA (5 minutes)
    And all monitoring systems shall detect and log the drill
    And rollback readiness score shall be calculated
    And any issues shall be documented and remediated
```

## Technical Context

### Rollback Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                   AI Model Deployment & Rollback System             │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Deployment Orchestrator      │
         │  (Kubernetes Operator/Argo)   │
         └───────────┬───────────────────┘
                     │
      ┌──────────────┼──────────────┬─────────────┐
      │              │              │             │
      ▼              ▼              ▼             ▼
┌──────────┐  ┌──────────────┐ ┌──────────┐ ┌────────────┐
│  Blue    │  │   Canary     │ │  Green   │ │  Shadow    │
│ (stable) │  │ (testing 10%)│ │(inactive)│ │(validation)│
│  v2.4    │  │    v2.5      │ │   v2.6   │ │   v2.7     │
└────┬─────┘  └──────┬───────┘ └────┬─────┘ └──────┬─────┘
     │               │              │              │
     └───────────────┼──────────────┴──────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │   Traffic Router (Istio)      │
         │  - Version-based routing      │
         │  - A/B testing                │
         │  - Gradual rollout            │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │  Performance Monitor          │
         │  - Real-time metrics          │
         │  - Anomaly detection          │
         │  - Drift detection            │
         └───────────┬───────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
   [Healthy: Continue]   [Degraded: Rollback]
                              │
                              ▼
                  ┌───────────────────────┐
                  │  Rollback Controller  │
                  │  - Trigger rollback   │
                  │  - Health checks      │
                  │  - State migration    │
                  └───────────┬───────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │   Audit Logger        │
                  │   Alert Manager       │
                  │   Incident Creator    │
                  └───────────────────────┘
```

### Implementation: Rollback Controller

```python
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Optional
import logging
import time
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class DeploymentStrategy(Enum):
    BLUE_GREEN = "blue_green"
    CANARY = "canary"
    ROLLING = "rolling"
    SHADOW = "shadow"

class RollbackTrigger(Enum):
    PERFORMANCE_DEGRADATION = "performance_degradation"
    MODEL_DRIFT = "model_drift"
    SAFETY_INCIDENT = "safety_incident"
    SECURITY_INCIDENT = "security_incident"
    MANUAL = "manual"
    FAILED_HEALTH_CHECK = "failed_health_check"

class RollbackStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    ROLLED_BACK = "rolled_back"

@dataclass
class ModelVersion:
    version: str
    deployment_timestamp: datetime
    health_status: str
    performance_metrics: Dict[str, float]
    traffic_percentage: int
    deployment_strategy: DeploymentStrategy

@dataclass
class RollbackDecision:
    trigger: RollbackTrigger
    from_version: str
    to_version: str
    reason: str
    metrics: Dict[str, any]
    automatic: bool
    initiated_by: Optional[str]
    timestamp: datetime

class PerformanceComparator:
    """Compares performance between model versions"""
    
    def __init__(self, thresholds: Dict):
        self.thresholds = thresholds
    
    def should_rollback(self, current: ModelVersion, 
                       previous: ModelVersion) -> Optional[RollbackDecision]:
        """Determine if rollback is needed based on performance comparison"""
        
        issues = []
        
        # Compare accuracy
        accuracy_degradation = (
            previous.performance_metrics.get('accuracy', 0) - 
            current.performance_metrics.get('accuracy', 0)
        )
        if accuracy_degradation > self.thresholds['max_accuracy_degradation']:
            issues.append(
                f"Accuracy degraded by {accuracy_degradation:.2%} "
                f"(threshold: {self.thresholds['max_accuracy_degradation']:.2%})"
            )
        
        # Compare error rate
        current_error_rate = current.performance_metrics.get('error_rate', 0)
        previous_error_rate = previous.performance_metrics.get('error_rate', 0)
        if current_error_rate > previous_error_rate * self.thresholds['max_error_rate_multiplier']:
            issues.append(
                f"Error rate increased: {previous_error_rate:.2%} -> "
                f"{current_error_rate:.2%} "
                f"(>{self.thresholds['max_error_rate_multiplier']}x)"
            )
        
        # Compare latency
        current_latency = current.performance_metrics.get('latency_p99', 0)
        if current_latency > self.thresholds['max_latency_ms']:
            issues.append(
                f"Latency p99 exceeds threshold: {current_latency}ms > "
                f"{self.thresholds['max_latency_ms']}ms"
            )
        
        if issues:
            return RollbackDecision(
                trigger=RollbackTrigger.PERFORMANCE_DEGRADATION,
                from_version=current.version,
                to_version=previous.version,
                reason="; ".join(issues),
                metrics={
                    'current': current.performance_metrics,
                    'previous': previous.performance_metrics
                },
                automatic=True,
                initiated_by=None,
                timestamp=datetime.utcnow()
            )
        
        return None

class RollbackController:
    """Orchestrates AI model rollbacks"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.performance_comparator = PerformanceComparator(
            config['performance_thresholds']
        )
        self.deployment_manager = DeploymentManager(config)
        self.health_checker = HealthChecker(config)
        self.state_migrator = StateMigrator(config)
        self.audit_logger = AuditLogger()
        self.alert_manager = AlertManager()
        self.rollback_history = []
    
    def monitor_and_rollback(self, current_version: ModelVersion,
                            previous_version: ModelVersion) -> Optional[RollbackStatus]:
        """Continuously monitor and trigger rollback if needed"""
        
        # Check if rollback is needed
        decision = self.performance_comparator.should_rollback(
            current_version, previous_version
        )
        
        if decision:
            logger.warning(
                f"Rollback triggered: {decision.trigger.value} - {decision.reason}"
            )
            return self.execute_rollback(decision, current_version, previous_version)
        
        return None
    
    def execute_rollback(self, decision: RollbackDecision,
                        current: ModelVersion, 
                        previous: ModelVersion) -> RollbackStatus:
        """Execute rollback procedure"""
        
        rollback_id = f"rollback-{int(time.time())}"
        
        try:
            # Log rollback initiation
            self.audit_logger.log_rollback_start(rollback_id, decision)
            
            # Send alerts
            self.alert_manager.send_alert(
                severity="high",
                title=f"AI Model Rollback Initiated: {decision.from_version} -> {decision.to_version}",
                message=decision.reason,
                metadata={'rollback_id': rollback_id, 'decision': decision}
            )
            
            # Phase 1: Pre-rollback health check
            logger.info(f"[{rollback_id}] Phase 1: Pre-rollback health check")
            if not self.health_checker.check_version(previous.version):
                raise RollbackError(
                    f"Previous version {previous.version} failed health check"
                )
            
            # Phase 2: Drain in-flight requests (graceful shutdown)
            logger.info(f"[{rollback_id}] Phase 2: Draining in-flight requests")
            self.deployment_manager.drain_traffic(
                current.version, 
                timeout=self.config['drain_timeout_seconds']
            )
            
            # Phase 3: Migrate state (if stateful model)
            if self.config.get('stateful', False):
                logger.info(f"[{rollback_id}] Phase 3: Migrating state")
                self.state_migrator.migrate(
                    from_version=current.version,
                    to_version=previous.version
                )
            
            # Phase 4: Route traffic to previous version
            logger.info(f"[{rollback_id}] Phase 4: Routing traffic to {previous.version}")
            self.deployment_manager.route_traffic(
                from_version=current.version,
                to_version=previous.version,
                strategy=current.deployment_strategy
            )
            
            # Phase 5: Post-rollback health check
            logger.info(f"[{rollback_id}] Phase 5: Post-rollback health check")
            if not self.health_checker.verify_rollback(previous.version):
                raise RollbackError("Post-rollback health check failed")
            
            # Phase 6: Verify rollback success
            logger.info(f"[{rollback_id}] Phase 6: Verifying rollback success")
            rollback_metrics = self._verify_rollback_success(previous.version)
            
            # Log rollback completion
            self.audit_logger.log_rollback_complete(
                rollback_id, decision, rollback_metrics
            )
            
            # Send success alert
            self.alert_manager.send_alert(
                severity="info",
                title=f"AI Model Rollback Completed Successfully",
                message=f"Rolled back to {previous.version}",
                metadata={
                    'rollback_id': rollback_id,
                    'metrics': rollback_metrics
                }
            )
            
            # Record rollback in history
            self.rollback_history.append({
                'rollback_id': rollback_id,
                'decision': decision,
                'status': RollbackStatus.COMPLETED,
                'metrics': rollback_metrics,
                'timestamp': datetime.utcnow()
            })
            
            return RollbackStatus.COMPLETED
        
        except Exception as e:
            logger.error(f"[{rollback_id}] Rollback failed: {str(e)}", exc_info=True)
            
            # Log rollback failure
            self.audit_logger.log_rollback_failure(rollback_id, decision, str(e))
            
            # Send failure alert with escalation
            self.alert_manager.send_alert(
                severity="critical",
                title=f"AI Model Rollback FAILED",
                message=f"Rollback to {previous.version} failed: {str(e)}",
                metadata={
                    'rollback_id': rollback_id,
                    'error': str(e)
                },
                escalate=True  # Page on-call engineer
            )
            
            # Attempt emergency fallback
            self._emergency_fallback()
            
            return RollbackStatus.FAILED
    
    def _verify_rollback_success(self, version: str) -> Dict:
        """Verify rollback completed successfully"""
        
        # Wait for metrics to stabilize
        time.sleep(self.config['post_rollback_wait_seconds'])
        
        # Collect post-rollback metrics
        metrics = self.deployment_manager.get_version_metrics(version)
        
        # Verify metrics are healthy
        if metrics['error_rate'] > self.config['max_error_rate_after_rollback']:
            raise RollbackError(
                f"Post-rollback error rate too high: {metrics['error_rate']:.2%}"
            )
        
        return metrics
    
    def _emergency_fallback(self):
        """Emergency fallback when rollback fails"""
        logger.critical("Initiating emergency fallback mode")
        
        # Option 1: Serve cached predictions (read-only mode)
        self.deployment_manager.enable_cache_only_mode()
        
        # Option 2: Route to fallback model (simple baseline)
        # self.deployment_manager.route_to_fallback_model()
        
        # Display degraded service banner
        self.deployment_manager.set_degraded_mode(True)

class CanaryRollbackController:
    """Specialized controller for canary deployments"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.evaluation_window = config['canary_evaluation_window_seconds']
        self.canary_traffic_percentage = config['canary_traffic_percentage']
        self.metrics_collector = MetricsCollector()
    
    def evaluate_canary(self, canary_version: str, 
                       stable_version: str) -> Optional[RollbackDecision]:
        """Evaluate canary deployment and decide if rollback is needed"""
        
        # Collect metrics for both versions during evaluation window
        canary_metrics = self.metrics_collector.get_metrics(
            version=canary_version,
            duration=self.evaluation_window
        )
        stable_metrics = self.metrics_collector.get_metrics(
            version=stable_version,
            duration=self.evaluation_window
        )
        
        issues = []
        
        # Compare error rates
        if canary_metrics['error_rate'] > stable_metrics['error_rate'] * 2:
            issues.append(
                f"Canary error rate {canary_metrics['error_rate']:.2%} > "
                f"2x stable {stable_metrics['error_rate']:.2%}"
            )
        
        # Compare latency
        if canary_metrics['latency_p99'] > stable_metrics['latency_p99'] * 1.5:
            issues.append(
                f"Canary latency p99 {canary_metrics['latency_p99']}ms > "
                f"1.5x stable {stable_metrics['latency_p99']}ms"
            )
        
        # Compare user satisfaction (if available)
        if 'satisfaction_score' in canary_metrics and 'satisfaction_score' in stable_metrics:
            satisfaction_drop = (
                stable_metrics['satisfaction_score'] - 
                canary_metrics['satisfaction_score']
            )
            if satisfaction_drop > 0.1:  # 10% drop
                issues.append(
                    f"Canary user satisfaction dropped by {satisfaction_drop:.1%}"
                )
        
        if issues:
            return RollbackDecision(
                trigger=RollbackTrigger.PERFORMANCE_DEGRADATION,
                from_version=canary_version,
                to_version=stable_version,
                reason=f"Canary evaluation failed: {'; '.join(issues)}",
                metrics={
                    'canary': canary_metrics,
                    'stable': stable_metrics
                },
                automatic=True,
                initiated_by=None,
                timestamp=datetime.utcnow()
            )
        
        return None

class DeploymentManager:
    """Manages Kubernetes-based model deployments"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.k8s_client = self._init_k8s_client()
        self.istio_client = self._init_istio_client()
    
    def drain_traffic(self, version: str, timeout: int):
        """Drain in-flight requests from version"""
        logger.info(f"Draining traffic from {version} (timeout: {timeout}s)")
        
        # Set version to drain mode (no new requests)
        self._update_deployment_annotation(version, 'drain', 'true')
        
        # Wait for in-flight requests to complete
        start_time = time.time()
        while time.time() - start_time < timeout:
            inflight = self._get_inflight_request_count(version)
            if inflight == 0:
                logger.info(f"All requests drained from {version}")
                return
            time.sleep(1)
        
        logger.warning(
            f"Drain timeout reached, {inflight} requests still in-flight"
        )
    
    def route_traffic(self, from_version: str, to_version: str, 
                     strategy: DeploymentStrategy):
        """Route traffic from one version to another"""
        if strategy == DeploymentStrategy.BLUE_GREEN:
            # Atomic traffic switch
            self._update_istio_virtualservice(
                {'blue': 0, 'green': 100} if 'green' in to_version else {'blue': 100, 'green': 0}
            )
        elif strategy == DeploymentStrategy.CANARY:
            # Zero out canary traffic
            self._update_istio_virtualservice({
                'stable': 100,
                'canary': 0
            })
        elif strategy == DeploymentStrategy.ROLLING:
            # Gradual traffic shift
            for percentage in range(100, -1, -10):
                self._update_istio_virtualservice({
                    from_version: percentage,
                    to_version: 100 - percentage
                })
                time.sleep(30)  # 30s between shifts
    
    def enable_cache_only_mode(self):
        """Enable cache-only mode for emergency fallback"""
        logger.critical("Enabling cache-only mode")
        self._update_config('cache_only_mode', True)
        # Update load balancer to route to cache service
    
    def set_degraded_mode(self, enabled: bool):
        """Set degraded mode flag (displays banner to users)"""
        self._update_config('degraded_mode', enabled)
    
    def get_version_metrics(self, version: str) -> Dict:
        """Get current metrics for a version"""
        # Query Prometheus for version-specific metrics
        return {
            'accuracy': 0.92,
            'error_rate': 0.02,
            'latency_p99': 150,
            'throughput': 1000,
            'timestamp': datetime.utcnow()
        }
    
    def _init_k8s_client(self):
        """Initialize Kubernetes client"""
        # from kubernetes import client, config
        # config.load_kube_config()
        # return client.AppsV1Api()
        pass
    
    def _init_istio_client(self):
        """Initialize Istio client"""
        pass
    
    def _update_deployment_annotation(self, version: str, key: str, value: str):
        """Update Kubernetes deployment annotation"""
        pass
    
    def _get_inflight_request_count(self, version: str) -> int:
        """Get number of in-flight requests for version"""
        return 0  # Stub
    
    def _update_istio_virtualservice(self, weights: Dict[str, int]):
        """Update Istio VirtualService traffic weights"""
        pass
    
    def _update_config(self, key: str, value: any):
        """Update deployment configuration"""
        pass

class HealthChecker:
    """Performs health checks on model versions"""
    
    def __init__(self, config: Dict):
        self.config = config
    
    def check_version(self, version: str) -> bool:
        """Check if version is healthy"""
        # Liveness check
        if not self._liveness_check(version):
            return False
        
        # Readiness check
        if not self._readiness_check(version):
            return False
        
        # Model integrity check
        if not self._model_integrity_check(version):
            return False
        
        return True
    
    def verify_rollback(self, version: str) -> bool:
        """Verify version is healthy after rollback"""
        # Wait for stabilization
        time.sleep(self.config['post_rollback_stabilization_seconds'])
        
        # Run comprehensive health checks
        return self.check_version(version)
    
    def _liveness_check(self, version: str) -> bool:
        """Check if pods are alive"""
        return True  # Stub
    
    def _readiness_check(self, version: str) -> bool:
        """Check if pods are ready to serve traffic"""
        return True  # Stub
    
    def _model_integrity_check(self, version: str) -> bool:
        """Verify model file integrity"""
        return True  # Stub

class StateMigrator:
    """Migrates state between model versions (for stateful models)"""
    
    def __init__(self, config: Dict):
        self.config = config
    
    def migrate(self, from_version: str, to_version: str):
        """Migrate state from one version to another"""
        logger.info(f"Migrating state: {from_version} -> {to_version}")
        
        # For stateless models, this is a no-op
        if not self.config.get('stateful', False):
            return
        
        # For stateful models (e.g., recommendation systems with user context),
        # migrate user session state, context embeddings, etc.
        # Implementation depends on state storage (Redis, database, etc.)
        pass

class RollbackError(Exception):
    """Raised when rollback fails"""
    pass
```

### Kubernetes Configuration for Blue-Green Deployment

```yaml
# Blue (Stable) Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: model-blue
  namespace: ml-production
  labels:
    app: ml-model
    version: blue
    model-version: v2.4
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-model
      version: blue
  template:
    metadata:
      labels:
        app: ml-model
        version: blue
        model-version: v2.4
    spec:
      containers:
      - name: model-server
        image: ml-model:v2.4
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 5
---
# Green (New) Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: model-green
  namespace: ml-production
  labels:
    app: ml-model
    version: green
    model-version: v2.5
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-model
      version: green
  template:
    metadata:
      labels:
        app: ml-model
        version: green
        model-version: v2.5
    spec:
      containers:
      - name: model-server
        image: ml-model:v2.5
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
---
# Service (routes to active version)
apiVersion: v1
kind: Service
metadata:
  name: ml-model-service
  namespace: ml-production
spec:
  selector:
    app: ml-model
    version: blue  # Switch to 'green' for rollout, back to 'blue' for rollback
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
---
# Istio VirtualService for Canary Deployment
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ml-model-canary
  namespace: ml-production
spec:
  hosts:
  - ml-model-service
  http:
  - match:
    - headers:
        canary:
          exact: "true"
    route:
    - destination:
        host: ml-model-service
        subset: canary
      weight: 10  # 10% canary traffic
    - destination:
        host: ml-model-service
        subset: stable
      weight: 90  # 90% stable traffic
  - route:
    - destination:
        host: ml-model-service
        subset: stable
      weight: 100
---
# Istio DestinationRule
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: ml-model-destination
  namespace: ml-production
spec:
  host: ml-model-service
  subsets:
  - name: stable
    labels:
      version: blue
  - name: canary
    labels:
      version: green
```

## Validation Strategy

### Testing Approach

1. **Rollback Simulation Testing (Monthly Drills)**:
   - Schedule monthly rollback drills in production
   - Inject synthetic performance degradation
   - Verify automatic rollback triggers within SLA (5 minutes)
   - Measure rollback success rate (target: 100%)
   - **Success Criteria**: Rollback completes within 5 minutes, zero data loss

2. **Canary Rollback Testing**:
   - Deploy intentionally degraded canary version
   - Verify automatic rollback after evaluation window
   - Measure canary detection accuracy
   - **Success Criteria**: 100% detection of degraded canaries

3. **Blue-Green Deployment Testing**:
   - Test atomic traffic switch (blue → green → blue)
   - Verify zero downtime during switch
   - Measure switch completion time (target: < 30 seconds)
   - **Success Criteria**: No request failures during switch

4. **State Migration Testing** (for stateful models):
   - Test session state preservation during rollback
   - Verify user context continuity
   - Measure state migration latency
   - **Success Criteria**: 100% state preservation, <5s migration time

5. **Multi-Region Rollback Testing**:
   - Simulate coordinated rollback across 3 regions
   - Verify regional coordination and timing
   - Test rollback propagation logic
   - **Success Criteria**: Coordinated rollback within 10 minutes

6. **Failed Rollback Recovery Testing**:
   - Simulate rollback failure scenarios
   - Verify emergency fallback activation
   - Test cache-only mode functionality
   - **Success Criteria**: Emergency fallback activates within 60 seconds

### Performance Metrics

| Metric | Target | Critical |
|--------|--------|----------|
| Rollback Trigger Latency | < 60s | < 120s |
| Rollback Completion Time | < 5 min | < 10 min |
| Rollback Success Rate | 100% | >= 98% |
| Zero Downtime During Rollback | Yes | N/A |
| Data Loss During Rollback | 0 | 0 |
| Canary Detection Accuracy | 100% | >= 95% |
| Post-Rollback Health Check Pass Rate | 100% | 100% |

## Evidence Requirements

### Required Documentation

- **Rollback Policy Document**: Defining rollback triggers, thresholds, and procedures
- **Deployment Strategy Documentation**: Blue-green, canary, rolling deployment procedures
- **Rollback Runbook**: Step-by-step manual rollback procedures
- **Health Check Definitions**: Liveness, readiness, and model integrity checks
- **State Migration Procedures**: For stateful models
- **Emergency Fallback Procedures**: Cache-only mode, degraded service handling
- **Rollback Drill Schedule**: Monthly chaos engineering schedule
- **Post-Incident Reviews**: Analysis of production rollbacks

### Evidence Collection

**Rollback Audit Logs** (Elasticsearch/Loki):
```json
{
  "rollback_id": "rollback-1702490123",
  "timestamp": "2025-12-13T14:35:23Z",
  "trigger": "performance_degradation",
  "from_version": "v2.5",
  "to_version": "v2.4",
  "reason": "Accuracy degraded by 7% (threshold: 5%)",
  "automatic": true,
  "initiated_by": null,
  "phases": [
    {
      "phase": "pre_rollback_health_check",
      "status": "passed",
      "duration_seconds": 5
    },
    {
      "phase": "drain_traffic",
      "status": "passed",
      "duration_seconds": 30,
      "drained_requests": 143
    },
    {
      "phase": "route_traffic",
      "status": "passed",
      "duration_seconds": 45
    },
    {
      "phase": "post_rollback_health_check",
      "status": "passed",
      "duration_seconds": 10
    }
  ],
  "total_duration_seconds": 90,
  "post_rollback_metrics": {
    "accuracy": 0.92,
    "error_rate": 0.02,
    "latency_p99": 145
  },
  "alerts_sent": [
    {
      "severity": "high",
      "recipients": ["ml-ops-team", "on-call-engineer"],
      "timestamp": "2025-12-13T14:35:25Z"
    }
  ]
}
```

**Monthly Rollback Drill Reports**:
- Drill date and scenario
- Rollback trigger simulation method
- Rollback completion time
- Issues identified during drill
- Remediation actions taken
- Rollback readiness score

**Real-time Rollback Metrics** (Prometheus):
```promql
# Rollback trigger rate
rate(rollback_triggered_total[1h])

# Rollback success rate
sum(rollback_completed_total) / sum(rollback_triggered_total)

# Average rollback duration
avg(rollback_duration_seconds)

# Time since last successful rollback drill
time() - max(rollback_drill_timestamp)
```

**Incident Reports for Production Rollbacks**:
- Root cause analysis (why rollback was needed)
- Timeline of events
- Impact analysis (affected users, requests)
- Lessons learned
- Preventative measures implemented

## Related Controls

### Within EN 18031

- **comp-en18031-028-model-serving-infrastructure**: Deployment infrastructure (prerequisite)
- **comp-en18031-029-ai-system-performance-monitoring**: Performance monitoring (triggers rollback)
- **comp-en18031-026-ai-system-monitoring**: Real-time monitoring and alerting
- comp-en18031-015-model-validation: Pre-deployment validation (prevents need for rollback)
- comp-en18031-030-security-monitoring: Security incident detection (triggers rollback)

### Cross-Framework

**ISO/IEC 42001:2023**:
- Clause 8.2: AI System Deployment and Maintenance (rollback is key maintenance capability)
- Clause 10.2: Nonconformity and Corrective Action (rollback as corrective action)

**ISO 9001:2015**:
- Clause 8.5.6: Control of Changes (rollback as change control)

**EU AI Act**:
- Article 15: Accuracy, Robustness, Cybersecurity (rollback ensures robustness)

**NIST AI RMF**:
- MANAGE 4.1: Response plans are in place (rollback as response plan)
- MANAGE 4.2: Negative feedback mechanisms (performance degradation triggers rollback)

**ITIL v4**:
- Change Enablement: Rollback as change management practice
- Service Design: Design for rollback capability

### AI-Specific Standards

- **MLOps Maturity Model**: Level 3+ requires automated rollback
- **Continuous Delivery for ML (CD4ML)**: Rollback is core CD practice

## Implementation Notes

### Best Practices

- **Version Everything**: Model artifacts, configurations, dependencies
- **Test Rollback Regularly**: Monthly drills in production (chaos engineering)
- **Automate Rollback Triggers**: Don't rely on manual detection
- **Zero Downtime**: Design rollback to avoid service interruption
- **Preserve State**: For stateful models, ensure user context preservation
- **Fast Detection**: Trigger rollback within 60 seconds of degradation
- **Fast Execution**: Complete rollback within 5 minutes
- **Clear Communication**: Alert all stakeholders immediately
- **Post-Rollback Analysis**: Always conduct root cause analysis
- **Emergency Fallback**: Have backup plan if rollback fails

### Common Pitfalls

- **No Rollback Testing**: Never testing rollback until production incident
- **Slow Detection**: Waiting too long to detect degradation (>10 minutes)
- **Manual Rollback Only**: Requiring manual intervention for all rollbacks
- **Losing Data**: Failing to preserve in-flight requests during rollback
- **Breaking State**: Corrupting user sessions during rollback
- **No Emergency Plan**: No fallback if rollback itself fails
- **Poor Monitoring**: Insufficient metrics to detect need for rollback
- **Version Conflicts**: Previous version no longer compatible with infrastructure
- **Forgotten Dependencies**: Rolling back model but not dependent services

### Rollback Decision Matrix

| Condition | Threshold | Action | Speed |
|-----------|-----------|--------|-------|
| Accuracy Degradation | > 5% drop | Auto Rollback | < 5 min |
| Error Rate Spike | > 2x baseline | Auto Rollback | < 5 min |
| Latency Increase | p99 > 2x SLA | Auto Rollback | < 5 min |
| Model Drift (KS test) | p-value < 0.05 for 15min | Auto Rollback | < 10 min |
| Safety Violations | > 5 in 1 hour | Auto Rollback | Immediate |
| Security Incident | Confirmed attack | Manual Rollback | < 2 min |
| Health Check Failure | 3 consecutive | Auto Rollback | Immediate |
| User Complaints | > 10 in 5 min | Manual Review | < 30 min |

## Status

- [ ] Rollback policy defined and approved
- [ ] Deployment strategies documented (blue-green, canary, rolling)
- [ ] Performance thresholds for rollback triggers defined
- [ ] Kubernetes deployment configurations created
- [ ] Istio traffic routing configurations created
- [ ] RollbackController implemented
- [ ] PerformanceComparator implemented with thresholds
- [ ] CanaryRollbackController implemented
- [ ] DeploymentManager (K8s integration) implemented
- [ ] HealthChecker implemented (liveness, readiness, integrity)
- [ ] StateMigrator implemented (for stateful models)
- [ ] Emergency fallback procedures implemented
- [ ] Real-time performance monitoring integrated
- [ ] Automatic rollback trigger logic implemented
- [ ] Rollback audit logging configured
- [ ] Alert manager integration complete
- [ ] Monthly rollback drill schedule established
- [ ] First rollback drill executed successfully
- [ ] Blue-green deployment tested (zero downtime)
- [ ] Canary deployment with automatic rollback tested
- [ ] State migration tested (for stateful models)
- [ ] Multi-region coordinated rollback tested
- [ ] Failed rollback recovery tested (emergency fallback)
- [ ] Rollback completion time meets SLA (< 5 min)
- [ ] Zero data loss during rollback verified
- [ ] Post-rollback health checks validated
- [ ] Rollback runbook documented and accessible
- [ ] Team training on rollback procedures complete
- [ ] Incident response integration complete
- [ ] Rollback metrics dashboard created
- [ ] Compliance evidence collected and archived

---

**Implementation Priority**: HIGH - Rollback capability is critical for safe AI deployments. Implement before deploying any production AI models.
