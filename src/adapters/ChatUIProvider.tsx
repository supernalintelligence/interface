/**
 * Chat UI Provider
 * 
 * React context that manages the active chat adapter and provides
 * automatic tool/state bridging to any chat UI library.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { ChatUIAdapter, ChatUIProviderConfig, ChatUIProps, ToolExecution } from './types';
import { ToolRegistry } from '../background/registry/ToolRegistry';

/**
 * Context value provided to children
 */
interface ChatUIContextValue {
  /** The active adapter */
  adapter: ChatUIAdapter | null;
  /** Whether the adapter is initialized */
  isReady: boolean;
  /** Recent tool executions (for UI display) */
  recentExecutions: ToolExecution[];
  /** Render the chat UI */
  renderChat: (props?: ChatUIProps) => ReactNode;
}

const ChatUIContext = createContext<ChatUIContextValue | null>(null);

/**
 * Hook to access the chat UI context
 */
export function useChatUI(): ChatUIContextValue {
  const context = useContext(ChatUIContext);
  if (!context) {
    throw new Error('useChatUI must be used within a ChatUIProvider');
  }
  return context;
}

/**
 * Hook to check if chat UI is available
 */
export function useChatUIOptional(): ChatUIContextValue | null {
  return useContext(ChatUIContext);
}

/**
 * Props for ChatUIProvider
 */
interface ChatUIProviderProps extends ChatUIProviderConfig {
  children: ReactNode;
}

/**
 * Chat UI Provider Component
 * 
 * Wraps your app and provides chat UI capabilities through the selected adapter.
 * 
 * @example
 * ```tsx
 * import { ChatUIProvider } from '@supernal-interface/core';
 * import { CopilotKitAdapter } from '@supernal-interface/adapters/copilotkit';
 * 
 * function App() {
 *   return (
 *     <ChatUIProvider adapter={new CopilotKitAdapter()}>
 *       <YourApp />
 *       <ChatUI />
 *     </ChatUIProvider>
 *   );
 * }
 * ```
 */
export function ChatUIProvider({
  adapter,
  autoRegisterTools = true,
  autoRegisterReadables = true,
  toolFilter = (tool) => tool.aiEnabled === true,
  children,
}: ChatUIProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [recentExecutions, setRecentExecutions] = useState<ToolExecution[]>([]);

  // Initialize adapter
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // Call adapter's initialize if it exists
        if (adapter.initialize) {
          await adapter.initialize();
        }

        // Auto-register tools
        if (autoRegisterTools) {
          const allTools = Array.from(ToolRegistry.getAllTools().values());
          const filteredTools = allTools.filter(toolFilter);
          adapter.registerTools(filteredTools);
          
          // eslint-disable-next-line no-console
          console.log(`[ChatUIProvider] Registered ${filteredTools.length} tools with ${adapter.name} adapter`);
        }

        // Auto-register readables (component state)
        if (autoRegisterReadables) {
          // TODO: Implement ComponentRegistry.getAllReadables()
          // For now, this is a placeholder
          adapter.registerReadables([]);
        }

        // Subscribe to tool executions
        const unsubscribe = adapter.onToolExecution((execution) => {
          setRecentExecutions((prev) => [execution, ...prev.slice(0, 9)]); // Keep last 10
        });

        if (mounted) {
          setIsReady(true);
        }

        return unsubscribe;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`[ChatUIProvider] Failed to initialize ${adapter.name} adapter:`, error);
        return () => {};
      }
    }

    const cleanupPromise = init();

    return () => {
      mounted = false;
      cleanupPromise.then((cleanup) => cleanup?.());
      adapter.dispose?.();
    };
  }, [adapter, autoRegisterTools, autoRegisterReadables, toolFilter]);

  // Render function that delegates to adapter
  const renderChat = useCallback(
    (props?: ChatUIProps) => {
      if (!isReady) {
        return null;
      }
      return adapter.render(props || {});
    },
    [adapter, isReady]
  );

  const contextValue: ChatUIContextValue = {
    adapter,
    isReady,
    recentExecutions,
    renderChat,
  };

  return <ChatUIContext.Provider value={contextValue}>{children}</ChatUIContext.Provider>;
}

/**
 * Convenience component that renders the chat UI from context
 * 
 * @example
 * ```tsx
 * <ChatUIProvider adapter={adapter}>
 *   <App />
 *   <ChatUI position="bottom-right" />
 * </ChatUIProvider>
 * ```
 */
export function ChatUI(props: ChatUIProps) {
  const { renderChat, isReady } = useChatUI();

  if (!isReady) {
    return null;
  }

  return <>{renderChat(props)}</>;
}

/**
 * HOC to inject chat UI capabilities
 */
export function withChatUI<P extends object>(
  WrappedComponent: React.ComponentType<P & { chatUI: ChatUIContextValue }>
) {
  return function WithChatUIComponent(props: P) {
    const chatUI = useChatUI();
    return <WrappedComponent {...props} chatUI={chatUI} />;
  };
}

