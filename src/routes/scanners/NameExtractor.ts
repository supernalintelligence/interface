// Generated from: 2025-12-28-simple-name-extraction.md
// Generated on: 2025-12-29
// DO NOT EDIT - Regenerate from documentation if changes needed

import * as fs from 'fs';
import * as path from 'path';

/**
 * Extract route names from existing code
 * No decorators, no metadata - just find what's already named
 */
export class NameExtractor {
  /**
   * Extract array literals from source files
   * Example: const VALID_VIEWS = ['overview', 'planning', ...]
   */
  extractArrayLiteral(filePath: string, variableName: string): string[] {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Match: export const VALID_VIEWS = ['item1', 'item2', ...]
      const pattern = new RegExp(
        `(?:export\\s+)?const\\s+${variableName}\\s*=\\s*\\[([^\\]]+)\\]`,
        's'
      );
      
      const match = content.match(pattern);
      if (!match) return [];
      
      // Parse string literals: 'item1', "item2", `item3`
      const arrayContent = match[1];
      const stringPattern = /['"`]([^'"`]+)['"`]/g;
      const names: string[] = [];
      
      let stringMatch;
      while ((stringMatch = stringPattern.exec(arrayContent)) !== null) {
        names.push(stringMatch[1]);
      }
      
      return names;
    } catch {
      return [];
    }
  }
  
  /**
   * Extract routes from Next.js app directory structure
   * Finds: app/api/[param]/route.ts
   */
  extractAppDirectoryRoutes(appDir: string, prefix: string = ''): Array<{
    name: string;
    pattern: string;
    params: string[];
    methods?: string[];
    sourceFile?: string;
  }> {
    const routes: Array<{ 
      name: string; 
      pattern: string; 
      params: string[];
      methods?: string[];
      sourceFile?: string;
    }> = [];
    
    const walkDir = (dir: string, currentPath: string = '') => {
      if (!fs.existsSync(dir)) return;
      
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const routePath = path.join(currentPath, entry.name);
        
        if (entry.isDirectory()) {
          // Recurse into subdirectories
          walkDir(fullPath, routePath);
        } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
          // Found a route file
          const segments = currentPath.split(path.sep).filter(s => s);
          const pattern = this.buildRoutePattern(segments, prefix);
          const params = this.extractParams(segments);
          const name = this.buildRouteName(segments);
          const methods = this.extractHttpMethods(fullPath);
          
          routes.push({ 
            name, 
            pattern, 
            params,
            methods,
            sourceFile: fullPath
          });
        }
      }
    };
    
    walkDir(appDir);
    return routes;
  }
  
  /**
   * Extract HTTP methods from a Next.js route file
   * Supports multiple export patterns:
   * - export async function GET/POST/etc(...)
   * - export function GET/POST/etc(...)
   * - export const GET/POST/etc = ...
   * - export { handler as GET, handler as POST }
   * - export const { GET, POST } = handlers
   */
  extractHttpMethods(routeFilePath: string): string[] | undefined {
    try {
      const content = fs.readFileSync(routeFilePath, 'utf-8');
      const methods: string[] = [];
      
      const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
      
      for (const method of httpMethods) {
        // Pattern 1: export async function GET( or export function GET(
        const functionPattern = new RegExp(
          `export\\s+(?:async\\s+)?function\\s+${method}\\s*\\(`,
          'm'
        );
        
        // Pattern 2: export const GET = ...
        const constPattern = new RegExp(
          `export\\s+const\\s+${method}\\s*=`,
          'm'
        );
        
        // Pattern 3: export { ... as GET, ... }
        const reExportPattern = new RegExp(
          `export\\s*\\{[^}]*\\s+as\\s+${method}[,\\s}]`,
          'm'
        );
        
        // Pattern 4: export const { GET, POST } = ...
        const destructurePattern = new RegExp(
          `export\\s+const\\s*\\{[^}]*\\b${method}\\b[^}]*\\}`,
          'm'
        );
        
        if (functionPattern.test(content) || 
            constPattern.test(content) || 
            reExportPattern.test(content) ||
            destructurePattern.test(content)) {
          methods.push(method);
        }
      }
      
      return methods.length > 0 ? methods : undefined;
    } catch {
      return undefined;
    }
  }
  
  private buildRoutePattern(segments: string[], prefix: string): string {
    const pathSegments = segments.map(seg => {
      // [param] → :param
      if (seg.startsWith('[') && seg.endsWith(']')) {
        const param = seg.slice(1, -1);
        // [[...catch]] → *catchAll (optional catch-all)
        if (param.startsWith('[...') && param.endsWith(']')) {
          return `:${param.slice(4, -1)}*?`;
        }
        // [...catch] → *catchAll (required catch-all)
        if (param.startsWith('...')) {
          return `:${param.slice(3)}*`;
        }
        // [param] → :param
        return `:${param}`;
      }
      return seg;
    });
    
    return prefix + '/' + pathSegments.join('/');
  }
  
  private extractParams(segments: string[]): string[] {
    return segments
      .filter(seg => seg.startsWith('[') && seg.endsWith(']'))
      .map(seg => {
        const param = seg.slice(1, -1);
        if (param.startsWith('...')) return param.slice(3);
        if (param.startsWith('[...') && param.endsWith(']')) {
          return param.slice(4, -1);
        }
        return param;
      });
  }
  
  private buildRouteName(segments: string[]): string {
    // Convert path segments to PascalCase name
    // api/[repoId]/requirements → RepoIdRequirements
    return segments
      .map(seg => {
        // Strip brackets and dots: [repoId] → repoId
        const clean = seg.replace(/[[\].]/g, '');
        // PascalCase: repoId → RepoId
        return clean.charAt(0).toUpperCase() + clean.slice(1);
      })
      .join('');
  }
}