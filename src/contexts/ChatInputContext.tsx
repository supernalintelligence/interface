/**
 * Chat Input Context
 * 
 * Provides a way to insert text into the chat input from anywhere in the app.
 * Useful for "Copy to Chat" buttons in examples.
 */

import React, { createContext, useContext, useCallback, useRef } from 'react';

interface ChatInputContextType {
  /**
   * Insert text into the chat input (and optionally submit it)
   */
  insertText: (text: string, submit?: boolean) => void;
  
  /**
   * Register the chat input element (called by ChatBubble)
   */
  registerInput: (callback: (text: string, submit?: boolean) => void) => void;
}

const ChatInputContext = createContext<ChatInputContextType | null>(null);

export function useChatInput() {
  const context = useContext(ChatInputContext);
  if (!context) {
    throw new Error('useChatInput must be used within a ChatInputProvider');
  }
  return context;
}

export function ChatInputProvider({ children }: { children: React.ReactNode }) {
  const inputCallbackRef = useRef<((text: string, submit?: boolean) => void) | null>(null);
  
  const registerInput = useCallback((callback: (text: string, submit?: boolean) => void) => {
    inputCallbackRef.current = callback;
  }, []);
  
  const insertText = useCallback((text: string, submit = false) => {
    if (inputCallbackRef.current) {
      inputCallbackRef.current(text, submit);
    }
    // No input registered yet - ignore silently
  }, []);
  
  return (
    <ChatInputContext.Provider value={{ insertText, registerInput }}>
      {children}
    </ChatInputContext.Provider>
  );
}

