import { spawn } from 'node:child_process';
import { ToolRegistry } from '../background/registry/ToolRegistry';
import { GherkinStep } from './GherkinParser';
import {
  CliCommandResolution,
  CliStepMapper,
  CliStepMapping,
  TerminalMode,
} from './CliStepMapper';

export type StepExecutionKind = 'tool' | 'cli' | 'http';

export interface StepExecutionResult {
  success: boolean;
  kind: StepExecutionKind;
  step: string;
  command?: string;
  output?: unknown;
  stdout?: string;
  stderr?: string;
  error?: string;
  durationMs: number;
}

export interface StepExecutionContext {
  variables?: Record<string, string>;
}

export interface StepExecutorOptions {
  enabledExecutors?: StepExecutionKind[];
  cli?: {
    enabled?: boolean;
    timeoutMs?: number;
    allowlist?: string[];
    terminalMode?: TerminalMode;
    mappings?: CliStepMapping[];
    cwd?: string;
    env?: Record<string, string>;
  };
}

interface NormalizedStepExecutorOptions {
  enabledExecutors: StepExecutionKind[];
  cli: {
    enabled: boolean;
    timeoutMs: number;
    allowlist: string[];
    terminalMode: TerminalMode;
    mappings: CliStepMapping[];
    cwd: string;
    env: Record<string, string>;
  };
}

function toAllowlistToken(command: string): string {
  return command.trim().split(/\s+/)[0] || '';
}

export class StepExecutor {
  private readonly options: NormalizedStepExecutorOptions;

  constructor(options: StepExecutorOptions = {}) {
    this.options = {
      enabledExecutors: options.enabledExecutors ?? ['tool'],
      cli: {
        enabled: options.cli?.enabled ?? false,
        timeoutMs: options.cli?.timeoutMs ?? 15_000,
        allowlist: options.cli?.allowlist ?? [],
        terminalMode: options.cli?.terminalMode ?? 'stdio',
        mappings: options.cli?.mappings ?? [],
        cwd: options.cli?.cwd ?? process.cwd(),
        env: options.cli?.env ?? {},
      },
    };
  }

  async execute(
    step: GherkinStep,
    context: StepExecutionContext = {},
  ): Promise<StepExecutionResult> {
    const started = Date.now();
    const variables = context.variables ?? {};

    const cliResolution = CliStepMapper.resolve(step.text, this.options.cli.mappings, variables);
    if (cliResolution && this.options.enabledExecutors.includes('cli')) {
      return this.executeCLI(step, cliResolution, started);
    }

    if (this.options.enabledExecutors.includes('tool')) {
      const toolResult = await this.executeTool(step, started);
      if (toolResult.success || step.toolId) {
        return toolResult;
      }
    }

    return {
      success: false,
      kind: cliResolution ? 'cli' : 'tool',
      step: `${step.keyword} ${step.text}`,
      error:
        'No executable handler found for step. Configure CLI mappings or resolve step to a registered tool.',
      durationMs: Date.now() - started,
    };
  }

  private async executeTool(step: GherkinStep, started: number): Promise<StepExecutionResult> {
    const tool =
      step.toolId
      || ToolRegistry.searchTools(step.text)[0]?.toolId
      || null;

    if (!tool) {
      return {
        success: false,
        kind: 'tool',
        step: `${step.keyword} ${step.text}`,
        error: 'No matching tool found for step text.',
        durationMs: Date.now() - started,
      };
    }

    const result = await ToolRegistry.executeForAI(tool, step.params ?? {});
    return {
      success: result.success,
      kind: 'tool',
      step: `${step.keyword} ${step.text}`,
      output: result.data,
      error: result.error,
      durationMs: Date.now() - started,
    };
  }

  private async executeCLI(
    step: GherkinStep,
    resolution: CliCommandResolution,
    started: number,
  ): Promise<StepExecutionResult> {
    if (!this.options.cli.enabled) {
      return {
        success: false,
        kind: 'cli',
        step: `${step.keyword} ${step.text}`,
        command: resolution.command,
        error: 'CLI executor is disabled. Enable options.cli.enabled to run CLI-backed steps.',
        durationMs: Date.now() - started,
      };
    }

    const selectedMode = resolution.terminalMode ?? this.options.cli.terminalMode;
    if (selectedMode === 'tui') {
      return {
        success: false,
        kind: 'cli',
        step: `${step.keyword} ${step.text}`,
        command: resolution.command,
        error:
          'TUI terminal mode is planned but not implemented in OSS yet. Use terminalMode="stdio" or wire a PTY adapter.',
        durationMs: Date.now() - started,
      };
    }

    if (!this.isAllowed(resolution.command)) {
      return {
        success: false,
        kind: 'cli',
        step: `${step.keyword} ${step.text}`,
        command: resolution.command,
        error: `Command is not allowlisted: ${toAllowlistToken(resolution.command)}`,
        durationMs: Date.now() - started,
      };
    }

    const runResult = await this.runCommand(resolution.command);
    return {
      success: runResult.exitCode === 0,
      kind: 'cli',
      step: `${step.keyword} ${step.text}`,
      command: resolution.command,
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      error: runResult.exitCode === 0 ? undefined : `Command exited with code ${runResult.exitCode}`,
      durationMs: Date.now() - started,
    };
  }

  private isAllowed(command: string): boolean {
    if (this.options.cli.allowlist.length === 0) {
      return false;
    }
    const token = toAllowlistToken(command);
    return this.options.cli.allowlist.includes(token);
  }

  private async runCommand(command: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    return new Promise((resolve) => {
      const child = spawn(command, {
        shell: true,
        cwd: this.options.cli.cwd,
        env: {
          ...process.env,
          ...this.options.cli.env,
        },
      });

      let stdout = '';
      let stderr = '';
      let timeoutTriggered = false;

      const timer = setTimeout(() => {
        timeoutTriggered = true;
        child.kill('SIGTERM');
      }, this.options.cli.timeoutMs);

      child.stdout.on('data', (chunk) => {
        stdout += String(chunk);
      });

      child.stderr.on('data', (chunk) => {
        stderr += String(chunk);
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        if (timeoutTriggered) {
          resolve({
            exitCode: 124,
            stdout,
            stderr: `${stderr}\nCommand timed out after ${this.options.cli.timeoutMs}ms`,
          });
          return;
        }
        resolve({
          exitCode: code ?? 1,
          stdout,
          stderr,
        });
      });
    });
  }
}
