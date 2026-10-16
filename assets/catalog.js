// Verified photographs may be added here later. Store uploads take precedence.
// Generated artwork is deliberately kept separate from actual photography.
export const productPhotos = {};

// Unmodified 1254 × 1254 sheets use generated luminance mattes to remove the
// backdrop at display time. SVG viewports select individual square cells.
const illustration = (sheet, column, row) => ({
  src: new URL(`./products/${sheet}.png`, import.meta.url).href,
  maskSrc: new URL(`./products/mattes/${sheet}.png`, import.meta.url).href,
  width: 1254,
  height: 1254,
  viewBox: `${column * 627} ${row * 627} 627 627`,
});

export const productIllustrations = {
  'iphone-17-pro-max': illustration('phones-apple', 0, 0),
  'iphone-17-pro': illustration('phones-apple', 1, 0),
  'iphone-air': illustration('phones-apple', 0, 1),
  'iphone-17': illustration('phones-apple', 1, 1),
  'iphone-16': illustration('phones-samsung', 0, 0),
  'galaxy-s25-ultra': illustration('phones-samsung', 1, 0),
  'galaxy-z-flip7': illustration('phones-samsung', 0, 1),
  'galaxy-a56': illustration('phones-samsung', 1, 1),
  'ipad-a16': illustration('tablets-watch', 0, 0),
  'ipad-air-11-m3': illustration('tablets-watch', 1, 0),
  'galaxy-tab-s10-fe': illustration('tablets-watch', 0, 1),
  'apple-watch-s11': illustration('tablets-watch', 1, 1),
  'apple-watch-se3': illustration('watches-earbuds', 0, 0),
  'galaxy-watch8': illustration('watches-earbuds', 1, 0),
  'airpods-pro-3': illustration('watches-earbuds', 0, 1),
  'airpods-4': illustration('watches-earbuds', 1, 1),
  'galaxy-buds3-pro': {
    src: new URL('./products/galaxy-buds3-pro-refined.png', import.meta.url).href,
    width: 1536,
    height: 1024,
    viewBox: '0 0 1536 1024',
  },
  'bt-speaker': illustration('audio-power', 1, 0),
  'bt-headphones': illustration('audio-power', 0, 1),
  'powerbank-20k': illustration('audio-power', 1, 1),
  'charger-20w': illustration('accessories', 0, 0),
  'cable-c-c': illustration('accessories', 1, 0),
  'case-clear': illustration('accessories', 0, 1),
};

export function getProductMedia(product) {
  if (product.photo) return { src: product.photo, kind: 'upload' };
  if (!product.img) return null;
  if (productPhotos[product.img]) return { src: productPhotos[product.img], kind: 'builtin' };
  const generated = productIllustrations[product.img];
  return generated ? { ...generated, kind: 'illustration' } : null;
}

export const categories = [
  { id: 'phones', ar: 'موبايلات', en: 'Phones', pictureId: 'iphone-17-pro-max' },
  { id: 'tablets', ar: 'تابلت', en: 'Tablets', pictureId: 'ipad-a16' },
  { id: 'headphones', ar: 'سماعات', en: 'Earbuds & headphones', pictureId: 'galaxy-buds3-pro' },
  { id: 'speakers', ar: 'سبيكرات', en: 'Speakers', pictureId: 'bt-speaker' },
  { id: 'watches', ar: 'ساعات ذكية', en: 'Smartwatches', pictureId: 'apple-watch-s11' },
  { id: 'accessories', ar: 'إكسسوارات', en: 'Accessories', pictureId: 'charger-20w' },
];

// Migrate the old broad category without changing IDs, uploads, prices or carts.
export function normalizeProduct(product) {
  if (product.cat !== 'audio') return product;
  return {
    ...product,
    cat: product.art === 'speaker' || product.id === 'bt-speaker' ? 'speakers' : 'headphones',
  };
}

export function normalizeRoute(parts) {
  if (parts[0] === 'shop' && parts[1] === 'audio') {
    return ['shop', 'headphones', ...parts.slice(2)];
  }
  return parts;
}
