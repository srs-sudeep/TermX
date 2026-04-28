import { motion, useReducedMotion } from 'framer-motion';
import { useTerminalStore } from '@/store/terminalStore';
import { userConfig } from '@/config';
import { Prompt } from './Prompt';
import { OutputRenderer } from '@/components/output/OutputRenderer';

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
          {}
          {entry.input !== '' && (
            <div className="flex items-baseline flex-wrap gap-0">
              <Prompt config={userConfig.prompt} muted />
              <span className="text-[var(--fg)] break-all">{entry.input}</span>
            </div>
          )}

          {}
          {entry.output !== null && (
            <div className="mt-0.5">
              <OutputRenderer output={entry.output} />
            </div>
          )}

          {}
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
