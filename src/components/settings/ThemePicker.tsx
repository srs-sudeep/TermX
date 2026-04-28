import { themes } from '@/config';
import { cn } from '@/lib/cn';

interface ThemePickerProps {
  currentTheme: string;
  onSelect: (name: string) => void;
}

export function ThemePicker({ currentTheme, onSelect }: ThemePickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2 mt-2" role="radiogroup" aria-label="Theme selection">
      {themes.map((theme) => {
        const isActive = theme.name === currentTheme;
        return (
          <button
            key={theme.name}
            role="radio"
            aria-checked={isActive}
            aria-label={`${theme.label}${theme.experimental ? ' (experimental)' : ''}${isActive ? ' – active' : ''}`}
            title={theme.label}
            onClick={() => onSelect(theme.name)}
            className={cn(
              'relative h-10 rounded border-2 overflow-hidden transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
              isActive ? 'border-[var(--accent)]' : 'border-transparent hover:border-[var(--muted)]',
            )}
            style={{ backgroundColor: theme.colors.bg }}
          >
            { }
            <span className="absolute inset-0 flex items-center justify-center gap-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: theme.colors.prompt }}
              />
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: theme.colors.error }}
              />
            </span>
            { }
            {isActive && (
              <span
                className="absolute top-0.5 right-0.5 text-[8px] leading-none px-0.5 rounded"
                style={{ backgroundColor: theme.colors.accent, color: theme.colors.bg }}
                aria-hidden="true"
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
