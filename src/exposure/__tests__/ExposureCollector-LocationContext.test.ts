/**
 * ExposureCollector → LocationContext Integration Tests
 *
 * Tests that ExposureCollector automatically syncs visible tools to LocationContext.elements
 */

import { ExposureCollector } from '../ExposureCollector';
import { LocationContext } from '../../background/location/LocationContext';
import { ExposureState } from '../../types/ExposureState';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
} as any;

describe('ExposureCollector → LocationContext Integration', () => {
  let collector: ExposureCollector;

  beforeEach(() => {
    // Reset LocationContext
    LocationContext.reset();

    // Get fresh collector instance
    collector = ExposureCollector.getInstance();

    // Clear any existing registrations
    collector.destroy();
    collector = ExposureCollector.getInstance();
  });

  afterEach(() => {
    collector.destroy();
  });

  test('updates LocationContext.elements when tool becomes visible', () => {
    // Set initial location
    LocationContext.setCurrent({ page: '/demo' });

    // Create mock element
    const mockElement = document.createElement('button');
    document.body.appendChild(mockElement);

    // Register tool
    collector.registerTool('increment-button', mockElement);

    // Simulate visibility change
    collector.updateToolState('increment-button', ExposureState.VISIBLE);

    // Check LocationContext was updated
    const location = LocationContext.getCurrent();
    expect(location?.elements).toContain('increment-button');

    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('removes from LocationContext.elements when tool becomes hidden', () => {
    // Set initial location
    LocationContext.setCurrent({ page: '/demo' });

    // Create mock element
    const mockElement = document.createElement('button');
    document.body.appendChild(mockElement);

    // Register tool
    collector.registerTool('increment-button', mockElement);

    // Make visible
    collector.updateToolState('increment-button', ExposureState.VISIBLE);
    expect(LocationContext.getCurrent()?.elements).toContain('increment-button');

    // Make hidden
    collector.updateToolState('increment-button', ExposureState.PRESENT);
    expect(LocationContext.getCurrent()?.elements).not.toContain('increment-button');

    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('syncs multiple visible tools to LocationContext', () => {
    // Set initial location
    LocationContext.setCurrent({ page: '/demo' });

    // Create mock elements
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    document.body.appendChild(btn1);
    document.body.appendChild(btn2);

    // Register multiple tools
    collector.registerTool('button-1', btn1);
    collector.registerTool('button-2', btn2);

    // Make both visible
    collector.updateToolState('button-1', ExposureState.VISIBLE);
    collector.updateToolState('button-2', ExposureState.EXPOSED);

    // Check both in LocationContext
    const location = LocationContext.getCurrent();
    expect(location?.elements).toContain('button-1');
    expect(location?.elements).toContain('button-2');

    // Cleanup
    document.body.removeChild(btn1);
    document.body.removeChild(btn2);
  });

  test('does not include NOT_PRESENT tools in elements', () => {
    // Set initial location
    LocationContext.setCurrent({ page: '/demo' });

    // Create mock element
    const mockElement = document.createElement('button');
    document.body.appendChild(mockElement);

    // Register tool
    collector.registerTool('button-1', mockElement);

    // Set to NOT_PRESENT
    collector.updateToolState('button-1', ExposureState.NOT_PRESENT);

    // Check NOT in LocationContext
    const location = LocationContext.getCurrent();
    expect(location?.elements).not.toContain('button-1');

    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('does not include PRESENT (non-visible) tools in elements', () => {
    // Set initial location
    LocationContext.setCurrent({ page: '/demo' });

    // Create mock element
    const mockElement = document.createElement('button');
    document.body.appendChild(mockElement);

    // Register tool
    collector.registerTool('button-1', mockElement);

    // Set to PRESENT (in DOM but not visible)
    collector.updateToolState('button-1', ExposureState.PRESENT);

    // Check NOT in LocationContext
    const location = LocationContext.getCurrent();
    expect(location?.elements).not.toContain('button-1');

    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('includes INTERACTABLE tools in elements', () => {
    // Set initial location
    LocationContext.setCurrent({ page: '/demo' });

    // Create mock element
    const mockElement = document.createElement('button');
    document.body.appendChild(mockElement);

    // Register tool
    collector.registerTool('button-1', mockElement);

    // Set to INTERACTABLE
    collector.updateToolState('button-1', ExposureState.INTERACTABLE);

    // Check in LocationContext
    const location = LocationContext.getCurrent();
    expect(location?.elements).toContain('button-1');

    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('handles no LocationContext set gracefully', () => {
    // Don't set LocationContext

    // Create mock element
    const mockElement = document.createElement('button');
    document.body.appendChild(mockElement);

    // Register tool
    collector.registerTool('button-1', mockElement);

    // Should not throw error
    expect(() => {
      collector.updateToolState('button-1', ExposureState.VISIBLE);
    }).not.toThrow();

    // Cleanup
    document.body.removeChild(mockElement);
  });

  test('preserves other LocationContext properties when updating elements', () => {
    // Set initial location with metadata
    LocationContext.setCurrent({
      page: '/demo',
      route: 'demo-route',
      components: ['comp1', 'comp2'],
      metadata: { key: 'value' }
    });

    // Create mock element
    const mockElement = document.createElement('button');
    document.body.appendChild(mockElement);

    // Register tool
    collector.registerTool('button-1', mockElement);

    // Make visible
    collector.updateToolState('button-1', ExposureState.VISIBLE);

    // Check all properties preserved
    const location = LocationContext.getCurrent();
    expect(location?.page).toBe('/demo');
    expect(location?.route).toBe('demo-route');
    expect(location?.components).toEqual(['comp1', 'comp2']);
    expect(location?.metadata).toEqual({ key: 'value' });
    expect(location?.elements).toContain('button-1');

    // Cleanup
    document.body.removeChild(mockElement);
  });
});
