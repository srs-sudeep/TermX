import type { Command, Experience, Card } from '@/types';

function toCard(exp: Experience): Card {
  return {
    title: exp.role,
    subtitle: [exp.company, `${exp.start} – ${exp.end}`, exp.location].filter(Boolean).join(' · '),
    bullets: exp.bullets,
  };
}

export default {
  name: 'experience',
  aliases: ['exp'],
  description: 'View my work experience',
  usage: 'experience',
  category: 'portfolio',
  execute: (ctx) => {
    const { experience } = ctx.config;
    if (experience.length === 0) {
      return { type: 'text', content: 'No experience configured.', tone: 'muted' };
    }
    return { type: 'cards', cards: experience.map(toCard) };
  },
} satisfies Command;
