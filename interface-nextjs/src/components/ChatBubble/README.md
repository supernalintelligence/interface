# ChatBubble Component Structure

This directory contains the refactored ChatBubble component, broken down into smaller, more maintainable modules.

## File Structure

```
ChatBubble/
├── README.md           # This file
├── index.ts            # Public exports (clean API)
├── ChatBubble.tsx      # Main component (1738 lines)
├── types.ts            # TypeScript type definitions (95 lines)
├── constants.ts        # Constants, theme classes, defaults (199 lines)
├── Avatar.tsx          # Avatar sub-component (23 lines)
└── InputField.tsx      # Input field sub-component (85 lines)
```

## Module Breakdown

### `types.ts` (95 lines)
All TypeScript interfaces and type definitions:
- `Message` - Message data structure
- `Position` - Chat bubble positioning options
- `Variant` - Display variants (full, floating, drawer)
- `DisplayMode` - Auto-switching display modes
- `ChatBubbleConfig` - Configuration options
- `ChatBubbleProps` - Main component props
- `InputFieldProps` - Input component props
- `AvatarProps` - Avatar component props

### `constants.ts` (199 lines)
All constants, styles, and theme configurations:
- `DEFAULT_LOGO` - Base64 encoded Supernal logo
- `ChatNames` - Component testid mappings
- `DOCK_POSITIONS` - Positioning styles for different dock positions
- `INLINE_STYLES` - React inline styles (theme-aware)
- `THEME_CLASSES` - Tailwind CSS class configurations
- `DEFAULT_CONFIG` - Default configuration values

### `InputField.tsx` (85 lines)
Reusable input field component with:
- Voice input support (microphone button)
- Send button
- Compact and full-size variants
- Glass mode styling support
- Keyboard shortcuts integration

### `Avatar.tsx` (23 lines)
Simple avatar rendering component:
- String avatars (emoji or initials)
- Image avatars
- Size variants (small, normal)

### `index.ts`
Clean public exports for all types, constants, and components.
Allows imports like:
```typescript
import { ChatBubble, THEME_CLASSES, type ChatBubbleProps } from './ChatBubble';
```

## Main Component

The main `ChatBubble.tsx` component (1738 lines, down from 2100) is now located inside this folder and imports the extracted modules. It focuses on:
- State management
- Business logic
- Variant rendering (Drawer, Floating, Full)
- Event handlers
- Effects and hooks

## Benefits of This Structure

1. **Smaller Files**: Main component reduced by ~17% (362 lines)
2. **Better Organization**: Related code grouped logically
3. **Easier Maintenance**: Find and update specific features faster
4. **Reusability**: Sub-components can be reused elsewhere
5. **Better Testing**: Easier to test individual modules
6. **Type Safety**: Centralized type definitions
7. **Cleaner Imports**: Single source of truth for exports

## Backup

A backup of the original monolithic file is available at:
`../ChatBubble.tsx.backup` (2100 lines)

## Migration Notes

All imports should work seamlessly. The component API remains unchanged:
```typescript
import { ChatBubble } from './components/ChatBubble';
// or
import { ChatBubble } from './components/ChatBubble/index';
```
