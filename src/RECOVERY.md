# Flick source recovery and integration boundary

The repository supplied for this task contains an exported Parcel application,
not the original React project. Every published commit was checked, including
initial commit `4a9c0ea6b8d879b13e2118f37f87245149e150ec` and the parent of
`1100358176564afcc494c8e2bacd86574d8c544e` ("Rebuild storefront from source").
Neither contains original JSX, package metadata or source maps. The latter
commit removed supplemental storefront modules/tests, not an original React
source tree.

These files recover the emitted JavaScript from
`yallarideapp/flickmobile@a69224d1c268c189705b400a66028bc8e5d7f8c6:index.html`.
Names such as `oI` and `np` come from that export; this is not a claim that the
original component names or JSX were recovered. The existing UI, catalog,
Arabic/English text, motion and Trio device logic are retained. The existing
exported `index.html` was not edited during recovery.

## Editable source

- `shell.html`: valid HTML shell with `{{STYLES}}`, `{{BOOTSTRAP}}` and `{{APP}}`
  replacement slots. Includes the original favicon and device assets.
- `styles.css`: the exported CSS, formatted for maintenance.
- `bootstrap.js`: the original early language/font bootstrap, formatted.
- `app-core.js`: product media, category definitions, pricing/phone utilities
  and translations.
- `store.js`: original demo seed/local adapter, React context/provider, shared
  display components and routing utilities.
- `app.js`: original storefront and admin components. Write handlers now await
  either synchronous demo results or asynchronous live results; checkout,
  maintenance and common admin Save buttons have pending states.
- `hero-showcase.js`: maintained homepage device carousel, extracted from `l4`
  in `app.js`. Reuses the embedded React runtime, shared media/price components,
  available variants and curated categories. Its CSS is in
  `assets/device-motion.css`; no extra React or animation runtime is loaded.
- `integration.js`: stable, descriptive names around recovered identifiers.
- `live-adapter.js`: separately authored Cloudflare integration, configured
  before mounting.
- `mount.js`: selects `FlickApp.LiveProvider` when configured, otherwise the
  original demo provider.

`order.json` is the required concatenation order for the single JavaScript
module. This preserves Parcel's lexical bindings and avoids modifying bundled
third-party runtime code. Vendor files must not be imported as independent ES
modules: the published application uses shared lexical bindings between them.

## Preserved vendor segments

`vendor/runtime.js`, `vendor/tailwind.js` and `vendor/dialog.js` are byte-for-byte
slices of the original export, without formatting or behavior edits. They
contain the Parcel runtime, React/ReactDOM, toast/icons, class merging and dialog
primitives, respectively. Vendor dependencies were interleaved with app code in
the export, so a single vendor-prefix split would not have been correct.

`recovery.json` records original byte ranges and SHA-256 hashes. The one-time
`scripts/recover-source.mjs` extraction tool refuses an existing output folder.
It is not a build step and must not be rerun over edited source. It can extract
another copy to a fresh temporary directory for provenance checks. Its raw
recovered shell was normalized to valid HTML in the maintained source.

## Live integration contract

`window.FlickApp` exposes:

```js
{
  React, jsx, toast,
  StoreContext, DemoProvider, useStore, App, Admin,
  RepairStatus, DemoMaintenanceTracker,
  maintenanceStatusKey, maintenanceIssues,
  seedContent, readLanguage, translate, translated,
  bagLines, effectivePrice, roundPrice,
  parseRoute, parseHashRoute, href, navigate,
  normalizePhone, validPhone, normalizeDigits, productMedia,
  setCategories, configure
}
```

Call `FlickApp.configure(options)` in the live adapter before `mount.js`.
Supported slots are:

- `LiveProvider`: supplies `StoreContext.Provider`. It must supply the same
  context fields as `DemoProvider`, with server storage and its own startup/auth
  state. The live provider must not use the demo seed or sample customer data as
  an API failure fallback.
- `AdminGate`: receives `{page, children}`. `children` is the original admin
  element; render it only after live authentication and private data retrieval.
- `MaintenanceTracker`: replaces local browser-only repair tracking.
- `routeParts(hash)`: optional public pathname-aware parser returning the
  existing route array, for example `['p', productId, variantKey]`.
- `routeHref(route)`: optional crawlable URL generator for existing route
  strings. `parseHashRoute(hash)` is the pure legacy parser for fallback use.
- `navigateLive(route)`: optional history/navigation implementation. Dispatch a
  `popstate` event after `pushState`, since the existing App subscribes to it.

`setCategories(content.categories)` accepts
`[{id, name:{ar,en}, pictureId}]`, updates both original category arrays in place
and registers translated category keys. Call it before publishing the content
snapshot into React state, so navigation, storefront filters and admin product
choices share one list.

The original context contains:

```js
{
  lang, setLang, t, content, updateContent,
  orders, updateOrders,
  bag, addToBag, setQty, clearBag, bagOpen, setBagOpen, placeOrder,
  maint, updateMaint, placeMaint,
  resetDemo
}
```

Update methods receive updater functions and return/resolve a success boolean.
`placeOrder` and `placeMaint` return/resolve the saved record or `null`. Write
handlers await these results before success UI. A live adapter should catch and
present bounded network errors, preserve unsaved edits on conflicts, and return
`false`/`null` for rejected writes. The demo reset action belongs only to the
portable demo; a live adapter must hide it or safely reject it. Local demo
confirmation translations such as `done.demo` must be replaced for live mode.

## Checks completed during recovery

- All three vendor hashes match their original `recovery.json` values.
- All editable application modules parse after formatting.
- Concatenated recovered demo module passes `node --check`.
- `server/seed.json` was extracted from the pure original catalog expressions
  using an isolated Node VM, without evaluating the browser app. It contains
  23 products and 6 categories, no orders/users/repair requests, with ordering
  and indexing disabled for owner setup.

These checks establish source extraction integrity and syntax. They do not
establish live API behavior, visual/browser parity or production Cloudflare
CPU/message delivery; those require separate integration verification.
