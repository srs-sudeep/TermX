import { useState, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { TitleBar } from './TitleBar';
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

      {!booted ? (
        <BootSequence onDone={handleBootDone} />
      ) : (
        <Terminal bootRan={bootRan} />
      )}

      {settingsOpen && <SettingsPanel onClose={handleSettingsClose} />}
    </div>
  );
}
