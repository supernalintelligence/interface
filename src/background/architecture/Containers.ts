/**
 * Architecture Definition: Containers
 * 
 * Single source of truth for application containers (pages, modals, sections).
 * This file defines the navigation graph structure of the application.
 * 
 * Pattern: Like ComponentNames, but for high-level navigation boundaries.
 * 
 * NOTE: This is the CORE library. Applications should define their own containers
 * in their own codebase and register them with NavigationGraph.
 */

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
