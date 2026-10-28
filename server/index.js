import seed from "./seed.json";
import {
  DomainError,
  fail,
  cleanContent,
  publicContent,
  quoteOrder,
  customer,
  text,
  id,
  normalizePhone,
  validatePassword,
} from "../shared/domain.js";
import { renderPage, unavailablePage } from "./render.js";
import { detectedImage } from "./images.js";

const SESSION_MS = 12 * 60 * 60 * 1000;
const RESET_MS = 30 * 60 * 1000;
const ITERATIONS = 100000;
const encoder = new TextEncoder();
const orderStatuses = ["new", "confirmed", "ready", "delivered", "cancelled"];
const maintenanceStatuses = [
  "new",
  "received",
  "repairing",
  "ready",
  "delivered",
  "cancelled",
];
const stmt = (env, sql, ...args) => env.DB.prepare(sql).bind(...args);
const hex = (bytes) =>
  [...new Uint8Array(bytes)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
const random = () => hex(crypto.getRandomValues(new Uint8Array(32)));
const digest = async (value) =>
  hex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
const same = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
};

function response(value, status = 200, extra = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
      ...extra,
    },
  });
}
function csrf(request) {
  if (
    request.headers.get("Origin") !== new URL(request.url).origin ||
    request.headers.get("X-Flick-CSRF") !== "1"
  )
    fail("invalid-origin", 403);
  const site = request.headers.get("Sec-Fetch-Site");
  if (site && site !== "same-origin" && site !== "none")
    fail("invalid-origin", 403);
}
async function bytes(request, cap) {
  const declared = request.headers.get("Content-Length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > cap))
    fail("body-too-large", 413);
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  const deadline = Date.now() + 8000;
  try {
    for (;;) {
      let timer;
      try {
        const { value, done } = await Promise.race([
          reader.read(),
          new Promise((_, reject) => {
            timer = setTimeout(
              () => reject(new DomainError("request-timeout", 408)),
              Math.max(1, deadline - Date.now()),
            );
          }),
        ]);
        if (done) break;
        size += value.byteLength;
        if (size > cap) {
          reader.cancel().catch(() => {});
          fail("body-too-large", 413);
        }
        chunks.push(value);
      } finally {
        clearTimeout(timer);
      }
    }
  } catch (error) {
    reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
  const result = new Uint8Array(size);
  let at = 0;
  for (const chunk of chunks) {
    result.set(chunk, at);
    at += chunk.byteLength;
  }
  return result;
}
async function json(request, cap = 16384) {
  if (
    request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    fail("json-required", 415);
  let value;
  try {
    value = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(
        await bytes(request, cap),
      ),
    );
  } catch (error) {
    if (error instanceof DomainError) throw error;
    fail("invalid-json");
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    fail("invalid-json");
  return value;
}
function ipGroup(ip) {
  if (!ip.includes(":")) return ip;
  const halves = ip.toLowerCase().split("::");
  if (halves.length > 2) return "invalid-ip";
  const left = halves[0] ? halves[0].split(":") : [],
    right = halves[1] ? halves[1].split(":") : [];
  const parts =
    halves.length === 2
      ? [
          ...left,
          ...Array(Math.max(0, 8 - left.length - right.length)).fill("0"),
          ...right,
        ]
      : left;
  if (parts.length !== 8 || parts.some((p) => !/^[0-9a-f]{1,4}$/.test(p)))
    return "invalid-ip";
  return (
    parts
      .slice(0, 3)
      .map((p) => p.padStart(4, "0"))
      .join("") + parts[3].padStart(4, "0").slice(0, 2)
  ); // /56
}
async function limit(env, key, max, windowMs) {
  const now = Date.now(),
    bucket = Math.floor(now / windowMs),
    expiry = (bucket + 1) * windowMs;
  const row = await stmt(
    env,
    "INSERT INTO rate_limits(key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
    `${key}:${bucket}`,
    expiry,
  ).first();
  if (row.count > max) fail("rate-limited", 429);
}
async function limits(
  request,
  env,
  scope,
  ipMax,
  globalMax,
  windowMs = 3600000,
) {
  const ip = await digest(
    ipGroup(request.headers.get("CF-Connecting-IP") || "local"),
  );
  await limit(env, `${scope}:ip:${ip}`, ipMax, windowMs);
  if (globalMax) await limit(env, `${scope}:global`, globalMax, windowMs);
}
function requirePepper(env) {
  if (typeof env.AUTH_PEPPER !== "string" || env.AUTH_PEPPER.length < 32)
    fail("auth-unavailable", 503);
  return env.AUTH_PEPPER;
}
async function passwordHash(env, password, salt = random().slice(0, 32)) {
  // AUTH_PEPPER is a separate runtime secret, never stored with the D1 hash.
  // Workerd's native PBKDF2 cap is 100,000. HMAC prevents a D1-only leak from
  // enabling offline password guesses. Real deployed CPU still needs measurement.
  const pepperKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(requirePepper(env)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const peppered = await crypto.subtle.sign(
    "HMAC",
    pepperKey,
    encoder.encode(password),
  );
  const material = await crypto.subtle.importKey(
    "raw",
    peppered,
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encoder.encode(salt),
      iterations: ITERATIONS,
    },
    material,
    256,
  );
  return `pbkdf2-sha256-peppered$${ITERATIONS}$${salt}$${hex(hash)}`;
}
async function passwordMatches(env, password, stored) {
  if (typeof password !== "string" || password.length > 200) return false;
  const parts = stored.split("$");
  if (
    parts.length !== 4 ||
    parts[0] !== "pbkdf2-sha256-peppered" ||
    Number(parts[1]) !== ITERATIONS
  )
    return false;
  return same(await passwordHash(env, password, parts[2]), stored);
}
function cookie(value, request, age = SESSION_MS / 1000) {
  // Secure cookies also work on localhost in modern browsers; no insecure production override.
  return `flick_admin=${value}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
}
async function authenticated(request, env, required = true) {
  if (required) requirePepper(env);
  else if (typeof env.AUTH_PEPPER !== "string" || env.AUTH_PEPPER.length < 32)
    return null;
  const token = /(?:^|;\s*)flick_admin=([a-f0-9]{64})(?:;|$)/.exec(
    request.headers.get("Cookie") || "",
  )?.[1];
  const row = token
    ? await stmt(
        env,
        "SELECT s.token_hash,s.generation FROM sessions s JOIN admin a ON a.id=1 AND a.generation=s.generation WHERE s.token_hash=? AND s.expires_at>?",
        await digest(token),
        Date.now(),
      ).first()
    : null;
  if (!row && required) fail("unauthorized", 401);
  return row;
}
async function newSession(env, generation) {
  const token = random();
  await stmt(
    env,
    "INSERT INTO sessions(token_hash,generation,expires_at) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM admin WHERE id=1 AND generation=?)",
    await digest(token),
    generation,
    Date.now() + SESSION_MS,
    generation,
  ).run();
  return token;
}
const resetAvailable = (env) =>
  !!(
    env.ADMIN_EMAIL &&
    env.RESEND_API_KEY &&
    env.MAIL_FROM &&
    env.SITE_URL &&
    typeof env.AUTH_PEPPER === "string" &&
    env.AUTH_PEPPER.length >= 32
  );
async function bootstrap(env) {
  // Insert the intentional source catalog once. Never import browser storage or demo orders.
  if (await stmt(env, "SELECT id FROM content WHERE id=1").first()) return;
  const content = cleanContent(seed),
    nonce = random();
  const statements = [
    stmt(
      env,
      "INSERT OR IGNORE INTO content(id,json,version,stock_rev,write_nonce) VALUES (1,?,1,1,?)",
      JSON.stringify(content),
      nonce,
    ),
    stmt(
      env,
      `INSERT OR IGNORE INTO inventory(product_id,variant_key,quantity,available) SELECT json_extract(p.value,'$.id'),json_extract(v.value,'$.key'),json_extract(v.value,'$.stockQuantity'),CASE WHEN json_extract(v.value,'$.inStock')=1 AND json_extract(v.value,'$.soldOut')!=1 THEN 1 ELSE 0 END FROM json_each(?,'$.products') p,json_each(p.value,'$.variants') v WHERE EXISTS(SELECT 1 FROM content WHERE id=1 AND write_nonce=?)`,
      JSON.stringify(content),
      nonce,
    ),
  ];
  await env.DB.batch(statements);
}
async function catalog(env) {
  await bootstrap(env);
  const result = await env.DB.batch([
    stmt(env, "SELECT json,version,stock_rev FROM content WHERE id=1"),
    stmt(
      env,
      "SELECT product_id,variant_key,quantity,available FROM inventory",
    ),
  ]);
  const row = result[0].results[0],
    content = JSON.parse(row.json),
    inventory = new Map(
      result[1].results.map((v) => [
        JSON.stringify([v.product_id, v.variant_key]),
        v,
      ]),
    );
  for (const p of content.products)
    for (const v of p.variants) {
      const stock = inventory.get(JSON.stringify([p.id, v.key]));
      v.stockQuantity = stock ? stock.quantity : 0;
      v.inStock = !!stock && !!stock.available && stock.quantity !== 0;
    }
  return {
    content,
    version: `${row.version}:${row.stock_rev}`,
    catalogVersion: row.version,
    stockRevision: row.stock_rev,
  };
}
const actorGate =
  "EXISTS(SELECT 1 FROM sessions s JOIN admin a ON a.id=1 AND a.generation=s.generation WHERE s.token_hash=? AND s.generation=? AND s.expires_at>?)";
const actorArgs = (actor) => [actor.token_hash, actor.generation, Date.now()];
async function saveCatalog(env, body, actor) {
  const match = /^(\d+):(\d+)$/.exec(body.version);
  if (!match) fail("version-required", 409);
  const content = cleanContent(body.content),
    nonce = random();
  const gate = "EXISTS(SELECT 1 FROM content WHERE id=1 AND write_nonce=?)";
  const statements = [
    stmt(
      env,
      `UPDATE content SET json=?,version=version+1,stock_rev=stock_rev+1,write_nonce=? WHERE id=1 AND version=? AND stock_rev=? AND ${actorGate}`,
      JSON.stringify(content),
      nonce,
      Number(match[1]),
      Number(match[2]),
      ...actorArgs(actor),
    ),
    stmt(env, `DELETE FROM inventory WHERE ${gate}`, nonce),
    stmt(
      env,
      `INSERT INTO inventory(product_id,variant_key,quantity,available) SELECT json_extract(p.value,'$.id'),json_extract(v.value,'$.key'),json_extract(v.value,'$.stockQuantity'),CASE WHEN json_extract(v.value,'$.inStock')=1 AND json_extract(v.value,'$.soldOut')!=1 THEN 1 ELSE 0 END FROM json_each(?,'$.products') p,json_each(p.value,'$.variants') v WHERE ${gate}`,
      JSON.stringify(content),
      nonce,
    ),
  ];
  const result = await env.DB.batch(statements);
  if (!result[0].meta.changes) fail("content-conflict", 409);
  return {
    content,
    version: `${Number(match[1]) + 1}:${Number(match[2]) + 1}`,
  };
}
function requestKey(body) {
  if (
    typeof body.idempotencyKey !== "string" ||
    !/^[a-zA-Z0-9_-]{16,100}$/.test(body.idempotencyKey)
  )
    fail("invalid-idempotency-key");
  return body.idempotencyKey;
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .filter((k) => k !== "version" && k !== "idempotencyKey")
        .map((k) => [k, canonical(value[k])]),
    );
  return value;
}
async function orderObject(env, row, admin = false, suppliedLines) {
  const lines =
    suppliedLines ||
    (
      await stmt(
        env,
        "SELECT product_id,variant_key,name,variant,unit_minor,quantity FROM order_lines WHERE order_number=? ORDER BY position",
        row.number,
      ).all()
    ).results;
  const result = {
    id: `F-${row.number}`,
    createdAt: row.created_at,
    ...JSON.parse(row.customer_json),
    lines: lines.map((l) => ({
      productId: l.product_id,
      variantKey: l.variant_key,
      name: l.name,
      variant: l.variant,
      unit: l.unit_minor / 1000,
      unitMinor: l.unit_minor,
      qty: l.quantity,
    })),
    total: row.total_minor / 1000,
    totalMinor: row.total_minor,
    deliveryFeeMinor: row.delivery_fee_minor,
    status: row.status,
  };
  if (admin) {
    result.privateNote = row.private_note;
    result.version = row.version;
  }
  return result;
}
function maintenanceObject(row, admin = false) {
  const result = {
    id: `M-${row.number}`,
    createdAt: row.created_at,
    ...JSON.parse(row.customer_json),
    status: row.status,
  };
  if (admin) {
    result.privateNote = row.private_note;
    result.version = row.version;
  }
  return result;
}
async function placeOrder(request, env, body) {
  if (body?.consent !== true) fail("consent-required");
  const key = requestKey(body),
    hash = await digest(JSON.stringify(canonical(body)));
  const previous = await stmt(
    env,
    "SELECT * FROM orders WHERE request_key=?",
    key,
  ).first();
  if (previous) {
    if (!same(previous.payload_hash, hash)) fail("idempotency-conflict", 409);
    return response({ order: await orderObject(env, previous) });
  }
  await limits(request, env, "orders-hour", 10, 100);
  await limits(request, env, "orders-day", 50, 1000, 86400000);
  const snapshot = await catalog(env),
    { content } = snapshot;
  if (!content.settings.ordersEnabled) fail("ordering-disabled", 403);
  if (body.version !== snapshot.version) fail("content-conflict", 409);
  const details = customer(body, content),
    quote = quoteOrder(content, body),
    nonce = random();
  const linesJson = JSON.stringify(quote.lines);
  const checks = `NOT EXISTS(SELECT 1 FROM json_each(?) l LEFT JOIN inventory i ON i.product_id=json_extract(l.value,'$.productId') AND i.variant_key=json_extract(l.value,'$.variantKey') WHERE i.product_id IS NULL OR i.available!=1 OR (i.quantity IS NOT NULL AND i.quantity<json_extract(l.value,'$.qty')))`;
  const statements = [
    stmt(
      env,
      `INSERT INTO orders(request_key,payload_hash,nonce,created_at,customer_json,total_minor,delivery_fee_minor) SELECT ?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM content WHERE id=1 AND version=? AND stock_rev=?) AND ${checks} ON CONFLICT(request_key) DO NOTHING`,
      key,
      hash,
      nonce,
      new Date().toISOString(),
      JSON.stringify(details),
      quote.totalMinor,
      quote.deliveryFeeMinor,
      snapshot.catalogVersion,
      snapshot.stockRevision,
      linesJson,
    ),
    stmt(
      env,
      `INSERT INTO order_lines(order_number,position,product_id,variant_key,name,variant,unit_minor,quantity) SELECT o.number,CAST(l.key AS INTEGER),json_extract(l.value,'$.productId'),json_extract(l.value,'$.variantKey'),json_extract(l.value,'$.name'),json_extract(l.value,'$.variant'),json_extract(l.value,'$.unitMinor'),json_extract(l.value,'$.qty') FROM orders o,json_each(?) l WHERE o.request_key=? AND o.nonce=?`,
      linesJson,
      key,
      nonce,
    ),
    stmt(
      env,
      `UPDATE inventory SET quantity=quantity-(SELECT json_extract(l.value,'$.qty') FROM json_each(?) l WHERE json_extract(l.value,'$.productId')=inventory.product_id AND json_extract(l.value,'$.variantKey')=inventory.variant_key) WHERE quantity IS NOT NULL AND EXISTS(SELECT 1 FROM json_each(?) l WHERE json_extract(l.value,'$.productId')=inventory.product_id AND json_extract(l.value,'$.variantKey')=inventory.variant_key) AND EXISTS(SELECT 1 FROM orders WHERE request_key=? AND nonce=?)`,
      linesJson,
      linesJson,
      key,
      nonce,
    ),
  ];
  statements.push(
    stmt(
      env,
      "UPDATE content SET stock_rev=stock_rev+1 WHERE id=1 AND EXISTS(SELECT 1 FROM orders WHERE request_key=? AND nonce=?)",
      key,
      nonce,
    ),
  );
  await env.DB.batch(statements);
  const row = await stmt(
    env,
    "SELECT * FROM orders WHERE request_key=?",
    key,
  ).first();
  if (!row) fail("content-conflict", 409);
  if (!same(row.payload_hash, hash)) fail("idempotency-conflict", 409);
  return response({ order: await orderObject(env, row) }, 201);
}
async function placeMaintenance(request, env, body) {
  if (body?.consent !== true) fail("consent-required");
  const key = requestKey(body),
    hash = await digest(JSON.stringify(canonical(body)));
  const previous = await stmt(
    env,
    "SELECT * FROM maintenance WHERE request_key=?",
    key,
  ).first();
  if (previous) {
    if (!same(previous.payload_hash, hash)) fail("idempotency-conflict", 409);
    return response({ request: maintenanceObject(previous) });
  }
  await limits(request, env, "maintenance-hour", 10, 100);
  await limits(request, env, "maintenance-day", 50, 1000, 86400000);
  const { content } = await catalog(env),
    details = customer(body, content, true);
  await stmt(
    env,
    "INSERT INTO maintenance(request_key,payload_hash,created_at,customer_json) VALUES (?,?,?,?) ON CONFLICT(request_key) DO NOTHING",
    key,
    hash,
    new Date().toISOString(),
    JSON.stringify(details),
  ).run();
  const row = await stmt(
    env,
    "SELECT * FROM maintenance WHERE request_key=?",
    key,
  ).first();
  if (!same(row.payload_hash, hash)) fail("idempotency-conflict", 409);
  return response({ request: maintenanceObject(row) }, 201);
}
async function sendReset(env, token) {
  const url = new URL("/admin/reset", env.SITE_URL);
  if (
    url.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(url.hostname)
  )
    fail("email-unavailable", 503);
  url.hash = `token=${token}`;
  const mail = {
    from: env.MAIL_FROM,
    to: [env.ADMIN_EMAIL],
    subject: "FLiCK — استعادة كلمة مرور الإدارة",
    text: `Use this one-time link within 30 minutes to reset your FLiCK admin password:\n${url.href}\nIgnore this message if you did not request it.`,
  };
  const outgoing = new Request("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mail),
    signal: AbortSignal.timeout(8000),
  });
  const result = env.MAILER
    ? await env.MAILER.fetch(outgoing)
    : await fetch(outgoing);
  if (!result.ok) fail("email-unavailable", 503);
}
async function authRoute(request, env, path) {
  if (path === "/api/admin/session" && request.method === "GET")
    return response({
      authenticated: !!(await authenticated(request, env, false)),
      setupRequired: !(await stmt(
        env,
        "SELECT id FROM admin WHERE id=1",
      ).first()),
      resetAvailable: resetAvailable(env),
    });
  if (request.method !== "POST") return null;
  if (
    !["setup", "login", "logout", "password", "forgot", "reset"].some(
      (s) => path === `/api/admin/${s}`,
    )
  )
    return null;
  csrf(request);
  if (path === "/api/admin/logout") {
    const session = await authenticated(request, env, false);
    if (session)
      await stmt(
        env,
        "DELETE FROM sessions WHERE token_hash=?",
        session.token_hash,
      ).run();
    return response({ ok: true }, 200, {
      "Set-Cookie": cookie("", request, 0),
    });
  }
  requirePepper(env);
  const body = await json(request, 4096);
  if (path === "/api/admin/setup") {
    await limits(request, env, "setup", 5, 30, 900000);
    if (!env.SETUP_CODE || env.SETUP_CODE.length < 16)
      fail("setup-unavailable", 503);
    if (
      typeof body.setupCode !== "string" ||
      !same(await digest(body.setupCode), await digest(env.SETUP_CODE))
    )
      fail("invalid-credentials", 401);
    const password = validatePassword(body.password);
    const result = await stmt(
      env,
      "INSERT OR IGNORE INTO admin(id,password_hash,generation) VALUES (1,?,1)",
      await passwordHash(env, password),
    ).run();
    if (!result.meta.changes) fail("already-configured", 409);
    const token = await newSession(env, 1);
    return response({ authenticated: true }, 201, {
      "Set-Cookie": cookie(token, request),
    });
  }
  if (path === "/api/admin/login") {
    await limits(request, env, "login", 10, 100, 900000);
    const admin = await stmt(env, "SELECT * FROM admin WHERE id=1").first();
    // A fixed-cost derivation also covers the not-yet-configured case.
    const matched = await passwordMatches(
      env,
      body.password,
      admin?.password_hash ||
        `pbkdf2-sha256-peppered$${ITERATIONS}$00000000000000000000000000000000$${"0".repeat(64)}`,
    );
    if (!admin || !matched) fail("invalid-credentials", 401);
    const token = await newSession(env, admin.generation);
    return response({ authenticated: true }, 200, {
      "Set-Cookie": cookie(token, request),
    });
  }
  if (path === "/api/admin/password") {
    const session = await authenticated(request, env);
    await limits(request, env, "password", 5, 30, 900000);
    const admin = await stmt(env, "SELECT * FROM admin WHERE id=1").first();
    if (
      !(await passwordMatches(env, body.currentPassword, admin.password_hash))
    )
      fail("invalid-credentials", 401);
    const hash = await passwordHash(env, validatePassword(body.newPassword));
    const result = await env.DB.batch([
      stmt(
        env,
        "UPDATE admin SET password_hash=?,generation=generation+1 WHERE id=1 AND generation=?",
        hash,
        session.generation,
      ),
      stmt(env, "DELETE FROM sessions WHERE generation<=?", session.generation),
      stmt(
        env,
        "DELETE FROM password_resets WHERE generation<=?",
        session.generation,
      ),
    ]);
    if (!result[0].meta.changes) fail("session-expired", 401);
    return response({ ok: true }, 200, {
      "Set-Cookie": cookie("", request, 0),
    });
  }
  if (path === "/api/admin/forgot") {
    await limits(request, env, "reset-hour", 3, 12);
    await limit(env, "reset-day", 6, 86400000);
    if (!resetAvailable(env)) fail("reset-unavailable", 503);
    const admin = await stmt(
      env,
      "SELECT generation FROM admin WHERE id=1",
    ).first();
    if (admin) {
      const token = random(),
        hash = await digest(token),
        now = Date.now();
      await stmt(
        env,
        "INSERT INTO password_resets(token_hash,generation,expires_at,created_at) VALUES (?,?,?,?)",
        hash,
        admin.generation,
        now + RESET_MS,
        now,
      ).run();
      try {
        await sendReset(env, token);
      } catch {
        await stmt(
          env,
          "DELETE FROM password_resets WHERE token_hash=?",
          hash,
        ).run();
        fail("email-unavailable", 503);
      }
      await stmt(
        env,
        "DELETE FROM password_resets WHERE expires_at<=? OR token_hash NOT IN(SELECT token_hash FROM password_resets ORDER BY created_at DESC LIMIT 3)",
        now,
      ).run();
    }
    return response({ ok: true });
  }
  if (path === "/api/admin/reset") {
    await limits(request, env, "reset-use", 10, 100);
    if (typeof body.token !== "string" || !/^[a-f0-9]{64}$/.test(body.token))
      fail("invalid-reset", 400);
    const now = Date.now(),
      tokenHash = await digest(body.token);
    const reset = await stmt(
      env,
      "SELECT r.generation FROM password_resets r JOIN admin a ON a.id=1 AND a.generation=r.generation WHERE token_hash=? AND expires_at>?",
      tokenHash,
      now,
    ).first();
    if (!reset) fail("invalid-reset", 400);
    const hash = await passwordHash(env, validatePassword(body.password));
    const result = await env.DB.batch([
      stmt(
        env,
        "UPDATE admin SET password_hash=?,generation=generation+1 WHERE id=1 AND generation=? AND EXISTS(SELECT 1 FROM password_resets WHERE token_hash=? AND expires_at>?)",
        hash,
        reset.generation,
        tokenHash,
        Date.now(),
      ),
      stmt(env, "DELETE FROM sessions WHERE generation<=?", reset.generation),
      stmt(
        env,
        "DELETE FROM password_resets WHERE generation<=?",
        reset.generation,
      ),
    ]);
    if (!result[0].meta.changes) fail("invalid-reset", 400);
    return response({ ok: true }, 200, {
      "Set-Cookie": cookie("", request, 0),
    });
  }
  return null;
}
async function adminRoute(request, env, path) {
  const actor = await authenticated(request, env);
  if (request.method !== "GET") csrf(request);
  if (path === "/api/admin/content") {
    if (request.method === "GET") {
      const { content, version } = await catalog(env);
      return response({ content, version });
    }
    if (request.method === "PUT")
      return response(
        await saveCatalog(env, await json(request, 2 * 1024 * 1024), actor),
      );
  }
  for (const [segment, table, prefix, statuses] of [
    ["orders", "orders", "F", orderStatuses],
    ["maintenance", "maintenance", "M", maintenanceStatuses],
  ]) {
    if (path === `/api/admin/${segment}` && request.method === "GET") {
      const beforeText = new URL(request.url).searchParams.get("before");
      const before =
        beforeText == null ? Number.MAX_SAFE_INTEGER : Number(beforeText);
      if (!Number.isSafeInteger(before) || before < 1) fail("invalid-cursor");
      const rows = (
        await stmt(
          env,
          `SELECT * FROM ${table} WHERE number<? AND deleted_at IS NULL ORDER BY number DESC LIMIT 501`,
          before,
        ).all()
      ).results;
      const hasMore = rows.length > 500;
      rows.length = Math.min(rows.length, 500);
      let values;
      if (table === "orders" && rows.length) {
        const allLines = (
          await stmt(
            env,
            "SELECT l.* FROM order_lines l JOIN orders o ON o.number=l.order_number WHERE o.deleted_at IS NULL AND l.order_number>=? AND l.order_number<? ORDER BY l.order_number,l.position",
            rows.at(-1).number,
            before,
          ).all()
        ).results;
        const grouped = new Map();
        for (const line of allLines) {
          if (!grouped.has(line.order_number))
            grouped.set(line.order_number, []);
          grouped.get(line.order_number).push(line);
        }
        values = await Promise.all(
          rows.map((row) =>
            orderObject(env, row, true, grouped.get(row.number) || []),
          ),
        );
      } else values = rows.map((row) => maintenanceObject(row, true));
      return response({
        [table === "orders" ? "orders" : "requests"]: values,
        nextBefore: hasMore ? rows.at(-1).number : null,
      });
    }
    const match = new RegExp(`^/api/admin/${segment}/${prefix}-(\\d+)$`).exec(
      path,
    );
    if (match && request.method === "DELETE") {
      const body = await json(request, 4096);
      if (!Number.isSafeInteger(body.version) || body.version < 1)
        fail("version-required", 409);
      const result = await stmt(
        env,
        `UPDATE ${table} SET deleted_at=?,version=version+1 WHERE number=? AND version=? AND deleted_at IS NULL AND ${actorGate}`,
        Date.now(),
        Number(match[1]),
        body.version,
        ...actorArgs(actor),
      ).run();
      if (!result.meta.changes) fail("record-conflict", 409);
      return response({ ok: true });
    }
    if (match && request.method === "PATCH") {
      const body = await json(request);
      if (
        !Number.isSafeInteger(body.version) ||
        !statuses.includes(body.status)
      )
        fail("invalid-status");
      const note = text(body.privateNote, 3000),
        number = Number(match[1]);
      const result = await stmt(
        env,
        `UPDATE ${table} SET status=?,private_note=?,version=version+1 WHERE number=? AND version=? AND deleted_at IS NULL AND ${actorGate}`,
        body.status,
        note,
        number,
        body.version,
        ...actorArgs(actor),
      ).run();
      if (!result.meta.changes) fail("record-conflict", 409);
      const row = await stmt(
        env,
        `SELECT * FROM ${table} WHERE number=?`,
        number,
      ).first();
      return response({
        [table === "orders" ? "order" : "request"]:
          table === "orders"
            ? await orderObject(env, row, true)
            : maintenanceObject(row, true),
      });
    }
  }
  if (path === "/api/admin/photo" && request.method === "POST") {
    await limits(request, env, "photo", 60, 100);
    const data = await bytes(request, 1000000),
      type = detectedImage(data);
    const declared = request.headers
      .get("Content-Type")
      ?.split(";")[0]
      .trim()
      .toLowerCase();
    if (!type || declared !== type) fail("invalid-image", 415);
    await authenticated(request, env);
    const key = crypto.randomUUID();
    await env.MEDIA.put(key, data, { metadata: { contentType: type } });
    return response({ url: `/api/photo/${key}` }, 201);
  }
  fail("not-found", 404);
}
async function api(request, env) {
  if (!env.DB || !env.MEDIA) fail("backend-unavailable", 503);
  const path = new URL(request.url).pathname;
  const auth = await authRoute(request, env, path);
  if (auth) return auth;
  if (path.startsWith("/api/admin/")) return adminRoute(request, env, path);
  if (path === "/api/content" && request.method === "GET") {
    const { content, version } = await catalog(env);
    return response({
      content: publicContent(content),
      version,
      ordersEnabled: content.settings.ordersEnabled,
      resetAvailable: resetAvailable(env),
    });
  }
  const photoMatch = /^\/api\/photo\/([a-f0-9-]{36})$/.exec(path);
  if (photoMatch && ["GET", "HEAD"].includes(request.method)) {
    const image = await env.MEDIA.getWithMetadata(photoMatch[1], {
      type: "arrayBuffer",
    });
    if (
      !image.value ||
      !["image/png", "image/jpeg", "image/webp"].includes(
        image.metadata?.contentType,
      )
    )
      fail("not-found", 404);
    return new Response(request.method === "HEAD" ? null : image.value, {
      headers: {
        "Content-Type": image.metadata.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'",
        "X-Robots-Tag": "noindex",
      },
    });
  }
  if (request.method === "POST") {
    csrf(request);
    if (path === "/api/orders")
      return placeOrder(request, env, await json(request, 32768));
    if (path === "/api/maintenance")
      return placeMaintenance(request, env, await json(request, 16384));
    if (path === "/api/maintenance/track") {
      await limits(request, env, "tracking", 20, 500, 900000);
      const body = await json(request, 4096),
        identifier = text(body.id, 30).toUpperCase().replace(/^M?-?/, "M-");
      if (!/^M-\d{4,15}$/.test(identifier)) fail("invalid-tracking");
      const phone = normalizePhone(body.phone),
        row = await stmt(
          env,
          "SELECT number,status,customer_json FROM maintenance WHERE number=? AND deleted_at IS NULL",
          Number(identifier.slice(2)),
        ).first();
      if (!row || !same(JSON.parse(row.customer_json).phone, phone))
        return response({ request: null });
      return response({
        request: {
          id: `M-${row.number}`,
          status: row.status,
          device: JSON.parse(row.customer_json).device,
        },
      });
    }
  }
  fail("not-found", 404);
}
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api" || url.pathname.startsWith("/api/"))
        return await api(request, env);
      if (!env.ASSETS) return unavailablePage();
      let result;
      if (
        url.pathname.startsWith("/assets/") ||
        /\.(?:css|js|mjs|png|jpe?g|webp|svg|ico|woff2?)$/i.test(url.pathname)
      )
        result = await env.ASSETS.fetch(request);
      else {
        if (!["GET", "HEAD"].includes(request.method))
          return response({ error: "method-not-allowed" }, 405, {
            Allow: "GET, HEAD",
          });
        try {
          const { content, version } = await catalog(env);
          const asset = await env.ASSETS.fetch(
            new Request(new URL("/index.html", request.url)),
          );
          if (!asset.ok) return unavailablePage();
          result = renderPage(await asset.text(), request, {
            content: publicContent(content),
            version,
            ordersEnabled: content.settings.ordersEnabled,
            resetAvailable: resetAvailable(env),
          });
        } catch {
          return unavailablePage();
        }
      }
      const headers = new Headers(result.headers);
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=()",
      );
      headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
      );
      if (/^\/(?:admin|account|reset)(?:\/|$)/.test(url.pathname)) {
        headers.set("X-Robots-Tag", "noindex, nofollow");
        headers.set("Cache-Control", "no-store");
        headers.set("Referrer-Policy", "no-referrer");
      }
      return new Response(request.method === "HEAD" ? null : result.body, {
        status: result.status,
        headers,
      });
    } catch (error) {
      if (error instanceof DomainError)
        return response({ error: error.code }, error.status);
      // Do not expose SQL, passwords, reset tokens, customer fields or provider output.
      return response({ error: "temporarily-unavailable" }, 503);
    }
  },
  async scheduled(event, env, ctx) {
    const now = Date.now();
    ctx.waitUntil(
      env.DB.batch([
        stmt(env, "DELETE FROM sessions WHERE expires_at<=?", now),
        stmt(env, "DELETE FROM password_resets WHERE expires_at<=?", now),
        stmt(env, "DELETE FROM rate_limits WHERE expires_at<=?", now),
      ]),
    );
  },
};
