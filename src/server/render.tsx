import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../pages/App";
import { Loading } from "../components/loading";
import { pageHead } from "../routes";
import { NOT_FOUND_TITLE } from "../constants/routing";
import type { PageHead, RouteContext } from "../types/routing";
import { SITE_URL } from "../constants/brand";

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
    const head = pageHead(pathname);
    if (status === 404) head.title = NOT_FOUND_TITLE;

    // The 404 page has no canonical URL of its own and shouldn't be indexed.
    const canonical = status === 200 ? `${SITE_URL}${pathname}` : undefined;

    return { status, html: renderDocument(head, appHtml, canonical) };
}

// Text going into an attribute or <title>
const escape = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Canonical, link previews (WhatsApp, Facebook, X) and schema.org data for indexable pages,
// noindex otherwise. "<" is escaped in JSON-LD so a value can never close the script tag.
function renderSeoMeta({ title, description, image, jsonLd }: PageHead, canonical?: string): string {
    if (!canonical) return `<meta name="robots" content="noindex" />`;

    const imageUrl = `${SITE_URL}${image.src}`;
    const scripts = jsonLd.map(
        (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`,
    );
    return `<meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="${canonical}" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Hörnet Supercoat" />
        <meta property="og:locale" content="id_ID" />
        <meta property="og:url" content="${canonical}" />
        <meta property="og:title" content="${escape(title)}" />
        <meta property="og:description" content="${escape(description)}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:width" content="${image.width}" />
        <meta property="og:image:height" content="${image.height}" />
        <meta property="og:image:alt" content="${escape(image.alt)}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escape(title)}" />
        <meta name="twitter:description" content="${escape(description)}" />
        <meta name="twitter:image" content="${imageUrl}" />
        ${scripts.join("\n        ")}`;
}

function renderDocument(head: PageHead, appHtml: string, canonical?: string): string {
    return `<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${escape(head.description)}" />
        <meta name="theme-color" content="#ffff00" />

        <title>${escape(head.title)}</title>
        ${renderSeoMeta(head, canonical)}

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
