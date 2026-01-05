/**
 * Supernal AI Interface - Enhanced Tool Decorator System
 *
 * Provides comprehensive tool registration with AI safety controls and universal capabilities.
 * Automatically generates tool schemas with AI control vs testing distinction.
 */

import { ToolRegistry } from '../background/registry/ToolRegistry';
import {
  ToolCategory,
  ToolFrequency,
  ToolComplexity,
} from '../types';
// RuntimeGraphTracker is part of enterprise edition
// import { RuntimeGraphTracker } from '../ui/react/graph/RuntimeGraphTracker';
const DEBUG = false;
if (DEBUG) console.log('Logging for Tool is:', DEBUG);

export interface ToolConfig {
  // Core tool fields
  name?: string;
  description?: string;
  category?: ToolCategory;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  returnType?: 'markdown' | 'json';
  supportsStreaming?: boolean;
  tags?: string[];
  keywords?: string[];
  useCases?: string[];
  permissions?: {
    level?: string;
    sensitiveDataAccess?: boolean;
    networkAccess?: boolean;
    requiredScopes?: string[];
  };
  frequency?: ToolFrequency;
  complexity?: ToolComplexity;

  // IMPROVED: Better naming conventions (replaces testId)
  toolId?: string; // Unique tool identifier (primary)
  elementId?: string; // DOM element ID (for UI tools)
  selector?: string; // CSS selector (for UI tools)
  
  // NEW: Container/modal context
  containerId?: string; // Container/modal this tool operates within

  // For standalone functions (when no class context)
  providerName?: string; // Provider name for standalone functions

  // AI Interface enhancements
  examples?: string[]; // Natural language examples
  aiDescription?: string; // AI-optimized description
  executionContext?: 'ui' | 'api' | 'both'; // Where this tool runs
  mockData?: any; // Mock data for testing

  // AI Control vs Testing distinction - SAFE DEFAULTS
  toolType?: 'test-only' | 'ai-safe' | 'ai-restricted' | 'ai-dangerous';
  aiEnabled?: boolean; // Default: false (test-only)
  requiresApproval?: boolean; // Requires human approval before AI execution
  dangerLevel?: 'safe' | 'moderate' | 'dangerous' | 'destructive';

  // Testing integration
  generateSimulation?: boolean; // Auto-generate simulation methods
  generateStories?: boolean; // Auto-generate test stories
  elementType?: 'button' | 'input' | 'select' | 'textarea' | 'link' | 'div';
  actionType?: 'click' | 'change' | 'type' | 'select' | 'navigate' | 'hover' | 'scroll';
  
  // NEW: Callback support
  callbacks?: {
    storage?: boolean;      // Supports Component Memory callbacks
    validation?: boolean;   // Supports validation callbacks
    navigation?: boolean;   // Supports navigation callbacks
    lifecycle?: boolean;    // Supports lifecycle callbacks
  };

  // Origin tracking (where tool is available)
  origin?: {
    path?: string; // UI path where tool is available
    elements?: string[]; // CSS selectors where tool works
    modal?: string; // Modal/dialog context
  };

  // Legacy fields
  testId?: string; // @deprecated - use toolId instead
  uiSelector?: string; // @deprecated - use selector instead
  
  /**
   * Optional lifecycle callback - invoked after tool execution
   * If not provided, a default callback will auto-generate a message from elementId + actionType
   */
  onExecute?: (result: { success: boolean; message?: string; data?: any; error?: Error }) => void;
  
  /**
   * Enable/disable auto-reporting (default: true if elementId is provided)
   */
  autoReport?: boolean;
}

/**
 * Shorthand configuration for @Tool decorator
 * Only requires the fields that CANNOT be inferred
 */
export interface ToolShorthandConfig {
  /** Natural language examples for AI matching (REQUIRED) */
  examples: string[];
  
  /** Override inferred name (optional) */
  name?: string;
  
  /** Override inferred danger level (optional) */
  dangerLevel?: 'safe' | 'moderate' | 'dangerous' | 'destructive';
  
  /** Override AI enablement (optional, defaults to inferred from toolType) */
  aiEnabled?: boolean;
  
  /** Override inferred container (optional, inherits from @ToolProvider) */
  containerId?: string;
  
  /** State storage callbacks (optional) */
  callbacks?: {
    storage?: boolean;
    validation?: boolean;
    navigation?: boolean;
    lifecycle?: boolean;
  };
}

export interface ToolMetadata {
  // Core tool fields
  methodName: string;
  name: string;
  description: string;
  category: ToolCategory;
  inputSchema: any;
  outputSchema: any;
  returnType: 'markdown' | 'json';
  supportsStreaming: boolean;
  tags: string[];
  keywords: string[];
  useCases: string[];
  permissions: any;
  frequency: ToolFrequency;
  complexity: ToolComplexity;

  // IMPROVED: Better identifiers
  toolId: string; // Primary tool identifier
  elementId?: string; // DOM element ID
  selector?: string; // CSS selector
  
  // NEW: Container/modal context
  containerId?: string; // Container/modal this tool operates within
  
  // NEW: Component namespace support
  componentName?: string; // Component this tool belongs to (for namespacing)
  stateful?: boolean; // Whether this component is stateful
  
  // NEW: Callback capabilities
  callbacks?: {
    storage?: boolean;
    validation?: boolean;
    navigation?: boolean;
    lifecycle?: boolean;
  };

  // Provider information (supports standalone functions)
  providerClass?: string; // Class name (for class methods)
  providerName?: string; // Provider name (for standalone functions)
  isStandalone: boolean; // Whether this is a standalone function

  // AI Interface enhancements
  examples: string[];
  aiDescription: string;
  executionContext: 'ui' | 'api' | 'both';
  mockData?: any;

  // AI Control vs Testing distinction
  toolType: 'test-only' | 'ai-safe' | 'ai-restricted' | 'ai-dangerous';
  aiEnabled: boolean;
  requiresApproval: boolean;
  dangerLevel: 'safe' | 'moderate' | 'dangerous' | 'destructive';

  // Testing integration
  generateSimulation: boolean;
  generateStories: boolean;
  elementType?: 'button' | 'input' | 'select' | 'textarea' | 'link' | 'div';
  actionType?: 'click' | 'change' | 'type' | 'select' | 'navigate' | 'hover' | 'scroll';

  // Origin tracking
  origin?: {
    path?: string;
    elements?: string[];
    modal?: string;
  };
  
  // NEW: Runtime execution support
  method?: Function; // Reference to the actual method
  instance?: any;    // Class instance that owns the method

  // Legacy fields
  testId?: string; // @deprecated - use toolId
  uiSelector?: string; // @deprecated - use selector
  
  /**
   * Optional lifecycle callback - invoked after tool execution
   */
  onExecute?: (result: { success: boolean; message?: string; data?: any; error?: Error }) => void;
  
  /**
   * Enable/disable auto-reporting (default: true if elementId is provided)
   */
  autoReport?: boolean;
}

// Note: All tools (class methods and standalone functions) are registered in the unified ToolRegistry

/**
 * Convert shorthand to full ToolConfig
 * Applies smart defaults and inheritance
 */
function normalizeShorthand(
  elementId: string,
  options?: ToolShorthandConfig
): ToolConfig {
  return {
    // REQUIRED: elementId (provided explicitly)
    elementId: elementId,
    toolId: elementId, // Default: same as elementId
    
    // REQUIRED: examples (must be provided in shorthand)
    examples: options?.examples || [],
    
    // OPTIONAL OVERRIDES: Use if provided, otherwise undefined (will be inferred)
    name: options?.name,
    dangerLevel: options?.dangerLevel,
    aiEnabled: options?.aiEnabled,
    containerId: options?.containerId,
    callbacks: options?.callbacks,
    
    // Everything else will be inferred by existing logic:
    // - category: inferred from method name
    // - description: inferred from method name
    // - toolType: inferred from method name
    // - actionType: inferred from method name
    // - elementType: inferred from method name
    // - requiresApproval: inferred from dangerLevel
  };
}

/**
 * Tool decorator - supports both class methods and standalone functions
 *
 * Since JSDoc extraction at runtime is impossible (comments are stripped during compilation),
 * this decorator relies on method name inference and explicit configuration.
 *
 * @example Shorthand syntax (recommended) - for class methods
 * ```typescript
 * @ToolProvider('MyContainer')
 * class MyTools {
 *   @Tool('my-button', { examples: ['click button'] })
 *   async clickButton() { }
 * }
 * ```
 * 
 * @example Full config syntax (backward compatible) - for standalone functions
 * ```typescript
 * const myTool = Tool({
 *   elementId: 'my-button',
 *   containerId: 'MyContainer',
 *   examples: ['click button'],
 * })(async () => { });
 * ```
 * 
 * @param configOrElementId Full config object or elementId string for shorthand
 * @param options Optional shorthand config (when first param is string)
 */
// Type-safe overloads
// Shorthand for class methods
// eslint-disable-next-line no-redeclare
export function Tool(elementId: string, options?: ToolShorthandConfig): MethodDecorator;
// Full config - can be used as method decorator or function wrapper
// eslint-disable-next-line no-redeclare
export function Tool(config: ToolConfig): any; // Must use 'any' to support both decorator and wrapper usage
// Implementation
// eslint-disable-next-line no-redeclare
export function Tool(
  configOrElementId: ToolConfig | string,
  options?: ToolShorthandConfig
): any {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    // Normalize to ToolConfig
    const config: ToolConfig = typeof configOrElementId === 'string'
      ? normalizeShorthand(configOrElementId, options)
      : configOrElementId;
    
    // Handle standalone function case (when used as Tool(config)(func))
    if (typeof target === 'function' && !propertyKey) {
      return decorateStandaloneFunction(target, config);
    }
    
    // Handle class method case
    if (propertyKey && descriptor) {
      return decorateClassMethod(target, propertyKey, descriptor, config);
    }
    
    throw new Error('Tool decorator can only be applied to class methods or standalone functions');
  };
}

/**
 * Decorate a standalone function
 */
function decorateStandaloneFunction(func: Function, config: ToolConfig) {
  const functionName = func.name || 'anonymous';
  const providerName = config.providerName || 'StandaloneFunctions';
  
  // Use functionName for toolId (never use config.name which might have spaces)
  const uniqueFunctionId = functionName;

  const toolMetadata: ToolMetadata = {
    methodName: functionName,
    name: config.name || formatMethodName(functionName),
    description: config.description || formatMethodName(functionName),
    category: config.category || inferCategoryFromMethodName(functionName),
    inputSchema: config.inputSchema || generateBasicInputSchema(),
    outputSchema: config.outputSchema || generateBasicOutputSchema(),
    returnType: config.returnType || 'json',
    supportsStreaming: config.supportsStreaming || false,
    tags: config.tags || [providerName.toLowerCase()],
    keywords: config.keywords || [functionName],
    useCases: config.useCases || generateUseCases(functionName),
    permissions: config.permissions || inferPermissions(functionName),
    frequency: config.frequency || inferFrequency(functionName),
    complexity: config.complexity || ToolComplexity.SIMPLE,

    // IMPROVED: Better identifiers
    toolId: config.toolId || generateToolId(providerName, functionName),
    elementId: config.elementId,
    selector: config.selector,
    
    // NEW: Container/modal context
    containerId: config.containerId,
    
    // NEW: Callback capabilities
    callbacks: config.callbacks,

    // Provider information
    providerName: providerName,
    isStandalone: true,

    // AI Interface enhancements
    examples: config.examples || generateNaturalLanguageExamples(functionName),
    aiDescription: config.aiDescription || generateAIDescription(functionName, config.description),
    executionContext: config.executionContext || inferExecutionContext(functionName),
    mockData: config.mockData,

    // AI Control vs Testing distinction - SAFE DEFAULTS
    toolType: config.toolType || inferToolType(functionName),
    aiEnabled: config.aiEnabled || false,
    dangerLevel: config.dangerLevel || inferDangerLevel(functionName),
    requiresApproval:
      config.requiresApproval || shouldRequireApproval(functionName, config.dangerLevel),

    // Testing integration
    generateSimulation: config.generateSimulation ?? true,
    generateStories: config.generateStories ?? true,
    elementType: config.elementType || inferElementType(functionName),
    actionType: config.actionType || inferActionType(functionName),

    // Origin tracking
    origin: config.origin,

    // Legacy fields
    testId: config.testId || config.toolId || generateToolId(providerName, functionName),
    uiSelector: config.uiSelector || config.selector,
  };

  // Store the function reference so it can be executed
  toolMetadata.method = func;

  // Register with ToolRegistry - use unique ID
  try {
    ToolRegistry.registerTool(providerName, uniqueFunctionId, toolMetadata);
  } catch (error) {
    console.error('Failed to register tool:', toolMetadata.name, error);
  }

  DEBUG &&
    console.log(`[Tool] Registered function: ${toolMetadata.name} (${toolMetadata.category})`);

  // Return a wrapped function that preserves the original's return value
  // This ensures the function's return value is properly propagated to callers
  const wrappedFunction = async function(this: any, ...args: any[]) {
    const result = await func.apply(this, args);
    return result;
  };
  
  // Attach metadata to the wrapped function
  (wrappedFunction as any).__toolMetadata__ = toolMetadata;
  
  // Preserve the original function name for debugging
  Object.defineProperty(wrappedFunction, 'name', {
    value: functionName,
    writable: false
  });
  
  return wrappedFunction as any;
}

/**
 * Decorate a class method
 */
function decorateClassMethod(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
  config: ToolConfig
) {
  // Ensure propertyKey is a string for processing
  const methodName = typeof propertyKey === 'string' ? propertyKey : String(propertyKey);
  
  // In legacy decorators, target is the class prototype, so we can get the class name directly
  const className = target.constructor.name || 'UnknownClass';
  
  // Store original method
  const originalMethod = descriptor.value;
  
  // Generate and register the tool metadata
  const toolMetadata: ToolMetadata = generateToolMetadata(className, methodName, config, target);
  
  // Store method reference
  toolMetadata.method = originalMethod;
  toolMetadata.onExecute = config.onExecute;
  toolMetadata.autoReport = config.autoReport !== false; // Default to true
  
  // Wrap method to capture instance, invoke onExecute callback, and track execution
  descriptor.value = async function(this: any, ...args: any[]) {
    const startTime = Date.now();
    // RuntimeGraphTracker removed - enterprise edition feature
    // const tracker = RuntimeGraphTracker.getInstance();
    
    // Always update instance reference (in case it was created after registration)
    toolMetadata.instance = this;
    
    try {
      // Execute the original method
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - startTime;
      
      // Track successful execution (enterprise feature - removed in open source)
      // tracker.trackExecution({...}); // Enterprise feature
      // Full execution tracking available at https://supernal.ai/enterprise
      
      // Auto-report if enabled
      if (toolMetadata.autoReport && toolMetadata.elementId) {
        const callback = config.onExecute || getDefaultReporter();
        
        if (callback) {
          // Generate default message from elementId + actionType if not provided
          const defaultMessage = generateDefaultMessage(
            toolMetadata.elementId,
            toolMetadata.actionType
          );
          
          callback({
            success: true,
            message: result?.message || defaultMessage,
            data: result
          });
        }
      } else if (config.onExecute) {
        // Custom callback without auto-report
        config.onExecute({
          success: true,
          message: result?.message,
          data: result
        });
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Track failed execution (enterprise feature - removed in open source)
      // tracker.trackExecution({...}); // Enterprise feature
      // Full execution tracking available at https://supernal.ai/enterprise
      
      // Report error if auto-reporting enabled
      const callback = config.onExecute || (toolMetadata.autoReport && toolMetadata.elementId ? getDefaultReporter() : null);
      
      if (callback) {
        callback({
          success: false,
          error: error as Error
        });
      }
      throw error;
    }
  };
  
  // Mark descriptor.value with a special property so we can find and update instance later
  (descriptor.value as any).__toolMetadata__ = toolMetadata;
  
  // Register with ToolRegistry
  try {
    const { ToolRegistry } = require('../background/registry/ToolRegistry');
    ToolRegistry.registerTool(className, methodName, toolMetadata);
  } catch (error) {
    console.error('Failed to register tool:', error);
  }

  DEBUG && console.log(`[Tool] Registered tool: ${toolMetadata.name} (${toolMetadata.category})`);
  
  // Also register on the class prototype for direct access
  if (!target.__tools__) {
    target.__tools__ = [];
  }
  target.__tools__.push(toolMetadata);
  
  return descriptor;
}

// Helper function to generate tool metadata
function generateToolMetadata(className: string, methodName: string, config: ToolConfig, target: any): ToolMetadata {
  // Read parent @ToolProvider config for inheritance
  // In legacy decorators, target is the prototype, so we need to access the constructor
  const providerConfig = target.constructor?.__toolProvider__?.config;
  
  return {
    // Core fields
    methodName: methodName,
    name: config.name || formatMethodName(methodName),
    description: config.description || formatMethodName(methodName),
    category: config.category || inferCategoryFromMethodName(methodName),
    inputSchema: config.inputSchema || generateBasicInputSchema(),
    outputSchema: config.outputSchema || generateBasicOutputSchema(),
    returnType: config.returnType || 'json',
    supportsStreaming: config.supportsStreaming || false,
    tags: config.tags || [className.toLowerCase().replace('manager', '')],
    keywords: config.keywords || [methodName],
    useCases: config.useCases || generateUseCases(methodName),
    permissions: config.permissions || inferPermissions(methodName),
    frequency: config.frequency || inferFrequency(methodName),
    complexity: config.complexity || ToolComplexity.SIMPLE,

    // Identifiers
    toolId: config.toolId || generateToolId(className, methodName),
    elementId: config.elementId,
    selector: config.selector,
    
    // NEW: Container/modal context (with inheritance)
    containerId: config.containerId || providerConfig?.containerId,
    
    // NEW: Callback capabilities
    callbacks: config.callbacks,

    // Provider information
    providerClass: className,
    isStandalone: false,

    // AI Interface enhancements
    examples: config.examples || generateNaturalLanguageExamples(methodName),
    aiDescription: config.aiDescription || generateAIDescription(methodName, config.description),
    executionContext: config.executionContext || inferExecutionContext(methodName),
    mockData: config.mockData,

    // AI Control vs Testing distinction (with smart defaults)
    toolType: config.toolType || inferToolType(methodName),
    aiEnabled: config.aiEnabled ?? providerConfig?.aiEnabled ?? inferAIEnabled(methodName),
    dangerLevel: config.dangerLevel || inferDangerLevel(methodName),
    requiresApproval:
      config.requiresApproval || shouldRequireApproval(methodName, config.dangerLevel),

    // Testing integration
    generateSimulation: config.generateSimulation ?? true,
    generateStories: config.generateStories ?? true,
    elementType: config.elementType || inferElementType(methodName),
    actionType: config.actionType || inferActionType(methodName),

    // Origin tracking
    origin: config.origin,
  };
}

/**
 * Generate basic input schema (since we can't extract from JSDoc at runtime)
 */
function generateBasicInputSchema(): any {
  return {
    type: 'object',
    properties: {},
    required: [],
  };
}

/**
 * Generate basic output schema (since we can't extract from JSDoc at runtime)
 */
function generateBasicOutputSchema(): any {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      data: { type: 'object' },
    },
  };
}

/**
 * Infer tool category from method name
 */
function inferCategoryFromMethodName(methodName: string | symbol): ToolCategory {
  const name = String(methodName).toLowerCase();

  // User interaction patterns
  if (name.startsWith('click') || name.startsWith('press') || name.startsWith('tap') ||
      name.includes('button') || name.includes('link')) {
    return ToolCategory.USER_INTERACTION;
  }

  if (name.startsWith('create') || name.startsWith('add') || name.startsWith('insert')) {
    return ToolCategory.DATA;
  }
  if (
    name.startsWith('read') ||
    name.startsWith('get') ||
    name.startsWith('fetch') ||
    name.startsWith('load')
  ) {
    return ToolCategory.DATA;
  }
  if (
    name.startsWith('update') ||
    name.startsWith('modify') ||
    name.startsWith('edit') ||
    name.startsWith('change')
  ) {
    return ToolCategory.DATA;
  }
  if (name.startsWith('delete') || name.startsWith('remove') || name.startsWith('destroy')) {
    return ToolCategory.DATA;
  }
  if (
    name.startsWith('list') ||
    name.startsWith('find') ||
    name.startsWith('search') ||
    name.startsWith('query')
  ) {
    return ToolCategory.SEARCH;
  }
  if (name.includes('sync') || name.includes('cloud') || name.includes('backup')) {
    return ToolCategory.SYSTEM;
  }

  return ToolCategory.UTILITY;
}

/**
 * Generate keywords from method name
 */
function generateKeywords(methodName: string | symbol): string[] {
  return [String(methodName)];
}

/**
 * Generate use cases from method name
 */
function generateUseCases(methodName: string | symbol): string[] {
  const useCases = [];
  const name = String(methodName).toLowerCase();

  // Add common use cases based on method name
  if (name.startsWith('create')) useCases.push('Create new entity');
  if (name.startsWith('get') || name.startsWith('read')) useCases.push('Retrieve data');
  if (name.startsWith('list') || name.startsWith('find')) useCases.push('Browse and search');
  if (name.startsWith('update')) useCases.push('Modify existing data');
  if (name.startsWith('delete')) useCases.push('Remove data');

  return useCases.length > 0 ? useCases : ['General operation'];
}

/**
 * Infer permissions from method name
 */
function inferPermissions(methodName: string | symbol): any {
  const name = String(methodName).toLowerCase();

  if (name.startsWith('delete') || name.startsWith('remove')) {
    return {
      level: 'approve_once',
      sensitiveDataAccess: true,
      networkAccess: false,
      requiredScopes: [],
    };
  }

  if (name.startsWith('create') || name.startsWith('update')) {
    return {
      level: 'approve_once',
      sensitiveDataAccess: false,
      networkAccess: false,
      requiredScopes: [],
    };
  }

  return {
    level: 'auto_approve',
    sensitiveDataAccess: false,
    networkAccess: false,
    requiredScopes: [],
  };
}

/**
 * Infer frequency from method name
 */
function inferFrequency(methodName: string | symbol): ToolFrequency {
  const name = String(methodName).toLowerCase();

  if (name.startsWith('get') || name.startsWith('read') || name.startsWith('list')) {
    return ToolFrequency.VERY_HIGH;
  }
  if (name.startsWith('create') || name.startsWith('add')) {
    return ToolFrequency.HIGH;
  }
  if (name.startsWith('update') || name.startsWith('modify')) {
    return ToolFrequency.MEDIUM;
  }
  if (name.startsWith('delete') || name.startsWith('sync')) {
    return ToolFrequency.LOW;
  }

  return ToolFrequency.MEDIUM;
}

/**
 * Format method name for display
 */
function formatMethodName(methodName: string | symbol): string {
  // Handle symbol or non-string inputs
  if (typeof methodName !== 'string') {
    return String(methodName);
  }

  // Convert camelCase to Title Case
  return methodName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// NEW: AI Interface helper functions

function generateToolId(providerName: string, methodName: string): string {
  return `${providerName.toLowerCase()}-${methodName.toLowerCase()}`;
}

function generateNaturalLanguageExamples(methodName: string): string[] {
  const examples = [];
  const name = methodName.toLowerCase();

  if (name.includes('get') || name.includes('fetch') || name.includes('load')) {
    examples.push('get this', 'fetch it', 'load the data');
  }

  if (name.includes('create') || name.includes('add')) {
    examples.push('create new', 'add this', 'make a new one');
  }

  if (name.includes('update') || name.includes('modify') || name.includes('edit')) {
    examples.push('update this', 'modify it', 'change the data');
  }

  if (name.includes('search') || name.includes('find')) {
    examples.push('search for', 'find this', 'look up');
  }

  if (name.startsWith('delete') || name.startsWith('remove')) {
    examples.push('delete this', 'remove it', 'get rid of it');
  }

  return examples.length > 0 ? examples : [`execute ${formatMethodName(methodName)}`];
}

function generateAIDescription(methodName: string, description?: string): string {
  const baseDesc = description || formatMethodName(methodName);
  const name = methodName.toLowerCase();

  let aiDesc = baseDesc;

  if (name.includes('navigate')) {
    aiDesc += '. This changes the current page or view.';
  }

  if (name.startsWith('approve')) {
    aiDesc += '. This action updates the status to approved.';
  }

  if (name.startsWith('delete') || name.startsWith('remove')) {
    aiDesc += '. This is a destructive action that cannot be undone.';
  }

  if (name.startsWith('search') || name.startsWith('find')) {
    aiDesc += '. Returns matching results based on search criteria.';
  }

  return aiDesc;
}

function inferExecutionContext(methodName: string): 'ui' | 'api' | 'both' {
  const name = methodName.toLowerCase();

  if (name.includes('navigate') || name.includes('click') || name.includes('type')) {
    return 'ui';
  }

  if (
    name.includes('create') ||
    name.includes('update') ||
    name.includes('delete') ||
    name.includes('fetch')
  ) {
    return 'api';
  }

  return 'both';
}

function inferToolType(
  methodName: string
): 'test-only' | 'ai-safe' | 'ai-restricted' | 'ai-dangerous' {
  const name = methodName.toLowerCase();

  // Dangerous operations - test-only by default
  if (name.includes('delete') || name.includes('remove') || name.includes('destroy')) {
    return 'ai-dangerous';
  }

  // Restricted operations - require explicit enabling
  if (
    name.includes('create') ||
    name.includes('update') ||
    name.includes('modify') ||
    name.includes('approve') ||
    name.includes('reject') ||
    name.includes('assign')
  ) {
    return 'ai-restricted';
  }

  // Safe operations - can be AI-enabled  
  if (
    name.includes('get') ||
    name.includes('fetch') ||
    name.includes('search') ||
    name.includes('find') ||
    name.includes('list') ||
    name.includes('view') ||
    name.includes('navigate') ||
    name.includes('show') ||
    name.includes('click') ||
    name.includes('toggle') ||
    name.includes('increment') ||
    name.includes('decrement') ||
    name.includes('select') ||
    name.includes('open') ||
    name.includes('close')
  ) {
    return 'ai-safe';
  }

  // Default: ai-safe for UI interactions (changed from test-only)
  return 'ai-safe';
}

function inferDangerLevel(methodName: string): 'safe' | 'moderate' | 'dangerous' | 'destructive' {
  const name = methodName.toLowerCase();

  // Destructive operations
  if (
    name.includes('delete') ||
    name.includes('remove') ||
    name.includes('destroy') ||
    name.includes('purge') ||
    name.includes('wipe')
  ) {
    return 'destructive';
  }

  // Dangerous operations
  if (
    name.includes('approve') ||
    name.includes('reject') ||
    name.includes('ban') ||
    name.includes('suspend') ||
    name.includes('disable')
  ) {
    return 'dangerous';
  }

  // Moderate operations
  if (
    name.includes('create') ||
    name.includes('update') ||
    name.includes('modify') ||
    name.includes('assign') ||
    name.includes('change')
  ) {
    return 'moderate';
  }

  // Safe operations (read-only, navigation)
  return 'safe';
}

function shouldRequireApproval(
  methodName: string,
  dangerLevel?: 'safe' | 'moderate' | 'dangerous' | 'destructive'
): boolean {
  const level = dangerLevel || inferDangerLevel(methodName);

  // Always require approval for dangerous/destructive operations
  if (level === 'dangerous' || level === 'destructive') {
    return true;
  }

  // Require approval for certain moderate operations
  if (level === 'moderate') {
    const name = methodName.toLowerCase();
    if (name.includes('approve') || name.includes('reject') || name.includes('assign')) {
      return true;
    }
  }

  return false;
}

/**
 * Infer element type from method name (for testing integration)
 */
function inferElementType(
  methodName: string
): 'button' | 'input' | 'select' | 'textarea' | 'link' | 'div' | undefined {
  const lowerName = methodName.toLowerCase();

  // Button patterns
  if (lowerName.includes('click') || lowerName.includes('button') || lowerName.includes('submit')) {
    return 'button';
  }

  // Input patterns
  if (lowerName.includes('type') || lowerName.includes('input') || lowerName.includes('enter')) {
    return 'input';
  }

  // Select patterns
  if (
    lowerName.includes('select') ||
    lowerName.includes('choose') ||
    lowerName.includes('dropdown')
  ) {
    return 'select';
  }

  // Textarea patterns
  if (
    lowerName.includes('textarea') ||
    lowerName.includes('message') ||
    lowerName.includes('comment')
  ) {
    return 'textarea';
  }

  // Link patterns
  if (lowerName.includes('navigate') || lowerName.includes('link') || lowerName.includes('goto')) {
    return 'link';
  }

  // Default to div for generic interactions
  return 'div';
}

/**
 * Infer action type from method name (for testing integration)
 */
function inferActionType(
  methodName: string
): 'click' | 'type' | 'select' | 'navigate' | 'hover' | 'scroll' | undefined {
  const lowerName = methodName.toLowerCase();

  // Click actions
  if (lowerName.includes('click') || lowerName.includes('press') || lowerName.includes('tap')) {
    return 'click';
  }

  // Type actions
  if (lowerName.includes('type') || lowerName.includes('enter') || lowerName.includes('input')) {
    return 'type';
  }

  // Select actions
  if (lowerName.includes('select') || lowerName.includes('choose') || lowerName.includes('pick')) {
    return 'select';
  }

  // Navigate actions
  if (lowerName.includes('navigate') || lowerName.includes('goto') || lowerName.includes('open')) {
    return 'navigate';
  }

  // Hover actions
  if (lowerName.includes('hover') || lowerName.includes('mouseover')) {
    return 'hover';
  }

  // Scroll actions
  if (lowerName.includes('scroll') || lowerName.includes('swipe')) {
    return 'scroll';
  }

  // Default to click for most interactions
  return 'click';
}

/**
 * Global default reporter - can be set by application (e.g., ToolManager)
 */
let globalDefaultReporter: ((result: { success: boolean; message?: string; data?: any; error?: Error }) => void) | null = null;

export function setDefaultToolReporter(reporter: typeof globalDefaultReporter) {
  globalDefaultReporter = reporter;
}

function getDefaultReporter() {
  return globalDefaultReporter;
}

/**
 * Infer default aiEnabled from inferred toolType
 * - ai-safe → true
 * - ai-restricted → false (require explicit enabling)
 * - ai-dangerous → false (require explicit enabling)
 * - test-only → false
 */
function inferAIEnabled(methodName: string): boolean {
  const toolType = inferToolType(methodName);
  return toolType === 'ai-safe';
}

/**
 * Generate human-readable message from elementId and actionType
 * Examples:
 * - 'open-main-menu' + 'click' -> 'Open main menu'
 * - 'feature-toggle' + 'change' -> 'Feature toggle changed'
 */
function generateDefaultMessage(elementId?: string, actionType?: string): string {
  if (!elementId) return 'Tool executed';
  
  // Convert kebab-case to words: 'open-main-menu' -> 'Open main menu'
  const words = elementId.split('-')
    .map((word, i) => i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word)
    .join(' ');
  
  // Add action context if available
  if (actionType && actionType !== 'click') {
    return `${words} ${actionType}d`;
  }
  
  return words;
}

/**
 * Get all tools (both class methods and standalone functions)
 * @deprecated Use ToolRegistry.getAllTools() instead
 */
export function getStandaloneTools(): ToolMetadata[] {
  try {
    const { ToolRegistry } = require('../background/registry/ToolRegistry');
    return ToolRegistry.getAllTools().filter((tool: ToolMetadata) => tool.isStandalone);
  } catch (error) {
    console.error('Failed to get tools from registry:', error);
    return [];
  }
}

/**
 * Get tool by ID (works for both class methods and standalone functions)
 * @deprecated Use ToolRegistry.getTool() instead
 */
export function getStandaloneTool(toolId: string): ToolMetadata | undefined {
  try {
    const { ToolRegistry } = require('../background/registry/ToolRegistry');
    const tool = ToolRegistry.getTool(toolId);
    return tool?.isStandalone ? tool : undefined;
  } catch (error) {
    console.error('Failed to get tool from registry:', error);
    return undefined;
  }
}
