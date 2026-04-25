# PHASE 3 DONE — Storage Adapter & Zustand Stores

## Files created

| File | Purpose |
|---|---|
| `src/lib/storage.ts` | Namespaced `localStorage` adapter with error fallbacks |
| `src/store/themeStore.ts` | Theme, font family, and font size state + persistence |
| `src/store/terminalStore.ts` | Terminal display history + command recall history |

---

## `src/lib/storage.ts`

### Public API

| Function | Signature | Notes |
|---|---|---|
| `storage.get` | `<T>(key, fallback: T) → T` | Reads `termfolio:{key}`, returns fallback on any error |
| `storage.set` | `<T>(key, value: T) → void` | Writes `termfolio:{key}`, silent fail on quota/privacy error |
| `storage.remove` | `(key) → void` | Removes `termfolio:{key}`, silent fail |

### Error cases handled

| Error | Cause | Behavior |
|---|---|---|
| `SecurityError` | Private browsing, cross-origin iframe | `get` returns fallback; `set`/`remove` no-op |
| `QuotaExceededError` | localStorage full | `set` no-op; existing values still readable |
| `SyntaxError` | Corrupted / non-JSON value in storage | `get` returns fallback |
| Key absent | First visit | `get` returns fallback |

### Design notes

- `storage.get` uses `JSON.parse(raw) as T` — intentionally unsafe cast, justified by a comment. The alternative (Zod validation) is forbidden by `config.md`. Callers own the generic parameter and must match the stored shape.
- `STORAGE_NAMESPACE` is exported for use in tests that need to read/write raw keys.
- Module has zero imports — no framework leakage possible.

---

## `src/store/themeStore.ts`

### State shape

| Field | Type | Default | Storage key |
|---|---|---|---|
| `currentTheme` | `string` | `settings.defaultTheme` (`'dracula'`) | `termfolio:theme` |
| `customFont` | `string \| null` | `null` | `termfolio:font` |
| `fontSize` | `FontSize` | `settings.defaultFontSize` (`'md'`) | `termfolio:fontSize` |

### Actions

| Action | Storage effect |
|---|---|
| `setTheme(name)` | Writes `termfolio:theme` |
| `setFont(font)` | Writes `termfolio:font`; `setFont(null)` removes the key |
| `setFontSize(size)` | Writes `termfolio:fontSize` |

### Design notes

- State is hydrated synchronously at module evaluation time via `storage.get(...)` calls in the initial state object. This means the first render gets the persisted values immediately — no flicker/hydration phase needed.
- `setFont(null)` explicitly removes the key (rather than writing `"null"`) so that `storage.get('font', null)` correctly returns `null` on next load.
- `FontSize` type (`'sm' | 'md' | 'lg'`) is exported for use by the `font` command (Phase 10) and SettingsPanel (Phase 12).
- Does NOT call `themeManager.applyTheme()` — that is the responsibility of `useTheme` hook (Phase 5), which subscribes to `currentTheme` and applies CSS variables reactively.

---

## `src/store/terminalStore.ts`

### State shape

| Field | Type | Persisted | Notes |
|---|---|---|---|
| `history` | `HistoryEntry[]` | No | Resets on every page load |
| `commandHistory` | `string[]` | Yes (`termfolio:history`) | Oldest first; cap 100 |

### Actions

| Action | Notes |
|---|---|
| `appendOutput(entry)` | Appends a `HistoryEntry` to the display history |
| `updateOutput(id, output)` | Patches the output of an existing entry (needed for async commands) |
| `clearHistory()` | Clears display history only; `commandHistory` is unaffected |
| `addToCommandHistory(cmd)` | Appends to `commandHistory`, skips empty strings, enforces cap, persists |

### Design notes

- **`updateOutput`** was added beyond the phase prompt's minimum because it is clearly required for async commands (Phase 8's `useTerminal` must fill in a loading placeholder). Adding it here keeps the store's ownership of the history array clean — `useTerminal` never mutates history directly.
- **`commandHistory` ordering**: oldest at index 0, newest at the last index. `↑` in `TerminalInput` (Phase 13) navigates from `commandHistory.length - 1` downward. This matches the test case in `testing.md` (`['about', 'projects']` → first `↑` gives `'projects'`).
- **Cap enforcement**: `slice(-MAX_COMMAND_HISTORY)` on the concatenated array drops the oldest entries when over 100. Constant is `100` matching the store test in `testing.md`.
- **No deduplication**: Commands are appended unconditionally (empty-string guard only). This matches default `bash` behavior without `HISTCONTROL`. Deduplication could be added in Phase 13 if desired.
- **`history` not persisted**: `HistoryEntry.output` may contain `React.ReactNode` (the `jsx` output variant). Serialising React elements to JSON is not supported. The visual history always resets — command recall history is what persists.
- The split into two stores (theme + terminal) is intentional per the architecture: terminal state updates on every render cycle; keeping it in a separate store avoids re-rendering theme-dependent components.

---

## Key storage contracts (cross-phase)

| Key (unprefixed) | Type written | Written by | Read by |
|---|---|---|---|
| `theme` | `string` | `themeStore.setTheme` | `themeStore` init |
| `font` | `string` | `themeStore.setFont` | `themeStore` init |
| `fontSize` | `'sm' \| 'md' \| 'lg'` | `themeStore.setFontSize` | `themeStore` init |
| `history` | `string[]` | `terminalStore.addToCommandHistory` | `terminalStore` init |
| `visited` | `boolean` | Phase 12 (BootSequence) | Phase 12 (BootSequence) |

---

## Follow-ups for later phases

- **Phase 5** (`useTheme`): subscribe to `useThemeStore(s => s.currentTheme)` and call `themeManager.applyTheme(name)` in an effect.
- **Phase 8** (`useTerminal`): call `appendOutput(entry)` after command resolves; `updateOutput(id, output)` for async placeholder pattern.
- **Phase 13** (`useCommandHistory`): consume `commandHistory` from `terminalStore` for ↑/↓ navigation.
- **Phase 14** (tests): `storage.ts` quota-error tests should use `vi.spyOn(Storage.prototype, 'setItem')`. The `STORAGE_NAMESPACE` export makes raw-key assertions precise.
