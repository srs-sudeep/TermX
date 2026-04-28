import type { Command } from '@/types';
import { applyFontSize, applyFontFamily } from '@/lib/themeManager';
import type { FontSize } from '@/store/themeStore';
import { useThemeStore } from '@/store/themeStore';

const VALID_SIZES: FontSize[] = ['sm', 'md', 'lg'];
const SIZE_LABELS: Record<FontSize, string> = {
  sm: '12 px',
  md: '14 px',
  lg: '16 px',
};

export default {
  name: 'font',
  description: 'Manage the terminal font',
  usage: 'font [set <family> | reset | size <sm|md|lg>]',
  category: 'system',
  execute: (ctx) => {
    const sub = ctx.args[0]?.toLowerCase();
    const { customFont, fontSize, setFont, setFontSize } = useThemeStore.getState();

    if (!sub) {
      const lines = [
        `Font family : ${customFont ?? '(theme default)'}`,
        `Font size   : ${fontSize} (${SIZE_LABELS[fontSize]})`,
        '',
        'Commands:',
        '  font set "<family>"  — set a custom font-family',
        '  font reset           — restore theme default',
        '  font size <sm|md|lg> — change font size',
      ];
      return { type: 'text', content: lines.join('\n'), tone: 'muted' };
    }

    if (sub === 'set') {
      const family = ctx.args[1];
      if (!family) return { type: 'error', message: 'Usage: font set "<font-family>"' };

      setFont(family);
      applyFontFamily(family, ctx.theme.current);

      return {
        type: 'text',
        content: `Font set to: ${family}`,
        tone: 'success',
      };
    }

    if (sub === 'reset') {
      setFont(null);
      applyFontFamily(null, ctx.theme.current);

      return {
        type: 'text',
        content: 'Font reset to theme default.',
        tone: 'success',
      };
    }

    if (sub === 'size') {
      const sizeArg = ctx.args[1];
      
      if (!sizeArg || !(VALID_SIZES as string[]).includes(sizeArg)) {
        return {
          type: 'error',
          message: `Usage: font size <${VALID_SIZES.join('|')}>`,
        };
      }
      const size = sizeArg as FontSize;

      setFontSize(size);
      applyFontSize(size);

      return {
        type: 'text',
        content: `Font size set to ${size} (${SIZE_LABELS[size]}).`,
        tone: 'success',
      };
    }

    return {
      type: 'error',
      message: `Unknown subcommand: ${sub}. Usage: font [set | reset | size]`,
    };
  },
} satisfies Command;
