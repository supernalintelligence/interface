/**
 * SettingsMenu Component - Extracted from ChatBubble
 *
 * Provides the settings dropdown menu with options for:
 * - Glass mode (Off, Low, Medium, High)
 * - Theme toggle (Light/Dark)
 * - Voice control toggle
 * - Home/Reset position
 * - Info/Help
 * - Clear chat
 */

import React from 'react';
import { THEME_CLASSES, INLINE_STYLES } from './constants';

export interface SettingsMenuProps {
  showMoreMenu: boolean;
  onClose: () => void;
  localGlassMode: boolean;
  glassOpacity: 'low' | 'medium' | 'high';
  theme: 'light' | 'dark';
  voiceEnabled: boolean;
  onGlassModeChange: (enabled: boolean, opacity?: 'low' | 'medium' | 'high') => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onVoiceEnabledChange: (enabled: boolean) => void;
  onHome: () => void;
  onInfo: () => void;
  onClearChat?: () => void;
  onSendMessage: (message: string) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  showMoreMenu,
  onClose,
  localGlassMode,
  glassOpacity,
  theme,
  voiceEnabled,
  onGlassModeChange,
  onThemeChange,
  onVoiceEnabledChange,
  onHome,
  onInfo,
  onClearChat,
  onSendMessage,
}) => {
  if (!showMoreMenu) return null;

  return (
    <div
      className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2 min-w-[220px] z-50"
      data-more-menu
    >
      {/* Glass Mode - 4 icon buttons (Off, Low, Medium, High) */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 mb-2">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => onGlassModeChange(false)}
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
            onClick={() => onGlassModeChange(true, 'low')}
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
            onClick={() => onGlassModeChange(true, 'medium')}
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
            onClick={() => onGlassModeChange(true, 'high')}
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
          onThemeChange(newTheme);
          if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newTheme);
          }
        }}
        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
      </button>

      {/* Voice Control Toggle */}
      <button
        onClick={() => {
          onVoiceEnabledChange(!voiceEnabled);
          if (!voiceEnabled) {
            // Show help message when enabling voice
            onSendMessage('Voice control enabled! Use the microphone button to speak, or click speaker icons to hear messages.');
          }
        }}
        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <span>{voiceEnabled ? 'Disable' : 'Enable'} Voice</span>
      </button>

      {/* Home button */}
      <button
        onClick={() => {
          onHome();
          onClose();
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
          onInfo();
          onClose();
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
            onClearChat();
            onClose();
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
  );
};
