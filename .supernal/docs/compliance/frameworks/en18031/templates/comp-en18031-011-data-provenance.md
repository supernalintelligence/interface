---
id: comp-en18031-011-data-provenance
title: COMP-EN18031-011 - Data Provenance (DEPRECATED - See Data Labeling Quality)
sidebar_label: COMP-EN18031-011 (DEPRECATED)
sidebar_position: 11
status: deprecated
references:
  - comp-en18031-011-data-labeling-quality
---

# COMP-EN18031-011: Data Provenance

## ⚠️ DEPRECATED: Duplicate Card ID

**This card ID (011) is a duplicate.** The canonical implementation for EN 18031 control 5.2.3 is:

**[COMP-EN18031-011: Data Labeling Quality](./comp-en18031-011-data-labeling-quality.md)**

## Background

During initial template generation, two separate cards were created with the same ID (011):
1. **Data Provenance** (this file) - Originally intended for tracking data sources and lineage
2. **Data Labeling Quality** (canonical) - Comprehensive implementation of EN 18031 control 5.3.3

Upon review, **Data Labeling Quality** (comp-en18031-011-data-labeling-quality.md) was determined to be the correct and complete implementation, covering:
- Training data label consistency and accuracy
- Annotation quality control processes
- Label validation and verification
- Multi-annotator agreement (inter-rater reliability)
- Labeling guidelines and standards
- **Data provenance tracking** (integrated as part of labeling quality)

## Resolution

**Data provenance requirements are fully addressed in the Data Labeling Quality card**, specifically:
- **Section: Label Provenance Tracking** (tracking annotation source, annotator ID, timestamp, version)
- **Section: Data Lineage Documentation** (documenting data flow from source through labeling)
- **Section: Audit Trail Requirements** (maintaining complete audit trail of labeling process)

## What to Use Instead

For all requirements related to:
- **Data provenance and lineage** → See [COMP-EN18031-011: Data Labeling Quality](./comp-en18031-011-data-labeling-quality.md) - Section: "Label Provenance Tracking"
- **Data labeling quality** → See [COMP-EN18031-011: Data Labeling Quality](./comp-en18031-011-data-labeling-quality.md)
- **Annotation validation** → See [COMP-EN18031-011: Data Labeling Quality](./comp-en18031-011-data-labeling-quality.md)

## Future Action

This file should be removed once all references are updated to point to the canonical Data Labeling Quality card.

---

**Deprecation Date**: 2025-12-13  
**Canonical Replacement**: [COMP-EN18031-011: Data Labeling Quality](./comp-en18031-011-data-labeling-quality.md)
