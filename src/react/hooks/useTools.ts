/**
 * useTools — React hook for decorator-free AI tool registration
 *
 * Registers component action handlers with ToolRegistry on mount and
 * cleans up on unmount. SSR-safe (guards via useEffect). Designed for
 * Next.js / SWC environments where TypeScript decorators are unavailable.
 *
 * @example
 * ```tsx
 * function InboxToolbar({ onRefresh, onAutoPrioritize }) {
 *   useTools([
 *     {
 *       name: 'inbox.refresh',
 *       description: 'Refresh the inbox to fetch latest items',
 *       handler: onRefresh,
 *     },
 *     {
 *       name: 'inbox.autoPrioritize',
 *       description: 'Auto-prioritize inbox items by due date and status',
 *       handler: onAutoPrioritize,
 *     },
 *   ]);
 *   // ...
 * }
 * ```
 */

import { useEffect, useRef } from 'react';
import { ToolRegistry } from '../../background/registry/ToolRegistry';

/**
 * JSON Schema shape for a single parameter.
 */
export interface ToolParameterSchema {
  type: string;
  description?: string;
  required?: boolean;
}

/**
 * Definition for a single AI-callable tool provided by a component.
 */
export interface ToolDefinition {
  /** Unique tool name. Dot-notation is recommended (e.g. "inbox.refresh"). */
  name: string;
  /** Human-readable description shown to the AI. */
  description: string;
  /** The function to invoke when the AI calls this tool. */
  handler: (...args: any[]) => any;
  /** Optional JSON Schema for parameters. */
  schema?: {
    parameters?: Record<string, ToolParameterSchema>;
  };
  /**
   * When true the tool stays registered (no-op calls will be ignored at
   * runtime) but is hidden from AI tool lists. Useful for temporarily
   * disabling a tool without triggering a full unmount/remount cycle.
   */
  disabled?: boolean;
}

/**
 * Register an array of tools with the ToolRegistry for the lifetime of the
 * calling component. Tools are registered on mount and unregistered on
 * unmount. If the `tools` array identity changes between renders the hook
 * re-registers with the latest definitions.
 *
 * SSR-safe: all registry calls happen inside `useEffect` so they never run
 * during server-side rendering.
 */
export function useTools(tools: ToolDefinition[]): void {
  // Keep a stable ref to the latest tools array so the cleanup closure can
  // access the up-to-date names without stale captures.
  const toolsRef = useRef<ToolDefinition[]>(tools);
  toolsRef.current = tools;

  useEffect(() => {
    // Guard: never execute during SSR (useEffect is client-only, but belt-and-
    // suspenders in case of unusual SSR setups).
    if (typeof window === 'undefined') return;

    const registeredIds: string[] = [];

    for (const tool of tools) {
      if (tool.disabled) continue;

      // Derive a stable providerName + methodName from the dot-notation name.
      // e.g.  "inbox.refresh"      → provider="inbox"  method="refresh"
      //        "refresh"           → provider="hook"    method="refresh"
      //        "inbox.sub.refresh" → provider="inbox"   method="sub.refresh"
      const dotIndex = tool.name.indexOf('.');
      const providerName =
        dotIndex !== -1 ? tool.name.slice(0, dotIndex) : 'hook';
      const methodName =
        dotIndex !== -1 ? tool.name.slice(dotIndex + 1) : tool.name;

      // Build a ToolMetadata-compatible object. We use sensible defaults for
      // fields that don't apply to functional tools and expose the handler via
      // the `method` field that ToolRegistry already supports for runtime
      // execution.
      const metadata = {
        // Required structural fields
        methodName,
        name: tool.name,
        description: tool.description,
        category: 'user_interaction' as const,
        inputSchema: tool.schema?.parameters ?? {},
        outputSchema: {},
        returnType: 'json' as const,
        supportsStreaming: false,
        tags: [],
        keywords: [],
        useCases: [],
        permissions: {},
        frequency: 'medium' as const,
        complexity: 'simple' as const,

        // Identifiers
        toolId: tool.name,

        // Provider / standalone info
        providerName,
        isStandalone: false,

        // AI surface
        examples: [],
        aiDescription: tool.description,
        executionContext: 'ui' as const,

        // AI control settings — hooks are AI-safe by design
        toolType: 'ai-safe' as const,
        aiEnabled: true,
        requiresApproval: false,
        dangerLevel: 'safe' as const,

        // Testing integration
        generateSimulation: false,
        generateStories: false,

        // Runtime execution — this is the key field that lets AI execute the tool
        method: tool.handler,
        instance: null,
      };

      ToolRegistry.registerTool(providerName, methodName, metadata as any);
      registeredIds.push(tool.name);
    }

    // Cleanup: unregister all tools we registered when the component unmounts
    // or when the tools array changes identity.
    return () => {
      for (const id of registeredIds) {
        ToolRegistry.unregisterTool(id);
      }
    };
    // Re-register whenever the tools array reference changes (e.g. handler
    // closures update). Consumers should memoize the array with useMemo or
    // useCallback to avoid unnecessary churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tools]);
}
