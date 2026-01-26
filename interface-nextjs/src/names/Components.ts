/**
 * Default component testid names for ChatBubble
 *
 * These provide fallback testids when named contracts are not provided.
 * In production, consumers should generate their own ComponentNames using
 * `si scan-names` and pass them via config.
 */

export const Components = {
  // Chat component testids
  ChatToggleButton: 'chat-toggle-button',
  ChatInput: 'chat-message-input',
  ChatSendButton: 'chat-send-button',
  ChatClearButton: 'chat-clear-button',
} as const;
