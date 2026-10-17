import type { ComponentType } from "react";

export type PageComponent = ComponentType<{ context?: RouteContext }>;

export interface RouteContext {
    url?: string;
    status?: number;
}

export interface AppRoute {
    path: string;
    component: PageComponent;
    // <title>, meta description, preview image and structured data for this page; whatever is
    // missing falls back to the site defaults. A function gets the URL params (e.g. { slug } for
    // "/produk/:slug"); returning undefined falls back too.
    head?: Partial<PageHead> | ((params: Record<string, string | undefined>) => Partial<PageHead> | undefined);
    // For paths with params (e.g. "/products/:slug"): the concrete URLs to prerender at build time.
    getStaticPaths?: () => string[] | Promise<string[]>;
}

// Everything render.tsx writes into <head> for one page
export interface PageHead {
    title: string;
    description: string;
    // Link preview image (absolute path under /public), with its pixel size and alt text
    image: { src: string; width: number; height: number; alt: string };
    // schema.org objects, each written as its own JSON-LD script
    jsonLd: object[];
}
