import React from "react";
import { Link } from "react-router-dom";
import type { RouteContext } from "../../types/routing";
import "../home/styles.css";

interface NotFoundProps {
    context?: RouteContext;
}

function NotFound({ context }: NotFoundProps) {
    if (context) context.status = 404;

    return (
        <main className="construction">
            <div className="construction__stripe" aria-hidden="true" />
            <section className="construction__content">
                <p className="construction__eyebrow">Error 404</p>
                <h1 className="construction__title">Page Not Found</h1>
                <Link className="construction__link" to="/home">
                    Back to Home
                </Link>
            </section>
            <div className="construction__stripe" aria-hidden="true" />
        </main>
    );
}

export default NotFound;
