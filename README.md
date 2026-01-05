# @supernal/interface

**Universal AI Interface** - Make any application AI-controllable with decorators.

Open source core framework for creating AI-friendly applications. Decorate your functions with `@Tool` and automatically expose them to AI assistants with full type safety.

## Features

### ✅ Core Framework (Open Source)

- **Decorator System** - `@Tool`, `@ToolProvider`, `@Component` decorators
- **Tool Registry** - Automatic tool discovery and registration  
- **Adapter System** - Swap chat UI providers (CopilotKit, native, custom)
- **Storage** - LocalStorage, Chrome extension, memory adapters
- **Testing Utilities** - Playwright helpers, Gherkin parsing, test runners
- **Type Safety** - Full TypeScript support with inference
- **React Hooks** - `useToolBinding`, `usePersistedState`, `useChatWithContext`

### 🚀 Enterprise Features

Advanced capabilities available at [https://supernal.ai/enterprise](https://supernal.ai/enterprise):

- **Test Generation** - Auto-generate tests from decorators
- **Story System** - 50-80% performance boost via test composition
- **Architecture Visualization** - Real-time component trees
- **Advanced AI** - Multi-model routing, parameter extraction
- **File Storage** - Node.js filesystem adapters
- **Audit & Compliance** - Enterprise logging and tracking

## Installation

```bash
npm install @supernal/interface
```

## Quick Start

### 1. Decorate Your Functions

```typescript
import { Tool } from '@supernal/interface';

class TodoList {
  @Tool({
    name: 'add_todo',
    description: 'Add a new todo item',
    category: 'productivity'
  })
  async addTodo(text: string) {
    // Your implementation
  }
}
```

### 2. Choose an Adapter

```typescript
import { CopilotKitAdapter, ChatUIProvider } from '@supernal/interface';

const adapter = createCopilotKitAdapter({
  autoRegisterTools: true
});

function App() {
  return (
    <ChatUIProvider adapter={adapter}>
      <YourApp />
    </ChatUIProvider>
  );
}
```

### 3. AI Can Now Call Your Functions

That's it! Your decorated functions are now accessible to AI assistants with full type checking.

## Adapters

### CopilotKit

```typescript
import { createCopilotKitAdapter } from '@supernal/interface';

const adapter = createCopilotKitAdapter({
  autoRegisterTools: true,
  autoRegisterReadables: true
});
```

### Custom Adapter

```typescript
import { ChatUIAdapter } from '@supernal/interface';

class MyCustomAdapter implements ChatUIAdapter {
  name = 'my-adapter';
  
  registerTools(tools) {
    // Convert to your format
  }
  
  render(props) {
    return <MyChat {...props} />;
  }
}
```

## Testing

```typescript
import { GherkinParser, TestRunner } from '@supernal/interface/testing';

// Parse Gherkin features
const feature = GherkinParser.parseFeature(featureText);

// Generate tests
const tests = await TestRunner.generateTests({
  includeGherkin: true,
  framework: 'jest'
});
```

## Storage

```typescript
import { StateManager, LocalStorageAdapter } from '@supernal/interface/storage';

const storage = StateManager.getInstance('myapp', new LocalStorageAdapter());

await storage.setState('user', { name: 'Alice' });
const user = await storage.getState('user');
```

## Documentation

- [Full Documentation](https://supernal.ai/docs)
- [API Reference](https://supernal.ai/docs/api)
- [Examples](https://github.com/supernalintelligence/supernal-interface/tree/main/examples)

## Community

- [Discord](https://discord.gg/supernal-ai)
- [GitHub Discussions](https://github.com/supernalintelligence/supernal-interface/discussions)
- [Twitter](https://twitter.com/supernal_ai)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](https://github.com/supernalintelligence/supernal-interface/blob/main/CONTRIBUTING.md).

## License

MIT © 2025 Supernal AI

See [LICENSE](LICENSE) for details.

## Enterprise Edition

Need advanced features like test generation, architecture visualization, or enterprise support?

Visit [https://supernal.ai/enterprise](https://supernal.ai/enterprise)

---

**Open source core • Enterprise features available • Built with TypeScript**







