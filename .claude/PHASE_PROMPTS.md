# PHASE_PROMPTS.md

Implementation plan broken into self-contained phases for Claude Code. Each phase is a single prompt — copy it, paste into Claude Code, review the diff, commit, move to next.

**Rules for every phase (don't omit when prompting):**
- Read `CLAUDE.md` and any referenced `.claude/rules/*.md` first.
- Generate files only — never run commands.
- End with `PHASE_<n>_DONE.md` summarizing files created and decisions taken.

---

## Phase 0 — Bootstrap & rule files

> Read `CLAUDE.md`. Create the project skeleton and the scoped rules files referenced in section 8. Generate:
>
> - `package.json` with the dependencies specified in `CLAUDE.md` section 3 (React 18, TypeScript 5, Vite, Tailwind 3, Zustand, Framer Motion, Lucide, Vitest, Testing Library, ESLint, Prettier). Use exact versions known to be compatible with Vite 5 + React 18.
> - `tsconfig.json` (strict, `paths: { "@/*": ["src/*"] }`).
> - `vite.config.ts` with React plugin and `@/` alias.
> - `tailwind.config.ts` (content globs, theme extends nothing — we use CSS variables).
> - `postcss.config.js`.
> - `.eslintrc.cjs`, `.prettierrc`, `.editorconfig`, `.gitignore`.
> - `index.html` with viewport meta and a single `<div id="root">`.
> - `src/main.tsx`, `src/App.tsx` (placeholder), `src/styles/globals.css` (Tailwind directives + base reset).
> - `.claude/rules/commands.md`, `themes.md`, `components.md`, `config.md`, `testing.md` — each with concrete rules. Don't write empty stubs.
> - `LICENSE` (MIT) and an empty `README.md` (we'll write it later).
>
> No business logic this phase. End with `PHASE_0_DONE.md`.

---

## Phase 1 — Type system

> Read `CLAUDE.md` and `.claude/rules/config.md`. Generate the full type system in `src/types/`:
>
> - `command.ts` — `Command`, `CommandContext`, `CommandOutput` (full union), `ListItem`, `Card`, parser output type `ParsedCommand`.
> - `config.ts` — `UserConfig`, `Project`, `SkillCategory`, `Skill`, `Experience`, `Education`, `SocialLink`, `Settings`.
> - `theme.ts` — `Theme`, `ThemeColors`, `ThemeFont`.
> - `output.ts` — anything specific to rendering (`HistoryEntry`).
> - `index.ts` — barrel re-export.
>
> Match the shapes in `docs/ARCHITECTURE.md` section 9 exactly. Add JSDoc on every exported type. End with `PHASE_1_DONE.md`.

---

## Phase 2 — Config files (with example data)

> Read `CLAUDE.md` and `.claude/rules/config.md`. Generate `src/config/`:
>
> - `user.config.ts` — populate with **realistic example data** for a fictional developer "Sam Reyes" so the site is demoable out of the box. Include 4 projects, 3 skill categories, 2 experiences, 1 education, 4 social links, 5 fortunes.
> - `themes.config.ts` — ship all 13 themes from `ARCHITECTURE.md` section 5. Validate the colors are accessible (contrast ≥ 4.5).
> - `commands.config.ts` — empty `customCommands: Command[]` array with a commented-out example.
> - `settings.config.ts` — boot sequence on, banner on, typewriter off (default — too slow for repeat visits), default theme `dracula`, default font size `md`.
> - `index.ts` — re-export all configs.
>
> Add a top-of-file comment in each: "EDIT THIS FILE — this is your portfolio's data." End with `PHASE_2_DONE.md`.

---

## Phase 3 — Storage adapter & Zustand stores

> Read `CLAUDE.md`. Generate:
>
> - `src/lib/storage.ts` — namespaced `localStorage` wrapper. Methods: `get<T>(key, fallback)`, `set<T>(key, value)`, `remove(key)`. Catch quota / privacy errors and return fallbacks. Namespace: `termfolio:`.
> - `src/store/themeStore.ts` — Zustand store with `currentTheme`, `customFont`, `fontSize`, actions, hydrate from storage on creation, persist on change.
> - `src/store/terminalStore.ts` — Zustand store with `history: HistoryEntry[]`, `commandHistory: string[]` (capped at 100, persisted), `appendOutput`, `clearHistory`, `addToCommandHistory`.
>
> No React in `lib/`. End with `PHASE_3_DONE.md`.

---

## Phase 4 — Command parser & registry

> Read `CLAUDE.md` and `.claude/rules/commands.md`. Generate:
>
> - `src/lib/commandParser.ts` — input string → `{ name, args, flags, raw }`. Handle:
>   - Quoted args (single + double).
>   - Long flags `--key=value` and `--key value`.
>   - Short flags `-k` (boolean only).
>   - Empty input → `null`.
>   - Whitespace tolerant.
> - `src/lib/commandRegistry.ts` — `createRegistry()` builds the registry by:
>   1. Loading every `.ts` file in `src/commands/**/*.ts` via `import.meta.glob('/src/commands/**/*.ts', { eager: true })`.
>   2. Merging `customCommands` from `commands.config.ts` (custom overrides built-ins by name).
>   3. Building a name+alias index for fast lookup.
>   4. Exposing: `resolve(name)`, `all()`, `byCategory(cat)`, `complete(partial)`.
> - `tests/parser.test.ts` and `tests/registry.test.ts` — Vitest tests covering at least the cases enumerated above.
>
> Don't create command files yet — the registry should compile against zero commands. End with `PHASE_4_DONE.md`.

---

## Phase 5 — Theme manager

> Read `CLAUDE.md` and `.claude/rules/themes.md`. Generate:
>
> - `src/lib/themeManager.ts` — `applyTheme(name: string)` writes CSS variables to `document.documentElement`. Reads from `themes.config.ts`. Falls back to default theme if name unknown. Also exposes `applyFontSize`, `applyFontFamily`.
> - `src/styles/themes.css` — define `:root` defaults with the same CSS variables (`--bg`, `--fg`, `--cursor`, `--prompt`, `--accent`, `--success`, `--error`, `--warning`, `--info`, `--muted`, `--selection`, `--border`).
> - Update `src/styles/globals.css` to import `themes.css` and apply baseline styles using the variables.
> - `src/hooks/useTheme.ts` — hook combining the store + manager; auto-applies on mount and on store change.
>
> End with `PHASE_5_DONE.md`.

---

## Phase 6 — Terminal UI shell

> Read `CLAUDE.md` and `.claude/rules/components.md`. Generate the terminal UI:
>
> - `src/components/terminal/Prompt.tsx` — renders the prompt template with config values. Uses CSS vars for color.
> - `src/components/terminal/Cursor.tsx` — blinking block cursor; respects `prefers-reduced-motion`.
> - `src/components/terminal/TerminalInput.tsx` — controlled `<input>`. Submits on Enter. Empty Enter still pushes a prompt-only entry to history.
> - `src/components/terminal/TerminalHistory.tsx` — renders `history` from store. Each entry shows the prompt + input, then the output(s).
> - `src/components/terminal/Terminal.tsx` — composes the above. Owns scroll behavior, click-to-focus, and the Ctrl+L / Ctrl+C / Ctrl+U handlers via `useKeyboardShortcuts`.
> - `src/hooks/useKeyboardShortcuts.ts`.
> - `src/hooks/useScrollToBottom.ts`.
> - `src/components/shell/AppShell.tsx` — full-screen container with optional `<TitleBar />` chrome.
> - `src/components/shell/TitleBar.tsx` — macOS-style traffic-light buttons (purely cosmetic, no close behavior).
>
> Wire it into `App.tsx`. The terminal should render and accept input — input doesn't yet dispatch to commands, just echoes itself. End with `PHASE_6_DONE.md`.

---

## Phase 7 — Output renderers

> Read `CLAUDE.md` and `.claude/rules/components.md`. Generate `src/components/output/`:
>
> - `TextOutput.tsx` — handles `tone` variants with CSS var colors.
> - `ListOutput.tsx` — bulleted; supports indent levels.
> - `TableOutput.tsx` — monospace-aligned columns, computes column widths from content.
> - `CardsOutput.tsx` — used for projects: title, description, tech tags, links.
> - `ErrorOutput.tsx` — red, prefixed with `error:`.
> - `JsxOutput.tsx` — renders `output.element` directly.
>
> A single `<OutputRenderer output={...} />` (in this same folder) does the type-switch. Update `TerminalHistory.tsx` to use it. End with `PHASE_7_DONE.md`.

---

## Phase 8 — Wire dispatch + core commands

> Read `CLAUDE.md` and `.claude/rules/commands.md`. Now connect input to the registry and implement core commands.
>
> - `src/hooks/useTerminal.ts` — exposes a `submit(input)` that:
>   1. Adds the prompt+input to history.
>   2. Adds input to commandHistory.
>   3. Parses the input.
>   4. Resolves the command. If unknown, append an error.
>   5. Calls `execute(ctx)`. Awaits if Promise.
>   6. Handles special outputs: `clear` clears history, `redirect` opens URL, `download` triggers download.
>   7. Otherwise appends the output.
> - Wire `useTerminal` into `Terminal.tsx`.
> - Implement core commands (`src/commands/core/`): `help`, `clear`, `echo`, `whoami`, `date`, `history`, `man`, `pwd`, `ls`, `cd`.
>   - `help` groups by category, hides `hidden: true`.
>   - `man <cmd>` shows usage from the command definition.
>   - `cd <section>` should dispatch to the relevant portfolio command if it exists; else error.
>
> End with `PHASE_8_DONE.md`.

---

## Phase 9 — Portfolio commands

> Read `CLAUDE.md` and `.claude/rules/commands.md`. Implement `src/commands/portfolio/`:
>
> - `about` — emit text output from `config.about.paragraphs`.
> - `projects` — list view by default; `projects <slug>` for detail card; `--featured` filter; `--year=YYYY` filter.
> - `skills` — table grouped by category, optional level bars (rendered with `█████░` style).
> - `experience` — timeline-style list output.
> - `education` — list output.
> - `contact` — list output of contact options.
> - `email` — `redirect` to `mailto:`.
> - `social` — list. `social <name>` opens URL.
> - `resume` — `download` from `config.resumeUrl`.
>
> Add autocomplete handlers where it helps (e.g. `projects <slug>` completes against project slugs). End with `PHASE_9_DONE.md`.

---

## Phase 10 — System commands

> Read `CLAUDE.md`. Implement `src/commands/system/`:
>
> - `theme` — no args lists themes (highlighting active). `theme set <n>` switches & persists. `theme preview <n>` switches without persisting (reverts after 10s).
> - `font` — list / set font family. `font size <sm|md|lg>`.
> - `settings` — emits a `jsx` output containing `<SettingsPanel />` (next phase will create it).
> - `reset` — confirms, then wipes localStorage and reloads.
>
> Theme commands must autocomplete theme names. End with `PHASE_10_DONE.md`.

---

## Phase 11 — Fun commands & effects

> Read `CLAUDE.md`. Implement `src/commands/fun/` and `src/components/effects/`:
>
> - `sudo` — error output `Permission denied: nice try.`
> - `matrix` — emits a `jsx` output of `<MatrixRain />`. Esc exits the effect.
> - `coffee` — ASCII coffee + `418 I'm a teapot`.
> - `cowsay <text>` — classic cow ASCII speech bubble.
> - `fortune` — random pick from `config.fortunes`.
> - `neofetch` — left: small ASCII logo; right: name, title, location, theme, font, uptime (since page load), commands run.
> - `banner` — large ASCII text of `config.user.name` using a small embedded font (figlet-ish, but ship the table for one font in a constant).
> - `hack` — fake "scrolling hack" text gag, runs 3s.
>
> Components: `MatrixRain.tsx` (canvas-based, lazy-loaded), `AsciiBanner.tsx`, `Typewriter.tsx`. Lazy-import any heavy effects. End with `PHASE_11_DONE.md`.

---

## Phase 12 — Boot sequence, banner, settings panel

> Read `CLAUDE.md`. Generate:
>
> - `src/components/terminal/BootSequence.tsx` — 1.5s scripted "boot" that prints fake init messages then the banner. Skipped if `localStorage.termfolio:visited === true` or if `prefers-reduced-motion`. Toggleable in `settings.config.ts`.
> - On first render after boot, dispatch a synthetic `banner` followed by `help`.
> - `src/components/settings/SettingsPanel.tsx` — small modal. Toggles: theme picker, font, font size, boot sequence on/off, typewriter on/off, reset. Reachable via `settings` command and a top-right gear button in `<TitleBar />`.
> - `src/components/settings/ThemePicker.tsx` — grid of swatches, clicking switches theme.
>
> End with `PHASE_12_DONE.md`.

---

## Phase 13 — History recall, autocomplete, mobile

> Read `CLAUDE.md`. Generate:
>
> - `src/hooks/useCommandHistory.ts` — ↑/↓ navigation in `TerminalInput`. Restores draft on reaching the bottom.
> - `src/hooks/useAutocomplete.ts` — Tab key. Calls `registry.complete(partial)`. If one match, completes; if many, prints them as a list output and keeps input.
> - Mobile: ensure input shows the soft keyboard on first tap; tapping anywhere refocuses; viewport meta is correct; horizontal overflow is scrollable for tables.
> - Reduced-motion: disables Cursor blink, Typewriter, Matrix (replaces with static text), BootSequence.
>
> End with `PHASE_13_DONE.md`.

---

## Phase 14 — Tests

> Read `CLAUDE.md` and `.claude/rules/testing.md`. Generate Vitest tests:
>
> - `tests/parser.test.ts` — flag/quote edge cases (extend Phase 4 coverage).
> - `tests/registry.test.ts` — alias resolution, custom override, unknown command.
> - `tests/commands/help.test.ts`, `theme.test.ts`, `projects.test.ts`, `man.test.ts`.
> - `tests/storage.test.ts` — quota error fallback.
>
> Don't aim for 100%. Cover parser, registry, and the trickiest commands (theme persistence, projects filtering). End with `PHASE_14_DONE.md`.

---

## Phase 15 — Docs, README, deploy configs

> Read `CLAUDE.md`. Generate:
>
> - `README.md` — project overview, screenshot placeholder, quick-start, customization summary, commands list, deployment links.
> - `docs/CUSTOMIZATION.md` — step-by-step for forkers: edit `user.config.ts`, swap resume.pdf, change favicon, set OG image, deploy.
> - `docs/ADDING_COMMANDS.md` — example walking through adding a `spotify` command.
> - `docs/ADDING_THEMES.md` — example adding a custom theme; contrast checker note.
> - `docs/DEPLOYMENT.md` — Vercel, Netlify, Cloudflare Pages, GitHub Pages instructions.
> - `vercel.json`, `netlify.toml`, `.github/workflows/ci.yml` (typecheck + test on PR), `.github/workflows/pages.yml` (optional GitHub Pages deploy).
> - `public/og-image.png` placeholder (a 1200x630 SVG converted, or just a placeholder note).
>
> End with `PHASE_15_DONE.md`. Project is ready to ship.

---

## Suggested execution order

Phases are dependency-ordered. You can parallelize 11 (fun commands) with 12 (boot/settings) if you want, but everything else runs in sequence.

Don't skip phase summaries (`PHASE_<n>_DONE.md`) — they're cheap and they save you from forgetting decisions made earlier.
