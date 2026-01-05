/**
 * Container Names - Context Boundary IDs
 * 
 * Containers define the namespace/scope where ToolProviders operate.
 * Each ToolProvider is bound to a container, which represents a modal, page, or section.
 * 
 * Hierarchy: ToolProvider → Container (namespace) → Tools → Components
 * 
 * Pattern: Containers.ContainerName = 'container-id'
 */

export const Containers = {
  /**
   * Chat container/modal
   * Used by: ChatTools provider
   */
  Chat: 'chat-container',

  /**
   * Widget gallery container
   * Used by: WidgetTools provider
   */
  Widgets: 'widgets-container',

  /**
   * Tool commands container
   * Used by: ToolCommandTools provider
   */
  ToolCommands: 'tool-commands-container',

  /**
   * Main modal container
   * Used by: ModalTools provider
   */
  Modal: 'modal-container',

  /**
   * Sidebar container
   * Used by: SidebarTools provider
   */
  Sidebar: 'sidebar-container',

  /**
   * Main application container
   * Used by: AppTools provider
   */
  App: 'app-container',

  /**
   * Settings container
   * Used by: SettingsTools provider
   */
  Settings: 'settings-container',

  /**
   * Dashboard container
   * Used by: DashboardTools provider
   */
  Dashboard: 'dashboard-container',

  /**
   * Workspace container
   * Used by: WorkspaceTools provider
   */
  Workspace: 'workspace-container',

  /**
   * Home/Landing page container
   * Used by: HomePageTools provider
   */
  HomePage: 'homepage-container',

  /**
   * Stories page container
   * Used by: Story execution and visualization
   */
  StoriesPage: 'stories-page-container',
} as const;

/**
 * Helper to get all container IDs
 */
export function getAllContainerIds(): string[] {
  return Object.values(Containers);
}

/**
 * Helper to validate container ID uniqueness
 */
export function validateContainerIds(): { valid: boolean; duplicates: string[] } {
  const ids = getAllContainerIds();
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.push(id);
    } else {
      seen.add(id);
    }
  }

  return {
    valid: duplicates.length === 0,
    duplicates,
  };
}

/**
 * Type-safe container ID access
 */
export type ContainerPath = typeof Containers;
export type ContainerId = (typeof Containers)[keyof typeof Containers];
