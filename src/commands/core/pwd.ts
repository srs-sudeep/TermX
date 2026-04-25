import type { Command } from '@/types';

export default {
  name: 'pwd',
  description: 'Print the current working directory',
  usage: 'pwd',
  category: 'core',
  execute: (ctx) => ({
    type: 'text',
    content: ctx.config.prompt.path,
    tone: 'muted',
  }),
} satisfies Command;
