import React, { type ReactNode } from "react";
import { Shell } from "../../components/shell";
import {
    HORNET_MARK_SIZE,
    HORNET_MARK_SRC,
    WHATSAPP_DISPLAY,
    WHATSAPP_URL,
} from "../../constants/brand";
import "./styles.css";

interface Feature {
    title: string;
    text: string;
    icon: ReactNode;
}

const FEATURES: Feature[] = [
    {
        title: "Kilau ekstrem",
        text: "Kilap tajam dan dalam yang bikin cat tampak seperti baru keluar dari ruang poles.",
        icon: (
            <>
                <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
                <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
            </>
        ),
    },
    {
        title: "Super hidrofobik",
        text: "Air langsung membulat dan meluncur, membawa debu dan kotoran ikut pergi.",
        icon: <path d="M12 3c3.5 4.2 6 7.6 6 10.5A6 6 0 0 1 6 13.5C6 10.6 8.5 7.2 12 3z" />,
    },
    {
        title: "Proteksi maksimal",
        text: "Lapisan tangguh yang menjaga cat dari paparan UV, kotoran, dan noda membandel.",
        icon: (
            <>
                <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
                <path d="M8.5 12l2.5 2.5 4.5-5" />
            </>
        ),
    },
    {
        title: "Perawatan mudah",
        text: "Kotoran sulit menempel, cuci jadi lebih cepat dan kilau bertahan lebih lama.",
        icon: (
            <>
                <rect x="7" y="9" width="8" height="12" rx="1" />
                <path d="M9 9V6h4v3" />
                <path d="M13 6h3l2-2" />
                <path d="M19 8h2M19 11h2M18 14l1.5 1" />
            </>
        ),
    },
];

function Home() {
    return (
        <Shell>
            <section className="hero">
                <div className="hero__slab" aria-hidden="true" />

                <div className="hero__inner">
                    <div className="hero__copy">
                        <span className="hero__tag">Supercoat</span>

                        <h1 className="hero__title">
                            Kilau yang
                            <br />
                            menyengat.
                        </h1>

                        <p className="hero__message">
                            Hörnet Supercoat adalah inovasi terbaru dari lineup performance
                            coating Dumons. Kilau ekstrem, proteksi maksimal, dan tampilan
                            yang bikin setiap mata menoleh.
                        </p>

                        <div className="hero__actions">
                            {/* No action yet: the product section doesn't exist. */}
                            <button type="button" className="button button--lg button--dark">
                                <span>Lihat produk</span>
                            </button>
                        </div>
                    </div>

                    <div className="hero__media">
                        <div className="hero__frame">
                            {/* Placeholder until the HS 470 product photo is ready: swap the img src. */}
                            <div className="hero__photo hero__photo--placeholder">
                                <img src={HORNET_MARK_SRC} alt="" {...HORNET_MARK_SIZE} />
                            </div>
                            <div className="hero__sticker">HS 470</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="hazard" aria-hidden="true" />

            <section className="features">
                <div className="features__inner">
                    <h2 className="features__title">
                        Kenapa <span className="features__highlight">Supercoat</span>
                    </h2>
                    <p className="features__lead">
                        Satu lapisan, performa yang langsung terasa sejak cucian pertama.
                    </p>

                    <div className="features__grid">
                        {FEATURES.map(({ title, text, icon }) => (
                            <article className="feature" key={title}>
                                <div className="feature__head">
                                    <span className="feature__icon">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            {icon}
                                        </svg>
                                    </span>
                                    <h3 className="feature__title">{title}</h3>
                                </div>
                                <p className="feature__text">{text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta">
                <div className="cta__inner">
                    <div className="cta__copy">
                        <h2 className="cta__title">
                            Butuh info
                            <br />
                            lebih lanjut?
                        </h2>
                        <p className="cta__message">
                            Punya pertanyaan atau ingin tahu info lebih detail tentang Hörnet ?
                            Ngobrol langsung dengan tim kami.
                        </p>
                    </div>

                    <div className="cta__actions">
                        <a
                            className="button button--xl button--yellow"
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Chat via WhatsApp</span>
                        </a>
                        <span className="cta__contact">{WHATSAPP_DISPLAY}</span>
                    </div>
                </div>
            </section>
        </Shell>
    );
}

export default Home;
