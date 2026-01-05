/**
 * React Components - Open Source Edition
 * 
 * Basic React hooks. Architecture visualization components (ArchitectureGraph,
 * LiveArchitectureGraph, RuntimeGraphTracker) available in enterprise edition.
 */

// Basic hooks (open source)
export { useToolBinding } from './useToolBinding';
export { usePersistedState } from './usePersistedState';
export { useNavigationHandler } from './useNavigationHandler';

// Chat integration hook
export { useChatWithContext } from './hooks/useChatWithContext';
export type { 
  ChatContext, 
  ChatMessage, 
  PromptWithContext, 
  UseChatWithContextConfig 
} from './hooks/useChatWithContext';

// Enterprise features - available at https://supernal.ai/enterprise:
// - ArchitectureGraph (visual component tree)
// - LiveArchitectureGraph (real-time visualization)
// - RuntimeGraphTracker (execution tracking)
// - GraphLayout (layout engine)
// - TreeValidator (validation)
// - StatePanel (state visualization)
// - ContainerNode, ComponentNode, ToolNode (graph nodes)
