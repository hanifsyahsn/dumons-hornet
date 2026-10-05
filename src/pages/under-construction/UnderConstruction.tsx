import React from "react";
import { HORNET_LOGO_SIZE, HORNET_LOGO_SRC, MAIN_SITE_URL } from "../../constants/brand";
import "./styles.css";

// Standalone holding page (no Shell), the only page while MAINTENANCE_MODE is on.
// Kept as its own page so it stays available after launch (maintenance, new lineups).
function UnderConstruction() {
    return (
        <main className="construction">
            <div className="construction__stripe" aria-hidden="true" />

            <section className="construction__content">
                <img
                    className="construction__logo"
                    src={HORNET_LOGO_SRC}
                    alt="Hörnet Supercoat"
                    {...HORNET_LOGO_SIZE}
                />

                <p className="construction__eyebrow">Dumons Coating &middot; Hornet Supercoat</p>

                <h1 className="construction__title">The website is under construction</h1>

                <p className="construction__message">
                    We are developing your best experience. Please check back soon.
                </p>

                <a className="construction__link" href={MAIN_SITE_URL}>
                    <span>Visit dumonscoating.com</span>
                </a>
            </section>

            <footer className="construction__footer">
                &copy; {new Date().getFullYear()} Dumons Coating
            </footer>

            <div className="construction__stripe" aria-hidden="true" />
        </main>
    );
}

export default UnderConstruction;
