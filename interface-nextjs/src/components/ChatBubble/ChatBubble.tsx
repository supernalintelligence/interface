/**
 * Universal Chat Bubble Component - Premium Edition
 *
 * A stunning, flexible chat interface with:
 * - Draggable & dockable positioning
 * - Liquid glass (glassmorphism) aesthetic
 * - Dynamic sizing based on content
 * - Timestamps on hover
 * - Beautiful gradient message bubbles
 * - Professional animations
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useChatInput } from '../../contexts/ChatInputContext';
import { MessageRenderer } from '../MessageRenderer';
import { useTTS } from '../../hooks/useTTS';
import { useSTT } from '../../hooks/useSTT';
import { TTSButton } from '../TTSButton';
import { SubtitleOverlay } from '../SubtitleOverlay';
import '../../styles/markdown.css';

// Import from extracted modules in same directory
import {
  ChatNames,
  DEFAULT_CONFIG,
  DOCK_POSITIONS,
  INLINE_STYLES,
  THEME_CLASSES,
} from './constants';
import { InputField } from './InputField';
import { Avatar } from './Avatar';
import type {
  Position,
  Variant,
  DisplayMode,
  ChatBubbleProps,
} from './types';

export const ChatBubble = ({
  messages,
  onSendMessage,
  onClearChat,
  position = 'bottom-right',
  variant = 'full',
  config: userConfig,
  defaultExpanded = true,
  storageKey = 'chat-bubble-state',
  displayMode: propDisplayMode = 'auto',
  drawerSide: propDrawerSide = 'right',
}: ChatBubbleProps) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...userConfig };

  // If custom logo provided, sync avatar to match
  if (userConfig?.logo && !userConfig?.avatar) {
    mergedConfig.avatar = <img src={userConfig.logo} alt="Supernal" className="w-6 h-6" />;
  }

  const config = mergedConfig;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMinimized, setIsMinimized] = useState(false); // New minimized state
  const [inputValue, setInputValue] = useState('');
  const [lastReadMessageCount, setLastReadMessageCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(
    config.welcome?.enabled && messages.length === 0
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragInitiated, setDragInitiated] = useState(false); // Track mouse down before threshold
  const [isDocked, setIsDocked] = useState(true);
  const [dockPosition, setDockPosition] = useState<Position>(position); // Track which edge is docked
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [, setTimestampTick] = useState(0); // Forces re-render for timestamp updates
  const [localGlassMode, setLocalGlassMode] = useState(config.glassMode ?? true);
  const [glassOpacity, setGlassOpacity] = useState<'low' | 'medium' | 'high'>('medium'); // Glass opacity: Low/Medium/High
  const [notifications, setNotifications] = useState(true);

  // Voice control settings - ENABLED BY DEFAULT for better discoverability
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [usePremiumVoices, setUsePremiumVoices] = useState(false);
  const [autoReadResponses, setAutoReadResponses] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState(1.0);

  // STT Auto-Record settings (Shift+/ feature)
  const [sttAutoRecordTimeout, setSttAutoRecordTimeout] = useState(5000); // 5 seconds default
  const [sttAutoExecute, setSttAutoExecute] = useState(true); // Auto-execute commands
  const sttAutoRecordTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize voice hooks
  const { speak: speakTTS, stop: stopTTS, isPlaying: isTTSPlaying } = useTTS();
  const { startListening, stopListening, transcript: sttTranscript, isListening, resetTranscript } = useSTT();

  // Drawer state variables
  const [displayMode, setDisplayMode] = useState<DisplayMode>(propDisplayMode);
  const [drawerSide, setDrawerSide] = useState<'left' | 'right'>(propDrawerSide);

  // Sync displayMode state when prop changes (e.g., from URL parameter)
  useEffect(() => {
    setDisplayMode(propDisplayMode);
  }, [propDisplayMode]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<{x: number; y: number; time: number} | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0); // 0-100%
  const [isMobile, setIsMobile] = useState(false);

  // Double-escape detection for variant cycling
  const lastEscapeTimeRef = useRef<number>(0);
  const DOUBLE_ESCAPE_THRESHOLD_MS = 500; // 500ms window for double-tap

  // Platform detection for keyboard shortcuts
  const [isMac, setIsMac] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  // Hydration state - prevents flicker during SSR/client mismatch
  const [isHydrated, setIsHydrated] = useState(false);

  // Detect platform on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = window.navigator.platform.toLowerCase();
      const isMacPlatform = platform.includes('mac');
      setIsMac(isMacPlatform);
    }
  }, []);

  // Rotating hints for input placeholder
  const inputHints = useMemo(() => {
    const modKey = isMac ? 'Cmd' : 'Ctrl';
    return [
      `Press ${modKey}+/ to start voice recording`,
      'Press ESC to close this chat',
      'Type your message or click the mic',
      sttAutoExecute ? `Voice commands execute automatically` : 'Voice commands fill this input',
    ];
  }, [isMac, sttAutoExecute]);

  // Advance hint to next one when messages change (after sending a message)
  useEffect(() => {
    setCurrentHintIndex((prev) => (prev + 1) % inputHints.length);
  }, [messages.length, inputHints.length]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number; thresholdMet: boolean } | null>(null);
  const rafRef = useRef<number | null>(null); // requestAnimationFrame for smooth dragging

  // Helper function to format relative time
  const formatRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

    return messageTime.toLocaleDateString();
  };

  // Initialize floating variant position (centered by default)
  useEffect(() => {
    if (variant === 'floating' && panelPosition.x === 0 && panelPosition.y === 0) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) {
          const state = JSON.parse(stored);
          const pos = state.panelPosition;
          if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
            setPanelPosition(pos);
            return;
          }
        }
      } catch (error) {
        console.error('ChatBubble: Error loading floating position from localStorage', error);
      }

      // No saved position - set centered default
      if (typeof window !== 'undefined') {
        const centerX = (window.innerWidth - 300) / 2;  // 300px = approx bubble width
        const centerY = (window.innerHeight - 150) / 2; // 150px = approx bubble height
        setPanelPosition({ x: centerX, y: centerY });
      }
    }
  }, [variant, storageKey, panelPosition.x, panelPosition.y]);

  // Load expanded state from localStorage after hydration
  useEffect(() => {
    if (variant === 'full') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) {
          const state = JSON.parse(stored);

          // Validate stored position - if clearly invalid (too far off-screen), reset
          const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
          const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
          const pos = state.panelPosition || { x: 0, y: 0 };

          // If position is more than 2x viewport away, it's invalid - reset to docked
          const isInvalidPosition =
            Math.abs(pos.x) > windowWidth * 2 ||
            Math.abs(pos.y) > windowHeight * 2;

          if (isInvalidPosition) {
            console.warn('ChatBubble: Invalid stored position detected, resetting to docked');
            // Reset position but preserve other settings like glass mode
            setIsExpanded(defaultExpanded);
            setIsMinimized(false);
            setIsDocked(true);
            setDockPosition(position);
            setPanelPosition({ x: 0, y: 0 });
            // Preserve glass settings and theme
            setTheme(state.theme || 'light');
            if (state.localGlassMode !== undefined) {
              setLocalGlassMode(state.localGlassMode);
            }
            if (state.glassOpacity !== undefined) {
              setGlassOpacity(state.glassOpacity);
            }
            if (state.notifications !== undefined) {
              setNotifications(state.notifications);
            }
          } else {
            // Valid state - load it
            setIsExpanded(state.isExpanded ?? defaultExpanded);
            setIsMinimized(state.isMinimized ?? false);
            setIsDocked(state.isDocked ?? true);
            setDockPosition(state.dockPosition || position);
            setPanelPosition(pos);
            setTheme(state.theme || 'light');
            if (state.localGlassMode !== undefined) {
              setLocalGlassMode(state.localGlassMode);
            }
            if (state.notifications !== undefined) {
              setNotifications(state.notifications);
            }
            if (state.displayMode !== undefined) {
              setDisplayMode(state.displayMode);
            }
            if (state.drawerSide !== undefined) {
              setDrawerSide(state.drawerSide);
            }
            if (state.drawerOpen !== undefined) {
              setDrawerOpen(state.drawerOpen);
            }
            if (state.glassOpacity !== undefined) {
              setGlassOpacity(state.glassOpacity);
            }
            // Load voice settings
            if (state.voiceEnabled !== undefined) {
              setVoiceEnabled(state.voiceEnabled);
            }
            if (state.usePremiumVoices !== undefined) {
              setUsePremiumVoices(state.usePremiumVoices);
            }
            if (state.autoReadResponses !== undefined) {
              setAutoReadResponses(state.autoReadResponses);
            }
            if (state.ttsSpeed !== undefined) {
              setTtsSpeed(state.ttsSpeed);
            }
            // Load STT auto-record settings
            if (state.sttAutoRecordTimeout !== undefined) {
              setSttAutoRecordTimeout(state.sttAutoRecordTimeout);
            }
            if (state.sttAutoExecute !== undefined) {
              setSttAutoExecute(state.sttAutoExecute);
            }
          }
        }
      } catch {
        // Keep default value
      }
    }
    // Mark as hydrated after loading state
    setIsHydrated(true);
  }, [storageKey, variant, defaultExpanded, position]);

  // For non-'full' variants, mark as hydrated immediately
  useEffect(() => {
    if (variant !== 'full') {
      setIsHydrated(true);
    }
  }, [variant]);

  // Bounds checking: ensure panel is visible on screen
  useEffect(() => {
    if (!isExpanded || isDocked || !panelRef.current) return;

    const checkBounds = () => {
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // If panel is completely off-screen, reset to docked position
      const isOffScreen =
        rect.right < 0 ||
        rect.left > windowWidth ||
        rect.bottom < 0 ||
        rect.top > windowHeight;

      if (isOffScreen) {
        console.warn('ChatBubble detected off-screen, resetting to docked position');
        setIsDocked(true);
        setPanelPosition({ x: 0, y: 0 });
      }
    };

    // Check bounds after a brief delay to allow rendering
    const timeoutId = setTimeout(checkBounds, 100);
    return () => clearTimeout(timeoutId);
  }, [isExpanded, isDocked]);

  // Escape key handler: reset panel to default docked position OR cycle variants (double-escape)
  // Skip when in subtitle mode - SubtitleOverlay handles its own ESC behavior
  useEffect(() => {
    // Don't attach handler when in subtitle mode - let SubtitleOverlay handle it
    const isSubtitleMode = displayMode === 'subtitle' || (displayMode === 'auto' && variant === 'subtitle');
    if (isSubtitleMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      const now = Date.now();
      const timeSinceLastEscape = now - lastEscapeTimeRef.current;

      // Determine effective variant (considering displayMode and mobile state)
      const effectiveVariant = displayMode !== 'auto'
        ? displayMode
        : (isMobile ? 'drawer' : variant);

      // Double-escape detected when chat is NOT expanded (bubble icon is showing)
      if (!isExpanded && timeSinceLastEscape < DOUBLE_ESCAPE_THRESHOLD_MS) {
        console.log('[ChatBubble] Double-escape detected - cycling variant from:', effectiveVariant);

        // Cycle between 'full' and 'subtitle' (skip 'floating' and 'drawer')
        if (effectiveVariant === 'full' || effectiveVariant === 'floating' || effectiveVariant === 'drawer') {
          setDisplayMode('subtitle');
          console.log('[ChatBubble] Switched to subtitle mode');
        } else if (effectiveVariant === 'subtitle') {
          setDisplayMode('full');
          console.log('[ChatBubble] Switched to full mode');
        }

        // Reset the timer so triple-escape doesn't trigger again
        lastEscapeTimeRef.current = 0;
        return;
      }

      // Single escape: reset panel to docked position if expanded
      if (isExpanded && !isDocked) {
        console.log('ChatBubble reset via Escape key');
        setIsDocked(true);
        setDockPosition(position);
        setPanelPosition({ x: 0, y: 0 });
      }

      // Update last escape time
      lastEscapeTimeRef.current = now;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, isDocked, position, variant, displayMode, isMobile]);

  // Detect system theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

  // Viewport detection for auto-switching between drawer and panel
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Initial check
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Resolve actual variant based on display mode and viewport
  const currentVariant: Variant = React.useMemo(() => {
    // Manual override takes precedence
    if (displayMode !== 'auto') {
      return displayMode as Variant;
    }

    // Auto mode: drawer on mobile, full on desktop
    return isMobile ? 'drawer' : variant;
  }, [displayMode, isMobile, variant]);

  // Reset displayMode to 'auto' when variant prop changes externally
  // This allows DevVariantSwitcher to control the variant
  const prevVariantRef = React.useRef(variant);
  useEffect(() => {
    if (prevVariantRef.current !== variant && displayMode !== 'auto') {
      setDisplayMode('auto');
      prevVariantRef.current = variant;
    }
  }, [variant, displayMode]);

  // Auto-update timestamps every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestampTick(tick => tick + 1);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (variant === 'full' || variant === 'drawer') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            isExpanded,
            isMinimized,
            isDocked,
            dockPosition,
            panelPosition,
            theme,
            localGlassMode,
            notifications,
            displayMode,
            drawerSide,
            drawerOpen,
            glassOpacity,
            voiceEnabled,
            usePremiumVoices,
            autoReadResponses,
            ttsSpeed,
            sttAutoRecordTimeout,
            sttAutoExecute,
          })
        );
      } catch (error) {
        console.error('Failed to save chat state:', error);
      }
    }
  }, [isExpanded, isMinimized, isDocked, dockPosition, panelPosition, theme, localGlassMode, notifications, displayMode, drawerSide, drawerOpen, glassOpacity, voiceEnabled, usePremiumVoices, autoReadResponses, ttsSpeed, sttAutoRecordTimeout, sttAutoExecute, storageKey, variant]);

  // Register with chat input context
  const { registerInput } = useChatInput();

  useEffect(() => {
    registerInput((text: string, submit = false) => {
      setInputValue(text);
      if (!isExpanded && variant === 'full') {
        setIsExpanded(true);
      }
      setTimeout(() => {
        inputRef.current?.focus();
        if (submit) {
          onSendMessage(text);
          setInputValue('');
        }
      }, 100);
    });
  }, [registerInput, onSendMessage]); // ✅ FIXED: Removed isExpanded, variant from dependencies

  // Track unread messages
  const unreadCount = Math.max(0, messages.length - lastReadMessageCount);
  const hasUnread = unreadCount > 0 && !isExpanded && variant === 'full';

  useEffect(() => {
    if (isExpanded || variant === 'floating') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      setLastReadMessageCount(messages.length);
      if (messages.length > 0) {
        setShowWelcome(false);
      }
      if (variant === 'full') {
        inputRef.current?.focus();
      }
    }
  }, [messages, isExpanded, variant]);

  // Auto-focus on mount (full variant only)
  useEffect(() => {
    if (isExpanded && variant === 'full') {
      inputRef.current?.focus();
    }
  }, [isExpanded, variant]);

  // Auto-read AI responses (voice control)
  useEffect(() => {
    if (!voiceEnabled || !autoReadResponses || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // Only auto-read AI messages
    if (lastMessage.type === 'ai') {
      speakTTS({
        text: lastMessage.text,
        speed: ttsSpeed,
        usePremium: usePremiumVoices,
        preferNative: !usePremiumVoices,
      });
    }
  }, [messages, voiceEnabled, autoReadResponses, ttsSpeed, usePremiumVoices, speakTTS]);

  // Wire up STT transcript to input field with auto-execution support
  // Skip for subtitle variant (SubtitleOverlay handles its own STT)
  useEffect(() => {
    if (currentVariant === 'subtitle') return; // SubtitleOverlay handles STT

    if (sttTranscript && voiceEnabled) {
      setInputValue(sttTranscript);
      resetTranscript();

      // Auto-execute command if enabled and triggered by Cmd+/
      if (sttAutoExecute && sttAutoRecordTimeoutRef.current) {
        // Command was from auto-record, execute it immediately
        onSendMessage(sttTranscript);
        setInputValue(''); // Clear input after auto-execution
      }

      // Clear the timeout ref
      if (sttAutoRecordTimeoutRef.current) {
        clearTimeout(sttAutoRecordTimeoutRef.current);
        sttAutoRecordTimeoutRef.current = null;
      }
    }
  }, [sttTranscript, voiceEnabled, resetTranscript, sttAutoExecute, onSendMessage, currentVariant]);

  // Keyboard shortcuts (skip for subtitle variant - it has its own handler in SubtitleOverlay)
  useEffect(() => {
    if (currentVariant === 'subtitle') return; // SubtitleOverlay handles its own keyboard shortcuts

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+/ or Cmd+/ to trigger auto-record STT with auto-execution (works everywhere, including input fields)
      if ((e.metaKey || e.ctrlKey) && e.key === '/' && voiceEnabled) {
        e.preventDefault();

        // Open chat if not expanded
        const wasExpanded = isExpanded;
        if (!isExpanded) {
          setIsExpanded(true);
        }

        // Start listening (with small delay if chat was closed to allow rendering)
        if (!isListening) {
          const startRecording = async () => {
            try {
              await startListening();

              // Set timeout to auto-stop recording
              sttAutoRecordTimeoutRef.current = setTimeout(() => {
                stopListening();
                sttAutoRecordTimeoutRef.current = null;
              }, sttAutoRecordTimeout);
            } catch (error) {
              console.error('[ChatBubble] Failed to start recording:', error);
            }
          };

          if (wasExpanded) {
            // Chat already open, start immediately
            startRecording();
          } else {
            // Chat was closed, wait for it to render
            setTimeout(startRecording, 300);
          }
        }
        return;
      }

      // '/' key to open chat (only if not typing in input)
      if (e.key === '/' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !isExpanded) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }

      // Escape to close more menu or chat (also stop auto-record)
      if (e.key === 'Escape') {
        // Cancel auto-record timeout if active
        if (sttAutoRecordTimeoutRef.current) {
          clearTimeout(sttAutoRecordTimeoutRef.current);
          sttAutoRecordTimeoutRef.current = null;
          stopListening();
        }

        if (showMoreMenu) {
          setShowMoreMenu(false);
        } else if (isExpanded) {
          setIsExpanded(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Cleanup timeout on unmount
      if (sttAutoRecordTimeoutRef.current) {
        clearTimeout(sttAutoRecordTimeoutRef.current);
      }
    };
  }, [currentVariant, isExpanded, showMoreMenu, voiceEnabled, isListening, startListening, stopListening, sttAutoRecordTimeout]);

  // Keyboard shortcuts for drawer variant
  useEffect(() => {
    if (currentVariant !== 'drawer') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key closes drawer
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVariant, drawerOpen]);

  // Close more menu when clicking outside
  useEffect(() => {
    if (!showMoreMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-more-menu]')) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

  // Touch gesture handlers for drawer (swipe from edge to open)
  useEffect(() => {
    if (typeof window === 'undefined' || currentVariant !== 'drawer') return;

    const EDGE_ZONE_PX = 20; // Detection zone
    const SWIPE_THRESHOLD = 0.4; // 40% of screen width
    const VELOCITY_THRESHOLD = 0.5; // px/ms

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const isRightEdge = touch.clientX > window.innerWidth - EDGE_ZONE_PX;
      const isLeftEdge = touch.clientX < EDGE_ZONE_PX;

      if ((drawerSide === 'right' && isRightEdge) || (drawerSide === 'left' && isLeftEdge)) {
        setTouchStart({
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart || drawerOpen) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = Math.abs(touch.clientY - touchStart.y);

      // Ignore vertical scrolls
      if (deltaY > 10 && Math.abs(deltaX) < deltaY) {
        setTouchStart(null);
        return;
      }

      // Calculate progress (0-100)
      const screenWidth = window.innerWidth;
      const direction = drawerSide === 'right' ? -1 : 1;
      const progress = Math.max(0, Math.min(100, (deltaX * direction / screenWidth) * 100));

      setSwipeProgress(progress);

      // Prevent scrolling during horizontal swipe
      if (Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!touchStart) return;

      const deltaTime = Date.now() - touchStart.time;
      const velocity = swipeProgress / deltaTime;

      // Commit if threshold met
      if (swipeProgress > SWIPE_THRESHOLD * 100 || velocity > VELOCITY_THRESHOLD) {
        setDrawerOpen(true);
      }

      // Reset state
      setTouchStart(null);
      setSwipeProgress(0);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, swipeProgress, drawerOpen, drawerSide, currentVariant]);


  // Drag handlers
  const handlePanelMouseDown = (e: React.MouseEvent) => {
    if (variant !== 'full' || !isExpanded) return;
    // Only drag from header area
    const target = e.target as HTMLElement;
    if (!target.closest('[data-drag-handle]')) return;

    // Don't drag if clicking on a button or interactive element
    if (target.closest('button') || target.closest('svg') || target.closest('[role="button"]')) {
      return;
    }

    e.preventDefault();
    setDragInitiated(true); // Start tracking mouse movement

    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Pre-calculate position to prevent jump when undocking
    if (isDocked) {
      // For top-left anchored positioning, use the current screen position directly
      const targetX = rect.left;
      const targetY = rect.top;

      // Set position immediately to prevent visual jump
      setPanelPosition({ x: targetX, y: targetY });

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: targetX,
        initialY: targetY,
        thresholdMet: false,
      };
    } else {
      // Already floating - use current position
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: panelPosition.x,
        initialY: panelPosition.y,
        thresholdMet: false,
      };
    }
  };

  useEffect(() => {
    if (!dragInitiated || !dragRef.current) return;

    const dragThresholdPx = 5; // 5px movement required before drag starts

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      // Check threshold - must move 5px before dragging starts
      if (!dragRef.current.thresholdMet && distance < dragThresholdPx) {
        return; // Not enough movement yet - ignore
      }

      // Threshold met - activate dragging (only once)
      if (!dragRef.current.thresholdMet) {
        dragRef.current.thresholdMet = true;
        setIsDragging(true);
        setIsDocked(false);
      }

      // Use requestAnimationFrame for smooth 60fps updates
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setPanelPosition({
          x: dragRef.current!.initialX + deltaX,
          y: dragRef.current!.initialY + deltaY,
        });
      });
    };

    const handleMouseUp = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // Only auto-dock if we actually dragged (threshold was met)
      if (dragRef.current?.thresholdMet && panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        const threshold = 20; // Reduced from 50px - less aggressive
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Determine which edge is closest for smart docking
        const distanceToRight = windowWidth - rect.right;
        const distanceToLeft = rect.left;
        const distanceToTop = rect.top;
        const distanceToBottom = windowHeight - rect.bottom;

        const minDistance = Math.min(distanceToRight, distanceToLeft, distanceToTop, distanceToBottom);

        // Only dock if within threshold of closest edge
        if (minDistance < threshold) {
          let newDockPosition: Position;

          // Determine which edge to dock to based on proximity
          if (minDistance === distanceToRight) {
            newDockPosition = rect.top < windowHeight / 3 ? 'top-right' : rect.bottom > (windowHeight * 2) / 3 ? 'bottom-right' : 'right-center';
          } else if (minDistance === distanceToLeft) {
            newDockPosition = rect.top < windowHeight / 3 ? 'top-left' : rect.bottom > (windowHeight * 2) / 3 ? 'bottom-left' : 'left-center';
          } else if (minDistance === distanceToTop) {
            newDockPosition = rect.left < windowWidth / 3 ? 'top-left' : rect.right > (windowWidth * 2) / 3 ? 'top-right' : 'top-right'; // Default to top-right for top-center
          } else {
            newDockPosition = rect.left < windowWidth / 3 ? 'bottom-left' : rect.right > (windowWidth * 2) / 3 ? 'bottom-right' : 'bottom-center';
          }

          setDockPosition(newDockPosition);
          setIsDocked(true);
          setPanelPosition({ x: 0, y: 0 });
        }
      }

      setIsDragging(false);
      setDragInitiated(false);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [dragInitiated]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    onSendMessage(inputValue.trim());
    setInputValue('');
    if (variant === 'full') {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDock = () => {
    setDockPosition(position); // Reset to original position
    setIsDocked(true);
    setPanelPosition({ x: 0, y: 0 });
  };

  const handleHome = () => {
    setDockPosition(position); // Reset to original position
    setIsDocked(true);
    setPanelPosition({ x: 0, y: 0 });
    setIsMinimized(false);
  };

  const handleClearChat = () => {
    if (onClearChat) {
      onClearChat();
      setShowWelcome(true);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Drawer touch handlers for swipe-to-close
  const handleDrawerTouchStart = (e: React.TouchEvent) => {
    if (!drawerOpen) return;
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    });
  };

  const handleDrawerTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !drawerOpen) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = Math.abs(touch.clientY - touchStart.y);

    // Ignore vertical scrolls
    if (deltaY > 10 && Math.abs(deltaX) < deltaY) {
      return;
    }

    const screenWidth = window.innerWidth;
    // Opposite direction for close
    const direction = drawerSide === 'right' ? 1 : -1;
    const progress = Math.max(0, Math.min(100, (deltaX * direction / screenWidth) * 100));

    setSwipeProgress(progress);
  };

  const handleDrawerTouchEnd = () => {
    if (!touchStart) return;

    const SWIPE_THRESHOLD = 0.4; // 40% of screen width

    if (swipeProgress > SWIPE_THRESHOLD * 100) {
      setDrawerOpen(false);
    }

    setTouchStart(null);
    setSwipeProgress(0);
  };

  const dockClasses = DOCK_POSITIONS[dockPosition];
  const primaryColor = config.theme?.primary || 'blue';
  const glassMode = localGlassMode;

  // Map glass opacity setting to CSS classes (original values, just adjustable)
  const glassClasses = glassMode
    ? glassOpacity === 'low'
      ? 'backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-white/10'
      : glassOpacity === 'high'
      ? 'backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border border-white/20 dark:border-white/10'
      : 'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-white/10' // medium (original)
    : 'bg-white dark:bg-gray-900';

  const glassGradient = glassMode
    ? glassOpacity === 'low'
      ? 'bg-gradient-to-br from-white/95 via-white/85 to-white/70 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70'
      : glassOpacity === 'high'
      ? 'bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-gray-900/60 dark:via-gray-900/50 dark:to-gray-900/40'
      : 'bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-gray-900/80 dark:via-gray-900/70 dark:to-gray-900/60' // medium (original)
    : 'bg-white dark:bg-gray-900';

  // Helper to get floating position styles based on dock position
  // This ensures proper alignment when switching between minimized/expanded
  const getFloatingPositionStyle = (): React.CSSProperties => {
    // When floating, ALWAYS use top-left anchored positioning for consistent dragging behavior
    // The dockPosition state should NOT affect floating position transforms
    return {
      top: 0,
      left: 0,
      transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
    };
  };

  // Calculate dynamic size - max 80vh
  const maxHeightVh = 80;
  const dynamicHeight = `min(${maxHeightVh}vh, 700px)`;
  const panelWidth = 'min(650px, calc(100vw - 2rem))'; // Wider panel

  // Helper function to calculate drawer transform
  const getDrawerTransform = () => {
    if (touchStart && swipeProgress > 0) {
      return drawerSide === 'right'
        ? `translateX(${100 - swipeProgress}%)`
        : `translateX(${-100 + swipeProgress}%)`;
    }
    return drawerOpen
      ? 'translateX(0%)'
      : drawerSide === 'right'
      ? 'translateX(100%)'
      : 'translateX(-100%)';
  };

  // Note: Keep class strings inline in JSX for Tailwind JIT detection
  // Storing in variables causes Tailwind to miss them during scanning

  // Prevent render until hydrated to avoid z-index flicker
  if (!isHydrated) {
    return null;
  }

  // Subtitle overlay variant - minimalist voice-first overlay (NEW - opt-in beta)
  if (currentVariant === 'subtitle') {

    return (
      <SubtitleOverlay
        messages={messages}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={() => {
          const syntheticEvent = {
            preventDefault: () => {},
            stopPropagation: () => {},
          } as React.FormEvent;
          handleSend(syntheticEvent);
        }}
        voiceEnabled={voiceEnabled}
        isListening={isListening}
        onMicClick={handleMicClick}
        theme={theme}
        config={config}
        sttTranscript={sttTranscript}
        resetTranscript={resetTranscript}
        onSwitchToFullMode={() => {
          console.log('[ChatBubble] Switching from subtitle to full mode');
          setDisplayMode('full');
        }}
      />
    );
  }

  // Drawer variant - mobile swipeable drawer
  if (currentVariant === 'drawer') {
    const drawerWidth = '100vw'; // Full screen width
    return (
      <>
        {(drawerOpen || swipeProgress > 0) && (
          <div
            className="fixed inset-0 bg-black z-[49998] transition-opacity duration-300"
            style={{
              opacity: touchStart && swipeProgress > 0 ? (swipeProgress / 100) * 0.5 : 0.5,
              zIndex: 999998  // Super high z-index for overlay backdrop
            }}
            onClick={() => setDrawerOpen(false)}
          />
        )}
        <div
          className={`fixed ${drawerSide === 'right' ? 'right-0' : 'left-0'} top-0 h-full z-[49999] flex flex-col ${
            glassClasses
          } shadow-2xl`}
          style={{
            width: drawerWidth,
            transform: getDrawerTransform(),
            transition: touchStart ? 'none' : 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
            zIndex: 999999  // Super high z-index for drawer
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Chat drawer"
          onTouchStart={handleDrawerTouchStart}
          onTouchMove={handleDrawerTouchMove}
          onTouchEnd={handleDrawerTouchEnd}
        >
          <div className={`${THEME_CLASSES.bg.header} ${glassMode ? THEME_CLASSES.bg.headerGradient : THEME_CLASSES.bg.headerLight}`}>
            <div className="flex items-center space-x-3">
              {config.avatar && (
                <div className="relative flex-shrink-0">
                  <Avatar avatar={config.avatar} />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              )}
              {config.title && (
                <div className="min-w-0 flex-1">
                  <h3 className={THEME_CLASSES.text.title}>{config.title}</h3>
                </div>
              )}
            </div>
            <button onClick={() => setDrawerOpen(false)} className={THEME_CLASSES.button.close} title="Close drawer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {showWelcome && messages.length === 0 && config.welcome?.enabled && (
              <div className={THEME_CLASSES.welcome.container}>
                {config.welcome.title && (
                  <h4 className={THEME_CLASSES.welcome.title} style={INLINE_STYLES.welcomeTitle(theme === 'dark')}>
                    {config.welcome.title}
                  </h4>
                )}
                {config.welcome.content && (
                  <p className={THEME_CLASSES.welcome.content} style={INLINE_STYLES.welcomeContent(theme === 'dark')}>
                    {config.welcome.content}
                  </p>
                )}
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`group flex items-center gap-1 mb-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div
                  className={`inline-block px-4 py-2.5 rounded-2xl max-w-[95%] text-sm shadow-sm transition-all ${
                    message.type === 'user' ? THEME_CLASSES.message.user : message.type === 'ai' ? THEME_CLASSES.message.ai : THEME_CLASSES.message.system
                  }`}
                  style={
                    message.type === 'user' ? INLINE_STYLES.messageUser() : message.type === 'ai' ? INLINE_STYLES.messageAI(theme === 'dark') : INLINE_STYLES.messageSystem(theme === 'dark')
                  }
                >
                  <MessageRenderer content={message.text} theme={theme} />
                </div>
                {/* TTS button for AI messages */}
                {message.type === 'ai' && voiceEnabled && (
                  <TTSButton
                    text={message.text}
                    usePremiumVoices={usePremiumVoices}
                    speed={ttsSpeed}
                    theme={theme}
                    size="small"
                  />
                )}
                <div
                  className={`text-xs opacity-0 group-hover:opacity-70 transition-opacity whitespace-nowrap flex-shrink-0 ${
                    message.type === 'user' ? 'text-gray-400 dark:text-gray-500 text-left' : 'text-gray-600 dark:text-gray-400 text-right'
                  }`}
                  title={typeof window !== 'undefined' ? new Date(message.timestamp).toLocaleString() : ''}
                >
                  {typeof window !== 'undefined' ? formatRelativeTime(message.timestamp) : ''}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <InputField
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSend}
            placeholder={inputHints[currentHintIndex]}
            glassClasses=""
            theme={theme}
            inputRef={inputRef}
            sendButtonLabel={config.sendButtonLabel}
            voiceEnabled={voiceEnabled}
            isListening={isListening}
            onMicClick={handleMicClick}
            modKey={isMac ? 'Cmd' : 'Ctrl'}
          />
        </div>
        {!drawerOpen && (
          <div
            className={`fixed ${drawerSide === 'right' ? 'right-0' : 'left-0'} bottom-20 opacity-30 hover:opacity-90 transition-opacity duration-300 z-[999999] cursor-pointer`}
            style={{ zIndex: 999999 }}  // Super high z-index for drawer trigger
            onClick={() => setDrawerOpen(true)}
          >
            <div className={`${glassMode ? 'backdrop-blur-md bg-white/50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'} text-gray-700 dark:text-gray-200 px-3 py-3 ${drawerSide === 'right' ? 'rounded-l-xl' : 'rounded-r-xl'} shadow-md hover:shadow-lg flex items-center justify-center transition-all`}>
              {voiceEnabled ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Floating variant - compact draggable bubble
  if (currentVariant === 'floating') {
    const recentMessage = messages[messages.length - 1];

    return (
      <div
        className={`fixed z-[999999] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          top: 0,
          left: 0,
          transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
          zIndex: 999999,  // Super high z-index for floating variant
          ...(!isDragging && { transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }),
        }}
        onMouseDown={handlePanelMouseDown}
      >
        <div className={`${glassClasses} rounded-2xl shadow-2xl p-3 max-w-xs ${!glassMode && 'border-gray-200 border'}`}>
          {/* Mini header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Avatar avatar={config.avatar} size="small" />
              {config.title && (
                <span className={THEME_CLASSES.text.floatingTitle}>{config.title}</span>
              )}
            </div>
            {onClearChat && (
              <button
                onClick={onClearChat}
                className={THEME_CLASSES.button.floatingClear}
                title="Clear chat"
                data-testid={ChatNames.clearButton}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Recent message */}
          {recentMessage && (
            <div className={`mb-2 group flex items-center gap-2 ${recentMessage.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`text-xs px-3 py-2 rounded-xl transition-all ${
                  recentMessage.type === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                    : recentMessage.type === 'ai'
                    ? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white shadow-md'
                    : 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-900 shadow-md'
                }`}
              >
                {recentMessage.text.length > 60
                  ? `${recentMessage.text.slice(0, 60)}...`
                  : recentMessage.text}
              </div>
              <div className={`text-xs opacity-0 group-hover:opacity-70 transition-opacity whitespace-nowrap flex-shrink-0 ${
                recentMessage.type === 'user'
                  ? 'text-gray-400 dark:text-gray-500 text-left'
                  : 'text-gray-600 dark:text-gray-400 text-right'
              }`}
              title={typeof window !== 'undefined' ? new Date(recentMessage.timestamp).toLocaleString() : ''}
              >
                {typeof window !== 'undefined' ? formatRelativeTime(recentMessage.timestamp) : ''}
              </div>
            </div>
          )}

          {/* Compact input */}
          <InputField
            compact
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSend}
            placeholder={inputHints[currentHintIndex]}
            glassClasses=""
            theme={theme}
            sendButtonLabel={config.sendButtonLabel}
            modKey={isMac ? 'Cmd' : 'Ctrl'}
          />
        </div>
      </div>
    );
  }

  // Full variant - expandable panel with glass aesthetic
  return (
    <>
      {/* Chat Container */}
      <div
        className="fixed"
        style={{
          ...dockClasses.container,
          zIndex: 999999,  // Super high z-index for chat widget
          position: 'fixed',
          ...(isExpanded ? {
            width: panelWidth,
            height: isMinimized ? 'auto' : dynamicHeight,
          } : {
            width: 'auto',
            height: 'auto',
          }),
        }}
      >
        {/* Minimized Compact View */}
        {isExpanded && isMinimized && (
          <div
            ref={panelRef}
            className={`${isDocked ? 'absolute' : 'fixed z-[999999]'} ${glassGradient} rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 ${!isDragging && 'backdrop-blur-xl'} flex flex-col overflow-hidden ${!isDragging && 'transition-all duration-300'}`}
            style={{
              width: panelWidth,
              maxWidth: '400px',
              zIndex: 999999,  // Super high z-index for minimized panel
              ...(isDocked ? {
                ...dockClasses.panel,
                // Only clear transform if dock position doesn't use transform
                ...(dockClasses.panel.transform ? {} : { transform: 'none' }),
              } : getFloatingPositionStyle()),
              ...(isDragging && { cursor: 'grabbing' }),
            }}
          >
            {/* Header - Draggable and clickable to expand */}
            <div
              data-drag-handle
              className={`${THEME_CLASSES.bg.header} ${glassMode ? THEME_CLASSES.bg.headerGradient : THEME_CLASSES.bg.headerLight} cursor-move`}
              onMouseDown={handlePanelMouseDown}
              onClick={(e) => {
                // Only expand if we didn't drag (drag threshold wasn't met)
                if (!dragRef.current?.thresholdMet) {
                  // Don't expand if clicking on a button
                  const target = e.target as HTMLElement;
                  if (target.closest('button') || target.closest('[role="button"]')) {
                    return;
                  }
                  setIsMinimized(false);
                }
              }}
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
              <div className="flex items-center space-x-1 flex-shrink-0">
                {/* Minimize button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(true);
                  }}
                  className={THEME_CLASSES.button.minimize}
                  title="Minimize chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className={THEME_CLASSES.button.close}
                  title="Close chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content area with padding */}
            <div className="p-4">
              {/* Last AI response only */}
              {(() => {
                const lastAiMessage = [...messages].reverse().find(m => m.type === 'ai');
                return lastAiMessage ? (
                  <div className="mb-3">
                    <div className={`text-xs px-3 py-2 rounded-xl ${THEME_CLASSES.message.ai}`} style={INLINE_STYLES.messageAI(theme === 'dark')}>
                      {lastAiMessage.text.length > 100
                        ? `${lastAiMessage.text.slice(0, 100)}...`
                        : lastAiMessage.text}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <div className={THEME_CLASSES.text.minimizedMessage} style={INLINE_STYLES.minimizedMessage(theme === 'dark')}>
                      No AI responses yet
                    </div>
                  </div>
                );
              })()}

              {/* Shared input component */}
              <InputField
                compact
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSubmit={handleSend}
                placeholder={inputHints[currentHintIndex]}
                glassClasses=""
                theme={theme}
                sendButtonLabel={config.sendButtonLabel}
                modKey={isMac ? 'Cmd' : 'Ctrl'}
              />
            </div>
          </div>
        )}

        {/* Expanded Chat Panel */}
        {isExpanded && !isMinimized && (
          <div
            ref={panelRef}
            className={`${isDocked ? 'absolute' : 'fixed z-[999999]'} ${glassGradient} rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 ${!isDragging && 'backdrop-blur-xl'} flex flex-col overflow-hidden ${!isDragging && 'transition-all duration-300'}`}
            style={{
              width: panelWidth,
              height: dynamicHeight,
              zIndex: 999999,  // Super high z-index for expanded panel
              ...(isDocked ? {
                ...dockClasses.panel,
                // Only clear transform if dock position doesn't use transform
                ...(dockClasses.panel.transform ? {} : { transform: 'none' }),
              } : getFloatingPositionStyle()),
              ...(isDragging && { cursor: 'grabbing' }),
            }}
          >
            {/* Header - Draggable */}
            <div
              data-drag-handle
              className={`${THEME_CLASSES.bg.header} ${glassMode ? THEME_CLASSES.bg.headerGradient : THEME_CLASSES.bg.headerLight} cursor-move`}
              onMouseDown={handlePanelMouseDown}
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
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={THEME_CLASSES.button.more}
                  title="More options"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {/* More menu dropdown */}
                {showMoreMenu && (
                  <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2 min-w-[220px] z-50" data-more-menu>
                    {/* Glass Mode - 4 icon buttons (Off, Low, Medium, High) */}
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 mb-2">
                      <div className="grid grid-cols-4 gap-1">
                        <button
                          onClick={() => setLocalGlassMode(false)}
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
                          onClick={() => {
                            setLocalGlassMode(true);
                            setGlassOpacity('low');
                          }}
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
                          onClick={() => {
                            setLocalGlassMode(true);
                            setGlassOpacity('medium');
                          }}
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
                          onClick={() => {
                            setLocalGlassMode(true);
                            setGlassOpacity('high');
                          }}
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
                        setTheme(newTheme);
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
                        setVoiceEnabled(!voiceEnabled);
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
                        handleHome();
                        setShowMoreMenu(false);
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
                        // Inject help messages into chat
                        const helpMessages = [
                          '**How to Use This Chat**\n\n- **Theme**: Toggle between light and dark modes\n- **Glass Effect**: Adjust transparency (Off/Low/Medium/High)\n- **Reset Position**: Return chat to default corner\n- **Minimize**: Compact view showing last message\n- **Clear**: Delete all messages and start fresh\n- **Drag**: Click and drag header to reposition chat\n- **Keyboard**: Press "/" to focus input, Esc to reset position'
                        ];

                        helpMessages.forEach((text, index) => {
                          setTimeout(() => {
                            onSendMessage(text);
                          }, index * 100);
                        });

                        setShowMoreMenu(false);
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
                          handleClearChat();
                          setShowMoreMenu(false);
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
                )}

                {/* Minimize to compact button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className={THEME_CLASSES.button.minimize}
                  title="Minimize"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>

                {/* Close button */}
                <button
                  onClick={handleToggle}
                  className={THEME_CLASSES.button.close}
                  title="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>



            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* Welcome Message */}
              {showWelcome && messages.length === 0 && config.welcome?.enabled && (
                <div className={THEME_CLASSES.welcome.container}>
                  {config.welcome.title && (
                    <h4 className={THEME_CLASSES.welcome.title} style={INLINE_STYLES.welcomeTitle(theme === 'dark')}>
                      {config.welcome.title}
                    </h4>
                  )}
                  {config.welcome.content && (
                    <p className={THEME_CLASSES.welcome.content} style={INLINE_STYLES.welcomeContent(theme === 'dark')}>
                      {config.welcome.content}
                    </p>
                  )}
                  {config.welcome.suggestedCommands && config.welcome.suggestedCommands.length > 0 && (
                    <div className={THEME_CLASSES.welcome.commandsContainer}>
                      <p className={THEME_CLASSES.welcome.commandsHeader}>
                        Try these commands:
                      </p>
                      <div className="space-y-1">
                        {config.welcome.suggestedCommands.map((cmd, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setInputValue(cmd.text);
                              setShowWelcome(false);
                              setTimeout(() => inputRef.current?.focus(), 0);
                            }}
                            className={THEME_CLASSES.welcome.commandButton}
                          >
                            <div className={THEME_CLASSES.welcome.commandText} style={INLINE_STYLES.commandText(theme === 'dark')}>
                              "{cmd.text}"
                            </div>
                            {cmd.desc && (
                              <div className={THEME_CLASSES.welcome.commandDesc} style={INLINE_STYLES.commandDesc(theme === 'dark')}>
                                {cmd.desc}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((message) => (
                <div key={message.id} className={`group flex items-center gap-2 mb-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div
                    className={`inline-block px-4 py-2.5 rounded-2xl max-w-[80%] text-sm shadow-sm transition-all ${
                      message.type === 'user'
                        ? THEME_CLASSES.message.user
                        : message.type === 'ai'
                        ? THEME_CLASSES.message.ai
                        : THEME_CLASSES.message.system
                    }`}
                    style={
                      message.type === 'user'
                        ? INLINE_STYLES.messageUser()
                        : message.type === 'ai'
                        ? INLINE_STYLES.messageAI(theme === 'dark')
                        : INLINE_STYLES.messageSystem(theme === 'dark')
                    }
                    data-testid={`chat-message-${message.type}`}
                  >
                    <MessageRenderer content={message.text} theme={theme} />
                  </div>
                  {/* TTS button for AI messages */}
                  {message.type === 'ai' && voiceEnabled && (
                    <TTSButton
                      text={message.text}
                      usePremiumVoices={usePremiumVoices}
                      speed={ttsSpeed}
                      theme={theme}
                      size="small"
                    />
                  )}
                  {/* Timestamp beside bubble - relative time with hover tooltip */}
                  <div
                    className={`text-xs opacity-0 group-hover:opacity-70 transition-opacity whitespace-nowrap flex-shrink-0 ${
                      message.type === 'user'
                        ? 'text-gray-400 dark:text-gray-500 text-left'
                        : 'text-gray-600 dark:text-gray-400 text-right'
                    }`}
                    title={typeof window !== 'undefined' ? new Date(message.timestamp).toLocaleString() : ''}
                  >
                    {typeof window !== 'undefined' ? formatRelativeTime(message.timestamp) : ''}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <InputField
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSubmit={handleSend}
              placeholder={inputHints[currentHintIndex]}
              glassClasses=""
              theme={theme}
              inputRef={inputRef}
              sendButtonLabel={config.sendButtonLabel}
              voiceEnabled={voiceEnabled}
              isListening={isListening}
              onMicClick={handleMicClick}
              modKey={isMac ? 'Cmd' : 'Ctrl'}
            />
          </div>
        )}

        {/* Chat Bubble Button - only show when collapsed */}
        {!isExpanded && (
          <button
            onClick={handleToggle}
            className={THEME_CLASSES.bg.bubble}
            data-testid={ChatNames.bubble}
            title={`Open chat (press ${isMac ? 'Cmd' : 'Ctrl'}+/ for voice recording, double-ESC to switch modes)`}
          >
            <img src={config.logo} alt="Supernal" className="w-8 h-8" />

            {/* Mode indicator badge - shows next variant (double-ESC will switch to this) */}
            <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center shadow-md"
              style={{
                background: displayMode === 'subtitle' || (displayMode === 'auto' && variant === 'subtitle')
                  ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' // Purple badge = currently in subtitle mode
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)', // Blue badge = currently in full mode
                border: '2px solid white'
              }}
              title={
                displayMode === 'subtitle' || (displayMode === 'auto' && variant === 'subtitle')
                  ? 'Subtitle mode (double-ESC to switch to full)'
                  : 'Full mode (double-ESC to switch to subtitle)'
              }
            >
              <span className="text-[8px] text-white font-bold">
                {displayMode === 'subtitle' || (displayMode === 'auto' && variant === 'subtitle') ? 'S' : 'F'}
              </span>
            </div>

            {/* Unread indicator */}
            {hasUnread && notifications && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg" data-testid="unread-indicator">
                <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </div>
            )}
          </button>
        )}
      </div>

    </>
  );
};
