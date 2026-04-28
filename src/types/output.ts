import type { CommandOutput } from './command';

export interface HistoryEntry {
  id: string;

  input: string;

  output: CommandOutput | null;

  timestamp: number;
}
