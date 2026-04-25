import type { Command } from '@/types';

export default {
  name: 'echo',
  description: 'Print text to the terminal',
  usage: 'echo <text>',
  category: 'core',
  execute: (ctx) => {
    // Reconstruct the output from args (flags are intentionally ignored).
    const content = ctx.args.join(' ');
    return { type: 'text', content: content || '' };
  },
} satisfies Command;
