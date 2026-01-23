// Main exports
export { SupernalProvider, type SupernalProviderProps } from './components/SupernalProvider';

// Hooks for advanced usage
export {
  useNavigationGraph,
  useCurrentContext,
  useNavigationPath,
  useRegisterTool,
  useNavigate,
  useAllContexts,
  NavigationContextProvider,
} from './hooks/useNavigationGraph';

export { useChatContext, ChatProvider } from './contexts/ChatProvider';

// Optional exports for customization (re-exported from base package)
export { ChatBubble } from '../../src/ui/react/chat/ChatBubble';
export { ChatInputProvider, useChatInput } from '../../src/contexts/ChatInputContext';
export { AutoNavigationContext } from './components/AutoNavigationContext';
export {
  DemoAIInterface,
  type CommandResult,
  type AICommand,
  type AIResponse
} from './lib/ChatAIInterface';
export { ToolManager, type ToolExecutionResult } from './lib/ToolManager';
export { FuzzyMatcher } from './lib/FuzzyMatcher';
export { findBestMatch, scoreToolMatch, type FuzzyMatchResult } from './lib/fuzzyMatchTools';

// Note: Types from @supernalintelligence/interface-enterprise are available
// when that package is installed. Import them directly from the package if needed.
