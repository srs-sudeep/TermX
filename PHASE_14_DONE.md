# PHASE 14 DONE — Tests

## Files created

| File | Purpose |
|---|---|
| `tests/helpers/mockContext.ts` | `mockContext()` factory used by all command tests |
| `tests/commands/projects.test.ts` | Happy path, slug lookup, filters, error paths, autocomplete |
| `tests/commands/theme.test.ts` | `list`, `set`, `preview`, autocomplete, timer behaviour |
| `tests/commands/help.test.ts` | Output shape, hidden-command exclusion, visible-command inclusion |
| `tests/commands/man.test.ts` | No-arg error, unknown-command error, happy path sections, alias resolution |
| `tests/storage.test.ts` | Happy path, fallback on absent key, all three error kinds, round-trips |

## Existing files (not modified)

| File | Notes |
|---|---|
| `tests/parser.test.ts` | Already comprehensive — quotes, flags, edge cases. No additions needed. |
| `tests/registry.test.ts` | Already comprehensive — alias resolution, collision detection, custom override. No additions needed. |

---

## `mockContext` helper

Returns a full `CommandContext` with sane defaults. Fields that need no assertion in a given test can simply be omitted:

```ts
// Minimal — tests a command that only reads ctx.config
const ctx = mockContext({ args: ['quill'] });

// Full override — tests theme switching
const ctx = mockContext({ args: ['set', 'nord'], currentTheme: 'dracula' });

// Config override — tests empty-project edge case
const ctx = mockContext({ config: { ...userConfig, projects: [] } });
```

`ctx.theme.set`, `ctx.history.clear`, and `ctx.dispatch` are all `vi.fn()` stubs — callable and inspectable without side effects.

---

## `projects.test.ts` — coverage summary

| Scenario | Path tested |
|---|---|
| No args/flags → all cards | Happy path |
| Known slug → single card | Happy path |
| Card title/subtitle/tags match config | Shape correctness |
| Unknown slug → error with slug in message | Error path |
| Slug not in filtered list → error | Combined filter + slug |
| `--featured` → only featured projects | Flag filter |
| `--year=2024` → 2024 projects only | Flag filter |
| `--year=1900` → muted text (empty) | Filter produces no results |
| `config.projects = []` → muted text | Empty-config edge case |
| `autocomplete('q')` → contains 'quill' | Partial match |
| `autocomplete('')` → all slugs | Empty partial |
| `autocomplete('zzz')` → empty | No match |

---

## `theme.test.ts` — coverage summary

| Scenario | Path tested |
|---|---|
| `theme` / `theme list` → list output | Happy path |
| Active theme marked with ✓ | List correctness |
| `theme set dracula` → success + calls ctx.theme.set | Happy path |
| `theme set` applies to document (applyTheme) | Side-effect |
| `theme set unknown` → error | Error path |
| `theme set` (no name) → error | Error path |
| `theme preview dracula` → muted text, no ctx.theme.set | Happy path, no-persist check |
| Preview reverts after 10 s (fake timers) | Timer behaviour |
| `theme preview unknown` → error | Error path |
| `theme foobar` → error with "unknown subcommand" | Error path |
| Autocomplete after `theme set` → theme names | Autocomplete |

**Timer handling:** `vi.useFakeTimers()` / `vi.useRealTimers()` in beforeEach/afterEach prevents the 10-second preview revert from leaking between tests and keeps the suite fast.

---

## `help.test.ts` — design note

`help` calls `createRegistry()` internally. Vitest resolves `import.meta.glob` at test time, so the full real registry is available. Tests assert structural invariants (list shape, indent levels, hidden-command exclusion) rather than an exact command list, making them resilient to future command additions.

Hidden commands verified absent: `man`, `matrix`, `hack`.
Visible commands verified present: `help`, `about`, `projects`, `theme`.

---

## `man.test.ts` — design note

`man` also calls `createRegistry()` internally. Tests cover:
- No-arg error
- Unknown-command error (message contains the bad name)
- Section headings in happy-path output (`NAME`, `DESCRIPTION`, `USAGE`, `ALIASES`)
- Alias resolution (`work` → `projects` manual, `cls` → `clear` manual)
- The command resolves itself (`man man`)

---

## `storage.test.ts` — error fallback coverage

All three localStorage failure modes that the `get` JSDoc documents are tested:

| Error type | Tested via |
|---|---|
| `SecurityError` (privacy blocking) | `vi.spyOn(...).mockImplementation(() => { throw new DOMException(..., 'SecurityError') })` |
| `QuotaExceededError` (storage full) | `vi.spyOn(...).mockImplementation(() => { throw new DOMException(..., 'QuotaExceededError') })` for `set`; generic Error for `get` |
| `SyntaxError` (corrupt JSON) | `localStorage.setItem(key, 'not-json{{{')` — JSON.parse throws natively |

All three operations (`get`, `set`, `remove`) have their own silent-fail tests.

---

## Decisions

1. **`mockContext` uses the real `userConfig`** — tests exercise actual config data (Sam Reyes), making assertions concrete (`card.title === 'Quill'`) rather than generic.
2. **No snapshot tests** — per testing rules. All assertions target specific fields.
3. **`vi.useFakeTimers()` in theme tests** — the module-level `previewTimer` in `theme.ts` persists across calls. Without fake timers, a 10 s real timeout would either slow the suite or leak into subsequent tests.
4. **`afterEach` clears `document.documentElement`** — `applyTheme` mutates the DOM; cleanup prevents cross-test contamination.
5. **`beforeEach: localStorage.clear()`** in storage tests — prevents any test leaving state that pollutes the next.
6. **`help` and `man` tests rely on real registry** — Vitest transforms `import.meta.glob` at test time. Tests for structural invariants (not exact lists) remain valid as commands are added.
