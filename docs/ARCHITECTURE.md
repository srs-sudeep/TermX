# termfolio — Architecture

A terminal-emulator portfolio site that's fully data-driven. Fork it, edit one config file, deploy.

---

## 1. Design goals

1. **Forkable in 10 minutes.** A non-engineer designer should be able to clone, edit `user.config.ts`, and ship.
2. **Engine vs. content separation.** The terminal engine never knows your name. Personal data lives only in `src/config/`.
3. **Extensible without forking the engine.** New commands and themes are registered by adding files to `src/commands/` and `src/config/themes.config.ts` — no engine edits.
4. **Feel like a real terminal.** Command history, tab-complete, Ctrl+L, Ctrl+C, blinking cursor, prompt that looks plausible.
5. **Fast and small.** First paint < 1.5s on 4G; bundle < 200KB gzipped (excluding optional features).
6. **Accessible.** Keyboard-first by definition. Screen reader compatible. Reduced-motion friendly.

---

## 2. System overview

```
┌──────────────────────────────────────────────────────┐
│                    <App />                           │
│  ┌────────────────────────────────────────────────┐  │
│  │              <Terminal />                       │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │  History (rendered <TerminalOutput />s)   │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │  <Prompt /> + <TerminalInput />          │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
            │
            │  user types "projects --featured"
            ▼
   ┌─────────────────────┐
   │  commandParser      │  →  { name: "projects", args: [], flags: { featured: true } }
   └─────────────────────┘
            │
            ▼
   ┌─────────────────────┐
   │  commandRegistry    │  ← built from src/commands/* + src/config/commands.config.ts
   └─────────────────────┘
            │
            ▼
   ┌─────────────────────┐
   │  command.execute()  │  →  CommandOutput { type: 'cards', cards: [...] }
   └─────────────────────┘
            │
            ▼
   <TerminalOutput /> renders based on output.type
```

---

## 3. Data flow

State lives in two Zustand stores:

**`useTerminalStore`**
- `history: HistoryEntry[]` — rendered output entries (input + result pairs).
- `commandHistory: string[]` — past inputs for ↑/↓ recall (persisted to `localStorage`).
- `currentInput: string`
- Actions: `submit(input)`, `clear()`, `appendOutput(output)`.

**`useThemeStore`**
- `currentTheme: string`
- `customFont: string | null`
- `fontSize: 'sm' | 'md' | 'lg'`
- Actions: `setTheme(name)`, `setFont(font)`, `setFontSize(size)`.
- Persisted to `localStorage` via the `storage` adapter.

**Why two stores:** terminal state changes constantly (every keystroke); theme state changes rarely. Splitting prevents needless re-renders.

---

## 4. Command system

### The contract

```ts
// src/types/command.ts

export interface CommandContext {
  args: string[];
  flags: Record<string, string | boolean>;
  raw: string;                         // original input
  config: UserConfig;                  // injected, read-only
  theme: { current: string; set: (name: string) => void };
  history: { all: () => string[]; clear: () => void };
}

export type CommandOutput =
  | { type: 'text'; content: string; tone?: 'normal' | 'success' | 'error' | 'warning' | 'muted' }
  | { type: 'list'; items: ListItem[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'cards'; cards: Card[] }
  | { type: 'jsx'; element: React.ReactNode }      // escape hatch for animations etc.
  | { type: 'clear' }
  | { type: 'redirect'; url: string; newTab?: boolean }
  | { type: 'download'; url: string; filename: string }
  | { type: 'error'; message: string };

export interface Command {
  name: string;
  aliases?: string[];
  description: string;                 // shown in `help`
  usage?: string;                      // shown in `man <cmd>`
  category: 'core' | 'portfolio' | 'system' | 'fun' | 'custom';
  hidden?: boolean;                    // exclude from `help`
  execute: (ctx: CommandContext) => CommandOutput | Promise<CommandOutput>;
  autocomplete?: (partial: string, ctx: CommandContext) => string[];
}
```

### Adding a command

A command is one file under `src/commands/<category>/<name>.ts` exporting a default `Command`. The registry auto-loads via Vite's `import.meta.glob`. **No central registration list to edit.**

### Custom commands (user-defined)

Power users can add commands in `src/config/commands.config.ts`:

```ts
export const customCommands: Command[] = [
  {
    name: 'spotify',
    description: 'Open my Spotify',
    category: 'custom',
    execute: () => ({ type: 'redirect', url: 'https://spotify.com/...', newTab: true }),
  },
];
```

Registry merges `customCommands` over built-ins, so users can also override (e.g. give `about` different behavior).

### Parser

Input string → tokens. Supports:
- Quoted args: `echo "hello world"` → `args: ["hello world"]`
- Long flags: `--featured`, `--limit=5`
- Short flags: `-f`, `-l 5`
- Subcommands: `theme set dracula` (handled by the command, not the parser).

---

## 5. Theme system

Themes are CSS variables. A theme lives in `src/config/themes.config.ts`:

```ts
export const themes: Theme[] = [
  {
    name: 'dracula',
    label: 'Dracula',
    colors: {
      bg: '#282a36', fg: '#f8f8f2', cursor: '#f8f8f2',
      prompt: '#50fa7b', accent: '#bd93f9',
      success: '#50fa7b', error: '#ff5555', warning: '#f1fa8c', info: '#8be9fd',
      muted: '#6272a4', selection: '#44475a', border: '#44475a',
    },
    font: { family: '"JetBrains Mono", monospace', size: '14px', lineHeight: '1.6' },
  },
  // ...
];
```

Switching a theme runs `applyTheme(name)` which writes `--bg`, `--fg`, etc. onto `document.documentElement`. Tailwind classes in components reference these via `bg-[var(--bg)]`. **Zero React re-render cost** for theme changes.

### Themes shipped

- `dracula`, `monokai`, `nord`, `gruvbox-dark`, `gruvbox-light`, `tokyo-night`, `one-dark`, `solarized-dark`, `solarized-light`, `matrix` (green-on-black), `retro` (CRT amber), `hacker` (classic green phosphor), `light` (clean white).

---

## 6. Persistence

A thin `storage` adapter in `src/lib/storage.ts` wraps `localStorage` with a namespace and JSON serialization. Stored keys:

| Key | Type | Purpose |
|---|---|---|
| `termfolio:theme` | `string` | Active theme name |
| `termfolio:font` | `string` | Custom font family override |
| `termfolio:fontSize` | `'sm' \| 'md' \| 'lg'` | Font size preference |
| `termfolio:history` | `string[]` | Last 100 commands |
| `termfolio:visited` | `boolean` | Skip boot sequence on repeat visits |

All keys are read on hydration with safe fallbacks if `localStorage` is unavailable (SSR / privacy mode).

---

## 7. Full file structure

```
termfolio/
├── .claude/
│   └── rules/
│       ├── commands.md
│       ├── themes.md
│       ├── components.md
│       ├── config.md
│       └── testing.md
├── .github/
│   └── workflows/
│       └── ci.yml                          # typecheck + test on PR
├── docs/
│   ├── ARCHITECTURE.md                     # this file
│   ├── CUSTOMIZATION.md                    # for end users / forkers
│   ├── ADDING_COMMANDS.md
│   ├── ADDING_THEMES.md
│   └── DEPLOYMENT.md
├── public/
│   ├── favicon.svg
│   ├── resume.pdf                          # user replaces this
│   └── og-image.png
├── src/
│   ├── config/                             # ┓
│   │   ├── user.config.ts                  # ┃ USER EDITS THESE
│   │   ├── commands.config.ts              # ┃ — engine never imports
│   │   ├── themes.config.ts                # ┃   anything else from here
│   │   ├── settings.config.ts              # ┃
│   │   └── index.ts                        # ┛
│   ├── components/
│   │   ├── terminal/
│   │   │   ├── Terminal.tsx                # shell, scroll-to-bottom, focus mgmt
│   │   │   ├── TerminalInput.tsx           # input line + cursor
│   │   │   ├── TerminalHistory.tsx         # rendered history
│   │   │   ├── Prompt.tsx                  # user@host:path$ template
│   │   │   ├── BootSequence.tsx            # opt-in fake boot
│   │   │   └── Cursor.tsx
│   │   ├── output/
│   │   │   ├── TextOutput.tsx
│   │   │   ├── ListOutput.tsx
│   │   │   ├── TableOutput.tsx
│   │   │   ├── CardsOutput.tsx
│   │   │   ├── ErrorOutput.tsx
│   │   │   └── JsxOutput.tsx
│   │   ├── effects/
│   │   │   ├── MatrixRain.tsx              # `matrix` command
│   │   │   ├── Typewriter.tsx              # optional typing animation
│   │   │   └── AsciiBanner.tsx
│   │   ├── settings/
│   │   │   ├── SettingsPanel.tsx           # opt-in non-terminal UI
│   │   │   └── ThemePicker.tsx
│   │   └── shell/
│   │       ├── AppShell.tsx                # full-screen layout
│   │       └── TitleBar.tsx                # macOS-style window chrome (optional)
│   ├── commands/
│   │   ├── core/
│   │   │   ├── help.ts
│   │   │   ├── clear.ts
│   │   │   ├── echo.ts
│   │   │   ├── whoami.ts
│   │   │   ├── date.ts
│   │   │   ├── history.ts
│   │   │   ├── man.ts
│   │   │   ├── pwd.ts
│   │   │   ├── ls.ts
│   │   │   └── cd.ts
│   │   ├── portfolio/
│   │   │   ├── about.ts
│   │   │   ├── projects.ts
│   │   │   ├── skills.ts
│   │   │   ├── experience.ts
│   │   │   ├── education.ts
│   │   │   ├── contact.ts
│   │   │   ├── email.ts
│   │   │   ├── social.ts
│   │   │   └── resume.ts
│   │   ├── system/
│   │   │   ├── theme.ts
│   │   │   ├── font.ts
│   │   │   ├── settings.ts
│   │   │   └── reset.ts
│   │   ├── fun/
│   │   │   ├── sudo.ts
│   │   │   ├── matrix.ts
│   │   │   ├── coffee.ts
│   │   │   ├── cowsay.ts
│   │   │   ├── fortune.ts
│   │   │   ├── neofetch.ts
│   │   │   └── banner.ts
│   │   └── index.ts                        # registry assembly
│   ├── hooks/
│   │   ├── useTerminal.ts
│   │   ├── useCommandHistory.ts            # ↑/↓ recall
│   │   ├── useAutocomplete.ts              # tab completion
│   │   ├── useKeyboardShortcuts.ts         # Ctrl+L, Ctrl+C, Ctrl+U
│   │   ├── useTheme.ts
│   │   ├── useTypewriter.ts
│   │   └── useScrollToBottom.ts
│   ├── lib/
│   │   ├── commandParser.ts                # string → { name, args, flags }
│   │   ├── commandRegistry.ts              # registers + resolves commands
│   │   ├── themeManager.ts                 # applies CSS vars
│   │   ├── storage.ts                      # localStorage adapter
│   │   ├── format.ts                       # text formatting helpers (pad, color)
│   │   └── cn.ts                           # clsx wrapper
│   ├── store/
│   │   ├── terminalStore.ts
│   │   └── themeStore.ts
│   ├── types/
│   │   ├── command.ts
│   │   ├── config.ts
│   │   ├── theme.ts
│   │   ├── output.ts
│   │   └── index.ts
│   ├── styles/
│   │   ├── globals.css                     # Tailwind directives + base
│   │   └── themes.css                      # default CSS variables
│   ├── utils/
│   │   ├── debounce.ts
│   │   ├── escapeHtml.ts
│   │   └── pad.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── parser.test.ts
│   ├── registry.test.ts
│   └── commands/
│       ├── help.test.ts
│       └── theme.test.ts
├── .editorconfig
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── bun.lockb
├── index.html
├── LICENSE
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 8. Feature list

### Core terminal behavior
- Live input with blinking cursor.
- Command history navigation with `↑` / `↓`.
- Tab autocomplete for command names and known argument values (e.g. `theme set <tab>` cycles themes).
- Keyboard shortcuts: `Ctrl+L` clear, `Ctrl+C` cancel current input, `Ctrl+U` clear line, `Ctrl+A` / `Ctrl+E` cursor to start/end.
- Auto-focus input on click anywhere in terminal area.
- Scroll-to-bottom on new output, but pause if user has scrolled up.
- Multi-output rendering: each command may emit multiple output blocks.

### Portfolio commands
- `about` — bio paragraph from config.
- `projects` — list view; `projects <slug>` for detail; `projects --featured` filter.
- `skills` — categorized list with optional proficiency bars.
- `experience` / `work` — timeline of roles.
- `education` — schools / certifications.
- `contact` — links to email, social, location.
- `email` — opens `mailto:`.
- `social` — list of links; `social github` opens GitHub directly.
- `resume` / `cv` — downloads `public/resume.pdf`.

### Customization commands
- `theme` — list available themes.
- `theme set <name>` — switch theme (persisted).
- `theme preview <name>` — preview without persisting.
- `font` — list / set fonts.
- `font size <sm|md|lg>` — text scale.
- `settings` — open optional GUI settings panel.
- `reset` — wipe all preferences.

### Core unix-like
- `help` — list commands grouped by category.
- `man <cmd>` — usage for a command.
- `clear` / `cls` — clear history.
- `echo <text>` — print.
- `whoami` — username from config.
- `date` / `time` — current date/time in user's timezone.
- `history` — past commands.
- `pwd`, `ls`, `cd` — fake filesystem mapped to portfolio sections (`cd projects` → run `projects`).

### Fun / Easter eggs
- `sudo <anything>` — `Permission denied: nice try.`
- `matrix` — falling green code rain (Esc to exit).
- `coffee` — ASCII coffee cup, "418 I'm a teapot."
- `cowsay <text>` — classic.
- `fortune` — random quote from a config-supplied list.
- `neofetch` — system-info-style block with portfolio stats.
- `banner` — big ASCII name / tagline.
- `hack` — fake hack scrolling text gag.

### Engine-level features
- Boot sequence (config-toggleable, skipped on repeat visits).
- ASCII banner on first load.
- Theme + font + history persistence in `localStorage`.
- Fully responsive (mobile keyboard handled with virtualized input).
- Reduced-motion mode (respects `prefers-reduced-motion`).
- High-contrast mode option.
- SEO meta tags from `user.config.ts`.
- OG image with name and tagline.
- Optional analytics hook (Plausible/Umami) — disabled by default.

### Customization reach
- Edit `user.config.ts` → name, bio, projects, skills, experience, education, social, contact, prompt template.
- Edit `themes.config.ts` → add/remove themes; set default.
- Edit `commands.config.ts` → add custom commands or override built-ins.
- Edit `settings.config.ts` → toggle boot sequence, banner, sound effects, prompt template, default font.

---

## 9. Type system (key shapes)

```ts
// src/types/config.ts

export interface UserConfig {
  meta: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    ogImage?: string;
  };
  user: {
    name: string;
    handle: string;            // shown in prompt
    title: string;
    location: string;
    bio: string;
    timezone: string;          // IANA tz
    avatar?: string;
  };
  prompt: {
    template: string;          // e.g. "{user}@{host}:{path}$ "
    user: string;
    host: string;
    path: string;
  };
  about: { paragraphs: string[] };
  projects: Project[];
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  social: SocialLink[];
  contact: { email: string; calendarUrl?: string; preferredContact: 'email' | 'linkedin' | 'twitter' };
  resumeUrl: string;
  fortunes?: string[];
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  tagline?: string;
  tech: string[];
  links: { live?: string; repo?: string; demo?: string };
  featured?: boolean;
  year: number;
}

export interface SkillCategory {
  name: string;
  items: { name: string; level?: 1 | 2 | 3 | 4 | 5 }[];
}

export interface Experience {
  company: string;
  role: string;
  start: string;        // ISO
  end: string | 'present';
  location?: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  start: string;
  end: string;
  details?: string;
}

export interface SocialLink {
  name: string;
  handle: string;
  url: string;
  icon?: string;        // lucide icon name
}
```

---

## 10. Performance budget

| Metric | Budget |
|---|---|
| First contentful paint | < 1.5s on 4G |
| Total bundle gzipped (no fun commands) | < 120 KB |
| With matrix + cowsay etc. | < 200 KB |
| Time to interactive | < 2.5s |
| Lighthouse perf | ≥ 95 |
| Lighthouse a11y | ≥ 95 |

Strategies:
- Lazy-load `MatrixRain` and other fun-command components.
- Tree-shakable command registry — Vite's glob import drops unused.
- No font CDN; ship JetBrains Mono subset locally.
- Precompute boot sequence frames.

---

## 11. Accessibility

- Input is a real `<input>`, not a contenteditable hack.
- Output history uses `role="log"` `aria-live="polite"`.
- All keyboard shortcuts have non-shortcut equivalents.
- `prefers-reduced-motion` disables: typewriter, matrix, boot sequence, cursor blink.
- Color contrast ≥ 4.5:1 for all default themes; theme validator warns on submit.
- Settings panel reachable with `settings` command and a visible button (top-right).

---

## 12. Deployment targets

| Platform | Notes |
|---|---|
| Vercel | Default — `vercel.json` with rewrites for SPA. |
| Netlify | `netlify.toml` with `_redirects` for SPA. |
| Cloudflare Pages | Build cmd `bun run build`, output `dist/`. |
| GitHub Pages | `vite.config.ts` `base` flag; GitHub Action ships `dist/`. |
| Self-host | Any static host. `dist/` is fully self-contained. |
