---
type: sop
category: phase-workflow
sop_id: SOP-2.01
title: Research & User Stories
phase: 2
group: null
part_number: null
audience: [product-owners, architects, business]
read_time: 40
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
related_sops: [SOP-0, SOP-1.02, SOP-2.02]
prerequisites: [SOP-1.01, SOP-1.02]
tags: [research, user-stories, phase-2, discovery]
---

# Research & User Stories

## Purpose

Transform validated business problems into detailed user stories and research findings that guide technical solution design.

## Scope

- User story collection and refinement
- Market research and competitive analysis
- User journey mapping
- Success criteria definition
- Story prioritization

## Prerequisites

- [ ] Business vision defined (SOP-1.01)
- [ ] Problem validated (SOP-1.01)
- [ ] Solution landscape analyzed (SOP-1.02)

## Process Overview

This phase bridges business discovery (Phase 1) and technical design (Phase 3).

### Step 1: Collect User Stories

**AI Assistance**:

- Generate initial user story drafts from business requirements
- Suggest acceptance criteria
- Identify edge cases

**Human Role**:

- Validate stories with stakeholders
- Refine based on user feedback
- Prioritize based on business value

### Step 2: Conduct Research

- **Market Research**: Competitor features, pricing models, user expectations
- **Technical Research**: Available technologies, integration requirements
- **User Research**: Interviews, surveys, usage patterns

### Step 3: Map User Journeys

Create detailed user journey maps showing:

- Entry points
- User goals
- Steps and interactions
- Pain points
- Success criteria

### Step 4: Define Success Metrics

Establish measurable criteria for:

- Feature adoption
- User satisfaction
- Business impact
- Technical performance

## Outputs

- **User Stories**: Structured in "As a [user], I want [goal], so that [benefit]" format
- **Acceptance Criteria**: Clear, testable conditions for each story
- **Journey Maps**: Visual representation of user flows
- **Research Findings**: Documented insights and recommendations
- **Prioritized Backlog**: Stories ranked by value and effort

## Expected Documentation

### Architecture/Planning (Broad-scale)

- **Epic Definition**: `docs/planning/epics/epic-[name].md` - Multi-feature initiatives
- **Roadmap Updates**: `docs/planning/roadmap/` - Strategic planning documents

### Feature-Specific

- **Feature Folder**: `docs/features/\{domain\}/{feature-name}/` (phase: drafting)
  - `strategy.md` - Business case, market research, competitive analysis
  - `user-stories.md` - Collected user stories with acceptance criteria
  - `journey-maps/` - User journey visualizations
  - `research-findings.md` - Interview notes, survey results, insights

### Small Changes

- Document user stories directly in requirement files: `docs/requirements/[category]/`
- Quick research notes can go in commit messages (tagged with `[FEATURE:name]` if applicable)

## Related SOPs

- **References**: [SOP-0.1.05: Requirements & Planning](../general/SOP-0.1.05-requirements-planning.md)

## AI Techniques

See general SOPs for AI assistance patterns:

- [Foundation](../general/SOP-0.1.01-foundation.md)
- [Prompting Patterns](../general/SOP-0.1.03-prompting-patterns.md)
- [Requirements & Planning](../general/SOP-0.1.05-requirements-planning.md)
