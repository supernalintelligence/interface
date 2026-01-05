/**
 * Tool Exposure State Types (REQ-004)
 * 
 * Production-quality types for state-dependent tool exposure detection.
 */

/**
 * Represents the current exposure state of a tool in the UI
 */
export enum ExposureState {
  /** Tool's DOM element does not exist in the document */
  NOT_PRESENT = 0,
  
  /** Tool exists in DOM but may not be visible (display:none, hidden, etc) */
  PRESENT = 1,
  
  /** Tool is visible (not hidden, has non-zero dimensions) */
  VISIBLE = 2,
  
  /** Tool is visible AND currently in viewport (IntersectionObserver) */
  EXPOSED = 3,
  
  /** Tool is exposed AND enabled (not disabled, not aria-disabled) */
  INTERACTABLE = 4,
}

/**
 * State change event emitted by tools
 */
export interface ExposureStateChange {
  /** Unique tool identifier */
  toolId: string;
  
  /** Previous state */
  oldState: ExposureState;
  
  /** New state */
  newState: ExposureState;
  
  /** Timestamp of state change */
  timestamp: number;
  
  /** Optional metadata about the state change */
  metadata?: {
    reason?: string;
    element?: Element;
    [key: string]: any;
  };
}

/**
 * Current state of a tool with metadata
 */
export interface ToolState {
  /** Unique tool identifier */
  toolId: string;
  
  /** Current exposure state */
  state: ExposureState;
  
  /** DOM element (if present) */
  element?: Element;
  
  /** Last update timestamp */
  lastUpdate: number;
  
  /** Optional metadata */
  metadata?: {
    reason?: string;
    path?: string;
    context?: string;
    [key: string]: any;
  };
}

/**
 * Observer callback for state changes
 */
export type ExposureStateObserver = (change: ExposureStateChange) => void;

/**
 * Options for waiting for a specific state
 */
export interface WaitForStateOptions {
  /** Timeout in milliseconds (default: 5000) */
  timeout?: number;
  
  /** Poll interval in milliseconds (default: 100) */
  pollInterval?: number;
  
  /** Minimum state required (default: INTERACTABLE) */
  minState?: ExposureState;
}


