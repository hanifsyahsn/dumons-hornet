// Where "/" redirects to. Baked in at build time from the DEFAULT_ROUTE env var (webpack
// DefinePlugin): netlify.toml sets it to "/under-construction" for production deploys.
// The redirect lives in server.tsx, App.tsx (client navigation) and prerender's _redirects.
export const DEFAULT_PATH = process.env.DEFAULT_ROUTE || "/home";
