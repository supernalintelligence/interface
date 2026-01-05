/**
 * Testing Utilities - Browser State Injection
 * 
 * Provides complete testing infrastructure for component state management
 * in E2E and integration tests.
 * 
 * @module @supernal-interface/core/testing
 */

// Browser-side utilities
export {
  initializeTestStateManager,
  getTestStateManager,
  type TestStateManager,
  type StateUpdateEvent,
  type StateResetEvent,
} from './BrowserStateInjection';

// React hooks (enterprise feature - not in open source)
// export {
//   useTestStateInjection,
//   useTestStateAttributes,
//   useTestState,
//   setupTestStateInjection,
// } from './useTestStateInjection';

// Playwright helpers
export {
  setComponentState,
  getComponentState,
  resetComponentState,
  waitForComponent,
  hasComponent,
  setComponentStateFromContract,
  assertComponentStateMatches,
  getComponentElement,
  initializeTestState,
  batchStateOperations,
} from './PlaywrightStateHelpers';

// Test selectors
export {
  testId,
  testIds,
  tid,
  testIdContains,
  testIdStartsWith,
  testIdEndsWith,
} from './selectors';

// NOTE: ComponentStateHelpers are NOT exported here because they import Playwright
// which cannot be bundled in client code. Import directly in test files:
// import { assertComponentState } from '@supernal-interface/core/testing/ComponentStateHelpers';
