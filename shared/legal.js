// Privacy Policy, Terms & Conditions and the trademark notice, in Arabic and English.
// One source for the storefront pages (#/privacy, #/terms) and the server pages
// Google reads (/ar/privacy, /en/privacy, /ar/terms, /en/terms).
// Written from what the code really does. Business numbers (warranty periods,
// return days, delivery times) are not invented here: they come from the invoice
// or the order confirmation. Change UPDATED whenever the text changes.

export const UPDATED = "2026-10-29";

/** Fixed brands plus any new brand in the catalog appear in the notice by themselves. */
// Brands the shop always names in the notice, plus any brand found in the catalog.
export const NOTICE_BRANDS = ["Apple", "Samsung", "Huawei"];

export function brandsOf(products = []) {
  const order = (n) => {
    const i = NOTICE_BRANDS.indexOf(n);
    return i < 0 ? NOTICE_BRANDS.length : i;
  };
  return [
    ...new Set([
      ...NOTICE_BRANDS,
      ...products
        .filter((p) => p && p.visible !== false)
        .map((p) => String(p.brand || "").trim())
        .filter(Boolean),
    ]),
  ].sort((a, b) => order(a) - order(b) || a.localeCompare(b));
}

export function trademarkNotice(products, lang) {
  const names = brandsOf(products);
  if (lang === "ar")
    return names.length
      ? `متجر مستقل، غير تابع لشركات ${names.join(" أو ")} أو أي شركة مصنّعة أخرى. الأسماء والعلامات التجارية مملوكة لأصحابها.`
      : "متجر مستقل، غير تابع لأي شركة مصنّعة. الأسماء والعلامات التجارية مملوكة لأصحابها.";
  return names.length
    ? `Independent store, not affiliated with ${names.join(", ")} or any other manufacturer. Names and trademarks belong to their owners.`
    : "Independent store, not affiliated with any manufacturer. Names and trademarks belong to their owners.";
}

const s = (ar, en) => ({ ar, en });

export const LEGAL = {
  updated: UPDATED,
  privacy: {
    title: s("سياسة الخصوصية", "Privacy Policy"),
    intro: s(
      "توضح هذه السياسة البيانات التي يجمعها موقع FLiCK Mobile، ولماذا نجمعها، وكيف نحميها، وما حقوقك فيها. نلتزم بقانون حماية البيانات الشخصية الأردني رقم (24) لسنة 2023.",
      "This policy explains what data the FLiCK Mobile website collects, why, how we protect it and what your rights are. We follow Jordan's Personal Data Protection Law No. 24 of 2023.",
    ),
    sections: [
      {
        title: s("من نحن", "Who we are"),
        body: [
          s(
            "FLiCK Mobile متجر لبيع الأجهزة والإكسسوارات وصيانتها في عمّان. نحن المسؤولون عن بياناتك التي تُرسلها عبر هذا الموقع، ويمكنك التواصل معنا عبر أرقام الفروع الظاهرة أسفل الموقع.",
            "FLiCK Mobile is a store in Amman that sells and repairs devices and accessories. We are responsible for the data you send through this website, and you can reach us on the branch numbers shown at the bottom of the site.",
          ),
        ],
      },
      {
        title: s("البيانات التي نجمعها", "Data we collect"),
        body: [
          s(
            "عند الطلب: الاسم، ورقم الهاتف، وطريقة الاستلام (من الفرع أو توصيل)، والفرع المختار أو المنطقة والعنوان، والملاحظات التي تكتبها، والمنتجات المطلوبة والمبلغ ووقت الطلب.",
            "When you order: your name, phone number, how you receive the order (branch pickup or delivery), the chosen branch or your area and address, any notes you write, the products ordered, the total and the time of the order.",
          ),
          s(
            "عند طلب الصيانة: الاسم، ورقم الهاتف، ونوع الجهاز، والمشكلة ووصفها، والفرع المختار، وحالة الطلب.",
            "When you request a repair: your name, phone number, the device, the problem and its description, the chosen branch and the request's status.",
          ),
          s(
            "لا نطلب بيانات بطاقات دفع؛ الدفع نقدًا عند الاستلام. ولا يحتاج الزائر إلى إنشاء حساب.",
            "We don't ask for payment card details; payment is cash on delivery or pickup. Visitors don't need an account.",
          ),
        ],
      },
      {
        title: s("لماذا نستخدمها", "Why we use it"),
        body: [
          s(
            "لتأكيد طلبك معك وتجهيزه وتوصيله أو تسليمه، ولمتابعة طلب الصيانة وإتاحة تتبّعه برقم الطلب ورقم الهاتف معًا، وللتواصل معك بشأن طلبك فقط. لا نستخدم بياناتك للإعلانات ولا نبيعها.",
            "To confirm your order with you, prepare it and deliver or hand it over, to handle your repair request and let you track it with the request number and phone number together, and to contact you about your order only. We don't use your data for advertising and we don't sell it.",
          ),
          s(
            "أساس المعالجة موافقتك عند إرسال الطلب، وتنفيذ الطلب الذي طلبته.",
            "We process it on the basis of the consent you give when you send the request, and to fulfil the order you asked for.",
          ),
        ],
      },
      {
        title: s("ما يُحفظ في متصفحك وملفات تعريف الارتباط", "What your browser keeps, and cookies"),
        body: [
          s(
            "يحفظ الموقع في متصفحك محتويات السلة ولغة العرض فقط، وتبقى على جهازك. لا نستخدم ملفات تعريف ارتباط للزوار، ولا أدوات تتبّع أو إعلانات. يستخدم موظفو المتجر ملف تعريف ارتباط آمنًا لتسجيل الدخول إلى لوحة التحكم فقط.",
            "The site keeps only your bag and your language choice in your browser, and they stay on your device. We use no cookies for visitors and no tracking or advertising tools. Store staff use one secure cookie only to sign in to the admin panel.",
          ),
        ],
      },
      {
        title: s("الحماية من الإساءة", "Protection against abuse"),
        body: [
          s(
            "لمنع الطلبات المزعجة نحوّل عنوان IP إلى رمز مشفّر لا يمكن إرجاعه إلى العنوان الأصلي، ونعدّ به الطلبات خلال فترة قصيرة، ويُحذف تلقائيًا خلال يومين على الأكثر.",
            "To block spam requests we turn your IP address into a one-way hashed code that can't be turned back into the address, count requests with it for a short period, and delete it automatically within two days at most.",
          ),
        ],
      },
      {
        title: s("الجهات التي تعالج البيانات نيابةً عنا", "Service providers"),
        body: [
          s(
            "Cloudflare: استضافة الموقع وقاعدة البيانات والصور، وقد تعالج بيانات تقنية مثل عنوان IP لأغراض الأمان والتشغيل.",
            "Cloudflare: hosts the website, its database and images, and may process technical data such as your IP address for security and operation.",
          ),
          s(
            "Google Fonts: تُحمَّل خطوط الموقع من Google، فيصلها عنوان IP الخاص بجهازك عند التحميل.",
            "Google Fonts: the site's fonts load from Google, which receives your device's IP address when they load.",
          ),
          s(
            "لا نشارك بياناتك مع أي جهة أخرى إلا إذا طلب القانون ذلك.",
            "We don't share your data with anyone else unless the law requires it.",
          ),
        ],
      },
      {
        title: s("مدة الاحتفاظ", "How long we keep it"),
        body: [
          s(
            "نحتفظ ببيانات الطلبات والصيانة ما دمنا نحتاجها لخدمة طلبك ومتابعة الضمان والمحاسبة، أو المدة التي يفرضها القانون، ثم نحذفها. ويمكنك أن تطلب حذفها قبل ذلك.",
            "We keep order and repair data for as long as we need it to serve your order, handle warranty and keep our accounts, or for as long as the law requires, and then delete it. You can ask us to delete it sooner.",
          ),
        ],
      },
      {
        title: s("حقوقك", "Your rights"),
        body: [
          s(
            "يحق لك أن تطلب الاطلاع على بياناتك، أو تصحيحها، أو حذفها، أو الاعتراض على معالجتها، أو سحب موافقتك، وذلك بالتواصل مع أي فرع من فروعنا. ويحق لك تقديم شكوى إلى وحدة حماية البيانات الشخصية في وزارة الاقتصاد الرقمي والريادة.",
            "You can ask to see your data, correct it, delete it, object to its processing or withdraw your consent by contacting any of our branches. You can also complain to the Personal Data Protection Unit at the Ministry of Digital Economy and Entrepreneurship.",
          ),
        ],
      },
      {
        title: s("التعديلات", "Changes"),
        body: [
          s(
            "قد نحدّث هذه السياسة، ويظهر تاريخ آخر تحديث أعلى الصفحة.",
            "We may update this policy; the date of the latest update appears at the top of the page.",
          ),
        ],
      },
    ],
  },
  terms: {
    title: s("الشروط والأحكام", "Terms & Conditions"),
    intro: s(
      "باستخدامك موقع FLiCK Mobile أو إرسالك طلبًا عبره فإنك توافق على هذه الشروط. يُرجى قراءتها مع سياسة الخصوصية.",
      "By using the FLiCK Mobile website or sending an order through it, you agree to these terms. Please read them together with the Privacy Policy.",
    ),
    sections: [
      {
        title: s("متجر مستقل والعلامات التجارية", "Independent store and trademarks"),
        body: [
          { notice: true },
          s(
            "تُستخدم أسماء المنتجات والعلامات للدلالة على الجهاز المعروض فقط. صور الأجهزة في الموقع توضيحية، وقد يختلف اللون أو التفاصيل عن الجهاز الفعلي.",
            "Product names and marks are used only to identify the device on sale. Device pictures on the site are illustrations, and the colour or details may differ from the actual device.",
          ),
        ],
      },
      {
        title: s("المنتجات والأسعار", "Products and prices"),
        body: [
          s(
            "الأسعار بالدينار الأردني، وقد تتغير الأسعار وتوفّر المنتجات دون إشعار مسبق. يُعتمد السعر الذي نؤكده لك عند تأكيد الطلب.",
            "Prices are in Jordanian dinars, and prices and availability can change without notice. The price we confirm with you when confirming the order applies.",
          ),
        ],
      },
      {
        title: s("الطلبات والدفع", "Orders and payment"),
        body: [
          s(
            "إرسال الطلب عبر الموقع طلبُ شراء وليس بيعًا نهائيًا. يتواصل معك الفرع لتأكيد التوفّر والسعر ورسوم التوصيل وموعده، ويُعدّ الطلب مقبولًا بعد هذا التأكيد. الدفع نقدًا عند الاستلام.",
            "Sending an order on the site is a request to buy, not a final sale. The branch contacts you to confirm availability, price, delivery fee and time, and the order is accepted once confirmed. Payment is cash on receipt.",
          ),
          s(
            "يحق للمتجر رفض الطلب أو إلغاؤه إذا لم يتوفر المنتج أو ظهر خطأ في السعر أو البيانات، وسنبلغك بذلك.",
            "The store may decline or cancel an order if the product is unavailable or there is an error in the price or details, and we will tell you.",
          ),
        ],
      },
      {
        title: s("التوصيل والاستلام", "Delivery and pickup"),
        body: [
          s(
            "رسوم التوصيل وموعده كما يظهران عند الطلب أو كما يؤكدهما الفرع. يُرجى فحص الجهاز عند استلامه.",
            "The delivery fee and time are as shown when ordering or as confirmed by the branch. Please check the device when you receive it.",
          ),
        ],
      },
      {
        title: s("الضمان والاستبدال والإرجاع", "Warranty, exchange and returns"),
        body: [
          s(
            "تخضع الضمانات والاستبدال والإرجاع لما هو مذكور في فاتورتك وشروط ضمان الجهاز وقت البيع، ولقوانين حماية المستهلك المعمول بها في الأردن.",
            "Warranty, exchange and returns follow what is stated on your invoice and the device's warranty terms at the time of sale, and Jordan's consumer protection laws.",
          ),
        ],
      },
      {
        title: s("الصيانة", "Repairs"),
        body: [
          s(
            "طلب الصيانة عبر الموقع ليس عرض سعر. تُحدَّد الكلفة والمدة بعد فحص الجهاز ويُتّفق عليها معك. ننصحك بأخذ نسخة احتياطية من بياناتك قبل تسليم الجهاز.",
            "A repair request on the site is not a quote. The cost and time are set after the device is inspected and agreed with you. We recommend backing up your data before handing over the device.",
          ),
        ],
      },
      {
        title: s("تقييم الجهاز القديم والحملات", "Trade-in valuation and campaigns"),
        body: [
          s(
            "التقييم المبدئي للجهاز القديم تقديري، والقيمة النهائية بعد فحص الجهاز في الفرع. تخضع الحملات والعروض لشروطها المعلنة.",
            "The initial trade-in valuation is an estimate; the final value is set after the device is inspected at a branch. Campaigns and offers follow their own announced terms.",
          ),
        ],
      },
      {
        title: s("الاستخدام المقبول", "Acceptable use"),
        body: [
          s(
            "يُمنع إرسال طلبات وهمية أو بيانات شخص آخر دون إذنه أو محاولة تعطيل الموقع. تصميم الموقع ونصوصه مملوكة لـ FLiCK Mobile.",
            "Don't send fake orders, someone else's details without their permission, or try to disrupt the site. The site's design and text belong to FLiCK Mobile.",
          ),
        ],
      },
      {
        title: s("المسؤولية والقانون", "Liability and law"),
        body: [
          s(
            "نسعى إلى دقة المعلومات في الموقع دون ضمان خلوّها من الأخطاء، وتكون مسؤوليتنا في الحدود التي يسمح بها القانون. تخضع هذه الشروط لقوانين المملكة الأردنية الهاشمية.",
            "We aim for accurate information on the site but can't guarantee it is free of errors, and our liability is limited to what the law allows. These terms are governed by the laws of the Hashemite Kingdom of Jordan.",
          ),
        ],
      },
      {
        title: s("التعديلات والتواصل", "Changes and contact"),
        body: [
          s(
            "قد نحدّث هذه الشروط، ويظهر تاريخ آخر تحديث أعلى الصفحة. لأي استفسار تواصل مع أي فرع عبر الأرقام الظاهرة أسفل الموقع.",
            "We may update these terms; the date of the latest update appears at the top of the page. For any question, contact any branch on the numbers at the bottom of the site.",
          ),
        ],
      },
    ],
  },
};
