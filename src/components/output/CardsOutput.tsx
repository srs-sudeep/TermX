import type { Card } from '@/types';

interface CardsOutputProps {
  cards: Card[];
}

/**
 * Renders one or more cards — used by `projects`, `experience`, `education`.
 *
 * Card anatomy:
 *  - title       — bold, accent color
 *  - subtitle    — muted, single line
 *  - body        — fg color prose
 *  - bullets     — bulleted list inside the card
 *  - tags        — small pill badges (tech stack, etc.)
 *  - links       — inline text links at the bottom
 */
export function CardsOutput({ cards }: CardsOutputProps) {
  return (
    <div className="space-y-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="border-l-2 border-[var(--border)] pl-4 space-y-1"
        >
          {/* Title */}
          <p className="text-[var(--accent)] font-bold">{card.title}</p>

          {/* Subtitle */}
          {card.subtitle && (
            <p className="text-[var(--muted)] text-[0.9em]">{card.subtitle}</p>
          )}

          {/* Body prose */}
          {card.body && (
            <p className="text-[var(--fg)] whitespace-pre-wrap">{card.body}</p>
          )}

          {/* Bullet list */}
          {card.bullets && card.bullets.length > 0 && (
            <ul className="list-none space-y-0.5 mt-1">
              {card.bullets.map((b, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2 text-[var(--fg)]">
                  <span className="text-[var(--muted)] select-none flex-shrink-0 mt-px">
                    •
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-[0.8em] border border-[var(--border)] text-[var(--info)] rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          {card.links && card.links.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-1">
              {card.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] text-[0.9em] hover:underline focus-visible:underline"
                >
                  ↗ {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
