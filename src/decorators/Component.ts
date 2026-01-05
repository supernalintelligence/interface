/**
 * Component Decorator - Component Namespace Pattern
 * 
 * Registers all @Tool methods under this component's namespace.
 * Provides scoping via containerId for locality resolution.
 * 
 * @example
 * ```typescript
 * @Component({
 *   name: 'counter',
 *   containerId: 'Examples',
 *   elementId: 'counter-widget'
 * })
 * export class Counter {
 *   @Tool({ aiEnabled: true })
 *   increment(amount = 1) { }
 * }
 * // Registers: counter.increment (Examples scope)
 * ```
 */

import { ToolRegistry } from '../background/registry/ToolRegistry';
import { ToolMetadata } from './Tool';
import { ComponentRegistry } from '../background/registry/ComponentRegistry';
import { isStatefulComponent } from '../interfaces/StatefulComponent';

export interface ComponentConfig {
  /**
   * Component name (namespace)
   * Must be unique within containerId
   * Use lowercase kebab-case: 'counter', 'user-form', 'settings-panel'
   */
  name: string;
  
  /**
   * Container/page this component belongs to
   * Used for scoped tool resolution (local > global)
   */
  containerId?: string;
  
  /**
   * Root element ID (data-testid)
   * Points to component's container element
   */
  elementId?: string;
  
  /**
   * Component description
   */
  description?: string;
  
  /**
   * Whether this component is stateful
   * Helps AI understand tool methods modify shared state
   */
  stateful?: boolean;
}

export function Component(config: ComponentConfig) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    const componentName = config.name;
    
    // Validate component name
    if (!/^[a-z][a-z0-9-]*$/.test(componentName)) {
      throw new Error(
        `Component name '${componentName}' must be lowercase kebab-case`
      );
    }
    
    // Get all @Tool methods from class prototype
    const tools = (constructor.prototype.__tools__ || []) as ToolMetadata[];
    
    if (tools.length === 0) {
      console.warn(
        `⚠️  Component '${componentName}' has no @Tool methods. ` +
        `Did you forget to decorate methods with @Tool()?`
      );
    }
    
    // Register each tool under component namespace
    tools.forEach((toolMetadata: ToolMetadata) => {
      // Start with the full tool metadata from @Tool decorator
      const enhancedMetadata: ToolMetadata = {
        ...toolMetadata, // Preserve ALL fields from @Tool
        // Add/override component-specific fields
        componentName,
        containerId: config.containerId || toolMetadata.containerId,
        elementId: toolMetadata.elementId || config.elementId,
        stateful: config.stateful,
        // Only override description if tool didn't provide one
        description: toolMetadata.description || 
                    `${config.description || componentName}.${toolMetadata.methodName}`,
      };
      
      // Update the existing tool registered by @Tool (registered as ClassName.methodName)
      // We update it IN PLACE rather than creating a new registration
      const classBasedToolId = `${toolMetadata.providerClass || constructor.name}.${toolMetadata.methodName}`;
      const existingTool = ToolRegistry.getTool(classBasedToolId);
      
      if (existingTool) {
        // Merge ALL enhanced metadata into existing tool
        Object.assign(existingTool, enhancedMetadata);
        
        console.log(
          `📦 [Component] Enhanced: ${classBasedToolId} with component namespace '${componentName}'` +
          (config.containerId ? ` (${config.containerId})` : '')
        );
      } else {
        // Fallback: Register as new if class-based tool doesn't exist
        ToolRegistry.registerTool(
          componentName,           // Provider is component name
          toolMetadata.methodName, // Method name
          enhancedMetadata
        );
        
        console.log(
          `📦 [Component] Registered: ${componentName}.${toolMetadata.methodName}` +
          (config.containerId ? ` (${config.containerId})` : '')
        );
      }
    });
    
    // Store component config on class
    (constructor as any).__componentConfig__ = config;
    
    // Week 2: Auto-register stateful components
    if (config.stateful) {
      // Return wrapped constructor that registers instance on creation
      return class extends constructor {
        constructor(...args: any[]) {
          super(...args);
          
          // Check if instance implements StatefulComponent interface
          if (isStatefulComponent(this)) {
            ComponentRegistry.registerInstance(componentName, this);
          } else {
            console.warn(
              `⚠️  Component '${componentName}' is marked as stateful but doesn't implement StatefulComponent interface`
            );
          }
        }
      } as T;
    }
    
    return constructor;
  };
}

/**
 * Get component configuration for a class
 */
export function getComponentConfig(target: any): ComponentConfig | undefined {
  return target.constructor?.__componentConfig__;
}

/**
 * Check if a class is a component
 */
export function isComponent(target: any): boolean {
  return !!target.constructor?.__componentConfig__;
}
