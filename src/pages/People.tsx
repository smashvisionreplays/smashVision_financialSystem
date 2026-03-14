import { usePeople } from '../hooks/usePeople';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../lib/formatters';
import { User, TrendingDown, RefreshCw, Wallet, DollarSign } from 'lucide-react';

const roleLabels: Record<string, string> = {
  founder: 'Founder',
  investor: 'Investor',
  collaborator: 'Collaborator',
};

const roleColors: Record<string, string> = {
  founder: 'bg-sv-lime/10 text-sv-lime',
  investor: 'bg-blue-500/10 text-blue-400',
  collaborator: 'bg-amber-500/10 text-amber-400',
};

export default function People() {
  const { data: people, isLoading: peopleLoading } = usePeople();
  const { data: transactions, isLoading: txLoading } = useTransactions();

  if (peopleLoading || txLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-sv-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const personSummaries = (people || []).map((person) => {
    const personTx = (transactions || []).filter((t) => t.person_id === person.id);
    const expenses = personTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.usd_amount, 0);
    const reimbursements = personTx.filter((t) => t.type === 'reimbursement').reduce((s, t) => s + t.usd_amount, 0);
    const withdrawals = personTx.filter((t) => t.type === 'withdrawal').reduce((s, t) => s + t.usd_amount, 0);
    const gapContributions = personTx.filter((t) => t.type === 'gap_contribution').reduce((s, t) => s + t.usd_amount, 0);

    return {
      person,
      totalExpenses: expenses,
      totalReimbursements: reimbursements,
      totalWithdrawals: withdrawals,
      totalGapContributions: gapContributions,
      balance: expenses - reimbursements,
      transactionCount: personTx.length,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sv-white">People</h1>
        <p className="text-sv-gray-text text-sm mt-1">Team members and investors financial summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {personSummaries.map(({ person, totalExpenses, totalReimbursements, totalWithdrawals, totalGapContributions, balance, transactionCount }) => (
          <div key={person.id} className="bg-sv-dark rounded-xl border border-sv-gray p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sv-lime/10 rounded-full">
                  <User className="text-sv-lime" size={18} />
                </div>
                <div>
                  <h3 className="text-sv-white font-semibold">{person.name}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-0.5 ${roleColors[person.role]}`}>
                    {roleLabels[person.role]}
                  </span>
                </div>
              </div>
              <span className="text-sv-gray-text text-xs">{transactionCount} tx</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown size={14} className="text-red-400" />
                  <span className="text-sv-gray-text text-sm">Total Expenses</span>
                </div>
                <span className="text-red-400 font-medium text-sm">{formatCurrency(totalExpenses)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw size={14} className="text-blue-400" />
                  <span className="text-sv-gray-text text-sm">Reimbursements</span>
                </div>
                <span className="text-blue-400 font-medium text-sm">{formatCurrency(totalReimbursements)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={14} className="text-amber-400" />
                  <span className="text-sv-gray-text text-sm">Withdrawals</span>
                </div>
                <span className="text-amber-400 font-medium text-sm">{formatCurrency(totalWithdrawals)}</span>
              </div>

              {totalGapContributions > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-purple-400" />
                    <span className="text-sv-gray-text text-sm">Gap Contributions</span>
                  </div>
                  <span className="text-purple-400 font-medium text-sm">{formatCurrency(totalGapContributions)}</span>
                </div>
              )}

              <div className="border-t border-sv-gray pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sv-white text-sm font-medium">Owed Balance</span>
                  <span className={`font-bold ${balance > 0 ? 'text-amber-400' : 'text-sv-lime'}`}>
                    {balance > 0 ? formatCurrency(balance) : 'Settled'}
                  </span>
                </div>
                <p className="text-sv-gray-text text-xs mt-1">
                  {balance > 0
                    ? 'Amount SV still owes this person'
                    : 'All expenses have been reimbursed'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
