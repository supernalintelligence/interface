/**
 * React Hook for NavigationGraph (REQ-005)
 * 
 * Provides easy access to navigation context and pathfinding in React components.
 */

import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { 
  NavigationGraph,
  NavigationContext,
  NavigationPath
} from "@supernal/interface/browser";

/**
 * React Context for current navigation context
 * 
 * Wrap your app/components with this provider to enable auto-context detection:
 * 
 * @example
 * <NavigationContextProvider value="dashboard">
 *   <Dashboard>
 *     <NavigationContextProvider value="dashboard.security">
 *       <SecurityTab />
 *     </NavigationContextProvider>
 *   </Dashboard>
 * </NavigationContextProvider>
 */
export const NavigationContextContext = createContext<string>('global');

export function NavigationContextProvider({ 
  value, 
  children 
}: { 
  value: string; 
  children: React.ReactNode;
}) {
  const graph = useNavigationGraph();

  useEffect(() => {
    // Update NavigationGraph when context changes
    graph.setCurrentContext(value);
  }, [value, graph]);

  return (
    <NavigationContextContext.Provider value={value}>
      {children}
    </NavigationContextContext.Provider>
  );
}

/**
 * Hook to access the NavigationGraph singleton
 */
export function useNavigationGraph() {
  return NavigationGraph.getInstance();
}

/**
 * Hook to get the current navigation context
 * 
 * @example
 * const currentContext = useCurrentContext();
 * console.log(currentContext); // 'dashboard.security'
 */
export function useCurrentContext() {
  // Try to read from React Context first (if wrapped in NavigationContextProvider)
  const contextFromProvider = useContext(NavigationContextContext);
  
  const graph = useNavigationGraph();
  // Stub NavigationGraph doesn't have getCurrentContext - use empty string as default
  const [graphContext, setGraphContext] = useState<string>('');

  useEffect(() => {
    // Poll for context changes (in case it's set outside React)
    // Note: Stub NavigationGraph doesn't support getCurrentContext
    // This will work with enterprise version
    const interval = setInterval(() => {
      // @ts-ignore - enterprise version has this method
      const current = graph.getCurrentContext?.() || '';
      if (current !== graphContext) {
        setGraphContext(current);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [graph, graphContext]);

  // Prefer React Context provider value over graph state
  return contextFromProvider !== 'global' ? contextFromProvider : graphContext;
}

/**
 * Hook to register a tool in a navigation context
 * 
 * @param toolId - Unique tool identifier
 * @param contextId - Optional: explicit context ID (otherwise uses current context)
 * @param metadata - Optional: metadata for auto-detection
 * 
 * @example
 * // Auto-registers in current context
 * useRegisterTool('enable-2fa');
 * 
 * // Or explicit context
 * useRegisterTool('enable-2fa', 'dashboard.security');
 * 
 * // Or with auto-detection metadata
 * useRegisterTool('enable-2fa', undefined, {
 *   filePath: 'src/pages/dashboard/SecurityTab.tsx'
 * });
 */
export function useRegisterTool(
  toolId: string,
  contextId?: string,
  metadata?: {
    filePath?: string;
    componentName?: string;
    element?: Element;
  }
) {
  const graph = useNavigationGraph();
  const currentContext = useCurrentContext();

  useEffect(() => {
    // Determine context
    let targetContext = contextId || currentContext;

    // Try auto-detection if metadata provided
    // Note: detectToolContext is enterprise-only
    if (!contextId && metadata) {
      // @ts-ignore - enterprise version has this method
      const detection = (graph as any).detectToolContext?.(toolId, metadata);
      if (detection && detection.confidence > 0.5) {
        targetContext = detection.contextId;
      }
    }

    // Register tool in context
    graph.registerToolInContext(toolId, targetContext);

    // Note: We don't unregister on unmount because tools might be needed
    // for navigation even when component is unmounted
  }, [toolId, contextId, currentContext, metadata, graph]);
}

/**
 * Hook to compute navigation path from current context to target
 * 
 * @param targetContextOrToolId - Target context ID or tool ID
 * @param isToolId - Whether the target is a tool ID (will lookup context)
 * 
 * @example
 * const { path, loading, error } = useNavigationPath('dashboard.security');
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * if (!path) return <div>Cannot navigate</div>;
 * 
 * return (
 *   <div>
 *     Path: {path.steps.map(s => s.navigationTool).join(' → ')}
 *   </div>
 * );
 */
export function useNavigationPath(
  targetContextOrToolId: string,
  isToolId: boolean = false
) {
  const graph = useNavigationGraph();
  const currentContext = useCurrentContext();
  const [path, setPath] = useState<NavigationPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    try {
      // Determine target context
      let targetContext = targetContextOrToolId;
      
      if (isToolId) {
        const toolContext = (graph as any).getToolContext?.(targetContextOrToolId);
        if (!toolContext) {
          setError(`Tool "${targetContextOrToolId}" not found in any context`);
          setLoading(false);
          return;
        }
        targetContext = toolContext;
      }

      // Compute path
      const computedPath = (graph as any).computePath?.(currentContext, targetContext);
      setPath(computedPath);
      setLoading(false);

      if (!computedPath) {
        setError(`No path from "${currentContext}" to "${targetContext}"`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }, [targetContextOrToolId, isToolId, currentContext, graph]);

  return { path, loading, error };
}

/**
 * Hook to execute navigation to a target context
 * 
 * @example
 * const { navigateTo, navigating, error } = useNavigate();
 * 
 * const handleClick = async () => {
 *   const success = await navigateTo('dashboard.security');
 *   if (success) {
 *     console.log('Navigation complete!');
 *   }
 * };
 */
export function useNavigate() {
  const graph = useNavigationGraph();
  const currentContext = useCurrentContext();
  const [navigating, setNavigating] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const navigateTo = useCallback(async (
    targetContextOrToolId: string,
    isToolId: boolean = false,
    executeNavigation?: (toolId: string) => Promise<void>
  ): Promise<boolean> => {
    setNavigating(true);
    setError(undefined);

    try {
      // Determine target context
      let targetContext = targetContextOrToolId;
      
      if (isToolId) {
        const toolContext = (graph as any).getToolContext?.(targetContextOrToolId);
        if (!toolContext) {
          throw new Error(`Tool "${targetContextOrToolId}" not found in any context`);
        }
        targetContext = toolContext;
      }

      // Already at target
      if (currentContext === targetContext) {
        setNavigating(false);
        return true;
      }

      // Compute path
      const path = (graph as any).computePath?.(currentContext, targetContext);
      
      if (!path) {
        throw new Error(`No path from "${currentContext}" to "${targetContext}"`);
      }

      // Execute navigation steps
      for (const step of path.steps) {
        if (executeNavigation) {
          await executeNavigation(step.navigationTool);
        }
        // If no executeNavigation callback provided, skip actual navigation

        // Wait for context change
        const changed = await (graph as any).waitForContextChange?.(step.to, 3000);
        if (!changed) {
          throw new Error(`Navigation to "${step.to}" failed - context did not change`);
        }
      }

      setNavigating(false);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      setNavigating(false);
      return false;
    }
  }, [currentContext, graph]);

  return { navigateTo, navigating, error };
}

/**
 * Hook to get all navigation contexts (for debugging/admin UI)
 * 
 * @example
 * const contexts = useAllContexts();
 * 
 * return (
 *   <ul>
 *     {contexts.map(ctx => (
 *       <li key={ctx.id}>
 *         {ctx.name} - {ctx.tools.length} tools
 *       </li>
 *     ))}
 *   </ul>
 * );
 */
export function useAllContexts() {
  const graph = useNavigationGraph();
  const [contexts, setContexts] = useState<NavigationContext[]>((graph as any).getAllContexts?.());

  useEffect(() => {
    // Poll for context changes (no event system in NavigationGraph yet)
    const interval = setInterval(() => {
      setContexts((graph as any).getAllContexts?.());
    }, 1000);

    return () => clearInterval(interval);
  }, [graph]);

  return contexts;
}

