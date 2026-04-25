/**
 * commandParser.ts
 * Converts a raw terminal input string into a structured ParsedCommand.
 *
 * Supported syntax
 * ─────────────────
 *  Positional args:       about           → args: ['about']
 *  Double-quoted args:    echo "hi there" → args: ['hi there']
 *  Single-quoted args:    echo 'hi there' → args: ['hi there']
 *  Long flag (boolean):   --featured      → flags: { featured: true }
 *  Long flag (= value):   --year=2024     → flags: { year: '2024' }
 *  Long flag (space val): --year 2024     → flags: { year: '2024' }  ⚠ see note
 *  Short flag (boolean):  -f              → flags: { f: true }
 *  Empty / whitespace:    ''              → null
 *
 * ⚠  `--key value` ambiguity
 *    The parser uses a "greedy peek" rule: if a bare `--key` flag is immediately
 *    followed by a token that does NOT start with `-`, that token is consumed as
 *    the flag's value. Consequence: positional args that should remain positional
 *    must appear BEFORE any bare `--key` flags in the input.
 *
 *    Canonical safe ordering:  projects quill --featured --year=2024
 *    Surprising:               projects --featured quill   → featured='quill'
 *
 *    In practice all built-in commands that take both positional args and valued
 *    flags use the `--key=value` form to avoid ambiguity.
 *
 * No React imports — this module must stay framework-agnostic.
 */

import type { ParsedCommand } from '@/types';

// ── ParseError ─────────────────────────────────────────────────────────────

/**
 * Thrown by `parse()` when the input is syntactically malformed
 * (currently: unterminated quoted string).
 *
 * `useTerminal` (Phase 8) catches this and converts it to an error output.
 */
export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

// ── Tokeniser ──────────────────────────────────────────────────────────────

/**
 * Splits an input string into tokens, honouring single- and double-quoted
 * substrings so that spaces inside quotes are preserved as a single token.
 *
 * @throws {ParseError} When a quoted string is not closed before end-of-input.
 *
 * @example
 * tokenize('echo "hello world" --verbose')
 * // → ['echo', 'hello world', '--verbose']
 */
function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    // Skip ASCII whitespace.
    if (ch === ' ' || ch === '\t') {
      i++;
      continue;
    }

    // Quoted string — absorb everything up to the matching closing quote.
    if (ch === '"' || ch === "'") {
      const openQuote = ch;
      i++; // consume opening quote

      let token = '';
      while (i < input.length && input[i] !== openQuote) {
        token += input[i];
        i++;
      }

      if (i >= input.length) {
        // Reached end of string without finding the closing quote.
        throw new ParseError(
          `Unterminated ${openQuote === '"' ? 'double' : 'single'} quote`,
        );
      }

      i++; // consume closing quote
      tokens.push(token);
      continue;
    }

    // Regular (unquoted) token — read until whitespace.
    let token = '';
    while (i < input.length && input[i] !== ' ' && input[i] !== '\t') {
      token += input[i];
      i++;
    }
    if (token.length > 0) tokens.push(token);
  }

  return tokens;
}

// ── parse ──────────────────────────────────────────────────────────────────

/**
 * Parse a raw terminal input string into a structured `ParsedCommand`.
 *
 * Returns `null` for empty or whitespace-only input.
 * Throws `ParseError` for malformed input (e.g. unterminated quote).
 *
 * @param input - The full, unmodified string from the terminal input element.
 * @returns A `ParsedCommand`, or `null` if the input is empty.
 *
 * @example
 * parse('projects --featured --year=2024')
 * // → { name: 'projects', args: [], flags: { featured: true, year: '2024' }, raw: '...' }
 *
 * @example
 * parse('  ')
 * // → null
 *
 * @example
 * parse('echo "hello world"')
 * // → { name: 'echo', args: ['hello world'], flags: {}, raw: 'echo "hello world"' }
 */
export function parse(input: string): ParsedCommand | null {
  const raw = input;
  const trimmed = input.trim();

  if (!trimmed) return null;

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return null;

  // First token is always the command name, normalised to lowercase.
  const name = tokens[0].toLowerCase();
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  let i = 1;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.startsWith('--') && token.length > 2) {
      // ── Long flag ──────────────────────────────────────────────────────
      const eqIndex = token.indexOf('=', 2); // skip the '--' prefix

      if (eqIndex !== -1) {
        // --key=value
        const key = token.slice(2, eqIndex);
        const value = token.slice(eqIndex + 1);
        flags[key] = value;
        i++;
      } else {
        // --key — greedy: consume next token as value if it is not a flag.
        const key = token.slice(2);
        const next = tokens[i + 1];

        if (next !== undefined && !next.startsWith('-')) {
          flags[key] = next;
          i += 2;
        } else {
          // No following value token (or next token is itself a flag): boolean.
          flags[key] = true;
          i++;
        }
      }
    } else if (
      token.startsWith('-') &&
      !token.startsWith('--') &&
      token.length >= 2
    ) {
      // ── Short flag -k (boolean only, per spec) ─────────────────────────
      // Multiple chars after `-` (e.g. `-rf`) are treated as a single key `rf`.
      const key = token.slice(1);
      flags[key] = true;
      i++;
    } else {
      // ── Positional argument ────────────────────────────────────────────
      args.push(token);
      i++;
    }
  }

  return { name, args, flags, raw };
}
