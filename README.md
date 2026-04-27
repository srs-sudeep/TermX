# TermX

> A terminal-emulator portfolio — fully data-driven, forkable in 10 minutes.

**Live demo → [termx.vercel.app](https://termx.vercel.app)**

![TermX hero](public/hero.png)

---

## Highlights

- **Pure terminal interface** — keyboard-first, no traditional UI to design.
- **Fork-ready** — edit `src/config/user.config.ts` and you're done.
- **14 themes** — Dracula, Nord, Tokyo Night, Solarized Dark/Light, Matrix, Retro CRT, Gruvbox, Monokai, One Dark, Hacker, Light, and more. Switch live with `theme set <name>`.
- **Real terminal feel** — `↑`/`↓` history recall, `Tab` autocomplete, `Ctrl+L` / `Ctrl+C` / `Ctrl+U`, blinking cursor, configurable prompt template.
- **oh-my-zsh–style prompt** — colored `user@host:path ❯` segments.
- **Boot sequence + ASCII name banner** on first visit (skippable, respects `prefers-reduced-motion`).
- **Persistent preferences** — theme, font, history saved to `localStorage`. No account needed.
- **Mobile responsive** — `100dvh` height, soft-keyboard handled, tap targets ≥ 44 px.
- **Accessible** — `prefers-reduced-motion` respected, screen-reader compatible.
- **Frontend only** — no backend, no tracking, no data leaves the browser.

---

## Screenshots

### Welcome & Help

| Welcome screen | Help |
|---|---|
| ![welcome](public/hero.png) | ![help](public/help.png) |

### Portfolio Commands

| `whoami` | `projects` |
|---|---|
| ![whoami](public/whomai.png) | ![projects](public/projects.png) |

| `experience` | `education` |
|---|---|
| ![experience](public/experience.png) | ![education](public/education.png) |

| `contact` | `neofetch` |
|---|---|
| ![contact](public/contact.png) | ![neofetch](public/neofetch.png) |

| `sudo` / `fortune` | Settings panel |
|---|---|
| ![sudo fortune](public/sudo-fortune.png) | ![settings](public/settings.png) |

---

## Themes

Switch with `theme set <name>` or open the settings panel.

| | | |
|---|---|---|
| ![termfolio](public/themes/termfolio.png) | ![dracula](public/themes/dracula.png) | ![tokyo-night](public/themes/tokyo-night.png) |
| **termfolio** (default) | **dracula** | **tokyo-night** |
| ![nord](public/themes/nord.png) | ![one-dark](public/themes/one-dark.png) | ![monokai](public/themes/monokai.png) |
| **nord** | **one-dark** | **monokai** |
| ![gruvbox-dark](public/themes/gruvbox-dark.png) | ![gruvbox-light](public/themes/gruvbox-light.png) | ![solarized-dark](public/themes/solarized-dark.png) |
| **gruvbox-dark** | **gruvbox-light** | **solarized-dark** |
| ![solarized-light](public/themes/solarized-light.png) | ![hacker](public/themes/hacker.png) | ![matrix](public/themes/matrix.png) |
| **solarized-light** | **hacker** | **matrix** |
| ![retro](public/themes/retro.png) | ![light](public/themes/light.png) | |
| **retro** | **light** | |

---

## Commands

```
core
  help        Show available commands
  clear       Clear the terminal  (alias: cls)
  echo        Print text
  whoami      Who am I
  date        Current date and time
  history     Show command history
  man         Manual page for a command
  pwd         Current directory
  ls          List directory contents
  cd          Change directory

portfolio
  about       Who I am  (alias: bio)
  projects    Browse my projects  (alias: work)
  skills      My skills
  experience  Work experience
  education   Education history
  contact     Get in touch
  social      Social profiles
  resume      Download my résumé  (alias: cv)

system
  theme       Manage terminal themes
  font        Change font family or size
  settings    Open the settings panel
  reset       Reset all preferences

fun
  neofetch    System info, terminal-style
  banner      Large ASCII name
  cowsay      Classic cowsay
  fortune     Random programming wisdom
  coffee      418 I'm a teapot
  sudo        Permission denied: nice try.
  matrix      Enter the Matrix  (Esc to exit)
  hack        Elite hacking simulation
```

---

## Quick start

```bash
# 1. Fork this repo on GitHub, then clone your fork
git clone https://github.com/YOUR_HANDLE/TermX.git
cd TermX

# 2. Install dependencies
bun install

# 3. Edit your personal data — this is the only file you need to touch
$EDITOR src/config/user.config.ts

# 4. Start the dev server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Customize

Everything user-editable lives in `src/config/`.

| File | What lives here |
|---|---|
| `user.config.ts` | Name, bio, projects, skills, experience, education, social links, contact, fortunes |
| `themes.config.ts` | Colour themes — add your own or remove ones you don't need |
| `commands.config.ts` | Custom commands or overrides for built-in commands |
| `settings.config.ts` | Boot sequence on/off, default theme, typewriter effect, prompt template |

### Add a command

```ts
// src/config/commands.config.ts
import type { Command } from '@/types';

export const customCommands: Command[] = [
  {
    name: 'spotify',
    description: 'Open my Spotify profile',
    category: 'custom',
    execute: () => ({
      type: 'redirect',
      url: 'https://open.spotify.com/user/yourhandle',
      newTab: true,
    }),
  },
];
```

### Add a theme

```ts
// src/config/themes.config.ts — append to the themes array
{
  name: 'catppuccin',
  label: 'Catppuccin Mocha',
  mode: 'dark',
  colors: {
    bg: '#1e1e2e', fg: '#cdd6f4', cursor: '#f5e0dc',
    prompt: '#a6e3a1', accent: '#cba6f7',
    success: '#a6e3a1', error: '#f38ba8',
    warning: '#f9e2af', info: '#89dceb',
    muted: '#6c7086', selection: '#313244', border: '#45475a',
  },
  font: { family: '"JetBrains Mono", monospace', size: '14px', lineHeight: '1.6' },
},
```

Then run `theme set catppuccin`.

---

## Deploy

TermX is a static SPA — deploy anywhere.

```bash
bun run build   # output: dist/
```

| Platform | Instructions |
|---|---|
| **Vercel** | `vercel --prod` — `vercel.json` included, zero config |
| **Netlify** | Connect your repo — `netlify.toml` included |
| **GitHub Pages** | Push to `main` — Actions workflow builds and publishes |
| **Cloudflare Pages** | Build command `bun run build`, output directory `dist` |

---

## Stack

| | |
|---|---|
| Runtime / pkg manager | Bun |
| Bundler | Vite 5 |
| UI | React 18 + TypeScript 5 strict |
| Styling | TailwindCSS 3 + CSS variables |
| State | Zustand 4 |
| Animation | Framer Motion 11 |
| Testing | Vitest 2 + Testing Library |

---

## Dev scripts

```bash
bun run dev           # start Vite dev server (HMR)
bun run build         # tsc --noEmit + vite build
bun run preview       # preview the production build locally
bun run typecheck     # tsc --noEmit only
bun run lint          # ESLint (zero warnings allowed)
bun run format        # Prettier
bun run test          # Vitest (single run)
bun run test:watch    # Vitest watch mode
bun run test:coverage # coverage report
```

---

## Project layout

```
src/
├── config/      ← USER-EDITABLE: your personal data + settings
├── commands/    ← one file per command (core / portfolio / system / fun)
├── components/  ← React UI components
├── hooks/       ← custom React hooks
├── lib/         ← framework-agnostic logic (parser, registry, storage)
├── store/       ← Zustand stores (terminal, theme)
├── types/       ← TypeScript types (single source of truth)
└── styles/      ← global CSS + theme variable definitions
```

---

## License

MIT — fork freely, that's the point.

