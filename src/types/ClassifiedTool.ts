/**
 * Classified Tool Interface
 *
 * Extends the base Tool interface with classification metadata for
 * intelligent discovery, organization, and context-aware selection.
 */

import { Tool, ToolCategory } from './Tool';

/**
 * Access levels for tool execution
 */
export enum ToolAccessLevel {
  INTERNAL = 'internal', // Agent memory/state management
  EXTERNAL = 'external', // External system interactions
  HYBRID = 'hybrid', // Both internal and external
}

/**
 * Permission tiers for safety classification
 */
export enum ToolPermissionTier {
  SAFE = 'safe', // No side effects, read-only
  MODERATE = 'moderate', // Limited side effects
  SENSITIVE = 'sensitive', // Significant side effects
  SYSTEM = 'system', // System-level operations
}

/**
 * Tool usage frequency for optimization
 */
export enum ToolFrequency {
  VERY_HIGH = 'very-high', // Used constantly
  HIGH = 'high', // Used frequently
  MEDIUM = 'medium', // Used occasionally
  LOW = 'low', // Used rarely
  SPECIALIZED = 'specialized', // Used in specific scenarios
}

/**
 * Tool complexity levels
 */
export enum ToolComplexity {
  SIMPLE = 'simple', // Single operation
  MODERATE = 'moderate', // Few parameters
  COMPLEX = 'complex', // Many parameters/steps
  ADVANCED = 'advanced', // Requires expertise
}

/**
 * Enhanced tool interface with classification metadata
 */
export interface ClassifiedTool extends Tool {
  // Classification
  category: ToolCategory;
  accessLevel: ToolAccessLevel;
  permissionTier: ToolPermissionTier;

  // Discovery metadata
  tags: string[];
  keywords: string[];
  useCases: string[];

  // Relationships
  relatedTools?: string[]; // IDs of related tools
  prerequisites?: string[]; // Required tools/conditions

  // Usage patterns
  frequency: ToolFrequency;
  complexity: ToolComplexity;

  // Context awareness
  contextTypes?: string[]; // Which contexts this tool applies to
  sitePatterns?: string[]; // URL patterns for site-specific tools
}
