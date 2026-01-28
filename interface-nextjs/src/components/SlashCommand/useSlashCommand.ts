'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ToolRegistry } from '@supernal/interface/browser';
import type { ToolMetadata } from '@supernal/interface/browser';

export interface UseSlashCommandReturn {
  /** Whether the slash command popup is visible */
  isOpen: boolean;
  /** Filtered list of tools matching the query */
  filteredTools: ToolMetadata[];
  /** Currently highlighted tool index */
  selectedIndex: number;
  /** Keyboard handler to attach to the input element */
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Select a tool by reference (e.g. on click) */
  selectTool: (tool: ToolMetadata) => void;
  /** Close the popup */
  close: () => void;
}

/**
 * Hook for "/" slash command autocomplete in chat input.
 *
 * Detects when inputValue starts with "/" and provides filtered tool results,
 * keyboard navigation, and selection handling.
 *
 * @param inputValue - Current chat input value
 * @param onSelect - Called with the command text when a tool is selected
 */
export function useSlashCommand(
  inputValue: string,
  onSelect: (command: string) => void,
): UseSlashCommandReturn {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const prevOpenRef = useRef(false);

  const isOpen = inputValue.startsWith('/');
  const query = isOpen ? inputValue.slice(1) : '';

  // Reset selection when popup opens/closes or query changes
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setSelectedIndex(0);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const filteredTools = useMemo(() => {
    if (!isOpen) return [];

    const locationTools = ToolRegistry.getToolsByLocation();
    const aiTools = locationTools.filter(t => t.aiEnabled);

    if (!query) return aiTools;

    const q = query.toLowerCase();
    return aiTools.filter(tool => {
      const fields = [
        tool.name?.toLowerCase() ?? '',
        tool.description?.toLowerCase() ?? '',
        tool.toolId?.toLowerCase() ?? '',
        ...(tool.examples || []).map(ex => ex?.toLowerCase() ?? ''),
        ...(tool.keywords || []).map(kw => kw?.toLowerCase() ?? ''),
      ];
      return fields.some(f => f.includes(q));
    });
  }, [isOpen, query]);

  const close = useCallback(() => {
    // Parent should clear the input to close; this is a no-op placeholder
    // since isOpen is derived from inputValue
  }, []);

  const selectTool = useCallback((tool: ToolMetadata) => {
    const command = tool.examples?.[0] || tool.name?.toLowerCase() || tool.toolId;
    onSelect(command);
  }, [onSelect]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredTools.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredTools.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
      e.preventDefault();
      selectTool(filteredTools[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onSelect('');
    } else if (e.key === 'Tab' && filteredTools[selectedIndex]) {
      e.preventDefault();
      selectTool(filteredTools[selectedIndex]);
    }
  }, [isOpen, filteredTools, selectedIndex, selectTool, onSelect]);

  return {
    isOpen,
    filteredTools,
    selectedIndex,
    onKeyDown,
    selectTool,
    close,
  };
}