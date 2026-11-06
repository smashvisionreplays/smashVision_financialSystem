-- Smash Vision Financial System - Inventory module
-- Catalog of products/services with average costs, storage locations,
-- physical inventory units and an automatic movement history.
-- Run in the Supabase SQL editor after 001-007. Safe to re-run.

BEGIN;

-- ============================================
-- CATALOG (products + services, average costs)
-- ============================================
CREATE TABLE IF NOT EXISTS finance.inventory_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'product' CHECK (kind IN ('product', 'service')),
  category TEXT NOT NULL DEFAULT 'Other',
  brand TEXT,
  model TEXT,
  unit TEXT NOT NULL DEFAULT 'unit',
  avg_cost_original NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (avg_cost_original >= 0),
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'MXN', 'COP')),
  exchange_rate NUMERIC(12, 6) NOT NULL DEFAULT 1 CHECK (exchange_rate > 0),
  avg_cost_usd NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (avg_cost_usd >= 0),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (kind, name)
);

-- ============================================
-- LOCATIONS (warehouse, clubs, office, people…)
-- ============================================
CREATE TABLE IF NOT EXISTS finance.inventory_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'warehouse' CHECK (type IN ('warehouse', 'club', 'office', 'person', 'other')),
  club_id UUID REFERENCES finance.clubs(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- UNITS (physical inventory)
-- Serialized devices: quantity 1. Bulk items (cable, mounts…): quantity N.
-- Purchase cost is per unit; every purchase field is optional.
-- ============================================
CREATE TABLE IF NOT EXISTS finance.inventory_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id UUID NOT NULL REFERENCES finance.inventory_catalog(id) ON DELETE RESTRICT,
  location_id UUID REFERENCES finance.inventory_locations(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'installed', 'in_repair', 'damaged', 'retired')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  serial_number TEXT,
  purchase_date DATE,
  purchase_cost_original NUMERIC(14, 2) CHECK (purchase_cost_original >= 0),
  purchase_currency TEXT CHECK (purchase_currency IN ('USD', 'MXN', 'COP')),
  purchase_exchange_rate NUMERIC(12, 6) CHECK (purchase_exchange_rate > 0),
  purchase_cost_usd NUMERIC(12, 2) CHECK (purchase_cost_usd >= 0),
  supplier TEXT,
  warranty_until DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_units_catalog ON finance.inventory_units(catalog_id);
CREATE INDEX IF NOT EXISTS idx_inventory_units_location ON finance.inventory_units(location_id);
CREATE INDEX IF NOT EXISTS idx_inventory_units_status ON finance.inventory_units(status);
-- A serial number can only exist once per catalog item
CREATE UNIQUE INDEX IF NOT EXISTS uq_inventory_units_serial
  ON finance.inventory_units(catalog_id, serial_number)
  WHERE serial_number IS NOT NULL;

-- ============================================
-- MOVEMENTS (automatic location / status history)
-- ============================================
CREATE TABLE IF NOT EXISTS finance.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES finance.inventory_units(id) ON DELETE CASCADE,
  from_location_id UUID REFERENCES finance.inventory_locations(id) ON DELETE SET NULL,
  to_location_id UUID REFERENCES finance.inventory_locations(id) ON DELETE SET NULL,
  from_status TEXT,
  to_status TEXT,
  moved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_unit ON finance.inventory_movements(unit_id, moved_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS update_inventory_catalog_updated_at ON finance.inventory_catalog;
CREATE TRIGGER update_inventory_catalog_updated_at
  BEFORE UPDATE ON finance.inventory_catalog
  FOR EACH ROW
  EXECUTE FUNCTION finance.update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_units_updated_at ON finance.inventory_units;
CREATE TRIGGER update_inventory_units_updated_at
  BEFORE UPDATE ON finance.inventory_units
  FOR EACH ROW
  EXECUTE FUNCTION finance.update_updated_at_column();

-- Logs a movement when a unit is created, changes location or changes status.
-- When a location is deleted, ON DELETE SET NULL updates its units; the old
-- location row no longer exists at that point, so it is not referenced.
CREATE OR REPLACE FUNCTION finance.log_inventory_movement()
RETURNS TRIGGER AS $$
DECLARE
  v_from UUID;
  v_notes TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO finance.inventory_movements (unit_id, from_location_id, to_location_id, from_status, to_status)
    VALUES (NEW.id, NULL, NEW.location_id, NULL, NEW.status);
  ELSIF NEW.location_id IS DISTINCT FROM OLD.location_id
     OR NEW.status IS DISTINCT FROM OLD.status THEN
    v_from := OLD.location_id;
    IF v_from IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM finance.inventory_locations WHERE id = v_from) THEN
      v_from := NULL;
      v_notes := 'Location deleted';
    END IF;
    INSERT INTO finance.inventory_movements (unit_id, from_location_id, to_location_id, from_status, to_status, notes)
    VALUES (NEW.id, v_from, NEW.location_id, OLD.status, NEW.status, v_notes);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_inventory_unit_movement ON finance.inventory_units;
CREATE TRIGGER log_inventory_unit_movement
  AFTER INSERT OR UPDATE ON finance.inventory_units
  FOR EACH ROW
  EXECUTE FUNCTION finance.log_inventory_movement();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE finance.inventory_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.inventory_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.inventory_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.inventory_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on inventory_catalog" ON finance.inventory_catalog;
CREATE POLICY "Allow all on inventory_catalog" ON finance.inventory_catalog FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow all on inventory_locations" ON finance.inventory_locations;
CREATE POLICY "Allow all on inventory_locations" ON finance.inventory_locations FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow all on inventory_units" ON finance.inventory_units;
CREATE POLICY "Allow all on inventory_units" ON finance.inventory_units FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow all on inventory_movements" ON finance.inventory_movements;
CREATE POLICY "Allow all on inventory_movements" ON finance.inventory_movements FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- GRANTS
-- ============================================
GRANT ALL ON finance.inventory_catalog, finance.inventory_locations, finance.inventory_units, finance.inventory_movements
  TO anon, authenticated, service_role;

-- ============================================
-- SEED LOCATIONS: one per existing club + a warehouse
-- ============================================
INSERT INTO finance.inventory_locations (name, type, club_id)
SELECT c.name, 'club', c.id
FROM finance.clubs c
WHERE NOT EXISTS (SELECT 1 FROM finance.inventory_locations l WHERE l.club_id = c.id)
ON CONFLICT (name) DO NOTHING;

INSERT INTO finance.inventory_locations (name, type)
VALUES ('Warehouse', 'warehouse')
ON CONFLICT (name) DO NOTHING;

COMMIT;

-- Make the new tables visible to the API right away
NOTIFY pgrst, 'reload schema';
