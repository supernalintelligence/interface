/**
 * Universal Chat Bubble Component - Premium Edition
 *
 * A stunning, flexible chat interface with:
 * - Draggable & dockable positioning
 * - Liquid glass (glassmorphism) aesthetic
 * - Dynamic sizing based on content
 * - Timestamps on hover
 * - Beautiful gradient message bubbles
 * - Professional animations
 */

import React, { useState, useRef, useEffect } from 'react';
import { Components } from '../../../names/Components';
import { useChatInput } from '../contexts/ChatInputContext';

// Default logo as base64 data URI (Supernal Interface logo with "@/" symbol)
// This ensures the logo works out of the box without requiring consumers to add files
const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibG9nb0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwNjZmZjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0ZDk0ZmY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwY2NmZjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIENpcmNsZSBiYWNrZ3JvdW5kIHdpdGggZ3JhZGllbnQgLS0+CiAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9InVybCgjbG9nb0dyYWRpZW50KSIgb3BhY2l0eT0iMC4xNSIgLz4KCiAgPCEtLSBUZXh0OiAnQC8nIC0gZWFzeSB0byBjaGFuZ2UgdG8gJ34rJyBvciBhbnkgb3RoZXIgY2hhcmFjdGVycyAtLT4KICA8dGV4dCB4PSIyMCIgeT0iMjciCiAgICAgICAgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIgogICAgICAgIGZvbnQtc2l6ZT0iMjAiCiAgICAgICAgZm9udC13ZWlnaHQ9IjcwMCIKICAgICAgICB0ZXh0LWFuY2hvcj0ibWlkZGxlIgogICAgICAgIGZpbGw9InVybCgjbG9nb0dyYWRpZW50KSI+QC88L3RleHQ+Cjwvc3ZnPg==';

// Chat component names (use the flat Components namespace)
const ChatNames = {
  bubble: Components.ChatToggleButton,
  input: Components.ChatInput,
  sendButton: Components.ChatSendButton,
  clearButton: Components.ChatClearButton,
};

interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai' | 'system';
  timestamp: string;
}

type Position =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'left-center'
  | 'right-center'
  | 'bottom-center';

type Variant = 'full' | 'floating' | 'drawer';

type DisplayMode = 'auto' | 'floating' | 'full' | 'drawer';

interface ChatBubbleConfig {
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

interface ChatBubbleProps {
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

// Positioning styles (inline CSS - no Tailwind dependency, works everywhere)
const DOCK_POSITIONS: Record<Position, { container: React.CSSProperties; panel: React.CSSProperties }> = {
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
const INLINE_STYLES = {
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
const THEME_CLASSES = {
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

const DEFAULT_CONFIG: ChatBubbleConfig = {
  title: 'Supernal Interface',
  logo: DEFAULT_LOGO,
  avatar: <img src={DEFAULT_LOGO} alt="Supernal" className="w-6 h-6" />,
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

// Shared input component - defined OUTSIDE to prevent recreation on every render
interface InputFieldProps {
  compact?: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  glassClasses: string;
  theme: 'light' | 'dark';
  inputRef?: React.RefObject<HTMLInputElement>;
  sendButtonLabel?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  compact = false,
  inputValue,
  onInputChange,
  onSubmit,
  placeholder,
  glassClasses,
  theme,
  inputRef,
  sendButtonLabel,
}) => (
  <form onSubmit={onSubmit} className={compact ? 'flex space-x-2' : THEME_CLASSES.bg.inputForm + ' ' + 'bg-transparent'}>
    <div className={compact ? 'flex space-x-2 flex-1' : 'relative'}>
      <input
        ref={compact ? undefined : inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={placeholder}
        className={compact
          ? `flex-1 px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${glassClasses}`
          : `${THEME_CLASSES.input.field} ${glassClasses}`
        }
        style={INLINE_STYLES.input(theme === 'dark')}
        data-testid={Components.ChatInput}
      />
      <button
        type="submit"
        disabled={!inputValue.trim()}
        className={compact
          ? "px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all text-xs font-medium shadow-md hover:shadow-lg"
          : THEME_CLASSES.input.sendButton
        }
        data-testid={Components.ChatSendButton}
        title={sendButtonLabel}
      >
        {compact ? '→' : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </button>
    </div>
  </form>
);

// Shared avatar component - defined OUTSIDE to prevent recreation
interface AvatarProps {
  avatar?: string | React.ReactNode;
  size?: 'small' | 'normal';
}

const Avatar: React.FC<AvatarProps> = ({ avatar, size = 'normal' }) => {
  if (!avatar) return null;

  if (typeof avatar === 'string') {
    return size === 'small' ? (
      <span className="text-lg">{avatar}</span>
    ) : (
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
        <span className="text-white text-sm font-bold">{avatar}</span>
      </div>
    );
  }

  return <>{avatar}</>;
};

export const ChatBubble = ({
  messages,
  onSendMessage,
  onClearChat,
  position = 'bottom-right',
  variant = 'full',
  config: userConfig,
  defaultExpanded = true,
  storageKey = 'chat-bubble-state',
  displayMode: propDisplayMode = 'auto',
  drawerSide: propDrawerSide = 'right',
}: ChatBubbleProps) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...userConfig };

  // If custom logo provided, sync avatar to match
  if (userConfig?.logo && !userConfig?.avatar) {
    mergedConfig.avatar = <img src={userConfig.logo} alt="Supernal" className="w-6 h-6" />;
  }

  const config = mergedConfig;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMinimized, setIsMinimized] = useState(false); // New minimized state
  const [inputValue, setInputValue] = useState('');
  const [lastReadMessageCount, setLastReadMessageCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(
    config.welcome?.enabled && messages.length === 0
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragInitiated, setDragInitiated] = useState(false); // Track mouse down before threshold
  const [isDocked, setIsDocked] = useState(true);
  const [dockPosition, setDockPosition] = useState<Position>(position); // Track which edge is docked
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [, setTimestampTick] = useState(0); // Forces re-render for timestamp updates
  const [localGlassMode, setLocalGlassMode] = useState(config.glassMode ?? true);
  const [glassOpacity, setGlassOpacity] = useState<'low' | 'medium' | 'high'>('medium'); // Glass opacity: Low/Medium/High
  const [notifications, setNotifications] = useState(true);

  // Drawer state variables
  const [displayMode, setDisplayMode] = useState<DisplayMode>(propDisplayMode);
  const [drawerSide, setDrawerSide] = useState<'left' | 'right'>(propDrawerSide);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<{x: number; y: number; time: number} | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0); // 0-100%
  const [showEdgeHint, setShowEdgeHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number; thresholdMet: boolean } | null>(null);
  const rafRef = useRef<number | null>(null); // requestAnimationFrame for smooth dragging

  // Helper function to format relative time
  const formatRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

    return messageTime.toLocaleDateString();
  };

  // Load expanded state from localStorage after hydration
  useEffect(() => {
    if (variant === 'full') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) {
          const state = JSON.parse(stored);

          // Validate stored position - if clearly invalid (too far off-screen), reset
          const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
          const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
          const pos = state.panelPosition || { x: 0, y: 0 };

          // If position is more than 2x viewport away, it's invalid - reset to docked
          const isInvalidPosition =
            Math.abs(pos.x) > windowWidth * 2 ||
            Math.abs(pos.y) > windowHeight * 2;

          if (isInvalidPosition) {
            console.warn('ChatBubble: Invalid stored position detected, resetting to docked');
            // Reset position but preserve other settings like glass mode
            setIsExpanded(defaultExpanded);
            setIsMinimized(false);
            setIsDocked(true);
            setDockPosition(position);
            setPanelPosition({ x: 0, y: 0 });
            // Preserve glass settings and theme
            setTheme(state.theme || 'light');
            if (state.localGlassMode !== undefined) {
              setLocalGlassMode(state.localGlassMode);
            }
            if (state.glassOpacity !== undefined) {
              setGlassOpacity(state.glassOpacity);
            }
            if (state.notifications !== undefined) {
              setNotifications(state.notifications);
            }
          } else {
            // Valid state - load it
            setIsExpanded(state.isExpanded ?? defaultExpanded);
            setIsMinimized(state.isMinimized ?? false);
            setIsDocked(state.isDocked ?? true);
            setDockPosition(state.dockPosition || position);
            setPanelPosition(pos);
            setTheme(state.theme || 'light');
            if (state.localGlassMode !== undefined) {
              setLocalGlassMode(state.localGlassMode);
            }
            if (state.notifications !== undefined) {
              setNotifications(state.notifications);
            }
            if (state.displayMode !== undefined) {
              setDisplayMode(state.displayMode);
            }
            if (state.drawerSide !== undefined) {
              setDrawerSide(state.drawerSide);
            }
            if (state.drawerOpen !== undefined) {
              setDrawerOpen(state.drawerOpen);
            }
            if (state.glassOpacity !== undefined) {
              setGlassOpacity(state.glassOpacity);
            }
          }
        }
      } catch {
        // Keep default value
      }
    }
  }, [storageKey, variant, defaultExpanded, position]);

  // Bounds checking: ensure panel is visible on screen
  useEffect(() => {
    if (!isExpanded || isDocked || !panelRef.current) return;

    const checkBounds = () => {
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // If panel is completely off-screen, reset to docked position
      const isOffScreen =
        rect.right < 0 ||
        rect.left > windowWidth ||
        rect.bottom < 0 ||
        rect.top > windowHeight;

      if (isOffScreen) {
        console.warn('ChatBubble detected off-screen, resetting to docked position');
        setIsDocked(true);
        setPanelPosition({ x: 0, y: 0 });
      }
    };

    // Check bounds after a brief delay to allow rendering
    const timeoutId = setTimeout(checkBounds, 100);
    return () => clearTimeout(timeoutId);
  }, [isExpanded, isDocked]);

  // Escape key handler: reset panel to default docked position
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Press Escape to reset ChatBubble to docked position
      if (e.key === 'Escape' && isExpanded && !isDocked) {
        console.log('ChatBubble reset via Escape key');
        setIsDocked(true);
        setDockPosition(position);
        setPanelPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, isDocked, position]);

  // Detect system theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

  // Viewport detection for auto-switching between drawer and panel
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Initial check
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Resolve actual variant based on display mode and viewport
  const currentVariant: Variant = React.useMemo(() => {
    // Manual override takes precedence
    if (displayMode !== 'auto') {
      return displayMode as Variant;
    }

    // Auto mode: drawer on mobile, full on desktop
    return isMobile ? 'drawer' : variant;
  }, [displayMode, isMobile, variant]);

  // Auto-update timestamps every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestampTick(tick => tick + 1);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (variant === 'full' || variant === 'drawer') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            isExpanded,
            isMinimized,
            isDocked,
            dockPosition,
            panelPosition,
            theme,
            localGlassMode,
            notifications,
            displayMode,
            drawerSide,
            drawerOpen,
            glassOpacity,
          })
        );
      } catch (error) {
        console.error('Failed to save chat state:', error);
      }
    }
  }, [isExpanded, isMinimized, isDocked, dockPosition, panelPosition, theme, localGlassMode, notifications, displayMode, drawerSide, drawerOpen, glassOpacity, storageKey, variant]);

  // Register with chat input context
  const { registerInput } = useChatInput();

  useEffect(() => {
    registerInput((text: string, submit = false) => {
      setInputValue(text);
      if (!isExpanded && variant === 'full') {
        setIsExpanded(true);
      }
      setTimeout(() => {
        inputRef.current?.focus();
        if (submit) {
          onSendMessage(text);
          setInputValue('');
        }
      }, 100);
    });
  }, [registerInput, onSendMessage]); // ✅ FIXED: Removed isExpanded, variant from dependencies

  // Track unread messages
  const unreadCount = Math.max(0, messages.length - lastReadMessageCount);
  const hasUnread = unreadCount > 0 && !isExpanded && variant === 'full';

  useEffect(() => {
    if (isExpanded || variant === 'floating') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      setLastReadMessageCount(messages.length);
      if (messages.length > 0) {
        setShowWelcome(false);
      }
      if (variant === 'full') {
        inputRef.current?.focus();
      }
    }
  }, [messages, isExpanded, variant]);

  // Auto-focus on mount (full variant only)
  useEffect(() => {
    if (isExpanded && variant === 'full') {
      inputRef.current?.focus();
    }
  }, [isExpanded, variant]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (variant !== 'full') return;

      // '/' key to open chat (only if not typing in input)
      if (e.key === '/' && !isExpanded) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }

      // Escape to close more menu or chat
      if (e.key === 'Escape') {
        if (showMoreMenu) {
          setShowMoreMenu(false);
        } else if (isExpanded) {
          setIsExpanded(false);
        }
      }

      // Command+/ to focus input
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        if (!isExpanded) {
          setIsExpanded(true);
        }
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, showMoreMenu, variant]);

  // Close more menu when clicking outside
  useEffect(() => {
    if (!showMoreMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-more-menu]')) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

  // Drag handlers
  const handlePanelMouseDown = (e: React.MouseEvent) => {
    if (variant !== 'full' || !isExpanded) return;
    // Only drag from header area
    const target = e.target as HTMLElement;
    if (!target.closest('[data-drag-handle]')) return;

    // Don't drag if clicking on a button or interactive element
    if (target.closest('button') || target.closest('svg') || target.closest('[role="button"]')) {
      return;
    }

    e.preventDefault();
    setDragInitiated(true); // Start tracking mouse movement

    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Pre-calculate position to prevent jump when undocking
    if (isDocked) {
      // Calculate current center of panel in viewport
      const currentCenterX = rect.left + rect.width / 2;
      const currentCenterY = rect.top + rect.height / 2;

      // Calculate what panelPosition should be to place panel at current location
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const targetX = currentCenterX - viewportCenterX;
      const targetY = currentCenterY - viewportCenterY;

      // Set position immediately to prevent visual jump
      setPanelPosition({ x: targetX, y: targetY });

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: targetX,
        initialY: targetY,
        thresholdMet: false,
      };
    } else {
      // Already floating - use current position
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: panelPosition.x,
        initialY: panelPosition.y,
        thresholdMet: false,
      };
    }
  };

  useEffect(() => {
    if (!dragInitiated || !dragRef.current) return;

    const dragThresholdPx = 5; // 5px movement required before drag starts

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      // Check threshold - must move 5px before dragging starts
      if (!dragRef.current.thresholdMet && distance < dragThresholdPx) {
        return; // Not enough movement yet - ignore
      }

      // Threshold met - activate dragging (only once)
      if (!dragRef.current.thresholdMet) {
        dragRef.current.thresholdMet = true;
        setIsDragging(true);
        setIsDocked(false);
      }

      // Use requestAnimationFrame for smooth 60fps updates
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setPanelPosition({
          x: dragRef.current!.initialX + deltaX,
          y: dragRef.current!.initialY + deltaY,
        });
      });
    };

    const handleMouseUp = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // Only auto-dock if we actually dragged (threshold was met)
      if (dragRef.current?.thresholdMet && panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        const threshold = 20; // Reduced from 50px - less aggressive
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Determine which edge is closest for smart docking
        const distanceToRight = windowWidth - rect.right;
        const distanceToLeft = rect.left;
        const distanceToTop = rect.top;
        const distanceToBottom = windowHeight - rect.bottom;

        const minDistance = Math.min(distanceToRight, distanceToLeft, distanceToTop, distanceToBottom);

        // Only dock if within threshold of closest edge
        if (minDistance < threshold) {
          let newDockPosition: Position;

          // Determine which edge to dock to based on proximity
          if (minDistance === distanceToRight) {
            newDockPosition = rect.top < windowHeight / 3 ? 'top-right' : rect.bottom > (windowHeight * 2) / 3 ? 'bottom-right' : 'right-center';
          } else if (minDistance === distanceToLeft) {
            newDockPosition = rect.top < windowHeight / 3 ? 'top-left' : rect.bottom > (windowHeight * 2) / 3 ? 'bottom-left' : 'left-center';
          } else if (minDistance === distanceToTop) {
            newDockPosition = rect.left < windowWidth / 3 ? 'top-left' : rect.right > (windowWidth * 2) / 3 ? 'top-right' : 'top-right'; // Default to top-right for top-center
          } else {
            newDockPosition = rect.left < windowWidth / 3 ? 'bottom-left' : rect.right > (windowWidth * 2) / 3 ? 'bottom-right' : 'bottom-center';
          }

          setDockPosition(newDockPosition);
          setIsDocked(true);
          setPanelPosition({ x: 0, y: 0 });
        }
      }

      setIsDragging(false);
      setDragInitiated(false);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [dragInitiated]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    onSendMessage(inputValue.trim());
    setInputValue('');
    if (variant === 'full') {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDock = () => {
    setDockPosition(position); // Reset to original position
    setIsDocked(true);
    setPanelPosition({ x: 0, y: 0 });
  };

  const handleHome = () => {
    setDockPosition(position); // Reset to original position
    setIsDocked(true);
    setPanelPosition({ x: 0, y: 0 });
    setIsMinimized(false);
  };

  const handleClearChat = () => {
    if (onClearChat) {
      onClearChat();
      setShowWelcome(true);
    }
  };


  const dockClasses = DOCK_POSITIONS[dockPosition];
  const primaryColor = config.theme?.primary || 'blue';
  const glassMode = localGlassMode;

  // Map glass opacity setting to CSS classes (original values, just adjustable)
  const glassClasses = glassMode
    ? glassOpacity === 'low'
      ? 'backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border border-white/20 dark:border-white/10'
      : glassOpacity === 'high'
      ? 'backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-white/10'
      : 'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-white/10' // medium (original)
    : 'bg-white dark:bg-gray-900';

  const glassGradient = glassMode
    ? glassOpacity === 'low'
      ? 'bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-gray-900/60 dark:via-gray-900/50 dark:to-gray-900/40'
      : glassOpacity === 'high'
      ? 'bg-gradient-to-br from-white/95 via-white/85 to-white/70 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70'
      : 'bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-gray-900/80 dark:via-gray-900/70 dark:to-gray-900/60' // medium (original)
    : 'bg-white dark:bg-gray-900';

  // Helper to get floating position styles based on dock position
  // This ensures proper alignment when switching between minimized/expanded
  const getFloatingPositionStyle = (): React.CSSProperties => {
    // Determine anchor point based on dock position to prevent off-screen issues
    if (dockPosition.includes('top') && dockPosition.includes('left')) {
      // Top-left: anchor from top-left corner
      return {
        top: 0,
        left: 0,
        transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
      };
    } else if (dockPosition.includes('top') && dockPosition.includes('right')) {
      // Top-right: anchor from top-right corner
      return {
        top: 0,
        right: 0,
        transform: `translate(${-panelPosition.x}px, ${panelPosition.y}px)`,
      };
    } else if (dockPosition.includes('bottom') && dockPosition.includes('left')) {
      // Bottom-left: anchor from bottom-left corner
      return {
        bottom: 0,
        left: 0,
        transform: `translate(${panelPosition.x}px, ${-panelPosition.y}px)`,
      };
    } else if (dockPosition.includes('bottom') && dockPosition.includes('right')) {
      // Bottom-right: anchor from bottom-right corner
      return {
        bottom: 0,
        right: 0,
        transform: `translate(${-panelPosition.x}px, ${-panelPosition.y}px)`,
      };
    } else if (dockPosition.includes('left-center')) {
      // Left-center: anchor from left, center vertically
      return {
        left: 0,
        top: '50%',
        transform: `translate(${panelPosition.x}px, calc(-50% + ${panelPosition.y}px))`,
      };
    } else if (dockPosition.includes('right-center')) {
      // Right-center: anchor from right, center vertically
      return {
        right: 0,
        top: '50%',
        transform: `translate(${-panelPosition.x}px, calc(-50% + ${panelPosition.y}px))`,
      };
    } else if (dockPosition.includes('bottom-center')) {
      // Bottom-center: anchor from bottom, center horizontally
      return {
        bottom: 0,
        left: '50%',
        transform: `translate(calc(-50% + ${panelPosition.x}px), ${-panelPosition.y}px)`,
      };
    } else {
      // Fallback: center-based positioning
      return {
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${panelPosition.x}px), calc(-50% + ${panelPosition.y}px))`,
      };
    }
  };

  // Calculate dynamic size - max 80vh
  const maxHeightVh = 80;
  const dynamicHeight = `min(${maxHeightVh}vh, 700px)`;
  const panelWidth = 'min(650px, calc(100vw - 2rem))'; // Wider panel

  // Helper function to calculate drawer transform
  const getDrawerTransform = () => {
    if (touchStart && swipeProgress > 0) {
      return drawerSide === 'right'
        ? `translateX(${100 - swipeProgress}%)`
        : `translateX(${-100 + swipeProgress}%)`;
    }
    return drawerOpen
      ? 'translateX(0%)'
      : drawerSide === 'right'
      ? 'translateX(100%)'
      : 'translateX(-100%)';
  };

  // Note: Keep class strings inline in JSX for Tailwind JIT detection
  // Storing in variables causes Tailwind to miss them during scanning

  // Drawer variant - mobile swipeable drawer
  if (currentVariant === 'drawer') {
    const drawerWidth = 'min(400px, 90vw)';
    return (
      <>
        {(drawerOpen || swipeProgress > 0) && (
          <div
            className="fixed inset-0 bg-black z-40 transition-opacity duration-300"
            style={{ opacity: touchStart && swipeProgress > 0 ? (swipeProgress / 100) * 0.5 : 0.5 }}
            onClick={() => setDrawerOpen(false)}
          />
        )}
        <div
          className={`fixed ${drawerSide === 'right' ? 'right-0' : 'left-0'} top-0 h-full z-50 flex flex-col ${
            glassClasses
          } shadow-2xl`}
          style={{
            width: drawerWidth,
            transform: getDrawerTransform(),
            transition: touchStart ? 'none' : 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Chat drawer"
        >
          <div className={`${THEME_CLASSES.bg.header} ${glassMode ? THEME_CLASSES.bg.headerGradient : THEME_CLASSES.bg.headerLight}`}>
            <div className="flex items-center space-x-3">
              {config.avatar && (
                <div className="relative flex-shrink-0">
                  <Avatar avatar={config.avatar} />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              )}
              {config.title && (
                <div className="min-w-0 flex-1">
                  <h3 className={THEME_CLASSES.text.title}>{config.title}</h3>
                </div>
              )}
            </div>
            <button onClick={() => setDrawerOpen(false)} className={THEME_CLASSES.button.close} title="Close drawer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {showWelcome && messages.length === 0 && config.welcome?.enabled && (
              <div className={THEME_CLASSES.welcome.container}>
                {config.welcome.title && (
                  <h4 className={THEME_CLASSES.welcome.title} style={INLINE_STYLES.welcomeTitle(theme === 'dark')}>
                    {config.welcome.title}
                  </h4>
                )}
                {config.welcome.content && (
                  <p className={THEME_CLASSES.welcome.content} style={INLINE_STYLES.welcomeContent(theme === 'dark')}>
                    {config.welcome.content}
                  </p>
                )}
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`group flex items-center gap-2 mb-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div
                  className={`inline-block px-4 py-2.5 rounded-2xl max-w-[80%] text-sm shadow-sm transition-all ${
                    message.type === 'user' ? THEME_CLASSES.message.user : message.type === 'ai' ? THEME_CLASSES.message.ai : THEME_CLASSES.message.system
                  }`}
                  style={
                    message.type === 'user' ? INLINE_STYLES.messageUser() : message.type === 'ai' ? INLINE_STYLES.messageAI(theme === 'dark') : INLINE_STYLES.messageSystem(theme === 'dark')
                  }
                >
                  <div className="break-words leading-relaxed">{message.text}</div>
                </div>
                <div
                  className={`text-xs opacity-0 group-hover:opacity-70 transition-opacity whitespace-nowrap flex-shrink-0 ${
                    message.type === 'user' ? 'text-gray-400 dark:text-gray-500 text-left' : 'text-gray-600 dark:text-gray-400 text-right'
                  }`}
                  title={typeof window !== 'undefined' ? new Date(message.timestamp).toLocaleString() : ''}
                >
                  {typeof window !== 'undefined' ? formatRelativeTime(message.timestamp) : ''}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <InputField inputValue={inputValue} onInputChange={setInputValue} onSubmit={handleSend} placeholder={config.placeholder} glassClasses="" theme={theme} inputRef={inputRef} sendButtonLabel={config.sendButtonLabel} />
        </div>
        {!drawerOpen && (
          <div className={`fixed ${drawerSide === 'right' ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 ${showEdgeHint ? 'opacity-60' : 'opacity-0'} transition-opacity duration-500 z-40 pointer-events-none`}>
            <div className="bg-blue-600/80 backdrop-blur-sm text-white px-2 py-4 rounded-l-lg shadow-lg">
              <span className="text-xl">{drawerSide === 'right' ? '‹' : '›'}</span>
            </div>
          </div>
        )}
        <button onClick={() => setDrawerOpen(!drawerOpen)} className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700">
          {drawerOpen ? 'Close' : 'Open'} Drawer
        </button>
      </>
    );
  }

  // Floating variant - compact draggable bubble
  if (variant === 'floating') {
    const recentMessage = messages[messages.length - 1];

    return (
      <div
        className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
          ...(!isDragging && { transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }),
        }}
        onMouseDown={handlePanelMouseDown}
      >
        <div className={`${glassClasses} rounded-2xl shadow-2xl p-3 max-w-xs ${!glassMode && 'border-gray-200 border'}`}>
          {/* Mini header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Avatar avatar={config.avatar} size="small" />
              {config.title && (
                <span className={THEME_CLASSES.text.floatingTitle}>{config.title}</span>
              )}
            </div>
            {onClearChat && (
              <button
                onClick={onClearChat}
                className={THEME_CLASSES.button.floatingClear}
                title="Clear chat"
                data-testid={ChatNames.clearButton}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Recent message */}
          {recentMessage && (
            <div className={`mb-2 group flex items-center gap-2 ${recentMessage.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`text-xs px-3 py-2 rounded-xl transition-all ${
                  recentMessage.type === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                    : recentMessage.type === 'ai'
                    ? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white shadow-md'
                    : 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-900 shadow-md'
                }`}
              >
                {recentMessage.text.length > 60
                  ? `${recentMessage.text.slice(0, 60)}...`
                  : recentMessage.text}
              </div>
              <div className={`text-xs opacity-0 group-hover:opacity-70 transition-opacity whitespace-nowrap flex-shrink-0 ${
                recentMessage.type === 'user'
                  ? 'text-gray-400 dark:text-gray-500 text-left'
                  : 'text-gray-600 dark:text-gray-400 text-right'
              }`}
              title={typeof window !== 'undefined' ? new Date(recentMessage.timestamp).toLocaleString() : ''}
              >
                {typeof window !== 'undefined' ? formatRelativeTime(recentMessage.timestamp) : ''}
              </div>
            </div>
          )}

          {/* Compact input */}
          <InputField
            compact
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSend}
            placeholder={config.placeholder}
            glassClasses=""
            theme={theme}
            sendButtonLabel={config.sendButtonLabel}
          />
        </div>
      </div>
    );
  }

  // Full variant - expandable panel with glass aesthetic
  return (
    <>
      {/* Chat Container */}
      <div
        className="fixed z-50"
        style={{
          ...dockClasses.container,
          ...(isExpanded ? {
            width: panelWidth,
            height: isMinimized ? 'auto' : dynamicHeight,
          } : {
            width: 'auto',
            height: 'auto',
          }),
        }}
      >
        {/* Minimized Compact View */}
        {isExpanded && isMinimized && (
          <div
            ref={panelRef}
            className={`${isDocked ? 'absolute' : 'fixed'} ${glassGradient} rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 ${!isDragging && 'backdrop-blur-xl'} flex flex-col overflow-hidden ${!isDragging && 'transition-all duration-300'}`}
            style={{
              width: panelWidth,
              maxWidth: '400px',
              ...(isDocked ? {
                ...dockClasses.panel,
                // Only clear transform if dock position doesn't use transform
                ...(dockClasses.panel.transform ? {} : { transform: 'none' }),
              } : getFloatingPositionStyle()),
              ...(isDragging && { cursor: 'grabbing' }),
            }}
          >
            {/* Header - Draggable and clickable to expand */}
            <div
              data-drag-handle
              className={`${THEME_CLASSES.bg.header} ${glassMode ? THEME_CLASSES.bg.headerGradient : THEME_CLASSES.bg.headerLight} cursor-move`}
              onMouseDown={handlePanelMouseDown}
              onClick={(e) => {
                // Only expand if we didn't drag (drag threshold wasn't met)
                if (!dragRef.current?.thresholdMet) {
                  // Don't expand if clicking on a button
                  const target = e.target as HTMLElement;
                  if (target.closest('button') || target.closest('[role="button"]')) {
                    return;
                  }
                  setIsMinimized(false);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                {config.avatar && (
                  <div className="relative flex-shrink-0">
                    <Avatar avatar={config.avatar} />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                )}
                {/* Title */}
                {config.title && (
                  <div className="min-w-0 flex-1">
                    <h3 className={THEME_CLASSES.text.title}>
                      {config.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* Header actions */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                {/* Minimize button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(true);
                  }}
                  className={THEME_CLASSES.button.minimize}
                  title="Minimize chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className={THEME_CLASSES.button.close}
                  title="Close chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content area with padding */}
            <div className="p-4">
              {/* Last AI response only */}
              {(() => {
                const lastAiMessage = [...messages].reverse().find(m => m.type === 'ai');
                return lastAiMessage ? (
                  <div className="mb-3">
                    <div className={`text-xs px-3 py-2 rounded-xl ${THEME_CLASSES.message.ai}`} style={INLINE_STYLES.messageAI(theme === 'dark')}>
                      {lastAiMessage.text.length > 100
                        ? `${lastAiMessage.text.slice(0, 100)}...`
                        : lastAiMessage.text}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <div className={THEME_CLASSES.text.minimizedMessage} style={INLINE_STYLES.minimizedMessage(theme === 'dark')}>
                      No AI responses yet
                    </div>
                  </div>
                );
              })()}

              {/* Shared input component */}
              <InputField
                compact
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSubmit={handleSend}
                placeholder={config.placeholder}
                glassClasses=""
                theme={theme}
                sendButtonLabel={config.sendButtonLabel}
              />
            </div>
          </div>
        )}

        {/* Expanded Chat Panel */}
        {isExpanded && !isMinimized && (
          <div
            ref={panelRef}
            className={`${isDocked ? 'absolute' : 'fixed'} ${glassGradient} rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 ${!isDragging && 'backdrop-blur-xl'} flex flex-col overflow-hidden ${!isDragging && 'transition-all duration-300'}`}
            style={{
              width: panelWidth,
              height: dynamicHeight,
              ...(isDocked ? {
                ...dockClasses.panel,
                // Only clear transform if dock position doesn't use transform
                ...(dockClasses.panel.transform ? {} : { transform: 'none' }),
              } : getFloatingPositionStyle()),
              ...(isDragging && { cursor: 'grabbing' }),
            }}
          >
            {/* Header - Draggable */}
            <div
              data-drag-handle
              className={`${THEME_CLASSES.bg.header} ${glassMode ? THEME_CLASSES.bg.headerGradient : THEME_CLASSES.bg.headerLight} cursor-move`}
              onMouseDown={handlePanelMouseDown}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                {config.avatar && (
                  <div className="relative flex-shrink-0">
                    <Avatar avatar={config.avatar} />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                )}
                {/* Title */}
                {config.title && (
                  <div className="min-w-0 flex-1">
                    <h3 className={THEME_CLASSES.text.title}>
                      {config.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* Header actions */}
              <div className="flex items-center space-x-1 flex-shrink-0 relative" data-more-menu>
                {/* External link to Interface documentation */}
                <a
                  href="https://www.interface.supernal.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors rounded-lg hover:bg-white/30"
                  title="Visit Supernal Interface Documentation"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* More menu button */}
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={THEME_CLASSES.button.more}
                  title="More options"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {/* More menu dropdown */}
                {showMoreMenu && (
                  <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2 min-w-[220px]" style={{ zIndex: 99999 }} data-more-menu>
                    {/* Glass Mode - 4 icon buttons (Off, Low, Medium, High) */}
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 mb-2">
                      <div className="grid grid-cols-4 gap-1">
                        <button
                          onClick={() => setLocalGlassMode(false)}
                          className={`flex items-center justify-center p-2 rounded transition-all ${
                            !localGlassMode
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title="Glass Off"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="8" y="8" width="8" height="8" rx="1" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setLocalGlassMode(true);
                            setGlassOpacity('low');
                          }}
                          className={`flex items-center justify-center p-2 rounded transition-all ${
                            localGlassMode && glassOpacity === 'low'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title="Glass Low"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="9" y="9" width="6" height="6" rx="1" strokeWidth="2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setLocalGlassMode(true);
                            setGlassOpacity('medium');
                          }}
                          className={`flex items-center justify-center p-2 rounded transition-all ${
                            localGlassMode && glassOpacity === 'medium'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title="Glass Medium"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="8" y="8" width="8" height="8" rx="1" strokeWidth="2" />
                            <rect x="10" y="10" width="4" height="4" rx="0.5" strokeWidth="1.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setLocalGlassMode(true);
                            setGlassOpacity('high');
                          }}
                          className={`flex items-center justify-center p-2 rounded transition-all ${
                            localGlassMode && glassOpacity === 'high'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title="Glass High"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="7" y="7" width="10" height="10" rx="1" strokeWidth="2" />
                            <rect x="9" y="9" width="6" height="6" rx="0.5" strokeWidth="1.5" />
                            <rect x="11" y="11" width="2" height="2" rx="0.5" strokeWidth="1" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Theme Toggle */}
                    <button
                      onClick={() => {
                        const newTheme = theme === 'light' ? 'dark' : 'light';
                        setTheme(newTheme);
                        if (typeof window !== 'undefined') {
                          document.documentElement.setAttribute('data-theme', newTheme);
                        }
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span>{theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode</span>
                    </button>

                    {/* Home button */}
                    <button
                      onClick={() => {
                        handleHome();
                        setShowMoreMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Reset position</span>
                    </button>

                    {/* Info button - injects help messages into chat */}
                    <button
                      onClick={() => {
                        // Inject help messages into chat
                        const helpMessages = [
                          '💡 **How to Use This Chat**',
                          '• **Theme**: Toggle between light and dark modes',
                          '• **Glass Effect**: Adjust transparency (Off/Low/Medium/High)',
                          '• **Reset Position**: Return chat to default corner',
                          '• **Minimize**: Compact view showing last message',
                          '• **Clear**: Delete all messages and start fresh',
                          '• **Drag**: Click and drag header to reposition chat',
                          '• **Keyboard**: Press "/" to focus input, Esc to reset position'
                        ];

                        helpMessages.forEach((text, index) => {
                          setTimeout(() => {
                            onSendMessage(text);
                          }, index * 100);
                        });

                        setShowMoreMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>How to use</span>
                    </button>

                    {/* Clear chat */}
                    {onClearChat && (
                      <button
                        onClick={() => {
                          handleClearChat();
                          setShowMoreMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Clear chat</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Minimize to compact button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className={THEME_CLASSES.button.minimize}
                  title="Minimize"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>

                {/* Close button */}
                <button
                  onClick={handleToggle}
                  className={THEME_CLASSES.button.close}
                  title="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>



            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* Welcome Message */}
              {showWelcome && messages.length === 0 && config.welcome?.enabled && (
                <div className={THEME_CLASSES.welcome.container}>
                  {config.welcome.title && (
                    <h4 className={THEME_CLASSES.welcome.title} style={INLINE_STYLES.welcomeTitle(theme === 'dark')}>
                      {config.welcome.title}
                    </h4>
                  )}
                  {config.welcome.content && (
                    <p className={THEME_CLASSES.welcome.content} style={INLINE_STYLES.welcomeContent(theme === 'dark')}>
                      {config.welcome.content}
                    </p>
                  )}
                  {config.welcome.suggestedCommands && config.welcome.suggestedCommands.length > 0 && (
                    <div className={THEME_CLASSES.welcome.commandsContainer}>
                      <p className={THEME_CLASSES.welcome.commandsHeader}>
                        Try these commands:
                      </p>
                      <div className="space-y-1">
                        {config.welcome.suggestedCommands.map((cmd, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setInputValue(cmd.text);
                              setShowWelcome(false);
                              setTimeout(() => inputRef.current?.focus(), 0);
                            }}
                            className={THEME_CLASSES.welcome.commandButton}
                          >
                            <div className={THEME_CLASSES.welcome.commandText} style={INLINE_STYLES.commandText(theme === 'dark')}>
                              "{cmd.text}"
                            </div>
                            {cmd.desc && (
                              <div className={THEME_CLASSES.welcome.commandDesc} style={INLINE_STYLES.commandDesc(theme === 'dark')}>
                                {cmd.desc}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((message) => (
                <div key={message.id} className={`group flex items-center gap-2 mb-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div
                    className={`inline-block px-4 py-2.5 rounded-2xl max-w-[80%] text-sm shadow-sm transition-all ${
                      message.type === 'user'
                        ? THEME_CLASSES.message.user
                        : message.type === 'ai'
                        ? THEME_CLASSES.message.ai
                        : THEME_CLASSES.message.system
                    }`}
                    style={
                      message.type === 'user'
                        ? INLINE_STYLES.messageUser()
                        : message.type === 'ai'
                        ? INLINE_STYLES.messageAI(theme === 'dark')
                        : INLINE_STYLES.messageSystem(theme === 'dark')
                    }
                    data-testid={`chat-message-${message.type}`}
                  >
                    <div className="break-words leading-relaxed">{message.text}</div>
                  </div>
                  {/* Timestamp beside bubble - relative time with hover tooltip */}
                  <div
                    className={`text-xs opacity-0 group-hover:opacity-70 transition-opacity whitespace-nowrap flex-shrink-0 ${
                      message.type === 'user'
                        ? 'text-gray-400 dark:text-gray-500 text-left'
                        : 'text-gray-600 dark:text-gray-400 text-right'
                    }`}
                    title={typeof window !== 'undefined' ? new Date(message.timestamp).toLocaleString() : ''}
                  >
                    {typeof window !== 'undefined' ? formatRelativeTime(message.timestamp) : ''}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <InputField
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSubmit={handleSend}
              placeholder={config.placeholder}
              glassClasses=""
              theme={theme}
              inputRef={inputRef}
              sendButtonLabel={config.sendButtonLabel}
            />
          </div>
        )}

        {/* Chat Bubble Button - only show when collapsed */}
        {!isExpanded && (
          <button
            onClick={handleToggle}
            className={THEME_CLASSES.bg.bubble}
            data-testid={ChatNames.bubble}
            title="Open chat"
          >
            <img src={config.logo} alt="Supernal" className="w-8 h-8" />

            {/* Unread indicator */}
            {hasUnread && notifications && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg" data-testid="unread-indicator">
                <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </div>
            )}
          </button>
        )}
      </div>

    </>
  );
};
