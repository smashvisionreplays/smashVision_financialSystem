-- Seed Transactions 2025
-- Multi-club shared expenses are split equally among the clubs listed
-- Active clubs timeline:
--   Jan-Jul 2025: Padel Nation + Smash Padel (2 clubs)
--   Aug 2025: Padel Nation + Smash Padel + Padeling Pance (3 clubs)
--   Sep-Dec 2025: Smash Padel + Padeling Pance (2 clubs, Padel Nation inactive)

-- ============================================
-- ENERO 2025
-- ============================================
-- Expenses: César Castaño (all Smash Padel)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-01-01', 'expense', 6.00, 'USD', 1, 6.00, 'Cinta', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'César Castaño'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2025-01-01', 'expense', 18.00, 'USD', 1, 18.00, 'Bases Cámaras', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'César Castaño'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2025-01-01', 'expense', 84.00, 'USD', 1, 84.00, 'Instalación Cámaras Smash Padel', 'Instalación Cámaras 1, 2', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'César Castaño'), (SELECT id FROM finance.categories WHERE name = 'Installation' AND type = 'expense')),
('2025-01-01', 'expense', 1.92, 'USD', 1, 1.92, 'Cabezas RJ45', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'César Castaño'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Expenses: Tomás Ossa (all Smash Padel)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-01-01', 'expense', 24.00, 'USD', 1, 24.00, 'Transporte a Smash Padel', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Transportation' AND type = 'expense')),
('2025-01-01', 'expense', 62.40, 'USD', 1, 62.40, 'Material Adicional', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2025-01-01', 'expense', 9.60, 'USD', 1, 9.60, 'Ubers trabajadores', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Transportation' AND type = 'expense')),
('2025-01-01', 'expense', 6.00, 'USD', 1, 6.00, 'Extras', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2025-01-01', 'expense', 7.20, 'USD', 1, 7.20, 'Cortes de las bases para cámaras', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Expenses: Smash Vision - Direct club assignments
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-01-01', 'expense', 16.56, 'USD', 1, 16.56, 'IVA México', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Taxes' AND type = 'expense')),
('2025-01-01', 'expense', 45.37, 'USD', 1, 45.37, 'Switch PoE', 'Switch PoE para Smash Padel', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense')),
('2025-01-01', 'expense', 225.62, 'USD', 1, 225.62, 'PC', 'PC para Smash Padel', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Equipment' AND type = 'expense')),
('2025-01-01', 'expense', 43.20, 'USD', 1, 43.20, 'Cable ETH', 'Cable ETH para Smash Padel', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $32.26 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-01-01', 'expense', 16.13, 'USD', 1, 16.13, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-01-01', 'expense', 16.13, 'USD', 1, 16.13, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $4.42 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-01-01', 'expense', 2.21, 'USD', 1, 2.21, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-01-01', 'expense', 2.21, 'USD', 1, 2.21, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Enero 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-01-01', 'income', 207.00, 'USD', 1, 207.00, 'Pago Cámaras 7, 8', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- ============================================
-- FEBRERO 2025
-- ============================================
-- Expenses: Tomás Ossa - Cloudflare $83 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-02-01', 'expense', 41.50, 'USD', 1, 41.50, 'Cloudflare', '45 dólares adicionales de error en pago. Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-02-01', 'expense', 41.50, 'USD', 1, 41.50, 'Cloudflare', '45 dólares adicionales de error en pago. Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Direct club assignments
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-02-01', 'expense', 18.63, 'USD', 1, 18.63, 'IVA e IRS México', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Taxes' AND type = 'expense')),
('2025-02-01', 'expense', 45.605, 'USD', 1, 45.605, 'Comisión', 'Pago a César Castaño por comisión de Smash Padel', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Commissions' AND type = 'expense')),
('2025-02-01', 'expense', 67.21, 'USD', 1, 67.21, 'Cable botones', 'Cable para botones 1, 2 de Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2025-02-01', 'expense', 55.20, 'USD', 1, 55.20, 'Circuitos', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2025-02-01', 'expense', 16.80, 'USD', 1, 16.80, 'Botones', '3 botones para Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2025-02-01', 'expense', 72.00, 'USD', 1, 72.00, 'Instalación botones', 'Daniel debe este dinero a Smash Vision', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Installation' AND type = 'expense')),
('2025-02-01', 'expense', 24.71, 'USD', 1, 24.71, 'Ubers para instalación de botones', 'Daniel debe este dinero a Smash Vision', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Transportation' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $4.06 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-02-01', 'expense', 2.03, 'USD', 1, 2.03, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-02-01', 'expense', 2.03, 'USD', 1, 2.03, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Febrero 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-02-01', 'income', 207.00, 'USD', 1, 207.00, 'Pago Cámaras 7, 8', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income')),
('2025-02-01', 'income', 91.21, 'USD', 1, 91.21, 'Pago Cámaras 1, 2', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- Withdrawal: Febrero 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-02-01', 'withdrawal', 7.20, 'USD', 1, 7.20, 'Tacos', 'Tacos de premio por colocar botones', NULL, (SELECT id FROM finance.people WHERE name = 'César Castaño'), NULL);

-- ============================================
-- MARZO 2025
-- ============================================
-- Expenses: César Castaño - Cloudflare $45 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-03-01', 'expense', 22.50, 'USD', 1, 22.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'César Castaño'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-03-01', 'expense', 22.50, 'USD', 1, 22.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'César Castaño'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Tomás Ossa
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-03-01', 'expense', 90.00, 'USD', 1, 90.00, 'Compra de cámaras para nuevo club', '2 cámaras', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));

-- Expenses: Smash Vision - Direct club assignments
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-03-01', 'expense', 10.00, 'USD', 1, 10.00, 'Ubers para cobrar instalación', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Transportation' AND type = 'expense')),
('2025-03-01', 'expense', 263.00, 'USD', 1, 263.00, 'Componentes de instalación', 'Componentes menos cámaras, bases y caja para circuito', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2025-03-01', 'expense', 11.00, 'USD', 1, 11.00, 'Anticipo de Flyers en Cloroplast', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Marketing' AND type = 'expense')),
('2025-03-01', 'expense', 16.50, 'USD', 1, 16.50, 'IVA e ISR México', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Taxes' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Instructivo Canva $1 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-03-01', 'expense', 0.50, 'USD', 1, 0.50, 'Instructivo Canva', 'Descarga de instructivo desde canva. Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Software' AND type = 'expense')),
('2025-03-01', 'expense', 0.50, 'USD', 1, 0.50, 'Instructivo Canva', 'Descarga de instructivo desde canva. Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Software' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $4.42 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-03-01', 'expense', 2.21, 'USD', 1, 2.21, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-03-01', 'expense', 2.21, 'USD', 1, 2.21, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Marzo 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-03-01', 'income', 207.00, 'USD', 1, 207.00, 'Pago Cámaras 7, 8', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income')),
('2025-03-01', 'income', 97.89, 'USD', 1, 97.89, 'Pago Instalación Botones', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Button Installation' AND type = 'income')),
('2025-03-01', 'income', 85.00, 'USD', 1, 85.00, 'Pago Cámaras 1, 2', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- Reimbursement: Marzo 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-03-01', 'reimbursement', 45.00, 'USD', 1, 45.00, 'Retribución Cloudflare mes de Marzo', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'César Castaño'), NULL);

-- ============================================
-- ABRIL 2025
-- ============================================
-- Expenses: César Castaño
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-04-01', 'expense', 16.00, 'USD', 1, 16.00, 'Pago final de flyers en coroplast', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'César Castaño'), (SELECT id FROM finance.categories WHERE name = 'Marketing' AND type = 'expense')),
('2025-04-01', 'expense', 20.00, 'USD', 1, 20.00, 'Pago de elementos faltantes para sistema embebido', 'Caja, cargador, cables y cautín', (SELECT id FROM finance.clubs WHERE name = 'Prime Padel'), (SELECT id FROM finance.people WHERE name = 'César Castaño'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Expenses: Tomás Ossa
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-04-22', 'expense', 9.00, 'USD', 1, 9.00, 'Cargador 12v para cámara', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Expenses: Smash Vision - Direct club assignments
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-04-01', 'expense', 16.50, 'USD', 1, 16.50, 'IVA e ISR México', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Taxes' AND type = 'expense')),
('2025-04-01', 'expense', 2.35, 'USD', 1, 2.35, 'Cable de alimentación', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $45 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-04-01', 'expense', 22.50, 'USD', 1, 22.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-04-01', 'expense', 22.50, 'USD', 1, 22.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Dominio Web $28.50 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-04-01', 'expense', 14.25, 'USD', 1, 14.25, 'Dominio Web', 'smashvisionreplays.com. Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-04-01', 'expense', 14.25, 'USD', 1, 14.25, 'Dominio Web', 'smashvisionreplays.com. Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $4.30 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-04-01', 'expense', 2.15, 'USD', 1, 2.15, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-04-01', 'expense', 2.15, 'USD', 1, 2.15, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Abril 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-04-01', 'income', 212.60, 'USD', 1, 212.60, 'Pago Cámaras 7, 8', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income')),
('2025-04-01', 'income', 88.00, 'USD', 1, 88.00, 'Pago Cámaras 1, 2', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- Reimbursement: Abril 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-04-01', 'reimbursement', 36.00, 'USD', 1, 36.00, 'Pago de Flyers y Elementos faltantes para circuitos', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'César Castaño'), NULL);

-- Gap contribution: Abril 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-04-01', 'gap_contribution', 4.00, 'USD', 1, 4.00, 'Aporte desfase', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'César Castaño'), NULL);

-- ============================================
-- MAYO 2025
-- ============================================
-- Expenses: Tomás Ossa
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-05-02', 'expense', 11.00, 'USD', 1, 11.00, 'Switch para cámaras', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense')),
('2025-05-06', 'expense', 12.00, 'USD', 1, 12.00, '2 cables ethernet', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Expenses: Smash Vision - Direct club assignments
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-05-01', 'expense', 170.00, 'USD', 1, 170.00, 'Envío de dispositivos a Colombia', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Shipping' AND type = 'expense')),
('2025-05-01', 'expense', 17.20, 'USD', 1, 17.20, 'IVA e ISR México', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Taxes' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $48 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-05-01', 'expense', 24.00, 'USD', 1, 24.00, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-05-01', 'expense', 24.00, 'USD', 1, 24.00, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Anualidad Wix $143.20 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-05-01', 'expense', 71.60, 'USD', 1, 71.60, 'Anualidad Wix', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-05-01', 'expense', 71.60, 'USD', 1, 71.60, 'Anualidad Wix', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $19.48 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-05-01', 'expense', 9.74, 'USD', 1, 9.74, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-05-01', 'expense', 9.74, 'USD', 1, 9.74, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Paola Marin
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-05-01', 'expense', 53.00, 'USD', 1, 53.00, 'Envío de cámaras para Padeling', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Paola Marin'), (SELECT id FROM finance.categories WHERE name = 'Shipping' AND type = 'expense')),
('2025-05-01', 'expense', 96.00, 'USD', 1, 96.00, 'Mitad de IVA de envío de dispositivos', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Paola Marin'), (SELECT id FROM finance.categories WHERE name = 'Taxes' AND type = 'expense'));

-- Income: Mayo 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-05-01', 'income', 216.50, 'USD', 1, 216.50, 'Pago Cámaras 7, 8', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income')),
('2025-05-01', 'income', 85.70, 'USD', 1, 85.70, 'Pago Cámaras 1, 2', 'Descuento de 3 días para cámara 2', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- Reimbursement: Mayo 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-05-20', 'reimbursement', 23.00, 'USD', 1, 23.00, 'Switch y cables retribución', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), NULL),
('2025-05-20', 'reimbursement', 9.00, 'USD', 1, 9.00, 'Cargador 12v retribución', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), NULL);

-- ============================================
-- JUNIO 2025
-- ============================================
-- Expenses: Smash Vision - Direct
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-06-01', 'expense', 16.00, 'USD', 1, 16.00, 'IVA e ISR México', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Taxes' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $18.95 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-06-01', 'expense', 9.48, 'USD', 1, 9.48, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-06-01', 'expense', 9.47, 'USD', 1, 9.47, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $35 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-06-01', 'expense', 17.50, 'USD', 1, 17.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-06-01', 'expense', 17.50, 'USD', 1, 17.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Junio 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-06-01', 'income', 195.00, 'USD', 1, 195.00, 'Pago Cámaras 7, 8', 'Descuento de 3 días por fallos en Cloudflare', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income')),
('2025-06-01', 'income', 88.00, 'USD', 1, 88.00, 'Pago Cámaras 1, 2', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- ============================================
-- JULIO 2025
-- ============================================
-- Expenses: Smash Vision - Direct
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-07-01', 'expense', 17.23, 'USD', 1, 17.23, 'IVA e ISR', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Taxes' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $35 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-07-01', 'expense', 17.50, 'USD', 1, 17.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-07-01', 'expense', 17.50, 'USD', 1, 17.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare Extensión $13 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-07-01', 'expense', 6.50, 'USD', 1, 6.50, 'Cloudflare (Extensión)', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-07-01', 'expense', 6.50, 'USD', 1, 6.50, 'Cloudflare (Extensión)', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $20 split 50/50 (Smash Padel + Padel Nation)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-07-01', 'expense', 10.00, 'USD', 1, 10.00, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-07-01', 'expense', 10.00, 'USD', 1, 10.00, 'AWS', 'Gasto compartido Smash Padel / Padel Nation', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Julio 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-07-01', 'income', 94.00, 'USD', 1, 94.00, 'Pago Cámaras 1, 2', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- Reimbursement: Julio 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-07-01', 'reimbursement', 75.00, 'USD', 1, 75.00, 'Retribución a Paola Marin', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'Paola Marin'), NULL);

-- ============================================
-- AGOSTO 2025
-- 3 active clubs: Padel Nation, Smash Padel, Padeling Pance
-- ============================================
-- Expenses: César Castaño (Padeling Pance)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-01', 'expense', 106.00, 'USD', 1, 106.00, 'Mitad de mano de obra de instalación en Padeling', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'César Castaño'), (SELECT id FROM finance.categories WHERE name = 'Installation' AND type = 'expense')),
('2025-08-01', 'expense', 170.00, 'USD', 1, 170.00, 'Materiales para instalación en Padeling', 'César le debe a Julio Castaño', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'César Castaño'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense'));

-- Expenses: Tomás Ossa
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-04', 'expense', 29.67, 'USD', 1, 29.67, 'Power Inverter for cameras', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Equipment' AND type = 'expense')),
('2025-06-28', 'expense', 111.80, 'USD', 1, 111.80, '2 Cameras REO for experimentation WIFI cameras', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense')),
('2025-08-01', 'expense', 60.00, 'USD', 1, 60.00, 'Arreglo de 2 cámaras con versión anterior', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense'));

-- Expenses: Smash Vision - Direct club assignments
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-01', 'expense', 21.00, 'USD', 1, 21.00, 'Bases de cámaras', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Materials' AND type = 'expense')),
('2025-08-01', 'expense', 65.00, 'USD', 1, 65.00, 'Cámaras', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Infrastructure' AND type = 'expense')),
('2025-08-01', 'expense', 38.00, 'USD', 1, 38.00, 'IVA e ISR', 'Julio y Agosto', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Taxes' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $52 split 3 ways (PN + SP + Padeling)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-01', 'expense', 17.33, 'USD', 1, 17.33, 'Cloudflare', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-08-01', 'expense', 17.33, 'USD', 1, 17.33, 'Cloudflare', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-08-01', 'expense', 17.34, 'USD', 1, 17.34, 'Cloudflare', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare ext $27 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-01', 'expense', 9.00, 'USD', 1, 9.00, 'Cloudflare (extensión)', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-08-01', 'expense', 9.00, 'USD', 1, 9.00, 'Cloudflare (extensión)', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-08-01', 'expense', 9.00, 'USD', 1, 9.00, 'Cloudflare (extensión)', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare ext $15 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-01', 'expense', 5.00, 'USD', 1, 5.00, 'Cloudflare (extensión)', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-08-01', 'expense', 5.00, 'USD', 1, 5.00, 'Cloudflare (extensión)', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-08-01', 'expense', 5.00, 'USD', 1, 5.00, 'Cloudflare (extensión)', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Devolución $3 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-01', 'expense', 1.00, 'USD', 1, 1.00, 'Devolución de Dinero', 'Devolución (inmediata) a Tomás Ossa de 60 USD. Gasto compartido PN / SP / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Refund' AND type = 'expense')),
('2025-08-01', 'expense', 1.00, 'USD', 1, 1.00, 'Devolución de Dinero', 'Devolución (inmediata) a Tomás Ossa de 60 USD. Gasto compartido PN / SP / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Refund' AND type = 'expense')),
('2025-08-01', 'expense', 1.00, 'USD', 1, 1.00, 'Devolución de Dinero', 'Devolución (inmediata) a Tomás Ossa de 60 USD. Gasto compartido PN / SP / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Refund' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Envío retribución $3 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-01', 'expense', 1.00, 'USD', 1, 1.00, 'Envío de retribución', 'Envío de retribución a Paola Marín de 248 USD. Gasto compartido PN / SP / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Shipping' AND type = 'expense')),
('2025-08-01', 'expense', 1.00, 'USD', 1, 1.00, 'Envío de retribución', 'Envío de retribución a Paola Marín de 248 USD. Gasto compartido PN / SP / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Shipping' AND type = 'expense')),
('2025-08-01', 'expense', 1.00, 'USD', 1, 1.00, 'Envío de retribución', 'Envío de retribución a Paola Marín de 248 USD. Gasto compartido PN / SP / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Shipping' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $19.50 split 3 ways
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-01', 'expense', 6.50, 'USD', 1, 6.50, 'AWS', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-08-01', 'expense', 6.50, 'USD', 1, 6.50, 'AWS', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-08-01', 'expense', 6.50, 'USD', 1, 6.50, 'AWS', 'Gasto compartido Padel Nation / Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Paola Marin (Padeling Pance)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-01', 'expense', 112.00, 'USD', 1, 112.00, 'Mitad de mano de obra de instalación en Padeling + material extra', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Paola Marin'), (SELECT id FROM finance.categories WHERE name = 'Installation' AND type = 'expense')),
('2025-08-01', 'expense', 62.00, 'USD', 1, 62.00, 'UPS para Padeling', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Paola Marin'), (SELECT id FROM finance.categories WHERE name = 'Equipment' AND type = 'expense'));

-- Income: Agosto 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-29', 'income', 447.73, 'USD', 1, 447.73, 'Pago Cámaras 7, 8', 'Pago de Julio y Agosto', (SELECT id FROM finance.clubs WHERE name = 'Padel Nation'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income')),
('2025-08-01', 'income', 96.00, 'USD', 1, 96.00, 'Pago Cámaras 1, 2', NULL, (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- Reimbursement: Agosto 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-08-01', 'reimbursement', 248.00, 'USD', 1, 248.00, 'Retribución pendiente de gastos 2025', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'Paola Marin'), NULL),
('2025-08-01', 'reimbursement', 60.00, 'USD', 1, 60.00, 'Retribución de arreglo cámaras', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), NULL);

-- ============================================
-- SEPTIEMBRE 2025
-- 2 active clubs: Smash Padel + Padeling Pance (Padel Nation inactive)
-- ============================================
-- Expenses: Smash Vision - Shared Cloudflare $30 split 50/50 (Smash Padel + Padeling)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-09-01', 'expense', 15.00, 'USD', 1, 15.00, 'Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-09-01', 'expense', 15.00, 'USD', 1, 15.00, 'Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $24 split 50/50
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-09-01', 'expense', 12.00, 'USD', 1, 12.00, 'Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-09-01', 'expense', 12.00, 'USD', 1, 12.00, 'Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared AWS $20 split 50/50
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-09-01', 'expense', 10.00, 'USD', 1, 10.00, 'AWS', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-09-01', 'expense', 10.00, 'USD', 1, 10.00, 'AWS', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Septiembre 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-09-01', 'income', 78.00, 'USD', 1, 78.00, 'Pago Cámaras 1, 2', 'Descuento por retraso en envío de facturas', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- ============================================
-- OCTUBRE 2025
-- ============================================
-- Expenses: Smash Vision - Shared Dominio .website $40 split 50/50 (Smash Padel + Padeling)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-10-01', 'expense', 20.00, 'USD', 1, 20.00, 'Dominio .website', 'Pago de dominio para docker. Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-10-01', 'expense', 20.00, 'USD', 1, 20.00, 'Dominio .website', 'Pago de dominio para docker. Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Extensión CF $3.50 split 50/50
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-10-01', 'expense', 1.75, 'USD', 1, 1.75, 'Extensión de Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-10-01', 'expense', 1.75, 'USD', 1, 1.75, 'Extensión de Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $95 split 50/50
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-10-01', 'expense', 47.50, 'USD', 1, 47.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-10-01', 'expense', 47.50, 'USD', 1, 47.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Octubre 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-10-01', 'income', 52.00, 'USD', 1, 52.00, 'Parte 1: Pago Cámaras 1, 2', 'Se paga por separado este mes', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- ============================================
-- NOVIEMBRE 2025
-- ============================================
-- Expenses: Smash Vision - Shared AWS $19.50 split 50/50 (Smash Padel + Padeling)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-11-01', 'expense', 9.75, 'USD', 1, 9.75, 'AWS', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-11-01', 'expense', 9.75, 'USD', 1, 9.75, 'AWS', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $95 split 50/50
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-11-01', 'expense', 47.50, 'USD', 1, 47.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-11-01', 'expense', 47.50, 'USD', 1, 47.50, 'Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- ============================================
-- DICIEMBRE 2025
-- ============================================
-- Expenses: Smash Vision - Shared AWS $19 split 50/50 (Smash Padel + Padeling)
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-12-01', 'expense', 9.50, 'USD', 1, 9.50, 'AWS', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-12-01', 'expense', 9.50, 'USD', 1, 9.50, 'AWS', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Cloudflare $30 split 50/50
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-12-01', 'expense', 15.00, 'USD', 1, 15.00, 'Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-12-01', 'expense', 15.00, 'USD', 1, 15.00, 'Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Expenses: Smash Vision - Shared Ajuste Cloudflare $5 split 50/50
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-12-01', 'expense', 2.50, 'USD', 1, 2.50, 'Ajuste Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense')),
('2025-12-01', 'expense', 2.50, 'USD', 1, 2.50, 'Ajuste Cloudflare', 'Gasto compartido Smash Padel / Padeling', (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Services' AND type = 'expense'));

-- Income: Diciembre 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-12-01', 'income', 146.00, 'USD', 1, 146.00, 'Pago Noviembre y Parte 2 - Octubre Cámaras 1 y 2', 'Se paga adeudo de meses anteriores', (SELECT id FROM finance.clubs WHERE name = 'Smash Padel'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income')),
('2025-12-20', 'income', 633.00, 'USD', 1, 633.00, 'Pago de SEP, OCT, NOV y parte de los 11 días de Diciembre', NULL, (SELECT id FROM finance.clubs WHERE name = 'Padeling Pance'), (SELECT id FROM finance.people WHERE name = 'Smash Vision'), (SELECT id FROM finance.categories WHERE name = 'Camera Service' AND type = 'income'));

-- Withdrawals: Diciembre 2025
INSERT INTO finance.transactions (date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id)
VALUES
('2025-12-01', 'withdrawal', 263.00, 'USD', 1, 263.00, 'Retiro 2025', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'César Castaño'), NULL),
('2025-12-01', 'withdrawal', 263.00, 'USD', 1, 263.00, 'Retiro 2025', NULL, NULL, (SELECT id FROM finance.people WHERE name = 'Tomás Ossa'), NULL);
