import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { settings } from '@/config';

export type FontSize = 'sm' | 'md' | 'lg';

interface ThemeState {
  currentTheme: string;

  customFont: string | null;

  fontSize: FontSize;

  typewriter: boolean;

  bootEnabled: boolean;

  setTheme: (name: string) => void;
  setFont: (font: string | null) => void;
  setFontSize: (size: FontSize) => void;
  setTypewriter: (enabled: boolean) => void;
  setBootEnabled: (enabled: boolean) => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  currentTheme: storage.get<string>('theme', settings.defaultTheme),
  customFont: storage.get<string | null>('font', null),
  fontSize: storage.get<FontSize>('fontSize', settings.defaultFontSize as FontSize),
  typewriter: storage.get<boolean>('typewriter', settings.typewriter),
  bootEnabled: storage.get<boolean>('bootEnabled', settings.bootSequence),

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
