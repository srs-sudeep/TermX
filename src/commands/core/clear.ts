import type { Command } from '@/types';

export default {
  name: 'clear',
  aliases: ['cls', 'clr'],
  description: 'Clear the terminal screen',
  usage: 'clear',
  category: 'core',
  execute: () => ({ type: 'clear' }),
} satisfies Command;
