-- Seed Categories
INSERT INTO finance.categories (name, type) VALUES
  -- Expense categories
  ('Infrastructure', 'expense'),
  ('Services', 'expense'),
  ('Transportation', 'expense'),
  ('Installation', 'expense'),
  ('Taxes', 'expense'),
  ('Materials', 'expense'),
  ('Shipping', 'expense'),
  ('Marketing', 'expense'),
  ('Software', 'expense'),
  ('Equipment', 'expense'),
  ('Commissions', 'expense'),
  ('Refund', 'expense'),
  ('Other Expense', 'expense'),
  ('Accounting Adjustment', 'expense'),
  -- Income categories
  ('Camera Service', 'income'),
  ('Installation Fee', 'income'),
  ('Button Installation', 'income'),
  ('Equipment Sale', 'income'),
  ('Other Income', 'income');
