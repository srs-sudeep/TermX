import { describe, it, expect } from 'vitest';
import command from '@/commands/portfolio/projects';
import { mockContext } from '../helpers/mockContext';
import { userConfig } from '@/config';

// Convenience: projects from the real config
const allProjects = userConfig.projects;
const featuredProjects = allProjects.filter((p) => p.featured);
const projects2024 = allProjects.filter((p) => p.year === 2024);

describe('projects command', () => {
  // ── no args ────────────────────────────────────────────────────────────────

  describe('no args / no flags', () => {
    it('returns cards output', () => {
      const out = command.execute(mockContext());
      expect(out).toMatchObject({ type: 'cards' });
    });

    it('returns one card per project', () => {
      const out = command.execute(mockContext());
      if (out.type !== 'cards') throw new Error('expected cards');
      expect(out.cards).toHaveLength(allProjects.length);
    });

    it('card title matches the project name', () => {
      const out = command.execute(mockContext());
      if (out.type !== 'cards') throw new Error('expected cards');
      const titles = out.cards.map((c) => c.title);
      for (const p of allProjects) {
        expect(titles).toContain(p.name);
      }
    });
  });

  // ── single slug ────────────────────────────────────────────────────────────

  describe('slug argument', () => {
    it('returns a single card for a known slug', () => {
      const out = command.execute(mockContext({ args: ['quill'] }));
      expect(out).toMatchObject({ type: 'cards' });
      if (out.type !== 'cards') throw new Error('expected cards');
      expect(out.cards).toHaveLength(1);
      expect(out.cards[0].title).toBe('Quill');
    });

    it('card subtitle is the project tagline', () => {
      const quill = allProjects.find((p) => p.slug === 'quill')!;
      const out = command.execute(mockContext({ args: ['quill'] }));
      if (out.type !== 'cards') throw new Error('expected cards');
      expect(out.cards[0].subtitle).toBe(quill.tagline);
    });

    it('card tags are the tech stack', () => {
      const quill = allProjects.find((p) => p.slug === 'quill')!;
      const out = command.execute(mockContext({ args: ['quill'] }));
      if (out.type !== 'cards') throw new Error('expected cards');
      expect(out.cards[0].tags).toEqual(quill.tech);
    });

    it('returns error for an unknown slug', () => {
      const out = command.execute(mockContext({ args: ['nonexistent-slug'] }));
      expect(out).toMatchObject({ type: 'error' });
      if (out.type !== 'error') throw new Error('expected error');
      expect(out.message).toMatch(/not found/i);
      expect(out.message).toContain('nonexistent-slug');
    });

    it('returns error when slug does not match after --featured filter', () => {
      // 'wavelength' is not featured; with --featured the list is empty for that slug
      const out = command.execute(
        mockContext({ args: ['wavelength'], flags: { featured: true } }),
      );
      expect(out).toMatchObject({ type: 'error' });
    });
  });

  // ── --featured flag ────────────────────────────────────────────────────────

  describe('--featured flag', () => {
    it('returns only featured projects', () => {
      const out = command.execute(mockContext({ flags: { featured: true } }));
      if (out.type !== 'cards') throw new Error('expected cards');
      expect(out.cards).toHaveLength(featuredProjects.length);
    });

    it('every card in the result is a featured project', () => {
      const out = command.execute(mockContext({ flags: { featured: true } }));
      if (out.type !== 'cards') throw new Error('expected cards');
      const featuredNames = featuredProjects.map((p) => p.name);
      for (const card of out.cards) {
        expect(featuredNames).toContain(card.title);
      }
    });
  });

  // ── --year flag ────────────────────────────────────────────────────────────

  describe('--year flag', () => {
    it('returns only projects from the specified year', () => {
      const out = command.execute(mockContext({ flags: { year: '2024' } }));
      if (out.type !== 'cards') throw new Error('expected cards');
      expect(out.cards).toHaveLength(projects2024.length);
    });

    it('returns muted text when no projects match the year', () => {
      const out = command.execute(mockContext({ flags: { year: '1900' } }));
      expect(out).toMatchObject({ type: 'text', tone: 'muted' });
    });
  });

  // ── empty project list ─────────────────────────────────────────────────────

  describe('empty project list', () => {
    it('returns muted text when config.projects is empty', () => {
      const ctx = mockContext({ config: { ...userConfig, projects: [] } });
      const out = command.execute(ctx);
      expect(out).toMatchObject({ type: 'text', tone: 'muted' });
    });
  });

  // ── autocomplete ───────────────────────────────────────────────────────────

  describe('autocomplete', () => {
    it('returns slugs that start with the partial', () => {
      const ctx = mockContext();
      const results = command.autocomplete?.('q', ctx) ?? [];
      expect(results).toContain('quill');
    });

    it('returns all slugs for an empty partial', () => {
      const ctx = mockContext();
      const results = command.autocomplete?.('', ctx) ?? [];
      expect(results).toHaveLength(allProjects.length);
    });

    it('returns an empty array when nothing matches', () => {
      const ctx = mockContext();
      const results = command.autocomplete?.('zzz', ctx) ?? [];
      expect(results).toEqual([]);
    });

    it('does not return slugs that do not start with the partial', () => {
      const ctx = mockContext();
      const results = command.autocomplete?.('nex', ctx) ?? [];
      expect(results).not.toContain('quill');
    });
  });
});
