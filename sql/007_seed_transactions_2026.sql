-- Seed Transactions 2026
-- 3 active clubs: Prime Padel, Smash Padel, Padeling Pance
-- Shared "Todos" expenses split equally among all 3 clubs

-- ============================================
-- ENERO 2026
-- No shared items - all have specific club assignments
-- ============================================
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-01-01', 'expense', 19.50, 'USD', 1, 19.50, 'AWS Diciembre', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-01-01', 'expense', 35.21, 'USD', 1, 35.21, 'Router para prueba', 'Se cobrará a Prime Padel', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense')),
('2026-01-01', 'expense', 54.18, 'USD', 1, 54.18, 'Switch PoE prueba', 'Se cobrará a Prime Padel', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense')),
('2026-01-01', 'expense', 8.13, 'USD', 1, 8.13, 'Ponchada de cables 2 y 3 prueba', NULL, (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2026-01-01', 'expense', 32.00, 'USD', 1, 32.00, 'Cloudflare', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-01-01', 'expense', 24.00, 'USD', 1, 24.00, 'Base para 2 cámaras', NULL, (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2026-01-01', 'expense', 29.49, 'USD', 1, 29.49, 'Tornillería, cables y extras de instalación', 'Se cobrará parcialmente a Prime Padel', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Gap contribution: Enero 2026
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-01-01', 'gap_contribution', 2.26, 'USD', 1, 2.26, 'Aporte desfase', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'César Castaño'), NULL);

-- ============================================
-- FEBRERO 2026
-- ============================================
-- Expenses: Smash Vision - Direct Prime Padel assignments
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-01', 'expense', 187.00, 'USD', 1, 187.00, 'PC HP para recordingSystem', NULL, (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Equipment' AND type = 'expense')),
('2026-02-01', 'expense', 16.00, 'USD', 1, 16.00, 'Comercio Eléctrico: Caja eléctrica, Cable para botones cancha 2 y 3, Cinta vulcanizada', 'Se cobrará a Prime Padel (menos caja que no se usó)', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 1.30, 'USD', 1, 1.30, 'Extensión eléctrica', NULL, (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 17.80, 'USD', 1, 17.80, 'Acetato para cubrir dispositivos', NULL, (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 30.00, 'USD', 1, 30.00, 'Canaletas iniciales para Prime Padel', 'Se cobrará a Prime Padel', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 12.20, 'USD', 1, 12.20, 'Elementos para instalar acetato', 'Algunos elementos se podrían devolver ya que no se utilizaron', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 5.44, 'USD', 1, 5.44, 'Arreglo de multímetro y fuente de poder', NULL, (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Equipment' AND type = 'expense')),
('2026-02-01', 'expense', 11.00, 'USD', 1, 11.00, 'Pintura para canaletas', NULL, (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Claude $10 split 3 ways (PP + SP + Padeling)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-01', 'expense', 3.33, 'USD', 1, 3.33, 'Compra de Claude', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Software' AND type = 'expense')),
('2026-02-01', 'expense', 3.33, 'USD', 1, 3.33, 'Compra de Claude', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Software' AND type = 'expense')),
('2026-02-01', 'expense', 3.34, 'USD', 1, 3.34, 'Compra de Claude', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Software' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Extensión CF $20 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-01', 'expense', 6.67, 'USD', 1, 6.67, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 6.67, 'USD', 1, 6.67, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 6.66, 'USD', 1, 6.66, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Extensión CF $17.20 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-01', 'expense', 5.73, 'USD', 1, 5.73, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 5.73, 'USD', 1, 5.73, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 5.74, 'USD', 1, 5.74, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $19.50 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-01', 'expense', 6.50, 'USD', 1, 6.50, 'Servicios de AWS', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 6.50, 'USD', 1, 6.50, 'Servicios de AWS', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 6.50, 'USD', 1, 6.50, 'Servicios de AWS', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $32 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-01', 'expense', 10.67, 'USD', 1, 10.67, 'Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 10.67, 'USD', 1, 10.67, 'Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 10.66, 'USD', 1, 10.66, 'Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Extensión CF $24.64 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-01', 'expense', 8.21, 'USD', 1, 8.21, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 8.21, 'USD', 1, 8.21, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 8.22, 'USD', 1, 8.22, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Extensión CF $3 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-01', 'expense', 1.00, 'USD', 1, 1.00, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 1.00, 'USD', 1, 1.00, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 1.00, 'USD', 1, 1.00, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Extensión CF $5 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-01', 'expense', 1.67, 'USD', 1, 1.67, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 1.67, 'USD', 1, 1.67, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 1.66, 'USD', 1, 1.66, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Febrero 2026
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-11', 'income', 245.00, 'USD', 1, 245.00, 'Pago de cámaras 1 y 2', 'Pago de Diciembre, Enero + 38 USD de regalo por parte de Smash debido al retraso', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income')),
('2026-02-27', 'income', 140.00, 'USD', 1, 140.00, 'Pago de cámaras 1, 2, 3 y 4 restante de mes de Diciembre, pasado a Febrero', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income')),
('2026-02-15', 'income', 164.00, 'USD', 1, 164.00, 'Instalación cámaras 2 y 3', NULL, (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Installation Fee' AND type = 'income'));

-- ============================================
-- MARZO 2026
-- ============================================
-- Expenses: Smash Vision - Direct Prime Padel assignments
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-03-01', 'expense', 32.50, 'USD', 1, 32.50, 'Afiches Prime Padel', NULL, (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Marketing' AND type = 'expense')),
('2026-03-01', 'expense', 4.00, 'USD', 1, 4.00, 'Corte de acrílico para Prime Padel', NULL, (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Extensión CF $1.43 (first) split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-03-01', 'expense', 0.48, 'USD', 1, 0.48, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 0.48, 'USD', 1, 0.48, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 0.47, 'USD', 1, 0.47, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Extensión CF $1.43 (second) split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-03-01', 'expense', 0.48, 'USD', 1, 0.48, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 0.48, 'USD', 1, 0.48, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 0.47, 'USD', 1, 0.47, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $17.80 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-03-01', 'expense', 5.93, 'USD', 1, 5.93, 'Servicios de AWS', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 5.93, 'USD', 1, 5.93, 'Servicios de AWS', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 5.94, 'USD', 1, 5.94, 'Servicios de AWS', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Extensión CF $2.13 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-03-01', 'expense', 0.71, 'USD', 1, 0.71, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 0.71, 'USD', 1, 0.71, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 0.71, 'USD', 1, 0.71, 'Extensión de nube Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Claude $10 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-03-01', 'expense', 3.33, 'USD', 1, 3.33, 'Compra de Claude', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Software' AND type = 'expense')),
('2026-03-01', 'expense', 3.33, 'USD', 1, 3.33, 'Compra de Claude', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Software' AND type = 'expense')),
('2026-03-01', 'expense', 3.34, 'USD', 1, 3.34, 'Compra de Claude', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Software' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $142 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-03-01', 'expense', 47.33, 'USD', 1, 47.33, 'Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 47.33, 'USD', 1, 47.33, 'Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 47.34, 'USD', 1, 47.34, 'Cloudflare', 'Gasto compartido Prime Padel / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Marzo 2026
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-03-01', 'income', 307.00, 'USD', 1, 307.00, 'Pago cámaras 1, 2, 3 y 4 Marzo', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));
