import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';
import { useThemeStore } from '@/store/themeStore';

interface BootLine {
  /** Status tag rendered as a colored prefix (`OK`, `..`, `!!`). */
  tag: 'OK' | '..' | '!!' | '';
  /** Body text rendered after the tag. Empty string renders as a blank gap. */
  text: string;
  /** Delay (ms) before this line appears, relative to mount. */
  delay: number;
}

const BOOT_LINES: BootLine[] = [
  { tag: 'OK', text: 'Booting termfolio kernel ......................', delay: 0 },
  { tag: 'OK', text: 'Loading user configuration ....................', delay: 150 },
  { tag: 'OK', text: 'Mounting virtual filesystem ...................', delay: 300 },
  { tag: 'OK', text: 'Registering 24 commands .......................', delay: 450 },
  { tag: 'OK', text: 'Applying theme ................................', delay: 600 },
  { tag: 'OK', text: 'Spawning shell at /home/visitor ...............', delay: 750 },
  { tag: 'OK', text: 'Establishing secure session ...................', delay: 900 },
  { tag: '',   text: '',                                                delay: 1050 },
  { tag: '..', text: 'Welcome aboard.',                                  delay: 1100 },
];

const TOTAL_DURATION = 1500;
const DONE_DELAY = 1550;

interface BootSequenceProps {
  /** Called when the boot sequence finishes (or is skipped). */
  onDone: (bootRan: boolean) => void;
}

/**
 * Scripted ~1.5-second boot animation shown on first visit.
 *
 * Renders fake init messages with colored status tags and an animated
 * progress bar that fills from 0 → 100 over the boot window. The final
 * "Welcome aboard" line fades in last; control then transfers to the
 * Terminal component which dispatches the `welcome` screen.
 *
 * Auto-skipped when:
 *  - `bootEnabled` is false (user toggled it off in settings),
 *  - `termfolio:visited` is already set in localStorage (repeat visit),
 *  - `prefers-reduced-motion: reduce` is active.
 */
export function BootSequence({ onDone }: BootSequenceProps) {
  const [visible, setVisible] = useState<number>(0);

  useEffect(() => {
    const bootEnabled = useThemeStore.getState().bootEnabled;
    const alreadyVisited = storage.get<boolean>('visited', false);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!bootEnabled || alreadyVisited || prefersReduced) {
      onDone(false);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, idx) => {
      timers.push(
        setTimeout(() => {
          setVisible(idx + 1);
        }, line.delay),
      );
    });

    timers.push(
      setTimeout(() => {
        storage.set('visited', true);
        onDone(true);
      }, DONE_DELAY),
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.min(100, Math.round((visible / BOOT_LINES.length) * 100));

  return (
    <div
      className="flex-1 overflow-y-auto p-6 font-mono"
      role="log"
      aria-live="polite"
      aria-label="Boot sequence"
    >
      {/* Boot lines */}
      <div className="space-y-0.5 text-sm leading-relaxed">
        {BOOT_LINES.slice(0, visible).map((line, idx) => {
          if (line.text === '' && line.tag === '') {
            return <div key={idx} className="h-3" aria-hidden="true" />;
          }
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-baseline gap-2"
            >
              <span
                className={
                  line.tag === 'OK'
                    ? 'text-[var(--success)]'
                    : line.tag === '..'
                      ? 'text-[var(--accent)]'
                      : line.tag === '!!'
                        ? 'text-[var(--error)]'
                        : 'text-[var(--muted)]'
                }
              >
                [ {line.tag.padEnd(2, ' ')} ]
              </span>
              <span className="text-[var(--fg)]">{line.text}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Animated progress bar */}
      <div className="mt-6 max-w-md">
        <div className="flex items-center justify-between mb-1.5 text-xs text-[var(--muted)]">
          <span>boot progress</span>
          <span className="tabular-nums text-[var(--fg)]">{progress}%</span>
        </div>
        <div
          className="h-1 w-full bg-[var(--selection)]/40 rounded overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <motion.div
            className="h-full bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-1 text-[0.7em] text-[var(--muted)] tracking-wider">
          {visible < BOOT_LINES.length
            ? 'initializing services ...'
            : 'ready.'}
        </div>
      </div>

      {/* Quick session metadata block */}
      <div className="mt-6 max-w-md text-xs text-[var(--muted)] space-y-0.5">
        <div className="flex justify-between">
          <span className="opacity-70">build</span>
          <span className="text-[var(--fg)]">termfolio · v2.0.0</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">total uptime</span>
          <span className="text-[var(--fg)]">
            {((Math.min(visible / BOOT_LINES.length, 1) * TOTAL_DURATION) / 1000).toFixed(2)}s
          </span>
        </div>
      </div>
    </div>
  );
}
