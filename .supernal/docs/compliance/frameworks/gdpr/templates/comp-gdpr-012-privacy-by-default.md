---
id: comp-gdpr-012-privacy-by-default
title: COMP-GDPR-012 - Privacy by Default
sidebar_label: COMP-GDPR-012 Privacy by Default
sidebar_position: 12
status: pending-verification
references: []
---

# COMP-GDPR-012: Privacy by Default

## Overview

**Purpose**: Privacy by default implementation  
**GDPR Article**: Article 25 - Data protection by design and by default  
**Category**: privacy-engineering, defaults  
**Priority**: High  
**Framework**: GDPR

## Description

Ensures that by default, only personal data necessary for each specific purpose of processing are processed, covering amount of data collected, extent of processing, period of storage, and accessibility.

## Acceptance Criteria

```gherkin
Feature: Privacy by Default
  As a system user
  I want privacy-protective defaults
  So that my personal data is protected without requiring action from me

  Background:
    Given privacy by default settings are implemented
    And user interfaces respect privacy defaults
    And system configurations prioritize privacy

  Scenario: New User Registration
    Given a new user registers for the system
    When the registration process completes
    Then minimal necessary data should be collected by default
    And privacy-protective settings should be pre-selected
    And marketing communications should be opt-in only

  Scenario: Feature Configuration
    Given a system feature processes personal data
    When users access the feature
    Then most restrictive privacy settings should be default
    And users should be able to adjust settings granularly
    And changes should require explicit user action
```

## Technical Context

### Default Privacy Configuration

```typescript
interface PrivacyDefaults {
  dataCollection: {
    essential: boolean; // Always true for essential data
    analytics: boolean; // Default false
    marketing: boolean; // Default false
    profiling: boolean; // Default false
  };
  dataSharing: {
    internalProcessing: boolean; // Default true for essential functions
    thirdPartySharing: boolean; // Default false
    crossBorderTransfer: boolean; // Default false
  };
  retention: {
    useShortestPeriod: boolean; // Default true
    automaticDeletion: boolean; // Default true
    userControlledRetention: boolean; // Default true
  };
  visibility: {
    publicProfile: boolean; // Default false
    searchableProfile: boolean; // Default false
    dataDownload: boolean; // Default true (user access)
  };
}

class PrivacyDefaultsEngine {
  async applyPrivacyDefaults(
    userId: string,
    context: ProcessingContext
  ): Promise<PrivacySettings> {
    const defaults = await this.getPrivacyDefaults(context);

    return {
      userId,
      context: context.name,
      settings: {
        dataMinimization: defaults.dataCollection.essential
          ? 'essential_only'
          : 'none',
        consentRequired: this.determineConsentRequirements(defaults),
        retentionPeriod: defaults.retention.useShortestPeriod
          ? 'minimal'
          : 'standard',
        sharingPermissions: defaults.dataSharing.thirdPartySharing
          ? []
          : ['none'],
        visibilityLevel: defaults.visibility.publicProfile
          ? 'public'
          : 'private',
      },
      appliedDate: new Date(),
      userModified: false,
    };
  }

  async validatePrivacyDefaults(): Promise<ValidationResult> {
    const systems = await this.getAllSystems();
    const violations = [];

    for (const system of systems) {
      const defaults = await this.getSystemDefaults(system);
      if (!this.areDefaultsPrivacyProtective(defaults)) {
        violations.push({
          system: system.name,
          issue: 'Non-privacy-protective defaults detected',
          recommendation:
            'Update default settings to be more privacy-protective',
        });
      }
    }

    return {
      compliant: violations.length === 0,
      violations,
      recommendations: this.generateRecommendations(violations),
    };
  }
}
```

## Definition of Done

- [ ] Privacy by default policy documented and approved
- [ ] Default privacy settings implemented across all systems
- [ ] User interface defaults configured for privacy protection
- [ ] Automated privacy defaults validation implemented
- [ ] User control mechanisms for adjusting defaults deployed
- [ ] Privacy defaults monitoring and reporting implemented
- [ ] Staff training completed on privacy by default principles
- [ ] Compliance validation performed and documented

---

_This requirement supports GDPR Article 25 compliance for data protection by design and by default._
