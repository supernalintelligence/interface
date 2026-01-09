# Feature Templates

This directory contains templates for creating features in the domain-based structure.

## Key Concept: Domain (Structure) + Phase (Workflow)

Features are organized by **domain** (where they live) and track **phase** (workflow state) in frontmatter:

```yaml
---
feature_id: 'my-feature'
domain: 'ai-workflow-system' # WHERE: Organizational structure
phase: 'implementing' # WHEN: Workflow state
status: 'active' # WHAT: Current work status
---
```

## Template Usage

Use `sc feature create` to create features:

```bash
# Create in specific domain, specify phase
sc feature create --id=my-feature --domain=developer-tooling --phase=drafting

# Feature will be created at:
# docs/features/developer-tooling/my-feature/
```

## Phase-Based Directory Requirements

The `phase` field determines required directory structure:

### backlog

- `README.md` only

### drafting

- `README.md`
- `design/`
- `planning/`
- `requirements/`

### implementing

- All drafting directories +
- `testing/`

### testing

- All implementing directories

### validating

- All testing directories +
- `validation/`

### complete

- All validating directories

## Available Domains

- `ai-workflow-system/` - AI automation, agents, generation
- `developer-tooling/` - CLI tools, validation, utilities
- `compliance-framework/` - Compliance, auditing, regulatory
- `dashboard-platform/` - UI, visualization, dashboards
- `workflow-management/` - State tracking, configuration
- `content-management/` - Social media, content tools
- `integrations/` - External service connections
- `admin-operations/` - Admin features, operations

## Phase Transitions

When moving between phases:

```bash
# 1. Update phase in README.md frontmatter
phase: implementing  # Change from 'drafting' to 'implementing'

# 2. Create required directories
mkdir testing/

# 3. Validate structure
sc planning feature --id=my-feature

# 4. Commit changes
git add docs/features/{domain}/my-feature/
git commit -m "feat: Move my-feature to implementing phase"
```

## Validation

Features are validated based on phase requirements:

```bash
# Validate single feature
sc planning feature --id=my-feature

# Will check:
# - Required fields in frontmatter
# - feature_id matches folder name
# - Required directories exist for current phase
# - Domain is valid (if specified)
```

## See Also

- [Feature System Guide](../docs/features/feature-system-guide.md)
- [Structure Philosophy](../docs/features/structure-philosophy.md)
- [Naming Conventions](../docs/features/naming-conventions.md)
