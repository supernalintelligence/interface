/**
 * Architecture Definition: Containers
 *
 * @deprecated Containers are deprecated in favor of zero-config element-based inference.
 * Tools are now automatically available based on element visibility, not manual container scoping.
 *
 * This file is kept for backwards compatibility only.
 * New projects should use zero-config inference instead.
 *
 * Pattern: Like ComponentNames, but for high-level navigation boundaries.
 *
 * NOTE: This is the CORE library. Applications should define their own containers
 * in their own codebase and register them with NavigationGraph.
 */

const DEBUG=false

/**
 * Container Definition
 * A container is a distinct navigation context (page, modal, drawer, etc.)
 */
export interface ContainerDefinition {
  /** Unique container identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Container type */
  type: 'page' | 'modal' | 'drawer' | 'tab' | 'section';
  
  /** Optional parent container (for nested contexts) */
  parent?: string;
  
  /** Route/path if applicable */
  route?: string;
  
  /** Component IDs available in this container */
  components: readonly string[];
  
  /** Description for documentation */
  description?: string;
}

/**
 * Type helper for container IDs (generic version)
 */
export type ContainerId = string;

/**
 * Get container definition by ID
 */
export function getContainer(containers: Record<string, ContainerDefinition>, id: string): ContainerDefinition | undefined {
  return containers[id];
}

/**
 * Get all container definitions
 */
export function getAllContainers(containers: Record<string, ContainerDefinition>): ContainerDefinition[] {
  return Object.values(containers);
}

/**
 * Check if a component belongs to a container
 */
export function isComponentInContainer(
  containers: Record<string, ContainerDefinition>,
  componentId: string,
  containerId: string
): boolean {
  const container = containers[containerId];
  return container?.components.includes(componentId) || false;
}

/**
 * Find which container(s) a component belongs to
 */
export function findComponentContainers(
  containers: Record<string, ContainerDefinition>,
  componentId: string
): string[] {
  return Object.keys(containers).filter(key => {
    const container = containers[key];
    return container.components.includes(componentId);
  });
}

/**
 * Global Container Registry
 *
 * Stores container definitions globally so ToolRegistry can resolve
 * containerIds to routes for scope matching.
 *
 * Similar pattern to ToolRegistry - uses global storage to avoid
 * module isolation issues in tests.
 */
const globalRegistry = (typeof global !== 'undefined' ? global : globalThis) as any;
if (!globalRegistry.__SUPERNAL_CONTAINER_REGISTRY__) {
  globalRegistry.__SUPERNAL_CONTAINER_REGISTRY__ = new Map<string, ContainerDefinition>();
}

export class ContainerRegistry {
  private static get containers(): Map<string, ContainerDefinition> {
    return globalRegistry.__SUPERNAL_CONTAINER_REGISTRY__;
  }

  /**
   * Register a container definition
   */
  static registerContainer(container: ContainerDefinition): void {
    this.containers.set(container.id, container);
  }

  /**
   * Register multiple containers
   */
  static registerContainers(containers: Record<string, ContainerDefinition>): void {
    DEBUG && console.log('[ContainerRegistry] 📦 Registering containers:', Object.keys(containers));
    Object.values(containers).forEach(container => {
      DEBUG && console.log(`[ContainerRegistry] 📦 Registering: ${container.id} → ${container.route}`);
      this.registerContainer(container);
    });
    DEBUG && console.log('[ContainerRegistry] 📦 Total registered:', this.containers.size);
  }

  /**
   * Get container definition by ID
   */
  static getContainer(containerId: string): ContainerDefinition | undefined {
    return this.containers.get(containerId);
  }

  /**
   * Get container route by ID
   *
   * Returns the route for a container, or undefined if not found.
   * Used by ToolRegistry to resolve containerIds to routes for scope matching.
   */
  static getContainerRoute(containerId: string): string | undefined {
    const route = this.containers.get(containerId)?.route;
    DEBUG && console.log(`[ContainerRegistry] 🔍 getContainerRoute("${containerId}") → ${route || 'NOT FOUND'} (registry size: ${this.containers.size})`);
    return route;
  }

  /**
   * Get all registered containers
   */
  static getAllContainers(): ContainerDefinition[] {
    return Array.from(this.containers.values());
  }

  /**
   * Clear all registered containers (for testing)
   */
  static clear(): void {
    this.containers.clear();
  }
}
