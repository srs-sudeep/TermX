# PHASE 11 DONE — Fun Commands & Effects

## Files created

| File | Purpose |
|---|---|
| `src/lib/asciiFonts.ts` | 5-row block-character font table (A–Z, 0–9, punctuation) + `buildBanner()` |
| `src/commands/fun/sudo.ts` | Returns `error` output — "Permission denied: nice try." |
| `src/commands/fun/coffee.ts` | ASCII coffee art + "418 I'm a teapot" |
| `src/commands/fun/cowsay.ts` | Word-wraps input into a speech bubble with a classic cow |
| `src/commands/fun/fortune.ts` | Random pick from `config.fortunes`; muted message if unconfigured |
| `src/commands/fun/neofetch.ts` | Two-column layout: ASCII terminal logo left, system info right |
| `src/commands/fun/banner.ts` | Returns `{ type: 'banner' }` — rendered by OutputRenderer |
| `src/commands/fun/matrix.ts` | Returns `{ type: 'matrix' }` — hidden command |
| `src/commands/fun/hack.ts` | Returns `{ type: 'hack' }` — hidden command |
| `src/components/effects/MatrixRain.tsx` | Canvas animation, fixed overlay, Esc → clearHistory() |
| `src/components/effects/HackEffect.tsx` | Scrolling fake-hack lines, ~3 s auto-completes |
| `src/components/effects/AsciiBanner.tsx` | Renders pre-built ASCII art with accent colour + aria-label |
| `src/components/effects/Typewriter.tsx` | Character-by-character animation; respects prefers-reduced-motion |

## Files modified

| File | Change |
|---|---|
| `src/types/command.ts` | Added `matrix`, `hack`, `banner` discriminants to `CommandOutput` |
| `src/components/output/OutputRenderer.tsx` | Handles the three new output types; lazy-loads MatrixRain + HackEffect |

---

## Command details

### `sudo`
Returns `{ type: 'error', message: 'Permission denied: nice try.' }`. No subcommands.

### `coffee`
ASCII art coffee cup + the HTTP 418 teapot status. Returns `{ type: 'text', tone: 'warning' }`.

### `cowsay <text>`
Word-wraps input at 40 chars. Single-line bubbles use `< text >`; multi-line use `/`, `|`, `\` corners.
Falls back to `"Moo!"` if no args supplied.

### `fortune`
Picks a random entry from `ctx.config.fortunes`. Returns a muted hint message if `fortunes` is absent or empty.

### `neofetch`
- Module-level `SESSION_START = Date.now()` captures page-load time.
- Reads `useThemeStore.getState()` for `customFont` and `currentTheme` (Zustand static call, not a hook).
- Left column: 8-line ASCII terminal logo (box-drawing style).
- Right column: handle, separator, name, title, location, theme, font, uptime, command count.

### `banner`
Returns `{ type: 'banner' }`. `OutputRenderer` calls `buildBanner(userConfig.user.name)` and passes the result to `<AsciiBanner />`.

### `matrix`
Returns `{ type: 'matrix' }`. `MatrixRain` is lazy-loaded via `React.lazy`. The canvas resizes on `window.resize`. Esc calls `clearHistory()` (from `useTerminalStore`) to remove the entry.

### `hack`
Returns `{ type: 'hack' }`. `HackEffect` displays 21 fake-hack lines over ~3.15 s (150 ms per line) using `setInterval`. Marked `hidden: true`.

---

## Output type additions to `CommandOutput`

| Type | Rendered by |
|---|---|
| `banner` | `<AsciiBanner text={buildBanner(userConfig.user.name)} />` |
| `matrix` | `React.lazy(() => import('@/components/effects/MatrixRain'))` |
| `hack` | `React.lazy(() => import('@/components/effects/HackEffect'))` |

Pattern is consistent with `settings-panel` from Phase 10.

---

## Decisions

1. **`banner` as a discriminant** — commands are `.ts` files (no JSX), so they can't return a React element. A discriminant lets `OutputRenderer` own the component import.
2. **`MatrixRain` as `export default`** — `React.lazy` requires a default export; the effect components use default exports to simplify lazy loading.
3. **`SESSION_START` at module scope in neofetch** — `import.meta.glob({ eager: true })` loads all command modules synchronously at startup, so the timestamp is accurate for page-load uptime.
4. **`hidden: true` on `matrix` and `hack`** — easter-egg commands; they'd be noise in `help` output.
5. **`Typewriter` shipped but not yet wired to TextOutput** — wired in Phase 12 via the `typewriter` flag in themeStore.

---

## Follow-ups for Phase 12

- `Typewriter` will be used by `<TextOutput>` when `themeStore.typewriter === true`.
- `AsciiBanner` is used by `<BootSequence>` to show the banner at the end of the boot animation.
- `MatrixRain` is lazy — the `<Suspense fallback={null}>` wrapper in OutputRenderer handles the loading gap.
