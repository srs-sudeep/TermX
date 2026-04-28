interface ErrorOutputProps {
  message: string;
}

export function ErrorOutput({ message }: ErrorOutputProps) {
  return (
    <p className="text-[var(--error)]" role="alert">
      <span className="font-bold">error:</span> {message}
    </p>
  );
}
