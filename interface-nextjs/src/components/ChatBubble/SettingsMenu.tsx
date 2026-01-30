/**
 * SettingsMenu Component - Extracted from ChatBubble
 *
 * Provides the settings dropdown menu with options for:
 * - API Key configuration (BYOK mode)
 * - Glass mode (Off, Low, Medium, High)
 * - Theme toggle (Light/Dark)
 * - Voice control toggle
 * - Home/Reset position
 * - Info/Help
 * - Clear chat
 */

import React, { useState } from 'react';
import { THEME_CLASSES, INLINE_STYLES } from './constants';
import { ApiKeyStatus } from '../../hooks/useApiKeyStorage';

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
  // API Key props
  apiKeyStatus?: ApiKeyStatus;
  apiKeyMasked?: string | null;
  apiKeyError?: string | null;
  onApiKeyChange?: (key: string) => Promise<boolean>;
  onApiKeyClear?: () => void;
}

// Status indicator component
const StatusIcon: React.FC<{ status: ApiKeyStatus }> = ({ status }) => {
  switch (status) {
    case 'valid':
      return (
        <span className="text-green-500" title="API key is valid">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </span>
      );
    case 'invalid':
      return (
        <span className="text-red-500" title="API key is invalid">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </span>
      );
    case 'validating':
      return (
        <span className="text-blue-500 animate-spin" title="Validating...">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </span>
      );
    default:
      return null;
  }
};

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
  // API Key props
  apiKeyStatus = 'none',
  apiKeyMasked,
  apiKeyError,
  onApiKeyChange,
  onApiKeyClear,
}) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleApiKeySubmit = async () => {
    if (!apiKeyInput.trim() || !onApiKeyChange) return;
    const success = await onApiKeyChange(apiKeyInput.trim());
    if (success) {
      setApiKeyInput('');
      setShowApiKeyInput(false);
    }
  };

  if (!showMoreMenu) return null;

  return (
    <div
      className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2 min-w-[280px] z-50"
      data-more-menu
    >
      {/* API Key Configuration */}
      {onApiKeyChange && (
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              API Key
            </span>
            <StatusIcon status={apiKeyStatus} />
          </div>

          {apiKeyStatus === 'valid' && apiKeyMasked ? (
            // Key is set - show masked key and clear button
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-mono">
                {apiKeyMasked}
              </code>
              <button
                onClick={() => {
                  onApiKeyClear?.();
                  setApiKeyInput('');
                }}
                className="text-xs text-red-500 hover:text-red-600 px-2 py-1"
                title="Remove API key"
              >
                Clear
              </button>
            </div>
          ) : showApiKeyInput ? (
            // Input mode - show form
            <div className="space-y-2">
              <div className="flex gap-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-ant-..."
                  className="flex-1 text-sm px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApiKeySubmit();
                    }
                    if (e.key === 'Escape') {
                      setShowApiKeyInput(false);
                      setApiKeyInput('');
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title={showKey ? 'Hide' : 'Show'}
                >
                  {showKey ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleApiKeySubmit}
                  disabled={!apiKeyInput.trim() || apiKeyStatus === 'validating'}
                  className="flex-1 text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {apiKeyStatus === 'validating' ? 'Validating...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setShowApiKeyInput(false);
                    setApiKeyInput('');
                  }}
                  className="text-xs px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
              </div>
              {apiKeyError && (
                <p className="text-xs text-red-500">{apiKeyError}</p>
              )}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-500 hover:underline"
              >
                Get an API key from Anthropic →
              </a>
            </div>
          ) : (
            // No key - show configure button
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="w-full text-sm px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Configure API Key
            </button>
          )}
        </div>
      )}

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
