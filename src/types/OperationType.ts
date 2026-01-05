/**
 * Operation Type Classifications
 * 
 * Defines the type of operation a function tool performs.
 * Used for function tools (not UI components).
 */
export enum OperationType {
  /**
   * Reads data without side effects
   */
  READ = 'read',
  
  /**
   * Modifies existing data
   */
  WRITE = 'write',
  
  /**
   * Creates new data
   */
  CREATE = 'create',
  
  /**
   * Removes data
   */
  DELETE = 'delete',
  
  /**
   * Searches/queries data
   */
  SEARCH = 'search',
  
  /**
   * Validates data
   */
  VALIDATE = 'validate',
  
  /**
   * Transforms/processes data
   */
  TRANSFORM = 'transform',
  
  /**
   * Navigates between contexts
   */
  NAVIGATE = 'navigate',
  
  /**
   * Manages subscriptions/events
   */
  SUBSCRIBE = 'subscribe',
}

