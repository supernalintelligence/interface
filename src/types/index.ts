/**
 * Tools Types - Index File
 *
 * This is the main entry point for all tool-related types.
 * It re-exports all tool types from their specialized modules.
 */

// Export tool types
export * from './Tool';
export * from './ToolPermissions';
export * from './ToolResult';
export * from './ExposureState';
export * from './NavigationGraph';
export * from './ClassifiedTool';
export * from './DiscoverableToolProvider';

// Export state system types
export * from './StateManagers';
export * from './OperationType';
export * from './ComponentState';

// Additional types for testing integration
export interface ComponentInfo {
  constantName: string;
  testId: string;
  elementType: ElementType;
  actionType: ActionType;
  methodName: string;
  confidence: number;
  source: string;
}

export enum ElementType {
  BUTTON = 'button',
  INPUT = 'input',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  LINK = 'link',
  DIV = 'div',
}

export enum ActionType {
  CLICK = 'click',
  TYPE = 'type',
  SELECT = 'select',
  NAVIGATE = 'navigate',
  HOVER = 'hover',
  SCROLL = 'scroll',
}

/**
 * Tools Types
 *
 * Export of all tool-related types, interfaces and constants
 */
