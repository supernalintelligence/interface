/**
 * Universal Chat Bubble Component
 *
 * A flexible, site-neutral chat interface that supports:
 * - Multiple positioning modes (left/right/bottom corners + edges)
 * - Two variants: 'full' (expanded panel) and 'floating' (draggable mini bubble)
 * - Professional appearance with clean design
 * - Optional info popup instead of hardcoded descriptions
 */

import React, { useState, useRef, useEffect } from 'react';
import { Components } from '../../../../names/Components';

// Chat component names (use the flat Components namespace)
const ChatNames = {
  bubble: Components.ChatToggleButton,
  input: Components.ChatInput,
  sendButton: Components.ChatSendButton,
  clearButton: Components.ChatClearButton,
};

// Mock useChatInput for now - this should be injected via props or context
const useChatInput = () => ({
  registerInput: (callback: (text: string, submit?: boolean) => void) => {}
});

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

const POSITION_CLASSES: Record<Position, { container: string; panel: string }> = {
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
  title: 'AI Assistant',
  avatar: '🤖',
  placeholder: 'Type your message...',
  sendButtonLabel: 'Send',
  welcome: {
    enabled: false,
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
  const [inputValue, setInputValue] = useState('');
  const [lastReadMessageCount, setLastReadMessageCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(
    config.welcome?.enabled && messages.length === 0
  );
  const [showInfo, setShowInfo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  // Load expanded state from localStorage after hydration
  useEffect(() => {
    if (variant === 'full') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) {
          const state = JSON.parse(stored);
          setIsExpanded(state.isExpanded ?? defaultExpanded);
        }
      } catch {
        // Keep default value
      }
    }
  }, [storageKey, variant, defaultExpanded]);

  // Register with chat input context
  const { registerInput } = useChatInput();

  useEffect(() => {
    registerInput((text: string, submit = false) => {
      setInputValue(text);
      if (!isExpanded && variant === 'full') {
        setIsExpanded(true);
      }
      // Auto-focus and submit if requested
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
      // Escape to close info popup
      if (e.key === 'Escape' && showInfo) {
        setShowInfo(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, showInfo, variant]);

  // Drag handlers for floating variant
  const handleMouseDown = (e: React.MouseEvent) => {
    if (variant !== 'floating') return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: bubblePosition.x,
      initialY: bubblePosition.y,
    };
  };

  useEffect(() => {
    if (variant !== 'floating' || !isDragging || !dragRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      setBubblePosition({
        x: dragRef.current.initialX + deltaX,
        y: dragRef.current.initialY + deltaY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, variant]);

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
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (variant === 'full') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ isExpanded: newExpandedState })
        );
      } catch (error) {
        console.error('Failed to save chat state:', error);
      }
    }
  };

  const positionClasses = POSITION_CLASSES[position];
  const primaryColor = config.theme?.primary || 'blue';

  // Floating variant - compact draggable bubble
  if (variant === 'floating') {
    const recentMessage = messages[messages.length - 1];

    return (
      <div
        className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          transform: `translate(${bubblePosition.x}px, ${bubblePosition.y}px)`,
          ...(!isDragging && { transition: 'transform 0.2s ease-out' }),
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 max-w-xs">
          {/* Mini header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {typeof config.avatar === 'string' ? (
                <span className="text-lg">{config.avatar}</span>
              ) : (
                config.avatar
              )}
              {config.title && (
                <span className="font-medium text-sm text-gray-900">{config.title}</span>
              )}
            </div>
            {onClearChat && (
              <button
                onClick={onClearChat}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
            <div className="mb-2">
              <div
                className={`text-xs px-2 py-1.5 rounded ${
                  recentMessage.type === 'user'
                    ? `bg-${primaryColor}-600 text-white`
                    : recentMessage.type === 'ai'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-50 text-yellow-800'
                }`}
              >
                {recentMessage.text.length > 60
                  ? `${recentMessage.text.slice(0, 60)}...`
                  : recentMessage.text}
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
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              data-testid={ChatNames.input}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`px-2 py-1 bg-${primaryColor}-600 text-white rounded hover:bg-${primaryColor}-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs font-medium`}
              data-testid={ChatNames.sendButton}
            >
              →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Full variant - expandable panel
  return (
    <>
      {/* Chat Container */}
      <div className={`fixed ${positionClasses.container} z-50`}>
        {/* Expanded Chat Panel */}
        {isExpanded && (
          <div className={`absolute ${positionClasses.panel} w-[calc(100vw-2rem)] sm:w-[500px] lg:w-[600px] h-[calc(100vh-10rem)] sm:h-[600px] lg:h-[700px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-${primaryColor}-50 to-${config.theme?.secondary || 'purple'}-50`}>
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                {config.avatar && (
                  <div className="relative flex-shrink-0">
                    {typeof config.avatar === 'string' ? (
                      <div className={`w-10 h-10 bg-gradient-to-br from-${primaryColor}-500 to-${config.theme?.secondary || 'purple'}-600 rounded-full flex items-center justify-center`}>
                        <span className="text-white text-lg">{config.avatar}</span>
                      </div>
                    ) : (
                      config.avatar
                    )}
                  </div>
                )}
                {/* Title */}
                {config.title && (
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-base truncate">
                      {config.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* Header actions */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                {/* Info button */}
                {config.description && (
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-white/50"
                    title="Information"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
                {/* Clear button */}
                {onClearChat && (
                  <button
                    onClick={onClearChat}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-white/50"
                    title="Clear chat"
                    data-testid={ChatNames.clearButton}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                {/* Minimize button */}
                <button
                  onClick={handleToggle}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-white/50"
                  title="Minimize chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Info popup */}
            {showInfo && config.description && (
              <div className={`px-4 py-3 bg-${primaryColor}-50 border-b border-${primaryColor}-100 text-sm text-gray-700`}>
                {config.description}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome Message */}
              {showWelcome && messages.length === 0 && config.welcome?.enabled && (
                <div className={`bg-gradient-to-br from-${primaryColor}-50 to-${config.theme?.secondary || 'purple'}-50 p-4 rounded-xl border border-${primaryColor}-200 shadow-sm`}>
                  {config.welcome.title && (
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      {config.welcome.title}
                    </h4>
                  )}
                  {config.welcome.content && (
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {config.welcome.content}
                    </p>
                  )}
                  {config.welcome.suggestedCommands && config.welcome.suggestedCommands.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-xs font-medium text-gray-900 mb-2">
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
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
                          >
                            <div className={`text-sm font-medium text-${primaryColor}-700 group-hover:text-${primaryColor}-900`}>
                              "{cmd.text}"
                            </div>
                            {cmd.desc && (
                              <div className="text-xs text-gray-500 mt-0.5">
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
                <div key={message.id} className="flex flex-col">
                  <div
                    className={`inline-block px-4 py-2.5 rounded-2xl max-w-[85%] sm:max-w-md text-sm shadow-sm ${
                      message.type === 'user'
                        ? `bg-${primaryColor}-600 text-white ml-auto`
                        : message.type === 'ai'
                        ? 'bg-gray-100 text-gray-900 border border-gray-200'
                        : 'bg-yellow-100 text-yellow-900 border border-yellow-200'
                    }`}
                    data-testid={`chat-message-${message.type}`}
                  >
                    <div className="break-words">{message.text}</div>
                  </div>
                  <div className={`text-xs text-gray-400 mt-1.5 px-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    {typeof window !== 'undefined' ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={config.placeholder}
                  className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
                  data-testid={ChatNames.input}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className={`px-5 py-3 bg-${primaryColor}-600 text-white rounded-xl hover:bg-${primaryColor}-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:shadow-none`}
                  data-testid={ChatNames.sendButton}
                >
                  {config.sendButtonLabel}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Chat Bubble Button */}
        <button
          onClick={handleToggle}
          className={`w-14 h-14 bg-${primaryColor}-600 hover:bg-${primaryColor}-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center relative`}
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
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-md" data-testid="unread-indicator">
              <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
          )}
        </button>
      </div>
    </>
  );
};
