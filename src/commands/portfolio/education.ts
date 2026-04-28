import type { Command, Education, Card } from '@/types';

function toCard(edu: Education): Card {
  return {
    title: edu.degree,
    subtitle: [edu.institution, `${edu.start} – ${edu.end}`].filter(Boolean).join(' · '),
    body: edu.details,
  };
}

export default {
  name: 'education',
  aliases: ['edu'],
  description: 'View my educational background',
  usage: 'education',
  category: 'portfolio',
  execute: (ctx) => {
    const { education } = ctx.config;
    if (education.length === 0) {
      return { type: 'text', content: 'No education configured.', tone: 'muted' };
    }
    return { type: 'cards', cards: education.map(toCard) };
  },
} satisfies Command;
