import * as FlickRules from "../shared/domain.js";

if (window.FlickLive?.enabled) {
  const api = window.FlickApp,
    R = api.React,
    h = R.createElement;
  const L = (lang, ar, en) => (lang === "ar" ? ar : en);
  const errors = {
    "ordering-disabled": [
      "استقبال الطلبات مغلق حاليًا.",
      "Ordering is currently closed.",
    ],
    unauthorized: ["سجّل دخول الإدارة مجددًا.", "Please sign in again."],
    "content-conflict": [
      "تغيّر الكتالوج أو المخزون. أعد تحميل الصفحة وراجع التعديل قبل الحفظ.",
      "Catalog or stock changed. Reload and review your changes before saving.",
    ],
    "price-changed": [
      "تغيّر السعر. حدّث السلة وراجع الإجمالي.",
      "The price changed. Refresh your bag and review the total.",
    ],
    unavailable: [
      "الخيار أو الكمية المطلوبة غير متوفرة.",
      "The requested option or quantity is unavailable.",
    ],
    "rate-limited": [
      "طلبات كثيرة. حاول لاحقًا.",
      "Too many attempts. Please try later.",
    ],
    "invalid-credentials": [
      "كلمة المرور غير صحيحة.",
      "The password is incorrect.",
    ],
    "invalid-reset": [
      "رابط الاستعادة غير صالح أو منتهي.",
      "This reset link is invalid or expired.",
    ],
    "record-conflict": [
      "تغيّر هذا السجل في جلسة أخرى. أعد تحميله قبل التعديل.",
      "This record changed in another session. Reload it before editing.",
    ],
    "auth-unavailable": [
      "إعداد الدخول غير مكتمل. تحقق من أسرار Cloudflare في دليل المالك.",
      "Sign in configuration is incomplete. Check the Cloudflare secrets in the owner guide.",
    ],
    "weak-password": [
      "استخدم 12–200 حرفًا، مع حرف ورقم أو رمز، وكلمة مرور غير شائعة.",
      "Use 12–200 characters including a letter and a number or symbol, and avoid common passwords.",
    ],
    "invalid-photo": [
      "الصورة غير صالحة. استخدم PNG أو JPEG أو WebP.",
      "Invalid image. Use PNG, JPEG or WebP.",
    ],
    "consent-required": [
      "يجب الموافقة على الشروط والأحكام وسياسة الخصوصية.",
      "Please agree to the Terms & Conditions and Privacy Policy.",
    ],
    "body-too-large": [
      "حجم الملف أو الطلب أكبر من الحد المسموح.",
      "The file or request exceeds the size limit.",
    ],
  };
  function explain(error, lang = api.readLanguage()) {
    const pair = errors[error.code];
    return pair
      ? pair[lang === "ar" ? 0 : 1]
      : L(
          lang,
          "تعذّر إتمام العملية. تحقق من البيانات والاتصال وحاول مجددًا.",
          "The operation could not be completed. Check the details and connection, then retry.",
        );
  }
  async function request(path, { method = "GET", body, raw = false } = {}) {
    const headers = {};
    if (method !== "GET") headers["X-Flick-CSRF"] = "1";
    if (body !== undefined)
      headers["Content-Type"] = raw ? body.type : "application/json";
    let response;
    try {
      response = await fetch(path, {
        method,
        headers,
        credentials: "same-origin",
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
        body:
          body === undefined ? undefined : raw ? body : JSON.stringify(body),
      });
    } catch {
      throw Object.assign(new Error("network-unavailable"), {
        code: "network-unavailable",
      });
    }
    let data;
    try {
      data = await response.json();
    } catch {
      throw Object.assign(new Error("invalid-response"), {
        code: "invalid-response",
      });
    }
    if (!response.ok)
      throw Object.assign(new Error(data.error || "request-failed"), {
        code: data.error || "request-failed",
        status: response.status,
      });
    return data;
  }
  const currentLang = () =>
    location.pathname.startsWith("/en")
      ? "en"
      : location.pathname.startsWith("/ar")
        ? "ar"
        : api.readLanguage();
  api.configure({
    mode: "live",
    routeParts(hash) {
      if (
        hash.startsWith("#/") &&
        !location.pathname.startsWith("/admin/reset")
      )
        return api.parseHashRoute(hash);
      const parts = location.pathname
        .split("/")
        .filter(Boolean)
        .map((p) => {
          try {
            return decodeURIComponent(p);
          } catch {
            return p;
          }
        });
      return ["ar", "en"].includes(parts[0]) ? parts.slice(1) : parts;
    },
    routeHref(route) {
      const clean = route.replace(/^\/+/, "");
      if (clean.startsWith("admin")) return "/" + clean;
      return (
        "/" +
        currentLang() +
        "/" +
        clean.split("/").map(encodeURIComponent).join("/")
      );
    },
    navigateLive(route) {
      history.pushState(null, "", api.routeHref(route));
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0 });
    },
  });
  // Live copy never describes a saved server record as a browser demo.
  const liveWords = {
    "concept.text": [
      "كتالوج مبدئي؛ راجع الأسعار والصور مع الإدارة قبل إطلاق المتجر.",
      "Initial catalog; review prices and photos with the owner before launch.",
    ],
    "concept.admin": ["لوحة الإدارة", "Administration"],
    "done.demo": [
      "تم حفظ طلبك. سيتواصل معك الفريق لتأكيد التفاصيل.",
      "Your request was saved. The team will contact you to confirm the details.",
    ],
    "done.admin": ["متابعة التسوّق", "Continue shopping"],
    "admin.demo": ["إدارة المتجر", "Store administration"],
    "orders.delete": ["أرشفة", "Archive"],
    "orders.deleteQ": [
      "أرشفة هذا السجل؟ يبقى محفوظًا في قاعدة البيانات.",
      "Archive this record? It remains stored in the database.",
    ],
    "orders.deleted": ["تمت أرشفة السجل.", "Record archived."],
    "price.example": [
      "راجع السعر والتوفر عند تأكيد الطلب.",
      "Price and availability are confirmed with your order.",
    ],
  };
  const originalTranslate = api.translate;
  function translate(lang, key, params) {
    const value = liveWords[key];
    return value
      ? value[lang === "ar" ? 0 : 1]
      : originalTranslate(lang, key, params);
  }
  async function uploadImages(content) {
    const copy = structuredClone(content);
    const upload = async (value) => {
      if (typeof value !== "string" || !value.startsWith("data:")) return value;
      // Decode locally: a data-URL fetch is blocked by the live connect-src CSP.
      const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(value);
      if (!match) throw { code: "invalid-image" };
      if (match[2].length > 1333340) throw { code: "body-too-large" };
      const raw = atob(match[2]);
      const blob = new Blob([Uint8Array.from(raw, char => char.charCodeAt(0))], { type: match[1] });
      if (blob.size > 1000000) throw { code: "body-too-large" };
      return (
        await request("/api/admin/photo", {
          method: "POST",
          body: blob,
          raw: true,
        })
      ).url;
    };
    for (const p of copy.products) if (p.photo) p.photo = await upload(p.photo);
    for (const c of copy.categories || [])
      if (c.image) c.image = await upload(c.image);
    if (copy.appearance?.heroImage)
      copy.appearance.heroImage = await upload(copy.appearance.heroImage);
    return FlickRules.cleanContent(copy);
  }
  async function stableKey(scope, body) {
    const bytes = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(JSON.stringify(body)),
    );
    const hash = [...new Uint8Array(bytes)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
    const name = "flick.live.request." + scope;
    let old;
    try {
      old = JSON.parse(sessionStorage.getItem(name));
    } catch {}
    if (old?.hash === hash) return old.key;
    const key = crypto.randomUUID();
    try {
      sessionStorage.setItem(name, JSON.stringify({ hash, key }));
    } catch {}
    return key;
  }
  function clearKey(scope) {
    try {
      sessionStorage.removeItem("flick.live.request." + scope);
    } catch {}
  }
  function LiveProvider({ children }) {
    const initial = window.__FLICK_BOOTSTRAP__;
    const [snapshot, setSnapshot] = R.useState(
      initial?.content ? initial : null,
    );
    const [lang, setLanguage] = R.useState(currentLang);
    const [bag, setBag] = R.useState(() => {
      try {
        const value = JSON.parse(localStorage.getItem("flick.live.bag.v1"));
        return Array.isArray(value)
          ? value
              .filter(
                (l) =>
                  typeof l.productId === "string" &&
                  Number.isInteger(l.qty) &&
                  l.qty > 0,
              )
              .slice(0, 30)
          : [];
      } catch {
        return [];
      }
    });
    const [bagOpen, setBagOpen] = R.useState(false),
      [orders, setOrders] = R.useState([]),
      [maint, setMaint] = R.useState([]);
    const [cursors, setCursors] = R.useState({
      orders: null,
      maintenance: null,
    });
    const [auth, setAuth] = R.useState(null),
      [privateReady, setPrivateReady] = R.useState(false),
      [startupError, setStartupError] = R.useState(false),
      [saving, setSaving] = R.useState(false);
    const refs = R.useRef({});
    refs.current = { snapshot, bag, lang, orders, maint, saving, auth };
    const accept = R.useCallback((data) => {
      api.setCategories(data.content.categories);
      setSnapshot(data);
    }, []);
    const loadPublic = R.useCallback(async () => {
      const data = await request("/api/content");
      accept(data);
      setStartupError(false);
      return data;
    }, [accept]);
    const loadAdmin = R.useCallback(async () => {
      const [catalog, purchases, repairs] = await Promise.all([
        request("/api/admin/content"),
        request("/api/admin/orders"),
        request("/api/admin/maintenance"),
      ]);
      accept(catalog);
      setOrders(purchases.orders);
      setMaint(repairs.requests);
      setPrivateReady(true);
      setCursors({
        orders: purchases.nextBefore,
        maintenance: repairs.nextBefore,
      });
    }, [accept]);
    const checkAuth = R.useCallback(async () => {
      const state = await request("/api/admin/session");
      setAuth(state);
      if (state.authenticated) await loadAdmin();
      else setPrivateReady(false);
      return state;
    }, [loadAdmin]);
    R.useEffect(() => {
      let live = true;
      if (initial?.content) api.setCategories(initial.content.categories);
      if (!location.pathname.startsWith("/admin"))
        loadPublic().catch(() => {
          if (live) setStartupError(true);
        });
      const timer = setInterval(() => {
        if (
          !location.pathname.startsWith("/admin") &&
          document.visibilityState === "visible"
        )
          loadPublic().catch(() => {});
      }, 15000);
      return () => {
        live = false;
        clearInterval(timer);
      };
    }, []);
    R.useEffect(() => {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      try {
        localStorage.setItem("flick.lang", JSON.stringify(lang));
      } catch {}
    }, [lang]);
    R.useEffect(() => {
      try {
        localStorage.setItem("flick.live.bag.v1", JSON.stringify(bag));
      } catch {}
    }, [bag]);
    const setLang = (next) => {
      setLanguage(next);
      if (!location.pathname.startsWith("/admin")) {
        const path = location.pathname.replace(/^\/(?:ar|en)(?=\/|$)/, "");
        history.replaceState(null, "", "/" + next + (path || "/"));
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    };
    const mutate = async (action) => {
      if (refs.current.saving) return false;
      refs.current.saving = true;
      setSaving(true);
      try {
        await action();
        return true;
      } catch (error) {
        api.toast.error(explain(error, refs.current.lang));
        if (error.status === 401) {
          setAuth(null);
          setPrivateReady(false);
          setOrders([]);
          setMaint([]);
        }
        return false;
      } finally {
        refs.current.saving = false;
        setSaving(false);
      }
    };
    const updateContent = (updater) =>
      mutate(async () => {
        const current = refs.current.snapshot;
        const cleaned = await uploadImages(
          updater(structuredClone(current.content)),
        );
        const saved = await request("/api/admin/content", {
          method: "PUT",
          body: { content: cleaned, version: current.version },
        });
        accept(saved);
      });
    const updateRows = (kind, updater) =>
      mutate(async () => {
        const current = refs.current[kind === "orders" ? "orders" : "maint"];
        const updated = updater(structuredClone(current));
        for (const old of current)
          if (!updated.some((row) => row.id === old.id))
            await request(
              "/api/admin/" + kind + "/" + encodeURIComponent(old.id),
              { method: "DELETE", body: { version: old.version } },
            );
        for (const row of updated) {
          const old = current.find((item) => item.id === row.id);
          if (
            !old ||
            (row.status === old.status && row.privateNote === old.privateNote)
          )
            continue;
          const data = await request(
            "/api/admin/" + kind + "/" + encodeURIComponent(row.id),
            {
              method: "PATCH",
              body: {
                status: row.status,
                privateNote: row.privateNote || "",
                version: old.version,
              },
            },
          );
          row.version = (data.order || data.request).version;
        }
        (kind === "orders" ? setOrders : setMaint)(updated);
      });
    const loadOlder = async (kind) => {
      if (!cursors[kind]) return;
      try {
        const data = await request(
          "/api/admin/" + kind + "?before=" + cursors[kind],
        );
        (kind === "orders" ? setOrders : setMaint)((old) => [
          ...old,
          ...(kind === "orders" ? data.orders : data.requests),
        ]);
        setCursors((old) => ({ ...old, [kind]: data.nextBefore }));
      } catch (error) {
        api.toast.error(explain(error));
      }
    };
    const addToBag = (productId, variantKey) => {
      const p = refs.current.snapshot?.content.products.find(
          (p) => p.id === productId && p.visible,
        ),
        v = p?.variants.find((v) => v.key === variantKey);
      if (!FlickRules.available(v)) return;
      setBag((previous) => {
        const line = previous.find(
          (l) => l.productId === productId && l.variantKey === variantKey,
        );
        return line
          ? previous.map((l) =>
              l === line ? { ...l, qty: Math.min(5, l.qty + 1) } : l,
            )
          : [...previous, { productId, variantKey, qty: 1 }];
      });
    };
    const setQty = (productId, variantKey, qty) =>
      setBag((previous) =>
        qty <= 0
          ? previous.filter(
              (l) => l.productId !== productId || l.variantKey !== variantKey,
            )
          : previous.map((l) =>
              l.productId === productId && l.variantKey === variantKey
                ? { ...l, qty: Math.min(5, Math.max(1, Math.floor(qty))) }
                : l,
            ),
      );
    const placeOrder = async (details) => {
      try {
        const now = refs.current,
          content = now.snapshot.content;
        const lines = now.bag.map(({ productId, variantKey, qty }) => ({
          productId,
          variantKey,
          qty,
        }));
        const totalMinor = lines.reduce(
          (sum, line) => {
            const p = content.products.find((p) => p.id === line.productId),
              v = p?.variants.find((v) => v.key === line.variantKey);
            if (!v) throw { code: "unavailable" };
            return sum + FlickRules.unitMinor(v) * line.qty;
          },
          details.method === "delivery"
            ? content.settings.deliveryFeeMinor || 0
            : 0,
        );
        const body = { ...details, lines, totalMinor };
        body.idempotencyKey = await stableKey("order", body);
        body.version = now.snapshot.version;
        const data = await request("/api/orders", { method: "POST", body });
        clearKey("order");
        setBag([]);
        await loadPublic().catch(() => {});
        return data.order;
      } catch (error) {
        api.toast.error(explain(error));
        if (error.status === 409) await loadPublic().catch(() => {});
        return null;
      }
    };
    const placeMaint = async (details) => {
      try {
        const body = {
          ...details,
          idempotencyKey: await stableKey("maintenance", details),
        };
        const data = await request("/api/maintenance", {
          method: "POST",
          body,
        });
        clearKey("maintenance");
        return data.request;
      } catch (error) {
        api.toast.error(explain(error));
        return null;
      }
    };
    if (!snapshot)
      return h(
        "main",
        { className: "flick-live-state", dir: lang === "ar" ? "rtl" : "ltr" },
        h("h1", null, "FLiCK Mobile"),
        h(
          "p",
          { role: "status" },
          startupError
            ? L(
                lang,
                "تعذّر تحميل المتجر. حاول مجددًا.",
                "The store could not be loaded. Please retry.",
              )
            : L(lang, "جار تحميل المتجر…", "Loading the store…"),
        ),
        startupError &&
          h(
            "button",
            { onClick: () => loadPublic().catch(() => setStartupError(true)) },
            L(lang, "إعادة المحاولة", "Retry"),
          ),
      );
    const value = {
      lang,
      setLang,
      t: (key, params) => translate(lang, key, params),
      content: snapshot.content,
      updateContent,
      orders,
      updateOrders: (fn) => updateRows("orders", fn),
      maint,
      updateMaint: (fn) => updateRows("maintenance", fn),
      bag,
      bagOpen,
      setBagOpen,
      addToBag,
      setQty,
      clearBag: () => setBag([]),
      placeOrder,
      placeMaint,
      resetDemo: () => false,
      live: {
        request,
        auth,
        privateReady,
        checkAuth,
        loadAdmin,
        loadPublic,
        loadOlder,
        cursors,
        saving,
        snapshot,
        setAuth,
        setPrivateReady,
      },
    };
    return h(
      api.StoreContext.Provider,
      { value },
      startupError &&
        h(
          "div",
          { className: "flick-live-notice", role: "status" },
          L(
            lang,
            "تعذّر تحديث الكتالوج. آخر بيانات الخادم ظاهرة؛ أعد المحاولة قبل الطلب.",
            "Catalog refresh failed. The last server catalog is shown; retry before ordering.",
          ),
          h(
            "button",
            { onClick: () => loadPublic().catch(() => setStartupError(true)) },
            L(lang, "إعادة المحاولة", "Retry"),
          ),
        ),
      children,
      saving &&
        h(
          "div",
          { className: "flick-live-saving", role: "status" },
          L(lang, "جار الحفظ…", "Saving…"),
        ),
    );
  }
  function field(label, name, type = "text", props = {}) {
    return h(
      "label",
      { className: "flick-live-field" },
      label,
      h("input", { name, type, required: true, ...props }),
    );
  }
  function AdminGate({ page, children }) {
    const { lang, live, content, updateContent } = api.useStore();
    const [error, setError] = R.useState(""),
      [busy, setBusy] = R.useState(false),
      [checked, setChecked] = R.useState(false),
      [forgot, setForgot] = R.useState(false);
    const isReset = location.pathname === "/admin/reset";
    R.useEffect(() => {
      let active = true;
      live
        .checkAuth()
        .then(() => {
          if (active) setChecked(true);
        })
        .catch((e) => {
          if (active) {
            setError(explain(e, lang));
            setChecked(true);
          }
        });
      return () => {
        active = false;
      };
    }, []);
    async function submit(event) {
      event.preventDefault();
      setBusy(true);
      setError("");
      const values = Object.fromEntries(new FormData(event.currentTarget));
      try {
        if (isReset) {
          const token = new URLSearchParams(location.hash.slice(1)).get(
            "token",
          );
          await request("/api/admin/reset", {
            method: "POST",
            body: { token, password: values.password },
          });
          history.replaceState(null, "", "/admin");
          api.toast.success(
            L(
              lang,
              "تم تغيير كلمة المرور. سجّل دخولك.",
              "Password changed. Please sign in.",
            ),
          );
          await live.checkAuth();
          window.dispatchEvent(new PopStateEvent("popstate"));
        } else if (forgot) {
          await request("/api/admin/forgot", { method: "POST", body: {} });
          api.toast.success(
            L(
              lang,
              "إذا كانت الاستعادة معدّة، سيصل الرابط إلى بريد المالك.",
              "If recovery is configured, a link will arrive at the owner email.",
            ),
          );
          setForgot(false);
        } else {
          await request(
            "/api/admin/" + (live.auth?.setupRequired ? "setup" : "login"),
            { method: "POST", body: values },
          );
          await live.checkAuth();
        }
      } catch (e) {
        setError(explain(e, lang));
      } finally {
        setBusy(false);
      }
    }
    if (!checked)
      return h(
        "main",
        { className: "flick-live-state", role: "status" },
        "FLiCK — ",
        L(lang, "جار التحقق من الجلسة…", "Checking your session…"),
      );
    if (isReset || !live.auth?.authenticated || !live.privateReady)
      return h(
        "main",
        { className: "flick-live-state", dir: lang === "ar" ? "rtl" : "ltr" },
        h(
          "a",
          { href: "/" + lang + "/", className: "flick-live-brand" },
          "FLiCK Mobile",
        ),
        h(
          "form",
          { onSubmit: submit },
          h(
            "h1",
            null,
            L(
              lang,
              isReset
                ? "استعادة كلمة المرور"
                : live.auth?.setupRequired
                  ? "إعداد حساب الإدارة"
                  : forgot
                    ? "استعادة الدخول"
                    : "دخول الإدارة",
              isReset
                ? "Reset password"
                : live.auth?.setupRequired
                  ? "Set up administration"
                  : forgot
                    ? "Recover access"
                    : "Admin sign in",
            ),
          ),
          !isReset &&
            live.auth?.setupRequired &&
            field(
              L(lang, "رمز الإعداد من Cloudflare", "Cloudflare setup code"),
              "setupCode",
              "password",
              { autoComplete: "off" },
            ),
          !forgot &&
            field(L(lang, "كلمة المرور", "Password"), "password", "password", {
              autoComplete:
                isReset || live.auth?.setupRequired
                  ? "new-password"
                  : "current-password",
              minLength: isReset || live.auth?.setupRequired ? 12 : 1,
              maxLength: 200,
            }),
          (isReset || live.auth?.setupRequired) &&
            h(
              "p",
              null,
              L(
                lang,
                "12–200 حرفًا، تشمل حرفًا ورقمًا أو رمزًا.",
                "12–200 characters including a letter and a number or symbol.",
              ),
            ),
          error &&
            h("p", { role: "alert", className: "flick-live-error" }, error),
          h(
            "button",
            { disabled: busy, type: "submit" },
            busy
              ? L(lang, "جار التنفيذ…", "Please wait…")
              : L(
                  lang,
                  forgot ? "إرسال رابط الاستعادة" : "متابعة",
                  forgot ? "Send recovery link" : "Continue",
                ),
          ),
          !isReset &&
            live.auth?.resetAvailable &&
            !live.auth?.setupRequired &&
            h(
              "button",
              {
                type: "button",
                className: "flick-live-secondary",
                onClick: () => setForgot((v) => !v),
              },
              L(
                lang,
                forgot ? "العودة للدخول" : "نسيت كلمة المرور",
                forgot ? "Back to sign in" : "Forgot password",
              ),
            ),
          error &&
            !live.auth &&
            h(
              "button",
              { type: "button", onClick: () => location.reload() },
              L(lang, "إعادة المحاولة", "Retry"),
            ),
        ),
      );
    return h(
      R.Fragment,
      null,
      h(
        "div",
        { className: "flick-live-toolbar", dir: lang === "ar" ? "rtl" : "ltr" },
        h("a", { href: "/admin/categories" }, L(lang, "الأقسام", "Categories")),
        h(
          "a",
          { href: "/admin/settings" },
          L(lang, "إعدادات الاتصال", "Connection settings"),
        ),
        h(
          "button",
          {
            onClick: async () => {
              await request("/api/admin/logout", { method: "POST", body: {} });
              location.assign("/admin");
            },
          },
          L(lang, "تسجيل الخروج", "Sign out"),
        ),
        ((page === "orders" && live.cursors.orders) ||
          (page === "maint" && live.cursors.maintenance)) &&
          h(
            "button",
            {
              onClick: () =>
                live.loadOlder(page === "orders" ? "orders" : "maintenance"),
            },
            L(lang, "تحميل سجلات أقدم", "Load older records"),
          ),
      ),
      page === "categories"
        ? h(CategoriesEditor, {})
        : h(
            R.Fragment,
            null,
            page === "settings" && h(ConnectionSettings, {}),
            children,
          ),
    );
  }
  function ConnectionSettings() {
    const { lang, content, updateContent } = api.useStore(),
      [error, setError] = R.useState(""),
      [busy, setBusy] = R.useState(false);
    return h(
      "section",
      { className: "flick-live-panel", dir: lang === "ar" ? "rtl" : "ltr" },
      h(
        "h2",
        null,
        L(lang, "تشغيل المتجر والأمان", "Store operation and security"),
      ),
      h(
        "form",
        {
          onSubmit: async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const fee = form.get("deliveryFee");
            setBusy(true);
            const ok = await updateContent((old) => ({
              ...old,
              settings: {
                ...old.settings,
                ordersEnabled: form.has("ordersEnabled"),
                indexingEnabled: form.has("indexingEnabled"),
                deliveryFeeMinor:
                  fee === "" ? null : FlickRules.toMinor(Number(fee)),
              },
            }));
            if (ok)
              api.toast.success(
                L(lang, "تم حفظ إعدادات التشغيل.", "Operation settings saved."),
              );
            setBusy(false);
          },
        },
        h(
          "label",
          null,
          h("input", {
            type: "checkbox",
            name: "ordersEnabled",
            defaultChecked: content.settings.ordersEnabled,
          }),
          L(lang, "تفعيل استقبال طلبات الشراء", "Enable purchase orders"),
        ),
        h(
          "label",
          null,
          h("input", {
            type: "checkbox",
            name: "indexingEnabled",
            defaultChecked: content.settings.indexingEnabled,
          }),
          L(
            lang,
            "السماح لمحركات البحث عند فتح الطلبات",
            "Allow search indexing while ordering is enabled",
          ),
        ),
        field(
          L(
            lang,
            "رسوم التوصيل (د.أ) — فارغ للتأكيد لاحقًا",
            "Delivery fee (JOD) — blank to confirm later",
          ),
          "deliveryFee",
          "number",
          {
            required: false,
            min: 0,
            max: 1000,
            step: ".001",
            defaultValue:
              content.settings.deliveryFeeMinor == null
                ? ""
                : content.settings.deliveryFeeMinor / 1000,
          },
        ),
        h(
          "button",
          { disabled: busy },
          L(lang, "حفظ إعدادات التشغيل", "Save operation settings"),
        ),
      ),
      h(
        "form",
        {
          onSubmit: async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            const form = event.currentTarget;
            try {
              await request("/api/admin/password", {
                method: "POST",
                body: Object.fromEntries(new FormData(form)),
              });
              api.toast.success(
                L(lang, "تم تغيير كلمة المرور.", "Password changed."),
              );
              location.assign("/admin");
            } catch (e) {
              setError(explain(e, lang));
            } finally {
              setBusy(false);
            }
          },
        },
        h("h3", null, L(lang, "تغيير كلمة المرور", "Change password")),
        field(
          L(lang, "كلمة المرور الحالية", "Current password"),
          "currentPassword",
          "password",
          { autoComplete: "current-password" },
        ),
        field(
          L(lang, "كلمة المرور الجديدة", "New password"),
          "newPassword",
          "password",
          { autoComplete: "new-password", minLength: 12, maxLength: 200 },
        ),
        error && h("p", { role: "alert" }, error),
        h(
          "button",
          { disabled: busy },
          L(lang, "تغيير كلمة المرور", "Change password"),
        ),
      ),
    );
  }
  function CategoriesEditor() {
    const { lang, content, updateContent } = api.useStore(),
      [rows, setRows] = R.useState(() =>
        structuredClone(content.categories || []),
      ),
      [busy, setBusy] = R.useState(false);
    const change = (index, key, value) =>
      setRows((old) =>
        old.map((row, n) => (n === index ? { ...row, [key]: value } : row)),
      );
    return h(
      "main",
      { className: "flick-live-panel", dir: lang === "ar" ? "rtl" : "ltr" },
      h("h1", null, L(lang, "أقسام المتجر", "Store categories")),
      h("a", { href: "/admin" }, L(lang, "الإدارة", "Administration")),
      h(
        "form",
        {
          onSubmit: async (event) => {
            event.preventDefault();
            setBusy(true);
            const ok = await updateContent((old) => ({
              ...old,
              categories: rows,
            }));
            if (ok)
              api.toast.success(
                L(lang, "تم حفظ الأقسام.", "Categories saved."),
              );
            setBusy(false);
          },
        },
        rows.map((row, index) =>
          h(
            "fieldset",
            { key: index },
            field("ID", "id-" + index, "text", {
              value: row.id,
              onChange: (e) => change(index, "id", e.target.value),
              pattern: "[A-Za-z0-9_.-]+",
              readOnly: content.products.some((p) => p.cat === row.id),
            }),
            field("العربي", "ar-" + index, "text", {
              value: row.name.ar,
              onChange: (e) =>
                change(index, "name", { ...row.name, ar: e.target.value }),
            }),
            field("English", "en-" + index, "text", {
              value: row.name.en,
              onChange: (e) =>
                change(index, "name", { ...row.name, en: e.target.value }),
            }),
            h(
              "label",
              { className: "flick-live-field" },
              L(lang, "صورة جهاز القسم", "Category device image"),
              h(
                "select",
                {
                  value: row.pictureId || "",
                  onChange: (e) => change(index, "pictureId", e.target.value),
                },
                h("option", { value: "" }, "—"),
                content.products.map((p) =>
                  h(
                    "option",
                    { key: p.id, value: p.id },
                    p.name[lang] || p.name.en,
                  ),
                ),
              ),
            ),
            h(
              "button",
              {
                type: "button",
                disabled: content.products.some((p) => p.cat === row.id),
                onClick: () =>
                  setRows((old) => old.filter((_, n) => n !== index)),
              },
              L(lang, "حذف القسم الفارغ", "Remove empty category"),
            ),
          ),
        ),
        h(
          "button",
          {
            type: "button",
            className: "flick-live-secondary",
            onClick: () =>
              setRows((old) => [
                ...old,
                {
                  id: "",
                  name: { ar: "", en: "" },
                  pictureId: "",
                  visible: true,
                },
              ]),
          },
          L(lang, "إضافة قسم", "Add category"),
        ),
        h(
          "button",
          { disabled: busy },
          L(lang, "حفظ الأقسام", "Save categories"),
        ),
      ),
    );
  }
  function LiveTracker() {
    const { lang } = api.useStore(),
      [result, setResult] = R.useState(null),
      [error, setError] = R.useState(""),
      [busy, setBusy] = R.useState(false);
    return h(
      "section",
      { className: "flick-live-panel" },
      h(
        "form",
        {
          onSubmit: async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            setResult(null);
            try {
              const data = await request("/api/maintenance/track", {
                method: "POST",
                body: Object.fromEntries(new FormData(event.currentTarget)),
              });
              setResult(data.request);
              if (!data.request)
                setError(
                  L(
                    lang,
                    "لم نعثر على طلب بهذه البيانات.",
                    "No request matches these details.",
                  ),
                );
            } catch (e) {
              setError(
                e.status === 404
                  ? L(
                      lang,
                      "لم نعثر على طلب بهذه البيانات.",
                      "No request matches these details.",
                    )
                  : explain(e, lang),
              );
            } finally {
              setBusy(false);
            }
          },
        },
        field(
          L(lang, "رقم طلب الصيانة", "Repair request number"),
          "id",
          "text",
          { placeholder: "M-1001" },
        ),
        field(L(lang, "رقم الهاتف", "Phone number"), "phone", "tel", {
          autoComplete: "tel",
        }),
        h("button", { disabled: busy }, L(lang, "عرض الحالة", "Track request")),
      ),
      error && h("p", { role: "alert" }, error),
      result &&
        h(
          "div",
          { role: "status" },
          h("strong", null, result.id),
          h(
            "p",
            null,
            translate(lang, api.maintenanceStatusKey(result.status)),
          ),
          result.updatedAt && h("p", null, result.updatedAt),
        ),
    );
  }
  api.configure({ LiveProvider, AdminGate, MaintenanceTracker: LiveTracker });
}
