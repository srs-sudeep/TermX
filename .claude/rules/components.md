# Rules: components

Read this file before creating, editing, or refactoring anything under `src/components/`.

---

## 1. Shape

- Function components only. No classes, no `React.FC`.
- Named exports preferred; default export only when it's the file's single component.
- Props typed with an `interface` named `<Component>Props` in the same file.
- No `any` in props. Use `unknown` + narrowing if the type is genuinely dynamic.

```tsx
interface PromptProps {
  user: string;
  host: string;
  path: string;
  template: string;
}

export function Prompt({ user, host, path, template }: PromptProps) {
  // ...
}
```

## 2. Dumb where possible

Components should be **presentational**. Logic lives in hooks (`src/hooks/`) and lib (`src/lib/`). A component that imports from `@/lib` is fine; one that implements parsing, state machines, or business rules inline is not.

## 3. Imports — allowed and forbidden

| From component | Allowed                                    | Forbidden                           |
| -------------- | ------------------------------------------ | ----------------------------------- |
| `@/types`      | ✓                                          |                                     |
| `@/hooks`      | ✓                                          |                                     |
| `@/store`      | ✓ (sparingly)                              |                                     |
| `@/lib`        | ✓                                          |                                     |
| `@/config`     | ✓ (only for `user.config.ts` display data) |                                     |
| `@/commands`   |                                            | ✗ Components never import commands. |
| `@/utils`      | ✓                                          |                                     |

Enforce via ESLint `no-restricted-imports`.

## 4. State

Prefer local state (`useState`) over store reads. Go to the Zustand store only when the state is genuinely shared (terminal history, theme, font).

When reading from a store, use selectors — not whole-store destructuring — to avoid re-renders:

```tsx
const history = useTerminalStore((s) => s.history); // good
const { history, submit } = useTerminalStore(); // bad
```

## 5. Styling

- TailwindCSS utilities, composed with the `cn()` helper (`src/lib/cn.ts`).
- Theme colors via CSS variables (`bg-[var(--bg)]`), see `.claude/rules/themes.md`.
- No inline `style={}` except when the value is dynamic (e.g. computed canvas dimensions).
- No CSS Modules, no styled-components, no emotion.
- Class names go on one line when < 80 chars; otherwise break by concern:

```tsx
<div
  className={cn(
    "flex flex-col gap-2",
    "bg-[var(--bg)] text-[var(--fg)]",
    "min-h-screen font-mono",
  )}
/>
```

## 6. Accessibility — required checklist

Every new component is checked against:

- [ ] All interactive elements are `<button>`, `<a>`, or `<input>` — never `<div onClick>`.
- [ ] Focusable elements have visible focus rings.
- [ ] Icons used as the only button content have `aria-label`.
- [ ] Form controls have associated `<label>` or `aria-label`.
- [ ] Color is not the only signal — error output also has the word "error:".
- [ ] Output regions use `role="log"` + `aria-live="polite"`.
- [ ] Tables have `<thead>` and column headers.
- [ ] Nothing depends on hover state for information (mobile has no hover).

## 7. Animation rules

- Use **CSS transitions** for simple state changes (hover, focus).
- Use **Framer Motion** for entry/exit, staggered lists, complex sequences.
- Gate every animation behind `prefers-reduced-motion`:

```tsx
import { useReducedMotion } from "framer-motion";

const reduce = useReducedMotion();
<motion.div
  initial={reduce ? false : { opacity: 0, y: 4 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: reduce ? 0 : 0.15 }}
/>;
```

- Cursor blink: disable when `prefers-reduced-motion: reduce`.
- Typewriter effect: same.
- Matrix rain: replace with static green text when reduced.
- Boot sequence: skip entirely when reduced.

## 8. Focus management

- `<Terminal>` owns focus behavior. Clicking anywhere inside the terminal root focuses the input.
- New output appended while input is focused must not steal focus.
- The settings modal traps focus while open (first element focused on open, Esc closes, focus returns to the terminal input).
- Don't auto-focus anything on page load until after the boot sequence finishes.

## 9. Event handlers

- Prefix with `on` in props, `handle` in the component: `<Button onClick={handleClick} />`.
- Don't use `onKeyPress` (deprecated). Use `onKeyDown`.
- Cancel default where needed (`e.preventDefault()` for Tab, Enter, Ctrl+L). The terminal _intentionally_ swallows keys the browser would otherwise act on.

## 10. Mobile

- Every component works at 320px wide.
- Tap targets ≥ 44×44px.
- Don't rely on hover. If hover adds info, also expose it via tap or always-visible.
- Tables in the terminal overflow horizontally; don't stack them into cards on mobile — that breaks the terminal feel. Horizontal scroll is correct here.

## 11. Performance

- Memoize expensive renders (`React.memo`) only with proof (> 50 renders/sec or > 5ms render). Don't memoize by reflex.
- List keys are stable ids, not array indices, when items can reorder.
- Heavy components (MatrixRain, SettingsPanel) are dynamically imported:

```tsx
const MatrixRain = lazy(() => import("./MatrixRain"));
```

## 12. What components must not do

- Call command handlers directly. Go through `useTerminal.submit()`.
- Read from `localStorage` directly. Use the store.
- Mutate `document.documentElement` for theming. Use `themeManager`.
- Subscribe to `window` events in render. Use a `useEffect` with cleanup.
- Use `dangerouslySetInnerHTML` with user-sourced content. (Config content is trusted, but still prefer escaping.)

## 13. File size guideline

If a component file exceeds ~200 lines, split it. Extract subcomponents into sibling files in the same folder.
