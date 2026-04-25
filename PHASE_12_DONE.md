# PHASE 12 DONE — Boot Sequence, Banner, Settings Panel

## Files created

| File | Purpose |
|---|---|
| `src/components/terminal/BootSequence.tsx` | Scripted 1.5 s boot animation; shows init messages + ASCII banner |
| `src/components/settings/ThemePicker.tsx` | Grid of colour swatches; clicking switches theme |

## Files modified

| File | Change |
|---|---|
| `src/store/themeStore.ts` | Added `typewriter`, `bootEnabled` state + `setTypewriter`, `setBootEnabled` actions |
| `src/components/settings/SettingsPanel.tsx` | Full implementation replacing Phase 10 stub |
| `src/components/shell/TitleBar.tsx` | Added gear button (`<Settings>` from Lucide) + `onGearClick` prop |
| `src/components/shell/AppShell.tsx` | Manages boot state + settings modal open state |
| `src/components/terminal/Terminal.tsx` | Accepts `bootRan` prop; dispatches `banner` + `help` on first mount |
| `src/components/output/TextOutput.tsx` | Conditionally wraps content in `<Typewriter>` when `typewriter` is enabled |

---

## Boot sequence behaviour

| Condition | Result |
|---|---|
| `settings.bootSequence === false` | Skip immediately → `onDone(false)` |
| `storage.get('visited') === true` (repeat visit) | Skip immediately → `onDone(false)` |
| `prefers-reduced-motion: reduce` | Skip immediately → `onDone(false)` |
| `themeStore.bootEnabled === false` (runtime toggle) | Skip immediately → `onDone(false)` |
| None of the above (first visit) | Play animation → `onDone(true)` |

When `onDone(false)` fires (boot skipped), AppShell sets `bootRan = false` and mounts Terminal, which then dispatches `banner` + `help`.

When `onDone(true)` fires (boot ran), AppShell sets `bootRan = true` and mounts Terminal, which dispatches `help` only (banner was already shown in BootSequence).

### Boot message timing

| Message | Delay |
|---|---|
| Init message 1 | 0 ms |
| Init message 2 | 180 ms |
| … (6 total) | +180 ms each |
| Empty spacer | 1050 ms |
| `<AsciiBanner>` appears | 1100 ms |
| `onDone()` called; `visited` written | 1500 ms |

Total wall time: 1.5 s.

---

## SettingsPanel sections

| Section | Controls |
|---|---|
| **Theme** | `<ThemePicker>` swatch grid + active theme label |
| **Font** | Family text input (Enter or Apply button), Reset button, sm/md/lg size buttons |
| **Features** | Boot sequence ON/OFF, Typewriter ON/OFF |
| **Danger Zone** | Hint to type `reset --confirm` in the terminal |

### Two render modes

- **Inline** (no `onClose` prop): rendered from `settings` command output; no overlay.
- **Modal** (`onClose` provided): fixed overlay with `role="dialog"`, backdrop click closes it.

---

## ThemePicker

- `grid-cols-4` swatch grid; each button styled with the theme's own `bg`, `accent`, `prompt`, `error` colours via inline `style={}` (dynamic per swatch — justified exception to the no-inline-style rule).
- Active theme: `border-[var(--accent)]` + small ✓ badge.
- Non-active themes: `border-transparent hover:border-[var(--muted)]`.
- Accessibility: `role="radiogroup"` + `role="radio"` + `aria-checked`.

---

## ThemeStore additions

| Field | Type | Default | Storage key |
|---|---|---|---|
| `typewriter` | `boolean` | `settings.typewriter` | `termfolio:typewriter` |
| `bootEnabled` | `boolean` | `settings.bootSequence` | `termfolio:bootEnabled` |

---

## Typewriter integration in TextOutput

When `useThemeStore(s => s.typewriter)` is `true`, `TextOutput` wraps its content in `<Typewriter speed={18}>`. The `Typewriter` component respects `prefers-reduced-motion` — it shows the full text immediately when motion is reduced.

---

## Decisions

1. **`bootRan` prop on Terminal** — AppShell passes this boolean so Terminal knows whether to dispatch `banner`. Avoids re-reading localStorage (which BootSequence has already mutated).
2. **`BootSequence` checks `useThemeStore.getState().bootEnabled`** — reading from the store (not a subscription) is appropriate here since this check happens once on mount, before any React state matters.
3. **Modal vs inline SettingsPanel via `onClose` prop** — single component, two render paths. The modal's backdrop `onClick={onClose}` meets standard modal UX conventions.
4. **Gear button icon from Lucide** — the project allows Lucide icons in non-terminal UI (CLAUDE.md section 3). The title bar is non-terminal chrome.
5. **Typewriter speed = 18 ms/char** — fast enough to feel snappy for short command outputs; slow enough to be noticeable. Configurable per-callsite.
