CREATE TABLE IF NOT EXISTS pickup_locations (
  id         SERIAL PRIMARY KEY,
  name       TEXT    NOT NULL,
  address    TEXT    NOT NULL,
  lat        NUMERIC(10, 7) NOT NULL,
  lng        NUMERIC(10, 7) NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delivery_type       TEXT    DEFAULT 'delivery',
  ADD COLUMN IF NOT EXISTS pickup_location_id  INTEGER REFERENCES pickup_locations(id);
