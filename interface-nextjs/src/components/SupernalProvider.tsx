'use client';

import React from 'react';
import { ChatInputProvider } from '../contexts/ChatInputContext';
import { ChatProvider, useChatContext } from '../contexts/ChatProvider';
import { ChatBubble } from './ChatBubble';
import { AutoNavigationContext } from './AutoNavigationContext';

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

  // Advanced callbacks
  onNavigate?: (context: string) => void;
  onToolExecute?: (tool: string, result: any) => void;
}

// Inner component that uses ChatContext
function ChatBubbleConnector({
  theme,
  position,
  welcomeMessage,
}: {
  theme?: 'light' | 'dark' | 'auto';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  welcomeMessage?: string;
}) {
  const { messages, sendMessage, clearMessages } = useChatContext();

  return (
    <ChatBubble
      messages={messages}
      onSendMessage={sendMessage}
      onClearChat={clearMessages}
      position={position}
      variant="full"
      defaultExpanded={true}
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
  onNavigate,
  onToolExecute,
}: SupernalProviderProps) {
  const shouldRenderChatBubble = !disabled;
  console.log('[SupernalProvider] disabled:', disabled, 'type:', typeof disabled);
  console.log('[SupernalProvider] shouldRenderChatBubble:', shouldRenderChatBubble);

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
          />
        ) : null}
      </ChatProvider>
    </ChatInputProvider>
  );
}
