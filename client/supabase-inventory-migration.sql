-- ============================================================
-- MIGRATION: Add stock register columns to inventory table
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add new register-style columns
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS opening_balance DECIMAL(15,2) DEFAULT 0;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS received DECIMAL(15,2) DEFAULT 0;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS issued DECIMAL(15,2) DEFAULT 0;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS requirement DECIMAL(15,2) DEFAULT 0;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS remarks TEXT DEFAULT '';

-- Backfill existing rows: set opening_balance = current stock value
UPDATE inventory SET opening_balance = current WHERE opening_balance = 0 OR opening_balance IS NULL;
