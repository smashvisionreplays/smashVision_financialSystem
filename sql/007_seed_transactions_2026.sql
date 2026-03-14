-- Seed Transactions 2026

-- ============================================
-- ENERO 2026
-- ============================================
INSERT INTO finance_transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-01-01', 'expense', 19.50, 'USD', 1, 19.50, 'AWS Diciembre', NULL, (SELECT id FROM finance_clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-01-01', 'expense', 35.21, 'USD', 1, 35.21, 'Router para prueba', 'Se cobrará a Prime Padel', (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Infrastructure' AND type = 'expense')),
('2026-01-01', 'expense', 54.18, 'USD', 1, 54.18, 'Switch PoE prueba', 'Se cobrará a Prime Padel', (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Infrastructure' AND type = 'expense')),
('2026-01-01', 'expense', 8.13, 'USD', 1, 8.13, 'Ponchada de cables 2 y 3 prueba', NULL, (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Materials' AND type = 'expense')),
('2026-01-01', 'expense', 32.00, 'USD', 1, 32.00, 'Cloudflare', NULL, (SELECT id FROM finance_clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-01-01', 'expense', 24.00, 'USD', 1, 24.00, 'Base para 2 cámaras', NULL, (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Materials' AND type = 'expense')),
('2026-01-01', 'expense', 29.49, 'USD', 1, 29.49, 'Tornillería, cables y extras de instalación', 'Se cobrará parcialmente a Prime Padel', (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Materials' AND type = 'expense'));

-- Gap contribution: Enero 2026
INSERT INTO finance_transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-01-01', 'gap_contribution', 2.26, 'USD', 1, 2.26, 'Aporte desfase', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'César Castaño'), NULL);

-- ============================================
-- FEBRERO 2026
-- ============================================
INSERT INTO finance_transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-01', 'expense', 187.00, 'USD', 1, 187.00, 'PC HP para recordingSystem', NULL, (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Equipment' AND type = 'expense')),
('2026-02-01', 'expense', 16.00, 'USD', 1, 16.00, 'Comercio Eléctrico: Caja eléctrica, Cable para botones cancha 2 y 3, Cinta vulcanizada', 'Se cobrará a Prime Padel (menos caja que no se usó)', (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 1.30, 'USD', 1, 1.30, 'Extensión eléctrica', NULL, (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 17.80, 'USD', 1, 17.80, 'Acetato para cubrir dispositivos', NULL, (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 30.00, 'USD', 1, 30.00, 'Canaletas iniciales para Prime Padel', 'Se cobrará a Prime Padel', (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 12.20, 'USD', 1, 12.20, 'Elementos para instalar acetato', 'Algunos elementos se podrían devolver ya que no se utilizaron', (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 5.44, 'USD', 1, 5.44, 'Arreglo de multímetro y fuente de poder', NULL, (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Equipment' AND type = 'expense')),
('2026-02-01', 'expense', 10.00, 'USD', 1, 10.00, 'Compra de Claude', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Software' AND type = 'expense')),
('2026-02-01', 'expense', 20.00, 'USD', 1, 20.00, 'Extensión de nube Cloudflare', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 11.00, 'USD', 1, 11.00, 'Pintura para canaletas', NULL, (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Materials' AND type = 'expense')),
('2026-02-01', 'expense', 17.20, 'USD', 1, 17.20, 'Extensión de nube Cloudflare', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 19.50, 'USD', 1, 19.50, 'Servicios de AWS', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 32.00, 'USD', 1, 32.00, 'Cloudflare', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 24.64, 'USD', 1, 24.64, 'Extensión de nube Cloudflare', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 3.00, 'USD', 1, 3.00, 'Extensión de nube Cloudflare', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-02-01', 'expense', 5.00, 'USD', 1, 5.00, 'Extensión de nube Cloudflare', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Febrero 2026
INSERT INTO finance_transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-02-11', 'income', 245.00, 'USD', 1, 245.00, 'Pago de cámaras 1 y 2', 'Pago de Diciembre, Enero + 38 USD de regalo por parte de Smash debido al retraso', (SELECT id FROM finance_clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Camera Service' AND type = 'income')),
('2026-02-27', 'income', 140.00, 'USD', 1, 140.00, 'Pago de cámaras 1, 2, 3 y 4 restante de mes de Diciembre, pasado a Febrero', NULL, (SELECT id FROM finance_clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Camera Service' AND type = 'income')),
('2026-02-15', 'income', 164.00, 'USD', 1, 164.00, 'Instalación cámaras 2 y 3', NULL, (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Installation Fee' AND type = 'income'));

-- ============================================
-- MARZO 2026
-- ============================================
INSERT INTO finance_transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-03-01', 'expense', 1.43, 'USD', 1, 1.43, 'Extensión de nube Cloudflare', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 1.43, 'USD', 1, 1.43, 'Extensión de nube Cloudflare', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 17.80, 'USD', 1, 17.80, 'Servicios de AWS', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 2.13, 'USD', 1, 2.13, 'Extensión de nube Cloudflare', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense')),
('2026-03-01', 'expense', 10.00, 'USD', 1, 10.00, 'Compra de Claude', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Software' AND type = 'expense')),
('2026-03-01', 'expense', 32.50, 'USD', 1, 32.50, 'Afiches Prime Padel', NULL, (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Marketing' AND type = 'expense')),
('2026-03-01', 'expense', 4.00, 'USD', 1, 4.00, 'Corte de acrílico para Prime Padel', NULL, (SELECT id FROM finance_clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Materials' AND type = 'expense')),
('2026-03-01', 'expense', 142.00, 'USD', 1, 142.00, 'Cloudflare', NULL, NULL, (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Marzo 2026
INSERT INTO finance_transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2026-03-01', 'income', 307.00, 'USD', 1, 307.00, 'Pago cámaras 1, 2, 3 y 4 Marzo', NULL, (SELECT id FROM finance_clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance_people WHERE name = 'Smash Vision'), (SELECT id FROM finance_categories WHERE name = 'Camera Service' AND type = 'income'));
