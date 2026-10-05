// Build-time static site generation for Netlify: renders every route in routes.ts to HTML
// and assembles a publishable folder in dist/static (see netlify.toml).
// Run after the client and server bundles are built: `npm run build:static`.
import fs from "fs";
import path from "path";
import { routes } from "../routes";
import { DEFAULT_PATH } from "../constants/routing";
import { renderPage } from "./render";
import { SITE_URL } from "../constants/brand";

const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "dist/static");

// Any URL that no route matches renders the "*" (NotFound) page.
const NOT_FOUND_URL = "/__not-found__";

function writeFile(relativePath: string, contents: string) {
    const file = path.join(OUT_DIR, relativePath);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
}

// "/home" -> "home.html", served by Netlify at /home without a trailing-slash redirect.
function htmlFileFor(url: string): string {
    return url === "/" ? "index.html" : `${url.replace(/^\/|\/$/g, "")}.html`;
}

async function urlsFor(route: (typeof routes)[number]): Promise<string[]> {
    if (route.getStaticPaths) return route.getStaticPaths();
    if (/[:*]/.test(route.path)) {
        console.warn(`  skipped ${route.path}: has params but no getStaticPaths`);
        return [];
    }
    return [route.path];
}

async function main() {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
    fs.cpSync(path.join(ROOT, "dist/client"), OUT_DIR, { recursive: true });
    fs.cpSync(path.join(ROOT, "public"), OUT_DIR, { recursive: true });

    // "/" -> DEFAULT_PATH, so it must be a page we actually prerender (checked below).
    const redirects: string[] = [`/ ${DEFAULT_PATH} 302`];
    const pages: string[] = [];

    for (const route of routes) {
        if (route.path === "*") continue;

        for (const url of await urlsFor(route)) {
            const { status, redirect, html } = renderPage(url);

            if (redirect) {
                redirects.push(`${url} ${redirect} ${status}`);
                console.log(`  ${url} -> ${redirect} (${status})`);
            } else if (status !== 200) {
                throw new Error(`${url} rendered with status ${status}`);
            } else {
                writeFile(htmlFileFor(url), html);
                pages.push(url);
                console.log(`  ${url} -> ${htmlFileFor(url)}`);
            }
        }
    }

    if (!pages.includes(DEFAULT_PATH)) {
        throw new Error(`DEFAULT_ROUTE "${DEFAULT_PATH}" is not a prerendered page`);
    }
    console.log(`  / -> ${DEFAULT_PATH} (302)`);

    writeFile("404.html", renderPage(NOT_FOUND_URL).html);
    console.log("  404 -> 404.html");

    writeFile("_redirects", redirects.join("\n") + "\n");

    // Every prerendered page goes into the sitemap; redirects and the 404 page don't.
    writeFile(
        "sitemap.xml",
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(url => `    <url><loc>${SITE_URL}${url}</loc></url>`).join("\n")}
</urlset>
`
    );
    writeFile("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
    console.log(`  sitemap.xml (${pages.length} pages), robots.txt`);

    console.log(`Prerendered into ${path.relative(ROOT, OUT_DIR)}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
