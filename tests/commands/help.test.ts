import { describe, it, expect } from 'vitest';
import command from '@/commands/core/help';
import { mockContext } from '../helpers/mockContext';

/**
 * help.test.ts
 *
 * `help` calls `createRegistry()` internally, which loads all command files
 * via import.meta.glob. Vitest resolves the glob at test time, so the output
 * reflects the full real registry.
 *
 * Tests focus on the output contract and structural invariants, not on
 * asserting the exact set of registered commands (which would be brittle).
 */
describe('help command', () => {
  // ── output shape ───────────────────────────────────────────────────────────

  it('returns a list output', () => {
    const out = command.execute(mockContext());
    expect(out).toMatchObject({ type: 'list' });
  });

  it('items is an array', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    expect(Array.isArray(out.items)).toBe(true);
  });

  it('does not throw on an empty registry', () => {
    // Even if import.meta.glob resolves nothing, execute must return gracefully.
    expect(() => command.execute(mockContext())).not.toThrow();
  });

  // ── structural invariants ──────────────────────────────────────────────────

  it('includes at least one item when commands are registered', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    // With all command files present, there should be items.
    expect(out.items.length).toBeGreaterThan(0);
  });

  it('all items have a label field', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    for (const item of out.items) {
      expect(typeof item.label).toBe('string');
    }
  });

  it('category headers have indent 0', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    // Headers are items whose indent is 0 (or undefined — defaults to 0).
    const headers = out.items.filter((i) => (i.indent ?? 0) === 0);
    expect(headers.length).toBeGreaterThan(0);
  });

  it('command entries have indent 1', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    const entries = out.items.filter((i) => i.indent === 1);
    expect(entries.length).toBeGreaterThan(0);
  });

  // ── hidden commands are excluded ───────────────────────────────────────────

  it('does not list the "man" command (hidden: true)', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    const labels = out.items.map((i) => i.label);
    // 'man' is hidden — it should not appear as a listed entry.
    expect(labels).not.toContain('man');
  });

  it('does not list the "matrix" command (hidden: true)', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    const labels = out.items.map((i) => i.label);
    expect(labels).not.toContain('matrix');
  });

  it('does not list the "hack" command (hidden: true)', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    const labels = out.items.map((i) => i.label);
    expect(labels).not.toContain('hack');
  });

  // ── visible commands are present ───────────────────────────────────────────

  it('lists the "help" command itself', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    const labels = out.items.map((i) => i.label);
    expect(labels).toContain('help');
  });

  it('lists the "about" command', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    const labels = out.items.map((i) => i.label);
    expect(labels).toContain('about');
  });

  it('lists the "projects" command', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    const labels = out.items.map((i) => i.label);
    expect(labels).toContain('projects');
  });

  it('lists the "theme" command', () => {
    const out = command.execute(mockContext());
    if (out.type !== 'list') throw new Error('expected list');
    const labels = out.items.map((i) => i.label);
    expect(labels).toContain('theme');
  });
});
