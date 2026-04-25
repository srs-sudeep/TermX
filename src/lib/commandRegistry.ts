/**
 * commandRegistry.ts
 * Builds and queries the command registry.
 *
 * Two entry points:
 *
 *  buildRegistry(commands)  — pure function, takes an array of Command objects.
 *                             Used directly in tests (no Vite globals needed).
 *
 *  createRegistry()         — production entry point. Eagerly loads every .ts
 *                             file under src/commands/ via import.meta.glob,
 *                             merges customCommands from commands.config.ts,
 *                             and calls buildRegistry().
 *
 * Collision rules (enforced by buildRegistry):
 *  - Two commands with the same name → throws.
 *  - A command's alias that matches any registered name/alias → throws.
 *  These are always developer errors (bad config), not user errors.
 *
 * No React imports — this module must stay framework-agnostic.
 */

import type { Command } from '@/types';
import { customCommands } from '@/config/commands.config';

// ── Public interface ───────────────────────────────────────────────────────

/** The API surface returned by both buildRegistry and createRegistry. */
export interface Registry {
  /**
   * Look up a command by its primary name or any of its aliases.
   * The lookup is case-insensitive.
   *
   * @returns The matching Command, or `undefined` if not found.
   */
  resolve: (name: string) => Command | undefined;

  /**
   * All registered commands, deduplicated (each command appears once regardless
   * of how many aliases it has).
   */
  all: () => Command[];

  /**
   * Commands belonging to a specific category, deduplicated.
   *
   * @param cat - One of the category literals from the Command interface.
   */
  byCategory: (cat: Command['category']) => Command[];

  /**
   * Returns all command names and aliases that begin with `partial`.
   * Includes hidden commands — filtering for display is the caller's concern.
   * Results are sorted alphabetically for stable, predictable ordering.
   *
   * @param partial - The prefix to match against (e.g. `'pro'` → `['projects']`).
   * @returns Sorted array of matching keys (names + aliases).
   *
   * @example
   * complete('cl') // → ['clear', 'cls']
   * complete('')   // → [/* all registered names and aliases *\/]
   */
  complete: (partial: string) => string[];
}

// ── buildRegistry ──────────────────────────────────────────────────────────

/**
 * Constructs a Registry from an explicit array of Command objects.
 * This is the pure, side-effect-free core — no Vite transforms, no imports.
 *
 * @param commands - Array of commands to register. Must already be deduplicated
 *                   by name (createRegistry handles the merging step before
 *                   calling this function).
 *
 * @throws {Error} On duplicate command name or alias collision.
 *
 * @example
 * // In tests:
 * const reg = buildRegistry([myCommand, anotherCommand]);
 * expect(reg.resolve('my-cmd')).toBeDefined();
 */
export function buildRegistry(commands: Command[]): Registry {
  // Central lookup table: lowercase name/alias → Command.
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

  /**
   * Returns the deduplicated set of Command objects registered so far.
   * Using a Set on the Map's values deduplicates by object reference:
   * a command with two aliases appears only once.
   */
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

// ── createRegistry ─────────────────────────────────────────────────────────

/**
 * Creates the production registry.
 *
 * Steps:
 *  1. Eagerly load all `.ts` files under `src/commands/` via Vite's
 *     `import.meta.glob`. Each file must have a default export of type Command.
 *     Files that don't match (no default export, wrong shape) are silently
 *     skipped — this avoids a crash if a non-command file accidentally matches.
 *
 *  2. Build an initial name→command map from the glob results.
 *
 *  3. Merge `customCommands` from `commands.config.ts`. A custom command with
 *     the same name as a built-in replaces it; new names are added to the pool.
 *     This merge happens BEFORE buildRegistry so that buildRegistry only sees
 *     the final, deduplicated list (no collision between custom override and
 *     the built-in it replaces).
 *
 *  4. Pass the merged list to buildRegistry for index construction.
 *
 * Call once at application startup (from useTerminal in Phase 8).
 * The result is stable — no re-evaluation after initial creation.
 */
export function createRegistry(): Registry {
  // import.meta.glob is a Vite compile-time macro.
  // With { eager: true } it loads all matching modules synchronously.
  // Returns {} when no matching files exist (safe for Phase 4 — no commands yet).
  const modules = import.meta.glob<{ default: Command }>(
    '/src/commands/**/*.ts',
    { eager: true },
  );

  // Extract and validate default exports.
  // Commands that don't have a string `name` property are silently dropped.
  const globCommands: Command[] = Object.values(modules)
    .map((mod) => mod.default)
    .filter(isCommand);

  // Base map: built-in commands keyed by lowercase name.
  const mergedMap = new Map<string, Command>(
    globCommands.map((cmd) => [cmd.name.toLowerCase(), cmd]),
  );

  // Apply custom commands on top. A custom command with the same name as a
  // built-in silently replaces it (this is intentional — it's the override
  // mechanism documented in commands.config.ts).
  for (const custom of customCommands) {
    mergedMap.set(custom.name.toLowerCase(), custom);
  }

  return buildRegistry([...mergedMap.values()]);
}

// ── Type guard ─────────────────────────────────────────────────────────────

/**
 * Narrows an unknown module default export to `Command`.
 * Checks for the minimum required fields — `name` (string) and `execute` (function).
 */
function isCommand(value: unknown): value is Command {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === 'object' &&
    typeof (value as Command).name === 'string' &&
    typeof (value as Command).execute === 'function'
  );
}
