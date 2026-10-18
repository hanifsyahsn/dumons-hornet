import fs from "fs";
import path from "path";
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

// Hashed bundle and stylesheet names from the client build (webpack.client.js writes them),
// read once; both server.js and prerender.js live in dist/server
const ASSETS: { js: string; css: string } = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../client-assets.json"), "utf8"),
);

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

            /* Loader covering the page until the bundle has hydrated (client/index.tsx removes it).
               Plain CSS on purpose, not Tailwind: Tailwind's @layer and oklab() are dropped by older
               Safari, which left the page showing but not yet interactive, so the menu and carousel
               buttons did nothing until the bundle caught up. If the bundle never runs, the loader
               gets out of the way after 10s rather than lock the page. */
            #server-loader {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(39, 27, 29, 0.85);
                -webkit-backdrop-filter: blur(4px);
                backdrop-filter: blur(4px);
                animation: boot-loader-out 0.3s 10s forwards;
            }
            .boot-loader__rings {
                position: relative;
                width: 128px;
                height: 128px;
            }
            .boot-loader__ring,
            .boot-loader__glow {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
            }
            .boot-loader__ring {
                border: 3px solid #3a2a2d;
                animation: boot-loader-spin 3s linear infinite;
            }
            .boot-loader__ring--a {
                border-right-color: #ffff00;
                border-bottom-color: #ffff00;
            }
            .boot-loader__ring--b {
                border-top-color: #ffff00;
                animation-duration: 2s;
                animation-direction: reverse;
            }
            .boot-loader__glow {
                background: linear-gradient(to top right, rgba(255, 255, 0, 0.2), transparent, rgba(255, 255, 0, 0.1));
                filter: blur(4px);
                animation: boot-loader-pulse 2s ease-in-out infinite;
            }
            .boot-loader__label {
                position: absolute;
                width: 1px;
                height: 1px;
                margin: -1px;
                overflow: hidden;
                clip: rect(0 0 0 0);
                white-space: nowrap;
                border: 0;
            }
            @keyframes boot-loader-spin {
                to { transform: rotate(360deg); }
            }
            @keyframes boot-loader-pulse {
                50% { opacity: 0.5; }
            }
            @keyframes boot-loader-out {
                to { opacity: 0; visibility: hidden; }
            }
            @media (prefers-reduced-motion: reduce) {
                .boot-loader__ring,
                .boot-loader__glow {
                    animation: none;
                }
            }
        </style>
        <link rel="stylesheet" href="${ASSETS.css}" />
        <!-- Deferred from <head>: downloads while the page parses, runs once it has -->
        <script defer src="${ASSETS.js}"></script>
    </head>
    <body>
        <div id="server-loader" role="status" aria-live="polite">
            <div class="boot-loader__rings">
                <div class="boot-loader__ring boot-loader__ring--a"></div>
                <div class="boot-loader__ring boot-loader__ring--b"></div>
                <div class="boot-loader__glow"></div>
            </div>
            <span class="boot-loader__label">Memuat…</span>
        </div>

        <div id="root">${appHtml}</div>
    </body>
</html>
`;
}
