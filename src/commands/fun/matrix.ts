import type { Command } from '@/types';

export default {
  name: 'matrix',
  description: 'Enter the Matrix (press Esc to exit)',
  usage: 'matrix',
  category: 'fun',
  hidden: true,
  execute: () => ({ type: 'matrix' }),
} satisfies Command;
