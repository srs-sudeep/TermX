 

import type { ParsedCommand } from '@/types';

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (ch === ' ' || ch === '\t') {
      i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const openQuote = ch;
      i++; 

      let token = '';
      while (i < input.length && input[i] !== openQuote) {
        token += input[i];
        i++;
      }

      if (i >= input.length) {
        
        throw new ParseError(
          `Unterminated ${openQuote === '"' ? 'double' : 'single'} quote`,
        );
      }

      i++; 
      tokens.push(token);
      continue;
    }

    let token = '';
    while (i < input.length && input[i] !== ' ' && input[i] !== '\t') {
      token += input[i];
      i++;
    }
    if (token.length > 0) tokens.push(token);
  }

  return tokens;
}

export function parse(input: string): ParsedCommand | null {
  const raw = input;
  const trimmed = input.trim();

  if (!trimmed) return null;

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return null;

  const name = tokens[0].toLowerCase();
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  let i = 1;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.startsWith('--') && token.length > 2) {
      
      const eqIndex = token.indexOf('=', 2); 

      if (eqIndex !== -1) {
        
        const key = token.slice(2, eqIndex);
        const value = token.slice(eqIndex + 1);
        flags[key] = value;
        i++;
      } else {
        
        const key = token.slice(2);
        const next = tokens[i + 1];

        if (next !== undefined && !next.startsWith('-')) {
          flags[key] = next;
          i += 2;
        } else {
          
          flags[key] = true;
          i++;
        }
      }
    } else if (
      token.startsWith('-') &&
      !token.startsWith('--') &&
      token.length >= 2
    ) {

      const key = token.slice(1);
      flags[key] = true;
      i++;
    } else {
      
      args.push(token);
      i++;
    }
  }

  return { name, args, flags, raw };
}
