import type { ComponentType } from "react";

export type PageComponent = ComponentType<{ context?: RouteContext }>;

export interface RouteContext {
    url?: string;
    status?: number;
}

export interface AppRoute {
    path: string;
    component: PageComponent;
    // <title> for this page; falls back to the site default.
    title?: string;
    // For paths with params (e.g. "/products/:slug"): the concrete URLs to prerender at build time.
    getStaticPaths?: () => string[] | Promise<string[]>;
}
