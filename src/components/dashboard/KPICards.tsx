import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import type { Transaction } from '../../types';

interface KPICardsProps {
  transactions: Transaction[];
}

export default function KPICards({ transactions }: KPICardsProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.usd_amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.usd_amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.usd_amount, 0);

  const totalReimbursements = transactions
    .filter((t) => t.type === 'reimbursement')
    .reduce((sum, t) => sum + t.usd_amount, 0);

  const totalGapContributions = transactions
    .filter((t) => t.type === 'gap_contribution')
    .reduce((sum, t) => sum + t.usd_amount, 0);

  const netProfit = totalIncome - totalExpenses - totalWithdrawals - totalReimbursements + totalGapContributions;

  const cards = [
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'text-sv-lime',
      bg: 'bg-sv-lime/10',
      border: 'border-sv-lime/20',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
    {
      label: 'Net Profit/Loss',
      value: formatCurrency(Math.abs(netProfit)),
      icon: DollarSign,
      color: netProfit >= 0 ? 'text-sv-lime' : 'text-red-400',
      bg: netProfit >= 0 ? 'bg-sv-lime/10' : 'bg-red-500/10',
      border: netProfit >= 0 ? 'border-sv-lime/20' : 'border-red-500/20',
      prefix: netProfit >= 0 ? '+' : '-',
    },
    {
      label: 'Total Withdrawals',
      value: formatCurrency(totalWithdrawals),
      icon: Wallet,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-sv-dark rounded-xl border ${card.border} p-5`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sv-gray-text text-sm font-medium">{card.label}</span>
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon size={18} className={card.color} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${card.color}`}>
            {card.prefix || ''}{card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
