/**
 * Tool Registry - Simple registry for tool discovery and metadata
 *
 * This registry ONLY handles:
 * - Tool registration
 * - Tool discovery
 * - Metadata management
 *
 * Execution is handled separately by:
 * - PlaywrightExecutor (for testing)
 * - DOMExecutor (for AI control)
 */

import { ToolMetadata } from '../../decorators/Tool';

// Execution context types
export interface UniversalExecutionContext {
  toolId: string;
  parameters: any;
  userId?: string;
  sessionId?: string;
  timestamp: number;
}

export interface UniversalToolResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime?: number;
  context?: UniversalExecutionContext;
  tool?: string;
}

// Use a global registry to avoid Jest module isolation issues
const globalRegistry = (typeof global !== 'undefined' ? global : globalThis) as any;
if (!globalRegistry.__SUPERNAL_TOOL_REGISTRY__) {
  globalRegistry.__SUPERNAL_TOOL_REGISTRY__ = new Map<string, ToolMetadata>();
}
if (!globalRegistry.__SUPERNAL_ACTIVE_INSTANCES__) {
  globalRegistry.__SUPERNAL_ACTIVE_INSTANCES__ = new Map<string, HTMLElement>();
}

export class ToolRegistry {
  private static get tools(): Map<string, ToolMetadata> {
    return globalRegistry.__SUPERNAL_TOOL_REGISTRY__;
  }
  
  private static get activeInstances(): Map<string, HTMLElement> {
    return globalRegistry.__SUPERNAL_ACTIVE_INSTANCES__;
  }

  /**
   * Register a tool
   */
  static registerTool(providerName: string, methodName: string, metadata: ToolMetadata): void {
    const toolId = `${providerName}.${methodName}`;
    this.tools.set(toolId, metadata);

    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'test') {
      console.log(
        `🔧 Registered Tool: ${metadata.name} (${metadata.toolType}, AI: ${metadata.aiEnabled})`
      );
    }
  }

  /**
   * Get a specific tool by identifier
   * Supports both class-based IDs (Counter.increment) and component-namespaced IDs (counter.increment)
   */
  static getTool(toolIdentifier: string): ToolMetadata | undefined {
    // First, try direct lookup
    let tool = this.tools.get(toolIdentifier);
    if (tool) return tool;
    
    // If not found and identifier looks like component.method (lowercase start),
    // search for a tool with matching componentName and methodName
    if (toolIdentifier.includes('.')) {
      const [possibleComponent, methodName] = toolIdentifier.split('.');
      
      // Check if it looks like a component name (lowercase start)
      if (possibleComponent[0] === possibleComponent[0].toLowerCase()) {
        // Search for tool with this componentName and methodName
        tool = Array.from(this.tools.values()).find(
          t => t.componentName === possibleComponent && t.methodName === methodName
        );
        if (tool) return tool;
      }
    }
    
    return undefined;
  }

  /**
   * Get all registered tools
   */
  static getAllTools(): Map<string, ToolMetadata> {
    return new Map(this.tools);
  }

  /**
   * Get all registered tools as array
   */
  static getTools(): ToolMetadata[] {
    return Array.from(this.tools.values());
  }
  
  /**
   * Find tool by element ID (data-testid)
   */
  static findToolByElementId(elementId: string): ToolMetadata | undefined {
    return Array.from(this.tools.values()).find((tool) => tool.elementId === elementId);
  }
  
  /**
   * Register active component instance
   */
  static registerInstance(storageKey: string, element: HTMLElement): void {
    if (this.activeInstances.has(storageKey)) {
      throw new Error(`Duplicate instance: ${storageKey} already registered`);
    }
    this.activeInstances.set(storageKey, element);
  }
  
  /**
   * Unregister component instance on unmount
   */
  static unregisterInstance(storageKey: string): void {
    this.activeInstances.delete(storageKey);
  }
  
  /**
   * Check if instance exists (for duplicate detection)
   */
  static getActiveInstance(storageKey: string): HTMLElement | undefined {
    return this.activeInstances.get(storageKey);
  }

  /**
   * Bind a class instance to all its registered tool methods
   * 
   * This allows @Tool decorated methods to be called by AI without needing
   * the instance to be called once first (which sets tool.instance = this).
   * 
   * @param instance The class instance with @Tool decorated methods
   */
  static bindInstance(instance: any): void {
    const className = instance.constructor.name;
    console.log(`🔗 [ToolRegistry] Binding instance for: ${className}`);
    
    let boundCount = 0;
    
    // Find all tools belonging to this class
    for (const [toolId, tool] of this.tools.entries()) {
      // Check if tool belongs to this class
      if (toolId.startsWith(`${className}.`) && tool.methodName) {
        const methodName = tool.methodName;
        
        // Bind the method to this instance
        if (typeof instance[methodName] === 'function') {
          tool.method = instance[methodName].bind(instance);
          tool.instance = instance;
          boundCount++;
          console.log(`  ✓ Bound ${className}.${methodName}`);
        }
      }
    }
    
    console.log(`🔗 [ToolRegistry] Bound ${boundCount} methods for ${className}`);
  }

  /**
   * Get AI-enabled tools only
   */
  static getAIEnabledTools(): ToolMetadata[] {
    return Array.from(this.tools.values()).filter((tool) => tool.aiEnabled);
  }

  /**
   * Get test-only tools
   */
  static getTestOnlyTools(): ToolMetadata[] {
    return Array.from(this.tools.values()).filter((tool) => !tool.aiEnabled);
  }

  /**
   * Get tools by category
   */
  static getToolsByCategory(category: string): ToolMetadata[] {
    return Array.from(this.tools.values()).filter((tool) => tool.category === category);
  }

  /**
   * Search tools by query
   */
  static searchTools(query: string): ToolMetadata[] {
    if (!query || typeof query !== 'string') {
      console.error('❌ [ToolRegistry] Invalid search query:', query);
      return [];
    }
    const queryLower = query.toLowerCase();

    console.log(`🔍 [ToolRegistry.searchTools] Searching for: "${queryLower}"`);
    console.log(`🔍 [ToolRegistry.searchTools] Total tools in registry: ${this.tools.size}`);

    return Array.from(this.tools.values()).filter((tool) => {
      const searchFields = [
        tool.name ? tool.name.toLowerCase() : '',
        tool.description ? tool.description.toLowerCase() : '',
        tool.category ? tool.category.toLowerCase() : '',
        ...(tool.examples || []).map((ex) => ex ? ex.toLowerCase() : ''),
        ...(tool.keywords || []).map((kw) => kw ? kw.toLowerCase() : ''),
      ].filter(f => f); // Remove empty strings

      return searchFields.some((field) => field.includes(queryLower) || queryLower.includes(field));
    });
  }

  /**
   * Search tools with container scoping
   * 
   * Prioritizes tools in currentContainer, then global tools.
   * This enables "local > global" resolution like lexical scope.
   * 
   * @param query Search query
   * @param currentContainer Current page/container context
   * @returns Tools sorted by: local matches, global matches
   */
  static searchScoped(
    query: string,
    currentContainer?: string
  ): ToolMetadata[] {
    if (!query || typeof query !== 'string') {
      console.error('❌ [ToolRegistry] Invalid search query:', query);
      return [];
    }
    
    const queryLower = query.toLowerCase();
    console.log(`🔍 [ToolRegistry] Scoped search: "${query}" (container: ${currentContainer || 'none'})`);
    
    const allTools = Array.from(this.tools.values());
    
    // Search in tool metadata (including component names)
    const matches = allTools.filter(tool => {
      const searchFields = [
        tool.name,
        tool.description,
        tool.componentName,
        tool.methodName,
        tool.category,
        ...(tool.examples || []),
        ...(tool.keywords || []),
      ]
        .filter(Boolean)
        .map(s => (s || '').toLowerCase()); // Ensure s is not undefined
      
      return searchFields.some(field => 
        field.includes(queryLower) || queryLower.includes(field)
      );
    });
    
    if (!currentContainer) {
      return matches;
    }
    
    // Split into local (current container) and global (no container or different)
    const local = matches.filter(t => t.containerId === currentContainer);
    const global = matches.filter(t => !t.containerId || t.containerId !== currentContainer);
    
    console.log(
      `📊 [ToolRegistry] Found: ${local.length} local, ${global.length} global`
    );
    
    // Prioritize local over global
    return [...local, ...global];
  }
  
  /**
   * Get tools by component name
   * 
   * Returns all methods for a specific component.
   * 
   * @example
   * getToolsByComponent('counter') 
   * // → [counter.increment, counter.decrement, counter.reset]
   */
  static getToolsByComponent(componentName: string): ToolMetadata[] {
    return Array.from(this.tools.values()).filter(
      tool => tool.componentName === componentName
    );
  }
  
  /**
   * Get tools by container (page scope)
   */
  static getToolsByContainer(containerId: string): ToolMetadata[] {
    return Array.from(this.tools.values()).filter(
      tool => tool.containerId === containerId
    );
  }
  
  /**
   * Get component names in a container
   * 
   * @example
   * getComponentsInContainer('Dashboard')
   * // → ['counter', 'chart', 'settings']
   */
  static getComponentsInContainer(containerId: string): string[] {
    const tools = this.getToolsByContainer(containerId);
    const components = new Set(
      tools.map(t => t.componentName).filter((name): name is string => !!name)
    );
    return Array.from(components);
  }

  /**
   * Find tool by natural language query (alias for searchTools)
   */
  static findToolsByQuery(query: string): ToolMetadata[] {
    return this.searchTools(query);
  }

  /**
   * Get registry statistics
   */
  static getStats(): {
    total: number;
    aiEnabled: number;
    testOnly: number;
    byCategory: Record<string, number>;
    byDangerLevel: Record<string, number>;
    requiresApproval: number;
  } {
    const tools = Array.from(this.tools.values());

    const byCategory = tools.reduce(
      (acc, tool) => {
        acc[tool.category] = (acc[tool.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byDangerLevel = tools.reduce(
      (acc, tool) => {
        acc[tool.dangerLevel] = (acc[tool.dangerLevel] || 0) + 1;
        return acc;
      },
      { safe: 0, moderate: 0, dangerous: 0, destructive: 0 } as Record<string, number>
    );

    return {
      total: tools.length,
      aiEnabled: tools.filter((t) => t.aiEnabled).length,
      testOnly: tools.filter((t) => !t.aiEnabled).length,
      byCategory,
      byDangerLevel,
      requiresApproval: tools.filter((t) => t.requiresApproval).length,
    };
  }

  /**
   * Get tools by class/provider name
   */
  static getToolsByProvider(providerName: string): ToolMetadata[] {
    return Array.from(this.tools.values()).filter(
      (tool) => tool.providerClass === providerName || tool.providerName === providerName
    );
  }

  /**
   * Get all unique provider names
   */
  static getProviders(): string[] {
    const providers = new Set<string>();
    Array.from(this.tools.values()).forEach((tool) => {
      if (tool.providerClass) providers.add(tool.providerClass);
      if (tool.providerName) providers.add(tool.providerName);
    });
    return Array.from(providers).sort();
  }

  // ===== CLI-LIKE METHODS =====

  /**
   * List all tools in a CLI-friendly format
   * Similar to 'ls' command
   */
  static list(
    options: {
      provider?: string;
      category?: string;
      aiEnabled?: boolean;
      dangerLevel?: string;
      verbose?: boolean;
    } = {}
  ): string {
    let tools = Array.from(this.tools.values());

    // Apply filters
    if (options.provider) {
      tools = tools.filter(
        (tool) => tool.providerClass === options.provider || tool.providerName === options.provider
      );
    }
    if (options.category) {
      tools = tools.filter((tool) => tool.category === options.category);
    }
    if (options.aiEnabled !== undefined) {
      tools = tools.filter((tool) => tool.aiEnabled === options.aiEnabled);
    }
    if (options.dangerLevel) {
      tools = tools.filter((tool) => tool.dangerLevel === options.dangerLevel);
    }

    if (tools.length === 0) {
      return 'No tools found matching criteria.';
    }

    // Sort by provider, then by name
    tools.sort((a, b) => {
      const providerA = a.providerClass || a.providerName || '';
      const providerB = b.providerClass || b.providerName || '';
      if (providerA !== providerB) return providerA.localeCompare(providerB);
      return a.name.localeCompare(b.name);
    });

    if (options.verbose) {
      return this.formatVerboseList(tools);
    } else {
      return this.formatCompactList(tools);
    }
  }

  /**
   * Show help for a specific tool
   * Similar to 'man' or 'help' command
   */
  static help(toolId: string): string {
    const tool = this.getTool(toolId);
    if (!tool) {
      // Try to find by name or partial match
      const matches = Array.from(this.tools.values()).filter(
        (t) =>
          t.name.toLowerCase().includes(toolId.toLowerCase()) ||
          t.toolId.toLowerCase().includes(toolId.toLowerCase())
      );

      if (matches.length === 0) {
        return `Tool '${toolId}' not found. Use ToolRegistry.list() to see available tools.`;
      }

      if (matches.length > 1) {
        const matchList = matches.map((t) => `  ${t.toolId} - ${t.name}`).join('\n');
        return `Multiple tools match '${toolId}':\n${matchList}\n\nUse the full toolId for specific help.`;
      }

      return this.formatToolHelp(matches[0]);
    }

    return this.formatToolHelp(tool);
  }

  /**
   * Show overview of all tools and providers
   * Similar to 'ls -la' or directory overview
   */
  static overview(): string {
    const stats = this.getStats();
    const providers = this.getProviders();

    let output = `🔧 Tool Registry Overview\n`;
    output += `${'='.repeat(50)}\n\n`;

    output += `📊 Statistics:\n`;
    output += `  Total Tools: ${stats.total}\n`;
    output += `  AI-Enabled: ${stats.aiEnabled}\n`;
    output += `  Test-Only: ${stats.testOnly}\n\n`;

    output += `🏭 Providers (${providers.length}):\n`;
    providers.forEach((provider) => {
      const toolCount = this.getToolsByProvider(provider).length;
      output += `  ${provider} (${toolCount} tools)\n`;
    });

    output += `\n📂 Categories:\n`;
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      output += `  ${category}: ${count} tools\n`;
    });

    output += `\n⚠️  Danger Levels:\n`;
    Object.entries(stats.byDangerLevel).forEach(([level, count]) => {
      const emoji =
        level === 'safe' ? '✅' : level === 'moderate' ? '⚠️' : level === 'dangerous' ? '🔶' : '🚨';
      output += `  ${emoji} ${level}: ${count} tools\n`;
    });

    output += `\n💡 Usage:\n`;
    output += `  ToolRegistry.list()                    - List all tools\n`;
    output += `  ToolRegistry.list({ provider: 'X' })   - List tools by provider\n`;
    output += `  ToolRegistry.help('toolId')            - Get help for specific tool\n`;
    output += `  ToolRegistry.searchTools('query')      - Search tools\n`;

    return output;
  }

  /**
   * Search and display tools matching query
   */
  static find(query: string): string {
    const matches = this.searchTools(query);

    if (matches.length === 0) {
      return `No tools found matching '${query}'.`;
    }

    let output = `🔍 Found ${matches.length} tool(s) matching '${query}':\n\n`;

    matches.forEach((tool) => {
      const provider = tool.providerClass || tool.providerName || 'Unknown';
      const aiStatus = tool.aiEnabled ? '🤖' : '🧪';
      const dangerEmoji =
        tool.dangerLevel === 'safe'
          ? '✅'
          : tool.dangerLevel === 'moderate'
            ? '⚠️'
            : tool.dangerLevel === 'dangerous'
              ? '🔶'
              : '🚨';

      output += `  ${aiStatus}${dangerEmoji} ${tool.toolId}\n`;
      output += `     ${tool.description}\n`;
      output += `     Provider: ${provider} | Category: ${tool.category}\n`;

      if (tool.examples && tool.examples.length > 0) {
        output += `     Examples: ${tool.examples.slice(0, 2).join(', ')}\n`;
      }
      output += `\n`;
    });

    output += `💡 Use ToolRegistry.help('toolId') for detailed information.\n`;

    return output;
  }

  // ===== PRIVATE FORMATTING METHODS =====

  private static formatCompactList(tools: ToolMetadata[]): string {
    let output = `📋 Tools (${tools.length}):\n\n`;

    let currentProvider = '';
    tools.forEach((tool) => {
      const provider = tool.providerClass || tool.providerName || 'Unknown';

      if (provider !== currentProvider) {
        currentProvider = provider;
        output += `\n🏭 ${provider}:\n`;
      }

      const aiStatus = tool.aiEnabled ? '🤖' : '🧪';
      const dangerEmoji =
        tool.dangerLevel === 'safe'
          ? '✅'
          : tool.dangerLevel === 'moderate'
            ? '⚠️'
            : tool.dangerLevel === 'dangerous'
              ? '🔶'
              : '🚨';

      output += `  ${aiStatus}${dangerEmoji} ${tool.toolId.padEnd(25)} ${tool.description}\n`;
    });

    return output;
  }

  private static formatVerboseList(tools: ToolMetadata[]): string {
    let output = `📋 Tools (${tools.length}) - Verbose:\n\n`;

    tools.forEach((tool) => {
      output += this.formatToolSummary(tool) + '\n';
    });

    return output;
  }

  private static formatToolSummary(tool: ToolMetadata): string {
    const provider = tool.providerClass || tool.providerName || 'Unknown';
    const aiStatus = tool.aiEnabled ? '🤖 AI-Enabled' : '🧪 Test-Only';
    const dangerEmoji =
      tool.dangerLevel === 'safe'
        ? '✅'
        : tool.dangerLevel === 'moderate'
          ? '⚠️'
          : tool.dangerLevel === 'dangerous'
            ? '🔶'
            : '🚨';

    let output = `🔧 ${tool.toolId}\n`;
    output += `   Name: ${tool.name}\n`;
    output += `   Description: ${tool.description}\n`;
    output += `   Provider: ${provider}\n`;
    output += `   Category: ${tool.category}\n`;
    output += `   Status: ${aiStatus}\n`;
    output += `   Danger: ${dangerEmoji} ${tool.dangerLevel}\n`;

    if (tool.examples && tool.examples.length > 0) {
      output += `   Examples: ${tool.examples.join(', ')}\n`;
    }

    if (tool.origin) {
      output += `   Origin: ${tool.origin.path || 'N/A'}`;
      if (tool.origin.elements) {
        output += ` (${tool.origin.elements.join(', ')})`;
      }
      output += `\n`;
    }

    return output;
  }

  private static formatToolHelp(tool: ToolMetadata): string {
    const provider = tool.providerClass || tool.providerName || 'Unknown';
    const aiStatus = tool.aiEnabled ? '🤖 AI-Enabled' : '🧪 Test-Only';
    const dangerEmoji =
      tool.dangerLevel === 'safe'
        ? '✅'
        : tool.dangerLevel === 'moderate'
          ? '⚠️'
          : tool.dangerLevel === 'dangerous'
            ? '🔶'
            : '🚨';

    let output = `📖 Help: ${tool.toolId}\n`;
    output += `${'='.repeat(50)}\n\n`;

    output += `📝 Description:\n`;
    output += `   ${tool.description}\n\n`;

    output += `ℹ️  Details:\n`;
    output += `   Name: ${tool.name}\n`;
    output += `   Provider: ${provider}\n`;
    output += `   Category: ${tool.category}\n`;
    output += `   Status: ${aiStatus}\n`;
    output += `   Danger Level: ${dangerEmoji} ${tool.dangerLevel}\n`;
    output += `   Requires Approval: ${tool.requiresApproval ? 'Yes' : 'No'}\n\n`;

    if (tool.examples && tool.examples.length > 0) {
      output += `💡 Usage Examples:\n`;
      tool.examples.forEach((example) => {
        output += `   "${example}"\n`;
      });
      output += `\n`;
    }

    if (tool.origin) {
      output += `📍 Availability:\n`;
      if (tool.origin.path) {
        output += `   Path: ${tool.origin.path}\n`;
      }
      if (tool.origin.elements && tool.origin.elements.length > 0) {
        output += `   Elements: ${tool.origin.elements.join(', ')}\n`;
      }
      if (tool.origin.modal) {
        output += `   Modal: ${tool.origin.modal}\n`;
      }
      output += `\n`;
    }

    if (tool.keywords && tool.keywords.length > 0) {
      output += `🏷️  Keywords: ${tool.keywords.join(', ')}\n\n`;
    }

    if (tool.useCases && tool.useCases.length > 0) {
      output += `🎯 Use Cases:\n`;
      tool.useCases.forEach((useCase) => {
        output += `   • ${useCase}\n`;
      });
      output += `\n`;
    }

    output += `🔧 Technical Details:\n`;
    output += `   Method: ${tool.methodName}\n`;
    output += `   Return Type: ${tool.returnType}\n`;
    output += `   Execution Context: ${tool.executionContext}\n`;
    output += `   Complexity: ${tool.complexity}\n`;
    output += `   Frequency: ${tool.frequency}\n`;

    return output;
  }

  /**
   * Execute a tool for AI (only if AI-enabled)
   */
  static async executeForAI(
    toolIdentifier: string,
    parameters: any = {}
  ): Promise<{ success: boolean; data?: any; error?: string; tool: string; requiresApproval?: boolean }> {
    const tool = this.tools.get(toolIdentifier);

    if (!tool) {
      return {
        success: false,
        error: `Tool ${toolIdentifier} not found`,
        tool: toolIdentifier,
      };
    }

    if (!tool.aiEnabled) {
      return {
        success: false,
        error: `Tool ${toolIdentifier} is not AI-enabled. Use executeForTesting() instead.`,
        tool: toolIdentifier,
      };
    }

    if (tool.requiresApproval) {
      return {
        success: false,
        error: `Tool ${toolIdentifier} requires approval.`,
        tool: toolIdentifier,
        requiresApproval: true,
      };
    }

    // For now, just return success - actual execution would need provider instances
    return {
      success: true,
      data: { message: 'Tool executed successfully' },
      tool: toolIdentifier,
    };
  }

  /**
   * Request approval for a dangerous operation
   */
  static async requestApproval(toolIdentifier: string, parameters: any = {}): Promise<{ id: string; approved: boolean }> {
    // For now, return a mock approval request
    return {
      id: `approval-${Date.now()}`,
      approved: false, // Requires manual approval
    };
  }

  /**
   * Generate tool documentation
   */
  static generateDocumentation(): string {
    const tools = Array.from(this.tools.values());
    const aiEnabledTools = tools.filter((t) => t.aiEnabled);
    const testOnlyTools = tools.filter((t) => !t.aiEnabled);

    let doc = `# Supernal Interface Tools\n\n`;
    doc += `**Total Tools**: ${tools.length}\n`;
    doc += `**AI-Enabled**: ${aiEnabledTools.length}\n`;
    doc += `**Test-Only**: ${testOnlyTools.length}\n\n`;

    doc += `## AI-Enabled Tools\n\n`;
    aiEnabledTools.forEach((tool) => {
      doc += `### ${tool.name}\n`;
      doc += `- **Description**: ${tool.aiDescription || tool.description}\n`;
      doc += `- **Danger Level**: ${tool.dangerLevel}\n`;
      doc += `- **Requires Approval**: ${tool.requiresApproval ? 'Yes' : 'No'}\n`;
      doc += `- **Examples**: ${tool.examples.join(', ')}\n\n`;
    });

    doc += `## Test-Only Tools\n\n`;
    testOnlyTools.forEach((tool) => {
      doc += `### ${tool.name}\n`;
      doc += `- **Description**: ${tool.description}\n`;
      doc += `- **Danger Level**: ${tool.dangerLevel}\n\n`;
    });

    return doc;
  }

  /**
   * Clear all tools (for testing)
   */
  static clear(): void {
    this.tools.clear();
    console.log('🧹 ToolRegistry: Cleared all tools');
  }

  /**
   * Get tools grouped by container for MCP/AI consumption
   * 
   * Returns a hierarchical structure:
   * {
   *   global: [...tools without containerId...],
   *   DemoSimple: [...tools with containerId='DemoSimple'...],
   *   Examples: [...tools with containerId='Examples'...],
   *   ...
   * }
   * 
   * This helps AI agents understand tool organization and prioritize
   * contextually relevant tools.
   */
  static getToolsGroupedByContainer(): Record<string, ToolMetadata[]> {
    const grouped: Record<string, ToolMetadata[]> = {
      global: [],
    };
    
    for (const tool of this.tools.values()) {
      const container = tool.containerId || 'global';
      if (!grouped[container]) {
        grouped[container] = [];
      }
      grouped[container].push(tool);
    }
    
    return grouped;
  }

  /**
   * Get tools grouped by component within a container
   * 
   * Returns a hierarchical structure:
   * {
   *   DemoSimple: {
   *     counter: [...counter tools...],
   *     timer: [...timer tools...],
   *   },
   *   global: {
   *     navigation: [...navigation tools...],
   *     theme: [...theme tools...],
   *   }
   * }
   */
  static getToolsGroupedByComponentAndContainer(): Record<string, Record<string, ToolMetadata[]>> {
    const grouped: Record<string, Record<string, ToolMetadata[]>> = {};
    
    for (const tool of this.tools.values()) {
      const container = tool.containerId || 'global';
      const component = tool.componentName || 'ungrouped';
      
      if (!grouped[container]) {
        grouped[container] = {};
      }
      
      if (!grouped[container][component]) {
        grouped[container][component] = [];
      }
      
      grouped[container][component].push(tool);
    }
    
    return grouped;
  }
}
