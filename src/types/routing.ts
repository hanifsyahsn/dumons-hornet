import type { ComponentType } from "react";

export type PageComponent = ComponentType<{ context?: RouteContext }>;

export interface RouteContext {
    url?: string;
    status?: number;
}

export interface AppRoute {
    path: string;
    component: PageComponent;
    // <title> for this page; falls back to the site default. A function gets the URL params
    // (e.g. { slug } for "/produk/:slug"); returning undefined falls back too.
    title?: string | ((params: Record<string, string | undefined>) => string | undefined);
    // For paths with params (e.g. "/products/:slug"): the concrete URLs to prerender at build time.
    getStaticPaths?: () => string[] | Promise<string[]>;
}
