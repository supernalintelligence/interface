/**
 * Names Index - Export all name contracts
 * 
 * This is the main entry point for importing name contracts.
 * Components, services, and utilities import from this file to reference
 * stable IDs before tools are generated.
 * 
 * @example
 * import { Components, API, Functions } from '@supernal-interface/core/names';
 * 
 * // Use hierarchical names in components
 * <button data-testid={Components.Chat.sendButton}>Send</button>
 * 
 * // Use in @Tool decorators
 * @Tool({ toolId: Components.Chat.sendButton })
 * async handleSendClick() { ... }
 */

export * from './Components';
export * from './Containers';
export * from './API';
export * from './Functions';

import { Components, validateComponentIds, getAllComponentIds } from './Components';
import { Containers, validateContainerIds, getAllContainerIds } from './Containers';
import { API, validateAPIIds, getAllAPIIds } from './API';
import { Functions, validateFunctionIds, getAllFunctionIds } from './Functions';

/**
 * Validate all name contracts for uniqueness
 */
export function validateAllNames(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Validate component IDs
  const componentValidation = validateComponentIds();
  if (!componentValidation.valid) {
    errors.push(`Duplicate component IDs: ${componentValidation.duplicates.join(', ')}`);
  }
  
  // Validate container IDs
  const containerValidation = validateContainerIds();
  if (!containerValidation.valid) {
    errors.push(`Duplicate container IDs: ${containerValidation.duplicates.join(', ')}`);
  }
  
  // Validate API IDs
  const apiValidation = validateAPIIds();
  if (!apiValidation.valid) {
    errors.push(`Duplicate API IDs: ${apiValidation.duplicates.join(', ')}`);
  }
  
  // Validate function IDs
  const functionValidation = validateFunctionIds();
  if (!functionValidation.valid) {
    errors.push(`Duplicate function IDs: ${functionValidation.duplicates.join(', ')}`);
  }
  
  // Check for cross-category duplicates
  const allIds = [
    ...getAllComponentIds(),
    ...getAllContainerIds(),
    ...getAllAPIIds(),
    ...getAllFunctionIds(),
  ];
  
  const seen = new Set<string>();
  const crossDuplicates: string[] = [];
  
  for (const id of allIds) {
    if (seen.has(id)) {
      crossDuplicates.push(id);
    } else {
      seen.add(id);
    }
  }
  
  if (crossDuplicates.length > 0) {
    errors.push(`Cross-category duplicate IDs: ${crossDuplicates.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get statistics about name contracts
 */
export function getNameStats() {
  return {
    components: getAllComponentIds().length,
    containers: getAllContainerIds().length,
    api: getAllAPIIds().length,
    functions: getAllFunctionIds().length,
    total: getAllComponentIds().length + getAllContainerIds().length + getAllAPIIds().length + getAllFunctionIds().length,
  };
}

/**
 * Export namespace for convenient access
 */
export const Names = {
  Components,
  Containers,
  API,
  Functions,
  validate: validateAllNames,
  stats: getNameStats,
} as const;

