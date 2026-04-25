import type { Command } from '@/types';

export default {
  name: 'banner',
  description: "Display the large ASCII banner of the owner's name",
  usage: 'banner',
  category: 'fun',
  hidden: true,
  execute: () => ({ type: 'banner' }),
} satisfies Command;
