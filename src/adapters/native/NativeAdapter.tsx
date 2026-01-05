/**
 * Native Adapter
 * 
 * Implements ChatUIAdapter using our built-in ChatBubble component.
 * Zero external dependencies - works out of the box.
 * 
 * This adapter provides:
 * - Lightweight chat UI
 * - Direct tool execution via ToolRegistry
 * - No LLM required (uses pattern matching)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { 
  ChatUIAdapter, 
  ChatUIProps, 
  ReadableState, 
  ToolExecution, 
  ToolExecutionCallback 
} from '../types';
import type { ToolMetadata } from '../../decorators/Tool';
import { ChatBubble } from '../../ui/react/chat/ChatBubble';

/**
 * Message type for native chat
 */
interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai' | 'system';
  timestamp: string;
}

/**
 * Configuration for Native adapter
 */
export interface NativeAdapterConfig {
  /** Default system message shown on first load */
  welcomeMessage?: string;
  /** Whether to use pattern matching for tool execution */
  usePatternMatching?: boolean;
}

/**
 * Native Adapter Implementation
 */
export class NativeAdapter implements ChatUIAdapter {
  readonly name = 'native';
  
  private tools: ToolMetadata[] = [];
  private readables: ReadableState[] = [];
  private executionCallbacks: ToolExecutionCallback[] = [];
  private config: NativeAdapterConfig;
  
  constructor(config: NativeAdapterConfig = {}) {
    this.config = {
      usePatternMatching: true,
      ...config,
    };
  }
  
  async initialize(): Promise<void> {
    // Native adapter doesn't need initialization
  }
  
  registerTools(tools: ToolMetadata[]): void {
    this.tools = tools;
  }
  
  registerReadables(readables: ReadableState[]): void {
    this.readables = readables;
  }
  
  onToolExecution(callback: ToolExecutionCallback): () => void {
    this.executionCallbacks.push(callback);
    return () => {
      this.executionCallbacks = this.executionCallbacks.filter(cb => cb !== callback);
    };
  }
  
  private notifyExecution(execution: ToolExecution): void {
    this.executionCallbacks.forEach(cb => {
      try {
        cb(execution);
      } catch {
        // Ignore callback errors
      }
    });
  }
  
  isReady(): boolean {
    return true; // Always ready
  }
  
  dispose(): void {
    this.executionCallbacks = [];
    this.tools = [];
    this.readables = [];
  }
  
  render(props: ChatUIProps): React.ReactNode {
    return (
      <NativeChatWrapper
        adapter={this}
        tools={this.tools}
        config={this.config}
        {...props}
      />
    );
  }
}

/**
 * Internal wrapper component
 */
interface NativeChatWrapperProps extends ChatUIProps {
  adapter: NativeAdapter;
  tools: ToolMetadata[];
  config: NativeAdapterConfig;
}

function NativeChatWrapper({
  adapter,
  tools,
  config: _config,
  ...props
}: NativeChatWrapperProps) {
  // Suppress unused props warning for spreading
  void props;
  const [messages, setMessages] = useState<Message[]>([]);
  const toolsRef = useRef(tools);
  
  // Keep tools ref updated
  useEffect(() => {
    toolsRef.current = tools;
  }, [tools]);
  
  /**
   * Find matching tool using pattern matching
   */
  const findMatchingTool = useCallback((query: string): { tool: ToolMetadata | null; params: unknown[] } => {
    const lowerQuery = query.toLowerCase().trim();
    let bestTool: ToolMetadata | null = null;
    let bestScore = 0;
    const params: unknown[] = [];
    
    for (const tool of toolsRef.current) {
      let score = 0;
      
      // Check examples
      if (tool.examples && Array.isArray(tool.examples)) {
        for (const example of tool.examples) {
          if (typeof example !== 'string') continue;
          const exampleLower = example.toLowerCase();
          
          // Exact match
          if (exampleLower === lowerQuery) {
            score += 20;
          }
          // Query starts with example pattern
          else if (lowerQuery.startsWith(exampleLower.replace(/\{[^}]+\}/g, '').trim())) {
            score += 15;
            // Extract parameter from trailing text
            const pattern = exampleLower.replace(/\{[^}]+\}/g, '').trim();
            const trailing = query.substring(pattern.length).trim();
            if (trailing) {
              params.push(trailing);
            }
          }
          // Partial match
          else if (exampleLower.includes(lowerQuery) || lowerQuery.includes(exampleLower)) {
            score += 5;
          }
        }
      }
      
      // Check method name
      if (tool.methodName) {
        const methodLower = tool.methodName.toLowerCase();
        if (lowerQuery.includes(methodLower)) {
          score += 3;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestTool = tool;
      }
    }
    
    return { tool: bestTool, params };
  }, []);
  
  /**
   * Execute a tool
   */
  const executeTool = useCallback(async (tool: ToolMetadata, params: unknown[]): Promise<{ success: boolean; message: string }> => {
    const start = Date.now();
    
    try {
      let result: unknown;
      
      if (tool.method) {
        result = await tool.method(...params);
      } else if (tool.instance && tool.methodName) {
        result = await tool.instance[tool.methodName](...params);
      } else {
        throw new Error(`Tool ${tool.name} has no executable method`);
      }
      
      const execution: ToolExecution = {
        toolId: tool.toolId,
        toolName: tool.name || tool.methodName || 'unknown',
        args: params.reduce<Record<string, unknown>>((acc, p, i) => ({ ...acc, [`arg${i}`]: p }), {}),
        result,
        success: true,
        timestamp: new Date(),
        duration: Date.now() - start,
        containerId: tool.containerId,
        dangerLevel: tool.dangerLevel,
        approvalRequired: tool.requiresApproval,
      };
      
      (adapter as any).notifyExecution(execution);
      
      // Extract message from result
      if (typeof result === 'object' && result !== null && 'message' in result) {
        return { success: true, message: (result as { message: string }).message };
      }
      return { success: true, message: `✅ Executed ${tool.name}` };
    } catch (error) {
      const execution: ToolExecution = {
        toolId: tool.toolId,
        toolName: tool.name || tool.methodName || 'unknown',
        args: params.reduce<Record<string, unknown>>((acc, p, i) => ({ ...acc, [`arg${i}`]: p }), {}),
        result: null,
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: new Date(),
        duration: Date.now() - start,
        containerId: tool.containerId,
        dangerLevel: tool.dangerLevel,
        approvalRequired: tool.requiresApproval,
      };
      
      (adapter as any).notifyExecution(execution);
      
      return { 
        success: false, 
        message: `❌ Error: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }, [adapter]);
  
  /**
   * Handle user message
   */
  const handleSendMessage = useCallback(async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      type: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Find and execute tool
    const { tool, params } = findMatchingTool(text);
    
    if (!tool) {
      // No matching tool
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        text: `❓ No matching command found. Try: ${toolsRef.current.slice(0, 3).flatMap(t => t.examples?.slice(0, 1) || []).join(', ')}`,
        type: 'system',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, systemMessage]);
      return;
    }
    
    // Execute tool
    const result = await executeTool(tool, params);
    
    // Add response message
    const responseMessage: Message = {
      id: `ai-${Date.now()}`,
      text: result.message,
      type: result.success ? 'ai' : 'system',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, responseMessage]);
  }, [findMatchingTool, executeTool]);
  
  /**
   * Clear chat
   */
  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, []);
  
  return (
    <ChatBubble
      messages={messages}
      onSendMessage={handleSendMessage}
      onClearChat={handleClearChat}
    />
  );
}

/**
 * Factory function for creating Native adapter
 */
export function createNativeAdapter(config?: NativeAdapterConfig): NativeAdapter {
  return new NativeAdapter(config);
}

