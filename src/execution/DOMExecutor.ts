/**
 * DOM Executor
 *
 * Executes tools in live browser environment using DOM APIs.
 * Handles real-time UI interactions and browser automation.
 */

import { ToolMetadata } from '../decorators/Tool';
import { UniversalExecutionContext, UniversalToolResult } from '../background/registry/ToolRegistry';

export class DOMExecutor {
  /**
   * Execute a tool in live DOM context
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

      // Handle API tools
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
   * Execute UI-based tool using DOM APIs
   */
  private async executeUITool(tool: ToolMetadata, parameters: any): Promise<UniversalToolResult> {
    const startTime = Date.now();

    try {
      // Find the UI element
      let element: Element | null = null;

      if (tool.uiSelector) {
        element = document.querySelector(tool.uiSelector);
      } else if (tool.testId) {
        element = document.querySelector(`[data-testid="${tool.testId}"]`);
      }

      if (!element) {
        throw new Error(`UI element not found for tool: ${tool.name}`);
      }

      // Execute based on tool type
      const methodName = tool.methodName.toLowerCase();
      const result = await this.performUIAction(element, methodName, parameters);

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
   * Execute API tool using fetch
   */
  private async executeAPITool(tool: ToolMetadata, parameters: any): Promise<UniversalToolResult> {
    const startTime = Date.now();

    try {
      const methodName = tool.methodName.toLowerCase();
      let method = 'GET';
      let endpoint = '/api/default';

      // Infer HTTP method and endpoint
      if (methodName.includes('create') || methodName.includes('add')) {
        method = 'POST';
        endpoint = '/api/create';
      } else if (methodName.includes('update') || methodName.includes('modify')) {
        method = 'PUT';
        endpoint = '/api/update';
      } else if (methodName.includes('delete') || methodName.includes('remove')) {
        method = 'DELETE';
        endpoint = '/api/delete';
      } else if (methodName.includes('get') || methodName.includes('fetch')) {
        method = 'GET';
        endpoint = '/api/get';
      }

      // Override with parameters if provided
      if (parameters.endpoint) {
        endpoint = parameters.endpoint;
      }
      if (parameters.method) {
        method = parameters.method;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...parameters.headers,
        },
        body: method !== 'GET' ? JSON.stringify(parameters.data || parameters) : undefined,
      });

      const data = await response.json();

      return {
        success: response.ok,
        data,
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
   * Perform UI action on element
   */
  private async performUIAction(
    element: Element,
    methodName: string,
    parameters: any
  ): Promise<any> {
    const name = methodName.toLowerCase();

    if (name.includes('click')) {
      (element as HTMLElement).click();
      return { action: 'click', element: element.tagName };
    }

    if (name.includes('type') || name.includes('input')) {
      const input = element as HTMLInputElement;
      const text = parameters.text || parameters.value || '';
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return { action: 'type', text, element: element.tagName };
    }

    if (name.includes('select')) {
      const select = element as HTMLSelectElement;
      const value = parameters.value || parameters.option || '';
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return { action: 'select', value, element: element.tagName };
    }

    if (name.includes('navigate')) {
      const url = parameters.url || parameters.path || '/';
      window.location.href = url;
      return { action: 'navigate', url };
    }

    if (name.includes('scroll')) {
      element.scrollIntoView({ behavior: 'smooth' });
      return { action: 'scroll', element: element.tagName };
    }

    if (name.includes('hover')) {
      const event = new MouseEvent('mouseover', { bubbles: true });
      element.dispatchEvent(event);
      return { action: 'hover', element: element.tagName };
    }

    // Default: click
    (element as HTMLElement).click();
    return { action: 'click', element: element.tagName };
  }

  /**
   * Wait for element to appear
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<Element | null> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return null;
  }

  /**
   * Wait for condition to be true
   */
  async waitForCondition(condition: () => boolean, timeout: number = 5000): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (condition()) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return false;
  }

  /**
   * Get element information
   */
  getElementInfo(element: Element): any {
    return {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      textContent: element.textContent?.trim(),
      attributes: Array.from(element.attributes).reduce(
        (acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        },
        {} as Record<string, string>
      ),
    };
  }

  /**
   * Take screenshot (if supported)
   */
  async captureScreenshot(): Promise<string | null> {
    try {
      // Use html2canvas if available
      if (typeof (window as any).html2canvas === 'function') {
        const canvas = await (window as any).html2canvas(document.body);
        return canvas.toDataURL();
      }

      // Fallback: not supported in regular DOM
      return null;
    } catch (error) {
      console.warn('Screenshot capture failed:', error);
      return null;
    }
  }
}
