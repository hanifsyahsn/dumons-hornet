// Typed access to src/content/home.json, the one file holding everything on /home that can
// change over time (contacts, numbers, promos, products, reviews, results, partners, FAQ).
// The build uses Babel (no type checking), so the JSON is also validated at runtime below:
// a missing or mistyped field throws while prerendering, failing the Netlify build with a
// message naming the item, instead of deploying a broken page.
import type { Partner } from "../components/partners";
import type { Review } from "../components/reviews";
import data from "./home.json";

export interface Contact {
    // International format without "+", for wa.me links
    whatsappNumber: string;
    whatsappDisplay: string;
    email: string;
    shopeeUrl: string;
    shopeeDisplay: string;
    instagramUrl: string;
    instagramDisplay: string;
}

export interface Hero {
    tag: string;
    // Each entry is one line of the big title
    titleLines: string[];
    message: string;
    // Sticker on the hero photo
    productCode: string;
}

// Keys of the icons drawn in Home.tsx (FEATURE_ICONS)
export type FeatureIcon = "sparkle" | "drop" | "shield" | "spray";

export interface Feature {
    icon: FeatureIcon;
    title: string;
    text: string;
}

export interface Stat {
    value: number;
    // Shown after the number, e.g. "+"
    suffix?: string;
    label: string;
}

export interface Promotion {
    // Promo poster (the design carries the whole message), served from /public
    src: string;
    // Describes the promo for screen readers and the prefilled WhatsApp message
    alt: string;
    // Intrinsic pixel size: sets the card's aspect ratio (no layout shift while loading)
    width: number;
    height: number;
}

export interface ProductPower {
    label: string;
    // 1..5, drawn as skewed meter segments
    level: number;
}

export interface Product {
    code: string;
    name: string;
    tagline: string;
    description: string;
    powers: ProductPower[];
    // Product photo served from /public; omitted until it exists (hatched placeholder with the hornet mark)
    image?: string;
    // Transparent cutout of the product (PNG/WebP with alpha), placed on the result photos;
    // omitted until it exists (the hornet mark stands in)
    cutout?: string;
    // Detail page; omitted until it exists (the button has no action yet)
    detailHref?: string;
}

export interface Result {
    // Surface the coating was applied to, shown as a label on the photo
    surface: string;
    // One short line about the result, shown under the photo
    caption: string;
    // Code of the products entry used: its cutout is placed on the photo
    product: string;
    // Photo of the coated surface (cropped to fill the tile); omitted -> hatched placeholder
    photo?: string;
}

export interface Faq {
    question: string;
    // Plain text: also goes into the FAQPage structured data for search engines
    answer: string;
}

export interface HomeContent {
    contact: Contact;
    hero: Hero;
    features: Feature[];
    stats: Stat[];
    tickerWords: string[];
    promotions: Promotion[];
    // Exactly two are designed for (side by side)
    products: Product[];
    reviews: Review[];
    results: Result[];
    partners: Partner[];
    faqs: Faq[];
}

type Json = Record<string, unknown>;

const FEATURE_ICONS: FeatureIcon[] = ["sparkle", "drop", "shield", "spray"];

function fail(path: string, problem: string): never {
    throw new Error(`src/content/home.json: ${path} ${problem}`);
}

function object(value: unknown, path: string): Json {
    if (typeof value !== "object" || value === null || Array.isArray(value)) fail(path, "harus berupa objek {...}");
    return value as Json;
}

function list(value: unknown, path: string): unknown[] {
    if (!Array.isArray(value)) fail(path, "harus berupa daftar [...]");
    return value;
}

function text(item: Json, key: string, path: string, optional = false) {
    const value = item[key];
    if (optional && value === undefined) return;
    if (typeof value !== "string" || value.trim() === "") fail(`${path}.${key}`, "harus berupa teks yang tidak kosong");
}

function number(item: Json, key: string, path: string, optional = false, min?: number, max?: number) {
    const value = item[key];
    if (optional && value === undefined) return;
    if (typeof value !== "number" || !Number.isFinite(value)) fail(`${path}.${key}`, "harus berupa angka (tanpa tanda kutip)");
    if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
        fail(`${path}.${key}`, `harus di antara ${min} dan ${max}`);
    }
}

// Each list entry: validate its fields. Errors count items from 1 for whoever edits the
// JSON ("reviews #2" is the second review)
function each(value: unknown, name: string, check: (item: Json, path: string) => void) {
    list(value, name).forEach((entry, i) => {
        const path = `${name} #${i + 1}`;
        check(object(entry, path), path);
    });
}

function validate(raw: unknown): HomeContent {
    const root = object(raw, "(file)");

    const contact = object(root.contact, "contact");
    ["whatsappNumber", "whatsappDisplay", "email", "shopeeUrl", "shopeeDisplay", "instagramUrl", "instagramDisplay"].forEach(
        (key) => text(contact, key, "contact"),
    );
    if (!/^\d{8,15}$/.test(String(contact.whatsappNumber))) {
        fail("contact.whatsappNumber", "harus angka saja dengan kode negara, contoh 6285159122501");
    }

    const hero = object(root.hero, "hero");
    ["tag", "message", "productCode"].forEach((key) => text(hero, key, "hero"));
    list(hero.titleLines, "hero.titleLines").forEach((line, i) => {
        if (typeof line !== "string" || line.trim() === "") fail(`hero.titleLines #${i + 1}`, "harus berupa teks");
    });

    each(root.features, "features", (item, path) => {
        text(item, "title", path);
        text(item, "text", path);
        if (!FEATURE_ICONS.includes(item.icon as FeatureIcon)) fail(`${path}.icon`, `harus salah satu dari: ${FEATURE_ICONS.join(", ")}`);
    });

    each(root.stats, "stats", (item, path) => {
        number(item, "value", path, false, 0);
        text(item, "suffix", path, true);
        text(item, "label", path);
    });

    list(root.tickerWords, "tickerWords").forEach((word, i) => {
        if (typeof word !== "string" || word.trim() === "") fail(`tickerWords #${i + 1}`, "harus berupa teks");
    });

    each(root.promotions, "promotions", (item, path) => {
        text(item, "src", path);
        text(item, "alt", path);
        number(item, "width", path, false, 1);
        number(item, "height", path, false, 1);
    });

    each(root.products, "products", (item, path) => {
        ["code", "name", "tagline", "description"].forEach((key) => text(item, key, path));
        ["image", "cutout", "detailHref"].forEach((key) => text(item, key, path, true));
        each(item.powers, `${path}.powers`, (power, powerPath) => {
            text(power, "label", powerPath);
            number(power, "level", powerPath, false, 1, 5);
        });
    });
    const codes = (root.products as Json[]).map((product) => product.code);

    each(root.reviews, "reviews", (item, path) => {
        ["quote", "name", "company", "city"].forEach((key) => text(item, key, path));
        number(item, "year", path, false, 1900, 2100);
        number(item, "rating", path, true, 1, 5);
        text(item, "photo", path, true);
    });

    each(root.results, "results", (item, path) => {
        ["surface", "caption", "product"].forEach((key) => text(item, key, path));
        text(item, "photo", path, true);
        if (!codes.includes(item.product)) fail(`${path}.product`, `harus kode salah satu produk: ${codes.join(", ")}`);
    });

    each(root.partners, "partners", (item, path) => {
        ["name", "city", "address"].forEach((key) => text(item, key, path));
        ["mapsUrl", "whatsappUrl"].forEach((key) => text(item, key, path, true));
    });

    each(root.faqs, "faqs", (item, path) => {
        text(item, "question", path);
        text(item, "answer", path);
    });

    return root as unknown as HomeContent;
}

export const content: HomeContent = validate(data);
