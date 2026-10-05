import Construction from "./pages/construction/Construction";
import Home from "./pages/home/Home";
import NotFound from "./pages/not-found/NotFound";
import type { AppRoute } from "./types/routing";

export const routes: AppRoute[] = [
    { path: "/home", component: Home },
    {
        path: "/under-construction",
        component: Construction,
        title: "Hörnet Supercoat | Under Construction",
    },
    { path: "*", component: NotFound },
];
