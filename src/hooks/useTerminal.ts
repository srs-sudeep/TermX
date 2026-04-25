import { useCallback, useMemo, useState } from 'react';
import { useTerminalStore } from '@/store/terminalStore';
import { useThemeStore } from '@/store/themeStore';
import { createRegistry } from '@/lib/commandRegistry';
import { parse, ParseError } from '@/lib/commandParser';
import { userConfig } from '@/config';
import type { CommandContext, CommandOutput } from '@/types';

/** Monotonically-increasing counter for stable entry IDs within a session. */
let idCounter = 0;

/**
 * The terminal dispatch hook.
 *
 * Creates the command registry once on mount, then exposes a `submit(input)`
 * function that runs the full lifecycle: parse → resolve → execute → render.
 *
 * Side-effect outputs (`clear`, `redirect`, `download`) are handled here
 * before the entry reaches the render layer.
 *
 * Returns `{ submit, isProcessing }` for use in `<Terminal>`.
 */
export function useTerminal() {
  // Registry is created once and never changes (stable across renders).
  const registry = useMemo(() => createRegistry(), []);
  const [isProcessing, setIsProcessing] = useState(false);

  const submit = useCallback(
    async (input: string) => {
      const timestamp = Date.now();
      const id = `entry-${timestamp}-${idCounter++}`;

      // Read store actions at call time to avoid stale closures.
      const { appendOutput, updateOutput, clearHistory, addToCommandHistory } =
        useTerminalStore.getState();
      const { currentTheme, setTheme } = useThemeStore.getState();

      // Persist non-empty inputs for ↑/↓ recall.
      if (input.trim()) {
        addToCommandHistory(input);
      }

      // ── Parse ─────────────────────────────────────────────────────────────
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

      // Blank Enter — record the prompt-only line with no output.
      if (!parsed) {
        appendOutput({ id, input: '', output: null, timestamp });
        return;
      }

      // ── Resolve ───────────────────────────────────────────────────────────
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

      // ── Build context ─────────────────────────────────────────────────────
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
          // Fire-and-forget; creates its own history entry.
          void submit(newInput);
        },
      };

      // ── Execute ───────────────────────────────────────────────────────────
      // Append a placeholder entry immediately (null output) so the prompt
      // line appears in history right away, even for async commands.
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

      // ── Handle side-effect outputs ────────────────────────────────────────

      if (output.type === 'clear') {
        // clearHistory wipes the placeholder entry too — that's correct.
        clearHistory();
        return;
      }

      if (output.type === 'redirect') {
        const isExternal = output.newTab !== false;
        if (isExternal) {
          window.open(output.url, '_blank', 'noopener,noreferrer');
        } else {
          // newTab: false is used for mailto: — won't actually navigate.
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

      // ── Normal output ─────────────────────────────────────────────────────
      updateOutput(id, output);
    },
    [registry],
  );

  return { submit, isProcessing, registry };
}
