/**
 * Route Contract Scanner
 * 
 * Scans codebase for route patterns and generates type-safe route contracts
 * 
 * Integrates with existing route scanning system:
 * - NextjsDynamicScanner for route discovery
 * - RouteContractGenerator for contract generation
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { 
  ContractScanner, 
  ScanResult, 
  ContractEntry,
  GenerateOptions,
  MigrateOptions,
  MigrateResult 
} from './ContractScanner';
import { RouteContractsConfig } from '../routes/RouteContractsConfig';
import { NextjsDynamicScanner } from '../routes/scanners/NextjsDynamicScanner';
import { RouteContractGenerator } from '../routes/RouteContractGenerator';
import { RouteInfo } from '../routes/scanners/RouteScanner';

export class RouteContractScanner extends ContractScanner {
  readonly type = 'routes';
  readonly description = 'Next.js route patterns (Views + API)';
  
  private config: RouteContractsConfig;
  private projectRoot: string;
  
  constructor(projectRoot: string, config?: RouteContractsConfig) {
    super();
    this.projectRoot = projectRoot;
    this.config = config || this.loadConfigFromSupernal();
  }
  
  private loadConfigFromSupernal(): RouteContractsConfig {
    const supernalYamlPath = path.join(this.projectRoot, 'supernal.yaml');
    
    try {
      const yaml = require('js-yaml');
      const fs = require('fs');
      const supernalConfig = yaml.load(fs.readFileSync(supernalYamlPath, 'utf8'));
      
      if (supernalConfig?.name_contracts?.routes) {
        const routesConfig = supernalConfig.name_contracts.routes;
        return {
          routingSystem: routesConfig.routing_system || 'nextjs-dynamic',
          scanPaths: {
            routes: routesConfig.scan_paths?.routes || [],
            components: routesConfig.scan_paths?.components || [],
          },
          output: {
            contractsPath: routesConfig.output?.contracts_path || 'src/lib/routing/Routes.ts',
            testUtilsPath: routesConfig.output?.test_utils_path,
          },
          generation: {
            includeJsDocs: routesConfig.generation?.include_jsdocs !== false,
            includeValidation: routesConfig.generation?.include_validation || false,
            includeTypeGuards: routesConfig.generation?.include_type_guards || false,
          },
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // eslint-disable-next-line no-console
      console.warn(`⚠️ Could not load route contracts config from supernal.yaml: ${errorMessage}`);
      // eslint-disable-next-line no-console
      console.warn('   Using default configuration');
    }
    
    return this.getDefaultConfig();
  }
  
  private getDefaultConfig(): RouteContractsConfig {
    return {
      routingSystem: 'nextjs-name-extraction',
      scanPaths: {
        routes: ['apps/supernal-dashboard/src/app'],
        components: ['apps/supernal-dashboard/src/lib/routing/slugService.ts'],
      },
      output: {
        contractsPath: 'apps/supernal-dashboard/src/lib/routing/Routes.ts',
        testUtilsPath: 'apps/supernal-dashboard/tests/utils/routes.ts',
      },
      generation: {
        includeJsDocs: true,
      },
    };
  }
  
  async scan(): Promise<ScanResult> {
    const scanner = new NextjsDynamicScanner(this.config);
    const routeScanResult = await scanner.scan();
    
    // Convert RouteInfo[] to ContractEntry map
    const contracts = new Map<string, ContractEntry>();
    
    for (const route of routeScanResult.routes) {
      contracts.set(route.id, {
        name: route.id,
        value: route.pattern,
        category: route.metadata?.category || 'General',
        files: [route.metadata?.source || 'generated'],
        metadata: {
          params: route.params,
          methods: route.metadata?.methods,  // Preserve HTTP methods
          description: route.metadata?.description,
        },
      });
    }
    
    return {
      contracts,
      metadata: {
        routingSystem: this.config.routingSystem,
        totalRoutes: contracts.size,
      },
    };
  }
  
  async generate(result: ScanResult, options: GenerateOptions): Promise<string> {
    // Convert back to RouteInfo[] for generator
    const routes: RouteInfo[] = Array.from(result.contracts.values()).map(entry => ({
      id: entry.name,
      pattern: entry.value,
      params: entry.metadata?.params || [],
      metadata: {
        category: entry.category,
        methods: entry.metadata?.methods,  // Restore HTTP methods
        description: entry.metadata?.description,
      },
    }));
    
    const generator = new RouteContractGenerator();
    const content = generator.generate({
      routes,
      metadata: {
        timestamp: new Date().toISOString(),
        scannedPaths: this.config.scanPaths.routes || [],
        routingSystem: this.config.routingSystem,
      },
    });
    
    if (!options.dryRun) {
      const outputPath = path.join(this.projectRoot, options.outputPath);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, content, 'utf-8');
    }
    
    return content;
  }
  
  async migrate(_options: MigrateOptions): Promise<MigrateResult> {
    // TODO: Implement route migration
    // For now, return empty result
    // eslint-disable-next-line no-console
    console.log('⚠️  Route migration not yet implemented');
    // eslint-disable-next-line no-console
    console.log('   Use test utilities in tests/utils/TestRoutes.ts instead');
    
    return {
      changes: 0,
      skipped: 0,
      files: [],
    };
  }
  
  async validate(): Promise<string[]> {
    const errors: string[] = [];
    
    // Check if generated contracts exist
    const contractsPath = path.join(this.projectRoot, this.config.output.contractsPath);
    try {
      await fs.access(contractsPath);
    } catch {
      errors.push(`Contracts file not found: ${this.config.output.contractsPath}`);
      errors.push('Run: sc code generate --type=routes');
      return errors;
    }
    
    // Scan current routes
    const scanResult = await this.scan();
    
    // Read generated contracts
    const contractsContent = await fs.readFile(contractsPath, 'utf-8');
    
    // Basic validation: check if route counts match
    const generatedRouteCount = (contractsContent.match(/:\s*'\/[^']+'/g) || []).length;
    if (generatedRouteCount !== scanResult.contracts.size) {
      errors.push(`Route count mismatch: Generated has ${generatedRouteCount}, codebase has ${scanResult.contracts.size}`);
      errors.push('Run: sc code generate --type=routes');
    }
    
    return errors;
  }
  
  getDefaultOutputPath(): string {
    return this.config.output.contractsPath;
  }
  
  /**
   * Load config from file if exists
   */
  static async loadConfig(configPath: string): Promise<RouteContractsConfig | null> {
    try {
      const fullPath = path.isAbsolute(configPath) 
        ? configPath 
        : path.join(process.cwd(), configPath);
      
      // Use dynamic import for TypeScript config files
      if (configPath.endsWith('.ts')) {
        require('ts-node/register');
      }
      
      const config = require(fullPath);
      return config.default || config;
    } catch {
      return null;
    }
  }
}

