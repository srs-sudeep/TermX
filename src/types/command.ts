/**
 * command.ts
 * Core type contracts for the command system.
 *
 * Rules:
 *  - Commands use `satisfies Command` — never `as Command`.
 *  - `execute` must return, never throw.
 *  - See .claude/rules/commands.md for the full contract.
 */

import type { ReactNode } from 'react';
import type { UserConfig } from './config';

// ── Output primitive types ─────────────────────────────────────────────────

/**
 * A single item in a `list`-type output.
 * `indent` allows nested sub-items (0 = top level).
 *
 * @example
 * { label: 'GitHub', value: '@samreyes', url: 'https://github.com/samreyes' }
 */
export interface ListItem {
  /** Primary display label. */
  label: string;
  /** Optional secondary value shown after a separator. */
  value?: string;
  /** Optional URL — renderer may make label a clickable link. */
  url?: string;
  /** Nesting depth; 0 = top-level bullet. */
  indent?: number;
}

/**
 * A card used in `cards`-type output (projects, experience detail, etc.).
 *
 * @example
 * { title: 'Quill', subtitle: 'A journaling app', tags: ['React', 'PWA'] }
 */
export interface Card {
  /** Bold header. */
  title: string;
  /** Muted sub-header (tagline, role title, etc.). */
  subtitle?: string;
  /** Body copy — prose description. */
  body?: string;
  /** Pill/badge tags (e.g. tech stack). */
  tags?: string[];
  /** Inline links rendered at the bottom of the card. */
  links?: Array<{ label: string; url: string }>;
  /** Bulleted list items inside the card body. */
  bullets?: string[];
}

// ── CommandOutput — discriminated union ───────────────────────────────────

/**
 * The full set of output types a command can return.
 * Each variant is rendered by a matching component in `src/components/output/`.
 *
 * Rules:
 *  - Use `text` for prose. Use `tone` for semantic coloring.
 *  - Use `error` instead of `text` with tone `'error'` — it adds the "error:" prefix.
 *  - Use `jsx` as last resort (animations, one-off layouts).
 *  - Never throw from `execute`. Return `{ type: 'error', message }` instead.
 */
export type CommandOutput =
  /** Single block of prose text. */
  | {
      type: 'text';
      content: string;
      /**
       * Semantic tone maps to a CSS variable:
       *   normal   → var(--fg)
       *   success  → var(--success)
       *   error    → var(--error)
       *   warning  → var(--warning)
       *   muted    → var(--muted)
       */
      tone?: 'normal' | 'success' | 'error' | 'warning' | 'muted';
    }
  /** Bulleted list. */
  | { type: 'list'; items: ListItem[] }
  /** Monospace-aligned table with headers. */
  | { type: 'table'; headers: string[]; rows: string[][] }
  /** Rich project / experience cards. */
  | { type: 'cards'; cards: Card[] }
  /** Escape hatch for custom React content (animations, neofetch layout, etc.). */
  | { type: 'jsx'; element: ReactNode }
  /**
   * Renders `<SettingsPanel />` inline in the terminal output.
   * Handled by `<OutputRenderer>` — the command itself stays free of
   * component imports by using this discriminant instead of `jsx`.
   */
  | { type: 'settings-panel' }
  /**
   * Renders the full-screen `<MatrixRain />` canvas animation.
   * Press Escape to exit (clears terminal history).
   */
  | { type: 'matrix' }
  /**
   * Renders the `<HackEffect />` fake-hacking animation (auto-completes in 3s).
   */
  | { type: 'hack' }
  /**
   * Renders `<AsciiBanner />` with the user's name in ASCII block letters.
   * Built from `buildBanner(config.user.name)` by `<OutputRenderer>`.
   */
  | { type: 'banner' }
  /** Clears the terminal history. Handled by `useTerminal`, never rendered. */
  | { type: 'clear' }
  /** Opens a URL. Handled by `useTerminal`. */
  | { type: 'redirect'; url: string; newTab?: boolean }
  /** Triggers a file download. Handled by `useTerminal`. */
  | { type: 'download'; url: string; filename: string }
  /** User-facing error. Renderer prefixes with "error:". */
  | { type: 'error'; message: string };

// ── CommandContext ─────────────────────────────────────────────────────────

/**
 * Execution context injected into every command's `execute` function.
 * Tests pass a mock context; production passes a real one built in `useTerminal`.
 *
 * Commands must read config via `ctx.config` — never import from `@/config` directly.
 * Commands must mutate theme via `ctx.theme.set` — never touch the store directly.
 */
export interface CommandContext {
  /** Positional arguments parsed from the input. */
  args: string[];
  /**
   * Named flags parsed from the input.
   * `--flag`        → `{ flag: true }`
   * `--key=value`   → `{ key: 'value' }`
   * `-f`            → `{ f: true }`
   */
  flags: Record<string, string | boolean>;
  /** The full original input string. */
  raw: string;
  /** Injected user config — read-only at runtime. */
  config: UserConfig;
  /** Theme helpers — read active theme, switch themes. */
  theme: {
    /** Name of the currently active theme. */
    current: string;
    /** Switch and persist a theme by name. */
    set: (name: string) => void;
  };
  /** Terminal history helpers. */
  history: {
    /** Returns the ordered list of past command strings. */
    all: () => string[];
    /** Clears the visual terminal history. */
    clear: () => void;
  };
  /**
   * Programmatically dispatch a command string, as if the user typed it.
   * Used by `cd` to delegate to portfolio commands.
   * Creates a new history entry — do not call in a tight loop.
   *
   * @param input - The full raw command string (e.g. `'about'`).
   */
  dispatch: (input: string) => void;
}

// ── Command ────────────────────────────────────────────────────────────────

/**
 * The shape every command file must export as its default export.
 *
 * @example
 * ```ts
 * export default {
 *   name: 'about',
 *   description: 'Who am I',
 *   category: 'portfolio',
 *   execute: (ctx) => ({ type: 'text', content: ctx.config.about.paragraphs.join('\n\n') }),
 * } satisfies Command;
 * ```
 */
export interface Command {
  /** Primary command name — must be unique across the registry. */
  name: string;
  /** Alternative names that resolve to this command. Must be globally unique. */
  aliases?: string[];
  /** One-line description shown in `help` output. */
  description: string;
  /** Usage synopsis shown by `man <cmd>`. Defaults to the command name. */
  usage?: string;
  /** Grouping used by `help` to section commands. Exactly one per command. */
  category: 'core' | 'portfolio' | 'system' | 'fun' | 'custom';
  /**
   * When `true`, this command is callable but omitted from `help` listings.
   * Use for easter eggs and internal commands (`man`, `_`).
   */
  hidden?: boolean;
  /**
   * The handler. Must return (not throw). May be async — the terminal shows
   * a `...` placeholder while awaiting. Keep async work under 2 seconds.
   */
  execute: (ctx: CommandContext) => CommandOutput | Promise<CommandOutput>;
  /**
   * Optional Tab-completion provider. Return the list of valid completions
   * for the string the user has typed after the command name.
   *
   * @param partial - Everything the user has typed after the command name.
   * @param ctx - Full command context (for config access).
   * @returns Up to 20 completion candidates.
   *
   * @example
   * autocomplete: (partial, ctx) =>
   *   ctx.config.projects.map(p => p.slug).filter(s => s.startsWith(partial))
   */
  autocomplete?: (partial: string, ctx: CommandContext) => string[];
}

// ── ParsedCommand ──────────────────────────────────────────────────────────

/**
 * Output of `commandParser`. A `null` result means the input was empty.
 *
 * @example
 * parse('projects --featured --year=2024 quill')
 * // → { name: 'projects', args: ['quill'], flags: { featured: true, year: '2024' }, raw: '...' }
 */
export interface ParsedCommand {
  /** The first whitespace-delimited token, lowercased. */
  name: string;
  /** Positional arguments (everything that isn't a flag). */
  args: string[];
  /**
   * Parsed flags.
   * `--flag`       → `{ flag: true }`
   * `--key=value`  → `{ key: 'value' }`
   * `-f`           → `{ f: true }`
   */
  flags: Record<string, string | boolean>;
  /** The original, untrimmed input string. */
  raw: string;
}
