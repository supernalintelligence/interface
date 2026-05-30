---
type: sop
category: phase-workflow
sop_id: SOP-4.01
title: Feature Breakdown & Estimation
phase: 4
group: null
part_number: null
audience: [developers, architects, product-owners]
read_time: 30
created: 2025-11-23
updated: 2025-11-28
status: needs_approval
version: '1.0'
author: Supernal Coding Team
template_source: https://github.com/supernalintelligence/supernal-coding
template_version: 'main@920d12c'
project_name: 'supernal-coding'
reviewedBy: []
reviewDates: []
related_sops: [SOP-0, SOP-3.04, SOP-5.01]
prerequisites: [SOP-3.03, SOP-3.04]
tags: [planning, estimation, breakdown, phase-4]
---

# Feature Breakdown & Estimation

## Purpose

Decompose high-level features into implementable tasks with effort estimates and dependencies.

## Scope

- Feature decomposition into tasks/subtasks
- Effort estimation
- Dependency mapping
- Sprint/iteration planning
- Resource allocation

## Prerequisites

- [ ] Architecture design complete (Phase 3)
- [ ] Compliance requirements defined (SOP-3.03)
- [ ] Security analysis complete (SOP-3.04)

## Process Overview

### Step 1: Break Down Features

Decompose each feature into:

- **Epics**: Large bodies of work (weeks/months)
- **Stories**: Deliverable units (days/week)
- **Tasks**: Implementation steps (hours/days)
- **Subtasks**: Granular work items (hours)

**AI Assistance**:

- Analyze feature descriptions to suggest breakdown
- Identify common patterns from similar projects
- Generate task hierarchies

### Step 2: Estimate Effort

Methods:

- **Story points**: Relative sizing
- **Time-based**: Hours/days estimates
- **T-shirt sizing**: S/M/L/XL
- **Three-point**: Best/likely/worst case

### Step 3: Identify Dependencies

Map:

- Technical dependencies (API before UI)
- Team dependencies (shared resources)
- External dependencies (third-party APIs)
- Sequential vs. parallel work

### Step 4: Plan Iterations

- Group related tasks
- Balance team capacity
- Account for risks
- Build in buffers
- Define milestones

## Outputs

- **Task Breakdown**: Hierarchical structure of work items
- **Effort Estimates**: Sizing for each task
- **Dependency Graph**: Visual/documented dependencies
- **Iteration Plan**: Sprint/cycle assignments
- **Risk Assessment**: Identified risks and mitigations

## Quality Gates

- [ ] All features decomposed
- [ ] Dependencies identified
- [ ] Estimates reviewed by team
- [ ] Iteration plan realistic
- [ ] Risks documented

## Expected Documentation

### Architecture/Planning (Broad-scale)

- **Epic Planning**: `docs/planning/epics/epic-[name].md` - Epic-level breakdown and estimates
- **Roadmap**: `docs/planning/roadmap/` - Timeline and milestone planning
- **Kanban**: `docs/planning/kanban/` - Sprint/iteration planning

### Feature-Specific

- **Feature Folder**: `docs/features/\{domain\}/{feature-name}/` (phase: drafting)
  - `plan.md` - Detailed task breakdown, effort estimates, dependencies
  - `estimation.md` - Sizing methodology and estimates
  - `risks.md` - Risk assessment and mitigation strategies

### Small Changes

- Task breakdown in issue tracker or requirement file comments
- Quick estimates in commit messages or requirement frontmatter

## Related SOPs

- **References**: [SOP-0.1.05: Requirements & Planning](../general/SOP-0.1.05-requirements-planning.md)

## AI Techniques

See general SOPs:

- [Requirements & Planning](../general/SOP-0.1.05-requirements-planning.md)
- [Decision Tracking](../general/SOP-0.1.11-decision-tracking.md)
