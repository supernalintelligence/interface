/**
 * Modal Agent Tools - Supernal Interface Integration
 * 
 * Provides Modal agent operations for the Supernal Interface system.
 * Enables AI agents to spawn, provision, and manage Modal agents through a unified interface.
 * 
 * @example
 * ```typescript
 * // Spawn a Modal agent
 * const result = await ModalAgentTools.spawnAgent('Analyze this codebase');
 * 
 * // Provision a new user workspace
 * const provision = await ModalAgentTools.provisionWorkspace('user123', 'user@example.com');
 * 
 * // Check Modal status
 * const status = await ModalAgentTools.getStatus();
 * ```
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { ToolProvider } from '../decorators/ToolProvider';
import { Tool } from '../decorators/Tool';
import { ToolCategory } from '../types/Tool';

const execAsync = promisify(exec);

/**
 * Result interface for Modal operations
 */
export interface ModalResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  output?: string;
}

/**
 * Modal spawn agent options
 */
export interface SpawnAgentOptions {
  agentId?: string;
  repo?: string;
}

/**
 * Modal Agent Tools Provider
 * 
 * Provides unified access to Modal agent operations through the Supernal Interface.
 */
@ToolProvider({
  name: 'Modal Agent Tools',
  description: 'Manage and spawn Modal agents for distributed task execution',
  category: 'modal',
  aiEnabled: true,
  dangerLevel: 'moderate',
  permissions: {
    level: 'development',
    networkAccess: true,
    requiredScopes: ['modal:spawn', 'modal:provision', 'modal:status']
  }
})
export class ModalAgentTools {
  
  /**
   * Spawn a Modal agent with a specific task
   * 
   * @param task Task description for the Modal agent
   * @param options Optional spawn configuration
   */
  @Tool({
    name: 'spawn_agent',
    description: 'Spawn a Modal agent to execute a specific task in a distributed environment',
    category: ToolCategory.EXTERNAL_SERVICE,
    keywords: ['modal', 'spawn', 'agent', 'task', 'distributed'],
    examples: [
      'spawn_agent("Analyze the codebase for security vulnerabilities")',
      'spawn_agent("Generate documentation for the API", { agentId: "researcher" })',
      'spawn_agent("Run tests and report results", { repo: "https://github.com/user/repo" })'
    ],
    useCases: [
      'Execute long-running computational tasks',
      'Parallelize work across multiple agents',
      'Isolate potentially unsafe code execution',
      'Scale processing beyond local resources'
    ],
    inputSchema: {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'Task description for the Modal agent to execute'
        },
        options: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'Agent ID to use (default: worker)'
            },
            repo: {
              type: 'string',
              description: 'Git workspace repository URL'
            }
          }
        }
      },
      required: ['task']
    },
    outputSchema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            agentId: { type: 'string' },
            task: { type: 'string' },
            repo: { type: 'string' }
          }
        },
        output: { type: 'string' }
      }
    },
    dangerLevel: 'moderate',
    requiresApproval: false
  })
  async spawnAgent(task: string, options?: SpawnAgentOptions): Promise<ModalResult> {
    try {
      const { agentId = 'worker', repo } = options || {};
      
      // Build command
      let command = `modal-spawn`;
      if (agentId !== 'worker') {
        command += ` --agent "${agentId}"`;
      }
      if (repo) {
        command += ` --repo "${repo}"`;
      }
      command += ` "${task}"`;

      // Execute command with timeout
      const { stdout, stderr } = await execAsync(command, {
        timeout: 300000, // 5 minutes
      });

      const output = stdout + (stderr ? '\n' + stderr : '');
      
      return {
        success: true,
        message: `Successfully spawned Modal agent '${agentId}' with task: ${task}`,
        data: {
          agentId,
          task,
          repo,
        },
        output,
      };
    } catch (error: any) {
      const errorMessage = error.stderr || error.message || 'Modal agent spawn failed';
      
      return {
        success: false,
        message: `Failed to spawn Modal agent: ${errorMessage}`,
        output: errorMessage,
      };
    }
  }

  /**
   * Provision a Modal workspace for a new user
   * 
   * @param userId User identifier
   * @param email User email address
   * @param org Organization name (optional)
   */
  @Tool({
    name: 'provision_workspace',
    description: 'Provision a Modal agent workspace for a new user with personalized setup',
    category: ToolCategory.EXTERNAL_SERVICE,
    keywords: ['modal', 'provision', 'onboard', 'user', 'workspace'],
    examples: [
      'provision_workspace("user123", "user@example.com")',
      'provision_workspace("alice", "alice@company.com", "acme-corp")'
    ],
    useCases: [
      'Onboard new users to Modal agent system',
      'Create personalized agent workspaces',
      'Set up user-specific configurations',
      'Initialize workspace templates'
    ],
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'Unique user identifier for the workspace'
        },
        email: {
          type: 'string',
          description: 'User email address for notifications and identification'
        },
        org: {
          type: 'string',
          description: 'Organization name (defaults to "default")'
        }
      },
      required: ['userId', 'email']
    },
    outputSchema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            email: { type: 'string' },
            org: { type: 'string' },
            workspacePath: { type: 'string' }
          }
        },
        output: { type: 'string' }
      }
    },
    dangerLevel: 'moderate',
    requiresApproval: true
  })
  async provisionWorkspace(userId: string, email: string, org: string = 'default'): Promise<ModalResult> {
    try {
      // Build command
      let command = `modal-onboard "${userId}" "${email}"`;
      if (org !== 'default') {
        command += ` --org "${org}"`;
      }

      // Execute command with timeout
      const { stdout, stderr } = await execAsync(command, {
        timeout: 300000, // 5 minutes
      });

      const output = stdout + (stderr ? '\n' + stderr : '');
      
      // Extract workspace path from output
      const workspaceMatch = output.match(/Workspace location: (.+)/);
      const workspacePath = workspaceMatch ? workspaceMatch[1] : undefined;
      
      return {
        success: true,
        message: `Successfully provisioned Modal workspace for ${userId} (${email})`,
        data: {
          userId,
          email,
          org,
          workspacePath,
        },
        output,
      };
    } catch (error: any) {
      const errorMessage = error.stderr || error.message || 'Modal workspace provisioning failed';
      
      return {
        success: false,
        message: `Failed to provision Modal workspace: ${errorMessage}`,
        output: errorMessage,
      };
    }
  }

  /**
   * Get Modal deployment and agent status
   * 
   * @param user Optional specific user to check status for
   */
  @Tool({
    name: 'get_status',
    description: 'Get Modal deployment status, secrets, and agent information',
    category: ToolCategory.EXTERNAL_SERVICE,
    keywords: ['modal', 'status', 'deployment', 'health', 'check'],
    examples: [
      'get_status()',
      'get_status("user123")'
    ],
    useCases: [
      'Check Modal deployment health',
      'Verify secrets are configured',
      'Monitor agent status',
      'Troubleshoot Modal issues'
    ],
    inputSchema: {
      type: 'object',
      properties: {
        user: {
          type: 'string',
          description: 'Optional specific user to check status for'
        }
      }
    },
    outputSchema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            profile: { type: 'string' },
            deployments: { 
              type: 'array',
              items: { type: 'string' }
            },
            secrets: {
              type: 'array',
              items: { type: 'string' }
            },
            user: { type: 'string' }
          }
        },
        output: { type: 'string' }
      }
    },
    dangerLevel: 'safe',
    requiresApproval: false
  })
  async getStatus(user?: string): Promise<ModalResult> {
    try {
      // Execute modal-manage status
      const { stdout, stderr } = await execAsync('modal-manage status', {
        timeout: 60000, // 1 minute
      });

      const output = stdout + (stderr ? '\n' + stderr : '');
      
      // Parse output to extract structured data
      let profile = '';
      let deployments: string[] = [];
      let secrets: string[] = [];
      
      const lines = output.split('\n');
      let section = '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        if (trimmed.startsWith('Profile:')) {
          section = 'profile';
        } else if (trimmed.startsWith('Deployments:')) {
          section = 'deployments';
        } else if (trimmed.startsWith('Secrets:')) {
          section = 'secrets';
        } else if (section === 'profile' && trimmed.includes('@')) {
          profile = trimmed;
        } else if (section === 'deployments' && !trimmed.startsWith('No deployments')) {
          if (!trimmed.includes('NAME') && trimmed.length > 0) {
            deployments.push(trimmed);
          }
        } else if (section === 'secrets' && trimmed.length > 0) {
          if (!trimmed.includes('NAME') && trimmed.length > 0) {
            secrets.push(trimmed);
          }
        }
      }
      
      return {
        success: true,
        message: `Modal status retrieved successfully${user ? ` for user: ${user}` : ''}`,
        data: {
          profile,
          deployments,
          secrets,
          user,
        },
        output,
      };
    } catch (error: any) {
      const errorMessage = error.stderr || error.message || 'Modal status check failed';
      
      return {
        success: false,
        message: `Failed to get Modal status: ${errorMessage}`,
        output: errorMessage,
      };
    }
  }
}