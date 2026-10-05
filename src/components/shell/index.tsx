import React, { type ReactNode } from "react";
import { HORNET_LOGO_SIZE, HORNET_LOGO_SRC, MAIN_SITE_URL } from "../../constants/brand";
import "./styles.css";

interface ShellProps {
    children: ReactNode;
}

// Page frame shared by every page: header with the logo, content, hazard strip and footer.
export function Shell({ children }: ShellProps) {
    return (
        <div className="shell">
            <header className="shell__header">
                <div className="shell__container shell__header-inner">
                    {/* Static on purpose: not a link, no hover, so it doesn't look clickable */}
                    <img
                        className="shell__logo"
                        src={HORNET_LOGO_SRC}
                        alt="Hörnet Supercoat"
                        {...HORNET_LOGO_SIZE}
                    />
                </div>
            </header>

            <main className="shell__main">{children}</main>

            <div className="hazard hazard--thin" aria-hidden="true" />

            <footer className="shell__footer">
                <div className="shell__container shell__footer-inner">
                    <img
                        className="shell__footer-logo"
                        src={HORNET_LOGO_SRC}
                        alt="Hörnet Supercoat"
                        {...HORNET_LOGO_SIZE}
                    />
                    <span className="shell__copyright">
                        &copy; {new Date().getFullYear()} Hörnet Supercoat &middot;{" "}
                        <a className="shell__footer-link" href={MAIN_SITE_URL}>
                            Dumons Coating
                        </a>
                    </span>
                </div>
            </footer>
        </div>
    );
}
