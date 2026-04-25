import { motion, useReducedMotion } from 'framer-motion';
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
 * Entries fade-and-slide in via framer-motion for a smoother feel; the
 * effect is automatically suppressed when `prefers-reduced-motion: reduce`
 * is active.
 *
 * The `role="log"` + `aria-live="polite"` attributes let screen readers
 * announce new output as it arrives without interrupting ongoing speech.
 */
export function TerminalHistory() {
  const history = useTerminalStore((s) => s.history);
  const reduce = useReducedMotion();

  return (
    <div role="log" aria-live="polite" aria-label="Terminal output history">
      {history.map((entry) => (
        <motion.div
          key={entry.id}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="mb-3"
        >
          {/* Prompt + input line — only render if there's actual input. */}
          {entry.input !== '' && (
            <div className="flex items-baseline flex-wrap gap-0">
              <Prompt config={userConfig.prompt} muted />
              <span className="text-[var(--fg)] break-all">{entry.input}</span>
            </div>
          )}

          {/* Command output */}
          {entry.output !== null && (
            <div className="mt-0.5">
              <OutputRenderer output={entry.output} />
            </div>
          )}

          {/* Pending indicator — output is null but entry has input (async command) */}
          {entry.output === null && entry.input !== '' && (
            <div className="mt-1 inline-flex items-center gap-1 text-[var(--muted)]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-pulse" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-pulse [animation-delay:120ms]" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-pulse [animation-delay:240ms]" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
