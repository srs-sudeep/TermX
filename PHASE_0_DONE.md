# PHASE 0 DONE — Bootstrap & Toolchain

## Files created

| File | Purpose |
|---|---|
| `package.json` | All deps at exact React-18 + Vite-5 compatible versions |
| `tsconfig.json` | Strict TS5, `@/*` → `src/*` path alias, `bundler` moduleResolution |
| `tsconfig.node.json` | Config-file compilation (vite.config, tailwind.config) |
| `vite.config.ts` | React plugin, `@/` alias, Vitest inline config (happy-dom env) |
| `tailwind.config.ts` | Content globs; exposes CSS vars as `terminal.*` tokens |
| `postcss.config.js` | Tailwind + Autoprefixer |
| `.eslintrc.cjs` | ESLint 8 + typescript-eslint v7, import boundary rules |
| `.prettierrc` | singleQuote, trailingComma all, 100-char print width, LF |
| `.editorconfig` | utf-8, LF, 2-space indent, trailing newlines |
| `.gitignore` | node_modules, dist, .env, editor junk, coverage |
| `index.html` | viewport meta, FOUC-prevention inline style, `<div id="root">` |
| `src/main.tsx` | `createRoot` entry point, StrictMode |
| `src/App.tsx` | Minimal placeholder; will be replaced in Phase 6 |
| `src/vite-env.d.ts` | Vite client types reference |
| `src/styles/globals.css` | Tailwind directives, base reset, cursor-blink keyframes |
| `src/styles/themes.css` | Default CSS variable values (Dracula palette) |
| `LICENSE` | MIT |
| `tests/setup.ts` | `@testing-library/jest-dom` import for Vitest |

## Pre-existing files left intact

| File | Reason |
|---|---|
| `README.md` | Already had real content; Phase 15 will rewrite it properly |
| `docs/ARCHITECTURE.md` | Already complete |
| `.claude/rules/*.md` | All five rule files already existed with full content |

## Key decisions

1. **ESLint 8 + `.eslintrc.cjs`** — The phase prompt specified the legacy config format. ESLint 9's flat config (`eslint.config.js`) would be cleaner but requires updating all extends syntax. Staying on 8 matches the spec exactly.

2. **`happy-dom` for tests** — Lighter than `jsdom`, ships as a single package, and Vitest's happy-dom integration is first-class. The testing rules reference it explicitly.

3. **Vitest config inside `vite.config.ts`** — Keeps config in one place. An override file is only needed when test and app configs diverge significantly (not the case here).

4. **`themes.css` created in Phase 0** — `globals.css` imports it; without the file the dev server would error. The variables carry Dracula defaults so there's no FOUC even before `themeManager` runs.

5. **`tailwind.config.ts` extends colors as `terminal.*` tokens** — This gives Tailwind type-checking for `bg-terminal-bg` etc., while the raw CSS-var syntax `bg-[var(--bg)]` still works and is preferred in components (per `components.md`). The tokens are convenience aliases for autocomplete, not a second color system.

6. **No barrel index in `src/styles/`** — CSS files are imported directly; no JS barrel needed.

## Follow-ups for later phases

- Phase 2 will add `src/config/` files; the `@/config` import path is ready.
- Phase 5 will create `themeManager.ts`; `globals.css` already imports `themes.css` so variables are available immediately.
- Phase 6 will replace `src/App.tsx` with `<AppShell>`.
- Phase 15 will overwrite `README.md` and create the remaining `docs/` files.
- `public/` folder (favicon, resume, og-image) is created in Phase 15; no blocking dependency on it now.
