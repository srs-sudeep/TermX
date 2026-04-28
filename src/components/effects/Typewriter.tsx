import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;

  speed?: number;

  onDone?: () => void;

  className?: string;
}

export function Typewriter({ text, speed = 28, onDone, className }: TypewriterProps) {
  const reduce = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduce ? text : '');

  useEffect(() => {
    if (reduce) {
      setDisplayed(text);
      onDone?.();
      return;
    }

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
