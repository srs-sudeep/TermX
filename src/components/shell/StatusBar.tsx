import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { useTerminalStore } from '@/store/terminalStore';

export function StatusBar() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const commandHistory = useTerminalStore((s) => s.commandHistory);
  const [now, setNow] = useState(() => new Date());
  const [online, setOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      clearInterval(tick);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const time = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <footer
      className="
        flex items-center gap-3 px-4 py-1.5
        bg-[var(--bg)] border-t border-[var(--border)]
        text-[0.72em] font-mono text-[var(--muted)]
        select-none flex-shrink-0
        overflow-hidden
      "
      role="contentinfo"
      aria-label="Status bar"
    >
      { }
      <span className="inline-flex items-center gap-1.5">
        <span
          className={`
            inline-block w-1.5 h-1.5 rounded-full
            ${online ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--error)]'}
          `}
          aria-hidden="true"
        />
        <span>{online ? 'online' : 'offline'}</span>
      </span>

      <span className="opacity-40" aria-hidden="true">│</span>

      { }
      <span className="inline-flex items-center gap-1.5 truncate">
        <span className="opacity-70">theme</span>
        <span className="text-[var(--accent)] truncate">{currentTheme}</span>
      </span>

      <span className="opacity-40 hidden sm:inline" aria-hidden="true">│</span>

      { }
      <span className="hidden sm:inline-flex items-center gap-1.5">
        <span className="opacity-70">cmds</span>
        <span className="text-[var(--fg)]">{commandHistory.length}</span>
      </span>

      { }
      <span className="ml-auto" />

      { }
      <span className="hidden md:inline-flex items-center gap-3">
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--selection)]/30 text-[var(--fg)]">
            Tab
          </kbd>
          <span>autocomplete</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--selection)]/30 text-[var(--fg)]">
            ↑↓
          </kbd>
          <span>history</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--selection)]/30 text-[var(--fg)]">
            Ctrl+L
          </kbd>
          <span>clear</span>
        </span>
      </span>

      <span className="opacity-40 hidden md:inline" aria-hidden="true">│</span>

      { }
      <time
        dateTime={now.toISOString()}
        className="text-[var(--fg)] tabular-nums"
        aria-label={`Time: ${time}`}
      >
        {time}
      </time>
    </footer>
  );
}
