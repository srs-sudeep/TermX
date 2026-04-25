# PHASE 1 DONE — Type System

## Files created

| File | Exported types |
|---|---|
| `src/types/command.ts` | `Command`, `CommandContext`, `CommandOutput`, `ListItem`, `Card`, `ParsedCommand` |
| `src/types/config.ts` | `UserConfig`, `Project`, `Skill`, `SkillCategory`, `Experience`, `Education`, `SocialLink`, `Settings` |
| `src/types/theme.ts` | `Theme`, `ThemeColors`, `ThemeFont` |
| `src/types/output.ts` | `HistoryEntry` |
| `src/types/index.ts` | Barrel re-export of all 18 types |

## Shape decisions

### `command.ts`

- **`ParsedCommand`** is a standalone interface (not a type alias), matching what `commandParser` will return in Phase 4. It mirrors `CommandContext`'s `{ args, flags, raw }` fields plus the parsed `name`.
- **`CommandOutput`** is a discriminated union on `type` — the renderer in Phase 7 can do an exhaustive switch. Added JSDoc for the `tone` variants since the mapping to CSS variables isn't obvious.
- **`ListItem`** includes `indent?: number` to allow nested sub-lists (used by `help` for category groupings and `skills` for sub-items).
- **`Card`** includes `bullets?: string[]` for experience cards that need achievement lists inside the card body.
- **`Command.hidden`**: documented that it's for easter eggs *and* `man` itself (since `man` calling `man man` is odd).

### `config.ts`

- **`Skill`** is extracted as its own interface (instead of being inline in `SkillCategory.items`) as requested by the phase prompt. `SkillCategory.items` now uses `Skill[]`.
- **`Experience.end`** typed as `string | 'present'` — using a string union rather than `string | null` or a boolean makes the intent legible and catches typos like `'Present'` at the type level.
- **`Settings`** includes all five engine toggles: `defaultTheme`, `defaultFontSize`, `bootSequence`, `showBanner`, `typewriter`. These map directly to `src/config/settings.config.ts` (Phase 2).
- **`UserConfig.meta`** mirrors what Phase 15 will need for OG/SEO. `ogImage` is optional because the placeholder isn't a real file until Phase 15.

### `theme.ts`

- **`Theme.experimental?: boolean`** added per `themes.md` section 4 — marks artistic themes (`matrix`, `retro`) that can't hit WCAG AAA.
- **`ThemeColors`** has 12 required fields — exactly the CSS variables defined in `src/styles/themes.css`. No optional colors; partial themes cause rendering bugs.
- **`ThemeFont.size`** kept as `string` rather than `'sm' | 'md' | 'lg'` because the font size in a theme definition is the raw CSS value (e.g. `'14px'`) — the `sm/md/lg` user preference is a separate layer applied *over* the theme default by `themeManager.applyFontSize`.

### `output.ts`

- **`HistoryEntry.id`** format documented as `entry-{timestamp}-{counter}` — a monotonic counter suffix prevents collisions when multiple commands are dispatched in the same millisecond (e.g. boot sequence synthetic commands).
- **`HistoryEntry.output`** is `CommandOutput | null` (not `CommandOutput | undefined`) — explicit null signals "user pressed Enter on blank line"; `undefined` would be ambiguous.

## Follow-ups for later phases

- Phase 2 uses `UserConfig`, `Project`, `Skill`, etc. directly via `satisfies` — no changes needed.
- Phase 3: `HistoryEntry` is the element type of `useTerminalStore.history`.
- Phase 4: `ParsedCommand` is the return type of `commandParser`.
- Phase 7: `CommandOutput` union drives the exhaustive switch in `<OutputRenderer>`.
- Phase 8: `CommandContext` is constructed in `useTerminal.submit()`.
