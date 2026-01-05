/**
 * Test Data Manager
 * 
 * Manages test fixtures, scenarios, and data providers.
 * Enables mock/real data switching for comprehensive testing.
 */

export interface TestDataSet<T = any> {
  id: string;
  name: string;
  description: string;
  data: T;
  tags: string[];
  dependencies?: string[];  // Other datasets needed
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  storyId?: string;         // Associated story
  initialData: Record<string, any>;
  expectedOutcome: any;
  tags?: string[];
}

export type DataMode = 'mock' | 'real' | 'hybrid';

export class TestDataManager {
  private fixtures = new Map<string, TestDataSet>();
  private scenarios = new Map<string, TestScenario>();
  private mode: DataMode = 'mock';
  
  /**
   * Load fixtures from data object
   */
  loadFixtures(fixtures: Record<string, any>): void {
    for (const [key, data] of Object.entries(fixtures)) {
      const dataset: TestDataSet = {
        id: key,
        name: key,
        description: `Test fixture: ${key}`,
        data,
        tags: []
      };
      this.fixtures.set(key, dataset);
    }
  }
  
  /**
   * Load scenarios
   */
  loadScenarios(scenarios: TestScenario[]): void {
    scenarios.forEach(scenario => {
      this.scenarios.set(scenario.id, scenario);
    });
  }
  
  /**
   * Register a single fixture
   */
  registerFixture<T>(fixture: TestDataSet<T>): void {
    this.fixtures.set(fixture.id, fixture);
  }
  
  /**
   * Get data by key
   */
  getData<T = any>(key: string, fallback?: T): T {
    const parts = key.split('.');
    
    // Support nested access like 'users.admin'
    if (parts.length > 1) {
      const [fixtureId, ...path] = parts;
      const fixture = this.fixtures.get(fixtureId);
      
      if (!fixture) {
        if (fallback !== undefined) return fallback;
        throw new Error(`Fixture '${fixtureId}' not found`);
      }
      
      let value = fixture.data;
      for (const prop of path) {
        if (value && typeof value === 'object' && prop in value) {
          value = value[prop];
        } else {
          if (fallback !== undefined) return fallback;
          throw new Error(`Property '${key}' not found in fixture`);
        }
      }
      
      return value as T;
    }
    
    // Direct fixture access
    const fixture = this.fixtures.get(key);
    if (!fixture) {
      if (fallback !== undefined) return fallback;
      throw new Error(`Fixture '${key}' not found`);
    }
    
    return fixture.data as T;
  }
  
  /**
   * Get scenario by ID
   */
  getScenario(id: string): TestScenario | undefined {
    return this.scenarios.get(id);
  }
  
  /**
   * Get all scenarios with tag
   */
  getScenariosByTag(tag: string): TestScenario[] {
    return Array.from(this.scenarios.values())
      .filter(scenario => scenario.tags?.includes(tag));
  }
  
  /**
   * Set data mode
   */
  setMode(mode: DataMode): void {
    this.mode = mode;
    console.log(`🔄 Test data mode: ${mode}`);
  }
  
  /**
   * Get current mode
   */
  getMode(): DataMode {
    return this.mode;
  }
  
  /**
   * Check if key exists
   */
  has(key: string): boolean {
    const parts = key.split('.');
    if (parts.length > 1) {
      return this.fixtures.has(parts[0]);
    }
    return this.fixtures.has(key);
  }
  
  /**
   * Get all fixture keys
   */
  getKeys(): string[] {
    return Array.from(this.fixtures.keys());
  }
  
  /**
   * Clear all data
   */
  clear(): void {
    this.fixtures.clear();
    this.scenarios.clear();
  }
  
  /**
   * Get statistics
   */
  getStats(): {
    fixtures: number;
    scenarios: number;
    mode: DataMode;
  } {
    return {
      fixtures: this.fixtures.size,
      scenarios: this.scenarios.size,
      mode: this.mode
    };
  }
}

/**
 * Default fixtures for common test scenarios
 */
export const defaultFixtures = {
  users: {
    admin: {
      username: 'admin@test.com',
      password: 'test123',
      role: 'admin',
      permissions: ['read', 'write', 'delete']
    },
    standard: {
      username: 'user@test.com',
      password: 'test123',
      role: 'user',
      permissions: ['read']
    },
    guest: {
      username: 'guest@test.com',
      password: 'guest123',
      role: 'guest',
      permissions: []
    }
  },
  
  messages: {
    simple: 'Hello, World!',
    long: 'This is a longer test message that spans multiple words and tests text handling.',
    special: 'Test with special chars: @#$%^&*()',
    emoji: 'Test with emoji 🎉 🚀 ✨'
  },
  
  navigation: {
    paths: {
      home: '/',
      demo: '/demo',
      dashboard: '/dashboard',
      settings: '/settings'
    }
  }
};

/**
 * Global test data manager instance
 */
export const testDataManager = new TestDataManager();

// Load default fixtures
testDataManager.loadFixtures(defaultFixtures);
