import React from "react";
import { Link } from "react-router-dom";
import { HORNET_MARK_SIZE, HORNET_MARK_SRC } from "../../constants/brand";
import { productPath } from "../../constants/routing";
import type { Product, ProductPower } from "../../content";
import "./styles.css";

const POWER_MAX = 5;

interface ProductCardProps {
    product: Product;
    // Heading level of the product name, so it fits under the page's outline
    heading?: "h2" | "h3";
}

// Power meters: label + five skewed cells, filled up to the level (also on the detail page)
export function ProductPowers({ powers }: { powers: ProductPower[] }) {
    return (
        <ul className="product__powers">
            {powers.map(({ label, level }) => (
                <li className="power" key={label}>
                    <span className="power__label">{label}</span>
                    <span className="power__meter" role="img" aria-label={`${level} dari ${POWER_MAX}`}>
                        {Array.from({ length: POWER_MAX }, (_, i) => (
                            <span className={`power__cell${i < level ? " power__cell--on" : ""}`} key={i} />
                        ))}
                    </span>
                </li>
            ))}
        </ul>
    );
}

// Product card: square image canvas with the code sticker, power meters and a detail button
export function ProductCard({ product, heading: Heading = "h3" }: ProductCardProps) {
    const { code, name, tagline, description, powers, image, slug } = product;

    return (
        <article className="product">
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
                <Heading className="product__name">{name}</Heading>
                <p className="product__text">{description}</p>

                <ProductPowers powers={powers} />

                <Link className="button button--lg button--yellow product__action" to={productPath(slug)}>
                    <span>Lihat detail</span>
                </Link>
            </div>
        </article>
    );
}
