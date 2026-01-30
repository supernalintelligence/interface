'use client';

/**
 * ClaudeClient - Simple direct API client for BYOK mode
 *
 * This client makes direct calls to the Anthropic API using the user's API key.
 * It's designed for the BYOK (Bring Your Own Key) flow where users provide
 * their own Anthropic API key.
 *
 * Note: This requires the 'anthropic-dangerous-direct-browser-access' header
 * which Anthropic provides for browser-based applications.
 *
 * For production cross-site key management, see:
 * docs/research/cross-site-key-management-byok.md
 */

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{
    type: 'text';
    text: string;
  }>;
  model: string;
  stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ClaudeClientConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface SendMessageOptions {
  /** Conversation history to include */
  messages?: ClaudeMessage[];
  /** Override system prompt for this request */
  systemPrompt?: string;
  /** Override max tokens for this request */
  maxTokens?: number;
  /** Temperature (0-1) for response randomness */
  temperature?: number;
}

export interface SendMessageResult {
  success: boolean;
  message: string;
  response?: ClaudeResponse;
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
}

// Cost per 1K tokens (approximate)
const COST_PER_1K = {
  'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
  'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
  'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
  'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
} as const;

/**
 * Simple Claude API client for BYOK mode
 */
export class ClaudeClient {
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private systemPrompt: string;

  constructor(config: ClaudeClientConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'claude-sonnet-4-20250514';
    this.maxTokens = config.maxTokens || 4096;
    this.systemPrompt = config.systemPrompt || 'You are a helpful AI assistant integrated into a web application. Be concise and helpful.';
  }

  /**
   * Send a message to Claude and get a response
   */
  async sendMessage(
    userMessage: string,
    options: SendMessageOptions = {}
  ): Promise<SendMessageResult> {
    const messages: ClaudeMessage[] = [
      ...(options.messages || []),
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: options.maxTokens || this.maxTokens,
          system: options.systemPrompt || this.systemPrompt,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          temperature: options.temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401) {
          return {
            success: false,
            message: 'Invalid API key. Please check your API key and try again.',
            error: 'INVALID_API_KEY',
          };
        }

        if (response.status === 429) {
          return {
            success: false,
            message: 'Rate limit exceeded. Please wait a moment and try again.',
            error: 'RATE_LIMITED',
          };
        }

        if (response.status === 400) {
          return {
            success: false,
            message: errorData.error?.message || 'Invalid request',
            error: 'BAD_REQUEST',
          };
        }

        return {
          success: false,
          message: errorData.error?.message || `API error: ${response.status}`,
          error: 'API_ERROR',
        };
      }

      const data: ClaudeResponse = await response.json();
      const textContent = data.content.find(c => c.type === 'text');
      const responseText = textContent?.text || '';

      // Calculate usage and estimated cost
      const modelCosts = COST_PER_1K[this.model as keyof typeof COST_PER_1K] || COST_PER_1K['claude-sonnet-4-20250514'];
      const inputCost = (data.usage.input_tokens / 1000) * modelCosts.input;
      const outputCost = (data.usage.output_tokens / 1000) * modelCosts.output;

      return {
        success: true,
        message: responseText,
        response: data,
        usage: {
          inputTokens: data.usage.input_tokens,
          outputTokens: data.usage.output_tokens,
          estimatedCost: inputCost + outputCost,
        },
      };
    } catch (err) {
      console.error('ClaudeClient error:', err);

      if (err instanceof TypeError && err.message.includes('fetch')) {
        return {
          success: false,
          message: 'Network error. Please check your connection.',
          error: 'NETWORK_ERROR',
        };
      }

      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        error: 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * Update the API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Update the model
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Update the system prompt
   */
  setSystemPrompt(systemPrompt: string): void {
    this.systemPrompt = systemPrompt;
  }
}

/**
 * Create a Claude client instance
 */
export function createClaudeClient(config: ClaudeClientConfig): ClaudeClient {
  return new ClaudeClient(config);
}
