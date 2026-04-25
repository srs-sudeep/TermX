import type { Command } from '@/types';

export default {
  name: 'resume',
  aliases: ['cv'],
  description: 'Download my résumé',
  usage: 'resume',
  category: 'portfolio',
  execute: (ctx) => ({
    type: 'download',
    url: ctx.config.resumeUrl,
    filename: 'resume.pdf',
  }),
} satisfies Command;
