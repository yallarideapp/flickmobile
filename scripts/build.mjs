import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import { build } from "esbuild";
import { deviceShareCard } from "../shared/share.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "src");
const order = JSON.parse(
  await readFile(path.join(source, "order.json"), "utf8"),
);
const shell = await readFile(path.join(source, "shell.html"), "utf8");
const styles = await readFile(path.join(source, "styles.css"), "utf8");
const liveStyles = await readFile(path.join(source, "live.css"), "utf8");
const bootstrap = await readFile(path.join(source, "bootstrap.js"), "utf8");
for (const mode of ["demo", "live"]) {
  const destination = path.join(root, "dist", mode);
  await rm(destination, { recursive: true, force: true });
  await mkdir(path.join(destination, "assets"), { recursive: true });
  const pieces = [];
  for (const file of order) {
    if (file === "live-adapter.js" && mode !== "live") continue;
    pieces.push(await readFile(path.join(source, file), "utf8"));
  }
  const bundled = await build({
    stdin: {
      contents: pieces.join("\n;\n"),
      resolveDir: source,
      sourcefile: "flick-app.js",
    },
    bundle: true,
    write: false,
    minify: true,
    legalComments: "eof",
    format: "esm",
    target: "es2022",
  });
  const appContent = bundled.outputFiles[0].text;
  const appHash = createHash("sha256").update(appContent).digest("hex").slice(0, 12);
  const appName = `app.${appHash}.js`;
  await writeFile(path.join(destination, "assets", appName), appContent);
  await cp(path.join(root, "assets"), path.join(destination, "assets"), {
    recursive: true,
    filter: (file) => !path.basename(file).startsWith("."),
  });
  const modeScript = mode === "live" ? "window.FlickLive={enabled:true};" : "";
  let html = shell
    .replace("{{STYLES}}", styles + (mode === "live" ? liveStyles : ""))
    .replace("{{BOOTSTRAP}}", modeScript + bootstrap)
    // Absolute address for link previews. The Worker rewrites it per page on the live site.
    .replaceAll(
      "{{SITE_URL}}",
      mode === "demo"
        ? process.env.FLICK_DEMO_URL || "https://yallarideapp.github.io/flickmobile/"
        : "/",
    )
    .replace(
      /<script type="module">\s*\{\{APP\}\}\s*<\/script>/,
      `<script type="module" src="/assets/${appName}"></script>`,
    );
  if (mode === "demo")
    html = html.replace(`src="/assets/${appName}"`, `src="assets/${appName}"`);
  else
    html = html
      .replace(/(href|src)="assets\//g, '$1="/assets/')
      .replace("</head>", '<base href="/">\n</head>');
  if (/\{\{(?:APP|STYLES|BOOTSTRAP|SITE_URL)\}\}|\bAPP;|\bBOOTSTRAP;/.test(html))
    throw new Error("Unresolved application template");
  html = html.replace(
    "</body>",
    '<noscript><p style="padding:2rem;text-align:center">فعّل JavaScript لاستخدام السلة والإدارة. Enable JavaScript to use checkout and administration.</p></noscript></body>',
  );
  await writeFile(path.join(destination, "index.html"), html);
  if (mode === "demo") await writeDeviceSharePages(destination);
  await writeFile(
    path.join(destination, "robots.txt"),
    "User-agent: *\nDisallow: /\n",
  );
  const publicFiles = ["index.html", "robots.txt", "assets/**", ...(mode === "demo" ? ["p/**", "en/**"] : [])];
  await writeFile(
    path.join(destination, "publication-manifest.json"),
    JSON.stringify(
      {
        mode,
        files: publicFiles,
        excludes: [
          "server/",
          "shared/",
          "migrations/",
          "tests/",
          ".env",
          ".dev.vars",
          "node_modules/",
        ],
        note:
          mode === "demo"
            ? "Portable local demo; sample admin and checkout are browser-only."
            : "Serve through the Worker; never publish this live adapter as a standalone Pages demo.",
      },
      null,
      2,
    ),
  );
  console.log(`Built dist/${mode}`);
}

// GitHub Pages serves the demo with # addresses, which link previews never read.
// So every device with its own picture gets a small page at p/<id>/ (Arabic) and
// en/p/<id>/ (English): WhatsApp and Facebook read its preview tags, and a person
// is sent straight on to the device in the store.
async function writeDeviceSharePages(destination) {
  const site = process.env.FLICK_DEMO_URL || "https://yallarideapp.github.io/flickmobile/";
  const seed = JSON.parse(await readFile(path.join(root, "server", "seed.json"), "utf8"));
  const products = (seed.products || seed.content.products).filter((p) => p.visible !== false);
  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  for (const lang of ["ar", "en"]) {
    for (const product of products) {
      const card = deviceShareCard(product, lang);
      if (!card) continue;
      const name = product.name?.[lang] || product.name?.en || product.id;
      const folder = (lang === "en" ? "en/" : "") + `p/${encodeURIComponent(product.id)}/`;
      const back = lang === "en" ? "../../../" : "../../";
      const target = `${back}#/p/${encodeURIComponent(product.id)}`;
      const title = `${name} | FLiCK Mobile`;
      const description =
        lang === "ar"
          ? `${name} متوفر الآن في FLiCK Mobile، عمّان. شوف الخيارات والأسعار واطلب أونلاين.`
          : `${name} is available now at FLiCK Mobile, Amman. See the options and prices and order online.`;
      const page = `<!doctype html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="FLiCK Mobile">
<meta property="og:locale" content="${lang === "ar" ? "ar_JO" : "en_US"}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(site + folder)}">
<meta property="og:image" content="${esc(site + card)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(name)} — FLiCK Mobile">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0;url=${esc(target)}">
<script>try{localStorage.setItem("flick.lang",${JSON.stringify(JSON.stringify(lang))})}catch(e){}location.replace(${JSON.stringify(target)})</script>
</head>
<body style="background:#12110e;color:#f5f3ed;font:18px system-ui;padding:8vw">
<p><a style="color:#fdf402" href="${esc(target)}">${esc(name)} — FLiCK Mobile</a></p>
</body>
</html>
`;
      await mkdir(path.join(destination, folder), { recursive: true });
      await writeFile(path.join(destination, folder, "index.html"), page);
    }
  }
}
