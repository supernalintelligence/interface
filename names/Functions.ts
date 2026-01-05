/**
 * Function Names - Hierarchical ID Contracts
 * 
 * This file defines stable, hierarchical ID constants for pure functions.
 * Utilities import these IDs before tools are generated, establishing
 * a contract between computational functions and the tool system.
 * 
 * Pattern: Functions.Category.Operation
 */

export const Functions = {
  /**
   * Mathematical Operations
   */
  Math: {
    add: 'func-math-add',
    subtract: 'func-math-subtract',
    multiply: 'func-math-multiply',
    divide: 'func-math-divide',
    calculate: 'func-math-calculate',
  },

  /**
   * String Operations
   */
  String: {
    format: 'func-string-format',
    capitalize: 'func-string-capitalize',
    truncate: 'func-string-truncate',
    slugify: 'func-string-slugify',
    sanitize: 'func-string-sanitize',
  },

  /**
   * Array Operations
   */
  Array: {
    filter: 'func-array-filter',
    map: 'func-array-map',
    reduce: 'func-array-reduce',
    sort: 'func-array-sort',
    deduplicate: 'func-array-deduplicate',
  },

  /**
   * Date Operations
   */
  Date: {
    format: 'func-date-format',
    parse: 'func-date-parse',
    diff: 'func-date-diff',
    add: 'func-date-add',
    isValid: 'func-date-is-valid',
  },

  /**
   * Validation Operations
   */
  Validation: {
    email: 'func-validation-email',
    url: 'func-validation-url',
    phone: 'func-validation-phone',
    zipCode: 'func-validation-zip-code',
    creditCard: 'func-validation-credit-card',
  },

  /**
   * Transformation Operations
   */
  Transform: {
    camelToSnake: 'func-transform-camel-to-snake',
    snakeToCamel: 'func-transform-snake-to-camel',
    jsonToCsv: 'func-transform-json-to-csv',
    csvToJson: 'func-transform-csv-to-json',
  },
} as const;

/**
 * Helper function to get all function IDs as a flat array
 */
export function getAllFunctionIds(): string[] {
  const ids: string[] = [];
  
  function collectIds(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        ids.push(obj[key]);
      } else if (typeof obj[key] === 'object') {
        collectIds(obj[key]);
      }
    }
  }
  
  collectIds(Functions);
  return ids;
}

/**
 * Helper function to validate function ID uniqueness
 */
export function validateFunctionIds(): { valid: boolean; duplicates: string[] } {
  const ids = getAllFunctionIds();
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
 * Type-safe function ID access
 */
export type FunctionPath = typeof Functions;
export type FunctionId = ReturnType<typeof getAllFunctionIds>[number];

