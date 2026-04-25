import type { Command } from '@/types';

export default {
  name: 'date',
  description: 'Show the current date and time',
  usage: 'date',
  category: 'core',
  execute: (ctx) => {
    const timezone = ctx.config.user.timezone;
    const now = new Date();

    let formatted: string;
    try {
      formatted = now.toLocaleString('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });
    } catch {
      // Fallback if timezone string is invalid
      formatted = now.toLocaleString();
    }

    return { type: 'text', content: formatted, tone: 'muted' };
  },
} satisfies Command;
