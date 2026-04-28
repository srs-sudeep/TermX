import type { Command, ListItem } from '@/types';
import { createRegistry } from '@/lib/commandRegistry';

export default {
  name: 'help',
  aliases: ['?', 'commands'],
  description: 'List available commands',
  usage: 'help',
  category: 'core',
  execute: (_ctx) => {
    void _ctx;
    const registry = createRegistry();
    const all = registry
      .all()
      .filter((c) => !c.hidden)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (all.length === 0) {
      return { type: 'text', content: 'No commands available.', tone: 'muted' };
    }

    const items: ListItem[] = all.map((cmd: Command) => {
      const aliasNote =
        cmd.aliases && cmd.aliases.length > 0 ? ` (alias: ${cmd.aliases.join(', ')})` : '';
      return {
        label: cmd.name,
        value: cmd.description + aliasNote,
        indent: 1,
      };
    });

    items.push(
      { label: '', indent: 0 },
      {
        label: 'Tab',
        value: '=> autocomplete the current command',
        indent: 1,
      },
      {
        label: 'Up / Down',
        value: '=> navigate command history',
        indent: 1,
      },
      {
        label: 'Ctrl + l',
        value: '=> clear the terminal',
        indent: 1,
      },
      {
        label: 'Ctrl + c',
        value: '=> cancel the current input',
        indent: 1,
      },
    );

    return { type: 'list', items };
  },
} satisfies Command;
