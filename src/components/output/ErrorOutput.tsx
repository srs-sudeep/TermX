interface ErrorOutputProps {
  message: string;
}

/**
 * Renders an error message in red, prefixed with "error:".
 *
 * Rules:
 *  - Always include the word "error" — color is not the only signal.
 *  - Use for user-facing errors (unknown command, bad args, missing data).
 *  - Do NOT use for `text` output with `tone: 'error'` — those are informational warnings.
 */
export function ErrorOutput({ message }: ErrorOutputProps) {
  return (
    <p className="text-[var(--error)]" role="alert">
      <span className="font-bold">error:</span> {message}
    </p>
  );
}
