import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { TitleBar } from './TitleBar';
import { StatusBar } from './StatusBar';
import { Terminal } from '@/components/terminal/Terminal';
import { BootSequence } from '@/components/terminal/BootSequence';
import { SettingsPanel } from '@/components/settings/SettingsPanel';

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
