/**
 * Tool Result Interface
 *
 * This interface defines the structure for results returned from tool executions.
 * It is designed to be compatible with various LLM providers while maintaining
 * a standardized structure across our platform.
 */

/**
 * Status of a tool execution
 */
export enum ToolExecutionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  PARTIAL = 'partial',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
  PERMISSION_DENIED = 'permission_denied',
  PENDING = 'pending',
  RUNNING = 'running',
}

/**
 * Record of a tool call execution, used for tracking and displaying tool usage
 */
export interface ToolCallRecord {
  /**
   * Unique identifier for this tool call
   */
  id: string;

  /**
   * ID of the tool that was called
   */
  toolId: string;

  /**
   * Name of the tool for display purposes
   */
  toolName: string;

  /**
   * Input parameters provided to the tool
   */
  input: any;

  /**
   * Output returned by the tool execution
   */
  output: any | null;

  /**
   * Current status of the tool execution
   */
  status: ToolExecutionStatus;

  /**
   * Timestamp when the execution was initiated
   */
  timestamp: number;

  /**
   * Error message if the execution failed
   */
  error?: string;
}

/**
 * Basic tool result interface
 */
export interface ToolResult {
  /**
   * Whether the operation was successful
   */
  success: boolean;

  /**
   * Output data from the tool execution
   * This can be any valid JSON data, depending on the tool
   */
  output?: any;

  /**
   * Error message if the operation failed
   */
  error?: string;

  /**
   * Error code if applicable
   */
  errorCode?: string;

  /**
   * Detailed status of the execution
   */
  status?: ToolExecutionStatus;

  /**
   * Timestamp when the tool execution completed
   */
  timestamp?: number;

  /**
   * Time taken to execute the tool in milliseconds
   */
  executionTime?: number;

  /**
   * Whether the result should be cached
   */
  cacheable?: boolean;

  /**
   * Tool's declared return format (markdown or json)
   */
  returnType?: 'markdown' | 'json';
}

/**
 * Extended tool result with provider-specific fields
 */
export interface EnhancedToolResult extends ToolResult {
  /**
   * Additional metadata about the execution
   */
  metadata?: Record<string, any>;

  /**
   * References to any resources created or modified
   */
  references?: string[];

  /**
   * Permissions that were used during execution
   */
  usedPermissions?: string[];

  /**
   * Whether the user was prompted for permission
   */
  userPrompted?: boolean;

  /**
   * Whether the result has been truncated
   */
  truncated?: boolean;

  /**
   * Suggestions for follow-up actions
   */
  suggestions?: string[];
}
