# Customization guide

termfolio is config-first: every value a visitor sees comes from `src/config/`. The engine is generic and never needs editing.

---

## The five-minute version

1. Open `src/config/user.config.ts`.
2. Replace every `'Sam Reyes'` / `'sam'` value with your own data.
3. Swap the projects array for your actual projects.
4. Run `bun run dev` and check the result.
5. Deploy.

That's it. The rest of this document covers every option in depth.

---

## `user.config.ts`

### Site metadata

```ts
meta: {
  siteName: 'Your Name — Terminal Portfolio',
  siteDescription: 'One-line description for search engines and social cards.',
  siteUrl: 'https://yoursite.dev',
  ogImage: '/og-image.png',   // place the image in public/
},
```

`siteUrl` and `ogImage` are used in `<head>` meta tags. `ogImage` is optional — remove the key if you don't have one.

### User details

```ts
user: {
  name: 'Your Name',      // shown in the ASCII banner and whoami
  handle: 'you',          // shown in the terminal prompt
  title: 'Software Engineer',
  location: 'City, Country',
  bio: 'One-sentence tagline shown by the about command.',
  timezone: 'America/New_York',   // IANA timezone identifier
  avatar: '/avatar.png',          // optional — place in public/
},
```

### Prompt template

```ts
prompt: {
  template: '{user}@{host}:{path}$ ',
  user: 'you',          // replaces {user}
  host: 'portfolio',    // replaces {host}
  path: '~',            // replaces {path}
},
```

The `path` value is static — it doesn't change when the user runs `cd` (the `cd` command updates a separate runtime value in the store). Set it to anything that fits your aesthetic: `~`, `/home/you`, `portfolio`, etc.

### About

```ts
about: {
  paragraphs: [
    'First paragraph of your bio.',
    'Second paragraph.',
    // Add as many as you like.
  ],
},
```

Each string is rendered as a separate paragraph by the `about` command.

### Projects

```ts
projects: [
  {
    slug: 'my-app',          // URL-safe identifier; used by `projects my-app`
    name: 'My App',
    tagline: 'One-line description.',
    description: 'Longer paragraph shown on the detail card.',
    tech: ['React', 'TypeScript', 'Vercel'],
    links: {
      live: 'https://myapp.dev',     // optional
      repo: 'https://github.com/…',  // optional
      demo: 'https://…',             // optional
    },
    featured: true,    // shown by `projects --featured`
    year: 2024,
  },
],
```

The `projects` command accepts:
- `projects` — all projects
- `projects my-app` — detail view for one project
- `projects --featured` — featured only
- `projects --year=2024` — filtered by year

### Skills

```ts
skills: [
  {
    name: 'Languages',   // category header
    items: [
      { name: 'TypeScript', level: 5 },   // level 1–5
      { name: 'Python', level: 3 },
    ],
  },
  {
    name: 'Frontend',
    items: [ /* ... */ ],
  },
],
```

Levels 1–5 are rendered as a filled bar (e.g. `█████`, `███░░`).

### Experience

```ts
experience: [
  {
    company: 'Acme Corp',
    role: 'Senior Engineer',
    start: '2022-06',   // YYYY-MM
    end: 'present',     // or YYYY-MM
    location: 'Remote',
    bullets: [
      'Shipped X, which improved Y by Z%.',
    ],
  },
],
```

### Education

```ts
education: [
  {
    institution: 'University of …',
    degree: 'B.S. Computer Science',
    start: '2015',
    end: '2019',
    details: 'Optional details, honours, focus areas.',
  },
],
```

### Social links

```ts
social: [
  {
    name: 'GitHub',
    handle: '@yourhandle',
    url: 'https://github.com/yourhandle',
    icon: 'github',   // 'github' | 'linkedin' | 'twitter' | 'rss' | 'globe'
  },
],
```

The `social` command renders each entry as a clickable link.

### Contact

```ts
contact: {
  email: 'hello@yoursite.dev',
  calendarUrl: 'https://cal.com/yourhandle/30min',   // optional
  preferredContact: 'email',
},
```

`calendarUrl` is shown alongside the email in the `contact` command output. Remove it if you don't have one.

### Resume

```ts
resumeUrl: '/resume.pdf',   // place the file in public/
```

The `resume` command triggers a browser download. If you don't have a PDF yet, set this to `''` — the command will show a graceful error.

### Fortunes

```ts
fortunes: [
  'First, solve the problem. Then, write the code.',
  'Make it work, make it right, make it fast. — Kent Beck',
  // Add as many as you like.
],
```

Shown by `fortune` (random pick). Add your own favourites.

---

## `settings.config.ts`

```ts
export const settings = {
  defaultTheme: 'dracula',      // must match a name in themes.config.ts
  defaultFontSize: 'md',        // 'sm' | 'md' | 'lg'
  bootSequence: true,           // show the 1.5 s boot animation on first visit
  showBanner: true,             // show the ASCII name banner on load
  typewriter: false,            // animate text output with a typewriter effect
};
```

Users can override `bootSequence` and `typewriter` at runtime via the Settings panel. Their preference is stored in `localStorage` and persists across visits.

---

## `themes.config.ts`

See [ADDING_THEMES.md](./ADDING_THEMES.md) for a full guide on adding and modifying themes.

---

## `commands.config.ts`

See [ADDING_COMMANDS.md](./ADDING_COMMANDS.md) for a full guide on writing custom commands.

---

## What's new (version history)

| Version | Config additions |
|---|---|
| 0.1.0 | Initial release — all fields above |
