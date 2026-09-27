// Build-time static site generation for Netlify: renders every route in routes.ts to HTML
// and assembles a publishable folder in dist/static (see netlify.toml).
// Run after the client and server bundles are built: `npm run build:static`.
import fs from "fs";
import path from "path";
import { routes } from "../routes";
import { renderPage } from "./render";

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

    const redirects: string[] = [];

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
                console.log(`  ${url} -> ${htmlFileFor(url)}`);
            }
        }
    }

    writeFile("404.html", renderPage(NOT_FOUND_URL).html);
    console.log("  404 -> 404.html");

    if (redirects.length) {
        writeFile("_redirects", redirects.join("\n") + "\n");
    }

    console.log(`Prerendered into ${path.relative(ROOT, OUT_DIR)}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
