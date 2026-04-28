import { useRef, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { useTerminalStore } from '@/store/terminalStore';

interface UseCommandHistoryResult {
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;

  resetCursor: () => void;
}

export function useCommandHistory(
  value: string,
  onChange: (v: string) => void,
): UseCommandHistoryResult {
  const cursorRef = useRef<number | null>(null);

  const draftRef = useRef('');

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const { commandHistory } = useTerminalStore.getState();
        if (commandHistory.length === 0) return;

        if (cursorRef.current === null) {
          draftRef.current = value;
          cursorRef.current = commandHistory.length - 1;
        } else if (cursorRef.current > 0) {
          cursorRef.current--;
        }
        onChange(commandHistory[cursorRef.current] ?? '');
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (cursorRef.current === null) return;

        const { commandHistory } = useTerminalStore.getState();
        if (cursorRef.current < commandHistory.length - 1) {
          cursorRef.current++;
          onChange(commandHistory[cursorRef.current]);
        } else {
          cursorRef.current = null;
          onChange(draftRef.current);
        }
      }
    },
    [value, onChange],
  );

  const resetCursor = useCallback(() => {
    cursorRef.current = null;
    draftRef.current = '';
  }, []);

  return { onKeyDown, resetCursor };
}
