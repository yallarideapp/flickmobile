(!(function () {
  try {
    var e = JSON.parse(localStorage.getItem("flick.lang") || "null"),
      t =
        window.FlickLive?.enabled &&
        /^\/(?:ar|en)(?:\/|$)/.test(location.pathname)
          ? location.pathname.startsWith("/en")
          : "en" === e;
    ((document.documentElement.lang = t ? "en" : "ar"),
      (document.documentElement.dir = t ? "ltr" : "rtl"));
  } catch (e) {
    ((document.documentElement.lang = "ar"),
      (document.documentElement.dir = "rtl"));
  }
})(),
  (function () {
    for (
      var e = [
          ["preconnect", "https://fonts.googleapis.com"],
          ["preconnect", "https://fonts.gstatic.com", !0],
          [
            "stylesheet",
            "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Lalezar&display=swap",
          ],
        ],
        t = 0;
      t < e.length;
      t++
    ) {
      var n = document.createElement("link");
      ((n.rel = e[t][0]),
        (n.href = e[t][1]),
        e[t][2] && (n.crossOrigin = "anonymous"),
        document.head.appendChild(n));
    }
  })());
