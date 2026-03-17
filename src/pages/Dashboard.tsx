import { useState, useMemo } from 'react';
import { Landmark } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import type { TransactionFilters } from '../types';
import DashboardFilters from '../components/dashboard/DashboardFilters';
import KPICards from '../components/dashboard/KPICards';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import ClubBreakdownChart from '../components/dashboard/ClubBreakdownChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import TrendChart from '../components/dashboard/TrendChart';
import { formatDate, transactionTypeLabels, transactionTypeColors, formatCurrency } from '../lib/formatters';

const emptyFilters: TransactionFilters = {
  type: '',
  club_id: '',
  person_id: '',
  category_id: '',
  date_from: '',
  date_to: '',
  search: '',
};

export default function Dashboard() {
  const [filters, setFilters] = useState<TransactionFilters>({ ...emptyFilters });

  const hasFilters = Object.values(filters).some((v) => v !== '');
  const { data: transactions, isLoading } = useTransactions(hasFilters ? filters : undefined);
  // All-time query for cash balance (never filtered)
  const { data: allTransactions } = useTransactions();

  const cashBalance = useMemo(() => {
    if (!allTransactions) return 0;
    return allTransactions.reduce((sum, t) => {
      if (t.type === 'income' || t.type === 'gap_contribution') return sum + t.usd_amount;
      if (t.type === 'withdrawal' || t.type === 'reimbursement') return sum - t.usd_amount;
      // Only company expenses (person = Smash Vision) affect cash balance;
      // personal expenses by founders/investors are tracked separately
      if (t.type === 'expense' && t.person?.role === 'company') return sum - t.usd_amount;
      return sum;
    }, 0);
  }, [allTransactions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-sv-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const data = transactions || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sv-white">Dashboard</h1>
        <p className="text-sv-gray-text text-sm mt-1">Financial overview of Smash Vision</p>
      </div>

      <DashboardFilters filters={filters} onChange={setFilters} />

      {/* Cash Balance - always all-time */}
      <div className={`bg-sv-dark rounded-xl border ${cashBalance >= 0 ? 'border-sv-lime/30' : 'border-red-500/30'} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sv-gray-text text-sm font-medium mb-1">Smash Vision Cash Balance</p>
            <p className={`text-3xl font-bold ${cashBalance >= 0 ? 'text-sv-lime' : 'text-red-400'}`}>
              {cashBalance >= 0 ? '' : '-'}{formatCurrency(Math.abs(cashBalance))}
            </p>
            <p className="text-sv-gray-text text-xs mt-1">All-time cumulative balance</p>
          </div>
          <div className={`p-3 rounded-xl ${cashBalance >= 0 ? 'bg-sv-lime/10' : 'bg-red-500/10'}`}>
            <Landmark size={28} className={cashBalance >= 0 ? 'text-sv-lime' : 'text-red-400'} />
          </div>
        </div>
      </div>

      <KPICards transactions={data} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <IncomeExpenseChart transactions={data} />
        <TrendChart transactions={data} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ClubBreakdownChart transactions={data} />
        <CategoryChart transactions={data} />
      </div>

      {/* Recent Transactions */}
      <div className="bg-sv-dark rounded-xl border border-sv-gray p-5">
        <h3 className="text-sv-white font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sv-gray">
                <th className="text-left text-sv-gray-text font-medium px-3 py-2">Date</th>
                <th className="text-left text-sv-gray-text font-medium px-3 py-2">Type</th>
                <th className="text-left text-sv-gray-text font-medium px-3 py-2">Description</th>
                <th className="text-left text-sv-gray-text font-medium px-3 py-2">Club</th>
                <th className="text-right text-sv-gray-text font-medium px-3 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((t) => (
                <tr key={t.id} className="border-b border-sv-gray/30">
                  <td className="px-3 py-2 text-sv-white text-xs">{formatDate(t.date)}</td>
                  <td className="px-3 py-2">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: transactionTypeColors[t.type] + '20',
                        color: transactionTypeColors[t.type],
                      }}
                    >
                      {transactionTypeLabels[t.type]}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sv-white text-xs max-w-xs truncate">{t.description}</td>
                  <td className="px-3 py-2 text-sv-gray-text text-xs">{t.club?.name || '—'}</td>
                  <td className="px-3 py-2 text-right text-xs font-medium" style={{ color: transactionTypeColors[t.type] }}>
                    {t.type === 'income' || t.type === 'gap_contribution' ? '+' : '-'}
                    {formatCurrency(t.usd_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
