import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import { build } from "esbuild";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "src");
const order = JSON.parse(
  await readFile(path.join(source, "order.json"), "utf8"),
);
const shell = await readFile(path.join(source, "shell.html"), "utf8");
const styles = await readFile(path.join(source, "styles.css"), "utf8");
const liveStyles = await readFile(path.join(source, "live.css"), "utf8");
const bootstrap = await readFile(path.join(source, "bootstrap.js"), "utf8");
for (const mode of ["demo", "live"]) {
  const destination = path.join(root, "dist", mode);
  await rm(destination, { recursive: true, force: true });
  await mkdir(path.join(destination, "assets"), { recursive: true });
  const pieces = [];
  for (const file of order) {
    if (file === "live-adapter.js" && mode !== "live") continue;
    pieces.push(await readFile(path.join(source, file), "utf8"));
  }
  const bundled = await build({
    stdin: {
      contents: pieces.join("\n;\n"),
      resolveDir: source,
      sourcefile: "flick-app.js",
    },
    bundle: true,
    write: false,
    minify: true,
    legalComments: "eof",
    format: "esm",
    target: "es2022",
  });
  const appContent = bundled.outputFiles[0].text;
  const appHash = createHash("sha256").update(appContent).digest("hex").slice(0, 12);
  const appName = `app.${appHash}.js`;
  await writeFile(path.join(destination, "assets", appName), appContent);
  await cp(path.join(root, "assets"), path.join(destination, "assets"), {
    recursive: true,
    filter: (file) => !path.basename(file).startsWith("."),
  });
  const modeScript = mode === "live" ? "window.FlickLive={enabled:true};" : "";
  let html = shell
    .replace("{{STYLES}}", styles + (mode === "live" ? liveStyles : ""))
    .replace("{{BOOTSTRAP}}", modeScript + bootstrap)
    .replace(
      /<script type="module">\s*\{\{APP\}\}\s*<\/script>/,
      `<script type="module" src="/assets/${appName}"></script>`,
    );
  if (mode === "demo")
    html = html.replace(`src="/assets/${appName}"`, `src="assets/${appName}"`);
  else
    html = html
      .replace(/(href|src)="assets\//g, '$1="/assets/')
      .replace("</head>", '<base href="/">\n</head>');
  if (/\{\{(?:APP|STYLES|BOOTSTRAP)\}\}|\bAPP;|\bBOOTSTRAP;/.test(html))
    throw new Error("Unresolved application template");
  html = html.replace(
    "</body>",
    '<noscript><p style="padding:2rem;text-align:center">فعّل JavaScript لاستخدام السلة والإدارة. Enable JavaScript to use checkout and administration.</p></noscript></body>',
  );
  await writeFile(path.join(destination, "index.html"), html);
  await writeFile(
    path.join(destination, "robots.txt"),
    "User-agent: *\nDisallow: /\n",
  );
  const publicFiles = ["index.html", "robots.txt", "assets/**"];
  await writeFile(
    path.join(destination, "publication-manifest.json"),
    JSON.stringify(
      {
        mode,
        files: publicFiles,
        excludes: [
          "server/",
          "shared/",
          "migrations/",
          "tests/",
          ".env",
          ".dev.vars",
          "node_modules/",
        ],
        note:
          mode === "demo"
            ? "Portable local demo; sample admin and checkout are browser-only."
            : "Serve through the Worker; never publish this live adapter as a standalone Pages demo.",
      },
      null,
      2,
    ),
  );
  console.log(`Built dist/${mode}`);
}
