import type { Command } from '@/types';

/** Wrap text into lines no wider than maxLen characters. */
function wordWrap(text: string, maxLen: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (current.length === 0) {
      current = word;
    } else if (current.length + 1 + word.length > maxLen) {
      lines.push(current);
      current = word;
    } else {
      current += ' ' + word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}

/** Build a cowsay-style speech bubble around the given lines. */
function buildBubble(lines: string[]): string {
  const width = Math.max(...lines.map((l) => l.length));
  const border = '-'.repeat(width + 2);
  const top = ` ${border}`;
  const bottom = ` ${border}`;

  let inner: string;
  if (lines.length === 1) {
    inner = `< ${lines[0].padEnd(width)} >`;
  } else {
    inner = lines
      .map((line, i) => {
        const padded = line.padEnd(width);
        if (i === 0) return `/ ${padded} \\`;
        if (i === lines.length - 1) return `\\ ${padded} /`;
        return `| ${padded} |`;
      })
      .join('\n');
  }

  return [top, inner, bottom].join('\n');
}

const COW = `        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

export default {
  name: 'cowsay',
  description: 'Make a cow say something',
  usage: 'cowsay <text>',
  category: 'fun',
  execute: (ctx) => {
    const text = ctx.args.join(' ') || 'Moo!';
    const lines = wordWrap(text, 40);
    const bubble = buildBubble(lines);
    return {
      type: 'text',
      content: `${bubble}\n${COW}`,
      tone: 'normal',
    };
  },
} satisfies Command;
