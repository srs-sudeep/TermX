import type { Command } from '@/types';

export default {
  name: 'sudo',
  description: 'Run a command as superuser',
  usage: 'sudo <command>',
  category: 'fun',
  execute: () => ({
    type: 'error',
    message: 'Permission denied: nice try.',
  }),
} satisfies Command;
