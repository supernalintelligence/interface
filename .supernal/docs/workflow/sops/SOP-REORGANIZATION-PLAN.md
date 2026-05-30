# SOP Reorganization & Frontmatter Standardization Plan

## Problem Statement

1. **Inconsistent Frontmatter**: Only main SOPs have frontmatter; parts and phase SOPs don't
2. **Manual Index Maintenance**: INDEX files must be manually updated (pain point)
3. **Unclear Organization**: Parts vs. Phase SOPs distinction is confusing
4. **Missing Metadata**: Can't query/filter SOPs programmatically

## Proposed Organization

### New Structure

```
docs/workflow/sops/
├── README.md (explain structure, link to auto-generated index)
├── SOP-0-overview.md (main overview - keep as is)
├── SOP-0.1-ai-workflow-hub.md (AI workflow entry point - keep as is)
│
├── parts/ (Cross-cutting AI techniques - applicable to any phase)
│   ├── SOP-0.1.01-foundation.md
│   ├── SOP-0.1.02-chat-management.md
│   ├── ...
│   └── SOP-0.1.16-roles-responsibilities.md
│
├── phases/ (Phase-specific, sequential workflow SOPs)
│   ├── SOP-0.01-business-vision.md (Phase 0: Discovery)
│   ├── SOP-0.02-solution-analysis.md (Phase 0: Discovery)
│   ├── SOP-2.03-compliance.md (Phase 2: Requirements)
│   ├── SOP-2.04-security.md (Phase 2: Requirements)
│   ├── SOP-6.01-marketing.md (Phase 6: Operations)
│   └── SOP-6.02-post-launch.md (Phase 6: Operations)
│
└── tools/
    └── SOP-T.01-using-sc-cli.md
```

### Key Changes

1. **Flatten phase directories**: Move phase-N-_/SOP-X.YY-_.md → phases/SOP-X.YY-\*.md
2. **Remove all INDEX files**: Auto-generate from frontmatter
3. **Add frontmatter to ALL SOPs**: Consistent metadata structure

## Frontmatter Standard

### All SOPs Must Have

```yaml
---
type: sop
category: overview | ai-technique | phase-workflow | tool
sop_id: SOP-0.1.05 # Unique identifier
title: Requirements & Planning
phase: null | 0 | 1 | 2 | 3 | 4 | 5 | 6 # null for cross-cutting
group: null | A | B | C # For parts only (A=AI, B=Workflow, C=Reference)
part_number: null | 5 # For parts only
audience: [developers, ai-agents, architects]
read_time: 30 # minutes
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: complete | draft | review
version: '1.0'
related_sops: [SOP-0, SOP-0.1]
prerequisites: []
tags: [requirements, planning, discovery]
---
```

### Category Definitions

| Category         | Purpose                                  | Examples                         |
| ---------------- | ---------------------------------------- | -------------------------------- |
| `overview`       | High-level complete workflows            | SOP-0, SOP-0.1                   |
| `ai-technique`   | Cross-cutting AI practices (Parts 01-16) | Foundation, Prompting, Testing   |
| `phase-workflow` | Phase-specific sequential SOPs           | Discovery, Compliance, Marketing |
| `tool`           | Tool-specific guides                     | Using sc CLI                     |

## Implementation Steps

### Step 1: Add Frontmatter Template

Create `templates/docs/sops/.template.md`:

```yaml
---
_naming_pattern: ^SOP-\d+(\.\d+)?-.+\.md$
_template_origin: templates/docs/sops/.template.md
_consistency_note: 'SOP IDs must match filename pattern'
type: sop
category: overview # overview | ai-technique | phase-workflow | tool
sop_id: SOP-X.YY
title: SOP Title
phase: null # null | 0-6
group: null # null | A | B | C (for parts)
part_number: null # null | 1-16 (for parts)
audience: [developers]
read_time: 30
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: complete
version: '1.0'
related_sops: []
prerequisites: []
tags: []
---
# [SOP Title]

## Purpose
```

### Step 2: Add Frontmatter to All SOPs

For each SOP file, prepend appropriate frontmatter.

**Parts (01-16)** - `category: ai-technique`, `group: A/B/C`, `part_number: N`
**Phase SOPs** - `category: phase-workflow`, `phase: N`
**Tool SOPs** - `category: tool`, `phase: null`
**Main SOPs** - `category: overview`, `phase: null`

### Step 3: Flatten Phase Structure

```bash
# Move phase SOPs to single phases/ directory
git mv docs/workflow/sops/phase-0-discovery/SOP-0.01-*.md docs/workflow/sops/phases/
git mv docs/workflow/sops/phase-0-discovery/SOP-0.02-*.md docs/workflow/sops/phases/
git mv docs/workflow/sops/phase-2-requirements/SOP-2.03-*.md docs/workflow/sops/phases/
git mv docs/workflow/sops/phase-2-requirements/SOP-2.04-*.md docs/workflow/sops/phases/
git mv docs/workflow/sops/phase-6-operations/SOP-6.01-*.md docs/workflow/sops/phases/
git mv docs/workflow/sops/phase-6-operations/SOP-6.02-*.md docs/workflow/sops/phases/

# Remove empty phase directories
rmdir docs/workflow/sops/phase-*/
```

### Step 4: Remove INDEX Files

```bash
# Delete all manual index files
rm docs/workflow/sops/SOP-INDEX.md
rm docs/workflow/sops/parts/SOP-PARTS-INDEX.md
rm docs/workflow/sops/tools/TOOLS-INDEX.md
# phases/ directory won't have an index yet
```

### Step 5: Create Auto-Index Generator

Create `sc docs generate-sop-index` command:

```javascript
// supernal-code-package/lib/cli/commands/docs/generate-sop-index.js

// Scans docs/workflow/sops/ for all .md files
// Reads frontmatter from each
// Generates index based on:
//   - category (groups SOPs)
//   - phase (for phase-workflow)
//   - group (for ai-technique)
//   - part_number (for ordering)

// Outputs:
// - docs/workflow/sops/INDEX.md (main index)
// - Auto-generated from frontmatter
// - No manual maintenance needed
```

**Index Structure**:

```markdown
# Supernal Coding SOPs - Auto-Generated Index

Last generated: 2025-11-23 12:00:00

## Overview SOPs

| ID                         | Title             | Audience | Read Time |
| -------------------------- | ----------------- | -------- | --------- |
| [SOP-0](SOP-0-overview.md) | Complete Workflow | All      | 60 min    |

## AI Techniques (Parts)

### Group A: AI Foundations

| Part | ID                                               | Title      | Read Time |
| ---- | ------------------------------------------------ | ---------- | --------- |
| 01   | [SOP-0.1.01](./general/SOP-0.1.01-foundation.md) | Foundation | 20 min    |

### Group B: Development Workflow

...

### Group C: Reference

...

## Phase Workflows

| Phase | ID                                             | Title           | Prerequisites | Read Time |
| ----- | ---------------------------------------------- | --------------- | ------------- | --------- |
| 0     | [SOP-0.01](phases/SOP-0.01-business-vision.md) | Business Vision | -             | 45 min    |

## Tool Guides

| ID                                         | Title        | Read Time |
| ------------------------------------------ | ------------ | --------- |
| [SOP-T.01](tools/SOP-T.01-using-sc-cli.md) | Using sc CLI | 30 min    |
```

### Step 6: Update README

Update `docs/workflow/sops/README.md` to explain:

- Structure (parts vs phases vs tools)
- How to find SOPs (use auto-generated INDEX.md)
- How to create new SOPs (use template)
- How frontmatter enables programmatic queries

## Benefits

### Before (Current State)

❌ Inconsistent frontmatter
❌ Manual index maintenance
❌ Nested phase directories
❌ Can't programmatically query SOPs
❌ Unclear organization

### After (Proposed State)

✅ All SOPs have standardized frontmatter
✅ Auto-generated indexes (never stale)
✅ Flat, clear structure (parts/, phases/, tools/)
✅ Can query: "Show me all Phase 2 SOPs" or "All AI technique SOPs"
✅ Clear categories and relationships

## Example Queries Enabled

```bash
# Find all Phase 0 SOPs
sc docs query --type sop --phase 0

# Find all AI technique SOPs for developers
sc docs query --type sop --category ai-technique --audience developers

# Find SOPs related to testing
sc docs query --type sop --tags testing

# Generate index for just AI techniques
sc docs generate-sop-index --category ai-technique
```

## Migration Script

```bash
#!/bin/bash
# migrate-sops.sh

# 1. Add frontmatter to all SOPs (bulk edit with template)
# 2. Move phase SOPs to phases/
# 3. Remove INDEX files
# 4. Generate new auto-index
# 5. Update cross-references
# 6. Validate with sc docs links

echo "Migrating SOPs to new structure..."
# Implementation...
```

## Validation

After migration:

```bash
# Validate all SOPs have proper frontmatter
sc validate --requirements

# Generate index
sc docs generate-sop-index

# Verify cross-references
sc docs links
```

---

**Next Steps**:

1. Review and approve this plan
2. Create SOP template
3. Add frontmatter to all 31 SOP files
4. Flatten phase structure
5. Remove INDEX files
6. Create auto-index generator
7. Test and validate
