# Workflow State Diagrams

This document contains Mermaid state diagrams that visualize the workflow processes for the Supernal Coding system.

## 🔄 Automatic Requirement Git Integration Flow (REQ-045)

```mermaid
graph TD
    A["User runs 'sc req' command"] --> B{Command Type?}

    B -->|"new, update"| C["WRITE Operation"]
    B -->|"show, list, validate"| D["READ Operation"]

    C --> E["Execute req command logic"]
    E --> F["✅ Command completes successfully"]
    F --> G["🔄 AUTO: Background git integration"]
    G --> H["Check current branch"]
    H --> I["Stash non-req changes"]
    I --> J["Switch to main"]
    J --> K["Commit requirement to main"]
    K --> L["Push to origin/main"]
    L --> M["Switch back to feature branch"]
    M --> N["Restore stashed changes"]
    N --> O["✅ Silent completion"]

    D --> P["🔄 AUTO: Check if sync needed"]
    P --> Q{Requirements outdated?}
    Q -->|"Yes"| R["Sync latest from main"]
    Q -->|"No"| S["Execute req command logic"]
    R --> S
    S --> T["✅ Command completes with latest data"]

    G --> Z1["❌ Git operation fails"]
    Z1 --> Z2["Log error + continue"]
    Z2 --> Z3["User sees: 'Warning: Could not sync requirements'"]
    Z3 --> Z4["Primary command still succeeds"]

    style A fill:#e1f5fe
    style G fill:#e8f5e8
    style P fill:#e8f5e8
    style O fill:#c8e6c9
    style T fill:#c8e6c9
    style Z1 fill:#ffcdd2
    style Z4 fill:#fff3e0
```

**Key Integration Points:**

- **WRITE operations** (`sc req new`, `sc req update`): Auto-commit to main AFTER command succeeds
- **READ operations** (`sc req show`, `sc req list`): Auto-sync from main BEFORE command executes
- **ALL operations**: Completely transparent to user, primary command always succeeds
- **ERROR handling**: Git failures never block requirement commands

## 🔄 Main Workflow Decision Tree

```mermaid
graph TD
    A[User Input] --> B{Analyze Input}
    B --> C{Off-Topic?}
    C -->|Yes| D[Create Quick Feature Requirement]
    C -->|No| E{Conflicts with Current Work?}
    E -->|Yes| F[Document Conflict & Resolution]
    E -->|No| G{Determine Scope}

    G --> H{Epic Indicators?}
    H -->|Yes| I[Create Epic]
    G --> J{Requirement Indicators?}
    J -->|Yes| K[Create Requirement]
    G --> L{Task Indicators?}
    L -->|Yes| M[Create Task]

    D --> N[Save to Quick Features]
    F --> O[Update Current Work]
    I --> P[Epic Workflow]
    K --> Q[Requirement Workflow]
    M --> R[Task Workflow]

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style D fill:#f3e5f5
    style F fill:#ffebee
    style I fill:#e8f5e8
    style K fill:#e3f2fd
    style M fill:#fff8e1
```

## 🎯 Task Lifecycle States

```mermaid
stateDiagram-v2
    [*] --> TODO
    TODO --> DOING : Start Work
    DOING --> BLOCKED : Encounter Blocker
    BLOCKED --> DOING : Blocker Resolved
    DOING --> TESTING : Implementation Complete
    TESTING --> NEEDS_APPROVAL : Tests Pass + Requires Approval
    TESTING --> DONE : Tests Pass + Auto-Approve
    NEEDS_APPROVAL --> APPROVED : Manual Approval
    NEEDS_APPROVAL --> REJECTED : Approval Rejected
    APPROVED --> DONE : Final Completion
    REJECTED --> DOING : Address Feedback
    DONE --> [*]

    note right of NEEDS_APPROVAL
        Different approval types:
        - Standard (3 days)
        - High-Risk (1 day)
        - Security (4 hours)
    end note
```

## 🏗️ Epic Development Workflow

```mermaid
stateDiagram-v2
    [*] --> EPIC_CREATED
    EPIC_CREATED --> REQUIREMENTS_PLANNING : Define Requirements
    REQUIREMENTS_PLANNING --> REQUIREMENTS_READY : All Requirements Defined
    REQUIREMENTS_READY --> IMPLEMENTATION : Start Development
    IMPLEMENTATION --> TESTING : All Requirements Complete
    TESTING --> INTEGRATION : Unit Tests Pass
    INTEGRATION --> E2E_TESTING : Integration Tests Pass
    E2E_TESTING --> EPIC_COMPLETE : E2E Tests Pass
    EPIC_COMPLETE --> [*]

    IMPLEMENTATION --> BLOCKED : Dependency Issues
    BLOCKED --> IMPLEMENTATION : Dependencies Resolved
    TESTING --> IMPLEMENTATION : Tests Fail
    INTEGRATION --> IMPLEMENTATION : Integration Issues
    E2E_TESTING --> IMPLEMENTATION : E2E Failures

    note right of REQUIREMENTS_PLANNING
        Epic → Requirements → Tasks
        Multi-sprint planning
    end note
```

## 📋 Requirement Workflow

```mermaid
stateDiagram-v2
    [*] --> REQ_CREATED
    REQ_CREATED --> GHERKIN_WRITING : Write Scenarios
    GHERKIN_WRITING --> TEST_GENERATION : Generate Test Stubs
    TEST_GENERATION --> IMPLEMENTATION : Create Tasks
    IMPLEMENTATION --> UNIT_TESTING : Code Complete
    UNIT_TESTING --> INTEGRATION_TESTING : Unit Tests Pass
    INTEGRATION_TESTING --> REQ_COMPLETE : Integration Tests Pass
    REQ_COMPLETE --> [*]

    UNIT_TESTING --> IMPLEMENTATION : Unit Tests Fail
    INTEGRATION_TESTING --> IMPLEMENTATION : Integration Tests Fail
    IMPLEMENTATION --> BLOCKED : Dependencies Missing
    BLOCKED --> IMPLEMENTATION : Dependencies Ready

    note right of GHERKIN_WRITING
        Requirement → Gherkin → Tests
        Sprint-based delivery
    end note
```

## 🔄 Handoff Management States

```mermaid
stateDiagram-v2
    [*] --> NO_HANDOFF
    NO_HANDOFF --> ACTIVE : Create New Handoff
    NO_HANDOFF --> ACTIVE : Pickup Ready Handoff
    ACTIVE --> READY : Work Complete, Hand Off
    ACTIVE --> ARCHIVED : Work Complete, Fully Done
    READY --> ACTIVE : Next Agent Pickup
    READY --> ARCHIVED : Direct Completion
    ARCHIVED --> [*]

    ACTIVE --> ACTIVE : Continue Work
    READY --> OVERDUE : Timeout Exceeded
    OVERDUE --> ESCALATED : Escalation Required
    ESCALATED --> ACTIVE : Escalation Resolved

    note right of ACTIVE
        Only ONE active handoff
        at any time
    end note

    note right of READY
        Work complete,
        waiting for pickup
    end note
```

## 🧪 Test Completion Decision Flow

```mermaid
graph TD
    A[Tests Complete] --> B{All Tests Pass?}
    B -->|No| C[Fix Issues]
    C --> A
    B -->|Yes| D{Check Approval Category}

    D --> E{Auto-Approve?}
    E -->|Yes| F[DONE]
    E -->|No| G{Approval Type}

    G --> H[Standard Approval<br/>3 days]
    G --> I[High-Risk Approval<br/>1 day]
    G --> J[Security Approval<br/>4 hours]

    H --> K{Approved?}
    I --> K
    J --> K

    K -->|Yes| L[APPROVED]
    K -->|No| M[REJECTED]
    L --> F
    M --> N[Address Feedback]
    N --> A

    style F fill:#c8e6c9
    style M fill:#ffcdd2
    style L fill:#dcedc8
```

## 🚨 Priority-Based Workflow Routing

```mermaid
graph TD
    A[Work Item Created] --> B{Priority Analysis}
    B --> C[P0 - Critical]
    B --> D[P1 - High]
    B --> E[P2 - Medium]
    B --> F[P3 - Low]
    B --> G[P4 - Future]

    C --> H[Immediate Action<br/>Skip Planning]
    D --> I[Quick Planning<br/>1 Week Timeline]
    E --> J[Standard Planning<br/>2 Week Timeline]
    F --> K[Detailed Planning<br/>1 Month Timeline]
    G --> L[Research & Document<br/>Next Quarter]

    H --> M[Implement → Test → Deploy]
    I --> N[Plan → Implement → Test]
    J --> O[Plan → Implement → Test → Review]
    K --> P[Plan → Implement → Test → Polish]
    L --> Q[Research → Plan → Future Queue]

    style C fill:#ffebee
    style D fill:#fff3e0
    style E fill:#e8f5e8
    style F fill:#e3f2fd
    style G fill:#f3e5f5
```

## 🔄 Branch Management Workflow

```mermaid
stateDiagram-v2
    [*] --> MAIN_BRANCH
    MAIN_BRANCH --> FEATURE_BRANCH : Create Feature Branch
    FEATURE_BRANCH --> DEVELOPMENT : Start Development
    DEVELOPMENT --> TESTING : Implementation Complete
    TESTING --> READY_FOR_MERGE : Tests Pass
    READY_FOR_MERGE --> MERGED : PR Approved
    MERGED --> MAIN_BRANCH : Branch Merged
    MAIN_BRANCH --> [*]

    DEVELOPMENT --> BLOCKED : Issues Found
    BLOCKED --> DEVELOPMENT : Issues Resolved
    TESTING --> DEVELOPMENT : Tests Fail
    READY_FOR_MERGE --> DEVELOPMENT : PR Rejected

    note right of FEATURE_BRANCH
        Branch naming:
        feature/description
        fix/issue-description
        docs/update-description
    end note
```

## 📊 Approval Escalation Flow

```mermaid
graph TD
    A[Task Needs Approval] --> B{Approval Type}
    B --> C[Standard<br/>3 days]
    B --> D[High-Risk<br/>1 day]
    B --> E[Security<br/>4 hours]

    C --> F{Day 3 Reached?}
    D --> G{Day 1 Reached?}
    E --> H{4 Hours Reached?}

    F -->|Yes| I[Escalate to Team Lead]
    G -->|Yes| J[Escalate to Senior Team]
    H -->|Yes| K[Escalate to Management]

    F -->|No| L[Continue Review]
    G -->|No| L
    H -->|No| L

    I --> M{Resolved?}
    J --> M
    K --> M

    M -->|Yes| N[Approved/Rejected]
    M -->|No| O[Higher Escalation]

    style I fill:#fff3e0
    style J fill:#ffeb3b
    style K fill:#f44336
    style N fill:#4caf50
```

## 🎯 Decision Tree Integration

```mermaid
graph LR
    A[Agent Input] --> B[Intelligent Triage Rules]
    B --> C[Workflow Decision Tree]
    C --> D[Single Handoff Management]
    D --> E[Test Completion & Approval]
    E --> F[Workflow Execution]

    B --> G[Create Quick Feature Requirement]
    B --> H[Document Conflicts]
    B --> I[Route to Appropriate System]

    C --> J[Epic System]
    C --> K[Requirement System]
    C --> L[Kanban System]

    D --> M[Active Handoff]
    D --> N[Ready Handoff]
    D --> O[Archived Handoff]

    E --> P[Auto-Approve]
    E --> Q[Manual Approval]
    E --> R[Escalation]

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#e3f2fd
    style F fill:#fff8e1
```

---

_These diagrams provide visual representations of the workflow states and transitions, making it easier to understand and follow the system processes._
