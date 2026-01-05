/**
 * Zero-Config Architecture Initialization
 * 
 * Automatically discovers and initializes architecture from registered components and containers.
 * Uses convention over configuration to eliminate boilerplate.
 */

import { architectureRegistry, inferNavToContainerMap } from './registry';
import { NavigationGraph } from '../background/navigation/NavigationGraph';

export interface ArchitectureOptions {
  /**
   * Override auto-inferred navigation mapping
   */
  navToContainerMap?: Record<string, string>;
  
  /**
   * Enable automatic edge inference
   */
  autoInferEdges?: boolean;
  
  /**
   * Mirror tools between containers (for shared components)
   */
  mirrorTools?: Array<{ from: string; to: string }>;
  
  /**
   * Custom initialization logic
   */
  onInitialize?: (graph: NavigationGraph) => void;
}

export interface InitializedArchitecture {
  /**
   * Initialize the architecture (call this once on app startup)
   */
  initialize: () => void;
  
  /**
   * Create a navigation handler for page routing
   */
  createNavigationHandler: (router: any) => (page: string) => void;
  
  /**
   * Get the navigation graph
   */
  getGraph: () => NavigationGraph;
  
  /**
   * Get all registered components
   */
  getComponents: () => Record<string, Record<string, string>>;
  
  /**
   * Get all registered containers
   */
  getContainers: () => Record<string, any>;
}

/**
 * Initialize architecture from registered components and containers
 * 
 * @example
 * ```typescript
 * // After importing component/container definitions:
 * export const DemoArchitecture = initializeArchitecture({
 *   autoInferEdges: true,
 * });
 * 
 * // In your app:
 * DemoArchitecture.initialize();
 * ```
 */
export function initializeArchitecture(
  options: ArchitectureOptions = {}
): InitializedArchitecture {
  
  const components = architectureRegistry.getComponents();
  const containers = architectureRegistry.getContainers();
  
  // Auto-infer navigation mapping if not provided
  const navToContainerMap = options.navToContainerMap || 
    inferNavToContainerMap(components.GlobalNav || {}, containers);
  
  const graph = NavigationGraph.getInstance();
  let initialized = false;
  
  return {
    initialize() {
      if (initialized) {
        // eslint-disable-next-line no-console
        console.warn('Architecture already initialized');
        return;
      }
      
      // Register containers as navigation contexts
      for (const container of Object.values(containers)) {
        graph.registerContext({
          id: container.id,
          name: container.name,
          children: [],
          tools: [],
          metadata: {
            type: container.type,
            route: container.route,
            description: container.description,
            ...container.metadata,
          },
        });
      }
      
      // Register navigation edges (GlobalNav → Containers)
      if (components.GlobalNav) {
        for (const [navKey] of Object.entries(components.GlobalNav)) {
          const containerName = navToContainerMap[navKey];
          if (containerName && containers[containerName]) {
            graph.registerEdge({
              from: 'global',
              to: containers[containerName].id,
              navigationTool: `navigate-to-${containers[containerName].id}`,
            });
          }
        }
      }
      
      // Custom initialization logic
      if (options.onInitialize) {
        options.onInitialize(graph);
      }
      
      initialized = true;
      // eslint-disable-next-line no-console
      console.log('✓ Architecture initialized', {
        components: Object.keys(components).length,
        containers: Object.keys(containers).length,
        navMappings: Object.keys(navToContainerMap).length,
      });
    },
    
    createNavigationHandler(router: any) {
      return (page: string) => {
        const containerName = navToContainerMap[page.toLowerCase()];
        if (containerName && containers[containerName]) {
          const route = containers[containerName].route;
          if (route) {
            router.push(route);
          }
        }
      };
    },
    
    getGraph() {
      return graph;
    },
    
    getComponents() {
      return components;
    },
    
    getContainers() {
      return containers;
    },
  };
}

/**
 * Create an auto-initializer with explicit configuration (legacy support)
 * 
 * @deprecated Use initializeArchitecture() for zero-config approach
 */
export function createAutoInitializer(config: {
  containers: Record<string, any>;
  components: Record<string, any>;
  navToContainerMap?: Record<string, string>;
  autoInferEdges?: boolean;
  mirrorTools?: Array<{ from: string; to: string }>;
}): InitializedArchitecture {
  // Register provided components and containers
  for (const [namespace, names] of Object.entries(config.components)) {
    const prefix = namespace.toLowerCase();
    architectureRegistry.registerComponent(prefix, names);
  }
  
  for (const [name, container] of Object.entries(config.containers)) {
    architectureRegistry.registerContainer(name, container);
  }
  
  // Use standard initialization
  return initializeArchitecture({
    navToContainerMap: config.navToContainerMap,
    autoInferEdges: config.autoInferEdges,
    mirrorTools: config.mirrorTools,
  });
}

