/**
 * themeManager.ts
 * Writes theme CSS variables to document.documentElement.
 *
 * This module is the single point that touches the DOM for theming.
 * It is framework-agnostic — no React imports.
 *
 * Usage:
 *  - Call applyTheme(name) on app init and whenever the stored theme changes.
 *  - Call applyFontSize(size) when the user changes font size.
 *  - Call applyFontFamily(family, themeName) when a custom font is set or cleared.
 *
 * The `useTheme` hook (src/hooks/useTheme.ts) calls these automatically
 * in response to Zustand store changes.
 *
 * See .claude/rules/themes.md for the full CSS variable contract.
 */

import { themes } from '@/config';
import { settings } from '@/config';
import type { FontSize } from '@/store/themeStore';

/** Maps font-size tokens to pixel values. */
const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: '12px',
  md: '14px',
  lg: '16px',
};

/**
 * Applies all CSS variables for a named theme to document.documentElement.
 *
 * Fallback chain:
 *  1. Requested theme by name.
 *  2. settings.defaultTheme.
 *  3. First theme in the themes array.
 *
 * Also writes --font-family, --font-size-base, --line-height-base from the theme.
 * Note: applyFontSize / applyFontFamily may override these after the fact.
 *
 * @param name - Theme name, e.g. 'dracula'.
 */
export function applyTheme(name: string): void {
  const theme =
    themes.find((t) => t.name === name) ??
    themes.find((t) => t.name === settings.defaultTheme) ??
    themes[0];

  if (!theme) return; // Defensive — themes array should never be empty.

  const el = document.documentElement;

  // ── Color variables ──────────────────────────────────────────────────────
  el.style.setProperty('--bg', theme.colors.bg);
  el.style.setProperty('--fg', theme.colors.fg);
  el.style.setProperty('--cursor', theme.colors.cursor);
  el.style.setProperty('--prompt', theme.colors.prompt);
  el.style.setProperty('--accent', theme.colors.accent);
  el.style.setProperty('--success', theme.colors.success);
  el.style.setProperty('--error', theme.colors.error);
  el.style.setProperty('--warning', theme.colors.warning);
  el.style.setProperty('--info', theme.colors.info);
  el.style.setProperty('--muted', theme.colors.muted);
  el.style.setProperty('--selection', theme.colors.selection);
  el.style.setProperty('--border', theme.colors.border);

  // ── Font variables ───────────────────────────────────────────────────────
  el.style.setProperty('--font-family', theme.font.family);
  el.style.setProperty('--font-size-base', theme.font.size);
  el.style.setProperty('--line-height-base', theme.font.lineHeight);

  // Mark active theme on <html> for any CSS attribute selectors.
  el.setAttribute('data-theme', theme.name);
}

/**
 * Overrides --font-size-base without touching any other theme variables.
 * Called when the user runs `font size <sm|md|lg>`.
 *
 * @param size - 'sm' (12 px) | 'md' (14 px) | 'lg' (16 px)
 */
export function applyFontSize(size: FontSize): void {
  document.documentElement.style.setProperty('--font-size-base', FONT_SIZE_MAP[size]);
}

/**
 * Overrides --font-family.
 *
 * Pass a CSS font-family string to set a custom font.
 * Pass null to restore the currently-active theme's built-in font.
 *
 * @param family    - CSS font-family string, or null to reset.
 * @param themeName - The currently active theme (used for reset lookup).
 */
export function applyFontFamily(family: string | null, themeName: string): void {
  if (family !== null) {
    document.documentElement.style.setProperty('--font-family', family);
  } else {
    const theme =
      themes.find((t) => t.name === themeName) ??
      themes.find((t) => t.name === settings.defaultTheme) ??
      themes[0];

    if (theme) {
      document.documentElement.style.setProperty('--font-family', theme.font.family);
    }
  }
}
