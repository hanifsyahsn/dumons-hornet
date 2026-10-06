import React, { useState, type CSSProperties } from "react";
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

function ProductView({ product }: { product: Product }) {
    const { code, name, tagline, description, powers, image, colors } = product;
    const [colorIndex, setColorIndex] = useState(0);
    const color = colors[colorIndex];

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
                            <h1 className="detail__name">{name}</h1>
                            <p className="detail__text">{description}</p>

                            {colors.length > 0 && (
                                <fieldset className="colors">
                                    <legend className="colors__legend">
                                        Pilihan warna <span className="colors__count">{colors.length} warna</span>
                                    </legend>

                                    <div className="colors__list">
                                        {colors.map(({ name: colorName, hex }, i) => (
                                            <label className="swatch" key={colorName} title={colorName}>
                                                <input
                                                    className="swatch__input"
                                                    type="radio"
                                                    name={`warna-${code}`}
                                                    value={colorName}
                                                    checked={i === colorIndex}
                                                    onChange={() => setColorIndex(i)}
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

            {others.length > 0 && (
                <>
                    <div className="hazard hazard--thin" aria-hidden="true" />
                    <section className="detail-others">
                        <div className="detail__inner">
                            <h2 className="detail-others__title">Produk lainnya</h2>
                            <div
                                className="catalog__grid"
                                style={{ "--count": others.length } as CSSProperties}
                            >
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
