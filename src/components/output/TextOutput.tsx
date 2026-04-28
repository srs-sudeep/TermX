import { cn } from '@/lib/cn';
import { useThemeStore } from '@/store/themeStore';
import { Typewriter } from '@/components/effects/Typewriter';

interface TextOutputProps {
  content: string;
  tone?: 'normal' | 'success' | 'error' | 'warning' | 'muted';
}

const TONE_CLASS: Record<NonNullable<TextOutputProps['tone']>, string> = {
  normal: 'text-[var(--fg)]',
  success: 'text-[var(--success)]',
  error: 'text-[var(--error)]',
  warning: 'text-[var(--warning)]',
  muted: 'text-[var(--muted)]',
};

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

  return <p className={cn('whitespace-pre-wrap break-words', toneClass)}>{content}</p>;
}
