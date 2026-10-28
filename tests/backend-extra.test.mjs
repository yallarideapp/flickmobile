import assert from "node:assert/strict";
import test from "node:test";
import { build } from "esbuild";
import {
  createBackend,
  setupAdmin,
  expectStatus,
  dummyAuthPepper,
  origin,
} from "./helpers/backend.mjs";

const withBackend = async (t, options) => {
  const backend = await createBackend(options);
  t.after(() => backend.dispose());
  return backend;
};
const getContent = async (admin) =>
  expectStatus(await admin.request("/api/admin/content"), 200);
async function publish(admin, state, edit) {
  const content = structuredClone(state.content);
  edit(content);
  return expectStatus(
    await admin.request("/api/admin/content", {
      method: "PUT",
      json: { content, version: state.version },
    }),
    200,
  );
}
function orderBody(state) {
  const product = state.content.products[0],
    variant = product.variants[0];
  return {
    idempotencyKey: crypto.randomUUID(),
    version: state.version,
    name: "Local Extra Test",
    consent: true,
    phone: "0790000002",
    method: "pickup",
    branchId: state.content.branches[0].id,
    lines: [{ productId: product.id, variantKey: variant.key, qty: 1 }],
    totalMinor: Math.round((variant.offerPrice || variant.price) * 1000),
  };
}

test("missing authentication pepper fails closed while public content stays available", async (t) => {
  for (const authPepper of [null, "short"]) {
    const backend = await withBackend(t, { authPepper });
    const client = backend.client();
    expectStatus(await client.request("/api/content"), 200);
    const session = expectStatus(
      await client.request("/api/admin/session"),
      200,
    );
    assert.equal(session.authenticated, false);
    assert.equal(session.resetAvailable, false);
    const denied = await client.request("/api/admin/setup", {
      method: "POST",
      json: {
        setupCode: "LOCAL-TEST-SETUP-ONLY-DO-NOT-DEPLOY",
        password: "LocalExtraDummy!234",
      },
    });
    expectStatus(denied, 503);
    assert.equal(denied.data.error, "auth-unavailable");
  }
});

test("archiving persists with revision guards and preserves order stock and retry history", async (t) => {
  const backend = await withBackend(t),
    admin = await setupAdmin(backend),
    visitor = backend.client();
  let state = await publish(admin, await getContent(admin), (content) => {
    content.settings.ordersEnabled = true;
    content.products[0].variants[0].stockQuantity = 3;
  });
  const input = orderBody(state),
    saved = expectStatus(
      await visitor.request("/api/orders", { method: "POST", json: input }),
      201,
    ).order;
  const orders = expectStatus(
    await admin.request("/api/admin/orders"),
    200,
  ).orders;
  assert.equal(orders.length, 1);
  expectStatus(
    await admin.request("/api/admin/orders/" + saved.id, {
      method: "DELETE",
      json: { version: 0 },
    }),
    409,
  );
  expectStatus(
    await admin.request("/api/admin/orders/" + saved.id, {
      method: "DELETE",
      json: { version: orders[0].version },
    }),
    200,
  );
  assert.equal(
    expectStatus(await admin.request("/api/admin/orders"), 200).orders.length,
    0,
  );
  expectStatus(
    await admin.request("/api/admin/orders/" + saved.id, {
      method: "DELETE",
      json: { version: orders[0].version },
    }),
    409,
  );
  expectStatus(
    await admin.request("/api/admin/orders/" + saved.id, {
      method: "PATCH",
      json: { version: orders[0].version + 1, status: "cancelled" },
    }),
    409,
  );
  assert.equal(
    expectStatus(
      await visitor.request("/api/orders", { method: "POST", json: input }),
      200,
    ).order.id,
    saved.id,
  );
  state = await getContent(admin);
  assert.equal(state.content.products[0].variants[0].stockQuantity, 2);
  assert.equal(
    (await backend.db.prepare("SELECT count(*) AS n FROM orders").first()).n,
    1,
  );
  const repair = expectStatus(
    await visitor.request("/api/maintenance", {
      method: "POST",
      json: {
        idempotencyKey: crypto.randomUUID(),
        name: "Local Repair",
        consent: true,
        phone: "0790000003",
        device: "Dummy device",
        issue: "screen",
        branchId: state.content.branches[0].id,
      },
    }),
    201,
  ).request;
  const repairs = expectStatus(
    await admin.request("/api/admin/maintenance"),
    200,
  ).requests;
  expectStatus(
    await admin.request("/api/admin/maintenance/" + repair.id, {
      method: "DELETE",
      json: { version: repairs[0].version },
    }),
    200,
  );
  assert.deepEqual(
    expectStatus(await admin.request("/api/admin/maintenance"), 200).requests,
    [],
  );
  assert.equal(
    expectStatus(
      await visitor.request("/api/maintenance/track", {
        method: "POST",
        json: { id: repair.id, phone: "0790000003" },
      }),
      200,
    ).request,
    null,
  );
});

test("rendered routes include real catalog, safe bootstrap, working assets and indexing controls", async (t) => {
  const backend = await withBackend(t, { assets: true }),
    visitor = backend.client(),
    admin = await setupAdmin(backend);
  const livePage = await visitor.request("/en/shop/phones");
  const page = expectStatus(livePage, 200);
  const imagePolicy = livePage.headers
    .get("Content-Security-Policy")
    ?.split(";")
    .find((directive) => directive.trim().startsWith("img-src "));
  assert.ok(
    imagePolicy?.split(/\s+/).includes("blob:"),
    "Live image policy must allow the canvas editor's local object URLs.",
  );
  assert.match(page, /<html lang="en" dir="ltr">/);
  assert.match(page, /id="flick-first-paint"/);
  assert.match(page, /window\.__FLICK_BOOTSTRAP__=/);
  assert.match(page, /<article /);
  const appSource = page.match(/<script type="module" src="([^"]+)"/)[1];
  assert.match(appSource, /^\/assets\/app\.[a-f0-9]{12}\.js$/);
  assert.doesNotMatch(page, /\{\{(?:APP|STYLES|BOOTSTRAP)\}\}|\bAPP;/);
  assert.doesNotMatch(page, /(?:src|href)="assets\//);
  assert.match(
    expectStatus(await visitor.request(appSource), 200),
    /FlickApp/,
  );
  for (const path of [
    "/admin",
    "/admin/orders",
    "/admin/reset",
    "/ar/maintenance/track",
  ]) {
    const result = await visitor.request(path);
    expectStatus(result, 200);
    assert.match(result.headers.get("X-Robots-Tag") || "", /noindex/);
  }
  assert.match(
    expectStatus(await visitor.request("/robots.txt"), 200),
    /Disallow: \/\n/,
  );
  let state = await publish(admin, await getContent(admin), (content) => {
    content.settings.ordersEnabled = true;
    content.settings.indexingEnabled = true;
    content.products[0].visible = false;
    content.products[1].name.en = "</script><img src=x onerror=alert(1)>";
  });
  const hidden = await visitor.request("/en/p/" + state.content.products[0].id);
  expectStatus(hidden, 404);
  assert.match(hidden.headers.get("X-Robots-Tag") || "", /noindex/);
  const indexed = await visitor.request("/en/shop");
  expectStatus(indexed, 200);
  assert.match(indexed.text, /<meta name="robots" content="index,follow">/);
  assert.doesNotMatch(indexed.text, /<img src=x onerror=alert\(1\)>/);
  assert.match(indexed.text, /\\u003c\/script>/);
  const malicious = await visitor.request(
    "/ar/p/%22%3E%3Cimg%20src=x%20onerror=alert(1)%3E",
  );
  expectStatus(malicious, 404);
  assert.doesNotMatch(malicious.text, /<img src=x onerror=/);
  const sitemap = expectStatus(await visitor.request("/sitemap.xml"), 200);
  assert.match(sitemap, /<loc>https:\/\/flick\.test\/en\/p\//);
  assert.ok(!sitemap.includes("/admin"));
  assert.ok(!sitemap.includes("/p/" + state.content.products[0].id + "<"));
  const robots = expectStatus(await visitor.request("/robots.txt"), 200);
  assert.match(robots, /Disallow: \/admin/);
  assert.match(sitemap, /\/ar\/privacy</);
  assert.match(sitemap, /\/en\/terms</);
  const privacy = expectStatus(await visitor.request("/ar/privacy"), 200);
  assert.match(privacy, /سياسة الخصوصية/);
  assert.match(privacy, /رقم \(24\) لسنة 2023/);
  const terms = expectStatus(await visitor.request("/en/terms"), 200);
  assert.match(terms, /Terms &amp; Conditions/);
  assert.match(terms, /Independent store, not affiliated with Apple, Samsung, Huawei or any other/);
  const home = expectStatus(await visitor.request("/en/"), 200);
  assert.match(home, /Names and trademarks belong to their owners/);
  const noConsent = { ...orderBody(state) };
  delete noConsent.consent;
  const refused = await visitor.request("/api/orders", { method: "POST", json: noConsent });
  expectStatus(refused, 400);
  assert.match(refused.text, /consent-required/);
  const repairNoConsent = await visitor.request("/api/maintenance", {
    method: "POST",
    json: {
      idempotencyKey: crypto.randomUUID(),
      name: "Local Repair",
      phone: "0790000004",
      device: "Dummy device",
      issue: "screen",
      branchId: state.content.branches[0].id,
    },
  });
  expectStatus(repairNoConsent, 400);
  assert.match(repairNoConsent.text, /consent-required/);
  await backend.db.exec("DROP TABLE content");
  const unavailable = await visitor.request("/en/shop");
  expectStatus(unavailable, 503);
  assert.match(unavailable.text, /temporarily unavailable/);
  assert.doesNotMatch(unavailable.text, /<article /);
});

test("session revocation before a delayed catalog commit prevents the write", async (t) => {
  const backend = await withBackend(t),
    admin = await setupAdmin(backend),
    state = await getContent(admin);
  const result = await build({
    entryPoints: ["server/index.js"],
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    target: "es2022",
    logLevel: "silent",
  });
  const worker = (
    await import(
      "data:text/javascript;base64," +
        Buffer.from(result.outputFiles[0].text).toString("base64")
    )
  ).default;
  let intercepted = false;
  const db = {
    prepare: (sql) => backend.db.prepare(sql),
    batch: async (statements) => {
      intercepted = true;
      await backend.db.prepare("DELETE FROM sessions").run();
      return backend.db.batch(statements);
    },
  };
  const content = structuredClone(state.content);
  content.settings.instagramFollowers.en = "A stale write must never commit";
  const request = new Request(origin + "/api/admin/content", {
    method: "PUT",
    headers: {
      Origin: origin,
      "X-Flick-CSRF": "1",
      "Content-Type": "application/json",
      Cookie: admin.cookieHeader(),
    },
    body: JSON.stringify({ content, version: state.version }),
  });
  const response = await worker.fetch(
    request,
    { DB: db, MEDIA: backend.media, AUTH_PEPPER: dummyAuthPepper },
    {},
  );
  assert.equal(intercepted, true);
  assert.equal(response.status, 409);
  const stored = JSON.parse(
    (await backend.db.prepare("SELECT json FROM content WHERE id=1").first())
      .json,
  );
  assert.notEqual(
    stored.settings.instagramFollowers.en,
    content.settings.instagramFollowers.en,
  );
});

test("fabricated image containers and trailing executable bytes are rejected", async (t) => {
  const backend = await withBackend(t),
    admin = await setupAdmin(backend);
  const fake = Buffer.from(
    "89504e470d0a1a0a0000000d4948445200000000000000000049454e44ae426082",
    "hex",
  );
  expectStatus(
    await admin.request("/api/admin/photo", {
      method: "POST",
      body: fake,
      headers: { "Content-Type": "image/png" },
    }),
    415,
  );
  const fakeJpeg = Buffer.from([255, 216, 255, 224, 0, 4, 0, 0, 255, 217]);
  expectStatus(
    await admin.request("/api/admin/photo", {
      method: "POST",
      body: fakeJpeg,
      headers: { "Content-Type": "image/jpeg" },
    }),
    415,
  );
});
