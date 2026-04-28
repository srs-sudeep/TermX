import type { Command } from '@/types';
import { STORAGE_NAMESPACE } from '@/lib/storage';

export default {
  name: 'reset',
  description: 'Reset all settings to defaults and reload',
  usage: 'reset [--confirm]',
  category: 'system',
  execute: (ctx) => {
    if (!ctx.flags.confirm) {
      return {
        type: 'text',
        content: [
          'This will clear all stored preferences (theme, font, history).',
          'The page will reload to factory defaults.',
          '',
          'To proceed, run:  reset --confirm',
        ].join('\n'),
        tone: 'warning',
      };
    }

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_NAMESPACE)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      
    }

    setTimeout(() => window.location.reload(), 800);

    return {
      type: 'text',
      content: 'Settings cleared. Reloading…',
      tone: 'muted',
    };
  },
} satisfies Command;
