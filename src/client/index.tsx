import React, { useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "../pages/App";
import { BrowserRouter } from "react-router-dom";
import { Loading } from "../components/loading";
import { DEFAULT_PATH } from "../constants/routing";
import "../styles/global.css";
import { DEBUG, debug } from "../debug";

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

// Netlify answers "/" with the DEFAULT_PATH page itself (200, URL unchanged) rather than the
// 302 in _redirects. Hydrating that HTML at "/" rendered App's <Navigate> instead of the page,
// so React left the server markup in place, dead, above its own copy. Switch the URL first so
// the router hydrates the page the HTML actually is.
if (window.location.pathname === "/") {
    window.history.replaceState(window.history.state, "", DEFAULT_PATH + window.location.search + window.location.hash);
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
