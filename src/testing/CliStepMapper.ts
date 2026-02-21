export type TerminalMode = 'stdio' | 'tui';

export interface CliStepMapping {
  pattern: RegExp | string;
  commandTemplate: string;
  terminalMode?: TerminalMode;
}

export interface CliCommandResolution {
  command: string;
  terminalMode: TerminalMode;
}

function normalizeQuotedValues(stepText: string): string[] {
  const matches = stepText.match(/"([^"]+)"/g) || [];
  return matches.map((entry) => entry.replace(/^"/, '').replace(/"$/, ''));
}

function interpolateTemplate(
  template: string,
  variables: Record<string, string>,
  quotedValues: string[],
): string {
  let value = template;

  value = value.replace(/\{q(\d+)\}/g, (_full, indexRaw) => {
    const index = Number(indexRaw) - 1;
    return quotedValues[index] ?? '';
  });

  value = value.replace(/\{([a-zA-Z0-9_-]+)\}/g, (full, key) => {
    if (key.startsWith('q')) {
      return full;
    }
    return variables[key] ?? '';
  });

  return value.trim();
}

function matchesPattern(stepText: string, pattern: RegExp | string): boolean {
  if (typeof pattern === 'string') {
    return stepText.toLowerCase().includes(pattern.toLowerCase());
  }
  return pattern.test(stepText);
}

export class CliStepMapper {
  static resolve(
    stepText: string,
    mappings: CliStepMapping[],
    variables: Record<string, string> = {},
  ): CliCommandResolution | null {
    const inlineCommand = stepText.match(/\brun\s+cli\s+"([^"]+)"/i)?.[1]
      || stepText.match(/^cli:\s*(.+)$/i)?.[1];

    if (inlineCommand) {
      return {
        command: interpolateTemplate(inlineCommand, variables, normalizeQuotedValues(stepText)),
        terminalMode: 'stdio',
      };
    }

    for (const mapping of mappings) {
      if (!matchesPattern(stepText, mapping.pattern)) {
        continue;
      }
      return {
        command: interpolateTemplate(
          mapping.commandTemplate,
          variables,
          normalizeQuotedValues(stepText),
        ),
        terminalMode: mapping.terminalMode ?? 'stdio',
      };
    }

    return null;
  }
}
