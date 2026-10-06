import UnderConstruction from "./pages/under-construction/UnderConstruction";
import Home from "./pages/home/Home";
import Products from "./pages/products/Products";
import NotFound from "./pages/not-found/NotFound";
import { HOME_PATH, MAINTENANCE_MODE, PRODUCTS_PATH, UNDER_CONSTRUCTION_PATH } from "./constants/routing";
import type { AppRoute } from "./types/routing";

const allRoutes: AppRoute[] = [
    { path: HOME_PATH, component: Home },
    { path: PRODUCTS_PATH, component: Products, title: "Semua Produk | Hörnet Supercoat" },
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
