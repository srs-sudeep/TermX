import type { ReactNode } from 'react';

interface JsxOutputProps {
  element: ReactNode;
}

export function JsxOutput({ element }: JsxOutputProps) {
  return (
    <div role="region" aria-label="Command output">
      {element}
    </div>
  );
}
