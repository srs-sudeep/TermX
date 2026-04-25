# Rules: config

Read this file before touching anything in `src/config/` or any type in `src/types/config.ts`.

---

## 1. Config files are public API

`src/config/*.ts` is what forkers edit to make the site their own. Treat it exactly like you would a published library's public API:

- **Never break an existing shape.** Adding optional fields is safe. Renaming or removing fields requires a deprecation path.
- **Never add runtime side effects** to a config file. It's data, not behavior. No `fetch`, no `localStorage`, no `Date.now()` at module scope.
- **Comments explain intent.** A user reading the file should understand what each field does without reading the engine.

## 2. What lives where

| File                 | Contents                                                                            |
| -------------------- | ----------------------------------------------------------------------------------- |
| `user.config.ts`     | Personal data only — no engine settings, no theme defs, no commands.                |
| `themes.config.ts`   | Theme definitions. Order matters (first is the fallback default).                   |
| `commands.config.ts` | Custom commands + overrides for built-ins.                                          |
| `settings.config.ts` | Engine toggles — boot sequence, banner, typewriter, default theme, prompt template. |
| `index.ts`           | Re-exports only. No logic.                                                          |

If you're about to put engine logic into `user.config.ts`, stop — it belongs elsewhere.

## 3. Required vs optional

- Fields the site cannot render without → required, no default.
- Fields with a reasonable fallback → optional, fallback applied in the consumer.

Examples:

```ts
// Required — site is broken without a name
user: {
  name: string;
  handle: string;
  title: string;
  location: string;
  bio: string;
  timezone: string;
  avatar?: string;       // optional — we render initials fallback
}
```

Never make `name` optional "just in case." Either the site has an owner or it doesn't.

## 4. Validation

At app startup, `src/lib/validateConfig.ts` runs a shallow validation of `userConfig` and logs warnings (not throws) for:

- Missing required fields.
- Bad URLs in `social[*].url` or `resumeUrl`.
- Unknown theme in `settings.defaultTheme`.
- Duplicate project slugs.

Warnings go to the console in dev, silent in prod. The goal is to help forkers debug, not to gate the site.

**Don't use Zod or Yup.** A 50-line hand-rolled validator is fine and keeps the bundle small.

## 5. Backwards compatibility

When a new release of the engine adds a config field:

1. Make it optional in the type.
2. Default it in the consumer.
3. Document it in `docs/CUSTOMIZATION.md` under "What's new."

When deprecating a field:

1. Mark with `/** @deprecated Use X instead. */` JSDoc.
2. Keep supporting it for at least one minor version.
3. Migrate the example `user.config.ts` to the new field in the same PR.

## 6. Example values

Every config file ships with **realistic, plausible example data** — not `"TODO"`, not `"Your Name Here"`. A new user should be able to run `bun run dev` and see a complete, working demo site populated with "Sam Reyes" (our example persona).

```ts
// ✓ Good
projects: [
  {
    slug: 'quill',
    name: 'Quill',
    description: 'A minimalist markdown journaling app…',
    tech: ['React', 'IndexedDB', 'PWA'],
    links: { live: 'https://quill.example.com', repo: 'https://github.com/...' },
    featured: true,
    year: 2024,
  },
],

// ✗ Bad
projects: [
  { slug: 'project-1', name: 'Project 1', description: 'My first project', tech: [], links: {}, year: 2024 },
],
```

## 7. Comments

Top of each config file — a banner comment:

```ts
/**
 * USER-EDITABLE CONFIG — this is your portfolio's personal data.
 *
 * Edit the values below. The engine reads from this file at build time.
 * Docs: docs/CUSTOMIZATION.md
 */
```

Complex fields get an inline explanation:

```ts
prompt: {
  // Template tokens: {user}, {host}, {path}. Example: "{user}@{host}:{path}$ "
  template: '{user}@{host}:{path}$ ',
  user: 'sam',
  host: 'portfolio',
  path: '~',
},
```

## 8. Types — single source of truth

The types live in `src/types/config.ts`. `config/*.ts` files **never** re-declare types locally; they import from `@/types`.

```ts
// ✓
import type { UserConfig } from '@/types';
export const userConfig: UserConfig = { ... };

// ✗
export const userConfig: { user: { name: string; ... } } = { ... };
```

## 9. Using `as const` and `satisfies`

Use `satisfies UserConfig` over type annotation so tuple/literal types survive:

```ts
export const userConfig = {
  // ...
} satisfies UserConfig;
```

This lets autocomplete and narrowing work on individual fields (e.g. `userConfig.user.name` stays literally the name, not `string`).

## 10. No secrets

There are zero API keys, tokens, or secrets in any config file — ever. If a future feature needs one (e.g. analytics write key), it goes in `.env` and is surfaced through `import.meta.env`. Document the env var in `docs/DEPLOYMENT.md`.

## 11. What config files must not do

- Import from `@/components`, `@/commands`, `@/hooks`, or `@/store`.
  - Exception: `commands.config.ts` imports `Command` from `@/types` and can reference lib helpers if needed.
- Run at import time (no IIFEs, no `console.log`).
- Export functions other than `Command.execute` handlers inside `commands.config.ts`.
- Depend on runtime environment (`window`, `document`, `navigator`). Engine code reads the config and then uses those, not the config itself.
