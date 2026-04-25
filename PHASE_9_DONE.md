# PHASE 9 DONE — Portfolio Commands

## Files created

| File | Command | Output type | Notes |
|---|---|---|---|
| `src/commands/portfolio/about.ts` | `about` (alias: `bio`) | `text` | Paragraphs joined with `\n\n` |
| `src/commands/portfolio/projects.ts` | `projects` (alias: `work`) | `cards` | Filters: slug, `--featured`, `--year` |
| `src/commands/portfolio/skills.ts` | `skills` | `table` | █░ level bars; grouped by category |
| `src/commands/portfolio/experience.ts` | `experience` (alias: `exp`) | `cards` | Bullet list per role |
| `src/commands/portfolio/education.ts` | `education` (alias: `edu`) | `cards` | Degree, institution, dates, details |
| `src/commands/portfolio/contact.ts` | `contact` | `list` | Email, calendar link, preferred social |
| `src/commands/portfolio/social.ts` | `social` | `list` / `redirect` | `social <name>` opens URL in new tab |
| `src/commands/portfolio/email.ts` | `email` | `redirect` | `mailto:` with `newTab: false` |
| `src/commands/portfolio/resume.ts` | `resume` (alias: `cv`) | `download` | Downloads `config.resumeUrl` |

---

## Command details

### `projects` — filter pipeline

```
config.projects
  → filter(featured)  if --featured flag
  → filter(year)      if --year=YYYY flag
  → find(slug)        if positional arg given → single card or error
  → map(toCard)       for list view
```

Autocomplete: slug list filtered by `partial`. Users get `projects q<Tab>` → `quill`.

### `skills` — `█░` level bar

```typescript
'█'.repeat(level) + '░'.repeat(5 - level)
```

Table column order: Category | Skill | Level. Each row is one skill — categories repeat in column 0 (no row-span in this output type).

### `experience` — card anatomy

```
title    = role
subtitle = company · start–end · location
bullets  = achievement list
```

### `contact` — output ordering

Always shows email first, then calendar URL (if configured), then the preferred social link from `config.contact.preferredContact`. Appends tip list for `social` and `email` commands.

### `social <name>` → redirect

Matched case-insensitively against `s.name`. Returns `redirect` with `newTab: true`. Unrecognised names return an `error` listing valid options.

### `email` — `newTab: false`

`mailto:` URIs don't navigate the page — the browser hands them to the mail client. `newTab: false` causes `useTerminal` to use `window.location.href`, which for `mailto:` simply opens the system mailer without leaving the SPA.

---

## Autocomplete coverage

| Command | Autocomplete source |
|---|---|
| `projects` | Project slugs from `config.projects` |
| `social` | Social names (lowercased) from `config.social` |
| Others | None needed (no finite arg set) |

---

## Decisions

1. **`skills` uses `table`** — alternatives were `list` (hard to align levels) and `cards` (too much whitespace). Table aligns naturally.
2. **`experience` uses `cards`** — bullets are the core content; list items would lose the visual grouping per role.
3. **`education` uses `cards`** — matches `experience` style for visual consistency.
4. **`contact` lists, doesn't redirect** — users may want to copy the email address. `email` command is the redirect shortcut.
5. **`resume` `filename: 'resume.pdf'` hardcoded** — the filename shown in the browser download dialog. The actual URL comes from `config.resumeUrl`.

---

## Follow-ups for later phases

- **Phase 11** (`neofetch`): Uses `config.user`, `config.projects.length`, and active theme name — no command changes needed.
- **Phase 14** (tests): `projects.test.ts` should cover slug filter, featured filter, missing slug error, and empty result set.
