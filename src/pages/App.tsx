import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";
import { DEFAULT_PATH } from "../constants/routing";
import { routes } from "../routes";
import type { RouteContext } from "../types/routing";

interface AppProps {
    context?: RouteContext;
}

// Router links don't scroll by themselves: after a link to another page (PUSH/REPLACE), start
// at its top, or at its section for "/home#promo". POP (back/forward, the first load, and
// plain "#id" anchors, which the browser already scrolled) is left to the browser.
// "instant" overrides the smooth scroll-behavior on <html>, meant for in-page anchors.
function ScrollToLocation() {
    const { pathname, hash } = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        if (navigationType === "POP") return;
        const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
        if (target) target.scrollIntoView({ behavior: "instant" });
        else window.scrollTo({ top: 0, behavior: "instant" });
    }, [pathname, hash, navigationType]);

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
