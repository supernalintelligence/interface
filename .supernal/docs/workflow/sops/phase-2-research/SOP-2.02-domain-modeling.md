---
type: sop
category: phase-workflow
sop_id: SOP-2.02
title: Domain Modeling
phase: 2
group: null
part_number: null
audience: [architects, developers, domain-experts]
read_time: 35
created: 2025-11-23
updated: 2025-11-28
status: needs_approval
version: '1.0'
author: Supernal Coding Team
template_source: https://github.com/supernalintelligence/supernal-coding
template_version: 'main@130c177'
project_name: '@supernal/interface'
reviewedBy: []
reviewDates: []
related_sops: [SOP-0, SOP-2.01, SOP-3.03]
prerequisites: [SOP-2.01]
tags: [domain-modeling, architecture, entities, phase-2]
---

# Domain Modeling

## Purpose

Create a shared understanding of the problem domain through conceptual models of key entities, relationships, and business rules.

## Scope

- Domain entity identification
- Relationship mapping
- Business rules documentation
- Ubiquitous language definition
- Bounded context identification

## Prerequisites

- [ ] User stories collected (SOP-2.01)
- [ ] Research findings documented (SOP-2.01)
- [ ] Stakeholders identified

## Process Overview

### Step 1: Identify Core Entities

**Discover Key Concepts**:

- Extract nouns from user stories
- Identify data that needs persistence
- Map business-critical objects

**AI Assistance**:

- Analyze requirements to suggest entities
- Generate initial entity diagrams
- Propose entity relationships

### Step 2: Define Relationships

- One-to-one
- One-to-many
- Many-to-many
- Hierarchical
- Temporal

### Step 3: Capture Business Rules

Document rules that govern:

- Data validation
- State transitions
- Calculations
- Constraints
- Permissions

### Step 4: Establish Ubiquitous Language

Create shared vocabulary:

- Define key terms
- Document domain concepts
- Align technical and business terminology
- Build glossary

### Step 5: Identify Bounded Contexts

Determine:

- System boundaries
- Integration points
- Shared vs. separate models
- Context mapping

## Outputs

- **Domain Model Diagram**: Visual representation of entities and relationships
- **Entity Definitions**: Detailed specifications for each entity
- **Business Rules**: Documented constraints and logic
- **Glossary**: Ubiquitous language dictionary
- **Context Map**: Bounded contexts and their relationships

## Quality Gates

- [ ] All key entities identified
- [ ] Relationships clearly defined
- [ ] Business rules captured
- [ ] Glossary complete
- [ ] Stakeholders aligned on model

## Expected Documentation

### Architecture/Planning (Broad-scale)

- **Domain Model**: `docs/architecture/system/domain-model.md` - Complete system domain model
- **Context Map**: `docs/architecture/system/context-map.md` - Bounded contexts
- **Glossary**: `docs/architecture/system/glossary.md` - Ubiquitous language

### Feature-Specific

- **Feature Folder**: `docs/features/\{domain\}/{feature-name}/` (phase: drafting)
  - `domain-model.md` - Feature-specific entities and relationships
  - `business-rules.md` - Feature-specific constraints and logic
  - `data-model.md` - Database schema for feature

### Small Changes

- Update existing domain model documents
- Add entity definitions to relevant architecture docs

## Related SOPs

- **References**: [SOP-0.1.06: Design & Architecture](../general/SOP-0.1.06-design-architecture.md)

## AI Techniques

See general SOPs for AI assistance:

- [Design & Architecture](../general/SOP-0.1.06-design-architecture.md)
- [Requirements & Planning](../general/SOP-0.1.05-requirements-planning.md)
