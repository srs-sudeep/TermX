import { customCommands } from '@/config/commands.config';
import type { Command } from '@/types';

export interface Registry {
  resolve: (name: string) => Command | undefined;

  all: () => Command[];

  byCategory: (cat: Command['category']) => Command[];

  complete: (partial: string) => string[];
}

export function buildRegistry(commands: Command[]): Registry {
  const byName = new Map<string, Command>();

  for (const cmd of commands) {
    const nameLower = cmd.name.toLowerCase();

    if (byName.has(nameLower)) {
      throw new Error(
        `Registry: duplicate command name "${cmd.name}". ` +
          'Each command name must be unique across all sources.',
      );
    }
    byName.set(nameLower, cmd);

    for (const alias of cmd.aliases ?? []) {
      const aliasLower = alias.toLowerCase();
      if (byName.has(aliasLower)) {
        throw new Error(
          `Registry: alias "${alias}" on command "${cmd.name}" conflicts with ` +
            `an existing name or alias. All names and aliases must be globally unique.`,
        );
      }
      byName.set(aliasLower, cmd);
    }
  }

  function uniqueCommands(): Command[] {
    return [...new Set(byName.values())];
  }

  return {
    resolve: (name) => byName.get(name.toLowerCase()),

    all: () => uniqueCommands(),

    byCategory: (cat) => uniqueCommands().filter((c) => c.category === cat),

    complete: (partial) => {
      const lower = partial.toLowerCase();
      const results: string[] = [];
      for (const key of byName.keys()) {
        if (key.startsWith(lower)) {
          results.push(key);
        }
      }
      return results.sort();
    },
  };
}

export function createRegistry(): Registry {
  const modules = import.meta.glob<{ default: Command }>('../commands/**/*.ts', { eager: true });

  const globCommands: Command[] = Object.values(modules)
    .map((mod) => mod.default)
    .filter(isCommand);

  const mergedMap = new Map<string, Command>(
    globCommands.map((cmd) => [cmd.name.toLowerCase(), cmd]),
  );

  for (const custom of customCommands) {
    mergedMap.set(custom.name.toLowerCase(), custom);
  }

  return buildRegistry([...mergedMap.values()]);
}

function isCommand(value: unknown): value is Command {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === 'object' &&
    typeof (value as Command).name === 'string' &&
    typeof (value as Command).execute === 'function'
  );
}
