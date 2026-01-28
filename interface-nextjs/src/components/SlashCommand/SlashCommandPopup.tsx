'use client';

import React, { useEffect, useRef } from 'react';
import { GLASS_RESPONSE_BUBBLE } from '../ChatBubble/constants';
import type { ToolMetadata } from '@supernal/interface/browser';

interface SlashCommandPopupProps {
  tools: ToolMetadata[];
  selectedIndex: number;
  onSelect: (tool: ToolMetadata) => void;
  onClose: () => void;
}

const MAX_VISIBLE_ITEMS = 8;

export const SlashCommandPopup: React.FC<SlashCommandPopupProps> = ({
  tools,
  selectedIndex,
  onSelect,
  onClose,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Click-outside dismissal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (tools.length === 0) return null;

  const itemHeight = 52; // approximate height per item
  const maxHeight = MAX_VISIBLE_ITEMS * itemHeight;

  return (
    <div
      ref={listRef}
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        right: 0,
        marginBottom: 4,
        maxHeight,
        overflowY: tools.length > MAX_VISIBLE_ITEMS ? 'auto' : 'hidden',
        borderRadius: 12,
        ...GLASS_RESPONSE_BUBBLE.dark,
        zIndex: 999998,
      }}
      data-slash-command-popup
    >
      {/* Header */}
      <div style={{
        padding: '8px 12px 4px',
        color: 'rgba(255,255,255,0.45)',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}>
        Commands &middot; {tools.length} available
      </div>

      {/* Tool list */}
      {tools.map((tool, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={tool.toolId}
            ref={isSelected ? selectedRef : undefined}
            onClick={() => onSelect(tool)}
            style={{
              width: '100%',
              display: 'block',
              padding: '8px 12px',
              background: isSelected ? 'rgba(59, 130, 246, 0.25)' : 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              color: '#fff',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLElement).style.background = 'none';
              }
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              <span style={{ color: 'rgba(147, 197, 253, 0.9)' }}>/{tool.toolId}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400, marginLeft: 8 }}>
                {tool.name}
              </span>
            </div>
            {tool.description && (
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                marginTop: 2,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {tool.description}
              </div>
            )}
          </button>
        );
      })}

      {/* Footer hint */}
      <div style={{
        padding: '6px 12px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
      }}>
        <kbd style={{ padding: '1px 3px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.15)', fontSize: 9 }}>↑↓</kbd> navigate
        {' '}<kbd style={{ padding: '1px 3px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.15)', fontSize: 9 }}>Enter</kbd> select
        {' '}<kbd style={{ padding: '1px 3px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.15)', fontSize: 9 }}>Esc</kbd> dismiss
      </div>
    </div>
  );
};