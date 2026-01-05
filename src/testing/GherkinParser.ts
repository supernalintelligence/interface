/**
 * Gherkin Parser
 * 
 * Parses Gherkin .feature files and converts them to executable test scenarios.
 * Basic open-source version (Story system is enterprise edition).
 */

// Story system moved to enterprise edition
// import { StoryBuilder, StoryDefinition, StoryRegistry } from '../background/stories';
import { ToolRegistry } from '../background/registry/ToolRegistry';

export interface GherkinFeature {
  name: string;
  description?: string;
  tags?: string[];
  scenarios: GherkinScenario[];
}

export interface GherkinScenario {
  name: string;
  tags?: string[];
  steps: GherkinStep[];
}

export interface GherkinStep {
  keyword: 'Given' | 'When' | 'Then' | 'And' | 'But';
  text: string;
  toolId?: string;          // Resolved tool ID
  params?: Record<string, any>;
}

export class GherkinParser {
  /**
   * Parse a Gherkin feature file content
   */
  static parseFeature(content: string): GherkinFeature {
    const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    
    let feature: Partial<GherkinFeature> = {
      scenarios: []
    };
    
    let currentScenario: Partial<GherkinScenario> | null = null;
    let tags: string[] = [];
    
    for (const line of lines) {
      // Parse tags
      if (line.startsWith('@')) {
        tags = line.split(/\s+/).map(t => t.substring(1));
        continue;
      }
      
      // Parse feature
      if (line.startsWith('Feature:')) {
        feature.name = line.substring(8).trim();
        if (tags.length > 0) {
          feature.tags = tags;
          tags = [];
        }
        continue;
      }
      
      // Parse scenario
      if (line.startsWith('Scenario:')) {
        if (currentScenario) {
          feature.scenarios!.push(currentScenario as GherkinScenario);
        }
        currentScenario = {
          name: line.substring(9).trim(),
          tags: tags.length > 0 ? tags : undefined,
          steps: []
        };
        tags = [];
        continue;
      }
      
      // Parse steps
      const stepMatch = line.match(/^(Given|When|Then|And|But)\s+(.+)$/);
      if (stepMatch && currentScenario) {
        const [, keyword, text] = stepMatch;
        currentScenario.steps!.push({
          keyword: keyword as any,
          text
        });
      }
      
      // Description (lines after Feature: but before Scenario:)
      if (!line.startsWith('Feature:') && !line.startsWith('Scenario:') && !stepMatch && feature.name && !currentScenario) {
        feature.description = (feature.description || '') + line + ' ';
      }
    }
    
    // Add last scenario
    if (currentScenario) {
      feature.scenarios!.push(currentScenario as GherkinScenario);
    }
    
    return feature as GherkinFeature;
  }
  
  /**
   * Resolve tool IDs from step text using natural language matching
   */
  static resolveSteps(steps: GherkinStep[]): GherkinStep[] {
    return steps.map(step => {
      // Extract the command text (without Given/When/Then)
      const commandText = step.text.toLowerCase();
      
      // Try to find matching tool
      const tools = ToolRegistry.searchTools(commandText);
      
      if (tools.length > 0) {
        // Use best match (first result)
        const tool = tools[0];
        
        // Extract parameters from step text
        const params = this.extractParameters(step.text, tool.examples || []);
        
        return {
          ...step,
          toolId: tool.toolId,
          params
        };
      }
      
      return step;
    });
  }
  
  /**
   * Extract parameters from step text
   */
  private static extractParameters(text: string, examples: string[]): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Look for quoted strings
    const quotedMatch = text.match(/"([^"]+)"/g);
    if (quotedMatch) {
      params.value = quotedMatch[0].replace(/"/g, '');
    }
    
    // Look for numbers
    const numberMatch = text.match(/\b\d+\b/);
    if (numberMatch) {
      params.count = parseInt(numberMatch[0]);
    }
    
    return params;
  }
  
  /**
   * Convert Gherkin scenario to Story definition
   * 
   * NOTE: Story system is part of @supernal/interface-enterprise
   * This method is not available in the open source edition.
   * 
   * For enterprise features including story system, visit:
   * https://supernal.ai/enterprise
   */
  static scenarioToStory(scenario: GherkinScenario, featureName: string): any {
    throw new Error(
      'Story system is part of @supernal/interface-enterprise. ' +
      'Visit https://supernal.ai/enterprise for more information.'
    );
  }
  
  /**
   * Convert entire feature to stories and register them
   * 
   * NOTE: Story system is part of @supernal/interface-enterprise
   * This method is not available in the open source edition.
   */
  static featureToStories(feature: GherkinFeature): any[] {
    throw new Error(
      'Story system is part of @supernal/interface-enterprise. ' +
      'Visit https://supernal.ai/enterprise for more information.'
    );
  }
  
  /**
   * Generate unique story ID from feature and scenario names
   */
  private static generateStoryId(featureName: string, scenarioName: string): string {
    const cleanFeature = featureName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cleanScenario = scenarioName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `${cleanFeature}-${cleanScenario}`;
  }
  
  /**
   * Generate Gherkin steps from tools
   * Moved from ToolPromptGenerator for consolidation
   */
  static generateSteps(tools: any[]): string {
    return tools
      .map(tool => {
        const examples = tool.examples || [tool.name.toLowerCase()];
        return examples
          .map((ex: string) => `    When I ${ex}`)
          .join('\n');
      })
      .join('\n');
  }
  
  /**
   * Generate complete Gherkin feature from tool metadata
   * Consolidated from both ToolPromptGenerator and original generateFeature
   */
  static generateFeature(
    featureName: string,
    tools: any[],
    options?: {
      description?: string;
      tags?: string[];
    }
  ): string {
    let feature = '';
    
    // Tags
    if (options?.tags && options.tags.length > 0) {
      feature += options.tags.map(t => `@${t}`).join(' ') + '\n';
    }
    
    // Feature header
    feature += `Feature: ${featureName}\n`;
    
    if (options?.description) {
      feature += `  ${options.description}\n`;
    }
    
    feature += '\n  Scenario: AI navigation and interaction\n';
    
    // Generate steps from tools
    feature += this.generateSteps(tools);
    
    return feature;
  }
  
  /**
   * Generate Playwright test from Gherkin feature
   */
  static generatePlaywrightTest(feature: GherkinFeature): string {
    let test = `/**\n`;
    test += ` * ${feature.name} - Generated from Gherkin\n`;
    test += ` */\n\n`;
    
    test += `import { test, expect } from '@playwright/test';\n`;
    test += `import { StoryExecutor } from '@supernal-interface/core';\n\n`;
    
    test += `test.describe('${feature.name}', () => {\n`;
    
    for (const scenario of feature.scenarios) {
      const storyId = this.generateStoryId(feature.name, scenario.name);
      
      test += `  test('${scenario.name}', async ({ page }) => {\n`;
      test += `    const executor = new StoryExecutor();\n`;
      test += `    const context = { page };\n`;
      test += `    \n`;
      test += `    const result = await executor.executeStory('${storyId}', context);\n`;
      test += `    \n`;
      test += `    expect(result.success).toBe(true);\n`;
      test += `  });\n\n`;
    }
    
    test += `});\n`;
    
    return test;
  }
  
  /**
   * Validate round-trip: Generate → Parse → Generate
   * Ensures parsing and generation are consistent
   */
  static validateRoundTrip(tools: any[], featureName: string = 'Test Feature'): {
    valid: boolean;
    original: string;
    parsed: GherkinFeature;
    regenerated: string;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // Generate original
    const original = this.generateFeature(featureName, tools);
    
    // Parse it
    let parsed: GherkinFeature;
    try {
      parsed = this.parseFeature(original);
    } catch (error) {
      return {
        valid: false,
        original,
        parsed: { name: '', scenarios: [] },
        regenerated: '',
        errors: [`Parse error: ${error}`]
      };
    }
    
    // Regenerate from parsed structure
    const regenerated = this.generateFeature(parsed.name, tools, {
      description: parsed.description,
      tags: parsed.tags
    });
    
    // Compare (normalized)
    const normalizeGherkin = (str: string) => 
      str.trim().replace(/\s+/g, ' ').replace(/\n\s*/g, '\n');
    
    const originalNorm = normalizeGherkin(original);
    const regeneratedNorm = normalizeGherkin(regenerated);
    
    if (originalNorm !== regeneratedNorm) {
      errors.push('Round-trip failed: Generated text differs after parse');
    }
    
    // Validate structure
    if (!parsed.name) {
      errors.push('Parsed feature has no name');
    }
    if (parsed.scenarios.length === 0) {
      errors.push('Parsed feature has no scenarios');
    }
    
    return {
      valid: errors.length === 0,
      original,
      parsed,
      regenerated,
      errors
    };
  }
}
