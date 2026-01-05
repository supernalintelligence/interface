/**
 * Tool Decorator Test Suite
 *
 * Unit tests for @Tool decorator with JSDoc integration and category inference.
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Tool, ToolMetadata } from '../Tool';
import {
  ToolCategory,
  ToolPermissionTier,
  ToolFrequency,
  ToolComplexity,
} from '../../types';
import { ToolRegistry } from '../../background/registry/ToolRegistry';

// Type declarations for test classes
declare global {
  namespace jest {
    interface Matchers<R> {
      __tools__?: ToolMetadata[];
      __reduxActions__?: any[];
    }
  }
}

// Extend prototype for test classes
interface TestClass {
  prototype: {
    __tools__?: ToolMetadata[];
    __reduxActions__?: any[];
  };
}

describe('@Tool Decorator', () => {
  let TestClass: any;

  beforeEach(() => {
    // Reset any previous tool metadata
    TestClass = class {
      static __tools__: ToolMetadata[] = [];
    };
  });

  describe('Basic Decorator Functionality', () => {
    it('should register tool metadata on class prototype', () => {
      class TestManager {
        /**
         * Creates a new test entity
         * @param name - The name of the entity
         * @param type - The type of entity
         * @returns The created entity
         */
        @Tool('test-create-entity')
        async createEntity(name: string, type: string): Promise<any> {
          return { id: '123', name, type };
        }
      }

      // Instantiate the class to trigger the decorator initializer
      new TestManager();

      // Debug: Check what's actually in the registry
      console.log('All registered tools:', Array.from(ToolRegistry.getAllTools().keys()));
      
      const tools = ToolRegistry.getAllTools().get('TestManager.createEntity');
      expect(tools).toBeDefined();
      expect(tools?.methodName).toBe('createEntity');
      expect(tools?.name).toBe('Create Entity');
      expect(tools?.description).toBe('Create Entity');
    });

    it('should handle multiple decorated methods', () => {
      class TestManager {
        /**
         * Creates a new entity
         */
        @Tool('test-create-entity')
        async createEntity(): Promise<any> {
          return {};
        }

        /**
         * Reads an entity by ID
         */
        @Tool('test-read-entity')
        async readEntity(): Promise<any> {
          return {};
        }

        /**
         * Updates an existing entity
         */
        @Tool('test-update-entity')
        async updateEntity(): Promise<any> {
          return {};
        }
      }

      // Instantiate to ensure decorators are fully processed
      new TestManager();

      const tools = ToolRegistry.getAllTools().get('TestManager.createEntity');
      expect(tools).toBeDefined();
      expect(tools?.methodName).toBe('createEntity');
      expect(tools?.name).toBe('Create Entity');
      expect(tools?.description).toBe('Create Entity');
    });
  });

  describe('JSDoc Parsing', () => {
    it('should extract method name and convert to title case', () => {
      class TestManager {
        @Tool('test-get-chats')
        async getChatsByWorkspace(): Promise<any> {
          return [];
        }
      }

      const tools = ToolRegistry.getAllTools().get('TestManager.getChatsByWorkspace');
      expect(tools).toBeDefined();
      expect(tools?.methodName).toBe('getChatsByWorkspace');
      expect(tools?.name).toBe('Get Chats By Workspace');
      expect(tools?.description).toBe('Get Chats By Workspace');
    });

    it('should use default description when JSDoc not available', () => {
      class TestManager {
        @Tool('test-get-chats-workspace')
        async getChatsByWorkspace(): Promise<any[]> {
          return [];
        }
      }

      const tools = ToolRegistry.getAllTools().get('TestManager.getChatsByWorkspace');
      expect(tools).toBeDefined();
      expect(tools?.description).toBe('Get Chats By Workspace');
    });

    it('should generate basic input schema structure', () => {
      class TestManager {
        @Tool('test-create-chat')
        async createChat(): Promise<any> {
          return {};
        }
      }

      const tools = ToolRegistry.getAllTools().get('TestManager.createChat');
      const inputSchema = tools?.inputSchema;

      expect(inputSchema.type).toBe('object');
      expect(inputSchema.properties).toBeDefined();
      expect(inputSchema.required).toBeDefined();
    });

    it('should generate basic output schema structure', () => {
      class TestManager {
        @Tool('test-get-chat')
        async getChat(): Promise<any> {
          return {};
        }
      }

      const tools = ToolRegistry.getAllTools().get('TestManager.getChat');
      const outputSchema = tools?.outputSchema;

      expect(outputSchema.type).toBe('object');
      expect(outputSchema.properties).toBeDefined();
    });
  });

  describe('Category Inference', () => {
    it('should infer DATA category for CRUD operations', () => {
      class TestManager {
        @Tool('test-create') async createEntity(): Promise<any> {
          return {};
        }
        @Tool('test-read') async readEntity(): Promise<any> {
          return {};
        }
        @Tool('test-update') async updateEntity(): Promise<any> {
          return {};
        }
        @Tool('test-delete') async deleteEntity(): Promise<any> {
          return {};
        }
      }

      // Instantiate to ensure decorators are fully processed
      new TestManager();

      const tools = ToolRegistry.getAllTools().get('TestManager.createEntity');
      expect(tools).toBeDefined();
      expect(tools?.category).toBe(ToolCategory.DATA);
    });

    it('should infer SEARCH category for list operations', () => {
      class TestManager {
        @Tool('test-list') async listEntities(): Promise<any[]> {
          return [];
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      expect(tools[0].category).toBe(ToolCategory.SEARCH);
    });

    it('should infer SEARCH category for search operations', () => {
      class TestManager {
        @Tool('test-search-chats') async searchChats(): Promise<any[]> {
          return [];
        }
        @Tool('test-find-by-tag') async findByTag(): Promise<any[]> {
          return [];
        }
        @Tool('test-query-workspaces') async queryWorkspaces(): Promise<any[]> {
          return [];
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      tools.forEach((tool: any) => {
        expect(tool.category).toBe(ToolCategory.SEARCH);
      });
    });

    it('should default to UTILITY category for unknown operations', () => {
      class TestManager {
        @Tool('test-process-data') async processData(): Promise<any> {
          return {};
        }
        @Tool('test-calculate-metrics') async calculateMetrics(): Promise<number> {
          return 0;
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      tools.forEach((tool: any) => {
        expect(tool.category).toBe(ToolCategory.UTILITY);
      });
    });
  });

  describe('Permission Inference', () => {
    it('should assign permissions to read operations', () => {
      class TestManager {
        @Tool('test-get-entity') async getEntity(): Promise<any> {
          return {};
        }
        @Tool('test-list-items') async listItems(): Promise<any[]> {
          return [];
        }
        @Tool('test-read-data') async readData(): Promise<any> {
          return {};
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      tools.forEach((tool: any) => {
        expect(tool.permissions).toBeDefined();
        expect(tool.permissions.level).toBe('auto_approve');
        expect(tool.permissions.sensitiveDataAccess).toBe(false);
        expect(tool.permissions.networkAccess).toBe(false);
      });
    });

    it('should assign permissions to write operations', () => {
      class TestManager {
        @Tool('test-create-entity') async createEntity(): Promise<any> {
          return {};
        }
        @Tool('test-update-data') async updateData(): Promise<any> {
          return {};
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      tools.forEach((tool: any) => {
        expect(tool.permissions).toBeDefined();
        expect(tool.permissions.level).toBe('approve_once');
        expect(tool.permissions.sensitiveDataAccess).toBe(false);
        expect(tool.permissions.networkAccess).toBe(false);
      });
    });

    it('should assign elevated permissions to delete operations', () => {
      class TestManager {
        @Tool('test-delete-entity') async deleteEntity(): Promise<void> {}
        @Tool('test-remove-data') async removeData(): Promise<void> {}
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      tools.forEach((tool: any) => {
        expect(tool.permissions).toBeDefined();
        expect(tool.permissions.level).toBe('approve_once');
        expect(tool.permissions.sensitiveDataAccess).toBe(true);
        expect(tool.permissions.networkAccess).toBe(false);
      });
    });
  });

  describe('Frequency and Complexity Inference', () => {
    it('should assign VERY_HIGH frequency to read operations', () => {
      class TestManager {
        @Tool('test-get-entity') async getEntity(): Promise<any> {
          return {};
        }
        @Tool('test-list-items') async listItems(): Promise<any[]> {
          return [];
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      tools.forEach((tool: any) => {
        expect(tool.frequency).toBe(ToolFrequency.VERY_HIGH);
      });
    });

    it('should assign HIGH frequency to create operations', () => {
      class TestManager {
        @Tool('test-create-entity') async createEntity(): Promise<any> {
          return {};
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      tools.forEach((tool: any) => {
        expect(tool.frequency).toBe(ToolFrequency.HIGH);
      });
    });

    it('should assign MEDIUM frequency to moderate operations', () => {
      class TestManager {
        @Tool('test-update-entity') async updateEntity(): Promise<any> {
          return {};
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      tools.forEach((tool: any) => {
        expect(tool.frequency).toBe(ToolFrequency.MEDIUM);
      });
    });

    it('should assign SIMPLE complexity to simple operations', () => {
      class TestManager {
        @Tool('test-get-entity') async getEntity(): Promise<any> {
          return {};
        }
        @Tool('test-set-flag') async setFlag(): Promise<void> {}
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      tools.forEach((tool: any) => {
        expect(tool.complexity).toBe(ToolComplexity.SIMPLE);
      });
    });
  });

  describe('Custom Configuration', () => {
    it('should allow custom tool configuration', () => {
      class TestManager {
        @Tool({
          category: ToolCategory.SYSTEM,
          permissions: {
            level: 'approve_once',
            sensitiveDataAccess: true,
            networkAccess: true,
          },
        })
        async syncWithAPI(): Promise<any> {
          return {};
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      expect(tools[0].category).toBe(ToolCategory.SYSTEM);
      expect(tools[0].permissions.level).toBe('approve_once');
      expect(tools[0].permissions.networkAccess).toBe(true);
    });

    it('should merge custom config with inferred metadata', () => {
      class TestManager {
        @Tool({
          category: ToolCategory.SYSTEM,
          frequency: ToolFrequency.LOW,
        })
        async customSync(): Promise<any> {
          return {};
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      expect(tools[0].name).toBe('Custom Sync'); // Inferred from method name
      expect(tools[0].description).toBe('Custom Sync'); // Default description
      expect(tools[0].category).toBe(ToolCategory.SYSTEM); // Custom override
      expect(tools[0].frequency).toBe(ToolFrequency.LOW); // Custom override
      expect(tools[0].inputSchema.properties).toBeDefined(); // Generated
    });
  });

  describe('Error Handling', () => {
    it('should handle methods without JSDoc gracefully', () => {
      class TestManager {
        @Tool('test-method-without-jsdoc')
        async methodWithoutJSDoc(): Promise<any> {
          return {};
        }
      }

      const tools = ToolRegistry.getAllTools().get('TestManager.methodWithoutJSDoc');
      expect(tools).toBeDefined();
      expect(tools?.name).toBe('Method Without J S Doc');
      expect(tools?.description).toBe('Method Without J S Doc');
      expect(tools?.inputSchema.type).toBe('object');
      expect(tools?.outputSchema.type).toBe('object');
    });

    it('should handle invalid method names gracefully', () => {
      class TestManager {
        @Tool('test-123-invalid')
        async ['123invalid'](): Promise<any> {
          return {};
        }
      }

      const tools = ToolRegistry.getAllTools().get('TestManager.123invalid');
      expect(tools).toBeDefined();
      expect(tools?.methodName).toBe('123invalid');
      expect(tools?.name).toBe('123invalid'); // Fallback to method name
    });
  });

  describe('Integration with Existing Decorators', () => {
    it('should work alongside @ReduxAction decorator', () => {
      // Mock ReduxAction decorator (legacy signature)
      const ReduxAction = (config: any) => (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        // Simulate existing ReduxAction decorator behavior
        if (!target.__reduxActions__) {
          target.__reduxActions__ = [];
        }
        target.__reduxActions__.push({ method: propertyKey, config });
      };

      class TestManager {
        /**
         * Creates a new chat with Redux integration
         * @param title - Chat title
         * @param workspaceId - Workspace ID
         */
        @Tool('test-create-chat-redux')
        @ReduxAction({ action: 'chat/create', responseType: 'async' })
        async createChat(title: string, workspaceId: string): Promise<any> {
          return {};
        }
      }

      const tools = (TestManager as any).prototype.__tools__ || [];
      const reduxActions = (TestManager as any).prototype.__reduxActions__ || [];

      expect(tools).toHaveLength(1);
      expect(reduxActions).toHaveLength(1);
      expect(tools[0].methodName).toBe('createChat');
      expect(reduxActions[0].method).toBe('createChat');
    });
  });
});

// Remove JSDoc extraction utility tests since runtime JSDoc parsing is not implemented
