# Rules: commands

Read this file before creating, editing, or moving any file under `src/commands/` or touching `commandRegistry` / `commandParser`.

---

## 1. File location

| Category                       | Path                                                  |
| ------------------------------ | ----------------------------------------------------- |
| Core (unix-like)               | `src/commands/core/<name>.ts`                         |
| Portfolio                      | `src/commands/portfolio/<name>.ts`                    |
| System (theme, font, settings) | `src/commands/system/<name>.ts`                       |
| Fun / easter eggs              | `src/commands/fun/<name>.ts`                          |
| User-defined                   | **Not here.** Goes in `src/config/commands.config.ts` |

One command per file. Filename = command name (lowercase, kebab-case if multi-word, but prefer one word).

## 2. The `Command` contract

```ts
export default {
  name: "about",
  aliases: ["bio"],
  description: "Who am I",
  usage: "about",
  category: "portfolio",
  execute: (ctx) => ({
    type: "text",
    content: ctx.config.about.paragraphs.join("\n\n"),
  }),
} satisfies Command;
```

**Required:** `name`, `description`, `category`, `execute`.
**Optional:** `aliases`, `usage`, `hidden`, `autocomplete`.

Use `satisfies Command` — never `as Command`. `satisfies` keeps the literal types.

Export as `default`. The registry's `import.meta.glob` expects default exports.

## 3. Output types — when to use which

| Output type | Use for                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| `text`      | Single-block prose. Use `tone` for color (success/error/warning/muted). |
| `list`      | Bulleted items — social links, skills, project summaries.               |
| `table`     | Aligned columns — experience, skills with levels, help output.          |
| `cards`     | Rich project detail, experience with bullets.                           |
| `error`     | Anything the user did wrong. Don't throw.                               |
| `redirect`  | Opening URLs (email, social). Set `newTab: true` by default.            |
| `download`  | Resume download.                                                        |
| `clear`     | `clear` command only.                                                   |
| `jsx`       | Last resort — animations, custom effects.                               |

**Don't mix output types to fake formatting.** If you need a heading + list, return a list whose first item is the heading styled as muted text, or use `jsx`.

## 4. Error handling

Errors are **output**, not exceptions. `execute` must return, never throw.

```ts
execute: (ctx) => {
  const slug = ctx.args[0];
  if (!slug) {
    return { type: 'error', message: 'Usage: projects <slug>' };
  }
  const project = ctx.config.projects.find(p => p.slug === slug);
  if (!project) {
    return { type: 'error', message: `Project not found: ${slug}` };
  }
  return { type: 'cards', cards: [toCard(project)] };
},
```

If something truly unexpected happens (e.g. a bad config shape), returning `{ type: 'error', message: 'internal: <what went wrong>' }` is acceptable. The dispatcher in `useTerminal` wraps thrown errors too, but don't rely on that — return cleanly.

## 5. Async commands

`execute` may be `async`. The renderer will show a `...` placeholder while awaiting. Keep awaits < 2 seconds; if you need longer, use `jsx` output with your own loading UI.

## 6. Autocomplete

Implement when there's a finite known set of second-position args:

```ts
autocomplete: (partial, ctx) =>
  ctx.config.projects
    .map(p => p.slug)
    .filter(slug => slug.startsWith(partial)),
```

The hook `useAutocomplete` passes the tail of the input after the command name. Don't return more than ~20 suggestions — beyond that it's noise.

## 7. Aliases

Keep them short and obvious: `bio → about`, `cv → resume`, `cls → clear`, `work → experience`. Aliases must be unique across all commands (registry throws on collision at build time).

## 8. Hidden commands

`hidden: true` omits the command from `help` but keeps it callable. Use for easter eggs (`hack`, `matrix`) and `man` itself. Don't hide portfolio commands.

## 9. Categories

A command has exactly one category. If you're about to invent a sixth, stop and ask.

## 10. Config access

Commands read config via `ctx.config`. **Never import from `@/config` directly** — the context is injected so tests can pass mock configs. Lint rule enforces this.

## 11. What commands must not do

- Import from `@/components` or `@/hooks`.
- Mutate stores directly. Use what's exposed on `ctx` (e.g. `ctx.theme.set(...)`).
- Touch `window` / `document` beyond `ctx.*`. Side effects go through context helpers.
- Do network requests. This is a frontend-only, offline-capable site.

## 12. Testing expectations

For every new command, add a test covering:

- The happy path — verify the output type and shape.
- One error path — bad args or missing data.

Don't snapshot. Assert specific fields. See `.claude/rules/testing.md`.

## 13. Minimal example — reference

```ts
// src/commands/portfolio/email.ts
import type { Command } from "@/types";

export default {
  name: "email",
  description: "Send me an email",
  usage: "email",
  category: "portfolio",
  execute: (ctx) => ({
    type: "redirect",
    url: `mailto:${ctx.config.contact.email}`,
    newTab: false,
  }),
} satisfies Command;
```

## 14. Rich example — reference

```ts
// src/commands/portfolio/projects.ts
import type { Command, Project } from "@/types";

function toCard(p: Project) {
  return {
    title: p.name,
    subtitle: p.tagline,
    body: p.description,
    tags: p.tech,
    links: Object.entries(p.links)
      .filter(([, v]) => v)
      .map(([k, v]) => ({ label: k, url: v! })),
  };
}

export default {
  name: "projects",
  aliases: ["work"],
  description: "My projects",
  usage: "projects [slug] [--featured] [--year=YYYY]",
  category: "portfolio",
  execute: (ctx) => {
    const { args, flags, config } = ctx;
    let list = config.projects;
    if (flags.featured) list = list.filter((p) => p.featured);
    if (flags.year)
      list = list.filter((p) => String(p.year) === String(flags.year));
    if (args[0]) {
      const found = list.find((p) => p.slug === args[0]);
      if (!found) return { type: "error", message: `No project: ${args[0]}` };
      return { type: "cards", cards: [toCard(found)] };
    }
    if (list.length === 0)
      return { type: "text", content: "No matching projects.", tone: "muted" };
    return { type: "cards", cards: list.map(toCard) };
  },
  autocomplete: (partial, ctx) =>
    ctx.config.projects.map((p) => p.slug).filter((s) => s.startsWith(partial)),
} satisfies Command;
```
