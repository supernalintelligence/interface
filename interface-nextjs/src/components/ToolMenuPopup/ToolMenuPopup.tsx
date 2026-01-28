'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChatInput } from '../../contexts/ChatInputContext';
import { GLASS_RESPONSE_BUBBLE } from '../ChatBubble/constants';
import type { ToolMenuCategory } from './useToolMenu';
import type { ToolMetadata } from '@supernal/interface/browser';

interface ToolMenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ToolMenuCategory[];
  totalTools: number;
  contextLabel: string;
}

export const ToolMenuPopup: React.FC<ToolMenuPopupProps> = ({
  isOpen,
  onClose,
  categories,
  totalTools,
  contextLabel,
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const { insertText } = useChatInput();

  // SSR guard
  useEffect(() => {
    setIsHydrated(true);
    setIsMobile(window.matchMedia('(max-width: 767px)').matches);
  }, []);

  // Click-outside dismissal
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (popupRef.current && !popupRef.current.contains(target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Escape key dismissal
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isHydrated || !isOpen) return null;

  const toggleCategory = (key: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleToolClick = (tool: ToolMetadata) => {
    const command = tool.examples?.[0] || tool.name.toLowerCase();
    insertText(command, false);
    onClose();
  };

  const glassStyle: React.CSSProperties = {
    ...GLASS_RESPONSE_BUBBLE.dark,
    zIndex: 999998,
  };

  // Mobile: bottom sheet. Desktop: centered popup.
  const positionStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '80vh',
        borderRadius: '16px 16px 0 0',
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 480,
        width: '90vw',
        maxHeight: '70vh',
        borderRadius: 16,
      };

  return (
    <div
      ref={popupRef}
      data-tool-menu
      style={{ ...glassStyle, ...positionStyle, overflowY: 'auto' }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 600 }}>
            Available Actions
          </h3>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            {contextLabel} &middot; {totalTools} tool{totalTools !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 20,
            cursor: 'pointer',
            padding: '4px 8px',
            lineHeight: 1,
          }}
          aria-label="Close tool menu"
        >
          &times;
        </button>
      </div>

      {/* Categories */}
      <div style={{ padding: '8px 12px 16px' }}>
        {categories.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '24px 0', fontSize: 14 }}>
            No tools available on this page.
          </p>
        )}

        {categories.map(category => {
          const isCollapsed = collapsedCategories.has(category.key);
          return (
            <div key={category.key} style={{ marginBottom: 4 }}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.key)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 8,
                  color: '#fff',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'none';
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {category.displayName}
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: 8, fontSize: 12 }}>
                    {category.tools.length}
                  </span>
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                  {isCollapsed ? '\u25B6' : '\u25BC'}
                </span>
              </button>

              {/* Tool list */}
              {!isCollapsed && (
                <div style={{ paddingLeft: 8, paddingRight: 8 }}>
                  {category.tools.map((tool) => (
                    <button
                      key={tool.toolId}
                      onClick={() => handleToolClick(tool)}
                      style={{
                        width: '100%',
                        display: 'block',
                        padding: '8px 10px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 6,
                        textAlign: 'left',
                        color: '#fff',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'none';
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {tool.name}
                      </div>
                      {tool.description && (
                        <div style={{
                          fontSize: 11,
                          color: 'rgba(255,255,255,0.5)',
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
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div style={{
        padding: '10px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.35)',
        fontSize: 11,
      }}>
        Click a tool to insert its command &middot; Type <kbd style={{
          padding: '1px 4px',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.2)',
          fontSize: 10,
        }}>/</kbd> in chat for quick commands &middot; <kbd style={{
          padding: '1px 4px',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.2)',
          fontSize: 10,
        }}>Esc</kbd> to close
      </div>
    </div>
  );
};
