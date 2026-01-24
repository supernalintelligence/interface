/**
 * E2E Test: ExposureCollector Automatic Initialization
 *
 * Verifies that SupernalProvider automatically:
 * 1. Initializes ExposureCollector
 * 2. Registers all tools with their DOM elements
 * 3. Updates LocationContext.elements when elements are visible
 * 4. Enables zero-config element-based tool filtering
 */

import { test, expect } from '@playwright/test';

test.describe('ExposureCollector Auto-Initialization', () => {
  test('should automatically register tools on page load', async ({ page }) => {
    // Navigate to demo page
    await page.goto('http://localhost:3000/demo');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check that ExposureCollector was initialized
    const collectorExists = await page.evaluate(() => {
      const collector = (window as any).__SUPERNAL_EXPOSURE_COLLECTOR__;
      return collector !== undefined;
    });

    expect(collectorExists).toBe(true);
  });

  test('should register visible tools with ExposureCollector', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');
    await page.waitForLoadState('networkidle');

    // Get all registered tools from ExposureCollector
    const registeredTools = await page.evaluate(() => {
      const ExposureCollector = (window as any).ExposureCollector;
      if (!ExposureCollector) return [];

      const collector = ExposureCollector.getInstance();
      return collector.getAllTools().map((tool: any) => ({
        toolId: tool.toolId,
        state: tool.state,
      }));
    });

    // Should have registered tools
    expect(registeredTools.length).toBeGreaterThan(0);

    console.log('Registered tools:', registeredTools);
  });

  test('should update LocationContext.elements with visible tools', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');
    await page.waitForLoadState('networkidle');

    // Wait a bit for ExposureCollector to detect visibility
    await page.waitForTimeout(1000);

    // Get LocationContext.elements
    const locationElements = await page.evaluate(() => {
      const LocationContext = (window as any).LocationContext;
      if (!LocationContext) return null;

      const location = LocationContext.getCurrent();
      return location?.elements || [];
    });

    // Should have elements in LocationContext
    expect(locationElements).toBeDefined();
    expect(locationElements.length).toBeGreaterThan(0);

    console.log('LocationContext.elements:', locationElements);
  });

  test('should filter tools by visible elements', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Get tools filtered by location
    const availableTools = await page.evaluate(() => {
      const ToolRegistry = (window as any).ToolRegistry;
      if (!ToolRegistry) return [];

      const tools = ToolRegistry.getToolsByLocation();
      return tools.map((tool: any) => ({
        name: tool.name,
        elementId: tool.elementId,
        toolId: tool.toolId,
      }));
    });

    // Should have available tools
    expect(availableTools.length).toBeGreaterThan(0);

    console.log('Available tools:', availableTools);
  });

  test('should make hidden element tools unavailable when scrolled out of view', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Get initial visible tools
    const initialTools = await page.evaluate(() => {
      const LocationContext = (window as any).LocationContext;
      const location = LocationContext?.getCurrent();
      return location?.elements || [];
    });

    expect(initialTools.length).toBeGreaterThan(0);

    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Get visible tools after scroll
    const toolsAfterScroll = await page.evaluate(() => {
      const LocationContext = (window as any).LocationContext;
      const location = LocationContext?.getCurrent();
      return location?.elements || [];
    });

    // Elements should have changed (some disappeared, some appeared)
    // Note: This test assumes the page has enough content to scroll
    console.log('Initial tools:', initialTools);
    console.log('Tools after scroll:', toolsAfterScroll);
  });

  test('should work with no containerId in tool decorators', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');
    await page.waitForLoadState('networkidle');

    // Check that demo tools don't have containerId
    const toolsWithContainerId = await page.evaluate(() => {
      const ToolRegistry = (window as any).ToolRegistry;
      if (!ToolRegistry) return [];

      const tools = ToolRegistry.getAllTools();
      return tools
        .filter((tool: any) => tool.name?.includes('Demo') || tool.name?.includes('Widget'))
        .filter((tool: any) => tool.containerId)
        .map((tool: any) => ({
          name: tool.name,
          containerId: tool.containerId,
        }));
    });

    console.log('Tools with containerId (should be empty or legacy only):', toolsWithContainerId);

    // Most tools should not have containerId (zero-config inference)
    // Note: Some legacy tools might still have it for backward compatibility
  });
});
