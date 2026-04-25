/**
 * USER-EDITABLE CONFIG — this is your portfolio's custom commands.
 *
 * EDIT THIS FILE — add your own commands or override built-in ones below.
 * Custom commands are merged over built-ins: a command with the same `name`
 * as a built-in replaces it completely.
 *
 * Docs: docs/ADDING_COMMANDS.md
 */

import type { Command } from '@/types';

/**
 * Your custom commands.
 *
 * Each entry must conform to the `Command` interface.
 * Use `satisfies Command` on inline objects for type checking.
 *
 * @example
 * // Open your Spotify profile directly from the terminal:
 * {
 *   name: 'spotify',
 *   description: 'Open my Spotify profile',
 *   usage: 'spotify',
 *   category: 'custom',
 *   execute: () => ({
 *     type: 'redirect',
 *     url: 'https://open.spotify.com/user/your-username',
 *     newTab: true,
 *   }),
 * } satisfies Command
 *
 * @example
 * // Print a custom status message:
 * {
 *   name: 'status',
 *   description: 'What I am currently working on',
 *   category: 'custom',
 *   execute: () => ({
 *     type: 'text',
 *     content: '📦 Shipping Nexus v2 — available for contract work from March 2025.',
 *     tone: 'success',
 *   }),
 * } satisfies Command
 */
export const customCommands: Command[] = [
  // Add your custom commands here.
  // The registry loads these after all built-ins, so you can override by name.
];
