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

type Variant = 'full' | 'floating';

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
  /** Variant: 'full' for expanded panel, 'floating' for mini draggable bubble */
  variant?: Variant;
  /** Configuration for branding, text, and theme */
  config?: ChatBubbleConfig;
  /** Initial expanded state */
  defaultExpanded?: boolean;
  /** Storage key for persisting state */
  storageKey?: string;
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
  inputRef?: React.RefObject<HTMLInputElement | null>;
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
  const [showInfo, setShowInfo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDocked, setIsDocked] = useState(true);
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [, setTimestampTick] = useState(0); // Forces re-render for timestamp updates
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

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
          setIsExpanded(state.isExpanded ?? defaultExpanded);
          setIsMinimized(state.isMinimized ?? false);
          setIsDocked(state.isDocked ?? true);
          setPanelPosition(state.panelPosition || { x: 0, y: 0 });
          setTheme(state.theme || 'light');
        }
      } catch {
        // Keep default value
      }
    }
  }, [storageKey, variant, defaultExpanded]);

  // Detect system theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

  // Auto-update timestamps every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestampTick(tick => tick + 1);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (variant === 'full') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ isExpanded, isMinimized, isDocked, panelPosition, theme })
        );
      } catch (error) {
        console.error('Failed to save chat state:', error);
      }
    }
  }, [isExpanded, isMinimized, isDocked, panelPosition, theme, storageKey, variant]);

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

      // Escape to close chat, info popup, or more menu
      if (e.key === 'Escape') {
        if (showMoreMenu) {
          setShowMoreMenu(false);
        } else if (showInfo) {
          setShowInfo(false);
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
  }, [isExpanded, showInfo, showMoreMenu, variant]);

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
    setIsDragging(true);

    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate current center of panel in viewport
    const currentCenterX = rect.left + rect.width / 2;
    const currentCenterY = rect.top + rect.height / 2;

    // Calculate what panelPosition should be to place panel at current location
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const targetX = currentCenterX - viewportCenterX;
    const targetY = currentCenterY - viewportCenterY;

    setIsDocked(false);
    setPanelPosition({ x: targetX, y: targetY });

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: targetX,
      initialY: targetY,
    };
  };

  useEffect(() => {
    if (!isDragging || !dragRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      setPanelPosition({
        x: dragRef.current.initialX + deltaX,
        y: dragRef.current.initialY + deltaY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;

      // Check if near edge to dock
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        const threshold = 50;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (rect.right > windowWidth - threshold ||
            rect.left < threshold ||
            rect.top < threshold ||
            rect.bottom > windowHeight - threshold) {
          setIsDocked(true);
          setPanelPosition({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

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
    setIsDocked(true);
    setPanelPosition({ x: 0, y: 0 });
  };

  const handleHome = () => {
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

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const dockClasses = DOCK_POSITIONS[position];
  const primaryColor = config.theme?.primary || 'blue';
  const glassMode = config.glassMode ?? true;

  // Calculate dynamic size - max 80vh
  const maxHeightVh = 80;
  const dynamicHeight = `min(${maxHeightVh}vh, 700px)`;
  const panelWidth = 'min(650px, calc(100vw - 2rem))'; // Wider panel

  // Note: Keep class strings inline in JSX for Tailwind JIT detection
  // Storing in variables causes Tailwind to miss them during scanning

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
        <div className={glassMode
          ? 'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-3 max-w-xs'
          : 'bg-white dark:bg-gray-900 border-gray-200 rounded-2xl shadow-2xl border p-3 max-w-xs'
        }>
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
            className={glassMode
              ? 'absolute backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-4 transition-all duration-300'
              : 'absolute bg-white dark:bg-gray-900 border-gray-200 rounded-3xl shadow-2xl border p-4 transition-all duration-300'
            }
            style={{
              ...dockClasses.panel,
              width: panelWidth,
              maxWidth: '400px',
            }}
          >
            {/* Header with expand button */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Avatar avatar={config.avatar} size="small" />
                {config.title && (
                  <span className={THEME_CLASSES.text.floatingTitle}>{config.title}</span>
                )}
              </div>
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
                title="Expand chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>

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
        )}

        {/* Expanded Chat Panel */}
        {isExpanded && !isMinimized && (
          <div
            ref={panelRef}
            className={`${isDocked ? 'absolute' : 'fixed'} ${glassMode
              ? 'bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-gray-900/80 dark:via-gray-900/70 dark:to-gray-900/60'
              : 'bg-white dark:bg-gray-900'
            } rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300`}
            style={{
              width: panelWidth,
              height: dynamicHeight,
              ...(isDocked ? dockClasses.panel : {
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${panelPosition.x}px), calc(-50% + ${panelPosition.y}px))`,
              }),
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
                  <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2 z-[100] min-w-[160px]" data-more-menu>
                    {/* Theme toggle */}
                    <button
                      onClick={() => {
                        handleToggleTheme();
                        setShowMoreMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {theme === 'light' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                      <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
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

                    {/* Info button */}
                    <button
                      onClick={() => {
                        setShowInfo(!showInfo);
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

            {/* Info popup */}
            {showInfo && (
              <div className={THEME_CLASSES.text.infoPopup} style={INLINE_STYLES.infoText(theme === 'dark')}>
                <div className="font-bold mb-2">How to Use</div>
                <div className="space-y-2 text-xs" style={INLINE_STYLES.infoText(theme === 'dark')}>
                  <div>• <strong>Theme:</strong> Toggle between light and dark modes</div>
                  <div>• <strong>Home:</strong> Reset chat position to default</div>
                  <div>• <strong>Minimize:</strong> Compact view with last message</div>
                  <div>• <strong>Clear:</strong> Delete all messages and start fresh</div>
                  <div>• <strong>Drag:</strong> Click and drag header to reposition</div>
                  <div>• <strong>Keyboard:</strong> Press "/" to open, Esc to close</div>
                </div>
                {config.description && (
                  <div className="mt-3 pt-3 border-t border-gray-300/30 dark:border-gray-600/30">
                    {config.description}
                  </div>
                )}
              </div>
            )}

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
            {hasUnread && (
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
