import { Settings } from 'lucide-react';
import { userConfig } from '@/config';

interface TitleBarProps {
  /** Called when the gear (settings) button is clicked. */
  onGearClick: () => void;
}

/**
 * macOS-style terminal title bar with decorative traffic-light buttons
 * and a settings gear button.
 *
 * The traffic lights are purely cosmetic (`aria-hidden`) — they have no
 * close/minimize/fullscreen behaviour.
 *
 * The gear button opens the settings modal via `onGearClick`.
 */
export function TitleBar({ onGearClick }: TitleBarProps) {
  const { user, host } = userConfig.prompt;
  const title = `${user}@${host}`;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg)] border-b border-[var(--border)] select-none flex-shrink-0">
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="inline-block w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="inline-block w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="inline-block w-3 h-3 rounded-full bg-[#28c940]" />
      </div>

      {/* Window title */}
      <span className="flex-1 text-center text-[0.85em] text-[var(--muted)]">
        {title}
      </span>

      {/* Settings gear button */}
      <button
        onClick={onGearClick}
        className="p-1 text-[var(--muted)] hover:text-[var(--fg)] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
        aria-label="Open settings"
      >
        <Settings size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
