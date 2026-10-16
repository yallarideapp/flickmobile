import { categories, getProductMedia } from './catalog.js';

export function createStorefront({ React, useStore, Currency }) {
  const h = React.createElement;
  const label = (value, lang) => value?.[lang] || value?.en || value?.ar || '';
  const categoryLabel = (category, lang) => category[lang];
  const price = (variant) => Number.isFinite(variant.offerPrice) && variant.offerPrice > 0 && variant.offerPrice < variant.price ? variant.offerPrice : variant.price;
  function ProductImage({ product, className = '', artClass = '', eager = false }) {
    const { lang } = useStore();
    const media = getProductMedia(product);
    const source = media?.src;
    const [failedSource, setFailedSource] = React.useState(null);
    const clipId = React.useId();
    const maskId = `${clipId}-mask`;
    const crop = media?.viewBox?.split(' ').map(Number);
    const name = label(product.name, lang);
    return h('div', { className: `flick-product-media ${className}`, 'data-product-media': product.id },
      source && source !== failedSource
        ? media.kind === 'illustration'
          ? h(React.Fragment, null,
            h('svg', {
              key: source + media.viewBox,
              viewBox: media.viewBox,
              role: 'img', 'aria-label': name,
              preserveAspectRatio: 'xMidYMid meet',
              className: `flick-product-illustration ${artClass}`,
            },
            // Clip the cell itself: a wide SVG viewport can otherwise expose
            // neighbouring cells in its letterbox margins.
            h('defs', null,
              h('clipPath', { id: clipId, clipPathUnits: 'userSpaceOnUse' },
                h('rect', { x: crop[0], y: crop[1], width: crop[2], height: crop[3] })),
              media.maskSrc && h('mask', {
                id: maskId,
                maskUnits: 'userSpaceOnUse', maskContentUnits: 'userSpaceOnUse',
                x: 0, y: 0, width: media.width, height: media.height,
                style: { maskType: 'luminance' },
              }, h('image', {
                href: media.maskSrc, width: media.width, height: media.height,
                preserveAspectRatio: 'none', 'aria-hidden': true,
                onError: () => setFailedSource(source),
              }))),
            h('image', {
              href: source, width: media.width, height: media.height,
              clipPath: `url(#${clipId})`,
              mask: media.maskSrc ? `url(#${maskId})` : undefined,
              'data-product-raster': true,
              'aria-hidden': true,
              onError: () => setFailedSource(source),
            })),
            h('span', { className: 'flick-media-label' }, lang === 'ar' ? 'صورة مولّدة' : 'AI illustration'))
          : h('img', {
          key: source, src: source, alt: name,
          className: `flick-product-photo ${artClass}`,
          loading: eager ? 'eager' : 'lazy', decoding: 'async', draggable: false,
          onError: () => setFailedSource(source),
        })
        : h('div', { className: 'flick-photo-placeholder', role: 'img', 'aria-label': `${name} — ${lang === 'ar' ? 'الصورة غير متوفرة' : 'Photo unavailable'}` },
          h('span', { className: 'flick-placeholder-brand' }, product.brand || 'FLiCK'),
          h('span', { className: 'flick-placeholder-name', dir: 'auto' }, name),
          h('span', { className: 'flick-placeholder-note' }, lang === 'ar' ? 'الصورة غير متوفرة' : 'Photo unavailable')));
  }

  function Categories() {
    const { lang, content } = useStore();
    const products = content.products.filter(p => p.visible);
    return h('section', { className: 'flick-categories flick-section', 'aria-labelledby': 'flick-categories-title' },
      h('div', { className: 'flick-section-heading' },
        h('h2', { id: 'flick-categories-title' }, lang === 'ar' ? 'شو عم تدوّر عليه؟' : 'What are you looking for?'),
        h('a', { href: '#/shop', className: 'flick-text-link' }, lang === 'ar' ? 'شوف كل المنتجات' : 'View all products')),
      h('div', { className: 'flick-category-grid' }, categories.map(category => {
        if (!products.some(p => p.cat === category.id)) return null;
        return h('a', { href: `#/shop/${category.id}`, className: 'flick-category-card', key: category.id },
          h('span', { className: 'flick-category-name' }, categoryLabel(category, lang)),
          h('svg', { className: 'flick-category-arrow', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, 'aria-hidden': true },
            h('path', { d: 'M5 12h14m-5-5 5 5-5 5' })));
      })));
  }

  function Hero() {
    const { lang, t, content } = useStore();
    const products = content.products.filter(p => p.visible);
    const available = categories.filter(c => products.some(p => p.cat === c.id));
    const [selected, select] = React.useState('phones');
    const category = available.find(c => c.id === selected) || available[0];
    const candidates = products.filter(p => p.cat === category?.id);
    const product = candidates.find(p => p.featured) || candidates[0];
    const variants = product?.variants.filter(v => v.inStock) || [];
    const variant = [...variants].sort((a, b) => price(a) - price(b))[0];
    const detailHref = product ? `#/p/${encodeURIComponent(product.id)}${variant ? '/' + encodeURIComponent(variant.key) : ''}` : '#/shop';
    return h('section', { className: 'flick-hero', 'aria-labelledby': 'flick-hero-title' },
      h('div', { className: 'flick-hero-inner flick-section' },
        h('div', { className: 'flick-hero-copy' },
          h('p', { className: 'flick-eyebrow' }, 'FLiCK MOBILE · AMMAN'),
          h('h1', { id: 'flick-hero-title' }, h('span', null, t('hero.l1')), h('span', null, t('hero.l2'))),
          h('p', { className: 'flick-hero-description' }, lang === 'ar' ? 'موبايل جديد، سماعة، أو إكسسوار لجهازك. اختار اللي بناسبك وشوف عروضنا.' : 'Your next phone, a pair of earbuds, or the essentials for your device. Find your pick and explore our offers.'),
          h('div', { className: 'flick-hero-actions' },
            h('a', { href: `#/shop/${category?.id || ''}`, className: 'flick-button flick-button-dark' }, lang === 'ar' ? 'تسوّق الأجهزة' : 'Shop devices'),
            h('a', { href: '#/offers', className: 'flick-button flick-button-outline' }, t('nav.offers'))),
          h('p', { className: 'flick-hero-branches' }, lang === 'ar' ? `${content.branches.length} فروع في عمّان · أهلاً فيك بأقرب فرع` : `${content.branches.length} branches in Amman · Visit your nearest branch`)),
        h('div', { className: 'flick-hero-showcase' },
          product && h('a', { href: detailHref, className: 'flick-hero-product', 'aria-label': `${t('card.view')}: ${label(product.name, lang)}` },
            h(ProductImage, { product, eager: true, className: 'flick-hero-image' }),
            h('div', { className: 'flick-hero-caption', 'aria-live': 'polite' },
              h('div', null, h('p', { className: 'flick-hero-product-name', dir: 'auto' }, label(product.name, lang)),
                variant && h('p', { className: 'flick-hero-variant', dir: 'auto' }, label(variant.label, lang))),
              variant && h('div', { className: 'flick-hero-price' },
                h(Currency, { value: price(variant) }),
                content.settings.conceptNotice && h('small', null, t('price.example'))))),
          h('div', { className: 'flick-hero-categories', role: 'group', 'aria-label': t('shop.tabs') },
            available.map(c => h('button', { key: c.id, type: 'button', 'aria-pressed': category?.id === c.id, onClick: () => select(c.id) }, categoryLabel(c, lang)))))));
  }

  return { ProductImage, Categories, Hero };
}
