import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shell } from "../../components/shell";
import { DEFAULT_PATH, NOT_FOUND_TITLE } from "../../constants/routing";
import type { RouteContext } from "../../types/routing";
import "../home/styles.css";

interface NotFoundProps {
    context?: RouteContext;
}

function NotFound({ context }: NotFoundProps) {
    if (context) context.status = 404;

    // Client-side navigation to a missing page (the server sets the title on a full load).
    // Every render, since it can stay mounted from one missing URL to the next.
    useEffect(() => {
        document.title = NOT_FOUND_TITLE;
    });

    return (
        <Shell>
            <section className="hero">
                <div className="hero__slab" aria-hidden="true" />

                <div className="hero__inner">
                    <div className="hero__copy">
                        <span className="hero__tag">Error 404</span>
                        <h1 className="hero__title">
                            Halaman tidak
                            <br />
                            ditemukan.
                        </h1>
                        <div className="hero__actions">
                            <Link className="button button--lg button--dark" to={DEFAULT_PATH}>
                                <span>Kembali ke beranda</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Shell>
    );
}

export default NotFound;
