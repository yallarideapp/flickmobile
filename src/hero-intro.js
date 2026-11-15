// Banner motion inspired by the Hydrogen+ site, in FLiCK's own theme.
//   - Splash end: the shell shows #flick-splash on the first home visit of a session; the
//     banner ends it once its intro start state is in place (or the shell's safety timer does).
//   - Charging intro (only after the splash): the three visible devices drop into place one by
//     one; each landing nudges the stage, lands part of the heading and charges the battery in
//     the status row (34% → 67% → 100%), then a bolt pops and the rest of the banner fades in.
//   - Status row: a phone status bar under the heading — battery, 5G bars, a signal wave and a
//     speed readout. Scrolling is "downloading": the speed climbs while you scroll and settles
//     back a few seconds after you stop. Paused while the banner is off screen.
// Only transforms and opacity move. Reduced motion: no splash, no intro, nothing animates.

const flickReducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

window.flickSplashEnd = function flickSplashEnd() {
  const root = document.documentElement;
  const splash = document.getElementById("flick-splash");
  if (!root.classList.contains("flick-splashing") || window.flickSplashEnding)
    return;
  window.flickSplashEnding = true;
  const shown = Date.now() - (window.flickSplashStart || 0);
  setTimeout(
    () => {
      splash?.classList.add("flick-splash-out");
      // The banner starts moving while the splash fades, so the two overlap a little.
      setTimeout(() => dispatchEvent(new Event("flick-splash-done")), 180);
      setTimeout(() => {
        splash?.remove();
        root.classList.remove("flick-splashing");
      }, 520);
    },
    Math.max(0, 1800 - shown),
  );
};

// Heading line → separate word spans, so each can land on its own.
function flickHeroWords(text) {
  const h = w.createElement;
  return String(text)
    .split(/(\s+)/)
    .map((part, index) =>
      /^\s+$/.test(part) || !part
        ? part
        : h("span", { key: index, className: "flick-hero-word" }, part),
    );
}

const FLICK_INTRO_IMPACTS = [260, 620, 980];

function useFlickHeroIntro(heroRef) {
  w.useLayoutEffect(() => {
    const hero = heroRef.current;
    const root = document.documentElement;
    if (!hero) return;
    if (
      !root.classList.contains("flick-splashing") ||
      flickReducedMotion() ||
      typeof hero.animate !== "function"
    ) {
      window.flickSplashEnd?.();
      return;
    }

    const animations = [];
    const timers = [];
    const add = (element, keyframes, options) => {
      if (!element) return;
      const animation = element.animate(keyframes, { fill: "both", ...options });
      animation.pause();
      animations.push(animation);
    };
    const [i1, i2, i3] = FLICK_INTRO_IMPACTS;
    const end = i3 + 260;

    // Devices: the visible three, sides first, the active one last.
    const slides = ["previous", "next", "active"].map((position) =>
      hero.querySelector(`.flick-hero-slide[data-position="${position}"]`),
    );
    slides.forEach((slide, index) => {
      const land = FLICK_INTRO_IMPACTS[index];
      add(
        slide?.querySelector(".flick-hero-image"),
        [
          // Falls (ease-in) to the landing at 78%, then settles (ease-out).
          { opacity: 0, transform: "translateY(-115%) rotate(-7deg) scale(.92)", easing: "cubic-bezier(.55,0,.9,.45)" },
          { opacity: 1, transform: "translateY(5%) rotate(1deg) scale(1.02)", offset: 0.78, easing: "cubic-bezier(.2,.8,.3,1)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 380, delay: land - 300 },
      );
      add(
        slide?.querySelector(".flick-hero-ground"),
        [
          { opacity: 0, transform: "scaleX(.3)" },
          { opacity: 0.9, transform: "scaleX(1.15)", offset: 0.8 },
          { opacity: 0.65, transform: "none" },
        ],
        { duration: 380, delay: land - 300 },
      );
    });

    // Each landing nudges the stage a little.
    const showcase = hero.querySelector(".flick-hero-showcase");
    FLICK_INTRO_IMPACTS.forEach((land, index) =>
      add(
        showcase,
        [
          { transform: "none" },
          { transform: `translate(${index % 2 ? 3 : -3}px, 3px)` },
          { transform: `translate(${index % 2 ? -2 : 2}px, -1px)` },
          { transform: "none" },
        ],
        { duration: 200, delay: land, fill: "none", composite: "add" },
      ),
    );

    // Heading: first word, rest of line one, then line two — one group per landing.
    const lines = [...hero.querySelectorAll("h1 > span")].map((line) => [
      ...line.querySelectorAll(".flick-hero-word"),
    ]);
    const groups = [
      lines[0]?.slice(0, 1) ?? [],
      lines[0]?.slice(1) ?? [],
      lines[1] ?? [],
    ];
    groups.forEach((words, index) =>
      words.forEach((word, n) =>
        add(
          word,
          [
            { opacity: 0, transform: "translateY(-.45em) scale(1.35)", filter: "blur(6px)" },
            { opacity: 1, transform: "none", filter: "blur(0)" },
          ],
          {
            duration: 300,
            delay: FLICK_INTRO_IMPACTS[index] - 120 + n * 60,
            easing: "cubic-bezier(.2,.9,.3,1.15)",
          },
        ),
      ),
    );

    // Battery charges with the landings; the bolt pops when it is full.
    add(
      hero.querySelector(".flick-status-cell > i"),
      // Each step charges quickly right at its landing and holds until the next one.
      [
        { transform: "scaleX(0)", offset: 0 },
        { transform: "scaleX(0)", offset: (i1 - 200) / end, easing: "cubic-bezier(.3,.7,.3,1)" },
        { transform: "scaleX(.34)", offset: (i1 + 20) / end },
        { transform: "scaleX(.34)", offset: (i2 - 200) / end, easing: "cubic-bezier(.3,.7,.3,1)" },
        { transform: "scaleX(.67)", offset: (i2 + 20) / end },
        { transform: "scaleX(.67)", offset: (i3 - 200) / end, easing: "cubic-bezier(.3,.7,.3,1)" },
        { transform: "scaleX(1)", offset: (i3 + 20) / end },
        { transform: "scaleX(1)", offset: 1 },
      ],
      { duration: end },
    );
    add(
      hero.querySelector(".flick-status-bolt"),
      [
        { opacity: 0, transform: "scale(0) rotate(-20deg)" },
        { opacity: 1, transform: "scale(1.4) rotate(6deg)", offset: 0.6 },
        { opacity: 1, transform: "none" },
      ],
      { duration: 360, delay: i3 + 80, easing: "cubic-bezier(.2,.9,.3,1.2)" },
    );

    // The rest of the banner settles in once the bar is full.
    [
      ".flick-hero-copy > .flick-eyebrow",
      ".flick-status-signal",
      ".flick-status-wave",
      ".flick-status-speed",
      ".flick-hero-actions",
      ".flick-hero-product",
      ".flick-hero-navigation",
      ".flick-hero-categories",
    ].forEach((selector, index) =>
      add(
        hero.querySelector(selector),
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: 420,
          delay: i3 + 120 + index * 55,
          easing: "cubic-bezier(.22,1,.36,1)",
        },
      ),
    );

    // Percent readout counts up with each landing.
    const percent = hero.querySelector(".flick-status-percent");
    let frame = 0;
    const count = (from, to, at) =>
      timers.push(
        setTimeout(() => {
          const start = performance.now();
          const tick = (now) => {
            const k = Math.min(1, Math.max(0, (now - start) / 220));
            if (percent) percent.textContent = `${Math.round(from + (to - from) * k)}%`;
            frame = k < 1 ? requestAnimationFrame(tick) : 0;
          };
          frame = requestAnimationFrame(tick);
        }, at - 200),
      );
    if (percent) percent.textContent = "0%";

    const play = () => {
      animations.forEach((animation) => animation.play());
      count(0, 34, i1);
      count(34, 67, i2);
      count(67, 100, i3);
      // Hand the elements back to their normal styles when the intro is over.
      timers.push(
        setTimeout(() => {
          animations.forEach((animation) => animation.cancel());
          if (percent) percent.textContent = "100%";
        }, end + 900),
      );
    };
    addEventListener("flick-splash-done", play, { once: true });
    window.flickSplashEnd?.();
    return () => {
      removeEventListener("flick-splash-done", play);
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      if (percent) percent.textContent = "100%";
    };
  }, []);
}

// Speed readout and wave follow the scroll speed, like a download meter.
const FLICK_SIGNAL_REST = 120;
const FLICK_SIGNAL_MAX = 980;

function useFlickSignal(heroRef) {
  w.useEffect(() => {
    const hero = heroRef.current;
    const readout = hero?.querySelector(".flick-status-speed");
    const wave = hero?.querySelector(".flick-status-wave path");
    if (!hero || !readout || !wave || flickReducedMotion()) return;
    const flow =
      typeof wave.animate === "function"
        ? wave.animate(
            [{ transform: "translateX(0)" }, { transform: "translateX(-40px)" }],
            { duration: 1400, iterations: Infinity },
          )
        : null;
    let speed = FLICK_SIGNAL_REST;
    let boost = FLICK_SIGNAL_REST;
    let lastY = scrollY;
    let lastTime = performance.now();
    let lastScroll = 0;
    let shown = "";
    let frame = 0;
    let visible = true;

    const onScroll = () => {
      const now = performance.now();
      const velocity = Math.abs(scrollY - lastY) / Math.max(16, now - lastTime);
      lastY = scrollY;
      lastTime = now;
      lastScroll = now;
      boost = Math.min(
        FLICK_SIGNAL_MAX,
        Math.max(boost, FLICK_SIGNAL_REST + velocity * 420),
      );
      if (visible && !frame) frame = requestAnimationFrame(tick);
    };
    const tick = (now) => {
      frame = 0;
      // After a short pause the meter drifts back to resting speed.
      if (now - lastScroll > 900)
        boost += (FLICK_SIGNAL_REST - boost) * 0.035;
      speed += (boost - speed) * 0.12;
      const text = `${Math.round(speed / 10) * 10} Mbps`;
      if (text !== shown) readout.textContent = shown = text;
      if (flow) flow.playbackRate = Math.max(1, speed / FLICK_SIGNAL_REST);
      if (Math.abs(speed - FLICK_SIGNAL_REST) > 1 || boost > FLICK_SIGNAL_REST + 1)
        if (visible) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!flow) return;
      if (visible) {
        flow.play();
        if (!frame) frame = requestAnimationFrame(tick);
      } else {
        flow.pause();
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(hero);
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      observer.disconnect();
      cancelAnimationFrame(frame);
      flow?.cancel();
    };
  }, []);
}

// Phone status bar under the heading. Decorative only: hidden from screen readers.
function FlickHeroStatus() {
  const h = w.createElement;
  return h(
    "div",
    { className: "flick-status", dir: "ltr", "aria-hidden": true },
    h(
      "span",
      { className: "flick-status-battery" },
      h("span", { className: "flick-status-cell" }, h("i")),
      h("b", { className: "flick-status-percent num" }, "100%"),
      h(
        "svg",
        { className: "flick-status-bolt", viewBox: "0 0 24 24", focusable: "false" },
        h("path", { d: "M13.5 2 4 13.6h6.6L9.4 22 20 9.6h-6.9L13.5 2Z" }),
      ),
    ),
    h(
      "span",
      { className: "flick-status-signal" },
      h(
        "span",
        { className: "flick-status-bars" },
        h("i"),
        h("i"),
        h("i"),
        h("i"),
      ),
      h("b", null, "5G"),
    ),
    h(
      "svg",
      { className: "flick-status-wave", viewBox: "0 0 80 16", focusable: "false" },
      h("path", {
        d: "M-40 8 q5 -7 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0",
      }),
    ),
    h("b", { className: "flick-status-speed num" }, `${FLICK_SIGNAL_REST} Mbps`),
  );
}

// Page motion (storefront layout):
//   - On every page change after the first, the page content rises in gently.
//   - Below the first screen, lists and grids of 3+ items appear item by item as they scroll
//     into view; other sections appear as a whole. Uses data attributes (React never sets
//     them), and anything React re-renders simply stays visible.
function useFlickPageMotion(route) {
  const key = Array.isArray(route) ? route.join("/") : String(route ?? "");
  const first = w.useRef(true);
  w.useEffect(() => {
    const main = document.getElementById("main");
    if (!main || flickReducedMotion()) return;
    if (!first.current && typeof main.animate === "function")
      main.animate(
        [
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 450, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    first.current = false;
    if (!("IntersectionObserver" in window)) return;

    const targets = [];
    const fold = innerHeight * 0.92;
    main.querySelectorAll("section").forEach((section) => {
      if (section.closest(".flick-hero") || section.querySelector("section")) return;
      if (section.getBoundingClientRect().top < fold) return;
      const list = [...section.querySelectorAll("ul, ol, .grid")].find(
        (el) => el.children.length >= 3,
      );
      if (list) {
        const heading = section.querySelector("h2");
        if (heading && !list.contains(heading)) targets.push([heading, 0]);
        [...list.children].slice(0, 12).forEach((item, index) => targets.push([item, index]));
      } else targets.push([section, 0]);
    });
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.reveal = "in";
          observer.unobserve(entry.target);
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    targets.forEach(([element, index]) => {
      element.style.setProperty("--flick-reveal-i", String(Math.min(index, 8)));
      element.dataset.reveal = "wait";
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      targets.forEach(([element]) => {
        if (element.isConnected) element.dataset.reveal = "in";
      });
    };
  }, [key]);
}
