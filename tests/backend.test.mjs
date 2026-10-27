import assert from "node:assert/strict";
import test from "node:test";
import {
  createBackend,
  dummyPassword,
  dummySetupCode,
  expectStatus,
  setupAdmin,
} from "./helpers/backend.mjs";

async function withBackend(t, options = {}) {
  const backend = await createBackend(options);
  t.after(() => backend.dispose());
  return backend;
}

async function adminContent(admin) {
  return expectStatus(await admin.request("/api/admin/content"), 200);
}

async function publish(admin, state, edit) {
  const content = structuredClone(state.content);
  edit(content);
  expectStatus(
    await admin.request("/api/admin/content", {
      method: "PUT",
      json: { version: state.version, content },
    }),
    200,
  );
  return adminContent(admin);
}

function orderInput(state, overrides = {}) {
  return {
    idempotencyKey: crypto.randomUUID(),
    version: state.version,
    name: "Local Test Customer",
    phone: "0790000000",
    method: "pickup",
    branchId: state.content.branches[0].id,
    notes: "Dummy local test only",
    lines: [
      {
        productId: state.content.products[0].id,
        variantKey: state.content.products[0].variants[0].key,
        qty: 1,
      },
    ],
    totalMinor: 125123,
    ...overrides,
  };
}

async function enableTestInventory(admin, quantity = 2) {
  return publish(admin, await adminContent(admin), (content) => {
    content.settings.ordersEnabled = true;
    content.settings.deliveryFeeMinor = 2250;
    const variant = content.products[0].variants[0];
    variant.price = 150;
    variant.offerPrice = 125.123;
    variant.stockQuantity = quantity;
    variant.inStock = true;
    variant.soldOut = false;
    content.products[1].visible = false;
  });
}

test("local setup, admin authentication, CSRF, bounded input and password invalidation", async (t) => {
  const backend = await withBackend(t);
  const visitor = backend.client();
  const initial = expectStatus(
    await visitor.request("/api/admin/session"),
    200,
  );
  assert.equal(initial.authenticated, false);
  assert.equal(initial.setupRequired, true);
  assert.equal(initial.resetAvailable, false);
  for (const route of [
    "/api/admin/content",
    "/api/admin/orders",
    "/api/admin/maintenance",
  ]) {
    expectStatus(await visitor.request(route), 401);
  }
  expectStatus(
    await visitor.request("/api/admin/setup", {
      method: "POST",
      json: { setupCode: dummySetupCode, password: dummyPassword },
      csrf: false,
    }),
    403,
  );
  expectStatus(
    await visitor.request("/api/admin/setup", {
      method: "POST",
      json: { setupCode: dummySetupCode, password: dummyPassword },
      sameOrigin: false,
      headers: { Origin: "https://attacker.invalid" },
    }),
    403,
  );
  expectStatus(
    await visitor.request("/api/admin/setup", {
      method: "POST",
      json: { setupCode: "LOCAL-WRONG-CODE", password: dummyPassword },
    }),
    401,
  );
  expectStatus(
    await visitor.request("/api/admin/setup", {
      method: "POST",
      json: { setupCode: dummySetupCode, password: "too-short" },
    }),
    400,
  );
  expectStatus(
    await visitor.request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: dummyPassword }),
      headers: { "Content-Type": "text/plain" },
    }),
    415,
  );
  expectStatus(
    await visitor.request("/api/admin/login", {
      method: "POST",
      body: '{"password":"' + "x".repeat(2 * 1024 * 1024) + '"}',
      headers: { "Content-Type": "application/json" },
    }),
    413,
  );

  const admin = await setupAdmin(backend);
  const session = expectStatus(await admin.request("/api/admin/session"), 200);
  assert.equal(session.authenticated, true);
  assert.equal(session.setupRequired, false);
  const login = backend.client();
  expectStatus(
    await login.request("/api/admin/login", {
      method: "POST",
      json: { password: "WrongLocalPassword!123" },
    }),
    401,
  );
  const successful = await login.request("/api/admin/login", {
    method: "POST",
    json: { password: dummyPassword },
  });
  expectStatus(successful, 200);
  const cookie = successful.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /Secure/i);
  assert.match(cookie, /SameSite=Strict/i);
  assert.match(cookie, /Path=\/api\/admin/i);
  const rawSession = login.cookies.get("flick_admin");
  const storedSessions = await backend.db
    .prepare("SELECT token_hash FROM sessions")
    .all();
  assert.ok(storedSessions.results.length >= 2);
  assert.ok(
    storedSessions.results.every(
      (row) =>
        row.token_hash !== rawSession && !row.token_hash.includes(rawSession),
    ),
  );
  const storedAdmin = await backend.db
    .prepare("SELECT password_hash FROM admin")
    .first();
  assert.ok(!storedAdmin.password_hash.includes(dummyPassword));
  expectStatus(
    await admin.request("/api/admin/setup", {
      method: "POST",
      json: { setupCode: dummySetupCode, password: dummyPassword },
    }),
    409,
  );

  expectStatus(
    await admin.request("/api/admin/password", {
      method: "POST",
      json: {
        currentPassword: dummyPassword,
        newPassword: "ChangedLocalOnly!456",
      },
    }),
    200,
  );
  assert.equal(
    expectStatus(await login.request("/api/admin/session"), 200).authenticated,
    false,
    "Password change must revoke other sessions.",
  );
  const freshLogin = backend.client();
  expectStatus(
    await freshLogin.request("/api/admin/login", {
      method: "POST",
      json: { password: dummyPassword },
    }),
    401,
  );
  expectStatus(
    await freshLogin.request("/api/admin/login", {
      method: "POST",
      json: { password: "ChangedLocalOnly!456" },
    }),
    200,
  );
  expectStatus(
    await freshLogin.request("/api/admin/logout", { method: "POST", json: {} }),
    200,
  );
  assert.equal(
    expectStatus(await freshLogin.request("/api/admin/session"), 200)
      .authenticated,
    false,
  );
});

test("catalog shares updates, guards stale writes and keeps hidden products and exact stock private", async (t) => {
  const backend = await withBackend(t);
  const admin = await setupAdmin(backend);
  const secondAdmin = backend.client();
  expectStatus(
    await secondAdmin.request("/api/admin/login", {
      method: "POST",
      json: { password: dummyPassword },
    }),
    200,
  );
  const old = await adminContent(admin);
  assert.equal(
    (await backend.db.prepare("SELECT COUNT(*) AS n FROM orders").first()).n,
    0,
  );
  assert.equal(
    (await backend.db.prepare("SELECT COUNT(*) AS n FROM maintenance").first())
      .n,
    0,
  );
  assert.equal(
    (await backend.db.prepare("SELECT COUNT(*) AS n FROM sessions").first()).n,
    2,
  );
  const hiddenId = old.content.products[1].id;
  const updated = await publish(admin, old, (content) => {
    content.products[0].variants[0].stockQuantity = 7;
    content.products[1].visible = false;
    content.categories.push({
      id: "local-category",
      name: { ar: "فئة الاختبار", en: "Local category" },
      visible: true,
    });
    content.products[0].cat = "local-category";
    content.appearance = {
      heroTitle: { ar: "عنوان جديد", en: "Updated title" },
      accent: "#123456",
    };
  });
  assert.notEqual(updated.version, old.version);
  const fromOtherSession = await adminContent(secondAdmin);
  assert.equal(fromOtherSession.version, updated.version);
  assert.equal(
    fromOtherSession.content.products[0].variants[0].stockQuantity,
    7,
  );
  assert.equal(
    fromOtherSession.content.appearance.heroTitle.en,
    "Updated title",
  );
  expectStatus(
    await secondAdmin.request("/api/admin/content", {
      method: "PUT",
      json: old,
    }),
    409,
  );
  const publicState = expectStatus(
    await backend.client().request("/api/content"),
    200,
  );
  assert.ok(
    !publicState.content.products.some((product) => product.id === hiddenId),
  );
  assert.ok(
    publicState.content.categories.some(
      (category) => category.id === "local-category",
    ),
  );
  for (const product of publicState.content.products) {
    for (const variant of product.variants)
      assert.equal("stockQuantity" in variant, false);
  }
  assert.ok(!JSON.stringify(publicState).includes("password_hash"));
  assert.ok(!JSON.stringify(publicState).includes(dummyPassword));
  const invalid = structuredClone(updated);
  invalid.content.products[0].variants[0].stockQuantity = -1;
  expectStatus(
    await admin.request("/api/admin/content", { method: "PUT", json: invalid }),
    400,
  );
  assert.equal((await adminContent(admin)).version, updated.version);
});

test("orders reject tampering and invalid selections, retry once atomically, and compete for last stock", async (t) => {
  const backend = await withBackend(t);
  const admin = await setupAdmin(backend);
  const shopper = backend.client();
  let state = await adminContent(admin);
  expectStatus(
    await shopper.request("/api/orders", {
      method: "POST",
      json: orderInput(state),
    }),
    403,
  );
  state = await enableTestInventory(admin, 2);
  expectStatus(
    await shopper.request("/api/orders", {
      method: "POST",
      json: orderInput(state, { totalMinor: 1 }),
    }),
    409,
  );
  for (const qty of [0, -1, 1.5, 6, "1"]) {
    const lines = [{ ...orderInput(state).lines[0], qty }];
    expectStatus(
      await backend
        .client()
        .request("/api/orders", {
          method: "POST",
          json: orderInput(state, { lines }),
        }),
      400,
    );
  }
  expectStatus(
    await shopper.request("/api/orders", {
      method: "POST",
      json: orderInput(state, {
        lines: [
          { ...orderInput(state).lines[0], variantKey: "unknown-option" },
        ],
      }),
    }),
    409,
  );
  expectStatus(
    await backend.client().request("/api/orders", {
      method: "POST",
      json: orderInput(state, {
        lines: [
          {
            productId: state.content.products[1].id,
            variantKey: state.content.products[1].variants[0].key,
            qty: 1,
          },
        ],
      }),
    }),
    409,
  );
  expectStatus(
    await backend.client().request("/api/orders", {
      method: "POST",
      json: orderInput(state, {
        lines: [orderInput(state).lines[0], orderInput(state).lines[0]],
        totalMinor: 250246,
      }),
    }),
    400,
  );
  const repeated = orderInput(state);
  repeated.lines[0].price = 0.001;
  repeated.lines[0].unitMinor = 1;
  const retries = await Promise.all(
    Array.from({ length: 3 }, () =>
      shopper.request("/api/orders", { method: "POST", json: repeated }),
    ),
  );
  for (const result of retries)
    assert.ok([200, 201].includes(result.status), JSON.stringify(result.data));
  const order = retries[0].data.order;
  assert.ok(order.id);
  assert.equal(new Set(retries.map((result) => result.data.order.id)).size, 1);
  let saved = await backend.db.prepare("SELECT * FROM orders").all();
  assert.equal(saved.results.length, 1);
  assert.equal(
    saved.results[0].total_minor,
    125123,
    "Server must use catalog offer price in integer fils.",
  );
  assert.equal(
    (await backend.db.prepare("SELECT unit_minor FROM order_lines").first())
      .unit_minor,
    125123,
  );
  assert.equal(
    (
      await backend.db
        .prepare(
          "SELECT quantity FROM inventory WHERE product_id = ? AND variant_key = ?",
        )
        .bind(repeated.lines[0].productId, repeated.lines[0].variantKey)
        .first()
    ).quantity,
    1,
  );
  expectStatus(
    await shopper.request("/api/orders", {
      method: "POST",
      json: { ...repeated, name: "Different customer using same key" },
    }),
    409,
  );
  expectStatus(
    await admin.request("/api/admin/content", { method: "PUT", json: state }),
    409,
    "A stale content save cannot restore stock already sold.",
  );
  state = await adminContent(admin);
  const contenders = await Promise.all(
    Array.from({ length: 3 }, () =>
      backend
        .client()
        .request("/api/orders", { method: "POST", json: orderInput(state) }),
    ),
  );
  assert.deepEqual(
    contenders.map((result) => result.status).sort(),
    [201, 409, 409],
  );
  saved = await backend.db
    .prepare("SELECT number FROM orders ORDER BY number")
    .all();
  assert.equal(saved.results.length, 2);
  assert.equal(new Set(saved.results.map((row) => row.number)).size, 2);
  assert.equal(
    (
      await backend.db
        .prepare(
          "SELECT quantity FROM inventory WHERE product_id = ? AND variant_key = ?",
        )
        .bind(repeated.lines[0].productId, repeated.lines[0].variantKey)
        .first()
    ).quantity,
    0,
  );
  const publicContent = expectStatus(
    await backend.client().request("/api/content"),
    200,
  ).content;
  const sold = publicContent.products
    .find((product) => product.id === repeated.lines[0].productId)
    .variants.find((variant) => variant.key === repeated.lines[0].variantKey);
  assert.equal(sold.inStock, false);
  assert.equal("stockQuantity" in sold, false);
  expectStatus(await backend.client().request("/api/admin/orders"), 401);
  const orders = expectStatus(
    await admin.request("/api/admin/orders"),
    200,
  ).orders;
  assert.equal(orders.length, 2);
  const current = orders[0];
  expectStatus(
    await admin.request(`/api/admin/orders/${current.id}`, {
      method: "PATCH",
      json: {
        status: "confirmed",
        privateNote: "Local internal note",
        version: current.version,
      },
    }),
    200,
  );
  expectStatus(
    await admin.request(`/api/admin/orders/${current.id}`, {
      method: "PATCH",
      json: { status: "cancelled", privateNote: "", version: current.version },
    }),
    409,
  );
  state = await enableTestInventory(admin, 1);
  const delivery = orderInput(state, {
    method: "delivery",
    branchId: undefined,
    area: "Amman",
    address: "Local test address only",
  });
  expectStatus(
    await backend
      .client()
      .request("/api/orders", { method: "POST", json: delivery }),
    409,
  );
  delivery.totalMinor = 127373;
  const delivered = expectStatus(
    await backend
      .client()
      .request("/api/orders", { method: "POST", json: delivery }),
    201,
  ).order;
  assert.equal(
    delivered.totalMinor,
    127373,
    "Delivery total must include the current server fee in fils.",
  );
  assert.equal(delivered.deliveryFeeMinor, 2250);
});

test("maintenance requests retry safely and tracking requires matching identifiers without customer details", async (t) => {
  const backend = await withBackend(t);
  const admin = await setupAdmin(backend);
  const visitor = backend.client();
  const state = await adminContent(admin);
  const input = {
    idempotencyKey: crypto.randomUUID(),
    name: "Local Repair Customer",
    phone: "0790000001",
    device: "Local dummy device",
    issue: "screen",
    branchId: state.content.branches[0].id,
    details: "LOCAL PRIVATE CUSTOMER DETAILS",
  };
  const repeated = await Promise.all(
    Array.from({ length: 3 }, () =>
      visitor.request("/api/maintenance", { method: "POST", json: input }),
    ),
  );
  repeated.forEach((result) =>
    assert.ok([200, 201].includes(result.status), JSON.stringify(result.data)),
  );
  assert.equal(
    new Set(repeated.map((result) => result.data.request.id)).size,
    1,
  );
  const id = repeated[0].data.request.id;
  assert.equal(
    (await backend.db.prepare("SELECT COUNT(*) AS n FROM maintenance").first())
      .n,
    1,
  );
  expectStatus(
    await visitor.request("/api/maintenance", {
      method: "POST",
      json: { ...input, details: "Changed payload with reused key" },
    }),
    409,
  );
  assert.equal(
    expectStatus(
      await visitor.request("/api/maintenance/track", {
        method: "POST",
        json: { id, phone: "0790000002" },
      }),
      200,
    ).request,
    null,
  );
  expectStatus(
    await visitor.request("/api/maintenance/track", {
      method: "POST",
      json: { id },
    }),
    400,
  );
  const tracked = expectStatus(
    await visitor.request("/api/maintenance/track", {
      method: "POST",
      json: { id, phone: input.phone },
    }),
    200,
  );
  assert.ok(!JSON.stringify(tracked).includes(input.details));
  assert.ok(!JSON.stringify(tracked).includes(input.name));
  assert.ok(!JSON.stringify(tracked).includes(input.phone));
  const privateList = expectStatus(
    await admin.request("/api/admin/maintenance"),
    200,
  );
  const requests = privateList.requests;
  assert.equal(requests.length, 1);
  assert.equal(requests[0].name, input.name);
  expectStatus(
    await admin.request(`/api/admin/maintenance/${id}`, {
      method: "PATCH",
      json: {
        status: "repairing",
        privateNote: "LOCAL PRIVATE TECHNICIAN NOTE",
        version: requests[0].version,
      },
    }),
    200,
  );
  const trackedAgain = expectStatus(
    await visitor.request("/api/maintenance/track", {
      method: "POST",
      json: { id, phone: input.phone },
    }),
    200,
  );
  assert.equal(trackedAgain.request.status, "repairing");
  assert.ok(!JSON.stringify(trackedAgain).includes("TECHNICIAN"));
  expectStatus(
    await visitor.request(`/api/admin/maintenance/${id}`, {
      method: "PATCH",
      json: { status: "delivered", privateNote: "", version: 2 },
    }),
    401,
  );
});

test("photo API checks authentication, actual bytes, declared types and size; KV serves nosniff bytes", async (t) => {
  const backend = await withBackend(t);
  const admin = await setupAdmin(backend);
  const visitor = backend.client();
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAADElEQVQImWP4//8/AAX+Av5Y8msOAAAAAElFTkSuQmCC",
    "base64",
  );
  const jpeg = Buffer.from(
    "/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpAB//Z",
    "base64",
  );
  const webp = Buffer.from(
    "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAUAmJaQAA3AA/vz0AAA=",
    "base64",
  );
  const upload = (client, body, type = "image/png") =>
    client.request("/api/admin/photo", {
      method: "POST",
      body,
      headers: { "Content-Type": type },
    });
  expectStatus(await upload(visitor, png), 401);
  expectStatus(
    await upload(admin, Buffer.from('<svg onload="alert(1)"></svg>')),
    415,
  );
  expectStatus(await upload(admin, png, "image/jpeg"), 415);
  expectStatus(await upload(admin, png, "text/html"), 415);
  expectStatus(await upload(admin, Buffer.alloc(1024 * 1024 + 1, 1)), 413);
  const stored = expectStatus(await upload(admin, png), 201);
  assert.match(stored.url, /^\/api\/photo\/[a-f0-9-]+$/);
  const photo = await backend.mf.dispatchFetch(
    `https://flick.test${stored.url}`,
  );
  assert.equal(photo.status, 200);
  assert.equal(photo.headers.get("content-type"), "image/png");
  assert.equal(photo.headers.get("x-content-type-options"), "nosniff");
  assert.match(photo.headers.get("cache-control"), /immutable/);
  assert.deepEqual(Buffer.from(await photo.arrayBuffer()), png);
  for (const [fixture, type] of [
    [jpeg, "image/jpeg"],
    [webp, "image/webp"],
  ]) {
    const uploaded = expectStatus(await upload(admin, fixture, type), 201);
    const fetched = await backend.mf.dispatchFetch(
      `https://flick.test${uploaded.url}`,
    );
    assert.equal(fetched.headers.get("content-type"), type);
    assert.deepEqual(Buffer.from(await fetched.arrayBuffer()), fixture);
  }
  const head = await backend.mf.dispatchFetch(
    `https://flick.test${stored.url}`,
    { method: "HEAD" },
  );
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  assert.equal((await backend.media.list()).keys.length, 3);
  expectStatus(
    await visitor.request("/api/photo/00000000-0000-0000-0000-000000000000"),
    404,
  );
});

test("admin reset uses fake mail, fragment token, one-time expiry and revokes prior sessions", async (t) => {
  const backend = await withBackend(t, { email: true });
  const admin = await setupAdmin(backend);
  const visitor = backend.client();
  assert.equal(
    expectStatus(await visitor.request("/api/admin/session"), 200)
      .resetAvailable,
    true,
  );
  expectStatus(
    await visitor.request("/api/admin/forgot", { method: "POST", json: {} }),
    200,
  );
  assert.equal(backend.messages.length, 1);
  assert.deepEqual([backend.messages[0].body.to].flat(), [
    "owner@example.invalid",
  ]);
  const mailed = backend.messages[0].body.text || backend.messages[0].body.html;
  assert.match(mailed, /https:\/\/flick\.test\/admin\/reset#token=/);
  const token = mailed.match(/#token=([A-Za-z0-9_-]+)/)[1];
  const resetRows = await backend.db
    .prepare("SELECT token_hash FROM password_resets")
    .all();
  assert.equal(resetRows.results.length, 1);
  assert.notEqual(resetRows.results[0].token_hash, token);
  expectStatus(
    await visitor.request("/api/admin/reset", {
      method: "POST",
      json: { token, password: "ResetLocalPassword!789" },
    }),
    200,
  );
  expectStatus(
    await visitor.request("/api/admin/reset", {
      method: "POST",
      json: { token, password: "ReuseLocalPassword!789" },
    }),
    400,
  );
  assert.equal(
    expectStatus(await admin.request("/api/admin/session"), 200).authenticated,
    false,
  );
  expectStatus(
    await visitor.request("/api/admin/login", {
      method: "POST",
      json: { password: dummyPassword },
    }),
    401,
  );
  expectStatus(
    await visitor.request("/api/admin/login", {
      method: "POST",
      json: { password: "ResetLocalPassword!789" },
    }),
    200,
  );
  expectStatus(
    await visitor.request("/api/admin/forgot", { method: "POST", json: {} }),
    200,
  );
  assert.equal(backend.messages.length, 2);
  const expiredToken = (
    backend.messages[1].body.text || backend.messages[1].body.html
  ).match(/#token=([A-Za-z0-9_-]+)/)[1];
  await backend.db
    .prepare("UPDATE password_resets SET expires_at = ?")
    .bind(Date.now() - 1)
    .run();
  expectStatus(
    await visitor.request("/api/admin/reset", {
      method: "POST",
      json: { token: expiredToken, password: "ExpiredLocalPassword!789" },
    }),
    400,
  );
  expectStatus(
    await visitor.request("/api/admin/login", {
      method: "POST",
      json: { password: "ResetLocalPassword!789" },
    }),
    200,
  );
  for (let i = 0; i < 4; i++) {
    const response = expectStatus(
      await backend
        .client()
        .request("/api/admin/forgot", { method: "POST", json: {} }),
      200,
    );
    assert.deepEqual(
      response,
      { ok: true },
      "Forgot responses must not return a reset token.",
    );
  }
  expectStatus(
    await backend
      .client()
      .request("/api/admin/forgot", { method: "POST", json: {} }),
    429,
  );
  assert.equal(
    backend.messages.length,
    6,
    "Daily reset budget must persist across different client sessions.",
  );
  assert.ok(
    (
      await backend.db
        .prepare("SELECT COUNT(*) AS n FROM password_resets")
        .first()
    ).n <= 3,
  );
});

test("failed fake mail delivery removes its reset token and returns a safe recoverable error", async (t) => {
  const backend = await withBackend(t, { email: true, emailStatus: 503 });
  const admin = await setupAdmin(backend);
  const result = await backend
    .client()
    .request("/api/admin/forgot", { method: "POST", json: {} });
  assert.deepEqual(expectStatus(result, 503), { error: "email-unavailable" });
  assert.equal(backend.messages.length, 1);
  assert.equal(
    (
      await backend.db
        .prepare("SELECT COUNT(*) AS n FROM password_resets")
        .first()
    ).n,
    0,
  );
  assert.equal(
    expectStatus(await admin.request("/api/admin/session"), 200).authenticated,
    true,
  );
  assert.ok(!result.text.includes("Local fake provider"));
});
