// Admin tools brought over from the Trio panel: store categories, website texts,
// Excel (CSV) export of orders and repairs, and a quick stock toggle.
// Categories and texts are saved inside the catalog content and applied on render.

const flickL = (lang, ar, en) => ("ar" === lang ? ar : en);

// ---------------------------------------------------------------- categories
const flickDefaultCategories = ez.map((c) => ({
  id: c.id,
  name: { ar: c.ar, en: c.en },
  pictureId: c.pictureId || "",
}));

// ---------------------------------------------------------------- texts
// Storefront wording only. Admin, category and status labels are excluded.
const FLICK_TEXT_EXCLUDED = /^(admin|common|ov|status|orders|pr|cp|br|st|mt|cat|lang)\./;
const flickTextDefaults = Object.fromEntries(
  Object.entries(eJ)
    .filter(
      ([key, value]) =>
        !FLICK_TEXT_EXCLUDED.test(key) &&
        value &&
        "string" == typeof value.ar &&
        "string" == typeof value.en,
    )
    .map(([key, value]) => [key, { ar: value.ar, en: value.en }]),
);
const FLICK_TEXT_AREAS = [
  { id: "home", ar: "الصفحة الرئيسية", en: "Home page", prefixes: ["hero", "cats", "featured", "offers", "insta", "campaign", "concept"] },
  { id: "menu", ar: "القائمة وأسفل الصفحة", en: "Menu and footer", prefixes: ["nav", "footer"] },
  { id: "shop", ar: "المتجر وصفحة الجهاز", en: "Shop and device page", prefixes: ["shop", "sort", "card", "product", "device", "price", "offer", "save", "photo"] },
  { id: "order", ar: "السلة والطلب", en: "Bag and checkout", prefixes: ["bag", "checkout", "done"] },
  { id: "repairs", ar: "الصيانة", en: "Repairs", prefixes: ["maint", "mstatus"] },
  { id: "other", ar: "التقييم والفروع", en: "Trade-in and branches", prefixes: ["tradein", "branches"] },
];
const flickTextArea = (key) =>
  FLICK_TEXT_AREAS.find((area) => area.prefixes.includes(key.split(".")[0]))?.id ?? "other";
const flickPlaceholders = (text) => (String(text).match(/\{[a-zA-Z]+\}/g) || []).sort().join(",");

function flickApplyTexts(texts) {
  const custom = texts && "object" == typeof texts ? texts : {};
  for (const [key, base] of Object.entries(flickTextDefaults)) {
    const own = custom[key] || {};
    eJ[key] = {
      ar: ("string" == typeof own.ar && own.ar.trim()) || base.ar,
      en: ("string" == typeof own.en && own.en.trim()) || base.en,
    };
  }
}

// Applied during render so the very first paint already uses saved wording.
const flickApplied = { categories: void 0, texts: void 0 };
function flickApplyContent(content) {
  if (!content) return;
  if (content.categories !== flickApplied.categories) {
    flickApplied.categories = content.categories;
    flickSetCategories(
      Array.isArray(content.categories) && content.categories.length
        ? content.categories
        : flickDefaultCategories,
    );
  }
  if (content.texts !== flickApplied.texts) {
    flickApplied.texts = content.texts;
    flickApplyTexts(content.texts);
  }
}

// ---------------------------------------------------------------- export
function flickCsvCell(value) {
  let text = String(value ?? "").replace(/\r?\n/g, " ");
  if (/^[=+\-@\t]/.test(text)) text = "'" + text; // never let Excel run a formula
  return /[",;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
// "0790000001" → "079 000 0001": the spaces make Excel keep it as text with the zero.
function flickCsvPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  const local = digits.startsWith("962") ? digits.slice(3) : digits.replace(/^0/, "");
  return /^7\d{8}$/.test(local)
    ? `0${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`
    : String(phone || "");
}
function flickCsvDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString("en-GB", { timeZone: "Asia/Amman", hour12: !1 });
}
function flickDownloadCsv(name, rows) {
  const text = "﻿" + rows.map((row) => row.map(flickCsvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}

function FlickExportButton({ kind: e }) {
  let { lang: t, orders: n, maint: r, content: a } = nm(),
    list = "maint" === e ? r : n,
    branch = (id) => eZ(a.branches.find((b) => b.id === id)?.name, t) || id || "",
    tr = (key, fallback) => (eJ[key] ? eX(t, key) : fallback ?? "");
  return (0, k.jsx)(lm, {
    kind: "plain",
    className: "flick-export",
    disabled: !list.length,
    title: flickL(t, "يحفظ الطلبات الظاهرة بملف يفتح على Excel", "Saves the loaded records as a file that opens in Excel"),
    onClick: () => {
      const day = new Date().toISOString().slice(0, 10);
      if ("maint" === e)
        return flickDownloadCsv(`flick-repairs-${day}.csv`, [
          t === "ar"
            ? ["رقم الطلب", "التاريخ", "الاسم", "الهاتف", "الجهاز", "المشكلة", "التفاصيل", "الفرع", "الحالة"]
            : ["Request", "Date", "Name", "Phone", "Device", "Issue", "Details", "Branch", "Status"],
          ...list.map((m) => [
            m.id,
            flickCsvDate(m.createdAt),
            m.name,
            flickCsvPhone(m.phone),
            m.device,
            tr(`maint.issue.${m.issue}`, m.issue),
            m.details,
            branch(m.branchId),
            tr(`mstatus.${m.status}`, m.status),
          ]),
        ]);
      flickDownloadCsv(`flick-orders-${day}.csv`, [
        t === "ar"
          ? ["رقم الطلب", "التاريخ", "الاسم", "الهاتف", "الاستلام", "الفرع أو المنطقة", "العنوان", "القطع", "المجموع (د.أ)", "الحالة", "ملاحظات الزبون", "ملاحظة خاصة"]
          : ["Order", "Date", "Name", "Phone", "Method", "Branch or area", "Address", "Items", "Total (JOD)", "Status", "Customer notes", "Private note"],
        ...list.map((o) => [
          o.id,
          flickCsvDate(o.createdAt),
          o.name,
          flickCsvPhone(o.phone),
          "pickup" === o.method ? flickL(t, "استلام", "Pickup") : flickL(t, "توصيل", "Delivery"),
          "pickup" === o.method ? branch(o.branchId) : o.area ?? "",
          o.address ?? "",
          (o.lines || [])
            .map((l) => `${l.name}${l.variant ? ` (${l.variant})` : ""} × ${l.qty}`)
            .join(" | "),
          o.total,
          tr(`status.${o.status}`, o.status),
          o.notes ?? "",
          o.privateNote ?? "",
        ]),
      ]);
    },
    children: flickL(t, "تصدير Excel", "Export to Excel"),
  });
}

// ---------------------------------------------------------------- device list
function flickProductAvailable(product) {
  return product.variants.some((v) => window.FlickDeviceFeatures.available(v));
}
function FlickQuickToggles({ product: e }) {
  let { lang: t, updateContent: n } = nm(),
    inStock = flickProductAvailable(e),
    patch = (change) =>
      n((c) => ({
        ...c,
        products: c.products.map((p) => (p.id === e.id ? change(p) : p)),
      }));
  return (0, k.jsxs)(k.Fragment, {
    children: [
      (0, k.jsx)("button", {
        type: "button",
        role: "switch",
        "aria-checked": inStock,
        title: flickL(t, "اضغط لتغيير حالة التوفر لكل الخيارات", "Switch availability for every option"),
        onClick: () =>
          patch((p) => ({
            ...p,
            variants: p.variants.map((v) =>
              inStock
                ? { ...v, inStock: !1 }
                : {
                    ...v,
                    inStock: !0,
                    soldOut: !1,
                    stockQuantity: 0 === v.stockQuantity ? null : v.stockQuantity,
                  },
            ),
          })),
        className: t0(
          "h-9 rounded-[9px] px-3 text-[13px] font-semibold",
          inStock ? "bg-shelf-2 text-paper" : "bg-sale/20 text-red-200",
        ),
        "aria-label": `${eZ(e.name, t)}: ${inStock ? flickL(t, "متوفر", "In stock") : flickL(t, "نفد", "Sold out")}`,
        children: inStock ? flickL(t, "متوفر", "In stock") : flickL(t, "نفد", "Sold out"),
      }),
    ],
  });
}

// ---------------------------------------------------------------- categories tab
function flickCategoryId(name, taken) {
  let base =
    String(name || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "category";
  let id = base,
    n = 2;
  for (; taken.has(id); ) id = `${base}-${n++}`;
  return id;
}
function FlickCategoriesAdmin() {
  let { lang: t, content: n, updateContent: r } = nm(),
    saved = Array.isArray(n.categories) && n.categories.length ? n.categories : flickDefaultCategories,
    [rows, setRows] = (0, w.useState)(() => structuredClone(saved)),
    [error, setError] = (0, w.useState)(""),
    dirty = JSON.stringify(rows) !== JSON.stringify(saved),
    count = (id) => n.products.filter((p) => p.cat === id).length,
    change = (i, patch) => setRows((old) => old.map((row, n) => (n === i ? { ...row, ...patch } : row))),
    move = (i, d) =>
      setRows((old) => {
        let copy = [...old];
        [copy[i], copy[i + d]] = [copy[i + d], copy[i]];
        return copy;
      });
  return (0, k.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, k.jsx)("p", {
        className: "text-sm text-dust",
        children: flickL(
          t,
          "غيّر أسماء الأقسام وترتيبها والصورة اللي بتظهر عليها بالصفحة الرئيسية. الأجهزة بتضل بقسمها لما تغيّر الاسم.",
          "Rename the categories, change their order and the picture shown on the home page. Devices stay in their category when you rename it.",
        ),
      }),
      (0, k.jsx)("ol", {
        className: "space-y-3",
        children: rows.map((row, i) => {
          let devices = count(row.id),
            picture = n.products.find((p) => p.id === row.pictureId);
          return (0, k.jsx)(
            "li",
            {
              children: (0, k.jsxs)(lb, {
                title: eZ(row.name, t) || flickL(t, "قسم جديد", "New category"),
                action: (0, k.jsxs)("div", {
                  className: "flex flex-wrap items-center gap-1",
                  children: [
                    (0, k.jsx)(lm, {
                      kind: "ghost",
                      disabled: 0 === i,
                      onClick: () => move(i, -1),
                      "aria-label": `${flickL(t, "لفوق", "Move up")}: ${eZ(row.name, t)}`,
                      children: "↑",
                    }),
                    (0, k.jsx)(lm, {
                      kind: "ghost",
                      disabled: i === rows.length - 1,
                      onClick: () => move(i, 1),
                      "aria-label": `${flickL(t, "لتحت", "Move down")}: ${eZ(row.name, t)}`,
                      children: "↓",
                    }),
                    (0, k.jsx)(lm, {
                      kind: "ghost",
                      disabled: devices > 0 || rows.length < 2,
                      title: devices > 0 ? flickL(t, "انقل أجهزته لقسم ثاني قبل الحذف.", "Move its devices to another category first.") : "",
                      onClick: () => setRows((old) => old.filter((_, n) => n !== i)),
                      children: flickL(t, "احذف", "Delete"),
                    }),
                  ],
                }),
                children: (0, k.jsxs)("div", {
                  className: "grid gap-4 sm:grid-cols-[160px_1fr]",
                  children: [
                    picture
                      ? (0, k.jsx)(nv, { product: picture, className: "aspect-square w-full max-w-[160px] rounded-[12px]" })
                      : (0, k.jsx)("div", { className: "aspect-square w-full max-w-[160px] rounded-[12px] bg-shelf-2" }),
                    (0, k.jsxs)("div", {
                      className: "space-y-3",
                      children: [
                        (0, k.jsx)(lk, {
                          value: row.name,
                          onChange: (name) => change(i, { name }),
                          labels: [flickL(t, "الاسم بالعربي", "Name in Arabic"), flickL(t, "الاسم بالإنجليزي", "Name in English")],
                          ids: [`cat-${i}-ar`, `cat-${i}-en`],
                        }),
                        (0, k.jsx)(lu, {
                          label: flickL(t, "صورة القسم (جهاز من القسم)", "Category picture (a device)"),
                          htmlFor: `cat-${i}-pic`,
                          help: `${devices} ${flickL(t, "جهاز بهالقسم", "devices in this category")}`,
                          children: (0, k.jsxs)("select", {
                            id: `cat-${i}-pic`,
                            className: lc,
                            value: row.pictureId || "",
                            onChange: (e) => change(i, { pictureId: e.target.value }),
                            children: [
                              (0, k.jsx)("option", { value: "", children: "—" }),
                              ...n.products
                                .filter((p) => p.cat === row.id || p.id === row.pictureId)
                                .map((p) => (0, k.jsx)("option", { value: p.id, children: eZ(p.name, t) }, p.id)),
                            ],
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            },
            row.id || i,
          );
        }),
      }),
      (0, k.jsx)(lm, {
        disabled: rows.length >= 20,
        onClick: () =>
          setRows((old) => [...old, { id: "", name: { ar: "", en: "" }, pictureId: "" }]),
        children: flickL(t, "أضف قسم", "Add category"),
      }),
      (0, k.jsx)(ly, {
        error,
        dirty,
        onSave: async () => {
          if (rows.some((row) => !row.name.ar.trim() || !row.name.en.trim()))
            return setError(flickL(t, "كل قسم بده اسم بالعربي والإنجليزي.", "Every category needs an Arabic and an English name."));
          let taken = new Set(rows.map((row) => row.id).filter(Boolean)),
            clean = rows.map((row) => {
              let id = row.id;
              if (!id) taken.add((id = flickCategoryId(row.name.en, taken)));
              return {
                id,
                name: { ar: row.name.ar.trim(), en: row.name.en.trim() },
                pictureId: row.pictureId || "",
              };
            });
          setError("");
          (await r((c) => ({ ...c, categories: clean }))) &&
            (setRows(structuredClone(clean)), D.success(flickL(t, "انحفظت الأقسام", "Categories saved")));
        },
      }),
    ],
  });
}

// ---------------------------------------------------------------- texts tab
function FlickTextsAdmin() {
  let { lang: t, content: n, updateContent: r } = nm(),
    saved = n.texts && "object" == typeof n.texts ? n.texts : {},
    [draft, setDraft] = (0, w.useState)(() => structuredClone(saved)),
    [area, setArea] = (0, w.useState)("home"),
    [query, setQuery] = (0, w.useState)(""),
    [limit, setLimit] = (0, w.useState)(30),
    [error, setError] = (0, w.useState)(""),
    clean = (obj) =>
      Object.fromEntries(
        Object.entries(obj)
          .map(([key, v]) => [key, { ar: (v?.ar || "").trim(), en: (v?.en || "").trim() }])
          .filter(([key, v]) => flickTextDefaults[key] && (v.ar || v.en)),
      ),
    dirty = JSON.stringify(clean(draft)) !== JSON.stringify(clean(saved)),
    q = query.trim().toLowerCase(),
    keys = Object.keys(flickTextDefaults).filter((key) => {
      if (!q) return "edited" === area ? !!clean(draft)[key] : flickTextArea(key) === area;
      let base = flickTextDefaults[key],
        own = draft[key] || {};
      return `${base.ar} ${base.en} ${own.ar || ""} ${own.en || ""}`.toLowerCase().includes(q);
    }),
    edited = Object.keys(clean(draft)).length,
    set = (key, language, value) =>
      setDraft((old) => ({ ...old, [key]: { ...(old[key] || {}), [language]: value } }));
  return (0, k.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, k.jsx)("p", {
        className: "text-sm text-dust",
        children: flickL(
          t,
          "اختار جزء من الموقع وغيّر الكلام بالعربي أو الإنجليزي. الحقل الفاضي برجع للنص الأصلي. الكلام اللي بين { } لازم يضل زي ما هو.",
          "Choose a part of the site and change its Arabic or English wording. An empty field uses the original text. Keep anything between { } exactly as it is.",
        ),
      }),
      (0, k.jsxs)("div", {
        className: "grid gap-3 sm:grid-cols-2",
        children: [
          (0, k.jsx)(lu, {
            label: flickL(t, "جزء الموقع", "Part of the site"),
            htmlFor: "tx-area",
            children: (0, k.jsxs)("select", {
              id: "tx-area",
              className: lc,
              value: area,
              onChange: (e) => (setArea(e.target.value), setQuery(""), setLimit(30)),
              children: [
                ...FLICK_TEXT_AREAS.map((a) => (0, k.jsx)("option", { value: a.id, children: flickL(t, a.ar, a.en) }, a.id)),
                (0, k.jsx)("option", { value: "edited", children: `${flickL(t, "النصوص المعدّلة", "Edited texts")} (${edited})` }, "edited"),
              ],
            }),
          }),
          (0, k.jsx)(lu, {
            label: flickL(t, "ابحث بكل نصوص الموقع", "Search all website texts"),
            htmlFor: "tx-search",
            children: (0, k.jsx)(ld, {
              id: "tx-search",
              type: "search",
              value: query,
              onChange: (e) => (setQuery(e.target.value), setLimit(30)),
            }),
          }),
        ],
      }),
      0 === keys.length
        ? (0, k.jsx)("p", {
            className: "rounded-[14px] border bg-shelf p-5 text-sm text-dust",
            children: flickL(t, "ما في نصوص هون.", "No texts here."),
          })
        : (0, k.jsx)("ul", {
            className: "space-y-3",
            children: keys.slice(0, limit).map((key) => {
              let base = flickTextDefaults[key],
                own = draft[key] || {},
                changed = !!(own.ar?.trim() || own.en?.trim());
              return (0, k.jsx)(
                "li",
                {
                  className: "rounded-[12px] border bg-shelf p-3",
                  children: (0, k.jsxs)("div", {
                    className: "space-y-2",
                    children: [
                      (0, k.jsxs)("div", {
                        className: "flex flex-wrap items-center justify-between gap-2",
                        children: [
                          (0, k.jsx)("p", {
                            className: "text-xs text-dust",
                            dir: "auto",
                            children: base[t] || base.en,
                          }),
                          changed &&
                            (0, k.jsx)(lm, {
                              kind: "ghost",
                              onClick: () => setDraft((old) => ({ ...old, [key]: { ar: "", en: "" } })),
                              children: flickL(t, "رجّع الأصلي", "Use original"),
                            }),
                        ],
                      }),
                      (0, k.jsxs)("div", {
                        className: "grid gap-2 sm:grid-cols-2",
                        children: [
                          (0, k.jsx)(lf, {
                            "aria-label": `${flickL(t, "بالعربي", "Arabic")}: ${base[t] || base.en}`,
                            dir: "rtl",
                            rows: 2,
                            maxLength: 1e3,
                            placeholder: base.ar,
                            value: own.ar || "",
                            onChange: (e) => set(key, "ar", e.target.value),
                          }),
                          (0, k.jsx)(lf, {
                            "aria-label": `${flickL(t, "بالإنجليزي", "English")}: ${base[t] || base.en}`,
                            dir: "ltr",
                            rows: 2,
                            maxLength: 1e3,
                            placeholder: base.en,
                            value: own.en || "",
                            onChange: (e) => set(key, "en", e.target.value),
                          }),
                        ],
                      }),
                    ],
                  }),
                },
                key,
              );
            }),
          }),
      keys.length > limit &&
        (0, k.jsx)(lm, {
          onClick: () => setLimit((n) => n + 30),
          children: flickL(t, `اعرض أكثر (${keys.length - limit})`, `Show more (${keys.length - limit})`),
        }),
      (0, k.jsx)(ly, {
        error,
        dirty,
        onSave: async () => {
          let next = clean(draft),
            wrong = Object.entries(next).find(([key, v]) =>
              ["ar", "en"].some((l) => v[l] && flickPlaceholders(v[l]) !== flickPlaceholders(flickTextDefaults[key][l])),
            );
          if (wrong)
            return setError(
              flickL(
                t,
                `النص «${flickTextDefaults[wrong[0]].ar}» لازم يحتوي نفس الكلمات اللي بين { }.`,
                `"${flickTextDefaults[wrong[0]].en}" must keep the same words between { }.`,
              ),
            );
          setError("");
          (await r((c) => ({ ...c, texts: next }))) &&
            (setDraft(structuredClone(next)), D.success(flickL(t, "انحفظت النصوص", "Texts saved")));
        },
      }),
    ],
  });
}

// ---------------------------------------------------------------- banner tab
// One card per banner slot (home categories): automatic, a chosen device, or an
// uploaded picture with its own name and an optional device it opens.
function FlickBannerAdmin() {
  let { lang: t, content: n, updateContent: r } = nm(),
    visible = n.products.filter((p) => p.visible),
    cats = ez.filter((c) => isFlickHomeCategory(c.id) && visible.some((p) => p.cat === c.id)),
    saved = Array.isArray(n.heroSlots) ? n.heroSlots : [],
    initial = () =>
      cats.map((c) => {
        let s = saved.find((x) => x.cat === c.id) || {};
        return {
          cat: c.id,
          mode: s.image ? "image" : s.productId ? "device" : "auto",
          productId: s.productId || "",
          image: s.image || "",
          name: { ar: s.name?.ar || "", en: s.name?.en || "" },
        };
      }),
    [rows, setRows] = (0, w.useState)(initial),
    [busy, setBusy] = (0, w.useState)(-1),
    [error, setError] = (0, w.useState)(""),
    toSave = (list) =>
      list
        .filter((x) => "auto" !== x.mode)
        .map((x) => ({
          cat: x.cat,
          productId: x.productId || "",
          image: "image" === x.mode ? x.image : "",
          name: "image" === x.mode ? { ar: x.name.ar.trim(), en: x.name.en.trim() } : { ar: "", en: "" },
        })),
    dirty = JSON.stringify(toSave(rows)) !== JSON.stringify(toSave(initial())),
    change = (i, patch) => setRows((old) => old.map((x, n) => (n === i ? { ...x, ...patch } : x))),
    upload = async (i, file) => {
      if (!file) return;
      setBusy(i);
      try {
        let data = await oC(file);
        if (0.75 * data.length > 1e6)
          return void D.error(flickL(t, "الصورة كبيرة كثير. جرّب صورة أصغر.", "The picture is too large. Try a smaller one."));
        change(i, { image: data, mode: "image" });
      } catch {
        D.error(flickL(t, "ما قدرنا نقرأ الصورة. جرّب PNG أو JPG.", "Couldn't read that picture. Try PNG or JPG."));
      } finally {
        setBusy(-1);
      }
    },
    // Saved slots may come back with server picture links: show what was stored.
    _sync = (0, w.useEffect)(() => setRows(initial()), [n.heroSlots]),
    modes = [
      ["auto", flickL(t, "تلقائي", "Automatic")],
      ["device", flickL(t, "اختار جهاز", "Choose a device")],
      ["image", flickL(t, "ارفع صورة", "Upload a picture")],
    ];
  return (0, k.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, k.jsx)("p", {
        className: "text-sm text-dust",
        children: flickL(
          t,
          "هاي الأجهزة اللي بتتحرك بالواجهة أول الصفحة الرئيسية، وحدة لكل قسم. التحكم فيها من هون بس: اختار جهاز من القائمة، أو ارفع صورة بدلها. «تلقائي» بيعرض أول جهاز بالقسم.",
          "These are the devices moving in the banner at the top of the home page, one per category. They are controlled only here: choose a device from your list, or upload a picture instead. Automatic shows the first device in the category.",
        ),
      }),
      (0, k.jsx)("ol", {
        className: "space-y-3",
        children: rows.map((row, i) => {
          let cat = cats.find((c) => c.id === row.cat),
            device = visible.find((p) => p.id === row.productId),
            auto = visible.filter((p) => p.cat === row.cat),
            autoDevice = auto[0],
            preview =
              "image" === row.mode && row.image
                ? { id: `banner-${row.cat}`, name: row.name, photo: row.image, img: null, variants: [] }
                : "device" === row.mode && device
                  ? device
                  : autoDevice;
          return (0, k.jsx)(
            "li",
            {
              children: (0, k.jsx)(lb, {
                title: `${flickL(t, "الشريحة", "Slide")} ${i + 1}: ${flickL(t, cat.ar, cat.en)}`,
                children: (0, k.jsxs)("div", {
                  className: "grid gap-4 sm:grid-cols-[160px_1fr]",
                  children: [
                    preview
                      ? (0, k.jsx)(nv, { product: preview, className: "aspect-square w-full max-w-[160px] rounded-[12px]" })
                      : (0, k.jsx)("div", { className: "aspect-square w-full max-w-[160px] rounded-[12px] bg-shelf-2" }),
                    (0, k.jsxs)("div", {
                      className: "space-y-3",
                      children: [
                        (0, k.jsx)("div", {
                          role: "radiogroup",
                          "aria-label": flickL(t, "شو يظهر", "What shows"),
                          className: "flex flex-wrap gap-1.5",
                          children: modes.map(([id, label]) =>
                            (0, k.jsx)(
                              "button",
                              {
                                type: "button",
                                role: "radio",
                                "aria-checked": row.mode === id,
                                onClick: () => change(i, { mode: id }),
                                className: t0(
                                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold",
                                  row.mode === id ? "border-flick bg-flick text-ink" : "bg-shelf text-paper hover:border-flick",
                                ),
                                children: label,
                              },
                              id,
                            ),
                          ),
                        }),
                        "auto" === row.mode &&
                          (0, k.jsx)("p", {
                            className: "text-xs text-dust",
                            children: autoDevice
                              ? `${flickL(t, "بيظهر هلأ", "Showing now")}: ${eZ(autoDevice.name, t)}`
                              : "",
                          }),
                        "image" === row.mode &&
                          (0, k.jsxs)("div", {
                            className: "space-y-3",
                            children: [
                              (0, k.jsxs)("label", {
                                className: t0(
                                  "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[9px] bg-shelf-2 px-3.5 text-[14px] font-semibold hover:bg-shelf-2/70",
                                  busy === i && "opacity-50",
                                ),
                                children: [
                                  row.image ? flickL(t, "غيّر الصورة", "Change picture") : flickL(t, "ارفع صورة", "Upload picture"),
                                  (0, k.jsx)("input", {
                                    type: "file",
                                    accept: "image/png,image/jpeg,image/webp",
                                    className: "sr-only",
                                    "aria-label": `${flickL(t, "صورة الشريحة", "Slide picture")} ${i + 1}`,
                                    onChange: (e) => {
                                      upload(i, e.target.files?.[0]);
                                      e.target.value = "";
                                    },
                                  }),
                                ],
                              }),
                              (0, k.jsx)("p", {
                                className: "text-xs text-dust",
                                children: flickL(t, "أحلى إشي صورة جهاز بخلفية شفافة (PNG).", "A device photo with a transparent background (PNG) looks best."),
                              }),
                              (0, k.jsx)(lk, {
                                value: row.name,
                                onChange: (name) => change(i, { name }),
                                labels: [flickL(t, "الاسم تحت الصورة بالعربي", "Caption in Arabic"), flickL(t, "الاسم تحت الصورة بالإنجليزي", "Caption in English")],
                                ids: [`bn-${i}-ar`, `bn-${i}-en`],
                              }),
                            ],
                          }),
                        "auto" !== row.mode &&
                          (0, k.jsx)(lu, {
                            label:
                              "image" === row.mode
                                ? flickL(t, "لما الزبون يضغط عليها تفتح (اختياري)", "Opens when tapped (optional)")
                                : flickL(t, "الجهاز", "Device"),
                            htmlFor: `bn-${i}-device`,
                            children: (0, k.jsxs)("select", {
                              id: `bn-${i}-device`,
                              className: lc,
                              value: row.productId,
                              onChange: (e) => change(i, { productId: e.target.value }),
                              children: [
                                (0, k.jsx)("option", {
                                  value: "",
                                  children: "image" === row.mode ? flickL(t, "صفحة القسم", "The category page") : "—",
                                }),
                                ...ez
                                  .filter((c) => visible.some((p) => p.cat === c.id))
                                  .map((c) =>
                                    (0, k.jsx)(
                                      "optgroup",
                                      {
                                        label: flickL(t, c.ar, c.en),
                                        children: visible
                                          .filter((p) => p.cat === c.id)
                                          .map((p) => (0, k.jsx)("option", { value: p.id, children: eZ(p.name, t) }, p.id)),
                                      },
                                      c.id,
                                    ),
                                  ),
                              ],
                            }),
                          }),
                      ],
                    }),
                  ],
                }),
              }),
            },
            row.cat,
          );
        }),
      }),
      (0, k.jsx)(ly, {
        error,
        dirty,
        onSave: async () => {
          let bad = rows.findIndex(
            (x) => ("device" === x.mode && !x.productId) || ("image" === x.mode && !x.image),
          );
          if (bad >= 0)
            return setError(
              "device" === rows[bad].mode
                ? flickL(t, `اختار جهاز للشريحة ${bad + 1} أو رجّعها تلقائي.`, `Choose a device for slide ${bad + 1}, or set it to Automatic.`)
                : flickL(t, `ارفع صورة للشريحة ${bad + 1} أو رجّعها تلقائي.`, `Upload a picture for slide ${bad + 1}, or set it to Automatic.`),
            );
          setError("");
          let next = toSave(rows);
          (await r((c) => ({ ...c, heroSlots: next }))) &&
            D.success(flickL(t, "انحفظت أجهزة الواجهة", "Banner devices saved"));
        },
      }),
    ],
  });
}
