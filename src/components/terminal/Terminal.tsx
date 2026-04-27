import { userConfig } from '@/config';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { useTerminal } from '@/hooks/useTerminal';
import { useTerminalStore } from '@/store/terminalStore';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { TerminalHistory } from './TerminalHistory';
import { TerminalInput } from './TerminalInput';

interface TerminalProps {
  /**
   * Whether the boot animation played before Terminal mounted.
   *
   * Currently informational — the welcome screen is always rendered on
   * mount regardless of this flag (the boot sequence does not pre-render
   * the welcome screen). Kept on the props for backwards compatibility
   * and so AppShell can pass it through without conditional logic.
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
 *  - Initial `welcome` screen rendered synchronously on first mount
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
  // Always show the `welcome` hero on first mount.
  //
  // Rather than going through `submit('welcome')` (which adds a placeholder
  // entry + pending indicator that briefly flashes before resolving),
  // we synthesize a completed history entry directly. This produces a
  // smoother first paint: the user sees the prompt and the rendered
  // welcome screen on the same frame.
  //
  // `bootRan` is intentionally unused but kept on the props contract for
  // backwards compatibility with AppShell.
  useEffect(() => {
    if (hasDispatchedRef.current) return;
    hasDispatchedRef.current = true;
    void bootRan;
    useTerminalStore.getState().appendOutput({
      id: 'entry-init-welcome',
      input: 'welcome',
      output: { type: 'welcome' },
      timestamp: Date.now(),
    });
  }, [bootRan]);

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
      className="
        flex-1 overflow-y-auto cursor-text
        scroll-smooth
        bg-[var(--bg)]
      "
      onClick={handleClick}
      role="region"
      aria-label="Terminal"
    >
      <div className="px-5 sm:px-7 py-5 max-w-[1100px] mx-auto">
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
    </div>
  );
}
