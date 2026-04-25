# Adding commands

You can add custom commands without touching the engine. There are two ways:

1. **Quick add** — add to `src/config/commands.config.ts`. Use this for simple commands.
2. **Full command file** — add a `.ts` file under `src/commands/`. Use this for commands with multiple subcommands, autocomplete, or complex logic.

---

## Quick add (config)

```ts
// src/config/commands.config.ts
import type { Command } from '@/types';

export const customCommands: Command[] = [
  {
    name: 'spotify',
    description: 'Open my Spotify profile',
    category: 'custom',
    execute: () => ({
      type: 'redirect',
      url: 'https://open.spotify.com/user/yourhandle',
      newTab: true,
    }),
  },
];
```

The command is auto-registered. Type `spotify` in the terminal.

---

## Full command file

Create `src/commands/portfolio/blog.ts`:

```ts
import type { Command } from '@/types';

export default {
  name: 'blog',
  aliases: ['posts'],
  description: 'Recent blog posts',
  usage: 'blog [slug]',
  category: 'portfolio',
  execute: (ctx) => {
    if (ctx.args[0]) {
      const post = ctx.config.blog?.find((p) => p.slug === ctx.args[0]);
      if (!post) return { type: 'error', message: `Post not found: ${ctx.args[0]}` };
      return { type: 'cards', cards: [{ title: post.title, body: post.excerpt }] };
    }
    return {
      type: 'list',
      items: (ctx.config.blog ?? []).map((p) => ({
        label: p.title,
        value: p.date,
        indent: 1,
      })),
    };
  },
  autocomplete: (partial, ctx) =>
    (ctx.config.blog ?? [])
      .map((p) => p.slug)
      .filter((s) => s.startsWith(partial)),
} satisfies Command;
```

The file is discovered automatically by `import.meta.glob`. No registration step needed.

---

## The `Command` contract

```ts
interface Command {
  name: string;              // required; unique across all commands
  aliases?: string[];        // optional shorthand names; must also be globally unique
  description: string;       // required; shown in help
  usage?: string;            // optional; shown by man <cmd>
  category: 'core' | 'portfolio' | 'system' | 'fun' | 'custom';
  hidden?: boolean;          // if true, omitted from help but still callable
  execute: (ctx: CommandContext) => CommandOutput | Promise<CommandOutput>;
  autocomplete?: (partial: string, ctx: CommandContext) => string[];
}
```

Always use `satisfies Command` — never `as Command`.

---

## Output types

| Type | When to use |
|---|---|
| `text` | Prose, single block. Use `tone` for colour (`success`, `error`, `warning`, `muted`). |
| `list` | Bulleted items with optional labels, values, and URLs. |
| `table` | Aligned columns with headers. |
| `cards` | Rich detail cards — projects, experience, etc. |
| `error` | User-facing errors. Prefixes with "error:" automatically. |
| `redirect` | Open a URL. Set `newTab: true` to open in a new tab. |
| `download` | Trigger a file download. |
| `banner` | The ASCII name banner. |
| `matrix` | Full-screen Matrix rain animation. |
| `hack` | Fake hacking animation. |
| `jsx` | Last resort — custom React content. |

**Don't throw from `execute`.** Return `{ type: 'error', message: '...' }` instead.

---

## Accessing config

Commands receive all user data through `ctx.config`. Never import from `@/config` directly — the context is injected so tests can pass mock configs.

```ts
execute: (ctx) => ({
  type: 'text',
  content: `Hi, I'm ${ctx.config.user.name}.`,
}),
```

---

## Async commands

`execute` can be async. The terminal shows a `...` spinner while awaiting.

```ts
execute: async (ctx) => {
  const data = await fetchSomething(ctx.args[0]);
  return { type: 'cards', cards: [toCard(data)] };
},
```

Keep async operations under 2 seconds. For longer work, use `jsx` output with your own loading UI.

---

## Theme and history helpers

```ts
execute: (ctx) => {
  // Read the current theme
  const theme = ctx.theme.current;   // e.g. 'dracula'

  // Switch themes
  ctx.theme.set('nord');

  // Clear terminal history
  ctx.history.clear();

  // Dispatch another command (like the user typed it)
  ctx.dispatch('about');

  return { type: 'text', content: `Switched from ${theme} to nord.` };
},
```

---

## Overriding a built-in command

Add a command with the same name to `customCommands`. Your version replaces the built-in:

```ts
export const customCommands: Command[] = [
  {
    name: 'whoami',
    description: 'Who am I',
    category: 'core',
    execute: () => ({
      type: 'text',
      content: 'A developer with good taste in terminal emulators.',
      tone: 'success',
    }),
  },
];
```

---

## Testing your command

Add a test in `tests/commands/blog.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import command from '@/commands/portfolio/blog';
import { mockContext } from '../helpers/mockContext';

describe('blog command', () => {
  it('returns a list of posts', () => {
    const out = command.execute(mockContext());
    expect(out).toMatchObject({ type: 'list' });
  });

  it('returns error for unknown slug', () => {
    const out = command.execute(mockContext({ args: ['nonexistent'] }));
    expect(out).toMatchObject({ type: 'error' });
  });
});
```

---

## Rules to remember

- Command files must not import from `@/components` or `@/hooks`.
- Commands must not mutate stores directly — use `ctx.theme.set`, `ctx.history.clear`.
- Commands must not make network requests.
- Aliases must be globally unique (the registry throws on collision at startup).
- The `execute` function must return, never throw.
