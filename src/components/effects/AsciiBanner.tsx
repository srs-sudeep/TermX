interface AsciiBannerProps {
   
  text: string;
}

export function AsciiBanner({ text }: AsciiBannerProps) {
  
  const label = text.replace(/[█▀▄░▌▐]/g, '').replace(/\s+/g, ' ').trim();

  return (
    <pre
      className="text-[var(--accent)] font-mono text-xs leading-tight select-none overflow-x-auto"
      aria-label={label || 'ASCII banner'}
    >
      {text}
    </pre>
  );
}
