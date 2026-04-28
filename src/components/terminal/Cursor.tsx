import { cn } from '@/lib/cn';

interface CursorProps {
  static?: boolean;
}

export function Cursor({ static: isStatic = false }: CursorProps) {
  return (
    <span
      className={cn(
        'inline-block w-[0.55em] h-[1.1em] bg-[var(--cursor)] align-middle',
        !isStatic && 'cursor-blink',
      )}
      aria-hidden="true"
    />
  );
}
