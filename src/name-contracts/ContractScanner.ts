/**
 * Abstract Contract Scanner Interface
 * 
 * All name contract scanners (components, routes, API, CLI) implement this interface
 */

export interface ScanResult {
  contracts: Map<string, ContractEntry>;
  metadata?: Record<string, any>;
}

export interface ContractEntry {
  name: string;
  value: string;
  category?: string;
  files: string[];
  metadata?: Record<string, any>;
}

export interface GenerateOptions {
  outputPath: string;
  dryRun?: boolean;
  includeJsDocs?: boolean;
}

export interface MigrateOptions {
  targetPaths?: string[];
  dryRun?: boolean;
  createBackup?: boolean;
  contractsPath?: string;
  verbose?: boolean;
}

export interface MigrateResult {
  changes: number;
  skipped: number;
  files: string[];
}

/**
 * Base interface that all contract scanners must implement
 */
export abstract class ContractScanner {
  abstract readonly type: string; // 'components' | 'routes' | 'api' | 'cli'
  abstract readonly description: string;
  
  /**
   * Scan codebase for this contract type
   */
  abstract scan(): Promise<ScanResult>;
  
  /**
   * Generate contract file from scan results
   */
  abstract generate(result: ScanResult, options: GenerateOptions): Promise<string>;
  
  /**
   * Migrate code to use contracts
   */
  abstract migrate(options: MigrateOptions): Promise<MigrateResult>;
  
  /**
   * Validate contracts match codebase
   */
  abstract validate(): Promise<string[]>;
  
  /**
   * Get default output path for this contract type
   */
  abstract getDefaultOutputPath(): string;
}

