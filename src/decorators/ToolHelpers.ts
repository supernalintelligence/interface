/**
 * Tool HOC Helpers
 * 
 * Convenience wrappers around Tool() for common UI patterns.
 * These register tools immediately at module load time, not at render time.
 * 
 * NEW: Automatically reports execution via ToolManager if available
 */

import { ToolConfig } from './Tool';
import { ToolRegistry } from '../background/registry/ToolRegistry';
import * as React from 'react';
import { TreeBuilder } from '../background/navigation/RuntimeTreeBuilder'; // Used for module-load registration

/**
 * Auto-reporting interface - tools can report execution automatically
 */
export interface ToolExecutionReporter {
  reportExecution: (result: {
    toolName: string;
    elementId?: string;
    actionType?: string;
    success: boolean;
    message: string;
    data?: any;
  }) => void;
}

/**
 * Global reporter instance - set by application to enable auto-reporting
 */
let globalReporter: ToolExecutionReporter | null = null;

export function setGlobalToolReporter(reporter: ToolExecutionReporter | null) {
  globalReporter = reporter;
  console.log('🔧 [ToolHelpers] Global reporter set:', !!reporter);
}

/**
 * Helper to auto-report execution if reporter is available
 */
function autoReport(config: ToolConfig, message?: string, success: boolean = true, data?: any) {
  if (!globalReporter) {
    console.error('[ToolHelpers] No global reporter set - tool execution will not be tracked');
    return;
  }
  
  // Generate default message from elementId and actionType
  const defaultMessage = message || generateDefaultMessage(config.elementId || config.name || 'Tool', config.actionType || 'action');
  
  globalReporter.reportExecution({
    toolName: config.name || config.elementId || 'UnknownTool',
    elementId: config.elementId,
    actionType: config.actionType,
    success,
    message: defaultMessage,
    data
  });
}

/**
 * Generate human-readable message from elementId and actionType
 * Examples:
 * - 'open-main-menu' + 'click' -> 'Opened main menu'
 * - 'feature-toggle' + 'change' -> 'Toggled feature'
 */
function generateDefaultMessage(elementId: string, actionType?: string): string {
  // Convert kebab-case to words: 'open-main-menu' -> 'open main menu'
  const words = elementId.split('-').join(' ');
  
  // Action verb mapping
  const actionVerbs: Record<string, string> = {
    click: 'clicked',
    change: 'changed',
    type: 'entered text in',
    hover: 'hovered over',
    navigate: 'navigated to'
  };
  
  const verb = actionVerbs[actionType || 'click'] || actionType || 'interacted with';
  
  // Capitalize first letter
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Common tool config without actionType (will be set by specific HOCs)
 */
type BaseToolConfig = Omit<ToolConfig, 'actionType'>;

/**
 * Callbacks that HOCs inject into wrapped components
 */
export interface ToolCallbacks {
  reportSuccess?: (message?: string) => void;
  reportFailure?: (message?: string) => void;
}

/**
 * Base tool wrapper that all specific HOCs (ClickTool, ChangeTool, etc.) use
 * 
 * This is the core HOC that:
 * 1. Registers tools in ToolRegistry
 * 2. Tracks component hierarchy for NavigationGraph (runtime tree building)
 * 3. Injects reporting callbacks
 * 4. Handles auto-reporting if configured
 */
function BaseTool<P = any>(
  config: ToolConfig & { autoReport?: boolean; message?: string }
): (Component: React.ComponentType<P>) => React.ComponentType<P & ToolCallbacks> {
  return function(Component: React.ComponentType<P>): React.ComponentType<P & ToolCallbacks> {
    // Get component name - if anonymous, derive from elementId
    let componentName = Component.displayName || Component.name;
    
    if (!componentName || componentName === 'AnonymousComponent' || componentName === '') {
      // Derive name from elementId: 'open-main-menu' -> 'OpenMainMenu'
      if (config.elementId) {
        componentName = config.elementId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
      } else {
        componentName = 'UnnamedComponent';
      }
    }
    
    // Create tool metadata
    const toolMetadata = {
      methodName: componentName,
      name: config.name || componentName,
      description: config.description || `${componentName} component`,
      category: config.category || 'ui-interaction',
      inputSchema: config.inputSchema || {},
      outputSchema: config.outputSchema || {},
      returnType: config.returnType || 'json' as const,
      supportsStreaming: config.supportsStreaming || false,
      tags: config.tags || [],
      keywords: config.keywords || [],
      useCases: config.useCases || [],
      permissions: config.permissions || {},
      frequency: config.frequency || 'medium' as const,
      complexity: config.complexity || 'simple' as const,
      toolId: config.toolId || `${componentName}-tool`,
      elementId: config.elementId,
      selector: config.selector,
      containerId: config.containerId,
      callbacks: config.callbacks,
      providerName: config.providerName || 'UIComponents',
      isStandalone: true,
      examples: config.examples || [],
      aiDescription: config.aiDescription || config.description || `${componentName} component`,
      executionContext: config.executionContext || 'ui' as const,
      mockData: config.mockData,
      toolType: config.toolType || 'ai-safe' as const,
      aiEnabled: config.aiEnabled ?? true,
      dangerLevel: config.dangerLevel || 'safe' as const,
      requiresApproval: config.requiresApproval || false,
      generateSimulation: config.generateSimulation ?? true,
      generateStories: config.generateStories ?? true,
      elementType: config.elementType,
      actionType: config.actionType,
      origin: config.origin,
      testId: config.testId,
      uiSelector: config.uiSelector,
    };
    
    // Register tool immediately at module load time
    console.log(`🔧 [ToolHelpers] Registering tool: ${componentName} (elementId: ${toolMetadata.elementId})`);
    
    ToolRegistry.registerTool(
      toolMetadata.providerName!,
      componentName,
      toolMetadata as any
    );
    
    console.log(`✅ [ToolHelpers] Registered ${componentName}. Total tools: ${ToolRegistry.getAllTools().size}`);
    
    // Register tool → component mapping at module load
    // Pass containerId if specified to override stack-based inference
    if (config.elementId) {
      TreeBuilder.registerTool(config.elementId, componentName, config.containerId);
    }
    
    // Create wrapper component with callbacks (no hooks - keeping it simple)
    function ToolWrapper(props: P) {
      const reportSuccess = (message?: string) => {
        if (config.autoReport) {
          autoReport(config, message || config.message, true);
        }
      };
      
      const reportFailure = (message?: string) => {
        if (config.autoReport) {
          autoReport(config, message || 'Operation failed', false);
        }
      };
      
      const propsWithCallbacks = { 
        ...props, 
        reportSuccess, 
        reportFailure 
      } as P & ToolCallbacks;
      
      return React.createElement(Component as any, propsWithCallbacks);
    }
    
    ToolWrapper.displayName = `Tool(${componentName})`;
    (ToolWrapper as any).__toolMetadata__ = toolMetadata;
    
    return ToolWrapper as React.ComponentType<P & ToolCallbacks>;
  };
}

/**
 * ClickTool - For buttons, links, clickable elements
 * Automatically sets actionType: 'click'
 */
export function ClickTool(config: BaseToolConfig & { autoReport?: boolean; message?: string }) {
  return BaseTool({
    ...config,
    actionType: 'click' as const,
    autoReport: config.autoReport ?? true
  });
}

/**
 * ChangeTool - For inputs, selects, textareas
 * Automatically sets actionType: 'change'
 */
export function ChangeTool(config: BaseToolConfig & { autoReport?: boolean; message?: string }) {
  return BaseTool({
    ...config,
    actionType: 'change' as const,
    autoReport: config.autoReport ?? true
  });
}

/**
 * TypeTool - For text inputs where typing is the primary action
 * Automatically sets actionType: 'type'
 */
export function TypeTool(config: BaseToolConfig) {
  return BaseTool({
    ...config,
    actionType: 'type' as const
  });
}

/**
 * HoverTool - For elements with hover interactions
 * Automatically sets actionType: 'hover'
 */
export function HoverTool(config: BaseToolConfig) {
  return BaseTool({
    ...config,
    actionType: 'hover' as const
  });
}

/**
 * MultiActionTool - For components that support multiple interaction types
 */
export function MultiActionTool(
  config: BaseToolConfig & { actionTypes: Array<'click' | 'type' | 'change' | 'hover' | 'select' | 'scroll' | 'navigate'> }
) {
  const { actionTypes, ...restConfig } = config;
  return BaseTool({
    ...restConfig,
    actionType: actionTypes[0] as any // Use first action type as primary
  });
}

/**
 * FormTool - For form elements that can be submitted
 * Automatically sets actionType: 'click' (forms are typically submitted via button click)
 */
export function FormTool(config: BaseToolConfig) {
  return BaseTool({
    ...config,
    actionType: 'click' as const
  });
}

