/**
 * Architecture Initializer - Core Pattern
 * 
 * Generic initialization pattern for any application using Supernal Interface.
 * Takes container definitions and automatically:
 * 1. Registers them in NavigationGraph
 * 2. Creates navigation tools for each container
 * 3. Infers navigation edges from component names
 * 4. Provides a centralized navigation handler
 * 
 * This is the CORE pattern - apps just provide their container definitions.
 */

import { NavigationGraph } from '../navigation/NavigationGraph';
import { ContainerRegistry, type ContainerDefinition } from './Containers';

/**
 * Architecture configuration for an application
 */
export interface ArchitectureConfig<T extends Record<string, ContainerDefinition>> {
  /** Container definitions */
  containers: T;
  
  /** Component names (for inferring navigation edges) */
  components?: {
    GlobalNav?: Record<string, string>;
    [key: string]: Record<string, string> | undefined;
  };
  
  /** Custom navigation mapping (optional) */
  navToContainerMap?: Record<string, string>;
  
  /** Mirror tools between containers (optional) */
  mirrorTools?: Array<{ from: string; to: string }>;
  
  /** Enable auto-inference of navigation edges */
  autoInferEdges?: boolean;
}

/**
 * Initialize application architecture
 * 
 * Call this once on app startup to register containers and create navigation tools.
 * 
 * @example
 * ```typescript
 * // In your app's architecture/index.ts
 * import { initializeArchitecture } from '@supernal-interface/core';
 * import { MyContainers } from './MyContainers';
 * import { Components } from './MyComponentNames';
 * 
 * export const { createNavigationHandler } = initializeArchitecture({
 *   containers: MyContainers,
 *   components: { GlobalNav: Components.GlobalNav },
 *   autoInferEdges: true
 * });
 * ```
 */
export function initializeArchitecture<T extends Record<string, ContainerDefinition>>(
  config: ArchitectureConfig<T>
) {
  const graph = NavigationGraph.getInstance();
  let initialized = false;
  
  return {
    /**
     * Initialize the architecture (call once)
     * Returns true if this was the first initialization
     */
    initialize(): boolean {
      if (initialized) return false;
      initialized = true;
      
      // 1. Register all containers in both NavigationGraph and ContainerRegistry
      const containers = Object.values(config.containers);

      // Register in ContainerRegistry (for ToolRegistry scope resolution)
      ContainerRegistry.registerContainers(config.containers);

      // Register in NavigationGraph (for navigation)
      for (const container of containers) {
        graph.registerContext({
          id: container.id,
          name: container.name,
          parent: 'parent' in container ? container.parent : undefined,
          children: [],
          tools: [...container.components],
          metadata: {
            type: container.type,
            route: 'route' in container ? container.route : undefined,
            description: container.description
          }
        });

        console.log(`📦 [Architecture] Registered container: ${container.name}`);
      }
      
      // 2. Mirror tools between containers (if specified)
      if (config.mirrorTools) {
        for (const { from, to } of config.mirrorTools) {
          const sourceContext = graph.getContext(from);
          if (sourceContext && sourceContext.tools) {
            for (const toolId of sourceContext.tools) {
              graph.registerToolInContext(toolId, to);
            }
            console.log(`🔄 [Architecture] Mirrored ${sourceContext.tools.length} tools: ${from} → ${to}`);
          }
        }
      }
      
      // 3. Auto-infer navigation edges (if enabled)
      if (config.autoInferEdges && config.components?.GlobalNav && config.navToContainerMap) {
        const edges = inferNavigationEdges(
          containers,
          config.components.GlobalNav,
          config.navToContainerMap,
          config.containers
        );
        
        for (const edge of edges) {
          graph.registerEdge(edge);
        }
        
        console.log(`✅ [Architecture] Initialized with ${containers.length} containers, ${edges.length} edges`);
      }
      
      return true;
    },
    
    /**
     * Create a navigation handler that uses the registered routes
     * 
     * @param router - Next.js router or any router with a push method
     * @returns Navigation handler function
     */
    createNavigationHandler(router?: { push: (route: string) => void | Promise<void> }) {
      return (pageName: string) => {
        console.log(`🗺️  [Navigation] Request: ${pageName}`);
        
        // Use NavigationGraph to resolve route
        const routeInfo = graph.getRouteByName(pageName);
        
        if (!routeInfo) {
          console.warn(`⚠️  [Navigation] No route found for: ${pageName}`);
          
          // Try treating as a path (e.g., "blog/type-safe")
          if (pageName.includes('/')) {
            const attemptedPath = pageName.startsWith('/') ? pageName : `/${pageName}`;
            console.log(`🗺️  [Navigation] Attempting path: ${attemptedPath}`);
            
            if (router?.push) {
              router.push(attemptedPath);
            } else if (typeof window !== 'undefined') {
              window.location.href = attemptedPath;
            }
          }
          return;
        }
        
        // Extract path from RouteInfo
        const route = routeInfo.path || routeInfo.name || pageName;
        console.log(`🗺️  [Navigation] Resolved: ${pageName} → ${route}`);
        
        // Navigate using provided router or fallback to window.location
        if (router?.push) {
          router.push(route);
        } else if (typeof window !== 'undefined') {
          window.location.href = route;
        }
      };
    },
    
    /**
     * Get the NavigationGraph instance (for advanced usage)
     */
    getGraph() {
      return graph;
    }
  };
}

/**
 * Infer navigation edges from global navigation components
 * 
 * @internal
 */
function inferNavigationEdges(
  containers: ContainerDefinition[],
  globalNav: Record<string, string>,
  navToContainerMap: Record<string, string>,
  containerMap: Record<string, ContainerDefinition>
): Array<{ from: string; to: string; navigationTool: string; cost: number }> {
  const edges: Array<{ from: string; to: string; navigationTool: string; cost: number }> = [];
  
  // Create edges FROM every container TO every other container via GlobalNav
  for (const [navKey, navButtonId] of Object.entries(globalNav)) {
    const targetContainerName = navToContainerMap[navKey];
    const targetContainer = containerMap[targetContainerName];
    
    if (targetContainer) {
      // From every container (except target) to target
      for (const sourceContainer of containers) {
        if (sourceContainer.id !== targetContainer.id) {
          edges.push({
            from: sourceContainer.id,
            to: targetContainer.id,
            navigationTool: navButtonId,
            cost: 1
          });
        }
      }
    }
  }
  
  return edges;
}

/**
 * Auto-initialize on module load (for convenience)
 * Apps can call this manually if they prefer explicit initialization
 */
export function createAutoInitializer<T extends Record<string, ContainerDefinition>>(
  config: ArchitectureConfig<T>
) {
  let hasInitialized = false;
  
  const { initialize, ...rest } = initializeArchitecture(config);
  
  // Auto-initialize on first access
  if (!hasInitialized) {
    hasInitialized = initialize();
  }
  
  return { initialize, ...rest };
}

