import { userConfig } from '@/config';
import type { Registry } from '@/lib/commandRegistry';
import type { CommandContext } from '@/types';
import type { KeyboardEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseAutocompleteResult {
   
  ghostSuffix: string;
   
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
   
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

export function useAutocomplete(
  registry: Registry | null,
  value: string,
  onChange: (v: string) => void,
): UseAutocompleteResult {
  const [matches, setMatches] = useState<string[]>([]);
  const [cycleIdx, setCycleIdx] = useState(0);

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

  const ghostSuffix = useMemo(() => {
    if (matches.length === 0) return '';
    const suggestion = matches[cycleIdx];
    const trimmed = value.trimStart();
    const tokens = trimmed.split(/\s+/);

    if (tokens.length === 1) {
      
      return suggestion.startsWith(tokens[0]) ? suggestion.slice(tokens[0].length) : '';
    } else {
      
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
