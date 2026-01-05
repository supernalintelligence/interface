/**
 * Component Registry
 * 
 * Handles two-phase registration for DOM-free decorators:
 * - Phase A (Decorator): Collect metadata without DOM access
 * - Phase B (Hydration): Query DOM after it's ready
 * 
 * This enables SSR/MV3 compatibility.
 */

import {
  ComponentState,
  UIComponentState,
  FunctionToolState,
  HTMLTag,
  HTMLInputType,
  HTMLRole,
  StateOption,
} from '../../types/ComponentState';
import { OperationType } from '../../types/OperationType';
import { StatefulComponent } from '../../interfaces/StatefulComponent';

/**
 * Component metadata collected at decoration time (Phase A)
 * NO DOM ACCESS
 */
export interface ComponentMetadata {
  /**
   * Component ID (from decorator)
   */
  componentId: string;
  
  /**
   * Component kind
   */
  kind: 'ui-component' | 'function-tool';
  
  /**
   * Description
   */
  description?: string;
  
  /**
   * Container ID
   */
  containerId?: string;
  
  /**
   * HTML semantics (for UI components, SSR-required)
   */
  htmlTag?: HTMLTag;
  htmlType?: HTMLInputType;
  htmlRole?: HTMLRole;
  
  /**
   * Operation type (for function tools)
   */
  operationType?: OperationType;
  
  /**
   * CSS selector for DOM hydration (Phase B)
   */
  selector?: string;
  
  /**
   * Provider class name
   */
  providerName?: string;
  
  /**
   * Method name
   */
  methodName?: string;
}

/**
 * Component Registry with two-phase registration
 */
export class ComponentRegistry {
  /**
   * Registered component metadata (Phase A)
   */
  private static metadata = new Map<string, ComponentMetadata>();
  
  /**
   * Hydrated components (Phase B)
   */
  private static hydrated = new Map<string, ComponentState>();
  
  /**
   * Stateful component instances (Week 2 - Story System)
   * Maps component name to StatefulComponent instance
   */
  private static instances = new Map<string, StatefulComponent>();
  
  /**
   * Phase A: Register component metadata (decorator-time, NO DOM)
   */
  static register(metadata: ComponentMetadata): void {
    if (this.metadata.has(metadata.componentId)) {
      // eslint-disable-next-line no-console
      console.warn(`[ComponentRegistry] Component ${metadata.componentId} already registered`);
      return;
    }
    
    // Validate SSR requirements for UI components
    if (metadata.kind === 'ui-component') {
      if (!metadata.htmlTag) {
        throw new Error(
          `[ComponentRegistry] UI component ${metadata.componentId} missing required htmlTag (SSR requirement)`
        );
      }
    }
    
    // Validate function tool requirements
    if (metadata.kind === 'function-tool') {
      if (!metadata.operationType) {
        throw new Error(
          `[ComponentRegistry] Function tool ${metadata.componentId} missing required operationType`
        );
      }
    }
    
    this.metadata.set(metadata.componentId, metadata);
    // eslint-disable-next-line no-console
    console.log(`[ComponentRegistry] Registered ${metadata.kind}: ${metadata.componentId}`);
  }
  
  /**
   * Phase B: Hydrate component from DOM (user-initiated, after DOM ready)
   * 
   * For UI components: Queries DOM to extract current state
   * For function tools: Creates initial state
   */
  static hydrate(componentId: string): ComponentState | null {
    const meta = this.metadata.get(componentId);
    
    if (!meta) {
      // eslint-disable-next-line no-console
      console.error(`[ComponentRegistry] No metadata for component ${componentId}`);
      return null;
    }
    
    let state: ComponentState;
    
    if (meta.kind === 'ui-component') {
      // UI Component: Query DOM
      state = this.hydrateUIComponent(meta);
    } else {
      // Function Tool: Create initial state
      state = this.hydrateFunctionTool(meta);
    }
    
    this.hydrated.set(componentId, state);
    // eslint-disable-next-line no-console
    console.log(`[ComponentRegistry] Hydrated ${meta.kind}: ${componentId}`);
    
    return state;
  }
  
  /**
   * Hydrate UI component from DOM
   */
  private static hydrateUIComponent(meta: ComponentMetadata): UIComponentState {
    const element = meta.selector
      ? document.querySelector(meta.selector)
      : document.querySelector(`[data-component-id="${meta.componentId}"]`);
    
    if (!element) {
      // eslint-disable-next-line no-console
      console.warn(`[ComponentRegistry] Element not found for ${meta.componentId}, using defaults`);
    }
    
    // Extract state from DOM
    const options = element ? this.extractOptionsFromDOM(element) : undefined;
    const value = element ? this.extractValueFromDOM(element, meta.htmlTag!) : null;
    const disabled = element ? (element as HTMLInputElement).disabled : false;
    const readOnly = element ? (element as HTMLInputElement).readOnly : false;
    const required = element ? (element as HTMLInputElement).required : false;
    const visible = element ? (element as HTMLElement).offsetParent !== null : true;
    
    return {
      kind: 'ui-component',
      componentId: meta.componentId,
      description: meta.description,
      containerId: meta.containerId,
      htmlTag: meta.htmlTag!,
      htmlType: meta.htmlType,
      htmlRole: meta.htmlRole,
      value,
      options,
      disabled,
      readOnly,
      required,
      visible,
    };
  }
  
  /**
   * Extract value from DOM element based on tag
   */
  private static extractValueFromDOM(element: Element, htmlTag: HTMLTag): any {
    const el = element as HTMLElement;
    
    switch (htmlTag) {
      case 'input': {
        const inputEl = el as HTMLInputElement;
        if (inputEl.type === 'checkbox' || inputEl.type === 'radio') {
          return inputEl.checked;
        }
        return inputEl.value;
      }
        
      case 'select':
        return (el as unknown as HTMLSelectElement).value;
        
      case 'textarea':
        return (el as unknown as HTMLTextAreaElement).value;
        
      case 'checkbox':
      case 'toggle':
        return (el as HTMLInputElement).checked;
        
      default:
        return el.textContent || el.getAttribute('value') || null;
    }
  }
  
  /**
   * Extract options from DOM (for select, radio, checkbox groups)
   */
  private static extractOptionsFromDOM(element: Element): StateOption[] | undefined {
    const tag = element.tagName.toLowerCase();
    
    if (tag === 'select') {
      const selectEl = element as unknown as HTMLSelectElement;
      const options = Array.from(selectEl.options);
      return options.map(opt => ({
        label: opt.text,
        value: opt.value,
        disabled: opt.disabled,
      }));
    }
    
    // For radio/checkbox groups, find siblings with same name
    // Skip in non-browser environments
    if (typeof HTMLInputElement === 'undefined') {
      return undefined;
    }
    
    if (element instanceof HTMLInputElement && (element.type === 'radio' || element.type === 'checkbox')) {
      const name = element.name;
      if (name) {
        const siblings = document.querySelectorAll(`input[name="${name}"]`);
        return Array.from(siblings).map(el => {
          const input = el as HTMLInputElement;
          return {
            label: input.labels?.[0]?.textContent || input.value,
            value: input.value,
            disabled: input.disabled,
          };
        });
      }
    }
    
    return undefined;
  }
  
  /**
   * Hydrate function tool (no DOM access)
   */
  private static hydrateFunctionTool(meta: ComponentMetadata): FunctionToolState {
    return {
      kind: 'function-tool',
      componentId: meta.componentId,
      description: meta.description,
      containerId: meta.containerId,
      operationType: meta.operationType!,
      executionCount: 0,
    };
  }
  
  /**
   * Hydrate all registered components
   */
  static hydrateAll(): Map<string, ComponentState> {
    const results = new Map<string, ComponentState>();
    
    for (const componentId of this.metadata.keys()) {
      const state = this.hydrate(componentId);
      if (state) {
        results.set(componentId, state);
      }
    }
    
    return results;
  }
  
  /**
   * Get registered metadata (Phase A)
   */
  static getMetadata(componentId: string): ComponentMetadata | undefined {
    return this.metadata.get(componentId);
  }
  
  /**
   * Get all registered metadata
   */
  static getAllMetadata(): Map<string, ComponentMetadata> {
    return new Map(this.metadata);
  }
  
  /**
   * Get hydrated state (Phase B)
   */
  static getHydrated(componentId: string): ComponentState | undefined {
    return this.hydrated.get(componentId);
  }
  
  /**
   * Get all hydrated states
   */
  static getAllHydrated(): Map<string, ComponentState> {
    return new Map(this.hydrated);
  }
  
  /**
   * Check if component is registered
   */
  static isRegistered(componentId: string): boolean {
    return this.metadata.has(componentId);
  }
  
  /**
   * Check if component is hydrated
   */
  static isHydrated(componentId: string): boolean {
    return this.hydrated.has(componentId);
  }
  
  /**
   * Clear all registrations (useful for testing)
   */
  static clear(): void {
    this.metadata.clear();
    this.hydrated.clear();
  }
  
  /**
   * Unregister a component
   */
  static unregister(componentId: string): void {
    this.metadata.delete(componentId);
    this.hydrated.delete(componentId);
  }
  
  // ============================================================================
  // STATEFUL COMPONENT MANAGEMENT (Week 2 - Story System)
  // ============================================================================
  
  /**
   * Register a stateful component instance
   * 
   * @param componentName - Name of the component (from @Component decorator)
   * @param instance - StatefulComponent instance
   */
  static registerInstance(
    componentName: string,
    instance: StatefulComponent
  ): void {
    this.instances.set(componentName, instance);
    // eslint-disable-next-line no-console
    console.log(`[ComponentRegistry] Registered stateful instance: ${componentName}`);
  }
  
  /**
   * Get a stateful component instance
   * 
   * @param componentName - Name of the component
   * @returns StatefulComponent instance or undefined
   */
  static getInstance(componentName: string): StatefulComponent | undefined {
    return this.instances.get(componentName);
  }
  
  /**
   * Get component state via instance
   * 
   * @param componentName - Name of the component
   * @returns Current component state
   * @throws Error if component not found
   */
  static getState(componentName: string): any {
    const instance = this.instances.get(componentName);
    if (!instance) {
      throw new Error(`[ComponentRegistry] Component not found: ${componentName}`);
    }
    return instance.getState();
  }
  
  /**
   * Set component state via instance
   * 
   * @param componentName - Name of the component
   * @param state - State to set
   * @throws Error if component not found
   */
  static setState(componentName: string, state: any): void {
    const instance = this.instances.get(componentName);
    if (!instance) {
      throw new Error(`[ComponentRegistry] Component not found: ${componentName}`);
    }
    instance.setState(state);
  }
  
  /**
   * Reset component to initial state
   * 
   * @param componentName - Name of the component
   * @throws Error if component not found
   */
  static resetComponentState(componentName: string): void {
    const instance = this.instances.get(componentName);
    if (!instance) {
      throw new Error(`[ComponentRegistry] Component not found: ${componentName}`);
    }
    instance.resetState();
  }
  
  /**
   * Get all registered stateful component names
   * 
   * @returns Array of component names
   */
  static getAllInstanceNames(): string[] {
    return Array.from(this.instances.keys());
  }
  
  /**
   * Check if a stateful component instance is registered
   * 
   * @param componentName - Name of the component
   * @returns True if instance is registered
   */
  static hasInstance(componentName: string): boolean {
    return this.instances.has(componentName);
  }
  
  /**
   * Clear stateful component instances (for testing)
   */
  static clearInstances(): void {
    this.instances.clear();
  }
}

