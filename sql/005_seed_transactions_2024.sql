-- Seed Transactions 2024
-- All historical amounts are already in USD (exchange_rate = 1)
-- Dates without exact day use day 01

-- Helper: get IDs by name
-- Run after 002, 003, 004

-- ============================================
-- MARZO 2024
-- ============================================
-- Expense: César Castaño - Cámara IP
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-03-01', 'expense', 60.00, 'USD', 1, 60.00, 'Cámara IP', 'Primer intento de cámara',
  NULL,
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));

-- ============================================
-- ABRIL 2024
-- ============================================
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-04-01', 'expense', 12.32, 'USD', 1, 12.32, 'AWS', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-04-01', 'expense', 40.00, 'USD', 1, 40.00, 'Switch y Cables ETH', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-04-01', 'expense', 15.00, 'USD', 1, 15.00, 'Ubers', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Transportation' AND type = 'expense'));

-- ============================================
-- MAYO 2024
-- ============================================
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-05-01', 'expense', 72.00, 'USD', 1, 72.00, 'Wix premium y dominio', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-05-01', 'expense', 14.54, 'USD', 1, 14.54, 'AWS', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'Amazon'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- ============================================
-- JUNIO 2024
-- ============================================
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-06-01', 'expense', 60.00, 'USD', 1, 60.00, 'Cámara Hikvision', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-06-01', 'expense', 25.00, 'USD', 1, 25.00, 'Cables ETH', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-06-01', 'expense', 10.19, 'USD', 1, 10.19, 'AWS', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'Amazon'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- ============================================
-- JULIO 2024
-- ============================================
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-07-01', 'expense', 10.00, 'USD', 1, 10.00, 'Cloudflare', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-07-01', 'expense', 25.00, 'USD', 1, 25.00, 'Envío de Cámaras', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Shipping' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-07-01', 'expense', 117.00, 'USD', 1, 117.00, '2 Cámaras', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-07-01', 'expense', 4.44, 'USD', 1, 4.44, 'AWS', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'Amazon'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- ============================================
-- AGOSTO 2024
-- ============================================
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-08-01', 'expense', 50.00, 'USD', 1, 50.00, 'Ubers', 'Ubers para ir al club y al SAT',
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Transportation' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-08-01', 'expense', 37.00, 'USD', 1, 37.00, 'Switch PoE', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-08-01', 'expense', 4.45, 'USD', 1, 4.45, 'AWS', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'Amazon'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-08-01', 'expense', 10.00, 'USD', 1, 10.00, 'Cloudflare', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'Julio Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-08-01', 'expense', 200.00, 'USD', 1, 200.00, 'PC', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Julio Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Equipment' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-08-01', 'expense', 60.00, 'USD', 1, 60.00, 'Monitor', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Julio Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Equipment' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-08-01', 'expense', 60.00, 'USD', 1, 60.00, 'Canaletas y Pintura', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Julio Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- ============================================
-- SEPTIEMBRE 2024
-- ============================================
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 44.00, 'USD', 1, 44.00, 'Cloudflare', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 4.31, 'USD', 1, 4.31, 'AWS', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Amazon'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 8.00, 'USD', 1, 8.00, 'Canaletas', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Juan Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 27.00, 'USD', 1, 27.00, 'Base para cámara', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Juan Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 35.00, 'USD', 1, 35.00, 'Ubers', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Julio Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Transportation' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 257.00, 'USD', 1, 257.00, 'Instalación Cámara 7', 'Cámara 7 Padel Nation',
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Juan Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Installation' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 93.00, 'USD', 1, 93.00, 'Instalación Cámara 8', 'Cámara 8 Padel Nation',
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Juan Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Installation' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 20.00, 'USD', 1, 20.00, 'Instalación Cámara 8', 'Cámara 8 Padel Nation',
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Julio Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Installation' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 91.00, 'USD', 1, 91.00, 'Instalación Cámara 8', 'Cámara 8 Padel Nation',
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Paola Marin'),
  (SELECT id FROM finance.categories WHERE name = 'Installation' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 10.00, 'USD', 1, 10.00, 'Ferretería', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Paola Marin'),
  (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-09-01', 'expense', 18.00, 'USD', 1, 18.00, 'Ubers', 'Ubers a Padel Nation',
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Paola Marin'),
  (SELECT id FROM finance.categories WHERE name = 'Transportation' AND type = 'expense'));

-- ============================================
-- OCTUBRE 2024
-- ============================================
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 50.00, 'USD', 1, 50.00, 'Cloudflare', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 38.00, 'USD', 1, 38.00, 'Chequeo de cámaras', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));

-- Envío de cámaras $110 split 50/50: Smash Padel + Padeling Pance
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 55.00, 'USD', 1, 55.00, 'Envío de cámaras', 'Gasto compartido Smash Padel / Padeling',
  (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'),
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Shipping' AND type = 'expense'));
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 55.00, 'USD', 1, 55.00, 'Envío de cámaras', 'Gasto compartido Smash Padel / Padeling',
  (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'),
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Shipping' AND type = 'expense'));

-- Aduana cámaras $50 split 50/50: Smash Padel + Padeling Pance
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 25.00, 'USD', 1, 25.00, 'Aduana cámaras', 'Gasto compartido Smash Padel / Padeling',
  (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'),
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Shipping' AND type = 'expense'));
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 25.00, 'USD', 1, 25.00, 'Aduana cámaras', 'Gasto compartido Smash Padel / Padeling',
  (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'),
  (SELECT id FROM finance.people WHERE name = 'César Castaño'),
  (SELECT id FROM finance.categories WHERE name = 'Shipping' AND type = 'expense'));

-- 4 Cámaras $188 split 50/50: Smash Padel + Padeling Pance
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 94.00, 'USD', 1, 94.00, '4 Cámaras', 'Gasto compartido Smash Padel / Padeling',
  (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'),
  (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 94.00, 'USD', 1, 94.00, '4 Cámaras', 'Gasto compartido Smash Padel / Padeling',
  (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'),
  (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 9.62, 'USD', 1, 9.62, 'Cargadores para cámaras', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 2.17, 'USD', 1, 2.17, 'Dominio GoDaddy', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 4.42, 'USD', 1, 4.42, 'AWS', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Amazon'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-10-01', 'expense', 40.00, 'USD', 1, 40.00, 'Chequeo de cámaras', NULL,
  NULL,
  (SELECT id FROM finance.people WHERE name = 'Paola Marin'),
  (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));

-- ============================================
-- NOVIEMBRE 2024
-- ============================================
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-11-01', 'expense', 30.00, 'USD', 1, 30.00, 'Cloudflare', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-11-01', 'expense', 11.00, 'USD', 1, 11.00, 'Ubers', 'Ubers a Padel Nation',
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Paola Marin'),
  (SELECT id FROM finance.categories WHERE name = 'Transportation' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-11-01', 'expense', 4.30, 'USD', 1, 4.30, 'AWS', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Amazon'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- ============================================
-- DICIEMBRE 2024
-- ============================================
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-12-01', 'expense', 16.56, 'USD', 1, 16.56, 'IVA Pago Diciembre', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Smash Vision'),
  (SELECT id FROM finance.categories WHERE name = 'Taxes' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-12-01', 'expense', 4.42, 'USD', 1, 4.42, 'AWS', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Smash Vision'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-12-01', 'expense', 25.00, 'USD', 1, 25.00, 'Cloudflare', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Paola Marin'),
  (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- INCOME: Diciembre 2024
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES ('2024-12-01', 'income', 207.00, 'USD', 1, 207.00, 'Pago Cámara 7, 8', NULL,
  (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'),
  (SELECT id FROM finance.people WHERE name = 'Smash Vision'),
  (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));
