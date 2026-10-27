# Flick project workflow

## Cloudflare/live invariants

- The user authorized uploading the source and publishing the updated static
  storefront on GitHub Pages. Publish `dist/demo` through the Pages workflow.
  Cloudflare backend deployment/resources remain unapproved; keep that backend
  in local preparation/testing until the user authorizes the production phase.
- Read `CONTEXT.md`, `Cloudflare-guide.md`, and `src/RECOVERY.md` before backend work.
- The original exported `index.html` is a preserved portable demo. Edit recovered
  application source in `src/`, pure shared rules in `shared/`, server in `server/`.
  Run the build; do not hand-edit `dist/` or vendor runtime segments.
- Live startup must never fall back to browser/demo inventory or customer data.
  D1 owns stock, content, orders, repairs, authentication and rate limits; KV owns
  uploaded media only. Public responses must omit hidden products/private counts.
- Keep integer-fils server pricing, atomic stock/idempotency and optimistic
  revisions. Archiving/cancelling an order does not restore its consumed stock.
- Runtime secrets are owner-entered; never commit or expose them. AUTH_PEPPER
  must remain stable after admin setup. Keep ordering/indexing disabled in seed.
- Tests use disposable local D1/KV and fake providers. `npm run preview:local`
  refuses real secret files and loses data on exit. Never use production to test.
- Keep bilingual routes, unknown versus zero battery/stock semantics, existing
  curated homepage exclusions, and the removal of WhatsApp ordering.
- Add migrations for schema changes. A Worker rollback does not undo a migration.

The user expects each requested Flick update to be saved in both places:

- The local Flick project folder on the user's Mac.
- The GitHub repository `yallarideapp/flickmobile`.

For future updates:

- Prefer working from the local Mac project so its files are saved directly.
- Preserve existing local changes. Do not reset or overwrite unrelated work.
- Commit the source files, assets, and tests needed for the requested update,
  then push the completed changes to GitHub.
- Stage only files belonging to the requested update; do not publish unrelated
  local work.
- The one-time Mac setup is `scripts/Setup-Flick-Mac.command`. Once installed,
  its background updater pulls GitHub changes into a clean Mac `main` checkout.
  Local coding changes still need to be committed and pushed when complete.
- A completed local update can be synchronized with the installed
  `FlickSync/flick-sync.sh` helper using `--directory` and `--sync`; it preserves
  local edits and refuses non-fast-forward operations.
- If the Mac setup script changes, rebuild `downloads/Flick-Mac-Sync.zip` and
  verify its executable matches `scripts/Setup-Flick-Mac.command`.
- Verify the local project and GitHub contain the update before reporting that
  both copies are saved.
- A cloud workspace is a separate copy, not the user's Mac folder. If Mac access
  is unavailable, finish the authorized GitHub work and report Mac synchronization
  as pending. A ZIP download is not automatic synchronization of the Mac folder.
