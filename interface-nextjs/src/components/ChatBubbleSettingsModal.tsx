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
