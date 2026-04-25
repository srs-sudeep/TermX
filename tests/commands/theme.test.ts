import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import command from '@/commands/system/theme';
import { mockContext } from '../helpers/mockContext';
import { themes } from '@/config';

// ── test setup ────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Fake timers prevent the preview revert from firing during tests and
  // contaminating the module-level previewTimer state.
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  // Restore document styles mutated by applyTheme.
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.cssText = '';
});

// Convenience: a known valid theme name and an invalid one.
const VALID_THEME = themes[0].name;   // e.g. 'dracula'
const INVALID_THEME = '__no_such_theme__';

// ── suite ──────────────────────────────────────────────────────────────────────

describe('theme command', () => {
  // ── theme / theme list ──────────────────────────────────────────────────────

  describe('theme (no args) / theme list', () => {
    it('returns a list output', () => {
      const out = command.execute(mockContext());
      expect(out).toMatchObject({ type: 'list' });
    });

    it('"theme list" also returns a list', () => {
      const out = command.execute(mockContext({ args: ['list'] }));
      expect(out).toMatchObject({ type: 'list' });
    });

    it('list items include all theme names', () => {
      const out = command.execute(mockContext());
      if (out.type !== 'list') throw new Error('expected list');
      const labels = out.items.map((i) => i.label);
      for (const t of themes) {
        // Each theme name appears somewhere — possibly with a ✓ suffix for the current theme.
        expect(labels.some((l) => l.includes(t.name))).toBe(true);
      }
    });

    it('marks the active theme with a ✓', () => {
      const ctx = mockContext({ currentTheme: VALID_THEME });
      const out = command.execute(ctx);
      if (out.type !== 'list') throw new Error('expected list');
      const marked = out.items.find((i) => i.label.includes('✓'));
      expect(marked).toBeDefined();
      expect(marked!.label).toContain(VALID_THEME);
    });
  });

  // ── theme set ──────────────────────────────────────────────────────────────

  describe('theme set', () => {
    it('returns success text when a valid theme name is given', () => {
      const ctx = mockContext({ args: ['set', VALID_THEME] });
      const out = command.execute(ctx);
      expect(out).toMatchObject({ type: 'text', tone: 'success' });
    });

    it('calls ctx.theme.set with the theme name', () => {
      const ctx = mockContext({ args: ['set', VALID_THEME] });
      command.execute(ctx);
      expect(ctx.theme.set).toHaveBeenCalledWith(VALID_THEME);
    });

    it('applies the theme to the document (applyTheme side-effect)', () => {
      command.execute(mockContext({ args: ['set', VALID_THEME] }));
      // applyTheme writes data-theme on <html>
      expect(document.documentElement.dataset.theme).toBe(VALID_THEME);
    });

    it('returns error for an unknown theme name', () => {
      const out = command.execute(mockContext({ args: ['set', INVALID_THEME] }));
      expect(out).toMatchObject({ type: 'error' });
      if (out.type !== 'error') throw new Error('expected error');
      expect(out.message).toMatch(/not found/i);
    });

    it('returns error when theme name is omitted', () => {
      const out = command.execute(mockContext({ args: ['set'] }));
      expect(out).toMatchObject({ type: 'error' });
    });
  });

  // ── theme preview ──────────────────────────────────────────────────────────

  describe('theme preview', () => {
    it('returns muted text when a valid theme name is given', () => {
      const out = command.execute(mockContext({ args: ['preview', VALID_THEME] }));
      expect(out).toMatchObject({ type: 'text', tone: 'muted' });
    });

    it('applies the theme to the document immediately', () => {
      command.execute(mockContext({ args: ['preview', VALID_THEME] }));
      expect(document.documentElement.dataset.theme).toBe(VALID_THEME);
    });

    it('does NOT call ctx.theme.set (no persistence)', () => {
      const ctx = mockContext({ args: ['preview', VALID_THEME] });
      command.execute(ctx);
      expect(ctx.theme.set).not.toHaveBeenCalled();
    });

    it('reverts the theme after 10 seconds', () => {
      const revertTheme = 'monokai';
      const ctx = mockContext({ args: ['preview', VALID_THEME], currentTheme: revertTheme });
      command.execute(ctx);

      // Advance time to just before the revert — theme should still be the preview.
      vi.advanceTimersByTime(9_999);
      expect(document.documentElement.dataset.theme).toBe(VALID_THEME);

      // Cross the 10-second mark — revert fires.
      vi.advanceTimersByTime(1);
      expect(document.documentElement.dataset.theme).toBe(revertTheme);
    });

    it('returns error for an unknown theme name', () => {
      const out = command.execute(mockContext({ args: ['preview', INVALID_THEME] }));
      expect(out).toMatchObject({ type: 'error' });
    });

    it('returns error when theme name is omitted', () => {
      const out = command.execute(mockContext({ args: ['preview'] }));
      expect(out).toMatchObject({ type: 'error' });
    });
  });

  // ── unknown subcommand ─────────────────────────────────────────────────────

  describe('unknown subcommand', () => {
    it('returns error for an unrecognised subcommand', () => {
      const out = command.execute(mockContext({ args: ['foobar'] }));
      expect(out).toMatchObject({ type: 'error' });
      if (out.type !== 'error') throw new Error('expected error');
      expect(out.message).toMatch(/unknown subcommand/i);
    });
  });

  // ── autocomplete ───────────────────────────────────────────────────────────

  describe('autocomplete', () => {
    it('returns the three subcommands when no input', () => {
      const ctx = mockContext({ raw: 'theme' });
      const results = command.autocomplete?.('', ctx) ?? [];
      expect(results).toContain('list');
      expect(results).toContain('set');
      expect(results).toContain('preview');
    });

    it('returns theme names when subcommand is "set"', () => {
      const ctx = mockContext({ raw: 'theme set' });
      const results = command.autocomplete?.('', ctx) ?? [];
      for (const t of themes) {
        expect(results).toContain(t.name);
      }
    });

    it('filters theme names by prefix', () => {
      const ctx = mockContext({ raw: 'theme set d' });
      const results = command.autocomplete?.('d', ctx) ?? [];
      expect(results).toContain('dracula');
      expect(results.every((r) => r.startsWith('d'))).toBe(true);
    });
  });
});
