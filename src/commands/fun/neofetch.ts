import type { Command } from '@/types';
import { useThemeStore } from '@/store/themeStore';

const SESSION_START = Date.now();

function formatUptime(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

const LOGO_LINES = [
  '  .---------.  ',
  '  | >_      |  ',
  '  |         |  ',
  '  |  .--.   |  ',
  '  | /    \\  |  ',
  '  +---------+  ',
  '    |||  |||   ',
  '  ----------   ',
];

const LOGO_WIDTH = Math.max(...LOGO_LINES.map((l) => l.length));

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
    const fontDisplay = customFont ?? '(theme default)';

    const info: string[] = [
      handle,
      sep,
      `Name     : ${ctx.config.user.name}`,
      `Title    : ${ctx.config.user.title}`,
      `Location : ${ctx.config.user.location}`,
      `Theme    : ${currentTheme}`,
      `Font     : ${fontDisplay}`,
      `Uptime   : ${uptime}`,
      `Commands : ${commandCount}`,
    ];

    const lines = LOGO_LINES.map((logoLine, i) => {
      const logoCell = logoLine.padEnd(LOGO_WIDTH);
      const infoCell = info[i] ?? '';
      return `${logoCell}  ${infoCell}`;
    });

    return { type: 'text', content: lines.join('\n') };
  },
} satisfies Command;
