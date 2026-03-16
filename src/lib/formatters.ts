import type { Currency, TransactionType } from '../types';

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    MXN: 'MX$',
    COP: 'COL$',
  };
  return `${symbols[currency]}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export const transactionTypeLabels: Record<TransactionType, string> = {
  expense: 'Expense',
  income: 'Income',
  withdrawal: 'Withdrawal',
  reimbursement: 'Reimbursement',
  gap_contribution: 'Gap Contribution',
};

export const transactionTypeColors: Record<TransactionType, string> = {
  expense: '#EF4444',
  income: '#AAFF00',
  withdrawal: '#F59E0B',
  reimbursement: '#3B82F6',
  gap_contribution: '#8B5CF6',
};
