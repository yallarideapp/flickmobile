"""Browser regressions: python -m unittest discover -s tests -v.

Requires Python Playwright and Chromium, both present in the cloud environment.
"""
import functools
import http.server
import json
from pathlib import Path
import threading
import unittest

from playwright.sync_api import sync_playwright, expect


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class StorefrontTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        root = Path(__file__).resolve().parents[1]
        cls.server = http.server.ThreadingHTTPServer(
            ('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(root)))
        cls.server.daemon_threads = True
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f'http://127.0.0.1:{cls.server.server_port}/'
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(
            executable_path='/usr/bin/chromium', args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 1000})
        # Optional typography must not make functional tests depend on Internet access.
        self.context.route('https://fonts.googleapis.com/**', lambda route: route.abort())
        self.page = self.context.new_page()
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def english(self):
        self.page.get_by_role('button', name='Switch to English', exact=True).click()
        expect(self.page.locator('html')).to_have_attribute('lang', 'en')

    def test_categories_filter_correct_products_in_both_languages(self):
        self.page.goto(self.base)
        expect(self.page.locator('.flick-category-card')).to_have_count(6)
        self.page.locator('.flick-category-card[href="#/shop/speakers"]').click()
        expect(self.page.locator('main h1')).to_have_text('سبيكرات')
        expect(self.page.locator('main article')).to_have_count(1)
        expect(self.page.locator('main article')).to_contain_text('سماعة بلوتوث محمولة')
        self.english()
        expect(self.page.locator('main h1')).to_have_text('Speakers')
        self.page.goto(self.base + '#/shop/headphones')
        expect(self.page.locator('main article')).to_have_count(4)
        expect(self.page.locator('main')).not_to_contain_text('Portable Bluetooth speaker')
        expect(self.page.locator('main h1')).to_have_text('Earbuds & headphones')
        self.page.goto(self.base + '#/shop/audio')
        expect(self.page.locator('main h1')).to_have_text('Earbuds & headphones')
        expect(self.page.locator('main article')).to_have_count(4)

    def test_hero_price_matches_the_linked_product_and_variant(self):
        self.page.goto(self.base)
        self.english()
        hero = self.page.locator('.flick-hero')
        cases = [
            ('Phones', 'iPhone 17 Pro Max', '999', '/256GB'),
            ('Tablets', 'iPad (A16)', '279', '/128GB'),
            ('Earbuds & headphones', 'AirPods Pro 3', '175', '/std'),
            ('Speakers', 'Portable Bluetooth speaker', '29', '/std'),
            ('Smartwatches', 'Apple Watch Series 11', '299', '/42mm'),
            ('Accessories', 'Power bank 20,000 mAh', '19', '/std'),
        ]
        for category, name, amount, variant in cases:
            hero.get_by_role('button', name=category, exact=True).click()
            expect(hero.locator('.flick-hero-product-name')).to_have_text(name)
            expect(hero.locator('.flick-hero-price')).to_contain_text(amount)
            self.assertTrue(hero.locator('.flick-hero-product').get_attribute('href').endswith(variant))
            expect(hero.get_by_role('button', name=category, exact=True)).to_have_attribute('aria-pressed', 'true')

    def seed_legacy_catalog(self, photo=None, img=None):
        products = []
        for product_id, art, name in [('custom-buds', 'buds', 'My earbuds'), ('custom-speaker', 'speaker', 'My speaker')]:
            products.append({
                'id': product_id, 'cat': 'audio', 'art': art, 'brand': 'My shop',
                'name': {'ar': name, 'en': name}, 'photo': photo,
                'visible': True, 'featured': True,
                'variants': [{'key': 'std', 'label': {'ar': 'واحدة', 'en': 'One size'}, 'price': 73, 'offerPrice': None, 'inStock': True}],
            })
            if img is not None:
                products[-1]['img'] = img
        content = {'rev': 2, 'products': products, 'settings': {'deliveryNote': {'ar': 'خاص', 'en': 'Custom delivery'}}}
        self.context.add_init_script(f"if(!localStorage.getItem('flick.demo.content.v1')) localStorage.setItem('flick.demo.content.v1', {json.dumps(json.dumps(content))});")
        return content

    def test_legacy_catalog_and_cart_survive_category_migration(self):
        original = self.seed_legacy_catalog()
        self.page.goto(self.base + '#/shop/speakers')
        expect(self.page.locator('main article')).to_have_count(1)
        expect(self.page.locator('main article')).to_contain_text('My speaker')
        expect(self.page.locator('main article')).to_contain_text('73')
        self.page.get_by_role('button', name='أضف للسلة', exact=True).click()
        self.page.reload()
        expect(self.page.locator('main article')).to_contain_text('My speaker')
        stored = self.page.evaluate('JSON.parse(localStorage.getItem("flick.demo.content.v1"))')
        self.assertEqual(stored, original, 'Reading a legacy catalog must not overwrite saved edits')
        cart = self.page.evaluate('JSON.parse(localStorage.getItem("flick.bag.v1"))')
        self.assertEqual(cart[0]['productId'], 'custom-speaker')
        self.assertEqual(cart[0]['qty'], 1)
        self.page.goto(self.base + '#/shop/headphones')
        expect(self.page.locator('main article')).to_have_count(1)
        expect(self.page.locator('main article')).to_contain_text('My earbuds')

    def test_missing_and_failed_photos_show_honest_fallback(self):
        self.seed_legacy_catalog(photo='/missing-product-photo.png')
        self.page.goto(self.base + '#/shop/speakers')
        media = self.page.locator('main article [data-product-media]')
        media.scroll_into_view_if_needed()
        expect(media.locator('.flick-placeholder-note')).to_have_text('الصورة غير متوفرة')
        expect(media.locator('img')).to_have_count(0)
        self.page.goto(self.base)
        expect(self.page.locator('.flick-hero .flick-placeholder-note')).to_have_text('الصورة غير متوفرة')

    def test_uploaded_photo_is_retained_with_accessible_name(self):
        png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII='
        self.seed_legacy_catalog(photo=png)
        self.page.goto(self.base + '#/shop/headphones')
        image = self.page.get_by_role('img', name='My earbuds', exact=True)
        image.scroll_into_view_if_needed()
        expect(image).to_have_attribute('src', png)
        self.page.wait_for_function('document.querySelector("main article img")?.naturalWidth === 1')
        expect(self.page.locator('main article .flick-photo-placeholder')).to_have_count(0)

    def test_generated_catalog_images_are_local_accessible_and_labelled(self):
        self.page.goto(self.base + '#/shop')
        cards = self.page.locator('main article')
        illustrations = cards.locator('svg.flick-product-illustration')
        expect(cards).to_have_count(23)
        expect(illustrations).to_have_count(23)
        expect(cards.locator('.flick-photo-placeholder')).to_have_count(0)
        for expected_label in ('صورة مولّدة', 'AI illustration'):
            labels = cards.locator('.flick-media-label')
            expect(labels).to_have_text([expected_label] * 23)
            for card in cards.all():
                name = card.locator('h3').inner_text()
                expect(card.get_by_role('img', name=name, exact=True)).to_be_visible()
                expect(card.locator('.flick-media-label')).to_be_visible()
            if expected_label == 'صورة مولّدة':
                self.english()

        # Decode the underlying sheet URLs: SVG presence alone cannot prove that
        # its raster resource loaded, or that a viewBox points inside the sheet.
        resources = self.page.evaluate('''async () => {
            const crops = [...document.querySelectorAll('main article svg.flick-product-illustration')].map(svg => {
                const image = svg.querySelector('[data-product-raster]');
                const url = new URL(image.getAttribute('href'), location.href);
                const box = svg.viewBox.baseVal;
                return {url: url.href, path: url.pathname, sameOrigin: url.origin === location.origin,
                    box: {x: box.x, y: box.y, width: box.width, height: box.height}};
            });
            const sheets = Object.fromEntries(await Promise.all([...new Set(crops.map(crop => crop.url))].map(async url => {
                const image = new Image();
                image.src = url;
                await image.decode();
                return [url, {width: image.naturalWidth, height: image.naturalHeight}];
            })));
            return {crops, sheets};
        }''')
        self.assertEqual(len(resources['crops']), 23)
        for crop in resources['crops']:
            self.assertTrue(crop['sameOrigin'])
            self.assertTrue(crop['path'].startswith('/assets/products/'))
            self.assertTrue(crop['path'].endswith('.png'))
            sheet, box = resources['sheets'][crop['url']], crop['box']
            self.assertGreaterEqual(sheet['width'], 512)
            self.assertGreaterEqual(sheet['height'], 512)
            self.assertGreater(box['width'], 0)
            self.assertGreater(box['height'], 0)
            self.assertGreaterEqual(box['x'], 0)
            self.assertGreaterEqual(box['y'], 0)
            self.assertLessEqual(box['x'] + box['width'], sheet['width'])
            self.assertLessEqual(box['y'] + box['height'], sheet['height'])

        self.page.goto(self.base + '#/p/iphone-17-pro-max')
        expect(self.page.locator('main')).to_contain_text('AI')
        expect(self.page.locator('main')).to_contain_text('illustration')
        expect(self.page.locator('main')).not_to_contain_text('Model photograph')

    def test_failed_generated_images_show_unavailable_fallback(self):
        self.context.route('**/assets/products/*.png', lambda route: route.abort())
        self.page.goto(self.base + '#/shop')
        cards = self.page.locator('main article')
        expect(cards).to_have_count(23)
        expect(cards.locator('.flick-placeholder-note')).to_have_text(['الصورة غير متوفرة'] * 23)
        expect(cards.locator('svg.flick-product-illustration')).to_have_count(0)
        expect(cards.locator('.flick-media-label')).to_have_count(0)
        self.english()
        expect(cards.locator('.flick-placeholder-note')).to_have_text(['Photo unavailable'] * 23)

    def test_failed_background_mask_shows_unavailable_fallback(self):
        self.context.route('**/assets/products/mattes/*.png', lambda route: route.abort())
        self.page.goto(self.base + '#/p/iphone-17-pro-max')
        media = self.page.locator('main [data-product-media="iphone-17-pro-max"]')
        expect(media.locator('.flick-placeholder-note')).to_have_text('الصورة غير متوفرة')
        expect(media.locator('svg.flick-product-illustration')).to_have_count(0)
        expect(media.locator('.flick-media-label')).to_have_count(0)

    def test_uploaded_photo_overrides_a_generated_builtin_image(self):
        png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII='
        original = self.seed_legacy_catalog(photo=png, img='airpods-pro-3')
        self.page.goto(self.base + '#/shop/headphones')
        image = self.page.get_by_role('img', name='My earbuds', exact=True)
        expect(image).to_have_attribute('src', png)
        self.page.wait_for_function('document.querySelector("main article img")?.naturalWidth === 1')
        expect(self.page.locator('main article svg.flick-product-illustration')).to_have_count(0)
        expect(self.page.locator('main article .flick-media-label')).to_have_count(0)
        stored = self.page.evaluate('JSON.parse(localStorage.getItem("flick.demo.content.v1"))')
        self.assertEqual(stored, original)
        self.page.goto(self.base + '#/p/custom-buds')
        expect(self.page.get_by_role('img', name='My earbuds', exact=True)).to_have_attribute('src', png)
        expect(self.page.locator('main .flick-media-label')).to_have_count(0)

    def test_mobile_layout_and_section_order(self):
        for width in (320, 390, 768, 1440):
            self.page.set_viewport_size({'width': width, 'height': 844})
            self.page.goto(self.base)
            if self.page.locator('html').get_attribute('lang') == 'en':
                self.page.get_by_role('button', name='التبديل للعربية', exact=True).click()
                expect(self.page.locator('html')).to_have_attribute('lang', 'ar')
            expect(self.page.locator('.flick-category-card')).to_have_count(6)
            self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth'), width)
            headings = self.page.locator('main h2').all_text_contents()
            self.assertLess(headings.index('شو عم تدوّر عليه؟'), headings.index('عروض هالفترة'))
            self.english()
            self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth'), width)


if __name__ == '__main__':
    unittest.main()
