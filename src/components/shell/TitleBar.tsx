import { Settings, Folder, Search } from 'lucide-react';
import { userConfig } from '@/config';

interface TitleBarProps {
  /** Called when the gear (settings) button is clicked. */
  onGearClick: () => void;
}

/**
 * macOS-style terminal title bar.
 *
 * - Decorative traffic-light buttons on the left (purely cosmetic; aria-hidden).
 * - Centered window title showing `user@host` along with a small "tab"
 *   pill that shows the current path — gives the title bar the feel of a
 *   real terminal window with a single open tab.
 * - Settings gear button on the right opens the settings modal via `onGearClick`.
 *
 * The bar is sticky at the top of the viewport and reserves a comfortable
 * height for click targets on touch devices.
 */
export function TitleBar({ onGearClick }: TitleBarProps) {
  const { user, host, path } = userConfig.prompt;
  const title = `${user}@${host}`;

  return (
    <header
      className="
        relative flex items-center gap-3 px-4 py-2.5
        bg-[var(--bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg)]/80
        border-b border-[var(--border)]
        select-none flex-shrink-0
      "
      role="banner"
    >
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="inline-block w-3 h-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]" />
        <span className="inline-block w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]" />
        <span className="inline-block w-3 h-3 rounded-full bg-[#28c940] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]" />
      </div>

      {/* Tab pill — shows the current shell "tab" (host:path).
          On narrow viewports the path collapses to keep things tidy. */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2
          flex items-center gap-2 px-3 py-1
          bg-[var(--selection)]/40 border border-[var(--border)]
          rounded-md text-[0.78em] font-mono
          text-[var(--muted)]
          max-w-[60vw] truncate
        "
      >
        <Folder size={11} aria-hidden="true" className="opacity-70" />
        <span className="truncate">
          <span className="text-[var(--fg)]">{title}</span>
          <span className="opacity-60 mx-1">:</span>
          <span className="text-[var(--accent)]">{path}</span>
        </span>
      </div>

      {/* Right side — search hint + settings */}
      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={onGearClick}
          className="
            hidden sm:flex items-center gap-1.5 px-2 py-1 rounded
            text-[0.72em] font-mono text-[var(--muted)]
            border border-[var(--border)]
            hover:text-[var(--fg)] hover:border-[var(--muted)]
            transition-colors
            focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]
          "
          aria-label="Open settings"
          title="Open settings"
        >
          <Search size={10} aria-hidden="true" />
          <span>type a command</span>
        </button>

        <button
          onClick={onGearClick}
          className="
            p-1.5 rounded text-[var(--muted)]
            hover:text-[var(--fg)] hover:bg-[var(--selection)]/40
            transition-colors
            focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]
          "
          aria-label="Open settings"
          title="Settings"
        >
          <Settings size={14} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
