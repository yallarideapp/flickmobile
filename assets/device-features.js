/* Device specifications and optional inventory details shared by the storefront
 * and its catalog editor. Missing measurements and conditions stay unknown. */
(function (global) {
  'use strict';

  const conditions = {
    new: { ar: 'جديد', en: 'New' },
    'new-sealed': { ar: 'جديد مسكّر بالكرتونة', en: 'New, sealed' },
    'like-new': { ar: 'مستعمل بحالة الجديد', en: 'Used like new' },
    used: { ar: 'مستعمل', en: 'Used' },
    'used-agency': { ar: 'مستعمل بحالة الوكالة', en: 'Used in agency condition' }
  };
  const noteLabels = {
    active: { ar: 'مفعّل', en: 'Activated' },
    noActive: { ar: 'ما تفعّل', en: 'Never activated' },
    mdm: { ar: 'جهاز مُدار (MDM)', en: 'Managed device (MDM)' }
  };
  const categoryLabels = {
    phones: { ar: 'موبايلات', en: 'Phones' },
    tablets: { ar: 'تابلت', en: 'Tablets' },
    headphones: { ar: 'سماعات', en: 'Earbuds & headphones' },
    audio: { ar: 'سماعات', en: 'Audio' },
    speakers: { ar: 'سبيكرات', en: 'Speakers' },
    watches: { ar: 'ساعات ذكية', en: 'Smartwatches' },
    accessories: { ar: 'إكسسوارات', en: 'Accessories' },
    laptops: { ar: 'لابتوبات', en: 'Laptops' }
  };
  const words = {
    options: { ar: 'اختار خيار الجهاز', en: 'Choose a device option' },
    option: { ar: 'خيار', en: 'Option' },
    features: { ar: 'مميزات ومواصفات الجهاز', en: 'Device features and specifications' },
    configuration: { ar: 'السعة / المقاس', en: 'Storage / size' },
    brand: { ar: 'الماركة', en: 'Brand' },
    category: { ar: 'نوع الجهاز', en: 'Device type' },
    condition: { ar: 'حالة الجهاز', en: 'Device condition' },
    unknown: { ar: 'غير محددة', en: 'Not provided' },
    warranty: { ar: 'الكفالة', en: 'Warranty' },
    stock: { ar: 'الكمية المتوفرة', en: 'Available quantity' },
    stockHelp: { ar: 'اتركها فارغة إذا لم تكن الكمية محددة. الصفر يعني غير متوفر.', en: 'Leave blank when quantity is not tracked. Zero means out of stock.' },
    battery: { ar: 'حالة البطارية', en: 'Battery condition' },
    batteryHealth: { ar: 'صحة البطارية (%)', en: 'Battery health (%)' },
    batteryCycles: { ar: 'عدد دورات شحن البطارية', en: 'Battery cycle count' },
    batteryHelp: { ar: 'أدخل قراءة الجهاز فقط. اترك الحقول فارغة إذا لم تكن معروفة.', en: 'Enter readings from this device. Leave unknown measurements blank.' },
    notes: { ar: 'تفاصيل إضافية', en: 'Additional details' },
    activation: { ar: 'التفعيل', en: 'Activation' },
    management: { ar: 'إدارة الجهاز', en: 'Device management' },
    unavailable: { ar: 'غير متوفر', en: 'Out of stock' },
    optional: { ar: 'اختياري', en: 'Optional' },
    arabic: { ar: 'عربي', en: 'Arabic' },
    english: { ar: 'إنجليزي', en: 'English' },
    summary: { ar: 'نبذة عن الجهاز', en: 'Device summary' },
    specs: { ar: 'المواصفات التقنية', en: 'Technical specifications' },
    specLabel: { ar: 'اسم المواصفة', en: 'Specification label' },
    specValue: { ar: 'قيمة المواصفة', en: 'Specification value' },
    addSpec: { ar: 'أضف مواصفة', en: 'Add specification' },
    remove: { ar: 'إزالة', en: 'Remove' },
    invalidStock: { ar: 'الكمية لازم تكون عدد صحيح صفر أو أكثر.', en: 'Quantity must be a nonnegative whole number.' },
    invalidHealth: { ar: 'صحة البطارية لازم تكون عدد صحيح بين 0 و100.', en: 'Battery health must be a whole number from 0 to 100.' },
    invalidCycles: { ar: 'عدد دورات الشحن لازم يكون عدد صحيح صفر أو أكثر.', en: 'Battery cycles must be a nonnegative whole number.' }
  };

  function local(value, lang) {
    if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
    return value && typeof value === 'object' ? String(value[lang] || value.en || value.ar || '').trim() : '';
  }
  function bilingual(value) {
    return typeof value === 'string' ? { ar: value, en: value } : { ar: value?.ar || '', en: value?.en || '' };
  }
  function conditionGroup(variant) {
    const value = variant?.condition;
    if (value === 'new' || value === 'new-sealed') return 'new';
    if (value === 'like-new' || value === 'used' || value === 'used-agency') return 'used';
    return '';
  }
  function conditionLabel(variant, lang = 'en') {
    return local(conditions[variant?.condition], lang);
  }
  const generatedConditions = new Set(Object.values(conditions).flatMap(value => [value.ar, value.en]));
  function legacyLabel(variant, lang) {
    const parts = local(variant?.label, lang).split(' · ');
    // A prepared option can be prepared again without appending its metadata twice.
    while (parts.length && (generatedConditions.has(parts[parts.length - 1]) || /^(?:Battery|البطارية) \d+(?:%|٪)$/.test(parts[parts.length - 1]) || /^\d+ (?:cycles|دورة شحن)$/.test(parts[parts.length - 1]))) parts.pop();
    return parts.join(' · ');
  }
  function storage(variant) {
    return local(variant?.storage, 'en') || local(variant?.capacity, 'en') || legacyLabel(variant, 'en');
  }
  function optionalNumber(value, field) {
    if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) return null;
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
    const valid = Number.isSafeInteger(number) && number >= 0 && (field !== 'batteryHealth' || number <= 100);
    if (!valid) {
      const error = new Error(`${field} has an invalid measurement`);
      error.field = field;
      error.code = 'invalid-device-option';
      throw error;
    }
    return number;
  }
  function available(variant) {
    if (!variant || variant.inStock === false || variant.soldOut === true) return false;
    try { return optionalNumber(variant.stockQuantity, 'stockQuantity') !== 0; }
    catch (_) { return false; }
  }
  function maxQuantity(variant) {
    if (!available(variant)) return 0;
    const stock = optionalNumber(variant.stockQuantity, 'stockQuantity');
    return stock === null ? 5 : Math.min(5, stock);
  }
  function optionLabel(variant, lang = 'en') {
    const value = variant || {};
    const parts = [local(value.storage, lang) || local(value.capacity, lang) || legacyLabel(value, lang), conditionLabel(value, lang)].filter(Boolean);
    if (conditionGroup(value) === 'used') {
      for (const field of ['batteryHealth', 'batteryCycles']) {
        let number;
        try { number = optionalNumber(value[field], field); } catch (_) { continue; }
        if (number === null) continue;
        parts.push(field === 'batteryHealth' ? (lang === 'ar' ? `البطارية ${number}٪` : `Battery ${number}%`) : (lang === 'ar' ? `${number} دورة شحن` : `${number} cycles`));
      }
    }
    return parts.join(' · ');
  }
  function prepareVariant(variant) {
    const next = { ...variant };
    for (const field of ['stockQuantity', 'batteryHealth', 'batteryCycles']) {
      if (Object.prototype.hasOwnProperty.call(next, field) && next[field] !== undefined) next[field] = optionalNumber(next[field], field);
    }
    next.inStock = available(next);
    const preparedLabel = ['ar', 'en'].some(lang => legacyLabel(next, lang) !== local(next.label, lang));
    if (local(next.storage, 'en') || conditionGroup(next) || preparedLabel) {
      next.label = { ar: optionLabel(next, 'ar'), en: optionLabel(next, 'en') };
    }
    return next;
  }
  function prepareTechnical(technical) {
    if (technical === undefined || technical === null) return technical;
    const invalid = () => {
      const error = new Error('Each technical specification needs a label and a value');
      error.field = 'technical';
      error.code = 'invalid-device-specification';
      throw error;
    };
    if (typeof technical !== 'object' || Array.isArray(technical)) invalid();
    const pair = value => {
      if (value === undefined || value === null) return { ar: '', en: '' };
      if (typeof value === 'string') return { ar: value.trim(), en: value.trim() };
      if (typeof value !== 'object' || Array.isArray(value)) return invalid();
      if (['ar', 'en'].some(lang => value[lang] != null && typeof value[lang] !== 'string')) return invalid();
      const ar = (value.ar || '').trim();
      const en = (value.en || '').trim();
      return { ar: ar || en, en: en || ar };
    };
    if (technical.specs != null && !Array.isArray(technical.specs)) invalid();
    const specs = [];
    for (const row of technical.specs || []) {
      if (!row || typeof row !== 'object' || Array.isArray(row)) invalid();
      const label = pair(row.label);
      const value = pair(row.value);
      if (!label.en && !value.en) continue;
      if (!label.en || !value.en) invalid();
      specs.push({ ...row, label, value });
    }
    return { ...technical, summary: pair(technical.summary), specs };
  }

  function createComponents(React, jsx, useStore) {
    const h = React.createElement;
    function context() {
      const store = useStore();
      const lang = store.lang === 'ar' ? 'ar' : 'en';
      return { lang, text: key => local(words[key], lang) };
    }
    function specification(product) {
      return product?.technical || global.FlickDeviceSpecifications?.[product?.id] || {};
    }
    function money(value, lang) {
      if (!Number.isFinite(Number(value)) || Number(value) <= 0) return '';
      const amount = Number(value).toLocaleString('en-US', { maximumFractionDigits: 3 });
      return lang === 'ar' ? `${amount} د.أ` : `${amount} JOD`;
    }
    function hasOffer(variant) {
      return Number.isFinite(variant.offerPrice) && variant.offerPrice > 0 && variant.offerPrice < variant.price;
    }
    function VariantPicker({ product, variant, onSelect }) {
      const { lang, text } = context();
      return h('fieldset', { className: 'flick-device-options' },
        h('legend', null, text('options')),
        h('div', { className: 'flick-device-option-list' }, (product.variants || []).map((option, index) =>
          h('button', { type: 'button', key: option.key, className: 'flick-device-option', 'aria-pressed': option.key === variant?.key, disabled: !available(option), onClick: () => onSelect(option.key) },
            h('span', { className: 'flick-device-option-name', dir: 'auto' }, optionLabel(option, lang) || `${text('option')} ${index + 1}`),
            h('span', { className: 'flick-device-option-price', dir: 'auto' }, !available(option) ? text('unavailable') : [
              hasOffer(option) ? h('s', { key: 'was' }, money(option.price, lang)) : null,
              h('bdi', { key: 'now' }, money(hasOffer(option) ? option.offerPrice : option.price, lang))
            ])
          ))));
    }
    function Details({ product, variant }) {
      const { lang, text } = context();
      const data = specification(product);
      const rows = [];
      const add = (label, value) => { if (value !== '' && value !== undefined && value !== null) rows.push([label, String(value)]); };
      add(text('configuration'), local(variant?.storage, lang) || local(variant?.capacity, lang) || legacyLabel(variant, lang));
      add(text('brand'), local(product.brand, lang));
      add(text('category'), local(product.categoryName || categoryLabels[product.cat || product.category], lang));
      add(text('condition'), conditionLabel(variant, lang));
      add(text('warranty'), local(variant?.warranty, lang));
      for (const note of Array.isArray(variant?.notes) ? variant.notes : []) {
        if (noteLabels[note]) add(text(note === 'mdm' ? 'management' : 'activation'), local(noteLabels[note], lang));
      }
      for (const field of ['stockQuantity', ...(conditionGroup(variant) === 'used' ? ['batteryHealth', 'batteryCycles'] : [])]) {
        let value;
        try { value = optionalNumber(variant?.[field], field); } catch (_) { continue; }
        if (value !== null) add(text(field === 'stockQuantity' ? 'stock' : field), `${value}${field === 'batteryHealth' ? (lang === 'ar' ? '٪' : '%') : ''}`);
      }
      for (const row of Array.isArray(data.specs) ? data.specs : []) add(local(row?.label, lang), local(row?.value, lang));
      const summary = local(data.summary, lang);
      if (!summary && !rows.length) return null;
      return h('section', { className: 'flick-device-details' },
        h('h2', null, text('features')),
        summary ? h('p', { className: 'flick-device-summary', dir: 'auto' }, summary) : null,
        rows.length ? h('dl', { className: 'flick-device-specs' }, rows.map(([label, value], index) =>
          h('div', { key: `${label}-${index}` }, h('dt', null, label), h('dd', { dir: 'auto' }, value)))) : null);
    }
    function CardSummary({ product, variant }) {
      const { lang } = context();
      const caption = local(specification(product).specs?.[0]?.value, lang);
      const condition = conditionLabel(variant, lang);
      if (!caption && !condition) return null;
      return h('div', { className: 'flick-device-card-summary' },
        caption ? h('p', { dir: 'auto' }, caption) : null,
        condition ? h('span', { className: 'flick-device-condition', dir: 'auto' }, condition) : null);
    }
    function VariantEditor({ variant, onChange, index = 0 }) {
      const { lang, text } = context();
      const id = React.useId();
      const prefix = `flick-option-${id}-${index}`;
      const update = patch => onChange({ ...variant, ...patch });
      const used = conditionGroup(variant) === 'used';
      const warranty = bilingual(variant.warranty);
      const errorFor = field => {
        try { optionalNumber(variant[field], field); return ''; }
        catch (_) { return text(field === 'stockQuantity' ? 'invalidStock' : field === 'batteryHealth' ? 'invalidHealth' : 'invalidCycles'); }
      };
      const field = (name, label, value, change, options = {}) => {
        const error = options.error || '';
        return h('label', { className: 'flick-device-field', htmlFor: `${prefix}-${name}`, key: name },
          h('span', null, label),
          h('input', { id: `${prefix}-${name}`, name: `${prefix}-${name}`, value: value ?? '', onChange: event => change(event.target.value), ...options, error: undefined, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${prefix}-${name}-error` : undefined }),
          error ? h('span', { className: 'flick-device-editor-error', id: `${prefix}-${name}-error`, role: 'status' }, error) : null);
      };
      const numeric = (name, label, max) => field(name, `${label} · ${text('optional')}`, variant[name], value => update({ [name]: value === '' ? null : value }), { type: 'number', inputMode: 'numeric', min: 0, max, step: 1, dir: 'ltr', error: errorFor(name) });
      const currentNotes = Array.isArray(variant.notes) ? variant.notes : [];
      const setNote = (note, checked) => {
        const notes = currentNotes.filter(value => value !== note && !(checked && ((note === 'active' && value === 'noActive') || (note === 'noActive' && value === 'active'))));
        if (checked) notes.push(note);
        update({ notes });
      };
      return h('fieldset', { className: 'flick-device-editor' },
        h('legend', null, `${text('option')} ${index + 1} · ${text('notes')}`),
        h('div', { className: 'flick-device-field-grid' },
          h('label', { className: 'flick-device-field', htmlFor: `${prefix}-condition` },
            h('span', null, `${text('condition')} · ${text('optional')}`),
            h('select', { id: `${prefix}-condition`, name: `${prefix}-condition`, value: variant.condition || '', onChange: event => update({ condition: event.target.value }) },
              h('option', { value: '' }, text('unknown')),
              ...Object.entries(conditions).map(([key, label]) => h('option', { key, value: key }, local(label, lang))))),
          field('storage', text('configuration'), variant.storage ?? variant.capacity ?? legacyLabel(variant, lang), value => update({ storage: value }), { type: 'text', dir: 'auto' }),
          numeric('stockQuantity', text('stock'), Number.MAX_SAFE_INTEGER),
          field('warranty-ar', `${text('warranty')} · ${text('arabic')}`, warranty.ar, value => update({ warranty: { ...warranty, ar: value } }), { type: 'text', dir: 'rtl', maxLength: 300 }),
          field('warranty-en', `${text('warranty')} · ${text('english')}`, warranty.en, value => update({ warranty: { ...warranty, en: value } }), { type: 'text', dir: 'ltr', maxLength: 300 })),
        h('p', { className: 'flick-device-editor-help' }, text('stockHelp')),
        used ? h('fieldset', null,
          h('legend', null, text('battery')),
          h('div', { className: 'flick-device-field-grid' }, numeric('batteryHealth', text('batteryHealth'), 100), numeric('batteryCycles', text('batteryCycles'), Number.MAX_SAFE_INTEGER)),
          h('p', { className: 'flick-device-editor-help' }, text('batteryHelp'))) : null,
        h('fieldset', { className: 'flick-device-checks' }, h('legend', null, text('notes')),
          ...Object.entries(noteLabels).map(([note, label]) => h('label', { key: note },
            h('input', { type: 'checkbox', checked: currentNotes.includes(note), onChange: event => setNote(note, event.target.checked) }),
            h('span', null, local(label, lang))))));
    }
    function ProductEditor({ product, onChange }) {
      const { text } = context();
      const id = React.useId();
      const data = specification(product);
      const summary = bilingual(data.summary);
      const specs = Array.isArray(data.specs) ? data.specs : [];
      const update = patch => onChange({ ...product, technical: { ...data, ...patch } });
      const editSpec = (index, field, lang, value) => update({ specs: specs.map((row, at) => at === index ? { ...row, [field]: { ...bilingual(row[field]), [lang]: value } } : row) });
      const localizedField = (name, label, value, onChangeValue, lang, multiline) => {
        const controlId = `flick-technical-${id}-${name}`;
        return h('label', { className: 'flick-device-field', htmlFor: controlId, key: name },
          h('span', null, label),
          h(multiline ? 'textarea' : 'input', { id: controlId, name: controlId, type: multiline ? undefined : 'text', rows: multiline ? 3 : undefined, value: value ?? '', dir: lang === 'ar' ? 'rtl' : 'ltr', maxLength: multiline ? 1500 : 400, onChange: event => onChangeValue(event.target.value) }));
      };
      return h('fieldset', { className: 'flick-device-editor' },
        h('legend', null, text('specs')),
        h('div', { className: 'flick-device-field-grid' }, ...['ar', 'en'].map(lang => localizedField(`summary-${lang}`, `${text('summary')} · ${text(lang === 'ar' ? 'arabic' : 'english')}`, summary[lang], value => update({ summary: { ...summary, [lang]: value } }), lang, true))),
        ...specs.map((row, index) => h('fieldset', { className: 'flick-device-spec-editor', key: index },
          h('legend', null, `${text('specs')} ${index + 1}`),
          h('div', { className: 'flick-device-spec-fields' }, ...['label', 'value'].flatMap(field => ['ar', 'en'].map(lang => localizedField(`spec-${index}-${field}-${lang}`, `${text(field === 'label' ? 'specLabel' : 'specValue')} · ${text(lang === 'ar' ? 'arabic' : 'english')}`, bilingual(row[field])[lang], value => editSpec(index, field, lang, value), lang, field === 'value')))),
          h('button', { type: 'button', className: 'flick-device-remove', onClick: () => update({ specs: specs.filter((_, at) => at !== index) }), 'aria-label': `${text('remove')} ${text('specs')} ${index + 1}` }, text('remove')))),
        h('div', { className: 'flick-device-editor-actions' }, h('button', { type: 'button', onClick: () => update({ specs: [...specs, { label: { ar: '', en: '' }, value: { ar: '', en: '' } }] }) }, text('addSpec'))));
    }
    return { VariantPicker, Details, VariantEditor, ProductEditor, CardSummary };
  }

  global.FlickDeviceFeatures = Object.freeze({ conditionGroup, conditionLabel, storage, available, maxQuantity, optionLabel, prepareVariant, prepareTechnical, createComponents });
})(window);
