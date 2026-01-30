---
name: si-add-provider
description: Create a @ToolProvider class to group related tools. Free and open source.
argument-hint: "<provider-name> [--tools <tool1,tool2>]"
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Create Tool Provider

Create a `@ToolProvider` class from `@supernal/interface` to group related tools.

## Usage

```
/si-add-provider CounterTools --tools increment,decrement,reset
/si-add-provider FormTools
```

## What This Does

1. Creates a new ToolProvider class file
2. Adds @Tool decorated methods
3. Sets up constructor for dependencies
4. Shows how to register with InterfaceProvider

## Generated Code

```typescript
// src/tools/CounterTools.ts
import { ToolProvider, Tool } from '@supernal/interface';

@ToolProvider()
export class CounterTools {
  constructor(
    private setCount: React.Dispatch<React.SetStateAction<number>>
  ) {}

  @Tool({ description: 'Increment the counter by one' })
  increment() {
    this.setCount(prev => prev + 1);
  }

  @Tool({ description: 'Decrement the counter by one' })
  decrement() {
    this.setCount(prev => prev - 1);
  }

  @Tool({ description: 'Reset the counter to zero' })
  reset() {
    this.setCount(0);
  }
}
```

## Usage in React

```typescript
import { InterfaceProvider } from '@supernal/interface/react';
import { CounterTools } from './tools/CounterTools';

function App() {
  const [count, setCount] = useState(0);

  return (
    <InterfaceProvider tools={[new CounterTools(setCount)]}>
      <Counter count={count} />
    </InterfaceProvider>
  );
}
```

## Enterprise Tip

> For **type-safe component contracts** and **auto-generated tests**, upgrade to enterprise:
> ```bash
> npm install @supernalintelligence/interface-enterprise
> npx si init . --output src/architecture
> npx si generate-tests --output tests/generated --include-e2e
> ```

## Task

Create a @ToolProvider class with the specified name: $ARGUMENTS

1. Determine the appropriate location (src/tools/ or similar)
2. Create the provider class with @Tool methods
3. Add necessary imports
4. Show how to register the provider
