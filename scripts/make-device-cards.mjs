// Builds one link-preview picture per device and language (1200×630), shown when
// a device page is shared on WhatsApp, Instagram or Facebook. The device photo is
// taken from the real device page of the built demo. Run after `npm run build`:
//   node scripts/make-device-cards.mjs            (every device in server/seed.json)
//   node scripts/make-device-cards.mjs iphone-17   (only the devices named)
// It writes assets/share/devices/<id>-<lang>.jpg and shared/share-cards.js, the
// list the build and the Worker use to point each device page at its picture.
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "dist", "demo");
const outDir = path.join(root, "assets", "share", "devices");
const listFile = path.join(root, "shared", "share-cards.js");
const seed = JSON.parse(fs.readFileSync(path.join(root, "server", "seed.json"), "utf8"));
const products = (seed.products || seed.content.products).filter((p) => p.visible !== false);
const only = process.argv.slice(2);
const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
};
const words = {
  ar: { line: "متوفر الآن في FLiCK Mobile", place: "عمّان · الأردن" },
  en: { line: "Available now at FLiCK Mobile", place: "Amman · Jordan" },
};
const categories = {
  phones: { ar: "موبايل", en: "Phone" },
  tablets: { ar: "تابلت", en: "Tablet" },
  headphones: { ar: "سماعات", en: "Audio" },
  speakers: { ar: "سبيكر", en: "Speaker" },
  watches: { ar: "ساعة ذكية", en: "Smartwatch" },
  accessories: { ar: "إكسسوار", en: "Accessory" },
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

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const made = [];
try {
  for (const lang of ["ar", "en"]) {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    await page.addInitScript((l) => {
      localStorage.setItem("flick.lang", JSON.stringify(l));
      sessionStorage.setItem("flick.splash", "1");
    }, lang);
    for (const product of products) {
      if (only.length && !only.includes(product.id)) continue;
      await page.goto(`http://localhost:${port}/#/p/${encodeURIComponent(product.id)}`);
      const media = page.locator(".flick-product-media").first();
      try {
        await media.waitFor({ timeout: 8000 });
      } catch {
        console.warn(`skip ${product.id}: no device page`);
        continue;
      }
      await page.waitForTimeout(500);
      await page.evaluate(
        ({ product, lang, words, category }) => {
          document.getElementById("flick-share-card")?.remove();
          const name = product.name[lang] || product.name.en;
          const logo = document.querySelector("header a img")?.cloneNode(true);
          const photo = document.querySelector(".flick-product-media").cloneNode(true);
          photo.removeAttribute("class");
          photo.className = "photo";
          const card = document.createElement("div");
          card.id = "flick-share-card";
          card.dir = lang === "ar" ? "rtl" : "ltr";
          card.innerHTML = `
<style>
#flick-share-card{position:fixed;inset:0;width:1200px;height:630px;z-index:2147483647;overflow:hidden;
  background:radial-gradient(circle at ${lang === "ar" ? "26%" : "74%"} 52%,#fffb8a 0,#fdf402 46%,#f2e800 100%);
  color:#12110e;font-family:"IBM Plex Sans Arabic",system-ui,sans-serif;display:grid;
  grid-template-columns:600px 600px;align-items:center}
#flick-share-card .text{padding-inline:72px 24px;display:flex;flex-direction:column;align-items:flex-start;gap:0}
#flick-share-card .logo img{display:block;height:118px;width:auto;filter:drop-shadow(0 6px 14px rgba(21,20,15,.2))}
#flick-share-card .kind{margin-top:34px;font-size:24px;font-weight:700;letter-spacing:${lang === "ar" ? "0" : ".04em"};
  text-transform:uppercase;opacity:.62}
#flick-share-card h1{margin:6px 0 0;font-family:Lalezar,"IBM Plex Sans Arabic",system-ui,sans-serif;font-weight:400;
  line-height:1.02;font-size:var(--size);unicode-bidi:plaintext;text-align:${lang === "ar" ? "right" : "left"};width:100%}
#flick-share-card .line{margin-top:22px;font-size:27px;font-weight:700}
#flick-share-card .place{margin-top:8px;font-size:22px;font-weight:600;opacity:.6}
#flick-share-card .stage{position:relative;height:630px;display:grid;place-items:center}
#flick-share-card .stage::after{content:"";position:absolute;left:50%;bottom:58px;width:300px;height:30px;
  transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(21,20,15,.32),transparent)}
#flick-share-card .photo{position:relative;z-index:1;width:520px;height:520px;background:none!important;
  border:0!important;box-shadow:none!important;display:grid;place-items:center}
#flick-share-card .photo > *{width:100%!important;height:100%!important;padding:0!important;background:none!important}
#flick-share-card .photo img,#flick-share-card .photo svg{object-fit:contain;filter:drop-shadow(0 22px 26px rgba(21,20,15,.28))}
</style>
<div class="text">
  <div class="logo"></div>
  <div class="kind"></div>
  <h1></h1>
  <div class="line"></div>
  <div class="place"></div>
</div>
<div class="stage"></div>`;
          if (logo) card.querySelector(".logo").append(logo);
          card.querySelector(".kind").textContent = [product.brand, category].filter(Boolean).join(" · ");
          const title = card.querySelector("h1");
          // Keep "USB-C" and the like together when the name wraps.
          title.textContent = name.replace(/-/g, "\u2011");
          title.style.setProperty("--size", name.length > 18 ? "62px" : name.length > 12 ? "74px" : "86px");
          card.querySelector(".line").textContent = words.line;
          card.querySelector(".place").textContent = words.place;
          card.querySelector(".stage").append(photo);
          document.body.append(card);
        },
        {
          product,
          lang,
          words: words[lang],
          category: categories[product.cat]?.[lang] || "",
        },
      );
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      const file = path.join(outDir, `${product.id}-${lang}.jpg`);
      await page.screenshot({ path: file, type: "jpeg", quality: 84 });
      made.push(product.id);
      console.log(`Saved ${path.relative(root, file)}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

// The list of pictures, with a short content hash so a new picture gets a new
// address (WhatsApp and Facebook keep old previews per address).
const cards = {};
for (const file of fs.readdirSync(outDir).sort()) {
  const match = /^(.+)-(ar|en)\.jpg$/.exec(file);
  if (!match) continue;
  const hash = createHash("sha256")
    .update(fs.readFileSync(path.join(outDir, file)))
    .digest("hex")
    .slice(0, 8);
  const product = products.find((p) => p.id === match[1]);
  if (!product) continue;
  // Name and picture the card was made from: a device renamed or given a new
  // photo in the admin no longer uses this card.
  cards[match[1]] ||= { name: product.name, img: product.img || "" };
  cards[match[1]][match[2]] = hash;
}
fs.writeFileSync(
  listFile,
  `// Generated by scripts/make-device-cards.mjs. Device id → its name and picture, and the picture hash per language.\n// The pictures are assets/share/devices/<id>-<lang>.jpg.\nexport const SHARE_CARDS = ${JSON.stringify(cards, null, 2)};\n`,
);
console.log(`${made.length} pictures; list in ${path.relative(root, listFile)}`);
