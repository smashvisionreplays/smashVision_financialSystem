-- Smash Vision Financial System - Database Schema
-- Uses dedicated 'finance' schema (separate from recordingSystem in public)

-- ============================================
-- CREATE SCHEMA
-- ============================================
CREATE SCHEMA IF NOT EXISTS finance;

-- ============================================
-- CLUBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  number_cameras INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PEOPLE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance.people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'collaborator' CHECK (role IN ('founder', 'investor', 'collaborator', 'company')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'both')),
  UNIQUE(name, type)
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'withdrawal', 'reimbursement', 'gap_contribution')),
  original_amount NUMERIC(12, 2) NOT NULL,
  original_currency TEXT NOT NULL DEFAULT 'USD' CHECK (original_currency IN ('USD', 'MXN', 'COP')),
  exchange_rate NUMERIC(12, 6) NOT NULL DEFAULT 1,
  usd_amount NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL,
  notes TEXT,
  club_id UUID REFERENCES finance.clubs(id) ON DELETE SET NULL,
  person_id UUID REFERENCES finance.people(id) ON DELETE SET NULL,
  category_id UUID REFERENCES finance.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_transactions_date ON finance.transactions(date);
CREATE INDEX idx_transactions_type ON finance.transactions(type);
CREATE INDEX idx_transactions_club ON finance.transactions(club_id);
CREATE INDEX idx_transactions_person ON finance.transactions(person_id);
CREATE INDEX idx_transactions_category ON finance.transactions(category_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION finance.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON finance.transactions
  FOR EACH ROW
  EXECUTE FUNCTION finance.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE finance.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.transactions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anonymous users
CREATE POLICY "Allow all on clubs" ON finance.clubs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on people" ON finance.people FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on categories" ON finance.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on transactions" ON finance.transactions FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- EXPOSE SCHEMA VIA POSTGREST
-- ============================================
GRANT USAGE ON SCHEMA finance TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA finance TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA finance TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA finance GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA finance GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
