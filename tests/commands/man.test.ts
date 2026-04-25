import { describe, it, expect } from 'vitest';
import command from '@/commands/core/man';
import { mockContext } from '../helpers/mockContext';

/**
 * man.test.ts
 *
 * `man` calls `createRegistry()` internally, so tests run against the full
 * real registry (all command files loaded via import.meta.glob).
 */
describe('man command', () => {
  // ── no args ────────────────────────────────────────────────────────────────

  it('returns error when no argument is provided', () => {
    const out = command.execute(mockContext({ args: [] }));
    expect(out).toMatchObject({ type: 'error' });
    if (out.type !== 'error') throw new Error('expected error');
    expect(out.message).toMatch(/usage/i);
  });

  // ── unknown command ────────────────────────────────────────────────────────

  it('returns error for an unknown command name', () => {
    const out = command.execute(mockContext({ args: ['__no_such_command__'] }));
    expect(out).toMatchObject({ type: 'error' });
    if (out.type !== 'error') throw new Error('expected error');
    expect(out.message).toMatch(/no manual entry/i);
    expect(out.message).toContain('__no_such_command__');
  });

  // ── happy path — known commands ────────────────────────────────────────────

  it('returns text output for a known command', () => {
    const out = command.execute(mockContext({ args: ['about'] }));
    expect(out).toMatchObject({ type: 'text', tone: 'muted' });
  });

  it('output includes the NAME section', () => {
    const out = command.execute(mockContext({ args: ['about'] }));
    if (out.type !== 'text') throw new Error('expected text');
    expect(out.content).toContain('NAME');
    expect(out.content).toContain('about');
  });

  it('output includes the DESCRIPTION section', () => {
    const out = command.execute(mockContext({ args: ['about'] }));
    if (out.type !== 'text') throw new Error('expected text');
    expect(out.content).toContain('DESCRIPTION');
  });

  it('output includes USAGE when the command declares a usage string', () => {
    // 'projects' has usage: 'projects [slug] [--featured] [--year=YYYY]'
    const out = command.execute(mockContext({ args: ['projects'] }));
    if (out.type !== 'text') throw new Error('expected text');
    expect(out.content).toContain('USAGE');
    expect(out.content).toContain('projects');
  });

  it('output includes ALIASES when the command has aliases', () => {
    // 'projects' has alias 'work'
    const out = command.execute(mockContext({ args: ['projects'] }));
    if (out.type !== 'text') throw new Error('expected text');
    expect(out.content).toContain('ALIASES');
    expect(out.content).toContain('work');
  });

  it('resolves a command by its alias', () => {
    // 'work' is an alias for 'projects'
    const out = command.execute(mockContext({ args: ['work'] }));
    expect(out).toMatchObject({ type: 'text', tone: 'muted' });
    if (out.type !== 'text') throw new Error('expected text');
    // The manual page should be for 'projects', not 'work'
    expect(out.content).toContain('projects');
  });

  it('resolves the "clear" command by its alias "cls"', () => {
    const out = command.execute(mockContext({ args: ['cls'] }));
    expect(out).toMatchObject({ type: 'text', tone: 'muted' });
    if (out.type !== 'text') throw new Error('expected text');
    expect(out.content).toContain('clear');
  });

  it('works for hidden commands (man is itself hidden)', () => {
    // 'man' is hidden:true but should still have a manual entry via createRegistry
    const out = command.execute(mockContext({ args: ['man'] }));
    expect(out).toMatchObject({ type: 'text', tone: 'muted' });
  });

  // ── autocomplete ───────────────────────────────────────────────────────────

  it('autocomplete returns command names starting with the partial', () => {
    const ctx = mockContext();
    const results = command.autocomplete?.('ab', ctx) ?? [];
    expect(results).toContain('about');
  });

  it('autocomplete returns empty array for unmatched partial', () => {
    const ctx = mockContext();
    const results = command.autocomplete?.('zzz', ctx) ?? [];
    expect(results).toEqual([]);
  });
});
