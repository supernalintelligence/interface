'use client';

/**
 * Persistent Chat Bubble Component
 *
 * Fixed position chat bubble in lower right corner that:
 * - Appears on every page
 * - Expands/collapses without blocking content
 * - Provides AI interface for tool execution
 */

import React, { useState, useRef, useEffect } from 'react';
import { useChatInput } from '../contexts/ChatInputContext';
import { useChatContext } from '../contexts/ChatProvider';

// Chat component names - match expected test IDs from architecture
const ChatNames = {
  bubble: 'chat-bubble',
  input: 'chat-input',
  sendButton: 'chat-send-button',
  clearButton: 'chat-clear-button',
  messages: 'chat-messages',
};

interface ChatBubbleProps {
  theme?: 'light' | 'dark' | 'auto';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  welcomeMessage?: string;
}

const CHAT_EXPANDED_KEY = 'supernal-chat-expanded';

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  theme = 'auto',
  position = 'bottom-right',
  welcomeMessage
}) => {
  // Get messages and actions from context
  const { messages, sendMessage, clearMessages } = useChatContext();
  // Initialize with default value (false) - chat should start minimized
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [lastReadMessageCount, setLastReadMessageCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true); // Always start true to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false); // Track if we're on client
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
    // Hide welcome if there are messages
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages.length]);
  
  // Load expanded state from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHAT_EXPANDED_KEY);
      if (stored !== null) {
        setIsExpanded(JSON.parse(stored));
      }
    } catch {
      // Keep default value
    }
  }, []);
  
  // Register with chat input context
  const { registerInput } = useChatInput();
  
  useEffect(() => {
    registerInput((text: string, submit = false) => {
      setInputValue(text);
      if (!isExpanded) {
        setIsExpanded(true);
      }
      // Auto-focus and submit if requested
      setTimeout(() => {
        inputRef.current?.focus();
        if (submit) {
          sendMessage(text);
          setInputValue('');
        }
      }, 100);
    });
  }, [registerInput, sendMessage, isExpanded]);
  
  // Track unread messages
  const unreadCount = Math.max(0, messages.length - lastReadMessageCount);
  const hasUnread = unreadCount > 0 && !isExpanded;

  useEffect(() => {
    if (isExpanded) {
      // Position at bottom without scrolling animation
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      // Mark all messages as read when chat is expanded
      setLastReadMessageCount(messages.length);
      // Hide welcome if messages exist
      if (messages.length > 0) {
        setShowWelcome(false);
      }
      // Auto-focus input when expanded
      inputRef.current?.focus();
    }
  }, [messages, isExpanded]);

  // Auto-focus on mount
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  // Command+/ keyboard shortcut to focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [isExpanded]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage(inputValue.trim());
    setInputValue('');
    // Re-focus input after sending
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    // Persist the expanded state to localStorage
    try {
      localStorage.setItem(CHAT_EXPANDED_KEY, JSON.stringify(newExpandedState));
    } catch {
      // Failed to save chat expanded state
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]">
        {/* Expanded Chat Panel - Responsive sizing */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-[500px] lg:w-[600px] h-[calc(100vh-10rem)] sm:h-[min(600px,calc(100vh-6rem))] lg:h-[min(700px,calc(100vh-6rem))] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
            {/* Header - Updated Messaging */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-base sm:text-lg">🤖</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Supernal Intelligence Interface</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">
                    I&apos;m a TOOL system AI can use to control this site
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={clearMessages}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear chat"
                  data-testid={ChatNames.clearButton}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  onClick={handleToggle}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Minimize chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3" data-testid={ChatNames.messages}>
              {/* Welcome Message */}
              {showWelcome && messages.length === 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 sm:p-4 rounded-lg border border-blue-200 mb-4">
                  <h4 className="font-bold text-gray-900 mb-2 text-xs sm:text-sm">
                    👋 Welcome! I&apos;m NOT an AI
                  </h4>
                  <p className="text-xs text-gray-700 mb-3">
                    I&apos;m a <strong>tool system</strong> that AI assistants (like Claude, GPT) 
                    can use to navigate and control this site. This enables <strong>agentic UX</strong> — 
                    instead of clicking around, you tell an AI what you want, and it uses me to do it.
                  </p>
                  <div className="bg-white p-2 sm:p-3 rounded border border-gray-200 mb-3">
                    <p className="text-xs font-medium text-gray-900 mb-2">
                      Try these commands:
                    </p>
                    <div className="space-y-1">
                      {[
                        { text: 'open the docs', desc: 'Navigate to documentation' },
                        { text: 'show me the story system', desc: 'View story system guide' },
                        { text: 'go to examples', desc: 'Browse code examples' },
                      ].map((cmd) => (
                        <button
                          key={cmd.text}
                          onClick={() => {
                            setInputValue(cmd.text);
                            setShowWelcome(false);
                            setTimeout(() => inputRef.current?.focus(), 0);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-blue-50 transition-colors group"
                        >
                          <div className="text-xs font-mono text-blue-700 group-hover:text-blue-900">
                            &quot;{cmd.text}&quot;
                          </div>
                          <div className="text-xs text-gray-500 hidden sm:block">
                            {cmd.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 italic">
                    Type a command or click a suggestion above to start
                  </p>
                </div>
              )}
              
              {/* Chat Messages */}
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col">
                  <div 
                    className={`inline-block px-3 py-2 rounded-lg max-w-[85%] sm:max-w-xs text-xs sm:text-sm ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white ml-auto' 
                        : message.type === 'ai'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800 text-xs'
                    }`}
                    data-testid={`chat-message-${message.type}`}
                  >
                    {message.text}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 px-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Try: toggle notifications"
                  className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  data-testid={ChatNames.input}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm font-medium"
                  data-testid={ChatNames.sendButton}
                >
                  Execute
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 hidden sm:block">
                <strong>Demo:</strong> Commands execute @Tool methods and update widgets above
              </div>
            </form>
          </div>
        )}

        {/* Chat Bubble Button */}
        <button
          onClick={handleToggle}
          className="absolute bottom-0 right-0 w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
          data-testid={ChatNames.bubble}
          title={isExpanded ? 'Minimize chat' : 'Open AI chat'}
        >
          {isExpanded ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>

        {/* Unread indicator */}
        {hasUnread && (
          <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse" data-testid="unread-indicator">
            <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </div>
        )}
      </div>
    </>
  );
};
