import cd from '@/commands/core/cd';
import date from '@/commands/core/date';
import echo from '@/commands/core/echo';
import pwd from '@/commands/core/pwd';
import whoami from '@/commands/core/whoami';
import { userConfig } from '@/config';
import { describe, expect, it } from 'vitest';
import { mockContext } from '../helpers/mockContext';

describe('echo command', () => {
  it('returns text output joined by spaces', () => {
    const out = echo.execute(mockContext({ args: ['hello', 'world'] }));
    expect(out).toEqual({ type: 'text', content: 'hello world' });
  });

  it('returns empty content when no args', () => {
    const out = echo.execute(mockContext());
    expect(out).toMatchObject({ type: 'text', content: '' });
  });

  it('preserves a single argument', () => {
    const out = echo.execute(mockContext({ args: ['solo'] }));
    expect(out).toMatchObject({ type: 'text', content: 'solo' });
  });
});

describe('pwd command', () => {
  it('returns the current path from config', () => {
    const out = pwd.execute(mockContext());
    expect(out).toMatchObject({
      type: 'text',
      content: userConfig.prompt.path,
      tone: 'muted',
    });
  });
});

describe('whoami command', () => {
  it('returns text containing the user name', () => {
    const out = whoami.execute(mockContext());
    if (out.type !== 'text') throw new Error('expected text');
    expect(out.content).toContain(userConfig.user.name);
  });

  it('includes the title and location', () => {
    const out = whoami.execute(mockContext());
    if (out.type !== 'text') throw new Error('expected text');
    expect(out.content).toContain(userConfig.user.title);
    expect(out.content).toContain(userConfig.user.location);
  });

  it('includes the bio', () => {
    const out = whoami.execute(mockContext());
    if (out.type !== 'text') throw new Error('expected text');
    expect(out.content).toContain(userConfig.user.bio);
  });
});

describe('cd command', () => {
  it('lists available sections when called with no args', () => {
    const out = cd.execute(mockContext());
    if (out.type !== 'text') throw new Error('expected text');
    expect(out.content).toContain('about');
    expect(out.content).toContain('projects');
    expect(out.tone).toBe('muted');
  });

  it('returns error for an unknown section', () => {
    const out = cd.execute(mockContext({ args: ['nowhere'] }));
    expect(out).toMatchObject({ type: 'error' });
    if (out.type !== 'error') throw new Error('expected error');
    expect(out.message).toContain('nowhere');
  });

  it('dispatches the section command for a valid section', () => {
    const ctx = mockContext({ args: ['about'] });
    const out = cd.execute(ctx);
    expect(ctx.dispatch).toHaveBeenCalledWith('about');
    expect(out).toMatchObject({ type: 'text', tone: 'muted' });
  });

  it('treats input case-insensitively', () => {
    const ctx = mockContext({ args: ['ABOUT'] });
    const out = cd.execute(ctx);
    expect(ctx.dispatch).toHaveBeenCalledWith('about');
    expect(out.type).not.toBe('error');
  });

  describe('autocomplete', () => {
    it('returns sections matching the prefix', () => {
      const ctx = mockContext();
      const results = cd.autocomplete?.('p', ctx) ?? [];
      expect(results).toContain('projects');
    });

    it('returns an empty array when nothing matches', () => {
      const ctx = mockContext();
      const results = cd.autocomplete?.('zzz', ctx) ?? [];
      expect(results).toEqual([]);
    });
  });
});

describe('date command', () => {
  it('returns text output', () => {
    const out = date.execute(mockContext());
    expect(out.type).toBe('text');
  });

  it('returns non-empty content', () => {
    const out = date.execute(mockContext());
    if (out.type !== 'text') throw new Error('expected text');
    expect(out.content.length).toBeGreaterThan(0);
  });
});
