import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { applyTheme, applyFontSize, applyFontFamily } from '@/lib/themeManager';

/**
 * Synchronises Zustand theme/font state with CSS variables on <html>.
 *
 * Call exactly once, near the root of the component tree (AppShell or App).
 *
 * On mount: immediately applies the stored theme, font size, and any custom
 * font so the visual state matches the stored state before React paints.
 *
 * On store change: re-applies the affected variable(s) so the terminal
 * responds to `theme set`, `font set`, and `font size` commands without
 * requiring a page reload.
 *
 * Does NOT return anything — all work is a DOM side-effect.
 */
export function useTheme(): void {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const fontSize = useThemeStore((s) => s.fontSize);
  const customFont = useThemeStore((s) => s.customFont);

  // Reapply full theme whenever the active theme changes.
  // applyTheme also resets font variables — customFont effect below
  // runs after and re-applies any override.
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Apply/override font size separately (survives theme switches).
  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  // Apply or clear custom font override.
  useEffect(() => {
    applyFontFamily(customFont, currentTheme);
  }, [customFont, currentTheme]);
}
