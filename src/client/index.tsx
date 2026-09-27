import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "../pages/App";
import { BrowserRouter } from "react-router-dom";
import { Loading } from "../components/loading";
import "../styles/global.css";

hydrateRoot(
    document.getElementById("root") as HTMLElement,
    <BrowserRouter>
        <Loading>
            <App />
        </Loading>
    </BrowserRouter>
);

// The server-rendered loader covers the page until the bundle has hydrated.
document.getElementById("server-loader")?.remove();
