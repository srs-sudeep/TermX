import type { Command, Project, Card } from '@/types';

function toCard(p: Project): Card {
  return {
    title: p.name,
    subtitle: p.tagline,
    body: p.description,
    tags: p.tech,
    links: Object.entries(p.links)
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => ({ label: k, url: v as string })),
  };
}

export default {
  name: 'projects',
  aliases: ['work'],
  description: 'Browse my projects',
  usage: 'projects [slug] [--featured] [--year=YYYY]',
  category: 'portfolio',
  execute: (ctx) => {
    const { args, flags, config } = ctx;
    let list = config.projects;

    if (flags.featured) {
      list = list.filter((p) => p.featured);
    }
    if (flags.year) {
      list = list.filter((p) => String(p.year) === String(flags.year));
    }

    if (args[0]) {
      const found = list.find((p) => p.slug === args[0]);
      if (!found) {
        return { type: 'error', message: `Project not found: ${args[0]}` };
      }
      return { type: 'cards', cards: [toCard(found)] };
    }

    if (list.length === 0) {
      return { type: 'text', content: 'No matching projects.', tone: 'muted' };
    }

    return { type: 'cards', cards: list.map(toCard) };
  },
  autocomplete: (partial, ctx) =>
    ctx.config.projects
      .map((p) => p.slug)
      .filter((s) => s.startsWith(partial)),
} satisfies Command;
