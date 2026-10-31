import React, { type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { HORNET_MARK_SIZE, HORNET_MARK_SRC } from "../../constants/brand";
import { productPath } from "../../constants/routing";
import { catalog, type Product, type ProductPower } from "../../content";
import "./styles.css";

const POWER_MAX = 5;
// Longest word of any product name ("(Nitrocellulose)"): every card's name is sized from it,
// so it fits the card and the names (and the descriptions under them) line up across a row
const NAME_CHARS = Math.max(1, ...catalog.products.flatMap(({ name }) => name.split(/\s+/).map((word) => word.length)));

interface ProductCardProps {
    product: Product;
    // Heading level of the product name, so it fits under the page's outline
    heading?: "h2" | "h3";
    // Tag the photo with the color it shows (Produk Unggulan on /home); off in the catalog lists
    colorChip?: boolean;
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

// Product card: square image canvas with the code sticker (top) and, with `colorChip` when the
// photo is one of the product's colors, a chip naming it (bottom right), power meters and a
// detail button
export function ProductCard({ product, heading: Heading = "h3", colorChip = false }: ProductCardProps) {
    const { code, name, tagline, description, summary, powers, image, slug, colors } = product;
    const shownColor = colorChip && image ? colors.find((color) => color.image === image) : undefined;

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
                {shownColor && (
                    <span
                        className="product__color-chip"
                        style={{ "--swatch": shownColor.hex } as CSSProperties}
                        aria-hidden="true"
                    >
                        {shownColor.name}
                    </span>
                )}
            </div>

            <div className="product__body">
                <span className="product__tag">{tagline}</span>
                <Heading className="product__name" style={{ "--name-chars": NAME_CHARS } as CSSProperties}>
                    {name}
                </Heading>
                <p className="product__text">{summary ?? description}</p>

                <ProductPowers powers={powers} />

                <Link className="button button--lg button--yellow product__action" to={productPath(slug)}>
                    <span>Lihat detail</span>
                </Link>
            </div>
        </article>
    );
}
