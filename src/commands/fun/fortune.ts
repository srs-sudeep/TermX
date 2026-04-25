import type { Command } from '@/types';

export default {
  name: 'fortune',
  description: 'Display a random fortune cookie message',
  usage: 'fortune',
  category: 'fun',
  execute: (ctx) => {
    const fortunes = ctx.config.fortunes;
    if (!fortunes || fortunes.length === 0) {
      return {
        type: 'text',
        content: 'No fortunes configured. Add some to user.config.ts → fortunes.',
        tone: 'muted',
      };
    }
    const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
    return { type: 'text', content: `"${pick}"`, tone: 'normal' };
  },
} satisfies Command;
