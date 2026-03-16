-- ============================================
-- CLEANUP: Remove finance tables from public schema
-- Run this FIRST before running 001_schema.sql
-- ============================================

-- Drop tables in correct order (transactions first due to foreign keys)
DROP TABLE IF EXISTS public.finance_transactions CASCADE;
DROP TABLE IF EXISTS public.finance_categories CASCADE;
DROP TABLE IF EXISTS public.finance_people CASCADE;
DROP TABLE IF EXISTS public.finance_clubs CASCADE;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
