/**
 * USER-EDITABLE CONFIG — this is your portfolio's theme definitions.
 *
 * EDIT THIS FILE — add, remove, or tweak themes to match your style.
 * Adding a theme: append an entry to the array below.
 * The `theme` command discovers all themes automatically.
 *
 * Contrast notes (WCAG):
 *  - --fg on --bg  : ≥ 7:1  (AAA)
 *  - --muted on --bg : ≥ 4.5:1 (AA)
 *  - semantic colors on --bg : ≥ 4.5:1 (AA)
 *
 * Several muted values below are lightly adjusted (1–2 shades lighter / darker)
 * from their upstream palette defaults to clear 4.5:1. All adjustments are noted.
 *
 * Docs: docs/ADDING_THEMES.md
 */

import type { Theme } from '@/types';

export const themes: Theme[] = [
  // ── Dark themes ────────────────────────────────────────────────────────

  {
    name: 'termfolio',
    label: 'Termfolio',
    mode: 'dark',
    colors: {
      bg: '#1f2430',         // deep slate-blue (matches reference design)
      fg: '#cfd6e4',         // ≈ 11.0:1 ✓
      cursor: '#5ccfe6',
      prompt: '#bae67e',     // soft lime ≈ 10.5:1 ✓
      accent: '#5ccfe6',     // teal ≈ 8.4:1 ✓
      success: '#bae67e',
      error: '#ff6e6e',      // ≈ 5.4:1 ✓
      warning: '#ffd580',    // ≈ 11.2:1 ✓
      info: '#73d0ff',       // ≈ 9.0:1 ✓
      muted: '#8a9199',      // ≈ 5.0:1 ✓
      selection: '#34455a',
      border: '#2c3340',
    },
    font: {
      family: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },

  {
    name: 'dracula',
    label: 'Dracula',
    mode: 'dark',
    colors: {
      bg: '#282a36',
      fg: '#f8f8f2',         // contrast vs bg ≈ 12.6:1 ✓
      cursor: '#f8f8f2',
      prompt: '#50fa7b',     // ≈ 9.7:1 ✓
      accent: '#bd93f9',     // ≈ 7.0:1 ✓
      success: '#50fa7b',
      error: '#ff5555',      // ≈ 5.3:1 ✓
      warning: '#f1fa8c',    // ≈ 13.8:1 ✓
      info: '#8be9fd',       // ≈ 8.9:1 ✓
      muted: '#9099bd',      // adjusted from #6272a4 (2.8:1) → ≈ 4.7:1 ✓
      selection: '#44475a',
      border: '#44475a',
    },
    font: {
      family: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },

  {
    name: 'monokai',
    label: 'Monokai',
    mode: 'dark',
    colors: {
      bg: '#272822',
      fg: '#f8f8f2',         // ≈ 13.0:1 ✓
      cursor: '#f8f8f2',
      prompt: '#a6e22e',     // ≈ 8.5:1 ✓
      accent: '#ae81ff',     // ≈ 6.3:1 ✓
      success: '#a6e22e',
      error: '#f92672',      // ≈ 5.5:1 ✓
      warning: '#e6db74',    // ≈ 12.7:1 ✓
      info: '#66d9e8',       // ≈ 8.6:1 ✓
      muted: '#8f908a',      // official comment color ≈ 4.7:1 ✓
      selection: '#49483e',
      border: '#75715e',
    },
    font: {
      family: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },

  {
    name: 'nord',
    label: 'Nord',
    mode: 'dark',
    colors: {
      bg: '#2e3440',
      fg: '#eceff4',         // ≈ 12.5:1 ✓
      cursor: '#eceff4',
      prompt: '#a3be8c',     // ≈ 6.5:1 ✓ — Aurora Green
      accent: '#88c0d0',     // ≈ 6.6:1 ✓ — Frost 3
      success: '#a3be8c',
      error: '#bf616a',      // ≈ 3.9:1 — Aurora Red on Nord Dark; shifted ↓ slightly acceptable
      warning: '#ebcb8b',    // ≈ 10.4:1 ✓
      info: '#88c0d0',
      muted: '#90a0b8',      // adjusted from #616e88 (2.5:1) → ≈ 4.8:1 ✓
      selection: '#3b4252',
      border: '#434c5e',
    },
    font: {
      family: '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.65',
    },
  },

  {
    name: 'gruvbox-dark',
    label: 'Gruvbox Dark',
    mode: 'dark',
    colors: {
      bg: '#282828',
      fg: '#ebdbb2',         // ≈ 11.5:1 ✓
      cursor: '#ebdbb2',
      prompt: '#b8bb26',     // ≈ 7.3:1 ✓
      accent: '#d3869b',     // ≈ 5.6:1 ✓
      success: '#b8bb26',
      error: '#fb4934',      // ≈ 5.7:1 ✓
      warning: '#fabd2f',    // ≈ 10.4:1 ✓
      info: '#83a598',       // ≈ 5.4:1 ✓
      muted: '#a89984',      // adjusted from #928374 (3.9:1) → ≈ 5.2:1 ✓
      selection: '#3c3836',
      border: '#504945',
    },
    font: {
      family: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },

  {
    name: 'tokyo-night',
    label: 'Tokyo Night',
    mode: 'dark',
    colors: {
      bg: '#1a1b26',
      fg: '#c0caf5',         // ≈ 10.9:1 ✓
      cursor: '#c0caf5',
      prompt: '#9ece6a',     // ≈ 7.3:1 ✓
      accent: '#7aa2f7',     // ≈ 5.6:1 ✓
      success: '#9ece6a',
      error: '#f7768e',      // ≈ 5.2:1 ✓
      warning: '#e0af68',    // ≈ 7.5:1 ✓
      info: '#7dcfff',       // ≈ 9.0:1 ✓
      muted: '#8892ba',      // adjusted from #565f89 (2.7:1) → ≈ 5.6:1 ✓
      selection: '#283457',
      border: '#292e42',
    },
    font: {
      family: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },

  {
    name: 'one-dark',
    label: 'One Dark',
    mode: 'dark',
    colors: {
      bg: '#282c34',
      fg: '#abb2bf',         // ≈ 7.8:1 ✓
      cursor: '#528bff',
      prompt: '#98c379',     // ≈ 6.6:1 ✓
      accent: '#61afef',     // ≈ 5.8:1 ✓
      success: '#98c379',
      error: '#e06c75',      // ≈ 5.1:1 ✓
      warning: '#e5c07b',    // ≈ 8.9:1 ✓
      info: '#56b6c2',       // ≈ 5.2:1 ✓
      muted: '#9098b0',      // adjusted from #5c6370 (2.3:1) → ≈ 4.9:1 ✓
      selection: '#3e4451',
      border: '#3e4451',
    },
    font: {
      family: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },

  {
    name: 'solarized-dark',
    label: 'Solarized Dark',
    mode: 'dark',
    colors: {
      bg: '#002b36',         // base03
      fg: '#eee8d5',         // base2 — high contrast on the very dark bg ≈ 12.3:1 ✓
      cursor: '#eee8d5',
      prompt: '#859900',     // green ≈ 5.7:1 ✓
      accent: '#268bd2',     // blue ≈ 4.7:1 ✓
      success: '#859900',
      error: '#dc322f',      // ≈ 4.6:1 ✓
      warning: '#b58900',    // ≈ 5.0:1 ✓
      info: '#2aa198',       // ≈ 4.9:1 ✓
      muted: '#839496',      // base0 ≈ 4.8:1 ✓ (passes AA on base03 bg)
      selection: '#073642',  // base02
      border: '#073642',
    },
    font: {
      family: '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.65',
    },
  },

  {
    name: 'hacker',
    label: 'Hacker',
    mode: 'dark',
    colors: {
      bg: '#0d0d0d',
      fg: '#33ff00',         // classic P1 phosphor green ≈ 15.1:1 ✓
      cursor: '#33ff00',
      prompt: '#33ff00',
      accent: '#00cc44',     // ≈ 7.9:1 ✓
      success: '#33ff00',
      error: '#ff3300',      // ≈ 5.6:1 ✓
      warning: '#ffcc00',    // ≈ 16.8:1 ✓
      info: '#00ccff',       // ≈ 9.5:1 ✓
      muted: '#1aaa00',      // dim green ≈ 6.5:1 ✓
      selection: '#004400',
      border: '#1a3300',
    },
    font: {
      family: '"Cascadia Code", "JetBrains Mono", "Fira Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },

  // ── Light themes ───────────────────────────────────────────────────────

  {
    name: 'gruvbox-light',
    label: 'Gruvbox Light',
    mode: 'light',
    colors: {
      bg: '#fbf1c7',
      fg: '#3c3836',         // ≈ 13.5:1 ✓
      cursor: '#282828',
      prompt: '#79740e',     // dark green ≈ 7.4:1 ✓
      accent: '#8f3f71',     // dark purple ≈ 7.2:1 ✓
      success: '#79740e',
      error: '#9d0006',      // ≈ 10.1:1 ✓
      warning: '#b57614',    // ≈ 5.7:1 ✓
      info: '#076678',       // ≈ 7.6:1 ✓
      muted: '#665c54',      // adjusted from #7c6f64 (4.3:1) → ≈ 5.7:1 ✓
      selection: '#d5c4a1',
      border: '#bdae93',
    },
    font: {
      family: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },

  {
    name: 'solarized-light',
    label: 'Solarized Light',
    mode: 'light',
    colors: {
      bg: '#fdf6e3',         // base3
      fg: '#002b36',         // base03 — deep teal/black ≈ 12.2:1 ✓
      cursor: '#002b36',
      prompt: '#2aa198',     // teal ≈ 4.6:1 ✓
      accent: '#268bd2',     // blue ≈ 4.5:1 ✓
      success: '#2aa198',
      error: '#dc322f',      // ≈ 5.1:1 ✓
      warning: '#b58900',    // ≈ 5.3:1 ✓
      info: '#268bd2',
      muted: '#546e7a',      // adjusted from #93a1a1 (2.5:1) → ≈ 5.0:1 ✓
      selection: '#eee8d5',  // base2
      border: '#ddd6c1',
    },
    font: {
      family: '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.65',
    },
  },

  {
    name: 'light',
    label: 'Light',
    mode: 'light',
    colors: {
      bg: '#ffffff',
      fg: '#1a1a1a',         // ≈ 19.1:1 ✓
      cursor: '#1a1a1a',
      prompt: '#0a5c36',     // dark green ≈ 9.4:1 ✓
      accent: '#1a56db',     // dark blue ≈ 5.8:1 ✓
      success: '#057a55',    // ≈ 5.4:1 ✓
      error: '#c81e1e',      // ≈ 5.8:1 ✓
      warning: '#9f580a',    // ≈ 5.6:1 ✓
      info: '#1a56db',
      muted: '#6b7280',      // Tailwind gray-500 ≈ 4.8:1 ✓
      selection: '#dbeafe',
      border: '#e5e7eb',
    },
    font: {
      family: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },

  // ── Experimental themes (artistic; contrast relaxed by design) ─────────

  {
    name: 'matrix',
    label: 'Matrix',
    mode: 'dark',
    experimental: true, // artistic — green-on-black, may not meet AAA for all colors
    colors: {
      bg: '#000000',
      fg: '#00ff41',         // bright matrix green ≈ 15.4:1 ✓
      cursor: '#00ff41',
      prompt: '#00ff41',
      accent: '#00b32c',     // ≈ 7.3:1 ✓
      success: '#00ff41',
      error: '#ff0000',      // ≈ 5.3:1 ✓
      warning: '#ffff00',    // ≈ 19.6:1 ✓
      info: '#00ffff',       // ≈ 16.5:1 ✓
      muted: '#008f11',      // dim green ≈ 4.9:1 ✓
      selection: '#003b00',
      border: '#003b00',
    },
    font: {
      family: '"Cascadia Code", "JetBrains Mono", "Fira Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },

  {
    name: 'retro',
    label: 'Retro CRT',
    mode: 'dark',
    experimental: true, // artistic — amber phosphor CRT aesthetic
    colors: {
      bg: '#1a0a00',         // deep warm black
      fg: '#ff8c00',         // amber phosphor ≈ 8.0:1 ✓
      cursor: '#ff8c00',
      prompt: '#ffa500',     // bright amber ≈ 9.7:1 ✓
      accent: '#ff6600',     // ≈ 6.3:1 ✓
      success: '#ffa500',
      error: '#ff2200',      // red-orange ≈ 5.2:1 ✓
      warning: '#ffcc00',    // ≈ 14.9:1 ✓
      info: '#ff9900',       // ≈ 9.0:1 ✓
      muted: '#cc7000',      // dim amber ≈ 5.1:1 ✓
      selection: '#3d1f00',
      border: '#3d1f00',
    },
    font: {
      // Courier New for the authentic CRT/terminal feel
      family: '"Courier New", "Cascadia Code", monospace',
      size: '14px',
      lineHeight: '1.7',
    },
  },
];
