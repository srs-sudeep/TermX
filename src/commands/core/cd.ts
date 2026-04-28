import type { Command } from '@/types';

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
        content: ['Sections:', VALID_SECTIONS.map((s) => `  ${s}`).join('\n')].join('\n'),
        tone: 'muted',
      };
    }

    if (!VALID_SECTIONS.includes(section)) {
      return {
        type: 'error',
        message: `cd: no such section: ${section}. Try: ${VALID_SECTIONS.join(', ')}`,
      };
    }

    ctx.dispatch(section);
    return { type: 'text', content: `→ ${section}`, tone: 'muted' };
  },
  autocomplete: (partial, _ctx) => VALID_SECTIONS.filter((s) => s.startsWith(partial)),
} satisfies Command;
