// Stable names around the recovered Parcel application. Live integrations are
// configured before mount; the portable demo retains its original provider.
function flickAdminRoute({ page }) {
  const child = (0, k.jsx)(oI, { page });
  const Gate = window.FlickApp.AdminGate;
  return Gate ? (0, k.jsx)(Gate, { page, children: child }) : child;
}
function od() {
  const Tracker =
    window.FlickApp.MaintenanceTracker ?? flickDemoMaintenanceTracker;
  return (0, k.jsx)(Tracker, {});
}
function flickSetCategories(categories) {
  if (!Array.isArray(categories)) return;
  const entries = categories.map(({ id, name, pictureId }) => ({
    id,
    ar: name.ar,
    en: name.en,
    pictureId,
  }));
  ez.splice(0, ez.length, ...entries);
  eT.splice(0, eT.length, ...entries.map(({ id }) => id));
  for (const category of entries)
    eJ[`cat.${category.id}`] = { ar: category.ar, en: category.en };
}
window.FlickApp = {
  mode: "demo",
  React: w,
  jsx: k,
  toast: D,
  StoreContext: nf,
  DemoProvider: np,
  useStore: nm,
  App: o$,
  Admin: oI,
  RepairStatus: ou,
  DemoMaintenanceTracker: flickDemoMaintenanceTracker,
  maintenanceStatusKey: oo,
  maintenanceIssues: oa,
  seedContent: t8,
  readLanguage: nd,
  translate: eX,
  translated: eZ,
  bagLines: eG,
  effectivePrice: eO,
  roundPrice: eD,
  parseRoute: ny,
  parseHashRoute: flickParseHashRoute,
  href: nk,
  navigate: nw,
  normalizePhone: eU,
  validPhone: e_,
  normalizeDigits: eB,
  productMedia: eC,
  setCategories: flickSetCategories,
  configure(options) {
    Object.assign(this, options);
    return this;
  },
};
