import type { Command } from '@/types';

/** Sections a user can `cd` into — mirrors the portfolio command names. */
const VALID_SECTIONS = [
  'about',
  'projects',
  'skills',
  'experience',
  'education',
  'contact',
  'social',
];

export default {
  name: 'cd',
  description: 'Navigate to a portfolio section',
  usage: 'cd <section>',
  category: 'core',
  execute: (ctx) => {
    const section = ctx.args[0]?.toLowerCase();

    if (!section) {
      return {
        type: 'text',
        content: [
          'Sections:',
          VALID_SECTIONS.map((s) => `  ${s}`).join('\n'),
        ].join('\n'),
        tone: 'muted',
      };
    }

    if (!VALID_SECTIONS.includes(section)) {
      return {
        type: 'error',
        message: `cd: no such section: ${section}. Try: ${VALID_SECTIONS.join(', ')}`,
      };
    }

    // Dispatch runs the section command as a new history entry.
    ctx.dispatch(section);
    return { type: 'text', content: `→ ${section}`, tone: 'muted' };
  },
  autocomplete: (partial) => VALID_SECTIONS.filter((s) => s.startsWith(partial)),
} satisfies Command;
