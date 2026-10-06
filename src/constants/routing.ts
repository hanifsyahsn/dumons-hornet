// Maintenance mode: baked in at build time from the MAINTENANCE_MODE env var (webpack
// DefinePlugin; set in the Netlify UI, never in git). When unset, builds of the
// "production" branch default to on (see the webpack configs). While on,
// only the under-construction page is built and every other path redirects to it.
export const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

export const UNDER_CONSTRUCTION_PATH = "/under-construction";
export const HOME_PATH = "/home";
export const PRODUCTS_PATH = "/produk";
// Product detail pages: /produk/<slug from products.json>
export const productPath = (slug: string) => `${PRODUCTS_PATH}/${slug}`;

// <title> fallbacks (per-page titles are on the routes in routes.ts)
export const DEFAULT_TITLE = "Hörnet Supercoat | Dumons Coating";
export const NOT_FOUND_TITLE = "404 Halaman Tidak Ditemukan | Hörnet Supercoat";

// Where "/" redirects to: server.tsx, App.tsx (client navigation) and prerender's _redirects.
export const DEFAULT_PATH = MAINTENANCE_MODE ? UNDER_CONSTRUCTION_PATH : HOME_PATH;
