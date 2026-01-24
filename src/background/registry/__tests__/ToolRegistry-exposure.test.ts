/**
 * ToolRegistry + ExposureCollector Integration Tests
 *
 * Tests that tools are automatically filtered based on element visibility
 */

import { ToolRegistry } from '../ToolRegistry';
import { LocationContext } from '../../location/LocationContext';
import { ExposureCollector } from '../../../exposure/ExposureCollector';
import { ExposureState } from '../../../types/ExposureState';
import { Tool } from '../../../decorators/Tool';
import { ToolProvider } from '../../../decorators/ToolProvider';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
} as any;

describe('ToolRegistry + ExposureCollector Integration', () => {
  let collector: ExposureCollector;

  beforeEach(() => {
    // Reset all singletons
    LocationContext.reset();
    ToolRegistry.clear();

    // Get fresh collector instance
    collector = ExposureCollector.getInstance();
    collector.destroy();
    collector = ExposureCollector.getInstance();
  });

  afterEach(() => {
    collector.destroy();
    ToolRegistry.clear();
  });

  test('tools filtered by visible elements automatically', () => {
    // Set location with empty elements array (no elements visible yet)
    LocationContext.setCurrent({ page: '/demo', elements: [] });

    // Define test tool class
    @ToolProvider({ category: 'test' })
    class TestTools {
      @Tool({
        elementId: 'increment-button',
        name: 'Increment',
        description: 'Increment counter'
      })
      async increment() {
        return { success: true };
      }
    }

    // Create instance to trigger registration
    new TestTools();

    // Create hidden mock element (display:none so it won't be auto-detected as visible)
    const mockElement = document.createElement('button');
    mockElement.setAttribute('data-testid', 'increment-button');
    mockElement.style.display = 'none'; // Hide element
    document.body.appendChild(mockElement);

    // Register element in ExposureCollector (will be PRESENT but not VISIBLE)
    collector.registerTool('increment-button', mockElement);

    // Tool NOT available yet (element not visible)
    let tools = ToolRegistry.getToolsByLocation();
    let incrementTool = tools.find(t => t.elementId === 'increment-button');
    expect(incrementTool).toBeUndefined();

    // Make element visible - this should update LocationContext.elements
    collector.updateToolState('increment-button', ExposureState.INTERACTABLE);

    // Verify LocationContext was updated
    const location = LocationContext.getCurrent();
    expect(location?.elements).toContain('increment-button');

    // Tool automatically available now (zero config!)
    tools = ToolRegistry.getToolsByLocation();
    incrementTool = tools.find(t => t.elementId === 'increment-button');
    expect(incrementTool).toBeDefined();
    expect(incrementTool?.name).toBe('Increment');

    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('tools unavailable when element becomes hidden', () => {
    // Set location with empty elements array
    LocationContext.setCurrent({ page: '/demo', elements: [] });

    // Define test tool class
    @ToolProvider({ category: 'test' })
    class TestTools {
      @Tool({
        elementId: 'button-1',
        name: 'Test Button',
        description: 'Test button'
      })
      async testButton() {
        return { success: true };
      }
    }

    new TestTools();

    // Create mock element
    const mockElement = document.createElement('button');
    mockElement.setAttribute('data-testid', 'button-1');
    document.body.appendChild(mockElement);

    // Register element
    collector.registerTool('button-1', mockElement);

    // Make visible
    collector.updateToolState('button-1', ExposureState.INTERACTABLE);

    // Tool available
    let tools = ToolRegistry.getToolsByLocation();
    expect(tools.some(t => t.elementId === 'button-1')).toBe(true);

    // Make hidden
    collector.updateToolState('button-1', ExposureState.PRESENT);

    // Verify LocationContext updated
    const location = LocationContext.getCurrent();
    expect(location?.elements).not.toContain('button-1');

    // Tool automatically unavailable
    tools = ToolRegistry.getToolsByLocation();
    expect(tools.some(t => t.elementId === 'button-1')).toBe(false);

    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('multiple visible tools all available', () => {
    // Set location with empty elements array
    LocationContext.setCurrent({ page: '/demo', elements: [] });

    // Define test tools
    @ToolProvider({ category: 'test' })
    class TestTools {
      @Tool({
        elementId: 'button-1',
        name: 'Button 1',
        description: 'First button'
      })
      async button1() {
        return { success: true };
      }

      @Tool({
        elementId: 'button-2',
        name: 'Button 2',
        description: 'Second button'
      })
      async button2() {
        return { success: true };
      }

      @Tool({
        elementId: 'button-3',
        name: 'Button 3',
        description: 'Third button'
      })
      async button3() {
        return { success: true };
      }
    }

    new TestTools();

    // Create mock elements
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    const btn3 = document.createElement('button');
    btn1.setAttribute('data-testid', 'button-1');
    btn2.setAttribute('data-testid', 'button-2');
    btn3.setAttribute('data-testid', 'button-3');
    document.body.appendChild(btn1);
    document.body.appendChild(btn2);
    document.body.appendChild(btn3);

    // Register all elements
    collector.registerTool('button-1', btn1);
    collector.registerTool('button-2', btn2);
    collector.registerTool('button-3', btn3);

    // Make all visible
    collector.updateToolState('button-1', ExposureState.INTERACTABLE);
    collector.updateToolState('button-2', ExposureState.VISIBLE);
    collector.updateToolState('button-3', ExposureState.EXPOSED);

    // All tools available
    const tools = ToolRegistry.getToolsByLocation();
    expect(tools.some(t => t.elementId === 'button-1')).toBe(true);
    expect(tools.some(t => t.elementId === 'button-2')).toBe(true);
    expect(tools.some(t => t.elementId === 'button-3')).toBe(true);

    // Cleanup
    document.body.removeChild(btn1);
    document.body.removeChild(btn2);
    document.body.removeChild(btn3);
  });

  test('tools without elementId not affected by visibility filtering', () => {
    // Set location with empty elements array
    LocationContext.setCurrent({ page: '/demo', elements: [] });

    // Define tool without elementId (programmatic tool)
    @ToolProvider({ category: 'test' })
    class TestTools {
      @Tool({
        name: 'Programmatic Tool',
        description: 'Tool without DOM element'
      })
      async programmaticTool() {
        return { success: true };
      }
    }

    new TestTools();

    // Tool should always be available (no element-based filtering)
    const tools = ToolRegistry.getToolsByLocation();
    const programmaticTool = tools.find(t => t.name === 'Programmatic Tool');
    expect(programmaticTool).toBeDefined();
  });

  test('tools without elementId always available (backward compat)', () => {
    // Set location with empty elements array
    LocationContext.setCurrent({ page: '/demo', elements: [] });

    // Define tool without elementId
    @ToolProvider({ category: 'test' })
    class TestTools {
      @Tool({
        // No elementId - should always be available
        name: 'Legacy Tool',
        description: 'Tool without element-based scoping'
      })
      async legacyTool() {
        return { success: true };
      }
    }

    new TestTools();

    // Tool should always be available (no element-based filtering)
    const tools = ToolRegistry.getToolsByLocation();
    const legacyTool = tools.find(t => t.name === 'Legacy Tool');
    expect(legacyTool).toBeDefined();
  });
});
