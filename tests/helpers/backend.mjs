import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { build } from "esbuild";
import { Miniflare } from "miniflare";

export const root = fileURLToPath(new URL("../../", import.meta.url));
export const origin = "https://flick.test";
export const dummySetupCode = "LOCAL-TEST-SETUP-ONLY-DO-NOT-DEPLOY";
export const dummyPassword = "LocalDummyOnly!234";
export const dummyAuthPepper = "LOCAL-ONLY-DUMMY-AUTH-PEPPER-32-CHARS";

function refuseLiveConfiguration() {
  for (const name of [".env", ".env.local", ".dev.vars", ".dev.vars.local"]) {
    assert.equal(
      existsSync(path.join(root, name)),
      false,
      `Local API tests refuse ${name}; move it aside before testing.`,
    );
  }
  for (const name of [
    "CLOUDFLARE_API_TOKEN",
    "CF_API_TOKEN",
    "CLOUDFLARE_API_KEY",
    "RESEND_API_KEY",
    "ADMIN_SETUP_CODE",
    "SETUP_CODE",
    "AUTH_PEPPER",
  ]) {
    assert.equal(
      Boolean(process.env[name]),
      false,
      `Local API tests refuse the ${name} environment variable.`,
    );
  }
}

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function snapshotAssets() {
  const directory = path.join(root, "dist", "live");
  assert.equal(existsSync(path.join(directory, "index.html")), true, "Run npm run build before the local asset/SSR tests or preview.");
  const files = new Map();
  async function visit(relative = "") {
    for (const entry of await readdir(path.join(directory, relative), { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.isSymbolicLink()) continue;
      const child = path.join(relative, entry.name);
      if (entry.isDirectory()) await visit(child);
      else if (entry.isFile()) files.set("/" + child.split(path.sep).join("/"), await readFile(path.join(directory, child)));
    }
  }
  await visit();
  return async request => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url).pathname); }
    catch { return new Response("Invalid address", { status: 400 }); }
    if (pathname.includes("\\") || pathname.includes("\0") || pathname.split("/").includes("..")) return new Response("Invalid address", { status: 400 });
    const bytes = files.get(pathname === "/" ? "/index.html" : pathname);
    if (!bytes) return new Response("Not found", { status: 404 });
    return new Response(request.method === "HEAD" ? null : bytes, {
      headers: { "Content-Type": contentTypes[path.extname(pathname)] || "application/octet-stream" },
    });
  };
}

let bundled;
async function bundleWorker() {
  bundled ??= build({
    absWorkingDir: root,
    entryPoints: ["server/index.js"],
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    target: "es2022",
    logLevel: "silent",
  }).then((result) => result.outputFiles[0].text);
  return bundled;
}

function migrationStatements(source) {
  const statements = [];
  let statement = "",
    quote = "",
    comment = "";
  for (let i = 0; i < source.length; i++) {
    const char = source[i],
      next = source[i + 1];
    if (comment === "--") {
      if (char === "\n") {
        comment = "";
        statement += "\n";
      }
      continue;
    }
    if (comment === "/*") {
      if (char === "*" && next === "/") {
        comment = "";
        i++;
        statement += " ";
      }
      continue;
    }
    if (quote) {
      statement += char;
      if (char === quote) {
        if (next === quote) {
          statement += next;
          i++;
        } else quote = "";
      }
    } else if (
      (char === "-" && next === "-") ||
      (char === "/" && next === "*")
    ) {
      comment = char + next;
      i++;
    } else if (char === "'" || char === '"' || char === "`") {
      quote = char;
      statement += char;
    } else if (char === ";") {
      if (statement.trim()) statements.push(statement.trim());
      statement = "";
    } else statement += char;
  }
  assert.equal(quote, "", "Migration has an unclosed SQL quote.");
  assert.notEqual(comment, "/*", "Migration has an unclosed SQL comment.");
  if (statement.trim()) statements.push(statement.trim());
  assert.ok(
    statements.every((sql) => !/^CREATE\s+(?:TEMP\s+)?TRIGGER\b/i.test(sql)),
    "Extend the local migration parser before adding triggers.",
  );
  return statements;
}

// No Wrangler config, environment files, remote bindings or network providers are
// loaded. Every instance starts with disposable in-memory D1 and KV namespaces.
export async function createBackend({ email = false, emailStatus = 200, assets = false, port, authPepper = dummyAuthPepper } = {}) {
  refuseLiveConfiguration();
  const messages = [];
  const unexpectedNetwork = [];
  if (port !== undefined) assert.ok(Number.isInteger(port) && port > 0 && port < 65536, "Local preview port must be a valid TCP port.");
  const mf = new Miniflare({
    host: "127.0.0.1",
    ...(port === undefined ? {} : { port }),
    modules: true,
    script: await bundleWorker(),
    compatibilityDate: "2026-07-30",
    d1Databases: { DB: "flick-disposable-test-database" },
    kvNamespaces: ["MEDIA"],
    d1Persist: false,
    kvPersist: false,
    bindings: {
      SETUP_CODE: dummySetupCode,
      ADMIN_SETUP_CODE: dummySetupCode,
      SITE_URL: port === undefined ? origin : `http://127.0.0.1:${port}`,
      ...(authPepper === null ? {} : { AUTH_PEPPER: authPepper }),
      ...(email
        ? {
            RESEND_API_KEY: "re_LOCAL_DUMMY_TEST_KEY_NEVER_A_REAL_CREDENTIAL",
            MAIL_FROM: "Flick Local Tests <test@example.invalid>",
            ADMIN_EMAIL: "owner@example.invalid",
          }
        : {}),
    },
    serviceBindings: {
      ASSETS: assets ? await snapshotAssets() : () => new Response("Local asset placeholder", { status: 404 }),
      MAILER: async (request) => {
        assert.equal(
          email,
          true,
          "An unconfigured backend must not send email.",
        );
        assert.equal(request.url, "https://api.resend.com/emails");
        messages.push({
          headers: Object.fromEntries(request.headers),
          body: await request.json(),
        });
        return Response.json(
          emailStatus === 200
            ? { id: "local-fake-mail-id" }
            : { message: "Local fake provider rejection" },
          { status: emailStatus },
        );
      },
    },
    outboundService: async (request) => {
      unexpectedNetwork.push(request.url);
      throw new Error(
        `Tests prohibit external network access: ${new URL(request.url).hostname}`,
      );
    },
  });
  try {
    const db = await mf.getD1Database("DB");
    for (const filename of (await readdir(path.join(root, "migrations")))
      .filter((name) => name.endsWith(".sql"))
      .sort()) {
      const sql = await readFile(
        path.join(root, "migrations", filename),
        "utf8",
      );
      for (const statement of migrationStatements(sql))
        await db.prepare(statement).run();
    }
    return {
      mf,
      db,
      media: await mf.getKVNamespace("MEDIA"),
      messages,
      url: await mf.ready,
      client: () => new ApiClient(mf),
      async dispose() {
        await mf.dispose();
        assert.deepEqual(
          unexpectedNetwork,
          [],
          "All provider calls must use local fake services.",
        );
      },
    };
  } catch (error) {
    await mf.dispose();
    throw error;
  }
}

export class ApiClient {
  constructor(mf) {
    this.mf = mf;
    this.cookies = new Map();
    this.ip = `192.0.2.${++clientNumber % 250 || 250}`;
  }

  cookieHeader() {
    return [...this.cookies]
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }

  async request(
    route,
    {
      method = "GET",
      json,
      body,
      headers = {},
      csrf = true,
      sameOrigin = true,
    } = {},
  ) {
    const requestHeaders = new Headers(headers);
    if (!requestHeaders.has("CF-Connecting-IP"))
      requestHeaders.set("CF-Connecting-IP", this.ip);
    if (sameOrigin && method !== "GET" && method !== "HEAD")
      requestHeaders.set("Origin", origin);
    if (csrf) requestHeaders.set("X-Flick-CSRF", "1");
    if (this.cookies.size) requestHeaders.set("Cookie", this.cookieHeader());
    if (json !== undefined) {
      requestHeaders.set("Content-Type", "application/json");
      body = JSON.stringify(json);
    }
    const response = await this.mf.dispatchFetch(new URL(route, origin), {
      method,
      headers: requestHeaders,
      body,
    });
    for (const raw of response.headers.getSetCookie()) {
      const [cookie] = raw.split(";");
      const separator = cookie.indexOf("=");
      const name = cookie.slice(0, separator),
        value = cookie.slice(separator + 1);
      if (/max-age=0(?:;|$)/i.test(raw) || !value) this.cookies.delete(name);
      else this.cookies.set(name, value);
    }
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: response.status, headers: response.headers, data, text };
  }
}

let clientNumber = 0;

export function expectStatus(result, expected) {
  assert.equal(result.status, expected, JSON.stringify(result.data));
  return result.data;
}

export async function setupAdmin(backend) {
  const admin = backend.client();
  const result = await admin.request("/api/admin/setup", {
    method: "POST",
    json: { setupCode: dummySetupCode, password: dummyPassword },
  });
  expectStatus(result, 201);
  assert.equal(
    admin.cookies.has("flick_admin"),
    true,
    "Setup must issue an admin session.",
  );
  return admin;
}
