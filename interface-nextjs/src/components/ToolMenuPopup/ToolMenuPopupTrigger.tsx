'use client';

import React, { useEffect } from 'react';
import { useToolMenu } from './useToolMenu';
import { ToolMenuPopup } from './ToolMenuPopup';

/**
 * ToolMenuPopupTrigger
 *
 * Manages keyboard shortcut triggers for the ToolMenuPopup.
 * Renders the popup when open.
 *
 * Triggers:
 * - Keyboard: `/` or `?` from an empty input (subtitle mode), `?` outside inputs, or Cmd/Ctrl+Shift+/
 */
export const ToolMenuPopupTrigger: React.FC = () => {
  const toolMenu = useToolMenu();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + / — always opens regardless of focus
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '/') {
        e.preventDefault();
        toolMenu.toggle();
        return;
      }

      // ? (Shift+/) — toggle tool menu
      // Works when: not in an input, OR the input is empty
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        const tag = target.tagName?.toLowerCase();
        const isEditable = target.isContentEditable;

        if (tag === 'input' || tag === 'textarea' || isEditable) {
          const value = (target as HTMLInputElement).value;
          if (value && value.trim().length > 0) {
            return; // Don't intercept when user is mid-typing
          }
        }

        e.preventDefault();
        toolMenu.toggle();
        return;
      }

      // / (plain slash) from empty input — open tool menu
      // Only intercepts when an input is focused and empty (subtitle expanded mode).
      // When not in an input, / passes through so SubtitleOverlay can use it to expand.
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        const target = e.target as HTMLElement;
        const tag = target.tagName?.toLowerCase();
        const isEditable = target.isContentEditable;

        if (tag === 'input' || tag === 'textarea' || isEditable) {
          const value = (target as HTMLInputElement).value;
          if (!value || value.trim().length === 0) {
            e.preventDefault();
            e.stopPropagation();
            toolMenu.toggle();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toolMenu]);

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
