# PHASE 7 DONE — Output Renderers

## Files created

| File | Purpose |
|---|---|
| `src/components/output/TextOutput.tsx` | Prose text with semantic tone colors |
| `src/components/output/ListOutput.tsx` | Bulleted list with indent levels and optional links |
| `src/components/output/TableOutput.tsx` | Monospace-aligned table, computed column widths |
| `src/components/output/CardsOutput.tsx` | Rich cards: title/subtitle/body/bullets/tags/links |
| `src/components/output/ErrorOutput.tsx` | Error with `role="alert"` and "error:" prefix |
| `src/components/output/JsxOutput.tsx` | Raw ReactNode wrapper with `role="region"` |
| `src/components/output/OutputRenderer.tsx` | Type-switch dispatcher |

`src/components/terminal/TerminalHistory.tsx` — updated to use `<OutputRenderer>`.

---

## Renderer contract

`<OutputRenderer output={entry.output} />` is the single entry point. It dispatches based on `output.type`:

```
text          → TextOutput
list          → ListOutput
table         → TableOutput
cards         → CardsOutput
error         → ErrorOutput
jsx           → JsxOutput
settings-panel → SettingsPanel (Phase 10 integration)
clear / redirect / download → null (handled by useTerminal before render)
```

---

## Component details

### `TextOutput`
- `whitespace-pre-wrap` preserves intentional newlines in command output.
- Tone map: `normal → --fg`, `success → --success`, `error → --error`, `warning → --warning`, `muted → --muted`.

### `ListOutput` — indent semantics
- `indent: 0` + no `value` → bold accent-colored header (used by `help` for category names).
- `indent: 1+` → bullet `•` + label + muted value.
- Items with `url` render label as an `<a>` link.

### `TableOutput` — column width algorithm
Column widths are computed as `max(header.length, max(row[col].length))` per column. Cells are padded with spaces to align all rows. Overflow scrolls horizontally on mobile — preserving the terminal aesthetic rather than reflowing to stacked cards.

### `CardsOutput`
Left-border accent line (`border-l-2 border-[var(--border)]`) visually separates cards. Tags use a small border badge style. Links rendered as `↗ label` anchor tags.

### `ErrorOutput`
`role="alert"` announces the error to screen readers immediately. Prefix word "error:" ensures color is not the only signal (accessibility rule).

### `settings-panel`
`OutputRenderer` imports `SettingsPanel` directly. This is the **only** place a component is imported to service a command output. Commands return `{ type: 'settings-panel' }` and stay free of component imports. This pattern was chosen over `jsx` output to maintain the command import rule.

---

## Accessibility checklist

- `TableOutput`: `<thead>`, `<th scope="col">` (implicit), `aria-label` on table.
- `ErrorOutput`: `role="alert"` for immediate announcement.
- `JsxOutput`: `role="region"` + `aria-label` wrapper.
- `TerminalHistory`: `role="log"` + `aria-live="polite"` (unchanged from Phase 6).
- Card links: `target="_blank"` + `rel="noopener noreferrer"`.

---

## Follow-ups for later phases

- **Phase 11** (Framer Motion): Wrap `OutputRenderer` output in `<motion.div>` with entry animation. Gate behind `useReducedMotion`.
- **Phase 12** (SettingsPanel): Replace the stub `SettingsPanel` with the real implementation — `OutputRenderer` needs no changes.
- **Phase 11** (`jsx` output): `<MatrixRain>`, `<AsciiBanner>`, etc. use `{ type: 'jsx', element: <…> }` — `JsxOutput` renders them without modification.
