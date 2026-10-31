import React, { useRef, useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard, ProductPowers } from "../../components/product-card";
import { Shell } from "../../components/shell";
import { HORNET_MARK_SIZE, HORNET_MARK_SRC, SHOPEE_URL, WHATSAPP_URL } from "../../constants/brand";
import { PRODUCTS_PATH } from "../../constants/routing";
import { catalog, productBySlug, type Product } from "../../content";
import type { RouteContext } from "../../types/routing";
import NotFound from "../not-found/NotFound";
// .catalog__grid (the /produk grid) for "Produk lainnya"
import "../products/styles.css";
import "./styles.css";

interface ProductDetailProps {
    context?: RouteContext;
}

// /produk/:slug: one product from src/content/products.json; unknown slugs are a 404
function ProductDetail({ context }: ProductDetailProps) {
    const { slug = "" } = useParams();
    const product = productBySlug(slug);
    if (!product) return <NotFound context={context} />;

    // Keyed so moving to another product starts again from its first color
    return <ProductView product={product} key={product.slug} />;
}

// Ink label strip closing each Spesifikasi card: brand, hazard stripes, product code
function SpecsFoot({ code }: { code: string }) {
    return (
        <div className="specs__foot" aria-hidden="true">
            <span>Hörnet</span>
            <span className="specs__foot-stripes" />
            <span>{code}</span>
        </div>
    );
}

function ProductView({ product }: { product: Product }) {
    const { code, name, tagline, description, powers, image, colors, highlights = [], specs = [], steps = [] } = product;
    const [colorIndex, setColorIndex] = useState(0);
    const color = colors[colorIndex];
    const canvasRef = useRef<HTMLDivElement>(null);
    // Set by a tap/click on a swatch, so keyboard arrows (which also fire change) don't scroll
    const pointerPick = useRef(false);

    // Picking a color with a tap: if the photo is cut off (phones/tablets, where it sits above
    // the picker), bring it into view so the change can be seen. scroll-padding-top keeps it
    // clear of the sticky header. On desktop the photo is pinned in view, so nothing moves.
    const pickColor = (i: number) => {
        setColorIndex(i);
        const canvas = canvasRef.current;
        if (!pointerPick.current || !canvas) return;
        pointerPick.current = false;
        const { top, bottom } = canvas.getBoundingClientRect();
        const headerBottom = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        if (top >= headerBottom && bottom <= window.innerHeight) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // "auto" (not "instant", which older Safari rejects) follows <html>, which is not smooth
        // under prefers-reduced-motion
        canvas.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };

    // The chosen color's photo, else the product photo, else the placeholder (tinted with the color)
    const photo = color?.image ?? image;
    const others = catalog.products.filter((other) => other.code !== code);

    const orderText = `Halo, saya mau pesan ${name} ${code}${color ? ` warna ${color.name}` : ""}.`;
    const orderUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(orderText)}`;

    return (
        <Shell>
            <section className="detail">
                <div className="detail__inner">
                    <nav className="detail__crumbs" aria-label="Breadcrumb">
                        <Link to={PRODUCTS_PATH}>Produk</Link>
                        <span aria-hidden="true">/</span>
                        <span aria-current="page">{code}</span>
                    </nav>

                    <div className="detail__grid">
                        <div className="detail__media">
                            <div
                                className="detail__canvas"
                                ref={canvasRef}
                                style={color ? ({ "--swatch": color.hex } as CSSProperties) : undefined}
                            >
                                {photo ? (
                                    <img src={photo} alt={`${name} ${code}${color ? `, ${color.name}` : ""}`} />
                                ) : (
                                    // Placeholder until the photos are ready: set the color's or product's `image`
                                    <div className="detail__placeholder">
                                        <img src={HORNET_MARK_SRC} alt="" {...HORNET_MARK_SIZE} />
                                    </div>
                                )}
                                <span className="detail__sticker">{code}</span>
                                {color && (
                                    <span className="detail__color-chip" aria-hidden="true">
                                        {color.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="detail__info">
                            <span className="detail__tag">{tagline}</span>
                            {/* Without the resin in brackets ("Hörnet PU (Polyurethane)" -> "Hörnet PU"):
                                the description right below already names it */}
                            <h1 className="detail__name">{name.replace(/\s*\([^)]*\)\s*$/, "")}</h1>
                            <p className="detail__text">{description}</p>

                            {colors.length > 0 && (
                                <fieldset className="colors">
                                    <legend className="colors__legend">
                                        Pilihan warna <span className="colors__count">{colors.length} warna</span>
                                    </legend>

                                    <div className="colors__list">
                                        {colors.map(({ name: colorName, hex }, i) => (
                                            <label
                                                className="swatch"
                                                key={colorName}
                                                title={colorName}
                                                onPointerDown={() => (pointerPick.current = true)}
                                            >
                                                <input
                                                    className="swatch__input"
                                                    type="radio"
                                                    name={`warna-${code}`}
                                                    value={colorName}
                                                    checked={i === colorIndex}
                                                    onChange={() => pickColor(i)}
                                                    onKeyDown={() => (pointerPick.current = false)}
                                                />
                                                <span
                                                    className="swatch__chip"
                                                    style={{ "--swatch": hex } as CSSProperties}
                                                    aria-hidden="true"
                                                />
                                                <span className="sr-only">{colorName}</span>
                                            </label>
                                        ))}
                                    </div>

                                    <p className="colors__selected" aria-live="polite">
                                        Warna: <strong>{color.name}</strong>
                                    </p>
                                </fieldset>
                            )}

                            <ProductPowers powers={powers} />

                            <div className="detail__actions">
                                <a
                                    className="button button--lg button--yellow"
                                    href={orderUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Pesan via WhatsApp</span>
                                </a>
                                <a
                                    className="button button--lg button--white"
                                    href={SHOPEE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Beli di Shopee</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {(highlights.length > 0 || specs.length > 0 || steps.length > 0) && (
                <>
                    <div className="hazard hazard--thin" aria-hidden="true" />
                    <section className="specs" aria-labelledby="spesifikasi">
                        <div className="detail__inner">
                            <h2 className="specs__title" id="spesifikasi">
                                Spesifikasi
                            </h2>
                            <div className="specs__grid">
                                {highlights.length > 0 && (
                                    <div className="specs__card specs__card--yellow">
                                        <h3 className="specs__heading">Keunggulan</h3>
                                        <ul className="specs__highlights">
                                            {highlights.map((highlight) => (
                                                <li key={highlight}>{highlight}</li>
                                            ))}
                                        </ul>
                                        <SpecsFoot code={code} />
                                    </div>
                                )}
                                {specs.length > 0 && (
                                    <div className="specs__card">
                                        <h3 className="specs__heading">Data teknis</h3>
                                        <dl className="specs__table">
                                            {specs.map(({ label, value }) => (
                                                <div className="specs__row" key={label}>
                                                    <dt>{label}</dt>
                                                    <dd>{value}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                        <SpecsFoot code={code} />
                                    </div>
                                )}
                                {steps.length > 0 && (
                                    <div className="specs__card specs__card--steps">
                                        <h3 className="specs__heading">Cara pemakaian</h3>
                                        <ol className="specs__steps">
                                            {steps.map((step) => (
                                                <li key={step}>{step}</li>
                                            ))}
                                        </ol>
                                        <SpecsFoot code={code} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {others.length > 0 && (
                <>
                    <div className="hazard hazard--thin" aria-hidden="true" />
                    <section className="detail-others">
                        <div className="detail__inner">
                            <h2 className="detail-others__title">Produk lainnya</h2>
                            <div className="catalog__grid">
                                {others.map((other) => (
                                    <ProductCard product={other} key={other.code} />
                                ))}
                            </div>
                            <div className="detail-others__more">
                                <Link className="button button--lg button--dark" to={PRODUCTS_PATH}>
                                    <span>Lihat semua produk</span>
                                </Link>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </Shell>
    );
}

export default ProductDetail;
