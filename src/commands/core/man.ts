import type { Command } from '@/types';
import { createRegistry } from '@/lib/commandRegistry';

export default {
  name: 'man',
  description: 'Show the manual page for a command',
  usage: 'man <command>',
  category: 'core',
  hidden: true, // Callable but not shown in help. Tab-completable.
  execute: (ctx) => {
    const name = ctx.args[0];
    if (!name) {
      return { type: 'error', message: 'Usage: man <command>' };
    }

    const registry = createRegistry();
    const cmd = registry.resolve(name);
    if (!cmd) {
      return { type: 'error', message: `No manual entry for: ${name}` };
    }

    const lines: string[] = [
      `NAME`,
      `    ${cmd.name}`,
      '',
      `DESCRIPTION`,
      `    ${cmd.description}`,
    ];

    if (cmd.usage) {
      lines.push('', `USAGE`, `    ${cmd.usage}`);
    }

    if (cmd.aliases && cmd.aliases.length > 0) {
      lines.push('', `ALIASES`, `    ${cmd.aliases.join(', ')}`);
    }

    return { type: 'text', content: lines.join('\n'), tone: 'muted' };
  },
  autocomplete: (partial, _ctx) => {
    void _ctx;
    const registry = createRegistry();
    return registry.complete(partial);
  },
} satisfies Command;
