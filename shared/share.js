// Link-preview pictures for device pages: the catalog cards made by
// scripts/make-device-cards.mjs, and cards the live admin makes for devices
// added or changed there (product.shareImage).
import { SHARE_CARDS } from "./share-cards.js";

const nameIn = (value, lang) =>
  typeof value === "string" ? value : value?.[lang] || value?.en || value?.ar || "";

// Everything a card shows. A card made for another value is out of date.
export function deviceShareSignature(product) {
  return JSON.stringify([
    nameIn(product?.name, "ar"),
    nameIn(product?.name, "en"),
    product?.brand || "",
    product?.cat || "",
    product?.img || "",
    product?.photo || "",
  ]);
}

// The device's catalog card, as a path under the site root, or null when there
// is none or the device has changed since it was made.
export function deviceShareCard(product, lang) {
  const card = product && SHARE_CARDS[product.id];
  if (!card || !card[lang] || card.sig !== deviceShareSignature(product)) return null;
  return `assets/share/devices/${encodeURIComponent(product.id)}-${lang}.jpg?v=${card[lang]}`;
}

// The picture to share for a device: its catalog card, else the card the admin
// made for it (only while it still matches the device), else null.
export function deviceShareImage(product, lang) {
  const card = deviceShareCard(product, lang);
  if (card) return "/" + card;
  const own = product?.shareImage;
  if (own && own.sig === deviceShareSignature(product) && own[lang]) return own[lang];
  return null;
}
