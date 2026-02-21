import { StepExecutor } from '../StepExecutor';
import { GherkinStep } from '../GherkinParser';
import { TestRunner } from '../TestRunner';

describe('StepExecutor', () => {
  const commandTemplate = `${process.execPath} -e "process.stdout.write('ok')"`;

  it('executes allowlisted CLI step via mapping', async () => {
    const step: GherkinStep = {
      keyword: 'When',
      text: 'I run SA smoke check',
    };

    const executor = new StepExecutor({
      enabledExecutors: ['cli'],
      cli: {
        enabled: true,
        allowlist: [process.execPath],
        mappings: [
          {
            pattern: /sa smoke check/i,
            commandTemplate,
          },
        ],
      },
    });

    const result = await executor.execute(step);
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('ok');
  });

  it('blocks non-allowlisted CLI commands', async () => {
    const step: GherkinStep = {
      keyword: 'When',
      text: 'I run blocked command',
    };

    const executor = new StepExecutor({
      enabledExecutors: ['cli'],
      cli: {
        enabled: true,
        allowlist: ['npm'],
        mappings: [
          {
            pattern: /blocked command/i,
            commandTemplate,
          },
        ],
      },
    });

    const result = await executor.execute(step);
    expect(result.success).toBe(false);
    expect(result.error).toContain('allowlisted');
  });

  it('fails fast with planning hint in tui mode', async () => {
    const step: GherkinStep = {
      keyword: 'When',
      text: 'I run in terminal ui',
    };

    const executor = new StepExecutor({
      enabledExecutors: ['cli'],
      cli: {
        enabled: true,
        allowlist: [process.execPath],
        mappings: [
          {
            pattern: /terminal ui/i,
            commandTemplate,
            terminalMode: 'tui',
          },
        ],
      },
    });

    const result = await executor.execute(step);
    expect(result.success).toBe(false);
    expect(result.error).toContain('TUI terminal mode is planned');
  });
});

describe('TestRunner CLI feature execution', () => {
  it('runs feature content with CLI step execution', async () => {
    const feature = `
Feature: CLI step execution
  Scenario: Execute command in stdio mode
    When I run SA smoke check
`;

    const result = await TestRunner.runFeatureContent(feature, {
      stepExecutors: ['cli'],
      cliAllowlist: [process.execPath],
      cliStepMappings: [
        {
          pattern: /sa smoke check/i,
          commandTemplate: `${process.execPath} -e "process.stdout.write('runner-ok')"`,
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.scenarios).toHaveLength(1);
    expect(result.scenarios[0].steps[0].stdout).toContain('runner-ok');
  });
});
