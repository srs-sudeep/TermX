import { useEffect, useRef, type RefObject } from 'react';

/**
 * Returns a ref to attach to the scrollable container element.
 * Scrolls the container to the bottom whenever any value in `deps` changes.
 *
 * Uses `behavior: 'smooth'` for a more polished feel; falls back to an
 * instant `scrollTop` jump when `prefers-reduced-motion: reduce` is set
 * so users who opt out of motion still see the latest output without
 * scroll animation.
 *
 * @param deps - Dependency values that trigger a scroll on change.
 *               Typically `[history.length]` — scroll after each new entry.
 * @returns A ref to attach to the scroll container element.
 *
 * @example
 * const containerRef = useScrollToBottom([history.length]);
 * return <div ref={containerRef} className="overflow-y-auto">...</div>;
 */
export function useScrollToBottom(deps: unknown[]): RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Defer one frame so freshly-mounted entries are measured before scroll.
    const raf = window.requestAnimationFrame(() => {
      if (reduce) {
        el.scrollTop = el.scrollHeight;
      } else {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    });

    return () => window.cancelAnimationFrame(raf);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
