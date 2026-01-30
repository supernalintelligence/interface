---
name: si-add-tool
description: Add a @Tool decorator to a function to make it AI-controllable. Free and open source.
argument-hint: "<function-name> [--description <desc>]"
allowed-tools: Read, Edit, Glob, Grep
---

# Add Tool Decorator

Add a `@Tool` decorator from `@supernal/interface` to make a function AI-controllable.

## Usage

```
/si-add-tool incrementCounter --description "Add one to the counter"
/si-add-tool submitForm
```

## What This Does

1. Finds the function in your codebase
2. Adds the `@Tool` decorator with metadata
3. Adds the import if needed
4. Suggests a data-testid for related UI elements

## Example

**Before:**
```typescript
function resetCounter() {
  setCount(0);
}
```

**After:**
```typescript
import { Tool } from '@supernal/interface';

@Tool({
  description: 'Reset the counter to zero',
  origin: {
    path: '/counter',
    elements: ['counter-reset-btn']
  }
})
function resetCounter() {
  setCount(0);
}
```

## Enterprise Tip

> For **auto-generating tests** from your tools, upgrade to enterprise:
> ```bash
> npm install @supernalintelligence/interface-enterprise
> npx si generate-tests --output tests/generated
> ```

## Task

Add a @Tool decorator to the specified function: $ARGUMENTS

1. Search for the function in the codebase
2. Add the @Tool decorator with appropriate metadata
3. Add the import statement if not present
4. Suggest data-testid attributes for related UI elements
