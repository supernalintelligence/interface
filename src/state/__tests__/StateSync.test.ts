/**
 * StateSync Tests
 * 
 * Tests for state synchronization utilities used by @Component decorator.
 */

import {
  syncStateToDom,
  triggerStateChange,
  getStateFromDom,
  waitForState,
  onStateChange,
  type StateChangeEventDetail
} from '../StateSync';

describe('StateSync', () => {
  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = '';
  });

  describe('syncStateToDom', () => {
    it('should write state to data-state attribute', () => {
      // Create element
      const div = document.createElement('div');
      div.setAttribute('data-component', 'counter');
      document.body.appendChild(div);

      // Sync state
      const state = { value: 10 };
      syncStateToDom('counter', state);

      // Verify
      const stateAttr = div.getAttribute('data-state');
      expect(stateAttr).toBe('{"value":10}');
      expect(JSON.parse(stateAttr!)).toEqual(state);
    });

    it('should handle complex state objects', () => {
      const div = document.createElement('div');
      div.setAttribute('data-component', 'form');
      document.body.appendChild(div);

      const state = {
        fields: {
          name: 'John',
          email: 'john@example.com'
        },
        errors: [],
        submitted: false
      };

      syncStateToDom('form', state);

      const stateAttr = div.getAttribute('data-state');
      expect(JSON.parse(stateAttr!)).toEqual(state);
    });

    it('should handle missing element gracefully', () => {
      // No element in DOM
      expect(() => {
        syncStateToDom('nonexistent', { value: 10 });
      }).not.toThrow();
    });

    it('should handle non-serializable state gracefully', () => {
      const div = document.createElement('div');
      div.setAttribute('data-component', 'test');
      document.body.appendChild(div);

      // State with circular reference
      const state: any = { value: 10 };
      state.circular = state;

      // Should log error but not throw
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      syncStateToDom('test', state);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[StateSync] Failed to serialize'),
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });

    it('should update existing state', () => {
      const div = document.createElement('div');
      div.setAttribute('data-component', 'counter');
      document.body.appendChild(div);

      // Initial state
      syncStateToDom('counter', { value: 0 });
      expect(div.getAttribute('data-state')).toBe('{"value":0}');

      // Updated state
      syncStateToDom('counter', { value: 10 });
      expect(div.getAttribute('data-state')).toBe('{"value":10}');
    });
  });

  describe('triggerStateChange', () => {
    it('should dispatch component:state:change event', (done) => {
      const handler = (event: Event) => {
        const customEvent = event as CustomEvent<StateChangeEventDetail>;
        expect(customEvent.detail.component).toBe('counter');
        expect(customEvent.detail.state).toEqual({ value: 10 });
        expect(customEvent.detail.timestamp).toBeGreaterThan(0);
        done();
      };

      window.addEventListener('component:state:change', handler);

      triggerStateChange('counter', { value: 10 });

      window.removeEventListener('component:state:change', handler);
    });

    it('should not bubble events', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      let bubbledToDiv = false;
      div.addEventListener('component:state:change', () => {
        bubbledToDiv = true;
      });

      triggerStateChange('test', { value: 1 });

      expect(bubbledToDiv).toBe(false);
    });

    it('should include timestamp', (done) => {
      const beforeTime = Date.now();

      window.addEventListener('component:state:change', (event: Event) => {
        const customEvent = event as CustomEvent<StateChangeEventDetail>;
        const afterTime = Date.now();

        expect(customEvent.detail.timestamp).toBeGreaterThanOrEqual(beforeTime);
        expect(customEvent.detail.timestamp).toBeLessThanOrEqual(afterTime);
        done();
      });

      triggerStateChange('test', {});
    });
  });

  describe('getStateFromDom', () => {
    it('should read state from data-state attribute', () => {
      const div = document.createElement('div');
      div.setAttribute('data-component', 'counter');
      div.setAttribute('data-state', '{"value":10}');
      document.body.appendChild(div);

      const state = getStateFromDom('counter');
      expect(state).toEqual({ value: 10 });
    });

    it('should return null for missing element', () => {
      const state = getStateFromDom('nonexistent');
      expect(state).toBeNull();
    });

    it('should return null for missing data-state', () => {
      const div = document.createElement('div');
      div.setAttribute('data-component', 'counter');
      document.body.appendChild(div);

      const state = getStateFromDom('counter');
      expect(state).toBeNull();
    });

    it('should handle malformed JSON gracefully', () => {
      const div = document.createElement('div');
      div.setAttribute('data-component', 'counter');
      div.setAttribute('data-state', 'not-json');
      document.body.appendChild(div);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const state = getStateFromDom('counter');
      expect(state).toBeNull();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[StateSync] Failed to parse'),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should round-trip state correctly', () => {
      const div = document.createElement('div');
      div.setAttribute('data-component', 'form');
      document.body.appendChild(div);

      const originalState = {
        fields: { name: 'John', email: 'john@example.com' },
        errors: [],
        submitted: false
      };

      syncStateToDom('form', originalState);
      const retrievedState = getStateFromDom('form');

      expect(retrievedState).toEqual(originalState);
    });
  });

  describe('waitForState', () => {
    it('should resolve when predicate returns true', async () => {
      const div = document.createElement('div');
      div.setAttribute('data-component', 'counter');
      document.body.appendChild(div);

      // Set initial state
      syncStateToDom('counter', { value: 0 });

      // Start waiting
      const waitPromise = waitForState<{ value: number }>(
        'counter',
        (state) => state.value === 10,
        1000
      );

      // Update state after short delay
      setTimeout(() => {
        syncStateToDom('counter', { value: 10 });
      }, 100);

      const result = await waitPromise;
      expect(result).toEqual({ value: 10 });
    });

    it('should timeout if predicate never returns true', async () => {
      const div = document.createElement('div');
      div.setAttribute('data-component', 'counter');
      div.setAttribute('data-state', '{"value":0}');
      document.body.appendChild(div);

      await expect(
        waitForState('counter', (state: any) => state.value === 999, 100)
      ).rejects.toThrow('Timeout waiting');
    });

    it('should resolve immediately if predicate is already true', async () => {
      const div = document.createElement('div');
      div.setAttribute('data-component', 'counter');
      div.setAttribute('data-state', '{"value":10}');
      document.body.appendChild(div);

      const result = await waitForState<{ value: number}>(
        'counter',
        (state) => state.value === 10,
        1000
      );

      expect(result).toEqual({ value: 10 });
    });
  });

  describe('onStateChange', () => {
    it('should call callback on state change', (done) => {
      const callback = (detail: StateChangeEventDetail) => {
        expect(detail.component).toBe('counter');
        expect(detail.state).toEqual({ value: 10 });
        done();
      };

      const unsubscribe = onStateChange('counter', callback);

      triggerStateChange('counter', { value: 10 });

      unsubscribe();
    });

    it('should only call callback for matching component', () => {
      const callback = jest.fn();

      const unsubscribe = onStateChange('counter', callback);

      triggerStateChange('other-component', { value: 1 });
      triggerStateChange('counter', { value: 2 });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          component: 'counter',
          state: { value: 2 }
        })
      );

      unsubscribe();
    });

    it('should call callback for all components with wildcard', () => {
      const callback = jest.fn();

      const unsubscribe = onStateChange('*', callback);

      triggerStateChange('component1', { value: 1 });
      triggerStateChange('component2', { value: 2 });

      expect(callback).toHaveBeenCalledTimes(2);

      unsubscribe();
    });

    it('should stop calling callback after unsubscribe', () => {
      const callback = jest.fn();

      const unsubscribe = onStateChange('counter', callback);

      triggerStateChange('counter', { value: 1 });
      unsubscribe();
      triggerStateChange('counter', { value: 2 });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should support multiple subscribers', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const unsubscribe1 = onStateChange('counter', callback1);
      const unsubscribe2 = onStateChange('counter', callback2);

      triggerStateChange('counter', { value: 1 });

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      unsubscribe1();
      unsubscribe2();
    });
  });
});
