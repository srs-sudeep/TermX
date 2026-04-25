import type { Command } from '@/types';

export default {
  name: 'hack',
  description: 'Engage maximum hacking protocols',
  usage: 'hack',
  category: 'fun',
  hidden: true,
  execute: () => ({ type: 'hack' }),
} satisfies Command;
