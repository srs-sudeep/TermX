import { useCallback, useMemo, useState } from 'react';
import { useTerminalStore } from '@/store/terminalStore';
import { useThemeStore } from '@/store/themeStore';
import { createRegistry } from '@/lib/commandRegistry';
import { parse, ParseError } from '@/lib/commandParser';
import { userConfig } from '@/config';
import type { CommandContext, CommandOutput } from '@/types';

let idCounter = 0;

export function useTerminal() {
  const registry = useMemo(() => createRegistry(), []);
  const [isProcessing, setIsProcessing] = useState(false);

  const submit = useCallback(
    async (input: string) => {
      const timestamp = Date.now();
      const id = `entry-${timestamp}-${idCounter++}`;

      const { appendOutput, updateOutput, clearHistory, addToCommandHistory } =
        useTerminalStore.getState();
      const { currentTheme, setTheme } = useThemeStore.getState();

      if (input.trim()) {
        addToCommandHistory(input);
      }

      let parsed;
      try {
        parsed = parse(input);
      } catch (e) {
        if (e instanceof ParseError) {
          appendOutput({
            id,
            input,
            output: { type: 'error', message: e.message },
            timestamp,
          });
          return;
        }
        throw e;
      }

      if (!parsed) {
        appendOutput({ id, input: '', output: null, timestamp });
        return;
      }

      const cmd = registry.resolve(parsed.name);
      if (!cmd) {
        appendOutput({
          id,
          input,
          output: {
            type: 'error',
            message: `command not found: ${parsed.name}. Type "help" to see available commands.`,
          },
          timestamp,
        });
        return;
      }

      const ctx: CommandContext = {
        args: parsed.args,
        flags: parsed.flags,
        raw: parsed.raw,
        config: userConfig,
        theme: {
          current: currentTheme,
          set: setTheme,
        },
        history: {
          all: () => useTerminalStore.getState().commandHistory,
          clear: clearHistory,
        },
        dispatch: (newInput: string) => {
          void submit(newInput);
        },
      };

      appendOutput({ id, input, output: null, timestamp });
      setIsProcessing(true);

      let output: CommandOutput;
      try {
        output = await Promise.resolve(cmd.execute(ctx));
      } catch (e) {
        output = {
          type: 'error',
          message: `internal error: ${e instanceof Error ? e.message : String(e)}`,
        };
      } finally {
        setIsProcessing(false);
      }

      if (output.type === 'clear') {
        clearHistory();
        return;
      }

      if (output.type === 'redirect') {
        const isExternal = output.newTab !== false;
        if (isExternal) {
          window.open(output.url, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = output.url;
        }
        updateOutput(id, {
          type: 'text',
          content: `→ ${output.url}`,
          tone: 'muted',
        });
        return;
      }

      if (output.type === 'download') {
        const a = document.createElement('a');
        a.href = output.url;
        a.download = output.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        updateOutput(id, {
          type: 'text',
          content: `Downloading ${output.filename}…`,
          tone: 'success',
        });
        return;
      }

      updateOutput(id, output);
    },
    [registry],
  );

  return { submit, isProcessing, registry };
}
