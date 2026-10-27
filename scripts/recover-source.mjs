import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// One-time recovery of the only source published in the repository: the Parcel
// export. This is deliberately NOT part of the normal build and never overwrites
// recovered/edited files. Pass a fresh output folder to inspect a later export.
const input = path.resolve(process.argv[2] ?? "index.html");
const output = path.resolve(process.argv[3] ?? "src");
if (fs.existsSync(output)) throw new Error(`Output already exists: ${output}`);
const html = fs.readFileSync(input, "utf8");
const style = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/);
const boot = html.match(/<script>([\s\S]*?)<\/script>/);
const main = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!style || !boot || !main)
  throw new Error("Expected Flick export structure is missing.");
const bundle = main[1];
const boundaries = [
  [0, "vendor/runtime.js"],
  ['var w=(x("aIIwE"),x("aIIwE"));let eN', "app-core.js"],
  ["let e$=", "vendor/tailwind.js"],
  ['var w=x("aIIwE");let t1', "store.js"],
  ['var w=(x("aIIwE"),x("aIIwE")),nC=', "vendor/dialog.js"],
  ['let li={name:"x"', "app.js"],
  ['(0,N.createRoot)(document.getElementById("root"))', "mount.js"],
].map(([marker, name]) => {
  const start = typeof marker === "number" ? marker : bundle.indexOf(marker);
  if (
    start < 0 ||
    (typeof marker === "string" && bundle.indexOf(marker, start + 1) !== -1)
  )
    throw new Error(`Missing/ambiguous boundary ${name}`);
  return { name, start };
});
if (boundaries.some((b, i) => i && b.start <= boundaries[i - 1].start))
  throw new Error("Unexpected bundle order.");
const sha256 = (content) =>
  crypto.createHash("sha256").update(content).digest("hex");
fs.mkdirSync(path.join(output, "vendor"), { recursive: true });
const records = boundaries.map(({ name, start }, i) => {
  const end = boundaries[i + 1]?.start ?? bundle.length;
  const source = bundle.slice(start, end);
  fs.writeFileSync(path.join(output, name), source);
  return { path: name, start, end, sha256: sha256(source) };
});
fs.writeFileSync(path.join(output, "styles.css"), style[1]);
fs.writeFileSync(path.join(output, "bootstrap.js"), boot[1]);
fs.writeFileSync(
  path.join(output, "shell.html"),
  html
    .replace(style[0], "<style>{{STYLES}}</style>")
    .replace(boot[0], "<script>{{BOOTSTRAP}}</script>")
    .replace(main[0], '<script type="module">{{APP}}</script>'),
);
fs.writeFileSync(
  path.join(output, "recovery.json"),
  JSON.stringify(
    {
      from: "yallarideapp/flickmobile@a69224d1c268c189705b400a66028bc8e5d7f8c6:index.html",
      exportSha256: sha256(html),
      bundleSha256: sha256(bundle),
      description:
        "Recovered emitted JavaScript; original JSX, module names, package metadata and source maps were not published.",
      order: records,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Recovered ${records.length} JavaScript segments into ${output}`);
