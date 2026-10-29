/* Pure storefront/server rules. Money is computed as integer fils (1 JOD = 1000). */
export class DomainError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}
export const fail = (code, status) => { throw new DomainError(code, status); };
export const record = value => !!value && typeof value === 'object' && !Array.isArray(value);
export function text(value, max = 300, min = 0) {
  if (typeof value !== 'string') { if (value == null && !min) return ''; fail('invalid-field'); }
  const result = value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  if (result.length < min || result.length > max) fail('invalid-field');
  return result;
}
export function pair(value, max = 300, required = false) {
  const source = typeof value === 'string' ? { ar: value, en: value } : value;
  if (!record(source)) { if (!required && source == null) return { ar: '', en: '' }; fail('invalid-field'); }
  const ar = text(source.ar, max), en = text(source.en, max);
  if (required && (!ar || !en)) fail('bilingual-name-required');
  return { ar: ar || en, en: en || ar };
}
export function id(value, max = 100) {
  const result = text(value, max, 1);
  if (!/^[\p{L}\p{N}_.-]+$/u.test(result) || ['__proto__', 'constructor', 'prototype'].includes(result)) fail('invalid-id');
  return result;
}
export function toMinor(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1000000) fail('invalid-price');
  const minor = Math.round(value * 1000);
  if (Math.abs(value * 1000 - minor) > 0.00001) fail('invalid-price');
  return minor;
}
export const fromMinor = value => value / 1000;
export function optionalInteger(value, max = Number.MAX_SAFE_INTEGER) {
  if (value === null || value === undefined || value === '') return null;
  const result = typeof value === 'string' ? Number(value) : value;
  if (!Number.isSafeInteger(result) || result < 0 || result > max) fail('invalid-measurement');
  return result;
}
export function safeUrl(value, image = false) {
  const result = text(value, 2048);
  if (!result) return '';
  if (image && /^\/(?:api\/photo\/[a-f0-9-]+|assets\/[\w./-]+)$/.test(result) && !result.includes('..')) return result;
  let url;
  try { url = new URL(result); } catch { fail('invalid-url'); }
  if (url.protocol !== 'https:' || url.username || url.password) fail('invalid-url');
  return url.href;
}
const list = (value, max) => { if (!Array.isArray(value) || value.length > max) fail('invalid-list'); return value; };
const unique = values => { if (new Set(values).size !== values.length) fail('duplicate-id'); };
const conditions = ['', 'new', 'new-sealed', 'like-new', 'used', 'used-agency'];
export function available(variant) {
  if (!variant || variant.inStock === false || variant.soldOut === true) return false;
  try { return optionalInteger(variant.stockQuantity) !== 0; } catch { return false; }
}
export function maxQuantity(variant) { if (!available(variant)) return 0; return Math.min(5, optionalInteger(variant.stockQuantity) ?? 5); }
export function unitMinor(variant) {
  const base = toMinor(variant.price);
  const offer = variant.offerPrice == null ? null : toMinor(variant.offerPrice);
  return offer > 0 && offer < base ? offer : base;
}
export function cleanVariant(value) {
  if (!record(value)) fail('invalid-variant');
  const price = toMinor(value.price), offer = value.offerPrice == null || value.offerPrice === '' ? null : toMinor(value.offerPrice);
  if (!price || (offer !== null && (!offer || offer >= price))) fail('invalid-price');
  const condition = text(value.condition, 30);
  if (!conditions.includes(condition)) fail('invalid-condition');
  const noteInput = Array.isArray(value.notes) ? value.notes : record(value.notes) ? Object.keys(value.notes).filter(n => value.notes[n] === true) : [];
  const notes = noteInput.filter(n => ['active', 'noActive', 'mdm'].includes(n));
  if (notes.includes('active') && notes.includes('noActive')) fail('conflicting-notes');
  return {
    key: id(value.key), label: pair(value.label, 300, true), price: fromMinor(price), offerPrice: offer === null ? null : fromMinor(offer),
    inStock: value.inStock !== false, soldOut: value.soldOut === true,
    stockQuantity: optionalInteger(value.stockQuantity), condition,
    storage: text(value.storage ?? value.capacity, 200), batteryHealth: optionalInteger(value.batteryHealth, 100),
    batteryCycles: optionalInteger(value.batteryCycles), warranty: pair(value.warranty, 300), notes: [...new Set(notes)]
  };
}
function technical(value) {
  if (value == null) return undefined;
  if (!record(value)) fail('invalid-specifications');
  const specs = list(value.specs || [], 100).map(row => {
    if (!record(row)) fail('invalid-specifications');
    const label = pair(row.label, 400), val = pair(row.value, 1500);
    if (!label.en && !val.en) return null;
    if (!label.en || !val.en) fail('invalid-specifications');
    return { label, value: val };
  }).filter(Boolean);
  return { summary: pair(value.summary, 1500), specs };
}
export function cleanContent(value) {
  if (!record(value) || !record(value.settings)) fail('invalid-content');
  const products = list(value.products, 500).map(p => {
    if (!record(p)) fail('invalid-product');
    const variants = list(p.variants, 50).map(cleanVariant);
    if (!variants.length) fail('variant-required');
    unique(variants.map(v => v.key));
    const result = { id: id(p.id), cat: id(p.cat), brand: text(p.brand, 100), name: pair(p.name, 200, true), art: text(p.art, 100), img: text(p.img, 100), visible: p.visible !== false, featured: p.featured === true, variants };
    if (p.photo) result.photo = safeUrl(p.photo, true);
    if (p.technical) result.technical = technical(p.technical);
    return result;
  });
  unique(products.map(p => p.id));
  const branches = list(value.branches || [], 30).map(b => ({ id: id(b.id), name: pair(b.name, 200, true), phone: text(b.phone, 30), maps: safeUrl(b.maps), main: b.main === true, whatsapp: b.whatsapp === true }));
  unique(branches.map(b => b.id));
  const s = value.settings;
  const settings = { conceptNotice: s.conceptNotice === true, whatsapp: text(s.whatsapp, 30), instagram: safeUrl(s.instagram), instagramFollowers: pair(s.instagramFollowers, 300), threads: safeUrl(s.threads), tradeInUrl: safeUrl(s.tradeInUrl), deliveryNote: pair(s.deliveryNote, 500), ordersEnabled: s.ordersEnabled === true, indexingEnabled: s.indexingEnabled === true, deliveryFeeMinor: optionalInteger(s.deliveryFeeMinor, 1000000) };
  const c = record(value.campaign) ? value.campaign : {};
  const date = v => { const d = text(v, 10); if (d && !/^\d{4}-\d{2}-\d{2}$/.test(d)) fail('invalid-date'); return d; };
  const campaign = { on: c.on === true, title: pair(c.title, 300), start: date(c.start), end: date(c.end), minInvoice: fromMinor(toMinor(c.minInvoice ?? 0)), drawBranch: c.drawBranch ? id(c.drawBranch) : '', approval: text(c.approval, 100), prizes: list(c.prizes || [], 40).map(p => pair(p, 300)), source: safeUrl(c.source) };
  const result = { rev: 3, products, branches, campaign, settings };
  if (value.categories != null) {
    result.categories = list(value.categories, 50).map(c => ({ id: id(c.id), name: pair(c.name, 200, true), pictureId: text(c.pictureId, 100), art: text(c.art, 100), image: safeUrl(c.image, true), visible: c.visible !== false }));
    unique(result.categories.map(c => c.id));
    if (products.some(p => !result.categories.some(c => c.id === p.cat))) fail('invalid-category');
  }
  // Edited storefront wording: plain text only, keyed by the storefront's text ids.
  if (value.texts != null) {
    if (!record(value.texts)) fail('invalid-texts');
    const entries = Object.entries(value.texts);
    if (entries.length > 600) fail('invalid-texts');
    result.texts = {};
    for (const [key, entry] of entries) {
      if (!/^[a-zA-Z][a-zA-Z0-9_.-]{0,79}$/.test(key) || !record(entry)) fail('invalid-texts');
      const words = { ar: text(entry.ar, 1000), en: text(entry.en, 1000) };
      if (words.ar || words.en) result.texts[key] = words;
    }
  }
  // Reserved, explicit appearance controls. No arbitrary HTML/CSS or executable URLs.
  if (record(value.appearance)) result.appearance = { heroTitle: pair(value.appearance.heroTitle, 300), heroText: pair(value.appearance.heroText, 1000), heroImage: safeUrl(value.appearance.heroImage, true), accent: /^#[a-fA-F0-9]{6}$/.test(value.appearance.accent || '') ? value.appearance.accent : '#FDF402' };
  return result;
}
export function publicContent(content) {
  const result = structuredClone(content);
  result.products = result.products.filter(p => p.visible && !result.categories?.some(c => c.id === p.cat && c.visible === false)).map(p => ({ ...p, variants: p.variants.map(v => { const next = { ...v, inStock: available(v) }; delete next.stockQuantity; return next; }) }));
  if (result.categories) result.categories = result.categories.filter(c => c.visible);
  return result;
}
export function normalizePhone(value) {
  let result = text(value, 30).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[\s()+-]/g, '');
  if (result.startsWith('00962')) result = result.slice(2);
  if (/^07[789]\d{7}$/.test(result)) result = '962' + result.slice(1);
  if (!/^9627[789]\d{7}$/.test(result)) fail('invalid-phone');
  return result;
}
export function customer(value, content, maintenance = false) {
  const result = { name: text(value.name, 100, 2), phone: normalizePhone(value.phone) };
  if (maintenance) {
    result.device = text(value.device, 200, 2); result.issue = text(value.issue, 30);
    if (!['screen', 'battery', 'charging', 'camera', 'audio', 'software', 'water', 'other'].includes(result.issue)) fail('invalid-issue');
    result.details = text(value.details, 2000); result.branchId = id(value.branchId);
  } else {
    if (!['pickup', 'delivery'].includes(value.method)) fail('invalid-method');
    result.method = value.method; result.notes = text(value.notes, 2000);
    if (value.method === 'pickup') result.branchId = id(value.branchId);
    else { result.area = text(value.area, 200, 2); result.address = text(value.address, 1000, 4); }
  }
  if (result.branchId && !content.branches.some(b => b.id === result.branchId)) fail('invalid-branch');
  return result;
}
export function quoteOrder(content, input) {
  const lines = list(input.lines, 30).map(line => {
    if (!record(line) || !Number.isSafeInteger(line.qty) || line.qty < 1 || line.qty > 5) fail('invalid-quantity');
    const product = content.products.find(p => p.id === line.productId && p.visible && !content.categories?.some(c => c.id === p.cat && c.visible === false));
    const variant = product?.variants.find(v => v.key === line.variantKey);
    if (!variant || !available(variant) || (variant.stockQuantity !== null && variant.stockQuantity !== undefined && line.qty > variant.stockQuantity)) fail('unavailable', 409);
    return { productId: product.id, variantKey: variant.key, name: product.name.ar || product.name.en, variant: variant.label.ar || variant.label.en, unitMinor: unitMinor(variant), qty: line.qty };
  });
  if (!lines.length) fail('empty-order');
  unique(lines.map(l => `${l.productId}\u0000${l.variantKey}`));
  const deliveryFeeMinor = input.method === 'delivery' ? content.settings.deliveryFeeMinor : 0;
  const totalMinor = lines.reduce((sum, l) => sum + l.unitMinor * l.qty, deliveryFeeMinor ?? 0);
  if (!Number.isSafeInteger(input.totalMinor) || input.totalMinor !== totalMinor) fail('price-changed', 409);
  return { lines, totalMinor, deliveryFeeMinor };
}
export function validatePassword(value) {
  if (typeof value !== 'string' || value.length < 12 || value.length > 200 || !/\p{L}/u.test(value) || !/[^\p{L}\s]/u.test(value)) fail('weak-password');
  const common = ['password123!', 'password1234', 'qwerty123456', '123456789abc', 'flickmobile123', 'admin12345678'];
  if (common.includes(value.toLowerCase())) fail('weak-password');
  return value;
}
