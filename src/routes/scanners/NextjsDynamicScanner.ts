// Generated from: 2025-12-28-simple-name-extraction.md
// Generated on: 2025-12-28
// DO NOT EDIT - Regenerate from documentation if changes needed

import { RouteScanner, RouteInfo, RouteScanResult } from './RouteScanner';
import { NameExtractor } from './NameExtractor';

/**
 * Scanner that extracts route names from Next.js applications.
 * 
 * Supports two discovery strategies:
 * 1. VALID_VIEWS arrays - Extracts view names from configuration files
 * 2. App directory structure - Scans Next.js App Router directories for API routes
 * 
 * @example
 * ```typescript
 * import { NextjsDynamicScanner } from '@supernal/interface-core/routes';
 * 
 * const scanner = new NextjsDynamicScanner({
 *   routingSystem: 'nextjs-name-extraction',
 *   scanPaths: {
 *     configs: ['src/lib/routing/slugService.ts'],  // Contains VALID_VIEWS
 *     routes: ['src/app/api']                        // API routes directory
 *   },
 *   output: {
 *     contractsPath: 'src/lib/routing/Routes.ts',
 *     moduleFormat: 'esm'
 *   }
 * });
 * 
 * const result = await scanner.scan();
 * // result.routes contains all discovered routes
 * ```
 */
export class NextjsDynamicScanner extends RouteScanner {
  private extractor = new NameExtractor();
  
  getName(): string {
    return 'Next.js Name Extraction Scanner';
  }
  
  async scan(): Promise<RouteScanResult> {
    const routes: RouteInfo[] = [];
    
    // Strategy 1: Extract from VALID_VIEWS array
    if (this.config.scanPaths.configs) {
      for (const configPath of this.config.scanPaths.configs) {
        const viewNames = this.extractor.extractArrayLiteral(
          configPath,
          'VALID_VIEWS'
        );
        
        viewNames.forEach(view => {
          routes.push({
            id: `view-${view}`,
            pattern: `/:repo/:branch/${view}`,
            params: ['repo', 'branch'],
            metadata: {
              category: 'view',
              source: 'VALID_VIEWS',
            },
          });
        });
      }
    }
    
    // Strategy 2: Extract from app directory structure
    if (this.config.scanPaths.routes) {
      for (const routePath of this.config.scanPaths.routes) {
        // Don't add prefix - let the directory structure determine the route
        const appRoutes = this.extractor.extractAppDirectoryRoutes(
          routePath,
          ''  // Empty prefix - routes are determined by directory structure
        );
        
        appRoutes.forEach(route => {
          routes.push({
            id: `api-${route.name}`,
            pattern: route.pattern,
            params: route.params,
            metadata: {
              category: 'api',
              source: 'file-structure',
              methods: route.methods,
              sourceFile: route.sourceFile,
            },
          });
        });
      }
    }
    
    return {
      routes,
      metadata: {
        timestamp: new Date().toISOString(),
        scannedPaths: [
          ...(this.config.scanPaths.configs || []),
          ...(this.config.scanPaths.routes || []),
        ],
        routingSystem: 'nextjs-name-extraction',
      },
    };
  }
  
  async validate(routes: RouteInfo[]): Promise<boolean> {
    // Basic validation - check all routes have patterns and ids
    return routes.every(route => route.id && route.pattern);
  }
}
