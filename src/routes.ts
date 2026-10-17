import UnderConstruction from "./pages/under-construction/UnderConstruction";
import Home from "./pages/home/Home";
import Products from "./pages/products/Products";
import ProductDetail from "./pages/product-detail/ProductDetail";
import NotFound from "./pages/not-found/NotFound";
import { HOME_PATH, MAINTENANCE_MODE, PRODUCTS_PATH, UNDER_CONSTRUCTION_PATH, productPath } from "./constants/routing";
import { matchPath } from "react-router-dom";
import { catalog, productBySlug } from "./content";
import { DEFAULT_HEAD, homeHead, productHead, productsHead } from "./seo";
import type { AppRoute, PageHead } from "./types/routing";

const allRoutes: AppRoute[] = [
    { path: HOME_PATH, component: Home, head: homeHead() },
    { path: PRODUCTS_PATH, component: Products, head: productsHead() },
    {
        path: productPath(":slug"),
        component: ProductDetail,
        head: ({ slug }) => {
            const product = slug ? productBySlug(slug) : undefined;
            return product && productHead(product);
        },
        getStaticPaths: () => catalog.products.map(({ slug }) => productPath(slug)),
    },
    {
        path: UNDER_CONSTRUCTION_PATH,
        component: UnderConstruction,
        head: { title: "Hörnet Supercoat | Under Construction" },
    },
    { path: "*", component: NotFound },
];

// In maintenance mode only the under-construction page (and the "*" catch-all) exist.
export const routes = MAINTENANCE_MODE
    ? allRoutes.filter(r => r.path === UNDER_CONSTRUCTION_PATH || r.path === "*")
    : allRoutes;

// <head> content for a path, filled in from the site defaults: the server's HTML (render.tsx)
// and the <title> on client-side navigation (App.tsx). The 404 page sets NOT_FOUND_TITLE itself.
export function pageHead(pathname: string): PageHead {
    for (const route of routes) {
        if (route.path === "*") continue;
        const match = matchPath(route.path, pathname);
        if (!match) continue;
        const head = typeof route.head === "function" ? route.head(match.params) : route.head;
        return { ...DEFAULT_HEAD, ...Object.fromEntries(Object.entries(head ?? {}).filter(([, v]) => v !== undefined)) };
    }
    return DEFAULT_HEAD;
}
