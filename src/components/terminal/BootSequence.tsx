import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { userConfig } from '@/config';
import { buildBanner } from '@/lib/asciiFonts';
import { AsciiBanner } from '@/components/effects/AsciiBanner';
import { useThemeStore } from '@/store/themeStore';

interface BootLine {
  text: string;
  delay: number;
}

const BOOT_LINES: BootLine[] = [
  { text: '[  OK  ] Initializing terminal environment...', delay: 0 },
  { text: '[  OK  ] Loading configuration...            done.', delay: 180 },
  { text: '[  OK  ] Registering commands...             done.', delay: 360 },
  { text: '[  OK  ] Mounting virtual filesystem...      done.', delay: 540 },
  { text: '[  OK  ] Applying theme...                   done.', delay: 720 },
  { text: '[  OK  ] Starting portfolio services...      done.', delay: 900 },
  { text: '', delay: 1050 },
];

const BANNER_DELAY = 1100;
const DONE_DELAY = 1500;

interface BootSequenceProps {
  /** Called when the boot sequence finishes (or is skipped). */
  onDone: (bootRan: boolean) => void;
}

/**
 * Scripted 1.5-second boot animation shown on first visit.
 *
 * Shows fake OS-style init messages, then the ASCII banner.
 * Automatically skipped when:
 *  - `bootEnabled` is false (user toggled it off in settings)
 *  - `termfolio:visited` is already set in localStorage (repeat visit)
 *  - `prefers-reduced-motion: reduce` is active
 *
 * When skipped, calls `onDone(false)` immediately so the terminal can
 * dispatch `banner` + `help`. When it runs, calls `onDone(true)` so the
 * terminal knows the banner was already displayed.
 */
export function BootSequence({ onDone }: BootSequenceProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [showBanner, setShowBanner] = useState(false);
  const bannerText = buildBanner(userConfig.user.name);

  useEffect(() => {
    const bootEnabled = useThemeStore.getState().bootEnabled;
    const alreadyVisited = storage.get<boolean>('visited', false);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Skip boot when: disabled via store (covers both the config default and the
    // runtime toggle in SettingsPanel), already visited, or reduced-motion.
    if (!bootEnabled || alreadyVisited || prefersReduced) {
      onDone(false);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach(({ text, delay }) => {
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, text]);
        }, delay),
      );
    });

    timers.push(
      setTimeout(() => {
        setShowBanner(true);
      }, BANNER_DELAY),
    );

    timers.push(
      setTimeout(() => {
        storage.set('visited', true);
        onDone(true);
      }, DONE_DELAY),
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 font-mono" role="log" aria-live="polite">
      {lines.map((line, i) =>
        line === '' ? (
          <div key={i} className="h-4" />
        ) : (
          <div key={i} className="text-[var(--success)] leading-relaxed text-sm">
            {line}
          </div>
        ),
      )}
      {showBanner && (
        <div className="mt-2">
          <AsciiBanner text={bannerText} />
        </div>
      )}
    </div>
  );
}
