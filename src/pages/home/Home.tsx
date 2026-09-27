import React from "react";
import { HORNET_LOGO_SRC, MAIN_SITE_URL } from "../../constants/brand";
import "./styles.css";

function Home() {
    return (
        <main className="construction">
            <div className="construction__stripe" aria-hidden="true" />

            <section className="construction__content">
                <img
                    className="construction__logo"
                    src={HORNET_LOGO_SRC}
                    alt="Hornet Supercoat"
                    width={3126}
                    height={1101}
                />

                <p className="construction__eyebrow">Dumons Coating &middot; Hornet Supercoat</p>

                <h1 className="construction__title">The website is under construction</h1>

                <p className="construction__message">
                    We are developing your best experience. Please check back soon.
                </p>

                <a className="construction__link" href={MAIN_SITE_URL}>
                    Visit dumonscoating.com
                </a>
            </section>

            <footer className="construction__footer">
                &copy; {new Date().getFullYear()} Dumons Coating
            </footer>

            <div className="construction__stripe" aria-hidden="true" />
        </main>
    );
}

export default Home;
