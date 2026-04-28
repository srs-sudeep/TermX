import { Fragment } from 'react';
import type { ListItem } from '@/types';

interface ListOutputProps {
  items: ListItem[];
}

export function ListOutput({ items }: ListOutputProps) {
  return (
    <div
      className="grid gap-x-4 gap-y-0.5 max-w-full"
      style={{ gridTemplateColumns: 'max-content minmax(0, 1fr)' }}
    >
      {items.map((item, idx) => {
        const indent = item.indent ?? 0;
        const isBlank = item.label === '' && !item.value && !item.url;
        const isHeader = indent === 0 && !item.value && !item.url && !isBlank;
        const indentRem = Math.max(0, indent - 1) * 1.25;

        if (isBlank) {
          return (
            <div
              key={idx}
              className="col-span-2 h-3"
              aria-hidden="true"
            />
          );
        }

        if (isHeader) {
          return (
            <div
              key={idx}
              className="col-span-2 mt-3 first:mt-0 mb-1 text-[var(--accent)] font-bold uppercase tracking-[0.18em] text-[0.78em]"
            >
              {item.label}
            </div>
          );
        }

        const labelEl = item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline focus-visible:underline whitespace-nowrap"
          >
            {item.label}
          </a>
        ) : (
          <span className="text-[var(--prompt)] whitespace-nowrap">
            {item.label}
          </span>
        );

        const valueText = item.value ?? '';

        const valueStartsWithDash = /^\s*[-—–=→»➤]/.test(valueText);

        return (
          <Fragment key={idx}>
            <div
              className="font-mono"
              style={{ paddingLeft: `${indentRem}rem` }}
            >
              {labelEl}
            </div>
            <div className="text-[var(--fg)] min-w-0 break-words">
              {item.value && (
                <>
                  {!valueStartsWithDash && (
                    <span
                      className="text-[var(--muted)] mr-2 select-none"
                      aria-hidden="true"
                    >
                      -
                    </span>
                  )}
                  <span>{item.value}</span>
                </>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
