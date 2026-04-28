import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { applyTheme, applyFontSize, applyFontFamily } from '@/lib/themeManager';

export function useTheme(): void {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const fontSize = useThemeStore((s) => s.fontSize);
  const customFont = useThemeStore((s) => s.customFont);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  useEffect(() => {
    applyFontFamily(customFont, currentTheme);
  }, [customFont, currentTheme]);
}
