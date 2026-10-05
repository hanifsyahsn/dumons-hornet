import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { matchPath } from "react-router-dom";
import App from "../pages/App";
import { Loading } from "../components/loading";
import { routes } from "../routes";
import type { RouteContext } from "../types/routing";

const DEFAULT_TITLE = "Hörnet Supercoat | Dumons Coating";
const NOT_FOUND_TITLE = "404 Halaman Tidak Ditemukan | Hörnet Supercoat";
const DISPLAY_FONT_SRC = "/assets/fonts/roboto-condensed-italic-latin.woff2";

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
<html lang="id">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Hörnet Supercoat, inovasi terbaru dari lineup performance coating Dumons. Kilau ekstrem, super hidrofobik, dan proteksi maksimal untuk cat kendaraanmu." />
        <meta name="theme-color" content="#ffff00" />

        <title>${title}</title>

        <link rel="icon" type="image/webp" href="/assets/logo.webp" />
        <link rel="preload" href="${DISPLAY_FONT_SRC}" as="font" type="font/woff2" crossorigin />
        <style>
            /* Display font (headings, buttons, tags), self-hosted from public/assets/fonts.
               Declared here rather than in CSS so css-loader doesn't try to bundle the url().
               Roboto Condensed, variable weight, italic only, latin subset; SIL Open Font License. */
            @font-face {
                font-family: "Roboto Condensed";
                font-style: italic;
                font-weight: 100 900;
                font-display: swap;
                src: url("${DISPLAY_FONT_SRC}") format("woff2");
            }
        </style>
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
            <span class="sr-only">Memuat…</span>
        </div>

        <div id="root">${appHtml}</div>
        <script src="/bundle.js"></script>
    </body>
</html>
`;
}
