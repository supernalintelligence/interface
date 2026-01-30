'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { DemoAIInterface } from '../lib/ChatAIInterface';
import { ClaudeClient, ClaudeMessage } from '../lib/ClaudeClient';
import { useApiKeyOptional } from './ApiKeyContext';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai' | 'system';
  timestamp: string;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  isLoading: boolean;
  /** Whether real AI mode is active (API key is valid) */
  isAiMode: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
}

const STORAGE_KEY = 'supernal-chat-messages';
const MAX_MESSAGES = 100;

function getInitialMessages(): Message[] {
  return [
    {
      id: '1',
      text: '👋 Welcome to @supernal-interface Demo!',
      type: 'system',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      text: 'This is NOT real AI - it\'s a demo showing how AI would interact with @Tool decorated methods.',
      type: 'system',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      text: '🎮 **Try these commands:**\n\n- "open menu" or "close menu"\n- "toggle notifications"\n- "set priority high"',
      type: 'system',
      timestamp: new Date().toISOString()
    },
    {
      id: '4',
      text: '🗺️ **Navigate pages:**\n\n- "architecture" or "dashboard"\n- "demo" or "home"\n- "docs" or "examples"',
      type: 'system',
      timestamp: new Date().toISOString()
    },
    {
      id: '5',
      text: '💬 Your chat history persists across pages and refreshes!',
      type: 'system',
      timestamp: new Date().toISOString()
    },
    {
      id: '6',
      text: '💾 Advanced Demo: Uses StateManager with localStorage - your widget state persists too!',
      type: 'system',
      timestamp: new Date().toISOString()
    }
  ];
}

export function ChatProvider({
  children,
  mode = 'fuzzy',
  apiKey: propApiKey,
  onToolExecute,
}: {
  children: React.ReactNode;
  mode?: 'fuzzy' | 'ai';
  apiKey?: string;
  onToolExecute?: (tool: string, result: any) => void;
}) {
  // Always start with empty messages to prevent hydration mismatch
  const [messages, setMessages] = useState<Message[]>([]);

  // Get API key from context (managed by ApiKeyProvider)
  const apiKeyContext = useApiKeyOptional();
  const activeApiKey = apiKeyContext?.hasApiKey ? apiKeyContext.apiKey : propApiKey;
  const isAiMode = !!activeApiKey;

  // Claude client ref - created/updated when API key changes
  const claudeClientRef = useRef<ClaudeClient | null>(null);

  // Update Claude client when API key changes
  useEffect(() => {
    if (activeApiKey) {
      claudeClientRef.current = new ClaudeClient({
        apiKey: activeApiKey,
        systemPrompt: `You are a helpful AI assistant integrated into a web application powered by Supernal Interface.
You can help users navigate the application and perform tasks.
Be concise, friendly, and helpful. Use markdown formatting when appropriate.`,
      });
    } else {
      claudeClientRef.current = null;
    }
  }, [activeApiKey]);

  // Load messages from localStorage after hydration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const loaded = JSON.parse(saved).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp).toISOString(),
        }));
        setMessages(loaded);
      } else {
        // No saved messages, use initial welcome messages
        setMessages(getInitialMessages());
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages(getInitialMessages());
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [aiInterface] = useState(() => new DemoAIInterface());

  // Subscribe to tool executions
  useEffect(() => {
    if (onToolExecute) {
      return aiInterface.onToolExecution((result) => {
        onToolExecute(result.toolName, result);
      });
    }
  }, [aiInterface, onToolExecute]);

  // Save messages to localStorage
  useEffect(() => {
    try {
      const toSave = messages.slice(-MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);

    try {
      // Use Claude API if API key is available, otherwise use demo interface
      if (claudeClientRef.current) {
        // Build conversation history for Claude (last 20 messages for context)
        const conversationHistory: ClaudeMessage[] = messages
          .slice(-20)
          .filter(m => m.type === 'user' || m.type === 'ai')
          .map(m => ({
            role: m.type === 'user' ? 'user' as const : 'assistant' as const,
            content: m.text,
          }));

        const result = await claudeClientRef.current.sendMessage(text, {
          messages: conversationHistory,
        });

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.message,
          type: result.success ? 'ai' : 'system',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Fall back to demo interface
        const result = await aiInterface.findAndExecuteCommand(text);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.message,
          type: result.success ? 'ai' : 'system',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'system',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [aiInterface, messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearMessages, isLoading, isAiMode }}>
      {children}
    </ChatContext.Provider>
  );
}
