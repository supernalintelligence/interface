/**
 * ExposureCollector - Production-Quality Singleton (REQ-004)
 * 
 * Collects and manages real-time tool exposure states across the entire application.
 * Works with 1 tool or 10,000 tools - designed for production use.
 */

import {
  ExposureState,
  ExposureStateChange,
  ToolState,
  ExposureStateObserver,
  WaitForStateOptions,
} from '../types/ExposureState';
import { LocationContext } from '../background/location/LocationContext';

export class ExposureCollector {
  private static instance: ExposureCollector;
  
  /** Current state of all registered tools */
  private states = new Map<string, ToolState>();
  
  /** Observers for state changes (global and per-tool) */
  private globalObservers = new Set<ExposureStateObserver>();
  private toolObservers = new Map<string, Set<ExposureStateObserver>>();
  
  /** IntersectionObserver instances (one per tool element) */
  private intersectionObservers = new Map<string, IntersectionObserver>();
  
  /** MutationObserver for DOM changes */
  private mutationObserver?: MutationObserver;
  
  private constructor() {
    // Private constructor for singleton
    this.initializeMutationObserver();
  }
  
  static getInstance(): ExposureCollector {
    if (!ExposureCollector.instance) {
      ExposureCollector.instance = new ExposureCollector();
    }
    return ExposureCollector.instance;
  }
  
  /**
   * Register a tool and start observing its exposure state
   */
  registerTool(toolId: string, element?: Element, metadata?: Record<string, any>): void {
    // Check for duplicate toolId
    if (this.states.has(toolId)) {
      console.warn(
        `⚠️  Tool "${toolId}" is already registered. Updating registration.\n` +
        `   This might indicate duplicate tool IDs in your application.`
      );
    }
    
    const initialState: ToolState = {
      toolId,
      state: element ? ExposureState.PRESENT : ExposureState.NOT_PRESENT,
      element,
      lastUpdate: Date.now(),
      metadata,
    };
    
    this.states.set(toolId, initialState);
    
    // Start observing if element exists
    if (element) {
      this.observeElement(toolId, element);
    }
  }
  
  /**
   * Unregister a tool and stop observing
   */
  unregisterTool(toolId: string): void {
    const observer = this.intersectionObservers.get(toolId);
    if (observer) {
      observer.disconnect();
      this.intersectionObservers.delete(toolId);
    }
    
    this.states.delete(toolId);
    this.toolObservers.delete(toolId);
  }
  
  /**
   * Get current state of a tool
   */
  getToolState(toolId: string): ToolState | undefined {
    return this.states.get(toolId);
  }
  
  /**
   * Get all registered tools
   */
  getAllTools(): ToolState[] {
    return Array.from(this.states.values());
  }
  
  /**
   * Subscribe to state changes (global or per-tool)
   */
  subscribe(observer: ExposureStateObserver, toolId?: string): () => void {
    if (toolId) {
      // Subscribe to specific tool
      if (!this.toolObservers.has(toolId)) {
        this.toolObservers.set(toolId, new Set());
      }
      this.toolObservers.get(toolId)!.add(observer);
      
      return () => {
        this.toolObservers.get(toolId)?.delete(observer);
      };
    } else {
      // Subscribe to all state changes
      this.globalObservers.add(observer);
      
      return () => {
        this.globalObservers.delete(observer);
      };
    }
  }
  
  /**
   * Wait for a tool to reach a specific state (returns Promise)
   * 
   * @example
   * const ready = await collector.waitForState('save-button', ExposureState.INTERACTABLE, 5000);
   * if (ready) {
   *   // Execute tool
   * }
   */
  waitForState(
    toolId: string,
    targetState: ExposureState,
    timeoutMs = 5000
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const currentState = this.states.get(toolId);
      
      // Already at target state or higher
      if (currentState && currentState.state >= targetState) {
        resolve(true);
        return;
      }
      
      // Set up timeout
      const timeout = setTimeout(() => {
        unsubscribe();
        resolve(false);
      }, timeoutMs);
      
      // Subscribe to state changes
      const unsubscribe = this.subscribe((change) => {
        if (change.newState >= targetState) {
          clearTimeout(timeout);
          unsubscribe();
          resolve(true);
        }
      }, toolId);
    });
  }
  
  /**
   * Manually update tool state (for external integrations)
   */
  updateToolState(toolId: string, newState: ExposureState, metadata?: Record<string, any>): void {
    const currentState = this.states.get(toolId);
    
    if (!currentState) {
      console.warn(`Cannot update state for unregistered tool: ${toolId}`);
      return;
    }
    
    if (currentState.state === newState) {
      return; // No change
    }
    
    const change: ExposureStateChange = {
      toolId,
      oldState: currentState.state,
      newState,
      timestamp: Date.now(),
      metadata,
    };
    
    // Update state
    currentState.state = newState;
    currentState.lastUpdate = change.timestamp;
    if (metadata) {
      currentState.metadata = { ...currentState.metadata, ...metadata };
    }

    // Sync to LocationContext
    this.syncToLocationContext();

    // Notify observers
    this.notifyObservers(change);
  }

  /**
   * Sync visible tools to LocationContext.elements
   *
   * This enables automatic tool filtering based on element visibility.
   * Tools with @LocationScope({ elements: [...] }) will automatically
   * be available when their target elements are visible.
   */
  private syncToLocationContext(): void {
    // Get all tools that are at least VISIBLE (in DOM and not hidden)
    const visibleElementIds = Array.from(this.states.values())
      .filter(state => state.state >= ExposureState.VISIBLE)
      .map(state => state.toolId);

    // Get current location
    const currentLocation = LocationContext.getCurrent();
    if (!currentLocation) {
      // No location set yet - skip sync
      return;
    }

    // Update LocationContext with currently visible elements
    LocationContext.setCurrent({
      ...currentLocation,
      elements: visibleElementIds,
    });
  }

  /**
   * Initialize DOM mutation observer to detect element additions/removals
   */
  private initializeMutationObserver(): void {
    if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') {
      return; // Not in browser environment
    }
    
    this.mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Check if any registered tools were added/removed
          this.handleDOMMutations(mutation);
        }
      }
    });
    
    // Observe entire document
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
  
  /**
   * Handle DOM mutations to detect tool additions/removals
   */
  private handleDOMMutations(mutation: MutationRecord): void {
    // Check removed nodes
    for (const node of Array.from(mutation.removedNodes)) {
      if (node instanceof Element) {
        for (const [toolId, state] of this.states.entries()) {
          if (state.element === node || node.contains(state.element as Node)) {
            this.updateToolState(toolId, ExposureState.NOT_PRESENT, { reason: 'DOM element removed' });
          }
        }
      }
    }
    
    // Check added nodes (re-register tools that reappeared)
    for (const node of Array.from(mutation.addedNodes)) {
      if (node instanceof Element) {
        for (const [toolId, state] of this.states.entries()) {
          if (state.state === ExposureState.NOT_PRESENT) {
            // Check if tool's element was added back (by data-tool-id or stored reference)
            const toolElement = this.findToolElement(toolId);
            if (toolElement) {
              state.element = toolElement;
              this.observeElement(toolId, toolElement);
              this.updateToolState(toolId, ExposureState.PRESENT, { reason: 'DOM element added' });
            }
          }
        }
      }
    }
  }
  
  /**
   * Find a tool's element by data-tool-id attribute
   */
  private findToolElement(toolId: string): Element | null {
    if (typeof document === 'undefined') return null;
    return document.querySelector(`[data-tool-id="${toolId}"]`);
  }
  
  /**
   * Observe an element for visibility and interaction changes
   */
  private observeElement(toolId: string, element: Element): void {
    // Clean up existing observer
    const existingObserver = this.intersectionObservers.get(toolId);
    if (existingObserver) {
      existingObserver.disconnect();
    }
    
    // Create IntersectionObserver to detect visibility and viewport exposure
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.handleIntersectionChange(toolId, entry);
        }
      },
      { threshold: [0, 0.1] } // Trigger when any part becomes visible
    );
    
    observer.observe(element);
    this.intersectionObservers.set(toolId, observer);
    
    // Initial state check
    this.checkElementState(toolId, element);
  }
  
  /**
   * Handle IntersectionObserver changes
   */
  private handleIntersectionChange(toolId: string, entry: IntersectionObserverEntry): void {
    const element = entry.target;
    const isIntersecting = entry.isIntersecting;
    
    // Check visibility (hidden, display:none, etc)
    const computedStyle = window.getComputedStyle(element);
    const isVisible =
      computedStyle.display !== 'none' &&
      computedStyle.visibility !== 'hidden' &&
      computedStyle.opacity !== '0';
    
    // Check if enabled
    const isEnabled = !(element as HTMLElement).hasAttribute('disabled') &&
                      element.getAttribute('aria-disabled') !== 'true';
    
    // Determine new state
    let newState: ExposureState;
    if (!isVisible) {
      newState = ExposureState.PRESENT;
    } else if (!isIntersecting) {
      newState = ExposureState.VISIBLE;
    } else if (!isEnabled) {
      newState = ExposureState.EXPOSED;
    } else {
      newState = ExposureState.INTERACTABLE;
    }
    
    this.updateToolState(toolId, newState, {
      reason: 'Intersection change',
      isIntersecting,
      isVisible,
      isEnabled,
    });
  }
  
  /**
   * Check element state (initial or manual check)
   */
  private checkElementState(toolId: string, element: Element): void {
    if (typeof window === 'undefined') return;
    
    const computedStyle = window.getComputedStyle(element);
    const isVisible =
      computedStyle.display !== 'none' &&
      computedStyle.visibility !== 'hidden' &&
      computedStyle.opacity !== '0';
    
    const rect = element.getBoundingClientRect();
    const isInViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    
    const isEnabled = !(element as HTMLElement).hasAttribute('disabled') &&
                      element.getAttribute('aria-disabled') !== 'true';
    
    // Determine state
    let newState: ExposureState;
    if (!isVisible) {
      newState = ExposureState.PRESENT;
    } else if (!isInViewport) {
      newState = ExposureState.VISIBLE;
    } else if (!isEnabled) {
      newState = ExposureState.EXPOSED;
    } else {
      newState = ExposureState.INTERACTABLE;
    }
    
    this.updateToolState(toolId, newState, {
      reason: 'Initial state check',
      isVisible,
      isInViewport,
      isEnabled,
    });
  }
  
  /**
   * Notify all observers of a state change
   */
  private notifyObservers(change: ExposureStateChange): void {
    // Notify global observers
    for (const observer of this.globalObservers) {
      try {
        observer(change);
      } catch (error) {
        console.error('Error in exposure observer:', error);
      }
    }
    
    // Notify tool-specific observers
    const toolObservers = this.toolObservers.get(change.toolId);
    if (toolObservers) {
      for (const observer of toolObservers) {
        try {
          observer(change);
        } catch (error) {
          console.error('Error in tool-specific observer:', error);
        }
      }
    }
  }
  
  /**
   * Clean up all observers (call on unmount/cleanup)
   */
  destroy(): void {
    // Disconnect all intersection observers
    for (const observer of this.intersectionObservers.values()) {
      observer.disconnect();
    }
    this.intersectionObservers.clear();
    
    // Disconnect mutation observer
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
    
    // Clear all state
    this.states.clear();
    this.globalObservers.clear();
    this.toolObservers.clear();
  }
}


