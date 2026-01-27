/**
 * Component Names - Named contracts for UI elements, variants, and layouts
 *
 * These provide type-safe references throughout the application.
 * In production, consumers should generate their own ComponentNames using
 * `si scan-names` and pass them via config.
 *
 * Naming convention:
 * - Variant(X) → XVariant (e.g., Variant(ChatBubble) → ChatBubbleVariant)
 * - Layout(X) → XLayout (e.g., Layout(Page) → PageLayout)
 */

export const Components = {
  // Chat component testids
  ChatToggleButton: 'chat-toggle-button',
  ChatInput: 'chat-message-input',
  ChatSendButton: 'chat-send-button',
  ChatClearButton: 'chat-clear-button',
} as const;

/**
 * ChatBubbleVariant - Display modes for the chat interface
 * Usage: Variant(ChatBubble) → ChatBubbleVariant
 */
export const ChatBubbleVariant = {
  full: 'full',           // Full-screen chat panel
  floating: 'floating',   // Floating draggable widget
  drawer: 'drawer',       // Mobile bottom drawer
  subtitle: 'subtitle',   // Minimalist voice-first overlay (premium)
} as const;

export type ChatBubbleVariantType = keyof typeof ChatBubbleVariant;
export type ChatBubbleVariantValue = typeof ChatBubbleVariant[ChatBubbleVariantType];

/**
 * PageLayout - Page structure variants
 * Usage: Layout(Page) → PageLayout
 */
export const PageLayout = {
  default: 'default',   // Standard page layout
  landing: 'landing',   // Landing page with hero
  docs: 'docs',         // Documentation layout
  blog: 'blog',         // Blog post layout
} as const;

export type PageLayoutType = keyof typeof PageLayout;
export type PageLayoutValue = typeof PageLayout[PageLayoutType];
