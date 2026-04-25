import type { ReactNode } from 'react';

interface JsxOutputProps {
  element: ReactNode;
}

/**
 * Renders arbitrary React content returned by a command.
 *
 * This output type is the "last resort" escape hatch — use it only for
 * effects that genuinely require custom React components (matrix rain,
 * ASCII art animations, neofetch layout).
 *
 * The element is wrapped in a div with `role="region"` and an accessible
 * label so screen readers know it's custom output.
 */
export function JsxOutput({ element }: JsxOutputProps) {
  return (
    <div role="region" aria-label="Command output">
      {element}
    </div>
  );
}
