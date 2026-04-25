import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { TitleBar } from './TitleBar';
import { StatusBar } from './StatusBar';
import { Terminal } from '@/components/terminal/Terminal';
import { BootSequence } from '@/components/terminal/BootSequence';
import { SettingsPanel } from '@/components/settings/SettingsPanel';

/**
 * Root application shell.
 *
 * Manages three top-level concerns:
 *  1. Theme sync — `useTheme()` keeps CSS variables in sync with the store.
 *  2. Boot sequence — shown on first visit; hidden on repeat visits.
 *     After boot, `Terminal` knows whether to dispatch `banner` itself.
 *  3. Settings modal — opened by the gear button in `<TitleBar />`.
 *
 * State:
 *  - `booted`  — whether the boot phase is complete (BootSequence → Terminal).
 *  - `bootRan` — whether the boot animation actually played (vs. was skipped).
 *               Terminal uses this to decide whether to dispatch `banner`.
 *  - `settingsOpen` — settings modal visibility.
 */
export function AppShell() {
  useTheme();

  const [booted, setBooted] = useState(false);
  const [bootRan, setBootRan] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleBootDone = useCallback((didRun: boolean) => {
    setBootRan(didRun);
    setBooted(true);
  }, []);

  const handleGearClick = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--bg)] overflow-hidden">
      <TitleBar onGearClick={handleGearClick} />

      <AnimatePresence mode="wait" initial={false}>
        {!booted ? (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1 min-h-0 flex flex-col"
          >
            <BootSequence onDone={handleBootDone} />
          </motion.div>
        ) : (
          <motion.div
            key="terminal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 min-h-0 flex flex-col"
          >
            <Terminal bootRan={bootRan} />
          </motion.div>
        )}
      </AnimatePresence>

      <StatusBar />

      {settingsOpen && <SettingsPanel onClose={handleSettingsClose} />}
    </div>
  );
}
