-- Smash Vision Financial System - Database Schema
-- Run this in your Supabase SQL Editor (same project as recordingSystem)

-- ============================================
-- CLUBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance_clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PEOPLE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'collaborator' CHECK (role IN ('founder', 'investor', 'collaborator')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'both')),
  UNIQUE(name, type)
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'withdrawal', 'reimbursement', 'gap_contribution')),
  original_amount NUMERIC(12, 2) NOT NULL,
  original_currency TEXT NOT NULL DEFAULT 'USD' CHECK (original_currency IN ('USD', 'MXN', 'COP')),
  exchange_rate NUMERIC(12, 6) NOT NULL DEFAULT 1,
  usd_amount NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL,
  notes TEXT,
  club_id UUID REFERENCES finance_clubs(id) ON DELETE SET NULL,
  person_id UUID REFERENCES finance_people(id) ON DELETE SET NULL,
  category_id UUID REFERENCES finance_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_transactions_date ON finance_transactions(date);
CREATE INDEX idx_transactions_type ON finance_transactions(type);
CREATE INDEX idx_transactions_club ON finance_transactions(club_id);
CREATE INDEX idx_transactions_person ON finance_transactions(person_id);
CREATE INDEX idx_transactions_category ON finance_transactions(category_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_finance_transactions_updated_at
  BEFORE UPDATE ON finance_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DISABLE RLS (no auth for internal tool)
-- ============================================
ALTER TABLE finance_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anonymous users
CREATE POLICY "Allow all on finance_clubs" ON finance_clubs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on finance_people" ON finance_people FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on finance_categories" ON finance_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on finance_transactions" ON finance_transactions FOR ALL USING (true) WITH CHECK (true);
