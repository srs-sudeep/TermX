import { useState } from 'react';
import { useThemeStore, type FontSize } from '@/store/themeStore';
import { applyTheme, applyFontFamily, applyFontSize } from '@/lib/themeManager';
import { ThemePicker } from './ThemePicker';
import { cn } from '@/lib/cn';

interface SettingsPanelProps {
  /**
   * Provide this callback to render the panel as a modal overlay.
   * Omit to render it inline inside terminal output.
   */
  onClose?: () => void;
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

/** Accessible ON/OFF toggle row used in the Features section. */
function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm text-[var(--fg)] truncate">{label}</div>
        <div className="text-xs text-[var(--muted)] truncate">{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'flex-shrink-0 px-2 py-0.5 text-xs border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]',
          checked
            ? 'border-[var(--success)] text-[var(--success)]'
            : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]',
        )}
      >
        {checked ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}

/**
 * Full settings panel with theme, font, and feature toggles.
 *
 * Rendered in two contexts:
 *  - Inline: from the `settings` command (`{ type: 'settings-panel' }` output).
 *    No `onClose` prop — renders directly in the terminal history.
 *  - Modal: from the gear button in `<TitleBar />`.
 *    `onClose` is provided — renders a fixed overlay with a backdrop.
 */
export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const {
    currentTheme,
    fontSize,
    customFont,
    typewriter,
    bootEnabled,
    setTheme,
    setFontSize,
    setFont,
    setTypewriter,
    setBootEnabled,
  } = useThemeStore();

  const [fontInput, setFontInput] = useState(customFont ?? '');

  const handleThemeSelect = (name: string) => {
    setTheme(name);
    applyTheme(name);
  };

  const handleFontSizeSelect = (size: FontSize) => {
    setFontSize(size);
    applyFontSize(size);
  };

  const handleFontApply = () => {
    const family = fontInput.trim() || null;
    setFont(family);
    applyFontFamily(family, currentTheme);
  };

  const handleFontReset = () => {
    setFontInput('');
    setFont(null);
    applyFontFamily(null, currentTheme);
  };

  const content = (
    <div className="font-mono text-[var(--fg)] space-y-5 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[var(--accent)] font-bold tracking-wider text-xs uppercase">
          Settings
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--fg)] transition-colors text-base leading-none"
            aria-label="Close settings"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Theme ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="settings-theme-heading">
        <h3
          id="settings-theme-heading"
          className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2"
        >
          Theme
        </h3>
        <ThemePicker currentTheme={currentTheme} onSelect={handleThemeSelect} />
        <p className="text-[var(--muted)] text-xs mt-2">
          Active: <span className="text-[var(--fg)]">{currentTheme}</span>
          {' '}— or type <span className="text-[var(--accent)]">theme list</span>
        </p>
      </section>

      {/* ── Font ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="settings-font-heading">
        <h3
          id="settings-font-heading"
          className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2"
        >
          Font
        </h3>

        {/* Font family */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={fontInput}
            onChange={(e) => setFontInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFontApply();
            }}
            placeholder="(theme default)"
            aria-label="Custom font family"
            className={cn(
              'flex-1 min-w-0 bg-transparent border border-[var(--border)] px-2 py-1',
              'text-xs text-[var(--fg)] placeholder:text-[var(--muted)]',
              'outline-none focus:border-[var(--accent)] transition-colors',
            )}
          />
          <button
            onClick={handleFontApply}
            className="px-2 py-1 text-xs border border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)] transition-colors"
          >
            Apply
          </button>
          {customFont && (
            <button
              onClick={handleFontReset}
              className="px-2 py-1 text-xs border border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)] transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Font size */}
        <div className="flex gap-2 items-center" role="group" aria-label="Font size">
          {(['sm', 'md', 'lg'] as FontSize[]).map((s) => (
            <button
              key={s}
              aria-pressed={fontSize === s}
              onClick={() => handleFontSizeSelect(s)}
              className={cn(
                'px-3 py-1 text-xs border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]',
                fontSize === s
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]',
              )}
            >
              {s}
            </button>
          ))}
          <span className="text-[var(--muted)] text-xs">
            ({fontSize === 'sm' ? '12px' : fontSize === 'md' ? '14px' : '16px'})
          </span>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section aria-labelledby="settings-features-heading">
        <h3
          id="settings-features-heading"
          className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2"
        >
          Features
        </h3>
        <div className="space-y-3">
          <ToggleRow
            label="Boot sequence"
            description="Animated startup on first visit"
            checked={bootEnabled}
            onChange={setBootEnabled}
          />
          <ToggleRow
            label="Typewriter"
            description="Animate text output character-by-character"
            checked={typewriter}
            onChange={setTypewriter}
          />
        </div>
      </section>

      {/* ── Danger zone ────────────────────────────────────────────────── */}
      <section aria-labelledby="settings-danger-heading">
        <h3
          id="settings-danger-heading"
          className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2"
        >
          Danger Zone
        </h3>
        <p className="text-[var(--muted)] text-xs">
          Type{' '}
          <span className="text-[var(--fg)]">reset --confirm</span>{' '}
          to clear all saved preferences and reload.
        </p>
      </section>
    </div>
  );

  // ── Inline mode (from `settings` command) ─────────────────────────────────
  if (!onClose) {
    return (
      <div className="border border-[var(--border)] p-4 max-w-lg">
        {content}
      </div>
    );
  }

  // ── Modal mode (from gear button) ─────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className="relative bg-[var(--bg)] border border-[var(--border)] p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
        {content}
      </div>
    </div>
  );
}
