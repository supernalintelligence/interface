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

const DOCK_POSITIONS: Record<Position, { container: string; panel: string }> = {
  'bottom-right': {
    container: 'bottom-4 right-4 sm:bottom-6 sm:right-6',
    panel: 'bottom-16 right-0',
  },
  'bottom-left': {
    container: 'bottom-4 left-4 sm:bottom-6 sm:left-6',
    panel: 'bottom-16 left-0',
  },
  'top-right': {
    container: 'top-4 right-4 sm:top-6 sm:right-6',
    panel: 'top-16 right-0',
  },
  'top-left': {
    container: 'top-4 left-4 sm:top-6 sm:left-6',
    panel: 'top-16 left-0',
  },
  'left-center': {
    container: 'left-4 top-1/2 -translate-y-1/2',
    panel: 'left-16 top-0',
  },
  'right-center': {
    container: 'right-4 top-1/2 -translate-y-1/2',
    panel: 'right-16 top-0',
  },
  'bottom-center': {
    container: 'bottom-4 left-1/2 -translate-x-1/2',
    panel: 'bottom-16 left-1/2 -translate-x-1/2',
  },
};

const DEFAULT_CONFIG: ChatBubbleConfig = {
  title: 'Supernal Intelligence Interface',
  avatar: '🤖',
  description: 'I\'m a TOOL system AI can use to control this site',
  placeholder: 'Try: toggle notifications',
  sendButtonLabel: 'Execute',
  glassMode: true,
  welcome: {
    enabled: true,
    title: '👋 Welcome! I\'m NOT an AI',
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

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  position = 'bottom-right',
  variant = 'full',
  config: userConfig,
  defaultExpanded = true,
  storageKey = 'chat-bubble-state',
}) => {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

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
        }
      } catch {
        // Keep default value
      }
    }
  }, [storageKey, variant, defaultExpanded]);

  // Save state to localStorage
  useEffect(() => {
    if (variant === 'full') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ isExpanded, isMinimized, isDocked, panelPosition })
        );
      } catch (error) {
        console.error('Failed to save chat state:', error);
      }
    }
  }, [isExpanded, isMinimized, isDocked, panelPosition, storageKey, variant]);

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
  }, [registerInput, onSendMessage, isExpanded, variant]);

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
      // Command+/ to focus input (full variant only)
      if ((e.metaKey || e.ctrlKey) && e.key === '/' && variant === 'full') {
        e.preventDefault();
        if (!isExpanded) {
          setIsExpanded(true);
        }
        inputRef.current?.focus();
      }
      // Escape to close info popup or undock
      if (e.key === 'Escape') {
        if (showInfo) {
          setShowInfo(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, showInfo, variant]);

  // Drag handlers
  const handlePanelMouseDown = (e: React.MouseEvent) => {
    if (variant !== 'full' || !isExpanded) return;
    // Only drag from header area
    const target = e.target as HTMLElement;
    if (!target.closest('[data-drag-handle]')) return;

    setIsDragging(true);
    setIsDocked(false);
    const rect = panelRef.current?.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: isDocked ? 0 : panelPosition.x,
      initialY: isDocked ? 0 : panelPosition.y,
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

  const dockClasses = DOCK_POSITIONS[position];
  const primaryColor = config.theme?.primary || 'blue';
  const glassMode = config.glassMode ?? true;

  // Calculate dynamic size - max 80vh
  const maxHeightVh = 80;
  const dynamicHeight = `min(${maxHeightVh}vh, 700px)`;
  const panelWidth = 'min(650px, calc(100vw - 2rem))'; // Wider panel

  // Glassmorphism classes with edge fade
  const glassClasses = glassMode
    ? 'backdrop-blur-2xl bg-gradient-to-b from-white/80 via-white/75 to-white/70 dark:from-gray-900/80 dark:via-gray-900/75 dark:to-gray-900/70 border-white/30'
    : 'bg-white dark:bg-gray-900 border-gray-200';

  const lastMessage = messages[messages.length - 1];
  const secondLastMessage = messages[messages.length - 2];

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
        <div className={`${glassClasses} rounded-2xl shadow-2xl border p-3 max-w-xs`}>
          {/* Mini header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {typeof config.avatar === 'string' ? (
                <span className="text-lg">{config.avatar}</span>
              ) : (
                config.avatar
              )}
              {config.title && (
                <span className="font-medium text-sm text-gray-900 dark:text-white">{config.title}</span>
              )}
            </div>
            {onClearChat && (
              <button
                onClick={onClearChat}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
            <div className="mb-2 group">
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
              <div className="text-xs text-gray-400 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {typeof window !== 'undefined' ? new Date(recentMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </div>
            </div>
          )}

          {/* Compact input */}
          <form onSubmit={handleSend} className="flex space-x-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={config.placeholder}
              className={`flex-1 px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${glassClasses}`}
              data-testid={ChatNames.input}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all text-xs font-medium shadow-md hover:shadow-lg"
              data-testid={ChatNames.sendButton}
            >
              →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Full variant - expandable panel with glass aesthetic
  return (
    <>
      {/* Chat Container */}
      <div className={`fixed ${isDocked ? dockClasses.container : ''} z-50`}>
        {/* Minimized Compact View */}
        {isExpanded && isMinimized && lastMessage && (
          <div
            className={`absolute ${dockClasses.panel} ${glassClasses} rounded-3xl shadow-2xl border p-4 transition-all duration-300 cursor-pointer hover:scale-105`}
            style={{ width: panelWidth, maxWidth: '400px' }}
            onClick={() => setIsMinimized(false)}
          >
            <div className="space-y-2">
              {/* Last AI message */}
              {lastMessage.type === 'ai' && (
                <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {lastMessage.text}
                </div>
              )}
              {/* Last user message if different */}
              {secondLastMessage && secondLastMessage.type === 'user' && (
                <div className="text-xs text-blue-600 dark:text-blue-400 line-clamp-1">
                  You: {secondLastMessage.text}
                </div>
              )}
              <div className="text-xs text-gray-400 text-center">
                Click to expand
              </div>
            </div>
          </div>
        )}

        {/* Expanded Chat Panel */}
        {isExpanded && !isMinimized && (
          <div
            ref={panelRef}
            className={`${isDocked ? 'absolute ' + dockClasses.panel : 'fixed'} ${glassClasses} rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-300`}
            style={{
              width: panelWidth,
              height: dynamicHeight,
              ...((!isDocked && {
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${panelPosition.x}px), calc(-50% + ${panelPosition.y}px))`,
              })),
              ...(isDragging && { cursor: 'grabbing' }),
            }}
          >
            {/* Header - Draggable */}
            <div
              data-drag-handle
              className={`flex items-center justify-between p-4 border-b border-white/20 ${glassMode ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' : 'bg-gradient-to-r from-blue-50 to-purple-50'} cursor-move`}
              onMouseDown={handlePanelMouseDown}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                {config.avatar && (
                  <div className="relative flex-shrink-0">
                    {typeof config.avatar === 'string' ? (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">{config.avatar}</span>
                      </div>
                    ) : (
                      config.avatar
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                  </div>
                )}
                {/* Title */}
                {config.title && (
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">
                      {config.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* Header actions */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                {/* Dock/Undock button */}
                {!isDocked && (
                  <button
                    onClick={handleDock}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white/30"
                    title="Dock to corner"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM16 7a1 1 0 011-1h2a1 1 0 011 1v10a1 1 0 01-1 1h-2a1 1 0 01-1-1V7z" />
                    </svg>
                  </button>
                )}
                {/* Info button */}
                {config.description && (
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white/30"
                    title="Information"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
                {/* Minimize to compact button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-white/30"
                  title="Minimize to compact view"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                {/* Clear button */}
                {onClearChat && (
                  <button
                    onClick={onClearChat}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-white/30"
                    title="Clear chat"
                    data-testid={ChatNames.clearButton}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                {/* Close button */}
                <button
                  onClick={handleToggle}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-white/30"
                  title="Close chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Info popup */}
            {showInfo && config.description && (
              <div className="px-4 py-3 bg-blue-500/10 backdrop-blur-sm border-b border-blue-200/30 text-sm text-gray-700 dark:text-gray-200">
                {config.description}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome Message */}
              {showWelcome && messages.length === 0 && config.welcome?.enabled && (
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm p-4 rounded-2xl border border-blue-200/30 shadow-lg">
                  {config.welcome.title && (
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                      {config.welcome.title}
                    </h4>
                  )}
                  {config.welcome.content && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                      {config.welcome.content}
                    </p>
                  )}
                  {config.welcome.suggestedCommands && config.welcome.suggestedCommands.length > 0 && (
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-3 rounded-xl border border-gray-200/30 shadow-sm">
                      <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">
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
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all group border border-transparent hover:border-blue-200/50 hover:shadow-md"
                          >
                            <div className="text-sm font-medium text-blue-700 dark:text-blue-400 group-hover:text-blue-900 dark:group-hover:text-blue-300">
                              "{cmd.text}"
                            </div>
                            {cmd.desc && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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
                <div key={message.id} className="flex flex-col group">
                  <div
                    className={`inline-block px-5 py-3 rounded-3xl max-w-[80%] text-sm shadow-lg transition-all hover:scale-[1.02] ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white ml-auto shadow-purple-500/30 hover:shadow-purple-500/50'
                        : message.type === 'ai'
                        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-800 dark:via-gray-800 dark:to-zinc-800 text-gray-800 dark:text-gray-100 border border-gray-200/30 dark:border-gray-700/30 hover:shadow-xl'
                        : 'bg-gradient-to-br from-amber-50 to-orange-100 text-orange-900 border border-orange-200/30 hover:shadow-xl'
                    }`}
                    data-testid={`chat-message-${message.type}`}
                  >
                    <div className="break-words leading-relaxed">{message.text}</div>
                    {/* Timestamp inside bubble on hover */}
                    <div className={`text-xs mt-1 pt-1 border-t opacity-0 group-hover:opacity-70 transition-opacity ${
                      message.type === 'user'
                        ? 'border-white/20 text-white/80'
                        : 'border-gray-300/30 dark:border-gray-600/30 text-gray-500 dark:text-gray-400'
                    }`}>
                      {typeof window !== 'undefined' ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className={`p-4 border-t border-white/20 ${glassMode ? 'bg-gradient-to-r from-gray-50/50 to-gray-100/50 backdrop-blur-sm' : 'bg-gray-50'}`}>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={config.placeholder}
                  className={`w-full pl-4 pr-12 py-3 text-sm border rounded-3xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm ${glassClasses}`}
                  data-testid={ChatNames.input}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:scale-110 disabled:shadow-none disabled:scale-100"
                  data-testid={ChatNames.sendButton}
                  title={config.sendButtonLabel}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Chat Bubble Button */}
        <button
          onClick={handleToggle}
          className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center relative hover:scale-110"
          data-testid={ChatNames.bubble}
          title={isExpanded ? 'Minimize chat' : 'Open chat'}
        >
          {isExpanded ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}

          {/* Unread indicator */}
          {hasUnread && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center animate-pulse shadow-lg" data-testid="unread-indicator">
              <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
          )}
        </button>
      </div>
    </>
  );
};
