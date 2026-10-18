import React, { useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "../pages/App";
import { BrowserRouter } from "react-router-dom";
import { Loading } from "../components/loading";
import "../styles/global.css";

// The server-rendered loader covers the page until React has hydrated it. hydrateRoot
// returns before hydrating (it runs in chunks afterwards), so lifting the loader right
// after the call left a window on slow phones where buttons took taps but did nothing.
// Effects run only once hydration has committed (or React has re-rendered after a mismatch).
function LiftLoader() {
    useEffect(() => {
        document.getElementById("server-loader")?.remove();
    }, []);
    return null;
}

hydrateRoot(
    document.getElementById("root") as HTMLElement,
    <BrowserRouter>
        <Loading>
            <App />
        </Loading>
        <LiftLoader />
    </BrowserRouter>
);
