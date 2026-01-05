/**
 * Tool Permissions Interface
 *
 * This interface defines the permission model for tools that can be called by LLMs.
 * It follows a standardized approach to tool access control and security.
 */

/**
 * Permission level for tool execution
 */
export enum ToolPermissionLevel {
  /**
   * User must approve each tool execution
   */
  ALWAYS_REQUIRE_APPROVAL = 'always_require_approval',

  /**
   * User approves once, then allowed for session
   */
  APPROVE_ONCE = 'approve_once',

  /**
   * Automatically approved for non-sensitive tools
   */
  AUTO_APPROVE = 'auto_approve',

  /**
   * Can only be called by system components, not LLMs
   */
  SYSTEM_ONLY = 'system_only',
}

/**
 * Permission scope for tools
 */
export enum ToolPermissionScope {
  // Data access scopes
  DATA_READ = 'data:read',
  DATA_WRITE = 'data:write',
  DATA_DELETE = 'data:delete',

  // Content scopes
  CONTENT_READ = 'content:read',
  CONTENT_WRITE = 'content:write',
  CONTENT_DELETE = 'content:delete',

  // External service scopes
  EXTERNAL_SERVICE = 'external:service',
  NETWORK_ACCESS = 'network:access',

  // User interaction scopes
  USER_INTERACTION = 'user:interaction',
  USER_NOTIFICATION = 'user:notification',

  // System scopes
  SYSTEM_ACCESS = 'system:access',
}

/**
 * Permission model for a tool
 */
export interface ToolPermissions {
  /**
   * Permission level required for the tool
   */
  level: ToolPermissionLevel;

  /**
   * Required permission scopes
   */
  requiredScopes: string[];

  /**
   * Whether the tool accesses sensitive data
   */
  sensitiveDataAccess: boolean;

  /**
   * Whether permanent storage changes are made
   */
  persistentChanges?: boolean;

  /**
   * Whether the tool can access network resources
   */
  networkAccess?: boolean;

  /**
   * Custom permission validator function (defined at runtime)
   */
  customValidator?: boolean;
}
