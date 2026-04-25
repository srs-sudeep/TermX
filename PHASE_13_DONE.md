# PHASE 13 DONE — History Recall, Autocomplete, Mobile

## Files created

| File | Purpose |
|---|---|
| `src/hooks/useCommandHistory.ts` | ↑/↓ arrow-key navigation through `commandHistory` |
| `src/hooks/useAutocomplete.ts` | Tab-key completion for command names and arguments |

## Files modified

| File | Change |
|---|---|
| `src/hooks/useTerminal.ts` | Returns `registry` in addition to `submit` and `isProcessing` |
| `src/components/terminal/Terminal.tsx` | Destructures `registry` from `useTerminal`; passes it to `TerminalInput` |
| `src/components/terminal/TerminalInput.tsx` | Accepts `registry` prop; integrates `useCommandHistory` + `useAutocomplete` |

---

## `useCommandHistory`

### State model

- `cursorRef: MutableRefObject<number | null>` — index into `commandHistory`; `null` = not navigating.
- `draftRef: MutableRefObject<string>` — value in the input before ArrowUp was first pressed.

### Behaviour

| Key | Cursor state | Action |
|---|---|---|
| ArrowUp | `null` (fresh) | Save draft; jump to `commandHistory.length - 1`; show that command |
| ArrowUp | `> 0` | Decrement cursor; show older command |
| ArrowUp | `=== 0` | Stay at oldest; show oldest command (no-op on cursor) |
| ArrowDown | `< commandHistory.length - 1` | Increment cursor; show newer command |
| ArrowDown | `=== commandHistory.length - 1` | Reset cursor to `null`; restore draft |
| ArrowDown | `null` | No-op (not navigating) |
| Enter / Ctrl+C / Ctrl+U | any | Call `resetCursor()` before clearing |

Store access happens via `useTerminalStore.getState()` inside the callback — no subscription, zero re-renders.

---

## `useAutocomplete`

### Logic

```
Tab pressed:
  tokens = value.split(/\s+/)
  if tokens.length === 1:
    matches = registry.complete(tokens[0])       // command-name completion
  else:
    cmd = registry.resolve(tokens[0])
    matches = cmd.autocomplete(tokens.slice(1).join(' '), ctx)   // arg completion

  if matches.length === 0 → no-op
  if matches.length === 1 → onChange(completion + ' ')
  if matches.length > 1   → appendCompletions(matches)  // list in terminal history
```

`appendCompletions` appends a `{ type: 'list' }` history entry directly via `useTerminalStore.getState().appendOutput(...)`. The entry has an empty `input` string (no prompt line rendered for it).

The minimal `CommandContext` passed to `cmd.autocomplete` has only `config` populated; all other fields are no-op stubs. Autocomplete functions are contractually required to only use `ctx.config`.

---

## `TerminalInput` keydown chain

```
onKeyDown:
  ArrowUp / ArrowDown → historyKeyDown (useCommandHistory)
  Tab                 → autocompleteKeyDown (useAutocomplete)
  Enter               → resetCursor(); onSubmit(value); onChange('')
  Ctrl+C / Ctrl+U     → resetCursor(); onChange('')
  (all other keys)    → fall through to native input handler
```

---

## Mobile notes

- `input[type="text"]` with `autoFocus` triggers soft keyboard on first load on mobile (Chrome/Safari iOS).
- Clicking anywhere inside the terminal re-focuses the input (handled by `Terminal.tsx` click handler), which re-opens the soft keyboard.
- The `100dvh` height on `AppShell` prevents overflow on mobile when the keyboard appears.
- Horizontal overflow on tables is scrollable via `overflow-x-auto` on `TableOutput` (from Phase 7).
- Tap targets (theme swatches, toggle buttons, gear icon) are all `≥ 44 px` in at least one axis.

---

## Reduced-motion notes

| Feature | Reduced-motion behaviour |
|---|---|
| `Cursor` blink | CSS animation disabled via `@media (prefers-reduced-motion: reduce)` in globals.css |
| `Typewriter` | Shows full text immediately; `onDone` fires synchronously |
| `MatrixRain` | No change — canvas animation runs normally (user explicitly invoked it) |
| `BootSequence` | Skipped entirely; `onDone(false)` fires immediately |

---

## Decisions

1. **`registry` returned from `useTerminal`** — the registry is stable (`useMemo([])`); returning it avoids creating a second registry instance in `useAutocomplete`.
2. **Autocomplete via `useTerminalStore.getState()` instead of subscription** — avoids re-renders on every command. The call happens inside the keydown handler, which is an event-driven context.
3. **`resetCursor()` on Enter/Ctrl+C/Ctrl+U** — ensures the next ArrowUp press starts from the newest entry, not from wherever the cursor was left.
4. **No cursor reset on typing** — matches standard shell behaviour: the user can navigate to a past command, edit it, and submit without losing navigation context.
5. **`appendCompletions` as a module-level function** — shared between command-name and argument completion; avoids duplication inside the hook callback.
