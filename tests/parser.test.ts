import { describe, it, expect } from 'vitest';
import { parse, ParseError } from '@/lib/commandParser';

// ── helpers ──────────────────────────────────────────────────────────────────

/** Shorthand: parse and assert non-null result. */
function p(input: string) {
  const result = parse(input);
  if (result === null) throw new Error(`Expected non-null result for: "${input}"`);
  return result;
}

// ── suite ─────────────────────────────────────────────────────────────────────

describe('commandParser', () => {
  // ── empty / whitespace ─────────────────────────────────────────────────────

  describe('empty input', () => {
    it('returns null for an empty string', () => {
      expect(parse('')).toBeNull();
    });

    it('returns null for a whitespace-only string', () => {
      expect(parse('   ')).toBeNull();
    });

    it('returns null for a tab-only string', () => {
      expect(parse('\t\t')).toBeNull();
    });
  });

  // ── basic command ──────────────────────────────────────────────────────────

  describe('basic command name', () => {
    it('parses a single-word command', () => {
      const result = p('about');
      expect(result.name).toBe('about');
      expect(result.args).toEqual([]);
      expect(result.flags).toEqual({});
    });

    it('lowercases the command name', () => {
      expect(p('ABOUT').name).toBe('about');
      expect(p('Projects').name).toBe('projects');
    });

    it('trims leading whitespace', () => {
      expect(p('  about').name).toBe('about');
    });

    it('trims trailing whitespace', () => {
      expect(p('about  ').name).toBe('about');
    });

    it('preserves the original input in raw', () => {
      const input = '  projects --featured  ';
      const result = p(input);
      expect(result.raw).toBe(input);
    });
  });

  // ── positional args ────────────────────────────────────────────────────────

  describe('positional args', () => {
    it('parses a single positional arg', () => {
      expect(p('projects quill').args).toEqual(['quill']);
    });

    it('parses multiple positional args', () => {
      expect(p('echo one two three').args).toEqual(['one', 'two', 'three']);
    });

    it('collapses multiple spaces between args', () => {
      expect(p('echo  one   two').args).toEqual(['one', 'two']);
    });
  });

  // ── quoted args ────────────────────────────────────────────────────────────

  describe('quoted args', () => {
    it('preserves spaces inside double quotes', () => {
      const result = p('echo "hello world"');
      expect(result.name).toBe('echo');
      expect(result.args).toEqual(['hello world']);
    });

    it('allows single quotes', () => {
      const result = p("echo 'hello world'");
      expect(result.name).toBe('echo');
      expect(result.args).toEqual(['hello world']);
    });

    it('handles an empty double-quoted string', () => {
      expect(p('echo ""').args).toEqual(['']);
    });

    it('handles an empty single-quoted string', () => {
      expect(p("echo ''").args).toEqual(['']);
    });

    it('handles quoted arg alongside unquoted args', () => {
      const result = p('cowsay "moo moo" extra');
      expect(result.args).toEqual(['moo moo', 'extra']);
    });

    it('handles multiple quoted args', () => {
      const result = p('echo "hello world" "foo bar"');
      expect(result.args).toEqual(['hello world', 'foo bar']);
    });

    it('throws ParseError on unterminated double quote', () => {
      expect(() => parse('echo "hello')).toThrow(ParseError);
      expect(() => parse('echo "hello')).toThrow(/unterminated/i);
    });

    it('throws ParseError on unterminated single quote', () => {
      expect(() => parse("echo 'hello")).toThrow(ParseError);
      expect(() => parse("echo 'hello")).toThrow(/unterminated/i);
    });
  });

  // ── long flags ─────────────────────────────────────────────────────────────

  describe('long flags', () => {
    it('parses a boolean long flag', () => {
      expect(p('projects --featured').flags).toEqual({ featured: true });
    });

    it('parses a long flag with = value', () => {
      expect(p('projects --year=2024').flags).toEqual({ year: '2024' });
    });

    it('flag value is always a string when using = syntax', () => {
      const result = p('projects --year=2024');
      expect(typeof result.flags.year).toBe('string');
    });

    it('parses a long flag with space-separated value (greedy)', () => {
      expect(p('projects --year 2024').flags).toEqual({ year: '2024' });
    });

    it('greedy: space-separated value is consumed — not left as positional arg', () => {
      const result = p('projects --year 2024');
      expect(result.flags.year).toBe('2024');
      expect(result.args).toEqual([]);
    });

    it('greedy does NOT consume the next token when it starts with -', () => {
      // --featured is followed by --year=2024, so featured stays boolean
      const result = p('projects --featured --year=2024');
      expect(result.flags.featured).toBe(true);
      expect(result.flags.year).toBe('2024');
    });

    it('parses multiple boolean flags', () => {
      const result = p('ls --all --long');
      expect(result.flags).toEqual({ all: true, long: true });
    });

    it('parses a mix of = and boolean long flags', () => {
      const result = p('projects --featured --year=2024');
      expect(result.flags).toEqual({ featured: true, year: '2024' });
    });

    it('parses flags and positional args together (arg before flag)', () => {
      // ⚠ positional args must come BEFORE bare --key flags to avoid greedy capture
      const result = p('projects quill --featured --year=2024');
      expect(result.name).toBe('projects');
      expect(result.args).toEqual(['quill']);
      expect(result.flags).toEqual({ featured: true, year: '2024' });
    });

    it('handles flag at end of input with no trailing tokens', () => {
      expect(p('projects --featured').flags.featured).toBe(true);
    });

    it('parses flag with an empty value via =', () => {
      // Degenerate but should not crash
      expect(p('cmd --key=').flags.key).toBe('');
    });
  });

  // ── short flags ────────────────────────────────────────────────────────────

  describe('short flags', () => {
    it('parses a single-char short flag as boolean', () => {
      expect(p('ls -l').flags).toEqual({ l: true });
    });

    it('parses multiple short flags', () => {
      const result = p('ls -l -a');
      expect(result.flags).toEqual({ l: true, a: true });
    });

    it('treats multi-char short flags as a single key (not expanded)', () => {
      // -rf → key is 'rf' (boolean), not r=true, f=true
      expect(p('rm -rf').flags).toEqual({ rf: true });
    });

    it('short flags do not consume the next token as value', () => {
      // Short flags are boolean-only per spec
      const result = p('ls -n 10');
      expect(result.flags.n).toBe(true);
      expect(result.args).toEqual(['10']);
    });
  });

  // ── mixed ──────────────────────────────────────────────────────────────────

  describe('mixed args and flags', () => {
    it('full example: projects slug + two flags', () => {
      const result = p('projects quill --featured --year=2024');
      expect(result.name).toBe('projects');
      expect(result.args).toEqual(['quill']);
      expect(result.flags).toEqual({ featured: true, year: '2024' });
      expect(result.raw).toBe('projects quill --featured --year=2024');
    });

    it('command with short and long flags', () => {
      const result = p('ls -l --all');
      expect(result.flags).toEqual({ l: true, all: true });
    });

    it('quoted arg inside a flag-heavy command', () => {
      const result = p('echo "hello world" --tone=success');
      expect(result.args).toEqual(['hello world']);
      expect(result.flags).toEqual({ tone: 'success' });
    });
  });

  // ── edge cases ─────────────────────────────────────────────────────────────

  describe('edge cases', () => {
    it('a lone -- token is treated as a positional arg', () => {
      // '--' alone is length 2 but fails the >2 check; treated as positional
      expect(p('cmd --').args).toEqual(['--']);
    });

    it('a lone - token is treated as a positional arg', () => {
      expect(p('cmd -').args).toEqual(['-']);
    });

    it('flag names with hyphens are preserved', () => {
      // --dry-run → flags['dry-run'] = true
      expect(p('deploy --dry-run').flags['dry-run']).toBe(true);
    });

    it('flag names with hyphens and value', () => {
      expect(p('deploy --output-dir=dist').flags['output-dir']).toBe('dist');
    });

    it('does not mutate the input string', () => {
      const input = '  about  ';
      parse(input);
      expect(input).toBe('  about  ');
    });
  });
});
