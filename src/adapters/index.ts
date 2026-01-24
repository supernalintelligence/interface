/**
 * Chat UI Adapters
 * 
 * Swappable chat UI layer that allows @supernal-interface tools
 * to work with multiple chat providers.
 * 
 * @example
 * ```tsx
 * import { ChatUIProvider, ChatUI, createCopilotKitAdapter } from '@supernal-interface/core';
 * 
 * const adapter = createCopilotKitAdapter({ runtimeUrl: '/api/copilotkit' });
 * 
 * function App() {
 *   return (
 *     <ChatUIProvider adapter={adapter}>
 *       <YourApp />
 *       <ChatUI position="bottom-right" />
 *     </ChatUIProvider>
 *   );
 * }
 * ```
 */

// Types
export * from './types';

// Provider
export { ChatUIProvider, ChatUI, useChatUI, useChatUIOptional, withChatUI } from './ChatUIProvider';

// Adapters
// CopilotKit adapter temporarily disabled due to ESM bundling issues in Next.js 15
// To use: import directly from @supernal/interface/adapters/copilotkit
// export { CopilotKitAdapter, createCopilotKitAdapter } from './copilotkit';
// export type { CopilotKitAdapterConfig } from './copilotkit';
export type { CopilotKitAdapterConfig } from './copilotkit';

// NativeAdapter removed - use SupernalProvider from @supernal/interface-nextjs instead
// SupernalProvider provides the same pattern-matching functionality with premium UI

// Bridge utilities
export {
  bridgeToolRegistry,
  bridgeComponentState,
  registerReadable,
  createAuditTrail,
  setupBridge,
} from './bridge';
export type {
  BridgeToolRegistryOptions,
  BridgeComponentStateOptions,
  AuditTrailOptions,
} from './bridge';

