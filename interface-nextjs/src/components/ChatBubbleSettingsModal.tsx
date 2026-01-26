/**
 * Chat Bubble Settings Modal Component
 *
 * Settings modal for ChatBubble configuration:
 * - Theme (light/dark)
 * - Glass mode (glassmorphism effect)
 * - Notifications
 */

import React, { useEffect } from 'react';

export interface ChatBubbleSettings {
  theme: 'light' | 'dark';
  glassMode: boolean;
  notifications: boolean;
  // Drawer settings
  displayMode?: 'auto' | 'floating' | 'full' | 'drawer';
  drawerSide?: 'left' | 'right';
  // Voice settings
  voiceEnabled: boolean;
  usePremiumVoices: boolean;
  autoReadResponses: boolean;
  ttsSpeed: number;
}

interface ChatBubbleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatBubbleSettings;
  onSettingsChange: (settings: ChatBubbleSettings) => void;
}

export function ChatBubbleSettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: ChatBubbleSettingsModalProps) {
  const [localSettings, setLocalSettings] = React.useState<ChatBubbleSettings>(settings);

  // Sync with parent settings when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings); // Reset to original
    onClose();
  };

  const isDark = localSettings.theme === 'dark';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[60] backdrop-blur-sm"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        data-testid="chat-settings-modal"
      >
        <div
          className={`${
            isDark
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-900'
          } rounded-2xl shadow-2xl max-w-md w-full p-6 border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              id="settings-modal-title"
              className="text-2xl font-bold"
            >
              Chat Settings
            </h2>
            <button
              onClick={handleCancel}
              className={`${
                isDark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-400 hover:text-gray-600'
              } transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-5 mb-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-base font-medium mb-1">
                  Theme
                </label>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Switch between light and dark modes
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
                  className={`p-2 rounded-lg transition-all ${
                    localSettings.theme === 'light'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Light mode"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                  className={`p-2 rounded-lg transition-all ${
                    localSettings.theme === 'dark'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Dark mode"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Glass Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-base font-medium mb-1">
                  Glass Mode
                </label>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enable glassmorphism transparency effect
                </p>
              </div>
              <button
                onClick={() =>
                  setLocalSettings({ ...localSettings, glassMode: !localSettings.glassMode })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.glassMode ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={localSettings.glassMode}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.glassMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-base font-medium mb-1">
                  Notifications
                </label>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Show unread message indicators
                </p>
              </div>
              <button
                onClick={() =>
                  setLocalSettings({ ...localSettings, notifications: !localSettings.notifications })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.notifications ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={localSettings.notifications}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Divider */}
            <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} my-2`} />

            {/* Display Mode Selector */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-base font-medium mb-1">
                  Display Mode
                </label>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Auto switches drawer on mobile, panel on desktop
                </p>
              </div>
              <select
                value={localSettings.displayMode || 'auto'}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  displayMode: e.target.value as 'auto' | 'floating' | 'full' | 'drawer'
                })}
                className={`px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              >
                <option value="auto">Auto (Recommended)</option>
                <option value="drawer">Always Drawer</option>
                <option value="full">Always Panel</option>
                <option value="floating">Always Floating</option>
              </select>
            </div>

            {/* Drawer Side Toggle (conditional) */}
            {(localSettings.displayMode === 'auto' || localSettings.displayMode === 'drawer') && (
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-base font-medium mb-1">
                    Drawer Side
                  </label>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Which edge drawer slides from
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, drawerSide: 'left' })}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      localSettings.drawerSide === 'left'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, drawerSide: 'right' })}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      localSettings.drawerSide === 'right'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} my-2`} />

            {/* Voice Settings Header */}
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-1">Voice Control</h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Enable voice input and audio feedback
              </p>
            </div>

            {/* Voice Enabled Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-base font-medium mb-1">
                  Voice Control
                </label>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enable voice input and TTS responses
                </p>
              </div>
              <button
                onClick={() =>
                  setLocalSettings({ ...localSettings, voiceEnabled: !localSettings.voiceEnabled })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.voiceEnabled ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={localSettings.voiceEnabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Voice settings (only shown when voice is enabled) */}
            {localSettings.voiceEnabled && (
              <>
                {/* Auto-read AI Responses */}
                <div className="flex items-center justify-between pl-4 border-l-2 border-blue-500/30">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Auto-read AI Responses
                    </label>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Automatically read AI messages aloud
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setLocalSettings({ ...localSettings, autoReadResponses: !localSettings.autoReadResponses })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localSettings.autoReadResponses ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={localSettings.autoReadResponses}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.autoReadResponses ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Premium Voices Toggle */}
                <div className="flex items-center justify-between pl-4 border-l-2 border-blue-500/30">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Premium Voices 💎
                    </label>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Use high-quality OpenAI voices (requires network)
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setLocalSettings({ ...localSettings, usePremiumVoices: !localSettings.usePremiumVoices })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localSettings.usePremiumVoices ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={localSettings.usePremiumVoices}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.usePremiumVoices ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* TTS Speed Slider */}
                <div className="pl-4 border-l-2 border-blue-500/30">
                  <label className="block text-sm font-medium mb-2">
                    Voice Speed: {localSettings.ttsSpeed.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={localSettings.ttsSpeed}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, ttsSpeed: parseFloat(e.target.value) })
                    }
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0.5x (Slow)</span>
                    <span>1.0x (Normal)</span>
                    <span>2.0x (Fast)</span>
                  </div>
                </div>

                {/* Info banner for free vs premium */}
                {!localSettings.usePremiumVoices && (
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`text-xs ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                      💚 Using free device voices (works offline, zero cost)
                    </p>
                  </div>
                )}

                {localSettings.usePremiumVoices && (
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                    <p className={`text-xs ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                      💎 Using premium OpenAI voices (requires internet connection)
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleCancel}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
