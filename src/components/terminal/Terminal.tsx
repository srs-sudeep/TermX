import { useState, useCallback, useRef, useEffect, type MouseEvent } from 'react';
import { TerminalInput } from './TerminalInput';
import { TerminalHistory } from './TerminalHistory';
import { userConfig } from '@/config';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTerminalStore } from '@/store/terminalStore';
import { useTerminal } from '@/hooks/useTerminal';

interface TerminalProps {
  /**
   * Whether the boot animation played before Terminal mounted.
   * When `true` the banner was already shown in `<BootSequence>`;
   * Terminal skips its own `banner` dispatch and only dispatches `help`.
   * When `false` (boot was skipped / repeat visit) Terminal dispatches
   * both `banner` and `help` so the user still sees them.
   */
  bootRan?: boolean;
}

/**
 * The main terminal component.
 *
 * Composes:
 *  - `<TerminalHistory>` — rendered output entries
 *  - `<TerminalInput>`   — the active prompt + input line
 *
 * Owns:
 *  - Input value state (controlled; `useCommandHistory` overrides it for ↑/↓)
 *  - Auto-scroll to bottom on new output
 *  - Global keyboard shortcuts (Ctrl+L, Ctrl+C, Ctrl+U)
 *  - Click-to-focus: clicking anywhere in the terminal focuses the input
 *  - Initial banner + help dispatch on first mount
 */
export function Terminal({ bootRan = false }: TerminalProps) {
  const { submit, isProcessing, registry } = useTerminal();
  const clearHistory = useTerminalStore((s) => s.clearHistory);
  const history = useTerminalStore((s) => s.history);

  const [inputValue, setInputValue] = useState('');
  const hasDispatchedRef = useRef(false);

  // Auto-scroll the terminal whenever the history grows.
  const containerRef = useScrollToBottom([history.length]);

  // ── Startup dispatch ────────────────────────────────────────────────────
  // Always dispatch banner + help on first mount.
  // When bootRan=true the BootSequence already showed the banner, so only
  // dispatch help. When bootRan=false (boot was skipped or repeat visit)
  // dispatch banner first so the user still sees it.
  useEffect(() => {
    if (hasDispatchedRef.current) return;
    hasDispatchedRef.current = true;

    (async () => {
      if (!bootRan) {
        await submit('banner');
      }
      await submit('help');
    })();
  }, [submit, bootRan]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────
  const handleClearScreen = useCallback(() => {
    clearHistory();
  }, [clearHistory]);

  const handleClearInput = useCallback(() => {
    setInputValue('');
  }, []);

  useKeyboardShortcuts({
    onClearScreen: handleClearScreen,
    onCancelInput: handleClearInput,
    onClearLine: handleClearInput,
  });

  // ── Click-to-focus ──────────────────────────────────────────────────────
  const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (tag === 'a' || tag === 'button' || tag === 'input') return;
    const input = (e.currentTarget as HTMLElement).querySelector<HTMLInputElement>(
      'input[type="text"]',
    );
    input?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 cursor-text"
      onClick={handleClick}
      role="region"
      aria-label="Terminal"
    >
      <TerminalHistory />
      <TerminalInput
        promptConfig={userConfig.prompt}
        value={inputValue}
        onChange={setInputValue}
        onSubmit={submit}
        disabled={isProcessing}
        registry={registry}
      />
    </div>
  );
}
