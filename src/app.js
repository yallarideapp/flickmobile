let li = {
  name: "x",
  size: 24,
  node: [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
};
li.node;
let ls = Q(li),
  lc =
    "block h-10 w-full rounded-[9px] border border-input bg-shelf-2 px-3 text-[14px] text-paper placeholder:text-dust/60 focus:border-flick focus:outline-none disabled:opacity-60";
function lu({ label: e, help: t, children: n, className: r, htmlFor: a }) {
  return (0, k.jsxs)("div", {
    className: t0("min-w-0", r),
    children: [
      (0, k.jsx)("label", {
        htmlFor: a,
        className: "mb-1.5 block text-[13px] font-semibold text-paper",
        children: e,
      }),
      n,
      t &&
        (0, k.jsx)("p", {
          className: "mt-1 text-xs leading-relaxed text-dust",
          children: t,
        }),
    ],
  });
}
function ld(e) {
  return (0, k.jsx)("input", { ...e, className: t0(lc, e.className) });
}
function lf(e) {
  return (0, k.jsx)("textarea", {
    ...e,
    className: t0(lc, "h-auto min-h-[72px] py-2 leading-relaxed", e.className),
  });
}
function lp({ checked: e, onChange: t, label: n, id: r, help: a }) {
  return (0, k.jsxs)("div", {
    className: "flex items-start justify-between gap-4",
    children: [
      (0, k.jsxs)("div", {
        className: "min-w-0",
        children: [
          (0, k.jsx)("label", {
            htmlFor: r,
            className: "block text-[14px] font-semibold text-paper",
            children: n,
          }),
          a &&
            (0, k.jsx)("p", {
              className: "mt-0.5 text-xs leading-relaxed text-dust",
              children: a,
            }),
        ],
      }),
      (0, k.jsx)("button", {
        id: r,
        type: "button",
        role: "switch",
        "aria-checked": e,
        onClick: () => t(!e),
        className: t0(
          "relative h-7 w-12 shrink-0 rounded-full border transition-colors",
          e ? "border-flick bg-flick" : "bg-shelf-2",
        ),
        children: (0, k.jsx)("span", {
          className: t0(
            "absolute top-1/2 size-5 -translate-y-1/2 rounded-full transition-all",
            e
              ? "bg-ink ltr:left-[calc(100%-1.4rem)] rtl:right-[calc(100%-1.4rem)]"
              : "bg-dust ltr:left-1 rtl:right-1",
          ),
        }),
      }),
    ],
  });
}
function lm({
  children: e,
  onClick: t,
  kind: n = "plain",
  type: r = "button",
  className: a,
  disabled: l,
  ...o
}) {
  return (0, k.jsx)("button", {
    type: r,
    onClick: t,
    disabled: l,
    ...o,
    className: t0(
      "inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-[9px] px-3.5 text-[14px] font-semibold transition-colors disabled:opacity-50",
      "primary" === n && "bg-flick text-ink hover:bg-flick/90",
      "plain" === n && "bg-shelf-2 text-paper hover:bg-shelf-2/70",
      "danger" === n && "bg-sale text-white hover:bg-sale/90",
      "ghost" === n && "text-dust hover:bg-shelf-2 hover:text-paper",
      a,
    ),
    children: e,
  });
}
function lh({
  open: e,
  onClose: t,
  title: n,
  children: r,
  footer: a,
  wide: l,
}) {
  let { t: o } = nm();
  return (0, k.jsx)(a$, {
    open: e,
    onOpenChange: (e) => !e && t(),
    children: (0, k.jsxs)(a4, {
      children: [
        (0, k.jsx)(a5, {
          className:
            "fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        }),
        (0, k.jsx)("div", {
          className:
            "pointer-events-none fixed inset-0 z-50 grid grid-cols-1 place-items-center p-3 sm:p-6",
          children: (0, k.jsxs)(a7, {
            "aria-describedby": void 0,
            className: t0(
              "pointer-events-auto flex max-h-[min(92vh,900px)] w-full min-w-0 flex-col overflow-hidden rounded-[16px] border bg-ink shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              l ? "max-w-3xl" : "max-w-lg",
            ),
            children: [
              (0, k.jsxs)("div", {
                className:
                  "flex items-center justify-between gap-3 border-b px-5 py-3.5",
                children: [
                  (0, k.jsx)(lr, {
                    className: "truncate text-[17px] font-bold",
                    children: n,
                  }),
                  (0, k.jsx)(la, {
                    className:
                      "grid size-9 shrink-0 place-items-center rounded-lg text-dust hover:bg-shelf-2 hover:text-paper",
                    "aria-label": o("common.close"),
                    children: (0, k.jsx)(ls, { className: "size-5" }),
                  }),
                ],
              }),
              (0, k.jsx)("div", {
                className: "min-h-0 flex-1 overflow-y-auto px-5 py-5",
                children: r,
              }),
              a &&
                (0, k.jsx)("div", {
                  className:
                    "flex flex-wrap items-center justify-end gap-2 border-t px-5 py-3.5",
                  children: a,
                }),
            ],
          }),
        }),
      ],
    }),
  });
}
function lg({ open: e, text: t, confirmLabel: n, onConfirm: r, onCancel: a }) {
  let { t: l } = nm();
  return (0, k.jsx)(lh, {
    open: e,
    onClose: a,
    title: n,
    footer: (0, k.jsxs)(k.Fragment, {
      children: [
        (0, k.jsx)(lm, { onClick: a, children: l("common.cancel") }),
        (0, k.jsx)(lm, { kind: "danger", onClick: r, children: n }),
      ],
    }),
    children: (0, k.jsx)("p", {
      className: "text-[15px] leading-relaxed",
      children: t,
    }),
  });
}
function lb({ title: e, children: t, action: n, className: r }) {
  return (0, k.jsxs)("section", {
    className: t0("rounded-[14px] border bg-shelf p-4 sm:p-5", r),
    children: [
      (e || n) &&
        (0, k.jsxs)("div", {
          className: "mb-4 flex flex-wrap items-center justify-between gap-2",
          children: [
            e &&
              (0, k.jsx)("h2", {
                className: "text-[16px] font-bold",
                children: e,
              }),
            n,
          ],
        }),
      t,
    ],
  });
}
function lv({ status: e, label: t }) {
  return (0, k.jsx)("span", {
    className: t0(
      "inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-bold",
      {
        new: "bg-flick text-ink",
        confirmed: "bg-sky-400/20 text-sky-200",
        ready: "bg-violet-400/20 text-violet-200",
        delivered: "bg-emerald-400/20 text-emerald-200",
        cancelled: "bg-sale/20 text-red-200",
      }[e] ?? "bg-shelf-2",
    ),
    children: t,
  });
}
function lx(e) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Asia/Amman",
    }).format(new Date(e));
  } catch {
    return e.slice(0, 16).replace("T", " ");
  }
}
function ly({ error: e, onSave: t, dirty: n }) {
  let { t: r } = nm(),
    [saving, setSaving] = (0, w.useState)(false);
  return (0, k.jsxs)("div", {
    className:
      "sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center justify-end gap-3 border-t bg-ink/95 px-1 py-3 backdrop-blur",
    children: [
      e &&
        (0, k.jsx)("p", {
          role: "alert",
          className: "me-auto text-[13px] font-semibold text-sale",
          children: e,
        }),
      (0, k.jsx)(lm, {
        kind: "primary",
        onClick: async () => {
          if (saving) return;
          setSaving(true);
          try {
            await t();
          } finally {
            setSaving(false);
          }
        },
        disabled: !n || saving,
        "aria-busy": saving,
        children: r("common.save"),
      }),
    ],
  });
}
function lk({ value: e, onChange: t, labels: n, ids: r, area: a }) {
  let l = a ? lf : ld;
  return (0, k.jsxs)("div", {
    className: "grid gap-3 sm:grid-cols-2",
    children: [
      (0, k.jsx)(lu, {
        label: n[0],
        htmlFor: r[0],
        children: (0, k.jsx)(l, {
          id: r[0],
          dir: "rtl",
          value: e.ar,
          onChange: (n) => t({ ...e, ar: n.target.value }),
        }),
      }),
      (0, k.jsx)(lu, {
        label: n[1],
        htmlFor: r[1],
        children: (0, k.jsx)(l, {
          id: r[1],
          dir: "ltr",
          value: e.en,
          onChange: (n) => t({ ...e, en: n.target.value }),
        }),
      }),
    ],
  });
}
function lw() {
  let { t: e, lang: t, content: n, updateContent: r } = nm(),
    [a, l] = (0, w.useState)(() => structuredClone(n.campaign)),
    [o, i] = (0, w.useState)(String(n.campaign.minInvoice)),
    [s, c] = (0, w.useState)(""),
    u =
      JSON.stringify(a) !== JSON.stringify(n.campaign) ||
      o !== String(n.campaign.minInvoice),
    d = eQ({ ...a }),
    f =
      "live" === d
        ? e("cp.state.live", { n: eK(a) })
        : "soon" === d
          ? e("cp.state.soon", { date: eY(a.start) })
          : e("over" === d ? "cp.state.over" : "cp.state.off");
  return (0, k.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, k.jsxs)(lb, {
        children: [
          (0, k.jsx)(lp, {
            id: "cp-on",
            checked: a.on,
            onChange: (e) => l({ ...a, on: e }),
            label: e("cp.on"),
            help: e("cp.onHelp"),
          }),
          (0, k.jsx)("p", {
            className:
              "mt-3 inline-flex rounded-full bg-shelf-2 px-3 py-1 text-[13px] font-semibold",
            children: f,
          }),
        ],
      }),
      (0, k.jsx)(lb, {
        children: (0, k.jsxs)("div", {
          className: "space-y-4",
          children: [
            (0, k.jsx)(lk, {
              value: a.title,
              onChange: (e) => l({ ...a, title: e }),
              labels: [e("cp.titleAr"), e("cp.titleEn")],
              ids: ["cp-title-ar", "cp-title-en"],
            }),
            (0, k.jsxs)("div", {
              className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
              children: [
                (0, k.jsx)(lu, {
                  label: e("cp.start"),
                  htmlFor: "cp-start",
                  children: (0, k.jsx)(ld, {
                    id: "cp-start",
                    type: "date",
                    dir: "ltr",
                    value: a.start,
                    onChange: (e) => l({ ...a, start: e.target.value }),
                  }),
                }),
                (0, k.jsx)(lu, {
                  label: e("cp.end"),
                  htmlFor: "cp-end",
                  children: (0, k.jsx)(ld, {
                    id: "cp-end",
                    type: "date",
                    dir: "ltr",
                    value: a.end,
                    onChange: (e) => l({ ...a, end: e.target.value }),
                  }),
                }),
                (0, k.jsx)(lu, {
                  label: e("cp.min"),
                  htmlFor: "cp-min",
                  children: (0, k.jsx)(ld, {
                    id: "cp-min",
                    dir: "ltr",
                    inputMode: "decimal",
                    className: "num",
                    value: o,
                    onChange: (e) => i(e.target.value),
                  }),
                }),
                (0, k.jsx)(lu, {
                  label: e("cp.draw"),
                  htmlFor: "cp-draw",
                  children: (0, k.jsx)("select", {
                    id: "cp-draw",
                    className: lc,
                    value: a.drawBranch,
                    onChange: (e) => l({ ...a, drawBranch: e.target.value }),
                    children: n.branches.map((e) =>
                      (0, k.jsx)(
                        "option",
                        { value: e.id, children: eZ(e.name, t) },
                        e.id,
                      ),
                    ),
                  }),
                }),
              ],
            }),
            (0, k.jsx)(lu, {
              label: e("cp.approval"),
              htmlFor: "cp-approval",
              className: "max-w-xs",
              children: (0, k.jsx)(ld, {
                id: "cp-approval",
                dir: "ltr",
                className: "num",
                value: a.approval,
                onChange: (e) => l({ ...a, approval: e.target.value }),
              }),
            }),
          ],
        }),
      }),
      (0, k.jsxs)(lb, {
        title: e("cp.prizes"),
        children: [
          (0, k.jsx)("ol", {
            className: "space-y-2",
            children: a.prizes.map((t, n) =>
              (0, k.jsxs)(
                "li",
                {
                  className: "grid grid-cols-[1fr_1fr_auto] items-center gap-2",
                  children: [
                    (0, k.jsx)(ld, {
                      id: `cp-prize-${n}-ar`,
                      "aria-label": `${e("cp.prizes")} ${n + 1} ${e("common.ar")}`,
                      dir: "rtl",
                      value: t.ar,
                      onChange: (e) =>
                        l({
                          ...a,
                          prizes: a.prizes.map((t, r) =>
                            r === n ? { ...t, ar: e.target.value } : t,
                          ),
                        }),
                    }),
                    (0, k.jsx)(ld, {
                      id: `cp-prize-${n}-en`,
                      "aria-label": `${e("cp.prizes")} ${n + 1} ${e("common.en")}`,
                      dir: "ltr",
                      value: t.en,
                      onChange: (e) =>
                        l({
                          ...a,
                          prizes: a.prizes.map((t, r) =>
                            r === n ? { ...t, en: e.target.value } : t,
                          ),
                        }),
                    }),
                    (0, k.jsx)("button", {
                      type: "button",
                      className:
                        "grid size-10 place-items-center rounded-[9px] text-dust hover:bg-shelf-2 hover:text-sale",
                      "aria-label": e("cp.removePrize", { n: n + 1 }),
                      onClick: () =>
                        l({ ...a, prizes: a.prizes.filter((e, t) => t !== n) }),
                      children: (0, k.jsx)(ey, { className: "size-4" }),
                    }),
                  ],
                },
                n,
              ),
            ),
          }),
          (0, k.jsxs)(lm, {
            className: "mt-3",
            onClick: () =>
              l({ ...a, prizes: [...a.prizes, { ar: "", en: "" }] }),
            children: [
              (0, k.jsx)(nS, { className: "size-4", "aria-hidden": !0 }),
              e("cp.addPrize"),
            ],
          }),
        ],
      }),
      (0, k.jsx)(ly, {
        error: s,
        onSave: async () => {
          let t = Number(o);
          if (!a.title.ar.trim() && !a.title.en.trim())
            return c(e("cp.err.title"));
          if (!a.start || !a.end || a.end < a.start)
            return c(e("cp.err.dates"));
          c("");
          let n = {
            ...a,
            minInvoice: Number.isFinite(t) && t >= 0 ? t : 0,
            prizes: a.prizes.filter((e) => e.ar.trim() || e.en.trim()),
          };
          (await r((e) => ({ ...e, campaign: n }))) &&
            (l(n), i(String(n.minInvoice)), D.success(e("cp.saved")));
        },
        dirty: u,
      }),
    ],
  });
}
function lN() {
  let { t: e, lang: t, content: n, updateContent: r } = nm(),
    [a, l] = (0, w.useState)(() => structuredClone(n.branches)),
    [o, i] = (0, w.useState)(""),
    [s, c] = (0, w.useState)(null),
    u = JSON.stringify(a) !== JSON.stringify(n.branches),
    d = (e, t) => l((n) => n.map((n, r) => (r === e ? { ...n, ...t } : n)));
  return (0, k.jsxs)("div", {
    className: "space-y-4",
    children: [
      a.map((n, r) =>
        (0, k.jsx)(
          lb,
          {
            title: eZ(n.name, t) || e("br.new"),
            action: (0, k.jsxs)(lm, {
              kind: "ghost",
              className: "hover:text-sale",
              onClick: () => c(r),
              disabled: 1 === a.length,
              children: [
                (0, k.jsx)(ey, { className: "size-4", "aria-hidden": !0 }),
                e("br.remove"),
              ],
            }),
            children: (0, k.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, k.jsx)(lk, {
                  value: n.name,
                  onChange: (e) => d(r, { name: e }),
                  labels: [e("br.nameAr"), e("br.nameEn")],
                  ids: [`br-${r}-ar`, `br-${r}-en`],
                }),
                (0, k.jsxs)("div", {
                  className: "grid gap-3 sm:grid-cols-[200px_1fr]",
                  children: [
                    (0, k.jsx)(lu, {
                      label: e("br.phone"),
                      htmlFor: `br-${r}-phone`,
                      children: (0, k.jsx)(ld, {
                        id: `br-${r}-phone`,
                        dir: "ltr",
                        inputMode: "tel",
                        className: "num",
                        value: n.phone,
                        onChange: (e) => d(r, { phone: e.target.value }),
                      }),
                    }),
                    (0, k.jsx)(lu, {
                      label: e("br.maps"),
                      help: e("br.mapsHelp"),
                      htmlFor: `br-${r}-maps`,
                      children: (0, k.jsx)(ld, {
                        id: `br-${r}-maps`,
                        dir: "ltr",
                        value: n.maps,
                        onChange: (e) => d(r, { maps: e.target.value }),
                      }),
                    }),
                  ],
                }),
                (0, k.jsxs)("div", {
                  className: "grid gap-3 sm:grid-cols-2",
                  children: [
                    (0, k.jsx)("div", {
                      className: "rounded-[10px] border p-3",
                      children: (0, k.jsx)(lp, {
                        id: `br-${r}-main`,
                        checked: n.main,
                        onChange: (e) =>
                          l((t) =>
                            t.map((t, n) => ({
                              ...t,
                              main: n === r ? e : !e && t.main,
                            })),
                          ),
                        label: e("br.main"),
                      }),
                    }),
                    (0, k.jsx)("div", {
                      className: "rounded-[10px] border p-3",
                      children: (0, k.jsx)(lp, {
                        id: `br-${r}-wa`,
                        checked: n.whatsapp,
                        onChange: (e) => d(r, { whatsapp: e }),
                        label: e("br.wa"),
                      }),
                    }),
                  ],
                }),
              ],
            }),
          },
          n.id,
        ),
      ),
      (0, k.jsxs)(lm, {
        onClick: () => {
          let e = new Set(a.map((e) => e.id)),
            t = a.length + 1;
          for (; e.has(`branch-${t}`);) t++;
          l([
            ...a,
            {
              id: `branch-${t}`,
              name: { ar: "", en: "" },
              phone: "",
              maps: "",
              main: !1,
              whatsapp: !1,
            },
          ]);
        },
        children: [
          (0, k.jsx)(nS, { className: "size-4", "aria-hidden": !0 }),
          e("br.add"),
        ],
      }),
      (0, k.jsx)(ly, {
        error: o,
        onSave: async () => {
          if (
            a.some(
              (e) => !(e.name.ar.trim() || e.name.en.trim()) || !e_(e.phone),
            )
          )
            return i(e("br.err"));
          if (a.some((e) => e.maps && !/^https:\/\//.test(e.maps)))
            return i(e("st.err.url"));
          i("");
          let t = a.map((e) => ({
            ...e,
            phone: e.phone.trim(),
            maps: e.maps.trim(),
            name: {
              ar: e.name.ar.trim() || e.name.en.trim(),
              en: e.name.en.trim() || e.name.ar.trim(),
            },
          }));
          (await r((e) => ({ ...e, branches: t }))) &&
            (l(t), D.success(e("br.saved")));
        },
        dirty: u,
      }),
      (0, k.jsx)(lg, {
        open: null !== s,
        text:
          null !== s
            ? e("br.removeQ", { name: eZ(a[s]?.name, t) || e("br.new") })
            : "",
        confirmLabel: e("br.remove"),
        onCancel: () => c(null),
        onConfirm: () => {
          (l((e) => e.filter((e, t) => t !== s)), c(null));
        },
      }),
    ],
  });
}
function lS() {
  let { t: e, content: t, updateContent: n, resetDemo: r } = nm(),
    [a, l] = (0, w.useState)(() => structuredClone(t.settings)),
    [o, i] = (0, w.useState)(""),
    [s, c] = (0, w.useState)(!1),
    u = t.settings,
    d =
      JSON.stringify({
        ...a,
        conceptNotice: u.conceptNotice,
        ordersEnabled: u.ordersEnabled,
        indexingEnabled: u.indexingEnabled,
        deliveryFeeMinor: u.deliveryFeeMinor,
      }) !== JSON.stringify(u);
  return (0, k.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, k.jsx)(lb, {
        children: (0, k.jsx)(lp, {
          id: "st-concept",
          checked: t.settings.conceptNotice,
          onChange: async (t) => {
            (await n((e) => ({
              ...e,
              settings: { ...e.settings, conceptNotice: t },
            }))) &&
              (l((e) => ({ ...e, conceptNotice: t })),
              D.success(e("st.saved")));
          },
          label: e("st.concept"),
          help: e("st.conceptHelp"),
        }),
      }),
      (0, k.jsx)(lb, {
        children: (0, k.jsxs)("div", {
          className: "space-y-4",
          children: [
            (0, k.jsx)(lu, {
              label: e("st.whatsapp"),
              help: e("st.whatsappHelp"),
              htmlFor: "st-wa",
              className: "max-w-xs",
              children: (0, k.jsx)(ld, {
                id: "st-wa",
                dir: "ltr",
                inputMode: "tel",
                className: "num",
                value: a.whatsapp,
                onChange: (e) => l({ ...a, whatsapp: e.target.value }),
              }),
            }),
            (0, k.jsx)(lk, {
              value: a.instagramFollowers,
              onChange: (e) => l({ ...a, instagramFollowers: e }),
              labels: [e("st.followersAr"), e("st.followersEn")],
              ids: ["st-fol-ar", "st-fol-en"],
            }),
            (0, k.jsx)(lk, {
              area: !0,
              value: a.deliveryNote,
              onChange: (e) => l({ ...a, deliveryNote: e }),
              labels: [e("st.deliveryAr"), e("st.deliveryEn")],
              ids: ["st-del-ar", "st-del-en"],
            }),
            (0, k.jsx)(lu, {
              label: e("st.tradein"),
              htmlFor: "st-tradein",
              children: (0, k.jsx)(ld, {
                id: "st-tradein",
                dir: "ltr",
                value: a.tradeInUrl,
                onChange: (e) => l({ ...a, tradeInUrl: e.target.value }),
              }),
            }),
          ],
        }),
      }),
      (0, k.jsx)(ly, {
        error: o,
        onSave: async () => {
          if (!e_(a.whatsapp)) return i(e("st.err.wa"));
          if (!/^https:\/\//.test(a.tradeInUrl.trim()))
            return i(e("st.err.url"));
          i("");
          let r = {
            ...a,
            conceptNotice: t.settings.conceptNotice,
            ordersEnabled: t.settings.ordersEnabled,
            indexingEnabled: t.settings.indexingEnabled,
            deliveryFeeMinor: t.settings.deliveryFeeMinor,
            whatsapp: a.whatsapp.trim(),
            tradeInUrl: a.tradeInUrl.trim(),
          };
          (await n((e) => ({ ...e, settings: r }))) &&
            (l(r), D.success(e("st.saved")));
        },
        dirty: d,
      }),
      window.FlickApp?.mode !== "live" &&
        (0, k.jsxs)(lb, {
          title: e("st.reset"),
          hidden: window.FlickApp?.mode === "live",
          children: [
            (0, k.jsx)("p", {
              className: "mb-3 text-sm text-dust",
              children: e("st.resetHelp"),
            }),
            (0, k.jsxs)(lm, {
              kind: "danger",
              onClick: () => c(!0),
              disabled: window.FlickApp?.mode === "live",
              children: [
                (0, k.jsx)(nE, { className: "size-4", "aria-hidden": !0 }),
                e("st.reset"),
              ],
            }),
          ],
        }),
      (0, k.jsx)(lg, {
        open: s,
        text: e("st.resetQ"),
        confirmLabel: e("st.reset"),
        onCancel: () => c(!1),
        onConfirm: async () => {
          if (await r()) {
            c(!1);
            D.success(e("st.resetDone"));
            nw("admin");
          }
        },
      }),
    ],
  });
}
var w = x("aIIwE");
let lj = {
  name: "battery-low",
  size: 24,
  node: [
    ["path", { d: "M22 14v-4", key: "14q9d5" }],
    ["path", { d: "M6 14v-4", key: "14a6bd" }],
    [
      "rect",
      { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" },
    ],
  ],
};
lj.node;
let lE = Q(lj),
  lC = {
    name: "camera",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
          key: "18u6gg",
        },
      ],
      ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }],
    ],
  };
lC.node;
let lz = Q(lC),
  lT = {
    name: "cpu",
    size: 24,
    node: [
      ["path", { d: "M12 20v2", key: "1lh1kg" }],
      ["path", { d: "M12 2v2", key: "tus03m" }],
      ["path", { d: "M17 20v2", key: "1rnc9c" }],
      ["path", { d: "M17 2v2", key: "11trls" }],
      ["path", { d: "M2 12h2", key: "1t8f8n" }],
      ["path", { d: "M2 17h2", key: "7oei6x" }],
      ["path", { d: "M2 7h2", key: "asdhe0" }],
      ["path", { d: "M20 12h2", key: "1q8mjw" }],
      ["path", { d: "M20 17h2", key: "1fpfkl" }],
      ["path", { d: "M20 7h2", key: "1o8tra" }],
      ["path", { d: "M7 20v2", key: "4gnj0m" }],
      ["path", { d: "M7 2v2", key: "1i4yhu" }],
      [
        "rect",
        { x: "4", y: "4", width: "16", height: "16", rx: "2", key: "1vbyd7" },
      ],
      [
        "rect",
        { x: "8", y: "8", width: "8", height: "8", rx: "1", key: "z9xiuo" },
      ],
    ],
  };
lT.node;
let lP = Q(lT),
  lO = {
    name: "droplets",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
          key: "1ptgy4",
        },
      ],
      [
        "path",
        {
          d: "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
          key: "1sl1rz",
        },
      ],
    ],
  };
lO.node;
let lA = Q(lO),
  lI = {
    name: "monitor-smartphone",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",
          key: "10dyio",
        },
      ],
      ["path", { d: "M10 19v-3.96 3.15", key: "1irgej" }],
      ["path", { d: "M7 19h5", key: "qswx4l" }],
      [
        "rect",
        { width: "6", height: "10", x: "16", y: "12", rx: "2", key: "1egngj" },
      ],
    ],
  };
lI.node;
let lM = Q(lI),
  lL = {
    name: "plug-zap",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",
          key: "goz73y",
        },
      ],
      ["path", { d: "m2 22 3-3", key: "19mgm9" }],
      ["path", { d: "M7.5 13.5 10 11", key: "7xgeeb" }],
      ["path", { d: "M10.5 16.5 13 14", key: "10btkg" }],
      ["path", { d: "m18 3-4 4h6l-4 4", key: "16psg9" }],
    ],
    aliases: ["plug-zap-2"],
  };
lL.node;
let lD = Q(lL),
  lR = {
    name: "volume-2",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
          key: "uqj9uw",
        },
      ],
      ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
      ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }],
    ],
  };
lR.node;
let lF = Q(lR);
var w = x("aIIwE");
let lB = {
  name: "check",
  size: 24,
  node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]],
};
lB.node;
let lH = Q(lB),
  lU = {
    name: "external-link",
    size: 24,
    node: [
      ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
      ["path", { d: "M10 14 21 3", key: "gplh6r" }],
      [
        "path",
        {
          d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
          key: "a6xqqp",
        },
      ],
    ],
  };
lU.node;
let l_ = Q(lU);
var w = x("aIIwE");
let lq = {
  name: "house",
  size: 24,
  node: [
    [
      "path",
      { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" },
    ],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        key: "r6nss1",
      },
    ],
  ],
  aliases: ["home"],
};
lq.node;
let lW = Q(lq),
  lV = {
    name: "shopping-bag",
    size: 24,
    node: [
      ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
      ["path", { d: "M3.103 6.034h17.794", key: "awc11p" }],
      [
        "path",
        {
          d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
          key: "o988cm",
        },
      ],
    ],
  };
lV.node;
let lQ = Q(lV),
  lK = {
    name: "tag",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
          key: "vktsd0",
        },
      ],
      [
        "circle",
        { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" },
      ],
    ],
  };
lK.node;
let lY = Q(lK),
  lG = (e) => `cat.${e}`;
function lJ() {
  let { t: e, content: t } = nm();
  return t.settings.conceptNotice
    ? (0, k.jsx)("div", {
        className: "bg-flick text-ink",
        children: (0, k.jsxs)("div", {
          className:
            "mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-1.5 text-center text-[12px] font-medium leading-snug sm:px-6 sm:py-2 sm:text-[13px]",
          children: [
            (0, k.jsx)("span", { children: e("concept.text") }),
            (0, k.jsx)("a", {
              href: nk("admin"),
              className: "font-bold underline underline-offset-2",
              children: e("concept.admin"),
            }),
          ],
        }),
      })
    : null;
}
function lX() {
  let { bag: e } = nm();
  return e.reduce((e, t) => e + t.qty, 0);
}
function lZ({ route: e }) {
  let { t: t, lang: n, setLang: r, setBagOpen: a } = nm(),
    l = lX(),
    o = e[0] ?? "";
  return (0, k.jsx)("header", {
    className:
      "sticky top-0 z-40 border-b bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80",
    children: (0, k.jsxs)("div", {
      className: "mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6",
      children: [
        (0, k.jsx)("a", {
          href: nk(""),
          "aria-label": t("nav.home.aria"),
          className: "shrink-0 rounded-md",
          children: (0, k.jsx)(nh, { className: "h-10" }),
        }),
        (0, k.jsx)("nav", {
          className: "ms-4 hidden items-center gap-1 md:flex",
          "aria-label": t("nav.menu"),
          children: [
            { path: "shop", key: "nav.shop", match: "shop" },
            { path: "offers", key: "nav.offers", match: "offers" },
            { path: "trade-in", key: "nav.tradein", match: "trade-in" },
            { path: "maintenance", key: "nav.maint", match: "maintenance" },
          ].map((e) =>
            (0, k.jsx)(
              "a",
              {
                href: nk(e.path),
                "aria-current": o === e.match ? "page" : void 0,
                className: t0(
                  "rounded-lg px-3 py-2 text-[15px] font-medium text-dust transition-colors hover:text-paper",
                  o === e.match && "text-flick hover:text-flick",
                ),
                children: t(e.key),
              },
              e.path,
            ),
          ),
        }),
        (0, k.jsxs)("div", {
          className: "ms-auto flex items-center gap-1.5",
          children: [
            (0, k.jsx)("button", {
              type: "button",
              onClick: () => r("ar" === n ? "en" : "ar"),
              className:
                "h-10 rounded-lg px-3 text-sm font-semibold text-paper hover:bg-shelf-2",
              "aria-label": t("lang.switch.aria"),
              lang: "ar" === n ? "en" : "ar",
              children: t("lang.switch"),
            }),
            (0, k.jsxs)("button", {
              type: "button",
              onClick: () => a(!0),
              className:
                "relative hidden h-10 items-center gap-2 rounded-lg bg-shelf-2 px-3 text-sm font-semibold text-paper hover:bg-shelf md:inline-flex",
              children: [
                (0, k.jsx)(lQ, { className: "size-[18px]", "aria-hidden": !0 }),
                t("nav.bag"),
                (0, k.jsx)("span", {
                  className: t0(
                    "num grid min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold",
                    l ? "bg-flick text-ink" : "bg-ink text-dust",
                  ),
                  children: l,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function l$({ route: e }) {
  let { t: t, setBagOpen: n } = nm(),
    r = lX(),
    a = e[0] ?? "",
    l = [
      { path: "", key: "nav.home", icon: lW, match: "" },
      { path: "shop", key: "nav.shop", icon: ev, match: "shop" },
      { path: "offers", key: "nav.offers", icon: lY, match: "offers" },
      { path: "maintenance", key: "nav.maint", icon: ew, match: "maintenance" },
    ],
    o =
      "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium";
  return (0, k.jsx)("nav", {
    className:
      "fixed inset-x-0 bottom-0 z-40 border-t bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden",
    "aria-label": t("nav.menu"),
    children: (0, k.jsxs)("div", {
      className: "mx-auto flex max-w-md px-2",
      children: [
        l.map((e) => {
          let n = a === e.match || ("shop" === e.match && "p" === a);
          return (0, k.jsxs)(
            "a",
            {
              href: nk(e.path),
              "aria-current": n ? "page" : void 0,
              className: t0(o, n ? "text-flick" : "text-dust"),
              children: [
                (0, k.jsx)(e.icon, { className: "size-5", "aria-hidden": !0 }),
                t(e.key),
              ],
            },
            e.key,
          );
        }),
        (0, k.jsxs)("button", {
          type: "button",
          onClick: () => n(!0),
          className: t0(o, "relative text-dust"),
          children: [
            (0, k.jsxs)("span", {
              className: "relative",
              children: [
                (0, k.jsx)(lQ, { className: "size-5", "aria-hidden": !0 }),
                r > 0 &&
                  (0, k.jsx)("span", {
                    className:
                      "num absolute -end-2.5 -top-1.5 grid min-w-[18px] place-items-center rounded-full bg-flick px-1 text-[10px] font-bold leading-[18px] text-ink",
                    children: r,
                  }),
              ],
            }),
            t("nav.bag"),
          ],
        }),
      ],
    }),
  });
}
function l0() {
  let { t: e, lang: t, content: n } = nm(),
    r = n.settings;
  return (0, k.jsxs)("footer", {
    className: "mt-20 border-t bg-shelf pb-24 md:pb-0",
    children: [
      (0, k.jsxs)("div", {
        className:
          "mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]",
        children: [
          (0, k.jsxs)("div", {
            children: [
              (0, k.jsx)(nh, { className: "h-14" }),
              (0, k.jsxs)("p", {
                className:
                  "mt-4 font-display text-2xl leading-tight text-paper",
                children: [e("hero.l1"), " ", e("hero.l2")],
              }),
            ],
          }),
          (0, k.jsxs)("div", {
            children: [
              (0, k.jsx)("h2", {
                className: "mb-3 text-sm font-semibold text-paper",
                children: e("footer.contact"),
              }),
              (0, k.jsx)("ul", {
                className: "space-y-2 text-sm text-dust",
                children: n.branches.map((n) =>
                  (0, k.jsxs)(
                    "li",
                    {
                      className: "flex items-center justify-between gap-3",
                      children: [
                        (0, k.jsxs)("span", {
                          className: "flex items-center gap-1.5",
                          children: [
                            eZ(n.name, t),
                            n.maps &&
                              (0, k.jsx)("a", {
                                href: n.maps,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-dust hover:text-flick",
                                "aria-label": `${e("branches.map")}: ${eZ(n.name, t)}`,
                                children: (0, k.jsx)(eo, {
                                  className: "size-3.5",
                                  "aria-hidden": !0,
                                }),
                              }),
                          ],
                        }),
                        (0, k.jsx)("a", {
                          href: eW(n.phone),
                          className: "num hover:text-paper",
                          dir: "ltr",
                          children: n.phone,
                        }),
                      ],
                    },
                    n.id,
                  ),
                ),
              }),
            ],
          }),
          (0, k.jsxs)("div", {
            children: [
              (0, k.jsx)("h2", {
                className: "mb-3 text-sm font-semibold text-paper",
                children: e("footer.pages"),
              }),
              (0, k.jsx)("ul", {
                className: "space-y-2 text-sm text-dust",
                children: [
                  ["shop", "nav.shop"],
                  ["offers", "nav.offers"],
                  ["trade-in", "nav.tradein"],
                  ["maintenance", "nav.maint"],
                  ["admin", "nav.admin"],
                ].map(([t, n]) =>
                  (0, k.jsx)(
                    "li",
                    {
                      children: (0, k.jsx)("a", {
                        href: nk(t),
                        className: "hover:text-paper",
                        children: e(n),
                      }),
                    },
                    t,
                  ),
                ),
              }),
            ],
          }),
          (0, k.jsxs)("div", {
            children: [
              (0, k.jsx)("h2", {
                className: "mb-3 text-sm font-semibold text-paper",
                children: e("footer.follow"),
              }),
              (0, k.jsxs)("ul", {
                className: "space-y-2 text-sm text-dust",
                children: [
                  (0, k.jsx)("li", {
                    children: (0, k.jsxs)("a", {
                      href: r.instagram,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className:
                        "inline-flex items-center gap-2 hover:text-paper",
                      children: [
                        (0, k.jsx)(lz, {
                          className: "size-4",
                          "aria-hidden": !0,
                        }),
                        " ",
                        (0, k.jsx)("bdi", {
                          dir: "ltr",
                          children: "@flickmobile_",
                        }),
                      ],
                    }),
                  }),
                  (0, k.jsx)("li", {
                    children: (0, k.jsx)("a", {
                      href: r.threads,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "hover:text-paper",
                      children: "Threads",
                    }),
                  }),
                  (0, k.jsx)("li", {
                    className: "pt-1 text-xs",
                    children: eZ(r.instagramFollowers, t),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      (0, k.jsx)("div", {
        className: "border-t",
        children: (0, k.jsxs)("div", {
          className:
            "mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-5 text-xs text-dust sm:px-6",
          children: [
            (0, k.jsx)("span", { children: "© 2026 FLiCK Mobile" }),
            r.conceptNotice &&
              (0, k.jsx)("span", { children: e("footer.concept") }),
          ],
        }),
      }),
    ],
  });
}
function l1({ product: e, className: t, variantKey: n }) {
  let { t: r, lang: a, addToBag: l, setBagOpen: o } = nm(),
    i = (n && e.variants.find((e) => e.key === n)) || eA(e),
    s = nk(
      `p/${encodeURIComponent(e.id)}${n ? `/${encodeURIComponent(i.key)}` : ""}`,
    ),
    c = n
      ? flickDeviceFeatures.available(i)
      : e.variants.some((e) => flickDeviceFeatures.available(e)),
    u = eZ(e.name, a),
    d = e.variants.length - 1;
  return (0, k.jsxs)("article", {
    className: t0("flick-product-card group flex min-w-0 flex-col", t),
    children: [
      (0, k.jsxs)("a", {
        href: s,
        className:
          "relative block rounded-[14px] focus-visible:outline-offset-4",
        "aria-label": `${r("card.view")}: ${u}`,
        children: [
          (0, k.jsx)(nv, {
            product: e,
            className:
              "aspect-square rounded-[14px] transition-transform duration-300 group-hover:scale-[1.015]",
          }),
          eP(i) &&
            c &&
            (0, k.jsx)("span", {
              className:
                "absolute start-2.5 top-2.5 rounded-full bg-sale px-2.5 py-1 text-xs font-bold text-white",
              children: r("offer.badge"),
            }),
          !c &&
            (0, k.jsx)("span", {
              className:
                "absolute inset-x-2.5 bottom-2.5 rounded-lg bg-ink/85 py-1.5 text-center text-xs font-semibold text-paper",
              children: r("card.soldout"),
            }),
        ],
      }),
      (0, k.jsxs)("div", {
        className:
          "mt-3 flex min-h-[18px] items-center justify-between gap-2 text-xs text-dust",
        children: [
          (0, k.jsx)("span", {
            className: "truncate",
            children: e.brand || r(lG(e.cat)),
          }),
          (d > 0 || "std" !== i.key) &&
            (0, k.jsxs)("span", {
              className: "shrink-0",
              children: [
                (0, k.jsx)("bdi", { children: eZ(i.label, a) }),
                d > 0 &&
                  (0, k.jsx)("span", {
                    className: "ms-1.5 opacity-80",
                    children: (0, k.jsxs)("bdi", {
                      dir: "ltr",
                      children: ["+", d],
                    }),
                  }),
              ],
            }),
        ],
      }),
      (0, k.jsx)("h3", {
        className:
          "mt-1 min-h-[2.6em] text-[15px] font-semibold leading-[1.3] text-paper",
        children: (0, k.jsx)("a", {
          href: s,
          className: "line-clamp-2 hover:underline",
          dir: "auto",
          children: u,
        }),
      }),
      (0, k.jsx)(FlickCardSummary, { product: e, variant: i }),
      (0, k.jsxs)("div", {
        className: "mt-auto pt-3",
        children: [
          (0, k.jsx)(nb, { variant: i, size: "sm" }),
          (0, k.jsx)("button", {
            type: "button",
            onClick: () => {
              if (e.variants.length > 1) {
                location.hash = s;
                return;
              }
              (l(e.id, i.key),
                D.success(r("card.added", { name: u }), {
                  action: { label: r("bag.title"), onClick: () => o(!0) },
                }));
            },
            disabled: !c,
            className:
              "mt-3 h-10 w-full rounded-[10px] bg-shelf-2 px-3 text-sm font-semibold text-paper transition-colors hover:bg-flick hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-shelf-2 disabled:hover:text-paper",
            children: c
              ? e.variants.length > 1
                ? r("card.chooseOptions")
                : r("card.add")
              : r("card.soldout"),
          }),
        ],
      }),
    ],
  });
}
function l2() {
  let { content: e } = nm();
  return (0, w.useMemo)(
    () => e.products.filter((e) => e.visible),
    [e.products],
  );
}
const flickDeviceFeatures = window.FlickDeviceFeatures;
const {
  VariantPicker: FlickVariantPicker,
  Details: FlickDeviceDetails,
  VariantEditor: FlickVariantEditor,
  ProductEditor: FlickProductEditor,
  CardSummary: FlickCardSummary,
} = flickDeviceFeatures.createComponents(w, k, nm);
// Pause decorative device motion when the hero is offscreen or the tab is hidden.
function useFlickDeviceMotion() {
  const ref = w.useRef(null);
  w.useEffect(() => {
    const hero = ref.current;
    if (!hero) return;
    let inView = false;
    const sync = () => {
      hero.dataset.motionActive = String(inView && !document.hidden);
    };
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            sync();
          })
        : null;
    if (observer) observer.observe(hero);
    else {
      inView = true;
      sync();
    }
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return { ref };
}
// Homepage categories are curated independently from the complete shop catalog.
function isFlickHomeCategory(category) {
  return category !== "speakers" && category !== "accessories";
}
function l3({ className: e }) {
  return (0, k.jsxs)("svg", {
    viewBox: "0 0 64 64",
    className: e,
    "aria-hidden": !0,
    children: [
      (0, k.jsx)("circle", { cx: "32", cy: "32", r: "30", fill: "#F6F5F0" }),
      (0, k.jsx)("path", {
        d: "M32 19 l10 7 -4 12 h-12 l-4 -12 z",
        fill: "#12110E",
      }),
      (0, k.jsx)("path", {
        d: "M32 2 v6 M8 18 l6 4 M56 18 l-6 4 M14 52 l5 -5 M50 52 l-5 -5",
        stroke: "#12110E",
        strokeWidth: "3",
      }),
      (0, k.jsx)("path", {
        d: "M42 26 l12 -4 M22 26 l-12 -4 M26 38 l-6 10 M38 38 l6 10",
        stroke: "#12110E",
        strokeWidth: "2.5",
      }),
      (0, k.jsx)("circle", {
        cx: "32",
        cy: "32",
        r: "30",
        fill: "none",
        stroke: "#12110E",
        strokeWidth: "2",
      }),
    ],
  });
}
function l5({ full: e = !1 }) {
  let { t: t, lang: n, content: r } = nm(),
    a = r.campaign,
    l = eQ(a);
  if ("off" === l || "over" === l) return null;
  let o = eK(a),
    i = r.branches.find((e) => e.id === a.drawBranch);
  return (0, k.jsx)("section", {
    className: "mx-auto w-full max-w-6xl px-4 sm:px-6",
    children: (0, k.jsx)("div", {
      className:
        "relative overflow-hidden rounded-[22px] border-2 border-flick bg-shelf p-5 sm:p-8",
      children: (0, k.jsxs)("div", {
        className: "grid gap-8 md:grid-cols-[1.2fr_1fr]",
        children: [
          (0, k.jsxs)("div", {
            children: [
              (0, k.jsxs)("div", {
                className: "flex flex-wrap items-center gap-3",
                children: [
                  (0, k.jsx)(l3, { className: "size-11 shrink-0" }),
                  (0, k.jsx)("span", {
                    className:
                      "badge-shape bg-flick px-3 pb-1 pt-1.5 font-display text-lg leading-none text-ink",
                    children:
                      "soon" === l
                        ? t("campaign.soon", { date: eY(a.start) })
                        : o <= 1
                          ? t("campaign.lastDay")
                          : t("campaign.left", { n: o }),
                  }),
                ],
              }),
              (0, k.jsx)("h2", {
                className:
                  "mt-4 font-display text-[clamp(36px,7vw,58px)] leading-[1.05] text-flick",
                children: eZ(a.title, n),
              }),
              (0, k.jsx)("p", {
                className:
                  "mt-3 max-w-xl text-[17px] leading-relaxed text-paper",
                children: t("campaign.rule", { min: a.minInvoice }),
              }),
              (0, k.jsxs)("ul", {
                className: "mt-5 space-y-1.5 text-sm text-dust",
                children: [
                  (0, k.jsx)("li", {
                    className: "num",
                    children: t("campaign.dates", {
                      start: eY(a.start),
                      end: eY(a.end),
                    }),
                  }),
                  i &&
                    (0, k.jsx)("li", {
                      children: t("campaign.draw", { branch: eZ(i.name, n) }),
                    }),
                  a.approval &&
                    (0, k.jsxs)("li", {
                      className: "num",
                      children: [
                        t("campaign.approval", { no: "" }),
                        (0, k.jsx)("bdi", {
                          className: "whitespace-nowrap",
                          dir: "ltr",
                          children: a.approval,
                        }),
                      ],
                    }),
                ],
              }),
              (0, k.jsxs)("div", {
                className: "mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm",
                children: [
                  !e &&
                    (0, k.jsx)("a", {
                      href: nk("offers"),
                      className:
                        "font-semibold text-flick underline underline-offset-4",
                      children: t("campaign.more"),
                    }),
                  e &&
                    a.source &&
                    (0, k.jsxs)("a", {
                      href: a.source,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className:
                        "inline-flex items-center gap-1.5 font-semibold text-flick underline underline-offset-4",
                      children: [
                        t("campaign.source"),
                        " ",
                        (0, k.jsx)(l_, {
                          className: "size-3.5",
                          "aria-hidden": !0,
                        }),
                      ],
                    }),
                ],
              }),
            ],
          }),
          (0, k.jsxs)("div", {
            children: [
              (0, k.jsx)("h3", {
                className: "mb-3 text-sm font-semibold text-paper",
                children: t("campaign.prizes"),
              }),
              (0, k.jsx)("ul", {
                className: "flex flex-wrap gap-2",
                children: a.prizes
                  .filter(
                    (prize) =>
                      e ||
                      ![
                        "Speakers",
                        "Power banks",
                        "Cables and chargers",
                      ].includes(prize.en),
                  )
                  .map((e, t) =>
                    (0, k.jsx)(
                      "li",
                      {
                        className:
                          "rounded-full border px-3.5 py-1.5 text-[15px] text-paper",
                        children: (0, k.jsx)("bdi", { children: eZ(e, n) }),
                      },
                      t,
                    ),
                  ),
              }),
            ],
          }),
        ],
      }),
    }),
  });
}
function l6(e) {
  return e
    .filter((e) => e.visible && eM(e))
    .sort((e, t) => eL(t) - eL(e))
    .map((e) => {
      let t = [...e.variants]
        .filter((e) => eP(e) && window.FlickDeviceFeatures.available(e))
        .sort(
          (e, t) =>
            t.price - (t.offerPrice ?? 0) - (e.price - (e.offerPrice ?? 0)),
        )[0];
      return { product: e, variantKey: t?.key ?? e.variants[0].key };
    });
}
function l9() {
  let { t: e, lang: t, content: n } = nm(),
    r = (0, w.useMemo)(
      () =>
        l6(n.products)
          .filter(({ product }) => isFlickHomeCategory(product.cat))
          .slice(0, 10),
      [n.products],
    ),
    a = (0, w.useRef)(null),
    l = (e) => {
      let n = a.current;
      n &&
        n.scrollBy({
          left: e * ("ar" === t ? -1 : 1) * n.clientWidth * 0.8,
          behavior: "smooth",
        });
    };
  return (0, k.jsx)(nx, {
    title: e("offers.title"),
    action: (0, k.jsxs)("div", {
      className: "flex items-center gap-2",
      children: [
        (0, k.jsx)("a", {
          href: nk("offers"),
          className: "text-sm font-semibold text-flick hover:underline",
          children: e("offers.all"),
        }),
        r.length > 2 &&
          (0, k.jsxs)("div", {
            className: "hidden gap-1 md:flex",
            children: [
              (0, k.jsx)("button", {
                type: "button",
                onClick: () => l(-1),
                className:
                  "grid size-9 place-items-center rounded-full border hover:bg-shelf-2",
                "aria-label": "ar" === t ? "السابق" : "Previous",
                children:
                  "ar" === t
                    ? (0, k.jsx)(J, { className: "size-4" })
                    : (0, k.jsx)(Y, { className: "size-4" }),
              }),
              (0, k.jsx)("button", {
                type: "button",
                onClick: () => l(1),
                className:
                  "grid size-9 place-items-center rounded-full border hover:bg-shelf-2",
                "aria-label": "ar" === t ? "التالي" : "Next",
                children:
                  "ar" === t
                    ? (0, k.jsx)(Y, { className: "size-4" })
                    : (0, k.jsx)(J, { className: "size-4" }),
              }),
            ],
          }),
      ],
    }),
    children:
      0 === r.length
        ? (0, k.jsx)("p", {
            className: "rounded-[14px] border p-5 text-dust",
            children: e("offers.empty"),
          })
        : (0, k.jsx)("div", {
            ref: a,
            className:
              "shelf-scroll -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6",
            children: r.map(({ product: e, variantKey: t }) =>
              (0, k.jsx)(
                l1,
                {
                  product: e,
                  variantKey: t,
                  className:
                    "w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[calc(25%-12px)]",
                },
                e.id,
              ),
            ),
          }),
  });
}
function l8() {
  let { t: e, lang: t } = nm(),
    n = l2();
  return (0, k.jsxs)("section", {
    className: "flick-categories flick-section",
    "aria-labelledby": "flick-categories-title",
    children: [
      (0, k.jsxs)("div", {
        className: "flick-section-heading",
        children: [
          (0, k.jsx)("h2", {
            id: "flick-categories-title",
            children: e("cats.ask"),
          }),
          (0, k.jsx)("a", {
            href: nk("shop"),
            className: "flick-text-link",
            children: e("cats.all"),
          }),
        ],
      }),
      (0, k.jsx)("div", {
        className: "flick-category-grid",
        children: ez
          .filter((e) => isFlickHomeCategory(e.id))
          .map((e) => {
            let r = n.filter((t) => t.cat === e.id),
              a =
                r.find((t) => t.id === e.pictureId) ??
                r.find((e) => eC(e)) ??
                r[0];
            return a
              ? (0, k.jsxs)(
                  "a",
                  {
                    href: nk(`shop/${e.id}`),
                    className: "flick-category-card",
                    "aria-label": e[t],
                    children: [
                      (0, k.jsx)("div", {
                        className: "flick-category-picture",
                        children: (0, k.jsx)(nv, {
                          product: a,
                          className: "flick-category-media",
                        }),
                      }),
                      (0, k.jsx)("h3", {
                        className: "flick-category-name",
                        children: e[t],
                      }),
                    ],
                  },
                  e.id,
                )
              : null;
          }),
      }),
    ],
  });
}
function l7() {
  let { t: e } = nm(),
    t = l2(),
    n = (0, w.useMemo)(() => {
      let e = t.filter((e) => isFlickHomeCategory(e.cat) && !eM(e)),
        n = e.filter((e) => e.featured),
        r = e.filter((e) => !e.featured);
      return [...n, ...r].slice(0, 8);
    }, [t]);
  return (0, k.jsx)(nx, {
    title: e("featured.title"),
    action: (0, k.jsx)("a", {
      href: nk("shop"),
      className: "text-sm font-semibold text-flick hover:underline",
      children: e("featured.all"),
    }),
    children: (0, k.jsx)("div", {
      className:
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4",
      children: n.map((e) => (0, k.jsx)(l1, { product: e }, e.id)),
    }),
  });
}
function oe() {
  let { t: e, content: t } = nm();
  return (0, k.jsx)("section", {
    className: "mx-auto w-full max-w-6xl px-4 sm:px-6",
    children: (0, k.jsxs)("div", {
      className:
        "grid items-center gap-6 rounded-[22px] border bg-shelf p-5 sm:p-8 md:grid-cols-[1fr_280px]",
      children: [
        (0, k.jsxs)("div", {
          children: [
            (0, k.jsx)("h2", {
              className:
                "font-display text-[clamp(30px,6vw,44px)] leading-[1.1]",
              children: e("tradein.title"),
            }),
            (0, k.jsx)("p", {
              className: "mt-3 max-w-xl text-[16px] leading-relaxed text-dust",
              children: e("tradein.body"),
            }),
            (0, k.jsx)("ul", {
              className: "mt-5 grid gap-2 sm:grid-cols-3",
              children: ["tradein.p1", "tradein.p2", "tradein.p3"].map((t) =>
                (0, k.jsxs)(
                  "li",
                  {
                    className: "flex items-start gap-2 text-sm text-paper",
                    children: [
                      (0, k.jsx)(lH, {
                        className: "mt-0.5 size-4 shrink-0 text-flick",
                        "aria-hidden": !0,
                      }),
                      e(t),
                    ],
                  },
                  t,
                ),
              ),
            }),
            (0, k.jsxs)("a", {
              href: t.settings.tradeInUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className:
                "mt-6 inline-flex h-12 items-center gap-2 rounded-[10px] bg-flick px-5 text-[15px] font-bold text-ink hover:bg-flick/90",
              children: [
                e("tradein.cta"),
                (0, k.jsx)(l_, { className: "size-4", "aria-hidden": !0 }),
              ],
            }),
            (0, k.jsx)("p", {
              className: "mt-2 text-xs text-dust",
              children: e("tradein.ext"),
            }),
          ],
        }),
        (0, k.jsxs)("div", {
          className: t0(
            "relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-[18px]",
            "bg-[radial-gradient(ellipse_at_50%_30%,#FAF9F6_0%,#ECEAE5_58%,#DEDBD4_100%)]",
          ),
          children: [
            (0, k.jsx)(nv, {
              product: t.products.find((e) => "iphone-16" === e.id) ?? {
                id: "trade-in",
                name: { ar: "جهازك الحالي", en: "Your current device" },
              },
              className: "size-full",
            }),
            (0, k.jsx)("span", {
              className:
                "badge-shape absolute end-4 top-4 bg-ink px-4 pb-1.5 pt-2 font-display text-[26px] leading-none text-flick",
              children: "؟",
            }),
          ],
        }),
      ],
    }),
  });
}
function ot({ b: e }) {
  let { t: t, lang: n } = nm();
  return (0, k.jsxs)("li", {
    className: "flex flex-col rounded-[14px] border bg-shelf p-4",
    children: [
      (0, k.jsxs)("div", {
        className: "flex items-start justify-between gap-2",
        children: [
          (0, k.jsx)("h3", {
            className: "font-display text-[24px] leading-tight text-paper",
            children: eZ(e.name, n),
          }),
          e.main &&
            (0, k.jsx)("span", {
              className:
                "badge-shape shrink-0 bg-flick px-2 pb-0.5 pt-1 text-xs font-bold text-ink",
              children: t("branches.main"),
            }),
        ],
      }),
      (0, k.jsx)("p", {
        className: "num mt-1 select-all text-[17px] text-dust",
        dir: "ltr",
        style: { textAlign: "ar" === n ? "right" : "left" },
        children: e.phone,
      }),
      (0, k.jsxs)("div", {
        className: "mt-4 flex flex-wrap gap-2",
        children: [
          (0, k.jsxs)("a", {
            href: eW(e.phone),
            className:
              "inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-shelf-2 px-3 text-sm font-semibold hover:bg-flick hover:text-ink",
            children: [
              (0, k.jsx)(ef, { className: "size-4", "aria-hidden": !0 }),
              t("branches.call"),
            ],
          }),
          e.whatsapp &&
            (0, k.jsxs)("a", {
              href: eq(e.phone),
              target: "_blank",
              rel: "noopener noreferrer",
              className:
                "inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-shelf-2 px-3 text-sm font-semibold hover:bg-flick hover:text-ink",
              children: [
                (0, k.jsx)(eu, { className: "size-4", "aria-hidden": !0 }),
                t("branches.whatsapp"),
              ],
            }),
          e.maps &&
            (0, k.jsxs)("a", {
              href: e.maps,
              target: "_blank",
              rel: "noopener noreferrer",
              className:
                "inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-shelf-2 px-3 text-sm font-semibold hover:bg-flick hover:text-ink",
              children: [
                (0, k.jsx)(eo, { className: "size-4", "aria-hidden": !0 }),
                t("branches.map"),
              ],
            }),
        ],
      }),
    ],
  });
}
function on() {
  let { t: e, lang: t, content: n } = nm();
  return (0, k.jsx)("section", {
    className: "mx-auto w-full max-w-6xl px-4 sm:px-6",
    children: (0, k.jsxs)("div", {
      className:
        "flex flex-col items-start justify-between gap-4 rounded-[22px] bg-flick p-5 text-ink sm:flex-row sm:items-center sm:p-7",
      children: [
        (0, k.jsxs)("div", {
          className: "flex items-center gap-4",
          children: [
            (0, k.jsx)(nh, { className: "h-12 shrink-0" }),
            (0, k.jsxs)("div", {
              children: [
                (0, k.jsx)("p", {
                  className: "font-display text-[26px] leading-tight",
                  children: e("insta.follow"),
                }),
                (0, k.jsx)("p", {
                  className: "text-sm font-semibold",
                  children: (0, k.jsx)("bdi", {
                    dir: "ltr",
                    children: "@flickmobile_",
                  }),
                }),
                (0, k.jsx)("p", {
                  className: "text-sm",
                  children: eZ(n.settings.instagramFollowers, t),
                }),
              ],
            }),
          ],
        }),
        (0, k.jsxs)("a", {
          href: n.settings.instagram,
          target: "_blank",
          rel: "noopener noreferrer",
          className:
            "inline-flex h-11 items-center gap-2 rounded-[10px] bg-ink px-5 text-sm font-bold text-flick",
          children: [
            e("insta.cta"),
            (0, k.jsx)(l_, { className: "size-4", "aria-hidden": !0 }),
          ],
        }),
      ],
    }),
  });
}
function or() {
  return (0, k.jsxs)(k.Fragment, {
    children: [
      (0, k.jsx)(l4, {}),
      (0, k.jsxs)("div", {
        className: "flick-home-content mt-10 space-y-16 md:mt-14 md:space-y-20",
        children: [
          (0, k.jsx)(l8, {}),
          (0, k.jsx)(l9, {}),
          (0, k.jsx)(l7, {}),
          (0, k.jsx)(l5, {}),
          (0, k.jsx)(oe, {}),
          (0, k.jsx)(oc, {}),
          (0, k.jsx)(on, {}),
        ],
      }),
    ],
  });
}
let oa = [
    { key: "screen", icon: lM },
    { key: "battery", icon: lE },
    { key: "charging", icon: lD },
    { key: "camera", icon: lz },
    { key: "audio", icon: lF },
    { key: "software", icon: lP },
    { key: "water", icon: lA },
    { key: "other", icon: ew },
  ],
  ol = (e) => `maint.issue.${e}`,
  oo = (e) => `mstatus.${e}`,
  oi = ["new", "received", "repairing", "ready"],
  os =
    "mt-1.5 block h-11 w-full rounded-[10px] border border-input bg-shelf-2 px-3 text-[15px] text-paper placeholder:text-dust/70 focus:border-flick focus:outline-none";
function oc() {
  let { t: e } = nm();
  return (0, k.jsx)("section", {
    className: "mx-auto w-full max-w-6xl px-4 sm:px-6",
    children: (0, k.jsxs)("div", {
      className:
        "grid gap-6 rounded-[22px] border bg-shelf p-5 sm:p-8 md:grid-cols-[1fr_1.15fr] md:items-center",
      children: [
        (0, k.jsxs)("div", {
          children: [
            (0, k.jsx)("div", {
              className:
                "mb-4 grid size-12 place-items-center rounded-[12px] bg-flick text-ink",
              children: (0, k.jsx)(ew, {
                className: "size-6",
                "aria-hidden": !0,
              }),
            }),
            (0, k.jsx)("h2", {
              className:
                "font-display text-[clamp(30px,6vw,44px)] leading-[1.1]",
              children: e("maint.title"),
            }),
            (0, k.jsx)("p", {
              className: "mt-3 max-w-md text-[16px] leading-relaxed text-dust",
              children: e("maint.homeSub"),
            }),
            (0, k.jsxs)("div", {
              className: "mt-6 flex flex-wrap gap-2",
              children: [
                (0, k.jsx)("a", {
                  href: nk("maintenance"),
                  className:
                    "inline-flex h-12 items-center rounded-[10px] bg-flick px-5 text-[15px] font-bold text-ink hover:bg-flick/90",
                  children: e("maint.cta"),
                }),
                (0, k.jsx)("a", {
                  href: nk("maintenance/track"),
                  className:
                    "inline-flex h-12 items-center rounded-[10px] border-2 border-flick px-4 text-[15px] font-bold text-flick hover:bg-flick/10",
                  children: e("maint.trackCta"),
                }),
              ],
            }),
          ],
        }),
        (0, k.jsx)("ul", {
          className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
          children: oa.map(({ key: t, icon: n }) =>
            (0, k.jsx)(
              "li",
              {
                children: (0, k.jsxs)("a", {
                  href: nk(`maintenance/${t}`),
                  className:
                    "flex h-full flex-col items-start gap-2 rounded-[12px] border bg-ink p-3 text-[14px] font-semibold text-paper transition-colors hover:border-flick hover:text-flick",
                  children: [
                    (0, k.jsx)(n, {
                      className: "size-5 text-flick",
                      "aria-hidden": !0,
                    }),
                    e(ol(t)),
                  ],
                }),
              },
              t,
            ),
          ),
        }),
      ],
    }),
  });
}
function ou({ current: e }) {
  let { t: t } = nm(),
    n = e ? oi.indexOf("delivered" === e ? "ready" : e) : -1;
  return (0, k.jsx)("ol", {
    className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
    children: oi.map((r, a) =>
      (0, k.jsxs)(
        "li",
        {
          className: t0(
            "flex items-center gap-2 rounded-[10px] border px-3 py-2.5 text-[13px] font-semibold",
            e && a <= n ? "border-flick bg-flick/10 text-paper" : "text-dust",
          ),
          "aria-current": e && a === n ? "step" : void 0,
          children: [
            (0, k.jsx)("span", {
              className: t0(
                "num grid size-6 shrink-0 place-items-center rounded-full text-xs",
                e && a <= n ? "bg-flick text-ink" : "bg-shelf-2",
              ),
              children: a + 1,
            }),
            t(oo(r)),
          ],
        },
        r,
      ),
    ),
  });
}
function flickDemoMaintenanceTracker() {
  let { t: e, maint: t } = nm(),
    [n, r] = (0, w.useState)(""),
    [a, l] = (0, w.useState)(""),
    [o, i] = (0, w.useState)(null);
  return (0, k.jsxs)("section", {
    id: "track",
    className: "rounded-[18px] border bg-shelf p-5 sm:p-6",
    children: [
      (0, k.jsx)("h2", {
        className: "font-display text-[28px] leading-tight",
        children: e("maint.track"),
      }),
      (0, k.jsxs)("form", {
        onSubmit: (e) => {
          e.preventDefault();
          let r = n.trim().toUpperCase().replace(/^M?-?/, "M-");
          i(
            t.find((e) => e.id === r && eB(e.phone) === eB(a).trim()) ?? "none",
          );
        },
        className: "mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end",
        noValidate: !0,
        children: [
          (0, k.jsxs)("label", {
            className: "block text-sm font-medium",
            children: [
              e("maint.trackId"),
              (0, k.jsx)("input", {
                id: "mt-track-id",
                className: t0(os, "num"),
                dir: "ltr",
                placeholder: "M-1003",
                value: n,
                onChange: (e) => r(eB(e.target.value)),
              }),
            ],
          }),
          (0, k.jsxs)("label", {
            className: "block text-sm font-medium",
            children: [
              e("checkout.phone"),
              (0, k.jsx)("input", {
                id: "mt-track-phone",
                className: t0(os, "num"),
                dir: "ltr",
                inputMode: "tel",
                placeholder: "07XXXXXXXX",
                value: a,
                onChange: (e) => l(eB(e.target.value)),
              }),
            ],
          }),
          (0, k.jsx)("button", {
            type: "submit",
            className:
              "h-11 rounded-[10px] bg-flick px-5 text-sm font-bold text-ink",
            children: e("maint.trackGo"),
          }),
        ],
      }),
      (0, k.jsxs)("div", {
        "aria-live": "polite",
        className: "mt-4",
        children: [
          "none" === o &&
            (0, k.jsx)("p", {
              className: "text-sm text-sale",
              children: e("maint.trackNone"),
            }),
          o &&
            "none" !== o &&
            (0, k.jsxs)("div", {
              className: "space-y-3",
              children: [
                (0, k.jsxs)("p", {
                  className: "text-[15px] font-semibold",
                  children: [
                    e("maint.trackFound", { id: o.id, device: o.device }),
                    ": ",
                    (0, k.jsx)("span", {
                      className: "text-flick",
                      children: e(oo(o.status)),
                    }),
                  ],
                }),
                "cancelled" !== o.status &&
                  (0, k.jsx)(ou, { current: o.status }),
              ],
            }),
        ],
      }),
    ],
  });
}
function of({ issue: e }) {
  let { t: t, lang: n, content: r, placeMaint: a } = nm(),
    l = "track" === e,
    o = oa.some((t) => t.key === e) ? e : "screen",
    [i, s] = (0, w.useState)(o),
    [c, u] = (0, w.useState)(""),
    [d, f] = (0, w.useState)(""),
    [p, m] = (0, w.useState)(""),
    [h, g] = (0, w.useState)(""),
    [b, v] = (0, w.useState)(
      r.branches.find((e) => e.main)?.id ?? r.branches[0]?.id ?? "",
    ),
    [x, y] = (0, w.useState)({}),
    [N, S] = (0, w.useState)(null),
    [submitting, setSubmitting] = (0, w.useState)(false),
    j = (0, w.useMemo)(
      () => (e) => eZ(r.branches.find((t) => t.id === e)?.name, n),
      [r.branches, n],
    ),
    E = (e) =>
      x[e]
        ? (0, k.jsx)("span", {
            className: "mt-1 block text-[13px] text-sale",
            children: x[e],
          })
        : null;
  return (0, k.jsxs)("div", {
    className: "mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12",
    children: [
      (0, k.jsx)("h1", {
        className: "font-display text-[44px] leading-none sm:text-[56px]",
        children: t("maint.title"),
      }),
      (0, k.jsx)("p", {
        className: "mt-3 max-w-2xl text-[16px] leading-relaxed text-dust",
        children: t("maint.sub"),
      }),
      (0, k.jsxs)("div", {
        className: "mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]",
        children: [
          N
            ? (0, k.jsxs)("section", {
                className:
                  "rounded-[18px] border-2 border-flick bg-shelf p-5 sm:p-7",
                children: [
                  (0, k.jsx)(Z, {
                    className: "size-11 text-flick",
                    "aria-hidden": !0,
                  }),
                  (0, k.jsx)("p", {
                    className: "mt-3 font-display text-[30px] leading-tight",
                    children: t("maint.done.title"),
                  }),
                  (0, k.jsx)("p", {
                    className: "mt-3 text-sm text-dust",
                    children: t("done.number"),
                  }),
                  (0, k.jsx)("p", {
                    className:
                      "num font-display text-[40px] leading-none text-flick",
                    dir: "ltr",
                    children: N.id,
                  }),
                  (0, k.jsx)("div", {
                    className: "mt-5",
                    children: (0, k.jsx)(ou, { current: N.status }),
                  }),
                  (0, k.jsx)("p", {
                    className:
                      "mt-5 rounded-[10px] bg-shelf-2 p-3 text-[13px] leading-relaxed text-dust",
                    children: t("done.demo"),
                  }),
                  (0, k.jsxs)("div", {
                    className: "mt-5 flex flex-wrap gap-2",
                    children: [
                      (0, k.jsx)("a", {
                        href: eq(
                          r.settings.whatsapp,
                          t("maint.wamsg", {
                            id: N.id,
                            device: N.device,
                            issue: t(ol(N.issue)),
                            details: N.details ?? "",
                            name: N.name,
                            branch: j(N.branchId),
                          }),
                        ),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className:
                          "inline-flex h-12 items-center rounded-[10px] bg-flick px-5 text-[15px] font-bold text-ink",
                        children: t("maint.done.wa"),
                      }),
                      (0, k.jsx)("button", {
                        type: "button",
                        onClick: () => {
                          (S(null), u(""), f(""));
                        },
                        className:
                          "h-12 rounded-[10px] bg-shelf-2 px-5 text-sm font-semibold",
                        children: t("maint.done.another"),
                      }),
                    ],
                  }),
                ],
              })
            : l
              ? (0, k.jsx)(od, {})
              : (0, k.jsxs)("form", {
                  onSubmit: async (e) => {
                    e.preventDefault();
                    if (submitting) return;
                    let n = {};
                    if (
                      (c.trim().length < 2 &&
                        (n.device = t("maint.err.device")),
                      p.trim().length < 2 && (n.name = t("checkout.err.name")),
                      e_(h) || (n.phone = t("checkout.err.phone")),
                      y(n),
                      Object.keys(n).length)
                    )
                      return void requestAnimationFrame(() =>
                        document
                          .querySelector('[aria-invalid="true"]')
                          ?.focus(),
                      );
                    setSubmitting(true);
                    try {
                      let r = await a({
                        name: p,
                        phone: eB(h),
                        device: c,
                        issue: i,
                        details: d,
                        branchId: b,
                      });
                      r && (S(r), window.scrollTo({ top: 0 }));
                    } finally {
                      setSubmitting(false);
                    }
                  },
                  noValidate: !0,
                  className: "rounded-[18px] border bg-shelf p-5 sm:p-6",
                  children: [
                    (0, k.jsx)("h2", {
                      className: "font-display text-[28px] leading-tight",
                      children: t("maint.form"),
                    }),
                    (0, k.jsxs)("fieldset", {
                      className: "mt-4",
                      children: [
                        (0, k.jsx)("legend", {
                          className: "text-sm font-medium",
                          children: t("maint.issue"),
                        }),
                        (0, k.jsx)("div", {
                          className:
                            "mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4",
                          children: oa.map(({ key: e, icon: n }) =>
                            (0, k.jsxs)(
                              "label",
                              {
                                className: t0(
                                  "flex cursor-pointer items-center gap-2 rounded-[10px] border px-3 py-2.5 text-[13px] font-semibold transition-colors",
                                  i === e
                                    ? "border-flick bg-flick text-ink"
                                    : "bg-shelf-2 hover:border-flick",
                                ),
                                children: [
                                  (0, k.jsx)("input", {
                                    type: "radio",
                                    name: "issue",
                                    value: e,
                                    checked: i === e,
                                    onChange: () => s(e),
                                    className: "sr-only",
                                  }),
                                  (0, k.jsx)(n, {
                                    className: "size-4 shrink-0",
                                    "aria-hidden": !0,
                                  }),
                                  t(ol(e)),
                                ],
                              },
                              e,
                            ),
                          ),
                        }),
                      ],
                    }),
                    (0, k.jsxs)("div", {
                      className: "mt-4 grid gap-4 sm:grid-cols-2",
                      children: [
                        (0, k.jsxs)("label", {
                          className: "block text-sm font-medium sm:col-span-2",
                          children: [
                            t("maint.device"),
                            (0, k.jsx)("input", {
                              id: "mt-device",
                              className: os,
                              dir: "auto",
                              placeholder: t("maint.devicePh"),
                              value: c,
                              maxLength: 60,
                              onChange: (e) => u(e.target.value),
                              "aria-invalid": !!x.device,
                            }),
                            E("device"),
                          ],
                        }),
                        (0, k.jsxs)("label", {
                          className: "block text-sm font-medium sm:col-span-2",
                          children: [
                            t("maint.details"),
                            (0, k.jsx)("textarea", {
                              id: "mt-details",
                              className: t0(os, "h-24 resize-none py-2.5"),
                              value: d,
                              maxLength: 400,
                              onChange: (e) => f(e.target.value),
                            }),
                          ],
                        }),
                        (0, k.jsxs)("label", {
                          className: "block text-sm font-medium",
                          children: [
                            t("checkout.name"),
                            (0, k.jsx)("input", {
                              id: "mt-name",
                              className: os,
                              autoComplete: "name",
                              value: p,
                              onChange: (e) => m(e.target.value),
                              "aria-invalid": !!x.name,
                            }),
                            E("name"),
                          ],
                        }),
                        (0, k.jsxs)("label", {
                          className: "block text-sm font-medium",
                          children: [
                            t("checkout.phone"),
                            (0, k.jsx)("input", {
                              id: "mt-phone",
                              className: t0(os, "num text-start"),
                              dir: "ltr",
                              inputMode: "tel",
                              autoComplete: "tel",
                              placeholder: "07XXXXXXXX",
                              value: h,
                              onChange: (e) => g(eB(e.target.value)),
                              "aria-invalid": !!x.phone,
                            }),
                            E("phone"),
                          ],
                        }),
                        (0, k.jsxs)("label", {
                          className: "block text-sm font-medium sm:col-span-2",
                          children: [
                            t("maint.branch"),
                            (0, k.jsx)("select", {
                              id: "mt-branch",
                              className: os,
                              value: b,
                              onChange: (e) => v(e.target.value),
                              children: r.branches.map((e) =>
                                (0, k.jsx)(
                                  "option",
                                  {
                                    value: e.id,
                                    children: t("branches.branch", {
                                      name: eZ(e.name, n),
                                    }),
                                  },
                                  e.id,
                                ),
                              ),
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, k.jsx)("p", {
                      className: "mt-4 text-[13px] text-dust",
                      children: t("maint.price"),
                    }),
                    (0, k.jsx)("button", {
                      type: "submit",
                      className:
                        "mt-4 h-12 w-full rounded-[10px] bg-flick text-[15px] font-bold text-ink hover:bg-flick/90 sm:w-auto sm:px-8",
                      children: t("maint.submit"),
                      disabled: submitting,
                      "aria-busy": submitting,
                    }),
                  ],
                }),
          (0, k.jsxs)("div", {
            className: "space-y-6",
            children: [
              !l && !N && (0, k.jsx)(od, {}),
              l &&
                (0, k.jsx)("a", {
                  href: nk("maintenance"),
                  className:
                    "inline-flex h-12 items-center rounded-[10px] bg-flick px-5 text-[15px] font-bold text-ink",
                  children: t("maint.cta"),
                }),
              (0, k.jsxs)("section", {
                children: [
                  (0, k.jsx)("h2", {
                    className: "mb-3 text-[15px] font-semibold",
                    children: t("maint.steps"),
                  }),
                  (0, k.jsx)(ou, {}),
                ],
              }),
            ],
          }),
        ],
      }),
      (0, k.jsxs)("section", {
        className: "mt-14",
        children: [
          (0, k.jsx)("h2", {
            className: "mb-4 font-display text-[30px]",
            children: t("maint.where"),
          }),
          (0, k.jsx)("ul", {
            className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
            children: r.branches.map((e) => (0, k.jsx)(ot, { b: e }, e.id)),
          }),
        ],
      }),
    ],
  });
}
let op = ["new", "received", "repairing", "ready", "delivered", "cancelled"],
  om = {
    new: "new",
    received: "confirmed",
    repairing: "ready",
    ready: "delivered",
    delivered: "delivered",
    cancelled: "cancelled",
  };
function oh({ status: e }) {
  let { t: t } = nm();
  return (0, k.jsx)(lv, { status: om[e], label: t(oo(e)) });
}
function og() {
  let { t: e, lang: t, maint: n, content: r, updateMaint: a } = nm(),
    [l, o] = (0, w.useState)("all"),
    [i, s] = (0, w.useState)(""),
    [c, u] = (0, w.useState)(null),
    d = (0, w.useMemo)(() => {
      let e = i.trim().toLowerCase();
      return n.filter(
        (t) =>
          ("all" === l || t.status === l) &&
          (!e ||
            `${t.id} ${t.name} ${t.phone} ${t.device}`
              .toLowerCase()
              .includes(e)),
      );
    }, [n, l, i]),
    f = n.find((e) => e.id === c) ?? null,
    p = (e) => eZ(r.branches.find((t) => t.id === e)?.name, t) || e;
  return (0, k.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, k.jsx)("div", {
        className: "shelf-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1",
        children: ["all", ...op].map((t) => {
          let r =
            "all" === t ? n.length : n.filter((e) => e.status === t).length;
          return (0, k.jsxs)(
            "button",
            {
              type: "button",
              onClick: () => o(t),
              "aria-pressed": l === t,
              className: t0(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold",
                l === t
                  ? "border-flick bg-flick text-ink"
                  : "bg-shelf text-paper hover:border-flick",
              ),
              children: [
                "all" === t ? e("status.all") : e(oo(t)),
                (0, k.jsx)("span", {
                  className: "num text-xs opacity-70",
                  children: r,
                }),
              ],
            },
            t,
          );
        }),
      }),
      (0, k.jsxs)("label", {
        className: "relative block max-w-md",
        children: [
          (0, k.jsx)("span", {
            className: "sr-only",
            children: e("mt.search"),
          }),
          (0, k.jsx)(em, {
            className:
              "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-dust",
            "aria-hidden": !0,
          }),
          (0, k.jsx)("input", {
            id: "maint-search",
            type: "search",
            value: i,
            onChange: (e) => s(e.target.value),
            placeholder: e("mt.search"),
            className:
              "h-10 w-full rounded-[9px] border border-input bg-shelf-2 pe-3 ps-9 text-[14px] focus:border-flick focus:outline-none",
          }),
        ],
      }),
      0 === d.length
        ? (0, k.jsx)(lb, {
            children: (0, k.jsx)("p", {
              className: "text-sm text-dust",
              children: e("mt.empty"),
            }),
          })
        : (0, k.jsx)("ul", {
            className: "space-y-2",
            children: d.map((n) =>
              (0, k.jsx)(
                "li",
                {
                  children: (0, k.jsxs)("button", {
                    type: "button",
                    onClick: () => u(n.id),
                    className:
                      "grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 rounded-[12px] border bg-shelf p-3.5 text-start hover:border-flick sm:grid-cols-[110px_1fr_auto]",
                    "aria-label": e("mt.open", { id: n.id }),
                    children: [
                      (0, k.jsx)("span", {
                        className: "num text-[15px] font-bold",
                        dir: "ltr",
                        style: { textAlign: "ar" === t ? "right" : "left" },
                        children: n.id,
                      }),
                      (0, k.jsxs)("span", {
                        className: "col-start-1 min-w-0 sm:col-start-auto",
                        children: [
                          (0, k.jsxs)("span", {
                            className:
                              "block truncate text-[14px] font-semibold",
                            children: [
                              (0, k.jsx)("bdi", { children: n.device }),
                              (0, k.jsx)("span", {
                                className: "mx-2 text-dust",
                                children: e(ol(n.issue)),
                              }),
                              n.sample &&
                                (0, k.jsx)("span", {
                                  className:
                                    "rounded bg-shelf-2 px-1.5 text-[11px] font-normal text-dust",
                                  children: e("orders.sample"),
                                }),
                            ],
                          }),
                          (0, k.jsxs)("span", {
                            className: "block truncate text-xs text-dust",
                            children: [
                              n.name,
                              (0, k.jsx)("span", {
                                className: "mx-1.5",
                                children: "|",
                              }),
                              p(n.branchId),
                              (0, k.jsx)("span", {
                                className: "num ms-2",
                                dir: "ltr",
                                children: lx(n.createdAt),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, k.jsx)("span", {
                        className:
                          "row-start-1 justify-self-end sm:row-start-auto",
                        children: (0, k.jsx)(oh, { status: n.status }),
                      }),
                    ],
                  }),
                },
                n.id,
              ),
            ),
          }),
      f &&
        (0, k.jsx)(ob, {
          req: f,
          branchName: p,
          onClose: () => u(null),
          onChange: async (e) =>
            await a((t) => t.map((t) => (t.id === f.id ? e(t) : t))),
          onDelete: async () => {
            if (await a((e) => e.filter((e) => e.id !== f.id))) {
              D.success(e("mt.deleted", { id: f.id }));
              u(null);
            }
          },
        }),
    ],
  });
}
function ob({ req: e, onClose: t, onChange: n, onDelete: r, branchName: a }) {
  let { t: l } = nm(),
    [o, i] = (0, w.useState)(e.privateNote ?? ""),
    [s, c] = (0, w.useState)(!1);
  return (0, k.jsxs)(k.Fragment, {
    children: [
      (0, k.jsx)(lh, {
        open: !0,
        onClose: t,
        wide: !0,
        title: `${e.id}  ${e.device}`,
        footer: (0, k.jsxs)(k.Fragment, {
          children: [
            (0, k.jsxs)(lm, {
              kind: "ghost",
              className: "me-auto text-sale hover:text-sale",
              onClick: () => c(!0),
              children: [
                (0, k.jsx)(ey, { className: "size-4", "aria-hidden": !0 }),
                l("orders.delete"),
              ],
            }),
            (0, k.jsx)(lm, { onClick: t, children: l("common.close") }),
          ],
        }),
        children: (0, k.jsxs)("div", {
          className: "grid gap-5 md:grid-cols-[1.2fr_1fr]",
          children: [
            (0, k.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, k.jsxs)("div", {
                  className: "rounded-[10px] border p-3.5 text-[14px]",
                  children: [
                    (0, k.jsx)("p", {
                      className: "text-[13px] font-semibold text-dust",
                      children: l("mt.device"),
                    }),
                    (0, k.jsx)("p", {
                      className: "font-semibold",
                      dir: "auto",
                      children: e.device,
                    }),
                    (0, k.jsx)("p", {
                      className: "mt-2 text-[13px] font-semibold text-dust",
                      children: l("mt.issue"),
                    }),
                    (0, k.jsx)("p", {
                      className: "font-semibold",
                      children: l(ol(e.issue)),
                    }),
                    e.details &&
                      (0, k.jsxs)(k.Fragment, {
                        children: [
                          (0, k.jsx)("p", {
                            className:
                              "mt-2 text-[13px] font-semibold text-dust",
                            children: l("mt.details"),
                          }),
                          (0, k.jsx)("p", {
                            className: "whitespace-pre-wrap",
                            children: e.details,
                          }),
                        ],
                      }),
                  ],
                }),
                (0, k.jsxs)("div", {
                  children: [
                    (0, k.jsx)("h3", {
                      className: "mb-1 text-[13px] font-semibold text-dust",
                      children: l("orders.status"),
                    }),
                    (0, k.jsx)("p", {
                      className: "mb-2 text-xs text-dust",
                      children: l("mt.help"),
                    }),
                    (0, k.jsx)("div", {
                      className: "flex flex-wrap gap-1.5",
                      children: op.map((t) =>
                        (0, k.jsx)(
                          "button",
                          {
                            type: "button",
                            "aria-pressed": e.status === t,
                            onClick: async () => {
                              e.status !== t &&
                                (await n((e) => ({ ...e, status: t }))) &&
                                D.success(
                                  l("mt.statusSaved", {
                                    id: e.id,
                                    status: l(oo(t)),
                                  }),
                                );
                            },
                            className: t0(
                              "h-9 rounded-full border px-3 text-[13px] font-semibold",
                              e.status === t
                                ? "border-flick bg-flick text-ink"
                                : "bg-shelf-2 hover:border-flick",
                            ),
                            children: l(oo(t)),
                          },
                          t,
                        ),
                      ),
                    }),
                  ],
                }),
                (0, k.jsxs)("div", {
                  children: [
                    (0, k.jsx)("label", {
                      htmlFor: "maint-note",
                      className:
                        "mb-1.5 block text-[13px] font-semibold text-dust",
                      children: l("orders.note"),
                    }),
                    (0, k.jsx)(lf, {
                      id: "maint-note",
                      value: o,
                      onChange: (e) => i(e.target.value),
                      onBlur: async () =>
                        o !== (e.privateNote ?? "") &&
                        (await n((e) => ({ ...e, privateNote: o }))),
                      maxLength: 500,
                    }),
                  ],
                }),
              ],
            }),
            (0, k.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, k.jsxs)("div", {
                  className: "rounded-[10px] border p-3.5 text-[14px]",
                  children: [
                    (0, k.jsx)("h3", {
                      className: "mb-2 text-[13px] font-semibold text-dust",
                      children: l("orders.customer"),
                    }),
                    (0, k.jsx)("p", {
                      className: "font-semibold",
                      children: e.name,
                    }),
                    (0, k.jsx)("p", {
                      className: "num mt-0.5 select-all text-dust",
                      dir: "ltr",
                      style: { textAlign: "start" },
                      children: e.phone,
                    }),
                    (0, k.jsxs)("div", {
                      className: "mt-3 flex flex-wrap gap-2",
                      children: [
                        (0, k.jsxs)("a", {
                          href: eW(e.phone),
                          className:
                            "inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-shelf-2 px-3 text-[13px] font-semibold hover:bg-flick hover:text-ink",
                          children: [
                            (0, k.jsx)(ef, {
                              className: "size-4",
                              "aria-hidden": !0,
                            }),
                            l("branches.call"),
                          ],
                        }),
                        (0, k.jsxs)("a", {
                          href: eq(e.phone),
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className:
                            "inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-shelf-2 px-3 text-[13px] font-semibold hover:bg-flick hover:text-ink",
                          children: [
                            (0, k.jsx)(eu, {
                              className: "size-4",
                              "aria-hidden": !0,
                            }),
                            l("branches.whatsapp"),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, k.jsxs)("div", {
                  className: "rounded-[10px] border p-3.5 text-[14px]",
                  children: [
                    (0, k.jsx)("p", {
                      className: "font-semibold",
                      children: l("mt.branch", { branch: a(e.branchId) }),
                    }),
                    (0, k.jsx)("p", {
                      className: "num mt-1 text-xs text-dust",
                      dir: "ltr",
                      style: { textAlign: "start" },
                      children: lx(e.createdAt),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
      (0, k.jsx)(lg, {
        open: s,
        text: l("mt.deleteQ", { id: e.id }),
        confirmLabel: l("orders.delete"),
        onCancel: () => c(!1),
        onConfirm: r,
      }),
    ],
  });
}
let ov = {
  name: "copy",
  size: 24,
  node: [
    [
      "rect",
      {
        width: "14",
        height: "14",
        x: "8",
        y: "8",
        rx: "2",
        ry: "2",
        key: "17jyea",
      },
    ],
    [
      "path",
      {
        d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
        key: "zix9uf",
      },
    ],
  ],
};
ov.node;
let ox = Q(ov),
  oy = {
    name: "image-plus",
    size: 24,
    node: [
      ["path", { d: "M16 5h6", key: "1vod17" }],
      ["path", { d: "M19 2v6", key: "4bpg5p" }],
      [
        "path",
        {
          d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",
          key: "1ue2ih",
        },
      ],
      [
        "path",
        { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" },
      ],
      ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
    ],
  };
oy.node;
let ok = Q(oy),
  ow = {
    name: "pencil",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
          key: "1a8usu",
        },
      ],
      ["path", { d: "m15 5 4 4", key: "1mk7zo" }],
    ],
  };
ow.node;
let oN = Q(ow);
var w = x("aIIwE");
let oS = null;
function oj(e, t) {
  let n =
      e
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "device",
    r = n,
    a = 2;
  for (; t.has(r);) r = `${n}-${a++}`;
  return r;
}
function oE() {
  let { t: e, lang: t, content: n, updateContent: r } = nm(),
    a = n.products,
    l = (0, w.useMemo)(
      () =>
        Object.fromEntries(
          eT.map((e) => [e, a.filter((t) => t.cat === e).length]),
        ),
      [a],
    ),
    [o, i] = (0, w.useState)(() => oS ?? eT.find((e) => l[e] > 0) ?? "phones"),
    s = (e) => {
      ((oS = e), i(e));
    },
    [c, u] = (0, w.useState)(""),
    [d, f] = (0, w.useState)(null),
    [p, m] = (0, w.useState)(!1),
    [h, g] = (0, w.useState)(null),
    b = (0, w.useMemo)(() => {
      let e = c.trim().toLowerCase();
      return a.filter(
        (t) =>
          t.cat === o &&
          (!e ||
            `${t.name.ar} ${t.name.en} ${t.brand}`.toLowerCase().includes(e)),
      );
    }, [a, o, c]);
  return (0, k.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, k.jsx)("div", {
        className: "flex flex-wrap gap-1.5",
        role: "tablist",
        "aria-label": e("pr.cat"),
        children: eT.map((t) =>
          (0, k.jsxs)(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": o === t,
              onClick: () => s(t),
              className: t0(
                "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold",
                o === t
                  ? "border-flick bg-flick text-ink"
                  : "bg-shelf hover:border-flick",
              ),
              children: [
                e(lG(t)),
                (0, k.jsx)("span", {
                  className: "num text-xs opacity-70",
                  children: l[t],
                }),
              ],
            },
            t,
          ),
        ),
      }),
      (0, k.jsxs)("div", {
        className: "flex flex-wrap items-center gap-2",
        children: [
          (0, k.jsxs)("label", {
            className: "relative block min-w-[200px] flex-1 sm:max-w-sm",
            children: [
              (0, k.jsx)("span", {
                className: "sr-only",
                children: e("pr.search"),
              }),
              (0, k.jsx)(em, {
                className:
                  "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-dust",
                "aria-hidden": !0,
              }),
              (0, k.jsx)("input", {
                id: "pr-search",
                type: "search",
                value: c,
                onChange: (e) => u(e.target.value),
                placeholder: e("pr.search"),
                className: t0(lc, "ps-9"),
              }),
            ],
          }),
          (0, k.jsxs)(lm, {
            kind: "primary",
            onClick: () => {
              let e = new Set(a.map((e) => e.id));
              (m(!0),
                f({
                  id: oj("device", e),
                  cat: o,
                  brand: "",
                  name: { ar: "", en: "" },
                  art:
                    "tablets" === o
                      ? "tablet"
                      : "headphones" === o
                        ? "buds"
                        : "speakers" === o
                          ? "speaker"
                          : "watches" === o
                            ? "watch"
                            : "accessories" === o
                              ? "powerbank"
                              : "phone",
                  variants: [
                    {
                      key: "",
                      label: { ar: "", en: "" },
                      price: 0,
                      offerPrice: null,
                      inStock: !0,
                    },
                  ],
                  visible: !1,
                  featured: !1,
                }));
            },
            children: [
              (0, k.jsx)(nS, { className: "size-4", "aria-hidden": !0 }),
              e("pr.add"),
            ],
          }),
        ],
      }),
      0 === b.length
        ? (0, k.jsx)("p", {
            className: "rounded-[14px] border bg-shelf p-5 text-sm text-dust",
            children: e("pr.none"),
          })
        : (0, k.jsx)("ul", {
            className: "space-y-2",
            children: b.map((n) =>
              (0, k.jsxs)(
                "li",
                {
                  className: t0(
                    "flex flex-wrap items-center gap-3 rounded-[12px] border bg-shelf p-3",
                    !n.visible && "opacity-70",
                  ),
                  children: [
                    (0, k.jsx)(nv, {
                      product: n,
                      className: "size-14 shrink-0 rounded-[9px]",
                    }),
                    (0, k.jsxs)("div", {
                      className: "min-w-0 flex-1",
                      children: [
                        (0, k.jsx)("p", {
                          className: "truncate text-[15px] font-semibold",
                          dir: "auto",
                          children: eZ(n.name, t) || "—",
                        }),
                        (0, k.jsxs)("p", {
                          className:
                            "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-dust",
                          children: [
                            n.brand &&
                              (0, k.jsx)("span", { children: n.brand }),
                            n.variants.length > 0 &&
                              (0, k.jsxs)("span", {
                                children: [
                                  e("pr.from", { price: "" }),
                                  (0, k.jsx)(ng, { value: eI(n) }),
                                ],
                              }),
                            eM(n) &&
                              (0, k.jsx)("span", {
                                className:
                                  "rounded bg-sale/20 px-1.5 text-red-200",
                                children: e("pr.onOffer"),
                              }),
                            n.featured &&
                              (0, k.jsx)("span", {
                                className:
                                  "rounded bg-flick/20 px-1.5 text-flick",
                                children: e("pr.featured"),
                              }),
                            !n.visible &&
                              (0, k.jsx)("span", {
                                className: "rounded bg-shelf-2 px-1.5",
                                children: e("common.hidden"),
                              }),
                          ],
                        }),
                      ],
                    }),
                    (0, k.jsxs)("div", {
                      className:
                        "flex basis-full items-center justify-end gap-1 border-t pt-2 sm:basis-auto sm:border-0 sm:pt-0",
                      children: [
                        (0, k.jsx)("button", {
                          type: "button",
                          role: "switch",
                          "aria-checked": n.visible,
                          onClick: async () =>
                            await r((e) => ({
                              ...e,
                              products: e.products.map((e) =>
                                e.id === n.id
                                  ? { ...e, visible: !e.visible }
                                  : e,
                              ),
                            })),
                          className: t0(
                            "h-9 rounded-[9px] px-3 text-[13px] font-semibold",
                            n.visible
                              ? "bg-flick/15 text-flick"
                              : "bg-shelf-2 text-dust",
                          ),
                          "aria-label": `${eZ(n.name, t)}: ${n.visible ? e("common.shown") : e("common.hidden")}`,
                          children: n.visible
                            ? e("common.shown")
                            : e("common.hidden"),
                        }),
                        (0, k.jsxs)(lm, {
                          kind: "ghost",
                          onClick: () => {
                            (m(!1), f(structuredClone(n)));
                          },
                          "aria-label": `${e("pr.edit")}: ${eZ(n.name, t)}`,
                          children: [
                            (0, k.jsx)(oN, {
                              className: "size-4",
                              "aria-hidden": !0,
                            }),
                            (0, k.jsx)("span", {
                              className: "hidden sm:inline",
                              children: e("pr.edit"),
                            }),
                          ],
                        }),
                        (0, k.jsx)(lm, {
                          kind: "ghost",
                          onClick: async () => {
                            let l, o;
                            return (
                              (l = new Set(a.map((e) => e.id))),
                              (o = {
                                ...structuredClone(n),
                                id: oj(`${n.id}-copy`, l),
                                name: {
                                  ar: e("pr.copy", { name: n.name.ar }),
                                  en: `${n.name.en} (copy)`,
                                },
                                visible: !1,
                              }),
                              void (
                                (await r((e) => {
                                  let t = e.products.findIndex(
                                      (e) => e.id === n.id,
                                    ),
                                    r = [...e.products];
                                  return (
                                    r.splice(t + 1, 0, o),
                                    { ...e, products: r }
                                  );
                                })) &&
                                (D.success(
                                  e("pr.saved", { name: eZ(o.name, t) }),
                                ),
                                m(!1),
                                f(o))
                              )
                            );
                          },
                          "aria-label": `${e("pr.duplicate")}: ${eZ(n.name, t)}`,
                          title: e("pr.duplicate"),
                          children: (0, k.jsx)(ox, {
                            className: "size-4",
                            "aria-hidden": !0,
                          }),
                        }),
                        (0, k.jsx)(lm, {
                          kind: "ghost",
                          className: "hover:text-sale",
                          onClick: () => g(n),
                          "aria-label": `${e("common.delete")}: ${eZ(n.name, t)}`,
                          title: e("common.delete"),
                          children: (0, k.jsx)(ey, {
                            className: "size-4",
                            "aria-hidden": !0,
                          }),
                        }),
                      ],
                    }),
                  ],
                },
                n.id,
              ),
            ),
          }),
      d &&
        (0, k.jsx)(
          oT,
          {
            initial: d,
            isNew: p,
            onCancel: () => f(null),
            onSave: async (n) => {
              (await r((e) => {
                let t = e.products.some((e) => e.id === n.id);
                return {
                  ...e,
                  products: t
                    ? e.products.map((e) => (e.id === n.id ? n : e))
                    : [...e.products, n],
                };
              })) &&
                (D.success(e("pr.saved", { name: eZ(n.name, t) })),
                f(null),
                n.cat !== o && s(n.cat));
            },
          },
          d.id,
        ),
      (0, k.jsx)(lg, {
        open: !!h,
        text: h ? e("pr.deleteQ", { name: eZ(h.name, t) }) : "",
        confirmLabel: e("common.delete"),
        onCancel: () => g(null),
        onConfirm: async () => {
          if (!h) return;
          let n = eZ(h.name, t);
          ((await r((e) => ({
            ...e,
            products: e.products.filter((e) => e.id !== h.id),
          }))) && D.success(e("pr.deleted", { name: n })),
            g(null));
        },
      }),
    ],
  });
}
async function oC(e) {
  let t = URL.createObjectURL(e);
  try {
    let e = new Image();
    ((e.src = t), await e.decode());
    let n = Math.min(1, 1e3 / Math.max(e.naturalWidth, e.naturalHeight)),
      r = Math.max(1, Math.round(e.naturalWidth * n)),
      a = Math.max(1, Math.round(e.naturalHeight * n)),
      l = document.createElement("canvas");
    ((l.width = r), (l.height = a));
    let o = l.getContext("2d");
    if (!o) throw Error("no canvas");
    o.drawImage(e, 0, 0, r, a);
    let i = l.toDataURL("image/webp", 0.85);
    return (
      i.startsWith("data:image/webp") || (i = l.toDataURL("image/png")),
      i
    );
  } finally {
    URL.revokeObjectURL(t);
  }
}
function oz(e) {
  let t = Number(e.replace(",", "."));
  return Number.isFinite(t) ? t : 0 / 0;
}
function oT({ initial: e, isNew: t, onCancel: n, onSave: r }) {
  let { t: a } = nm(),
    [l, o] = (0, w.useState)(e),
    [i, s] = (0, w.useState)(
      e.variants.map((e) => (e.price ? String(e.price) : "")),
    ),
    [c, u] = (0, w.useState)(
      e.variants.map((e) =>
        "number" == typeof e.offerPrice ? String(e.offerPrice) : "",
      ),
    ),
    [d, f] = (0, w.useState)(""),
    [p, m] = (0, w.useState)(!1),
    h = (e, t) =>
      o((n) => ({
        ...n,
        variants: n.variants.map((n, r) => (r === e ? { ...n, ...t } : n)),
      })),
    g = async (e) => {
      if (e) {
        m(!0);
        try {
          let t = await oC(e);
          if (0.75 * t.length > 1e6) return void D.error(a("pr.photoBig"));
          o((e) => ({ ...e, photo: t }));
        } catch {
          D.error(a("pr.photoBad"));
        } finally {
          m(!1);
        }
      }
    };
  return (0, k.jsx)(lh, {
    open: !0,
    wide: !0,
    onClose: n,
    title: t ? a("pr.new") : a("pr.editor"),
    footer: (0, k.jsxs)(k.Fragment, {
      children: [
        d &&
          (0, k.jsx)("p", {
            role: "alert",
            className: "me-auto text-[13px] font-semibold text-sale",
            children: d,
          }),
        (0, k.jsx)(lm, { onClick: n, children: a("common.cancel") }),
        (0, k.jsx)(lm, {
          kind: "primary",
          onClick: async () => {
            try {
              let e = new Set(l.variants.map((e) => e.key).filter(Boolean)),
                t = l.variants.map((t, n) => {
                  let r = "" === c[n].trim() ? null : oz(c[n]),
                    a = t.label.ar.trim(),
                    l = t.label.en.trim() || a,
                    o = t.key;
                  if (!o && (l || a)) {
                    let t = (l || a).replace(/\s+/g, "") || "option";
                    o = t;
                    let n = 2;
                    for (; e.has(o);) o = `${t}-${n++}`;
                    e.add(o);
                  }
                  return flickDeviceFeatures.prepareVariant({
                    ...t,
                    key: o,
                    label: { ar: a || l, en: l },
                    price: oz(i[n]),
                    offerPrice: r,
                  });
                });
              return l.name.ar.trim() && l.name.en.trim()
                ? 0 === t.length
                  ? f(a("pr.err.variants"))
                  : t.some((e) => !e.label.en)
                    ? f(a("pr.err.label"))
                    : new Set(t.map((e) => e.label.en.toLowerCase())).size !==
                        t.length
                      ? f(a("pr.err.dupe"))
                      : t.some((e) => !(e.price > 0))
                        ? f(a("pr.err.price"))
                        : t.some((e) => {
                              var t, n;
                              return (
                                (t = e.price),
                                !(
                                  null == (n = e.offerPrice) ||
                                  Number.isNaN(n) ||
                                  (n >= 0.01 &&
                                    n < t &&
                                    1e-6 >
                                      Math.abs(Math.round(100 * n) - 100 * n))
                                )
                              );
                            })
                          ? f(a("pr.err.offer"))
                          : void (f(""),
                            await r({
                              ...l,
                              brand: l.brand.trim(),
                              name: {
                                ar: l.name.ar.trim(),
                                en: l.name.en.trim(),
                              },
                              variants: t,
                              technical: flickDeviceFeatures.prepareTechnical(
                                l.technical,
                              ),
                            }))
                : f(a("pr.err.name"));
            } catch (error) {
              f(
                a(
                  error.field === "technical"
                    ? "pr.err.technical"
                    : "pr.err.deviceDetails",
                ),
              );
            }
          },
          disabled: p,
          children: a("common.save"),
        }),
      ],
    }),
    children: (0, k.jsxs)("div", {
      className: "space-y-6",
      children: [
        (0, k.jsxs)("div", {
          className: "grid gap-4 sm:grid-cols-2",
          children: [
            (0, k.jsx)(lu, {
              label: a("pr.nameAr"),
              htmlFor: "pe-name-ar",
              children: (0, k.jsx)(ld, {
                id: "pe-name-ar",
                dir: "rtl",
                value: l.name.ar,
                onChange: (e) =>
                  o({ ...l, name: { ...l.name, ar: e.target.value } }),
                maxLength: 80,
              }),
            }),
            (0, k.jsx)(lu, {
              label: a("pr.nameEn"),
              htmlFor: "pe-name-en",
              children: (0, k.jsx)(ld, {
                id: "pe-name-en",
                dir: "ltr",
                value: l.name.en,
                onChange: (e) =>
                  o({ ...l, name: { ...l.name, en: e.target.value } }),
                maxLength: 80,
              }),
            }),
            (0, k.jsx)(lu, {
              label: a("pr.brand"),
              help: a("pr.brandHelp"),
              htmlFor: "pe-brand",
              children: (0, k.jsx)(ld, {
                id: "pe-brand",
                dir: "ltr",
                value: l.brand,
                onChange: (e) => o({ ...l, brand: e.target.value }),
                maxLength: 40,
              }),
            }),
            (0, k.jsx)(lu, {
              label: a("pr.cat"),
              htmlFor: "pe-cat",
              children: (0, k.jsx)("select", {
                id: "pe-cat",
                className: lc,
                value: l.cat,
                onChange: (e) => o({ ...l, cat: e.target.value }),
                children: eT.map((e) =>
                  (0, k.jsx)("option", { value: e, children: a(lG(e)) }, e),
                ),
              }),
            }),
          ],
        }),
        (0, k.jsxs)("div", {
          className: "grid gap-4 sm:grid-cols-[160px_1fr]",
          children: [
            (0, k.jsx)(nv, {
              product: l,
              className: "aspect-square w-full max-w-[160px] rounded-[12px]",
            }),
            (0, k.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, k.jsx)(lu, {
                  label: a("pr.photo"),
                  help: a("pr.photoHelp"),
                  children: (0, k.jsxs)("div", {
                    className: "flex flex-wrap gap-2",
                    children: [
                      (0, k.jsxs)("label", {
                        className: t0(
                          "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[9px] bg-shelf-2 px-3.5 text-[14px] font-semibold hover:bg-shelf-2/70",
                          p && "opacity-50",
                        ),
                        children: [
                          (0, k.jsx)(ok, {
                            className: "size-4",
                            "aria-hidden": !0,
                          }),
                          a("pr.upload"),
                          (0, k.jsx)("input", {
                            id: "pe-photo",
                            type: "file",
                            accept: "image/png,image/jpeg,image/webp",
                            className: "sr-only",
                            onChange: (e) => {
                              (g(e.target.files?.[0]), (e.target.value = ""));
                            },
                          }),
                        ],
                      }),
                      eC(l) &&
                        (0, k.jsxs)(lm, {
                          kind: "ghost",
                          onClick: () =>
                            o(
                              l.photo
                                ? { ...l, photo: void 0 }
                                : { ...l, img: null },
                            ),
                          children: [
                            (0, k.jsx)(ls, {
                              className: "size-4",
                              "aria-hidden": !0,
                            }),
                            a("pr.removePhoto"),
                          ],
                        }),
                    ],
                  }),
                }),
                eC(l)?.kind === "builtin" &&
                  (0, k.jsx)("p", {
                    className: "-mt-2 text-xs leading-relaxed text-dust",
                    children: a("pr.builtin"),
                  }),
              ],
            }),
          ],
        }),
        (0, k.jsxs)("div", {
          className: "space-y-3 rounded-[12px] border p-4",
          children: [
            (0, k.jsx)(lp, {
              id: "pe-visible",
              checked: l.visible,
              onChange: (e) => o({ ...l, visible: e }),
              label: a("pr.visible"),
            }),
            (0, k.jsx)(lp, {
              id: "pe-featured",
              checked: l.featured,
              onChange: (e) => o({ ...l, featured: e }),
              label: a("pr.featuredLong"),
            }),
          ],
        }),
        (0, k.jsx)(FlickProductEditor, {
          product: l,
          onChange: (patch) => o((current) => ({ ...current, ...patch })),
        }),
        (0, k.jsxs)("div", {
          children: [
            (0, k.jsx)("h3", {
              className: "text-[14px] font-bold",
              children: a("pr.variants"),
            }),
            (0, k.jsx)("p", {
              className: "mb-3 mt-0.5 text-xs text-dust",
              children: a("pr.variantsHelp"),
            }),
            (0, k.jsx)("ol", {
              className: "space-y-2",
              children: l.variants.map((e, t) =>
                (0, k.jsxs)(
                  "li",
                  {
                    className: "rounded-[12px] border bg-shelf p-3",
                    children: [
                      (0, k.jsxs)("div", {
                        className: "mb-2 flex items-center justify-between",
                        children: [
                          (0, k.jsx)("span", {
                            className: "text-xs font-semibold text-dust",
                            children: a("pr.vRow", { n: t + 1 }),
                          }),
                          (0, k.jsx)("button", {
                            type: "button",
                            className:
                              "grid size-8 place-items-center rounded-md text-dust hover:bg-shelf-2 hover:text-sale disabled:opacity-40",
                            disabled: 1 === l.variants.length,
                            "aria-label": a("pr.vRemove", { n: t + 1 }),
                            onClick: () => {
                              (o((e) => ({
                                ...e,
                                variants: e.variants.filter((e, n) => n !== t),
                              })),
                                s((e) => e.filter((e, n) => n !== t)),
                                u((e) => e.filter((e, n) => n !== t)));
                            },
                            children: (0, k.jsx)(ey, { className: "size-4" }),
                          }),
                        ],
                      }),
                      (0, k.jsxs)("div", {
                        className:
                          "grid gap-2 sm:grid-cols-[1fr_1fr_110px_130px_auto] sm:items-end",
                        children: [
                          (0, k.jsx)(lu, {
                            label: a("pr.vLabelAr"),
                            htmlFor: `pe-v${t}-ar`,
                            children: (0, k.jsx)(ld, {
                              id: `pe-v${t}-ar`,
                              value: e.label.ar,
                              onChange: (n) =>
                                h(t, {
                                  label: { ...e.label, ar: n.target.value },
                                }),
                              maxLength: 40,
                            }),
                          }),
                          (0, k.jsx)(lu, {
                            label: a("pr.vLabelEn"),
                            htmlFor: `pe-v${t}-en`,
                            children: (0, k.jsx)(ld, {
                              id: `pe-v${t}-en`,
                              dir: "ltr",
                              value: e.label.en,
                              onChange: (n) =>
                                h(t, {
                                  label: { ...e.label, en: n.target.value },
                                }),
                              maxLength: 40,
                            }),
                          }),
                          (0, k.jsx)(lu, {
                            label: a("pr.vPrice"),
                            htmlFor: `pe-v${t}-price`,
                            children: (0, k.jsx)(ld, {
                              id: `pe-v${t}-price`,
                              dir: "ltr",
                              inputMode: "decimal",
                              className: "num",
                              value: i[t],
                              onChange: (e) =>
                                s((n) =>
                                  n.map((n, r) =>
                                    r === t ? e.target.value : n,
                                  ),
                                ),
                            }),
                          }),
                          (0, k.jsx)(lu, {
                            label: a("pr.vOffer"),
                            htmlFor: `pe-v${t}-offer`,
                            children: (0, k.jsx)(ld, {
                              id: `pe-v${t}-offer`,
                              dir: "ltr",
                              inputMode: "decimal",
                              className: "num",
                              value: c[t],
                              onChange: (e) =>
                                u((n) =>
                                  n.map((n, r) =>
                                    r === t ? e.target.value : n,
                                  ),
                                ),
                            }),
                          }),
                          (0, k.jsxs)("label", {
                            className:
                              "flex h-10 items-center gap-2 text-[13px] font-semibold",
                            children: [
                              (0, k.jsx)("input", {
                                id: `pe-v${t}-stock`,
                                type: "checkbox",
                                className: "size-4 accent-[#FDF402]",
                                checked: e.inStock,
                                onChange: (e) =>
                                  h(t, {
                                    inStock: e.target.checked,
                                    ...(e.target.checked
                                      ? { soldOut: false }
                                      : {}),
                                  }),
                              }),
                              a("pr.vStock"),
                            ],
                          }),
                        ],
                      }),
                      (0, k.jsx)(FlickVariantEditor, {
                        variant: e,
                        index: t,
                        onChange: (patch) => h(t, patch),
                      }),
                    ],
                  },
                  t,
                ),
              ),
            }),
            (0, k.jsxs)(lm, {
              className: "mt-2",
              onClick: () => {
                (o((e) => ({
                  ...e,
                  variants: [
                    ...e.variants,
                    {
                      key: "",
                      label: { ar: "", en: "" },
                      price: 0,
                      offerPrice: null,
                      inStock: !0,
                    },
                  ],
                })),
                  s((e) => [...e, ""]),
                  u((e) => [...e, ""]));
              },
              children: [
                (0, k.jsx)(nS, { className: "size-4", "aria-hidden": !0 }),
                a("pr.vAdd"),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
let oP = [
    { id: "overview", key: "admin.overview", icon: ea },
    { id: "orders", key: "admin.orders", icon: en },
    { id: "maint", key: "admin.maint", icon: ew },
    { id: "products", key: "admin.products", icon: ev },
    { id: "campaign", key: "admin.campaign", icon: es },
    { id: "branches", key: "admin.branches", icon: eo },
    { id: "settings", key: "admin.settings", icon: eg },
  ],
  oO = ["new", "confirmed", "ready", "delivered", "cancelled"],
  oA = (e) => `status.${e}`;
function oI({ page: e }) {
  let { t: t, lang: n, setLang: r, orders: a, maint: l } = nm(),
    o = oP.find((t) => t.id === e)?.id ?? "overview",
    i = {
      orders: a.filter((e) => "new" === e.status).length,
      maint: l.filter((e) => "new" === e.status).length,
    };
  return (0, k.jsxs)("div", {
    className: "min-h-screen bg-ink",
    children: [
      (0, k.jsxs)("header", {
        className: "sticky top-0 z-40 border-b bg-ink/95 backdrop-blur",
        children: [
          (0, k.jsxs)("div", {
            className:
              "mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6",
            children: [
              (0, k.jsxs)("a", {
                href: nk("admin"),
                className: "flex shrink-0 items-center gap-2.5",
                "aria-label": t("admin.title"),
                children: [
                  (0, k.jsx)(nh, { className: "h-8" }),
                  (0, k.jsx)("span", {
                    className: "hidden text-[15px] font-bold sm:inline",
                    children: t("admin.title"),
                  }),
                ],
              }),
              (0, k.jsx)("span", {
                className:
                  "hidden truncate rounded-full bg-shelf-2 px-2.5 py-1 text-xs text-dust lg:inline",
                children: t("admin.demo"),
              }),
              (0, k.jsxs)("div", {
                className: "ms-auto flex items-center gap-1.5",
                children: [
                  (0, k.jsx)("button", {
                    type: "button",
                    onClick: () => r("ar" === n ? "en" : "ar"),
                    className:
                      "h-9 rounded-lg px-3 text-sm font-semibold hover:bg-shelf-2",
                    "aria-label": t("lang.switch.aria"),
                    children: t("lang.switch"),
                  }),
                  (0, k.jsxs)("a", {
                    href: nk(""),
                    className:
                      "inline-flex h-9 items-center gap-1.5 rounded-lg bg-flick px-3 text-sm font-bold text-ink",
                    children: [
                      t("admin.view"),
                      "ar" === n
                        ? (0, k.jsx)(Y, {
                            className: "size-4",
                            "aria-hidden": !0,
                          })
                        : (0, k.jsx)(J, {
                            className: "size-4",
                            "aria-hidden": !0,
                          }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          (0, k.jsx)("nav", {
            "aria-label": t("admin.sections"),
            className:
              "shelf-scroll flex gap-1 overflow-x-auto border-t px-3 py-2 lg:hidden",
            children: oP.map((e) =>
              (0, k.jsxs)(
                "a",
                {
                  href: nk(`admin/${e.id}`),
                  "aria-current": o === e.id ? "page" : void 0,
                  className: t0(
                    "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold",
                    o === e.id
                      ? "bg-flick text-ink"
                      : "text-dust hover:bg-shelf-2 hover:text-paper",
                  ),
                  children: [
                    t(e.key),
                    i[e.id] > 0 &&
                      (0, k.jsx)("span", {
                        className:
                          "num rounded-full bg-sale px-1.5 text-[11px] text-white",
                        children: i[e.id],
                      }),
                  ],
                },
                e.id,
              ),
            ),
          }),
        ],
      }),
      (0, k.jsx)("p", {
        className: "border-b px-4 py-2 text-center text-xs text-dust lg:hidden",
        children: t("admin.demo"),
      }),
      (0, k.jsxs)("div", {
        className: "mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6",
        children: [
          (0, k.jsx)("aside", {
            className:
              "sticky top-20 hidden h-[calc(100vh-6rem)] w-56 shrink-0 flex-col lg:flex",
            children: (0, k.jsx)("nav", {
              "aria-label": t("admin.sections"),
              className: "flex flex-col gap-1",
              children: oP.map((e) =>
                (0, k.jsxs)(
                  "a",
                  {
                    href: nk(`admin/${e.id}`),
                    "aria-current": o === e.id ? "page" : void 0,
                    className: t0(
                      "flex h-10 items-center gap-2.5 rounded-[9px] px-3 text-[14px] font-semibold",
                      o === e.id
                        ? "bg-flick text-ink"
                        : "text-dust hover:bg-shelf-2 hover:text-paper",
                    ),
                    children: [
                      (0, k.jsx)(e.icon, {
                        className: "size-4",
                        "aria-hidden": !0,
                      }),
                      (0, k.jsx)("span", {
                        className: "flex-1",
                        children: t(e.key),
                      }),
                      i[e.id] > 0 &&
                        (0, k.jsx)("span", {
                          className:
                            "num rounded-full bg-sale px-1.5 text-[11px] text-white",
                          children: i[e.id],
                        }),
                    ],
                  },
                  e.id,
                ),
              ),
            }),
          }),
          (0, k.jsxs)("main", {
            className: "min-w-0 flex-1",
            children: [
              (0, k.jsx)("h1", {
                className: "mb-5 text-[26px] font-bold",
                children: t(oP.find((e) => e.id === o).key),
              }),
              "overview" === o && (0, k.jsx)(oL, {}),
              "orders" === o && (0, k.jsx)(oD, {}),
              "maint" === o && (0, k.jsx)(og, {}),
              "products" === o && (0, k.jsx)(oE, {}),
              "campaign" === o && (0, k.jsx)(lw, {}),
              "branches" === o && (0, k.jsx)(lN, {}),
              "settings" === o && (0, k.jsx)(lS, {}),
            ],
          }),
        ],
      }),
    ],
  });
}
function oM({ label: e, value: t, to: n }) {
  return (0, k.jsxs)("a", {
    href: nk(n),
    className: "block rounded-[14px] border bg-shelf p-4 hover:border-flick",
    children: [
      (0, k.jsx)("p", { className: "text-[13px] text-dust", children: e }),
      (0, k.jsx)("p", {
        className: t0(
          "num mt-1 font-bold leading-tight",
          "number" == typeof t ? "text-[28px]" : "text-[19px]",
        ),
        children: t,
      }),
    ],
  });
}
function oL() {
  let { t: e, lang: t, content: n, orders: r, maint: a } = nm(),
    l = n.products.filter((e) => e.visible),
    o = l.filter((e) => e.photo).length,
    i = eQ(n.campaign),
    s =
      "live" === i
        ? e("cp.state.live", { n: eK(n.campaign) })
        : "soon" === i
          ? e("cp.state.soon", { date: eY(n.campaign.start) })
          : e("over" === i ? "cp.state.over" : "cp.state.off"),
    c = [
      { key: "ov.c1", done: !1 },
      {
        key: "ov.c2",
        done: l.length > 0 && o === l.length,
        extra: e("ov.photos", { n: o, total: l.length }),
      },
      { key: "ov.c3", done: !1 },
      { key: "ov.c4", done: !n.settings.conceptNotice },
      { key: "ov.c5", done: !1 },
    ];
  return (0, k.jsxs)("div", {
    className: "space-y-5",
    children: [
      (0, k.jsxs)("div", {
        className: "grid grid-cols-2 gap-3 xl:grid-cols-4",
        children: [
          (0, k.jsx)(oM, {
            label: e("ov.new"),
            value: r.filter((e) => "new" === e.status).length,
            to: "admin/orders",
          }),
          (0, k.jsx)(oM, {
            label: e("ov.visible"),
            value: l.length,
            to: "admin/products",
          }),
          (0, k.jsx)(oM, {
            label: e("ov.maint"),
            value: a.filter((e) => "new" === e.status).length,
            to: "admin/maint",
          }),
          (0, k.jsx)(oM, {
            label: e("ov.campaign"),
            value: s,
            to: "admin/campaign",
          }),
        ],
      }),
      (0, k.jsxs)("div", {
        className: "grid gap-5 xl:grid-cols-[1.4fr_1fr]",
        children: [
          (0, k.jsx)(lb, {
            title: e("ov.recent"),
            action: (0, k.jsx)("a", {
              href: nk("admin/orders"),
              className: "text-sm font-semibold text-flick hover:underline",
              children: e("ov.allOrders"),
            }),
            children:
              0 === r.length
                ? (0, k.jsx)("p", {
                    className: "text-sm text-dust",
                    children: e("ov.noOrders"),
                  })
                : (0, k.jsx)("ul", {
                    className: "divide-y",
                    children: r.slice(0, 5).map((n) =>
                      (0, k.jsxs)(
                        "li",
                        {
                          className:
                            "flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0",
                          children: [
                            (0, k.jsxs)("div", {
                              className: "min-w-0",
                              children: [
                                (0, k.jsxs)("p", {
                                  className: "text-[14px] font-semibold",
                                  children: [
                                    (0, k.jsx)("span", {
                                      className: "num",
                                      dir: "ltr",
                                      children: n.id,
                                    }),
                                    " ",
                                    (0, k.jsx)("span", {
                                      className: "text-dust",
                                      children: n.name,
                                    }),
                                    n.sample &&
                                      (0, k.jsx)("span", {
                                        className:
                                          "ms-2 rounded bg-shelf-2 px-1.5 text-[11px] text-dust",
                                        children: e("orders.sample"),
                                      }),
                                  ],
                                }),
                                (0, k.jsx)("p", {
                                  className: "num text-xs text-dust",
                                  dir: "ltr",
                                  style: {
                                    textAlign: "ar" === t ? "right" : "left",
                                  },
                                  children: lx(n.createdAt),
                                }),
                              ],
                            }),
                            (0, k.jsxs)("div", {
                              className: "flex items-center gap-3",
                              children: [
                                (0, k.jsx)(ng, {
                                  value: n.total,
                                  className: "text-sm font-semibold",
                                }),
                                (0, k.jsx)(lv, {
                                  status: n.status,
                                  label: e(oA(n.status)),
                                }),
                              ],
                            }),
                          ],
                        },
                        n.id,
                      ),
                    ),
                  }),
          }),
          (0, k.jsx)(lb, {
            title: e("ov.checklist"),
            children: (0, k.jsx)("ul", {
              className: "space-y-3",
              children: c.map((t) =>
                (0, k.jsxs)(
                  "li",
                  {
                    className: "flex items-start gap-2.5 text-[14px]",
                    children: [
                      t.done
                        ? (0, k.jsx)(Z, {
                            className: "mt-0.5 size-4 shrink-0 text-flick",
                            "aria-hidden": !0,
                          })
                        : (0, k.jsx)(ee, {
                            className: "mt-0.5 size-4 shrink-0 text-dust",
                            "aria-hidden": !0,
                          }),
                      (0, k.jsxs)("span", {
                        className: t0(t.done && "text-dust line-through"),
                        children: [
                          e(t.key),
                          t.extra &&
                            (0, k.jsxs)("span", {
                              className: "ms-2 text-xs text-dust no-underline",
                              children: ["(", t.extra, ")"],
                            }),
                        ],
                      }),
                    ],
                  },
                  t.key,
                ),
              ),
            }),
          }),
        ],
      }),
    ],
  });
}
function oD() {
  let { t: e, lang: t, orders: n, content: r, updateOrders: a } = nm(),
    [l, o] = (0, w.useState)("all"),
    [i, s] = (0, w.useState)(""),
    [c, u] = (0, w.useState)(null),
    d = (0, w.useMemo)(() => {
      let e = i.trim().toLowerCase();
      return n.filter(
        (t) =>
          ("all" === l || t.status === l) &&
          (!e || `${t.id} ${t.name} ${t.phone}`.toLowerCase().includes(e)),
      );
    }, [n, l, i]),
    f = n.find((e) => e.id === c) ?? null,
    p = (e) => eZ(r.branches.find((t) => t.id === e)?.name, t) || e || "";
  return (0, k.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, k.jsx)("div", {
        className: "shelf-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1",
        children: ["all", ...oO].map((t) => {
          let r =
            "all" === t ? n.length : n.filter((e) => e.status === t).length;
          return (0, k.jsxs)(
            "button",
            {
              type: "button",
              onClick: () => o(t),
              "aria-pressed": l === t,
              className: t0(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold",
                l === t
                  ? "border-flick bg-flick text-ink"
                  : "bg-shelf text-paper hover:border-flick",
              ),
              children: [
                "all" === t ? e("status.all") : e(oA(t)),
                (0, k.jsx)("span", {
                  className: "num text-xs opacity-70",
                  children: r,
                }),
              ],
            },
            t,
          );
        }),
      }),
      (0, k.jsxs)("label", {
        className: "relative block max-w-md",
        children: [
          (0, k.jsx)("span", {
            className: "sr-only",
            children: e("orders.search"),
          }),
          (0, k.jsx)(em, {
            className:
              "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-dust",
            "aria-hidden": !0,
          }),
          (0, k.jsx)("input", {
            id: "orders-search",
            type: "search",
            value: i,
            onChange: (e) => s(e.target.value),
            placeholder: e("orders.search"),
            className:
              "h-10 w-full rounded-[9px] border border-input bg-shelf-2 pe-3 ps-9 text-[14px] focus:border-flick focus:outline-none",
          }),
        ],
      }),
      0 === d.length
        ? (0, k.jsx)(lb, {
            children: (0, k.jsx)("p", {
              className: "text-sm text-dust",
              children: e("orders.empty"),
            }),
          })
        : (0, k.jsx)("ul", {
            className: "space-y-2",
            children: d.map((n) =>
              (0, k.jsx)(
                "li",
                {
                  children: (0, k.jsxs)("button", {
                    type: "button",
                    onClick: () => u(n.id),
                    className:
                      "grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 rounded-[12px] border bg-shelf p-3.5 text-start hover:border-flick sm:grid-cols-[110px_1fr_auto_auto]",
                    "aria-label": e("orders.open", { id: n.id }),
                    children: [
                      (0, k.jsx)("span", {
                        className: "num text-[15px] font-bold",
                        dir: "ltr",
                        style: { textAlign: "ar" === t ? "right" : "left" },
                        children: n.id,
                      }),
                      (0, k.jsxs)("span", {
                        className: "col-start-1 min-w-0 sm:col-start-auto",
                        children: [
                          (0, k.jsxs)("span", {
                            className:
                              "block truncate text-[14px] font-semibold",
                            children: [
                              n.name,
                              n.sample &&
                                (0, k.jsx)("span", {
                                  className:
                                    "ms-2 rounded bg-shelf-2 px-1.5 text-[11px] font-normal text-dust",
                                  children: e("orders.sample"),
                                }),
                            ],
                          }),
                          (0, k.jsxs)("span", {
                            className: "block truncate text-xs text-dust",
                            children: [
                              "pickup" === n.method
                                ? e("orders.pickupAt", {
                                    branch: p(n.branchId),
                                  })
                                : e("orders.deliveryTo", {
                                    area: n.area ?? "",
                                  }),
                              (0, k.jsx)("span", {
                                className: "num ms-2",
                                dir: "ltr",
                                children: lx(n.createdAt),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, k.jsx)(ng, {
                        value: n.total,
                        className:
                          "row-start-1 text-[15px] font-semibold sm:row-start-auto",
                      }),
                      (0, k.jsx)("span", {
                        className: "justify-self-end",
                        children: (0, k.jsx)(lv, {
                          status: n.status,
                          label: e(oA(n.status)),
                        }),
                      }),
                    ],
                  }),
                },
                n.id,
              ),
            ),
          }),
      f &&
        (0, k.jsx)(oR, {
          order: f,
          onClose: () => u(null),
          branchName: p,
          onChange: async (e) =>
            await a((t) => t.map((t) => (t.id === f.id ? e(t) : t))),
          onDelete: async () => {
            if (await a((e) => e.filter((e) => e.id !== f.id))) {
              D.success(e("orders.deleted", { id: f.id }));
              u(null);
            }
          },
        }),
    ],
  });
}
function oR({ order: e, onClose: t, onChange: n, onDelete: r, branchName: a }) {
  let { t: l } = nm(),
    [o, i] = (0, w.useState)(e.privateNote ?? ""),
    [s, c] = (0, w.useState)(!1);
  return (0, k.jsxs)(k.Fragment, {
    children: [
      (0, k.jsx)(lh, {
        open: !0,
        onClose: t,
        title: `${e.id}  ${e.name}`,
        wide: !0,
        footer: (0, k.jsxs)(k.Fragment, {
          children: [
            (0, k.jsxs)(lm, {
              kind: "ghost",
              className: "me-auto text-sale hover:text-sale",
              onClick: () => c(!0),
              children: [
                (0, k.jsx)(ey, { className: "size-4", "aria-hidden": !0 }),
                l("orders.delete"),
              ],
            }),
            (0, k.jsx)(lm, { onClick: t, children: l("common.close") }),
          ],
        }),
        children: (0, k.jsxs)("div", {
          className: "grid gap-5 md:grid-cols-[1.2fr_1fr]",
          children: [
            (0, k.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, k.jsxs)("div", {
                  children: [
                    (0, k.jsx)("h3", {
                      className: "mb-2 text-[13px] font-semibold text-dust",
                      children: l("orders.items"),
                    }),
                    (0, k.jsxs)("ul", {
                      className: "divide-y rounded-[10px] border",
                      children: [
                        e.lines.map((e, t) =>
                          (0, k.jsxs)(
                            "li",
                            {
                              className:
                                "flex items-center justify-between gap-3 px-3 py-2.5 text-[14px]",
                              children: [
                                (0, k.jsxs)("span", {
                                  className: "min-w-0",
                                  children: [
                                    (0, k.jsx)("span", {
                                      className: "block truncate font-semibold",
                                      dir: "auto",
                                      children: e.name,
                                    }),
                                    (0, k.jsxs)("span", {
                                      className: "text-xs text-dust",
                                      children: [
                                        (0, k.jsx)("bdi", {
                                          children: e.variant,
                                        }),
                                        " × ",
                                        (0, k.jsx)("span", {
                                          className: "num",
                                          children: e.qty,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, k.jsx)(ng, {
                                  value: e.unit * e.qty,
                                  className: "font-semibold",
                                }),
                              ],
                            },
                            t,
                          ),
                        ),
                        (0, k.jsxs)("li", {
                          className:
                            "flex items-center justify-between px-3 py-2.5 text-[14px] font-bold",
                          children: [
                            (0, k.jsx)("span", { children: l("bag.total") }),
                            (0, k.jsx)(ng, { value: e.total }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, k.jsxs)("div", {
                  children: [
                    (0, k.jsx)("h3", {
                      className: "mb-2 text-[13px] font-semibold text-dust",
                      children: l("orders.status"),
                    }),
                    (0, k.jsx)("div", {
                      className: "flex flex-wrap gap-1.5",
                      children: oO.map((t) =>
                        (0, k.jsx)(
                          "button",
                          {
                            type: "button",
                            "aria-pressed": e.status === t,
                            onClick: async () => {
                              e.status !== t &&
                                (await n((e) => ({ ...e, status: t }))) &&
                                D.success(
                                  l("orders.statusSaved", {
                                    id: e.id,
                                    status: l(oA(t)),
                                  }),
                                );
                            },
                            className: t0(
                              "h-9 rounded-full border px-3 text-[13px] font-semibold",
                              e.status === t
                                ? "border-flick bg-flick text-ink"
                                : "bg-shelf-2 hover:border-flick",
                            ),
                            children: l(oA(t)),
                          },
                          t,
                        ),
                      ),
                    }),
                  ],
                }),
                (0, k.jsxs)("div", {
                  children: [
                    (0, k.jsx)("label", {
                      htmlFor: "order-note",
                      className:
                        "mb-1.5 block text-[13px] font-semibold text-dust",
                      children: l("orders.note"),
                    }),
                    (0, k.jsx)(lf, {
                      id: "order-note",
                      value: o,
                      onChange: (e) => i(e.target.value),
                      onBlur: async () =>
                        o !== (e.privateNote ?? "") &&
                        (await n((e) => ({ ...e, privateNote: o }))),
                      maxLength: 500,
                    }),
                  ],
                }),
              ],
            }),
            (0, k.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, k.jsxs)("div", {
                  className: "rounded-[10px] border p-3.5 text-[14px]",
                  children: [
                    (0, k.jsx)("h3", {
                      className: "mb-2 text-[13px] font-semibold text-dust",
                      children: l("orders.customer"),
                    }),
                    (0, k.jsx)("p", {
                      className: "font-semibold",
                      children: e.name,
                    }),
                    (0, k.jsx)("p", {
                      className: "num mt-0.5 select-all text-dust",
                      dir: "ltr",
                      style: { textAlign: "start" },
                      children: e.phone,
                    }),
                    (0, k.jsxs)("div", {
                      className: "mt-3 flex flex-wrap gap-2",
                      children: [
                        (0, k.jsxs)("a", {
                          href: eW(e.phone),
                          className:
                            "inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-shelf-2 px-3 text-[13px] font-semibold hover:bg-flick hover:text-ink",
                          children: [
                            (0, k.jsx)(ef, {
                              className: "size-4",
                              "aria-hidden": !0,
                            }),
                            l("branches.call"),
                          ],
                        }),
                        (0, k.jsxs)("a", {
                          href: eq(e.phone),
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className:
                            "inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-shelf-2 px-3 text-[13px] font-semibold hover:bg-flick hover:text-ink",
                          children: [
                            (0, k.jsx)(eu, {
                              className: "size-4",
                              "aria-hidden": !0,
                            }),
                            l("branches.whatsapp"),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, k.jsxs)("div", {
                  className: "rounded-[10px] border p-3.5 text-[14px]",
                  children: [
                    (0, k.jsx)("p", {
                      className: "font-semibold",
                      children:
                        "pickup" === e.method
                          ? l("orders.pickupAt", { branch: a(e.branchId) })
                          : l("orders.deliveryTo", { area: e.area ?? "" }),
                    }),
                    e.address &&
                      (0, k.jsxs)("p", {
                        className: "mt-1 text-dust",
                        children: [l("orders.address"), ": ", e.address],
                      }),
                    (0, k.jsx)("p", {
                      className: "num mt-1 text-xs text-dust",
                      dir: "ltr",
                      style: { textAlign: "start" },
                      children: lx(e.createdAt),
                    }),
                  ],
                }),
                e.notes &&
                  (0, k.jsxs)("div", {
                    className: "rounded-[10px] border p-3.5 text-[14px]",
                    children: [
                      (0, k.jsx)("h3", {
                        className: "mb-1 text-[13px] font-semibold text-dust",
                        children: l("orders.customerNotes"),
                      }),
                      (0, k.jsx)("p", {
                        className: "whitespace-pre-wrap",
                        children: e.notes,
                      }),
                    ],
                  }),
              ],
            }),
          ],
        }),
      }),
      (0, k.jsx)(lg, {
        open: s,
        text: l("orders.deleteQ", { id: e.id }),
        confirmLabel: l("orders.delete"),
        onCancel: () => c(!1),
        onConfirm: r,
      }),
    ],
  });
}
let oF = {
  name: "minus",
  size: 24,
  node: [["path", { d: "M5 12h14", key: "1ays0h" }]],
};
oF.node;
let oB = Q(oF);
var w = x("aIIwE");
let oH =
  "mt-1.5 block h-11 w-full rounded-[10px] border border-input bg-shelf-2 px-3 text-[15px] text-paper placeholder:text-dust/70 focus:border-flick focus:outline-none";
function oU() {
  let {
      t: r,
      lang: a,
      content: l,
      bag: o,
      setQty: i,
      bagOpen: s,
      setBagOpen: c,
      placeOrder: u,
    } = nm(),
    [d, f] = (0, w.useState)("bag"),
    [p, m] = (0, w.useState)(null),
    h = (0, w.useMemo)(() => eG(l, o), [l, o]),
    subtotal = eD(h.reduce((e, t) => e + t.sum, 0)),
    b = l.campaign,
    v = "live" === eQ(b),
    [x, y] = (0, w.useState)(""),
    [N, S] = (0, w.useState)(""),
    [j, E] = (0, w.useState)("pickup"),
    g = eD(
      subtotal +
        (window.FlickApp?.mode === "live" && j === "delivery"
          ? (l.settings.deliveryFeeMinor || 0) / 1000
          : 0),
    ),
    [C, z] = (0, w.useState)(
      l.branches.find((e) => e.main)?.id ?? l.branches[0]?.id ?? "",
    ),
    [T, P] = (0, w.useState)(""),
    [O, A] = (0, w.useState)(""),
    [I, M] = (0, w.useState)(""),
    [L, D] = (0, w.useState)({}),
    [submitting, setSubmitting] = (0, w.useState)(false),
    R = (0, w.useRef)(null);
  (0, w.useEffect)(() => {
    if (!s) {
      let e = setTimeout(() => {
        ("done" === d && (f("bag"), m(null)),
          "form" !== d || h.length || f("bag"));
      }, 300);
      return () => clearTimeout(e);
    }
  }, [s, d, h.length]);
  let F =
    "ar" === a
      ? "left-0 border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
      : "right-0 border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right";
  return (0, k.jsx)(a$, {
    open: s,
    onOpenChange: c,
    children: (0, k.jsxs)(a4, {
      children: [
        (0, k.jsx)(a5, {
          className:
            "fixed inset-0 z-50 bg-black/70 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        }),
        (0, k.jsxs)(a7, {
          className: t0(
            "fixed inset-y-0 z-50 flex w-full max-w-[420px] flex-col bg-ink shadow-2xl outline-none data-[state=closed]:duration-200 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out",
            F,
          ),
          "aria-describedby": void 0,
          children: [
            (0, k.jsxs)("div", {
              className:
                "flex items-center justify-between border-b px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]",
              children: [
                (0, k.jsx)(lr, {
                  className: "font-display text-[26px] leading-none",
                  children: "form" === d ? r("checkout.title") : r("bag.title"),
                }),
                (0, k.jsx)(la, {
                  className:
                    "grid size-10 place-items-center rounded-lg text-dust hover:bg-shelf-2 hover:text-paper",
                  "aria-label": r("bag.close"),
                  children: (0, k.jsx)(ls, { className: "size-5" }),
                }),
              ],
            }),
            "bag" === d &&
              (0, k.jsx)(k.Fragment, {
                children:
                  0 === h.length
                    ? (0, k.jsxs)("div", {
                        className:
                          "flex flex-1 flex-col items-start justify-center gap-3 px-6",
                        children: [
                          (0, k.jsx)("p", {
                            className: "font-display text-2xl",
                            children: r("bag.empty"),
                          }),
                          (0, k.jsx)("p", {
                            className: "text-sm text-dust",
                            children: r("bag.emptySub"),
                          }),
                          (0, k.jsx)("button", {
                            type: "button",
                            onClick: () => {
                              (c(!1), nw("shop"));
                            },
                            className:
                              "mt-2 h-11 rounded-[10px] bg-flick px-5 text-sm font-bold text-ink",
                            children: r("bag.browse"),
                          }),
                        ],
                      })
                    : (0, k.jsxs)(k.Fragment, {
                        children: [
                          (0, k.jsxs)("div", {
                            className:
                              "min-h-0 flex-1 overflow-y-auto px-5 py-4",
                            children: [
                              (0, k.jsx)("ul", {
                                className: "divide-y",
                                children: h.map((e) => {
                                  let t = eZ(e.product.name, a);
                                  return (0, k.jsxs)(
                                    "li",
                                    {
                                      className: "flex gap-3 py-4 first:pt-0",
                                      children: [
                                        (0, k.jsx)(nv, {
                                          product: e.product,
                                          className:
                                            "size-[72px] shrink-0 rounded-[10px]",
                                        }),
                                        (0, k.jsxs)("div", {
                                          className: "min-w-0 flex-1",
                                          children: [
                                            (0, k.jsxs)("div", {
                                              className:
                                                "flex items-start justify-between gap-2",
                                              children: [
                                                (0, k.jsx)("p", {
                                                  className:
                                                    "line-clamp-2 text-[15px] font-semibold leading-snug",
                                                  dir: "auto",
                                                  children: t,
                                                }),
                                                (0, k.jsx)("button", {
                                                  type: "button",
                                                  onClick: () =>
                                                    i(
                                                      e.productId,
                                                      e.variantKey,
                                                      0,
                                                    ),
                                                  className:
                                                    "grid size-8 shrink-0 place-items-center rounded-md text-dust hover:bg-shelf-2 hover:text-sale",
                                                  "aria-label": r(
                                                    "bag.remove",
                                                    { name: t },
                                                  ),
                                                  children: (0, k.jsx)(ey, {
                                                    className: "size-4",
                                                  }),
                                                }),
                                              ],
                                            }),
                                            (0, k.jsx)("p", {
                                              className:
                                                "mt-0.5 text-xs text-dust",
                                              children: (0, k.jsx)("bdi", {
                                                children:
                                                  flickDeviceFeatures.optionLabel(
                                                    e.variant,
                                                    a,
                                                  ),
                                              }),
                                            }),
                                            (0, k.jsxs)("div", {
                                              className:
                                                "mt-2 flex items-center justify-between gap-2",
                                              children: [
                                                (0, k.jsxs)("div", {
                                                  className:
                                                    "flex items-center rounded-[10px] border",
                                                  children: [
                                                    (0, k.jsx)("button", {
                                                      type: "button",
                                                      className:
                                                        "grid size-9 place-items-center text-dust hover:text-paper",
                                                      onClick: () =>
                                                        i(
                                                          e.productId,
                                                          e.variantKey,
                                                          e.qty - 1,
                                                        ),
                                                      "aria-label":
                                                        r("bag.dec"),
                                                      children: (0, k.jsx)(oB, {
                                                        className: "size-4",
                                                      }),
                                                    }),
                                                    (0, k.jsx)("span", {
                                                      className:
                                                        "num w-7 text-center text-sm font-semibold",
                                                      "aria-live": "polite",
                                                      children: e.qty,
                                                    }),
                                                    (0, k.jsx)("button", {
                                                      type: "button",
                                                      className:
                                                        "grid size-9 place-items-center text-dust hover:text-paper disabled:opacity-40",
                                                      onClick: () =>
                                                        i(
                                                          e.productId,
                                                          e.variantKey,
                                                          e.qty + 1,
                                                        ),
                                                      disabled:
                                                        e.qty >=
                                                        flickDeviceFeatures.maxQuantity(
                                                          e.variant,
                                                        ),
                                                      "aria-label":
                                                        r("bag.inc"),
                                                      title:
                                                        e.qty >=
                                                        flickDeviceFeatures.maxQuantity(
                                                          e.variant,
                                                        )
                                                          ? r(
                                                              flickDeviceFeatures.maxQuantity(
                                                                e.variant,
                                                              ) < 5
                                                                ? "bag.stockLimit"
                                                                : "bag.max",
                                                            )
                                                          : void 0,
                                                      children: (0, k.jsx)(nS, {
                                                        className: "size-4",
                                                      }),
                                                    }),
                                                  ],
                                                }),
                                                (0, k.jsx)(ng, {
                                                  value: e.sum,
                                                  className:
                                                    "text-[15px] font-semibold",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    },
                                    `${e.productId}:${e.variantKey}`,
                                  );
                                }),
                              }),
                              v &&
                                (0, k.jsx)("p", {
                                  className:
                                    "mt-4 rounded-[10px] border border-flick/40 bg-flick/10 px-3 py-2.5 text-[13px] leading-relaxed text-paper",
                                  children: r("campaign.bagHint", {
                                    title: eZ(b.title, a),
                                    min: b.minInvoice,
                                  }),
                                }),
                            ],
                          }),
                          (0, k.jsxs)("div", {
                            className:
                              "border-t px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4",
                            children: [
                              (0, k.jsxs)("div", {
                                className:
                                  "mb-1 flex items-baseline justify-between",
                                children: [
                                  (0, k.jsx)("span", {
                                    className: "text-sm text-dust",
                                    children: r("bag.total"),
                                  }),
                                  (0, k.jsx)(ng, {
                                    value: g,
                                    className:
                                      "font-display text-[28px] leading-none",
                                  }),
                                ],
                              }),
                              l.settings.conceptNotice &&
                                (0, k.jsx)("p", {
                                  className: "mb-3 text-[11px] text-dust",
                                  children: r("price.example"),
                                }),
                              (0, k.jsx)("button", {
                                type: "button",
                                onClick: () => f("form"),
                                disabled:
                                  window.FlickApp?.mode === "live" &&
                                  !l.settings.ordersEnabled,
                                className:
                                  "h-12 w-full rounded-[10px] bg-flick text-[15px] font-bold text-ink hover:bg-flick/90",
                                children:
                                  window.FlickApp?.mode === "live" &&
                                  !l.settings.ordersEnabled
                                    ? a === "ar"
                                      ? "استقبال الطلبات مغلق حاليًا"
                                      : "Ordering is currently closed"
                                    : r("bag.checkout"),
                              }),
                            ],
                          }),
                        ],
                      }),
              }),
            "form" === d &&
              (0, k.jsxs)("form", {
                onSubmit: async (e) => {
                  e.preventDefault();
                  if (submitting) return;
                  let t = {};
                  if (
                    (x.trim().length < 2 && (t.name = r("checkout.err.name")),
                    e_(N) || (t.phone = r("checkout.err.phone")),
                    "delivery" === j &&
                      (T.trim().length < 2 || O.trim().length < 4) &&
                      (t.address = r("checkout.err.address")),
                    D(t),
                    Object.keys(t).length)
                  )
                    return void requestAnimationFrame(() => {
                      let e = document.querySelector('[aria-invalid="true"]');
                      e?.focus();
                    });
                  setSubmitting(true);
                  try {
                    let n = await u({
                      name: x,
                      phone: eB(N),
                      method: j,
                      branchId: C,
                      area: T,
                      address: O,
                      notes: I,
                    });
                    n && (m(n), f("done"), M(""));
                  } finally {
                    setSubmitting(false);
                  }
                },
                noValidate: !0,
                className: "flex min-h-0 flex-1 flex-col",
                children: [
                  (0, k.jsxs)("div", {
                    className:
                      "min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5",
                    children: [
                      (0, k.jsxs)("label", {
                        className: "block text-sm font-medium",
                        children: [
                          r("checkout.name"),
                          (0, k.jsx)("input", {
                            id: "co-name",
                            ref: R,
                            className: oH,
                            value: x,
                            onChange: (e) => {
                              (y(e.target.value),
                                L.name && D(({ name: e, ...t }) => t));
                            },
                            autoComplete: "name",
                            "aria-invalid": !!L.name,
                            "aria-describedby": L.name ? "co-name-err" : void 0,
                          }),
                          L.name &&
                            (0, k.jsx)("span", {
                              id: "co-name-err",
                              className: "mt-1 block text-[13px] text-sale",
                              children: L.name,
                            }),
                        ],
                      }),
                      (0, k.jsxs)("label", {
                        className: "block text-sm font-medium",
                        children: [
                          r("checkout.phone"),
                          (0, k.jsx)("input", {
                            id: "co-phone",
                            className: t0(oH, "num text-start"),
                            dir: "ltr",
                            inputMode: "tel",
                            autoComplete: "tel",
                            placeholder: "07XXXXXXXX",
                            value: N,
                            onChange: (e) => {
                              (S(eB(e.target.value)),
                                L.phone && D(({ phone: e, ...t }) => t));
                            },
                            "aria-invalid": !!L.phone,
                            "aria-describedby": L.phone
                              ? "co-phone-err"
                              : void 0,
                          }),
                          L.phone &&
                            (0, k.jsx)("span", {
                              id: "co-phone-err",
                              className: "mt-1 block text-[13px] text-sale",
                              children: L.phone,
                            }),
                        ],
                      }),
                      (0, k.jsxs)("fieldset", {
                        children: [
                          (0, k.jsx)("legend", {
                            className: "text-sm font-medium",
                            children: r("checkout.method"),
                          }),
                          (0, k.jsx)("div", {
                            className: "mt-1.5 grid grid-cols-2 gap-2",
                            children: ["pickup", "delivery"].map((e) =>
                              (0, k.jsxs)(
                                "label",
                                {
                                  className: t0(
                                    "flex h-11 cursor-pointer items-center justify-center rounded-[10px] border text-sm font-semibold transition-colors",
                                    j === e
                                      ? "border-flick bg-flick text-ink"
                                      : "bg-shelf-2 text-paper hover:border-flick/60",
                                  ),
                                  children: [
                                    (0, k.jsx)("input", {
                                      type: "radio",
                                      name: "method",
                                      value: e,
                                      checked: j === e,
                                      onChange: () => E(e),
                                      className: "sr-only",
                                    }),
                                    r(
                                      "pickup" === e
                                        ? "checkout.pickup"
                                        : "checkout.delivery",
                                    ),
                                  ],
                                },
                                e,
                              ),
                            ),
                          }),
                        ],
                      }),
                      "pickup" === j
                        ? (0, k.jsxs)("label", {
                            className: "block text-sm font-medium",
                            children: [
                              r("checkout.branch"),
                              (0, k.jsx)("select", {
                                id: "co-branch",
                                className: oH,
                                value: C,
                                onChange: (e) => z(e.target.value),
                                children: l.branches.map((e) =>
                                  (0, k.jsx)(
                                    "option",
                                    {
                                      value: e.id,
                                      children: r("branches.branch", {
                                        name: eZ(e.name, a),
                                      }),
                                    },
                                    e.id,
                                  ),
                                ),
                              }),
                            ],
                          })
                        : (0, k.jsxs)(k.Fragment, {
                            children: [
                              (0, k.jsxs)("label", {
                                className: "block text-sm font-medium",
                                children: [
                                  r("checkout.area"),
                                  (0, k.jsx)("input", {
                                    id: "co-area",
                                    className: oH,
                                    value: T,
                                    onChange: (e) => P(e.target.value),
                                    "aria-invalid": !!L.address,
                                  }),
                                ],
                              }),
                              (0, k.jsxs)("label", {
                                className: "block text-sm font-medium",
                                children: [
                                  r("checkout.address"),
                                  (0, k.jsx)("input", {
                                    id: "co-address",
                                    className: oH,
                                    value: O,
                                    onChange: (e) => {
                                      (A(e.target.value),
                                        L.address &&
                                          D(({ address: e, ...t }) => t));
                                    },
                                    autoComplete: "street-address",
                                    "aria-invalid": !!L.address,
                                    "aria-describedby": L.address
                                      ? "co-address-err"
                                      : void 0,
                                  }),
                                  L.address &&
                                    (0, k.jsx)("span", {
                                      id: "co-address-err",
                                      className:
                                        "mt-1 block text-[13px] text-sale",
                                      children: L.address,
                                    }),
                                ],
                              }),
                              (0, k.jsx)("p", {
                                className:
                                  "text-[13px] leading-relaxed text-dust",
                                children:
                                  window.FlickApp?.mode === "live" &&
                                  l.settings.deliveryFeeMinor != null
                                    ? a === "ar"
                                      ? `رسوم التوصيل ${(l.settings.deliveryFeeMinor / 1000).toFixed(3)} د.أ مشمولة في الإجمالي.`
                                      : `Delivery fee JOD ${(l.settings.deliveryFeeMinor / 1000).toFixed(3)} is included in the total.`
                                    : eZ(l.settings.deliveryNote, a),
                              }),
                            ],
                          }),
                      (0, k.jsxs)("label", {
                        className: "block text-sm font-medium",
                        children: [
                          r("checkout.notes"),
                          (0, k.jsx)("textarea", {
                            id: "co-notes",
                            className: t0(oH, "h-20 resize-none py-2.5"),
                            value: I,
                            onChange: (e) => M(e.target.value),
                            maxLength: 300,
                          }),
                        ],
                      }),
                      (0, k.jsx)("p", {
                        className: "text-[13px] text-dust",
                        children: r("checkout.privacy"),
                      }),
                    ],
                  }),
                  (0, k.jsxs)("div", {
                    className:
                      "border-t px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4",
                    children: [
                      (0, k.jsxs)("div", {
                        className: "mb-3 flex items-baseline justify-between",
                        children: [
                          (0, k.jsx)("span", {
                            className: "text-sm text-dust",
                            children: r("checkout.cod"),
                          }),
                          (0, k.jsx)(ng, {
                            value: g,
                            className: "font-display text-[24px] leading-none",
                          }),
                        ],
                      }),
                      (0, k.jsxs)("div", {
                        className: "flex gap-2",
                        children: [
                          (0, k.jsx)("button", {
                            type: "button",
                            onClick: () => f("bag"),
                            className:
                              "h-12 rounded-[10px] bg-shelf-2 px-4 text-sm font-semibold",
                            children: r("checkout.back"),
                          }),
                          (0, k.jsx)("button", {
                            type: "submit",
                            className:
                              "h-12 flex-1 rounded-[10px] bg-flick text-[15px] font-bold text-ink hover:bg-flick/90",
                            children: r("checkout.place"),
                            disabled: submitting,
                            "aria-busy": submitting,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            "done" === d &&
              p &&
              (0, k.jsxs)("div", {
                className:
                  "flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-8",
                children: [
                  (0, k.jsx)(Z, {
                    className: "size-12 text-flick",
                    "aria-hidden": !0,
                  }),
                  (0, k.jsx)("p", {
                    className: "mt-4 font-display text-[30px] leading-tight",
                    children: r("done.title"),
                  }),
                  (0, k.jsx)("p", {
                    className: "mt-4 text-sm text-dust",
                    children: r("done.number"),
                  }),
                  (0, k.jsx)("p", {
                    className:
                      "num font-display text-[40px] leading-none text-flick",
                    dir: "ltr",
                    children: p.id,
                  }),
                  (0, k.jsx)("p", {
                    className:
                      "mt-5 rounded-[10px] bg-shelf-2 p-3 text-[13px] leading-relaxed text-dust",
                    children: r("done.demo"),
                  }),
                  (0, k.jsxs)("div", {
                    className: "mt-6 flex flex-col gap-2",
                    children: [
                      (0, k.jsx)("button", {
                        type: "button",
                        onClick: () => {
                          (c(!1),
                            nw(
                              window.FlickApp?.mode === "live"
                                ? "shop"
                                : "admin/orders",
                            ));
                        },
                        className:
                          "h-12 rounded-[10px] bg-shelf-2 text-sm font-semibold",
                        children: r("done.admin"),
                      }),
                      (0, k.jsx)("button", {
                        type: "button",
                        onClick: () => c(!1),
                        className:
                          "h-12 rounded-[10px] text-sm font-semibold text-dust hover:text-paper",
                        children: r("done.close"),
                      }),
                    ],
                  }),
                ],
              }),
          ],
        }),
      ],
    }),
  });
}
var w = x("aIIwE");
function o_({ children: e }) {
  return (0, k.jsx)("h1", {
    className:
      "mx-auto max-w-6xl px-4 pt-8 font-display text-[44px] leading-none sm:px-6 sm:text-[56px] md:pt-12",
    children: e,
  });
}
function oq() {
  let { t: e, content: t } = nm(),
    n = (0, w.useMemo)(() => l6(t.products), [t.products]);
  return (0, k.jsxs)(k.Fragment, {
    children: [
      (0, k.jsx)(o_, { children: e("offers.page") }),
      (0, k.jsxs)("div", {
        className: "mt-8 space-y-14",
        children: [
          (0, k.jsx)(l5, { full: !0 }),
          (0, k.jsxs)("section", {
            className: "mx-auto max-w-6xl px-4 sm:px-6",
            children: [
              (0, k.jsx)("h2", {
                className: "mb-5 font-display text-[30px]",
                children: e("offers.title"),
              }),
              0 === n.length
                ? (0, k.jsx)("p", {
                    className: "rounded-[14px] border p-5 text-dust",
                    children: e("offers.empty"),
                  })
                : (0, k.jsx)("div", {
                    className:
                      "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4",
                    children: n.map(({ product: e, variantKey: t }) =>
                      (0, k.jsx)(l1, { product: e, variantKey: t }, e.id),
                    ),
                  }),
            ],
          }),
        ],
      }),
    ],
  });
}
function oW() {
  let { t: e } = nm();
  return (0, k.jsxs)(k.Fragment, {
    children: [
      (0, k.jsx)(o_, { children: e("nav.tradein") }),
      (0, k.jsx)("div", { className: "mt-8", children: (0, k.jsx)(oe, {}) }),
    ],
  });
}
let oV = {
  name: "banknote",
  size: 24,
  node: [
    [
      "rect",
      { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" },
    ],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
    ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }],
  ],
};
oV.node;
let oQ = Q(oV),
  oK = {
    name: "store",
    size: 24,
    node: [
      [
        "path",
        { d: "M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5", key: "slp6dd" },
      ],
      [
        "path",
        {
          d: "M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",
          key: "o0xfot",
        },
      ],
      [
        "path",
        {
          d: "M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05",
          key: "wn3emo",
        },
      ],
    ],
  };
oK.node;
let oY = Q(oK);
function oG({ id: e, variantKey: t }) {
  let { t: a, lang: l, content: o, addToBag: i, setBagOpen: s } = nm(),
    c = o.products.find((t) => t.id === e && t.visible),
    [u, d] = (0, w.useState)(t);
  (0, w.useEffect)(() => d(t), [e, t]);
  let f = (0, w.useMemo)(
    () =>
      c
        ? o.products
            .filter((e) => e.visible && e.cat === c.cat && e.id !== c.id)
            .slice(0, 4)
        : [],
    [o.products, c],
  );
  if (!c)
    return (0, k.jsxs)("div", {
      className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
      children: [
        (0, k.jsx)("p", {
          className: "font-display text-3xl",
          children: a("product.notfound"),
        }),
        (0, k.jsx)("a", {
          href: nk("shop"),
          className:
            "mt-6 inline-flex h-11 items-center rounded-[10px] bg-flick px-5 text-sm font-bold text-ink",
          children: a("featured.all"),
        }),
      ],
    });
  let p = c.variants.find((e) => e.key === u) ?? eA(c),
    m = eZ(c.name, l);
  return (0, k.jsxs)("div", {
    className: "mx-auto max-w-6xl px-4 pt-6 sm:px-6 md:pt-10",
    children: [
      (0, k.jsxs)("a", {
        href: nk(`shop/${c.cat}`),
        className:
          "inline-flex items-center gap-1.5 text-sm font-semibold text-dust hover:text-paper",
        children: [
          "ar" === l
            ? (0, k.jsx)(J, { className: "size-4", "aria-hidden": !0 })
            : (0, k.jsx)(Y, { className: "size-4", "aria-hidden": !0 }),
          a(lG(c.cat)),
        ],
      }),
      (0, k.jsxs)("div", {
        className: "mt-4 grid gap-8 md:grid-cols-2 md:gap-12",
        children: [
          (0, k.jsxs)("div", {
            children: [
              (0, k.jsx)(nv, {
                product: c,
                eager: !0,
                className: "aspect-[4/3] rounded-[20px] md:aspect-square",
                artClass: "p-[6%] md:p-[10%]",
              }),
              eC(c)
                ? null
                : (0, k.jsx)("p", {
                    className: "mt-2 text-xs text-dust",
                    children: a("product.photoNote"),
                  }),
            ],
          }),
          (0, k.jsxs)("div", {
            className: "min-w-0",
            children: [
              (0, k.jsx)("p", {
                className: "text-sm text-dust",
                children: c.brand || a(lG(c.cat)),
              }),
              (0, k.jsx)("h1", {
                className:
                  "mt-1 font-display text-[clamp(34px,6vw,52px)] leading-[1.08]",
                dir: "auto",
                children: m,
              }),
              (0, k.jsx)(FlickVariantPicker, {
                product: c,
                variant: p,
                onSelect: (key) => d(key),
              }),
              (0, k.jsxs)("div", {
                className: "mt-6",
                children: [
                  (0, k.jsx)(nb, { variant: p, size: "lg" }),
                  eP(p) &&
                    (0, k.jsxs)("p", {
                      className: "mt-2 text-sm font-semibold text-sale",
                      children: [
                        a("save.amount", { amount: "" }),
                        (0, k.jsx)(ng, { value: p.price - p.offerPrice }),
                      ],
                    }),
                ],
              }),
              !flickDeviceFeatures.available(p) &&
                (0, k.jsx)("p", {
                  className: "mt-4 text-sm text-sale",
                  children: a("product.optionOut"),
                }),
              (0, k.jsxs)("div", {
                className: "mt-6 flex flex-col gap-2 sm:flex-row",
                children: [
                  (0, k.jsx)("button", {
                    type: "button",
                    onClick: () => {
                      (i(c.id, p.key),
                        D.success(a("card.added", { name: m }), {
                          action: {
                            label: a("bag.title"),
                            onClick: () => s(!0),
                          },
                        }));
                    },
                    disabled: !flickDeviceFeatures.available(p),
                    className:
                      "h-12 flex-1 rounded-[10px] bg-flick px-5 text-[15px] font-bold text-ink hover:bg-flick/90 disabled:opacity-50",
                    children: flickDeviceFeatures.available(p)
                      ? a("product.add")
                      : a("card.soldout"),
                  }),
                ],
              }),
              (0, k.jsx)(FlickDeviceDetails, { product: c, variant: p }),
              (0, k.jsxs)("ul", {
                className: "mt-6 space-y-3 border-t pt-5 text-sm text-paper",
                children: [
                  (0, k.jsxs)("li", {
                    className: "flex items-start gap-3",
                    children: [
                      (0, k.jsx)(oY, {
                        className: "mt-0.5 size-4 shrink-0 text-flick",
                        "aria-hidden": !0,
                      }),
                      a("product.pickup"),
                    ],
                  }),
                  (0, k.jsxs)("li", {
                    className: "flex items-start gap-3",
                    children: [
                      (0, k.jsx)(oQ, {
                        className: "mt-0.5 size-4 shrink-0 text-flick",
                        "aria-hidden": !0,
                      }),
                      a("product.cod"),
                    ],
                  }),
                  (0, k.jsxs)("li", {
                    className: "flex items-start gap-3",
                    children: [
                      (0, k.jsx)(l_, {
                        className: "mt-0.5 size-4 shrink-0 text-flick",
                        "aria-hidden": !0,
                      }),
                      (0, k.jsx)("a", {
                        href: o.settings.tradeInUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className:
                          "underline underline-offset-4 hover:text-flick",
                        children: a("product.tradein"),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      f.length > 0 &&
        (0, k.jsxs)("section", {
          className: "mt-16",
          children: [
            (0, k.jsx)("h2", {
              className: "mb-5 font-display text-[28px]",
              children: a("product.related"),
            }),
            (0, k.jsx)("div", {
              className:
                "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4",
              children: f.map((e) => (0, k.jsx)(l1, { product: e }, e.id)),
            }),
          ],
        }),
    ],
  });
}
var w = (x("aIIwE"), x("aIIwE"));
let oJ =
  "h-11 rounded-[10px] border border-input bg-shelf-2 px-3 text-[15px] text-paper focus:border-flick focus:outline-none";
function oX({ cat: e }) {
  let { t: t, content: n } = nm(),
    r = l2(),
    a = eT.includes(e) ? e : "all",
    [l, o] = (0, w.useState)(""),
    [i, s] = (0, w.useState)("all"),
    [c, u] = (0, w.useState)("featured"),
    [deviceCondition, setDeviceCondition] = (0, w.useState)("all"),
    d = (0, w.useMemo)(
      () => ("all" === a ? r : r.filter((e) => e.cat === a)),
      [r, a],
    ),
    f = (0, w.useMemo)(
      () =>
        [...new Set(d.map((e) => e.brand))].sort((e, t) =>
          e ? (t ? e.localeCompare(t) : -1) : 1,
        ),
      [d],
    ),
    p = "all" === i || f.includes(i),
    m = (0, w.useMemo)(() => {
      let e = l.trim().toLowerCase(),
        t = d.filter(
          (e) =>
            ("all" === i || !p || e.brand === i) &&
            ("all" === deviceCondition ||
              e.variants.some(
                (v) =>
                  flickDeviceFeatures.conditionGroup(v) === deviceCondition,
              )),
        );
      return (
        e &&
          (t = t.filter((t) =>
            `${t.name.ar} ${t.name.en} ${t.brand}`.toLowerCase().includes(e),
          )),
        (t = [...t].sort((e, t) => {
          if ("low" === c) return eI(e) - eI(t);
          if ("high" === c) return eI(t) - eI(e);
          if ("offers" === c)
            return (
              Number(eM(t)) - Number(eM(e)) ||
              n.products.indexOf(e) - n.products.indexOf(t)
            );
          return (
            Number(t.featured) - Number(e.featured) ||
            n.products.indexOf(e) - n.products.indexOf(t)
          );
        }))
      );
    }, [d, l, i, p, c, n.products, deviceCondition]),
    h = "" !== l.trim() || ("all" !== i && p) || deviceCondition !== "all";
  return (0, k.jsxs)("div", {
    className: "mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12",
    children: [
      (0, k.jsxs)("div", {
        className: "flex flex-wrap items-end justify-between gap-3",
        children: [
          (0, k.jsx)("h1", {
            className: "font-display text-[44px] leading-none sm:text-[56px]",
            children: "all" === a ? t("shop.title") : t(lG(a)),
          }),
          (0, k.jsx)("p", {
            className: "num text-sm text-dust",
            "aria-live": "polite",
            children: t("shop.count", { n: m.length }),
          }),
        ],
      }),
      n.settings.conceptNotice &&
        (0, k.jsx)("p", {
          className: "mt-3 max-w-2xl text-sm text-dust",
          children: t("shop.note"),
        }),
      (0, k.jsx)("div", {
        role: "tablist",
        "aria-label": t("shop.tabs"),
        className:
          "shelf-scroll -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0",
        children: ["all", ...eT].map((e) => {
          let n = "all" === e ? r.length : r.filter((t) => t.cat === e).length;
          if (window.FlickApp?.mode !== "live" && "all" !== e && 0 === n)
            return null;
          let l = a === e;
          return (0, k.jsxs)(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": l,
              onClick: () => {
                var t;
                let n;
                ((n = nk("all" === (t = e) ? "shop" : `shop/${t}`)),
                  location.hash !== n &&
                    (history.replaceState(null, "", n),
                    window.dispatchEvent(new PopStateEvent("popstate"))),
                  s("all"));
              },
              className: t0(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                l
                  ? "border-flick bg-flick text-ink"
                  : "bg-shelf text-paper hover:border-flick",
              ),
              children: [
                "all" === e ? t("cat.all") : t(lG(e)),
                (0, k.jsx)("span", {
                  className: t0("num text-xs", l ? "text-ink/70" : "text-dust"),
                  children: n,
                }),
              ],
            },
            e,
          );
        }),
      }),
      (0, k.jsxs)("div", {
        className: "mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]",
        children: [
          (0, k.jsxs)("label", {
            className: "relative block",
            children: [
              (0, k.jsx)("span", {
                className: "sr-only",
                children: t("shop.search"),
              }),
              (0, k.jsx)(em, {
                className:
                  "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-dust",
                "aria-hidden": !0,
              }),
              (0, k.jsx)("input", {
                id: "shop-search",
                type: "search",
                value: l,
                onChange: (e) => o(e.target.value),
                placeholder: t("shop.search"),
                className: t0(oJ, "w-full ps-9"),
              }),
            ],
          }),
          (0, k.jsxs)("div", {
            className: "grid grid-cols-2 gap-2 sm:contents",
            children: [
              (0, k.jsxs)("label", {
                className: "block",
                children: [
                  (0, k.jsx)("span", {
                    className: "sr-only",
                    children: t("shop.brand"),
                  }),
                  (0, k.jsxs)("select", {
                    id: "shop-brand",
                    value: p ? i : "all",
                    onChange: (e) => s(e.target.value),
                    className: t0(oJ, "w-full"),
                    children: [
                      (0, k.jsx)("option", {
                        value: "all",
                        children: t("shop.allBrands"),
                      }),
                      f.map((e) =>
                        (0, k.jsx)(
                          "option",
                          { value: e, children: e || t("shop.otherBrand") },
                          e || "none",
                        ),
                      ),
                    ],
                  }),
                ],
              }),
              (0, k.jsxs)("label", {
                className: "block",
                children: [
                  (0, k.jsx)("span", {
                    className: "sr-only",
                    children: t("shop.sort"),
                  }),
                  (0, k.jsxs)("select", {
                    id: "shop-sort",
                    value: c,
                    onChange: (e) => u(e.target.value),
                    className: t0(oJ, "w-full"),
                    children: [
                      (0, k.jsx)("option", {
                        value: "featured",
                        children: t("sort.featured"),
                      }),
                      (0, k.jsx)("option", {
                        value: "offers",
                        children: t("sort.offers"),
                      }),
                      (0, k.jsx)("option", {
                        value: "low",
                        children: t("sort.low"),
                      }),
                      (0, k.jsx)("option", {
                        value: "high",
                        children: t("sort.high"),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      (0, k.jsxs)("label", {
        className: "flick-condition-filter",
        htmlFor: "shop-condition",
        children: [
          (0, k.jsx)("span", { children: t("device.condition") }),
          (0, k.jsx)("select", {
            id: "shop-condition",
            value: deviceCondition,
            onChange: (event) => setDeviceCondition(event.target.value),
            children: [
              (0, k.jsx)("option", {
                value: "all",
                children: t("device.allConditions"),
              }),
              (0, k.jsx)("option", { value: "new", children: t("device.new") }),
              (0, k.jsx)("option", {
                value: "used",
                children: t("device.used"),
              }),
            ],
          }),
        ],
      }),
      0 === m.length
        ? (0, k.jsxs)("div", {
            className: "mt-10 rounded-[14px] border p-6",
            children: [
              (0, k.jsx)("p", {
                className: "text-paper",
                children: t("shop.empty"),
              }),
              h &&
                (0, k.jsxs)("button", {
                  type: "button",
                  onClick: () => {
                    (o(""), s("all"), setDeviceCondition("all"));
                  },
                  className:
                    "mt-4 inline-flex h-10 items-center gap-2 rounded-[10px] bg-shelf-2 px-4 text-sm font-semibold",
                  children: [
                    (0, k.jsx)(ls, { className: "size-4", "aria-hidden": !0 }),
                    t("shop.clear"),
                  ],
                }),
            ],
          })
        : (0, k.jsx)("div", {
            className:
              "mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4",
            children: m.map((e) =>
              (0, k.jsx)(
                l1,
                {
                  product: e,
                  variantKey:
                    deviceCondition === "all"
                      ? void 0
                      : (
                          e.variants.find(
                            (v) =>
                              flickDeviceFeatures.conditionGroup(v) ===
                                deviceCondition &&
                              flickDeviceFeatures.available(v),
                          ) ??
                          e.variants.find(
                            (v) =>
                              flickDeviceFeatures.conditionGroup(v) ===
                              deviceCondition,
                          )
                        )?.key,
                },
                e.id,
              ),
            ),
          }),
    ],
  });
}
function oZ({ route: e }) {
  let t,
    [n, r, a] = e;
  return (
    (t = n
      ? "shop" === n
        ? (0, k.jsx)(oX, { cat: r })
        : "p" === n && r
          ? (0, k.jsx)(oG, { id: r, variantKey: a })
          : "offers" === n
            ? (0, k.jsx)(oq, {})
            : "maintenance" === n || "branches" === n
              ? (0, k.jsx)(
                  of,
                  { issue: "maintenance" === n ? r : void 0 },
                  r ?? "",
                )
              : "trade-in" === n
                ? (0, k.jsx)(oW, {})
                : (0, k.jsx)(or, {})
      : (0, k.jsx)(or, {})),
    (0, k.jsxs)(k.Fragment, {
      children: [
        (0, k.jsx)(lJ, {}),
        (0, k.jsx)(lZ, { route: e }),
        (0, k.jsx)("main", {
          id: "main",
          className: "min-h-[60vh]",
          children: t,
        }),
        (0, k.jsx)(l0, {}),
        (0, k.jsx)(l$, { route: e }),
        (0, k.jsx)(oU, {}),
      ],
    })
  );
}
function o$() {
  let e = (function () {
      let [e, t] = (0, w.useState)(() => ny(location.hash));
      return (
        (0, w.useEffect)(() => {
          let e = () => t(ny(location.hash));
          return (
            window.addEventListener("hashchange", e),
            window.addEventListener("popstate", e),
            () => {
              (window.removeEventListener("hashchange", e),
                window.removeEventListener("popstate", e));
            }
          );
        }, []),
        e
      );
    })(),
    { lang: t } = nm();
  !(function (e) {
    let { t: t, lang: n, content: r } = nm();
    (0, w.useEffect)(() => {
      let [a, l] = e,
        o = "";
      ("shop" === a
        ? (o = l && eT.includes(l) ? t(`cat.${l}`) : t("shop.title"))
        : "p" === a
          ? (o = eZ(r.products.find((e) => e.id === l)?.name, n))
          : "offers" === a
            ? (o = t("offers.page"))
            : "maintenance" === a || "branches" === a
              ? (o = t("maint.title"))
              : "trade-in" === a
                ? (o = t("nav.tradein"))
                : "admin" === a && (o = t("admin.title")),
        (document.title = o
          ? `${o} | FLiCK Mobile`
          : `FLiCK Mobile | ${t("hero.l1")} ${t("hero.l2")}`));
    }, [e, t, n, r.products]);
  })(e);
  let n = (0, w.useRef)(e);
  return (
    (0, w.useEffect)(() => {
      let t = n.current;
      ((n.current = e),
        ("shop" !== t[0] || "shop" !== e[0]) && window.scrollTo({ top: 0 }));
    }, [e]),
    (0, k.jsxs)(k.Fragment, {
      children: [
        "admin" === e[0]
          ? (0, k.jsx)(flickAdminRoute, { page: e[1] })
          : (0, k.jsx)(oZ, { route: e }),
        (0, k.jsx)(U, {
          position: "bottom-center",
          offset: { bottom: 24 },
          mobileOffset: { bottom: "calc(76px + env(safe-area-inset-bottom))" },
          dir: "ar" === t ? "rtl" : "ltr",
          toastOptions: {
            style: {
              background: "hsl(36 8% 14%)",
              color: "hsl(45 22% 95%)",
              border: "1px solid hsl(45 20% 90% / 0.12)",
              fontFamily: "inherit",
            },
          },
        }),
      ],
    })
  );
}
