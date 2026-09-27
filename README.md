# dumons-hornet

Website for the **Dumons Coating – Hornet lineup**, to be served at
`https://hornet.dumonscoating.com/home` (sister site of `https://dumonscoating.com/home`).

Built on the React SSR boilerplate (Express + React 19 SSR, React Router 6, webpack, Tailwind v4 + PostCSS).
There is no backend: Express only serves static files and server-renders the pages.

Right now the site only shows an **under-construction** page at `/home` (`/` redirects to `/home`).

## Commands

```bash
npm install
npm run dev        # rebuild + restart on every change in src/ (no HMR, reload the page)
npm run build      # client + server bundles into dist/
npm start          # production server (run build first)
npm run build:static  # static site for Netlify -> dist/static
npm run typecheck
```

## Deploy (Netlify)

Netlify builds from the GitHub repo using `netlify.toml`: it runs `npm run build:static`, which prerenders every
route in `src/routes.ts` to plain HTML (plus `404.html`) and publishes `dist/static`. No server runs in production.

Domain: `dumonscoating.com` uses Netlify DNS, so add `hornet.dumonscoating.com` under the site's
**Domain management** in Netlify; the DNS record and HTTPS certificate are created automatically.

Copy `.env.example` to `.env`. `PORT` defaults to 3000.

## Where things are

- `src/pages/home/` – under-construction landing page
- `src/constants/brand.ts` – logo path + main-site link
- `src/styles/variables.css` – Hornet color tokens (temporary, to be re-derived from the logo)
- `public/` – static files served from `/` (put the Hornet logo in `public/assets/`)
- `src/routes.ts` – add pages here (`{ path, component, title? }`); routes with params need `getStaticPaths`
