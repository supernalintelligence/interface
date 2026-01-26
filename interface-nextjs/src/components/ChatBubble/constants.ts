/**
 * Constants for ChatBubble component
 */

import React from 'react';
import type { Position, ChatBubbleConfig } from './types';
import { Components } from '../../names/Components';

// Default logo as base64 data URI (Supernal Interface logo with "@/" symbol)
// This ensures the logo works out of the box without requiring consumers to add files
export const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibG9nb0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwNjZmZjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0ZDk0ZmY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwY2NmZjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIENpcmNsZSBiYWNrZ3JvdW5kIHdpdGggZ3JhZGllbnQgLS0+CiAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9InVybCgjbG9nb0dyYWRpZW50KSIgb3BhY2l0eT0iMC4xNSIgLz4KCiAgPCEtLSBUZXh0OiAnQC8nIC0gZWFzeSB0byBjaGFuZ2UgdG8gJ34rJyBvciBhbnkgb3RoZXIgY2hhcmFjdGVycyAtLT4KICA8dGV4dCB4PSIyMCIgeT0iMjciCiAgICAgICAgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIgogICAgICAgIGZvbnQtc2l6ZT0iMjAiCiAgICAgICAgZm9udC13ZWlnaHQ9IjcwMCIKICAgICAgICB0ZXh0LWFuY2hvcj0ibWlkZGxlIgogICAgICAgIGZpbGw9InVybCgjbG9nb0dyYWRpZW50KSI+QC88L3RleHQ+Cjwvc3ZnPg==';

// Chat component testid names - using named contracts
export const ChatNames = {
  bubble: Components.ChatToggleButton,
  input: Components.ChatInput,
  sendButton: Components.ChatSendButton,
  clearButton: Components.ChatClearButton,
};

// Positioning styles (inline CSS - no Tailwind dependency, works everywhere)
export const DOCK_POSITIONS: Record<Position, { container: React.CSSProperties; panel: React.CSSProperties }> = {
  'bottom-right': {
    container: { bottom: '1rem', right: '1rem' },
    panel: { bottom: 0, right: 0 },
  },
  'bottom-left': {
    container: { bottom: '1rem', left: '1rem' },
    panel: { bottom: 0, left: 0 },
  },
  'top-right': {
    container: { top: '1rem', right: '1rem' },
    panel: { top: 0, right: 0 },
  },
  'top-left': {
    container: { top: '1rem', left: '1rem' },
    panel: { top: 0, left: 0 },
  },
  'left-center': {
    container: { left: '1rem', top: '50%', transform: 'translateY(-50%)' },
    panel: { left: 0, top: 0 },
  },
  'right-center': {
    container: { right: '1rem', top: '50%', transform: 'translateY(-50%)' },
    panel: { right: 0, top: 0 },
  },
  'bottom-center': {
    container: { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' },
    panel: { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  },
};

// Inline styles for critical elements - ensures they work even with aggressive host CSS
export const INLINE_STYLES = {
  // Input field
  input: (isDark: boolean): React.CSSProperties => ({
    color: isDark ? '#ffffff' : '#111827',
    // Fallback for placeholder handled via ::placeholder CSS or separate element
  }),

  // Message bubbles
  messageUser: (): React.CSSProperties => ({
    background: 'linear-gradient(to bottom right, rgb(37, 99, 235), rgb(147, 51, 234))',
    color: '#ffffff',
  }),

  messageAI: (isDark: boolean): React.CSSProperties => ({
    backgroundColor: isDark ? 'rgba(31, 41, 55, 1)' : 'rgba(255, 255, 255, 1)',
    color: isDark ? '#ffffff' : '#111827',
  }),

  messageSystem: (isDark: boolean): React.CSSProperties => ({
    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    color: isDark ? '#e5e7eb' : '#374151',
  }),

  // Welcome message
  welcomeTitle: (isDark: boolean): React.CSSProperties => ({
    color: isDark ? '#ffffff' : '#111827',
    fontWeight: 'bold',
  }),

  welcomeContent: (isDark: boolean): React.CSSProperties => ({
    color: isDark ? '#ffffff' : '#374151',
  }),

  commandText: (isDark: boolean): React.CSSProperties => ({
    color: isDark ? '#93c5fd' : '#1d4ed8',
  }),

  commandDesc: (isDark: boolean): React.CSSProperties => ({
    color: isDark ? '#ffffff' : '#6b7280',
  }),

  // Info popup
  infoText: (isDark: boolean): React.CSSProperties => ({
    color: isDark ? '#ffffff' : '#374151',
  }),

  // Minimized message
  minimizedMessage: (isDark: boolean): React.CSSProperties => ({
    color: isDark ? '#ffffff' : '#374151',
  }),

  minimizedPrompt: (isDark: boolean): React.CSSProperties => ({
    color: isDark ? '#ffffff' : '#9ca3af',
  }),
};

// Theme classes - centralized styling for easy light/dark mode management
export const THEME_CLASSES = {
  // Message bubbles
  message: {
    user: 'bg-gradient-to-br from-blue-600 to-purple-600 text-white ml-auto',
    ai: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600',
    system: 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 border border-gray-200/40 dark:border-gray-600/40',
    timestamp: {
      user: 'border-white/20 text-white/80',
      other: 'border-gray-300/30 dark:border-gray-500/30 text-gray-600 dark:text-gray-300',
    },
  },

  // Header action buttons
  button: {
    theme: 'p-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors rounded-lg hover:bg-white/30',
    home: 'p-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors rounded-lg hover:bg-white/30',
    dock: 'p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors rounded-lg hover:bg-white/30',
    info: 'p-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors rounded-lg hover:bg-white/30',
    more: 'p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors rounded-lg hover:bg-white/30',
    minimize: 'p-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors rounded-lg hover:bg-white/30',
    clear: 'p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors rounded-lg hover:bg-white/30',
    close: 'p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-white/30',
    floatingClear: 'p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 transition-colors',
  },

  // Input field
  input: {
    field: 'w-full pl-4 pr-12 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm',
    sendButton: 'absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:scale-110',
  },

  // Welcome message
  welcome: {
    container: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm p-4 rounded-2xl border border-blue-200/30 dark:border-blue-500/30 shadow-lg',
    title: 'font-bold text-gray-900 dark:text-white mb-2 text-sm',
    content: 'text-sm text-gray-700 dark:text-white mb-3 leading-relaxed',
    commandsContainer: 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-3 rounded-xl border border-gray-200/30 dark:border-gray-600/30 shadow-sm',
    commandsHeader: 'text-xs font-medium text-gray-900 dark:text-white mb-2',
    commandButton: 'w-full text-left px-3 py-2 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all group border border-transparent hover:border-blue-200/50 dark:hover:border-blue-400/50 hover:shadow-md',
    commandText: 'text-sm font-medium text-blue-700 dark:text-blue-200 group-hover:text-blue-900 dark:group-hover:text-blue-100',
    commandDesc: 'text-xs text-gray-500 dark:text-gray-100 mt-0.5',
  },

  // Text colors for various elements
  text: {
    title: 'font-bold text-gray-900 dark:text-white text-base truncate',
    floatingTitle: 'font-medium text-sm text-gray-900 dark:text-white',
    minimizedMessage: 'text-sm text-gray-700 dark:text-white line-clamp-2',
    minimizedUser: 'text-xs text-blue-600 dark:text-blue-200 line-clamp-1',
    minimizedPrompt: 'text-xs text-gray-400 dark:text-gray-100 text-center',
    floatingTimestamp: 'text-xs text-gray-400 dark:text-gray-100 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity',
    infoPopup: 'px-4 py-3 bg-blue-500/10 backdrop-blur-sm border-b border-blue-200/30 text-sm text-gray-700 dark:text-white',
  },

  // Backgrounds and containers
  bg: {
    header: 'flex items-center justify-between p-4 border-b border-white/20',
    headerGradient: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20',
    headerLight: 'bg-gradient-to-r from-blue-50 to-purple-50',
    inputForm: 'p-4',
    inputFormLight: 'bg-gray-50 dark:bg-gray-900',
    bubble: 'w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center relative hover:scale-110',
  },
};

export const DEFAULT_CONFIG: ChatBubbleConfig = {
  title: 'Supernal Interface',
  logo: DEFAULT_LOGO,
  avatar: React.createElement('img', { src: DEFAULT_LOGO, alt: 'Supernal', className: 'w-6 h-6' }),
  description: 'I\'m a TOOL system AI can use to control this site',
  placeholder: 'Try: toggle notifications',
  sendButtonLabel: 'Send',
  glassMode: false,
  welcome: {
    enabled: true,
    title: 'Welcome - I\'m NOT an AI',
    content: 'I\'m a tool system that AI assistants (like Claude, GPT) can use to navigate and control this site. This enables agentic UX — instead of clicking around, you tell an AI what you want, and it uses me to do it.',
    suggestedCommands: [
      { text: 'open the docs', desc: 'Navigate to documentation' },
      { text: 'show me the story system', desc: 'View story system guide' },
      { text: 'go to examples', desc: 'Browse code examples' },
    ],
  },
  theme: {
    primary: 'blue',
    secondary: 'purple',
    background: 'white',
  },
};
