import type { Command } from '@/types';

export default {
  name: 'about',
  aliases: ['bio'],
  description: 'About me',
  usage: 'about',
  category: 'portfolio',
  execute: (ctx) => ({
    type: 'text',
    content: ctx.config.about.paragraphs.join('\n\n'),
  }),
} satisfies Command;
