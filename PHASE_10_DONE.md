# PHASE 10 DONE — System Commands

## Files created

| File | Command | Output type | Notes |
|---|---|---|---|
| `src/commands/system/theme.ts` | `theme` | `list` / `text` | Subcommands: list, set, preview |
| `src/commands/system/font.ts` | `font` | `text` | Subcommands: set, reset, size |
| `src/commands/system/settings.ts` | `settings` | `settings-panel` | Renders SettingsPanel inline |
| `src/commands/system/reset.ts` | `reset` | `text` | Two-step: requires `--confirm` flag |
| `src/components/settings/SettingsPanel.tsx` | — | Component | Stub for Phase 12 |

---

## Command details

### `theme`

| Subcommand | Behavior |
|---|---|
| `theme` / `theme list` | Lists all themes; marks active with ✓; notes experimental themes |
| `theme set <name>` | Calls `ctx.theme.set(name)` (persists) + `applyTheme(name)` (DOM) |
| `theme preview <name>` | Calls `applyTheme(name)` without persisting; reverts after 10 s |

**Preview revert timer**: stored as module-level `let previewTimer`. Single-page apps don't reload between commands so the timer persists. `theme set` cancels any active preview timer before persisting.

**`applyTheme` import**: The `theme` command imports `applyTheme` from `@/lib/themeManager`. This is explicitly allowed by the command rules (commands may import from `@/lib`). It is the cleanest way to apply CSS variables without persisting to the store.

**Autocomplete**: Returns theme names for position 2 when `set` or `preview` is the first arg.

### `font`

| Subcommand | Behavior |
|---|---|
| `font` | Shows current family + size |
| `font set <family>` | Calls `setFont(family)` + `applyFontFamily(family, theme)` |
| `font reset` | Calls `setFont(null)` + `applyFontFamily(null, theme)` |
| `font size <sm\|md\|lg>` | Calls `setFontSize(size)` + `applyFontSize(size)` |

**Store import**: `font.ts` imports `useThemeStore` from `@/store/themeStore` and calls `useThemeStore.getState()`. This is not a React hook call — it's a Zustand store static method. The command rules forbid `@/hooks` imports but not `@/store`. This is acceptable.

### `settings`

Returns `{ type: 'settings-panel' }`. `<OutputRenderer>` renders `<SettingsPanel />`.

This keeps the command file free of component imports (rule: commands must not import from `@/components`). The `settings-panel` discriminant was added to `CommandOutput` in Phase 8 specifically to support this pattern.

### `reset`

Two-step confirmation:
1. `reset` → warning message asking to run `reset --confirm`.
2. `reset --confirm` → iterates over `localStorage` keys with `STORAGE_NAMESPACE` prefix, removes them, then reloads after 800 ms.

The 800 ms delay lets the success message render before the page unloads.

---

## `SettingsPanel` stub

Full implementation deferred to Phase 12. The stub renders a bordered box listing the key commands for managing settings via the terminal. This ensures `OutputRenderer` has a real component to render in Phase 10.

---

## Decisions

1. **Preview timer in module scope** — avoids threading timer state through context or store. Acceptable for a single-page app where the module lives for the session lifetime.
2. **`settings-panel` output type** — cleaner than `jsx` output because it avoids command-to-component coupling. The renderer owns the import; the command owns the intent.
3. **`reset` requires `--confirm`** — destructive action; two-step pattern is the terminal convention. No interactive prompt needed (and none is possible in our synchronous execute model).
4. **`font` reads store via `.getState()`** — commands don't run in React render functions so calling a Zustand hook would be incorrect; `.getState()` is the right API for this case.

---

## Follow-ups for later phases

- **Phase 11** (`matrix` command): Returns `{ type: 'jsx', element: <MatrixRain /> }`.
- **Phase 12** (full `SettingsPanel`): Replace the stub; `OutputRenderer` needs no changes.
- **Phase 12** (gear button in TitleBar): Opens the settings panel; the `settings` command provides the same content inline.
- **Phase 13** (autocomplete): `theme set <Tab>` already works via the `autocomplete` function on `theme.ts`.
