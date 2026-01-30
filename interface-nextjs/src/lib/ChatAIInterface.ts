/**
 * Demo AI Interface - uses open-source AIInterface
 *
 * This is a thin wrapper that:
 * 1. Imports the generic AIInterface from @supernal/interface
 * 2. Hooks into app-specific ToolManager for UI notifications
 * 3. Provides backward-compatible interface for existing code
 */

import {
  AIInterface,
  type AICommand,
  type AIResponse
} from '@supernal/interface/browser';
import { ToolManager, type ToolExecutionResult } from './ToolManager';

// Re-export types for convenience
export type { AICommand, AIResponse };

export interface CommandResult {
  success: boolean;
  message: string;
  tool?: any;
}

/**
 * Demo-specific AIInterface with ToolManager integration
 */
export class DemoAIInterface extends AIInterface {
  private toolExecutionListeners: Array<(result: ToolExecutionResult) => void> = [];

  constructor() {
    super();

    // Subscribe to tool execution results from ToolManager
    ToolManager.subscribe((result) => {
      this.notifyToolExecutionListeners(result);
    });
  }

  /**
   * Subscribe to tool execution results (for chat UI)
   */
  onToolExecution(callback: (result: ToolExecutionResult) => void): () => void {
    this.toolExecutionListeners.push(callback);
    return () => {
      this.toolExecutionListeners = this.toolExecutionListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners about tool execution
   */
  private notifyToolExecutionListeners(result: ToolExecutionResult) {
    this.toolExecutionListeners.forEach(listener => {
      try {
        listener(result);
      } catch (error) {
        console.error('Error in tool execution listener:', error);
      }
    });
  }

  /**
   * Find and execute command - backward compatible wrapper
   *
   * Convenience method that combines findToolsForCommand and executeCommand
   */
  async findAndExecuteCommand(
    query: string,
    _currentContainer?: string
  ): Promise<CommandResult> {
    const response = await this.processQuery(query);

    return {
      success: response.success,
      message: response.message,
      tool: response.executedTool
    };
  }
}
