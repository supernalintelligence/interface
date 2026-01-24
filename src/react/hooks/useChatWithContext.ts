/**
 * useChatWithContext - Hook for integrating AI chat with application context
 * 
 * Provides chat capabilities that can be plugged into any UI:
 * - Automatic context injection (current view, available tools, app state)
 * - Tool execution
 * - Prompt building with context
 * - Message handling
 */

import { useState, useCallback, useMemo } from 'react';
import { ToolRegistry } from '../../background/registry/ToolRegistry';

export interface ChatContext {
  // Location context
  currentRoute?: string;
  viewType?: string;

  // User context
  userId?: string;
  userRole?: string;

  // Application state
  appState?: Record<string, any>;
  filters?: Record<string, any>;
  searchQuery?: string;

  // Additional context
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  context?: Partial<ChatContext>;
  toolCalls?: Array<{
    toolId: string;
    args: any;
    result?: any;
  }>;
}

export interface PromptWithContext {
  userMessage: string;
  context: ChatContext;
  availableTools: string[];
  systemPrompt: string;
}

export interface UseChatWithContextConfig {
  // Context configuration
  userId?: string;

  // Optional callbacks
  onMessage?: (message: ChatMessage) => void;
  onToolExecute?: (toolId: string, args: any, result: any) => void;
  onError?: (error: Error) => void;

  // Custom context provider
  getAppState?: () => Record<string, any>;

  // System prompt customization
  systemPrompt?: string;
}

export function useChatWithContext(config: UseChatWithContextConfig = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get available tools based on element visibility
  const availableTools = useMemo(() => {
    return ToolRegistry.getToolsByLocation().filter(t => t.aiEnabled);
  }, []);
  
  // Build context object
  const getCurrentContext = useCallback((): ChatContext => {
    return {
      userId: config.userId,
      appState: config.getAppState?.(),
      metadata: {
        timestamp: new Date().toISOString(),
        toolCount: availableTools.length
      }
    };
  }, [config.userId, config.getAppState, availableTools.length]);
  
  // Build prompt with context
  const buildPromptWithContext = useCallback((userMessage: string): PromptWithContext => {
    const context = getCurrentContext();
    const toolNames = availableTools.map(t => 
      t.name || `${t.componentName}.${t.methodName}`
    );
    
    const systemPrompt = config.systemPrompt || `You are an AI assistant with access to application tools.

Current Context:
- Available Tools: ${toolNames.join(', ')}
${context.appState ? `- Application State: ${JSON.stringify(context.appState, null, 2)}` : ''}

When the user asks you to do something:
1. Identify the appropriate tool from available tools
2. Extract any required parameters from the user's message
3. Return the tool name and parameters in your response
4. Confirm the action after execution

Be concise and helpful.`;
    
    return {
      userMessage,
      context,
      availableTools: toolNames,
      systemPrompt
    };
  }, [getCurrentContext, availableTools, config.systemPrompt]);
  
  // Execute a tool
  const executeTool = useCallback(async (toolId: string, args: any = {}) => {
    try {
      // Get tool metadata
      const tool = ToolRegistry.getTool(toolId);
      if (!tool || !tool.method) {
        throw new Error(`Tool not found or has no method: ${toolId}`);
      }
      
      // Convert args object to parameters array based on inputSchema
      const parameters: any[] = [];
      if (tool.inputSchema) {
        for (const [paramName, paramDef] of Object.entries(tool.inputSchema)) {
          const def = paramDef as any;
          parameters.push(args[paramName] ?? def.default);
        }
      }
      
      // Execute the tool method
      const result = await tool.method(...parameters);
      
      config.onToolExecute?.(toolId, args, result);
      
      return {
        success: true,
        result,
        error: undefined
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      config.onError?.(err);
      
      return {
        success: false,
        result: undefined,
        error: err.message
      };
    }
  }, [config]);
  
  // Add a message
  const addMessage = useCallback((
    content: string, 
    role: 'user' | 'assistant' | 'system' = 'user'
  ) => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
      context: role === 'user' ? getCurrentContext() : undefined
    };
    
    setMessages(prev => [...prev, message]);
    config.onMessage?.(message);
    
    return message;
  }, [getCurrentContext, config]);
  
  // Send a message (user -> AI -> tool execution)
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addMessage(content, 'user');
    
    setIsProcessing(true);
    
    try {
      // Build prompt with context
      const _prompt = buildPromptWithContext(content);
      
      // Simple fuzzy matching for demo purposes
      // In production, this would call an LLM API
      const lowerContent = content.toLowerCase();
      let responseContent = "I understand. ";
      let toolExecuted = false;
      
      // Try to match and execute tools
      for (const tool of availableTools) {
        const toolName = tool.name || `${tool.componentName}.${tool.methodName}`;
        const keywords = tool.examples?.join(' ').toLowerCase() || '';
        
        // Simple keyword matching
        if (keywords.includes(lowerContent) || 
            toolName.toLowerCase().includes(lowerContent.split(' ')[0])) {
          
          // Extract simple arguments (in production, LLM would do this)
          const args = extractSimpleArgs(content, tool);
          
          // Execute tool
          const result = await executeTool(tool.toolId || '', args);
          
          if (result.success) {
            responseContent += `Executed ${toolName}. `;
            toolExecuted = true;
          } else {
            responseContent += `Failed to execute ${toolName}: ${result.error}`;
          }
          
          break;
        }
      }
      
      if (!toolExecuted) {
        responseContent = `I couldn't find a matching tool. Available tools: ${
          availableTools.map(t => t.name || t.methodName).join(', ')
        }`;
      }
      
      // Add AI response
      addMessage(responseContent, 'assistant');
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      config.onError?.(err);
      addMessage(`Error: ${err.message}`, 'system');
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, buildPromptWithContext, availableTools, executeTool, config]);
  
  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Suggest tools based on query
  const suggestTools = useCallback((query: string) => {
    if (!query.trim()) return availableTools;
    
    const lowerQuery = query.toLowerCase();
    return availableTools.filter(tool => {
      const toolName = (tool.name || tool.methodName).toLowerCase();
      const description = tool.description?.toLowerCase() || '';
      const examples = tool.examples?.join(' ').toLowerCase() || '';
      
      return toolName.includes(lowerQuery) || 
             description.includes(lowerQuery) ||
             examples.includes(lowerQuery);
    });
  }, [availableTools]);
  
  return {
    // State
    messages,
    isProcessing,
    availableTools,
    currentContext: getCurrentContext(),
    
    // Actions
    sendMessage,
    addMessage,
    clearMessages,
    executeTool,
    
    // Helpers
    buildPromptWithContext,
    suggestTools
  };
}

// Simple argument extraction (in production, LLM would handle this)
function extractSimpleArgs(query: string, tool: any): any {
  const args: any = {};
  const lowerQuery = query.toLowerCase();
  
  // Extract numbers
  const numMatch = query.match(/\d+/);
  if (numMatch && tool.inputSchema) {
    const numParam = Object.keys(tool.inputSchema).find(
      key => tool.inputSchema[key].type === 'number'
    );
    if (numParam) {
      args[numParam] = parseInt(numMatch[0], 10);
    }
  }
  
  // Extract common keywords
  if (lowerQuery.includes('dark')) args.theme = 'dark';
  if (lowerQuery.includes('light')) args.theme = 'light';
  if (lowerQuery.includes('high')) args.priority = 'high';
  if (lowerQuery.includes('medium')) args.priority = 'medium';
  if (lowerQuery.includes('low')) args.priority = 'low';
  
  return args;
}

