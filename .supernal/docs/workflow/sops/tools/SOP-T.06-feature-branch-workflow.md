---
title: Feature Development with Branch Integration
sop_id: SOP-T.06
version: 1.0
status: needs_approval
created: 2025-11-24
updated: 2025-11-24
category: tools
applies_to: [features, branches, kanban, git-workflow]
---

# SOP-T.06: Feature Development with Branch Integration

## Purpose

Define the complete workflow for feature development using git branches, kanban coordination, and the feature lifecycle system. Ensures features are approved before work starts, tracked properly during development, and merged only when complete.

## When to Use This Workflow

**This SOP describes traditional feature branches (one branch per feature).**

**Workflow Options** (see SOP-0.1.12 for full comparison):

1. **Trunk-Based** (Default): Work on main with `[FEATURE:name]` commits
2. **Work Sessions** (Preferred when branches needed): Personal branches for multi-feature work
3. **Feature Branches** (This SOP): One branch per feature (good for PRs, external contributors)

**Use feature branches when**:
- External contributors submitting PRs
- Strict code review requirements
- Need isolated feature development
- Open source or public repositories

**Consider work sessions instead when**:
- Working on multiple features simultaneously
- Multi-week parallel development
- Cross-epic coordination needed
- See: REQ-WORKFLOW-139, `docs/features/workflow-management/work-sessions/`

## Branch Strategy

### Branch Types

| Branch       | Purpose                     | Deployed | Accepts From |
| ------------ | --------------------------- | -------- | ------------ |
| `production` | Production deployed code    | ✅ Yes   | `main`       |
| `main`       | Integration/watching branch | ❌ No    | `feature/*`  |
| `feature/*`  | Individual feature work     | ❌ No    | None         |

### Key Principle

**Main branch is the "watching" branch** - tracks approved features. Features must be approved and tracked on `main` BEFORE creating feature branches.

---

## Complete Workflow

### Phase 0: Feature Proposal

**Who**: Product/Engineering Lead  
**Branch**: None yet

#### Actions

1. **Create Kanban Proposal**

```bash
sc kanban new "Feature: User Dashboard" \
  --type=proposal \
  --epic=epic-dashboard \
  --priority=high \
  --assignee=@username
```

2. **Document Proposal**
   - Location: `docs/planning/kanban/BRAINSTORM/`
   - Include: description, business value, acceptance criteria
   - Status: `awaiting-approval`

#### Exit Criteria

- [ ] Kanban card created in BRAINSTORM/
- [ ] Epic assigned
- [ ] Priority set
- [ ] Stakeholders identified

---

### Phase 1: Feature Approval

**Who**: Technical Lead / Product Owner  
**Branch**: `main` (watching branch)

#### Actions

1. **Review Proposal**
   - Technical feasibility
   - Resource availability
   - Epic alignment
   - Priority vs other work

2. **Approve Feature**

```bash
# Switch to main branch
git checkout main

# Approve and create tracking entry
sc feature approve feature-user-dashboard \
  --kanban-card=feature-user-dashboard \
  --phase=backlog
```

3. **What This Does**
   - Creates `docs/features/\{domain\}/feature-user-dashboard/` on main
   - Creates `README.md` with `phase: backlog` in frontmatter
   - Moves kanban to `PLANNING/`
   - Marks as `approved: true`

#### Exit Criteria

- [ ] Feature folder exists in `docs/features/\{domain\}/` on main with `phase: backlog`
- [ ] Kanban in PLANNING/ with approved status
- [ ] Assignee confirmed
- [ ] Ready for feature branch creation

---

### Phase 2: Create Feature Branch

**Who**: Developer/AI Agent  
**Branch**: `main` → creates `feature/feature-name`

#### Validation

**MUST have kanban approval** - command will fail if:

- No kanban card exists
- Kanban not approved
- Feature not tracked on main

#### Actions

1. **Create Feature Branch**

```bash
# Validates approval, then creates branch
sc feature branch-create feature-user-dashboard

# This automatically:
# 1. Creates branch feature/feature-user-dashboard from main
# 2. Checks out new branch
# 3. Updates feature frontmatter: phase: backlog → phase: drafting
# 4. Updates kanban with branch info
# 5. Moves kanban to TODO/
```

2. **Verify Branch Creation**

```bash
sc branch status

# Output:
Current Branch: feature/feature-user-dashboard
Watching Branch: main
Feature: feature-user-dashboard
  Location: docs/features/\{domain\}/feature-user-dashboard/
  Phase: drafting (updated from backlog)
Kanban: TODO/feature-user-dashboard.md
```

#### Exit Criteria

- [ ] Feature branch exists
- [ ] Feature frontmatter updated to `phase: drafting`
- [ ] Kanban moved to TODO/
- [ ] Branch tracked in kanban card

---

### Phase 3: Development (On Feature Branch)

**Who**: Developer/AI Agent  
**Branch**: `feature/feature-name`

#### Actions

1. **Plan & Design**
   - Create planning documents in `planning/`
   - Define architecture in `design/`
   - Extract requirements in `requirements/`

2. **Progress Through Phases**

```bash
# Update phase in frontmatter (feature stays in same domain folder)
sc feature move feature-user-dashboard --phase=implementing
# Updates frontmatter: phase: drafting → phase: implementing

# Move to testing
sc feature move feature-user-dashboard --phase=testing
# Updates frontmatter: phase: implementing → phase: testing

# Move to validating
sc feature move feature-user-dashboard --phase=validating
# Updates frontmatter: phase: testing → phase: validating
```

**Note**: Features stay in their domain folder (`docs/features/\{domain\}/feature-name/`). Phase is metadata in frontmatter, not folder location.

3. **Update Kanban Progress**

```bash
# Update with notes
sc kanban update feature-user-dashboard \
  --note="3/5 requirements complete, tests passing"

# Or manually edit:
# docs/planning/kanban/DOING/feature-user-dashboard.md
```

4. **Regular Git Commits**

```bash
git add docs/features/\{domain\}/feature-user-dashboard/
git commit -m "feat(dashboard): Implement requirement REQ-001"
git push origin feature/feature-user-dashboard
```

#### Exit Criteria

- [ ] All requirements implemented
- [ ] Tests written and passing
- [ ] Code reviewed (if team-based)
- [ ] Documentation complete
- [ ] Feature in `04_validating/` phase

---

### Phase 4: Ready to Merge

**Who**: Developer/AI Agent  
**Branch**: `feature/feature-name`

#### Actions

1. **Signal Ready**

```bash
sc feature ready-to-merge feature-user-dashboard

# This:
# 1. Validates all merge criteria
# 2. Updates kanban to "ready-to-merge"
# 3. Creates draft PR on GitHub
# 4. Notifies reviewers (if configured)
```

2. **Validate Merge Criteria**
   - [ ] All requirements complete
   - [ ] Tests passing (coverage >80%)
   - [ ] No blocking issues
   - [ ] Documentation complete
   - [ ] Feature in `04_validating/` or `05_complete/`

3. **Create Pull Request**

```bash
# PR created automatically, or manually:
gh pr create \
  --title "Feature: User Dashboard" \
  --body "Completes epic-dashboard. See: docs/planning/kanban/DOING/feature-user-dashboard.md" \
  --base main \
  --head feature/feature-user-dashboard
```

**IMPORTANT**: CLI creates PR, but **merge happens via GitHub UI**, NOT via CLI.

#### Exit Criteria

- [ ] PR created on GitHub
- [ ] All CI checks passing
- [ ] Kanban status: ready-to-merge
- [ ] Reviewers assigned (if required)

---

### Phase 5: Merge to Main

**Who**: Technical Lead / Maintainer  
**Branch**: `main` (via GitHub PR)

#### Actions

1. **Review PR**
   - Code quality
   - Test coverage
   - Documentation
   - Breaking changes

2. **Merge PR on GitHub**
   - **Use GitHub UI or `gh pr merge` command**
   - **DO NOT use `git merge` directly**
   - Select merge strategy (squash/merge/rebase per project policy)

3. **Post-Merge Updates**

```bash
# Switch to main
git checkout main
git pull

# Feature now exists on main at validating phase
# Location: docs/features/04_validating/feature-user-dashboard/

# Update kanban
sc kanban complete feature-user-dashboard

# Kanban moves to DONE/
```

4. **Clean Up**

```bash
# Delete feature branch (if policy allows)
git branch -d feature/feature-user-dashboard
git push origin --delete feature/feature-user-dashboard
```

#### Exit Criteria

- [ ] PR merged via GitHub
- [ ] Feature on main in correct phase
- [ ] Kanban moved to DONE/
- [ ] Feature branch deleted (optional)

---

### Phase 6: Post-Merge Validation

**Who**: QA / Technical Lead  
**Branch**: `main`

#### Actions

1. **Final Validation**
   - Integration testing
   - Smoke tests
   - Documentation review

2. **Move to Complete** (if fully done)

```bash
git checkout main

sc feature move feature-user-dashboard complete
# Moves: 04_validating/ → 05_complete/
```

3. **Archive Kanban**

```bash
sc kanban archive feature-user-dashboard
# Moves to archive/ after 30 days
```

#### Exit Criteria

- [ ] Feature validated in integrated environment
- [ ] Moved to `05_complete/` if done
- [ ] Kanban archived
- [ ] Documentation updated

---

## Branch Context Switching

### View Current Context

```bash
# Show current branch info
sc branch view

# Show branch status
sc branch status
```

### Switch Branches

```bash
# Switch to main (watching branch)
sc branch switch main

# Switch to feature branch
sc branch switch feature/feature-user-dashboard

# Dashboard updates automatically to show branch context
```

### Multi-Branch Queries

```bash
# Features on current branch
sc feature list

# Features on main
sc feature list --branch=main

# All features across branches
sc feature list --all-branches

# My work queue (cross-branch)
sc work queue
```

---

## Kanban States

| State    | Folder                  | Meaning                 | Next Action           |
| -------- | ----------------------- | ----------------------- | --------------------- |
| Proposal | BRAINSTORM/             | Idea proposed           | Review & approve      |
| Approved | PLANNING/               | Approved, no branch yet | Create feature branch |
| Active   | TODO/ or DOING/         | Feature branch exists   | Develop feature       |
| Ready    | DOING/ (ready-to-merge) | Ready for PR merge      | Merge PR              |
| Complete | DONE/                   | Merged to main          | Archive after 30 days |

---

## Feature Phase Mapping

**Note**: Phase is metadata in frontmatter, not folder location. Features stay in `docs/features/\{domain\}/\{feature\}/` regardless of phase.

| Phase (Metadata) | On Main (Tracking)            | On Feature Branch (Work)   | Required Directories              |
| ---------------- | ----------------------------- | -------------------------- | --------------------------------- |
| `backlog`        | ✅ Tracking approved features | ❌ N/A                     | None (README only)                |
| `drafting`       | ❌ Not used                   | ✅ Planning/design         | design/, planning/, requirements/ |
| `implementing`   | ❌ Not used                   | ✅ Active development      | Above + testing/                  |
| `testing`        | ❌ Not used                   | ✅ Testing phase           | All above                         |
| `validating`     | ✅ After merge                | ✅ Before merge (ready)    | All above + validation/           |
| `complete`       | ✅ Fully done                 | ✅ Before merge (optional) | All directories                   |

---

## CLI Command Reference

### Feature Management

```bash
# Approve feature (on main)
sc feature approve <name> --kanban-card=<card-id>

# Create feature branch (requires approval)
sc feature branch-create <name>

# Move feature through phases (on feature branch)
sc feature move <name> <phase>

# Signal ready to merge
sc feature ready-to-merge <name>

# List features
sc feature list [--branch=<name>] [--all-branches]
```

### Branch Management

```bash
# View current branch context
sc branch view
sc branch status

# Switch branches (updates dashboard)
sc branch switch <branch-name>

# Compare branches
sc branch diff [<branch1>..<branch2>]
```

### Kanban Management

```bash
# Create proposal
sc kanban new "<title>" --type=proposal

# Approve proposal
sc kanban approve <card-id>

# Update progress
sc kanban update <card-id> --note="<progress>"

# Complete (after merge)
sc kanban complete <card-id>

# Archive
sc kanban archive <card-id>

# List kanban items
sc kanban list [--branch=<name>] [--status=<status>]
```

### Work Queue

```bash
# My work across all branches
sc work queue

# Specific assignee
sc work queue --assignee=@username

# Specific branch
sc work queue --branch=main
```

---

## Dashboard Views

### Watching Branch View (Main)

Shows features being tracked and their feature branches:

- Features in `00_backlog/` on main (approved, waiting for branch)
- Active feature branches and their progress
- Ready-to-merge features

### Feature Branch View

Shows current feature being worked on:

- Phase progression
- Requirements status
- Test results
- Merge readiness

### Branch Switcher

Allows switching between branches:

- Updates dashboard context
- Shows features on selected branch
- Compares with main

---

## Best Practices

### ✅ DO:

1. **Always get approval before starting**
   - Feature must be in kanban PLANNING/ before creating branch
   - Feature must exist on main in `00_backlog/`

2. **Keep feature branches focused**
   - One feature per branch
   - Merge when feature is complete, not before

3. **Update kanban regularly**
   - Add progress notes
   - Update blockers
   - Signal readiness

4. **Use PR workflow**
   - Create PR via `sc feature ready-to-merge` or GitHub
   - Merge via GitHub UI, not CLI
   - Review before merging

5. **Validate before merging**
   - Feature should be in `04_validating/` or `05_complete/`
   - All tests passing
   - Documentation complete

### ❌ DON'T:

1. **Don't create feature branches without approval**
   - Will fail validation
   - Causes confusion

2. **Don't merge directly with git**
   - Always use PR workflow
   - Ensures review and CI checks

3. **Don't work on main branch**
   - Main is for tracking only
   - All work happens on feature branches

4. **Don't merge incomplete features**
   - Feature should be in validating phase
   - All requirements implemented

5. **Don't skip kanban updates**
   - Kanban is coordination tool
   - Team needs visibility

---

## Troubleshooting

### "Cannot create branch - feature not approved"

**Solution**: Feature must have approved kanban card on main

```bash
git checkout main
sc feature approve feature-name --kanban-card=card-id
sc feature branch-create feature-name
```

### "Feature exists on main but not on branch"

**Solution**: Feature was approved but branch not created yet

```bash
sc feature branch-create feature-name
```

### "Merge conflict on feature folder"

**Solution**: Feature moved on main since branch created

```bash
git checkout feature/feature-name
git rebase main
# Resolve conflicts
git push --force-with-lease
```

---

## Related SOPs

- [SOP-0.1.05: Requirements & Planning](../general/SOP-0.1.05-requirements-planning.md)
- [SOP-0.1.12: Git Workflow & Code Review](../general/SOP-0.1.12-git-workflow.md)
<!-- Related: SOP-T.05: Feature Development (deprecated) -->

---

## Changelog

| Version | Date       | Changes             |
| ------- | ---------- | ------------------- |
| 1.0     | 2025-11-24 | Initial SOP created |

---

**Maintained By**: Supernal Coding Core Team  
**Review Frequency**: Quarterly or after major workflow changes
