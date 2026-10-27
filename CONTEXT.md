# Flick working context

## 2026-10-26 — local Cloudflare backend preparation

User selected local backend implementation/testing first. Source destination supplied: `yallarideapp/flickmobile`. No permission to deploy was inferred; no push or Cloudflare resource mutation performed in this phase.

Upstream inspected at `a69224d1c268c189705b400a66028bc8e5d7f8c6`, only main branch. The initial commit and every historical tree contain an exported HTML bundle, not original JSX/package/source maps. Recovered readable emitted application source under `src/`, preserving runtime/vendor segments and existing design, demo index and authored device assets. `src/RECOVERY.md` records provenance.

Added Worker/static assets, D1 content/inventory/orders/repairs/admin/sessions/reset/rate state, KV image storage, shared validation and integer-fils pricing, optimistic content/record revisions, atomic numbering/stock/idempotency, soft archive and pagination, authenticated admin setup/login/logout/password/reset, safe uploads, bilingual server-rendered routes and live provider. No shopper accounts or Telegram features were present/requested, so none added. Runtime credentials remain owner-entered; local preview uses obvious dummy values and ephemeral D1/KV.

Seed is the existing 23-product conceptual catalog plus six categories, no customer/order/repair seed. Both ordering and indexing off. Existing curated homepage excludes speakers/accessories; no WhatsApp ordering was reintroduced. Product image choices, specifications, used-device stock/battery semantics and existing campaign/branch flows preserved.

Independent review found and fixes addressed: template marker mismatch, decoded path interpolation, delete UI lacking server persistence (now archive), inaccessible pages beyond500 (load older), and revoked-session writes (D1 mutation predicate). Image structural validation strengthened. Twelve backend integration tests plus existing device helper tests passed after these fixes; build passed. Focused desktop browser check observed login, order placement with delivery fee, saved order in admin and status update; focused CUA checks also observed Arabic repair creation and limited tracking, shared category rename/new empty category propagation, and independent demo storefront/admin rendering. Arabic RTL and English LTR at widths320,390,1440 had matching document/scroll widths; mobile admin at390 also fit. These were focused browser checks, not an automated browser suite or a real-phone test.

Production bindings are intentional all-zero placeholders. `Cloudflare-guide.md` covers local preview, future owner accounts/repo selection, bindings/secrets, mail, build/migrations/deploy, indexing/order controls, rollback and usage. No production CPU, real email arrival, GitHub CI or real-device claims.

## 2026-10-27 — final image/browser handover

Actual image upload exposed live CSP incompatibilities. Fixed local data-URL decoding without fetch and allowed blob images for the existing canvas editor. A local90-byte PNG fixture was converted by the browser, saved through authenticated API/KV, and persisted after admin reload at the same /api/photo/ URL. Reading that response returned200, image/webp,526bytes with actual RIFF/WEBP signature. Restored the preview product photo after the test. Added an img-src blob regression assertion; final device helper+12 backend tests passed with no failures/skips. Wrangler deploy --dry-run compiled locally without any deployment. No source push or remote resource mutations.

## 2026-10-27 — reference device carousel

User invoked Motion and supplied https://pin.it/4gerX8ZpG. Opened the signed-in
Pinterest reference in native Chrome at the user's request. Implemented its
large selected product, diagonal neighboring miniatures, grounding shadow and
changing backdrop tint in `src/hero-showcase.js` and the scoped additions in
`assets/device-motion.css`. The original exported index and vendor modules stay
preserved. Uses existing device artwork and embedded React, with CSS transform
transitions, no added runtime dependency. Selection is manual through arrows,
category chips, neighboring devices and RTL-aware keyboard keys. Keyboard
selection follows the active device with focus; prices, available variants and
links use the same selected record. Reduced-motion rules remove transitions
and floating, and the existing visibility observer pauses offscreen floating.

Built both demo/live outputs and passed device helper plus12 backend tests.
Focused CUA browser checks covered Arabic/English at320,390 and desktop1440,
no horizontal page overflow, repeated keyboard navigation, neighboring-device
selection, matching product detail links/prices and offscreen pause. Reduced
motion was checked by static selector/cascade review, not OS emulation. These
are focused checks, not a browser performance audit or real-phone tests.

The existing8788 preview was left running without resetting its data. Motion
review is an independent disposable preview at http://127.0.0.1:8790/ar/.
`node scripts/local-preview.mjs --port 8790` now accepts an optional port;
default remains8788. Current phase remains local only; no push or deployment.

## 2026-10-27 — hero banner motion refinement

User asked to improve the banner motion. Slide poses moved from CSS into
`src/hero-showcase.js` (inline styles) and are choreographed with the Web
Animations API: arcing paths, a small overshoot-and-settle on arrival, staggered
entry, and the arriving device kept on top. Fixed a visible glitch where a
re-entering miniature crossed the main device on direction reversal; devices
now leave and enter by their own side, and interrupted animations continue from
their live position. Added synced float/shadow, idle bob on miniatures, caption
and counter transitions, and horizontal swipe with drag-follow (vertical drags
still scroll; a swipe suppresses the link click). Reduced motion skips the
choreography in JS and the CSS animations; checked by code review, not OS
emulation. `device-motion.css` cache key bumped to v=4.

Build plus device helper and 12 backend tests passed. Focused browser checks at
1280 (en) and 375 (ar RTL): frame-seek traces, interruption handoffs (0px jump
for visible devices), swipe/tap/vertical-drag via synthetic pointer events, no
horizontal overflow. Not checked on a real phone. Review preview on port 8791;
the 8790 preview still serves the previous build. No push or deployment.
