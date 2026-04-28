import type { ReactNode } from 'react';
import type { UserConfig } from './config';

export interface ListItem {
  label: string;

  value?: string;

  url?: string;

  indent?: number;
}

export interface Card {
  title: string;

  subtitle?: string;

  body?: string;

  tags?: string[];

  links?: Array<{ label: string; url: string }>;

  bullets?: string[];
}

export type CommandOutput =
  | {
      type: 'text';
      content: string;

      tone?: 'normal' | 'success' | 'error' | 'warning' | 'muted';
    }
  | { type: 'list'; items: ListItem[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'cards'; cards: Card[] }
  | { type: 'jsx'; element: ReactNode }
  | { type: 'settings-panel' }
  | { type: 'matrix' }
  | { type: 'hack' }
  | { type: 'banner' }
  | { type: 'welcome' }
  | { type: 'clear' }
  | { type: 'redirect'; url: string; newTab?: boolean }
  | { type: 'download'; url: string; filename: string }
  | { type: 'error'; message: string };

export interface CommandContext {
  args: string[];

  flags: Record<string, string | boolean>;

  raw: string;

  config: UserConfig;

  theme: {
    current: string;

    set: (name: string) => void;
  };

  history: {
    all: () => string[];

    clear: () => void;
  };

  dispatch: (input: string) => void;
}

export interface Command {
  name: string;

  aliases?: string[];

  description: string;

  usage?: string;

  category: 'core' | 'portfolio' | 'system' | 'fun' | 'custom';

  hidden?: boolean;

  execute: (ctx: CommandContext) => CommandOutput | Promise<CommandOutput>;

  autocomplete?: (partial: string, ctx: CommandContext) => string[];
}

export interface ParsedCommand {
  name: string;

  args: string[];

  flags: Record<string, string | boolean>;

  raw: string;
}
