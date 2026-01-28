'use client';

import React, { useEffect, useRef } from 'react';
import { useToolMenu } from './useToolMenu';
import { ToolMenuPopup } from './ToolMenuPopup';
import { useChatContext } from '../../contexts/ChatProvider';

/** Phrases that trigger the tool menu popup from chat */
const TRIGGER_PHRASES = [
  'help',
  'what can you do',
  'show tools',
  'list tools',
  'list capabilities',
  'what tools',
  'available tools',
  'available actions',
];

/**
 * ToolMenuPopupTrigger
 *
 * Manages keyboard shortcut and chat-command triggers for the ToolMenuPopup.
 * Renders the popup when open.
 *
 * Triggers:
 * - Keyboard: `?` (Shift+/) when not in an input field, or Cmd/Ctrl+Shift+/
 * - Chat: User sends a message matching a trigger phrase
 */
export const ToolMenuPopupTrigger: React.FC = () => {
  const toolMenu = useToolMenu();
  const { messages } = useChatContext();
  const lastMessageCountRef = useRef(-1); // -1 = not yet initialized
  const isInitializedRef = useRef(false);

  // Keyboard shortcut: ? (Shift+/) or Cmd+Shift+/
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + / — always opens regardless of focus
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '/') {
        e.preventDefault();
        toolMenu.toggle();
        return;
      }

      // ? (Shift+/) when not focused in an input/textarea/contenteditable
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName?.toLowerCase();
        const isEditable = (e.target as HTMLElement).isContentEditable;
        if (tag === 'input' || tag === 'textarea' || isEditable) {
          return; // Don't intercept typing in inputs
        }
        e.preventDefault();
        toolMenu.toggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toolMenu]);

  // Chat command trigger: detect new user messages with trigger phrases.
  // Skip the initial load (messages restored from localStorage on hydration).
  useEffect(() => {
    // First effect run: just record current message count, don't trigger anything.
    // This handles both the initial mount AND messages loaded from localStorage.
    if (!isInitializedRef.current) {
      lastMessageCountRef.current = messages.length;
      isInitializedRef.current = true;
      return;
    }

    if (messages.length <= lastMessageCountRef.current) {
      lastMessageCountRef.current = messages.length;
      return;
    }

    // Check only the newest message(s)
    const newMessages = messages.slice(lastMessageCountRef.current);
    lastMessageCountRef.current = messages.length;

    for (const msg of newMessages) {
      if (msg.type !== 'user') continue;
      const text = msg.text.toLowerCase().trim();
      if (TRIGGER_PHRASES.some(phrase => text === phrase || text.startsWith(phrase + ' '))) {
        toolMenu.open();
        break;
      }
    }
  }, [messages, toolMenu]);

  if (!toolMenu.isOpen) return null;

  return (
    <ToolMenuPopup
      isOpen={toolMenu.isOpen}
      onClose={toolMenu.close}
      categories={toolMenu.categories}
      totalTools={toolMenu.totalTools}
      contextLabel={toolMenu.contextLabel}
    />
  );
};
