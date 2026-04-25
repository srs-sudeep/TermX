import { cn } from '@/lib/cn';

interface CursorProps {
  /**
   * Disable the blink animation (e.g., when rendering in a non-active context).
   * The CSS media query also disables it when prefers-reduced-motion is set.
   */
  static?: boolean;
}

/**
 * A blinking block cursor.
 *
 * Uses the `.cursor-blink` CSS animation from globals.css, which is
 * automatically disabled when the user has `prefers-reduced-motion` set.
 *
 * @example
 * <Cursor />           // blinking
 * <Cursor static />    // solid, no blink
 */
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
