# Ctrl+/ Voice Quick Record Feature

## Overview

The **Ctrl+/ Voice Quick Record** feature allows users to trigger voice recording instantly with automatic command execution, providing a seamless hands-free experience. Works everywhere, including when typing in input fields!

## How It Works

### User Experience

1. **Press Ctrl+/** (or **Cmd+/** on Mac) anywhere in the application - even while typing!
2. Chat automatically opens (if closed)
3. Voice recording starts immediately
4. Recording auto-stops after configured timeout
5. Command is automatically executed (if auto-execute is enabled)

### Key Features

- **⚡ Instant Activation**: No need to click buttons or navigate menus
- **🎯 Auto-Execution**: Recognized commands run automatically (configurable)
- **⏱️ Smart Timeout**: Configurable recording timeout (2-15 seconds)
- **🛑 Manual Stop**: Press ESC to cancel recording anytime
- **💾 Persistent Settings**: All preferences saved to localStorage
- **⌨️ Works Everywhere**: Even while typing in text input fields!

## Settings

### STT Auto-Record Timeout
- **Default**: 5 seconds
- **Range**: 2-15 seconds
- **Description**: How long to record before auto-stopping

### Auto-Execute Commands
- **Default**: Enabled
- **Description**: When enabled, recognized voice commands execute immediately. When disabled, text is filled into the input field (requires pressing Enter to send).

## Implementation Details

### Files Modified

1. **`src/lib/constants.ts`**
   - Added `STT_AUTO_RECORD_TIMEOUT_MS` constant (5000ms default)
   - Added `STT_AUTO_EXECUTE_COMMANDS` constant (true default)

2. **`src/components/ChatBubble.tsx`**
   - Added `sttAutoRecordTimeout` state (configurable timeout)
   - Added `sttAutoExecute` state (toggle auto-execution)
   - Added `sttAutoRecordTimeoutRef` ref (timeout tracking)
   - Updated keyboard handler to detect Ctrl+/ (or Cmd+/)
   - Removed input field restriction - now works everywhere!
   - Enhanced STT transcript effect to support auto-execution
   - Added state persistence (save/load from localStorage)

3. **`src/components/ChatBubbleSettingsModal.tsx`**
   - Added `sttAutoRecordTimeout` to settings interface
   - Added `sttAutoExecute` to settings interface
   - Added UI controls for timeout slider (2-15s)
   - Added UI toggle for auto-execute
   - Added informational banner explaining the feature

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+/` or `Cmd+/` | Start voice quick record with auto-execution (works everywhere!) |
| `/` | Open chat (only when not typing in input fields) |
| `ESC` | Cancel recording / Close chat |

### Technical Flow

```
1. User presses Ctrl+/ (or Cmd+/)
   ↓
2. Keyboard handler detects event (works in input fields too!)
   ↓
3. Chat opens (if not already open)
   ↓
4. startListening() called (Web Speech API)
   ↓
5. Timeout set (sttAutoRecordTimeoutRef)
   ↓
6. Recording continues until timeout or manual stop
   ↓
7. On transcript received:
   - Set input value
   - If auto-execute enabled → sendMessage()
   - Clear timeout ref
```

## Configuration

### User Configuration (Settings UI)

Users can configure the feature through the chat settings modal:
- Open chat → Click settings icon → "Voice Quick Record (Shift+/)" section

### Developer Configuration

```typescript
// src/lib/constants.ts
export const STT_AUTO_RECORD_TIMEOUT_MS = 5000;  // Change default timeout
export const STT_AUTO_EXECUTE_COMMANDS = true;   // Change default auto-execute
```

## Browser Compatibility

The feature uses the Web Speech API, which is supported in:
- ✅ Chrome/Edge (desktop & Android)
- ✅ Safari (desktop & iOS)
- ❌ Firefox (not supported)

For mobile, Capacitor Speech Recognition is used (native support).

## Usage Examples

### Example 1: Quick Navigation
```
User: Press Ctrl+/ (or Cmd+/)
User: "Navigate to dashboard"
Result: Instantly navigates to /dashboard
```

### Example 2: Command Execution
```
User: Press Ctrl+/
User: "Toggle notifications"
Result: Notifications setting toggles immediately
```

### Example 3: Manual Stop
```
User: Press Ctrl+/
User: Starts speaking
User: Press ESC (cancels recording)
Result: No command executed
```

### Example 4: While Typing in Input Field
```
User: Typing a message in chat input
User: Press Ctrl+/ (works even while typing!)
User: "Navigate to examples"
Result: Voice command executed, navigates to /examples
```

## Edge Cases Handled

1. **Voice Disabled**: Ctrl+/ does nothing if voice control is disabled
2. **Already Recording**: Ctrl+/ ignored if already recording
3. **Timeout Cleanup**: Timeouts properly cleared on unmount
4. **Works In Input Fields**: Ctrl+/ works even when typing in text fields!
5. **State Persistence**: Settings survive page refreshes
6. **Prevents Default**: Browser shortcuts don't interfere

## Future Enhancements

- [ ] Visual feedback during recording (pulse animation)
- [ ] Audio feedback (beep on start/stop)
- [ ] Command confidence threshold
- [ ] Custom wake words (e.g., "Hey Supernal")
- [ ] Multi-language support
- [ ] Offline command recognition

## Testing

To test the feature:

1. Open the application
2. Ensure voice control is enabled (should be default)
3. Press `Ctrl+/` (or `Cmd+/` on Mac) on your keyboard
4. Speak a command (e.g., "navigate to examples")
5. Wait for auto-stop or press ESC
6. Verify command executes automatically
7. **Bonus**: Try pressing `Ctrl+/` while typing in the chat input - it still works!

### Test Cases

- ✅ Ctrl+/ opens chat if closed
- ✅ Ctrl+/ starts recording
- ✅ Recording auto-stops after timeout
- ✅ Command auto-executes when enabled
- ✅ ESC cancels recording
- ✅ Settings persist across refreshes
- ✅ Feature disabled when voice control off
- ✅ Works while typing in input fields

## Known Issues

None currently.

## Related Features

- Voice Control (microphone button)
- Text-to-Speech (speaker icons)
- Chat Commands (fuzzy matching)
- Keyboard Shortcuts (/, Ctrl+/, ESC)
