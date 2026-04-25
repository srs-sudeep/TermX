# PHASE 8 DONE — Wire Dispatch + Core Commands

## Files created / modified

| File | Action | Purpose |
|---|---|---|
| `src/types/command.ts` | Modified | Added `dispatch` to `CommandContext`; added `settings-panel` to `CommandOutput` |
| `src/hooks/useTerminal.ts` | Created | Full command dispatch pipeline |
| `src/commands/index.ts` | Created | Barrel re-export of registry API |
| `src/commands/core/help.ts` | Created | Lists commands grouped by category |
| `src/commands/core/clear.ts` | Created | Returns `{ type: 'clear' }` (alias: cls, clr) |
| `src/commands/core/echo.ts` | Created | Echoes args as text |
| `src/commands/core/whoami.ts` | Created | User name, title, location, bio |
| `src/commands/core/pwd.ts` | Created | Returns `config.prompt.path` |
| `src/commands/core/date.ts` | Created | Current time in user's timezone |
| `src/commands/core/history.ts` | Created | Numbered command history list |
| `src/commands/core/man.ts` | Created | Manual page per command (hidden) |
| `src/commands/core/cd.ts` | Created | Dispatches to portfolio commands |
| `src/commands/core/ls.ts` | Created | Lists portfolio "directory" entries |

---

## `useTerminal.ts` — dispatch lifecycle

```
submit(input)
  ├── addToCommandHistory(input)       (skip if empty)
  ├── parse(input)                     → ParsedCommand | null | throws ParseError
  ├── registry.resolve(parsed.name)   → Command | undefined
  ├── appendOutput({ id, input, null }) ← placeholder entry
  ├── cmd.execute(ctx)                 → await Promise.resolve(...)
  └── match output.type:
       clear          → clearHistory()
       redirect       → window.open / window.location.href + updateOutput
       download       → <a>.click() + updateOutput
       *              → updateOutput(id, output)
```

### Module-level `idCounter`

Entry IDs use `entry-{timestamp}-{counter}` where the counter is a module-level `let` that increments on each `submit` call. This guarantees uniqueness even when multiple submits fire in the same millisecond (e.g. `cd` dispatching a nested command).

### Stale closure avoidance

All Zustand store actions are read via `.getState()` at call time rather than captured in the `useCallback` closure. Only `registry` (created via `useMemo`, stable for the session) is in the dependency array. This prevents stale closures and avoids unnecessary `submit` recreation.

### `dispatch` in context

`ctx.dispatch(input)` calls `submit(input)` fire-and-forget (`void`). The dispatched command creates its own history entry. Used by `cd` to delegate to portfolio commands.

---

## Core commands

| Command | Output type | Notes |
|---|---|---|
| `help` | `list` | Groups by category; filters `hidden: true`; calls `createRegistry()` internally |
| `clear` | `clear` | Aliases: `cls`, `clr` |
| `echo` | `text` | Args joined with spaces |
| `whoami` | `text` | Name, title, location + bio |
| `pwd` | `text` (muted) | Returns `config.prompt.path` |
| `date` | `text` (muted) | `toLocaleString` with user's IANA timezone |
| `history` | `text` (muted) | Numbered, oldest-first |
| `man` | `text` (muted) | `hidden: true`; autocompletes command names |
| `cd` | `text` (muted) | Dispatches to section command; autocompletes section names |
| `ls` | `text` | Lists portfolio "files" with descriptions |

### `cd` dispatch pattern

`cd about` calls `ctx.dispatch('about')`, which fires `submit('about')`. This creates two history entries:
1. `cd about  →  → about` (muted text)
2. `about  →  <about paragraphs>`

This is intentional — it mirrors how `source` works in bash and shows the user where they landed.

### `help` calls `createRegistry()` internally

This creates a fresh registry on each `help` invocation. Acceptable tradeoff: `help` is called rarely, and this avoids threading the registry through `CommandContext`. Tracked here for visibility.

---

## `settings-panel` output type — decision

`CommandOutput` now includes `| { type: 'settings-panel' }`. This was added so that:
- The `settings` command (Phase 10) returns `{ type: 'settings-panel' }` without importing `<SettingsPanel>`.
- `<OutputRenderer>` handles the rendering, keeping command files free of component imports.

Alternative considered: `{ type: 'jsx', element: <SettingsPanel /> }` — rejected because it would require the `settings` command to import from `@/components`, violating the command import rules.

---

## Follow-ups for later phases

- **Phase 11** (`fortune`, `neofetch`, etc.): Same command structure; add to `src/commands/fun/`.
- **Phase 13** (`useAutocomplete`): `registry.complete(partial)` is the engine; hook wires it to Tab key.
- **Phase 13** (`useCommandHistory`): ↑/↓ recall; the controlled input in `Terminal.tsx` is already prepared for this.
- **Phase 14** (tests): Add `tests/commands/help.test.ts`, `man.test.ts` with mock context.
