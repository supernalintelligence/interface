/**
 * Discoverable Tool Provider Interface
 *
 * Extends the base ToolProvider with classification and discovery capabilities.
 * Provides methods for intelligent tool discovery and metadata management.
 */

// Simple ToolProvider interface (originally from context/ToolProvider)
interface ToolProvider {
  name: string;
  description?: string;
  version?: string;
}
import { ClassifiedTool } from './ClassifiedTool';

/**
 * Tool provider with classification and discovery capabilities
 */
export interface DiscoverableToolProvider extends ToolProvider {
  /**
   * Get all classified tools available from this provider
   * @returns Array of classified tool definitions
   */
  getAvailableTools(): ClassifiedTool[];

  /**
   * Get metadata about this tool provider
   * @returns An object containing metadata
   */
  getMetadata(): Record<string, any>;

  /**
   * Check if a specific tool is enabled
   * @param toolId The unique identifier of the tool
   * @returns True if the tool is enabled
   */
  isToolEnabled(toolId: string): boolean;

  /**
   * Enable or disable a specific tool
   * @param toolId The unique identifier of the tool
   * @param enabled Whether the tool should be enabled
   */
  setToolEnabled(toolId: string, enabled: boolean): void;

  /**
   * Get the list of recently used tools
   * @param limit Maximum number of tools to return
   * @returns Array of recently used tool IDs
   */
  getRecentTools?(limit?: number): string[];

  /**
   * Get tools filtered by category
   * @param category Tool category to filter by
   * @returns Array of tools in the specified category
   */
  getToolsByCategory?(category: string): ClassifiedTool[];

  /**
   * Search tools by keywords or tags
   * @param query Search query
   * @returns Array of matching tools
   */
  searchTools?(query: string): ClassifiedTool[];
}
