import type { Currency, InventoryCatalogItem, InventoryKind, InventoryUnit } from '../types';

// ── Suggestions for free-text fields (datalists) ─────────────────────
export const CATEGORY_SUGGESTIONS: Record<InventoryKind, string[]> = {
  product: ['Camera', 'Network', 'Computer', 'Storage', 'Mount', 'Cabling', 'Power', 'Accessories', 'Other'],
  service: ['Installation', 'Maintenance', 'Configuration', 'Transport', 'Support', 'Other'],
};

export const UNIT_SUGGESTIONS = ['unit', 'camera', 'club', 'court', 'meter', 'roll', 'box', 'hour', 'day', 'month', 'visit'];

// ── Money ─────────────────────────────────────────────────────────────
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Converts an amount to USD using the project's rate convention (1 USD = rate × currency). */
export function toUsd(amount: number, currency: Currency, rate: number): number {
  if (currency === 'USD') return round2(amount);
  return rate > 0 ? round2(amount / rate) : 0;
}

// ── Unit valuation ────────────────────────────────────────────────────
/** Per-unit cost in USD: its own purchase cost, else the catalog average. */
export function unitCostUsd(unit: InventoryUnit): number | null {
  if (unit.purchase_cost_usd !== null && unit.purchase_cost_usd !== undefined) return Number(unit.purchase_cost_usd);
  if (unit.catalog) return Number(unit.catalog.avg_cost_usd);
  return null;
}

export function unitValueUsd(unit: InventoryUnit): number {
  return Number(unit.quantity) * (unitCostUsd(unit) ?? 0);
}

// Measured items (cable by the meter…) are counted once per record, so unit
// totals mean "pieces" and are not inflated by meters of cable.
const MEASURE_UNITS = new Set(['meter', 'meters', 'metre', 'metres', 'm', 'ft', 'feet', 'foot', 'kg', 'g', 'lb', 'liter', 'liters', 'litre', 'l', 'hour', 'hours', 'h']);
const SHORT_UNITS: Record<string, string> = { meter: 'm', meters: 'm', metre: 'm', metres: 'm', hour: 'h', hours: 'h', feet: 'ft', foot: 'ft' };

export const isMeasuredUnit = (unit?: string | null) => !!unit && MEASURE_UNITS.has(unit.trim().toLowerCase());

/** Contribution of a record to unit counts: its quantity, or 1 for measured items. */
export const countQty = (unit: InventoryUnit) => (isMeasuredUnit(unit.catalog?.unit) ? 1 : Number(unit.quantity));

/** Quantity label: "4", or "305 m" for measured items. */
export function formatQty(qty: number, unit?: string | null): string {
  if (!isMeasuredUnit(unit)) return qty.toLocaleString('en-US');
  const u = unit!.trim().toLowerCase();
  return `${qty.toLocaleString('en-US')} ${SHORT_UNITS[u] ?? u}`;
}

/** Retired units are kept for history but are no longer part of the current inventory. */
export const isCurrentUnit = (unit: InventoryUnit) => unit.status !== 'retired';

export interface InventorySummary {
  records: number;
  totalQty: number; // pieces (see countQty)
  valueUsd: number;
  installedQty: number;
  inStockQty: number;
  attentionQty: number; // in repair + damaged
  retiredQty: number;
  missingPurchaseDate: number; // records (any status)
  activeProducts: number;
  activeServices: number;
}

export function summarizeInventory(units: InventoryUnit[], catalog: InventoryCatalogItem[]): InventorySummary {
  const s: InventorySummary = {
    records: 0,
    totalQty: 0,
    valueUsd: 0,
    installedQty: 0,
    inStockQty: 0,
    attentionQty: 0,
    retiredQty: 0,
    missingPurchaseDate: 0,
    activeProducts: catalog.filter((c) => c.is_active && c.kind === 'product').length,
    activeServices: catalog.filter((c) => c.is_active && c.kind === 'service').length,
  };
  for (const u of units) {
    const qty = countQty(u);
    if (!u.purchase_date) s.missingPurchaseDate++;
    if (!isCurrentUnit(u)) {
      s.retiredQty += qty;
      continue;
    }
    s.records++;
    s.totalQty += qty;
    s.valueUsd += unitValueUsd(u);
    if (u.status === 'installed') s.installedQty += qty;
    else if (u.status === 'in_stock') s.inStockQty += qty;
    else s.attentionQty += qty;
  }
  s.valueUsd = round2(s.valueUsd);
  return s;
}

/** Quantity-weighted average purchase cost (USD) per catalog item, from units that have one. */
export function purchaseAverages(units: InventoryUnit[]): Map<string, { avgUsd: number; qty: number }> {
  const acc = new Map<string, { total: number; qty: number }>();
  for (const u of units) {
    if (u.purchase_cost_usd === null || u.purchase_cost_usd === undefined) continue;
    const qty = Number(u.quantity);
    const a = acc.get(u.catalog_id) ?? { total: 0, qty: 0 };
    a.total += Number(u.purchase_cost_usd) * qty;
    a.qty += qty;
    acc.set(u.catalog_id, a);
  }
  const out = new Map<string, { avgUsd: number; qty: number }>();
  acc.forEach((a, id) => out.set(id, { avgUsd: a.qty > 0 ? round2(a.total / a.qty) : 0, qty: a.qty }));
  return out;
}

/** Sort key: category, then name. */
export function compareCatalog(a: InventoryCatalogItem, b: InventoryCatalogItem): number {
  return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
}

export function catalogLabel(item: Pick<InventoryCatalogItem, 'name' | 'brand' | 'model'>): string {
  const bm = [item.brand, item.model].filter(Boolean).join(' ');
  return bm ? `${item.name} · ${bm}` : item.name;
}

/** Local YYYY-MM-DD (toISOString would shift the date in the evening in UTC-5/-6). */
export function localIsoDate(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
