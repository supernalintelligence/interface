/**
 * Container HOC - marks components as navigation containers
 *
 * Wraps a React component to automatically:
 * 1. Register in RuntimeTreeBuilder component hierarchy
 * 2. Update NavigationGraph current context
 * 3. Update LocationContext with visible elements
 * 4. Track container lifecycle (mount/unmount)
 *
 * Zero boilerplate - just wrap your page/modal component.
 */

import { useEffect } from 'react';
import { TreeBuilder } from '../background/navigation/RuntimeTreeBuilder';
import { NavigationGraph } from '../background/navigation/NavigationGraph';
import { LocationContext } from '../background/location/LocationContext';

/**
 * Scan the DOM for visible elements with data-testid attributes
 */
function getVisibleElements(): string[] {
  if (typeof document === 'undefined') return [];

  const elements = document.querySelectorAll('[data-testid]');
  return Array.from(elements)
    .map(el => el.getAttribute('data-testid'))
    .filter(Boolean) as string[];
}

/**
 * Hook to mark a component as a container
 * Call this at the top of your component function
 *
 * @param containerName - Name of the container (must match Containers.ts)
 *
 * @example
 * ```typescript
 * export function DemoPage() {
 *   useContainer('Demo');
 *   return <div>...</div>;
 * }
 * ```
 */
export function useContainer(containerName: string): void {
  useEffect(() => {
    // Register container
    TreeBuilder.enterComponent(containerName);
    const graph = NavigationGraph.getInstance();
    graph.setCurrentContext(containerName);

    // DO NOT touch LocationContext here - let useLocationTracking handle it
    // Calling LocationContext.setCurrent() here creates a race condition
    // that clears the elements array populated by useLocationTracking

    console.log(`📦 [Container] Registered: ${containerName}`);

    // Cleanup on unmount
    return () => {
      TreeBuilder.exitComponent();
      console.log(`📦 [Container] Unregistered: ${containerName}`);
    };
  }, [containerName]);
}

