/**
 * Test Runner
 * 
 * Orchestrates test generation and execution.
 * Basic open-source version (TestGenerator and Story system are enterprise edition).
 */

// Enterprise features - not available in open source edition
// import { TestGenerator } from '../generators/TestGenerator';
// import { StoryRegistry, StoryExecutor } from '../background/stories';
import { GherkinParser } from './GherkinParser';
import { ToolRegistry } from '../background/registry/ToolRegistry';
// import { ToolPromptGenerator } from '../background/registry/ToolPromptGenerator';

export interface TestRunOptions {
  outputDir?: string;
  framework?: 'jest' | 'vitest' | 'mocha';
  includePlaywright?: boolean;
  includeGherkin?: boolean;
  includeStories?: boolean;
  filterByTag?: string;
  filterByCategory?: string;
}

export class TestRunner {
  /**
   * Generate all test files
   * 
   * NOTE: Full test generation is part of @supernal/interface-enterprise
   * Open source edition includes basic Gherkin parsing only.
   */
  static async generateTests(options: TestRunOptions = {}): Promise<Map<string, string>> {
    const tests = new Map<string, string>();
    
    // 1. Standard test generation - Enterprise feature
    // const standardTests = TestGenerator.generateAllTests({...});
    // Enterprise feature - see https://supernal.ai/enterprise
    
    // 2. Generate Gherkin-based tests if requested (basic support)
    if (options.includeGherkin) {
      const gherkinTests = this.generateGherkinTests(options);
      for (const [filename, content] of gherkinTests) {
        tests.set(filename, content);
      }
    }
    
    // 3. Story-based tests - Enterprise feature
    if (options.includeStories) {
      throw new Error(
        'Story system is part of @supernal/interface-enterprise. ' +
        'Visit https://supernal.ai/enterprise for more information.'
      );
    }
    
    return tests;
  }
  
  /**
   * Generate Gherkin feature files and tests
   */
  static generateGherkinTests(options: TestRunOptions): Map<string, string> {
    const files = new Map<string, string>();
    
    // Get tools grouped by category
    const categories = new Set(ToolRegistry.getTools().map(t => t.category));
    
    for (const category of categories) {
      if (options.filterByCategory && category !== options.filterByCategory) {
        continue;
      }
      
      const tools = ToolRegistry.getToolsByCategory(category);
      if (tools.length === 0) continue;
      
      // Generate feature file
      const featureName = `${category} Tools`;
      const feature = GherkinParser.generateFeature(featureName, tools, {
        description: `Test ${category} tool interactions`,
        tags: [category.toLowerCase(), 'generated']
      });
      
      files.set(`${category.toLowerCase()}.feature`, feature);
      
      // Parse and generate Playwright test
      const parsedFeature = GherkinParser.parseFeature(feature);
      const test = GherkinParser.generatePlaywrightTest(parsedFeature);
      
      files.set(`${category.toLowerCase()}.gherkin.spec.ts`, test);
    }
    
    return files;
  }
  
  /**
   * Generate story-based test file
   * 
   * NOTE: Story system is part of @supernal/interface-enterprise
   */
  static generateStoryTests(options: TestRunOptions): string {
    throw new Error(
      'Story system is part of @supernal/interface-enterprise. ' +
      'Visit https://supernal.ai/enterprise for more information.'
    );
  }
  
  /**
   * Generate documentation
   * 
   * NOTE: Full documentation generation requires ToolPromptGenerator
   * which is under review for open source vs enterprise.
   */
  static generateDocumentation(): Map<string, string> {
    const docs = new Map<string, string>();
    
    // Basic registry overview (available in open source)
    const overview = ToolRegistry.overview();
    docs.set('REGISTRY_OVERVIEW.txt', overview);
    
    // Advanced documentation - Enterprise feature
    // const toolDocs = ToolPromptGenerator.generatePrompt('documentation', {...});
    // const summary = ToolPromptGenerator.generateToolSummary();
    
    return docs;
  }
  
  /**
   * Write files to disk
   */
  static async writeFiles(
    files: Map<string, string>,
    outputDir: string
  ): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write each file
    for (const [filename, content] of files) {
      const filePath = path.join(outputDir, filename);
      
      // Create subdirectories if needed
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ Generated: ${filePath}`);
    }
  }
  
  /**
   * Generate and write all tests
   */
  static async generateAndWrite(options: TestRunOptions = {}): Promise<void> {
    const outputDir = options.outputDir || './tests/generated';
    
    console.log(`🔧 Generating tests...`);
    const tests = await this.generateTests(options);
    
    console.log(`📝 Writing ${tests.size} test files to ${outputDir}...`);
    await this.writeFiles(tests, outputDir);
    
    console.log(`✅ Test generation complete!`);
  }
}
