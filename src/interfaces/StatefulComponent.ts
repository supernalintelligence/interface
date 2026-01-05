/**
 * Stateful Component Interface
 * 
 * Week 2: State Integration
 * 
 * Defines the interface that all stateful components must implement
 * to enable state management through ComponentRegistry and story execution.
 * 
 * @example
 * ```typescript
 * @Component({
 *   name: 'counter',
 *   stateful: true,
 * })
 * class CounterComponent implements StatefulComponent<CounterState> {
 *   private state: CounterState = { count: 0 };
 * 
 *   getState(): CounterState {
 *     return { ...this.state };
 *   }
 * 
 *   setState(newState: Partial<CounterState>): void {
 *     this.state = { ...this.state, ...newState };
 *     this.render();
 *   }
 * 
 *   resetState(): void {
 *     this.state = { count: 0 };
 *     this.render();
 *   }
 * }
 * ```
 */

/**
 * Interface for components with managed state
 * 
 * @template TState - The type of the component's state object
 */
export interface StatefulComponent<TState = any> {
  /**
   * Get the current state of the component
   * 
   * Should return a copy of the state to prevent external mutation
   * 
   * @returns Copy of the current component state
   */
  getState(): TState;
  
  /**
   * Set the component's state
   * 
   * Should merge the provided state with existing state
   * and trigger a re-render if applicable
   * 
   * @param state - Partial state to merge with current state
   */
  setState(state: Partial<TState>): void;
  
  /**
   * Reset the component to its initial state
   * 
   * Should restore the component to its default/initial state
   * and trigger a re-render if applicable
   */
  resetState(): void;
}

/**
 * Type guard to check if a component implements StatefulComponent
 * 
 * @param component - Component to check
 * @returns True if component implements StatefulComponent interface
 */
export function isStatefulComponent(component: any): component is StatefulComponent {
  return (
    component !== null &&
    typeof component === 'object' &&
    typeof component.getState === 'function' &&
    typeof component.setState === 'function' &&
    typeof component.resetState === 'function'
  );
}

