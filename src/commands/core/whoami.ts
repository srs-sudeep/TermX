import type { Command } from '@/types';

export default {
  name: 'whoami',
  description: 'About the person behind this terminal',
  usage: 'whoami',
  category: 'core',
  execute: (ctx) => {
    const { name, title, location, bio } = ctx.config.user;
    const content = [`${name}`, `${title} · ${location}`, '', bio].join('\n');
    return { type: 'text', content };
  },
} satisfies Command;
