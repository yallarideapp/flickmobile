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

## 2026-10-27 — publish current storefront on GitHub Pages

User explicitly approved replacing the old public website with the updated
carousel version. Added `.github/workflows/pages.yml`: builds both outputs,
runs the device/helper and 12 backend tests, then publishes only `dist/demo`.
Pages uses GitHub Actions; the original root export remains preserved.
The public preview retains demo-only browser storage/admin/orders. No Cloudflare
Worker, D1, KV or real account/order delivery is deployed by this workflow.

Local build and all12 backend tests passed. A focused browser check served
`dist/demo` at `/flickmobile/`: four device slides, selection/tint/price/link
updates, no missing images or console errors. The public deployment must also
be checked after the GitHub Actions run finishes.

Publication verified: GitHub Actions run40453960189 completed build/tests and
Pages deployment successfully at commit `b48509d`. Initial clean installs failed
because the lock file omitted `@esbuild/android-arm@0.28.2`. Regenerated the lock
with a writable temporary npm cache, adding only that optional package entry;
no package versions changed. `npm ci --dry-run` then passed, and Linux CI passed
both workflows. Public browser verification observed four slides, tablet
selection with matching tint/price/link, working images, no console errors,
and Arabic mobile390 with no horizontal overflow. Public URL remains
https://yallarideapp.github.io/flickmobile/.

## 2026-10-27 — consistent hero background and calmer movement

User disliked the changing background colors. Replaced category-specific full
page tints with one warm Flick yellow (#fff36a) and a static soft highlight
behind the device stage. Removed the background color transition. Neighboring
devices have gentler tilt/bobbing and clearer opacity; the main arrival now
takes700ms with a smaller settle. Caption/counter transitions are shorter and
no longer blur. Removed permanent slide will-change hints. Existing swipe,
interruption handling, focus navigation and reduced-motion behavior remain.
Stylesheet cache key is v5. No runtime dependencies changed.

Both builds pass. Local browser checks covered all four category transitions
with the same computed background, rapid reversal and keyboard focus, matching
prices/links, Arabic390 and English320 without horizontal overflow, and no
console errors. GitHub Actions run40455381080 passed build/tests and deployment at commit
`8235467`. Public browser checks confirmed the v5 stylesheet and the same
background across phones/tablets/headphones/watches, matching captions/prices,
working artwork and no console errors.

## 2026-10-27 — exact logo yellow and separated carousel devices

User clarified that the hero background must match the Flick logo exactly and
that devices conflict with each other. Sampled the embedded WebP logo: dominant
opaque yellow is RGB(252,244,1), #fcf401. Hero background and arrow hover text
now use that exact color; removed the pale spotlight entirely.

The previous layout overlapped even at rest: a82%-wide active box shared space
with the miniatures. Changed the base box to56% with22% side inset, and placed
the side previews farther out at±74%, scale.24 and4-degree tilt. Changes use a
shared360ms fade: devices fade out in their existing slots, reposition only at
zero opacity, then fade/grow from96% into the new slots. They no longer travel
through one another. Drag follow is capped at6px; hover no longer expands or
rotates hit targets. Transient slide pointer blocking avoids wrong links during
the fade; arrows, category chips and keyboard navigation remain available.
Stylesheet cache key is v6. Original export/vendor and backend stay unchanged.

Both outputs build. Focused CUA checks sampled8 rapid next/previous changes at
390px using visible artwork bounding boxes, with no intersections. English320
also had separate boxes (~16px horizontal gaps) and no page overflow. Background
computed as RGB(252,244,1); repeated keyboard navigation kept focus on the
active device and its matching product link. Independent geometry review at
320,390,641,900 and1280 found positive clearance including hover/float/max drag,
and verified the fade phases remain safe on rapid reversals/direct jumps.
GitHub Actions run40528337807 passed build/tests/deployment at707d8ae.
Added content-hashed JS filenames (app.<12-char-sha256>.js) so a new HTML/CSS
version cannot reuse cached older carousel poses. The rendered-route test now
extracts and fetches that actual module URL. GitHub Actions run40529037321 passed build/tests
and deployment atae74f98. Final public checks confirmed the hashed module,
CSSv6, exact RGB(252,244,1), and no visible artwork intersections through rapid
next/next/previous input at408px. No console errors. Refreshed the user's
previously stale open website tab and verified the same current module/colour.
Published URL remains https://yallarideapp.github.io/flickmobile/.

## 2026-10-27 — continuous diagonal device exchange

User requested the Pinterest video motion again rather than the fade-only
solution. Replaced the central fade/swap with a shared720ms eased diagonal
exchange: next preview grows into the center while the featured device shrinks
into the opposite corner. Both stay fully opaque. Outer previews exit/re-enter
at their own edges. Background stays the exact logo yellow #fcf401; CSSv7.

Navigation coalesces a requested target and takes adjacent steps on the shortest
remaining path. Rapid reversals no longer interrupt devices into crossing
trajectories. Idle float, hover and drag transforms reset during an exchange;
keyboard focus follows queued steps. Three-category layouts wrap the outer
preview only at zero opacity, while two-category layouts switch immediately.
Reduced-motion users also switch immediately. No new dependencies.

Both outputs build; device helper checks and12 local backend tests pass. CUA
checks observed continuous transform changes with main-pair opacity1 and idle
animations disabled during movement. Rapid next/previous input at390 and
keyboard input in Arabic320 had no visible artwork-box intersections or page
overflow; focus followed the selected device and there were no console errors.
Independent geometry checks over10,001 progress samples at320,390,641,900,
and1280 found no full-wrapper intersections for4- or3-category motion; minimum
gap was12.92px at320. The Pinterest player currently renders black in Chrome
and requires login in the in-app browser, so exact frame/timing equivalence
could not be verified. A directly attached video is needed for that comparison.

## 2026-10-27 — slightly larger mobile banner devices

User requested slightly larger devices in the phone banner. At viewport widths
up to640px, increased the slide width from56% to62% (+10.7%), capping the extra
width at28px to preserve edge clearance on wider phones. Insets keep the slides
centered. Shared poses, timing, exact logo yellow and desktop sizing stay the
same. Stylesheet cache key isv8.

Both outputs build. CUA checks at390 and320 verified the new size, separate
device boxes during rapid next/previous movement, no horizontal page overflow,
and no console errors. English and Arabic layouts were checked. At641px the
original56% slide width still applies.

## 2026-10-28 — smoother hero motion and touch handling

Refined the existing diagonal exchange to a shared 660ms ease-in/out curve.
All device artwork and shadows now keep the same 6.4s idle phase through role
changes, with a restrained 3px vertical float. Removed transition-time resets,
role-specific idle delays and device hover offsets that caused visible snaps.
Added a short group entrance and synchronized product names, prices and counter
on one caption beat. Exact logo yellow #fcf401, larger mobile devices, poses,
bilingual links and adjacent-step navigation remain in place. CSS cache key v9.

Swipe feedback moves the entire stage by at most 3px, preserving device and
edge clearance. Swipes during an exchange queue the next selection without
drag follow. Secondary pointers are ignored, and lost capture clears the drag.
Changing reduced-motion preference finishes active exchanges and resolves the
queued selection immediately; listeners and animations clean up on unmount.

Both outputs build; device helper checks and all 12 backend tests pass. A
temporary actual-source Node harness passed 10 interaction checks covering
queued input, busy swipes, scrolling, cancellation, multi-pointer handling,
lost capture, focus, reduced motion, two-category fallback and cleanup. It
simulates hooks and WAAPI lifecycle, so it does not validate rendered timing.
Independent geometry checks across 320–1280px and 10,001 progress samples found
at least 14.65px between full artwork wrappers, including the idle drift.
Browser permission gates declined both the public site and local preview;
this revision has no new browser visual verification or screenshot.

## 2026-10-28 — compact desktop hero and complete category browser

User requested the desktop hero sit higher so the device category buttons are
visible, all categories under “What are you looking for?”, and removal of
“Featured picks”. Above 900px, reduced hero padding from 36px to 16px and made
the stage height follow the viewport, clamped to 280–420px with space reserved
for the header and controls. Tightened navigation/category margins to 12px.
Mobile hero sizing and the animation behavior remain as before. CSS key v10.

The category browser now renders every configured category, including Speakers
and Accessories. Empty categories retain their shop link with a generic icon.
The grid uses six columns on desktop, three on tablet and two on phones.
Removed the Featured picks component and its homepage placement. Hero devices
and homepage offers retain their curated category subset; AGENTS.md clarifies
that this is separate from the full category browser.

Both builds and all 12 backend tests pass. Actual-component checks verified
English/Arabic labels and routes for all six categories, empty-category links,
and the remaining homepage section order without Featured picks. Both edited
stylesheets parse without warnings. The prior browser access denials still
prevent visual verification; desktop fit has not been checked in a browser.

## 2026-10-28 — raise the Arabic desktop hero further

User clarified that the remaining issue is the Arabic hero still sitting too
low. Added an RTL desktop override above 900px: padding is 8px top / 12px
bottom, and stage height follows the viewport with a 260–380px clamp and a
400px viewport reserve. This raises the artwork and controls further in the
Arabic layout. The English and mobile rules remain unchanged. CSS key v11.

Both builds pass and contain the updated stylesheet; CSS parses without
warnings. Calculated stage/padding reductions put the controls 48–68px higher
at typical 650–1080px desktop viewport heights. Arabic component checks also
confirm six translated category links and no Featured picks section. These
are source/build checks; browser visual verification remains unavailable.

## 2026-10-29 — privacy policy, terms and trademark notice

Added bilingual Privacy Policy and Terms & Conditions pages (`#/privacy`,
`#/terms`; live `/ar|en/privacy|terms` rendered by the server and listed in the
sitemap). Text describes what the site actually collects and follows Jordan's
Personal Data Protection Law No. 24 of 2023. The footer shows both links and
"Independent store, not affiliated with Apple, Samsung, Huawei or any other
manufacturer. Names and trademarks belong to their owners." Checkout and the
repair form require a consent checkbox, enforced on the server too. Tests and
both builds pass; pages checked in the browser at 320/390/1440 with no overflow.
The shop owner should review the texts; they are not legal advice.

## 2026-10-29 — campaign at the end of home, admin tools from the Trio panel

The «ألف طابة وألف هدية» campaign now sits under every other home section.
Added to the admin panel, following the Trio panel: a Categories tab (rename in
Arabic/English, reorder, category picture, add, delete empty), a Website texts
tab (pick a page area or search, edit Arabic/English, keep {placeholders}, reset
to original), an Excel export for orders and repairs (UTF-8 CSV, phones kept as
text, formula-safe), quick In stock / On home toggles in the device list, and a
15-second refresh of orders and repairs in the live admin. Server validates
texts. Tests and both builds pass; checked in the browser at 1440 and 390 px.

## 2026-10-29 — banner devices in the admin panel

New admin tab «أجهزة الواجهة»: for each banner slide (one per home category)
choose Automatic (featured device), a specific device from the list, or upload
a picture with an Arabic/English caption and an optional device it opens.
Saved as `heroSlots`, validated on the server (pictures must be uploaded photo
links or site assets). Tests and builds pass; checked at 1440 and 390 px.

## 2026-10-29 — banner controlled only from «أجهزة الواجهة»

Removed the "On home" toggle and "Featured" badge from the device list and the
featured switch from the device editor. Automatic banner slides now use the
first device in each category (same devices as before, since they matched the
featured ones). Tests and builds pass; checked in the browser.

## 2026-10-29 — stock availability only inside the device editor

User requested removing the outer «متوفر» option and keeping it inside only.
Removed the quick stock switch from the admin device-list cards and deleted
its unused component/bulk mutation handler. Availability remains per option
inside Edit → Options and prices. Updated AGENTS.md to preserve this preference.

Both builds and all 14 backend tests pass. Actual-component checks in Arabic
and English verified that list cards retain only the visibility switch, stock
checkboxes remain inside the editor, and saving one changed option preserves
every other option's availability. The checks simulate hooks rather than
browser rendering. Browser access remains unavailable after the earlier origin
denials; no visual verification is claimed. Logged in Documents/TESTING.md.
