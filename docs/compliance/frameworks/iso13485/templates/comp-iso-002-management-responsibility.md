---
id: comp-iso-002-management-responsibility
title: COMP-ISO-002 - Management Responsibility
sidebar_label: COMP-ISO-002 Management
sidebar_position: 2
status: pending-verification
references: []
---

# COMP-ISO-002: Management Responsibility

## Overview

**Purpose**: Quality policy and management commitment  
**ISO Clause**: 5.1 Management Commitment  
**Category**: core, management  
**Priority**: High  
**Framework**: ISO 13485

## Description

Defines management's commitment to quality, including resource allocation, quality policy communication, and management review processes.

## Acceptance Criteria

```gherkin
Feature: Management Responsibility Compliance Validation
  As a compliance auditor
  I want to validate management commitment to quality
  So that I can verify ISO 13485 management responsibility requirements

  Background:
    Given the organization has implemented a QMS
    And management responsibility processes are established
    And a management audit is being conducted

  Scenario: Quality Policy Audit
    Given a quality policy review is conducted
    When the quality policy document is examined
    And policy communication records are reviewed
    And policy understanding is assessed
    Then the quality policy shall be documented and approved by top management
    And policy communication to all personnel shall be evidenced
    And policy understanding shall be demonstrable through records

  Scenario: Management Commitment Audit
    Given management commitment processes exist
    When resource allocation decisions are reviewed
    And management participation records are examined
    And quality objective setting is audited
    Then management commitment shall be evidenced through resource provision
    And management participation in QMS activities shall be documented
    And quality objectives shall be established and communicated

  Scenario: Management Review Audit
    Given management review processes are operational
    When management review meeting records are examined
    And review input data is verified
    And review output decisions are tracked
    Then management reviews shall be conducted at planned intervals
    And review inputs shall include all required information
    And review outputs shall include decisions and actions for improvement
```

## Technical Context

### Implementation Requirements

- **Quality Policy**: Top management commitment to quality and regulatory compliance
- **Management Commitment**: Demonstrated commitment through resource allocation and participation
- **Quality Objectives**: Measurable objectives aligned with quality policy
- **Management Review**: Systematic review of QMS effectiveness and performance
- **Resource Allocation**: Adequate resources for QMS implementation and maintenance
- **Communication**: Effective communication of quality policy and objectives

### Validation Strategy

1. **Policy Review**: Verify quality policy content, approval, and communication
2. **Commitment Assessment**: Evaluate management commitment through actions and decisions
3. **Objective Evaluation**: Assess quality objectives for measurability and alignment
4. **Review Process Audit**: Examine management review process and outcomes
5. **Resource Assessment**: Verify adequate resource allocation for quality activities

## Compliance Evidence

### Required Documentation

- Quality Policy signed by top management
- Management commitment statements and evidence
- Quality objectives and measurement plans
- Management review meeting records and decisions
- Resource allocation documentation
- Communication records for policy and objectives

### Audit Trail

- Quality policy approval and revision history
- Management review meeting minutes and action items
- Quality objective setting and review records
- Resource allocation decisions and justifications
- Training records for management personnel

## Related Requirements

- REQ-ISO-001: Quality Management System
- REQ-ISO-003: Resource Management
- REQ-ISO-008: Management Review Process

_Note: Individual requirement template files are generated when using `sc init --framework=iso13485`_

## Usage Examples

### CLI Commands

```bash
# Generate this requirement
sc req new --template=REQ-ISO-002 --title="Management Responsibility"

# Validate implementation
sc req validate REQ-ISO-002 --framework=iso13485

# Generate management review templates
sc docs generate --type=management-review --requirement=REQ-ISO-002
```
