/**
 * Container HOC - marks components as navigation containers
 * 
 * Wraps a React component to automatically:
 * 1. Register in RuntimeTreeBuilder component hierarchy
 * 2. Update NavigationGraph current context
 * 3. Track container lifecycle (mount/unmount)
 * 
 * Zero boilerplate - just wrap your page/modal component.
 */

import { useEffect } from 'react';
import { TreeBuilder } from '../background/navigation/RuntimeTreeBuilder';
import { NavigationGraph } from '../background/navigation/NavigationGraph';

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
    
    console.log(`📦 [Container] Registered: ${containerName}`);
    
    // Cleanup on unmount
    return () => {
      TreeBuilder.exitComponent();
      console.log(`📦 [Container] Unregistered: ${containerName}`);
    };
  }, [containerName]);
}

