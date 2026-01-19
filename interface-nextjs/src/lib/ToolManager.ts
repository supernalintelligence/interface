/**
 * Tool Manager - Centralized system for tool execution and feedback
 * 
 * Tools auto-report execution → ToolManager listens → Updates UI
 */

import { setDefaultToolReporter, setGlobalToolReporter } from "@supernal/interface/browser";

export interface ToolExecutionResult {
  toolName: string;
  elementId?: string;
  actionType?: string;
  success: boolean;
  message: string;
  data?: unknown;
  error?: Error;
  timestamp: string;
}

type ToolExecutionListener = (result: ToolExecutionResult) => void;

class ToolManagerClass {
  private listeners: ToolExecutionListener[] = [];
  private lastReport: ToolExecutionResult | null = null;
  
  constructor() {
    // Register as the global reporter for HOC auto-reporting (ClickTool, ChangeTool, etc.)
    setGlobalToolReporter({
      reportExecution: (result) => {
        this.reportExecution({
          toolName: result.toolName,
          elementId: result.elementId,
          actionType: result.actionType,
          success: result.success,
          message: result.message,
          data: result.data
        });
      }
    });
    
    // Register as the default reporter for @Tool decorator auto-reporting
    setDefaultToolReporter((result) => {
      this.reportExecution({
        toolName: 'Tool',
        success: result.success,
        message: result.message || (result.error ? result.error.message : 'Tool executed'),
        data: result.data,
        error: result.error
      });
    });
  }
  
  /**
   * Subscribe to tool execution results
   */
  subscribe(listener: ToolExecutionListener): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Tools call this to report execution results (auto-called by HOCs)
   */
  reportExecution(result: Omit<ToolExecutionResult, 'timestamp'> | ToolExecutionResult) {
    const fullResult: ToolExecutionResult = {
      ...result,
      timestamp: (result as ToolExecutionResult).timestamp || new Date().toISOString()
    };
    
    // Store as last report for AIInterface to query
    this.lastReport = fullResult;
    
    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(fullResult);
      } catch {
        // Error in tool execution listener
      }
    });
  }
  
  /**
   * Get the last reported tool execution (for AIInterface)
   */
  getLastReport(): ToolExecutionResult | null {
    return this.lastReport;
  }
  
  /**
   * Clear the last report
   */
  clearLastReport() {
    this.lastReport = null;
  }
  
  /**
   * Helper to create a success result (for custom messages)
   */
  success(toolName: string, message: string, data?: unknown): ToolExecutionResult {
    return {
      toolName,
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Helper to create a failure result (for custom messages)
   */
  failure(toolName: string, message: string, data?: unknown): ToolExecutionResult {
    return {
      toolName,
      success: false,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }
}

// Singleton instance
export const ToolManager = new ToolManagerClass();

