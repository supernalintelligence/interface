/**
 * Tool Interface
 *
 * This interface defines the structure for callable tools that can be used by LLMs.
 * Tools are exposed by ToolProviders and follow industry standards for compatibility
 * with OpenAI, Anthropic, and LangChain.
 */

import { ToolPermissions } from './ToolPermissions';

/**
 * Category of tool functionality
 */
export enum ToolCategory {
  // Original categories
  CONTENT_CREATION = 'content_creation',
  CONTENT_RETRIEVAL = 'content_retrieval',
  DATA_MANIPULATION = 'data_manipulation',
  EXTERNAL_SERVICE = 'external_service',
  SYSTEM = 'system',
  USER_INTERACTION = 'user_interaction',

  // Extended categories from ClassifiedTool
  MEMORY = 'memory',
  DATA = 'data',
  SEARCH = 'search',
  UTILITY = 'utility',
  TIME = 'time',
  DOM = 'dom',
  API = 'api',
  FILE = 'file',
  COMMUNICATION = 'communication',
  CONTEXT_APP = 'context-app',
  WORKFLOW = 'workflow',
  
  // New categories for specialized tools
  CHAT = 'chat',
  SETTINGS = 'settings',
  NAVIGATION = 'navigation',
  ONBOARDING = 'onboarding',
}

/**
 * Example of tool usage with input/output
 */
export interface ToolExample {
  input: Record<string, any>;
  output: Record<string, any>;
  description?: string;
}

/**
 * JSON Schema type (simplified for TypeScript)
 */
export type JSONSchema = {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  description?: string;
  items?: any;
  enum?: string[];
  [key: string]: any;
};

/**
 * Component storage interface for persisting state
 */
export interface ComponentStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  update<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  search(query: string): Promise<string[]>;
  list(filter?: (key: string) => boolean): Promise<string[]>;
  clear(): Promise<void>;
  count(): Promise<number>;
  keys(): Promise<string[]>;
  values(): Promise<any[]>;
  entries(): Promise<[string, any][]>;
  size(): Promise<number>;
  isEmpty(): Promise<boolean>;
}

/**
 * Runtime options for tool invocation
 * Provides callbacks and storage integration
 */
export interface ToolOptions {
  // Lifecycle callbacks
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  onStart?: () => void;
  onComplete?: () => void;
  
  // Storage integration (Component Memory)
  storage?: ComponentStorage;
  
  // Validation
  validate?: (input: any) => boolean | Promise<boolean>;
  
  // Navigation
  onNavigate?: (path: string) => void;
}

/**
 * Tool interface defining the structure of callable functions
 */
export interface Tool {
  /**
   * Unique identifier for the tool
   */
  id: string;

  /**
   * Name of the tool (must match regex ^[a-zA-Z0-9_-]{1,64}$)
   */
  name: string;

  /**
   * Detailed description (3-4 sentences minimum)
   */
  description: string;

  /**
   * Category for grouping related tools
   */
  category: ToolCategory;

  /**
   * JSON Schema defining expected parameters
   */
  inputSchema: JSONSchema;

  /**
   * JSON Schema defining return type
   */
  outputSchema: JSONSchema;

  /**
   * Tool's declared return format (markdown or json)
   */
  returnType?: 'markdown' | 'json';

  /**
   * Optional usage examples
   */
  examples?: ToolExample[];

  /**
   * Required permissions to use the tool
   */
  permissions: ToolPermissions;

  /**
   * Which platforms this tool supports
   */
  platformSupport: {
    chrome: boolean;
    web: boolean;
    desktop: boolean;
  };

  /**
   * Version of the tool
   */
  version?: string;

  /**
   * Whether the tool is currently enabled
   */
  enabled?: boolean;

  /**
   * Additional tool metadata
   */
  metadata?: Record<string, any>;
  
  /**
   * Component state classification (NEW)
   * Discriminated union: 'ui-component' or 'function-tool'
   */
  componentKind?: 'ui-component' | 'function-tool';
  
  /**
   * HTML semantics (for UI components)
   */
  htmlTag?: string;
  htmlType?: string;
  htmlRole?: string;
  
  /**
   * Operation type (for function tools)
   */
  operationType?: string;
}
