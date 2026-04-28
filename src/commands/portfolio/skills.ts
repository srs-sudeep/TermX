import type { Command } from '@/types';

function levelBar(level: number | undefined): string {
  if (!level) return '';
  const filled = Math.min(5, Math.max(1, level));
  return '█'.repeat(filled) + '░'.repeat(5 - filled);
}

export default {
  name: 'skills',
  description: 'View my technical skills',
  usage: 'skills',
  category: 'portfolio',
  execute: (ctx) => {
    const headers = ['Category', 'Skill', 'Level'];
    const rows: string[][] = [];

    for (const category of ctx.config.skills) {
      for (const skill of category.items) {
        rows.push([
          category.name,
          skill.name,
          levelBar(skill.level),
        ]);
      }
    }

    if (rows.length === 0) {
      return { type: 'text', content: 'No skills configured.', tone: 'muted' };
    }

    return { type: 'table', headers, rows };
  },
} satisfies Command;
