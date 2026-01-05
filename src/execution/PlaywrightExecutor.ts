/**
 * Playwright Executor
 *
 * Executes tools in Playwright test environment.
 * Handles UI interactions and browser automation.
 */

import { Page } from '@playwright/test';
import { ToolMetadata } from '../decorators/Tool';
import { UniversalExecutionContext, UniversalToolResult } from '../background/registry/ToolRegistry';

export class PlaywrightExecutor {
  constructor(private page: Page) {}

  /**
   * Execute a tool in Playwright context
   */
  async execute(
    tool: ToolMetadata,
    parameters: any,
    context: UniversalExecutionContext
  ): Promise<UniversalToolResult> {
    const startTime = Date.now();

    try {
      // Handle UI-based tools
      if (tool.executionContext === 'ui' || tool.executionContext === 'both') {
        return await this.executeUITool(tool, parameters);
      }

      // Handle API tools in test context
      if (tool.executionContext === 'api') {
        return await this.executeAPITool(tool, parameters);
      }

      throw new Error(`Unsupported execution context: ${tool.executionContext}`);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        tool: `${tool.providerClass}.${tool.methodName}`,
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute UI-based tool using Playwright
   */
  private async executeUITool(tool: ToolMetadata, parameters: any): Promise<UniversalToolResult> {
    const startTime = Date.now();

    try {
      // Find the UI element
      let selector = tool.uiSelector;

      if (!selector && tool.testId) {
        selector = `[data-testid="${tool.testId}"]`;
      }

      if (!selector) {
        throw new Error(`No UI selector or testId found for tool: ${tool.name}`);
      }

      const element = this.page.locator(selector);

      // Wait for element to be visible
      await element.waitFor({ state: 'visible', timeout: 5000 });

      // Execute based on tool type
      const methodName = tool.methodName.toLowerCase();

      if (methodName.includes('click') || methodName.includes('select')) {
        await element.click();
      } else if (methodName.includes('type') || methodName.includes('input')) {
        const text = parameters.text || parameters.value || '';
        await element.fill(text);
      } else if (methodName.includes('navigate')) {
        const url = parameters.url || parameters.path || '/';
        await this.page.goto(url);
      } else {
        // Default action: click
        await element.click();
      }

      // Wait for any navigation or state changes
      await this.page.waitForTimeout(100);

      // Capture result
      const result = {
        element: selector,
        action: this.inferAction(methodName),
        parameters,
        url: this.page.url(),
        title: await this.page.title(),
      };

      return {
        success: true,
        data: result,
        tool: `${tool.providerClass}.${tool.methodName}`,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        tool: `${tool.providerClass}.${tool.methodName}`,
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute API tool in test context
   */
  private async executeAPITool(tool: ToolMetadata, parameters: any): Promise<UniversalToolResult> {
    const startTime = Date.now();

    try {
      // For API tools in Playwright context, we can:
      // 1. Make direct API calls
      // 2. Trigger UI actions that call APIs
      // 3. Mock API responses

      const methodName = tool.methodName.toLowerCase();

      if (methodName.includes('get') || methodName.includes('fetch')) {
        // Make GET request
        const response = await this.page.request.get('/api/test-endpoint', {
          data: parameters,
        });

        const data = await response.json();

        return {
          success: response.ok(),
          data,
          tool: `${tool.providerClass}.${tool.methodName}`,
          executionTime: Date.now() - startTime,
        };
      }

      if (methodName.includes('create') || methodName.includes('post')) {
        // Make POST request
        const response = await this.page.request.post('/api/test-endpoint', {
          data: parameters,
        });

        const data = await response.json();

        return {
          success: response.ok(),
          data,
          tool: `${tool.providerClass}.${tool.methodName}`,
          executionTime: Date.now() - startTime,
        };
      }

      // Default: simulate success for testing
      return {
        success: true,
        data: { simulated: true, parameters },
        tool: `${tool.providerClass}.${tool.methodName}`,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        tool: `${tool.providerClass}.${tool.methodName}`,
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Infer UI action from method name
   */
  private inferAction(methodName: string): string {
    const name = methodName.toLowerCase();

    if (name.includes('click')) return 'click';
    if (name.includes('type') || name.includes('input')) return 'type';
    if (name.includes('select')) return 'select';
    if (name.includes('navigate')) return 'navigate';
    if (name.includes('scroll')) return 'scroll';
    if (name.includes('hover')) return 'hover';

    return 'click'; // Default
  }

  /**
   * Take screenshot for debugging
   */
  async captureScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * Wait for specific condition
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 5000
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await this.page.waitForTimeout(100);
    }

    return false;
  }
}
