// "Share" on a device page. The link opens that device, and its preview on
// WhatsApp, Instagram or Facebook shows the device's own picture and name.
import { deviceShareCard } from "../shared/share.js";

let flickShareIcon = Q({
  name: "share-2",
  size: 24,
  node: [
    ["circle", { cx: "18", cy: "5", r: "3", key: "a" }],
    ["circle", { cx: "6", cy: "12", r: "3", key: "b" }],
    ["circle", { cx: "18", cy: "19", r: "3", key: "c" }],
    ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "d" }],
    ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "e" }],
  ],
});

// Live site: the device's own address. Demo (GitHub Pages, # addresses): the
// small share page made at build time for each device with a picture, which link
// previews can read; other devices get their plain # address.
function flickDeviceShareUrl(product, lang) {
  let id = encodeURIComponent(product.id);
  if (window.FlickLive?.enabled) return `${location.origin}/${lang}/p/${id}`;
  let base = location.href.split("#")[0].split("?")[0].replace(/index\.html$/, "");
  if (!base.endsWith("/")) base += "/";
  if (deviceShareCard(product, lang)) return `${base}${"en" === lang ? "en/" : ""}p/${id}/`;
  return `${base}#/p/${id}`;
}

function flickCopyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {
    let area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0;inset:0 auto auto 0";
    document.body.append(area);
    area.select();
    let done = false;
    try {
      done = document.execCommand("copy");
    } catch {}
    area.remove();
    done ? resolve() : reject(new Error("copy"));
  });
}

function FlickShareDevice({ product }) {
  let { lang: n } = nm(),
    name = eZ(product.name, n),
    label = flickL(n, "مشاركة", "Share");
  let share = async () => {
    let url = flickDeviceShareUrl(product, n),
      data = {
        title: `${name} | FLiCK Mobile`,
        text: flickL(n, `شوف ${name} في FLiCK Mobile`, `Check out ${name} at FLiCK Mobile`),
        url,
      };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if ("AbortError" === error?.name) return;
      }
    }
    try {
      await flickCopyText(url);
      D.success(flickL(n, "تم نسخ رابط الجهاز. الصقه وين ما بدك.", "Device link copied. Paste it anywhere."));
    } catch {
      D.error(flickL(n, "ما قدرنا ننسخ الرابط. انسخه من شريط العنوان.", "Couldn't copy the link. Copy it from the address bar."));
    }
  };
  return (0, k.jsxs)("button", {
    type: "button",
    onClick: share,
    className: "flick-share-device",
    "aria-label": `${label}: ${name}`,
    children: [
      (0, k.jsx)(flickShareIcon, { className: "flick-share-device-icon", "aria-hidden": !0 }),
      (0, k.jsx)("span", { children: label }),
    ],
  });
}
