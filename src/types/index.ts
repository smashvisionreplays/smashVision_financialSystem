export interface Club {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  status: 'active' | 'inactive';
  number_cameras: number;
  created_at: string;
}

export interface Person {
  id: string;
  name: string;
  role: 'founder' | 'investor' | 'collaborator' | 'company';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income' | 'both';
}

export type TransactionType = 'expense' | 'income' | 'withdrawal' | 'reimbursement' | 'gap_contribution';
export type Currency = 'USD' | 'MXN' | 'COP';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  original_amount: number;
  original_currency: Currency;
  exchange_rate: number;
  usd_amount: number;
  description: string;
  notes: string | null;
  club_id: string | null;
  person_id: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  club?: Club;
  person?: Person;
  category?: Category;
}

export interface TransactionFormData {
  date: string;
  type: TransactionType;
  original_amount: number;
  original_currency: Currency;
  exchange_rate: number;
  usd_amount: number;
  description: string;
  notes: string;
  club_id: string;
  club_ids: string[];
  club_percentages: Record<string, number>;
  person_id: string;
  person_ids: string[];
  category_id: string;
}

export interface TransactionFilters {
  type: TransactionType | '';
  club_id: string;
  person_id: string;
  category_id: string;
  date_from: string;
  date_to: string;
  search: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface ClubSummary {
  club: Club;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
}

export interface PersonSummary {
  person: Person;
  totalExpenses: number;
  totalReimbursements: number;
  totalWithdrawals: number;
  balance: number;
}

// ── Inventory ─────────────────────────────────────────────────────────
export type InventoryKind = 'product' | 'service';
export type InventoryLocationType = 'warehouse' | 'club' | 'office' | 'person' | 'other';
export type InventoryStatus = 'in_stock' | 'installed' | 'in_repair' | 'damaged' | 'retired';

/** Product or service with its average cost (finance.inventory_catalog). */
export interface InventoryCatalogItem {
  id: string;
  name: string;
  kind: InventoryKind;
  category: string;
  brand: string | null;
  model: string | null;
  unit: string;
  avg_cost_original: number;
  currency: Currency;
  exchange_rate: number;
  avg_cost_usd: number;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  type: InventoryLocationType;
  club_id: string | null;
  notes: string | null;
  created_at: string;
}

/** Physical inventory record (finance.inventory_units). Purchase cost is per unit. */
export interface InventoryUnit {
  id: string;
  catalog_id: string;
  location_id: string | null;
  status: InventoryStatus;
  quantity: number;
  serial_number: string | null;
  purchase_date: string | null;
  purchase_cost_original: number | null;
  purchase_currency: Currency | null;
  purchase_exchange_rate: number | null;
  purchase_cost_usd: number | null;
  supplier: string | null;
  warranty_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  catalog?: InventoryCatalogItem | null;
  location?: InventoryLocation | null;
}

/** Automatic history row written by a DB trigger on inventory_units. */
export interface InventoryMovement {
  id: string;
  unit_id: string;
  from_location_id: string | null;
  to_location_id: string | null;
  from_status: InventoryStatus | null;
  to_status: InventoryStatus | null;
  moved_at: string;
  notes: string | null;
}
