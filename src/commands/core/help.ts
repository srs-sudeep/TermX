import type { Command, ListItem } from '@/types';
import { createRegistry } from '@/lib/commandRegistry';

/** Order in which categories are displayed. */
const CATEGORY_ORDER: Command['category'][] = [
  'core',
  'portfolio',
  'system',
  'fun',
  'custom',
];

export default {
  name: 'help',
  aliases: ['?'],
  description: 'Show available commands',
  usage: 'help',
  category: 'core',
  execute: () => {
    const registry = createRegistry();
    const all = registry.all().filter((c) => !c.hidden);

    // Group commands by category.
    const grouped = new Map<Command['category'], Command[]>();
    for (const cmd of all) {
      const bucket = grouped.get(cmd.category) ?? [];
      bucket.push(cmd);
      grouped.set(cmd.category, bucket);
    }

    const items: ListItem[] = [];

    for (const cat of CATEGORY_ORDER) {
      const cmds = grouped.get(cat);
      if (!cmds || cmds.length === 0) continue;

      // Category header — indent: 0, no value → renders as bold accent header
      items.push({ label: cat, indent: 0 });

      for (const cmd of cmds.sort((a, b) => a.name.localeCompare(b.name))) {
        const aliasNote =
          cmd.aliases && cmd.aliases.length > 0
            ? ` (alias: ${cmd.aliases.join(', ')})`
            : '';
        items.push({
          label: cmd.name,
          value: cmd.description + aliasNote,
          indent: 1,
        });
      }
    }

    if (items.length === 0) {
      return { type: 'text', content: 'No commands available.', tone: 'muted' };
    }

    return { type: 'list', items };
  },
} satisfies Command;
