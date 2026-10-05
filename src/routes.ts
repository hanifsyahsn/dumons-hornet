import UnderConstruction from "./pages/under-construction/UnderConstruction";
import Home from "./pages/home/Home";
import NotFound from "./pages/not-found/NotFound";
import { MAINTENANCE_MODE, UNDER_CONSTRUCTION_PATH } from "./constants/routing";
import type { AppRoute } from "./types/routing";

const allRoutes: AppRoute[] = [
    { path: "/home", component: Home },
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
