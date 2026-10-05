// Maintenance mode: baked in at build time from the MAINTENANCE_MODE env var (webpack
// DefinePlugin), set to "true" for Netlify production deploys in netlify.toml (and on by
// default for builds of the "production" branch, see the webpack configs). While on,
// only the under-construction page is built and every other path redirects to it.
export const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

export const UNDER_CONSTRUCTION_PATH = "/under-construction";

// Where "/" redirects to: server.tsx, App.tsx (client navigation) and prerender's _redirects.
export const DEFAULT_PATH = MAINTENANCE_MODE ? UNDER_CONSTRUCTION_PATH : "/home";
