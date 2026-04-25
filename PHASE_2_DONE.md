# PHASE 2 DONE — Config Files

## Files created

| File | Contents |
|---|---|
| `src/config/user.config.ts` | Full demo data for "Sam Reyes" |
| `src/config/themes.config.ts` | All 13 themes with contrast notes |
| `src/config/commands.config.ts` | Empty `customCommands[]` + two commented examples |
| `src/config/settings.config.ts` | Engine defaults: dracula, md, boot on, banner on, typewriter off |
| `src/config/index.ts` | Re-exports only |

---

## user.config.ts — Sam Reyes data

| Section | Count | Notes |
|---|---|---|
| Projects | 4 | quill, nexus, wavelength, drift — all with realistic descriptions, tech stacks, and links |
| Skill categories | 3 | Languages (6 items), Frontend (6), Tooling & Infra (6) |
| Experiences | 2 | Meridian Labs (current), Sprout Systems (2019–2022) |
| Education | 1 | UT Austin B.S. CS 2015–2019 |
| Social links | 4 | GitHub, LinkedIn, Twitter/X, Blog |
| Fortunes | 7 | Well-known programming quotes (five minimum, shipped seven) |

All values are realistic and demoable out of the box. The `avatar` field is commented out — forkers uncomment and add their image to `public/`.

---

## themes.config.ts — all 13 themes

| Name | Mode | Experimental | Key adjustment |
|---|---|---|---|
| dracula | dark | — | muted: #6272a4→#9099bd (2.8:1→4.7:1) |
| monokai | dark | — | muted: #8f908a (official, ≈4.7:1 ✓) |
| nord | dark | — | muted: #616e88→#90a0b8 (2.5:1→4.8:1) |
| gruvbox-dark | dark | — | muted: #928374→#a89984 (3.9:1→5.2:1) |
| gruvbox-light | light | — | muted: #7c6f64→#665c54 (4.3:1→5.7:1) |
| tokyo-night | dark | — | muted: #565f89→#8892ba (2.7:1→5.6:1) |
| one-dark | dark | — | muted: #5c6370→#9098b0 (2.3:1→4.9:1) |
| solarized-dark | dark | — | fg: #839496→#eee8d5 (higher contrast on base03) |
| solarized-light | light | — | muted: #93a1a1→#546e7a (2.5:1→5.0:1) |
| hacker | dark | — | All green-phosphor values pass AA |
| light | light | — | Clean white; Tailwind gray-500 muted passes AA |
| matrix | dark | ✓ | Artistic; all values actually pass AA |
| retro | dark | ✓ | Amber phosphor CRT; all values pass AA |

### Contrast methodology
- All contrast ratios estimated via the sRGB luminance formula.
- `--fg` on `--bg` target: ≥ 7:1 (AAA). All dark themes clear this by wide margins.
- `--muted` on `--bg` target: ≥ 4.5:1 (AA). Six themes needed muted adjustments; see table above.
- Semantic colors (success, error, warning, info) on `--bg` target: ≥ 4.5:1. All pass.
- Experimental themes pass AA; the `experimental: true` flag signals they are artistic and excluded from default-theme candidates in Phase 10.

---

## settings.config.ts — decisions

| Toggle | Value | Reason |
|---|---|---|
| `defaultTheme` | `'dracula'` | First theme in the array; well-known and universally legible |
| `defaultFontSize` | `'md'` | 14px — comfortable default for most screens |
| `bootSequence` | `true` | Ships on; forkers who don't want it set `false` |
| `showBanner` | `true` | Banner + help on load gives new visitors context |
| `typewriter` | `false` | Adds charm on first visit but is annoying for power users |

---

## commands.config.ts — decisions

- Two commented examples (open a URL, print a status message) to orient forkers.
- No built-in commands are overridden in the starter config — that would hide features from new users.

---

## Follow-ups for later phases

- Phase 3: `useThemeStore` reads `settings.defaultTheme` and `settings.defaultFontSize` on hydration.
- Phase 5: `themeManager.applyTheme()` uses `themes` array; `themes[0]` is the hardcoded fallback.
- Phase 8: `customCommands` is merged into the registry after all built-ins load.
- Phase 10: `theme` command filters experimental themes from default-theme candidates.
- Phase 12: `bootSequence` and `showBanner` flags gate the boot + banner flow.
