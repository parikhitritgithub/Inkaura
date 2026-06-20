-- ═══════════════════════════════════════════════════════════════════════════════
-- PrintFlow ERP — Supabase Setup Script
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── 1. Create Employees Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  phone      VARCHAR(50),
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(50) NOT NULL DEFAULT 'OPERATOR',
  department VARCHAR(100),
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 2. Auto-update updated_at trigger ──────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_employees'
  ) THEN
    CREATE TRIGGER set_updated_at_employees
      BEFORE UPDATE ON employees
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ─── 3. Enable Row Level Security ──────────────────────────────────────────
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all employees
CREATE POLICY "Authenticated users can read employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert employees
CREATE POLICY "Authenticated users can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to update employees
CREATE POLICY "Authenticated users can update employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete employees
CREATE POLICY "Authenticated users can delete employees"
  ON employees FOR DELETE
  TO authenticated
  USING (true);

-- ─── 4. Seed Data ──────────────────────────────────────────────────────────
-- Admin user
INSERT INTO employees (name, email, password, role, department, phone)
VALUES ('Admin User', 'admin@printflow.com', 'managed-by-supabase-auth', 'ADMIN', 'Management', '+91-9800000000')
ON CONFLICT (email) DO NOTHING;

-- Sample employees
INSERT INTO employees (name, email, password, role, department, phone) VALUES
  ('Rajesh Kumar',  'rajesh@printflow.com',  'managed-by-supabase-auth', 'SUPERVISOR',        'Production', '+91-9876543210'),
  ('Priya Sharma',  'priya@printflow.com',   'managed-by-supabase-auth', 'SALES_EXECUTIVE',   'Sales',      '+91-9876543211'),
  ('Amit Patel',    'amit@printflow.com',     'managed-by-supabase-auth', 'MACHINE_OPERATOR',  'Production', '+91-9876543212'),
  ('Sneha Desai',   'sneha@printflow.com',    'managed-by-supabase-auth', 'QC_TEAM',           'Quality',    '+91-9876543213'),
  ('Vikram Singh',  'vikram@printflow.com',   'managed-by-supabase-auth', 'INVENTORY_MANAGER', 'Warehouse',  '+91-9876543214'),
  ('Neha Gupta',    'neha@printflow.com',     'managed-by-supabase-auth', 'FINANCE',           'Accounts',   '+91-9876543215'),
  ('Suresh Reddy',  'suresh@printflow.com',   'managed-by-supabase-auth', 'DISPATCH',          'Logistics',  '+91-9876543216'),
  ('Kavita Joshi',  'kavita@printflow.com',   'managed-by-supabase-auth', 'PACKAGING',         'Packaging',  '+91-9876543217'),
  ('Ramesh Verma',  'ramesh@printflow.com',   'managed-by-supabase-auth', 'MACHINE_OPERATOR',  'Production', '+91-9876543218'),
  ('Anita Mishra',  'anita@printflow.com',    'managed-by-supabase-auth', 'SALES_EXECUTIVE',   'Sales',      '+91-9876543219')
ON CONFLICT (email) DO NOTHING;

-- ─── Done! ──────────────────────────────────────────────────────────────────
-- Now go to Authentication → Users → Add User to create:
--   Email: admin@printflow.com
--   Password: password
-- ═══════════════════════════════════════════════════════════════════════════════
