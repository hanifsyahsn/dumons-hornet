import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { matchPath } from "react-router-dom";
import App from "../pages/App";
import { Loading } from "../components/loading";
import { routes } from "../routes";
import type { RouteContext } from "../types/routing";

const DEFAULT_TITLE = "Hornet Supercoat | Under Construction";
const NOT_FOUND_TITLE = "404 Not Found | Hornet Supercoat";

export interface RenderResult {
    status: number;
    // Set when the page asked for a redirect via context.url.
    redirect?: string;
    html: string;
}

// Shared by the Express server (per request) and the prerender script (at build time),
// so both produce identical HTML.
export function renderPage(url: string): RenderResult {
    const context: RouteContext = {};

    const appHtml = renderToString(
        <StaticRouter location={url}>
            <Loading>
                <App context={context} />
            </Loading>
        </StaticRouter>
    );

    const status = context.status || 200;

    if (context.url) {
        return { status: 301, redirect: context.url, html: "" };
    }

    const pathname = url.split(/[?#]/)[0];
    const route = routes.find(r => r.path !== "*" && matchPath(r.path, pathname));
    const title = status === 404 ? NOT_FOUND_TITLE : route?.title || DEFAULT_TITLE;

    return { status, html: renderDocument(title, appHtml) };
}

function renderDocument(title: string, appHtml: string): string {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Hornet Supercoat by Dumons Coating. The website is under construction, we are developing your best experience." />
        <meta name="theme-color" content="#ffff00" />

        <title>${title}</title>

        <link rel="icon" type="image/webp" href="/assets/logo-borderless.webp" />
        <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
        <div
            id="server-loader"
            role="status"
            aria-live="polite"
            class="fixed inset-0 z-[999999] flex items-center justify-center bg-[#271b1d]/85 backdrop-blur-sm"
        >
            <div class="relative">
                <div class="relative w-32 h-32">
                    <div
                        class="absolute w-full h-full rounded-full border-[3px] border-[#3a2a2d] border-r-[#ffff00] border-b-[#ffff00] animate-spin"
                        style="animation-duration: 3s;"
                    ></div>
                    <div
                        class="absolute w-full h-full rounded-full border-[3px] border-[#3a2a2d] border-t-[#ffff00] animate-spin"
                        style="animation-duration: 2s; animation-direction: reverse;"
                    ></div>
                </div>
                <div class="absolute inset-0 bg-gradient-to-tr from-[#ffff00]/20 via-transparent to-[#ffff00]/10 animate-pulse rounded-full blur-sm"></div>
            </div>
            <span class="sr-only">Loading…</span>
        </div>

        <div id="root">${appHtml}</div>
        <script src="/bundle.js"></script>
    </body>
</html>
`;
}
