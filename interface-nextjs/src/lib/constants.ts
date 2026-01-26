/**
 * Keyboard shortcut key to open/focus the chat widget
 * Default: '/' - Press '/' key to open chat
 * Set to empty string '' to disable the simple key shortcut
 * Note: Cmd+/ or Ctrl+/ will always work regardless of this setting
 */
export const CHAT_SHORTCUT_KEY = '/';

/**
 * STT Auto-Record Settings
 * Ctrl+/ (or Cmd+/ on Mac) triggers automatic voice recording with command auto-execution
 * Works everywhere, including when typing in input fields
 */
export const STT_AUTO_RECORD_TIMEOUT_MS = 5000; // Default: 5 seconds
export const STT_AUTO_EXECUTE_COMMANDS = true;  // Auto-execute recognized commands
