// Generated from: 2025-12-27-implementation.md
// Generated on: 2025-12-28
// DO NOT EDIT - Regenerate from documentation if changes needed

/**
 * Configuration for route contract generation
 * 
 * This config lives in the target project (e.g., apps/my-dashboard/route-contracts.config.ts)
 * and tells the generator where to find routes and where to output contracts.
 */

/**
 * Route information structure
 */
export interface RouteInfo {
  id: string;
  pattern: string;
  params: string[];
  metadata?: {
    description?: string;
    source?: string;
    [key: string]: any;
  };
}

export interface RouteContractsConfig {
  /**
   * Type of routing system
   * Determines which scanner to use
   */
  routingSystem: 'nextjs-dynamic' | 'nextjs-pages' | 'react-router' | 'custom' | 'manual' | 'nextjs-name-extraction';

  /**
   * Manual route specification (optional)
   * Use this for non-standard routing systems or when scanner can't detect routes
   */
  routes?: RouteInfo[];

  /**
   * Paths to scan for route definitions (relative to project root)
   */
  scanPaths: {
    /** Where to find route definitions (e.g., src/app for Next.js 14) */
    routes?: string[];
    
    /** Where to find route config files (e.g., routing.config.ts) */
    configs?: string[];
    
    /** Where to find view/page components */
    components?: string[];
  };

  /**
   * Output configuration
   */
  output: {
    /** Where to write Routes.ts (relative to project root) */
    contractsPath: string;
    
    /** Where to write test utilities (optional) */
    testUtilsPath?: string;
    
    /** TypeScript module format */
    moduleFormat?: 'esm' | 'commonjs';
  };

  /**
   * Route extraction patterns (for custom routing systems)
   */
  extraction?: {
    /** Regex patterns to find route definitions */
    patterns?: string[];
    
    /** File extensions to scan */
    extensions?: string[];
    
    /** Custom scanner function (advanced) */
    customScanner?: string; // Path to custom scanner module
  };

  /**
   * Generation options
   */
  generation?: {
    /** Include JSDoc comments */
    includeJsDocs?: boolean;
    
    /** Add validation helpers */
    includeValidation?: boolean;
    
    /** Add type guards */
    includeTypeGuards?: boolean;
    
    /** Default parameter values (per route) */
    defaults?: Record<string, any>;
  };

  /**
   * Migration options
   */
  migration?: {
    /** Patterns to detect routes in code */
    detectPatterns?: string[];
    
    /** File patterns to migrate */
    filePatterns?: string[];
    
    /** Dry run by default */
    dryRun?: boolean;
  };
}

/**
 * Example config for Next.js 14 app with dynamic routing
 */
export const exampleNextjsConfig: RouteContractsConfig = {
  routingSystem: 'nextjs-dynamic',
  scanPaths: {
    routes: ['src/app'],
    configs: ['src/lib/routing'],
    components: ['src/components/views'],
  },
  output: {
    contractsPath: 'src/lib/routing/Routes.ts',
    testUtilsPath: 'tests/utils/routes.ts',
    moduleFormat: 'esm',
  },
  generation: {
    includeJsDocs: true,
    includeValidation: true,
    defaults: {
      repo: 'default-repo',
      branch: 'main',
    },
  },
  migration: {
    detectPatterns: [
      'page\\.goto\\([\'"`](.+?)[\'"`]\\)',
      'navigate\\([\'"`](.+?)[\'"`]\\)',
    ],
    filePatterns: ['**/*.spec.ts', '**/*.test.ts'],
    dryRun: false,
  },
};