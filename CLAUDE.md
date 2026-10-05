# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for the **Dumons Coating – Hornet lineup** (a sub-product of Dumons Coating), served at `https://hornet.dumonscoating.com/home`. The main Dumons Coating site is a separate Vue project at `C:\Users\hanif\Documents\dumons-netlify` (`https://dumonscoating.com/home`); Hornet uses Helvetica (`"Helvetica Neue", Helvetica, Arial, sans-serif`, no web font loaded) for all text, unlike the main site (Bebas Neue + Roboto Condensed). Currently the site is a single Indonesian-language landing page (`/home`, `lang="id"`): logo-only header (no navigation yet), hero for the HS 470 product (photo placeholder, "Lihat produk" button with no action yet), features, WhatsApp CTA, footer.

**There is no backend.** Production is a static site on Netlify (prerendered at build time); Express is only used for local dev/`npm start`. Don't add an `/api` proxy, API client, or data-fetching/store layer unless asked.

## Commands

```bash
npm run dev        # nodemon: full rebuild (client + server) and restart on any src/ change; no HMR, reload the browser
npm run build      # webpack client -> dist/client, server -> dist/server
npm start          # production server from dist/server/server.js (build first)
npm run build:static  # production build + prerender every route into dist/static (what Netlify runs)
npm run typecheck  # tsc --noEmit; the only static check (no linter, no tests)
```

`.env` (copy from `.env.example`) only holds `PORT` (default 3000).

## Architecture

React 19 SSR with two webpack builds sharing the same `src/`:

- **Server** (`webpack.server.js`, entry `src/server/server.tsx`, `target: node`, CSS imports ignored via `ignore-loader`): Express serves `dist/client` and `public/` statically, redirects `/` → `/home`, and renders every other path via `renderPage`. The full HTML document (head, favicon, loader markup) is a template string in `render.tsx`, not a React component; per-page `<title>` comes from the route's `title`.
- **Client** (`webpack.client.js`, entry `src/client/index.tsx`): `hydrateRoot` inside `BrowserRouter`; all CSS is extracted by `MiniCssExtractPlugin` into a single `/styles.css`, loaded alongside `/bundle.js`.

Rendering is shared: `src/server/render.tsx` (`renderPage(url)`) renders the app and wraps it in the HTML document. It is used by both `server.tsx` (per request) and `src/server/prerender.tsx` (build time; second entry in `webpack.server.js`). Prerender copies `dist/client` + `public/` into `dist/static`, writes each route as `<path>.html` (so Netlify serves `/home` from `home.html`), renders `404.html` via the `*` route, and turns `context.url` redirects into `_redirects`. Routes with params are skipped unless they define `getStaticPaths`. Keep anything request-dependent out of pages, since production HTML is generated once per deploy. The `/` → `/home` redirect exists twice: in `server.tsx` and `netlify.toml`.

Routing: `src/routes.ts` is the list of `{ path, component }` rendered by `src/pages/App.tsx` (which also redirects `/` → `/home` for client-side navigation). Keep the `*` catch-all last.

HTTP status/redirects from SSR: pages receive an optional `context: RouteContext` prop (only on the server). Setting `context.status = 404` (as `NotFound` does) or `context.url` (301 redirect) is read by `server.tsx` after rendering. The `<title>` is chosen in `server.tsx` based on that status.

Loading overlay: `render.tsx` emits a static `#server-loader` overlay that `client/index.tsx` removes after hydration; `src/components/loading` provides a matching React overlay via `useLoading()`.

## Styling

PostCSS pipeline (`postcss.config.js`): `postcss-import` → Tailwind v4 → `postcss-custom-media` → autoprefixer. `src/styles/global.css` imports Tailwind and `variables.css`.

- Visual style is neo-brutalism: thick ink borders, hard shadows with no blur, action elements skewed `-12deg` like the logo frame, no border radius.
- Design tokens live in `src/styles/variables.css` (`--hornet-*` colors, `--border*`, `--shadow-*`, `--skew`, `--container`/`--gutter` (both grow on large monitors), `--font-display`/`--font-body`, `--fs-*` sizes). The hero title is sized in `cqi` from its own column (`container-type: inline-size`), so it never runs into the photo.
- `src/components/shell` is the page frame (logo-only header, thin hazard strip, dark footer) and defines the shared `.hazard` strip and skewed `.button` (`--sm`/`--lg`/`--xl`, `--yellow`/`--dark`/`--white`; works on `<a>` and `<button>`). Home and NotFound share the `.hero` styles in `src/pages/home/styles.css`. The Hornet palette (yellow `#ffff00`, ink `#271b1d`, white, orange accent) is sampled from `public/assets/logo-bordered.webp`; keep new colors on these tokens.
- Responsive breakpoints are `@custom-media` queries (`--small`, `--medium`, ...) used as `@media (--medium)`, nested inside BEM-style class blocks (e.g. `.construction__title`).
- Tailwind utilities are used mainly for the loader markup.

Brand constants (logo path, main-site URL, WhatsApp link) are in `src/constants/brand.ts`; logos live in `public/assets/` (`logo-bordered.webp` in header/footer with a hard black `drop-shadow` backing, `logo.webp` (square hornet mark) as favicon, `logo-borderless.webp` unused).
