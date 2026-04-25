/**
 * asciiFonts.ts
 * Embedded ASCII block font for the `banner` command.
 *
 * Each character is a 5-row glyph where every row is exactly 6 characters wide
 * (5 content columns + 1 trailing space for kerning). The fill character is █
 * (U+2588 FULL BLOCK). Uppercase A–Z, digits 0–9, space, hyphen, dot, and
 * apostrophe are defined. Unknown characters fall back to a placeholder glyph.
 *
 * No React imports — this module must stay framework-agnostic.
 */

/** A single character glyph: array of 5 equal-width strings. */
type Glyph = readonly [string, string, string, string, string];

const FONT: Readonly<Record<string, Glyph>> = {
  A: [' ████ ', '█    █', '██████', '█    █', '█    █'],
  B: ['█████ ', '█    █', '█████ ', '█    █', '█████ '],
  C: [' ████ ', '█     ', '█     ', '█     ', ' ████ '],
  D: ['████  ', '█   █ ', '█   █ ', '█   █ ', '████  '],
  E: ['██████', '█     ', '████  ', '█     ', '██████'],
  F: ['██████', '█     ', '████  ', '█     ', '█     '],
  G: [' █████', '█     ', '█  ███', '█   █ ', ' ████ '],
  H: ['█    █', '█    █', '██████', '█    █', '█    █'],
  I: ['██████', '  ██  ', '  ██  ', '  ██  ', '██████'],
  J: ['  ████', '    █ ', '    █ ', '█   █ ', ' ███  '],
  K: ['█   █ ', '█  █  ', '███   ', '█  █  ', '█   █ '],
  L: ['█     ', '█     ', '█     ', '█     ', '██████'],
  M: ['█    █', '██  ██', '█ ██ █', '█    █', '█    █'],
  N: ['█    █', '██   █', '█ █  █', '█  █ █', '█   ██'],
  O: [' ████ ', '█    █', '█    █', '█    █', ' ████ '],
  P: ['█████ ', '█    █', '█████ ', '█     ', '█     '],
  Q: [' ████ ', '█    █', '█  █ █', '█   ██', ' █████'],
  R: ['█████ ', '█    █', '█████ ', '█  █  ', '█   █ '],
  S: [' █████', '█     ', ' ████ ', '     █', '█████ '],
  T: ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  '],
  U: ['█    █', '█    █', '█    █', '█    █', ' ████ '],
  V: ['█    █', '█    █', '█    █', ' █  █ ', '  ██  '],
  W: ['█    █', '█    █', '█ ██ █', '██  ██', '█    █'],
  X: ['█    █', ' █  █ ', '  ██  ', ' █  █ ', '█    █'],
  Y: ['█    █', ' █  █ ', '  ██  ', '  ██  ', '  ██  '],
  Z: ['██████', '    █ ', '  ██  ', ' █    ', '██████'],

  '0': [' ████ ', '█   ██', '█  █ █', '██   █', ' ████ '],
  '1': ['  ██  ', ' ███  ', '  ██  ', '  ██  ', '██████'],
  '2': [' ████ ', '█    █', '   ██ ', '  █   ', '██████'],
  '3': ['█████ ', '     █', '  ███ ', '     █', '█████ '],
  '4': ['█   █ ', '█   █ ', '██████', '    █ ', '    █ '],
  '5': ['██████', '█     ', '█████ ', '     █', '█████ '],
  '6': [' █████', '█     ', '█████ ', '█    █', ' ████ '],
  '7': ['██████', '    █ ', '   █  ', '  █   ', ' █    '],
  '8': [' ████ ', '█    █', ' ████ ', '█    █', ' ████ '],
  '9': [' ████ ', '█    █', ' █████', '     █', '█████ '],

  // Word separator — narrower than a letter (4 spaces wide).
  ' ': ['    ', '    ', '    ', '    ', '    '],

  '-': ['      ', '      ', '████  ', '      ', '      '],
  '.': ['      ', '      ', '      ', '      ', ' ██   '],
  "'": [' ██   ', '  █   ', '      ', '      ', '      '],
  '!': ['  ██  ', '  ██  ', '  ██  ', '      ', '  ██  '],

  // Fallback for unknown characters.
  '?': [' ████ ', '     █', '  ███ ', '      ', '  ██  '],
};

/**
 * Converts a string to a 5-row block-character ASCII banner.
 *
 * - Input is uppercased automatically.
 * - Characters not in the font table are replaced with the `?` glyph.
 * - Each character glyph is 6 columns wide; rows are concatenated directly.
 *
 * @param text - The text to render (typically the user's name).
 * @returns A 5-line string ready for `whitespace-pre` display.
 *
 * @example
 * buildBanner('Sam') →
 * ' ████  ████  █    █\n...'
 */
export function buildBanner(text: string): string {
  const upper = text.toUpperCase();
  const rows: string[][] = [[], [], [], [], []];
  const fallback = FONT['?'] as Glyph;

  for (const char of upper) {
    const glyph: Glyph = (FONT[char] as Glyph | undefined) ?? fallback;
    for (let r = 0; r < 5; r++) {
      rows[r].push(glyph[r]);
    }
  }

  return rows.map((row) => row.join('')).join('\n');
}
