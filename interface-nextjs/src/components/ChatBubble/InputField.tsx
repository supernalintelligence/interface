/**
 * Input Field Component for ChatBubble
 */

import React from 'react';
import { INLINE_STYLES, THEME_CLASSES, ChatNames } from './constants';
import type { InputFieldProps } from './types';

// Shared input component - defined OUTSIDE to prevent recreation on every render
export const InputField: React.FC<InputFieldProps> = ({
  compact = false,
  inputValue,
  onInputChange,
  onSubmit,
  placeholder,
  glassClasses,
  theme,
  inputRef,
  sendButtonLabel,
  voiceEnabled = false,
  isListening = false,
  onMicClick,
  modKey = 'Ctrl',
  onKeyDown,
}) => (
  <form onSubmit={onSubmit} className={compact ? 'flex space-x-2' : THEME_CLASSES.bg.inputForm + ' ' + 'bg-transparent'}>
    <div className={compact ? 'flex space-x-2 flex-1' : 'relative'}>
      <input
        ref={compact ? undefined : inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={compact
          ? `flex-1 px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${glassClasses}`
          : `w-full pl-4 ${inputValue.trim() ? 'pr-12' : 'pr-12'} py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${glassClasses}`
        }
        style={INLINE_STYLES.input(theme === 'dark')}
        data-testid={ChatNames.input}
      />
      {/* Microphone button (voice input) - only show when input is empty OR while recording */}
      {voiceEnabled && onMicClick && !compact && (!inputValue.trim() || isListening) && (
        <button
          type="button"
          onClick={onMicClick}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={isListening ? 'Stop recording (ESC)' : `Voice input (click or press ${modKey}+/)`}
          data-testid="voice-input-button"
        >
          {isListening ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      )}
      {/* Send button - only show when user has typed something */}
      {inputValue.trim() && (
        <button
          type="submit"
          className={compact
            ? "px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all text-xs font-medium shadow-md hover:shadow-lg"
            : THEME_CLASSES.input.sendButton
          }
          data-testid={ChatNames.sendButton}
          title={sendButtonLabel}
        >
          {compact ? '→' : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </button>
      )}
    </div>
  </form>
);
