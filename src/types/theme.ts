/**
 * theme.ts
 * Types for the theme system.
 *
 * A theme is a named set of CSS variable values. `themeManager.applyTheme()`
 * writes them to `document.documentElement`; Tailwind classes in components
 * reference them via `bg-[var(--bg)]`.
 *
 * Rules:
 *  - The `ThemeColors` interface is the single source of truth for which CSS
 *    variables exist. Adding or removing a field here requires updating
 *    EVERY existing theme and `src/styles/themes.css` simultaneously.
 *  - See .claude/rules/themes.md for the full contract.
 */

// ── ThemeColors ────────────────────────────────────────────────────────────

/**
 * The complete set of CSS variables a theme must define.
 * Every field is required — no partial themes.
 *
 * Variable mapping:
 *  `bg`        → `--bg`        Terminal background
 *  `fg`        → `--fg`        Default foreground text
 *  `cursor`    → `--cursor`    Blinking cursor block
 *  `prompt`    → `--prompt`    Prompt text (user@host$)
 *  `accent`    → `--accent`    Brand / highlight color
 *  `success`   → `--success`   Success-toned output
 *  `error`     → `--error`     Error output
 *  `warning`   → `--warning`   Warning output
 *  `info`      → `--info`      Info / neutral highlight
 *  `muted`     → `--muted`     Secondary / dim text
 *  `selection` → `--selection` Text selection background
 *  `border`    → `--border`    Dividers and card outlines
 */
export interface ThemeColors {
  /** Terminal background color. Contrast against `fg` must be ≥ 7:1 (AAA). */
  bg: string;
  /** Default foreground / body text. */
  fg: string;
  /** Blinking cursor block color (usually matches `fg`). */
  cursor: string;
  /** Prompt text — the `user@host:path$` segment. */
  prompt: string;
  /** Accent / brand highlight used for links, focused elements, and tags. */
  accent: string;
  /** Success-toned text (positive command output). Contrast ≥ 4.5:1. */
  success: string;
  /** Error text. Contrast ≥ 4.5:1. Also used by `<ErrorOutput>`. */
  error: string;
  /** Warning text. Contrast ≥ 4.5:1. */
  warning: string;
  /** Info / neutral highlight text. Contrast ≥ 4.5:1. */
  info: string;
  /** Muted / secondary text (labels, timestamps, disabled). Contrast ≥ 4.5:1. */
  muted: string;
  /** Background color for text selection. */
  selection: string;
  /** Dividers, card borders, table separators. */
  border: string;
}

// ── ThemeFont ──────────────────────────────────────────────────────────────

/**
 * Font settings bundled with each theme.
 * Applied as CSS variables `--font-family`, `--font-size-base`, `--line-height-base`.
 */
export interface ThemeFont {
  /**
   * CSS `font-family` value. Ship fonts locally — no CDN.
   * @example '"JetBrains Mono", "Fira Code", monospace'
   */
  family: string;
  /**
   * Base font size as a CSS value.
   * All other text sizes scale relative to this using `em`.
   * @example '14px'
   */
  size: string;
  /**
   * CSS `line-height` value.
   * @example '1.6'
   */
  lineHeight: string;
}

// ── Theme ──────────────────────────────────────────────────────────────────

/**
 * A complete theme definition as stored in `src/config/themes.config.ts`.
 *
 * @example
 * {
 *   name: 'dracula',
 *   label: 'Dracula',
 *   mode: 'dark',
 *   colors: { bg: '#282a36', fg: '#f8f8f2', ... },
 *   font: { family: '"JetBrains Mono", monospace', size: '14px', lineHeight: '1.6' },
 * }
 */
export interface Theme {
  /**
   * Machine-readable identifier. Used as the CLI argument to `theme set`.
   * Must be unique, lowercase, hyphen-separated.
   */
  name: string;
  /** Human-readable label shown in `theme` list output and the Settings panel. */
  label: string;
  /**
   * Light or dark mode. Used to match `prefers-color-scheme` on first visit
   * and to set appropriate defaults in the Settings panel.
   */
  mode: 'light' | 'dark';
  /** Complete color palette. All 12 fields are required. */
  colors: ThemeColors;
  /** Font settings bundled with this theme. */
  font: ThemeFont;
  /**
   * Mark as experimental when a theme cannot meet WCAG AA contrast ratios
   * (e.g. artistic themes like `matrix` or `retro`).
   * Experimental themes are excluded from default-theme candidates.
   */
  experimental?: boolean;
}
