# PHASE 15 DONE — Docs, README, Deploy

## Files created

| File | Purpose |
|---|---|
| `docs/CUSTOMIZATION.md` | Field-by-field walkthrough of every `user.config.ts` key |
| `docs/ADDING_COMMANDS.md` | Full guide: quick-add via config, full command file, contract, output types, testing |
| `docs/ADDING_THEMES.md` | Full guide: CSS variable contract, contrast requirements, light/dark/experimental |
| `docs/DEPLOYMENT.md` | Platform-by-platform guide: Vercel, Netlify, GitHub Pages, Cloudflare Pages |
| `vercel.json` | SPA catch-all rewrite + cache headers for Vercel |
| `netlify.toml` | Build config + SPA redirect + cache headers for Netlify |
| `.github/workflows/ci.yml` | CI: lint → typecheck → test → build on push/PR to main |
| `.github/workflows/pages.yml` | CD: build + deploy to GitHub Pages on push to main |

## Files modified

| File | Change |
|---|---|
| `README.md` | Updated to reflect all 18 commands, accurate deploy table, dev scripts, project layout |

---

## `vercel.json`

- Catch-all `"source": "/(.*)"` → `"/index.html"` rewrite handles SPA client-side routing.
- `/assets/*` — 1-year immutable cache (Vite's content-hashed bundles).
- `/*.html` and `/site.webmanifest` — `no-cache` so the entry point is always fresh.

## `netlify.toml`

- `command = "bun run build"`, `publish = "dist"`.
- SPA redirect: `status = 200` (serve `index.html` for any unmatched path).
- Same cache headers as Vercel.

## CI workflow (`.github/workflows/ci.yml`)

Runs on every push to `main` and on every PR targeting `main`. Steps (all must pass — no skip flags):

1. `bun install --frozen-lockfile` — fails fast if lockfile is stale.
2. `bun run lint` — ESLint with `--max-warnings 0`.
3. `bun run typecheck` — `tsc --noEmit`.
4. `bun run test` — Vitest single run.
5. `bun run build` — confirms the production bundle compiles cleanly.

Uses `oven-sh/setup-bun@v2` for native Bun support on the GitHub Actions runner.

## Pages workflow (`.github/workflows/pages.yml`)

Triggers on push to `main` and `workflow_dispatch` (manual trigger).

- `concurrency: cancel-in-progress: true` — a new push cancels any deployment already in progress.
- `permissions: pages: write, id-token: write` — required by `actions/deploy-pages`.
- Two jobs:
  - **build** — installs, builds, uploads `dist/` as a Pages artifact.
  - **deploy** — downloads the artifact and calls `actions/deploy-pages`. Sets environment `github-pages` so the deployment URL appears in the GitHub UI.

## Decisions

1. **Bun over Node in CI** — the project is Bun-native (`package.json` uses `bun run …`). Using `oven-sh/setup-bun` keeps the CI runtime consistent with local development.
2. **`--frozen-lockfile` in install** — prevents a silently outdated `bun.lockb` from shipping untested dependency changes.
3. **`workflow_dispatch` on pages.yml** — allows manually redeploying without a code push (useful after DNS changes or environment setup).
4. **Separate CI and Pages workflows** — CI runs on PRs too; the Pages deployment should only happen on merged main. Splitting them avoids deploying from un-reviewed branches.
5. **No coverage gate in CI** — per the testing rules, there is no coverage threshold to enforce. The test step passes or fails; coverage is available via `bun run test:coverage` locally.
6. **SPA redirect vs 404** — Netlify uses `status = 200` (transparent rewrite), not a 301 redirect, so direct navigation to any URL works without a flash of a 404 page.
