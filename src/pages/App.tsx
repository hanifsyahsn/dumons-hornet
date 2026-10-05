import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DEFAULT_PATH } from "../constants/routing";
import { routes } from "../routes";
import type { RouteContext } from "../types/routing";

interface AppProps {
    context?: RouteContext;
}

const App = ({ context }: AppProps) => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={DEFAULT_PATH} replace />} />
            {routes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component context={context} />} />
            ))}
        </Routes>
    );
};

export default App;
