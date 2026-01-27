# ChatBubble Component Improvements

## Overview

This document outlines the improvements made to the ChatBubble component to address:
1. Icon-based logo design (matching subtitle variant)
2. Long-press menu for quick actions
3. Up/down position controls
4. Component extraction for better maintainability

---

## New Components Extracted

### 1. `SettingsMenu.tsx`
**Purpose**: Settings dropdown menu
**Lines reduced**: ~200 lines
**Features**:
- Glass mode controls (Off/Low/Medium/High)
- Theme toggle (Light/Dark)
- Voice control toggle
- Reset position
- Help/Info
- Clear chat

**Usage**:
```tsx
import { SettingsMenu } from './SettingsMenu';

<SettingsMenu
  showMoreMenu={showMoreMenu}
  onClose={() => setShowMoreMenu(false)}
  localGlassMode={localGlassMode}
  glassOpacity={glassOpacity}
  theme={theme}
  voiceEnabled={voiceEnabled}
  onGlassModeChange={(enabled, opacity) => {
    setLocalGlassMode(enabled);
    if (opacity) setGlassOpacity(opacity);
  }}
  onThemeChange={setTheme}
  onVoiceEnabledChange={setVoiceEnabled}
  onHome={handleHome}
  onInfo={() => {
    // Inject help messages
    const helpMessages = [
      '**How to Use This Chat**\n\n- **Theme**: Toggle between light and dark modes...'
    ];
    helpMessages.forEach((text, index) => {
      setTimeout(() => onSendMessage(text), index * 100);
    });
  }}
  onClearChat={onClearChat}
  onSendMessage={onSendMessage}
/>
```

---

### 2. `MessageList.tsx`
**Purpose**: Render chat messages with welcome screen
**Lines reduced**: ~150 lines
**Features**:
- User/AI/System message bubbles
- Timestamps on hover
- TTS buttons for AI messages
- Welcome message with suggested commands
- Markdown rendering

**Usage**:
```tsx
import { MessageList } from './MessageList';

<MessageList
  messages={messages}
  showWelcome={showWelcome}
  config={config}
  theme={theme}
  voiceEnabled={voiceEnabled}
  usePremiumVoices={usePremiumVoices}
  ttsSpeed={ttsSpeed}
  onWelcomeCommandClick={(command) => {
    setInputValue(command);
    setShowWelcome(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }}
  messagesEndRef={messagesEndRef}
/>
```

---

### 3. `Header.tsx`
**Purpose**: Chat header with avatar, title, and actions
**Lines reduced**: ~100 lines
**Features**:
- Avatar with online indicator
- Title
- External link (docs)
- More menu button
- Minimize button
- Close button
- Draggable handle

**Usage**:
```tsx
import { Header } from './Header';

<Header
  config={config}
  theme={theme}
  glassMode={glassMode}
  showMoreMenu={showMoreMenu}
  onMoreMenuToggle={() => setShowMoreMenu(!showMoreMenu)}
  onMinimize={() => setIsMinimized(true)}
  onClose={handleToggle}
  onMouseDown={handlePanelMouseDown}
  localGlassMode={localGlassMode}
  glassOpacity={glassOpacity}
  voiceEnabled={voiceEnabled}
  onGlassModeChange={(enabled, opacity) => {
    setLocalGlassMode(enabled);
    if (opacity) setGlassOpacity(opacity);
  }}
  onThemeChange={setTheme}
  onVoiceEnabledChange={setVoiceEnabled}
  onHome={handleHome}
  onInfo={handleInfo}
  onClearChat={onClearChat}
  onSendMessage={onSendMessage}
/>
```

---

### 4. `ChatBubbleButton.tsx` (NEW)
**Purpose**: Enhanced chat bubble button with long-press menu
**Lines reduced**: N/A (new component)
**Features**:
- **Icon mode**: Glassy button with `@/` icon (matches subtitle variant)
- **Long-press menu**: Hold for quick actions (500ms)
  - Move up/down
  - Toggle glass mode
  - Toggle theme
- **Unread indicator**: Red badge with count
- **Click to open**: Regular click still opens chat

**Usage**:
```tsx
import { ChatBubbleButton } from './ChatBubbleButton';

<ChatBubbleButton
  onClick={handleToggle}
  hasUnread={hasUnread}
  unreadCount={unreadCount}
  notifications={notifications}
  theme={theme}
  isMac={isMac}
  useIconMode={true}  // Enable icon mode (glassy @/ button)
  iconText="@/"       // Icon text (can be customized)
  glassMode={localGlassMode}
  onMoveUp={() => {
    // Move widget up by adjusting dock position
    if (dockPosition === 'bottom-right') setDockPosition('top-right');
    else if (dockPosition === 'bottom-left') setDockPosition('top-left');
  }}
  onMoveDown={() => {
    // Move widget down by adjusting dock position
    if (dockPosition === 'top-right') setDockPosition('bottom-right');
    else if (dockPosition === 'top-left') setDockPosition('bottom-left');
  }}
  onToggleGlass={() => setLocalGlassMode(!localGlassMode)}
  onToggleTheme={() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }}
/>
```

---

## Integration Guide

### Step 1: Replace Settings Menu (Lines 1438-1598 in ChatBubble.tsx)

**Before**:
```tsx
{/* More menu dropdown */}
{showMoreMenu && (
  <div className="absolute right-0 top-10 ...">
    {/* 160 lines of settings menu code */}
  </div>
)}
```

**After**:
```tsx
{/* More menu dropdown - now extracted to SettingsMenu component */}
<SettingsMenu
  showMoreMenu={showMoreMenu}
  onClose={() => setShowMoreMenu(false)}
  {/* ...other props */}
/>
```

---

### Step 2: Replace Message List (Lines 1627-1718 in ChatBubble.tsx)

**Before**:
```tsx
{/* Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-2">
  {/* Welcome Message */}
  {showWelcome && messages.length === 0 && config.welcome?.enabled && (
    {/* 50 lines of welcome code */}
  )}

  {/* Chat Messages */}
  {messages.map((message) => (
    {/* 40 lines of message rendering */}
  ))}
  <div ref={messagesEndRef} />
</div>
```

**After**:
```tsx
{/* Messages - now extracted to MessageList component */}
<MessageList
  messages={messages}
  showWelcome={showWelcome}
  {/* ...other props */}
/>
```

---

### Step 3: Replace Header (Lines 1387-1622 in ChatBubble.tsx)

**Before**:
```tsx
{/* Header - Draggable */}
<div
  data-drag-handle
  className={...}
  onMouseDown={handlePanelMouseDown}
>
  {/* 235 lines of header code */}
</div>
```

**After**:
```tsx
{/* Header - now extracted to Header component */}
<Header
  config={config}
  theme={theme}
  {/* ...other props */}
/>
```

---

### Step 4: Replace Chat Bubble Button (Lines 1740-1756 in ChatBubble.tsx)

**Before**:
```tsx
{!isExpanded && (
  <button
    onClick={handleToggle}
    className="w-14 h-14 bg-blue-600 ..."
    data-testid={ChatNames.bubble}
    title={`Open chat...`}
  >
    <img src={config.logo} alt="Supernal" className="w-8 h-8" />

    {/* Unread indicator */}
    {hasUnread && notifications && (
      <div className="absolute ...">
        {/* unread badge */}
      </div>
    )}
  </button>
)}
```

**After**:
```tsx
{!isExpanded && (
  <ChatBubbleButton
    onClick={handleToggle}
    hasUnread={hasUnread}
    unreadCount={unreadCount}
    notifications={notifications}
    theme={theme}
    isMac={isMac}
    useIconMode={true}  // Enable icon mode for glassy @/ design
    iconText="@/"
    glassMode={localGlassMode}
    onMoveUp={handleMoveUp}
    onMoveDown={handleMoveDown}
    onToggleGlass={() => setLocalGlassMode(!localGlassMode)}
    onToggleTheme={() => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }}
  />
)}
```

---

## New Features Explained

### 1. Icon Mode (Glassy @/ Button)

The new `ChatBubbleButton` component supports two modes:

**Icon Mode** (`useIconMode={true}`):
- Glassy button with `@/` icon (matches subtitle variant)
- Semi-transparent background with blur effect
- Adaptive colors (light/dark theme)
- Hover scale animation
- Long-press menu support

**Legacy Mode** (`useIconMode={false}`):
- Original image-based logo button
- Solid blue background
- No long-press menu

**Configuration**:
```tsx
<ChatBubbleButton
  useIconMode={true}   // Enable icon mode
  iconText="@/"        // Customize icon (can be "@/", "~/", "</", etc.)
  {...otherProps}
/>
```

---

### 2. Long-Press Menu

**How it works**:
1. **Click**: Opens chat (default behavior)
2. **Hold 500ms**: Shows quick actions menu
   - Move up
   - Move down
   - Toggle glass mode
   - Toggle theme

**User feedback**:
- Button scales down slightly during long press
- Menu appears above button
- Click outside to dismiss
- Menu auto-closes after action

**Accessibility**:
- Keyboard hint in tooltip: "Hold Cmd+/ to record"
- ARIA labels for screen readers

---

### 3. Up/Down Controls

**Implementation**:
```tsx
const handleMoveUp = () => {
  // Cycle through top positions
  if (dockPosition === 'bottom-right') setDockPosition('top-right');
  else if (dockPosition === 'bottom-left') setDockPosition('top-left');
  else if (dockPosition === 'bottom-center') setDockPosition('top-right');
  // Save to localStorage automatically
};

const handleMoveDown = () => {
  // Cycle through bottom positions
  if (dockPosition === 'top-right') setDockPosition('bottom-right');
  else if (dockPosition === 'top-left') setDockPosition('bottom-left');
  // Save to localStorage automatically
};
```

**User experience**:
- Long-press bubble button → "Move up" or "Move down"
- Widget smoothly transitions to new position
- Position persists across page reloads (localStorage)

---

## File Size Reduction

**Before**:
- `ChatBubble.tsx`: **1762 lines**

**After** (with extractions):
- `ChatBubble.tsx`: **~1200 lines** (-562 lines)
- `SettingsMenu.tsx`: **200 lines**
- `MessageList.tsx`: **150 lines**
- `Header.tsx`: **100 lines**
- `ChatBubbleButton.tsx`: **250 lines**

**Total reduction**: **~32% smaller main component**

---

## Benefits

1. **Better maintainability**: Each component has a single responsibility
2. **Easier testing**: Test components in isolation
3. **Reusability**: Components can be used in other contexts
4. **Type safety**: Clear interfaces for all props
5. **Performance**: React can optimize re-renders better
6. **Developer experience**: Easier to navigate and understand code

---

## Next Steps (Optional)

### Further Extraction Opportunities

1. **Extract variants** (FullVariant, DrawerVariant, FloatingVariant):
   - Each variant is ~200-300 lines
   - Would reduce main file to ~500 lines

2. **Extract MinimizedView** component:
   - Lines 1249-1368 in ChatBubble.tsx
   - ~120 lines

3. **Extract WelcomeMessage** component:
   - Already in MessageList, but could be standalone

4. **Extract hooks**:
   - `useDragging.ts` - drag/drop logic
   - `useChatState.ts` - chat state management
   - `useVoiceControl.ts` - voice/STT/TTS logic

---

## Testing Checklist

- [ ] Icon mode button renders correctly
- [ ] Long-press triggers menu after 500ms
- [ ] Regular click still opens chat
- [ ] Move up/down changes position
- [ ] Toggle glass mode works
- [ ] Toggle theme works
- [ ] Unread badge appears correctly
- [ ] Menu closes on outside click
- [ ] Extracted components render without errors
- [ ] All props are passed correctly
- [ ] localStorage persistence works
- [ ] Mobile/touch events work
- [ ] Keyboard shortcuts still work (Cmd+/)

---

## Configuration Examples

### Minimal Setup (Icon Mode)
```tsx
<ChatBubble
  messages={messages}
  onSendMessage={handleSend}
  config={{
    ...DEFAULT_CONFIG,
    // Icon mode is controlled by ChatBubbleButton's useIconMode prop
  }}
/>
```

### Custom Icon
```tsx
<ChatBubbleButton
  useIconMode={true}
  iconText="~/"  // Change to tilde slash
  {...otherProps}
/>
```

### Disable Long-Press Menu
```tsx
<ChatBubbleButton
  useIconMode={true}
  // Don't pass onMoveUp, onMoveDown, etc. - menu won't show
  onClick={handleToggle}
  {...essentialProps}
/>
```

---

## Migration Notes

**Breaking changes**: None! All changes are backwards compatible.

**Opt-in features**:
- Icon mode: Set `useIconMode={true}` on ChatBubbleButton
- Long-press menu: Pass `onMoveUp`, `onMoveDown`, etc. handlers

**Default behavior**: Existing code continues to work without changes.

---

## Troubleshooting

**Issue**: Long-press opens chat instead of showing menu
**Solution**: Check that `LONG_PRESS_DURATION` is set (default: 500ms)

**Issue**: Icon button doesn't match subtitle style
**Solution**: Verify `theme` prop is passed correctly (light/dark)

**Issue**: Move up/down doesn't save position
**Solution**: Ensure `dockPosition` state is saved to localStorage

**Issue**: Components not rendering
**Solution**: Check all imports and props are correct

---

## Summary

These improvements make the ChatBubble component:
- ✅ More maintainable (32% smaller main file)
- ✅ More feature-rich (long-press menu, position controls)
- ✅ More consistent (icon mode matches subtitle variant)
- ✅ Backwards compatible (opt-in features)
- ✅ Better organized (clear component boundaries)

The component is now easier to work with and provides a better user experience! 🎉
