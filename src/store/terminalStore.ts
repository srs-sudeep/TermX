/**
 * terminalStore.ts
 * Zustand store for terminal history and command recall.
 *
 * Two separate pieces of state, with different persistence rules:
 *
 *  history         — `HistoryEntry[]`
 *    Rendered output pairs (prompt + input + output).
 *    NOT persisted — resets on every page load.
 *    May contain React nodes (jsx output type); cannot be safely serialised.
 *
 *  commandHistory  — `string[]`
 *    Raw input strings for ↑/↓ recall (like shell history).
 *    Persisted to localStorage (key: termfolio:history).
 *    Capped at MAX_COMMAND_HISTORY entries (oldest entries dropped first).
 *    Ordered oldest → newest: index 0 = oldest, last index = most recent.
 *
 * Why split from themeStore? Terminal state changes on every keystroke and
 * submit; theme state changes rarely. Splitting avoids unnecessary re-renders
 * of theme-dependent components when history updates.
 */

import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { HistoryEntry, CommandOutput } from '@/types';

/** Maximum number of command strings retained for ↑/↓ recall. */
const MAX_COMMAND_HISTORY = 100;

interface TerminalState {
  /**
   * Ordered list of rendered terminal entries.
   * Each entry corresponds to one "Enter" press — the prompt snapshot,
   * the raw input, and the command's output (or null for blank Enter).
   *
   * Not persisted; starts empty on every page load.
   */
  history: HistoryEntry[];

  /**
   * Ordered (oldest → newest) list of past command strings.
   * Used by ↑/↓ history navigation in TerminalInput.
   * Persisted to localStorage; capped at MAX_COMMAND_HISTORY.
   */
  commandHistory: string[];

  /**
   * Append a completed history entry to the terminal display.
   * Called by useTerminal after a command resolves.
   *
   * @param entry - Fully populated HistoryEntry including output.
   */
  appendOutput: (entry: HistoryEntry) => void;

  /**
   * Update the output of an existing history entry by id.
   * Used by useTerminal (Phase 8) to fill in async command results after
   * the initial placeholder entry has been appended.
   *
   * @param id     - The HistoryEntry.id to update.
   * @param output - The resolved CommandOutput to write in.
   */
  updateOutput: (id: string, output: CommandOutput) => void;

  /**
   * Clear all rendered history entries from the terminal display.
   * Does NOT clear commandHistory — ↑/↓ recall is unaffected.
   * Triggered by the `clear` command.
   */
  clearHistory: () => void;

  /**
   * Add a raw command string to the persistent command history.
   * - Skips empty strings.
   * - Appends at the end (newest last) to match ↑/↓ navigation expectations.
   * - Drops the oldest entry when the cap is exceeded.
   * - Persists the updated array to localStorage immediately.
   *
   * @param command - The raw input string (e.g. 'projects --featured').
   */
  addToCommandHistory: (command: string) => void;
}

export const useTerminalStore = create<TerminalState>()((set) => ({
  // ── Initial state ────────────────────────────────────────────────────────
  history: [],

  // Hydrate commandHistory from localStorage. Falls back to empty array if
  // nothing is stored (first visit) or if storage is blocked.
  commandHistory: storage.get<string[]>('history', []),

  // ── Actions ──────────────────────────────────────────────────────────────

  appendOutput: (entry) => {
    set((state) => ({ history: [...state.history, entry] }));
  },

  updateOutput: (id, output) => {
    set((state) => ({
      history: state.history.map((entry) =>
        entry.id === id ? { ...entry, output } : entry,
      ),
    }));
  },

  clearHistory: () => {
    set({ history: [] });
  },

  addToCommandHistory: (command) => {
    // Never store empty inputs — they add no recall value.
    if (command.trim() === '') return;

    set((state) => {
      // Append newest at the end; slice from the back to enforce the cap.
      // Oldest entries (index 0) are evicted first.
      const updated = [...state.commandHistory, command].slice(-MAX_COMMAND_HISTORY);
      storage.set('history', updated);
      return { commandHistory: updated };
    });
  },
}));
