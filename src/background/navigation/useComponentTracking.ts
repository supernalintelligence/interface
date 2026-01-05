/**
 * useComponentTracking - Minimal hook for container components
 * 
 * Usage: Add ONE LINE to each container component:
 *   useComponentTracking('ContainerName');
 * 
 * This tracks the component hierarchy for navigation and tool routing.
 */

import { useEffect } from 'react';
import { TreeBuilder } from './RuntimeTreeBuilder';

export function useComponentTracking(componentName: string): void {
  useEffect(() => {
    TreeBuilder.enterComponent(componentName);
    return () => TreeBuilder.exitComponent();
  }, [componentName]);
}

