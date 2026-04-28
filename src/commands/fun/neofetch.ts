import { useThemeStore } from '@/store/themeStore';
import type { Command } from '@/types';
import { createElement as h } from 'react';

const SESSION_START = Date.now();

function formatUptime(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

const LOGO = [
  '  ╔══════════════╗  ',
  '  ║  >_          ║  ',
  '  ║              ║  ',
  '  ║  ██████      ║  ',
  '  ║  ██████      ║  ',
  '  ║  ██          ║  ',
  '  ╚══════════════╝  ',
  '       ║    ║       ',
  '  ═════╩════╩═════  ',
];

const SWATCHES: Array<[string, string]> = [
  ['--bg', 'bg'],
  ['--error', 'error'],
  ['--warning', 'warning'],
  ['--success', 'success'],
  ['--info', 'info'],
  ['--accent', 'accent'],
  ['--prompt', 'prompt'],
  ['--fg', 'fg'],
];

export default {
  name: 'neofetch',
  description: 'Display system information in the style of neofetch',
  usage: 'neofetch',
  category: 'fun',
  execute: (ctx) => {
    const { customFont, currentTheme } = useThemeStore.getState();

    const handle = `${ctx.config.prompt.user}@${ctx.config.prompt.host}`;
    const sep = '─'.repeat(handle.length);
    const uptime = formatUptime(Date.now() - SESSION_START);
    const commandCount = ctx.history.all().length;
    const fontDisplay = customFont ?? 'JetBrains Mono';

    const rows: Array<{ label: string; value: string } | { sep: string }> = [
      { label: handle, value: '' },
      { sep },
      { label: 'OS', value: 'TermX — Web Terminal' },
      { label: 'Name', value: ctx.config.user.name },
      { label: 'Title', value: ctx.config.user.title },
      { label: 'Location', value: ctx.config.user.location },
      { label: 'Theme', value: currentTheme },
      { label: 'Font', value: fontDisplay },
      { label: 'Uptime', value: uptime },
      { label: 'Commands', value: `${commandCount}` },
    ];

    const infoCol = h(
      'div',
      { className: 'flex flex-col justify-center gap-0.5' },
      ...rows.map((row, i) => {
        if ('sep' in row) {
          return h('div', { key: i, className: 'text-[var(--muted)]' }, row.sep);
        }
        if (!row.value) {
          return h('div', { key: i, className: 'text-[var(--accent)] font-bold' }, row.label);
        }
        return h(
          'div',
          { key: i, className: 'flex gap-2' },
          h('span', { className: 'text-[var(--info)] w-[9ch]' }, row.label + ':'),
          h('span', { className: 'text-[var(--fg)]' }, row.value),
        );
      }),
    );

    const swatchRow = h(
      'div',
      { className: 'mt-3 flex gap-1 items-center' },
      ...SWATCHES.map(([cssVar, name]) =>
        h('span', {
          key: cssVar,
          title: name,
          style: { backgroundColor: `var(${cssVar})`, border: '1px solid var(--border)' },
          className: 'inline-block w-6 h-5 rounded-sm',
        }),
      ),
      h('span', { className: 'ml-2 text-[var(--muted)] text-xs' }, '← color palette'),
    );

    const element = h(
      'div',
      { className: 'font-mono text-sm leading-relaxed' },
      h(
        'div',
        { className: 'flex gap-6 items-start' },
        h(
          'pre',
          { className: 'text-[var(--accent)] flex-shrink-0 leading-tight' },
          LOGO.join('\n'),
        ),
        infoCol,
      ),
      swatchRow,
    );

    return { type: 'jsx' as const, element };
  },
} satisfies Command;
