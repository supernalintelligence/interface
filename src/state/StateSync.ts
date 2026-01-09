/**
 * State Synchronization Utilities
 * 
 * Handles automatic syncing of component state to DOM and event triggering.
 * Used by @Component decorator for stateful components.
 */

/**
 * State change event detail
 */
export interface StateChangeEventDetail {
  /** Component name */
  component: string;
  /** New state */
  state: any;
  /** Timestamp */
  timestamp: number;
}

/**
 * Sync component state to DOM by writing to data-state attribute
 * 
 * @param componentName - Component identifier (from @Component decorator)
 * @param state - Current component state
 */
export function syncStateToDom(componentName: string, state: any): void {
  // Find element by data-component attribute
  const element = document.querySelector(`[data-component="${componentName}"]`);
  
  if (element) {
    try {
      // Serialize state to JSON and write to data-state
      const stateJson = JSON.stringify(state);
      element.setAttribute('data-state', stateJson);
    } catch (error) {
      console.error(
        `[StateSync] Failed to serialize state for component '${componentName}':`,
        error
      );
    }
  } else {
    // Element not in DOM yet - this is OK during initialization
    // Component might be created before rendering
  }
}

/**
 * Trigger state change event for test utilities and observers
 * 
 * @param componentName - Component identifier
 * @param state - New state
 */
export function triggerStateChange(componentName: string, state: any): void {
  const detail: StateChangeEventDetail = {
    component: componentName,
    state,
    timestamp: Date.now()
  };
  
  const event = new CustomEvent('component:state:change', {
    detail,
    bubbles: false, // Don't bubble - listen on window
    cancelable: false
  });
  
  window.dispatchEvent(event);
}

/**
 * Get component state from DOM (read data-state attribute)
 * 
 * @param componentName - Component identifier
 * @returns Parsed state or null if not found
 */
export function getStateFromDom(componentName: string): any | null {
  const element = document.querySelector(`[data-component="${componentName}"]`);
  
  if (!element) {
    return null;
  }
  
  const stateAttr = element.getAttribute('data-state');
  
  if (!stateAttr) {
    return null;
  }
  
  try {
    return JSON.parse(stateAttr);
  } catch (error) {
    console.error(
      `[StateSync] Failed to parse state for component '${componentName}':`,
      error
    );
    return null;
  }
}

/**
 * Wait for component state to match predicate
 * Useful for testing async state changes
 * 
 * @param componentName - Component identifier
 * @param predicate - Function that returns true when state is as expected
 * @param timeoutMs - Maximum wait time (default: 5000ms)
 * @returns Promise that resolves when predicate returns true
 */
export async function waitForState<T = any>(
  componentName: string,
  predicate: (state: T) => boolean,
  timeoutMs: number = 5000
): Promise<T> {
  const startTime = Date.now();
  
  return new Promise<T>((resolve, reject) => {
    const checkState = () => {
      const state = getStateFromDom(componentName);
      
      if (state && predicate(state)) {
        resolve(state);
        return;
      }
      
      if (Date.now() - startTime > timeoutMs) {
        reject(
          new Error(
            `Timeout waiting for component '${componentName}' state to match predicate`
          )
        );
        return;
      }
      
      // Check again after short delay
      setTimeout(checkState, 50);
    };
    
    // Start checking
    checkState();
  });
}

/**
 * Subscribe to component state changes
 * 
 * @param componentName - Component to watch (or '*' for all)
 * @param callback - Function to call on state change
 * @returns Unsubscribe function
 */
export function onStateChange(
  componentName: string | '*',
  callback: (detail: StateChangeEventDetail) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<StateChangeEventDetail>;
    const { component } = customEvent.detail;
    
    if (componentName === '*' || component === componentName) {
      callback(customEvent.detail);
    }
  };
  
  window.addEventListener('component:state:change', handler);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('component:state:change', handler);
  };
}
