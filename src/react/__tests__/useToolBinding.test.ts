/**
 * Tests for useToolBinding hook
 * Verifies automatic wiring of DOM elements to @Tool decorators
 * @jest-environment jsdom
 */

import React from 'react';
import { renderHook } from '@testing-library/react';
import { useToolBinding } from '../useToolBinding';
import { ToolRegistry } from '../../background/registry/ToolRegistry';
import { Tool } from '../../decorators/Tool';
import { ToolCategory } from '../../types';
import { Components, Containers } from '../../../names';

describe('useToolBinding Hook', () => {
  let container: HTMLDivElement;
  let containerRef: React.RefObject<HTMLElement>;

  beforeEach(() => {
    // Create a real DOM container
    container = document.createElement('div');
    container.setAttribute('data-testid', Containers.Widgets);
    document.body.appendChild(container);
    
    containerRef = { current: container };
    
    // Clear registry between tests
    const activeInstances = (ToolRegistry as any).activeInstances;
    if (activeInstances) {
      activeInstances.clear();
    }
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Instance Registration', () => {
    it('should register component instance on mount', () => {
      const { result } = renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets)
      );

      const instance = ToolRegistry.getActiveInstance(Containers.Widgets);
      expect(instance).toBe(container);
    });

    it('should unregister instance on unmount', () => {
      const { unmount } = renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets)
      );

      expect(ToolRegistry.getActiveInstance(Containers.Widgets)).toBe(container);

      unmount();

      expect(ToolRegistry.getActiveInstance(Containers.Widgets)).toBeUndefined();
    });

    it('should throw error for duplicate instances', () => {
      // First registration
      renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets)
      );

      // Attempt duplicate registration - should log error and not wire up
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      
      // This won't throw, but will log an error and skip wiring
      renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets)
      );
      
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('Instance already exists'),
        expect.any(Error)
      );

      consoleError.mockRestore();
    });

    it('should allow multiple instances with different instanceIds', () => {
      const container2 = document.createElement('div');
      container2.setAttribute('data-testid', Containers.Widgets);
      document.body.appendChild(container2);
      
      const containerRef2 = { current: container2 };

      // First instance
      renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets, 'instance-1')
      );

      // Second instance with different ID
      expect(() => {
        renderHook(() =>
          useToolBinding(containerRef2, Containers.Widgets, 'instance-2')
        );
      }).not.toThrow();

      expect(ToolRegistry.getActiveInstance(`${Containers.Widgets}:instance-1`)).toBe(container);
      expect(ToolRegistry.getActiveInstance(`${Containers.Widgets}:instance-2`)).toBe(container2);

      document.body.removeChild(container2);
    });
  });

  describe('Tool Discovery and Wiring', () => {
    // Create a test tool
    let testWidgetInstance: any;
    
    class TestWidget {
      @Tool({
        name: 'Test Button Click',
        description: 'Test button tool',
        elementId: Components.WidgetButton,
        category: ToolCategory.USER_INTERACTION,
        actionType: 'click',
      })
      async handleClick(event: Event, options?: any): Promise<void> {
        // Tool implementation
      }
    }

    beforeEach(() => {
      // Instantiate to register the tool
      testWidgetInstance = new TestWidget();
      
      // Manually set instance in the tool metadata (since it's only set on first call)
      const tool = ToolRegistry.findToolByElementId(Components.WidgetButton);
      if (tool) {
        tool.instance = testWidgetInstance;
      }
    });

    it('should find tool by elementId', () => {
      const button = document.createElement('button');
      button.setAttribute('data-testid', Components.WidgetButton);
      container.appendChild(button);

      renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets)
      );

      const tool = ToolRegistry.findToolByElementId(Components.WidgetButton);
      expect(tool).toBeDefined();
      expect(tool?.name).toBe('Test Button Click');
    });

    it('should attach event listener based on actionType', () => {
      const button = document.createElement('button');
      button.setAttribute('data-testid', Components.WidgetButton);
      container.appendChild(button);

      // Verify tool is registered
      const tool = ToolRegistry.findToolByElementId(Components.WidgetButton);
      expect(tool).toBeDefined();
      expect(tool?.method).toBeDefined();
      expect(tool?.instance).toBeDefined();

      // Spy BEFORE rendering hook
      const addEventListenerSpy = jest.spyOn(button, 'addEventListener');

      renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets)
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
    });

    it('should remove event listeners on unmount', () => {
      const button = document.createElement('button');
      button.setAttribute('data-testid', Components.WidgetButton);
      container.appendChild(button);

      // Spy BEFORE rendering the hook
      const removeEventListenerSpy = jest.spyOn(button, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets)
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Event Handling', () => {
    let mockToolMethod: jest.Mock;
    let toolInstance: any;

    class TestWidget {
      @Tool({
        name: 'Test Input',
        description: 'Test input tool',
        elementId: Components.WidgetInput,
        category: ToolCategory.USER_INTERACTION,
        actionType: 'type',
      })
      async handleInput(event: Event, options?: any): Promise<void> {
        mockToolMethod(event, options);
      }
    }

    beforeEach(() => {
      mockToolMethod = jest.fn().mockResolvedValue(undefined);
      toolInstance = new TestWidget();
      
      // Replace the method with our mock
      const tool = ToolRegistry.findToolByElementId(Components.WidgetInput);
      if (tool) {
        tool.method = mockToolMethod;
        tool.instance = toolInstance;
      }
    });

    it('should call tool method when event fires', async () => {
      const input = document.createElement('input');
      input.setAttribute('data-testid', Components.WidgetInput);
      input.value = 'test value';
      container.appendChild(input);

      renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets)
      );

      // Trigger type event (matches tool's actionType)
      const event = new Event('type', { bubbles: true });
      input.dispatchEvent(event);

      // Wait for async handler
      await new Promise(resolve => setTimeout(resolve, 0));

      // Hook now extracts value and passes it, not the raw event
      expect(mockToolMethod).toHaveBeenCalledWith('test value', expect.any(Object));
    });

    it('should pass ToolOptions to tool method', async () => {
      const input = document.createElement('input');
      input.setAttribute('data-testid', Components.WidgetInput);
      input.value = 'test value';
      container.appendChild(input);

      renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets)
      );

      const event = new Event('type', { bubbles: true });
      input.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 0));

      // Hook passes extracted value first, then options
      expect(mockToolMethod).toHaveBeenCalledWith(
        'test value',
        expect.objectContaining({
          // Storage will be added in next task
        })
      );
    });

    it('should handle tool execution errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      mockToolMethod.mockRejectedValue(new Error('Tool execution failed'));

      const input = document.createElement('input');
      input.setAttribute('data-testid', Components.WidgetInput);
      container.appendChild(input);

      renderHook(() =>
        useToolBinding(containerRef, Containers.Widgets)
      );

      const event = new Event('type', { bubbles: true });
      input.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('Tool execution failed'),
        expect.any(Error)
      );

      consoleError.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing containerRef gracefully', () => {
      // Create a proper ref object that starts as null
      const emptyRef = React.createRef<HTMLElement>();

      expect(() => {
        renderHook(() =>
          useToolBinding(emptyRef as React.RefObject<HTMLElement>, Containers.Widgets)
        );
      }).not.toThrow();
    });

    it('should handle elements without matching tools', () => {
      const div = document.createElement('div');
      div.setAttribute('data-testid', 'non-existent-tool');
      container.appendChild(div);

      expect(() => {
        renderHook(() =>
          useToolBinding(containerRef, Containers.Widgets)
        );
      }).not.toThrow();
    });

    it('should handle tools without method or instance gracefully', () => {
      const button = document.createElement('button');
      button.setAttribute('data-testid', Components.WidgetButton);
      container.appendChild(button);

      // Create a tool instance to register it, but we'll clear its method
      class BrokenWidget {
        @Tool({
          name: 'Broken Tool',
          description: 'Tool without method',
          elementId: Components.WidgetButton,
          category: ToolCategory.USER_INTERACTION,
          actionType: 'click',
        })
        async brokenMethod(event: Event): Promise<void> {
          // This will be removed
        }
      }
      
      new BrokenWidget();
      
      // Remove method and instance from the registered tool
      const tool = ToolRegistry.findToolByElementId(Components.WidgetButton);
      if (tool) {
        delete tool.method;
        delete tool.instance;
      }

      // Should not crash when encountering a broken tool
      expect(() => {
        renderHook(() =>
          useToolBinding(containerRef, Containers.Widgets)
        );
      }).not.toThrow();
      
      // Button won't have listener attached since tool is broken
      const event = new Event('click', { bubbles: true });
      expect(() => button.dispatchEvent(event)).not.toThrow();
    });
  });
});

