import type { Command, ListItem } from '@/types';
import { themes } from '@/config';
import { applyTheme } from '@/lib/themeManager';

let previewTimer: ReturnType<typeof setTimeout> | null = null;

export default {
  name: 'theme',
  description: 'Manage terminal themes',
  usage: 'theme [list | set <name> | preview <name>]',
  category: 'system',
  execute: (ctx) => {
    const sub = ctx.args[0]?.toLowerCase();

    if (!sub || sub === 'list') {
      const items: ListItem[] = themes.map((t) => ({
        label: t.name === ctx.theme.current ? `${t.name} ✓` : t.name,
        value: `${t.label}${t.experimental ? ' (experimental)' : ''}`,
        indent: 1,
      }));
      items.unshift({ label: 'Themes', indent: 0 });
      items.push(
        { label: '', indent: 0 },
        { label: 'Usage', indent: 0 },
        { label: 'theme set <name>', value: '— switch and persist', indent: 1 },
        { label: 'theme preview <name>', value: '— preview for 10 seconds', indent: 1 },
      );
      return { type: 'list', items };
    }

    if (sub === 'set') {
      const name = ctx.args[1];
      if (!name) return { type: 'error', message: 'Usage: theme set <name>' };

      const theme = themes.find((t) => t.name === name);
      if (!theme) {
        return {
          type: 'error',
          message: `Theme not found: ${name}. Run "theme list" to see available themes.`,
        };
      }

      if (previewTimer) {
        clearTimeout(previewTimer);
        previewTimer = null;
      }

      ctx.theme.set(name);
      applyTheme(name);

      return {
        type: 'text',
        content: `Theme set to "${theme.label}".`,
        tone: 'success',
      };
    }

    if (sub === 'preview') {
      const name = ctx.args[1];
      if (!name) return { type: 'error', message: 'Usage: theme preview <name>' };

      const theme = themes.find((t) => t.name === name);
      if (!theme) {
        return {
          type: 'error',
          message: `Theme not found: ${name}. Run "theme list" to see available themes.`,
        };
      }

      if (previewTimer) clearTimeout(previewTimer);

      applyTheme(name);

      const revertTo = ctx.theme.current;
      previewTimer = setTimeout(() => {
        applyTheme(revertTo);
        previewTimer = null;
      }, 10_000);

      return {
        type: 'text',
        content: `Previewing "${theme.label}" — reverts in 10 s. Run "theme set ${name}" to keep it.`,
        tone: 'muted',
      };
    }

    return {
      type: 'error',
      message: `Unknown subcommand: ${sub}. Usage: theme [list | set <name> | preview <name>]`,
    };
  },
  autocomplete: (partial, ctx) => {
    const parts = ctx.raw.trim().split(/\s+/);
    if (parts.length <= 1) return ['list', 'set', 'preview'];
    if (parts.length === 2 && (parts[1] === 'set' || parts[1] === 'preview')) {
      return themes.map((t) => t.name).filter((n) => n.startsWith(partial));
    }
    return themes.map((t) => t.name).filter((n) => n.startsWith(partial));
  },
} satisfies Command;
