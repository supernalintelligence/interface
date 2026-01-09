---
id: cli-overview
title: CLI Commands Overview
sidebar_label: Overview
sidebar_position: 1
---

# Supernal Coding CLI Commands

All commands can be run with either `sc` or `supernal-coding` prefix.

## Available Commands

| Command                                    | Description                                                         |
| ------------------------------------------ | ------------------------------------------------------------------- |
| [`agent`](./agent)                         | Agent workflow management                                           |
| [`date-validate`](./date-validate)         | Detect and fix hardcoded dates that don't match actual file dates   |
| [`deploy`](./deploy)                       | Deploy project components                                           |
| [`dev`](./dev)                             | Development tools and utilities                                     |
| [`docs`](./docs)                           | Documentation management system                                     |
| [`fix-frontmatter`](./fix-frontmatter)     | Auto-fix common frontmatter issues in requirement files             |
| [`generate`](./generate)                   | Generate project files and documentation                            |
| [`git-hooks`](./git-hooks)                 | Git hooks management and installation                               |
| [`git-smart`](./git-smart)                 | Smart git workflow utilities                                        |
| [`help`](./help)                           | Show comprehensive help                                             |
| [`init-req-tracking`](./init-req-tracking) | Initialize git tracking metadata for all requirement markdown files |
| [`kanban`](./kanban)                       | Kanban task management system                                       |
| [`map`](./map)                             | Generate and manage command mappings from code                      |
| [`priority`](./priority)                   | Priority management for requirements and tasks                      |
| [`suggest`](./suggest)                     | Instantly create GitHub issues with context                         |
| [`validate`](./validate)                   | Validate project structure and requirements                         |
| [`workflow`](./workflow)                   | Workflow state tracking and guidance system                         |

## Quick Start

```bash
# Get help for any command
sc <command> --help

# Common workflow commands
sc kanban list          # View current tasks
sc validate --all       # Validate project
sc suggest "feedback"   # Quick GitHub issue
```

---

_This documentation is automatically generated from the live CLI system._
