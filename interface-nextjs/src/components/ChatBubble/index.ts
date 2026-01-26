/**
 * ChatBubble module exports
 */

// Types
export type {
  Message,
  Position,
  Variant,
  DisplayMode,
  ChatBubbleConfig,
  ChatBubbleProps,
  InputFieldProps,
  AvatarProps,
} from './types';

// Constants
export {
  DEFAULT_LOGO,
  ChatNames,
  DOCK_POSITIONS,
  INLINE_STYLES,
  THEME_CLASSES,
  DEFAULT_CONFIG,
} from './constants';

// Components
export { InputField } from './InputField';
export { Avatar } from './Avatar';

// Main component - inside this folder
export { ChatBubble } from './ChatBubble';
