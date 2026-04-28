import { useAutocomplete } from '@/hooks/useAutocomplete';
import { useCommandHistory } from '@/hooks/useCommandHistory';
import { cn } from '@/lib/cn';
import type { Registry } from '@/lib/commandRegistry';
import type { UserConfig } from '@/types';
import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import { Prompt } from './Prompt';

interface TerminalInputProps {
  promptConfig: UserConfig['prompt'];
   
  value: string;
   
  onChange: (value: string) => void;
   
  onSubmit: (value: string) => void;
   
  disabled?: boolean;
   
  registry?: Registry | null;
}

export function TerminalInput({
  promptConfig,
  value,
  onChange,
  onSubmit,
  disabled = false,
  registry = null,
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        historyKeyDown(e);
        return;
      }

      if (e.key === 'Tab') {
        autocompleteKeyDown(e);
        return;
      }

      if (e.key === 'ArrowRight' && ghostSuffix) {
        const input = inputRef.current;
        if (input && input.selectionStart === value.length) {
          e.preventDefault();
          onChange(value + ghostSuffix);
          resetAutocomplete();
          return;
        }
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        resetCursor();
        resetAutocomplete();
        onSubmit(value);
        onChange('');
        return;
      }

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
      { }
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

      { }
      <div className="relative flex-1 min-w-0 flex items-center">
        { }
        {ghostSuffix && (
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0 pointer-events-none flex items-center',
              'font-mono text-[length:var(--font-size-base)] leading-[var(--line-height-base)]',
              'whitespace-pre overflow-hidden',
            )}
          >
            { }
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
