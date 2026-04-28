import type { UserConfig } from '@/types';

interface PromptProps {
  config: UserConfig['prompt'];
  muted?: boolean;
}

function SegArrow({ bg, fill }: { bg: string; fill: string }) {
  return (
    <svg
      width="10"
      height="22"
      viewBox="0 0 10 22"
      style={{ display: 'block', flexShrink: 0, background: bg }}
    >
      <polygon points="0,0 10,11 0,22" fill={fill} />
    </svg>
  );
}

export function Prompt({ config, muted = false }: PromptProps) {
  if (muted) {
    return (
      <span
        className="mr-2 shrink-0 select-none inline-flex items-center text-sm opacity-40 leading-none"
        aria-hidden="true"
      >
        <span className="px-2 py-0.5 bg-[var(--selection)] text-[var(--muted)] rounded-l-sm">
          {config.user}@{config.host}
        </span>
        <span className="px-2 py-0.5 bg-[var(--border)] text-[var(--muted)]">{config.path}</span>
      </span>
    );
  }

  return (
    <span
      className="mr-2 shrink-0 select-none inline-flex items-stretch text-sm leading-none"
      aria-hidden="true"
    >
      <span className="px-2.5 flex items-center bg-[var(--prompt)] text-[var(--bg)] font-bold rounded-l-sm">
        {config.user}
        <span className="opacity-60 mx-0.5">@</span>
        {config.host}
      </span>

      <SegArrow bg="var(--prompt)" fill="var(--accent)" />

      <span className="px-2.5 flex items-center bg-[var(--accent)] text-[var(--bg)] font-semibold">
        {config.path}
      </span>

      <SegArrow bg="var(--bg)" fill="var(--accent)" />

      <span className="ml-1.5 flex items-center text-[var(--prompt)] font-bold">❯</span>
    </span>
  );
}
