import { useTerminalStore } from '@/store/terminalStore';
import { userConfig } from '@/config';
import { Prompt } from './Prompt';
import { OutputRenderer } from '@/components/output/OutputRenderer';

/**
 * Renders the complete terminal output history.
 *
 * Each entry corresponds to one "Enter" press and shows:
 *  1. The prompt + the input the user typed.
 *  2. The command's output (null means blank Enter or command still pending).
 *
 * The `role="log"` + `aria-live="polite"` attributes let screen readers
 * announce new output as it arrives without interrupting ongoing speech.
 */
export function TerminalHistory() {
  const history = useTerminalStore((s) => s.history);

  return (
    <div role="log" aria-live="polite" aria-label="Terminal output history">
      {history.map((entry) => (
        <div key={entry.id} className="mb-2">
          {/* Prompt + input line */}
          <div className="flex items-baseline flex-wrap gap-0">
            <Prompt config={userConfig.prompt} muted />
            <span className="text-[var(--fg)] break-all">{entry.input}</span>
          </div>

          {/* Command output */}
          {entry.output !== null && (
            <div className="mt-0.5 pl-0">
              <OutputRenderer output={entry.output} />
            </div>
          )}

          {/* Pending indicator — output is null but entry exists (async command) */}
          {entry.output === null && entry.input !== '' && (
            <div className="mt-0.5 text-[var(--muted)] animate-pulse">…</div>
          )}
        </div>
      ))}
    </div>
  );
}
