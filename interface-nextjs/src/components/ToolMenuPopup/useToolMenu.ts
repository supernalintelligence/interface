'use client';

import { useState, useMemo, useCallback } from 'react';
import { ToolRegistry } from '@supernal/interface/browser';
import type { ToolMetadata } from '@supernal/interface/browser';

export interface ToolMenuCategory {
  key: string;
  displayName: string;
  tools: ToolMetadata[];
}

/** Display names for ToolCategory enum values */
const CATEGORY_DISPLAY: Record<string, string> = {
  navigation: 'Navigation',
  user_interaction: 'Controls',
  data_manipulation: 'Data',
  content_creation: 'Content',
  content_retrieval: 'Content',
  external_service: 'Services',
  system: 'System',
  memory: 'Memory',
  data: 'Data',
  search: 'Search',
  utility: 'Utility',
  dom: 'DOM',
  api: 'API',
  communication: 'Communication',
  'context-app': 'App Context',
  workflow: 'Workflow',
};

export interface UseToolMenuReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  categories: ToolMenuCategory[];
  totalTools: number;
  contextLabel: string;
}

export function useToolMenu(): UseToolMenuReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  // Fetch and group tools when popup is open
  const { categories, totalTools, contextLabel } = useMemo(() => {
    if (!isOpen) {
      return { categories: [], totalTools: 0, contextLabel: '' };
    }

    // Get context-aware tools (filtered by current location/page)
    const tools = ToolRegistry.getToolsByLocation();
    const aiTools = tools.filter(t => t.aiEnabled);

    // Group by category
    const grouped: Record<string, ToolMetadata[]> = {};
    for (const tool of aiTools) {
      const cat = tool.category || 'uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(tool);
    }

    // Convert to display categories
    const cats: ToolMenuCategory[] = Object.entries(grouped)
      .map(([key, catTools]) => ({
        key,
        displayName: CATEGORY_DISPLAY[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        tools: catTools,
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    // Derive context label from current page
    let label = 'All Pages';
    try {
      // LocationContext is a singleton, importing dynamically to avoid SSR issues
      const { LocationContext } = require('@supernal/interface/browser');
      const current = LocationContext.getCurrent();
      if (current?.page) {
        label = current.page;
      }
    } catch {
      // Fallback if LocationContext not available
    }

    return { categories: cats, totalTools: aiTools.length, contextLabel: label };
  }, [isOpen]);

  return { isOpen, open, close, toggle, categories, totalTools, contextLabel };
}
