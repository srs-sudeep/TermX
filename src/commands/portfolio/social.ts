import type { Command, ListItem } from '@/types';

export default {
  name: 'social',
  description: 'My social links and profiles',
  usage: 'social [name]',
  category: 'portfolio',
  execute: (ctx) => {
    const { social } = ctx.config;
    const name = ctx.args[0]?.toLowerCase();

    if (name) {
      const link = social.find((s) => s.name.toLowerCase() === name);
      if (!link) {
        return {
          type: 'error',
          message: `Profile not found: ${name}. Try: ${social.map((s) => s.name.toLowerCase()).join(', ')}`,
        };
      }
      return {
        type: 'redirect',
        url: link.url,
        newTab: true,
      };
    }

    const items: ListItem[] = social.map((s) => ({
      label: s.name,
      value: s.handle,
      url: s.url,
      indent: 1,
    }));

    return { type: 'list', items };
  },
  autocomplete: (partial, ctx) =>
    ctx.config.social
      .map((s) => s.name.toLowerCase())
      .filter((n) => n.startsWith(partial)),
} satisfies Command;
