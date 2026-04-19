ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delivery_address TEXT,
  ADD COLUMN IF NOT EXISTS delivery_lat     NUMERIC(10, 7),
  ADD COLUMN IF NOT EXISTS delivery_lng     NUMERIC(10, 7);
