var w = (x("aIIwE"), x("aIIwE"));
let eN = {},
  eS = (e) => `assets/products/${e}`,
  ej = (e, t, n) => ({
    src: eS(`${e}.png`),
    maskSrc: eS(`mattes/${e}.png`),
    width: 1254,
    height: 1254,
    viewBox: `${627 * t} ${627 * n} 627 627`,
  }),
  eE = {
    "iphone-17-pro-max": ej("phones-apple", 0, 0),
    "iphone-17-pro": ej("phones-apple", 1, 0),
    "iphone-air": ej("phones-apple", 0, 1),
    "iphone-17": ej("phones-apple", 1, 1),
    "iphone-16": ej("phones-samsung", 0, 0),
    "galaxy-s25-ultra": ej("phones-samsung", 1, 0),
    "galaxy-z-flip7": ej("phones-samsung", 0, 1),
    "galaxy-a56": ej("phones-samsung", 1, 1),
    "ipad-a16": ej("tablets-watch", 0, 0),
    "ipad-air-11-m3": ej("tablets-watch", 1, 0),
    "galaxy-tab-s10-fe": ej("tablets-watch", 0, 1),
    "apple-watch-s11": ej("tablets-watch", 1, 1),
    "apple-watch-se3": ej("watches-earbuds", 0, 0),
    "galaxy-watch8": ej("watches-earbuds", 1, 0),
    "airpods-pro-3": ej("watches-earbuds", 0, 1),
    "airpods-4": ej("watches-earbuds", 1, 1),
    "galaxy-buds3-pro": {
      src: eS("galaxy-buds3-pro-refined.png"),
      width: 1536,
      height: 1024,
      viewBox: "0 0 1536 1024",
    },
    "bt-speaker": ej("audio-power", 1, 0),
    "bt-headphones": ej("audio-power", 0, 1),
    "powerbank-20k": ej("audio-power", 1, 1),
    "charger-20w": ej("accessories", 0, 0),
    "cable-c-c": ej("accessories", 1, 0),
    "case-clear": ej("accessories", 0, 1),
  };
function eC(e) {
  if (e.photo) return { src: e.photo, kind: "upload" };
  if (!e.img) return null;
  if (eN[e.img]) return { src: eN[e.img], kind: "builtin" };
  let t = eE[e.img];
  return t ? { ...t, kind: "illustration" } : null;
}
let ez = [
    {
      id: "phones",
      ar: "موبايلات",
      en: "Phones",
      pictureId: "iphone-17-pro-max",
    },
    { id: "tablets", ar: "تابلت", en: "Tablets", pictureId: "ipad-a16" },
    {
      id: "headphones",
      ar: "سماعات",
      en: "Earbuds & headphones",
      pictureId: "galaxy-buds3-pro",
    },
    { id: "speakers", ar: "سبيكرات", en: "Speakers", pictureId: "bt-speaker" },
    {
      id: "watches",
      ar: "ساعات ذكية",
      en: "Smartwatches",
      pictureId: "apple-watch-s11",
    },
    {
      id: "accessories",
      ar: "إكسسوارات",
      en: "Accessories",
      pictureId: "charger-20w",
    },
  ],
  eT = ez.map((e) => e.id);
function eP(e) {
  return (
    "number" == typeof e.offerPrice &&
    Number.isFinite(e.offerPrice) &&
    e.offerPrice > 0 &&
    e.offerPrice < e.price
  );
}
function eO(e) {
  return eP(e) ? e.offerPrice : e.price;
}
function eA(e) {
  return (
    e.variants.find((e) => window.FlickDeviceFeatures.available(e)) ??
    e.variants[0]
  );
}
function eI(e) {
  return Math.min(...e.variants.map(eO));
}
function eM(e) {
  return e.variants.some(eP);
}
function eL(e) {
  return Math.max(
    0,
    ...e.variants.filter(eP).map((e) => e.price - e.offerPrice),
  );
}
function eD(e) {
  return Math.round(1e3 * e) / 1e3;
}
function eR(e) {
  return eD(e).toLocaleString("en-US", {
    maximumFractionDigits: window.FlickApp?.mode === "live" ? 3 : 2,
  });
}
function eF(e) {
  return "ar" === e ? "د.أ" : "JOD";
}
function eB(e) {
  return e.replace(/[٠-٩۰-۹]/g, (e) => {
    let t = "٠١٢٣٤٥٦٧٨٩".indexOf(e);
    return String(t >= 0 ? t : "۰۱۲۳۴۵۶۷۸۹".indexOf(e));
  });
}
function eH(e) {
  return eB(e).replace(/[^\d+]/g, "");
}
function eU(e) {
  let t = eH(e).replace(/^\+/, "");
  return (t.startsWith("00") && (t = t.slice(2)), t.startsWith("962"))
    ? t.replace(/^9620/, "962")
    : t.startsWith("0")
      ? "962" + t.slice(1)
      : t;
}
function e_(e) {
  return /^9627[789]\d{7}$/.test(eU(e));
}
function eq(e, t) {
  return `https://wa.me/${eU(e)}${t ? `?text=${encodeURIComponent(t)}` : ""}`;
}
function eW(e) {
  return `tel:${eH(e)}`;
}
function eV(e) {
  return {
    start: new Date(`${e.start}T00:00:00+03:00`).getTime(),
    end: new Date(`${e.end}T23:59:59+03:00`).getTime(),
  };
}
function eQ(e, t = Date.now()) {
  if (!e.on) return "off";
  let { start: n, end: r } = eV(e);
  return Number.isNaN(n) || Number.isNaN(r)
    ? "off"
    : t < n
      ? "soon"
      : t > r
        ? "over"
        : "live";
}
function eK(e, t = Date.now()) {
  let { end: n } = eV(e);
  return Math.max(0, Math.ceil((n - t) / 864e5));
}
function eY(e) {
  let [t, n, r] = e.split("-");
  return `${Number(r)}/${Number(n)}/${t}`;
}
function eG(content, bag) {
  const lines = [];
  for (const line of bag) {
    const product = content.products.find(
      (p) => p.id === line.productId && p.visible,
    );
    const variant = product?.variants.find((v) => v.key === line.variantKey);
    if (!product || !variant || !window.FlickDeviceFeatures.available(variant))
      continue;
    const qty = Math.min(
      Math.max(0, Math.floor(Number(line.qty) || 0)),
      window.FlickDeviceFeatures.maxQuantity(variant),
    );
    if (!qty) continue;
    const unit = eO(variant);
    lines.push({ ...line, qty, product, variant, unit, sum: eD(unit * qty) });
  }
  return lines;
}
let eJ = {
  "pr.err.technical": {
    ar: "كل مواصفة بدها اسم وقيمة. كمّل الحقول أو احذف السطر الفارغ.",
    en: "Enter a label and value for each specification, or remove the incomplete row.",
  },
  "card.chooseOptions": { ar: "اختار الخيارات", en: "Choose options" },
  "device.condition": { ar: "حالة الجهاز", en: "Condition" },
  "device.allConditions": { ar: "كل الحالات", en: "Any condition" },
  "device.new": { ar: "جديد", en: "New" },
  "device.used": { ar: "مستعمل", en: "Used" },
  "pr.err.deviceDetails": {
    ar: "تأكد أن كمية المخزون ودورات البطارية أعداد صحيحة غير سالبة، ونسبة البطارية بين 0 و100.",
    en: "Stock and battery cycles must be non-negative whole numbers. Battery health must be between 0 and 100.",
  },
  "bag.stockLimit": {
    ar: "وصلت للكمية المتوفرة من هذا الخيار.",
    en: "You have reached the available quantity for this option.",
  },
  "concept.text": {
    ar: "نسخة عرض مقترحة لموقع FLiCK Mobile. الأسعار أمثلة، والطلبات ما بتوصل للمحل.",
    en: "A proposed website for FLiCK Mobile. Prices are examples; orders don’t reach the shop.",
  },
  "concept.admin": { ar: "جرّب لوحة التحكم", en: "Try the admin panel" },
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.shop": { ar: "الأجهزة", en: "Devices" },
  "nav.offers": { ar: "العروض", en: "Offers" },
  "nav.tradein": { ar: "قيّم جهازك", en: "Trade-in" },
  "nav.branches": { ar: "الفروع", en: "Branches" },
  "nav.bag": { ar: "السلة", en: "Bag" },
  "nav.admin": { ar: "لوحة التحكم", en: "Admin panel" },
  "nav.menu": { ar: "القائمة", en: "Menu" },
  "nav.home.aria": { ar: "FLiCK Mobile، الرئيسية", en: "FLiCK Mobile home" },
  "lang.switch": { ar: "English", en: "عربي" },
  "lang.switch.aria": { ar: "Switch to English", en: "التبديل للعربية" },
  "cat.all": { ar: "الكل", en: "All" },
  "cat.phones": { ar: "موبايلات", en: "Phones" },
  "cat.tablets": { ar: "تابلت", en: "Tablets" },
  "cat.headphones": { ar: "سماعات", en: "Earbuds & headphones" },
  "cat.speakers": { ar: "سبيكرات", en: "Speakers" },
  "cat.watches": { ar: "ساعات ذكية", en: "Smartwatches" },
  "cat.accessories": { ar: "إكسسوارات", en: "Accessories" },
  "hero.l1": { ar: "أوفر بكثير.", en: "Save way more." },
  "hero.l2": { ar: "وعروض ما بتوقف.", en: "Offers that never stop." },
  "hero.sub": {
    ar: "{n} فروع في عمّان: {list}.",
    en: "{n} branches in Amman: {list}.",
  },
  "hero.shop": { ar: "تسوّق {cat}", en: "Shop {cat}" },
  "hero.tradein": { ar: "قيّم جهازك القديم", en: "Value your old device" },
  "hero.from": { ar: "تبدأ من", en: "From" },
  "hero.switch": { ar: "اختار نوع الجهاز", en: "Choose a device type" },
  "hero.eyebrow": { ar: "FLiCK MOBILE · AMMAN", en: "FLiCK MOBILE · AMMAN" },
  "hero.desc": {
    ar: "موبايل جديد، تابلت، سماعات، أو ساعة ذكية. اختار اللي بناسبك وشوف عروضنا.",
    en: "Your next phone, tablet, earbuds, or smartwatch. Find your pick and explore our offers.",
  },
  "hero.shopAll": { ar: "تسوّق الأجهزة", en: "Shop devices" },
  "hero.branches": {
    ar: "{n} فروع في عمّان · أهلاً فيك بأقرب فرع",
    en: "{n} branches in Amman · Visit your nearest branch",
  },
  "cats.ask": { ar: "شو عم تدوّر عليه؟", en: "What are you looking for?" },
  "cats.all": { ar: "شوف كل المنتجات", en: "View all products" },
  "photo.unavailable": { ar: "الصورة غير متوفرة", en: "Photo unavailable" },
  "price.example": { ar: "سعر مثال", en: "Example price" },
  "price.was": { ar: "كان", en: "Was" },
  "offer.badge": { ar: "عرض", en: "Offer" },
  "save.amount": { ar: "وفّر {amount}", en: "Save {amount}" },
  "card.add": { ar: "أضف للسلة", en: "Add to bag" },
  "card.soldout": { ar: "نفدت الكمية", en: "Sold out" },
  "card.added": { ar: "انضاف {name} للسلة", en: "{name} added to your bag" },
  "card.view": { ar: "شوف التفاصيل", en: "View details" },
  "card.options": { ar: "{n} خيارات", en: "{n} options" },
  "campaign.rule": {
    ar: "اشتري بفاتورة قيمتها {min} دينار أو أكثر من أي فرع، وادخل السحب على أكثر من 1000 هدية.",
    en: "Buy with an invoice of JOD {min} or more at any branch and enter the draw for more than 1,000 gifts.",
  },
  "campaign.dates": {
    ar: "من {start} لغاية {end}",
    en: "From {start} to {end}",
  },
  "campaign.draw": {
    ar: "الشراء من كل الفروع، والسحب من فرع {branch}.",
    en: "Buy at any branch. The draw is held at the {branch} branch.",
  },
  "campaign.approval": {
    ar: "بإشراف وموافقة وزارة الصناعة والتجارة، رقم الموافقة {no}",
    en: "Supervised and approved by the Ministry of Industry and Trade, approval no. {no}",
  },
  "campaign.left": { ar: "باقي {n} يوم", en: "{n} days left" },
  "campaign.lastDay": { ar: "اليوم آخر يوم", en: "Last day today" },
  "campaign.soon": { ar: "بتبلش {date}", en: "Starts {date}" },
  "campaign.prizes": { ar: "شو ممكن تربح", en: "What you can win" },
  "campaign.more": { ar: "تفاصيل الحملة", en: "Campaign details" },
  "campaign.source": {
    ar: "منشور الحملة على انستغرام",
    en: "The campaign post on Instagram",
  },
  "campaign.bagHint": {
    ar: "حملة {title}: فاتورة {min} د.أ أو أكثر من أي فرع بتدخلك السحب.",
    en: "{title}: an invoice of JOD {min} or more at any branch enters you in the draw.",
  },
  "offers.title": { ar: "عروض هالفترة", en: "Current offers" },
  "offers.all": { ar: "كل العروض", en: "All offers" },
  "offers.empty": {
    ar: "ما في عروض على الأجهزة هلأ. تابعنا على انستغرام لأول عرض جاي.",
    en: "No device offers right now. Follow us on Instagram for the next one.",
  },
  "offers.page": { ar: "العروض والحملة", en: "Offers and campaign" },
  "cats.title": { ar: "تسوّق حسب القسم", en: "Shop by category" },
  "cats.count": { ar: "{n} منتج", en: "{n} products" },
  "featured.title": { ar: "مختارات إلك", en: "Featured picks" },
  "featured.all": { ar: "كل الأجهزة", en: "All devices" },
  "tradein.title": {
    ar: "جهازك القديم له قيمة",
    en: "Your old device is worth something",
  },
  "tradein.body": {
    ar: "قيّم آيفونك بخمس خطوات واضحة، واعرف نطاق سعره المبدئي قبل ما تزور أقرب فرع.",
    en: "Value your iPhone in five clear steps and see its starting price range before you visit the nearest branch.",
  },
  "tradein.p1": { ar: "فحص سريع بخمس خطوات", en: "A quick five-step check" },
  "tradein.p2": {
    ar: "قيمة عادلة حسب حالة جهازك",
    en: "A fair value for its condition",
  },
  "tradein.p3": { ar: "بدون التزام", en: "No commitment" },
  "tradein.cta": { ar: "ابدأ التقييم", en: "Start the valuation" },
  "tradein.ext": {
    ar: "بتفتح صفحة التقييم تبعت فليك بنافذة جديدة.",
    en: "Opens FLiCK’s valuation page in a new tab.",
  },
  "branches.title": { ar: "فروعنا في عمّان", en: "Our branches in Amman" },
  "branches.sub": {
    ar: "زورنا بأي فرع، أو اتصل قبل ما تيجي لتتأكد إنه الجهاز موجود.",
    en: "Visit any branch, or call ahead to check the device is in stock.",
  },
  "branches.main": { ar: "الرئيسي", en: "Main" },
  "branches.call": { ar: "اتصال", en: "Call" },
  "branches.whatsapp": { ar: "واتساب", en: "WhatsApp" },
  "branches.map": { ar: "الخريطة", en: "Map" },
  "branches.branch": { ar: "فرع {name}", en: "{name} branch" },
  "insta.follow": { ar: "تابع العروض أول بأول", en: "Catch every offer first" },
  "insta.cta": { ar: "افتح انستغرام", en: "Open Instagram" },
  "shop.title": { ar: "الأجهزة", en: "Devices" },
  "shop.search": { ar: "ابحث عن جهاز", en: "Search devices" },
  "shop.sort": { ar: "الترتيب", en: "Sort" },
  "sort.featured": { ar: "المميز أولاً", en: "Featured first" },
  "sort.low": { ar: "الأرخص أولاً", en: "Lowest price" },
  "sort.high": { ar: "الأغلى أولاً", en: "Highest price" },
  "sort.offers": { ar: "العروض أولاً", en: "Offers first" },
  "shop.brand": { ar: "الماركة", en: "Brand" },
  "shop.allBrands": { ar: "كل الماركات", en: "All brands" },
  "shop.otherBrand": { ar: "إكسسوارات عامة", en: "General accessories" },
  "shop.empty": {
    ar: "ما لقينا أجهزة بهالبحث. جرّب كلمة ثانية أو امسح الفلاتر.",
    en: "No devices match. Try another word or clear the filters.",
  },
  "shop.clear": { ar: "امسح الفلاتر", en: "Clear filters" },
  "shop.count": { ar: "النتائج: {n}", en: "{n} results" },
  "shop.note": {
    ar: "الأجهزة والأسعار هون أمثلة للعرض. المحل بيحط قائمته الحقيقية من لوحة التحكم.",
    en: "These devices and prices are examples. The shop adds its real list from the admin panel.",
  },
  "shop.tabs": { ar: "أنواع الأجهزة", en: "Device types" },
  "product.back": { ar: "رجوع", en: "Back" },
  "product.storage": { ar: "السعة", en: "Storage" },
  "product.size": { ar: "المقاس", en: "Case size" },
  "product.option": { ar: "الخيار", en: "Option" },
  "product.add": { ar: "أضف للسلة", en: "Add to bag" },
  "product.pickup": {
    ar: "اطلب أونلاين واستلم من الفرع اللي بناسبك، أو اطلب توصيل.",
    en: "Order online and pick up at the branch that suits you, or ask for delivery.",
  },
  "product.cod": {
    ar: "الدفع كاش عند الاستلام.",
    en: "Pay cash when you receive it.",
  },
  "product.tradein": {
    ar: "عندك جهاز قديم؟ اعرف قيمته المبدئية",
    en: "Have an old device? See what it’s worth",
  },
  "product.notfound": {
    ar: "هالجهاز مش موجود أو انشال من القائمة.",
    en: "This device isn’t available or was removed.",
  },
  "product.optionOut": {
    ar: "هالخيار نفد. اختار خيار ثاني أو اسأل الفرع.",
    en: "This option is sold out. Pick another or ask a branch.",
  },
  "product.related": { ar: "من نفس النوع", en: "More in this category" },
  "product.photoNote": {
    ar: "صورة هذا المنتج غير متوفرة حاليًا.",
    en: "A photograph of this product is not currently available.",
  },
  "bag.title": { ar: "السلة", en: "Your bag" },
  "bag.empty": { ar: "السلة فاضية.", en: "Your bag is empty." },
  "bag.emptySub": {
    ar: "ضيف جهاز من الرفوف، وبتلاقيه هون.",
    en: "Add a device from the shelves and it shows up here.",
  },
  "bag.browse": { ar: "تصفّح الأجهزة", en: "Browse devices" },
  "bag.total": { ar: "المجموع", en: "Total" },
  "bag.checkout": { ar: "كمّل الطلب", en: "Continue to order" },
  "bag.remove": { ar: "احذف {name}", en: "Remove {name}" },
  "bag.inc": { ar: "زيد الكمية", en: "Increase quantity" },
  "bag.dec": { ar: "نقّص الكمية", en: "Decrease quantity" },
  "bag.close": { ar: "سكّر السلة", en: "Close bag" },
  "bag.max": {
    ar: "أكثر شي 5 من نفس القطعة بالطلب الواحد.",
    en: "Up to 5 of the same item per order.",
  },
  "checkout.title": { ar: "معلومات الطلب", en: "Order details" },
  "checkout.name": { ar: "الاسم", en: "Name" },
  "checkout.phone": { ar: "رقم الموبايل", en: "Mobile number" },
  "checkout.method": { ar: "كيف بدك تستلم؟", en: "How would you like it?" },
  "checkout.pickup": { ar: "استلام من الفرع", en: "Pick up at a branch" },
  "checkout.delivery": { ar: "توصيل", en: "Delivery" },
  "checkout.branch": { ar: "الفرع", en: "Branch" },
  "checkout.area": { ar: "المنطقة", en: "Area" },
  "checkout.address": { ar: "العنوان بالتفصيل", en: "Full address" },
  "checkout.notes": { ar: "ملاحظات (اختياري)", en: "Notes (optional)" },
  "checkout.cod": {
    ar: "الدفع كاش عند الاستلام.",
    en: "Cash on delivery or at pickup.",
  },
  "checkout.place": { ar: "أكّد الطلب", en: "Place order" },
  "checkout.back": { ar: "رجوع للسلة", en: "Back to bag" },
  "checkout.err.name": { ar: "اكتب اسمك.", en: "Enter your name." },
  "checkout.err.phone": {
    ar: "اكتب رقم موبايل أردني صحيح، مثل 0791234567.",
    en: "Enter a Jordanian mobile number, like 0791234567.",
  },
  "checkout.err.address": {
    ar: "اكتب المنطقة والعنوان.",
    en: "Enter your area and address.",
  },
  "checkout.privacy": {
    ar: "بنستخدم رقمك بس عشان نأكد الطلب معك.",
    en: "We only use your number to confirm the order with you.",
  },
  "done.title": { ar: "انحفظ طلبك", en: "Your order is saved" },
  "done.number": { ar: "رقم الطلب", en: "Order number" },
  "done.demo": {
    ar: "بنسخة العرض الطلب بينحفظ بهالمتصفح ويطلع بلوحة التحكم، وما بيوصل للمحل.",
    en: "In this demo the order is saved in this browser and shows in the admin panel. It doesn’t reach the shop.",
  },
  "done.admin": { ar: "شوفه بلوحة التحكم", en: "See it in the admin panel" },
  "done.close": { ar: "تمام", en: "Done" },
  "footer.contact": { ar: "أرقام الفروع", en: "Branch numbers" },
  "footer.pages": { ar: "صفحات", en: "Pages" },
  "footer.follow": { ar: "تابعنا", en: "Follow us" },
  "footer.concept": {
    ar: "تصميم مقترح لموقع FLiCK Mobile، والأسعار فيه أمثلة.",
    en: "A proposed design for FLiCK Mobile. Its prices are examples.",
  },
  "admin.title": { ar: "لوحة التحكم", en: "Admin panel" },
  "admin.demo": {
    ar: "ديمو: التعديلات بتنحفظ بهالمتصفح بس.",
    en: "Demo: changes are saved in this browser only.",
  },
  "admin.view": { ar: "عرض الموقع", en: "View the site" },
  "admin.overview": { ar: "نظرة عامة", en: "Overview" },
  "admin.orders": { ar: "الطلبات", en: "Orders" },
  "admin.products": { ar: "الأجهزة والأسعار", en: "Devices & prices" },
  "admin.campaign": { ar: "الحملة", en: "Campaign" },
  "admin.branches": { ar: "الفروع", en: "Branches" },
  "admin.settings": { ar: "الإعدادات", en: "Settings" },
  "admin.categories": { ar: "الأقسام", en: "Categories" },
  "admin.texts": { ar: "نصوص الموقع", en: "Website texts" },
  "admin.sections": { ar: "أقسام لوحة التحكم", en: "Admin sections" },
  "common.cancel": { ar: "إلغاء", en: "Cancel" },
  "common.delete": { ar: "احذف", en: "Delete" },
  "common.close": { ar: "سكّر", en: "Close" },
  "common.save": { ar: "احفظ", en: "Save" },
  "common.add": { ar: "إضافة", en: "Add" },
  "common.shown": { ar: "ظاهر", en: "Shown" },
  "common.hidden": { ar: "مخفي", en: "Hidden" },
  "common.ar": { ar: "بالعربي", en: "Arabic" },
  "common.en": { ar: "بالإنجليزي", en: "English" },
  "common.saved": { ar: "انحفظ", en: "Saved" },
  "common.storageFull": {
    ar: "المساحة بهالمتصفح امتلت، فآخر تعديل ما انحفظ. صغّر الصور أو احذف شي.",
    en: "This browser’s storage is full, so the last change wasn’t saved. Use smaller photos or remove something.",
  },
  "ov.new": { ar: "طلبات جديدة", en: "New orders" },
  "ov.visible": { ar: "أجهزة ظاهرة", en: "Devices shown" },
  "ov.offers": { ar: "أجهزة عليها عرض", en: "Devices on offer" },
  "ov.campaign": { ar: "الحملة", en: "Campaign" },
  "ov.recent": { ar: "آخر الطلبات", en: "Latest orders" },
  "ov.allOrders": { ar: "كل الطلبات", en: "All orders" },
  "ov.noOrders": {
    ar: "ما في طلبات لسا. أول طلب من الموقع بيطلع هون.",
    en: "No orders yet. The first order from the site shows up here.",
  },
  "ov.checklist": {
    ar: "قبل ما يصير الموقع رسمي",
    en: "Before the site goes live",
  },
  "ov.c1": {
    ar: "حط الأسعار الحقيقية بدل الأمثلة",
    en: "Replace the example prices with real ones",
  },
  "ov.c2": { ar: "ضيف صور الأجهزة الحقيقية", en: "Add real device photos" },
  "ov.c3": {
    ar: "أكّد معلومات التواصل والاستلام مع المحل",
    en: "Confirm contact and fulfillment details with the shop",
  },
  "ov.c4": { ar: "اطفي شريط نسخة العرض", en: "Turn off the concept notice" },
  "ov.c5": {
    ar: "استضافة ودومين باسم المحل",
    en: "Hosting and a domain in the shop’s name",
  },
  "ov.photos": { ar: "صور: {n} من {total}", en: "Photos: {n} of {total}" },
  "status.all": { ar: "الكل", en: "All" },
  "status.new": { ar: "جديد", en: "New" },
  "status.confirmed": { ar: "تأكّد", en: "Confirmed" },
  "status.ready": { ar: "جاهز أو بالطريق", en: "Ready or on the way" },
  "status.delivered": { ar: "تسلّم", en: "Delivered" },
  "status.cancelled": { ar: "ملغي", en: "Cancelled" },
  "orders.search": {
    ar: "ابحث بالاسم أو الرقم أو رقم الطلب",
    en: "Search by name, phone or order number",
  },
  "orders.empty": {
    ar: "ما في طلبات بهالحالة.",
    en: "No orders with this status.",
  },
  "orders.sample": { ar: "تجريبي", en: "Sample" },
  "orders.pickupAt": { ar: "استلام من {branch}", en: "Pickup at {branch}" },
  "orders.deliveryTo": { ar: "توصيل إلى {area}", en: "Delivery to {area}" },
  "orders.status": { ar: "الحالة", en: "Status" },
  "orders.note": {
    ar: "ملاحظة داخلية (ما بيشوفها الزبون)",
    en: "Private note (the customer doesn’t see it)",
  },
  "orders.items": { ar: "القطع", en: "Items" },
  "orders.customer": { ar: "الزبون", en: "Customer" },
  "orders.customerNotes": { ar: "ملاحظات الزبون", en: "Customer notes" },
  "orders.address": { ar: "العنوان", en: "Address" },
  "orders.delete": { ar: "احذف الطلب", en: "Delete order" },
  "orders.deleteQ": {
    ar: "تحذف الطلب {id}؟ ما في رجعة.",
    en: "Delete order {id}? This can’t be undone.",
  },
  "orders.deleted": { ar: "انحذف الطلب {id}", en: "Order {id} deleted" },
  "orders.statusSaved": {
    ar: "صار الطلب {id}: {status}",
    en: "Order {id} is now: {status}",
  },
  "orders.open": { ar: "افتح الطلب {id}", en: "Open order {id}" },
  "pr.search": { ar: "ابحث بالاسم أو الماركة", en: "Search by name or brand" },
  "pr.add": { ar: "أضف جهاز", en: "Add device" },
  "pr.edit": { ar: "تعديل", en: "Edit" },
  "pr.duplicate": { ar: "نسخة", en: "Duplicate" },
  "pr.deleteQ": {
    ar: "تحذف {name}؟ ما في رجعة.",
    en: "Delete {name}? This can’t be undone.",
  },
  "pr.deleted": { ar: "انحذف {name}", en: "{name} deleted" },
  "pr.from": { ar: "من {price}", en: "From {price}" },
  "pr.onOffer": { ar: "عليه عرض", en: "On offer" },
  "pr.featured": { ar: "مميّز", en: "Featured" },
  "pr.none": {
    ar: "ما في أجهزة بهالنوع. اضغط «أضف جهاز» لأول واحد.",
    en: "No devices in this category. Press “Add device” to add the first one.",
  },
  "pr.other": { ar: "أخرى", en: "Other" },
  "pr.editor": { ar: "تعديل الجهاز", en: "Edit device" },
  "pr.nameAr": { ar: "الاسم بالعربي", en: "Name in Arabic" },
  "pr.nameEn": { ar: "الاسم بالإنجليزي", en: "Name in English" },
  "pr.brand": { ar: "الماركة", en: "Brand" },
  "pr.brandHelp": {
    ar: "اتركها فاضية للإكسسوارات العامة.",
    en: "Leave empty for general accessories.",
  },
  "pr.cat": { ar: "النوع", en: "Category" },
  "pr.art": {
    ar: "الرسمة لما ما في صورة",
    en: "Drawing when there’s no photo",
  },
  "pr.photo": { ar: "صورة الجهاز", en: "Device photo" },
  "pr.photoHelp": {
    ar: "صورة مربعة بخلفية فاتحة أو شفافة. بتصغر لحالها لـ 1000 بكسل.",
    en: "A square photo on a light or transparent background. It is resized to 1000 px.",
  },
  "pr.upload": { ar: "ارفع صورة", en: "Upload photo" },
  "pr.builtin": {
    ar: "صورة موثوقة للموديل. ارفع صورة المحل إذا بدك تستبدلها.",
    en: "Verified model photograph. Upload the shop’s photograph to replace it.",
  },
  "pr.removePhoto": { ar: "شيل الصورة", en: "Remove photo" },
  "pr.photoBig": {
    ar: "الصورة لسا أكبر من 1 ميغا بعد التصغير. جرّب صورة ثانية.",
    en: "The photo is still over 1 MB after resizing. Try another one.",
  },
  "pr.photoBad": {
    ar: "ما قدرنا نقرأ هالملف. ارفع صورة JPG أو PNG أو WebP.",
    en: "That file couldn’t be read. Upload a JPG, PNG or WebP image.",
  },
  "pr.visible": { ar: "ظاهر بالموقع", en: "Shown on the site" },
  "pr.featuredLong": {
    ar: "مميّز: بيطلع أول بالرفوف",
    en: "Featured: shown first on the shelves",
  },
  "pr.variants": {
    ar: "الخيارات والأسعار (د.أ)",
    en: "Options and prices (JOD)",
  },
  "pr.variantsHelp": {
    ar: "أول خيار متوفر هو اللي بيطلع على البطاقة. للسعة اكتب مثل 256GB أو 1TB.",
    en: "The first option in stock shows on the card. For storage type e.g. 256GB or 1TB.",
  },
  "pr.vLabelAr": { ar: "اسم الخيار بالعربي", en: "Option name, Arabic" },
  "pr.vLabelEn": { ar: "اسم الخيار بالإنجليزي", en: "Option name, English" },
  "pr.vPrice": { ar: "السعر", en: "Price" },
  "pr.vOffer": { ar: "سعر العرض (اختياري)", en: "Offer price (optional)" },
  "pr.vStock": { ar: "متوفر", en: "In stock" },
  "pr.vAdd": { ar: "أضف خيار", en: "Add option" },
  "pr.vRemove": { ar: "احذف الخيار {n}", en: "Remove option {n}" },
  "pr.vRow": { ar: "خيار {n}", en: "Option {n}" },
  "pr.err.name": {
    ar: "الجهاز بده اسم بالعربي والإنجليزي.",
    en: "The device needs a name in Arabic and English.",
  },
  "pr.err.variants": {
    ar: "لازم يكون في خيار واحد على الأقل.",
    en: "Add at least one option.",
  },
  "pr.err.label": { ar: "كل خيار بده اسم.", en: "Every option needs a name." },
  "pr.err.dupe": {
    ar: "في خيارين بنفس الاسم. غيّر واحد منهم.",
    en: "Two options have the same name. Rename one.",
  },
  "pr.err.price": {
    ar: "كل خيار بده سعر أكبر من صفر.",
    en: "Every option needs a price above zero.",
  },
  "pr.err.offer": {
    ar: "سعر العرض لازم يكون أقل من السعر الأصلي، أو اتركه فاضي.",
    en: "The offer price must be lower than the price, or leave it empty.",
  },
  "pr.saved": { ar: "انحفظ {name}", en: "{name} saved" },
  "pr.new": { ar: "جهاز جديد", en: "New device" },
  "pr.copy": { ar: "{name} (نسخة)", en: "{name} (copy)" },
  "pr.count": { ar: "{n}", en: "{n}" },
  "cp.on": { ar: "الحملة شغّالة", en: "Campaign is on" },
  "cp.onHelp": {
    ar: "لما تكون طافية أو خلص وقتها، بتختفي من الموقع لحالها.",
    en: "When it’s off or past its last day, it disappears from the site by itself.",
  },
  "cp.titleAr": { ar: "اسم الحملة بالعربي", en: "Campaign name, Arabic" },
  "cp.titleEn": { ar: "اسم الحملة بالإنجليزي", en: "Campaign name, English" },
  "cp.start": { ar: "أول يوم", en: "First day" },
  "cp.end": { ar: "آخر يوم", en: "Last day" },
  "cp.min": { ar: "أقل قيمة للفاتورة (د.أ)", en: "Minimum invoice (JOD)" },
  "cp.draw": { ar: "فرع السحب", en: "Draw branch" },
  "cp.approval": { ar: "رقم موافقة الوزارة", en: "Ministry approval number" },
  "cp.prizes": { ar: "الجوائز", en: "Prizes" },
  "cp.addPrize": { ar: "أضف جائزة", en: "Add prize" },
  "cp.removePrize": { ar: "احذف الجائزة {n}", en: "Remove prize {n}" },
  "cp.state.live": { ar: "شغّالة، باقي {n} يوم", en: "Live, {n} days left" },
  "cp.state.soon": { ar: "بتبلش {date}", en: "Starts {date}" },
  "cp.state.over": { ar: "خلص وقتها", en: "Ended" },
  "cp.state.off": { ar: "طافية", en: "Off" },
  "cp.err.dates": {
    ar: "آخر يوم لازم يكون بنفس يوم البداية أو بعده.",
    en: "The last day must be on or after the first day.",
  },
  "cp.err.title": { ar: "الحملة بدها اسم.", en: "The campaign needs a name." },
  "cp.saved": { ar: "انحفظت الحملة", en: "Campaign saved" },
  "br.nameAr": { ar: "اسم الفرع بالعربي", en: "Branch name, Arabic" },
  "br.nameEn": { ar: "اسم الفرع بالإنجليزي", en: "Branch name, English" },
  "br.phone": { ar: "رقم الفرع", en: "Branch number" },
  "br.maps": { ar: "رابط الموقع على Google Maps", en: "Google Maps link" },
  "br.mapsHelp": {
    ar: "اتركه فاضي إذا ما في رابط، وزر الخريطة بيختفي.",
    en: "Leave empty if there’s no link; the Map button hides.",
  },
  "br.main": { ar: "الفرع الرئيسي", en: "Main branch" },
  "br.wa": { ar: "بيرد على واتساب", en: "Answers WhatsApp" },
  "br.saved": { ar: "انحفظت الفروع", en: "Branches saved" },
  "br.new": { ar: "فرع جديد", en: "New branch" },
  "br.add": { ar: "أضف فرع", en: "Add branch" },
  "br.remove": { ar: "احذف الفرع", en: "Remove branch" },
  "br.removeQ": {
    ar: "تحذف فرع {name}؟ بينحذف لما تضغط «احفظ».",
    en: "Remove the {name} branch? It goes when you press “Save”.",
  },
  "br.err": {
    ar: "كل فرع بده اسم ورقم موبايل أردني صحيح.",
    en: "Every branch needs a name and a valid Jordanian number.",
  },
  "st.concept": { ar: "شريط نسخة العرض", en: "Concept notice" },
  "st.conceptHelp": {
    ar: "بيطلع فوق الموقع وبيوضح إن الأسعار أمثلة. طفّيه لما يصير الموقع رسمي.",
    en: "Shown above the site to say prices are examples. Turn it off when the site goes live.",
  },
  "st.whatsapp": {
    ar: "رقم واتساب للاستفسارات",
    en: "WhatsApp contact number",
  },
  "st.whatsappHelp": {
    ar: "رقم التواصل للاستفسارات وطلبات الصيانة. أكّده مع المحل.",
    en: "Contact number for inquiries and repair requests. Confirm it with the shop.",
  },
  "st.followersAr": {
    ar: "سطر متابعين انستغرام بالعربي",
    en: "Instagram followers line, Arabic",
  },
  "st.followersEn": {
    ar: "سطر متابعين انستغرام بالإنجليزي",
    en: "Instagram followers line, English",
  },
  "st.deliveryAr": {
    ar: "ملاحظة التوصيل بالعربي",
    en: "Delivery note, Arabic",
  },
  "st.deliveryEn": {
    ar: "ملاحظة التوصيل بالإنجليزي",
    en: "Delivery note, English",
  },
  "st.tradein": { ar: "رابط صفحة التقييم", en: "Trade-in page link" },
  "st.saved": { ar: "انحفظت الإعدادات", en: "Settings saved" },
  "st.err.wa": {
    ar: "اكتب رقم موبايل أردني صحيح للواتساب.",
    en: "Enter a valid Jordanian mobile number for WhatsApp.",
  },
  "st.err.url": {
    ar: "الرابط لازم يبلش بـ https://",
    en: "The link must start with https://",
  },
  "st.reset": { ar: "رجّع بيانات العرض", en: "Reset demo data" },
  "st.resetHelp": {
    ar: "بيرجّع الأجهزة والأسعار والطلبات التجريبية زي أول مرة، بهالمتصفح بس.",
    en: "Puts the devices, prices and sample orders back as they first were, in this browser only.",
  },
  "st.resetQ": {
    ar: "متأكد؟ كل تعديلاتك وطلباتك بهالمتصفح بتنمسح.",
    en: "Are you sure? All your changes and orders in this browser are erased.",
  },
  "st.resetDone": { ar: "رجعت بيانات العرض", en: "Demo data reset" },
  "nav.maint": { ar: "الصيانة", en: "Repairs" },
  "maint.title": { ar: "صيانة الأجهزة", en: "Device repairs" },
  "maint.sub": {
    ar: "جهازك فيه مشكلة؟ ابعت طلب صيانة من هون، وبنتواصل معك لنتفق على الفحص والسعر قبل أي تصليح.",
    en: "Something wrong with your device? Send a repair request here and we’ll call you to agree on the check and the price before any repair.",
  },
  "maint.homeSub": {
    ar: "اختار المشكلة وابعت الطلب، وسلّم جهازك بالفرع اللي بناسبك.",
    en: "Pick the problem, send the request and drop your device at the branch that suits you.",
  },
  "maint.cta": { ar: "اطلب صيانة", en: "Request a repair" },
  "maint.trackCta": { ar: "تتبّع طلب صيانة", en: "Track a repair" },
  "maint.issue.screen": { ar: "الشاشة", en: "Screen" },
  "maint.issue.battery": { ar: "البطارية", en: "Battery" },
  "maint.issue.charging": { ar: "منفذ الشحن", en: "Charging port" },
  "maint.issue.camera": { ar: "الكاميرا", en: "Camera" },
  "maint.issue.audio": { ar: "الصوت والمايك", en: "Speaker and mic" },
  "maint.issue.software": { ar: "السوفتوير", en: "Software" },
  "maint.issue.water": { ar: "دخول مي", en: "Water damage" },
  "maint.issue.other": { ar: "مشكلة ثانية", en: "Something else" },
  "maint.form": { ar: "طلب صيانة", en: "Repair request" },
  "maint.device": { ar: "نوع الجهاز وموديله", en: "Device and model" },
  "maint.devicePh": {
    ar: "مثلاً iPhone 13 أو Galaxy A54",
    en: "e.g. iPhone 13 or Galaxy A54",
  },
  "maint.issue": { ar: "شو المشكلة؟", en: "What’s wrong?" },
  "maint.details": {
    ar: "اوصف المشكلة (اختياري)",
    en: "Describe the problem (optional)",
  },
  "maint.branch": {
    ar: "الفرع اللي بتسلّم فيه الجهاز",
    en: "Branch to drop the device at",
  },
  "maint.submit": { ar: "ابعت طلب الصيانة", en: "Send repair request" },
  "maint.err.device": { ar: "اكتب نوع الجهاز.", en: "Enter the device." },
  "maint.price": {
    ar: "السعر بيتحدد بعد فحص الجهاز، وبنحكيلك إياه قبل ما نصلّح.",
    en: "The price is set after a check, and you hear it before any repair.",
  },
  "maint.done.title": { ar: "انحفظ طلب الصيانة", en: "Repair request saved" },
  "maint.done.wa": {
    ar: "ابعت الطلب على واتساب",
    en: "Send the request on WhatsApp",
  },
  "maint.done.another": { ar: "طلب جديد", en: "New request" },
  "maint.wamsg": {
    ar: "مرحبا فليك، طلب صيانة رقم {id}:\nالجهاز: {device}\nالمشكلة: {issue}\n{details}\nالاسم: {name}\nالفرع: {branch}",
    en: "Hi FLiCK, repair request {id}:\nDevice: {device}\nProblem: {issue}\n{details}\nName: {name}\nBranch: {branch}",
  },
  "maint.steps": { ar: "مراحل الطلب", en: "How a request moves" },
  "maint.track": { ar: "تتبّع طلب صيانة", en: "Track a repair" },
  "maint.trackId": { ar: "رقم الطلب", en: "Request number" },
  "maint.trackGo": { ar: "اعرض الحالة", en: "Show status" },
  "maint.trackNone": {
    ar: "ما لقينا طلب بهالرقم وهالموبايل. تأكد من الرقمين.",
    en: "No request matches that number and mobile. Check both.",
  },
  "maint.trackFound": {
    ar: "طلب {id} ({device})",
    en: "Request {id} ({device})",
  },
  "maint.where": { ar: "وين تسلّم جهازك", en: "Where to drop your device" },
  "mstatus.new": { ar: "وصل الطلب", en: "Request received" },
  "mstatus.received": { ar: "استلمنا الجهاز", en: "Device received" },
  "mstatus.repairing": { ar: "قيد الصيانة", en: "Being repaired" },
  "mstatus.ready": { ar: "جاهز للاستلام", en: "Ready for pickup" },
  "mstatus.delivered": { ar: "تسلّم", en: "Picked up" },
  "mstatus.cancelled": { ar: "ملغي", en: "Cancelled" },
  "admin.maint": { ar: "الصيانة", en: "Repairs" },
  "ov.maint": { ar: "طلبات صيانة جديدة", en: "New repair requests" },
  "mt.search": {
    ar: "ابحث بالاسم أو الرقم أو الجهاز",
    en: "Search by name, phone or device",
  },
  "mt.empty": {
    ar: "ما في طلبات صيانة بهالحالة.",
    en: "No repair requests with this status.",
  },
  "mt.open": { ar: "افتح طلب الصيانة {id}", en: "Open repair request {id}" },
  "mt.device": { ar: "الجهاز", en: "Device" },
  "mt.issue": { ar: "المشكلة", en: "Problem" },
  "mt.details": { ar: "وصف الزبون", en: "Customer’s description" },
  "mt.branch": { ar: "فرع التسليم: {branch}", en: "Drop-off branch: {branch}" },
  "mt.deleteQ": {
    ar: "تحذف طلب الصيانة {id}؟ ما في رجعة.",
    en: "Delete repair request {id}? This can’t be undone.",
  },
  "mt.deleted": {
    ar: "انحذف طلب الصيانة {id}",
    en: "Repair request {id} deleted",
  },
  "mt.statusSaved": {
    ar: "صار طلب الصيانة {id}: {status}",
    en: "Repair request {id} is now: {status}",
  },
  "mt.help": {
    ar: "الحالة اللي بتختارها هون بيشوفها الزبون لما يتتبّع طلبه.",
    en: "The status you pick here is what the customer sees when tracking the request.",
  },
};
function eX(e, t, n) {
  let r = eJ[t][e];
  if (n)
    for (let [e, t] of Object.entries(n)) r = r.split(`{${e}}`).join(String(t));
  return r;
}
function eZ(e, t) {
  return e ? (("ar" === t ? e.ar || e.en : e.en || e.ar) ?? "") : "";
}
