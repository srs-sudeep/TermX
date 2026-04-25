/**
 * src/types/index.ts
 * Barrel re-export for the termfolio type system.
 *
 * Import from '@/types' anywhere in the codebase.
 * This is one of only two allowed barrel files (the other is src/commands/index.ts).
 */

export type {
  // command.ts
  Command,
  CommandContext,
  CommandOutput,
  ListItem,
  Card,
  ParsedCommand,
} from './command';

export type {
  // config.ts
  UserConfig,
  Project,
  Skill,
  SkillCategory,
  Experience,
  Education,
  SocialLink,
  Settings,
} from './config';

export type {
  // theme.ts
  Theme,
  ThemeColors,
  ThemeFont,
} from './theme';

export type {
  // output.ts
  HistoryEntry,
} from './output';
