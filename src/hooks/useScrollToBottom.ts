import { useEffect, useRef, type RefObject } from 'react';

/**
 * Returns a ref to attach to the scrollable container element.
 * Scrolls the container to the bottom whenever any value in `deps` changes.
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
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
