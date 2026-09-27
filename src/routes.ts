import Home from "./pages/home/Home";
import NotFound from "./pages/not-found/NotFound";
import type { AppRoute } from "./types/routing";

// "/" -> "/home" is handled by a redirect in server.tsx (and App.tsx for client navigation).
export const routes: AppRoute[] = [
    { path: "/home", component: Home },
    { path: "*", component: NotFound },
];
