/**
 * Type definitions for ChatBubble component
 */

export interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai' | 'system';
  timestamp: string;
}

export type Position =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'left-center'
  | 'right-center'
  | 'bottom-center';

export type Variant = 'full' | 'floating' | 'drawer' | 'subtitle';

export type DisplayMode = 'auto' | 'floating' | 'full' | 'drawer' | 'subtitle';

export interface ChatBubbleConfig {
  /** Optional title for the chat header */
  title?: string;
  /** Optional logo URL or data URI. Defaults to embedded Supernal Interface logo */
  logo?: string;
  /** Optional avatar/icon (emoji, URL, or React node) */
  avatar?: string | React.ReactNode;
  /** Optional description shown in info popup */
  description?: string;
  /** Placeholder text for input */
  placeholder?: string;
  /** Send button label */
  sendButtonLabel?: string;
  /** Welcome message configuration */
  welcome?: {
    enabled: boolean;
    title?: string;
    content?: string;
    suggestedCommands?: Array<{ text: string; desc: string }>;
  };
  /** Theme colors */
  theme?: {
    primary?: string;
    secondary?: string;
    background?: string;
  };
  /** Enable glassmorphism effect */
  glassMode?: boolean;
}

export interface ChatBubbleProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClearChat?: () => void;
  /** Positioning mode */
  position?: Position;
  /** Variant: 'full' for expanded panel, 'floating' for mini draggable bubble, 'drawer' for mobile swipeable drawer */
  variant?: Variant;
  /** Configuration for branding, text, and theme */
  config?: ChatBubbleConfig;
  /** Initial expanded state */
  defaultExpanded?: boolean;
  /** Storage key for persisting state */
  storageKey?: string;
  /** Display mode: 'auto' switches based on viewport, or manually set 'full'/'floating'/'drawer' */
  displayMode?: DisplayMode;
  /** Which side the drawer opens from (for drawer variant) */
  drawerSide?: 'left' | 'right';
}

export interface InputFieldProps {
  compact?: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  glassClasses: string;
  theme: 'light' | 'dark';
  inputRef?: React.RefObject<HTMLInputElement>;
  sendButtonLabel?: string;
  // Voice control
  voiceEnabled?: boolean;
  isListening?: boolean;
  onMicClick?: () => void;
  modKey?: string; // 'Cmd' or 'Ctrl' for tooltip
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface AvatarProps {
  avatar?: string | React.ReactNode;
  size?: 'small' | 'normal';
}
