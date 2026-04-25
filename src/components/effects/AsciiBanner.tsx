interface AsciiBannerProps {
  /** Pre-built ASCII art string (e.g. from `buildBanner()`). */
  text: string;
}

/**
 * Renders a block-character ASCII banner with accent coloring.
 *
 * Used by:
 *  - `<OutputRenderer>` when `output.type === 'banner'`
 *  - `<BootSequence>` to show the banner at the end of the boot animation
 *
 * The text is rendered with `whitespace-pre` to preserve the column alignment.
 * `aria-label` makes the label available to screen readers instead of the
 * raw block-character art.
 */
export function AsciiBanner({ text }: AsciiBannerProps) {
  // Extract a plain-text label by stripping block chars (for a11y).
  const label = text.replace(/[█▀▄░▌▐]/g, '').replace(/\s+/g, ' ').trim();

  return (
    <pre
      className="text-[var(--accent)] font-mono text-xs leading-tight select-none overflow-x-auto"
      aria-label={label || 'ASCII banner'}
    >
      {text}
    </pre>
  );
}
