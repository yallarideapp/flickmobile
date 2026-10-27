const flickHeroPoses = {
  before: { x: -110, y: -42, r: -6, s: 0.16, o: 0 },
  previous: { x: -74, y: -28, r: -4, s: 0.24, o: 1 },
  active: { x: 0, y: 0, r: 0, s: 1, o: 1 },
  next: { x: 74, y: 28, r: 4, s: 0.24, o: 1 },
  after: { x: 110, y: 42, r: 6, s: 0.16, o: 0 },
};

function flickHeroPose(position, direction) {
  if (position !== "hidden") return flickHeroPoses[position];
  return flickHeroPoses[direction === "backward" ? "after" : "before"];
}

function flickHeroTransform(pose) {
  return `translate3d(${pose.x}%, ${pose.y}%, 0) rotate(${pose.r}deg) scale(${pose.s})`;
}

function flickHeroMotion(from, to, direction) {
  if (to === "hidden" && from === "hidden") return null;
  const start = flickHeroPose(
    from,
    direction === "forward" ? "backward" : "forward",
  );
  const target = flickHeroPose(to, direction);
  const first = {
    transform: flickHeroTransform(start),
    opacity: start.o,
    visibility: "visible",
  };
  const last = {
    transform: flickHeroTransform(target),
    opacity: target.o,
    visibility: "visible",
  };
  const wrapping =
    (from === "previous" && to === "next") ||
    (from === "next" && to === "previous");
  return {
    keyframes: wrapping
      ? [
          { ...first, offset: 0 },
          {
            transform: flickHeroTransform(
              flickHeroPoses[from === "previous" ? "before" : "after"],
            ),
            opacity: 0,
            visibility: "visible",
            offset: 0.48,
          },
          {
            transform: flickHeroTransform(
              flickHeroPoses[to === "next" ? "after" : "before"],
            ),
            opacity: 0,
            visibility: "visible",
            offset: 0.52,
          },
          { ...last, offset: 1 },
        ]
      : [first, last],
    timing: { duration: 720, easing: "cubic-bezier(.22, .68, 0, 1)" },
  };
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
  const selectionRef = w.useRef(selection);
  const pendingSelection = w.useRef(null);
  const transitioning = w.useRef(false);
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
      items.length > 2 &&
      typeof stage.animate === "function" &&
      !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    for (const slide of stage.querySelectorAll(".flick-hero-slide")) {
      const id = slide.dataset.slide;
      const from = previous.get(id);
      const to = positions.get(id);
      if (!from || from === to) continue;
      const motion = animate && flickHeroMotion(from, to, selection.direction);
      if (!motion) continue;
      const animation = slide.animate(motion.keyframes, {
        ...motion.timing,
        fill: "backwards",
      });
      slideAnimations.current.set(id, animation);
      animation.onfinish = () => {
        if (slideAnimations.current.get(id) === animation)
          slideAnimations.current.delete(id);
        if (!slideAnimations.current.size) {
          delete stage.dataset.transitioning;
          transitioning.current = false;
          if (pendingSelection.current?.id === selectionRef.current.id)
            focusAfterNavigation.current = false;
          advanceSelection();
        }
      };
    }
    if (slideAnimations.current.size) stage.dataset.transitioning = "true";
    else {
      delete stage.dataset.transitioning;
      transitioning.current = false;
      advanceSelection();
    }
  });

  w.useEffect(
    () => () => {
      for (const animation of slideAnimations.current.values())
        animation.cancel();
      slideAnimations.current.clear();
    },
    [],
  );

  w.useLayoutEffect(() => {
    if (!focusAfterNavigation.current) return;
    focusAfterNavigation.current =
      pendingSelection.current?.id !== active?.category.id;
    stageRef.current
      ?.querySelector('.flick-hero-slide[data-position="active"] a')
      ?.focus({ preventScroll: true });
  }, [active?.category.id]);

  function advanceSelection() {
    if (transitioning.current || !items.length) return;
    const target = pendingSelection.current;
    if (!target || target.id === selectionRef.current.id) return;
    if (!items.some((item) => item.category.id === target.id)) {
      pendingSelection.current = null;
      return;
    }
    const current = Math.max(
      0,
      items.findIndex((item) => item.category.id === selectionRef.current.id),
    );
    const targetIndex = items.findIndex(
      (item) => item.category.id === target.id,
    );
    const forward = (targetIndex - current + items.length) % items.length;
    const backward = (current - targetIndex + items.length) % items.length;
    const delta =
      forward === backward
        ? target.direction === "backward"
          ? -1
          : 1
        : forward < backward
          ? 1
          : -1;
    const next = {
      id: items[(current + delta + items.length) % items.length].category.id,
      direction: delta > 0 ? "forward" : "backward",
    };
    transitioning.current = true;
    selectionRef.current = next;
    setSelection(next);
  }

  function select(index, direction) {
    if (!items.length) return;
    pendingSelection.current = {
      id: items[(index + items.length) % items.length].category.id,
      direction,
    };
    advanceSelection();
  }

  function step(delta) {
    if (items.length < 2) return;
    const target = pendingSelection.current ?? selectionRef.current;
    const current = Math.max(
      0,
      items.findIndex((item) => item.category.id === target.id),
    );
    select(current + delta, delta > 0 ? "forward" : "backward");
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
    if (
      transitioning.current ||
      items.length < 2 ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
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
      (6 * Math.tanh(dx / 100)).toFixed(1),
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
