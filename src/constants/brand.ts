import { content } from "../content";

// Served from /public/assets.
// Bordered wordmark (transparent outside the frame): header, footer.
export const HORNET_LOGO_SRC = "/assets/logo-bordered.webp";
export const HORNET_LOGO_SIZE = { width: 1200, height: 423 };

// Square hornet mark: favicon, product photo placeholder.
export const HORNET_MARK_SRC = "/assets/logo.webp";
export const HORNET_MARK_SIZE = { width: 1086, height: 1086 };

// Production origin of this site (no trailing slash): canonical URLs, link previews, sitemap.
export const SITE_URL = "https://hornet.dumonscoating.com";

export const MAIN_SITE_URL = "https://dumonscoating.com/home";

// Contacts and shop/social accounts come from src/content/home.json (editable content);
// re-exported here under the names the rest of the code uses.
const { contact } = content;

export const WHATSAPP_URL = `https://wa.me/${contact.whatsappNumber}`;
export const WHATSAPP_DISPLAY = contact.whatsappDisplay;

export const CONTACT_EMAIL = contact.email;

export const SHOPEE_URL = contact.shopeeUrl;
export const SHOPEE_DISPLAY = contact.shopeeDisplay;
export const INSTAGRAM_URL = contact.instagramUrl;
export const INSTAGRAM_DISPLAY = contact.instagramDisplay;
export const MAIN_SITE_DISPLAY = "dumonscoating.com";
