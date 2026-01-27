/**
 * ChatBubbleButton Component - Enhanced with Long-Press Menu
 *
 * Features:
 * - Icon-based design matching subtitle variant (glassy button with @/ icon)
 * - Long-press to show quick settings menu
 * - Click to open chat
 * - Unread indicator
 * - Up/down position controls
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatNames } from './constants';

export interface ChatBubbleButtonProps {
  onClick: () => void;
  hasUnread: boolean;
  unreadCount: number;
  notifications: boolean;
  theme: 'light' | 'dark';
  isMac: boolean;
  // Long-press menu options
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleGlass?: () => void;
  onToggleTheme?: () => void;
  glassMode?: boolean;
  // Icon mode
  useIconMode?: boolean;
  iconText?: string;
}

export const ChatBubbleButton: React.FC<ChatBubbleButtonProps> = ({
  onClick,
  hasUnread,
  unreadCount,
  notifications,
  theme,
  isMac,
  onMoveUp,
  onMoveDown,
  onToggleGlass,
  onToggleTheme,
  glassMode = false,
  useIconMode = false,
  iconText = '@/',
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const LONG_PRESS_DURATION = 500; // 500ms

  // Handle mouse/touch start - start long press timer
  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    setLongPressTriggered(false);
    pressTimerRef.current = setTimeout(() => {
      setLongPressTriggered(true);
      setShowMenu(true);
    }, LONG_PRESS_DURATION);
  };

  // Handle mouse/touch end - trigger click if not long press
  const handlePressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    // Only trigger onClick if this wasn't a long press
    if (!longPressTriggered && !showMenu) {
      onClick();
    }

    setLongPressTriggered(false);
  };

  // Handle mouse leave - cancel long press
  const handleMouseLeave = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setLongPressTriggered(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  // Icon mode - glassy button with @/ icon (matching subtitle variant)
  if (useIconMode) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          className={`p-3 rounded-full transition-all ${
            theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
          } ${longPressTriggered ? 'scale-95' : 'hover:scale-110'}`}
          style={{
            background: theme === 'dark'
              ? 'rgba(55, 65, 81, 0.7)'
              : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            border: theme === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.12)'
              : '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: theme === 'dark'
              ? '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
          }}
          title={`Open chat (hold for options, press ${isMac ? 'Cmd' : 'Ctrl'}+/ for voice)`}
          data-testid={ChatNames.bubble}
          aria-label="Open chat"
        >
          <span className="text-xl font-bold select-none" aria-hidden="true">
            {iconText}
          </span>

          {/* Unread indicator */}
          {hasUnread && notifications && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg" data-testid="unread-indicator">
              <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
          )}
        </button>

        {/* Quick menu (shown on long press) */}
        {showMenu && (
          <div
            className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2 min-w-[180px] z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 mb-1 border-b border-gray-200 dark:border-gray-600">
              Quick Actions
            </div>

            {/* Move up */}
            {onMoveUp && (
              <button
                onClick={() => {
                  onMoveUp();
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span>Move up</span>
              </button>
            )}

            {/* Move down */}
            {onMoveDown && (
              <button
                onClick={() => {
                  onMoveDown();
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>Move down</span>
              </button>
            )}

            {/* Toggle glass */}
            {onToggleGlass && (
              <button
                onClick={() => {
                  onToggleGlass();
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="8" y="8" width="8" height="8" rx="1" strokeWidth="2" />
                </svg>
                <span>{glassMode ? 'Disable' : 'Enable'} glass</span>
              </button>
            )}

            {/* Toggle theme */}
            {onToggleTheme && (
              <button
                onClick={() => {
                  onToggleTheme();
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>{theme === 'light' ? 'Dark' : 'Light'} mode</span>
              </button>
            )}

            <div className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1 mt-1 border-t border-gray-200 dark:border-gray-600">
              Hold {isMac ? 'Cmd' : 'Ctrl'}+/ to record
            </div>
          </div>
        )}
      </div>
    );
  }

  // Legacy mode - image-based logo button
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center relative hover:scale-110"
      data-testid={ChatNames.bubble}
      title={`Open chat (press ${isMac ? 'Cmd' : 'Ctrl'}+/ for voice recording)`}
    >
      <span className="text-2xl">💬</span>

      {/* Unread indicator */}
      {hasUnread && notifications && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg" data-testid="unread-indicator">
          <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
        </div>
      )}
    </button>
  );
};
