/**
 * Header Component - Extracted from ChatBubble
 *
 * Renders the chat header with:
 * - Avatar
 * - Title
 * - Action buttons (external link, more menu, minimize, close)
 * - Draggable handle
 */

import React from 'react';
import { Avatar } from './Avatar';
import { SettingsMenu } from './SettingsMenu';
import { THEME_CLASSES } from './constants';
import type { ChatBubbleConfig } from './types';

export interface HeaderProps {
  config: ChatBubbleConfig;
  theme: 'light' | 'dark';
  glassMode: boolean;
  showMoreMenu: boolean;
  onMoreMenuToggle: () => void;
  onMinimize: () => void;
  onClose: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  // Settings menu props
  localGlassMode: boolean;
  glassOpacity: 'low' | 'medium' | 'high';
  voiceEnabled: boolean;
  onGlassModeChange: (enabled: boolean, opacity?: 'low' | 'medium' | 'high') => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onVoiceEnabledChange: (enabled: boolean) => void;
  onHome: () => void;
  onInfo: () => void;
  onClearChat?: () => void;
  onSendMessage: (message: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  theme,
  glassMode,
  showMoreMenu,
  onMoreMenuToggle,
  onMinimize,
  onClose,
  onMouseDown,
  localGlassMode,
  glassOpacity,
  voiceEnabled,
  onGlassModeChange,
  onThemeChange,
  onVoiceEnabledChange,
  onHome,
  onInfo,
  onClearChat,
  onSendMessage,
}) => {
  return (
    <div
      data-drag-handle
      className={`${THEME_CLASSES.bg.header} ${glassMode ? THEME_CLASSES.bg.headerGradient : THEME_CLASSES.bg.headerLight} cursor-move`}
      onMouseDown={onMouseDown}
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
          onClick={onMoreMenuToggle}
          className={THEME_CLASSES.button.more}
          title="More options"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>

        {/* Settings menu dropdown */}
        <SettingsMenu
          showMoreMenu={showMoreMenu}
          onClose={() => onMoreMenuToggle()}
          localGlassMode={localGlassMode}
          glassOpacity={glassOpacity}
          theme={theme}
          voiceEnabled={voiceEnabled}
          onGlassModeChange={onGlassModeChange}
          onThemeChange={onThemeChange}
          onVoiceEnabledChange={onVoiceEnabledChange}
          onHome={onHome}
          onInfo={onInfo}
          onClearChat={onClearChat}
          onSendMessage={onSendMessage}
        />

        {/* Minimize to compact button */}
        <button
          onClick={onMinimize}
          className={THEME_CLASSES.button.minimize}
          title="Minimize"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className={THEME_CLASSES.button.close}
          title="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
