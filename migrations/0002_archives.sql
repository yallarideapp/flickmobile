-- Keep saved order/idempotency history and consumed stock when an owner archives a record.
ALTER TABLE orders ADD COLUMN deleted_at INTEGER;
ALTER TABLE maintenance ADD COLUMN deleted_at INTEGER;
CREATE INDEX orders_visible ON orders(deleted_at,number);
CREATE INDEX maintenance_visible ON maintenance(deleted_at,number);
