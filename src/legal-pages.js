// Privacy Policy and Terms & Conditions pages, the footer trademark notice and the
// consent checkbox. Text lives in shared/legal.js (also used by the server pages).
import {
  LEGAL as flickLegal,
  trademarkNotice as flickTrademarkNotice,
} from "../shared/legal.js";

function flickLegalPage({ kind: e }) {
  let { lang: t, content: n } = nm(),
    r = "terms" === e ? flickLegal.terms : flickLegal.privacy,
    a = (e) => e?.[t] || e?.en || "",
    l = new Date(`${flickLegal.updated}T00:00:00`).toLocaleDateString(
      "ar" === t ? "ar-JO" : "en-GB",
      { year: "numeric", month: "long", day: "numeric" },
    );
  return (0, k.jsxs)("article", {
    className: "flick-legal mx-auto max-w-3xl px-4 pt-8 sm:px-6 md:pt-12",
    children: [
      (0, k.jsx)("h1", {
        className: "font-display text-[40px] leading-none sm:text-[56px]",
        children: a(r.title),
      }),
      (0, k.jsx)("p", {
        className: "mt-3 text-sm text-dust",
        children: ("ar" === t ? "آخر تحديث: " : "Last updated: ") + l,
      }),
      (0, k.jsx)("p", {
        className: "mt-6 text-[16px] leading-relaxed text-paper",
        children: a(r.intro),
      }),
      ...r.sections.map((e, r) =>
        (0, k.jsxs)(
          "section",
          {
            className: "mt-8",
            children: [
              (0, k.jsx)("h2", {
                className: "font-display text-[24px] leading-tight text-paper",
                children: a(e.title),
              }),
              ...e.body.map((e, r) =>
                (0, k.jsx)(
                  "p",
                  {
                    className: "mt-3 text-[15px] leading-relaxed text-dust",
                    children: e.notice
                      ? flickTrademarkNotice(n.products, t)
                      : a(e),
                  },
                  r,
                ),
              ),
            ],
          },
          r,
        ),
      ),
      (0, k.jsx)("p", {
        className: "mt-10 text-sm",
        children: (0, k.jsx)("a", {
          href: nk("terms" === e ? "privacy" : "terms"),
          className: "font-semibold text-flick hover:underline",
          children:
            "terms" === e ? a(flickLegal.privacy.title) : a(flickLegal.terms.title),
        }),
      }),
    ],
  });
}

function flickLegalTitle(e, t) {
  let n = "terms" === e ? flickLegal.terms : flickLegal.privacy;
  return n.title[t] || n.title.en;
}

function flickTrademarkLine() {
  let { lang: e, content: t } = nm();
  return (0, k.jsx)("span", {
    className: "flick-trademark",
    children: flickTrademarkNotice(t.products, e),
  });
}

// Required "I agree" checkbox before an order or repair request is sent.
function flickConsent({ id: e, checked: t, onChange: n, error: r }) {
  let { lang: a } = nm(),
    l = "ar" === a;
  return (0, k.jsxs)("div", {
    children: [
      (0, k.jsxs)("label", {
        htmlFor: e,
        className: "flex items-start gap-2.5 text-[13px] leading-relaxed text-dust",
        children: [
          (0, k.jsx)("input", {
            id: e,
            type: "checkbox",
            checked: t,
            onChange: (e) => n(e.target.checked),
            "aria-invalid": !!r,
            className: "flick-consent-box mt-0.5 size-4 shrink-0",
          }),
          (0, k.jsxs)("span", {
            children: [
              l ? "أوافق على " : "I agree to the ",
              (0, k.jsx)("a", {
                href: nk("terms"),
                target: "_blank",
                rel: "noopener",
                className: "font-semibold text-paper underline underline-offset-2",
                children: l ? "الشروط والأحكام" : "Terms & Conditions",
              }),
              l ? " و" : " and the ",
              (0, k.jsx)("a", {
                href: nk("privacy"),
                target: "_blank",
                rel: "noopener",
                className: "font-semibold text-paper underline underline-offset-2",
                children: l ? "سياسة الخصوصية" : "Privacy Policy",
              }),
              ".",
            ],
          }),
        ],
      }),
      r &&
        (0, k.jsx)("span", {
          className: "mt-1 block text-[13px] text-sale",
          children: r,
        }),
    ],
  });
}

const flickConsentError = (e) =>
  "ar" === e
    ? "يجب الموافقة على الشروط والأحكام وسياسة الخصوصية."
    : "Please agree to the Terms & Conditions and Privacy Policy.";
