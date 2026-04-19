-- Migration 002: Users, Orders, Order Items
-- Run on Neon dashboard before deploying Phase 2 Checkout

CREATE TABLE IF NOT EXISTS users (
  id               SERIAL PRIMARY KEY,
  email            VARCHAR(255) UNIQUE NOT NULL,
  password_hash    TEXT NOT NULL,
  name             VARCHAR(255),
  session_token    TEXT,
  session_expires_at TIMESTAMP,
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id                      SERIAL PRIMARY KEY,
  user_id                 INTEGER REFERENCES users(id),
  stripe_session_id       TEXT UNIQUE NOT NULL,
  stripe_payment_intent   TEXT,
  status                  VARCHAR(50) DEFAULT 'pending',
  total_amount            DECIMAL(10,2) NOT NULL,
  created_at              TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  coffee_id  INTEGER REFERENCES coffees(id) ON DELETE SET NULL,
  name       VARCHAR(255) NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  quantity   INTEGER NOT NULL
);
