/**
 * Architecture Registry
 * 
 * Global registry for auto-discovery of components, containers, and their relationships.
 * Enables zero-config initialization through convention over configuration.
 */

interface ComponentRegistry {
  prefix: string;
  names: Record<string, string>;
}

interface ContainerRegistry {
  name: string;
  config: any;
}

class ArchitectureRegistry {
  private components = new Map<string, ComponentRegistry>();
  private containers = new Map<string, ContainerRegistry>();
  
  /**
   * Register a component namespace
   */
  registerComponent(prefix: string, names: Record<string, string>) {
    this.components.set(prefix, { prefix, names });
  }
  
  /**
   * Register a container
   */
  registerContainer(name: string, config: any) {
    this.containers.set(name, { name, config });
  }
  
  /**
   * Get all registered components
   */
  getComponents(): Record<string, Record<string, string>> {
    const result: Record<string, Record<string, string>> = {};
    this.components.forEach(({ prefix, names }) => {
      // Use PascalCase for namespace (Blog, Demo, etc.)
      const namespace = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      result[namespace] = names;
    });
    return result;
  }
  
  /**
   * Get all registered containers
   */
  getContainers(): Record<string, any> {
    const result: Record<string, any> = {};
    this.containers.forEach(({ name, config }) => {
      result[name] = config;
    });
    return result;
  }
  
  /**
   * Get all registered data
   */
  getAll() {
    return {
      components: this.getComponents(),
      containers: this.getContainers(),
    };
  }
  
  /**
   * Clear all registrations (useful for testing)
   */
  clear() {
    this.components.clear();
    this.containers.clear();
  }
  
  /**
   * Check if a component namespace is registered
   */
  hasComponent(prefix: string): boolean {
    return this.components.has(prefix);
  }
  
  /**
   * Check if a container is registered
   */
  hasContainer(name: string): boolean {
    return this.containers.has(name);
  }
}

/**
 * Singleton registry instance
 */
export const architectureRegistry = new ArchitectureRegistry();

/**
 * Infer navigation-to-container mapping from registered containers
 * Convention: lowercase nav key → PascalCase container name
 * 
 * Examples:
 * - 'blog' → 'Blog'
 * - 'demo' → 'Demo'
 * - 'examples' → 'Examples'
 */
export function inferNavToContainerMap(
  navKeys: Record<string, string>,
  containers: Record<string, any>
): Record<string, string> {
  const map: Record<string, string> = {};
  
  for (const navKey of Object.keys(navKeys)) {
    // Try direct PascalCase match
    const pascalKey = navKey.charAt(0).toUpperCase() + navKey.slice(1);
    if (containers[pascalKey]) {
      map[navKey] = pascalKey;
      continue;
    }
    
    // Try finding by route match
    for (const [containerName, container] of Object.entries(containers)) {
      if (container.route && container.route.includes(navKey)) {
        map[navKey] = containerName;
        break;
      }
    }
  }
  
  return map;
}

