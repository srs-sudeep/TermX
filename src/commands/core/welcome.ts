import type { Command } from '@/types';

export default {
  name: 'welcome',
  aliases: ['hi', 'hello', 'home'],
  description: 'Display the hero / welcome screen',
  usage: 'welcome',
  category: 'core',
  execute: () => ({ type: 'welcome' }),
} satisfies Command;
