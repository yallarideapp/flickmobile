// Draws a device's link-preview picture (1200×630 JPEG) in the browser: the
// device photo, its name, the FLiCK badge and "available now at FLiCK Mobile".
// Used by scripts/make-device-cards.mjs for the catalog devices and by the live
// admin for devices added or changed there (see uploadImages in live-adapter.js).
const FLICK_CARD_WORDS = {
  ar: { line: "متوفر الآن في FLiCK Mobile", place: "عمّان · الأردن" },
  en: { line: "Available now at FLiCK Mobile", place: "Amman · Jordan" },
};
const FLICK_CARD_KINDS = {
  phones: { ar: "موبايل", en: "Phone" },
  tablets: { ar: "تابلت", en: "Tablet" },
  headphones: { ar: "سماعات", en: "Audio" },
  speakers: { ar: "سبيكر", en: "Speaker" },
  watches: { ar: "ساعة ذكية", en: "Smartwatch" },
  accessories: { ar: "إكسسوار", en: "Accessory" },
};
// The badge picture is kept once, inside the logo component (nh).
const FLICK_CARD_LOGO = (/data:image\/webp;base64,[A-Za-z0-9+/=]+/.exec(String(nh)) || [""])[0];

function flickCardImage(src) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    if (!/^(?:data|blob):/.test(src)) image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image"));
    image.src = src;
  });
}

// The device photo as a canvas, cut out and trimmed to the device itself.
async function flickCardPhoto(product) {
  let info = eC(product);
  if (!info?.src) return null;
  let image = await flickCardImage(info.src),
    canvas = document.createElement("canvas"),
    context = canvas.getContext("2d", { willReadFrequently: true });
  if ("illustration" === info.kind) {
    let [x, y, w, h] = info.viewBox.split(" ").map(Number),
      sx = image.naturalWidth / info.width,
      sy = image.naturalHeight / info.height;
    canvas.width = Math.round(w * sx);
    canvas.height = Math.round(h * sy);
    context.drawImage(image, x * sx, y * sy, w * sx, h * sy, 0, 0, canvas.width, canvas.height);
    if (info.maskSrc) {
      let mask = await flickCardImage(info.maskSrc),
        mx = mask.naturalWidth / info.width,
        my = mask.naturalHeight / info.height,
        layer = document.createElement("canvas");
      layer.width = canvas.width;
      layer.height = canvas.height;
      let maskContext = layer.getContext("2d", { willReadFrequently: true });
      maskContext.drawImage(mask, x * mx, y * my, w * mx, h * my, 0, 0, layer.width, layer.height);
      let pixels = context.getImageData(0, 0, canvas.width, canvas.height),
        cut = maskContext.getImageData(0, 0, layer.width, layer.height).data;
      for (let i = 0; i < pixels.data.length; i += 4) {
        let light = (0.2126 * cut[i] + 0.7152 * cut[i + 1] + 0.0722 * cut[i + 2]) * (cut[i + 3] / 255);
        pixels.data[i + 3] = Math.round((pixels.data[i + 3] * light) / 255);
      }
      context.putImageData(pixels, 0, 0);
    }
  } else {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    context.drawImage(image, 0, 0);
  }
  // Trim empty edges, so every device fills its space the same way.
  let data = context.getImageData(0, 0, canvas.width, canvas.height).data,
    top = canvas.height,
    left = canvas.width,
    right = -1,
    bottom = -1;
  for (let y = 0; y < canvas.height; y++)
    for (let x = 0; x < canvas.width; x++)
      if (data[(y * canvas.width + x) * 4 + 3] > 12) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
  if (right < 0) return canvas;
  let trimmed = document.createElement("canvas");
  trimmed.width = right - left + 1;
  trimmed.height = bottom - top + 1;
  trimmed.getContext("2d").drawImage(canvas, left, top, trimmed.width, trimmed.height, 0, 0, trimmed.width, trimmed.height);
  return trimmed;
}

function flickCardLines(context, text, width) {
  let words = String(text).split(/\s+/).filter(Boolean),
    lines = [],
    line = "";
  for (let word of words) {
    let next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > width) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

// Same number of lines, but as even as possible (no lone "11" or "FE" below).
function flickCardBalanced(context, text, width) {
  let lines = flickCardLines(context, text, width);
  if (lines.length < 2) return lines;
  let low = 0,
    high = width;
  for (let step = 0; step < 14; step++) {
    let middle = (low + high) / 2;
    if (flickCardLines(context, text, middle).length > lines.length) low = middle;
    else high = middle;
  }
  return flickCardLines(context, text, high);
}

async function flickRenderShareCard(product, lang) {
  let W = 1200,
    H = 630,
    rtl = "ar" === lang,
    name = eZ(product.name, lang) || product.id,
    words = FLICK_CARD_WORDS[lang],
    kind = [product.brand, FLICK_CARD_KINDS[product.cat]?.[lang]].filter(Boolean).join(" · "),
    canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  let c = canvas.getContext("2d");
  try {
    await Promise.all([
      document.fonts.load('86px "Lalezar"', name),
      document.fonts.load('700 27px "IBM Plex Sans Arabic"', words.line + kind),
      document.fonts.load('600 22px "IBM Plex Sans Arabic"', words.place),
    ]);
  } catch {}
  let glow = c.createRadialGradient(rtl ? 312 : 888, 328, 0, rtl ? 312 : 888, 328, 760);
  glow.addColorStop(0, "#fffb8a");
  glow.addColorStop(0.46, "#fdf402");
  glow.addColorStop(1, "#f2e800");
  c.fillStyle = glow;
  c.fillRect(0, 0, W, H);

  // Device side.
  let stageX = rtl ? 300 : 900,
    photo = null;
  try {
    photo = await flickCardPhoto(product);
  } catch {}
  if (photo) {
    let scale = Math.min(470 / photo.width, 430 / photo.height),
      dw = photo.width * scale,
      dh = photo.height * scale,
      dx = stageX - dw / 2,
      dy = 306 - dh / 2,
      floor = dy + dh + 26;
    let shade = c.createRadialGradient(stageX, floor, 0, stageX, floor, 160);
    shade.addColorStop(0, "rgba(21,20,15,0.30)");
    shade.addColorStop(1, "rgba(21,20,15,0)");
    c.save();
    c.translate(stageX, floor);
    c.scale(1, 0.12);
    c.fillStyle = shade;
    c.beginPath();
    c.arc(0, 0, 160, 0, Math.PI * 2);
    c.fill();
    c.restore();
    c.save();
    c.shadowColor = "rgba(21,20,15,0.28)";
    c.shadowBlur = 30;
    c.shadowOffsetY = 20;
    c.drawImage(photo, dx, dy, dw, dh);
    c.restore();
  }

  // Text side.
  let edge = rtl ? W - 72 : 72,
    width = 504,
    sans = '"IBM Plex Sans Arabic", system-ui, sans-serif';
  c.textAlign = rtl ? "right" : "left";
  c.direction = rtl ? "rtl" : "ltr";
  c.textBaseline = "alphabetic";
  let size = name.length > 18 ? 62 : name.length > 12 ? 74 : 86;
  c.font = `${size}px Lalezar, ${sans}`;
  let title = name.replace(/-/g, "‑"),
    lines = flickCardBalanced(c, title, width);
  while (lines.length > 3 && size > 44) {
    size -= 6;
    c.font = `${size}px Lalezar, ${sans}`;
    lines = flickCardBalanced(c, title, width);
  }
  let logo = null;
  try {
    logo = await flickCardImage(FLICK_CARD_LOGO);
  } catch {}
  let logoH = 118,
    lineH = size * 1.04,
    blockH = logoH + 34 + 30 + 6 + lines.length * lineH + 22 + 32 + 8 + 26,
    y = Math.round((H - blockH) / 2);
  if (logo) {
    let logoW = (logo.naturalWidth / logo.naturalHeight) * logoH;
    c.save();
    c.shadowColor = "rgba(21,20,15,0.2)";
    c.shadowBlur = 14;
    c.shadowOffsetY = 6;
    c.drawImage(logo, rtl ? edge - logoW : edge, y, logoW, logoH);
    c.restore();
  }
  y += logoH + 34 + 24;
  c.fillStyle = "rgba(18,17,14,0.62)";
  c.font = `700 24px ${sans}`;
  if (kind) c.fillText(rtl ? kind : kind.toUpperCase(), edge, y);
  y += 6;
  c.fillStyle = "#12110e";
  c.font = `${size}px Lalezar, ${sans}`;
  for (let line of lines) {
    y += lineH;
    // Each line keeps its own reading direction (an English name in Arabic, say).
    c.direction = /^[^؀-ۿ]*[A-Za-z0-9]/.test(line) ? "ltr" : "rtl";
    c.textAlign = rtl ? "right" : "left";
    c.fillText(line, edge, y - size * 0.18);
  }
  c.direction = rtl ? "rtl" : "ltr";
  y += 22 + 27;
  c.font = `700 27px ${sans}`;
  c.fillText(words.line, edge, y);
  y += 8 + 26;
  c.fillStyle = "rgba(18,17,14,0.6)";
  c.font = `600 22px ${sans}`;
  c.fillText(words.place, edge, y);
  return canvas.toDataURL("image/jpeg", 0.84);
}

window.FlickShareCard = { render: flickRenderShareCard };
