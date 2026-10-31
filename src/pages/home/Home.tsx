import React, { type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CountUp } from "../../components/count-up";
import { Mascot } from "../../components/mascot";
import { MascotFollower } from "../../components/mascot-follower";
import { Partners } from "../../components/partners";
import { Reviews } from "../../components/reviews";
import { ProductCard } from "../../components/product-card";
import { Shell } from "../../components/shell";
import { WhatsAppFloat } from "../../components/whatsapp-float";
import {
    CONTACT_EMAIL,
    HORNET_MARK_SIZE,
    HORNET_MARK_SMALL_SRC,
    HORNET_MARK_SRC,
    SHOPEE_DISPLAY,
    SHOPEE_LOGO_SRC,
    SHOPEE_URL,
    WHATSAPP_DISPLAY,
    WHATSAPP_LOGO_SRC,
    WHATSAPP_URL,
} from "../../constants/brand";
import { PRODUCTS_PATH } from "../../constants/routing";
import { content, productByCode, type FaqIcon, type FeatureIcon } from "../../content";
import "./styles.css";

const { hero: HERO, features: FEATURES, stats: STATS, statsTitle: STATS_TITLE, promotions: PROMOTIONS } = content;
const { reviews: REVIEWS, results: RESULTS, partners: PARTNERS, faqs: FAQS, tickerWords: TICKER_WORDS } = content;

// Everything editable lives in src/content/home.json and products.json (validated in src/content/index.ts)

// The stats heading's last word goes on a yellow marker ("Dipercaya di seluruh [Nusantara.]")
const STATS_TITLE_SPLIT = (STATS_TITLE ?? "").trim().lastIndexOf(" ") + 1;
const STATS_TITLE_LEAD = (STATS_TITLE ?? "").trim().slice(0, STATS_TITLE_SPLIT);
const STATS_TITLE_LAST = (STATS_TITLE ?? "").trim().slice(STATS_TITLE_SPLIT);
// Length of the longest stat label: the labels are sized from it so every one fits one line
const STATS_LABEL_CHARS = Math.max(1, ...STATS.map(({ label }) => label.length));

// Feature icons (24x24 stroke paths), picked by the `icon` key in home.json
const FEATURE_ICONS: Record<FeatureIcon, ReactNode> = {
    sparkle: (
        <>
            <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
            <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
        </>
    ),
    drop: <path d="M12 3c3.5 4.2 6 7.6 6 10.5A6 6 0 0 1 6 13.5C6 10.6 8.5 7.2 12 3z" />,
    shield: (
        <>
            <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
            <path d="M8.5 12l2.5 2.5 4.5-5" />
        </>
    ),
    spray: (
        <>
            <rect x="7" y="9" width="8" height="12" rx="1" />
            <path d="M9 9V6h4v3" />
            <path d="M13 6h3l2-2" />
            <path d="M19 8h2M19 11h2M18 14l1.5 1" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2.5" />
            <path d="M10 2h4" />
        </>
    ),
};

const partnerWhatsAppUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(
    "Halo, saya tertarik untuk bergabung menjadi mitra Hörnet. Boleh minta info kemitraannya?",
)}`;

// FAQPage structured data (schema.org), so search engines can show the Q&A directly;
// "<" escaped so an answer can never close the script tag
const FAQ_JSON_LD = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ question, answer, items = [] }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: [answer, ...items.map(({ text }) => text)].join("\n") },
    })),
}).replace(/</g, "\\u003c");

// Logos for the rows under an FAQ answer (faqs[].items[].icon), each on a square chip:
// the Shopee and WhatsApp logos, and a storefront (24x24 SVG) for shops/workshops
const FAQ_ICONS: Record<FaqIcon, ReactNode> = {
    shopee: <img src={SHOPEE_LOGO_SRC} alt="" width={96} height={96} loading="lazy" decoding="async" />,
    whatsapp: <img src={WHATSAPP_LOGO_SRC} alt="" width={96} height={96} loading="lazy" decoding="async" />,
    store: (
        <svg viewBox="0 0 24 24">
            <g fill="none" stroke="var(--hornet-ink)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.5 9.5L5 4h14l1.5 5.5" />
                <path d="M3.5 9.5a2.8 2.8 0 0 0 5.6 0a2.9 2.9 0 0 0 5.8 0a2.8 2.8 0 0 0 5.6 0" />
                <path d="M5 12.5V20h14v-7.5" />
                <path d="M10 20v-4.5h4V20" />
            </g>
        </svg>
    ),
};

// The two "Produk Unggulan" cards (codes checked against the catalog at load)
const FEATURED = content.featuredProducts.map((code) => productByCode(code)!);

// Product featured in the hero: its photo fills the hero frame
const HERO_PRODUCT = productByCode(HERO.productCode);

// Every size of the lineup cutout; the browser picks by screen width and pixel density
const HERO_LINEUP_SRCSET = HERO.lineup
    ? [...(HERO.lineup.smaller ?? []), { image: HERO.lineup.image, width: HERO.lineup.width }]
          .map(({ image, width }) => `${image} ${width}w`)
          .join(", ")
    : undefined;
// Drawn width of the cans: 106-110% of the stage, which is near full width on phones,
// up to 720px from --large and 860px from --xxlarge (see .hero__stage)
const HERO_LINEUP_SIZES = "(min-width: 1601px) 950px, (min-width: 961px) 800px, 100vw";

// Empty grid cells after the last result, filled with ornaments. Three columns: the
// big tile takes 4 cells, so n results use n + 3. Two columns: it's a full-width banner,
// then the other n - 1 tiles in pairs. One column (phones) never has a gap.
const RESULT_GAPS_LARGE = (3 - (RESULTS.length % 3)) % 3;
const RESULT_GAPS_MEDIUM = RESULTS.length > 0 ? (RESULTS.length - 1) % 2 : 0;
const RESULT_FILLERS = Math.max(RESULT_GAPS_LARGE, RESULT_GAPS_MEDIUM);

// Four-point sparkle used as a background ornament
const SPARKLE_PATH = "M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0z";

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

                <div className={`hero__inner${HERO.lineup ? " hero__inner--lineup" : ""}`}>
                    <div className="hero__copy">
                        <span className="hero__tag">{HERO.tag}</span>

                        <h1 className="hero__title">
                            {HERO.titleLines.map((line, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <br />}
                                    {line}
                                </React.Fragment>
                            ))}
                        </h1>

                        <p className="hero__message">{HERO.message}</p>

                        <div className="hero__actions">
                            <a className="button button--lg button--dark" href="#produk">
                                <span>Lihat produk</span>
                            </a>
                        </div>
                    </div>

                    <div className="hero__media">
                        {HERO.lineup ? (
                            // The whole can lineup on a dark stage dressed like the brand posters
                            <div className="hero__stage">
                                <div className="hero__stage-panel" aria-hidden="true">
                                    <span className="hero__stage-slashes" />
                                </div>
                                <div className="hero__stage-plinth" aria-hidden="true" />
                                <img
                                    className="hero__stage-cans"
                                    src={HERO.lineup.image}
                                    alt={HERO.lineup.alt}
                                    srcSet={HERO_LINEUP_SRCSET}
                                    sizes={HERO_LINEUP_SIZES}
                                    width={HERO.lineup.width}
                                    height={HERO.lineup.height}
                                    fetchPriority="high"
                                />
                                <div className="hero__sticker hero__sticker--stage">{HERO.lineup.sticker}</div>
                            </div>
                        ) : (
                            <div className="hero__frame">
                                {/* The hero product's `image` from products.json; hatched placeholder until set */}
                                {HERO_PRODUCT?.image ? (
                                    <div className="hero__photo hero__photo--product">
                                        <img src={HERO_PRODUCT.image} alt={`${HERO_PRODUCT.name} ${HERO_PRODUCT.code}`} />
                                    </div>
                                ) : (
                                    <div className="hero__photo hero__photo--placeholder">
                                        <img src={HORNET_MARK_SRC} alt="" {...HORNET_MARK_SIZE} />
                                    </div>
                                )}
                                <div className="hero__sticker">{HERO.productCode}</div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="hazard" aria-hidden="true" />

            <section className="features">
                <div className="features__inner">
                    <h2 className="features__title">
                        Kenapa <span className="features__highlight">Supercoat</span>
                    </h2>
                    <p className="features__lead">{content.featuresLead}</p>

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
                                            {FEATURE_ICONS[icon]}
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

            {STATS.length > 0 && (
                <section className="stats" aria-label={STATS_TITLE ? undefined : "Hörnet dalam angka"}>
                    <div className="stats__inner">
                        {STATS_TITLE && (
                            <div className="stats__head">
                                <span className="stats__tag">Hörnet dalam angka</span>
                                <h2 className="stats__title">
                                    {STATS_TITLE_LEAD}
                                    <span className="stats__mark">
                                        {STATS_TITLE_LAST}
                                        <svg className="stats__sparkle" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
                                        </svg>
                                        <svg
                                            className="stats__sparkle stats__sparkle--small"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
                                        </svg>
                                    </span>
                                </h2>
                                <span className="stats__rule" aria-hidden="true" />
                            </div>
                        )}
                        <ul className="stats__list" style={{ "--label-chars": STATS_LABEL_CHARS } as CSSProperties}>
                            {STATS.map(({ value, suffix, label }) => (
                                <li className="stat" key={label}>
                                    <span className="stat__value">
                                        <CountUp value={value} />
                                        {suffix && <span className="stat__suffix">{suffix}</span>}
                                    </span>
                                    <span className="stat__label">{label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {PROMOTIONS.length > 0 && (
                <section className="promos" id="promo">
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
                        {FEATURED.map((product) => (
                            <ProductCard product={product} colorChip key={product.code} />
                        ))}
                    </div>

                    <div className="products__more">
                        <Link className="button button--lg button--dark" to={PRODUCTS_PATH}>
                            <span>Lihat semua produk</span>
                        </Link>
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
                                    Cerita langsung dari retail, bengkel, dan workshop yang sudah
                                    membuktikan Hörnet.
                                </p>
                                {/* Optional (`reviewsJoinHidden` in home.json): the head reads the
                                    same with or without it */}
                                {!content.reviewsJoinHidden && (
                                    <a
                                        className="button button--lg button--dark testimonials__join"
                                        href={partnerWhatsAppUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span>Jadi mitra</span>
                                    </a>
                                )}
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
                                <image href={HORNET_MARK_SMALL_SRC} x="58" y="58" width="84" height="84" />
                            </svg>
                        </div>

                        <Reviews reviews={REVIEWS} />
                    </div>
                </section>
            )}

            <div className="hazard" aria-hidden="true" />

            {RESULTS.length > 0 && (
                <section className="results" id="hasil">
                    <div className="results__inner">
                        <div className="results__head">
                            <h2 className="results__title">
                                Hasil <span className="results__highlight">Nyata</span>
                            </h2>
                            <p className="results__lead">
                                Bukti langsung di berbagai permukaan: dari body mobil sampai tangki
                                motor, warna pekat dan kilaunya kelihatan.
                            </p>
                        </div>

                        <ul className="results__grid">
                            {RESULTS.map(({ surface, caption, product: code, photo }, i) => {
                                const product = productByCode(code);
                                return (
                                    <li className="result" key={`${surface}-${i}`}>
                                        <div className="result__canvas">
                                            {photo ? (
                                                <img
                                                    className="result__photo"
                                                    src={photo}
                                                    alt={`${surface}: ${caption}`}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            ) : (
                                                // Placeholder until the result photo is ready: set `photo`
                                                <div className="result__photo result__photo--placeholder">
                                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M3 8h4l2-3h6l2 3h4v12H3z" />
                                                        <circle cx="12" cy="13.5" r="3.5" />
                                                    </svg>
                                                    <span>Foto hasil</span>
                                                </div>
                                            )}

                                            <span className="result__surface">{surface}</span>

                                            {product && (
                                                <span className="result__product">
                                                    <img
                                                        className="result__cutout"
                                                        src={product.cutout ?? HORNET_MARK_SRC}
                                                        alt=""
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                    <span className="result__code">{product.code}</span>
                                                </span>
                                            )}
                                        </div>

                                        <p className="result__caption">{caption}</p>
                                    </li>
                                );
                            })}

                            {/* Free-floating ornaments in the leftover cells (no tile around
                                them); each shows only on the layout that has that gap */}
                            {Array.from({ length: RESULT_FILLERS }, (_, i) => (
                                <li
                                    key={`filler-${i}`}
                                    aria-hidden="true"
                                    className={[
                                        "result-filler",
                                        i === 0 ? "result-filler--mascot" : "result-filler--shine",
                                        i < RESULT_GAPS_MEDIUM && "result-filler--medium",
                                        i < RESULT_GAPS_LARGE && "result-filler--large",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                >
                                    {[1, 2, 3].map((n) => (
                                        <svg className={`result-filler__sparkle result-filler__sparkle--${n}`} viewBox="0 0 24 24" key={n}>
                                            <path d={SPARKLE_PATH} />
                                        </svg>
                                    ))}
                                    {[1, 2].map((n) => (
                                        <span className={`result-filler__chip result-filler__chip--${n}`} key={n} />
                                    ))}
                                    {i === 0 ? (
                                        <>
                                            <span className="result-filler__bubble">Giliran mobilmu?</span>
                                            <Mascot className="result-filler__mascot" />
                                        </>
                                    ) : (
                                        <span className="result-filler__word">Kilau!</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {!content.partnersHidden && PARTNERS.length > 0 && (
                <section className="partners-band" id="mitra">
                    <div className="partners-band__inner">
                        <div className="partners-band__head">
                            <div>
                                <h2 className="partners-band__title">
                                    Bengkel &amp; Toko <span className="partners-band__highlight">Mitra</span>
                                </h2>
                                <p className="partners-band__lead">
                                    Mau beli langsung atau sekalian dicatkan? Datangi bengkel dan toko
                                    mitra Hörnet di kotamu.
                                </p>
                            </div>
                            <a
                                className="button button--lg button--dark partners-band__join"
                                href={partnerWhatsAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>Jadi mitra</span>
                            </a>
                        </div>

                        <Partners partners={PARTNERS} />
                    </div>
                </section>
            )}

            {FAQS.length > 0 && (
                <section className="faq" id="faq">
                    {/* The hornet lazily following the mouse around the section */}
                    <MascotFollower />

                    <div className="faq__inner">
                        <div className="faq__intro">
                            <h2 className="faq__title">
                                Tanya <span className="faq__highlight">Jawab</span>
                            </h2>
                            <p className="faq__lead">
                                Yang paling sering ditanyakan soal Hörnet. Belum ketemu jawabannya?
                            </p>
                            <a
                                className="button button--lg button--yellow"
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>Tanya via WhatsApp</span>
                            </a>
                        </div>

                        {/* Native disclosure: opens without JS, and the answers stay in the HTML */}
                        <div className="faq__list">
                            {FAQS.map(({ question, answer, items }, i) => (
                                <details className="faq-item" key={question}>
                                    <summary className="faq-item__question">
                                        <span className="faq-item__number">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="faq-item__text">{question}</span>
                                        <span className="faq-item__toggle" aria-hidden="true" />
                                    </summary>
                                    <p className={`faq-item__answer${items ? " faq-item__answer--lead" : ""}`}>
                                        {answer}
                                    </p>
                                    {items && (
                                        <ul className="faq-item__channels">
                                            {items.map(({ icon, text }) => (
                                                <li className="faq-channel" key={text}>
                                                    <span
                                                        className={`faq-channel__icon faq-channel__icon--${icon}`}
                                                        aria-hidden="true"
                                                    >
                                                        {FAQ_ICONS[icon]}
                                                    </span>
                                                    <span className="faq-channel__text">{text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </details>
                            ))}
                        </div>
                    </div>

                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }}
                    />
                </section>
            )}

            <section className="cta" id="kontak">
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

                        <a
                            className="button button--lg button--dark contact-card__shop"
                            href={SHOPEE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Beli di Shopee</span>
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
                                        <path d="M4 8h16l-1.2 12.5a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9z" />
                                        <path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10" />
                                    </svg>
                                </span>
                                <span className="contact-card__label">Shopee</span>
                                <a
                                    className="contact-card__value"
                                    href={SHOPEE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {SHOPEE_DISPLAY}
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
            <WhatsAppFloat hideOverId="kontak" />
        </Shell>
    );
}

export default Home;
