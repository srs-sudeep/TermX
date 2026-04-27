import { userConfig } from '@/config';
import type { Registry } from '@/lib/commandRegistry';
import type { CommandContext } from '@/types';
import type { KeyboardEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseAutocompleteResult {
  /** The suffix to render as ghost text after the current input value. */
  ghostSuffix: string;
  /** KeyDown handler to attach to the terminal input. */
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  /** Call when the input is accepted/cleared so ghost state resets. */
  reset: () => void;
}

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
 * Ghost-text Tab-cycle autocomplete.
 *
 * - First Tab: compute matches. Single match → complete immediately.
 *   Multiple matches → show first as inline gray ghost text.
 * - Subsequent Tabs: cycle through matches, updating the ghost suffix.
 * - Right arrow at end-of-input (handled in TerminalInput) → accept ghost.
 * - Any value change from outside resets the cycle.
 */
export function useAutocomplete(
  registry: Registry | null,
  value: string,
  onChange: (v: string) => void,
): UseAutocompleteResult {
  const [matches, setMatches] = useState<string[]>([]);
  const [cycleIdx, setCycleIdx] = useState(0);

  // Reset cycle whenever the user types (value changes from outside).
  const prevValueRef = useRef(value);
  useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      setMatches([]);
      setCycleIdx(0);
    }
  }, [value]);

  const reset = useCallback(() => {
    setMatches([]);
    setCycleIdx(0);
  }, []);

  /** The suffix to append visually after the typed text. */
  const ghostSuffix = useMemo(() => {
    if (matches.length === 0) return '';
    const suggestion = matches[cycleIdx];
    const trimmed = value.trimStart();
    const tokens = trimmed.split(/\s+/);

    if (tokens.length === 1) {
      // Command completion: "co" + "ffee"
      return suggestion.startsWith(tokens[0]) ? suggestion.slice(tokens[0].length) : '';
    } else {
      // Argument completion: "theme se" → ghost is "t" (rest of "set")
      const partial = tokens.slice(1).join(' ');
      return suggestion.startsWith(partial) ? suggestion.slice(partial.length) : suggestion;
    }
  }, [matches, cycleIdx, value]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      if (!registry || !value.trim()) return;

      const trimmed = value.trimStart();
      const tokens = trimmed.split(/\s+/);
      const cmdName = tokens[0].toLowerCase();

      if (tokens.length === 1) {
        // ── Command name completion ───────────────────────────────────────
        if (matches.length === 0) {
          const newMatches = registry.complete(cmdName);
          if (newMatches.length === 0) return;
          if (newMatches.length === 1) {
            onChange(newMatches[0] + ' ');
            return;
          }
          setMatches(newMatches);
          setCycleIdx(0);
        } else {
          setCycleIdx((i) => (i + 1) % matches.length);
        }
      } else {
        // ── Argument completion ───────────────────────────────────────────
        const cmd = registry.resolve(cmdName);
        if (!cmd?.autocomplete) return;
        const partial = tokens.slice(1).join(' ');
        const ctx = buildAutocompleteCtx();

        if (matches.length === 0) {
          const newMatches = cmd.autocomplete(partial, ctx);
          if (newMatches.length === 0) return;
          if (newMatches.length === 1) {
            onChange(`${cmdName} ${newMatches[0]}`);
            return;
          }
          setMatches(newMatches);
          setCycleIdx(0);
        } else {
          setCycleIdx((i) => (i + 1) % matches.length);
        }
      }
    },
    [registry, value, onChange, matches],
  );

  return { ghostSuffix, onKeyDown, reset };
}
