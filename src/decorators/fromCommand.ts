import { Tool, ToolConfig } from './Tool';

/**
 * Register a UniversalCommand as a @Tool in the ToolRegistry.
 *
 * The command's schema (name, description, keywords, inputSchema) is mapped to ToolConfig
 * automatically. The handler calls the command's execute() with interface: 'api', so it runs
 * the same validation path as toNextAPI() and toMCP().
 *
 * Works with any object that has a toTool() method — no hard dependency on @supernal/universal-command.
 *
 * @example
 *   import { fromCommand } from '@supernal/interface'
 *   import { counterCommand } from './commands/counter'
 *
 *   export const counterTool = fromCommand(counterCommand)
 *   // counterTool is now registered in ToolRegistry under key 'StandaloneFunctions.<name>'
 *   // where <name> is the command's schema.name with spaces replaced by underscores.
 *
 * @example with config overrides
 *   export const counterTool = fromCommand(counterCommand, { aiEnabled: false })
 */
// Always uses the full ToolConfig path inside Tool() — not the shorthand elementId path.
// normalizeShorthand is never called here, so elementId is not required.
export function fromCommand<TInput = any, TOutput = any>(
  command: {
    toTool(extra?: Record<string, unknown>): {
      config: Record<string, unknown>;
      handler: (args: TInput) => Promise<TOutput>;
    };
  },
  extraConfig?: Partial<ToolConfig>,
): (args: TInput) => Promise<TOutput> {
  const { config, handler } = command.toTool(extraConfig as Record<string, unknown>);
  if (!config.name || typeof config.name !== 'string') {
    throw new Error(
      `fromCommand: command.toTool() returned a config without a valid name field. ` +
      `Received: ${JSON.stringify(config.name)}`,
    );
  }
  return Tool(config as ToolConfig)(handler) as (args: TInput) => Promise<TOutput>;
}
