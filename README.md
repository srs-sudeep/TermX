# TermX

> A terminal-emulator portfolio — fully data-driven, forkable in 10 minutes.

[![Repository](https://img.shields.io/badge/Repository-srs--sudeep%2FTermX-181717?logo=github&logoColor=white)](https://github.com/srs-sudeep/Termx)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-termx.vercel.app-000000?logo=vercel&logoColor=white)](https://termx.vercel.app/)
[![Video Demo](https://img.shields.io/badge/Video%20Demo-YouTube-FF0000?logo=youtube&logoColor=white)](https://youtu.be/-oJOWGoLEAc)

**Links**

- 📦 **Repository** — [github.com/srs-sudeep/Termx](https://github.com/srs-sudeep/Termx)
- 🌐 **Live Demo** — [termx.vercel.app](https://termx.vercel.app/)
- 🎬 **Video Demo** — [youtu.be/-oJOWGoLEAc](https://youtu.be/-oJOWGoLEAc)

![TermX hero](public/hero.png)

---

## Inspiration

TermX was inspired by [satnaing/terminal-portfolio](https://github.com/satnaing/terminal-portfolio).

---

## Highlights

- **Powerline-style prompt** — oh-my-zsh inspired colored segments (`user@host ▶ path ▶ ❯`) that adapt to the active theme.
- **Ghost-text autocomplete** — inline suggestions with `Tab` cycling and `→` to accept, no popup lists in the buffer.
- **Looks and feels like a real terminal** — boot sequence, command history, autocomplete, ANSI-style output, and a Matrix-rain easter egg.
- **14 themes built in** — Tokyo Night by default; switch with `theme set <name>` or the settings panel.
- **Easy to make your own** — update one config file (`src/config/user.config.ts`) with your name, projects, experience, and links.
- **Strong first impression** — large ASCII banner of your name plus a portrait emblem on the welcome screen.
- **Remembers your preferences** — theme, font, and other settings persist via `localStorage`.
- **Works well on desktop and mobile** — responsive layout, accessible focus management, reduced-motion support.
- **Private by design** — 100% client-side, no analytics, no backend, no account.
- **Quality-gated** — lint, typecheck, and 180+ tests run via Husky pre-push hook.

---

## Screenshots

### Welcome & Help

| Welcome screen              | Help                     |
| --------------------------- | ------------------------ |
| ![welcome](public/hero.png) | ![help](public/help.png) |

### Portfolio Commands

| `whoami`                     | `projects`                       |
| ---------------------------- | -------------------------------- |
| ![whoami](public/whomai.png) | ![projects](public/projects.png) |

| `experience`                         | `education`                        |
| ------------------------------------ | ---------------------------------- |
| ![experience](public/experience.png) | ![education](public/education.png) |

| `contact`                      | `neofetch`                       |
| ------------------------------ | -------------------------------- |
| ![contact](public/contact.png) | ![neofetch](public/neofetch.png) |

| `sudo` / `fortune`                       | Settings panel                   |
| ---------------------------------------- | -------------------------------- |
| ![sudo fortune](public/sudo-fortune.png) | ![settings](public/settings.png) |

---

## Themes

Switch with `theme set <name>` or open the settings panel.

|                                                       |                                                   |                                                     |
| ----------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| ![tokyo-night](public/themes/tokyo-night.png)         | ![termfolio](public/themes/termfolio.png)         | ![dracula](public/themes/dracula.png)               |
| **tokyo-night** (default)                             | **termfolio**                                     | **dracula**                                         |
| ![nord](public/themes/nord.png)                       | ![one-dark](public/themes/one-dark.png)           | ![monokai](public/themes/monokai.png)               |
| **nord**                                              | **one-dark**                                      | **monokai**                                         |
| ![gruvbox-dark](public/themes/gruvbox-dark.png)       | ![gruvbox-light](public/themes/gruvbox-light.png) | ![solarized-dark](public/themes/solarized-dark.png) |
| **gruvbox-dark**                                      | **gruvbox-light**                                 | **solarized-dark**                                  |
| ![solarized-light](public/themes/solarized-light.png) | ![hacker](public/themes/hacker.png)               | ![matrix](public/themes/matrix.png)                 |
| **solarized-light**                                   | **hacker**                                        | **matrix**                                          |
| ![retro](public/themes/retro.png)                     | ![light](public/themes/light.png)                 |                                                     |
| **retro**                                             | **light**                                         |                                                     |

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

| File                 | What lives here                                                                     |
| -------------------- | ----------------------------------------------------------------------------------- |
| `user.config.ts`     | Name, bio, projects, skills, experience, education, social links, contact, fortunes |
| `themes.config.ts`   | Colour themes — add your own or remove ones you don't need                          |
| `commands.config.ts` | Custom commands or overrides for built-in commands                                  |
| `settings.config.ts` | Boot sequence on/off, default theme, typewriter effect, prompt template             |

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

| Platform             | Instructions                                           |
| -------------------- | ------------------------------------------------------ |
| **Vercel**           | `vercel --prod` — `vercel.json` included, zero config  |
| **Netlify**          | Connect your repo — `netlify.toml` included            |
| **GitHub Pages**     | Push to `main` — Actions workflow builds and publishes |
| **Cloudflare Pages** | Build command `bun run build`, output directory `dist` |

---

## Stack

|                       |                                 |
| --------------------- | ------------------------------- |
| Runtime / pkg manager | Bun                             |
| Bundler               | Vite 5                          |
| UI                    | React 18 + TypeScript 5 strict  |
| Styling               | TailwindCSS 3 + CSS variables   |
| State                 | Zustand 4                       |
| Animation             | Framer Motion 11                |
| Testing               | Vitest 2 + Testing Library      |
| Code quality          | ESLint 8 + Prettier 3 + Husky 9 |

---

## Keyboard shortcuts

| Key        | Action                               |
| ---------- | ------------------------------------ |
| `Tab`      | Autocomplete / cycle through matches |
| `→`        | Accept ghost-text suggestion         |
| `↑` / `↓`  | Navigate command history             |
| `Ctrl + L` | Clear screen                         |
| `Ctrl + C` | Cancel current input                 |
| `Ctrl + U` | Clear input line                     |
| `Esc`      | Exit `matrix` / `hack` effects       |

---

## Dev scripts

```bash
bun run dev           # start Vite dev server (HMR)
bun run build         # tsc --noEmit + vite build
bun run preview       # preview the production build locally
bun run typecheck     # tsc --noEmit only
bun run lint          # ESLint (zero warnings allowed)
bun run lint:fix      # auto-fix lint issues
bun run format        # Prettier write
bun run format:check  # Prettier check (CI)
bun run test          # Vitest (single run)
bun run test:watch    # Vitest watch mode
bun run test:coverage # coverage report
bun run validate      # lint + typecheck + tests (CI gate)
bun run prepush       # format + validate (run before pushing)
```

### Git hooks (Husky)

Installed automatically on `bun install`:

- **`pre-commit`** — runs lint + typecheck on every commit
- **`pre-push`** — runs format + lint + typecheck + tests before push

Bypass with `--no-verify` if absolutely needed (not recommended).

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
