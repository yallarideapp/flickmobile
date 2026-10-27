import {
  createBackend,
  setupAdmin,
  dummyPassword,
} from "../tests/helpers/backend.mjs";

// Disposable preview: never reads .env/.dev.vars or real Cloudflare bindings.
const portOption = process.argv.indexOf("--port");
const port = portOption === -1 ? 8788 : Number(process.argv[portOption + 1]);
const backend = await createBackend({ assets: true, port });
await setupAdmin(backend);
console.log(`Flick local preview: http://127.0.0.1:${port}/ar/`);
console.log(`Admin: http://127.0.0.1:${port}/admin`);
console.log("Local dummy password:", dummyPassword);
console.log("Database and uploaded images disappear when this process stops.");
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  await backend.dispose();
  process.exit(0);
}
process.on("SIGINT", close);
process.on("SIGTERM", close);
await new Promise(() => {});
