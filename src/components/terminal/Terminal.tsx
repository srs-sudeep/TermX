import { userConfig } from '@/config';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { useTerminal } from '@/hooks/useTerminal';
import { useTerminalStore } from '@/store/terminalStore';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { TerminalHistory } from './TerminalHistory';
import { TerminalInput } from './TerminalInput';

interface TerminalProps {
  bootRan?: boolean;
}

export function Terminal({ bootRan = false }: TerminalProps) {
  const { submit, isProcessing, registry } = useTerminal();
  const clearHistory = useTerminalStore((s) => s.clearHistory);
  const history = useTerminalStore((s) => s.history);

  const [inputValue, setInputValue] = useState('');
  const hasDispatchedRef = useRef(false);

  const containerRef = useScrollToBottom([history.length]);

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
      <div className="px-5 sm:px-7 py-5 mx-auto">
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
