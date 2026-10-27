PRAGMA foreign_keys = ON;
CREATE TABLE content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  json TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  stock_rev INTEGER NOT NULL DEFAULT 1,
  write_nonce TEXT NOT NULL DEFAULT ''
);
CREATE TABLE inventory (
  product_id TEXT NOT NULL,
  variant_key TEXT NOT NULL,
  quantity INTEGER CHECK (quantity IS NULL OR quantity >= 0),
  available INTEGER NOT NULL CHECK (available IN (0,1)),
  PRIMARY KEY (product_id, variant_key)
);
CREATE TABLE admin (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  password_hash TEXT NOT NULL,
  generation INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  generation INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE password_resets (
  token_hash TEXT PRIMARY KEY,
  generation INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE orders (
  number INTEGER PRIMARY KEY AUTOINCREMENT,
  request_key TEXT NOT NULL UNIQUE,
  payload_hash TEXT NOT NULL,
  nonce TEXT NOT NULL,
  created_at TEXT NOT NULL,
  customer_json TEXT NOT NULL,
  total_minor INTEGER NOT NULL CHECK (total_minor >= 0),
  delivery_fee_minor INTEGER,
  status TEXT NOT NULL DEFAULT 'new',
  private_note TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1
);
INSERT INTO sqlite_sequence(name, seq) VALUES ('orders', 1000);
CREATE TABLE order_lines (
  order_number INTEGER NOT NULL REFERENCES orders(number),
  position INTEGER NOT NULL,
  product_id TEXT NOT NULL,
  variant_key TEXT NOT NULL,
  name TEXT NOT NULL,
  variant TEXT NOT NULL,
  unit_minor INTEGER NOT NULL CHECK (unit_minor > 0),
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 5),
  PRIMARY KEY (order_number, position)
);
CREATE TABLE maintenance (
  number INTEGER PRIMARY KEY AUTOINCREMENT,
  request_key TEXT NOT NULL UNIQUE,
  payload_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  customer_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  private_note TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1
);
INSERT INTO sqlite_sequence(name, seq) VALUES ('maintenance', 1000);
CREATE INDEX session_expiry ON sessions(expires_at);
CREATE INDEX rate_expiry ON rate_limits(expires_at);
CREATE INDEX reset_expiry ON password_resets(expires_at);
