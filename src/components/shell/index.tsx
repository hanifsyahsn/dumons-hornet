import React, { type ReactNode } from "react";
import {
    HORNET_LOGO_SIZE,
    HORNET_LOGO_SRC,
    INSTAGRAM_DISPLAY,
    INSTAGRAM_URL,
    MAIN_SITE_DISPLAY,
    MAIN_SITE_URL,
} from "../../constants/brand";
import "./styles.css";

interface Social {
    label: string;
    display: string;
    href: string;
    icon: ReactNode;
}

// Footer links to the brand's other channels (the shop is in the home page's contact card)
const SOCIALS: Social[] = [
    {
        label: "Instagram",
        display: INSTAGRAM_DISPLAY,
        href: INSTAGRAM_URL,
        icon: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <path d="M17.5 6.5h.01" />
            </>
        ),
    },
    {
        label: "Website",
        display: MAIN_SITE_DISPLAY,
        href: MAIN_SITE_URL,
        icon: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
            </>
        ),
    },
];

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
                    <ul className="shell__socials">
                        {SOCIALS.map(({ label, display, href, icon }) => (
                            <li key={label}>
                                <a
                                    className="shell__social"
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="shell__social-icon" aria-hidden="true">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            {icon}
                                        </svg>
                                    </span>
                                    <span className="shell__social-text">
                                        <span className="shell__social-label">{label}</span>
                                        <span className="shell__social-handle">{display}</span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>

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
