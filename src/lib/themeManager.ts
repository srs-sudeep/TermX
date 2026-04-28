 

import { themes } from '@/config';
import { settings } from '@/config';
import type { FontSize } from '@/store/themeStore';

const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: '12px',
  md: '14px',
  lg: '16px',
};

export function applyTheme(name: string): void {
  const theme =
    themes.find((t) => t.name === name) ??
    themes.find((t) => t.name === settings.defaultTheme) ??
    themes[0];

  if (!theme) return; 

  const el = document.documentElement;

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

  el.style.setProperty('--font-family', theme.font.family);
  el.style.setProperty('--font-size-base', theme.font.size);
  el.style.setProperty('--line-height-base', theme.font.lineHeight);

  el.setAttribute('data-theme', theme.name);
}

export function applyFontSize(size: FontSize): void {
  document.documentElement.style.setProperty('--font-size-base', FONT_SIZE_MAP[size]);
}

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
