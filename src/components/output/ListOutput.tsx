import type { ListItem } from '@/types';
import { cn } from '@/lib/cn';

interface ListOutputProps {
  items: ListItem[];
}

/**
 * Renders a bulleted list of items.
 *
 * Indent levels:
 *  - `indent: 0` (default) — top-level. If no `value` is present, rendered as
 *    a bold accent-colored header (e.g. category names in `help`).
 *  - `indent: 1+` — indented entries with a `•` bullet.
 *
 * Items with a `url` render their label as a clickable link.
 * Items with a `value` render it in muted color after the label.
 */
export function ListOutput({ items }: ListOutputProps) {
  return (
    <ul className="list-none space-y-0.5">
      {items.map((item, idx) => {
        const indent = item.indent ?? 0;
        const isHeader = indent === 0 && !item.value && !item.url;

        return (
          <li
            key={idx}
            className="flex items-baseline gap-2"
            style={{ paddingLeft: `${indent * 1.5}rem` }}
          >
            {/* Bullet — only for non-header items */}
            {!isHeader && (
              <span className="text-[var(--muted)] select-none flex-shrink-0">•</span>
            )}

            {/* Label — link, header, or plain text */}
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline focus-visible:underline"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  isHeader
                    ? 'text-[var(--accent)] font-bold uppercase tracking-wider text-[0.85em]'
                    : 'text-[var(--fg)]',
                )}
              >
                {item.label}
              </span>
            )}

            {/* Value — secondary description in muted color */}
            {item.value && (
              <span className="text-[var(--muted)]">{item.value}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
