import { useRef, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { useTerminalStore } from '@/store/terminalStore';

interface UseCommandHistoryResult {
  /** KeyDown handler to attach to the terminal input. */
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Reset the history cursor. Call this when the user submits a command
   * so that the next ArrowUp press starts from the newest entry again.
   */
  resetCursor: () => void;
}

/**
 * Provides ↑/↓ arrow-key navigation through `commandHistory`.
 *
 * Behaviour mirrors typical Unix shell history:
 *  - ArrowUp   — move to an older command (towards index 0).
 *  - ArrowDown — move to a newer command; past the newest restores the
 *                draft that was in the input before navigation started.
 *  - Typing does NOT reset the cursor — the user can edit a recalled
 *    command before submitting (standard shell behaviour).
 *
 * The cursor and draft are stored in refs (not state) to avoid
 * re-renders and to keep the implementation synchronous.
 *
 * Store access happens inside the callback via `.getState()` rather than
 * a subscription, so the hook itself causes zero re-renders.
 */
export function useCommandHistory(
  value: string,
  onChange: (v: string) => void,
): UseCommandHistoryResult {
  /** Index into commandHistory; null = not in navigation mode. */
  const cursorRef = useRef<number | null>(null);
  /** The input value that existed before navigation started. */
  const draftRef = useRef('');

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const { commandHistory } = useTerminalStore.getState();
        if (commandHistory.length === 0) return;

        if (cursorRef.current === null) {
          // First ArrowUp — save current draft and jump to newest entry.
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
          // Past the newest entry — restore the draft and exit navigation mode.
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
