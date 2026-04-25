import { useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import type { Registry } from '@/lib/commandRegistry';
import type { CommandContext } from '@/types';
import { useTerminalStore } from '@/store/terminalStore';
import { userConfig } from '@/config';

interface UseAutocompleteResult {
  /** KeyDown handler to attach to the terminal input. */
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Returns a minimal `CommandContext` for use in autocomplete functions.
 *
 * Autocomplete implementations only call `ctx.config`, so the other
 * context fields are safely stubbed out.
 */
function buildAutocompleteCtx(): CommandContext {
  return {
    args: [],
    flags: {},
    raw: '',
    config: userConfig,
    theme: { current: '', set: () => {} },
    history: { all: () => [], clear: () => {} },
    dispatch: () => {},
  };
}

/**
 * Provides Tab-key autocompletion for the terminal input.
 *
 * Logic:
 *  - If the user has typed a partial command name (no space yet):
 *      → call `registry.complete(partial)` against all registered names.
 *  - If the user has typed a command name + space + partial argument:
 *      → call the command's `autocomplete(partial, ctx)` function.
 *
 *  - Single match → complete in place (append a trailing space).
 *  - Multiple matches → append a list output to terminal history and keep input.
 *  - No matches → no-op.
 *
 * Tab's default browser behaviour (focus change) is always prevented.
 *
 * Store access happens inside the callback via `.getState()` so the hook
 * itself causes zero re-renders.
 */
export function useAutocomplete(
  registry: Registry | null,
  value: string,
  onChange: (v: string) => void,
): UseAutocompleteResult {
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Tab') return;
      e.preventDefault();

      if (!registry || !value.trim()) return;

      // Split on the first run of whitespace: `['theme', 'set', 'drac']`
      const tokens = value.trimStart().split(/\s+/);
      const cmdName = tokens[0].toLowerCase();

      // ── Complete command name ───────────────────────────────────────────
      if (tokens.length === 1) {
        const matches = registry.complete(cmdName);
        if (matches.length === 0) return;
        if (matches.length === 1) {
          onChange(matches[0] + ' ');
        } else {
          appendCompletions(matches);
        }
        return;
      }

      // ── Complete command argument ───────────────────────────────────────
      const cmd = registry.resolve(cmdName);
      if (!cmd?.autocomplete) return;

      // The partial is everything after the command name (preserving spaces).
      const partial = tokens.slice(1).join(' ');
      const ctx = buildAutocompleteCtx();
      const matches = cmd.autocomplete(partial, ctx);

      if (matches.length === 0) return;
      if (matches.length === 1) {
        onChange(`${cmdName} ${matches[0]}`);
      } else {
        appendCompletions(matches);
      }
    },
    [registry, value, onChange],
  );

  return { onKeyDown };
}

/** Append a list of completions to the terminal history as a muted list entry. */
function appendCompletions(matches: string[]): void {
  const { appendOutput } = useTerminalStore.getState();
  appendOutput({
    id: `autocomplete-${Date.now()}`,
    input: '',
    output: {
      type: 'list',
      items: matches.map((m) => ({ label: m, indent: 1 })),
    },
    timestamp: Date.now(),
  });
}
