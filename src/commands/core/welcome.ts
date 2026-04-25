import type { Command } from '@/types';

/**
 * `welcome` — the hero / home screen of the terminal portfolio.
 *
 * Returns a `welcome` discriminant output. The renderer dispatches to
 * `<WelcomeScreen>` which composes the slanted name banner, a decorative
 * portrait, an introduction, version, and a pointer to the `help` command.
 *
 * Auto-dispatched on initial page load (see Terminal's startup effect).
 */
export default {
  name: 'welcome',
  aliases: ['hi', 'hello', 'home'],
  description: 'Display the hero / welcome screen',
  usage: 'welcome',
  category: 'core',
  execute: () => ({ type: 'welcome' }),
} satisfies Command;
