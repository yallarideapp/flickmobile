import { LEGAL, trademarkNotice } from "../shared/legal.js";
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const local = (value, lang) =>
  typeof value === "string"
    ? value
    : value?.[lang] || value?.en || value?.ar || "";
const headers = {
  "Content-Type": "text/html; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store",
};
const response = (body, status = 200, extra = {}) =>
  new Response(body, { status, headers: { ...headers, ...extra } });
export function unavailablePage() {
  return response(
    '<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>FLiCK Mobile</title><body style="background:#12110e;color:#f5f3ed;font:18px system-ui;padding:8vw"><h1>FLiCK Mobile</h1><p>تعذّر تحميل المتجر الآن. حاول مرة أخرى.</p><p>The store is temporarily unavailable. Please try again.</p><a style="color:#fdf402" href="">إعادة المحاولة / Retry</a></body></html>',
    503,
    { "Retry-After": "30", "X-Robots-Tag": "noindex" },
  );
}
export function renderPage(template, request, payload) {
  const url = new URL(request.url),
    content = payload.content;
  let pieces;
  try {
    pieces = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  } catch {
    return response("Invalid address", 400, { "X-Robots-Tag": "noindex" });
  }
  const lang = pieces[0] === "en" ? "en" : "ar";
  const privateRoute = pieces[0] === "admin";
  const indexed =
    content.settings.indexingEnabled === true &&
    content.settings.ordersEnabled === true;
  const origin = url.origin;
  if (url.pathname === "/robots.txt") {
    return new Response(
      indexed
        ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /ar/account\nDisallow: /en/account\nSitemap: ${origin}/sitemap.xml\n`
        : "User-agent: *\nDisallow: /\n",
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  }
  const categories = (content.categories || []).filter(
    (c) => c.visible !== false,
  );
  if (url.pathname === "/sitemap.xml") {
    const paths = indexed
      ? ["ar", "en"].flatMap((l) => [
          `/${l}/`,
          `/${l}/shop`,
          `/${l}/privacy`,
          `/${l}/terms`,
          ...categories.map((c) => `/${l}/shop/${encodeURIComponent(c.id)}`),
          ...content.products.map((p) => `/${l}/p/${encodeURIComponent(p.id)}`),
        ])
      : [];
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${escape(origin + p)}</loc></url>`).join("")}</urlset>`,
      {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  }
  // Old direct links are safe fixed local redirects. Hash links are handled by the client.
  if (pieces[0] === "shop" || pieces[0] === "p")
    return Response.redirect(origin + "/ar" + url.pathname, 308);
  if (pieces[0] === "ar" || pieces[0] === "en") pieces = pieces.slice(1);
  else if (!privateRoute && pieces.length)
    return response("Page not found", 404, { "X-Robots-Tag": "noindex" });
  const [section, item, variant] = pieces;
  const valid =
    privateRoute ||
    !section ||
    [
      "shop",
      "p",
      "offers",
      "maintenance",
      "branches",
      "trade-in",
      "privacy",
      "terms",
    ].includes(
      section,
    );
  let products = content.products,
    title = "FLiCK Mobile",
    status = 200;
  if (
    !valid ||
    (!privateRoute &&
      section !== "p" &&
      pieces.length > (section === "shop" || section === "maintenance" ? 2 : 1))
  )
    status = 404;
  if (section === "p") {
    const product = products.find(
      (p) =>
        p.id === item &&
        (!variant || p.variants.some((v) => v.key === variant)),
    );
    if (!product || pieces.length > 3) status = 404;
    products = product ? [product] : [];
    title = product
      ? `${local(product.name, lang)} | FLiCK Mobile`
      : "FLiCK Mobile";
  } else if (section === "shop" && item) {
    const category = categories.find((c) => c.id === item);
    if (!category) status = 404;
    products = products.filter((p) => p.cat === item);
    title = `${local(category?.name, lang)} | FLiCK Mobile`;
  } else if (section === "privacy" || section === "terms") {
    products = [];
    title = `${LEGAL[section].title[lang]} | FLiCK Mobile`;
  } else if (section === "offers")
    products = products.filter((p) =>
      p.variants.some((v) => v.offerPrice > 0 && v.offerPrice < v.price),
    );
  const canonical = origin + url.pathname;
  const description =
    lang === "ar"
      ? "FLiCK Mobile — الأجهزة والعروض والفروع في عمّان."
      : "FLiCK Mobile — devices, offers and branches in Amman.";
  const cards = products
    .map((p) => {
      const price = Math.min(
        ...p.variants.map((v) =>
          v.offerPrice > 0 && v.offerPrice < v.price ? v.offerPrice : v.price,
        ),
      );
      return `<article style="border:1px solid #514e40;padding:1rem;border-radius:12px"><h2><a href="/${lang}/p/${encodeURIComponent(p.id)}">${escape(local(p.name, lang))}</a></h2><p>${escape(p.brand)}</p><p>${escape(price.toFixed(3).replace(/\.?0+$/, ""))} ${lang === "ar" ? "د.أ" : "JOD"}</p>${section === "p" ? `<dl>${(p.technical?.specs || []).map((s) => `<dt>${escape(local(s.label, lang))}</dt><dd>${escape(local(s.value, lang))}</dd>`).join("")}</dl>` : ""}</article>`;
    })
    .join("");
  const notFound = lang === "ar" ? "الصفحة غير موجودة" : "Page not found";
  const legal =
    status === 200 && (section === "privacy" || section === "terms")
      ? LEGAL[section]
      : null;
  const legalHtml = legal
    ? `<article style="max-width:46rem;line-height:1.8"><p style="color:#b9b4a6">${lang === "ar" ? "آخر تحديث: " : "Last updated: "}${escape(LEGAL.updated)}</p><p>${escape(legal.intro[lang])}</p>${legal.sections
        .map(
          (sec) =>
            `<h2>${escape(sec.title[lang])}</h2>${sec.body
              .map(
                (b) =>
                  `<p>${escape(b.notice ? trademarkNotice(content.products, lang) : b[lang])}</p>`,
              )
              .join("")}`,
        )
        .join("")}</article>`
    : "";
  const legalFooter = `<footer style="margin-top:40px;font-size:13px;color:#b9b4a6"><p><a style="color:#fdf402" href="/${lang}/privacy">${escape(LEGAL.privacy.title[lang])}</a> · <a style="color:#fdf402" href="/${lang}/terms">${escape(LEGAL.terms.title[lang])}</a></p><p>${escape(trademarkNotice(content.products, lang))}</p></footer>`;
  const fallback = `<section id="flick-first-paint" style="min-height:60vh;background:#12110e;color:#f5f3ed;padding:clamp(20px,5vw,70px);font:16px system-ui"><header style="display:flex;justify-content:space-between;gap:12px"><a style="color:#fdf402;font-size:32px" href="/${lang}/">FLiCK Mobile</a><a style="color:#fdf402" href="/${lang === "ar" ? "en" : "ar"}/${pieces.map(encodeURIComponent).join("/")}">${lang === "ar" ? "English" : "العربية"}</a></header><h1>${escape(status === 404 ? notFound : privateRoute ? (lang === "ar" ? "إدارة المتجر" : "Store administration") : title)}</h1>${privateRoute || status === 404 ? "" : `<nav style="display:flex;gap:16px;flex-wrap:wrap;margin:24px 0">${categories.map((c) => `<a style="color:#fdf402" href="/${lang}/shop/${encodeURIComponent(c.id)}">${escape(local(c.name, lang))}</a>`).join("")}</nav>${legalHtml || `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:20px">${cards}</div>`}${legalFooter}`}<p id="flick-startup-status" role="status">${lang === "ar" ? "جار تحميل الأدوات التفاعلية…" : "Loading interactive controls…"}</p><button id="flick-retry" hidden onclick="location.reload()">${lang === "ar" ? "إعادة المحاولة" : "Retry"}</button><noscript><p>${lang === "ar" ? "يمكنك تصفح الكتالوج. فعّل JavaScript لاستخدام السلة والإدارة." : "Browse the catalog here. Enable JavaScript for checkout and administration."}</p></noscript></section>`;
  const safePayload = JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  const metadata = `<link rel="canonical" href="${escape(canonical)}"><meta name="description" content="${escape(description)}">`;
  const bootstrap = `<script>window.__FLICK_BOOTSTRAP__=${safePayload};window.setTimeout(function(){var b=document.getElementById('flick-retry'),s=document.getElementById('flick-startup-status');if(b)b.hidden=false;if(s)s.textContent=${JSON.stringify(lang === "ar" ? "إذا لم تكتمل الصفحة، أعد المحاولة أو تصفح الكتالوج أعلاه." : "If loading has stopped, retry or browse the catalog above.")};},10000);</script>`;
  let html = template
    .replace(
      /<html lang=(?:ar|"ar") dir=(?:rtl|"rtl")>/,
      `<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">`,
    )
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(
      /<meta\s+name=["']?robots["']?[^>]*>/,
      `<meta name="robots" content="${indexed && !privateRoute && status === 200 ? "index,follow" : "noindex,nofollow"}">`,
    )
    .replace(
      /<div id=(?:root|"root")><\/div>/,
      `<div id=root>${fallback}</div>${metadata}${bootstrap}`,
    );
  return response(
    html,
    status,
    indexed && !privateRoute && status === 200
      ? {}
      : { "X-Robots-Tag": "noindex, nofollow" },
  );
}
