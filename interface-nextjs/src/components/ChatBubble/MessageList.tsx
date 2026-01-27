/**
 * MessageList Component - Extracted from ChatBubble
 *
 * Renders the chat message list with:
 * - User/AI/System message bubbles
 * - Timestamps on hover
 * - TTS buttons for AI messages
 * - Welcome message
 * - Markdown rendering
 */

import React from 'react';
import { MessageRenderer } from '../MessageRenderer';
import { TTSButton } from '../TTSButton';
import { THEME_CLASSES, INLINE_STYLES } from './constants';
import type { Message, ChatBubbleConfig } from './types';

export interface MessageListProps {
  messages: Message[];
  showWelcome: boolean;
  config: ChatBubbleConfig;
  theme: 'light' | 'dark';
  voiceEnabled: boolean;
  usePremiumVoices: boolean;
  ttsSpeed: number;
  onWelcomeCommandClick: (command: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  showWelcome,
  config,
  theme,
  voiceEnabled,
  usePremiumVoices,
  ttsSpeed,
  onWelcomeCommandClick,
  messagesEndRef,
}) => {
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

  return (
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
                    onClick={() => onWelcomeCommandClick(cmd.text)}
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
            <MessageRenderer content={message.text} theme={theme} />
          </div>
          {/* TTS button for AI messages */}
          {message.type === 'ai' && voiceEnabled && (
            <TTSButton
              text={message.text}
              usePremiumVoices={usePremiumVoices}
              speed={ttsSpeed}
              theme={theme}
              size="small"
            />
          )}
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
  );
};
