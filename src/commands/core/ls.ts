import type { Command } from '@/types';

/**
 * `ls` — list the portfolio "directory".
 *
 * Gives the site a file-system feel. Each section is shown as a file or
 * directory. Typing `cat about.txt` or `cd about` navigates to the section.
 */
export default {
  name: 'ls',
  description: 'List portfolio sections',
  usage: 'ls',
  category: 'core',
  execute: () => {
    const entries = [
      { name: 'about.txt',      description: 'Who I am' },
      { name: 'projects/',      description: 'My work' },
      { name: 'skills.txt',     description: 'Technical skills' },
      { name: 'experience/',    description: 'Work history' },
      { name: 'education.txt',  description: 'Where I studied' },
      { name: 'contact.txt',    description: 'Get in touch' },
      { name: 'social.txt',     description: 'Links & profiles' },
      { name: 'resume.pdf',     description: 'Download my résumé' },
    ];

    const nameWidth = Math.max(...entries.map((e) => e.name.length));
    const content = entries
      .map((e) => `  ${e.name.padEnd(nameWidth + 2)} ${e.description}`)
      .join('\n');

    return { type: 'text', content, tone: 'normal' };
  },
} satisfies Command;
