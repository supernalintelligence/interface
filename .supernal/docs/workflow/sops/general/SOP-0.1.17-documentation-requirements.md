---
type: sop
category: ai-technique
sop_id: SOP-0.1.17
title: Documentation Requirements & Templates
description: Central reference for all documentation requirements, templates, and REQUIRED vs. SUGGESTED markers
phase: null
group: C. Reference & Standards
part_number: 17
audience: [developers, ai-agents, architects, product-owners]
read_time: 15
created: 2025-11-23
updated: 2025-11-28
status: active
version: '1.1'
author: Supernal Coding Team
template_source: https://github.com/supernalintelligence/supernal-coding
project_name: '@supernal/interface'
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1]
prerequisites: []
tags: [documentation, templates, requirements, reference]
---

# Documentation Requirements & Templates

This document provides a central reference for all documentation requirements across Supernal Coding phases, including which documents are **REQUIRED** vs. **SUGGESTED** and links to available templates.

## Documentation Philosophy

**All documentation in Supernal Coding falls into one of four categories:**

1. **Templated** - Has a template with frontmatter validation (ADRs, security docs, requirements)
2. **Auto-Generated** - Created by tools (test reports, changelogs, API docs)
3. **Simple** - Straightforward docs that don't need templates (vision, problem statements)
4. **Optional** - Nice-to-have but not required (feature-specific planning docs)

**Every document is clearly marked as REQUIRED or SUGGESTED** in the phase sections below.

## Template Reference

All templates are located in `templates/docs/`:

### Architecture Templates

- **See ADR template in supernal-code-package** - Architecture Decision Records
- **See system template in supernal-code-package** - Solution Architecture Documents (SAD)
- **See template in supernal-code-package** - Component Design Documents (ADD)
- **See template in supernal-code-package** - Reusable architecture patterns

### Security & Compliance Templates

- **See template in supernal-code-package** - STRIDE analysis, attack trees
- **See template in supernal-code-package** - Quarterly risk evaluation
- **See template in supernal-code-package** - Requirement traceability

### Requirement Templates

- **See template in supernal-code-package** - Created via `sc requirement new` command

### SOP Templates

- **See template in supernal-code-package** - Standard Operating Procedures

## Documentation Requirements by Phase

### Phase 1: Discovery

**SUGGESTED**:

- Vision Document: `docs/planning/vision.md`
- Problem Statement: `docs/planning/problem-statement.md`
- Business Case: `docs/planning/business-case.md`
- Technology Assessment: `docs/planning/technology-assessment.md`

**Feature-Specific (SUGGESTED)**:

- `docs/features/\{domain\}/\{feature\}/strategy.md` (phase: backlog)
- `docs/features/\{domain\}/\{feature\}/problem.md` (phase: backlog)

### Phase 2: Research & Modeling

**REQUIRED**:

- Domain Model: `docs/architecture/system/domain-model.md` (See system template in supernal-code-package)

**SUGGESTED**:

- Context Map: `docs/architecture/system/context-map.md`
- Glossary: `docs/architecture/system/glossary.md`
- Epic Definition: `docs/planning/epics/epic-[name].md` (use `sc epic new`)

**Feature-Specific (SUGGESTED)**:

- `docs/features/\{domain\}/\{feature\}/strategy.md` (phase: drafting)
- `docs/features/\{domain\}/\{feature\}/domain-model.md` (phase: drafting)

### Phase 3: Design

**REQUIRED** (Compliance):

- Architecture Decisions: `docs/architecture/decisions/` (See ADR template in supernal-code-package)
- Threat Model: `docs/planning/security/threat-model.md` (See template in supernal-code-package)
- Risk Assessment: `docs/planning/security/risk-assessment.md` (See template in supernal-code-package)
- Compliance Matrix: `docs/planning/compliance/traceability-matrix.md` (See template in supernal-code-package)

**SUGGESTED**:

- Component Designs: `docs/architecture/components/` (See template in supernal-code-package)

**Feature-Specific (SUGGESTED)**:

- `docs/features/\{domain\}/\{feature\}/architecture.md` (phase: drafting)
- `docs/features/\{domain\}/\{feature\}/security.md` (phase: drafting)
- `docs/features/\{domain\}/\{feature\}/compliance.md` (phase: drafting)

### Phase 4: Planning

**SUGGESTED**:

- Epic Planning: `docs/planning/epics/epic-[name].md`
- Roadmap: `docs/planning/roadmap/`
- Kanban: `docs/planning/kanban/`

**Feature-Specific (SUGGESTED)**:

- `docs/features/\{domain\}/\{feature\}/plan.md` (phase: drafting)
- `docs/features/\{domain\}/\{feature\}/estimation.md` (phase: drafting)

### Phase 5: Requirements

**REQUIRED**:

- Requirements: `docs/requirements/[category]/req-[area]-[num]-[name].md`
  - Use `sc requirement new` to create with proper structure
  - Template enforced by CLI (See template in supernal-code-package)

**Feature-Specific (SUGGESTED)**:

- `docs/features/\{domain\}/\{feature\}/requirements.md` (phase: drafting)
- `docs/features/\{domain\}/\{feature\}/api-reference.md` (phase: drafting)

### Phase 6: Tests

**SUGGESTED**:

- Test Strategy: `docs/planning/testing/test-strategy.md`
- Test Coverage Report: `docs/planning/testing/coverage-report.md` (auto-generated)
- E2E Scenarios: `docs/planning/testing/e2e-scenarios.md`

**Feature-Specific (SUGGESTED)**:

- `docs/features/\{domain\}/\{feature\}/test-plan.md` (phase: implementing)
- `docs/features/\{domain\}/\{feature\}/test-results.md` (phase: implementing/testing)

### Phase 7: Build

**REQUIRED** (When applicable):

- Architecture Decisions: `docs/architecture/decisions/` (See ADR template in supernal-code-package)

**SUGGESTED**:

- Code Documentation: Inline comments, JSDoc/TypeDoc

**Feature-Specific (SUGGESTED)**:

- `docs/features/\{domain\}/\{feature\}/implementation.md` (phase: implementing)
- `docs/features/\{domain\}/\{feature\}/architecture.md` (phase: implementing)
- `docs/features/\{domain\}/\{feature\}/performance.md` (phase: implementing)

### Phase 8: Integration

**SUGGESTED**:

- Epic Status Updates: `docs/planning/epics/epic-[name].md`

**Feature-Specific (SUGGESTED)**:

- `docs/features/\{domain\}/\{feature\}/integration-results.md` (phase: testing)
- `docs/features/\{domain\}/\{feature\}/conflict-resolution.md` (phase: testing)

### Phase 9: Milestone Integration

**REQUIRED**:

- Changelog: `.changeset/` → Generated CHANGELOG.md (use `npm run changeset`)

**SUGGESTED**:

- Release Notes: `docs/planning/roadmap/release-notes-v[version].md`
- Milestone Status: `docs/planning/roadmap/milestone-[name].md`

**Feature-Specific (SUGGESTED)**:

- Update feature frontmatter: `phase: validating`

### Phase 10: Staging

**SUGGESTED**:

- Deployment Log: `docs/planning/reports/staging-deployment-v[version].md`
- Validation Results: `docs/planning/reports/staging-validation-v[version].md`
- Go/No-Go Decision: `docs/planning/decisions/go-nogo-v[version].md`

**Feature-Specific (SUGGESTED)**:

- Update feature frontmatter: `phase: complete`

### Phase 11: Production

**REQUIRED**:

- Deployment Report: `docs/planning/reports/production-deployment-v[version].md`

**SUGGESTED**:

- Release Notes: `docs/planning/roadmap/release-notes-v[version].md` (public-facing)
- Retrospective: `docs/planning/retrospectives/deployment-v[version].md`

### Phase 12: Operations

**SUGGESTED**:

- Operations Runbooks: `docs/operations/runbooks/`
- Post-Launch Metrics: Auto-generated from monitoring

## Small Changes

For minor updates (< 1 day):

- Document in commit messages (`REQ-XXX: Description`)
- Inline code comments
- No separate documentation files needed

## Auto-Generated Documentation

These are created by tools, not manually:

- Test coverage reports (Jest/Vitest)
- API documentation (TypeDoc)
- Changelog (changesets)
- TypeScript types (generated)

## Validation

All documentation with templates is validated via:

```bash
sc docs links
```

Templates use frontmatter for:

- Naming pattern enforcement
- Required field validation
- Cross-reference checking
- Consistency validation

## Getting Help

```bash
# List available templates
ls -la templates/docs/**/*.template.md

# View template
cat templates/docs/architecture/decision.template.md

# Create from template (where applicable)
sc requirement new "Feature Name"  # Uses requirement template
# For others, copy template and fill in
```

---

**Maintained By**: Supernal Coding Core Team  
**Last Updated**: 2025-11-23  
**Review Cycle**: Update when adding new templates or changing requirements
