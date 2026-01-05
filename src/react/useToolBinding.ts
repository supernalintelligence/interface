/**
 * useToolBinding Hook
 * Auto-wires DOM elements to @Tool decorators based on data-testid
 * 
 * Simplified version - tools receive raw events and handle their own logic
 */

import { useEffect } from 'react';
import { ToolRegistry } from '../background/registry/ToolRegistry';
import { ToolOptions } from '../types/Tool';

export function useToolBinding(
  containerRef: React.RefObject<HTMLElement>,
  containerTestId: string,
  instanceId?: string
): void {
  useEffect(() => {
    if (!containerRef.current) return;
    
    const storageKey = instanceId ? `${containerTestId}:${instanceId}` : containerTestId;
    
    // 1. Register instance for duplicate detection
    try {
      ToolRegistry.registerInstance(storageKey, containerRef.current);
    } catch (error) {
      console.error(`[useToolBinding] Instance already exists: ${storageKey}`, error);
      return; // Don't wire up duplicate instances
    }
    
    // 2. Find all elements with data-testid within container (and the container itself)
    const elements: Element[] = [];
    
    // Check if container itself has data-testid
    if (containerRef.current.hasAttribute('data-testid')) {
      elements.push(containerRef.current);
    }
    
    // Find children with data-testid
    const childElements = containerRef.current.querySelectorAll('[data-testid]');
    elements.push(...Array.from(childElements));
    
    const handlers: Array<{ element: Element; event: string; handler: EventListener }> = [];
    
    elements.forEach((element) => {
      const testId = element.getAttribute('data-testid');
      if (!testId) return;
      
      // 3. Find matching tool from registry
      const tool = ToolRegistry.findToolByElementId(testId);
      if (!tool || !tool.method) {
        console.warn(`[useToolBinding] Tool not found or has no method for elementId: ${testId}`);
        return;
      }
      
      // Note: instance may not be set yet (lazy initialization)
      // We'll check for it when the event fires
      
      // 4. Create handler that extracts values from events and calls tool
      const handler = async (event: Event) => {
        if (!tool.method || !tool.instance) {
          console.warn(`[useToolBinding] Tool ${tool.name} missing method or instance`);
          return;
        }
        
        // Extract value from event based on element type
        let value: any;
        const target = event.target as HTMLElement;
        
        if (target instanceof HTMLInputElement) {
          if (target.type === 'checkbox') {
            value = target.checked;
          } else if (target.type === 'radio') {
            value = target.value;
          } else {
            value = target.value;
          }
        } else if (target instanceof HTMLSelectElement) {
          value = target.value;
        } else if (target instanceof HTMLTextAreaElement) {
          value = target.value;
        }
        // For buttons and other elements, no value needed (void call)
        
        const options: ToolOptions = {
          // Storage will be added in next step
          // For now, tools get extracted value
        };
        
        try {
          // Call the actual decorated method with extracted value
          const result = value !== undefined 
            ? await tool.method.call(tool.instance, value, options)
            : await tool.method.call(tool.instance, options);
          
          console.log(`[useToolBinding] Tool ${tool.name} executed successfully`, result);
        } catch (error) {
          console.error(`[useToolBinding] Tool execution failed: ${tool.name}`, error);
        }
      };
      
      // 5. Wire up with appropriate event type
      // Use tool's actionType if specified, otherwise infer from element
      let eventType: string = tool.actionType || 'click';
      if (!tool.actionType) {
        if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
          eventType = 'change';
        }
      }
      
      console.log(`[useToolBinding] Wiring ${testId} with event: ${eventType}`);
      element.addEventListener(eventType, handler);
      handlers.push({ element, event: eventType, handler});
    });
    
    // 6. Cleanup
    return () => {
      handlers.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      ToolRegistry.unregisterInstance(storageKey);
    };
  }, [containerRef, containerTestId, instanceId]);
}
