import React, { useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "../pages/App";
import { BrowserRouter } from "react-router-dom";
import { Loading } from "../components/loading";
import "../styles/global.css";

// Diagnostics for phones we can't test on: open any page with ?debug and a box at the
// bottom lists the browser, whether React finished hydrating, and every error it hit.
const DEBUG = /[?&]debug\b/.test(window.location.search);
const debugLines: string[] = [];
const startedAt = performance.now();
function debug(line: string) {
    if (!DEBUG) return;
    debugLines.push(`${Math.round(performance.now() - startedAt)}ms ${line}`);
    let box = document.getElementById("debug-box");
    if (!box) {
        box = document.createElement("pre");
        box.id = "debug-box";
        box.style.cssText =
            "position:fixed;left:0;right:0;bottom:0;z-index:2147483647;max-height:45vh;overflow:auto;margin:0;" +
            "padding:8px;background:#000;color:#ff0;font:11px/1.35 monospace;white-space:pre-wrap;word-break:break-all";
        document.body.appendChild(box);
    }
    box.textContent = debugLines.join("\n");
}
const describe = (error: unknown) =>
    error instanceof Error ? `${error.message}\n${(error.stack ?? "").split("\n").slice(0, 4).join("\n")}` : String(error);

if (DEBUG) {
    debug(`UA ${navigator.userAgent}`);
    window.addEventListener("error", (event) => debug(`window error: ${describe(event.error ?? event.message)}`));
    window.addEventListener("unhandledrejection", (event) => debug(`unhandled rejection: ${describe(event.reason)}`));
    // Taps that reach the page, and whether React handled them (the menu label changes)
    document.addEventListener(
        "click",
        (event) => {
            const target = event.target as Element | null;
            const button = target?.closest?.("button, a");
            debug(`click on ${button ? button.className || button.tagName : target?.tagName} (defaultPrevented=${event.defaultPrevented})`);
        },
        true,
    );
}

declare global {
    interface Window {
        // Set by the inline script in render.tsx: the last button tapped before React listened
        __earlyTap?: HTMLButtonElement;
        __reactListening?: boolean;
    }
}

// The server-rendered loader covers the page until React has hydrated it. hydrateRoot
// returns before hydrating (it runs in chunks afterwards), so lifting the loader right
// after the call left a window on slow phones where buttons took taps but did nothing.
// Effects run only once hydration has committed (or React has re-rendered after a mismatch).
// A button tapped before the bundle ran (the loader lifts by itself after 10s, and on a slow
// first visit the bundle can take longer) gets that tap replayed now, so it still opens.
function LiftLoader() {
    useEffect(() => {
        debug("hydrated");
        document.getElementById("server-loader")?.remove();
        const tap = window.__earlyTap;
        window.__earlyTap = undefined;
        if (tap?.isConnected) {
            debug(`replaying early tap on ${tap.className}`);
            tap.click();
        }
    }, []);
    return null;
}

const root = document.getElementById("root") as HTMLElement;
const serverFirstChild = root.firstElementChild;

// hydrateRoot attaches React's listeners right away; from here on React handles taps itself
window.__reactListening = true;

hydrateRoot(
    root,
    <BrowserRouter>
        <Loading>
            <App />
        </Loading>
        <LiftLoader />
    </BrowserRouter>,
    DEBUG
        ? {
              onRecoverableError: (error) => debug(`recoverable: ${describe(error)}`),
              onCaughtError: (error) => debug(`caught: ${describe(error)}`),
              onUncaughtError: (error) => debug(`UNCAUGHT: ${describe(error)}`),
          }
        : undefined,
);

if (DEBUG) {
    debug("hydrateRoot called");
    window.setTimeout(() => {
        debug(`after 5s: server HTML ${root.firstElementChild === serverFirstChild ? "kept" : "replaced"}, loader ${document.getElementById("server-loader") ? "STILL THERE" : "gone"}`);
    }, 5000);
}
