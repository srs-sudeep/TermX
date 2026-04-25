import { clsx, type ClassValue } from 'clsx';

/**
 * Merges Tailwind class strings, conditionally.
 * Wraps clsx for convenience. Use throughout the component tree.
 *
 * @example
 * cn('flex items-center', isActive && 'text-[var(--accent)]')
 * cn('base-class', condition ? 'a' : 'b')
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}
