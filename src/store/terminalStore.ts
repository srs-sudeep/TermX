 

import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { HistoryEntry, CommandOutput } from '@/types';

const MAX_COMMAND_HISTORY = 100;

interface TerminalState {
   
  history: HistoryEntry[];

  commandHistory: string[];

  appendOutput: (entry: HistoryEntry) => void;

  updateOutput: (id: string, output: CommandOutput) => void;

  clearHistory: () => void;

  addToCommandHistory: (command: string) => void;
}

export const useTerminalStore = create<TerminalState>()((set) => ({
  
  history: [],

  commandHistory: storage.get<string[]>('history', []),

  appendOutput: (entry) => {
    set((state) => ({ history: [...state.history, entry] }));
  },

  updateOutput: (id, output) => {
    set((state) => ({
      history: state.history.map((entry) =>
        entry.id === id ? { ...entry, output } : entry,
      ),
    }));
  },

  clearHistory: () => {
    set({ history: [] });
  },

  addToCommandHistory: (command) => {
    
    if (command.trim() === '') return;

    set((state) => {

      const updated = [...state.commandHistory, command].slice(-MAX_COMMAND_HISTORY);
      storage.set('history', updated);
      return { commandHistory: updated };
    });
  },
}));
