// Rebuilds assets/share.jpg (1200×630), the picture shown when the site link is
// shared on WhatsApp, Instagram or Facebook. It is a screenshot of the real home
// banner without prices or buttons. Run after `npm run build`:
//   node scripts/make-share-image.mjs
import { createRequire } from "node:module";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "dist", "demo");
const output = path.join(root, "assets", "share.jpg");
const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
};

const server = http
  .createServer((request, response) => {
    let file = path.join(site, decodeURIComponent(request.url.split("?")[0]));
    if (!file.startsWith(site)) return response.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) return response.writeHead(404).end();
    response.writeHead(200, {
      "content-type": types[path.extname(file)] || "application/octet-stream",
    });
    fs.createReadStream(file).pipe(response);
  })
  .listen(0);
const { port } = server.address();

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto(`http://localhost:${port}/#/`);
  await page.waitForSelector(".flick-hero");
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const hero = document.querySelector(".flick-hero");
    const logo = document
      .querySelector("header a img, header a svg")
      ?.closest("a")
      ?.cloneNode(true);
    for (const el of document.body.querySelectorAll("header, [class*=concept]"))
      el.style.display = "none";
    document
      .querySelectorAll(
        ".flick-hero-caption, .flick-hero-navigation, .flick-hero-categories, .flick-hero-actions, .flick-hero-product, .flick-hero-ground",
      )
      .forEach((el) => (el.style.display = "none"));
    Object.assign(hero.style, {
      minHeight: "630px",
      display: "flex",
      alignItems: "center",
      position: "relative",
    });
    const inner = document.querySelector(".flick-hero-inner");
    if (inner) inner.style.width = "100%";
    if (logo) {
      logo.style.cssText =
        "position:absolute;top:44px;right:48px;transform:scale(1.6);transform-origin:top right;z-index:5";
      hero.append(logo);
    }
    hero.scrollIntoView();
  });
  await page.waitForTimeout(800);
  const box = await page.evaluate(() =>
    document.querySelector(".flick-hero").getBoundingClientRect().toJSON(),
  );
  await page.screenshot({
    path: output,
    type: "jpeg",
    quality: 86,
    clip: { x: 0, y: box.y, width: 1200, height: 630 },
  });
  console.log(`Saved ${path.relative(root, output)}`);
} finally {
  await browser.close();
  server.close();
}
