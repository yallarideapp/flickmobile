// The live adapter is evaluated before this file. Selecting the provider once
// keeps live API data separate from the portable demo's local storage.
const FlickProvider = window.FlickApp.LiveProvider ?? np;
(0, N.createRoot)(document.getElementById("root")).render(
  (0, k.jsx)(w.StrictMode, {
    children: (0, k.jsx)(FlickProvider, { children: (0, k.jsx)(o$, {}) }),
  }),
);
