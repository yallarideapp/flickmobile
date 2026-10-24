const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { window: {}, Intl };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/device-features.js'), 'utf8'), context);
const features = context.window.FlickDeviceFeatures;
const legacy = { key: '256GB', label: { ar: '256GB', en: '256GB' }, price: 100, offerPrice: null, inStock: true };

assert.equal(features.available(legacy), true);
assert.equal(features.maxQuantity(legacy), 5);
assert.equal(features.storage(legacy), '256GB');
assert.equal(features.conditionGroup(legacy), '');
assert.equal(features.conditionLabel(legacy, 'en'), '');
assert.equal(features.optionLabel(legacy, 'en'), '256GB');
assert.equal(features.available({ ...legacy, stockQuantity: 0 }), false);
assert.equal(features.maxQuantity({ ...legacy, stockQuantity: 2 }), 2);
assert.equal(features.maxQuantity({ ...legacy, stockQuantity: null }), 5);
assert.equal(features.maxQuantity({ ...legacy, stockQuantity: 10 }), 5);
assert.equal(features.available({ ...legacy, soldOut: true }), false);
assert.equal(features.available({ ...legacy, inStock: false }), false);

for (const condition of ['new', 'new-sealed']) {
  assert.equal(features.conditionGroup({ ...legacy, condition }), 'new');
}
for (const condition of ['used', 'like-new', 'used-agency']) {
  assert.equal(features.conditionGroup({ ...legacy, condition }), 'used');
}

const used = { ...legacy, condition: 'like-new', storage: '256GB', stockQuantity: 1, batteryHealth: 0, batteryCycles: 0 };
const prepared = features.prepareVariant(used);
assert.equal(prepared.batteryHealth, 0);
assert.equal(prepared.batteryCycles, 0);
assert.equal(prepared.stockQuantity, 1);
assert.notEqual(features.optionLabel(prepared, 'en'), '256GB');
assert.equal(features.prepareVariant(prepared).label.en, prepared.label.en);
assert.equal(features.prepareVariant(prepared).key, legacy.key);
assert.equal(features.prepareVariant({ ...prepared, condition: '', batteryHealth: null, batteryCycles: null }).label.en, '256GB');

for (const [field, value] of [
  ['stockQuantity', -1], ['stockQuantity', 1.5],
  ['batteryHealth', -1], ['batteryHealth', 101], ['batteryHealth', 90.5],
  ['batteryCycles', -1], ['batteryCycles', 1.5],
]) {
  assert.throws(() => features.prepareVariant({ ...used, [field]: value }), `${field}=${value}`);
}

const technical = {
  summary: { en: ' A phone ', ar: '' },
  sources: ['https://www.apple.com/'],
  specs: [
    { label: { en: ' Display ', ar: '' }, value: { en: ' OLED ', ar: '' } },
    { label: { en: '', ar: '' }, value: { en: '', ar: '' } },
  ],
};
const cleaned = features.prepareTechnical(technical);
assert.equal(cleaned.specs.length, 1);
assert.equal(cleaned.specs[0].label.en, 'Display');
assert.equal(cleaned.specs[0].label.ar, 'Display');
assert.equal(cleaned.specs[0].value.en, 'OLED');
assert.equal(cleaned.sources[0], technical.sources[0]);
assert.equal(technical.specs.length, 2);
assert.throws(() => features.prepareTechnical({ specs: [{ label: { en: 'Display' }, value: {} }] }), error => error.field === 'technical');

console.log('PASS: legacy compatibility, unknown vs zero, availability, quantity limits, condition groups, battery validation, stable labels and keys, technical specification validation');
