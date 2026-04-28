import command from '@/commands/portfolio/projects';
import { userConfig } from '@/config';
import { describe, expect, it } from 'vitest';
import { mockContext } from '../helpers/mockContext';

const allProjects = userConfig.projects;
const featuredProjects = allProjects.filter((p) => p.featured);
const projects2024 = allProjects.filter((p) => p.year === 2024);
const SAMPLE_SLUG = allProjects[0].slug;
const SAMPLE_NAME = allProjects[0].name;

describe('projects command', () => {
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

  describe('slug argument', () => {
    it('returns a single card for a known slug', () => {
      const out = command.execute(mockContext({ args: [SAMPLE_SLUG] }));
      expect(out).toMatchObject({ type: 'cards' });
      if (out.type !== 'cards') throw new Error('expected cards');
      expect(out.cards).toHaveLength(1);
      expect(out.cards[0].title).toBe(SAMPLE_NAME);
    });

    it('card subtitle is the project tagline', () => {
      const sample = allProjects[0];
      const out = command.execute(mockContext({ args: [sample.slug] }));
      if (out.type !== 'cards') throw new Error('expected cards');
      expect(out.cards[0].subtitle).toBe(sample.tagline);
    });

    it('card tags are the tech stack', () => {
      const sample = allProjects[0];
      const out = command.execute(mockContext({ args: [sample.slug] }));
      if (out.type !== 'cards') throw new Error('expected cards');
      expect(out.cards[0].tags).toEqual(sample.tech);
    });

    it('returns error for an unknown slug', () => {
      const out = command.execute(mockContext({ args: ['nonexistent-slug'] }));
      expect(out).toMatchObject({ type: 'error' });
      if (out.type !== 'error') throw new Error('expected error');
      expect(out.message).toMatch(/not found/i);
      expect(out.message).toContain('nonexistent-slug');
    });

    it('returns error when slug does not match after --featured filter', () => {
      const nonFeatured = allProjects.find((p) => !p.featured);
      if (!nonFeatured) return;
      const out = command.execute(
        mockContext({ args: [nonFeatured.slug], flags: { featured: true } }),
      );
      expect(out).toMatchObject({ type: 'error' });
    });
  });

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

  describe('--year flag', () => {
    it('returns only projects from the specified year', () => {
      const out = command.execute(mockContext({ flags: { year: '2024' } }));
      if (out.type !== 'cards' && out.type !== 'text') throw new Error('unexpected type');
      if (out.type === 'cards') {
        expect(out.cards).toHaveLength(projects2024.length);
      }
    });

    it('returns muted text when no projects match the year', () => {
      const out = command.execute(mockContext({ flags: { year: '1900' } }));
      expect(out).toMatchObject({ type: 'text', tone: 'muted' });
    });
  });

  describe('empty project list', () => {
    it('returns muted text when config.projects is empty', () => {
      const ctx = mockContext({ config: { ...userConfig, projects: [] } });
      const out = command.execute(ctx);
      expect(out).toMatchObject({ type: 'text', tone: 'muted' });
    });
  });

  describe('autocomplete', () => {
    it('returns slugs that start with the partial', () => {
      const ctx = mockContext();
      const prefix = SAMPLE_SLUG.slice(0, 2);
      const results = command.autocomplete?.(prefix, ctx) ?? [];
      expect(results).toContain(SAMPLE_SLUG);
    });

    it('returns all slugs for an empty partial', () => {
      const ctx = mockContext();
      const results = command.autocomplete?.('', ctx) ?? [];
      expect(results).toHaveLength(allProjects.length);
    });

    it('returns an empty array when nothing matches', () => {
      const ctx = mockContext();
      const results = command.autocomplete?.('zzz-nothing-here', ctx) ?? [];
      expect(results).toEqual([]);
    });
  });
});
