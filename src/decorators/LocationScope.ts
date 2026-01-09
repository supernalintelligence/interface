/**
 * @LocationScope Decorator
 * 
 * Declares the location scope for a tool - where it's available in the app.
 * 
 * Usage:
 * ```typescript
 * @ToolProvider('blog')
 * class BlogTools {
 *   @Tool()
 *   @LocationScope({ pages: ['/blog', '/posts'] })
 *   createPost() {
 *     // Only available on /blog or /posts pages
 *   }
 *   
 *   @Tool()
 *   @LocationScope({ global: true })
 *   search() {
 *     // Available everywhere
 *   }
 * }
 * ```
 */

import 'reflect-metadata';
import { LocationScope } from '../background/location/LocationContext';
import { ToolRegistry } from '../background/registry/ToolRegistry';

// Symbol for storing location scope metadata
const LOCATION_SCOPE_KEY = Symbol('locationScope');

/**
 * @LocationScope decorator
 * 
 * @param scope - Location scope definition
 * @returns Method decorator
 */
export function LocationScope(scope: LocationScope): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    // Store scope metadata on the method
    Reflect.defineMetadata(LOCATION_SCOPE_KEY, scope, target, propertyKey);
    
    return descriptor;
  };
}

/**
 * Get location scope for a method
 * 
 * @param target - Target object (class prototype)
 * @param propertyKey - Method name
 * @returns Location scope or undefined
 */
export function getLocationScope(
  target: any,
  propertyKey: string | symbol
): LocationScope | undefined {
  return Reflect.getMetadata(LOCATION_SCOPE_KEY, target, propertyKey);
}

/**
 * Check if method has location scope
 * 
 * @param target - Target object (class prototype)
 * @param propertyKey - Method name
 * @returns true if method has location scope
 */
export function hasLocationScope(
  target: any,
  propertyKey: string | symbol
): boolean {
  return Reflect.hasMetadata(LOCATION_SCOPE_KEY, target, propertyKey);
}
