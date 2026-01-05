/**
 * Component State Types
 * 
 * Type-safe definitions for component state including UI widgets and function tools.
 * Uses discriminated unions for type safety.
 */

import { OperationType } from './OperationType';

/**
 * HTML element tags for UI components
 */
export type HTMLTag = 
  | 'button'
  | 'input'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'slider'
  | 'toggle'
  | 'dropdown'
  | 'modal'
  | 'dialog'
  | 'menu'
  | 'tab'
  | 'accordion'
  | 'tooltip'
  | 'popover'
  | 'card'
  | 'list'
  | 'table'
  | 'form'
  | 'nav'
  | 'header'
  | 'footer'
  | 'section'
  | 'article'
  | 'aside'
  | 'div'
  | 'span';

/**
 * HTML input types for form elements
 */
export type HTMLInputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color'
  | 'file'
  | 'hidden'
  | 'range'
  | 'checkbox'
  | 'radio'
  | 'submit'
  | 'reset'
  | 'button';

/**
 * ARIA roles for accessibility
 */
export type HTMLRole =
  | 'button'
  | 'checkbox'
  | 'radio'
  | 'textbox'
  | 'combobox'
  | 'listbox'
  | 'option'
  | 'menu'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'tab'
  | 'tabpanel'
  | 'dialog'
  | 'alertdialog'
  | 'tooltip'
  | 'search'
  | 'navigation'
  | 'banner'
  | 'contentinfo'
  | 'complementary'
  | 'form'
  | 'main'
  | 'region'
  | 'article'
  | 'section'
  | 'list'
  | 'listitem'
  | 'table'
  | 'row'
  | 'cell'
  | 'columnheader'
  | 'rowheader';

/**
 * State option for select/radio/checkbox components
 */
export interface StateOption {
  /**
   * Display label
   */
  label: string;
  
  /**
   * Internal value
   */
  value: string | number | boolean;
  
  /**
   * Whether this option is disabled
   */
  disabled?: boolean;
  
  /**
   * Optional icon or metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Base component state (common fields)
 */
export interface BaseComponentState {
  /**
   * Discriminator field - 'ui-component' or 'function-tool'
   */
  kind: 'ui-component' | 'function-tool';
  
  /**
   * Unique component identifier (from @Component decorator)
   */
  componentId: string;
  
  /**
   * Human-readable description
   */
  description?: string;
  
  /**
   * Container this component belongs to
   */
  containerId?: string;
  
  /**
   * Current state version for migration
   */
  version?: number;
}

/**
 * UI Component State (for interactive widgets)
 */
export interface UIComponentState extends BaseComponentState {
  kind: 'ui-component';
  
  /**
   * HTML semantics
   */
  htmlTag: HTMLTag;
  htmlType?: HTMLInputType;
  htmlRole?: HTMLRole;
  
  /**
   * Current value
   */
  value: any;
  
  /**
   * Available options (for select, radio, checkbox, etc.)
   */
  options?: StateOption[];
  
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the component is read-only
   */
  readOnly?: boolean;
  
  /**
   * Whether the component is required
   */
  required?: boolean;
  
  /**
   * Validation state
   */
  valid?: boolean;
  validationMessage?: string;
  
  /**
   * Visibility state
   */
  visible?: boolean;
  
  /**
   * Focus state
   */
  focused?: boolean;
  
  /**
   * Additional metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Function Tool State (for operations)
 */
export interface FunctionToolState extends BaseComponentState {
  kind: 'function-tool';
  
  /**
   * Type of operation this function performs
   */
  operationType: OperationType;
  
  /**
   * Last execution timestamp
   */
  lastExecuted?: number;
  
  /**
   * Execution count
   */
  executionCount?: number;
  
  /**
   * Last execution result
   */
  lastResult?: any;
  
  /**
   * Last execution error
   */
  lastError?: string;
  
  /**
   * Whether the function is currently executing
   */
  executing?: boolean;
  
  /**
   * Function parameters history (for debugging)
   */
  paramsHistory?: Array<{
    timestamp: number;
    params: Record<string, any>;
    result?: any;
    error?: string;
  }>;
  
  /**
   * Additional metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Application State (for application-level state that isn't tied to a specific UI component)
 * 
 * This is for state managed by StateManager that represents application data
 * rather than component-specific UI state.
 */
export interface ApplicationState {
  /**
   * Discriminator field - 'application'
   */
  kind: 'application';
  
  /**
   * Unique state identifier
   */
  stateId: string;
  
  /**
   * Human-readable description
   */
  description?: string;
  
  /**
   * The actual state data (flexible structure)
   * Optional - can be omitted if state properties are defined directly on the interface
   */
  data?: Record<string, any>;
  
  /**
   * State version for migration
   */
  version?: number;
  
  /**
   * Last updated timestamp
   */
  lastUpdated?: number;
}

/**
 * Union type for all component states
 */
export type ComponentState = UIComponentState | FunctionToolState | ApplicationState;

/**
 * Type guard for UI components
 */
export function isUIComponentState(state: ComponentState): state is UIComponentState {
  return state.kind === 'ui-component';
}

/**
 * Type guard for function tools
 */
export function isFunctionToolState(state: ComponentState): state is FunctionToolState {
  return state.kind === 'function-tool';
}

/**
 * Type guard for application state
 */
export function isApplicationState(state: ComponentState): state is ApplicationState {
  return state.kind === 'application';
}

