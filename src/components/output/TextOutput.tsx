import { cn } from '@/lib/cn';
import { useThemeStore } from '@/store/themeStore';
import { Typewriter } from '@/components/effects/Typewriter';

interface TextOutputProps {
  content: string;
  tone?: 'normal' | 'success' | 'error' | 'warning' | 'muted';
}

/** Map semantic tones to CSS variable classes. */
const TONE_CLASS: Record<NonNullable<TextOutputProps['tone']>, string> = {
  normal: 'text-[var(--fg)]',
  success: 'text-[var(--success)]',
  error: 'text-[var(--error)]',
  warning: 'text-[var(--warning)]',
  muted: 'text-[var(--muted)]',
};

/**
 * Renders a plain text command output, with optional semantic tone.
 * Preserves newlines using `whitespace-pre-wrap`.
 *
 * When the `typewriter` setting is enabled in the theme store, text is
 * animated character-by-character via `<Typewriter>`. The effect honours
 * `prefers-reduced-motion` — motion is skipped automatically.
 */
export function TextOutput({ content, tone = 'normal' }: TextOutputProps) {
  const typewriter = useThemeStore((s) => s.typewriter);
  const toneClass = TONE_CLASS[tone];

  if (typewriter) {
    return (
      <p className={cn('whitespace-pre-wrap break-words', toneClass)}>
        <Typewriter text={content} speed={18} />
      </p>
    );
  }

  return (
    <p className={cn('whitespace-pre-wrap break-words', toneClass)}>
      {content}
    </p>
  );
}
