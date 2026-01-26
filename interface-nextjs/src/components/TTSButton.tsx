/**
 * TTS Button Component
 *
 * Small speaker button that appears next to AI messages
 * Speaks the message text when clicked
 */

import React from 'react';
import { useTTS } from '../hooks/useTTS';

export interface TTSButtonProps {
  /**
   * Text to speak
   */
  text: string;

  /**
   * Use premium API voices (default: false - uses native)
   */
  usePremiumVoices?: boolean;

  /**
   * Playback speed
   */
  speed?: number;

  /**
   * Button size
   */
  size?: 'small' | 'normal';

  /**
   * Theme
   */
  theme?: 'light' | 'dark';
}

export function TTSButton({
  text,
  usePremiumVoices = false,
  speed = 1.0,
  size = 'small',
  theme = 'light',
}: TTSButtonProps) {
  const { speak, stop, isPlaying, error, isNativeSupported } = useTTS();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger parent click events

    if (isPlaying) {
      stop();
    } else {
      await speak({
        text,
        speed,
        usePremium: usePremiumVoices,
        preferNative: !usePremiumVoices,
      });
    }
  };

  if (!isNativeSupported && !usePremiumVoices) {
    // No TTS available
    return null;
  }

  const isDark = theme === 'dark';
  const iconSize = size === 'small' ? 'w-3 h-3' : 'w-4 h-4';
  const buttonPadding = size === 'small' ? 'p-1' : 'p-2';

  return (
    <button
      onClick={handleClick}
      className={`${buttonPadding} rounded-lg transition-all ${
        isPlaying
          ? 'bg-blue-500 text-white animate-pulse'
          : error
          ? 'bg-red-500 text-white'
          : isDark
          ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700/50'
          : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100/50'
      }`}
      title={isPlaying ? 'Stop speaking' : 'Read aloud'}
      data-testid="tts-button"
      aria-label={isPlaying ? 'Stop speaking' : 'Read aloud'}
    >
      {isPlaying ? (
        // Stop icon (pulsing square)
        <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : error ? (
        // Error icon
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        // Speaker icon
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.414a2 2 0 002.828 0l1.768-1.768a2 2 0 00 0-2.828l-1.768-1.768a2 2 0 00-2.828 0V15.414z" />
        </svg>
      )}
    </button>
  );
}
