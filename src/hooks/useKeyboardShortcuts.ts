import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  onClearScreen: () => void;

  onCancelInput: () => void;

  onClearLine: () => void;
}

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
