import { catalog, content, type Product } from "./content";
import { HOME_PATH, PRODUCTS_PATH, productPath } from "./constants/routing";
import {
    CONTACT_EMAIL,
    HORNET_MARK_SIZE,
    HORNET_MARK_SRC,
    INSTAGRAM_URL,
    MAIN_SITE_URL,
    SHOPEE_URL,
    SITE_URL,
} from "./constants/brand";
import type { PageHead } from "./types/routing";

// Per-page <head> content (title, description, preview image, schema.org data), used by
// routes.ts; copy for /home and /produk is editable in home.json / products.json.

const SITE_NAME = "Hörnet Supercoat";
const COMPANY_NAME = "Dümons Coating";
// Google shows ~155-160 characters of a description
const DESCRIPTION_MAX = 160;

const { hero } = content;

// The can lineup photo when set, else the hornet mark
const SITE_IMAGE = hero.lineup
    ? { src: hero.lineup.image, width: hero.lineup.width, height: hero.lineup.height, alt: hero.lineup.alt }
    : { src: HORNET_MARK_SRC, ...HORNET_MARK_SIZE, alt: "Logo Hörnet Supercoat" };

const url = (path: string) => `${SITE_URL}${path}`;

// Cut at a word boundary so the snippet never ends mid-word
function clip(text: string, max = DESCRIPTION_MAX): string {
    if (text.length <= max) return text;
    const cut = text.slice(0, max - 1);
    return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}

const ORGANIZATION = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY_NAME,
    url: MAIN_SITE_URL,
    logo: url(HORNET_MARK_SRC),
    email: CONTACT_EMAIL,
    contactPoint: {
        "@type": "ContactPoint",
        telephone: `+${content.contact.whatsappNumber}`,
        contactType: "customer service",
        areaServed: "ID",
        availableLanguage: "Indonesian",
    },
    sameAs: [INSTAGRAM_URL, SHOPEE_URL],
};

const breadcrumbs = (items: [string, string][]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
        "@type": "ListItem",
        position: i + 1,
        name,
        item: url(path),
    })),
});

export const DEFAULT_HEAD: PageHead = {
    title: content.seo.title,
    description: clip(content.seo.description),
    image: SITE_IMAGE,
    jsonLd: [],
};

export const homeHead = (): Partial<PageHead> => ({
    jsonLd: [
        { "@context": "https://schema.org", ...ORGANIZATION },
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            url: url(HOME_PATH),
            inLanguage: "id-ID",
            publisher: { "@id": `${SITE_URL}/#organization` },
        },
    ],
});

export const productsHead = (): Partial<PageHead> => ({
    title: catalog.page.seoTitle,
    description: clip(catalog.page.seoDescription),
    jsonLd: [
        breadcrumbs([
            ["Beranda", HOME_PATH],
            ["Produk", PRODUCTS_PATH],
        ]),
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Produk Hörnet Supercoat",
            itemListElement: catalog.products.map((product, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: url(productPath(product.slug)),
                name: product.name,
            })),
        },
    ],
});

export function productHead(product: Product): Partial<PageHead> {
    const { name, code, tagline, description, image, slug, colors, specs } = product;
    const colorCount = colors.length > 0 ? `, ${colors.length} Warna` : "";
    const photos = [image, ...colors.map((color) => color.image)].filter((src): src is string => !!src);
    return {
        title: `${name} – ${tagline}${colorCount} | ${COMPANY_NAME}`,
        // First sentence (plus the color count) reads better in a snippet than a clipped paragraph
        description: clip(`${description.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? description}${colors.length > 0 ? ` Tersedia ${colors.length} warna.` : ""}`),
        image: image
            ? { src: image, width: 1000, height: 1000, alt: `${name} ${code}` }
            : undefined,
        jsonLd: [
            breadcrumbs([
                ["Beranda", HOME_PATH],
                ["Produk", PRODUCTS_PATH],
                [name, productPath(slug)],
            ]),
            {
                "@context": "https://schema.org",
                "@type": "Product",
                name,
                sku: code,
                description,
                category: tagline,
                url: url(productPath(slug)),
                image: [...new Set(photos)].map(url),
                brand: { "@type": "Brand", name: SITE_NAME },
                manufacturer: ORGANIZATION,
                ...(colors.length > 0 && { color: colors.map((color) => color.name).join(", ") }),
                ...(specs && {
                    additionalProperty: specs.map(({ label, value }) => ({
                        "@type": "PropertyValue",
                        name: label,
                        value,
                    })),
                }),
            },
        ],
    };
}
