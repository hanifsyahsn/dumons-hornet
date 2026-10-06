import UnderConstruction from "./pages/under-construction/UnderConstruction";
import Home from "./pages/home/Home";
import Products from "./pages/products/Products";
import ProductDetail from "./pages/product-detail/ProductDetail";
import NotFound from "./pages/not-found/NotFound";
import { DEFAULT_TITLE, HOME_PATH, MAINTENANCE_MODE, PRODUCTS_PATH, UNDER_CONSTRUCTION_PATH, productPath } from "./constants/routing";
import { matchPath } from "react-router-dom";
import { catalog, productBySlug } from "./content";
import type { AppRoute } from "./types/routing";

const allRoutes: AppRoute[] = [
    { path: HOME_PATH, component: Home },
    { path: PRODUCTS_PATH, component: Products, title: "Semua Produk | Hörnet Supercoat" },
    {
        path: productPath(":slug"),
        component: ProductDetail,
        title: ({ slug }) => {
            const product = slug ? productBySlug(slug) : undefined;
            return product && `${product.name} ${product.code} | Hörnet Supercoat`;
        },
        getStaticPaths: () => catalog.products.map(({ slug }) => productPath(slug)),
    },
    {
        path: UNDER_CONSTRUCTION_PATH,
        component: UnderConstruction,
        title: "Hörnet Supercoat | Under Construction",
    },
    { path: "*", component: NotFound },
];

// In maintenance mode only the under-construction page (and the "*" catch-all) exist.
export const routes = MAINTENANCE_MODE
    ? allRoutes.filter(r => r.path === UNDER_CONSTRUCTION_PATH || r.path === "*")
    : allRoutes;

// <title> for a path: the server's HTML (render.tsx) and client-side navigation (App.tsx).
// The 404 page sets NOT_FOUND_TITLE itself.
export function pageTitle(pathname: string): string {
    for (const route of routes) {
        if (route.path === "*") continue;
        const match = matchPath(route.path, pathname);
        if (!match) continue;
        const title = typeof route.title === "function" ? route.title(match.params) : route.title;
        return title || DEFAULT_TITLE;
    }
    return DEFAULT_TITLE;
}
