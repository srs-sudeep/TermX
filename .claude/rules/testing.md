# Rules: testing

Read this file before writing, removing, or refactoring tests under `tests/`.

---

## 1. Philosophy

Test what's hard to get right. Skip what's obvious.

| Test                                               | Skip                            |
| -------------------------------------------------- | ------------------------------- |
| Parser edge cases (quotes, flags, empty input)     | React rendering of a `<div>`    |
| Registry resolution (aliases, overrides, unknowns) | Presence of a class name        |
| Theme persistence through store + storage          | CSS variable values             |
| Command error paths (bad args, missing data)       | Happy paths of trivial commands |
| Storage quota + privacy fallback                   | Framer Motion animations        |

If a test's only failure mode is "someone rewrote the component" — delete it.

## 2. Stack

- **Vitest** as the runner (Vite-native, fast).
- **@testing-library/react** for component tests.
- **@testing-library/user-event** over `fireEvent` — it's closer to reality.
- **No snapshot tests.** Ever. They trigger on irrelevant changes and nobody actually reads the diffs.

## 3. Test file layout

```
tests/
├── parser.test.ts              # src/lib/commandParser.ts
├── registry.test.ts            # src/lib/commandRegistry.ts
├── storage.test.ts             # src/lib/storage.ts
├── themeManager.test.ts        # src/lib/themeManager.ts
├── stores/
│   ├── terminalStore.test.ts
│   └── themeStore.test.ts
└── commands/
    ├── help.test.ts
    ├── theme.test.ts
    ├── projects.test.ts
    ├── man.test.ts
    └── resume.test.ts
```

Mirror the source tree. One source file → at most one test file.

## 4. Naming

```ts
describe("commandParser", () => {
  describe("quoted args", () => {
    it("preserves spaces inside double quotes", () => {
      /* ... */
    });
    it("allows single quotes", () => {
      /* ... */
    });
    it("throws on unterminated quote", () => {
      /* ... */
    });
  });
});
```

`describe` is the unit or behavior. `it` reads as a sentence starting with a verb. No "should" prefix.

## 5. Command tests — the pattern

```ts
import { expect, it, describe } from "vitest";
import command from "@/commands/portfolio/projects";
import { mockContext } from "../helpers/mockContext";

describe("projects command", () => {
  it("lists all projects by default", () => {
    const ctx = mockContext({ args: [], flags: {} });
    const out = command.execute(ctx);
    expect(out).toMatchObject({ type: "cards" });
    expect((out as any).cards.length).toBe(ctx.config.projects.length);
  });

  it("filters by slug", () => {
    const ctx = mockContext({ args: ["quill"], flags: {} });
    const out = command.execute(ctx);
    expect(out).toMatchObject({ type: "cards" });
  });

  it("returns error on unknown slug", () => {
    const ctx = mockContext({ args: ["nope"], flags: {} });
    const out = command.execute(ctx);
    expect(out).toMatchObject({ type: "error" });
  });
});
```

`mockContext` lives in `tests/helpers/mockContext.ts` and returns a full `CommandContext` with sane defaults, overridable per call.

## 6. Store tests — the pattern

Reset the store between tests. Never share state across `it` blocks.

```ts
import { beforeEach, expect, it, describe } from "vitest";
import { useTerminalStore } from "@/store/terminalStore";

describe("terminalStore", () => {
  beforeEach(() => {
    useTerminalStore.setState({ history: [], commandHistory: [] });
  });

  it("caps commandHistory at 100", () => {
    const { addToCommandHistory } = useTerminalStore.getState();
    for (let i = 0; i < 120; i++) addToCommandHistory(`cmd-${i}`);
    expect(useTerminalStore.getState().commandHistory.length).toBe(100);
  });
});
```

## 7. Storage tests — mocking `localStorage`

Vitest's `happy-dom` env gives you a working `localStorage`. For quota/privacy tests, stub it:

```ts
it("returns fallback when localStorage.getItem throws", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("SecurityError");
  });
  expect(storage.get("key", "fallback")).toBe("fallback");
});
```

## 8. Component tests — rare, targeted

Component tests are the exception, not the rule. Write one when:

- The component encodes non-trivial interaction (e.g. `TerminalInput` handling ↑/↓/Tab).
- A bug was caused by interaction logic and you want a regression test.

Don't test:

- That a component renders without crashing (TS already covers most of this).
- That class names exist.
- That a child prop is forwarded.

Example worth writing:

```ts
it('recalls previous command on ArrowUp', async () => {
  useTerminalStore.setState({ commandHistory: ['about', 'projects'] });
  render(<TerminalInput />);
  const input = screen.getByRole('textbox');
  await userEvent.type(input, '{ArrowUp}');
  expect(input).toHaveValue('projects');
  await userEvent.type(input, '{ArrowUp}');
  expect(input).toHaveValue('about');
});
```

## 9. Don't test

- Visual styling — that's what the eye is for.
- Framer Motion animations.
- CSS variable application (themeManager mutates `document.documentElement`; asserting that is testing the DOM API, not our code).
- Built-in React behavior.
- Third-party libs.

## 10. Coverage

We don't track a coverage number. Concretely, we expect:

- `commandParser.ts` — every branch covered.
- `commandRegistry.ts` — resolve / alias / override / unknown covered.
- `storage.ts` — happy path + quota + privacy fallback.
- Every command with non-trivial logic (`theme`, `projects`, `man`, `resume`, `cd`) — happy + one error path.
- Trivial commands (`echo`, `whoami`, `pwd`) — no test needed. If one breaks, it's obvious on page load.

## 11. CI

`.github/workflows/ci.yml` runs:

1. `bun install`
2. `bun run lint`
3. `bun run typecheck`
4. `bun run test`

Any failure blocks the PR. No `--skip` flags. If a test is genuinely flaky, fix it or delete it — don't silence it.

## 12. What tests must not do

- Hit the network.
- Read real files from disk outside the project.
- Rely on `Date.now()` without `vi.useFakeTimers()`.
- Sleep for real time. Use `vi.advanceTimersByTime`.
- Share mutable state between files.
