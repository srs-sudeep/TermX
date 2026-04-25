# PHASE 6 DONE — Terminal UI Shell

## Files created / modified

| File | Purpose |
|---|---|
| `src/components/terminal/Prompt.tsx` | Renders `{user}@{host}:{path}$` with token substitution |
| `src/components/terminal/Cursor.tsx` | Blinking block cursor (`cursor-blink` CSS class from globals.css) |
| `src/components/terminal/TerminalInput.tsx` | Controlled input: Enter=submit, Ctrl+C/U=clear line |
| `src/components/terminal/TerminalHistory.tsx` | Renders `HistoryEntry[]` from store; uses `<OutputRenderer>` |
| `src/components/terminal/Terminal.tsx` | Main terminal container; owns scroll + input state + shortcuts |
| `src/components/shell/TitleBar.tsx` | macOS-style traffic-light title bar (cosmetic only) |
| `src/components/shell/AppShell.tsx` | Root layout: calls `useTheme`, renders TitleBar + Terminal |
| `src/hooks/useScrollToBottom.ts` | Generic hook — scrolls a ref'd container on dep change |
| `src/hooks/useKeyboardShortcuts.ts` | Document-level Ctrl+L/C/U listener |
| `src/App.tsx` | Updated — now renders `<AppShell />` |

---

## Architecture

```
AppShell          ← calls useTheme() once; flex column
  TitleBar        ← decorative chrome, no close behavior
  Terminal        ← flex-1, scroll container
    TerminalHistory ← role="log" aria-live="polite"
      (history entries × OutputRenderer)
    TerminalInput ← controlled; autoFocus; Prompt + <input>
```

---

## Component decisions

### `TerminalInput` — controlled

Input value and `onChange` are owned by `Terminal.tsx` (not inside `TerminalInput`). This lets Phase 13's `useCommandHistory` override the value for ↑/↓ recall without re-architecting the component.

### `Cursor` — CSS animation

The `cursor-blink` class uses a `@keyframes` animation defined in `globals.css`. A `@media (prefers-reduced-motion: reduce)` rule in the same file disables it automatically — no JavaScript needed.

### `useScrollToBottom` — general deps array

The hook accepts `unknown[]` deps rather than reading from the store directly. This keeps the hook framework-agnostic (usable with any list, not just terminal history).

### `useKeyboardShortcuts` — document listener

Attached at the document level so Ctrl+L works even when the terminal input isn't focused (e.g. after clicking a link in output). `e.preventDefault()` prevents Ctrl+L from opening the browser address bar.

### `AppShell` — single call site for `useTheme`

`useTheme()` is called exactly once here. No Provider or context is needed since Zustand stores are module-level singletons.

---

## Accessibility

- `TerminalHistory`: `role="log"` + `aria-live="polite"` — screen readers announce new output without interrupting speech.
- `TerminalInput`: `aria-label="Terminal command input"` on the `<input>`.
- `TitleBar` traffic lights: `aria-hidden="true"` — decorative only.
- `Terminal` click handler: skips `<a>` and `<button>` clicks so links in output remain clickable without re-focusing the input.

---

## Follow-ups for later phases

- **Phase 8**: `Terminal.tsx` already wires `onSubmit={submit}` from `useTerminal` — no Phase 6 → Phase 8 migration needed.
- **Phase 13** (`useCommandHistory`): Add ↑/↓ navigation in `TerminalInput`. The controlled value pattern makes this a zero-refactor addition.
- **Phase 13** (`useAutocomplete`): Tab key handling goes in `TerminalInput.handleKeyDown`.
- **Phase 12** (boot sequence): `AppShell` is the right place to render `<BootSequence>` before `<Terminal>`.
