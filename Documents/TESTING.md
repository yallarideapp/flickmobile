# Flick verification log

## 2026-10-29 — availability edited only inside the device form

- Removed the quick availability switch from device-list cards and its bulk
  variant mutation handler. The separate shown/hidden switch remains.
- Actual-component checks in Arabic and English confirmed the list contains
  only the visibility switch, and each option retains its availability checkbox
  inside the editor. Toggling and saving one option preserved the availability
  of every other option. These checks simulate React hooks; they do not render
  a browser page.
- `npm run build` passed for demo and live outputs. `npm test` passed the device
  helper suite and all 14 backend tests. `git diff --check` passed.
- Browser checks at 390/900/1280px could not be completed because browser-origin
  access was previously declined. No browser visual verification is claimed.
