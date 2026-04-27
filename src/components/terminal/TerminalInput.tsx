import { useRef, useCallback, useEffect, type KeyboardEvent } from 'react';
import type { UserConfig } from '@/types';
import type { Registry } from '@/lib/commandRegistry';
import { Prompt } from './Prompt';
import { cn } from '@/lib/cn';
import { useCommandHistory } from '@/hooks/useCommandHistory';
import { useAutocomplete } from '@/hooks/useAutocomplete';

interface TerminalInputProps {
  promptConfig: UserConfig['prompt'];
  /** Current input value. */
  value: string;
  /** Called when the value changes (controlled input). */
  onChange: (value: string) => void;
  /** Called when the user presses Enter. */
  onSubmit: (value: string) => void;
  /** When true, the input is disabled (e.g. while an async command runs). */
  disabled?: boolean;
  /**
   * Command registry used by Tab-autocomplete.
   * Optional — autocomplete is silently disabled when absent.
   */
  registry?: Registry | null;
}

/**
 * The active terminal input line — prompt + text input.
 *
 * This is a controlled component: the parent owns `value` / `onChange`.
 * That allows `Terminal.tsx` to clear the input after submit, and
 * `useCommandHistory` to override the value for ↑/↓ recall.
 *
 * Keyboard handling:
 *  Enter     — submit and clear; reset history cursor
 *  ArrowUp   — navigate to older command (useCommandHistory)
 *  ArrowDown — navigate to newer command / restore draft (useCommandHistory)
 *  Tab       — autocomplete command name or argument (useAutocomplete)
 *  Ctrl+C    — clear the current line; reset history cursor
 *  Ctrl+U    — clear the current line; reset history cursor
 *
 * Focus: auto-focuses on mount. Clicking anywhere in the terminal
 * (handled by Terminal.tsx) will re-focus this input.
 */
export function TerminalInput({
  promptConfig,
  value,
  onChange,
  onSubmit,
  disabled = false,
  registry = null,
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Re-focus the input whenever processing completes (disabled flips false).
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const { onKeyDown: historyKeyDown, resetCursor } = useCommandHistory(value, onChange);
  const { onKeyDown: autocompleteKeyDown } = useAutocomplete(registry, value, onChange);

  /** Expose focus to the parent via the container's click handler. */
  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      // ── History navigation (ArrowUp / ArrowDown) ──────────────────────
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        historyKeyDown(e);
        return;
      }

      // ── Autocomplete (Tab) ────────────────────────────────────────────
      if (e.key === 'Tab') {
        autocompleteKeyDown(e);
        return;
      }

      // ── Submit (Enter) ────────────────────────────────────────────────
      if (e.key === 'Enter') {
        e.preventDefault();
        resetCursor();
        onSubmit(value);
        onChange('');
        return;
      }

      // ── Clear line (Ctrl+C / Ctrl+U) ──────────────────────────────────
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        resetCursor();
        onChange('');
        return;
      }
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        resetCursor();
        onChange('');
        return;
      }
    },
    [value, onSubmit, onChange, historyKeyDown, autocompleteKeyDown, resetCursor],
  );

  return (
    <div
      className="
        group relative flex items-center
        py-1
        rounded
        focus-within:bg-[var(--selection)]/15
        transition-colors
      "
      data-terminal-input
      onClick={focus}
    >
      {/* Subtle left accent bar — brightens on focus to indicate the active
          input line. Decorative; aria-hidden. */}
      <span
        aria-hidden="true"
        className="
          absolute left-[-14px] top-1 bottom-1 w-[2px]
          bg-[var(--accent)]
          opacity-0 group-focus-within:opacity-100
          transition-opacity
        "
      />

      <Prompt config={promptConfig} />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Terminal command input"
        placeholder={disabled ? 'processing…' : "type a command — try 'help'"}
        className={cn(
          'flex-1 min-w-0 bg-transparent border-0 outline-none',
          'font-mono text-[length:var(--font-size-base)] leading-[var(--line-height-base)]',
          'text-[var(--fg)] caret-[var(--cursor)]',
          'placeholder:text-[var(--muted)]/60',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      />
    </div>
  );
}
