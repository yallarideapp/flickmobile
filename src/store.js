var w = x("aIIwE");
let t1 = (e, t, n = null, r = !0) => ({
    key: e,
    label: { ar: e, en: e },
    price: t,
    offerPrice: n,
    inStock: r,
  }),
  t2 = (e, t, n, r, a = null) => ({
    key: e,
    label: { ar: t, en: n },
    price: r,
    offerPrice: a,
    inStock: !0,
  }),
  t4 = (e, t, n, r, a, l, o = !1) => ({
    id: e,
    cat: t,
    brand: n,
    name: "string" == typeof r ? { ar: r, en: r } : { ar: r[0], en: r[1] },
    art: a,
    variants: l,
    img: e,
    visible: !0,
    featured: o,
  }),
  t3 = [
    t4(
      "iphone-17-pro-max",
      "phones",
      "Apple",
      "iPhone 17 Pro Max",
      "phone-pro",
      [
        t1("256GB", 1049, 999),
        t1("512GB", 1199),
        t1("1TB", 1399),
        t1("2TB", 1699),
      ],
      !0,
    ),
    t4("iphone-17-pro", "phones", "Apple", "iPhone 17 Pro", "phone-pro", [
      t1("256GB", 949),
      t1("512GB", 1099),
      t1("1TB", 1299),
    ]),
    t4(
      "iphone-air",
      "phones",
      "Apple",
      "iPhone Air",
      "phone-slim",
      [t1("256GB", 849, 799), t1("512GB", 999), t1("1TB", 1149)],
      !0,
    ),
    t4("iphone-17", "phones", "Apple", "iPhone 17", "phone", [
      t1("256GB", 699),
      t1("512GB", 849),
    ]),
    t4("iphone-16", "phones", "Apple", "iPhone 16", "phone", [
      t1("128GB", 579, 549),
      t1("256GB", 659),
      t1("512GB", 799),
    ]),
    t4(
      "galaxy-s25-ultra",
      "phones",
      "Samsung",
      "Galaxy S25 Ultra",
      "phone-android",
      [t1("256GB", 899, 829), t1("512GB", 999), t1("1TB", 1199)],
      !0,
    ),
    t4("galaxy-z-flip7", "phones", "Samsung", "Galaxy Z Flip7", "flip", [
      t1("256GB", 799),
      t1("512GB", 899),
    ]),
    t4("galaxy-a56", "phones", "Samsung", "Galaxy A56 5G", "phone-android", [
      t1("128GB", 279),
      t1("256GB", 309, 289),
    ]),
    t4(
      "ipad-a16",
      "tablets",
      "Apple",
      "iPad (A16)",
      "tablet",
      [t1("128GB", 299, 279), t1("256GB", 369), t1("512GB", 509)],
      !0,
    ),
    t4("ipad-air-11-m3", "tablets", "Apple", 'iPad Air 11" (M3)', "tablet", [
      t1("128GB", 449),
      t1("256GB", 529),
      t1("512GB", 679),
      t1("1TB", 829),
    ]),
    t4(
      "galaxy-tab-s10-fe",
      "tablets",
      "Samsung",
      "Galaxy Tab S10 FE",
      "tablet",
      [t1("128GB", 329), t1("256GB", 379)],
    ),
    t4(
      "airpods-pro-3",
      "headphones",
      "Apple",
      "AirPods Pro 3",
      "buds-stem",
      [t2("std", "قطعة واحدة", "One size", 189, 175)],
      !0,
    ),
    t4("airpods-4", "headphones", "Apple", "AirPods 4", "buds-stem", [
      t2("std", "بدون إلغاء الضوضاء", "Standard", 99),
      t2("anc", "مع إلغاء الضوضاء", "Active Noise Cancellation", 139),
    ]),
    t4(
      "galaxy-buds3-pro",
      "headphones",
      "Samsung",
      "Galaxy Buds3 Pro",
      "buds",
      [t2("std", "قطعة واحدة", "One size", 159)],
    ),
    t4(
      "bt-speaker",
      "speakers",
      "",
      ["سماعة بلوتوث محمولة", "Portable Bluetooth speaker"],
      "speaker",
      [t2("std", "قطعة واحدة", "One size", 35, 29)],
    ),
    t4(
      "bt-headphones",
      "headphones",
      "",
      ["سماعة رأس لاسلكية", "Wireless over-ear headphones"],
      "headphones",
      [t2("std", "قطعة واحدة", "One size", 45)],
    ),
    t4(
      "apple-watch-s11",
      "watches",
      "Apple",
      "Apple Watch Series 11",
      "watch",
      [t1("42mm", 299), t1("46mm", 329, 309)],
      !0,
    ),
    t4("apple-watch-se3", "watches", "Apple", "Apple Watch SE 3", "watch", [
      t1("40mm", 199),
      t1("44mm", 229),
    ]),
    t4("galaxy-watch8", "watches", "Samsung", "Galaxy Watch8", "watch-round", [
      t1("40mm", 229),
      t1("44mm", 259),
    ]),
    t4(
      "powerbank-20k",
      "accessories",
      "",
      ["باور بانك 20,000 mAh", "Power bank 20,000 mAh"],
      "powerbank",
      [t2("std", "قطعة واحدة", "One size", 25, 19)],
      !0,
    ),
    t4(
      "charger-20w",
      "accessories",
      "",
      ["شاحن USB-C سريع 20W", "USB-C fast charger 20W"],
      "charger",
      [t2("std", "قطعة واحدة", "One size", 12)],
    ),
    t4(
      "cable-c-c",
      "accessories",
      "",
      ["كيبل USB-A إلى USB-C", "USB-A to USB-C cable"],
      "cable",
      [t2("1m", "1 متر", "1 m", 7), t2("2m", "2 متر", "2 m", 9)],
    ),
    t4(
      "case-clear",
      "accessories",
      "",
      ["كفر حماية شفاف", "Clear protective case"],
      "case",
      [t2("std", "قطعة واحدة", "One size", 9)],
    ),
  ],
  t5 = [
    {
      id: "tlaa-al-ali",
      name: { ar: "تلاع العلي", en: "Tla’ Al-Ali" },
      phone: "0786080010",
      maps: "https://maps.app.goo.gl/8fZmkxN4gr64Dhdd6",
      main: !0,
      whatsapp: !1,
    },
    {
      id: "abdoun",
      name: { ar: "عبدون", en: "Abdoun" },
      phone: "0792166660",
      maps: "https://maps.app.goo.gl/4LMibxurKvmDc8p7A",
      main: !1,
      whatsapp: !1,
    },
    {
      id: "north-marka",
      name: { ar: "ماركا الشمالية", en: "North Marka" },
      phone: "0790777900",
      maps: "https://maps.app.goo.gl/f65FycHm19rQcz2b8",
      main: !1,
      whatsapp: !1,
    },
    {
      id: "7th-circle",
      name: { ar: "الدوار السابع", en: "7th Circle" },
      phone: "0793333141",
      maps: "",
      main: !1,
      whatsapp: !1,
    },
  ],
  t6 = {
    on: !0,
    title: { ar: "ألف طابة وألف هدية", en: "1,000 balls, 1,000 gifts" },
    start: "2026-10-15",
    end: "2026-11-20",
    minInvoice: 30,
    drawBranch: "abdoun",
    approval: "478406-1-2026",
    prizes: [
      { ar: "iPhone 18", en: "iPhone 18" },
      { ar: "iPhone 17", en: "iPhone 17" },
      { ar: "iPad A16", en: "iPad A16" },
      { ar: "سماعات Apple", en: "Apple earphones" },
      { ar: "ساعة Apple", en: "Apple Watch" },
      { ar: "عملات ذهبية", en: "Gold coins" },
      { ar: "باور بانك", en: "Power banks" },
      { ar: "كوابل وشواحن", en: "Cables and chargers" },
      { ar: "سماعات محيطية", en: "Speakers" },
      { ar: "سماعات رأس", en: "Headphones" },
    ],
    source: "https://www.instagram.com/flickmobile_/reel/DejRGDmIPrj/",
  },
  t9 = {
    conceptNotice: !0,
    whatsapp: "0786080010",
    instagram: "https://www.instagram.com/flickmobile_/",
    instagramFollowers: {
      ar: "133 ألف متابع على انستغرام",
      en: "133K followers on Instagram",
    },
    threads: "https://www.threads.com/@flickmobile_",
    tradeInUrl: "https://flick-mobile-trade-in.replit.app/",
    deliveryNote: {
      ar: "الفرع بيتواصل معك ليأكد الطلب وموعد التوصيل ورسومه قبل ما يطلع.",
      en: "The branch calls you to confirm the order, delivery time and fee before it leaves.",
    },
  };
function t8() {
  return structuredClone({
    rev: 3,
    products: t3,
    branches: t5,
    campaign: t6,
    settings: t9,
  });
}
function t7() {
  let e = Date.now(),
    t = (t) => new Date(e - 36e5 * t).toISOString();
  return [
    {
      id: "F-1003",
      createdAt: t(1.5),
      name: "زبون تجريبي ١",
      phone: "0790000001",
      method: "pickup",
      branchId: "abdoun",
      lines: [
        {
          productId: "iphone-air",
          variantKey: "256GB",
          name: "iPhone Air",
          variant: "256GB",
          unit: 799,
          qty: 1,
        },
      ],
      total: 799,
      status: "new",
      sample: !0,
    },
    {
      id: "F-1002",
      createdAt: t(6),
      name: "زبون تجريبي ٢",
      phone: "0790000002",
      method: "delivery",
      area: "خلدا",
      address: "عنوان تجريبي",
      lines: [
        {
          productId: "powerbank-20k",
          variantKey: "std",
          name: "باور بانك 20,000 mAh",
          variant: "قطعة واحدة",
          unit: 19,
          qty: 2,
        },
        {
          productId: "cable-c-c",
          variantKey: "1m",
          name: "كيبل USB-A إلى USB-C",
          variant: "1 متر",
          unit: 7,
          qty: 1,
        },
      ],
      total: 45,
      status: "confirmed",
      sample: !0,
    },
    {
      id: "F-1001",
      createdAt: t(28),
      name: "Sample customer 3",
      phone: "0790000003",
      method: "pickup",
      branchId: "tlaa-al-ali",
      lines: [
        {
          productId: "ipad-a16",
          variantKey: "128GB",
          name: "iPad (A16)",
          variant: "128GB",
          unit: 279,
          qty: 1,
        },
      ],
      total: 279,
      status: "delivered",
      sample: !0,
    },
  ];
}
function ne() {
  let e = Date.now(),
    t = (t) => new Date(e - 36e5 * t).toISOString();
  return [
    {
      id: "M-1002",
      createdAt: t(3),
      name: "زبون تجريبي ٤",
      phone: "0790000004",
      device: "iPhone 14 Pro",
      issue: "screen",
      details: "الشاشة مكسورة من الزاوية واللمس شغّال.",
      branchId: "tlaa-al-ali",
      status: "new",
      sample: !0,
    },
    {
      id: "M-1001",
      createdAt: t(30),
      name: "Sample customer 5",
      phone: "0790000005",
      device: "Galaxy S23",
      issue: "battery",
      details: "Battery drains fast.",
      branchId: "north-marka",
      status: "repairing",
      sample: !0,
    },
  ];
}
let nt = "flick.demo.content.v1",
  nn = "flick.demo.orders.v1",
  nr = "flick.demo.counter.v1",
  na = "flick.demo.maint.v1",
  nl = "flick.demo.maint-counter.v1",
  no = "flick.bag.v1",
  ni = "flick.lang";
function ns(e) {
  try {
    let t = localStorage.getItem(e);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
function nc(e, t) {
  try {
    return (localStorage.setItem(e, JSON.stringify(t)), !0);
  } catch {
    return !1;
  }
}
function nu() {
  let e = ns(nt);
  if (!e || "object" != typeof e || !Array.isArray(e.products)) return t8();
  let t = t8(),
    n = new Map(t.products.map((e) => [e.id, e.img]));
  return {
    rev: 3,
    products: e.products.map((e) => {
      let t =
        "audio" !== e.cat
          ? e
          : {
              ...e,
              cat:
                "speaker" === e.art || "bt-speaker" === e.id
                  ? "speakers"
                  : "headphones",
            };
      return void 0 === t.img && n.has(t.id) ? { ...t, img: n.get(t.id) } : t;
    }),
    branches: Array.isArray(e.branches) ? e.branches : t.branches,
    campaign: { ...t.campaign, ...(e.campaign ?? {}) },
    settings: { ...t.settings, ...(e.settings ?? {}) },
  };
}
function nd() {
  return "en" === ns(ni) ? "en" : "ar";
}
let nf = (0, w.createContext)(null);
function np({ children: e }) {
  let [t, n] = (0, w.useState)(nd),
    [r, a] = (0, w.useState)(nu),
    [l, o] = (0, w.useState)(() => {
      let e = ns(nn);
      return Array.isArray(e) ? e : t7();
    }),
    [i, s] = (0, w.useState)(() => {
      let e = ns(no);
      return Array.isArray(e)
        ? e.filter((e) => e && "string" == typeof e.productId && e.qty > 0)
        : [];
    }),
    [c, u] = (0, w.useState)(() => {
      let e = ns(na);
      return Array.isArray(e) ? e : ne();
    }),
    [d, f] = (0, w.useState)(!1),
    p = (0, w.useRef)(t),
    m = (0, w.useCallback)((e, n) => eX(t, e, n), [t]);
  ((0, w.useEffect)(() => {
    ((document.documentElement.lang = t),
      (document.documentElement.dir = "ar" === t ? "rtl" : "ltr"),
      nc(ni, t));
  }, [t]),
    (0, w.useEffect)(() => {
      nc(no, i);
    }, [i]),
    (0, w.useEffect)(() => {
      d && D.dismiss();
    }, [d]));
  let h = (0, w.useRef)(r),
    g = (0, w.useRef)(l),
    b = (0, w.useRef)(c);
  (0, w.useEffect)(() => {
    ((p.current = t), (h.current = r), (g.current = l), (b.current = c));
  }, [t, r, l, c]);
  let v = (0, w.useCallback)((e) => {
      let t = e(b.current);
      return nc(na, t)
        ? ((b.current = t), u(t), !0)
        : (D.error(eX(p.current, "common.storageFull")), !1);
    }, []),
    x = (0, w.useCallback)(
      (e) => {
        let t = (ns(nl) ?? 1002) + 1,
          n = {
            id: `M-${t}`,
            createdAt: new Date().toISOString(),
            name: e.name.trim(),
            phone: e.phone,
            device: e.device.trim(),
            issue: e.issue,
            details: e.details?.trim() || void 0,
            branchId: e.branchId,
            status: "new",
          };
        return v((e) => [n, ...e]) ? (nc(nl, t), n) : null;
      },
      [v],
    ),
    y = (0, w.useCallback)((e) => {
      let t = e(h.current);
      return nc(nt, t)
        ? ((h.current = t), a(t), !0)
        : (D.error(eX(p.current, "common.storageFull")), !1);
    }, []),
    N = (0, w.useCallback)((e) => {
      let t = e(g.current);
      return nc(nn, t)
        ? ((g.current = t), o(t), !0)
        : (D.error(eX(p.current, "common.storageFull")), !1);
    }, []),
    S = (0, w.useCallback)((e, t) => {
      const product = h.current.products.find((p) => p.id === e && p.visible),
        variant = product?.variants.find((v) => v.key === t);
      if (!variant || !window.FlickDeviceFeatures.available(variant)) return;
      const limit = window.FlickDeviceFeatures.maxQuantity(variant);
      s((n) => {
        let r = n.findIndex((n) => n.productId === e && n.variantKey === t);
        if (-1 === r) return [...n, { productId: e, variantKey: t, qty: 1 }];
        let a = [...n];
        return ((a[r] = { ...a[r], qty: Math.min(limit, a[r].qty + 1) }), a);
      });
    }, []),
    j = (0, w.useCallback)((e, t, n) => {
      const variant = h.current.products
          .find((p) => p.id === e)
          ?.variants.find((v) => v.key === t),
        limit = variant ? window.FlickDeviceFeatures.maxQuantity(variant) : 0;
      s((r) =>
        n <= 0 || !limit
          ? r.filter((n) => n.productId !== e || n.variantKey !== t)
          : r.map((r) =>
              r.productId === e && r.variantKey === t
                ? { ...r, qty: Math.min(limit, Math.max(1, Math.floor(n))) }
                : r,
            ),
      );
    }, []),
    E = (0, w.useCallback)(() => s([]), []),
    C = (0, w.useCallback)(
      (e) => {
        let n = eG(r, i);
        if (!n.length) return null;
        let a = (ns(nr) ?? 1003) + 1,
          l = {
            id: `F-${a}`,
            createdAt: new Date().toISOString(),
            name: e.name.trim(),
            phone: e.phone,
            method: e.method,
            branchId: "pickup" === e.method ? e.branchId : void 0,
            area: "delivery" === e.method ? e.area?.trim() : void 0,
            address: "delivery" === e.method ? e.address?.trim() : void 0,
            notes: e.notes?.trim() || void 0,
            lines: n.map((e) => ({
              productId: e.product.id,
              variantKey: e.variant.key,
              name: e.product.name[t] || e.product.name.en,
              variant: window.FlickDeviceFeatures.optionLabel(e.variant, t),
              unit: e.unit,
              qty: e.qty,
            })),
            total: eD(n.reduce((e, t) => e + t.sum, 0)),
            status: "new",
          };
        return N((e) => [l, ...e]) ? (nc(nr, a), s([]), l) : null;
      },
      [i, r, t, N],
    ),
    z = (0, w.useCallback)(() => {
      try {
        (localStorage.removeItem(nt),
          localStorage.removeItem(nn),
          localStorage.removeItem(nr),
          localStorage.removeItem(na),
          localStorage.removeItem(nl));
      } catch {}
      let e = t8(),
        t = t7(),
        n = ne();
      ((h.current = e),
        (g.current = t),
        (b.current = n),
        a(e),
        o(t),
        u(n),
        s([]));
    }, []),
    T = (0, w.useCallback)((e) => n(e), []),
    P = (0, w.useMemo)(
      () => ({
        lang: t,
        setLang: T,
        t: m,
        content: r,
        updateContent: y,
        orders: l,
        updateOrders: N,
        bag: i,
        addToBag: S,
        setQty: j,
        clearBag: E,
        bagOpen: d,
        setBagOpen: f,
        placeOrder: C,
        maint: c,
        updateMaint: v,
        placeMaint: x,
        resetDemo: z,
      }),
      [t, T, m, r, y, l, N, i, S, j, E, d, C, c, v, x, z],
    );
  return (0, k.jsx)(nf.Provider, { value: P, children: e });
}
function nm() {
  let e = (0, w.useContext)(nf);
  if (!e) throw Error("useStore outside StoreProvider");
  return e;
}
function nh({ className: e }) {
  return (0, k.jsx)("img", {
    src: "data:image/webp;base64,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",
    width: 360,
    height: 278,
    alt: "FLiCK Mobile",
    className: t0("h-9 w-auto", e),
    draggable: !1,
  });
}
function ng({ value: e, className: t }) {
  let { lang: n } = nm();
  return (0, k.jsx)("span", {
    className: t0("num whitespace-nowrap", t),
    children:
      "ar" === n
        ? (0, k.jsxs)(k.Fragment, {
            children: [(0, k.jsx)("bdi", { children: eR(e) }), " ", eF(n)],
          })
        : (0, k.jsxs)(k.Fragment, {
            children: [eF(n), " ", (0, k.jsx)("bdi", { children: eR(e) })],
          }),
  });
}
function nb({ variant: e, size: t = "md", className: n, from: r }) {
  let { t: a, content: l } = nm(),
    o = eP(e);
  return (0, k.jsxs)("div", {
    className: t0("flex flex-col items-start gap-1", n),
    children: [
      (0, k.jsxs)("div", {
        className: "flex flex-wrap items-center gap-x-2 gap-y-1",
        children: [
          (0, k.jsxs)("span", {
            className: t0(
              "sticker",
              "lg" === t
                ? "text-[34px]"
                : "md" === t
                  ? "text-[22px]"
                  : "text-[18px]",
            ),
            children: [
              r &&
                (0, k.jsx)("span", {
                  className: "font-sans text-[0.5em] font-semibold",
                  children: a("hero.from"),
                }),
              (0, k.jsx)(ng, { value: eO(e) }),
            ],
          }),
          o &&
            (0, k.jsx)("s", {
              className: "text-sm text-dust decoration-sale decoration-[1.5px]",
              "aria-label": `${a("price.was")} ${e.price}`,
              children: (0, k.jsx)(ng, { value: e.price }),
            }),
        ],
      }),
      l.settings.conceptNotice &&
        (0, k.jsx)("span", {
          className: "text-[11px] leading-none text-dust",
          children: a("price.example"),
        }),
    ],
  });
}
function nv({
  product: e,
  className: t = "",
  artClass: n = "",
  eager: r = !1,
}) {
  let a,
    { lang: l, t: o } = nm(),
    i = eC(e),
    s = i?.src,
    [c, u] = (0, w.useState)(null),
    d = (0, w.useId)(),
    f = `${d}-mask`,
    p = eZ(e.name, l),
    m = o("photo.unavailable"),
    h = () => u(s ?? null);
  if (i && s && s !== c)
    if ("illustration" === i.kind) {
      let [e, t, r, l] = i.viewBox.split(" ").map(Number);
      a = (0, k.jsxs)(
        "svg",
        {
          viewBox: i.viewBox,
          role: "img",
          "aria-label": p,
          preserveAspectRatio: "xMidYMid meet",
          className: t0("flick-product-illustration", n),
          children: [
            (0, k.jsxs)("defs", {
              children: [
                (0, k.jsx)("clipPath", {
                  id: d,
                  clipPathUnits: "userSpaceOnUse",
                  children: (0, k.jsx)("rect", {
                    x: e,
                    y: t,
                    width: r,
                    height: l,
                  }),
                }),
                i.maskSrc &&
                  (0, k.jsx)("mask", {
                    id: f,
                    maskUnits: "userSpaceOnUse",
                    maskContentUnits: "userSpaceOnUse",
                    x: 0,
                    y: 0,
                    width: i.width,
                    height: i.height,
                    style: { maskType: "luminance" },
                    children: (0, k.jsx)("image", {
                      href: i.maskSrc,
                      width: i.width,
                      height: i.height,
                      preserveAspectRatio: "none",
                      "aria-hidden": !0,
                      onError: h,
                    }),
                  }),
              ],
            }),
            (0, k.jsx)("image", {
              href: s,
              width: i.width,
              height: i.height,
              clipPath: `url(#${d})`,
              mask: i.maskSrc ? `url(#${f})` : void 0,
              "data-product-raster": !0,
              "aria-hidden": !0,
              onError: h,
            }),
          ],
        },
        s + i.viewBox,
      );
    } else
      a = (0, k.jsx)(
        "img",
        {
          src: s,
          alt: p,
          className: t0("flick-product-photo", n),
          loading: r || s.startsWith("data:") ? "eager" : "lazy",
          decoding: "async",
          draggable: !1,
          onError: h,
        },
        s,
      );
  else
    a = (0, k.jsxs)("div", {
      className: "flick-photo-placeholder",
      role: "img",
      "aria-label": `${p} — ${m}`,
      children: [
        (0, k.jsx)("span", {
          className: "flick-placeholder-brand",
          children: e.brand || "FLiCK",
        }),
        (0, k.jsx)("span", {
          className: "flick-placeholder-name",
          dir: "auto",
          children: p,
        }),
        (0, k.jsx)("span", {
          className: "flick-placeholder-note",
          children: m,
        }),
      ],
    });
  return (0, k.jsx)("div", {
    className: t0("flick-product-media", t),
    "data-product-media": e.id,
    children: a,
  });
}
function nx({ id: e, title: t, action: n, children: r, className: a }) {
  return (0, k.jsxs)("section", {
    id: e,
    className: t0("mx-auto w-full max-w-6xl px-4 sm:px-6", a),
    children: [
      (0, k.jsxs)("div", {
        className: "mb-5 flex items-end justify-between gap-4",
        children: [
          (0, k.jsx)("h2", {
            className: "font-display text-[28px] leading-[1.15] sm:text-[34px]",
            children: t,
          }),
          n,
        ],
      }),
      r,
    ],
  });
}
var w = x("aIIwE");
function ny(e) {
  if (window.FlickApp?.routeParts) return window.FlickApp.routeParts(e);
  return flickParseHashRoute(e);
}
function flickParseHashRoute(e) {
  var t;
  return "shop" ===
    (t = e
      .replace(/^#\/?/, "")
      .split("?")[0]
      .split("/")
      .filter(Boolean)
      .map((e) => {
        try {
          return decodeURIComponent(e);
        } catch {
          return e;
        }
      }))[0] && "audio" === t[1]
    ? ["shop", "headphones", ...t.slice(2)]
    : t;
}
function nk(e) {
  if (window.FlickApp?.routeHref) return window.FlickApp.routeHref(e);
  return `#/${e.replace(/^\/+/, "")}`;
}
function nw(e) {
  if (window.FlickApp?.navigateLive) return window.FlickApp.navigateLive(e);
  let t = nk(e);
  location.hash === t ? window.scrollTo({ top: 0 }) : (location.hash = t);
}
let nN = {
  name: "plus",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }],
  ],
};
nN.node;
let nS = Q(nN),
  nj = {
    name: "rotate-ccw",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
          key: "1357e3",
        },
      ],
      ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
    ],
  };
nj.node;
let nE = Q(nj);
