import { HOME_PATH, PRODUCTS_PATH } from "../../constants/routing";
import { content } from "../../content";

const { promotions, results, partners, faqs } = content;

// A header link: either a page (`path`) or a section of a page (`path` + `section`, the
// id on its <section>). Shell turns a section on the current page into a plain "#id"
// anchor (native scroll) and everything else into a router link (see App's ScrollToLocation).
export interface NavItem {
    label: string;
    path: string;
    section?: string;
}

// Site-wide header links, shown on every page that uses Shell. Home sections hidden while
// their list in home.json is empty drop out of the nav too.
export const SITE_NAV: NavItem[] = [
    { label: "Produk", path: PRODUCTS_PATH },
    promotions.length > 0 && { label: "Promo", path: HOME_PATH, section: "promo" },
    results.length > 0 && { label: "Hasil", path: HOME_PATH, section: "hasil" },
    partners.length > 0 && { label: "Mitra", path: HOME_PATH, section: "mitra" },
    faqs.length > 0 && { label: "FAQ", path: HOME_PATH, section: "faq" },
    { label: "Kontak", path: HOME_PATH, section: "kontak" },
].filter((item): item is NavItem => Boolean(item));
