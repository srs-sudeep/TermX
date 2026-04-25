import type { Command } from '@/types';

export default {
  name: 'email',
  description: 'Open my email in your mail client',
  usage: 'email',
  category: 'portfolio',
  execute: (ctx) => ({
    type: 'redirect',
    url: `mailto:${ctx.config.contact.email}`,
    newTab: false, // mailto: doesn't navigate; false uses window.location.href
  }),
} satisfies Command;
