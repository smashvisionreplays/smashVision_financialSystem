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
