/**
 * USER-EDITABLE CONFIG — this is your portfolio's engine settings.
 *
 * EDIT THIS FILE — toggle features and set your preferred defaults.
 * These control the terminal engine; personal data belongs in user.config.ts.
 *
 * Docs: docs/CUSTOMIZATION.md
 */

import type { Settings } from '@/types';

export const settings = {
  /**
   * The theme applied on first visit (before any user preference is stored).
   * Must match a `name` in themes.config.ts.
   * The user can change it at runtime with: theme set <name>
   */
  defaultTheme: 'dracula',

  /**
   * Initial font size before localStorage is read.
   * sm = 12px | md = 14px | lg = 16px
   * The user can change it at runtime with: font size <sm|md|lg>
   */
  defaultFontSize: 'md',

  /**
   * Show the scripted boot sequence on first visit.
   * Skipped automatically on repeat visits (localStorage key: termfolio:visited)
   * and when the user has prefers-reduced-motion enabled.
   * Set to false to skip the boot sequence entirely.
   */
  bootSequence: true,

  /**
   * Print the ASCII banner + help summary automatically after the terminal
   * initialises (or immediately after the boot sequence finishes).
   * Runs on every page load — the boot sequence itself only runs once.
   */
  showBanner: true,

  /**
   * Animate text output with a typewriter effect.
   * Off by default — adds charm on first visit but becomes tedious
   * for users who run many commands. The user can toggle it in Settings.
   */
  typewriter: false,
} satisfies Settings;
