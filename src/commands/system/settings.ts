import type { Command } from '@/types';

export default {
  name: 'settings',
  description: 'Open the settings panel',
  usage: 'settings',
  category: 'system',
  execute: () => ({ type: 'settings-panel' }),
} satisfies Command;
