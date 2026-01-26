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

// Optional exports for customization
export { ChatBubble } from './components/ChatBubble';
export { ChatBubbleSettingsModal, type ChatBubbleSettings } from './components/ChatBubbleSettingsModal';
export { ChatInputProvider, useChatInput } from './contexts/ChatInputContext';
export { AutoNavigationContext } from './components/AutoNavigationContext';

// Markdown rendering components
export { MessageRenderer } from './components/MessageRenderer';
export { CodeBlock } from './components/CodeBlock';
export { MermaidDiagram } from './components/MermaidDiagram';
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
