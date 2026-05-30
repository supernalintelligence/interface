---
type: sop
category: documentation
sop_id: SOP-0.1.18
title: Feature Documentation Structure & Organization
description: Decision tree and guidelines for organizing feature-specific vs cross-cutting documentation
phase: null
group: C. Reference & Standards
part_number: 18
audience: [developers, ai-agents, architects, product-owners]
read_time: 12
created: 2025-12-02
updated: 2025-12-02
status: active
version: '1.0'
author: Supernal Coding Team
template_source: https://github.com/supernalintelligence/supernal-coding
project_name: '@supernal/interface'
reviewedBy: []
reviewDates: []
related_sops: [SOP-0.1.05, SOP-0.1.17]
prerequisites: [SOP-0.1.05]
tags: [documentation, features, organization, structure, decision-tree]
---

# SOP-0.1.18: Feature Documentation Structure & Organization

**Version**: 1.0  
**Created**: 2025-12-02  
**Status**: Active

---

## Purpose

Define the organizational structure for feature documentation and provide a clear decision tree for determining when to co-locate artifacts within features vs. centralizing them at the system level.

---

## Core Principle: Self-Contained Features

**Each feature should be self-contained with all its artifacts in one place, UNLESS the artifact affects multiple features (cross-cutting concerns).**

---

## Decision Tree

### Is This Cross-Cutting or Feature-Specific?

```
Does this artifact affect >1 feature/domain?
├─ YES → CENTRALIZED (Cross-Cutting)
│   ├─ System-wide requirement → docs/requirements/{category}/
│   ├─ System architecture → docs/architecture/system/
│   ├─ System ADR → docs/architecture/decisions/
│   ├─ Cross-domain user story → docs/research/{persona}/
│   └─ Compliance control → docs/compliance/frameworks/
│
└─ NO → CO-LOCATED (Feature-Specific)
    ├─ Feature requirement → docs/features/{domain}/{feature}/requirements/
    ├─ User stories → docs/features/{domain}/{feature}/research/user-stories.md
    ├─ Feature ADR → docs/features/{domain}/{feature}/design/adr-*.md
    ├─ Domain model → docs/features/{domain}/{feature}/design/domain-model.md
    └─ Test plan → docs/features/{domain}/{feature}/tests/test-plan.md
```

### Quick Test

Ask: **"If I deleted this feature entirely, would any OTHER feature break or need this artifact?"**

- **YES** → Cross-cutting (centralize)
- **NO** → Feature-specific (co-locate)

---

## Feature Directory Structure

### Self-Contained Feature Layout

```
docs/features/{domain}/{feature-name}/
├── README.md                           # Overview, status, links to implementation
│
├── research/                           # User research & analysis
│   ├── user-stories.md                 # Feature-specific user stories
│   ├── YYYY-MM-DD-user-interviews.md   # Research findings (dated)
│   └── YYYY-MM-DD-*.md                 # Other research docs (dated)
│
├── planning/                           # Planning documents
│   ├── YYYY-MM-DD-implementation-plan.md
│   └── YYYY-MM-DD-*.md                 # Other planning docs (dated)
│
├── design/                             # Design decisions & architecture
│   ├── YYYY-MM-DD-architecture.md      # Design docs (dated)
│   ├── adr-NNN-decision-name.md        # Feature-specific ADRs
│   ├── domain-model.md                 # Feature entities/components
│   └── api-contracts.md                # Interfaces/types (contract-first)
│
├── requirements/                       # Gherkin specifications
│   ├── req-NNN-feature-capability.md   # Gherkin format
│   └── req-NNN-*.md                    # All feature requirements here
│
├── tests/                              # Test files or references
│   ├── unit.test.js → ../../../../tests/feature/unit.test.js (symlink)
│   ├── integration.test.js → (symlink)
│   └── test-plan.md                    # Test strategy for feature
│
└── implementation/                     # Implementation notes
    └── YYYY-MM-DD-*.md                 # Implementation docs (dated)
```

### Directory Guidelines

#### `research/`
- **Purpose**: User research specific to this feature
- **User Stories**: Only if NOT shared by multiple features
- **Research Docs**: Must be dated (YYYY-MM-DD-description.md)
- **Cross-Reference**: Link to centralized user stories if applicable

#### `planning/`
- **Purpose**: Feature-specific planning
- **Sprint Plans**: If feature is large enough for its own sprint
- **Implementation Plans**: Dated documents
- **Epic Links**: Reference to parent epic in `docs/planning/epics/`

#### `design/`
- **Purpose**: Feature-specific design decisions
- **ADRs**: Decisions that ONLY affect this feature
- **Contracts**: API/interface definitions (TypeScript types, OpenAPI specs)
- **Domain Model**: Entities/components specific to this feature
- **When to Centralize**: If ADR affects system architecture → `docs/architecture/decisions/`

#### `requirements/`
- **Purpose**: Gherkin specifications for this feature
- **Format**: Standard Gherkin (Feature/Scenario/Given-When-Then)
- **Naming**: `req-NNN-capability-name.md`
- **Cross-Cutting**: If requirement affects multiple features → `docs/requirements/{category}/`

#### `tests/`
- **Purpose**: Test plans and references to test code
- **Symlinks**: Link to actual test files in `tests/{component}/`
- **Test Plans**: Feature-specific test strategy
- **Coverage Reports**: Can be co-located or referenced

#### `implementation/`
- **Purpose**: Implementation notes and decisions made during build
- **Dated Docs**: YYYY-MM-DD-description.md
- **Refactoring Notes**: Why implementation diverged from design
- **Performance Notes**: Optimization decisions made

---

## Cross-Cutting (Centralized) Documentation

### When to Centralize

Centralize artifacts that are:
- **Shared by multiple features** (e.g., authentication affects login, admin, API)
- **System-wide concerns** (e.g., database architecture, deployment)
- **Compliance requirements** (e.g., HIPAA controls span multiple features)
- **Infrastructure** (e.g., CI/CD, monitoring, logging)

### Centralized Locations

```
docs/requirements/{category}/
├── core/                       # Core system requirements
├── infrastructure/             # Infrastructure requirements
├── compliance/                 # Compliance/regulatory
└── stories/                    # Cross-cutting user stories
    ├── developer/              # Developer user stories
    ├── admin/                  # Admin user stories
    └── end-user/               # End-user stories

docs/architecture/
├── decisions/                  # System-wide ADRs
├── system/                     # System architecture
│   ├── domain-model.md         # System-wide domain model
│   ├── context-map.md          # Bounded contexts
│   └── component-diagram.md    # System components
└── components/                 # Shared/reusable components
```

---

## Architecture vs Features: Current State vs Plans

### `docs/architecture/` = WHAT IS (Current State)

**Documents reality** - What's built, deployed, and tested:

```
docs/architecture/
├── decisions/                   # ADRs - Why we made choices
│   └── adr-042-*.md            # System-wide architectural decisions
│
├── system/                      # Current system architecture
│   ├── domain-model.md         # Entities that EXIST
│   ├── context-map.md          # Current bounded contexts
│   └── component-diagram.md    # What's deployed
│
└── components/                  # Built components
    └── REQUIREMENT_GIT_INTEGRATION.md  # Describes existing integration
```

**Characteristics**:
- ✅ Tested and working
- ✅ Deployed (or deployable)
- ✅ Describes current state
- ✅ Historical record

### `docs/features/` = WHAT WE WANT (Plans + In-Progress)

**Documents future work** - What's planned or being built:

```
docs/features/{domain}/{feature}/
├── design/                      # What we plan to build
│   ├── 2025-12-05-architecture.md
│   └── adr-001-*.md            # Feature-specific decision
├── requirements/                # Specifications (Gherkin)
└── tests/                       # Test plans/links
```

**Characteristics**:
- 🔄 Status: planning, implementing, testing, or complete
- 🔄 May change during implementation
- 🔄 Describes desired state
- ✅ Once complete → May promote to `docs/architecture/` if system-wide

---

## Research Distillation Flow

### High-Level Analysis → Feature → Implementation

```
1. High-Level Research & Analysis
   docs/research_and_analysis/analysis/
   └── YYYY-MM-DD-gap-analysis-looporadata.md
       # Identifies system-wide issues
       # Broad recommendations
       ↓

2. Epic Creation (Initiative)
   docs/planning/epics/
   └── epic-010-looporadata-gap-remediation.md
       # Groups related features
       # Defines deliverables
       ↓

3. Feature Research (Detailed)
   docs/features/workflow-management/daily-checkpoints/
   └── research/
       ├── user-stories.md
       │   # As a team lead, I want daily standup integration...
       │   # As a developer, I want checkpoint reminders...
       ├── YYYY-MM-DD-user-interview-findings.md
       └── YYYY-MM-DD-competitive-analysis.md
       ↓

4. Feature Design & Requirements
   docs/features/workflow-management/daily-checkpoints/
   ├── design/
   │   └── YYYY-MM-DD-architecture.md
   └── requirements/
       └── req-101-checkpoint-creation.md
       ↓

5. Implementation
   tests/workflow/daily-checkpoints.test.js
   src/workflow/DailyCheckpoints.ts
   ↓

6. Architecture Update (Once Complete)
   docs/architecture/components/daily-checkpoints.md
   docs/architecture/decisions/adr-042-checkpoint-storage.md
```

**Key Points**:
- **Distillation**: High-level research → Detailed feature research
- **Separation**: Plans (features/) vs Reality (architecture/)
- **Promotion**: Feature designs MAY become system architecture when complete

---

## Examples

### Example 1: Feature-Specific (WIP Registry)

```
docs/features/workflow-management/wip-registry/
├── README.md
│
├── research/
│   └── user-stories.md
│       # As a developer, I want to track WIP files...
│       # Only affects WIP registry feature
│
├── design/
│   ├── 2025-11-29-wip-registry-architecture.md
│   ├── adr-001-yaml-vs-json-storage.md      # Feature-specific ADR
│   └── domain-model.md
│       # Entities: WipEntry, WipRegistry (only used here)
│
├── requirements/
│   ├── req-004-wip-tracking.md              # Gherkin
│   └── req-005-auto-cleanup.md              # Gherkin
│
└── tests/
    ├── wip-manager.test.js → ../../../../tests/wip/wip-manager.test.js
    └── test-plan.md
```

**Why Co-Located**:
- ✅ Only used by WIP registry feature
- ✅ Deleting this feature wouldn't affect others
- ✅ Self-contained functionality

### Example 2: Cross-Cutting (Traceability Matrix)

```
# Centralized requirement
docs/requirements/infra/
└── req-infra-070-traceability-matrix.md

# Links to multiple features
docs/features/workflow-management/
├── wip-registry/                # Uses traceability
├── feature-based-commits/       # Uses traceability
└── test-traceability/           # Uses traceability
```

**Why Centralized**:
- ❌ Used by multiple features (WIP, commits, tests)
- ❌ Spans multiple domains
- ❌ System-wide infrastructure concern

### Example 3: Hybrid (User Authentication)

```
# Feature-specific
docs/features/auth-system/user-login/
├── requirements/
│   ├── req-042-login-endpoint.md            # Feature-specific
│   └── req-043-jwt-validation.md
└── design/
    └── adr-001-jwt-vs-session.md            # Feature-specific ADR

# Cross-cutting compliance requirement (centralized)
docs/requirements/comp/
└── comp-hipaa-044-unique-user-identification.md
    # Affects: user-login, admin-auth, api-auth, audit-logs
    # System-wide compliance concern
```

**Why Hybrid**:
- ✅ Login implementation is feature-specific
- ❌ HIPAA user identification affects multiple auth features
- ✅ Separates implementation details from compliance

---

## Where Do Gherkin Specs Go?

### Feature-Specific Gherkin

```
docs/features/workflow-management/wip-registry/
└── requirements/
    └── req-004-wip-tracking.md
```

```gherkin
Feature: WIP File Tracking
  As a developer
  I want to register WIP files
  So that pre-commit hooks don't block my commits

  Scenario: Register WIP file
    Given I have uncommitted file src/auth.ts
    When I run "sc wip register src/auth.ts --feature=auth"
    Then file should be registered in WIP registry
    And pre-commit hook should not block commit
```

### Cross-Cutting Gherkin

```
docs/requirements/infra/
└── req-infra-070-traceability-matrix.md
```

```gherkin
Feature: Traceability Matrix
  As a compliance officer
  I want automatic requirement-to-test tracing
  So that I can prove compliance coverage

  Scenario: Link requirement to tests
    Given requirement REQ-042 exists
    When I run "sc traceability generate"
    Then requirement should link to test files
    And compliance frameworks should be mapped
```

---

## Test Organization

### Actual Test Files (In tests/)

```
tests/
├── wip/                         # Implementation tests
│   └── wip-manager.test.js
├── traceability/
│   └── traceability.test.js
└── dashboard/
    └── traceability-view.test.js
```

**Test Code**: Always in `tests/` directory

### Test References (In Features)

```
docs/features/workflow-management/wip-registry/
└── tests/
    ├── wip-manager.test.js → ../../../../tests/wip/wip-manager.test.js
    └── test-plan.md
        # Points to actual test files
        # Describes test strategy
        # Links requirements to tests
```

**Symlinks**: Point from feature docs to actual test code  
**Test Plans**: Document testing strategy for the feature

---

## Simplified Rules

### Rule 1: Co-Locate Feature-Specific Artifacts

**If it's ONLY for one feature**, put it in the feature directory:

- ✅ User stories → `{feature}/research/user-stories.md`
- ✅ Requirements → `{feature}/requirements/req-*.md`
- ✅ Design → `{feature}/design/YYYY-MM-DD-*.md`
- ✅ Feature ADRs → `{feature}/design/adr-*.md`
- ✅ Domain model → `{feature}/design/domain-model.md`
- ✅ Test plans → `{feature}/tests/test-plan.md`

### Rule 2: Centralize Cross-Cutting Artifacts

**If it affects MULTIPLE features**, centralize it:

- ✅ System requirements → `docs/requirements/{category}/`
- ✅ System ADRs → `docs/architecture/decisions/`
- ✅ System domain model → `docs/architecture/system/domain-model.md`
- ✅ Compliance controls → `docs/compliance/frameworks/`
- ✅ Cross-domain user stories → `docs/research/{persona}/`

### Rule 3: Actual Tests Stay in tests/

- ✅ Test code → `tests/{component}/`
- ✅ Test references → `docs/features/{domain}/{feature}/tests/` (symlinks or docs)

### Rule 4: Architecture = Reality, Features = Plans

- ✅ `docs/architecture/` = What's built (done & tested)
- ✅ `docs/features/` = What's planned/in-progress
- ✅ When feature complete → Update `docs/architecture/` if system-wide

### Rule 5: Date All Research & Planning Docs

- ✅ Format: `YYYY-MM-DD-description.md`
- ✅ Applies to: research/, planning/, design/, implementation/
- ✅ Not dated: README.md, domain-model.md, api-contracts.md (living docs)

---

## CLI Tool Updates

### `sc requirement` Command

**Current Behavior**:
- Creates requirements in `docs/requirements/{category}/`

**Needed Update**:
```bash
# Centralized (cross-cutting) - CURRENT
sc requirement new "Traceability Matrix" \
  --category=infrastructure \
  --priority=high

# Feature-specific (NEW)
sc requirement new "WIP Tracking" \
  --feature=workflow-management/wip-registry \
  --priority=high
```

**Implementation**:
- Add `--feature` flag to `sc requirement new`
- If `--feature` provided → Create in `docs/features/{domain}/{feature}/requirements/`
- If `--category` provided → Create in `docs/requirements/{category}/`
- Validate feature directory exists

---

## Migration Path

### Current State
- ✅ Some features have co-located requirements
- ✅ Most requirements centralized in `docs/requirements/`
- ❌ Inconsistent: Not clear which to use when

### Migration Steps

1. **Audit Requirements**
   ```bash
   # Find all requirements
   find docs/requirements -name "req-*.md"
   
   # Identify feature-specific ones
   # Ask: "Does this affect >1 feature?"
   ```

2. **Move Feature-Specific Requirements**
   ```bash
   # For each feature-specific requirement
   git mv docs/requirements/{category}/req-NNN-*.md \
          docs/features/{domain}/{feature}/requirements/
   ```

3. **Update Links**
   ```bash
   # Update cross-references
   sc docs validate --fix-refs
   ```

4. **Update CLI**
   - Add `--feature` flag to `sc requirement new`
   - Update validation to check both locations

5. **Document in Epic**
   - Add to Epic-010 (Gap Remediation) as organizational task

---

## Validation

### Checklist for New Features

- [ ] Feature has `README.md` with status
- [ ] Research docs are dated (YYYY-MM-DD-*.md)
- [ ] Planning docs are dated
- [ ] Design docs are dated
- [ ] Requirements are in Gherkin format
- [ ] Test plans reference actual test files
- [ ] Cross-cutting dependencies are documented in centralized locations

### CLI Validation

```bash
# Validate feature structure
sc validate --feature workflow-management/wip-registry

# Check for cross-cutting concerns
sc validate --cross-cutting-refs

# Validate symlinks
sc validate --test-links
```

---

## Related Documentation

- [SOP-0.1.05: Requirements & Planning](SOP-0.1.05-requirements-planning.md) - Epic/Feature/Requirement model
- [SOP-0.1.17: Documentation Requirements](SOP-0.1.17-documentation-requirements.md) - Required vs suggested docs
- [docs/features/README.md](../../../docs/features/README.md) - Features directory index

---

## Questions & Answers

**Q: When should I create a feature-specific ADR vs system ADR?**  
A: If the decision ONLY affects this feature → feature ADR. If it affects architecture/multiple features → system ADR in `docs/architecture/decisions/`.

**Q: Should user stories be centralized or co-located?**  
A: If the story spans multiple features (e.g., "As an admin, I want to manage all users") → centralize in `docs/research/`. If it's feature-specific (e.g., "As a developer, I want to track WIP files") → co-locate in feature.

**Q: What if a feature grows and becomes cross-cutting?**  
A: Move it to centralized location. Update feature READMEs to link to the centralized artifact. This is a natural evolution.

**Q: How do I reference centralized requirements from features?**  
A: Link to them in feature README.md or requirements. Example: "This feature implements [req-infra-070](../../../requirements/infra/req-infra-070-traceability-matrix-implementation.md)".

---

**Last Updated**: 2025-12-02  
**Status**: Active  
**Review**: Update when new documentation patterns emerge

