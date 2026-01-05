/**
 * ToolExecutor - Universal execution engine for tools
 * 
 * Supports multiple execution strategies:
 * - Programmatic (direct method call)
 * - DOM-based (Playwright/browser automation)
 * - Navigation (route changes)
 */

import type { ToolMetadata } from '../decorators/Tool';

/**
 * Execution result
 */
export interface ExecutionResult {
  success: boolean;
  message: string;
  data?: any;
  error?: Error;
  timing?: number; // milliseconds
}

/**
 * Base interface for execution strategies
 */
export interface ExecutorStrategy {
  name: string;
  
  /**
   * Check if this strategy can execute the given tool
   */
  canExecute(tool: ToolMetadata): boolean;
  
  /**
   * Execute the tool with given parameters
   */
  execute(tool: ToolMetadata, parameters: any[]): Promise<ExecutionResult>;
}

/**
 * Main ToolExecutor orchestrator
 */
export class ToolExecutor {
  private strategies: ExecutorStrategy[] = [];
  
  constructor() {
    // Register default strategies (order matters - first match wins)
    this.registerStrategy(new ProgrammaticExecutor());
    this.registerStrategy(new NavigationExecutor());
    this.registerStrategy(new DOMExecutor());
  }
  
  /**
   * Register a new execution strategy
   */
  registerStrategy(strategy: ExecutorStrategy): void {
    this.strategies.push(strategy);
  }
  
  /**
   * Execute a tool using the appropriate strategy
   */
  async execute(tool: ToolMetadata, parameters: any[] = []): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    // Find first strategy that can execute this tool
    for (const strategy of this.strategies) {
      if (strategy.canExecute(tool)) {
        // console.log(`🔧 [ToolExecutor] Using strategy: ${strategy.name}`);
        try {
          const result = await strategy.execute(tool, parameters);
          result.timing = Date.now() - startTime;
          return result;
        } catch (error) {
          // console.error(`[ToolExecutor] Strategy ${strategy.name} failed:`, error);
          return {
            success: false,
            message: `Execution failed: ${error instanceof Error ? error.message : String(error)}`,
            error: error instanceof Error ? error : new Error(String(error)),
            timing: Date.now() - startTime
          };
        }
      }
    }
    
    // No strategy could execute
    return {
      success: false,
      message: `No execution strategy available for tool: ${tool.name}`,
      timing: Date.now() - startTime
    };
  }
}

/**
 * Programmatic execution - direct method calls
 */
class ProgrammaticExecutor implements ExecutorStrategy {
  name = 'programmatic';
  
  canExecute(tool: ToolMetadata): boolean {
    // Can execute if tool has instance and method name
    return !!(tool.instance && tool.methodName);
  }
  
  async execute(tool: ToolMetadata, parameters: any[]): Promise<ExecutionResult> {
    // console.log(`🎯 [Programmatic] Executing: ${tool.name}`, parameters);
    
    const result = await tool.instance[tool.methodName](...parameters);
      
      // Handle different return types
      if (typeof result === 'object' && result !== null) {
        if ('success' in result && 'message' in result) {
          // Already in ExecutionResult format
          return result as ExecutionResult;
        }
        
        // Convert to ExecutionResult
        return {
          success: true,
          message: result.message || `${tool.name} executed successfully`,
          data: result
        };
      }
      
      // Primitive return value
      return {
        success: true,
        message: `${tool.name} executed successfully`,
        data: result
      };
  }
}

/**
 * Navigation execution - route changes
 */
class NavigationExecutor implements ExecutorStrategy {
  name = 'navigation';
  
  canExecute(tool: ToolMetadata): boolean {
    // Check if tool is navigation-related
    const isNavCategory = tool.category === 'navigation';
    const hasNavKeywords = tool.name.toLowerCase().includes('navigate') ||
                          tool.name.toLowerCase().includes('go to') ||
                          tool.description?.toLowerCase().includes('navigate');
    
    return isNavCategory || hasNavKeywords;
  }
  
  async execute(tool: ToolMetadata, parameters: any[]): Promise<ExecutionResult> {
    // console.log(`🗺️  [Navigation] Executing: ${tool.name}`, parameters);
    
    // Use programmatic executor first (navigation tools typically have instance methods)
    if (tool.instance && tool.methodName) {
      const programmatic = new ProgrammaticExecutor();
      return programmatic.execute(tool, parameters);
    }
    
    // Fallback: try to extract route from tool metadata
    const route = (tool as any).route || tool.elementId;
    if (route) {
      // Get NavigationGraph singleton and use its handler
      const { NavigationGraph } = await import('../background/navigation/NavigationGraph');
      const graph = NavigationGraph.getInstance();
      
      // Use the public getRouteForContext method and the handler
      const handler = (graph as any).navigationHandler;
      if (handler) {
        await handler(route);
        return {
          success: true,
          message: `Navigated to ${tool.name}`
        };
      }
    }
    
    throw new Error('No navigation method available');
  }
}

/**
 * DOM execution - browser automation (Playwright, etc.)
 */
class DOMExecutor implements ExecutorStrategy {
  name = 'dom';
  
  canExecute(tool: ToolMetadata): boolean {
    // Can execute if tool has elementId (DOM target)
    return !!tool.elementId && !tool.instance;
  }
  
  async execute(tool: ToolMetadata, _parameters: any[]): Promise<ExecutionResult> {
    // console.log(`🌐 [DOM] Executing: ${tool.name}`, _parameters);
    
    // Find element in DOM
    const element = document.querySelector(`[data-testid="${tool.elementId}"]`);
    
    if (!element) {
      throw new Error(`Could not find element with data-testid="${tool.elementId}"`);
    }
    
    // Determine action type
    if (element.tagName === 'BUTTON' || element.tagName === 'A') {
      (element as HTMLElement).click();
      return {
        success: true,
        message: `Clicked ${tool.name}`
      };
    }
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (_parameters.length > 0) {
        (element as HTMLInputElement).value = String(_parameters[0]);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        return {
          success: true,
          message: `Entered text into ${tool.name}`
        };
      }
    }
    
    throw new Error(`Unsupported element type: ${element.tagName}`);
  }
}

