# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for the **Dumons Coating – Hornet lineup** (a sub-product of Dumons Coating), served at `https://hornet.dumonscoating.com/home`. The main Dumons Coating site is a separate Vue project at `C:\Users\hanif\Documents\dumons-netlify` (`https://dumonscoating.com/home`); Hornet uses Roboto Condensed Black Italic for display text (headings, buttons, tags, stickers; closest match to the logo wordmark) and Helvetica (`"Helvetica Neue", Helvetica, Arial, sans-serif`) for body text. The display font is self-hosted (`public/assets/fonts/roboto-condensed-italic-latin.woff2`: variable weight, italic only, latin subset), declared with `@font-face` + preload in `render.tsx`'s `<head>` (not in CSS, so css-loader doesn't try to bundle the url), so every `--font-display` use must also set `font-style: italic`. Currently the site is a single Indonesian-language landing page (`/home`, `lang="id"`): logo-only header (no navigation yet), hero for the HS 470 product (hatched placeholder with the hornet mark until the product photo exists, "Lihat produk" button scrolls to `#produk`), features, promotions (`PROMOTIONS` in `Home.tsx`: one poster image per promo, each linking to WhatsApp with its `alt` prefilled; placeholders in `public/assets/promos/` until the real posters exist; any count and any orientation via justified rows sized from each image's `width`/`height` (layout ratio clamped to 9:16..2.2:1, extremes shown whole on a hatched background), never cropped; section hidden when empty; opened by a scrolling ticker and the mascot), highlighted products (`PRODUCTS` in `Home.tsx`: exactly two, side by side from `--medium`, stacked on phones; each a square image canvas (hatched hornet-mark placeholder until `image` is set), code sticker, 1..5 power meters, and a "Lihat detail" button that links to `detailHref` or has no action while unset; the second product is a placeholder), customer reviews (`REVIEWS` in `Home.tsx`: quote, name, company, city, year, optional `photo` (initials until set); any count, placeholders for now; section hidden when empty; carousel in `src/components/reviews`: one per slide on a scroll-snap track (native swipe), arrows + dots, autoplay every 7s that any manual switch stops for 3 minutes, off under `prefers-reduced-motion`), WhatsApp CTA, footer. `/under-construction` is a standalone holding page (no Shell, English copy) and the only page on Netlify production deploys while `MAINTENANCE_MODE` is on (see Routing).

**There is no backend.** Production is a static site on Netlify (prerendered at build time); Express is only used for local dev/`npm start`. Don't add an `/api` proxy, API client, or data-fetching/store layer unless asked.

## Commands

```bash
npm run dev        # nodemon: full rebuild (client + server) and restart on any src/ change; no HMR, reload the browser
npm run build      # webpack client -> dist/client, server -> dist/server
npm start          # production server from dist/server/server.js (build first)
npm run build:static  # production build + prerender every route into dist/static (what Netlify runs)
npm run typecheck  # tsc --noEmit; the only static check (no linter, no tests)
```

`.env` (copy from `.env.example`) holds `PORT` (default 3000) and optionally `MAINTENANCE_MODE` (build time, see Routing).

Commits are titled `[development][x.y.z] summary` (semver: minor for a feature, patch for a fix). Bump `package.json` to the same version in that commit with `npm version x.y.z --no-git-tag-version` (it updates `package-lock.json` too).

## Architecture

React 19 SSR with two webpack builds sharing the same `src/`:

- **Server** (`webpack.server.js`, entry `src/server/server.tsx`, `target: node`, CSS imports ignored via `ignore-loader`): Express serves `dist/client` and `public/` statically, redirects `/` → `/home`, and renders every other path via `renderPage`. The full HTML document (head, favicon, loader markup) is a template string in `render.tsx`, not a React component; per-page `<title>` comes from the route's `title`.
- **Client** (`webpack.client.js`, entry `src/client/index.tsx`): `hydrateRoot` inside `BrowserRouter`; all CSS is extracted by `MiniCssExtractPlugin` into a single `/styles.css`, loaded alongside `/bundle.js`.

Rendering is shared: `src/server/render.tsx` (`renderPage(url)`) renders the app and wraps it in the HTML document. It is used by both `server.tsx` (per request) and `src/server/prerender.tsx` (build time; second entry in `webpack.server.js`). Prerender copies `dist/client` + `public/` into `dist/static`, writes each route as `<path>.html` (so Netlify serves `/home` from `home.html`), renders `404.html` via the `*` route, writes `sitemap.xml`/`robots.txt`, and writes `_redirects` (`/` → default route, maintenance catch-all, plus any `context.url` redirects). Routes with params are skipped unless they define `getStaticPaths`. Keep anything request-dependent out of pages, since production HTML is generated once per deploy. The `/` redirect target is `DEFAULT_PATH` (`src/constants/routing.ts`), used by `server.tsx`, `App.tsx`, `NotFound` and prerender's `_redirects`.

Routing: `src/routes.ts` is the list of `{ path, component }` rendered by `src/pages/App.tsx` (which also redirects `/` for client-side navigation). Keep the `*` catch-all last.

Maintenance mode (`src/constants/routing.ts`): `MAINTENANCE_MODE=true` at build time (baked into both bundles by webpack `DefinePlugin`, so changing it needs a rebuild) filters `routes` down to `/under-construction` + `*`, makes it `DEFAULT_PATH` (otherwise `/home`), and redirects every other path there: `server.tsx` per request, and on Netlify via `_redirects` (an explicit 200 rewrite for the page, then `/* → /under-construction 302`, which existing files shadow). The flag is not kept in git (no `netlify.toml` entry): when `MAINTENANCE_MODE` is unset, builds with `BRANCH=production` (set by Netlify) default to on; set `MAINTENANCE_MODE=false` in the Netlify UI environment variables to launch.

HTTP status/redirects from SSR: pages receive an optional `context: RouteContext` prop (only on the server). Setting `context.status = 404` (as `NotFound` does) or `context.url` (301 redirect) is read by `server.tsx` after rendering. The `<title>` is chosen in `server.tsx` based on that status.

Loading overlay: `render.tsx` emits a static `#server-loader` overlay that `client/index.tsx` removes after hydration; `src/components/loading` provides a matching React overlay via `useLoading()`.

## Styling

PostCSS pipeline (`postcss.config.js`): `postcss-import` → Tailwind v4 → `postcss-custom-media` → autoprefixer. `src/styles/global.css` imports Tailwind and `variables.css`.

- Visual style is neo-brutalism: thick ink borders, hard shadows with no blur, action elements skewed `-12deg` like the logo frame, no border radius.
- Design tokens live in `src/styles/variables.css` (`--hornet-*` colors, `--border*`, `--shadow-*`, `--skew`, `--container`/`--gutter` (both grow on large monitors), `--font-display`/`--font-body`, `--fs-*` sizes). The hero title is sized in `cqi` from its own column (`container-type: inline-size`), so it never runs into the photo.
- `src/components/shell` is the page frame (logo-only header, thin hazard strip, dark footer) and defines the shared `.hazard` strip and skewed `.button` (`--sm`/`--lg`/`--xl`, `--yellow`/`--dark`/`--white`; works on `<a>` and `<button>`). Home and NotFound share the `.hero` styles in `src/pages/home/styles.css`. The Hornet palette (yellow `#ffff00`, ink `#271b1d`, white, orange accent) is sampled from `public/assets/logo-bordered.webp`; keep new colors on these tokens.
- Responsive breakpoints are `@custom-media` queries (`--small`, `--medium`, ...) used as `@media (--medium)`, nested inside BEM-style class blocks (e.g. `.construction__title`).
- Tailwind utilities are used mainly for the loader markup.

`src/components/mascot` is the hornet mascot: the logo hornet itself, traced from `logo.webp` into `paths.ts` by `scripts/trace-mascot.py` (Python + potrace; rerun it when the logo changes, never hand-edit the paths), with the wings as a separate part so they can flap. Die-cut white outline + hard ink shadow via stacked `drop-shadow`s, animated in CSS (bob, wing flap, speed lines); all motion, including the ticker, stops under `prefers-reduced-motion`.

Brand constants (logo path, main-site URL, WhatsApp link, contact email) are in `src/constants/brand.ts`; logos live in `public/assets/` (`logo-bordered.webp` in header/footer with a hard black `drop-shadow` backing (the header logo is deliberately a plain `<img>`: no link, hover or pointer, since there is nowhere to go yet), `logo.webp` (square hornet mark) as favicon and the hero photo placeholder, `logo-borderless.webp` unused).
