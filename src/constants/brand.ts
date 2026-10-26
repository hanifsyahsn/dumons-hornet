import { content } from "../content";

// Served from /public/assets.
// Bordered wordmark (transparent outside the frame): header, footer. Shown at most 200px
// wide, so a 600px copy of logo-bordered.webp is sharp up to 3x screens at a quarter the bytes.
export const HORNET_LOGO_SRC = "/assets/logo-bordered-600.webp";
export const HORNET_LOGO_SIZE = { width: 600, height: 212 };

// Square hornet mark: product photo placeholder, schema.org logo.
export const HORNET_MARK_SRC = "/assets/logo.webp";
// 192px copy for small uses (favicon, the reviews stamp), a fraction of the bytes.
export const HORNET_MARK_SMALL_SRC = "/assets/logo-192.webp";
export const HORNET_MARK_SIZE = { width: 1086, height: 1086 };

// Shopee and WhatsApp logos for the FAQ "where to buy" rows: 96px squares cut from the
// originals beside them (shopee-logo-40483.png, whatsapp-logo-png-2287.png), shown ~26px.
export const SHOPEE_LOGO_SRC = "/assets/shopee-logo-96.webp";
export const WHATSAPP_LOGO_SRC = "/assets/whatsapp-logo-96.webp";

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
