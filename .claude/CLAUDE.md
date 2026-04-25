# CLAUDE.md

Project rules for Claude Code working on **`termfolio`** — a template-based, terminal-style portfolio website.

This file is the source of truth for how you (Claude Code) operate in this repo. Read it fully before touching anything. Scoped rules in `.claude/rules/` extend these for specific subsystems.

---

## 1. Hard constraints (non-negotiable)

1. **You never execute commands.** No `bun install`, no `bun run dev`, no `git`, no shell. You only **generate, edit, and delete files**. The user runs everything.
2. **Frontend only.** No backend services, no Node servers, no API routes. Anything that looks like it needs a backend (contact form, analytics) goes through third-party JS SDKs or `mailto:` links.
3. **No browser storage APIs are off-limits.** `localStorage` is fine here (we are not in claude.ai artifacts) and is required for theme/font/history persistence.
4. **TypeScript strict mode.** No `any` unless justified in a comment. No `// @ts-ignore` without a one-line reason.
5. **Config-first.** Anything a forker would want to change (name, projects, skills, themes, commands) lives in `src/config/*` — never hardcoded in components or commands.
6. **No dead files.** If you create a file, it must be imported and used by the end of the same phase.

---

## 2. Project identity

| Field | Value |
|---|---|
| Name | `termfolio` |
| Type | Static SPA |
| Purpose | A terminal-emulator portfolio site that anyone can fork, edit one config file, and deploy |
| Audience | Developers, designers, anyone who wants a CLI-aesthetic personal site |
| Deploy targets | Vercel, Netlify, Cloudflare Pages, GitHub Pages (static export) |

The differentiator vs. existing terminal portfolios: **everything is data-driven**. Users edit `user.config.ts`, `themes.config.ts`, `commands.config.ts` and never touch the engine.

---

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Runtime / pkg mgr | **Bun** | Fast installs, single binary, native TS |
| Bundler | **Vite** | Mature React DX, plugin ecosystem, beats Bun's bundler for HMR |
| UI | **React 18** + **TypeScript 5** | Strict, ergonomic |
| Styling | **TailwindCSS 3** + CSS variables | Themes via CSS vars, utilities for layout |
| State | **Zustand** | Lightweight; no Provider hell for terminal state |
| Animation | **Framer Motion** | Boot sequence, matrix rain, output transitions |
| Icons | **Lucide React** | Used sparingly — only in non-terminal UI (settings panel) |
| Testing | **Vitest** + **Testing Library** | Fast, Vite-native |
| Lint/format | **ESLint** (typescript-eslint) + **Prettier** | Standard |

**Forbidden additions without approval:**
- Any UI library (no shadcn, MUI, Chakra, Radix). Build the small bits of chrome we need by hand.
- Routers (no React Router) — this is a single-page terminal.
- Heavy state libs (no Redux, Jotai). Zustand only.
- CSS-in-JS runtimes (styled-components, emotion).

---

## 4. Architecture in one paragraph

A `<Terminal>` shell renders an output history and a single input line. Input is parsed by `commandParser` into `{ name, args, flags }`, then dispatched through `commandRegistry` to a handler. Each handler returns a typed `CommandOutput` (text / list / table / cards / jsx / clear / error) which `<TerminalOutput>` renders. Themes are CSS variables on `:root`; switching a theme rewrites the variables. All user-editable data lives under `src/config/`. Persistent state (theme, font, history) is in `localStorage` via a `storage` adapter. **No data ever leaves the browser.**

For the full architecture, read `docs/ARCHITECTURE.md`.

---

## 5. File organization rules

```
src/
├── config/        # USER-EDITABLE. Treat as public API. Never break these schemas.
├── components/    # React UI. Dumb where possible.
├── commands/      # One file per command. Exports a Command object.
├── hooks/         # Reusable React hooks.
├── lib/           # Framework-agnostic logic (parser, registry, storage).
├── store/         # Zustand stores.
├── types/         # Shared TypeScript types. Single source of truth.
├── styles/        # Globals + theme CSS variable definitions.
└── utils/         # Tiny pure helpers.
```

**Rules:**
- A command file imports types from `@/types`, helpers from `@/lib`, and config from `@/config`. It must **not** import from `@/components` or `@/hooks`.
- A component imports from `@/types`, `@/store`, `@/hooks`. It must **not** import from `@/commands`.
- `@/lib` is framework-agnostic — no React imports allowed in there.
- `@/config` files are the only place where personal data appears as literal values.

---

## 6. Naming & code style

- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components, `useCamelCase.ts` for hooks.
- React components: function components, named exports preferred.
- Types: `PascalCase`. Suffix unions with descriptive names (`CommandOutput`, not `Output`).
- Constants: `SCREAMING_SNAKE_CASE` only at module scope.
- One default export per file is fine for components; commands use named exports.
- No barrel files except `src/commands/index.ts` (the registry assembly point) and `src/types/index.ts`.
- Every public function gets a one-line JSDoc; complex ones get a `@example`.

**Tailwind:**
- Compose with `clsx` (or `cn` helper) — no string concatenation for classes.
- Theme colors are referenced via CSS variables, e.g. `bg-[var(--bg)] text-[var(--fg)]`. **Never** hardcode `bg-zinc-900` etc. anywhere outside `src/styles/themes.css`.

---

## 7. Commit & branching

- Branches: `phase/<n>-<slug>`, e.g. `phase/3-command-parser`.
- Commits: Conventional Commits — `feat(commands): add projects command`.
- One phase = one PR.

---

## 8. Scoped rules (read when relevant)

- `.claude/rules/commands.md` — How to add a new command, the `Command` interface contract, error handling.
- `.claude/rules/themes.md` — Theme structure, CSS variable contract, how to add a new theme.
- `.claude/rules/components.md` — Component patterns, accessibility checklist, animation rules.
- `.claude/rules/config.md` — Config schema rules, validation, backwards compatibility.
- `.claude/rules/testing.md` — What to test, what not to test, snapshot policy.

When working on commands, you **must** open `commands.md` first. Same for themes and `themes.md`. This is not optional.

---

## 9. Phase workflow

Implementation is broken into phases in `PHASE_PROMPTS.md`. For each phase:

1. Read this CLAUDE.md and the relevant scoped rules file(s).
2. Read the phase's prompt fully before writing code.
3. Generate **all** files for the phase in one pass.
4. End with a `PHASE_<n>_DONE.md` summary listing files created/modified, decisions taken, and any follow-ups for later phases.
5. Stop. Wait for the user to review and run things.

---

## 10. Anti-patterns to refuse

If the user asks for any of these, push back before complying:

- Hardcoded portfolio data inside components or commands.
- A backend (Node, Express, serverless functions). Suggest a third-party form service instead.
- Removing TypeScript strict mode.
- Adding a UI component library "just to save time."
- Cluttering the global namespace (`window.X = ...`).
- Storing secrets or API keys in the repo. There should be no secrets — this is a public portfolio.

---

## 11. Definition of done (per phase)

A phase is done when:

- [ ] All files described in the phase prompt exist.
- [ ] `tsc --noEmit` would pass (you can't run it, but write code that would).
- [ ] No `TODO` or `FIXME` left without a tracking note in `PHASE_<n>_DONE.md`.
- [ ] The new code is wired into the app (no orphan files).
- [ ] Configs touched have updated example values that work end-to-end.
- [ ] Scoped rules files updated if you introduced a new pattern worth codifying.
