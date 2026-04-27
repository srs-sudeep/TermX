import type { UserConfig } from '@/types';

interface PromptProps {
  config: UserConfig['prompt'];
  muted?: boolean;
}

/**
 * oh-my-zsh–inspired prompt.
 *
 * Active:  user@host  ~/path  ❯
 * Muted:   user@host:path$   (history entries — subdued single color)
 */
export function Prompt({ config, muted = false }: PromptProps) {
  if (muted) {
    return (
      <span className="text-[var(--muted)] mr-2 shrink-0 select-none" aria-hidden="true">
        <span className="opacity-70">{config.user}</span>
        <span className="opacity-40">@</span>
        <span className="opacity-70">{config.host}</span>
        <span className="opacity-40">:</span>
        <span className="opacity-70">{config.path}</span>
        <span className="opacity-40 ml-1">❯</span>
      </span>
    );
  }

  return (
    <span className="mr-2 shrink-0 select-none inline-flex items-center gap-0" aria-hidden="true">
      {/* user@host segment */}
      <span className="text-[var(--prompt)] font-semibold">{config.user}</span>
      <span className="text-[var(--muted)]">@</span>
      <span className="text-[var(--accent)] font-semibold">{config.host}</span>

      {/* separator */}
      <span className="text-[var(--muted)] mx-1.5">:</span>

      {/* path segment */}
      <span className="text-[var(--info)]">{config.path}</span>

      {/* arrow — the oh-my-zsh chevron */}
      <span className="text-[var(--prompt)] font-bold ml-1.5">❯</span>
    </span>
  );
}
