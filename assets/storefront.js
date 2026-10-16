import { categories, getProductMedia } from './catalog.js';

export function createStorefront({ React, useStore, Currency }) {
  const h = React.createElement;
  const label = (value, lang) => value?.[lang] || value?.en || value?.ar || '';
  const categoryLabel = (category, lang) => category[lang];
  const price = (variant) => Number.isFinite(variant.offerPrice) && variant.offerPrice > 0 && variant.offerPrice < variant.price ? variant.offerPrice : variant.price;
  const iconPaths = {
    phones: ['M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z', 'M10 5h4M11 19h2'],
    tablets: ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z', 'M11 18h2'],
    headphones: ['M4 14v-3a8 8 0 0 1 16 0v3', 'M4 12H3v7h4v-7H4ZM20 12h1v7h-4v-7h3Z'],
    speakers: ['M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z', 'M9 15a3 3 0 1 0 6 0 3 3 0 0 0-6 0M11 7h2'],
    watches: ['M9 2h6l1 5H8l1-5ZM8 17h8l-1 5H9l-1-5Z', 'M8 7h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2ZM12 9v3l2 1'],
    accessories: ['M8 7h8v7a4 4 0 0 1-8 0V7ZM10 3v4M14 3v4M12 18v4'],
  };

  function CategoryIcon({ category }) {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
      (iconPaths[category] || iconPaths.accessories).map((d, i) => h('path', { d, key: i })));
  }

  function ProductImage({ product, className = '', artClass = '', eager = false }) {
    const { lang } = useStore();
    const media = getProductMedia(product);
    const source = media?.src;
    const [failedSource, setFailedSource] = React.useState(null);
    const clipId = React.useId();
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
            h('defs', null, h('clipPath', { id: clipId, clipPathUnits: 'userSpaceOnUse' },
              h('rect', { x: crop[0], y: crop[1], width: crop[2], height: crop[3] }))),
            h('image', {
              href: source, width: media.width, height: media.height,
              clipPath: `url(#${clipId})`,
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
        h('div', null,
          h('p', { className: 'flick-eyebrow' }, lang === 'ar' ? 'كل اللي بدك إياه' : 'FIND YOUR NEXT DEVICE'),
          h('h2', { id: 'flick-categories-title' }, lang === 'ar' ? 'شو عم تدوّر عليه؟' : 'What are you looking for?')),
        h('a', { href: '#/shop', className: 'flick-text-link' }, lang === 'ar' ? 'شوف كل المنتجات' : 'View all products')),
      h('div', { className: 'flick-category-grid' }, categories.map(category => {
        const count = products.filter(p => p.cat === category.id).length;
        if (!count) return null;
        return h('a', { href: `#/shop/${category.id}`, className: 'flick-category-card', key: category.id },
          h('span', { className: 'flick-category-icon' }, h(CategoryIcon, { category: category.id })),
          h('div', { className: 'flick-category-copy' },
            h('h3', null, categoryLabel(category, lang)),
            h('p', null, lang === 'ar' ? category.hintAr : category.hintEn),
            h('span', { className: 'flick-category-count' }, lang === 'ar' ? `${count} ${count === 1 ? 'منتج' : 'منتجات'}` : `${count} ${count === 1 ? 'product' : 'products'}`)),
          h('svg', { className: 'flick-category-arrow', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, 'aria-hidden': true },
            h('path', { d: 'M7 17 17 7M7 7h10v10' })));
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
