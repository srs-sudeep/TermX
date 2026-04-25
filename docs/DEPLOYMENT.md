# Deployment guide

termfolio is a static SPA (single-page application). The build outputs a `dist/` folder containing HTML, CSS, and JS — no server required.

```bash
bun run build   # → dist/
```

---

## Vercel (recommended)

The simplest deployment path. `vercel.json` is included in the repo.

### Via the Vercel CLI

```bash
npm install -g vercel   # or: bun add -g vercel
vercel --prod
```

Vercel auto-detects Vite. The `vercel.json` included in this repo adds a catch-all rewrite so direct navigation to any URL works (SPA routing).

### Via the Vercel dashboard

1. Push your fork to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Vercel detects Vite automatically. No settings to change.
4. Click **Deploy**.

---

## Netlify

`netlify.toml` is included in the repo.

### Via drag-and-drop

```bash
bun run build
# Drag the dist/ folder into app.netlify.com/drop
```

### Via the Netlify dashboard

1. Push your fork to GitHub.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Connect your repository. Build settings are read from `netlify.toml` automatically.
4. Click **Deploy site**.

---

## GitHub Pages

A workflow file is included at `.github/workflows/pages.yml`. It runs on every push to `main`:

1. Installs dependencies with Bun.
2. Builds the site.
3. Publishes `dist/` to the `gh-pages` branch.

### First-time setup

1. Push your fork to GitHub.
2. In your repository settings → **Pages**:
   - Source: **Deploy from a branch**
   - Branch: `gh-pages` / `/ (root)`
3. Push a commit to `main`. The workflow runs and publishes the site.

Your site will be available at `https://YOUR_HANDLE.github.io/termfolio/`.

If you deploy to a subdirectory (not a root domain), set `base` in `vite.config.ts`:

```ts
export default defineConfig({
  base: '/termfolio/',   // your repo name
  // ...
});
```

---

## Cloudflare Pages

1. Push your fork to GitHub.
2. In the Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your repository. Use these build settings:

| Setting | Value |
|---|---|
| Build command | `bun run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION` = `20` (optional) |

4. Click **Save and Deploy**.

---

## Custom domain

All four platforms above support custom domains. The general steps:

1. Add your domain in the platform's dashboard.
2. Add a `CNAME` DNS record pointing to the platform's hostname.
3. Wait for DNS propagation (usually a few minutes to an hour).
4. Update `siteUrl` in `src/config/user.config.ts` to your custom domain.

---

## Environment variables

termfolio has no required environment variables. Everything is hardcoded from `src/config/` at build time.

If you add a feature that needs a runtime secret (e.g. a contact form API key), add a `.env` file locally and reference it as `import.meta.env.VITE_YOUR_KEY`. Prefix variables with `VITE_` for Vite to expose them to the browser bundle. Never commit `.env` files.

---

## Caching and headers

`vercel.json` and `netlify.toml` set these cache-control headers:

| Path pattern | Cache-Control |
|---|---|
| `/assets/*` (hashed JS/CSS) | `public, max-age=31536000, immutable` |
| `/*.html`, `*.ico`, `*.webmanifest` | `no-cache` |

This gives Vite's content-hashed assets a 1-year cache while ensuring the HTML entry point is always fresh.

---

## Checking the build locally

```bash
bun run build
bun run preview   # serves dist/ at http://localhost:4173
```

Always verify the preview build before deploying — it catches occasional differences between dev and prod (e.g. missing `base` config, missing public assets).
