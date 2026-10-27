const flickHeroTints = {
  phones: "#fff84a",
  tablets: "#e9eef5",
  headphones: "#ffe0a3",
  watches: "#e3edbd",
};

// Resting poses in percentages of the slide box. "before" and "after" sit just
// past the miniatures so devices leave and enter on their own side.
const flickHeroPoses = {
  before: { x: -65, y: -45, r: -28, s: 0.16, o: 0 },
  previous: { x: -42, y: -28, r: -17, s: 0.32, o: 0.68 },
  active: { x: 0, y: 0, r: 0, s: 1, o: 1 },
  next: { x: 42, y: 28, r: 15, s: 0.32, o: 0.68 },
  after: { x: 65, y: 45, r: 28, s: 0.16, o: 0 },
};

function flickHeroPose(position, direction) {
  if (position !== "hidden") return flickHeroPoses[position];
  return flickHeroPoses[direction === "backward" ? "after" : "before"];
}

function flickHeroTransform(pose) {
  return `translate3d(${pose.x}%, ${pose.y}%, 0) rotate(${pose.r}deg) scale(${pose.s})`;
}

function flickHeroFrame(pose, offset) {
  return {
    offset,
    transform: flickHeroTransform(pose),
    opacity: pose.o,
    visibility: "visible",
  };
}

// Blends each property separately so paths bow instead of running straight.
function flickBlendPose(from, to, amount) {
  const mix = (key) => from[key] + (to[key] - from[key]) * (amount[key] ?? amount.x);
  return { x: mix("x"), y: mix("y"), r: mix("r"), s: mix("s"), o: mix("o") };
}

// Horizontal side (-1 or 1) a computed transform matrix is translated toward.
function flickHeroSide(transform) {
  const values = /matrix\(([^)]+)\)/.exec(transform)?.[1].split(",");
  return values ? Math.sign(Number(values[4])) : 0;
}

// Choreography for one slide changing position. `current` is the live style of
// an interrupted animation, so rapid input continues from where the device is.
function flickHeroMotion(from, to, direction, current) {
  if (to === "hidden" && from === "hidden") return null;
  const forward = direction !== "backward";
  const entry = flickHeroPoses[forward ? "after" : "before"];
  const exit = flickHeroPoses[forward ? "before" : "after"];
  const start = from === "hidden" ? entry : flickHeroPoses[from];
  const target = flickHeroPose(to, direction);
  // A device still fading out either turns back (it was leaving by the side it
  // now enters from) or finishes leaving before re-entering from the far side.
  const fading = from === "hidden" && current && Number(current.opacity) > 0.02;
  const returning =
    fading && flickHeroSide(current.transform) === Math.sign(entry.x);
  const live = current && (from !== "hidden" || returning);
  const first =
    live || fading
      ? { offset: 0, ...current, visibility: "visible" }
      : flickHeroFrame(start, 0);
  let middle =
    fading && !returning
      ? [flickHeroFrame(exit, 0.28), flickHeroFrame(entry, 0.28)]
      : [];
  let timing;
  if (to === "hidden") {
    if (!live)
      middle = [
        flickHeroFrame({ ...flickBlendPose(start, exit, { x: 0.55 }), o: 0 }, 0.55),
      ];
    timing = { duration: 620, easing: "cubic-bezier(.45, 0, .7, .45)" };
  } else if (to === "active") {
    // Arrive on an arc, swing slightly past level, then settle.
    if (!live)
      middle.push(
        flickHeroFrame(
          flickBlendPose(start, target, { x: 0.55, y: 0.8, r: 0.7, s: 0.72, o: 1 }),
          0.45,
        ),
      );
    middle.push(
      flickHeroFrame({ x: 0, y: 0, r: forward ? -2.2 : 2.2, s: 1.02, o: 1 }, 0.78),
    );
    timing = {
      duration: 980,
      delay: from === "hidden" ? 120 : 50,
      easing: "cubic-bezier(.22, .8, .26, 1)",
    };
  } else if (from === "active") {
    if (!live)
      middle = [
        flickHeroFrame(
          flickBlendPose(start, target, { x: 0.42, y: 0.62, r: 0.5, s: 0.6, o: 0.5 }),
          0.45,
        ),
      ];
    timing = { duration: 820, easing: "cubic-bezier(.4, 0, .2, 1)" };
  } else if (from === "hidden") {
    if (!live)
      middle.push(
        flickHeroFrame(flickBlendPose(start, target, { x: 0.85, o: 1 }), 0.6),
      );
    timing = { duration: 820, delay: 170, easing: "cubic-bezier(.2, .75, .25, 1)" };
  } else {
    // With three devices the miniatures swap ends: leave, then re-enter.
    middle = [flickHeroFrame(exit, 0.42), flickHeroFrame(entry, 0.42)];
    timing = { duration: 900, delay: 60, easing: "cubic-bezier(.35, 0, .25, 1)" };
  }
  // A delay would freeze an interrupted device in mid-air.
  if (live || fading) timing.delay = 0;
  let keyframes = [first, ...middle, flickHeroFrame(target, 1)];
  if (to === "active")
    keyframes = keyframes.map((frame) => ({ ...frame, zIndex: 4 }));
  return { keyframes, timing };
}

function flickHeroPosition(index, activeIndex, count) {
  const distance = (index - activeIndex + count) % count;
  if (distance === 0) return "active";
  if (distance === 1) return "next";
  if (distance === count - 1) return "previous";
  return "hidden";
}

function l4() {
  const { t, lang, content } = nm();
  const products = l2();
  const categories = ez.filter(
    (category) =>
      isFlickHomeCategory(category.id) &&
      products.some((product) => product.cat === category.id),
  );
  const items = categories.map((category) => {
    const choices = products.filter((product) => product.cat === category.id);
    const product = choices.find((product) => product.featured) ?? choices[0];
    const variant = product.variants
      .filter((variant) => flickDeviceFeatures.available(variant))
      .sort((a, b) => eO(a) - eO(b))[0];
    const route = `p/${product.id}${variant ? `/${variant.key}` : ""}`;
    return { category, product, variant, href: nk(route) };
  });
  const [selection, setSelection] = w.useState({
    id: "phones",
    direction: "forward",
  });
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.category.id === selection.id),
  );
  const active = items[activeIndex];
  const motion = useFlickDeviceMotion();
  const stageRef = w.useRef(null);
  const focusAfterNavigation = w.useRef(false);
  const slideAnimations = w.useRef(new Map());
  const lastPositions = w.useRef(null);
  const drag = w.useRef(null);
  const suppressClick = w.useRef(false);
  const h = w.createElement;
  const local = (ar, en) => (lang === "ar" ? ar : en);
  const positions = new Map(
    items.map((item, index) => [
      item.category.id,
      flickHeroPosition(index, activeIndex, items.length),
    ]),
  );

  w.useLayoutEffect(() => {
    const previous = lastPositions.current;
    lastPositions.current = positions;
    const stage = stageRef.current;
    if (!previous || !stage) return;
    const animate =
      typeof stage.animate === "function" &&
      !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    for (const slide of stage.querySelectorAll(".flick-hero-slide")) {
      const id = slide.dataset.slide;
      const from = previous.get(id);
      const to = positions.get(id);
      if (!from || from === to) continue;
      const running = slideAnimations.current.get(id);
      let current = null;
      if (running && running.playState !== "finished") {
        const style = getComputedStyle(slide);
        current = { transform: style.transform, opacity: style.opacity };
      }
      running?.cancel();
      slideAnimations.current.delete(id);
      const motion = animate && flickHeroMotion(from, to, selection.direction, current);
      if (!motion) continue;
      const animation = slide.animate(motion.keyframes, {
        ...motion.timing,
        fill: "backwards",
      });
      slideAnimations.current.set(id, animation);
      animation.onfinish = () => {
        if (slideAnimations.current.get(id) === animation)
          slideAnimations.current.delete(id);
      };
    }
  });

  w.useLayoutEffect(() => {
    if (!focusAfterNavigation.current) return;
    focusAfterNavigation.current = false;
    stageRef.current
      ?.querySelector('.flick-hero-slide[data-position="active"] a')
      ?.focus({ preventScroll: true });
  }, [active?.category.id]);

  function select(index, direction) {
    if (!items.length) return;
    const item = items[(index + items.length) % items.length];
    setSelection((previous) =>
      previous.id === item.category.id
        ? previous
        : { id: item.category.id, direction },
    );
  }

  function step(delta) {
    if (items.length < 2) return;
    setSelection((previous) => {
      const current = Math.max(
        0,
        items.findIndex((item) => item.category.id === previous.id),
      );
      return {
        id: items[(current + delta + items.length) % items.length].category.id,
        direction: delta > 0 ? "forward" : "backward",
      };
    });
  }

  function handleKeys(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || items.length < 2)
      return;
    let delta = 0;
    if (event.key === "ArrowDown") delta = 1;
    if (event.key === "ArrowUp") delta = -1;
    if (event.key === "ArrowRight") delta = lang === "ar" ? -1 : 1;
    if (event.key === "ArrowLeft") delta = lang === "ar" ? 1 : -1;
    if (delta) {
      event.preventDefault();
      focusAfterNavigation.current = true;
      step(delta);
    }
  }

  // Horizontal swipes follow the finger with resistance; vertical drags scroll.
  function handlePointerDown(event) {
    if (items.length < 2 || (event.pointerType === "mouse" && event.button !== 0))
      return;
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      dx: 0,
      time: event.timeStamp,
      active: false,
    };
  }

  function handlePointerMove(event) {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;
    const stage = event.currentTarget;
    if (!state.active) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      if (Math.abs(dx) < 8) return;
      state.active = true;
      stage.dataset.dragging = "true";
      try {
        stage.setPointerCapture(event.pointerId);
      } catch {
        // The pointer already ended; pointerup/cancel will still arrive.
      }
    }
    state.dx = dx;
    stage.style.setProperty(
      "--flick-hero-drag",
      (140 * Math.tanh(dx / 320)).toFixed(1),
    );
  }

  function endDrag(event, commit) {
    const state = drag.current;
    const stage = stageRef.current;
    if (!state || state.id !== event.pointerId) return;
    drag.current = null;
    if (!state.active || !stage) return;
    delete stage.dataset.dragging;
    stage.style.removeProperty("--flick-hero-drag");
    suppressClick.current = true;
    setTimeout(() => {
      suppressClick.current = false;
    }, 0);
    const distance = Math.abs(state.dx);
    const quick = event.timeStamp - state.time < 260;
    if (commit && (distance > 48 || (quick && distance > 20)))
      step(state.dx < 0 ? 1 : -1);
  }

  return h(
    "section",
    {
      className: "flick-hero",
      ref: motion.ref,
      "aria-labelledby": "flick-hero-title",
      "data-hero-tone": active?.category.id || "phones",
      style: {
        "--flick-hero-tint":
          flickHeroTints[active?.category.id] || flickHeroTints.phones,
      },
    },
    h(
      "div",
      { className: "flick-hero-inner flick-section" },
      h(
        "div",
        { className: "flick-hero-copy" },
        h("p", { className: "flick-eyebrow" }, t("hero.eyebrow")),
        h(
          "h1",
          { id: "flick-hero-title" },
          h("span", null, t("hero.l1")),
          h("span", null, t("hero.l2")),
        ),
        h("p", { className: "flick-hero-description" }, t("hero.desc")),
        h(
          "div",
          { className: "flick-hero-actions" },
          h(
            "a",
            {
              href: nk(`shop/${active?.category.id ?? ""}`),
              className: "flick-button flick-button-dark",
            },
            t("hero.shopAll"),
          ),
          h(
            "a",
            {
              href: nk("offers"),
              className: "flick-button flick-button-outline",
            },
            t("nav.offers"),
          ),
        ),
        h(
          "p",
          { className: "flick-hero-branches" },
          t("hero.branches", { n: content.branches.length }),
        ),
      ),
      h(
        "div",
        { className: "flick-hero-showcase" },
        h(
          "div",
          {
            className: "flick-hero-stage",
            ref: stageRef,
            role: "group",
            "aria-roledescription": local("معرض متحرك", "carousel"),
            "aria-label": local("معرض أجهزة فليك", "Flick device showcase"),
            onKeyDown: handleKeys,
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: (event) => endDrag(event, true),
            onPointerCancel: (event) => endDrag(event, false),
            onClickCapture: (event) => {
              if (!suppressClick.current) return;
              event.preventDefault();
              event.stopPropagation();
            },
            onDragStart: (event) => event.preventDefault(),
          },
          items.map((item, index) => {
            const position = positions.get(item.category.id);
            const pose = flickHeroPose(position, selection.direction);
            const isActive = position === "active";
            const hidden = position === "hidden";
            const label = isActive
              ? `${t("card.view")}: ${eZ(item.product.name, lang)}`
              : `${local("اعرض", "Show")} ${eZ(item.product.name, lang)}`;
            return h(
              "div",
              {
                key: item.category.id,
                className: "flick-hero-slide",
                "data-slide": item.category.id,
                "data-position": position,
                style: { transform: flickHeroTransform(pose), opacity: pose.o },
                "aria-hidden": hidden || undefined,
                inert: hidden || undefined,
              },
              h(
                "a",
                {
                  className: "flick-hero-slide-target",
                  href: item.href,
                  role: isActive ? undefined : "button",
                  tabIndex: hidden ? -1 : 0,
                  "aria-label": label,
                  title: eZ(item.product.name, lang),
                  onClick: isActive
                    ? undefined
                    : (event) => {
                        event.preventDefault();
                        select(
                          index,
                          position === "next" ? "forward" : "backward",
                        );
                      },
                  onKeyDown: (event) => {
                    if (!isActive && event.key === " ") {
                      event.preventDefault();
                      select(
                        index,
                        position === "next" ? "forward" : "backward",
                      );
                    }
                  },
                },
                h("span", {
                  className: "flick-hero-ground",
                  "aria-hidden": true,
                }),
                h(
                  "div",
                  { className: "flick-hero-art" },
                  h(nv, {
                    product: item.product,
                    eager: true,
                    className: "flick-hero-image",
                  }),
                ),
              ),
            );
          }),
        ),
        active &&
          h(
            "a",
            { href: active.href, className: "flick-hero-product" },
            h(
              "div",
              {
                className: "flick-hero-caption",
                "aria-live": "polite",
                "aria-atomic": true,
              },
              // Keys remount the text inside the live region so it animates in.
              h(
                "div",
                { key: `name-${active.category.id}` },
                h(
                  "p",
                  { className: "flick-hero-product-name", dir: "auto" },
                  eZ(active.product.name, lang),
                ),
                active.variant &&
                  h(
                    "p",
                    { className: "flick-hero-variant", dir: "auto" },
                    eZ(active.variant.label, lang),
                  ),
              ),
              active.variant &&
                h(
                  "div",
                  {
                    key: `price-${active.category.id}`,
                    className: "flick-hero-price",
                  },
                  h(ng, { value: eO(active.variant) }),
                  content.settings.conceptNotice &&
                    h("small", null, t("price.example")),
                ),
            ),
          ),
        h(
          "div",
          {
            className: "flick-hero-navigation",
            role: "group",
            "aria-label": local("تصفح الأجهزة", "Browse devices"),
          },
          h(
            "button",
            {
              type: "button",
              className: "flick-hero-arrow",
              onClick: () => step(-1),
              disabled: items.length < 2,
              "aria-label": local("الجهاز السابق", "Previous device"),
            },
            h("span", { "aria-hidden": true }, lang === "ar" ? "→" : "←"),
          ),
          h(
            "span",
            {
              key: `progress-${activeIndex}`,
              className: "flick-hero-progress",
              dir: "ltr",
              "aria-hidden": true,
            },
            `${String(items.length ? activeIndex + 1 : 0).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`,
          ),
          h(
            "button",
            {
              type: "button",
              className: "flick-hero-arrow",
              onClick: () => step(1),
              disabled: items.length < 2,
              "aria-label": local("الجهاز التالي", "Next device"),
            },
            h("span", { "aria-hidden": true }, lang === "ar" ? "←" : "→"),
          ),
        ),
        h(
          "div",
          {
            className: "flick-hero-categories",
            role: "group",
            "aria-label": t("shop.tabs"),
          },
          items.map((item, index) =>
            h(
              "button",
              {
                key: item.category.id,
                type: "button",
                "aria-pressed": index === activeIndex,
                onClick: () =>
                  select(index, index > activeIndex ? "forward" : "backward"),
              },
              item.category[lang],
            ),
          ),
        ),
      ),
    ),
  );
}
