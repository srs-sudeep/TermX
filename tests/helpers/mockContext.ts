/**
 * mockContext.ts
 * Factory that returns a full CommandContext with sane defaults for tests.
 *
 * Uses the real `userConfig` from src/config as the default config so tests
 * exercise actual portfolio data. Override any field per-call.
 *
 * @example
 * const ctx = mockContext({ args: ['quill'], flags: {} });
 * const ctx = mockContext({ config: { ...userConfig, projects: [] } });
 * const ctx = mockContext({ currentTheme: 'nord' });
 */

import { vi } from 'vitest';
import { userConfig } from '@/config';
import type { CommandContext, UserConfig } from '@/types';

interface MockContextOverrides {
  /** Positional arguments. Defaults to []. */
  args?: string[];
  /** Named flags. Defaults to {}. */
  flags?: Record<string, string | boolean>;
  /** Raw input string. Defaults to ''. */
  raw?: string;
  /** Full config override. Defaults to the real userConfig. */
  config?: UserConfig;
  /** Name of the currently active theme. Defaults to 'dracula'. */
  currentTheme?: string;
}

export function mockContext(overrides: MockContextOverrides = {}): CommandContext {
  return {
    args: overrides.args ?? [],
    flags: overrides.flags ?? {},
    raw: overrides.raw ?? '',
    config: overrides.config ?? userConfig,
    theme: {
      current: overrides.currentTheme ?? 'dracula',
      set: vi.fn(),
    },
    history: {
      all: () => [],
      clear: vi.fn(),
    },
    dispatch: vi.fn(),
  };
}
