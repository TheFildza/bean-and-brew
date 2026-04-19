-- Migration 001: Add inventory columns to coffees table
-- Run once on Neon dashboard before deploying Phase 2

ALTER TABLE coffees ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0;
ALTER TABLE coffees ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
