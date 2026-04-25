# Adding themes

Themes in termfolio are pure data objects. Adding one takes about two minutes.

---

## Step 1 — append to `themes.config.ts`

```ts
// src/config/themes.config.ts

export const themes: Theme[] = [
  // ... existing themes ...

  {
    name: 'catppuccin',         // used by `theme set catppuccin`
    label: 'Catppuccin Mocha',  // shown in `theme list` and the Settings panel
    mode: 'dark',               // 'dark' | 'light'
    colors: {
      bg:        '#1e1e2e',
      fg:        '#cdd6f4',
      cursor:    '#f5e0dc',
      prompt:    '#a6e3a1',
      accent:    '#cba6f7',
      success:   '#a6e3a1',
      error:     '#f38ba8',
      warning:   '#f9e2af',
      info:      '#89dceb',
      muted:     '#6c7086',
      selection: '#313244',
      border:    '#45475a',
    },
    font: {
      family: '"JetBrains Mono", "Fira Code", monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  },
];
```

That's it. The theme is discovered automatically by the `theme` command and the Settings panel.

Test it immediately: `theme set catppuccin`.

---

## The CSS variable contract

Every theme must define exactly these 12 color variables. Adding or removing variables requires updating the `Theme` type and every existing theme simultaneously.

| Variable | Purpose | Minimum contrast |
|---|---|---|
| `--bg` | Terminal background | (base) |
| `--fg` | Default text | 7:1 on `--bg` (AAA) |
| `--cursor` | Blinking cursor | — |
| `--prompt` | Prompt (`user@host$`) | 4.5:1 on `--bg` |
| `--accent` | Brand / highlight color | 4.5:1 on `--bg` |
| `--success` | Success-toned output | 4.5:1 on `--bg` |
| `--error` | Error output | 4.5:1 on `--bg` |
| `--warning` | Warning output | 4.5:1 on `--bg` |
| `--info` | Info / neutral highlight | 4.5:1 on `--bg` |
| `--muted` | Secondary / dim text | 4.5:1 on `--bg` |
| `--selection` | Text selection background | — |
| `--border` | Dividers, card outlines | — |

Check your contrasts at [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

---

## Light themes

Set `mode: 'light'` for themes with a light background. The store uses `mode` to:
- Match `prefers-color-scheme` on first visit (before any stored preference).
- Choose appropriate border/selection defaults.

```ts
{
  name: 'paper',
  label: 'Paper',
  mode: 'light',
  colors: {
    bg:     '#fafaf8',
    fg:     '#1a1a1a',
    // ...
  },
  font: { ... },
},
```

---

## Experimental themes

If your theme is artistic (intentionally low-contrast, CRT scanlines aesthetic, etc.) and can't meet the AA minimums, mark it `experimental: true`. It will appear in the theme picker but won't be offered as a `defaultTheme` candidate.

```ts
{
  name: 'scanlines',
  label: 'CRT Scanlines',
  mode: 'dark',
  experimental: true,
  colors: { /* ... */ },
  font: { /* ... */ },
},
```

---

## Custom fonts per theme

Each theme ships its own `font.family`. This is the default for that theme — the user can override it with `font set "Custom Mono"` and their preference is stored in `localStorage`.

Ship fonts locally (in `public/fonts/`) for privacy and performance. Reference them in `src/styles/globals.css` with `@font-face`.

```css
@font-face {
  font-family: 'MyMono';
  src: url('/fonts/MyMono.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

Then in the theme:

```ts
font: {
  family: '"MyMono", "JetBrains Mono", monospace',
  size: '14px',
  lineHeight: '1.6',
},
```

---

## Making a theme the default

Set `settings.defaultTheme` in `src/config/settings.config.ts`:

```ts
export const settings = {
  defaultTheme: 'catppuccin',
  // ...
};
```

This is the theme applied on first visit, before any user preference is stored.

---

## What themes must not do

- Don't create a separate CSS file per theme. All theme data lives in `themes.config.ts`.
- Don't register themes manually. The `theme` command and Settings panel discover them automatically.
- Don't import theme objects in components — use CSS variables (`var(--accent)`) instead.
- Don't animate between themes (jarring, no value — the switch is instant).
