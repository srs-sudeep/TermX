import { describe, it, expect, beforeEach } from 'vitest';
import { buildRegistry, createRegistry } from '@/lib/commandRegistry';
import type { Command, CommandOutput } from '@/types';

// ── test helpers ───────────────────────────────────────────────────────────────

/** Minimal valid CommandOutput for use in mock execute functions. */
const textOutput: CommandOutput = { type: 'text', content: 'ok' };

/**
 * Creates a minimal valid Command object.
 * All fields required by the Command interface are present; optional ones default.
 */
function makeCmd(
  name: string,
  opts: Partial<Omit<Command, 'name' | 'description' | 'category' | 'execute'>> & {
    description?: string;
    category?: Command['category'];
  } = {},
): Command {
  return {
    name,
    description: opts.description ?? `${name} command`,
    category: opts.category ?? 'core',
    execute: () => textOutput,
    aliases: opts.aliases,
    usage: opts.usage,
    hidden: opts.hidden,
    autocomplete: opts.autocomplete,
  };
}

// ── suite ──────────────────────────────────────────────────────────────────────

describe('commandRegistry', () => {
  // ── buildRegistry — empty ────────────────────────────────────────────────────

  describe('empty registry', () => {
    it('resolve returns undefined for any name', () => {
      const reg = buildRegistry([]);
      expect(reg.resolve('about')).toBeUndefined();
    });

    it('all() returns an empty array', () => {
      expect(buildRegistry([]).all()).toEqual([]);
    });

    it('byCategory() returns an empty array', () => {
      expect(buildRegistry([]).byCategory('portfolio')).toEqual([]);
    });

    it('complete() returns an empty array', () => {
      expect(buildRegistry([]).complete('a')).toEqual([]);
    });
  });

  // ── resolve — by name ────────────────────────────────────────────────────────

  describe('resolve by name', () => {
    it('finds a command by its exact name', () => {
      const cmd = makeCmd('about');
      const reg = buildRegistry([cmd]);
      expect(reg.resolve('about')).toBe(cmd);
    });

    it('resolve is case-insensitive', () => {
      const cmd = makeCmd('about');
      const reg = buildRegistry([cmd]);
      expect(reg.resolve('ABOUT')).toBe(cmd);
      expect(reg.resolve('About')).toBe(cmd);
    });

    it('returns undefined for an unknown command', () => {
      const reg = buildRegistry([makeCmd('about')]);
      expect(reg.resolve('notexist')).toBeUndefined();
    });
  });

  // ── resolve — aliases ────────────────────────────────────────────────────────

  describe('resolve by alias', () => {
    it('resolves a command by its alias', () => {
      const cmd = makeCmd('clear', { aliases: ['cls'] });
      const reg = buildRegistry([cmd]);
      expect(reg.resolve('cls')).toBe(cmd);
    });

    it('resolves by alias case-insensitively', () => {
      const cmd = makeCmd('clear', { aliases: ['cls'] });
      const reg = buildRegistry([cmd]);
      expect(reg.resolve('CLS')).toBe(cmd);
    });

    it('resolves multiple aliases for the same command', () => {
      const cmd = makeCmd('resume', { aliases: ['cv', 'download-cv'] });
      const reg = buildRegistry([cmd]);
      expect(reg.resolve('cv')).toBe(cmd);
      expect(reg.resolve('download-cv')).toBe(cmd);
    });

    it('resolves both the primary name and an alias for the same command', () => {
      const cmd = makeCmd('clear', { aliases: ['cls'] });
      const reg = buildRegistry([cmd]);
      expect(reg.resolve('clear')).toBe(cmd);
      expect(reg.resolve('cls')).toBe(cmd);
    });
  });

  // ── all() ────────────────────────────────────────────────────────────────────

  describe('all()', () => {
    it('returns all registered commands', () => {
      const cmds = [makeCmd('about'), makeCmd('projects'), makeCmd('clear')];
      expect(buildRegistry(cmds).all()).toHaveLength(3);
    });

    it('deduplicates: a command with aliases appears only once', () => {
      const cmd = makeCmd('clear', { aliases: ['cls', 'clr'] });
      const reg = buildRegistry([cmd]);
      // Even though 'clear', 'cls', 'clr' are all in the index, all() returns one entry
      expect(reg.all()).toHaveLength(1);
      expect(reg.all()[0]).toBe(cmd);
    });

    it('deduplicates across multiple commands each with aliases', () => {
      const clear = makeCmd('clear', { aliases: ['cls'] });
      const about = makeCmd('about', { aliases: ['bio'] });
      const reg = buildRegistry([clear, about]);
      expect(reg.all()).toHaveLength(2);
    });

    it('includes hidden commands', () => {
      const hidden = makeCmd('matrix', { hidden: true });
      const visible = makeCmd('about');
      const reg = buildRegistry([hidden, visible]);
      expect(reg.all()).toHaveLength(2);
    });
  });

  // ── byCategory() ─────────────────────────────────────────────────────────────

  describe('byCategory()', () => {
    let reg: ReturnType<typeof buildRegistry>;

    beforeEach(() => {
      reg = buildRegistry([
        makeCmd('help', { category: 'core' }),
        makeCmd('clear', { category: 'core', aliases: ['cls'] }),
        makeCmd('about', { category: 'portfolio' }),
        makeCmd('projects', { category: 'portfolio' }),
        makeCmd('theme', { category: 'system' }),
        makeCmd('matrix', { category: 'fun', hidden: true }),
      ]);
    });

    it('returns only commands in the specified category', () => {
      const portfolio = reg.byCategory('portfolio');
      expect(portfolio.map((c) => c.name)).toEqual(
        expect.arrayContaining(['about', 'projects']),
      );
      expect(portfolio.every((c) => c.category === 'portfolio')).toBe(true);
    });

    it('returns correct count for core category', () => {
      // help + clear (one command, even though clear has alias cls)
      expect(reg.byCategory('core')).toHaveLength(2);
    });

    it('deduplicates within a category (alias does not add extra entry)', () => {
      // clear has alias 'cls', but should count as one command
      const core = reg.byCategory('core');
      const names = core.map((c) => c.name);
      expect(names.filter((n) => n === 'clear')).toHaveLength(1);
    });

    it('returns empty array for a category with no commands', () => {
      expect(reg.byCategory('custom')).toEqual([]);
    });

    it('includes hidden commands in category results', () => {
      const fun = reg.byCategory('fun');
      expect(fun.map((c) => c.name)).toContain('matrix');
    });
  });

  // ── complete() ────────────────────────────────────────────────────────────────

  describe('complete()', () => {
    let reg: ReturnType<typeof buildRegistry>;

    beforeEach(() => {
      reg = buildRegistry([
        makeCmd('clear', { aliases: ['cls'] }),
        makeCmd('cd'),
        makeCmd('cowsay', { category: 'fun' }),
        makeCmd('about'),
        makeCmd('projects', { aliases: ['work'] }),
        makeCmd('matrix', { hidden: true }),
      ]);
    });

    it('returns names starting with the prefix', () => {
      expect(reg.complete('ab')).toEqual(['about']);
    });

    it('returns results sorted alphabetically', () => {
      const results = reg.complete('c');
      expect(results).toEqual([...results].sort());
    });

    it('returns both name and alias when both match the prefix', () => {
      // 'clear' and 'cls' both start with 'cl'
      expect(reg.complete('cl')).toEqual(expect.arrayContaining(['clear', 'cls']));
    });

    it('returns an alias that matches when the primary name does not', () => {
      // 'work' is an alias for 'projects'; 'w' matches 'work' but not 'projects'
      expect(reg.complete('w')).toContain('work');
      expect(reg.complete('w')).not.toContain('projects');
    });

    it('returns an empty array when nothing matches', () => {
      expect(reg.complete('xyz')).toEqual([]);
    });

    it('returns all keys for an empty partial', () => {
      // With 6 names + 2 aliases (cls, work) = 8 total keys
      const all = reg.complete('');
      expect(all.length).toBeGreaterThanOrEqual(6);
    });

    it('includes hidden commands in completions', () => {
      expect(reg.complete('mat')).toContain('matrix');
    });

    it('is case-insensitive', () => {
      expect(reg.complete('AB')).toEqual(['about']);
    });
  });

  // ── collision detection ───────────────────────────────────────────────────────

  describe('collision detection', () => {
    it('throws on duplicate command names', () => {
      const a = makeCmd('about');
      const b = makeCmd('about'); // same name, different object
      expect(() => buildRegistry([a, b])).toThrow(/duplicate command name/i);
    });

    it('throws when an alias conflicts with an existing command name', () => {
      const clear = makeCmd('clear');
      // 'cd' command exists; registering an alias 'cd' on another command conflicts
      const cd = makeCmd('cd');
      const bad = makeCmd('something', { aliases: ['cd'] }); // alias = existing name
      expect(() => buildRegistry([clear, cd, bad])).toThrow(/conflicts/i);
    });

    it('throws when an alias conflicts with another alias', () => {
      const a = makeCmd('alpha', { aliases: ['a'] });
      const b = makeCmd('beta', { aliases: ['a'] }); // same alias 'a'
      expect(() => buildRegistry([a, b])).toThrow(/conflicts/i);
    });

    it('does not throw for a registry with no collisions', () => {
      const cmds = [
        makeCmd('clear', { aliases: ['cls'] }),
        makeCmd('about', { aliases: ['bio'] }),
      ];
      expect(() => buildRegistry(cmds)).not.toThrow();
    });
  });

  // ── custom command override ───────────────────────────────────────────────────

  describe('custom command override (createRegistry merge behaviour)', () => {
    it('a later command with the same name (post-merge) replaces the earlier one', () => {
      // Simulate what createRegistry does before calling buildRegistry:
      // merge the built-in map, then override with custom.
      const builtin = makeCmd('about', { description: 'built-in about' });
      const custom = makeCmd('about', { description: 'custom about' });

      // Merge: custom wins
      const merged = new Map([[builtin.name, builtin]]);
      merged.set(custom.name, custom);

      const reg = buildRegistry([...merged.values()]);
      expect(reg.resolve('about')?.description).toBe('custom about');
    });

    it('custom command that introduces a new name is accessible', () => {
      const newCmd = makeCmd('spotify', { category: 'custom' });

      const merged = new Map<string, Command>();
      merged.set(newCmd.name, newCmd);

      const reg = buildRegistry([...merged.values()]);
      expect(reg.resolve('spotify')).toBe(newCmd);
    });
  });

  // ── createRegistry (smoke test) ───────────────────────────────────────────────

  describe('createRegistry()', () => {
    it('returns a Registry object with the expected methods', () => {
      // Phase 4 has no command files; the glob returns {}.
      // createRegistry() should still produce a valid (empty) registry.
      const reg = createRegistry();
      expect(typeof reg.resolve).toBe('function');
      expect(typeof reg.all).toBe('function');
      expect(typeof reg.byCategory).toBe('function');
      expect(typeof reg.complete).toBe('function');
    });

    it('resolve returns undefined for any name when no command files exist', () => {
      const reg = createRegistry();
      expect(reg.resolve('about')).toBeUndefined();
    });

    it('all() returns an empty array when no command files exist', () => {
      // customCommands in commands.config.ts is also empty in the starter config
      expect(createRegistry().all()).toHaveLength(0);
    });
  });
});
