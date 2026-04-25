# PHASE 4 DONE — Command Parser & Registry

## Files created

| File | Purpose |
|---|---|
| `src/lib/commandParser.ts` | Tokeniser + parser; `ParsedCommand \| null` |
| `src/lib/commandRegistry.ts` | `buildRegistry` (pure) + `createRegistry` (Vite glob) |
| `tests/parser.test.ts` | 33 test cases across 6 describe blocks |
| `tests/registry.test.ts` | 33 test cases across 8 describe blocks |

---

## `commandParser.ts`

### API

| Export | Signature | Notes |
|---|---|---|
| `parse` | `(input: string) → ParsedCommand \| null` | Main entry point |
| `ParseError` | `extends Error` | Thrown for unterminated quotes |

### Two-stage design

1. **`tokenize(input)`** — internal function; quote-aware splitting. Builds a `string[]` of tokens. Throws `ParseError` on unterminated single or double quote.
2. **`parse(input)`** — iterates over tokens and classifies each as a flag or positional arg.

### Flag parsing rules

| Input token | Rule | Result |
|---|---|---|
| `--key=value` | `=` found → split on first `=` | `flags.key = 'value'` |
| `--key` + next token doesn't start with `-` | Greedy peek | `flags.key = nextToken`; next token consumed |
| `--key` + next token starts with `-` or EOI | No value | `flags.key = true` |
| `-k` (any length ≥ 1 after `-`) | Short flag, boolean only | `flags.k = true` |
| Everything else | Positional | `args.push(token)` |

### The `--key value` ambiguity

The greedy peek rule means that `projects --featured quill` gives `{ featured: 'quill' }` (empty args), not `{ featured: true, args: ['quill'] }`. This is documented in the source and the test file. The safe convention: positional args before bare `--key` flags. All built-in command usage strings follow this convention (`projects [slug] [--featured] [--year=YYYY]`).

---

## `commandRegistry.ts`

### API

| Export | Signature | Notes |
|---|---|---|
| `Registry` | `interface` | Returned by both functions |
| `buildRegistry` | `(commands: Command[]) → Registry` | Pure; used in tests |
| `createRegistry` | `() → Registry` | Uses `import.meta.glob`; used in app |

### `buildRegistry` — design

- Builds a single `Map<string, Command>` keyed by lowercase name **and** all aliases.
- Collision detection: throws on duplicate name OR alias conflicts.
- `all()` and `byCategory()` use `new Set(map.values())` for O(1) deduplication — a command with 3 aliases appears once.
- `complete(partial)` returns all matching keys (names + aliases), sorted. Includes hidden commands.
- All lookups are case-insensitive (keys stored lowercase).

### `createRegistry` — merge strategy

```
glob modules (built-ins)
  → Map keyed by name.toLowerCase()
  → for each customCommand: map.set(custom.name, custom)   ← override or add
  → buildRegistry([...map.values()])
```

The merge happens *before* `buildRegistry` so the validator never sees both the built-in and the override simultaneously. No collision thrown for intentional overrides.

### Zero-command safety

`import.meta.glob('/src/commands/**/*.ts', { eager: true })` returns `{}` when no files match. `createRegistry()` therefore produces a valid empty registry in Phase 4. The smoke tests in `registry.test.ts` verify this.

---

## Tests

### `parser.test.ts` — 33 cases in 6 blocks

| Block | Cases |
|---|---|
| empty input | 3 — empty string, whitespace, tab |
| basic command name | 5 — name, lowercase, trim, raw preservation |
| positional args | 3 — single, multiple, extra spaces |
| quoted args | 8 — double/single quote, empty quote, mixed, unterminated (×2) |
| long flags | 10 — boolean, `=value`, space-value, greedy non-consumption, multiple, mixed |
| short flags | 4 — single char, multiple, multi-char key, no value consumption |
| mixed | 3 — full example, short+long, quoted+flag |
| edge cases | 5 — `--` positional, `-` positional, hyphenated flag names |

### `registry.test.ts` — 33 cases in 8 blocks

| Block | Cases |
|---|---|
| empty registry | 4 — all methods on empty input |
| resolve by name | 3 — exact match, case-insensitive, unknown |
| resolve by alias | 4 — alias, case-insensitive alias, multiple aliases, primary + alias |
| all() | 5 — count, deduplication per command, deduplication across commands, hidden included |
| byCategory() | 6 — filtering, count, dedup per category, empty, hidden |
| complete() | 8 — prefix, sorted, name+alias match, alias-only match, empty, hidden, case-insensitive |
| collision detection | 4 — dup name, name vs alias, alias vs alias, no collision |
| custom override | 2 — override built-in, add new |
| createRegistry smoke | 3 — shape, resolve on empty, all on empty |

---

## Decisions

1. **`buildRegistry` / `createRegistry` split** — The pure `buildRegistry` function is exported specifically for testing. Tests never need to mock `import.meta.glob`, which would require Vitest module mocking at the Vite transform level.

2. **`complete()` includes hidden commands** — The `hidden` flag is a *display* concern for `help`. Tab-completion is practical assistance; `man` (hidden) should be completable. Easter egg discovery via tab-complete is acceptable.

3. **`ParseError extends Error`** — The parser throws for unterminated quotes because it is a syntax error from which the parser cannot recover and produce a meaningful result. `useTerminal` (Phase 8) will catch `ParseError` and surface it as an `{ type: 'error' }` output.

4. **`raw` preserves the original input unchanged** — Including leading/trailing whitespace. This is important for `history` display (Phase 9), where the user should see exactly what they typed.

5. **Greedy `--key value` rule documented** — Rather than silently producing surprising behavior, the ambiguity is called out in source comments, the phase summary, and the test file. Commands follow the safe `[slug] [--flags]` ordering convention.

---

## Follow-ups for later phases

- **Phase 8** (`useTerminal`): call `createRegistry()` once at hook initialisation; catch `ParseError` from `parse()` and convert to `{ type: 'error', message }`.
- **Phase 8** (each command file): export a default `Command` — `createRegistry`'s glob + `isCommand` guard will pick it up automatically.
- **Phase 13** (`useAutocomplete`): call `registry.complete(partialAfterName)` for arg-level completions (each command's own `autocomplete` function), and `registry.complete(partial)` for command-name completion.
- **Phase 14** (extended tests): add integration tests that create a registry with real command objects (after Phase 8 commands are implemented) to verify the full dispatch path.
