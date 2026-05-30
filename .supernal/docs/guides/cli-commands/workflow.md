---
id: workflow
title: workflow
sidebar_label: workflow
---

# `workflow`

Workflow state tracking and guidance system

## Usage

```bash
sc workflow --init
```

## Examples

```bash
sc workflow status
```

```bash
sc workflow check
```

```bash
sc workflow guide
```

```bash
sc workflow complete create_first_requirement
```

```bash
sc workflow start-req 001
```

```bash
sc workflow complete-req 001
```

## Implementation Details

**Implementation Notes**: Workflow state management commands

**Key Functions**: handleWorkflowCommand, parseInitOptions, showWorkflowHelp

## Category

**General**

---

_This documentation is automatically generated from the live CLI system._
