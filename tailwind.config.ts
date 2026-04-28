import type { Config } from 'tailwindcss';

/**
 * Tailwind config for TermX.
 *
 * We intentionally do NOT extend the default color palette here —
 * all theme colors are CSS variables (--bg, --fg, --accent, etc.)
 * applied by themeManager. Reference them in components via
 * arbitrary-value syntax: bg-[var(--bg)], text-[var(--fg)].
 *
 * This keeps the bundle small and makes theme switches free of
 * React re-renders.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Expose CSS variable tokens to Tailwind's type system.
      // These mirror the variables defined in src/styles/themes.css.
      colors: {
        terminal: {
          bg: 'var(--bg)',
          fg: 'var(--fg)',
          cursor: 'var(--cursor)',
          prompt: 'var(--prompt)',
          accent: 'var(--accent)',
          success: 'var(--success)',
          error: 'var(--error)',
          warning: 'var(--warning)',
          info: 'var(--info)',
          muted: 'var(--muted)',
          selection: 'var(--selection)',
          border: 'var(--border)',
        },
      },
      fontFamily: {
        mono: ['var(--font-family)', 'monospace'],
      },
      fontSize: {
        terminal: 'var(--font-size-base)',
      },
      lineHeight: {
        terminal: 'var(--line-height-base)',
      },
    },
  },
  plugins: [],
};

export default config;
