import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypewriterProps {
  /** The full text to type out. */
  text: string;
  /** Milliseconds between each character. Defaults to 28. */
  speed?: number;
  /** Called once all characters have been displayed. */
  onDone?: () => void;
  /** Optional CSS class name applied to the wrapper span. */
  className?: string;
}

/**
 * Animates text appearing character-by-character at a configurable speed.
 *
 * Respects `prefers-reduced-motion`: when the user has reduced motion enabled,
 * the full text is shown immediately and `onDone` fires synchronously.
 *
 * Used by:
 *  - `<BootSequence>` for the init-message lines
 *  - `<TextOutput>` when `typewriter` is enabled in settings
 */
export function Typewriter({ text, speed = 28, onDone, className }: TypewriterProps) {
  const reduce = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduce ? text : '');

  useEffect(() => {
    // Show everything immediately when motion is reduced.
    if (reduce) {
      setDisplayed(text);
      onDone?.();
      return;
    }

    // Reset if text prop changes.
    setDisplayed('');
    let idx = 0;

    const id = setInterval(() => {
      idx++;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, reduce]);

  return <span className={className}>{displayed}</span>;
}
