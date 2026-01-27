/**
 * SubtitleOverlay Component - Minimalist Voice-First Overlay
 *
 * A transparent subtitle-style chat overlay that floats over website content.
 * Features:
 * - Mobile-first: 100% opacity on mobile (always visible)
 * - Desktop: Adaptive 10-90% opacity based on activity
 * - Voice/text fusion with smart detection
 * - Supernal @/ brand icon instead of microphone
 * - Seamless mode switching
 */

import React, { useState, useEffect, useRef } from 'react';
import type { Message } from './ChatBubble/types';
import type { ChatBubbleConfig } from './ChatBubble/types';
import { TTSPlaylistMenu } from './TTSPlaylistMenu';
import { extractPageSuggestions, type Suggestion } from '../utils/pageContentParser';
import { detectBackgroundContext } from '../utils/backgroundDetection';
import { detectTTSWidgets, extractTTSWidgets, type TTSWidgetInstance } from '../utils/ttsDetection';
import { GLASS_RESPONSE_BUBBLE, GLASS_INVERTED } from './ChatBubble/constants';

/**
 * Overlay states determine opacity levels
 */
type OverlayState = 'idle' | 'listening' | 'typing' | 'speaking';

/**
 * Expansion states for swipe collapse
 */
type ExpansionState = 'collapsed' | 'expanded';

/**
 * Context for mode detection algorithm
 */
interface ModeContext {
  isListening: boolean;
  inputValue: string;
  lastInputMethod: 'voice' | 'text' | null;
  timeSinceLastInput: number; // ms since last interaction
}

/**
 * Opacity configurations per platform and state
 */
const opacityStates = {
  mobile: {
    idle: 1.0,      // Always full opacity
    listening: 1.0,
    typing: 1.0,
    speaking: 1.0
  },
  desktop: {
    idle: 0.4,      // Increased from 0.1 for better visibility
    listening: 0.7,
    typing: 0.9,
    speaking: 0.5
  }
};

/**
 * Smart mode detection: voice-first with text fallback
 */
function detectMode(context: ModeContext): 'voice' | 'text' {
  // Priority 1: User is actively listening
  if (context.isListening) return 'voice';

  // Priority 2: User has typed something
  if (context.inputValue.trim().length > 0) return 'text';

  // Priority 3: Recent usage pattern
  if (context.lastInputMethod && context.timeSinceLastInput < 10000) {
    return context.lastInputMethod;
  }

  // Default: Voice (voice-first design)
  return 'voice';
}

/**
 * Get overlay opacity based on state and platform
 */
const getOverlayOpacity = (state: OverlayState, isMobile: boolean): number => {
  return isMobile ? opacityStates.mobile[state] : opacityStates.desktop[state];
};

export interface SubtitleOverlayProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: (text: string) => void;
  voiceEnabled: boolean;
  isListening: boolean;
  onMicClick: () => void;
  theme: 'light' | 'dark';
  config: ChatBubbleConfig;
  sttTranscript?: string;
  resetTranscript?: () => void;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  voiceEnabled,
  isListening,
  onMicClick,
  theme,
  config,
  sttTranscript,
  resetTranscript
}) => {
  const [overlayState, setOverlayState] = useState<OverlayState>('idle');
  const [opacity, setOpacity] = useState(1.0); // Start at full opacity
  const [lastInputMethod, setLastInputMethod] = useState<'voice' | 'text' | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [messageOpacity, setMessageOpacity] = useState(1.0); // AI message opacity
  const [expansionState, setExpansionState] = useState<ExpansionState>('collapsed');
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const lastInputTimeRef = useRef<number>(Date.now());
  const autoFadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageFadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // New feature states
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [glassTheme, setGlassTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [detectedGlassTheme, setDetectedGlassTheme] = useState<'light' | 'dark'>('light');
  const [hasTTSWidgets, setHasTTSWidgets] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [ttsWidgets, setTTSWidgets] = useState<TTSWidgetInstance[]>([]);
  const [touchStartYInput, setTouchStartYInput] = useState<number | null>(null);

  // Detect mobile viewport (< 768px) and set initial expansion state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Start expanded on desktop for better keyboard access
      if (!mobile && expansionState === 'collapsed') {
        setExpansionState('expanded');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-fade timer: Fade to 40% after 5 seconds of inactivity (DESKTOP ONLY)
  useEffect(() => {
    // Clear existing timer
    if (autoFadeTimerRef.current) {
      clearTimeout(autoFadeTimerRef.current);
      autoFadeTimerRef.current = null;
    }

    // Only auto-fade on desktop when idle
    if (!isMobile && overlayState === 'idle') {
      autoFadeTimerRef.current = setTimeout(() => {
        setOpacity(0.4);
      }, 5000);
    }

    return () => {
      if (autoFadeTimerRef.current) {
        clearTimeout(autoFadeTimerRef.current);
      }
    };
  }, [overlayState, isMobile]);

  // Auto-fade AI message: Fade out after 8 seconds of display
  useEffect(() => {
    // Clear existing timer
    if (messageFadeTimerRef.current) {
      clearTimeout(messageFadeTimerRef.current);
      messageFadeTimerRef.current = null;
    }

    // Reset message opacity when new message arrives
    setMessageOpacity(1.0);

    // Start fade-out timer (8 seconds)
    messageFadeTimerRef.current = setTimeout(() => {
      setMessageOpacity(0);
    }, 8000);

    return () => {
      if (messageFadeTimerRef.current) {
        clearTimeout(messageFadeTimerRef.current);
      }
    };
  }, [messages.filter(m => m.type === 'ai').slice(-1)[0]?.text]); // Re-trigger when last AI message changes

  // Auto-execute voice commands (subtitle variant is always auto-execute)
  useEffect(() => {
    if (sttTranscript && voiceEnabled && resetTranscript) {
      // Automatically send the voice command
      onSendMessage(sttTranscript);
      resetTranscript();

      // Auto-expand when voice command is sent
      setExpansionState('expanded');

      // Track as voice input
      setLastInputMethod('voice');
      lastInputTimeRef.current = Date.now();
    }
  }, [sttTranscript, voiceEnabled, resetTranscript, onSendMessage]);

  // Initialize suggestions from page content
  useEffect(() => {
    const pageSuggestions = extractPageSuggestions();
    setSuggestions(pageSuggestions);
  }, []);

  // Detect TTS widgets on the page (with re-detection on DOM changes)
  useEffect(() => {
    const detectWidgets = () => {
      const detected = detectTTSWidgets();
      setHasTTSWidgets(detected);

      if (detected) {
        const widgets = extractTTSWidgets();
        setTTSWidgets(widgets);
      } else {
        setTTSWidgets([]);
      }
    };

    // Initial detection
    detectWidgets();

    // Re-detect when DOM changes (throttled)
    let timeoutId: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(detectWidgets, 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  // Background detection and adaptive glassmorphism
  useEffect(() => {
    if (glassTheme !== 'auto') return;

    const { glassTheme: detected } = detectBackgroundContext();
    setDetectedGlassTheme(detected);

    // Re-detect on scroll (throttled)
    let lastDetection = Date.now();
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastDetection > 500) {
        const { glassTheme: newDetected } = detectBackgroundContext();
        setDetectedGlassTheme(newDetected);
        lastDetection = now;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [glassTheme]);

  // Global keyboard shortcut: `/` or `Ctrl+K` to expand and focus
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // `/` key to expand (when not already focused in an input)
      if (e.key === '/' && expansionState === 'collapsed' &&
          !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setExpansionState('expanded');
        // Focus will be handled by the auto-focus effect below
      }

      // `Ctrl+K` or `Cmd+K` to expand and focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (expansionState === 'collapsed') {
          setExpansionState('expanded');
        } else {
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [expansionState]);

  // Auto-focus input when expanding
  useEffect(() => {
    if (expansionState === 'expanded' && inputRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [expansionState]);

  // Determine overlay state and opacity based on activity
  useEffect(() => {
    const timeSinceLastInput = Date.now() - lastInputTimeRef.current;

    const context: ModeContext = {
      isListening,
      inputValue,
      lastInputMethod,
      timeSinceLastInput
    };

    const detectedMode = detectMode(context);

    // Update overlay state and opacity
    if (isListening) {
      setOverlayState('listening');
      setOpacity(getOverlayOpacity('listening', isMobile));
    } else if (inputValue.trim()) {
      setOverlayState('typing');
      setOpacity(getOverlayOpacity('typing', isMobile));
    } else {
      setOverlayState('idle');
      // Don't immediately set to 0.1 - let auto-fade timer handle it
      if (isMobile) {
        setOpacity(1.0);
      }
    }
  }, [isListening, inputValue, lastInputMethod, isMobile]);

  // Handle input change with mode tracking
  const handleInputChange = (value: string) => {
    onInputChange(value);
    setLastInputMethod('text');
    lastInputTimeRef.current = Date.now();
  };

  // Handle icon click - different behavior based on expansion state
  const handleIconClick = () => {
    if (expansionState === 'collapsed') {
      // Collapsed: expand the overlay AND start listening
      setExpansionState('expanded');
      if (!isListening && voiceEnabled) {
        onMicClick(); // Start listening
        setLastInputMethod('voice');
        lastInputTimeRef.current = Date.now();
      }
    } else {
      // Expanded: toggle voice listening
      onMicClick();
      setLastInputMethod('voice');
      lastInputTimeRef.current = Date.now();
    }
  };

  // Swipe down to collapse
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;

    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY;

    // Swipe down by at least 50px to collapse
    if (deltaY > 50 && expansionState === 'expanded') {
      setExpansionState('collapsed');
      setTouchStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  // Handle send message
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      lastInputTimeRef.current = Date.now();
    }
  };

  // Handle Enter and Escape keys
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleSend();
    }
    // ESC key: stop listening if active, otherwise collapse overlay
    if (e.key === 'Escape') {
      if (isListening) {
        onMicClick(); // Stop listening
      } else if (expansionState === 'expanded') {
        setExpansionState('collapsed'); // Collapse overlay
      }
    }
  };

  // Handle tapping on placeholder suggestion
  const handleSuggestionTap = () => {
    if (suggestions.length > 0 && !inputValue.trim()) {
      onInputChange(suggestions[currentSuggestionIndex].text);
    }
  };

  // Handle swipe up/down on input to cycle suggestions
  const handleInputTouchStart = (e: React.TouchEvent) => {
    setTouchStartYInput(e.touches[0].clientY);
  };

  const handleInputTouchMove = (e: React.TouchEvent) => {
    if (touchStartYInput === null || inputValue.trim()) return; // Only when input is empty

    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartYInput;

    // Swipe up (next suggestion) - threshold: 30px
    if (deltaY < -30) {
      setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      setTouchStartYInput(null);
    }
    // Swipe down (previous suggestion) - threshold: 30px
    else if (deltaY > 30) {
      setCurrentSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      setTouchStartYInput(null);
    }
  };

  const handleInputTouchEnd = () => {
    setTouchStartYInput(null);
  };

  // Handle TTS widget selection
  const handleWidgetSelect = (widget: TTSWidgetInstance) => {
    console.log('[SubtitleOverlay] Selecting widget:', widget);

    // Find the widget wrapper (in case element is the play button)
    const wrapper = widget.element.closest('.supernal-tts-widget') || widget.element;

    // Find the play button for scrolling target
    const playButton = wrapper.querySelector('.supernal-tts-play') as HTMLElement;
    const scrollTarget = playButton || wrapper;

    console.log('[SubtitleOverlay] Scrolling to:', scrollTarget);

    // Scroll to play button if available, otherwise wrapper
    // Use 'start' to position at top, accounting for overlay at bottom
    scrollTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });

    // Close playlist
    setShowPlaylist(false);

    // Trigger TTS playback after scroll completes (800ms for smooth scroll)
    setTimeout(() => {
      if (playButton) {
        console.log('[SubtitleOverlay] Clicking Supernal TTS play button:', playButton);
        playButton.click();
      } else {
        console.warn('[SubtitleOverlay] No play button found in widget. Widget may not be initialized yet.');
        console.warn('[SubtitleOverlay] Widget element:', wrapper);
        console.warn('[SubtitleOverlay] Widget HTML:', wrapper.innerHTML.substring(0, 300));
      }
    }, 800);
  };

  // Handle TTS playlist button click
  const handleTTSPlaylistClick = () => {
    // If only one widget, scroll directly to it (skip menu)
    if (ttsWidgets.length === 1) {
      handleWidgetSelect(ttsWidgets[0]);
    } else {
      // Multiple widgets: show menu
      setShowPlaylist(!showPlaylist);
    }
  };

  // Get effective glass theme (auto or manual override)
  const effectiveGlassTheme = glassTheme === 'auto' ? detectedGlassTheme : glassTheme;

  // Get glass styles based on effective theme
  const glassStyles = effectiveGlassTheme === 'dark'
    ? GLASS_INVERTED.darkOnLight
    : GLASS_INVERTED.lightOnDark;

  // Get last AI message for subtitle display
  const lastAiMessage = messages.filter(m => m.type === 'ai').slice(-1)[0];

  // Determine icon based on state
  const getIcon = (): string => {
    if (expansionState === 'collapsed') return '@/';
    if (isListening) return '~/';
    return '</';
  };

  // Determine icon title based on state
  const getIconTitle = (): string => {
    if (expansionState === 'collapsed') return 'Tap to open chat';
    if (isListening) return 'Tap to stop recording';
    return 'Tap to start voice input';
  };

  // Collapsed: Show icon in bottom right + TTS playlist button on left (if TTS detected)
  if (expansionState === 'collapsed') {
    return (
      <>
        {/* TTS Playlist button (left side) */}
        {hasTTSWidgets && (
          <button
            type="button"
            onClick={handleTTSPlaylistClick}
            className={`fixed p-3 rounded-full transition-all ${
              theme === 'dark' ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
            }`}
            style={{
              bottom: isMobile ? 'calc(env(safe-area-inset-bottom, 0px) + 16px)' : '16px',
              left: '16px',
              zIndex: 55,
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
            title={ttsWidgets.length === 1 ? 'Go to readable section' : 'View readable sections'}
            data-testid="tts-playlist-button"
            aria-label={ttsWidgets.length === 1 ? 'Go to readable section' : 'View readable sections'}
          >
            <span className="text-xl font-bold select-none" aria-hidden="true">
              ~+
            </span>
          </button>
        )}

        {/* TTS Playlist Menu */}
        <TTSPlaylistMenu
          isOpen={showPlaylist}
          onClose={() => setShowPlaylist(false)}
          widgets={ttsWidgets}
          theme={theme}
          onWidgetSelect={handleWidgetSelect}
        />

        {/* Main icon (right side) */}
        <div
          className="fixed"
          style={{
            bottom: isMobile ? 'calc(env(safe-area-inset-bottom, 0px) + 16px)' : '16px',
            right: '16px',
            zIndex: 55
          }}
          data-testid="subtitle-overlay-collapsed"
        >
          <button
          type="button"
          onClick={handleIconClick}
          className={`p-3 rounded-full transition-all ${
            theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
          }`}
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
          title={getIconTitle()}
          data-testid="voice-input-button"
          aria-label={getIconTitle()}
        >
          <span className="text-xl font-bold select-none" aria-hidden="true">
            {getIcon()}
          </span>
        </button>
        </div>
      </>
    );
  }

  // Expanded: Show input with icon on right
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ease-in-out`}
      style={{
        opacity,
        bottom: isMobile ? 'env(safe-area-inset-bottom, 0px)' : '0px',
        zIndex: 55,
        maxWidth: isMobile ? '100vw' : '650px',
        marginLeft: isMobile ? '0' : 'auto',
        marginRight: isMobile ? '0' : 'auto',
        padding: isMobile ? '12px' : '16px'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-testid="subtitle-overlay"
      role="complementary"
      aria-label="Chat overlay"
    >
      {/* AI message in separate glass bubble with enhanced styling */}
      {lastAiMessage && messageOpacity > 0 && (
        <div
          className={`mb-2 px-4 py-2 text-sm rounded-2xl transition-opacity duration-1000 ease-out animate-popup-in ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
          style={{
            opacity: messageOpacity,
            pointerEvents: messageOpacity === 0 ? 'none' : 'auto',
            ...(theme === 'dark' ? GLASS_RESPONSE_BUBBLE.dark : GLASS_RESPONSE_BUBBLE.light),
            animation: messageOpacity === 0 ? 'popupFadeOut 0.5s forwards' : undefined
          }}
          role="status"
          aria-live="polite"
        >
          <span className="font-medium opacity-70">AI:</span> {lastAiMessage.text}
        </div>
      )}

      {/* Input container with adaptive glassmorphism */}
      <div className="flex items-center space-x-2">
        {/* TTS Playlist button (left side, visible in expanded mode) */}
        {hasTTSWidgets && (
          <button
            type="button"
            onClick={handleTTSPlaylistClick}
            className={`p-2 rounded-full transition-all flex-shrink-0 ${
              theme === 'dark' ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
            }`}
            style={{
              background: theme === 'dark'
                ? 'rgba(55, 65, 81, 0.5)'
                : 'rgba(243, 244, 246, 0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: theme === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.08)'
            }}
            title={ttsWidgets.length === 1 ? 'Go to readable section' : 'View readable sections'}
            data-testid="tts-playlist-button-expanded"
            aria-label={ttsWidgets.length === 1 ? 'Go to readable section' : 'View readable sections'}
          >
            <span className="text-lg font-bold select-none" aria-hidden="true">~+</span>
          </button>
        )}

        {/* Main input container */}
        <div
          className="flex-1 flex items-center space-x-2 px-4 py-2 rounded-3xl"
          style={{
            ...glassStyles,
            border: effectiveGlassTheme === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.12)'
              : '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Text input field with swipeable placeholder suggestions */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onTouchStart={handleInputTouchStart}
          onTouchMove={handleInputTouchMove}
          onTouchEnd={handleInputTouchEnd}
          onClick={handleSuggestionTap}
          placeholder={
            suggestions.length > 0 && !inputValue.trim()
              ? `${suggestions[currentSuggestionIndex].text} (tap to use, swipe ↕ to change)`
              : config.placeholder || 'Type or speak...'
          }
          className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none placeholder:opacity-60"
          style={{
            color: effectiveGlassTheme === 'dark'
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(0, 0, 0, 0.9)'
          }}
          data-testid="chat-input"
          aria-label="Chat message input"
        />

        {/* Waveform during listening - inline with input */}
        {isListening && (
          <div className="flex space-x-1 items-center" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-red-500 rounded-full animate-pulse"
                style={{
                  height: `${8 + Math.random() * 8}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Send button - only when typing */}
        {inputValue.trim() && !isListening && (
          <button
            type="button"
            onClick={handleSend}
            className="p-2 rounded-full text-white transition-all flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.95))',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            title="Send message"
            data-testid="send-button"
            aria-label="Send message"
          >
            <span className="text-base select-none" aria-hidden="true">→</span>
          </button>
        )}

        {/* Voice icon - comes LAST (on the right) */}
        {voiceEnabled && (
          <button
            type="button"
            onClick={handleIconClick}
            className={`p-2 rounded-full transition-all flex-shrink-0 ${
              isListening
                ? 'text-white animate-pulse'
                : `${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`
            }`}
            style={isListening ? {
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.9))',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 0 16px rgba(239, 68, 68, 0.5), 0 2px 6px rgba(0, 0, 0, 0.2)'
            } : {
              background: theme === 'dark'
                ? 'rgba(55, 65, 81, 0.5)'
                : 'rgba(243, 244, 246, 0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: theme === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.08)'
            }}
            title={getIconTitle()}
            data-testid="voice-input-button"
            aria-label={getIconTitle()}
          >
            <span className="text-lg font-bold select-none" aria-hidden="true">
              {getIcon()}
            </span>
          </button>
        )}

        {/* X button to collapse */}
        <button
          type="button"
          onClick={() => setExpansionState('collapsed')}
          className={`p-2 rounded-full transition-all flex-shrink-0 ${
            theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'
          }`}
          style={{
            background: theme === 'dark'
              ? 'rgba(55, 65, 81, 0.5)'
              : 'rgba(243, 244, 246, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: theme === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.08)'
          }}
          title="Collapse"
          data-testid="collapse-button"
          aria-label="Collapse overlay"
        >
          <span className="text-lg font-bold select-none" aria-hidden="true">×</span>
        </button>
        </div>
      </div>
    </div>
  );
};
