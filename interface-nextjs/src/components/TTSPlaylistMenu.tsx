/**
 * TTSPlaylistMenu Component
 *
 * Glassmorphism-styled menu showing TTS widget instances on the page
 * - Displays TTS widgets found on the page
 * - Click widget to scroll to it
 * - Glassmorphism styling matching SubtitleOverlay
 */

import React from 'react';
import type { TTSWidgetInstance } from '../utils/ttsDetection';

export interface TTSPlaylistMenuProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: TTSWidgetInstance[];
  theme: 'light' | 'dark';
  onWidgetSelect: (widget: TTSWidgetInstance) => void;
}

export const TTSPlaylistMenu: React.FC<TTSPlaylistMenuProps> = ({
  isOpen,
  onClose,
  widgets,
  theme,
  onWidgetSelect
}) => {
  // Don't render if not open OR if no widgets exist
  if (!isOpen || widgets.length === 0) return null;

  const handleWidgetClick = (widget: TTSWidgetInstance) => {
    onWidgetSelect(widget);
  };

  const glassStyles = theme === 'dark'
    ? {
        background: 'rgba(31, 41, 55, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }
    : {
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      };

  return (
    <div
      className="fixed z-50"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)',
        left: '16px',
        maxHeight: '50vh',
        width: 'min(90vw, 400px)'
      }}
      data-testid="tts-playlist-menu"
    >
      {/* Glassmorphism container */}
      <div
        style={{
          ...glassStyles,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '16px'
        }}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <h3
            className={`font-semibold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Readable Sections
          </h3>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
            }`}
            title="Close"
            data-testid="close-playlist-menu"
          >
            <span className="text-lg font-bold" aria-hidden="true">×</span>
          </button>
        </div>

        {/* Widget list */}
        <div className="overflow-y-auto max-h-80 p-2">
          {widgets.length === 0 ? (
            <div
              className={`p-6 text-center text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              No readable sections found on this page
            </div>
          ) : (
            widgets.map((widget) => (
              <button
                key={widget.id}
                onClick={() => handleWidgetClick(widget)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-white/10'
                    : 'hover:bg-black/5'
                }`}
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
                data-testid="playlist-widget-item"
              >
                {/* Widget label */}
                <div
                  className={`font-medium text-sm flex items-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <span className="mr-2" aria-hidden="true">🔊</span>
                  {widget.label || `TTS Widget ${widget.id}`}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TTSPlaylistMenu;
