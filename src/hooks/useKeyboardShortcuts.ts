import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  /** Ctrl+L — clear the terminal screen (fires the `clear` command). */
  onClearScreen: () => void;
  /** Ctrl+C — cancel/clear the current input line. */
  onCancelInput: () => void;
  /** Ctrl+U — erase the current line (Unix convention). */
  onClearLine: () => void;
}

/**
 * Registers global keyboard shortcuts for the terminal.
 *
 * Attaches a document-level keydown listener so shortcuts fire even when
 * the terminal input isn't focused. `e.preventDefault()` is called on each
 * handled key to suppress default browser behaviour (e.g. Ctrl+L opens the
 * address bar in most browsers).
 *
 * Shortcuts:
 *  Ctrl+L — clear the terminal screen
 *  Ctrl+C — cancel / clear the current input
 *  Ctrl+U — erase the line (Unix convention)
 *
 * @example
 * useKeyboardShortcuts({
 *   onClearScreen: () => clearHistory(),
 *   onCancelInput: () => setInput(''),
 *   onClearLine:   () => setInput(''),
 * });
 */
export function useKeyboardShortcuts({
  onClearScreen,
  onCancelInput,
  onClearLine,
}: KeyboardShortcutOptions): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey) return;

      switch (e.key.toLowerCase()) {
        case 'l':
          e.preventDefault();
          onClearScreen();
          break;
        case 'c':
          e.preventDefault();
          onCancelInput();
          break;
        case 'u':
          e.preventDefault();
          onClearLine();
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClearScreen, onCancelInput, onClearLine]);
}
