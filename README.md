# FLiCK Mobile

A static, bilingual storefront demo. Serve the entire checkout (including `assets/`):

```sh
python -m http.server 8000 --bind 127.0.0.1
```

No dependency installation or application build is required. The original application is bundled in `index.html`; the revised hero, categories and product media are in `assets/storefront.js` and `assets/storefront.css`.

## Product images

All 23 demo products have new generated illustrations, designed around the named models' camera layouts, silhouettes and materials. Six original image sheets are stored under `assets/products/`. `productIllustrations` in `assets/catalog.js` maps each product ID to its own square cell; inline SVG viewports display the cells without editing the generated originals. The source PNGs are served locally and require no manufacturer network access.

These images are illustrations, not manufacturer photographs or proof of stock. Generated images carry a short bilingual label, with a fuller note on the product page. Generic accessories remain unbranded. For exact item photography, upload a store photo in the admin panel or add a verified source to `productPhotos`; both take priority over generated illustrations. Missing or failed images display the bilingual unavailable placeholder.

## Validation

The prepared cloud environment includes Python Playwright and Chromium. Run:

```sh
python -m unittest discover -s tests -v
```

The browser checks use a temporary local HTTP server. They cover categories in both languages, matching hero prices, legacy saved catalog and cart preservation, uploaded/broken photographs, and responsive layout.
