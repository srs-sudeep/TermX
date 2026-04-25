/**
 * output.ts
 * Types specific to rendering — the terminal's display model.
 *
 * These types live here rather than in command.ts because they are
 * consumed by the React layer (stores, components) rather than by
 * command handlers.
 */

import type { CommandOutput } from './command';

// ── HistoryEntry ───────────────────────────────────────────────────────────

/**
 * A single entry in the rendered terminal history.
 * Corresponds to one "press Enter" event — the prompt line, the user's
 * input, and the output block(s) the command produced.
 *
 * Stored in `useTerminalStore.history[]` and rendered by `<TerminalHistory>`.
 *
 * @example
 * {
 *   id: 'entry-1714059600000-0',
 *   input: 'projects --featured',
 *   output: { type: 'cards', cards: [...] },
 *   timestamp: 1714059600000,
 * }
 */
export interface HistoryEntry {
  /**
   * Stable, unique key for React list rendering.
   * Format: `entry-{timestamp}-{counter}` — collision-safe across rapid
   * successive commands.
   */
  id: string;
  /**
   * The raw command string the user submitted.
   * An empty string means the user pressed Enter on an empty line
   * (prompt-only entry, `output` will be `null`).
   */
  input: string;
  /**
   * The command's return value, or `null` when:
   *   - The input was empty (blank Enter).
   *   - The command produced no visible output (e.g. `clear` before it runs).
   */
  output: CommandOutput | null;
  /**
   * Unix timestamp (ms) of when the command was submitted.
   * Used for display in `history` output and accessibility timestamps.
   */
  timestamp: number;
}
