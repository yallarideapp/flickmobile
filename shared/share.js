// Link-preview pictures for device pages (see scripts/make-device-cards.mjs).
import { SHARE_CARDS } from "./share-cards.js";

const nameIn = (value, lang) =>
  typeof value === "string" ? value : value?.[lang] || value?.en || value?.ar || "";

// The device's own card, as a path under the site root, or null when there is no
// card or the admin changed the device's name or photo since it was made.
export function deviceShareCard(product, lang) {
  const card = product && SHARE_CARDS[product.id];
  if (!card || !card[lang] || product.photo) return null;
  if ((product.img || "") !== card.img) return null;
  if (nameIn(product.name, lang) !== nameIn(card.name, lang)) return null;
  return `assets/share/devices/${encodeURIComponent(product.id)}-${lang}.jpg?v=${card[lang]}`;
}

// Devices that have a card in this language (the demo builds a share page for each).
export function devicesWithCards(lang) {
  return Object.keys(SHARE_CARDS).filter((id) => SHARE_CARDS[id][lang]);
}
