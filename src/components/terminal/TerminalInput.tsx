import { useAutocomplete } from '@/hooks/useAutocomplete';
import { useCommandHistory } from '@/hooks/useCommandHistory';
import { cn } from '@/lib/cn';
import type { Registry } from '@/lib/commandRegistry';
import type { UserConfig } from '@/types';
import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import { Prompt } from './Prompt';

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
  const {
    ghostSuffix,
    onKeyDown: autocompleteKeyDown,
    reset: resetAutocomplete,
  } = useAutocomplete(registry, value, onChange);

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

      // ── Accept ghost text (right arrow at end of line) ───────────────
      if (e.key === 'ArrowRight' && ghostSuffix) {
        const input = inputRef.current;
        if (input && input.selectionStart === value.length) {
          e.preventDefault();
          onChange(value + ghostSuffix);
          resetAutocomplete();
          return;
        }
      }

      // ── Submit (Enter) ────────────────────────────────────────────────
      if (e.key === 'Enter') {
        e.preventDefault();
        resetCursor();
        resetAutocomplete();
        onSubmit(value);
        onChange('');
        return;
      }

      // ── Clear line (Ctrl+C / Ctrl+U) ──────────────────────────────────
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        resetCursor();
        resetAutocomplete();
        onChange('');
        return;
      }
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        resetCursor();
        resetAutocomplete();
        onChange('');
        return;
      }
    },
    [
      value,
      onSubmit,
      onChange,
      historyKeyDown,
      autocompleteKeyDown,
      resetCursor,
      ghostSuffix,
      resetAutocomplete,
    ],
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

      {/* Input + ghost text wrapper */}
      <div className="relative flex-1 min-w-0 flex items-center">
        {/* Ghost text layer — shown behind the real input */}
        {ghostSuffix && (
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0 pointer-events-none flex items-center',
              'font-mono text-[length:var(--font-size-base)] leading-[var(--line-height-base)]',
              'whitespace-pre overflow-hidden',
            )}
          >
            {/* Invisible spacer to push ghost to cursor position */}
            <span className="invisible">{value}</span>
            <span className="text-[var(--muted)]/50">{ghostSuffix}</span>
          </div>
        )}

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
            'relative z-10 w-full bg-transparent border-0 outline-none',
            'font-mono text-[length:var(--font-size-base)] leading-[var(--line-height-base)]',
            'text-[var(--fg)] caret-[var(--cursor)]',
            'placeholder:text-[var(--muted)]/60',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
      </div>
    </div>
  );
}
