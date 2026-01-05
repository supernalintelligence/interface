// Generated from: 2025-12-28-simple-name-extraction.md
// Generated on: 2025-12-28
// DO NOT EDIT - Regenerate from documentation if changes needed

import { RouteInfo, RouteScanResult } from './scanners/RouteScanner';

/**
 * Generates type-safe route contracts with structured output.
 * Groups routes by category (Views, API, etc.) and HTTP methods.
 * 
 * @example
 * ```typescript
 * import { RouteContractGenerator } from '@supernal/interface-core/routes';
 * 
 * const generator = new RouteContractGenerator();
 * const scanResult = await scanner.scan();
 * 
 * // Generate contracts
 * const content = generator.generate(scanResult);
 * 
 * // Generated output:
 * // export const Routes = {
 * //   Views: {
 * //     Overview: '/:repo/:branch/overview'
 * //   },
 * //   API: {
 * //     Users: {
 * //       GET: '/api/users',
 * //       POST: '/api/users'
 * //     }
 * //   }
 * // } as const;
 * ```
 */
export class RouteContractGenerator {
  generate(scanResult: RouteScanResult): string {
    // Group routes by category
    const grouped = this.groupRoutes(scanResult.routes);
    
    return `
// Generated from route scanning
// DO NOT EDIT - Regenerate with: sc routes generate

${this.generateViews(grouped.view)}
${this.generateAPI(grouped.api)}

// Helper to build route with params
// Supports both string patterns and route objects with metadata
export function buildRoute(
  route: string | { pattern: string; [key: string]: any }, 
  params: Record<string, string>
): string {
  const pattern = typeof route === 'string' ? route : route.pattern;
  let result = pattern;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(\`:$\{key}\`, value);
  }
  return result;
}
`.trim();
  }
  
  private groupRoutes(routes: RouteInfo[]): Record<string, RouteInfo[]> {
    const grouped: Record<string, RouteInfo[]> = {};
    
    routes.forEach(route => {
      const category = route.metadata?.category || 'other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(route);
    });
    
    return grouped;
  }
  
  private generateViews(views: RouteInfo[] = []): string {
    if (views.length === 0) return '';
    
    const entries = views.map(view => {
      const name = this.toPascalCase(view.id.replace('view-', ''));
      return `    ${name}: '${view.pattern}',`;
    }).join('\n');
    
    return `
export const Routes = {
  Views: {
${entries}
  },
`;
  }
  
  private generateAPI(apis: RouteInfo[] = []): string {
    if (apis.length === 0) return '';
    
    const entries = apis.map(api => {
      const name = this.toPascalCase(api.id.replace('api-', ''));
      const methods = api.metadata?.methods;
      const params = api.params;
      
      // Generate route object with metadata
      if (methods || params.length > 0) {
        const parts = [
          `pattern: '${api.pattern}'`,
          methods && methods.length > 0 ? `methods: [${methods.map(m => `'${m}'`).join(', ')}] as const` : null,
          params.length > 0 ? `params: [${params.map(p => `'${p}'`).join(', ')}] as const` : null,
        ].filter(Boolean);
        
        return `    ${name}: {\n      ${parts.join(',\n      ')}\n    },`;
      }
      
      // Fallback: simple string (for backward compatibility)
      return `    ${name}: '${api.pattern}',`;
    }).join('\n');
    
    return `
  API: {
${entries}
  },
} as const;
`;
  }
  
  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
}
