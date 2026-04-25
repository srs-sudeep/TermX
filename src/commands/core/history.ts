import type { Command } from '@/types';

export default {
  name: 'history',
  description: 'Show command history',
  usage: 'history',
  category: 'core',
  execute: (ctx) => {
    const cmds = ctx.history.all();
    if (cmds.length === 0) {
      return { type: 'text', content: 'No command history.', tone: 'muted' };
    }

    // Render oldest-to-newest with line numbers (1-based).
    const content = cmds
      .map((cmd, idx) => `  ${String(idx + 1).padStart(3)}  ${cmd}`)
      .join('\n');

    return { type: 'text', content, tone: 'muted' };
  },
} satisfies Command;
