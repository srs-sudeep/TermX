import type { Command } from '@/types';

const COFFEE_ART = `
    ) )
   ( (
  .-'-.
  |   |]
  |   |
  '---'`.trimStart();

export default {
  name: 'coffee',
  description: 'Brew a hot cup of code fuel',
  usage: 'coffee',
  category: 'fun',
  execute: () => ({
    type: 'text',
    content: `${COFFEE_ART}\n\n418 I'm a teapot\n\nError: cannot brew coffee. This is a teapot.`,
    tone: 'warning',
  }),
} satisfies Command;
