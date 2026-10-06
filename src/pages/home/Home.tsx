import React, { type CSSProperties, type ReactNode } from "react";
import { Mascot } from "../../components/mascot";
import { Reviews, type Review } from "../../components/reviews";
import { Shell } from "../../components/shell";
import {
    CONTACT_EMAIL,
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

interface Promotion {
    // Promo poster (the design carries the whole message), served from /public
    src: string;
    // Describes the promo for screen readers and the prefilled WhatsApp message
    alt: string;
    // Intrinsic pixel size: sets the card's aspect ratio (no layout shift while loading)
    width: number;
    height: number;
}

// Any number of posters, in any order and orientation: see .promos__grid. Ratios from
// 9:16 (story) to 2.2:1 fill their card exactly; anything beyond is shown whole on a
// hatched background. The whole section is hidden while the list is empty.
// Placeholders until the real posters are ready.
const PROMOTIONS: Promotion[] = [
    {
        src: "/assets/promos/placeholder-portrait.svg",
        alt: "Promo perkenalan: diskon 20% Hörnet Supercoat HS 470",
        width: 1080,
        height: 1350,
    },
    {
        src: "/assets/promos/placeholder-landscape.svg",
        alt: "Beli 2 botol HS 470 gratis kain microfiber",
        width: 1600,
        height: 900,
    },
    {
        src: "/assets/promos/placeholder-square.svg",
        alt: "Harga khusus untuk bengkel dan detailer mitra",
        width: 1080,
        height: 1080,
    },
];

interface ProductPower {
    label: string;
    // 1..5, drawn as skewed meter segments
    level: number;
}

interface Product {
    code: string;
    name: string;
    tagline: string;
    description: string;
    powers: ProductPower[];
    // Product photo served from /public; omitted until it exists (hatched placeholder with the hornet mark)
    image?: string;
    // Detail page; omitted until it exists (the button has no action yet)
    detailHref?: string;
}

const POWER_MAX = 5;

// Exactly two highlighted products, shown side by side (stacked on phones).
// The second one is a placeholder until the real lineup is final.
const PRODUCTS: [Product, Product] = [
    {
        code: "HS 470",
        name: "Hörnet Supercoat",
        tagline: "Coating andalan",
        description:
            "Lapisan pelindung dengan kilau ekstrem dan efek daun talas yang membuat air dan kotoran langsung meluncur.",
        powers: [
            { label: "Kilau", level: 5 },
            { label: "Hidrofobik", level: 5 },
            { label: "Ketahanan", level: 4 },
        ],
    },
    {
        code: "HS 220",
        name: "Hörnet Quick Coat",
        tagline: "Semprot & lap",
        description:
            "Booster praktis untuk perawatan rutin: semprot, lap, dan kilau serta sifat hidrofobik coating kembali segar.",
        powers: [
            { label: "Kilau", level: 4 },
            { label: "Hidrofobik", level: 4 },
            { label: "Kemudahan", level: 5 },
        ],
    },
];

// Four-point sparkle used as a background ornament
const SPARKLE_PATH = "M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0z";

// Customer reviews, any number: shown one at a time in a carousel (see components/reviews).
// `photo` (initials until set) and `rating` (1..5 stars, hidden when unset) are optional.
// The section is hidden while the list is empty.
// Placeholders until real reviews are collected.
const REVIEWS: Review[] = [
    {
        quote: "Hasil kilapnya beda kelas. Mobil pelanggan keluar dari bengkel kami dengan tampilan yang benar-benar seperti baru, dan efek airnya masih terasa berbulan-bulan kemudian.",
        name: "Budi Santoso",
        company: "PT Kilau Motor Sejahtera",
        city: "Jakarta",
        year: 2025,
        rating: 5,
    },
    {
        quote: "Aplikasinya gampang dan hasilnya konsisten. Sejak pakai Hörnet, pelanggan detailing kami makin banyak yang repeat order.",
        name: "Rina Wijaya",
        company: "PT Detailindo Prima",
        city: "Surabaya",
        year: 2025,
        rating: 5,
    },
    {
        quote: "Kami pakai untuk armada kendaraan operasional. Cuci jadi jauh lebih cepat karena kotoran tidak gampang menempel.",
        name: "Agus Pratama",
        company: "PT Armada Nusantara Logistik",
        city: "Bandung",
        year: 2024,
        rating: 4,
    },
];

const TICKER_WORDS = ["Promo", "Diskon", "Hörnet Supercoat", "Hemat", "Promo", "Bonus"];
// One loop copy of the ticker: the words repeated until it's wider than any screen
// (~3800px), otherwise the right side runs empty before the loop snaps back.
const TICKER_COPY = Array.from({ length: 4 }, () => TICKER_WORDS).flat();

const promoWhatsAppUrl = (alt: string) =>
    `${WHATSAPP_URL}?text=${encodeURIComponent(`Halo, saya mau tanya tentang promo Hörnet: ${alt}`)}`;

const [EMAIL_USER, EMAIL_DOMAIN] = CONTACT_EMAIL.split("@");

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
                            <a className="button button--lg button--dark" href="#produk">
                                <span>Lihat produk</span>
                            </a>
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

            {PROMOTIONS.length > 0 && (
                <section className="promos">
                    {/* Scrolling ticker; the text is doubled so the loop is seamless */}
                    <div className="ticker" aria-hidden="true">
                        <div className="ticker__track">
                            {[0, 1].map((copy) => (
                                <span className="ticker__group" key={copy}>
                                    {TICKER_COPY.map((word, i) => (
                                        <span className="ticker__item" key={i}>
                                            {word}
                                        </span>
                                    ))}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="promos__inner">
                        <div className="promos__head">
                            <div className="promos__copy">
                                <h2 className="promos__title">
                                    Promo <span className="promos__highlight">Hörnet</span>
                                </h2>
                                <p className="promos__lead">
                                    Penawaran spesial yang sedang berlaku. Klik promo untuk tanya
                                    langsung.
                                </p>
                            </div>

                            <div className="promos__mascot">
                                <span className="promos__shout" aria-hidden="true">
                                    Promo!
                                </span>
                                <Mascot />
                            </div>
                        </div>

                        <ul className="promos__grid">
                            {PROMOTIONS.map(({ src, alt, width, height }) => (
                                <li
                                    className="promo"
                                    key={src}
                                    style={{ "--ratio": width / height } as CSSProperties}
                                >
                                    <a
                                        className="promo__link"
                                        href={promoWhatsAppUrl(alt)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            className="promo__image"
                                            src={src}
                                            alt={alt}
                                            width={width}
                                            height={height}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            <section className="products" id="produk">
                <div className="products__inner">
                    <h2 className="products__title">
                        Produk <span className="products__highlight">Unggulan</span>
                    </h2>
                    <p className="products__lead">
                        Dua senjata utama lineup Hörnet untuk kilau dan proteksi maksimal.
                    </p>

                    <div className="products__grid">
                        {PRODUCTS.map(
                            ({ code, name, tagline, description, powers, image, detailHref }) => (
                                <article className="product" key={code}>
                                    <div className="product__canvas">
                                        {image ? (
                                            <img src={image} alt={`${name} ${code}`} loading="lazy" decoding="async" />
                                        ) : (
                                            // Placeholder until the product photo is ready: set `image`
                                            <div className="product__photo--placeholder">
                                                <img src={HORNET_MARK_SRC} alt="" {...HORNET_MARK_SIZE} loading="lazy" />
                                            </div>
                                        )}
                                        <span className="product__sticker">{code}</span>
                                    </div>

                                    <div className="product__body">
                                        <span className="product__tag">{tagline}</span>
                                        <h3 className="product__name">{name}</h3>
                                        <p className="product__text">{description}</p>

                                        <ul className="product__powers">
                                            {powers.map(({ label, level }) => (
                                                <li className="power" key={label}>
                                                    <span className="power__label">{label}</span>
                                                    <span
                                                        className="power__meter"
                                                        role="img"
                                                        aria-label={`${level} dari ${POWER_MAX}`}
                                                    >
                                                        {Array.from({ length: POWER_MAX }, (_, i) => (
                                                            <span
                                                                className={`power__cell${i < level ? " power__cell--on" : ""}`}
                                                                key={i}
                                                            />
                                                        ))}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {detailHref ? (
                                            <a className="button button--lg button--yellow product__action" href={detailHref}>
                                                <span>Lihat detail</span>
                                            </a>
                                        ) : (
                                            // No action yet: the detail pages don't exist.
                                            <button type="button" className="button button--lg button--yellow product__action">
                                                <span>Lihat detail</span>
                                            </button>
                                        )}
                                    </div>
                                </article>
                            ),
                        )}
                    </div>
                </div>
            </section>

            {REVIEWS.length > 0 && (
                <section className="testimonials">
                    {/* Background ornaments: halftone, giant outlined quote, sparkles, chips */}
                    <div className="testimonials__decor" aria-hidden="true">
                        <span className="testimonials__halftone" />
                        <span className="testimonials__bigquote">&ldquo;</span>
                        {[1, 2, 3, 4].map((n) => (
                            <svg className={`sparkle sparkle--${n}`} viewBox="0 0 24 24" key={n}>
                                <path d={SPARKLE_PATH} />
                            </svg>
                        ))}
                        {[1, 2, 3].map((n) => (
                            <span className={`testimonials__chip testimonials__chip--${n}`} key={n} />
                        ))}
                    </div>

                    <div className="testimonials__inner">
                        <div className="testimonials__head">
                            <div className="testimonials__copy">
                                <h2 className="testimonials__title">
                                    Kata <span className="testimonials__highlight">Mereka</span>
                                </h2>
                                <p className="testimonials__lead">
                                    Cerita langsung dari bengkel, detailer, dan pemilik kendaraan
                                    yang sudah membuktikan Hörnet.
                                </p>
                            </div>

                            {/* Rubber stamp: ring text spins around the hornet mark */}
                            <svg className="stamp" viewBox="0 0 200 200" aria-hidden="true">
                                <defs>
                                    <path id="stamp-ring" d="M100 22a78 78 0 1 1 0 156a78 78 0 1 1 0-156" />
                                </defs>
                                <circle className="stamp__outer" cx="100" cy="100" r="96" />
                                <g className="stamp__ring">
                                    <text className="stamp__text">
                                        <textPath href="#stamp-ring" textLength="486">
                                            Pelanggan puas ✦ Terbukti ✦ Hörnet ✦
                                        </textPath>
                                    </text>
                                </g>
                                <circle className="stamp__inner" cx="100" cy="100" r="58" />
                                <image href={HORNET_MARK_SRC} x="58" y="58" width="84" height="84" />
                            </svg>
                        </div>

                        <Reviews reviews={REVIEWS} />
                    </div>
                </section>
            )}

            <div className="hazard" aria-hidden="true" />

            <section className="cta">
                <div className="cta__inner">
                    <div className="cta__copy">
                        <h2 className="cta__title">
                            Butuh info
                            <br />
                            lebih lanjut?
                        </h2>
                        <p className="cta__message">
                            Punya pertanyaan atau ingin tahu info lebih detail tentang Hörnet?
                            Ngobrol langsung dengan tim kami.
                        </p>
                    </div>

                    <div className="contact-card">
                        <span className="contact-card__tag">Hubungi kami</span>

                        <a
                            className="button button--lg button--yellow contact-card__whatsapp"
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Chat via WhatsApp</span>
                        </a>

                        <ul className="contact-card__list">
                            <li className="contact-card__row">
                                <span className="contact-card__icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
                                    </svg>
                                </span>
                                <span className="contact-card__label">WhatsApp</span>
                                <a
                                    className="contact-card__value"
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {WHATSAPP_DISPLAY}
                                </a>
                            </li>
                            <li className="contact-card__row">
                                <span className="contact-card__icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="1" />
                                        <path d="M22 6l-10 7L2 6" />
                                    </svg>
                                </span>
                                <span className="contact-card__label">Email</span>
                                <a className="contact-card__value" href={`mailto:${CONTACT_EMAIL}`}>
                                    {/* Wrap before the @ on narrow screens, not mid-word */}
                                    {EMAIL_USER}
                                    <wbr />@{EMAIL_DOMAIN}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </Shell>
    );
}

export default Home;
