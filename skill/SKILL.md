---
name: si
description: >-
  Supernal Interface CLI for test generation, contract scanning, story system, and MCP setup. Use when: (1) scanning Next.js routes/components for contracts, (2) generating tests from @Tool decorators, (3) recording/validating story-based tests, (4) setting up MCP integration, (5) validating contracts. NOT for: task management (use sc), orchestration (use orch), or CLI/API generation patterns (use universal-command).
---

# si - Supernal Interface CLI

Test generation, contract scanning, story-based testing, and MCP setup for web applications.

**This is a generic, standalone, publishable testing engine** — it works in
any Next.js project, including ones with no relationship to Supernal at all.
It has no concept of "boards," "companies," or any org-specific merge
pipeline, and must never grow one — that's what keeps it reusable by other
systems. (`sc visual` in `families/supernal-coding` is the separate,
Supernal-specific gate BUILT ON `si test visual`, for git-ref diffing and
merge-gating boards — see the `si-qa` skill's "Why two CLIs" section for the
full architectural split if you're extending either one.)

## Installation

```bash
npm install -g @supernal/interface
```

## Quick Reference

### Contract Generation & Scanning

```bash
# Scan Next.js pages → generate route contracts
si scan-routes
si scan-routes -p ./src/pages -o ./src/routes/Routes.ts
si scan-routes --framework nextjs --watch        # Watch mode
si scan-routes --git-commit                      # Auto-commit

# Scan components → generate name contracts (data-testid)
si scan-names
si scan-names -c ./src/components -o ./src/names/Components.ts
si scan-names --flat                             # Components.Header vs Header.submitButton

# iOS-specific scanning
si scan-ios-views      # SwiftUI views → component names
si scan-ios-routes     # SwiftUI navigation → route contracts
si scan-ios-names      # Swift accessibility identifiers
```

### Validation

```bash
si validate --all                    # Validate everything
si validate --routes <file>          # Validate route contracts
si validate --names <file>           # Validate name contracts
si validate --tools                  # Validate @Tool decorators
si validate --no-cache               # Force refresh

si validate-graph                    # Detect broken links, orphan routes
```

### Test Generation

```bash
# From @Tool decorators
si generate-tests
si generate-tests --tools src/tools/index.ts
si generate-tests --include-e2e      # Add Playwright E2E tests
si generate-tests -f jest            # Framework: jest (default)

# From Gherkin feature files
si generate-story-tests <path>       # Multi-platform test generation
```

### Story System (BDD Testing)

```bash
# Record story videos
si story record <story-file>         # Record .story.ts execution

# Test without video
si story test <feature-file>         # Run Gherkin scenarios

# Validate before running
si story validate <feature-file>     # Check syntax, steps, components

# List available steps
si story list-steps                  # Show allowed Gherkin patterns
si list-steps                        # Alias

# Convert Components.NS.el testid references to quoted-visible-text
# (dry-run by default — see the si-qa skill for the full reference)
si story convert-refs --pattern "**/*.feature" --baseUrl http://localhost:3000
si story convert-refs --pattern "**/*.feature" --baseUrl http://localhost:3000 --write
```

### Testing Commands

```bash
# Graph-based testing (routes graph)
si test graph                        # All modes: visual, perf, a11y, SEO
si test graph --modes visual,performance
si test graph --start-url /dashboard

# Shortcuts
si test visual                       # Visual regression (screenshots)
si test performance                  # Core Web Vitals, Lighthouse
si test a11y                         # WCAG compliance (axe-core)

# Freeform interaction testing — clicks every interactive element found on a
# page (no testid/contract knowledge needed), flags zero-observable-change
# clicks as dead. Requires target-specific safety config, no invented
# defaults — see the si-qa skill for the full D1-D4 safety design.
si test graph --modes interaction --baseUrl http://localhost:3000 \
  --auth-cookie-name <cookie> --api-prefix /api --api-fixtures-dir .api-fixtures

# Capture real API responses once as replayable fixtures (so interaction
# mode never mutates a live backend on later runs)
si test capture-fixtures --baseUrl http://localhost:3000 --api-prefix /api --output .api-fixtures

# Record test video
si test record <test-file>           # Playwright video capture
si record <test-file>                # Alias
```

**Dev-server timing is handled automatically** — `si test visual`/`si test graph`
wait out Next.js's own "Compiling .." dev toast and wait for a page's async
content to stop growing before capturing, with no flags needed. A page with
an unusually long async gap between load phases (e.g. a WebSocket-backed
panel) can still need an explicit `--waitAfter <ms>`. See the si-qa skill for
the full picture, including the "always scan twice on a cold dev server"
rule.

### Journey graph

`si journey graph` maps every control in an app or board to what it does:
dispatched actions, page changes, requests, state changes and the views they
reveal. Each edge gets a status (validated, broken, dead-end, theatrical or
untested) from the static wiring, `.feature` story results and an optional
live probe. Run it before you call UI work done, or when you're hunting dead
buttons.

```bash
si journey graph <source-dir> [options]

# Static pass for one board (no dashboard needed)
si journey graph packages/modules/<board>/board \
  --actions-manifest packages/modules/<board>/module.yaml --actions-key actions \
  --handlers-dir packages/modules/<board>/agent/handlers \
  --messages packages/modules/<board>/board/messages.ts \
  --out journey-graph.html          # writes journey-graph.html and .json

# Live probe: opens each entry page and triggers each control once
si journey graph packages/modules/<board>/board \
  --probe --base-url http://localhost:3006 \
  --setup-url http://localhost:3006/api/auth/dev-bypass \
  --entries "/local/<company>/<division>/boards/<board>?layer=now" \
  --concurrency 2

# CI: exit 1 if any edge is broken
si journey graph <source-dir> --ci
```

`sc board journey <board> --company <slug> [--probe]` fills in the manifest,
handlers, messages and live entry URLs for you (set `SI_BIN` to use a local si
build). The probe won't send non-GET requests unless you pass
`--allow-writes`. It finds a control with no `data-testid` only by its exact
label, and a story can't reference it at all, so give every interactive
control a literal testid. The full option list is in the `si-journey-graph`
skill in supernal-interface.

### Project Setup

```bash
# Initialize in Next.js project
si init                              # Current directory
si init ./my-project                 # Specific directory
si init --scan-only                  # Report only, no generation
si init --inject                     # Inject data-testid into components
si init --migrate                    # Migrate imports to contracts
si init --dry-run                    # Preview changes
si init --revert                     # Restore from backups

# Route migration
si migrate-routes                    # Migrate hardcoded strings → Routes
```

### MCP Setup

```bash
# Fully automated MCP setup (zero manual steps)
si setup-mcp                         # Configure IDE + create server
si setup-mcp --force                 # Overwrite existing
si setup-mcp --skip-test             # Skip server startup test
si setup-mcp --manual                # Create files only, skip IDE config

# Claude Code integration
si setup-claude                      # Install skills + agents
```

### Utilities

```bash
si cache-tools <file>                # Cache @Tool decorators
si benchmark-cache                   # Test caching performance
si feedback                          # File GitHub issue
```

## Common Patterns

### New Project Setup

```bash
cd my-nextjs-project
si init
si scan-routes
si scan-names
si setup-mcp
```

### Pre-PR Validation

```bash
si validate --all
si test visual                       # Check for visual regressions
si test a11y                         # Accessibility compliance
```

### Story-Driven Development

```bash
# 1. Write Gherkin feature
# 2. Validate: si story validate login.feature
# 3. Create story implementation (.story.ts)
# 4. Record: si story record login.story.ts
# 5. Generate tests: si generate-story-tests login.feature
```

### Contract-First Development

```bash
# Generate contracts from existing code
si scan-routes --git-commit
si scan-names --git-commit

# Validate contracts stay in sync
si validate --routes ./src/routes/Routes.ts
si validate --names ./src/names/Components.ts
```

## Integration with Other Tools

| Tool | Relationship |
|------|--------------|
| `sc` | Task management, project health — use sc for dev workflow |
| `sc visual site-scan` | Visual coverage for a plain Next.js app, built on `si test visual` — see the `si-qa` skill |
| `orch` | Agent orchestration — si focuses on testing/contracts |
| `universal-command` | si uses universal-command pattern internally |

**QA workflows** (finding real issues on a real site — visual regressions,
dead clicks, testid-vs-text drift) — see the **`si-qa`** skill, not this one,
for the full reference including the image-cache-backed site-scan gate and
the freeform interaction-mode safety design.

## Environment

- **Routes file**: `./src/routes/Routes.ts` (default)
- **Names file**: `./src/names/Components.ts` (default)
- **Tests output**: `./tests/generated/` (default)
- **Framework**: Next.js (default), React Router supported
