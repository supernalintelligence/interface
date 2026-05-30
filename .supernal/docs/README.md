# Documentation

This directory contains the project documentation system organized by workflow phases.

## Structure

### Content Types (Dashboard v2 Workflow)

- **problems/**: Core problems and opportunities to solve (MarkdownDocument)
- **stories/**: User stories and general narratives (MarkdownDocument)
- **compliance/**: Regulatory compliance requirements and audit trails (ComplianceDocument)
- **requirements/**: All requirements organized by type
  - **requirements/functional/**: Gherkin-based functional requirements (Requirement)
  - **requirements/technical/**: Technical specs and implementation requirements (Requirement)
- **architecture/**: System design and architecture documentation (ArchitectureDocument)
- **tests/**: Testing documentation, strategies, and status (TestDocument)
- **verification/**: Verification and validation requirements (Requirement)
- **kanban/**: Kanban workflow documentation and tracking

### Workflow Order

1. **Problems** -> 2. **Stories** -> 3. **Compliance** -> 4. **Functional Requirements** -> 
5. **Architecture** -> 6. **Technical Requirements** -> 7. **Tests** -> 8. **Verification**

## Usage

Use the `sc docs` command to interact with this system:

```bash
sc docs generate              # Generate documentation
sc docs validate              # Validate documentation structure
sc docs serve                 # Serve documentation locally
```

See `sc docs --help` for full documentation.
