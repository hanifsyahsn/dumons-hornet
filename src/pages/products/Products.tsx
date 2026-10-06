import React, { type CSSProperties } from "react";
import { ProductCard } from "../../components/product-card";
import { Shell } from "../../components/shell";
import { WhatsAppFloat } from "../../components/whatsapp-float";
import { SHOPEE_URL, WHATSAPP_URL } from "../../constants/brand";
import { catalog } from "../../content";
import "./styles.css";

// Everything editable lives in src/content/products.json (validated in src/content/index.ts)
const { page: PAGE, products: PRODUCTS } = catalog;

const helpWhatsAppUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(
    "Halo, saya mau tanya produk Hörnet yang cocok untuk kendaraan saya.",
)}`;

// /produk: the whole Hörnet catalog
function Products() {
    return (
        <Shell>
            <section className="catalog-head">
                <div className="catalog-head__slab" aria-hidden="true" />

                <div className="catalog-head__inner">
                    <span className="catalog-head__tag">{PAGE.tag}</span>
                    <h1 className="catalog-head__title">
                        {PAGE.titleLines.map((line, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <br />}
                                {line}
                            </React.Fragment>
                        ))}
                    </h1>
                    <p className="catalog-head__lead">{PAGE.lead}</p>
                    <span className="catalog-head__count">{PRODUCTS.length} produk</span>
                </div>
            </section>

            <div className="hazard hazard--thin" aria-hidden="true" />

            <section className="catalog" aria-label="Daftar produk">
                <div className="catalog__inner">
                    <div className="catalog__grid" style={{ "--count": PRODUCTS.length } as CSSProperties}>
                        {PRODUCTS.map((product) => (
                            <ProductCard product={product} heading="h2" key={product.code} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="catalog-help" id="bantuan">
                <div className="catalog-help__inner">
                    <div>
                        <h2 className="catalog-help__title">Bingung pilih?</h2>
                        <p className="catalog-help__message">
                            Ceritakan kendaraan dan kebutuhanmu, tim kami bantu pilihkan produk yang pas.
                        </p>
                    </div>
                    <div className="catalog-help__actions">
                        <a
                            className="button button--lg button--yellow"
                            href={helpWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Tanya via WhatsApp</span>
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
            </section>

            <WhatsAppFloat hideOverId="bantuan" />
        </Shell>
    );
}

export default Products;
