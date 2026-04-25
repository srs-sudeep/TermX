# Rules: themes

Read this file before touching anything under `src/styles/`, `src/lib/themeManager.ts`, `src/config/themes.config.ts`, or `src/store/themeStore.ts`.

---

## 1. The CSS variable contract

Every theme defines **exactly** these variables. Do not add or remove without updating the `Theme` type and every existing theme simultaneously.

| Variable      | Purpose                    | Example   |
| ------------- | -------------------------- | --------- |
| `--bg`        | Terminal background        | `#282a36` |
| `--fg`        | Default foreground text    | `#f8f8f2` |
| `--cursor`    | Blinking cursor color      | `#f8f8f2` |
| `--prompt`    | Prompt text (`user@host$`) | `#50fa7b` |
| `--accent`    | Brand / highlight color    | `#bd93f9` |
| `--success`   | Success-toned output       | `#50fa7b` |
| `--error`     | Error output               | `#ff5555` |
| `--warning`   | Warning output             | `#f1fa8c` |
| `--info`      | Info / neutral highlight   | `#8be9fd` |
| `--muted`     | Secondary / dim text       | `#6272a4` |
| `--selection` | Text selection background  | `#44475a` |
| `--border`    | Dividers, card outlines    | `#44475a` |

Also exposed:

- `--font-family`
- `--font-size-base` (`14px`)
- `--line-height-base` (`1.6`)

## 2. How themes apply

`themeManager.applyTheme(name)`:

1. Looks up the theme in `themes.config.ts`.
2. Falls back to `settings.defaultTheme` (and finally to `'dracula'`) if not found.
3. Writes every variable above onto `document.documentElement.style`.
4. Writes `data-theme={name}` on `<html>` for CSS attribute selectors if ever needed.

**Theme switches are pure CSS.** No React re-render. Keep it that way — don't read theme values in components via the store when a CSS variable works.

## 3. How components use theme colors

**Always** via CSS variables through Tailwind's arbitrary-value syntax:

```tsx
<div className="bg-[var(--bg)] text-[var(--fg)]">
```

Or in CSS files:

```css
.prompt {
  color: var(--prompt);
}
```

**Never:**

- Hardcode hex / rgb / named colors in any file under `src/components/` or `src/commands/`.
- Import theme objects from `themes.config.ts` into components.
- Use Tailwind palette classes (`bg-zinc-900`, `text-red-500`) — the palette isn't theme-aware.

The only place hex colors appear is `src/config/themes.config.ts` and `src/styles/themes.css`.

## 4. Contrast requirements

Every theme must pass:

- `--fg` on `--bg`: contrast ≥ 7:1 (AAA)
- `--muted` on `--bg`: contrast ≥ 4.5:1 (AA)
- `--error` / `--success` / `--warning` / `--info` on `--bg`: contrast ≥ 4.5:1

When adding a theme, paste the colors into a checker (WebAIM) and verify. If a theme is artistic (matrix, retro CRT) and can't hit AAA, ship it but mark `experimental: true` in the theme object and exclude it from default-theme candidates.

## 5. Light vs dark

Themes declare `mode: 'light' | 'dark'`. The `light`, `solarized-light`, `gruvbox-light` themes are `light`; all others `dark`. Used for:

- Matching `prefers-color-scheme` on first visit (if no stored preference).
- Choosing appropriate defaults for `--selection` and `--border` opacities.

## 6. Adding a theme

1. Add an entry to the `themes` array in `src/config/themes.config.ts`.
2. Check contrast (see section 4).
3. That's it. The theme picker and `theme` command discover it automatically.

**Don't:** add a separate CSS file per theme, register anything manually, or touch `themeManager.ts`.

## 7. Font handling

`theme.font.family` is applied the same way — as `--font-family`. Ship JetBrains Mono and Fira Code locally (not via Google Fonts CDN) for performance and privacy. Any custom font a user adds via `font set "Custom Mono"` overrides the theme's `--font-family` without touching theme state.

## 8. Font size

Three sizes: `sm` (`12px`), `md` (`14px`), `lg` (`16px`). Applied as `--font-size-base`. All other text sizes scale relative to this using `em` — never `px`.

## 9. Live theme preview (`theme preview`)

The `theme preview <n>` command:

1. Applies the theme via `themeManager.applyTheme(name)`.
2. Does **not** persist it via the store.
3. Sets a 10-second timer to revert to the persisted theme.
4. Typing any other command during the preview cancels the timer and keeps the preview active until the next explicit change.

This lives in the `theme` command file, not in `themeManager` — the manager stays stateless.

## 10. Reduced motion

Themes don't animate. If you add a gradient-animated theme later, gate the animation behind `prefers-reduced-motion: no-preference`.

## 11. What the theme system must not do

- Animate between themes (jarring, no value).
- Persist in `sessionStorage` (use `localStorage` via the storage adapter).
- Watch `prefers-color-scheme` changes live — too surprising. Only on first visit with no stored preference.
- Require a build step to add a theme.
