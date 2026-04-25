# PHASE 5 DONE — Theme Manager

## Files created

| File | Purpose |
|---|---|
| `src/lib/cn.ts` | `clsx` wrapper — used throughout the component tree |
| `src/lib/themeManager.ts` | Writes CSS vars to `document.documentElement` |
| `src/hooks/useTheme.ts` | Syncs Zustand theme store → CSS vars on mount and change |

`src/styles/themes.css` and `src/styles/globals.css` were already complete from Phase 0 — no changes needed.

---

## `themeManager.ts`

### API

| Export | Signature | Notes |
|---|---|---|
| `applyTheme` | `(name: string) → void` | Writes all 12 color vars + 3 font vars |
| `applyFontSize` | `(size: FontSize) → void` | Overrides `--font-size-base` only |
| `applyFontFamily` | `(family: string \| null, themeName: string) → void` | Override or reset `--font-family` |

### Fallback chain in `applyTheme`

1. Theme by requested `name`.
2. `settings.defaultTheme` (from `settings.config.ts`).
3. `themes[0]` (first entry in `themes.config.ts`).

This ensures the app always has a valid theme even if the stored name is stale.

### `applyFontFamily` reset path

When called with `null`, looks up the currently-active theme and restores its built-in font. This is called by the `font reset` command (Phase 10).

---

## `useTheme.ts`

Three `useEffect` calls — one per CSS variable group:

1. `applyTheme(currentTheme)` — runs on mount and when the active theme changes.
2. `applyFontSize(fontSize)` — runs on mount and when size changes.
3. `applyFontFamily(customFont, currentTheme)` — runs on mount and when either changes.

Effect 3 runs after Effect 1 so a custom font override survives theme switches.

---

## `cn.ts`

Thin wrapper over `clsx`. All class composition in components uses this helper.

---

## Decisions

1. **`applyTheme` also writes font variables** — a single call sets up the full theme. `applyFontSize` and `applyFontFamily` are additive overrides called after.
2. **No React in themeManager** — it is a pure DOM module. Tests can call it without a JSDOM setup.
3. **`useTheme` reads via selectors** — uses `useThemeStore((s) => s.X)` selectors to avoid subscribing to the entire store.

---

## Follow-ups for later phases

- **Phase 10** (`theme preview`): `applyTheme` can be called directly from the theme command (commands may import from `@/lib`) to preview without persisting to the store.
- **Phase 12** (SettingsPanel): `setTheme`, `setFont`, `setFontSize` from the store are called in response to Settings UI interactions; `themeManager` functions apply the visual change immediately.
