/**
 * Example: How to Use Subtitle Overlay Mode
 *
 * This example demonstrates how to enable and use the new subtitle overlay variant.
 */

import React, { useState } from 'react';
import { ChatBubble } from '../ChatBubble/ChatBubble';
import type { Message } from '../ChatBubble/types';

export function SubtitleOverlayExample() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      type: 'ai',
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `You said: "${text}"`,
        type: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen">
      {/* Your page content */}
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Subtitle Overlay Demo</h1>
        <p className="text-gray-600 mb-8">
          The chat overlay appears at the bottom with adaptive opacity.
        </p>

        {/* Example content */}
        <div className="space-y-4">
          <div className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Try Voice Input</h2>
            <p className="text-gray-700">
              Click the <strong>@/</strong> icon at the bottom to start voice recording.
            </p>
          </div>

          <div className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Desktop vs Mobile</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Desktop:</strong> Overlay fades to 10% opacity when idle (after 5 seconds)</li>
              <li><strong>Mobile:</strong> Always 100% opacity (always visible)</li>
              <li><strong>Listening:</strong> 70% opacity on desktop, 100% on mobile</li>
              <li><strong>Typing:</strong> 90% opacity on desktop, 100% on mobile</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subtitle Overlay Chat Bubble */}
      <ChatBubble
        messages={messages}
        onSendMessage={handleSendMessage}
        variant="subtitle" // 🎯 Use subtitle variant for minimalist overlay
        config={{
          title: 'AI Assistant',
          placeholder: 'Type or speak...',
          glassMode: true,
        }}
      />
    </div>
  );
}

/**
 * Usage in Settings Modal:
 *
 * To enable subtitle overlay via settings:
 * 1. Open settings modal
 * 2. Toggle "Subtitle Overlay (Beta)" ON
 * 3. Or select "Subtitle Overlay (Beta)" from Display Mode dropdown
 *
 * The settings will automatically switch the variant to 'subtitle'
 */
