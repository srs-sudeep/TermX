/**
 * themeStore.ts
 * Zustand store for theme, font, font size, and feature-flag state.
 *
 * State is hydrated from localStorage on module load (synchronous) and
 * persisted back on every action. Falls back to settings.config.ts defaults
 * if nothing is stored.
 *
 * Storage keys (namespaced to 'termfolio:' by the storage adapter):
 *  - theme       → string  (theme name, e.g. 'dracula')
 *  - font        → string | null
 *  - fontSize    → 'sm' | 'md' | 'lg'
 *  - typewriter  → boolean
 *  - bootEnabled → boolean
 */

import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { settings } from '@/config';

/** Valid font size tokens. Maps to CSS variable values in themeManager. */
export type FontSize = 'sm' | 'md' | 'lg';

interface ThemeState {
  /** Name of the currently active theme. */
  currentTheme: string;
  /** Custom font-family override; null means "use the theme's font". */
  customFont: string | null;
  /** Current font size preference. */
  fontSize: FontSize;
  /** Whether text output animates character-by-character. */
  typewriter: boolean;
  /** Whether the boot sequence runs on first visit. */
  bootEnabled: boolean;

  setTheme: (name: string) => void;
  setFont: (font: string | null) => void;
  setFontSize: (size: FontSize) => void;
  setTypewriter: (enabled: boolean) => void;
  setBootEnabled: (enabled: boolean) => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  // ── Initial state — hydrated synchronously from localStorage ────────────
  currentTheme: storage.get<string>('theme', settings.defaultTheme),
  customFont: storage.get<string | null>('font', null),
  fontSize: storage.get<FontSize>('fontSize', settings.defaultFontSize as FontSize),
  typewriter: storage.get<boolean>('typewriter', settings.typewriter),
  bootEnabled: storage.get<boolean>('bootEnabled', settings.bootSequence),

  // ── Actions ─────────────────────────────────────────────────────────────

  setTheme: (name) => {
    storage.set('theme', name);
    set({ currentTheme: name });
  },

  setFont: (font) => {
    if (font === null) {
      storage.remove('font');
    } else {
      storage.set('font', font);
    }
    set({ customFont: font });
  },

  setFontSize: (size) => {
    storage.set('fontSize', size);
    set({ fontSize: size });
  },

  setTypewriter: (enabled) => {
    storage.set('typewriter', enabled);
    set({ typewriter: enabled });
  },

  setBootEnabled: (enabled) => {
    storage.set('bootEnabled', enabled);
    set({ bootEnabled: enabled });
  },
}));
