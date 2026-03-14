import { useClubs } from '../hooks/useClubs';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../lib/formatters';
import { Building2, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function Clubs() {
  const { data: clubs, isLoading: clubsLoading } = useClubs();
  const { data: transactions, isLoading: txLoading } = useTransactions();

  if (clubsLoading || txLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-sv-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const clubSummaries = (clubs || []).map((club) => {
    const clubTx = (transactions || []).filter((t) => t.club_id === club.id);
    const income = clubTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.usd_amount, 0);
    const expenses = clubTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.usd_amount, 0);

    return {
      club,
      totalIncome: income,
      totalExpenses: expenses,
      netProfit: income - expenses,
      transactionCount: clubTx.length,
    };
  });

  // Also compute "No Club" transactions
  const noClubTx = (transactions || []).filter((t) => !t.club_id);
  const noClubIncome = noClubTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.usd_amount, 0);
  const noClubExpenses = noClubTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.usd_amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sv-white">Clubs</h1>
        <p className="text-sv-gray-text text-sm mt-1">Financial summary per club</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clubSummaries.map(({ club, totalIncome, totalExpenses, netProfit, transactionCount }) => (
          <div key={club.id} className="bg-sv-dark rounded-xl border border-sv-gray p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sv-lime/10 rounded-lg">
                  <Building2 className="text-sv-lime" size={20} />
                </div>
                <div>
                  <h3 className="text-sv-white font-semibold text-lg">{club.name}</h3>
                  <p className="text-sv-gray-text text-xs">
                    {club.city}, {club.country}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  club.status === 'active'
                    ? 'bg-sv-lime/10 text-sv-lime'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {club.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-sv-black rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-sv-lime" />
                  <span className="text-sv-gray-text text-xs">Income</span>
                </div>
                <p className="text-sv-lime font-bold">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="bg-sv-black rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown size={14} className="text-red-400" />
                  <span className="text-sv-gray-text text-xs">Expenses</span>
                </div>
                <p className="text-red-400 font-bold">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="bg-sv-black rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={14} className={netProfit >= 0 ? 'text-sv-lime' : 'text-red-400'} />
                  <span className="text-sv-gray-text text-xs">Net</span>
                </div>
                <p className={`font-bold ${netProfit >= 0 ? 'text-sv-lime' : 'text-red-400'}`}>
                  {netProfit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netProfit))}
                </p>
              </div>
              <div className="bg-sv-black rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sv-gray-text text-xs">Transactions</span>
                </div>
                <p className="text-sv-white font-bold">{transactionCount}</p>
              </div>
            </div>
          </div>
        ))}

        {/* General / No Club */}
        <div className="bg-sv-dark rounded-xl border border-sv-gray/50 border-dashed p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-sv-gray/30 rounded-lg">
              <Building2 className="text-sv-gray-text" size={20} />
            </div>
            <div>
              <h3 className="text-sv-white font-semibold text-lg">General (No Club)</h3>
              <p className="text-sv-gray-text text-xs">Transactions not tied to any club</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-sv-black rounded-lg p-3">
              <span className="text-sv-gray-text text-xs">Income</span>
              <p className="text-sv-lime font-bold mt-1">{formatCurrency(noClubIncome)}</p>
            </div>
            <div className="bg-sv-black rounded-lg p-3">
              <span className="text-sv-gray-text text-xs">Expenses</span>
              <p className="text-red-400 font-bold mt-1">{formatCurrency(noClubExpenses)}</p>
            </div>
            <div className="bg-sv-black rounded-lg p-3">
              <span className="text-sv-gray-text text-xs">Transactions</span>
              <p className="text-sv-white font-bold mt-1">{noClubTx.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
