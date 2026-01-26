'use client';

import React, { useEffect } from 'react';
import { ChatInputProvider } from '../contexts/ChatInputContext';
import { ChatProvider, useChatContext } from '../contexts/ChatProvider';
import { ChatBubble } from './ChatBubble';
import { AutoNavigationContext } from './AutoNavigationContext';
import { ExposureCollector, ToolRegistry } from '@supernal/interface/browser';

// Note: Provider auto-initialization will be added in a future version
// when AllProviders is available from @supernal/interface/browser

export interface SupernalProviderProps {
  children: React.ReactNode;

  // Optional customization
  theme?: 'light' | 'dark' | 'auto';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  mode?: 'fuzzy' | 'ai';
  apiKey?: string;
  welcomeMessage?: string;
  routes?: Record<string, string>;
  disabled?: boolean;
  glassMode?: boolean;
  logo?: string; // Custom logo URL or data URI

  // Advanced callbacks
  onNavigate?: (context: string) => void;
  onToolExecute?: (tool: string, result: any) => void;
}

// Inner component that uses ChatContext
function ChatBubbleConnector({
  theme,
  position,
  welcomeMessage,
  glassMode,
  logo,
}: {
  theme?: 'light' | 'dark' | 'auto';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  welcomeMessage?: string;
  glassMode?: boolean;
  logo?: string;
}) {
  const { messages, sendMessage, clearMessages } = useChatContext();

  // Only include logo in config if it's defined (don't override default with undefined)
  const config = {
    glassMode,
    ...(logo ? { logo } : {})
  };

  return (
    <ChatBubble
      messages={messages}
      onSendMessage={sendMessage}
      onClearChat={clearMessages}
      position={position}
      variant="full"
      defaultExpanded={true}
      config={config}
    />
  );
}

export function SupernalProvider({
  children,
  theme = 'auto',
  position = 'bottom-right',
  mode = 'fuzzy',
  apiKey,
  welcomeMessage,
  routes,
  disabled = false,
  glassMode = true,
  logo,
  onNavigate,
  onToolExecute,
}: SupernalProviderProps) {
  const shouldRenderChatBubble = !disabled;
  console.log('[SupernalProvider] disabled:', disabled, 'type:', typeof disabled);
  console.log('[SupernalProvider] shouldRenderChatBubble:', shouldRenderChatBubble);

  // 🎯 AUTO-INITIALIZE ExposureCollector (Zero-Config Element-Based Inference)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const collector = ExposureCollector.getInstance();
    const registeredToolIds = new Set<string>();

    // Register all tools with their DOM elements
    const registerTools = () => {
      const allTools = ToolRegistry.getAllTools();

      allTools.forEach(tool => {
        if (tool.elementId && !registeredToolIds.has(tool.toolId)) {
          // Find element by data-testid attribute
          const element = document.querySelector(`[data-testid="${tool.elementId}"]`);

          if (element) {
            collector.registerTool(tool.toolId, element, {
              name: tool.name,
              description: tool.description,
            });
            registeredToolIds.add(tool.toolId);
          }
        }
      });
    };

    // Initial registration
    registerTools();

    // Set up MutationObserver to detect dynamically added elements
    const observer = new MutationObserver(() => {
      registerTools(); // Re-scan when DOM changes
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      observer.disconnect();
      collector.destroy();
    };
  }, []);

  return (
    <ChatInputProvider>
      <ChatProvider mode={mode} apiKey={apiKey} onToolExecute={onToolExecute}>
        <AutoNavigationContext routes={routes} onNavigate={onNavigate}>
          {children}
        </AutoNavigationContext>
        {/* Render ChatBubble OUTSIDE AutoNavigationContext, after all children */}
        {shouldRenderChatBubble ? (
          <ChatBubbleConnector
            theme={theme}
            position={position}
            welcomeMessage={welcomeMessage}
            glassMode={glassMode}
            logo={logo}
          />
        ) : null}
      </ChatProvider>
    </ChatInputProvider>
  );
}
