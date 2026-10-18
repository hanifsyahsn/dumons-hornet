import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";
import { DEFAULT_PATH } from "../constants/routing";
import { pageHead, routes } from "../routes";
import type { RouteContext } from "../types/routing";

interface AppProps {
    context?: RouteContext;
}

// Router links don't scroll by themselves: after a link to another page (PUSH/REPLACE), start
// at its top, or at its section for "/home#promo". POP (back/forward, the first load, and
// plain "#id" anchors, which the browser already scrolled) is left to the browser.
// "instant" overrides the smooth scroll-behavior on <html>, meant for in-page anchors. Older
// Safari rejects that value with a TypeError (and an error here would take the whole app
// down after every link), so it falls back to the plain call; those versions have no smooth
// scrolling anyway, so the jump stays instant.
function jump(scroll: (options: ScrollToOptions & ScrollIntoViewOptions) => void) {
    try {
        scroll({ behavior: "instant" });
    } catch {
        scroll({});
    }
}

function ScrollToLocation() {
    const { pathname, hash } = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        if (navigationType === "POP") return;
        const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
        if (target) jump((options) => target.scrollIntoView(options));
        else jump((options) => window.scrollTo({ ...options, top: 0 }));
    }, [pathname, hash, navigationType]);

    // The server wrote the first page's <title>; keep it in step on client-side navigation.
    // Runs before the page's own effects, so NotFound can still override it.
    useEffect(() => {
        document.title = pageHead(pathname).title;
    }, [pathname]);

    return null;
}

const App = ({ context }: AppProps) => {
    return (
        <>
            <ScrollToLocation />
            <Routes>
                <Route path="/" element={<Navigate to={DEFAULT_PATH} replace />} />
                {routes.map(({ path, component: Component }) => (
                    <Route key={path} path={path} element={<Component context={context} />} />
                ))}
            </Routes>
        </>
    );
};

export default App;
