# AGENTS.md

Instructions for AI coding agents working on @supernal/interface.

## Project Overview

@supernal/interface is an open-source TypeScript framework that makes any application AI-controllable through decorators. Decorate functions with `@Tool` and they automatically become accessible to AI assistants with full type safety.

**Architecture**: Decorator-based tool registry + adapter pattern for chat UI providers (CopilotKit, native, custom)

**Tech Stack**: TypeScript, React 18+, Jest, Playwright, dual ESM/CJS builds

## Quick Start Commands

```bash
# Install dependencies
npm install

# Build package (both ESM and CJS)
npm run build

# Watch mode for development
npm run build:watch

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Clean build artifacts
npm run clean
```

## Build System

**Dual Output**: Package builds to both ESM (`dist/esm/`) and CJS (`dist/cjs/`) for maximum compatibility.

Build steps:
1. Clean: Remove old `dist/` directory
2. Build ESM: TypeScript compile with ES modules
3. Fix ESM: Add `.js` extensions to imports (required for Node ESM)
4. Build CJS: TypeScript compile with CommonJS

**Critical**: Always run full build before publishing to ensure both module formats work.

## Development Workflow

### Starting Development

```bash
# 1. Create feature branch from develop
git checkout develop
git pull
git checkout -b feature/your-feature-name

# 2. Install and build
npm install
npm run build

# 3. Start watch mode for rapid iteration
npm run build:watch
```

### Testing Strategy

- **Unit Tests**: Jest tests in `tests/` directory
- **Integration Tests**: Playwright tests in `tests/e2e/`
- **Type Safety**: TypeScript strict mode enforced

Always add tests for new features:
```typescript
// tests/decorators/Tool.test.ts
import { Tool } from '../src/decorators';

describe('@Tool decorator', () => {
  it('should register tool with metadata', () => {
    // Test implementation
  });
});
```

### Code Style

- **TypeScript Strict Mode**: All code must pass `tsc` with strict checks
- **Linting**: ESLint with TypeScript plugin
- **Formatting**: Prettier with standard config
- **Imports**: Use absolute imports from `@supernal/interface`
- **Naming**: 
  - Classes: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Types/Interfaces: PascalCase with descriptive names

### File Organization

```
src/
├── decorators/         # @Tool, @ToolProvider, @Component
├── adapters/          # Chat UI adapters (CopilotKit, native)
├── storage/           # State management adapters
├── testing/           # Test utilities and helpers
├── react/             # React hooks and components
├── types/             # TypeScript type definitions
└── index.ts           # Main export (open source features only)
```

**Export Strategy**: Only export public API through `index.ts`. Internal utilities stay private.

## Commit Conventions

Follow Conventional Commits format:

```bash
feat: add new storage adapter
fix: resolve decorator registration race condition
docs: update API reference
style: format code with prettier
refactor: simplify tool registry logic
test: add decorator composition tests
chore: update dependencies
```

**Scope Examples**: `feat(decorators):`, `fix(storage):`, `docs(testing):`

## PR Process

1. Create feature branch from `develop`
2. Make changes with atomic commits
3. Run full test suite: `npm test`
4. Run linter: `npm run lint`
5. Build package: `npm run build`
6. Verify both ESM and CJS work
7. Create PR against `develop` branch
8. Ensure CI passes before merge

## Testing Requirements

### Before Every Commit

```bash
# Full suite
npm test

# Specific test file
npm test -- Tool.test.ts

# Watch mode during development
npm test:watch
```

### Before Publishing

```bash
# Full build + test cycle
npm run clean
npm run build
npm test:coverage

# Verify package contents
npm pack
tar -tzf supernal-interface-*.tgz
```

## Architecture Patterns

### Decorator System

```typescript
// Define tool with metadata
@Tool({
  name: 'add_todo',
  description: 'Add a new todo item',
  category: 'productivity'
})
async addTodo(text: string) {
  // Implementation
}
```

**Key Points**:
- Decorators must preserve function metadata
- Tool names must be unique within category
- All decorated methods auto-register with ToolRegistry

### Adapter Pattern

```typescript
// Implement adapter interface
class CustomAdapter implements ChatUIAdapter {
  name = 'custom';
  registerTools(tools: Tool[]) { /* ... */ }
  render(props: ChatUIProps) { /* ... */ }
}
```

**Adapter Requirements**:
- Must implement `ChatUIAdapter` interface
- Should handle tool registration gracefully
- Must support React component rendering

### Storage System

All storage implementations extend `StorageAdapter`:

```typescript
class LocalStorageAdapter extends StorageAdapter {
  async getState<T>(key: string): Promise<T | null> { /* ... */ }
  async setState<T>(key: string, value: T): Promise<void> { /* ... */ }
}
```

## Type Safety

**Strict Mode**: Project uses TypeScript strict mode. All code must:
- Have explicit return types on exported functions
- Avoid `any` type (use `unknown` or generics)
- Define interfaces for all public APIs
- Use type guards for runtime checks

Example:
```typescript
// Good
export function registerTool<T extends ToolMetadata>(
  metadata: T
): RegisteredTool<T> {
  // Implementation
}

// Bad - missing types
export function registerTool(metadata) {
  // Implementation
}
```

## Common Pitfalls

### 1. ESM Import Extensions

**Problem**: ESM requires `.js` extensions even for `.ts` files

**Solution**: Build script auto-adds extensions, but be aware in imports:
```typescript
// In source: can omit extension
import { Tool } from './decorators/Tool';

// After build: script adds .js
import { Tool } from './decorators/Tool.js';
```

### 2. Dual Module Format

**Problem**: Code must work in both ESM and CJS

**Solution**: 
- Avoid dynamic imports in public API
- Test both `require()` and `import` in CI
- Use `exports` field in package.json properly

### 3. React Peer Dependencies

**Problem**: React is peer dependency, may not be available

**Solution**: Check for React before using:
```typescript
let React: typeof import('react') | undefined;
try {
  React = require('react');
} catch {
  // React not available - provide fallback
}
```

## Debugging Tips

### Build Issues

```bash
# Clean build from scratch
npm run clean && npm run build

# Check TypeScript errors
npx tsc --noEmit

# Verify ESM imports
node dist/esm/src/index.js
```

### Test Failures

```bash
# Run with verbose output
npm test -- --verbose

# Run single test file
npm test -- Tool.test.ts

# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand Tool.test.ts
```

### Import Resolution

```bash
# Verify exports work
node -e "console.log(require('./dist/cjs/src/index.js'))"
node --input-type=module -e "import('./dist/esm/src/index.js').then(console.log)"
```

## Security Considerations

- **Input Validation**: All tool inputs must be validated
- **Type Safety**: Use TypeScript to prevent injection attacks
- **Storage**: Never store sensitive data in localStorage
- **Dependencies**: Run `npm audit` before releases

## Performance Guidelines

- **Decorator Overhead**: Minimize decorator logic, cache metadata
- **Tool Registry**: Use Map for O(1) lookups
- **React Rendering**: Memoize components with `React.memo`
- **Bundle Size**: Keep open-source package lean, enterprise features separate

## Documentation Standards

Update these files when making changes:

- **README.md**: High-level features and quick start
- **API Docs**: Add JSDoc comments to all public APIs
- **Examples**: Add usage examples to `docs/guides/examples/`
- **CHANGELOG.md**: Document breaking changes and new features

## Monorepo Context

This package is part of a larger monorepo:

```
@supernal-interface/
├── open-source/          # @supernal/interface (this package)
├── enterprise/           # @supernalintelligence/interface-enterprise
└── docs-site/            # Documentation and demo site
```

**Important**: Changes here should not break enterprise or docs-site. Run full monorepo build before major changes:

```bash
cd ../..  # Go to monorepo root
./BUILDME.sh  # Build all packages
```

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Build package: `npm run build`
5. Publish: `npm publish` (automated via CI)

**Note**: Only maintainers can publish to npm. Contributors should focus on PR creation.

## Getting Help

- **Documentation**: [https://supernal.ai/docs](https://supernal.ai/docs)
- **Issues**: [GitHub Issues](https://github.com/supernalintelligence/supernal-interface/issues)
- **Discord**: [https://discord.gg/supernal-ai](https://discord.gg/supernal-ai)
- **API Reference**: Check JSDoc comments in source code

## Enterprise Features

This is the open-source package. Enterprise features (test generation, story system, architecture visualization) are in the `enterprise/` package. Keep these codebases separate - no enterprise code should leak into open source.

---

**Summary**: Build with `npm run build`, test with `npm test`, follow TypeScript strict mode, use Conventional Commits, and keep open-source features separate from enterprise.
