import { useState } from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate, transactionTypeLabels, transactionTypeColors } from '../../lib/formatters';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  pageSize?: number;
}

export default function TransactionTable({ transactions, onEdit, onDelete, pageSize = 15 }: TransactionTableProps) {
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<'date' | 'usd_amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...transactions].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'date') return mul * a.date.localeCompare(b.date);
    return mul * (a.usd_amount - b.usd_amount);
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (field: 'date' | 'usd_amount') => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setPage(0);
  };

  return (
    <div className="bg-sv-dark rounded-xl border border-sv-gray overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sv-gray">
              <th
                className="text-left text-sv-gray-text font-medium px-4 py-3 cursor-pointer hover:text-sv-white"
                onClick={() => toggleSort('date')}
              >
                Date {sortField === 'date' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-left text-sv-gray-text font-medium px-4 py-3">Type</th>
              <th className="text-left text-sv-gray-text font-medium px-4 py-3">Description</th>
              <th className="text-left text-sv-gray-text font-medium px-4 py-3">Club</th>
              <th className="text-left text-sv-gray-text font-medium px-4 py-3">Person</th>
              <th className="text-left text-sv-gray-text font-medium px-4 py-3">Category</th>
              <th
                className="text-right text-sv-gray-text font-medium px-4 py-3 cursor-pointer hover:text-sv-white"
                onClick={() => toggleSort('usd_amount')}
              >
                Amount (USD) {sortField === 'usd_amount' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-right text-sv-gray-text font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => (
              <tr
                key={t.id}
                className="border-b border-sv-gray/50 hover:bg-sv-gray/20 transition-colors"
              >
                <td className="px-4 py-3 text-sv-white whitespace-nowrap">{formatDate(t.date)}</td>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3 text-sv-white max-w-xs truncate" title={t.description}>
                  {t.description}
                  {t.notes && (
                    <span className="text-sv-gray-text text-xs block truncate" title={t.notes}>
                      {t.notes}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sv-gray-text whitespace-nowrap">
                  {t.club?.name || '—'}
                </td>
                <td className="px-4 py-3 text-sv-gray-text whitespace-nowrap">
                  {t.person?.name || '—'}
                </td>
                <td className="px-4 py-3 text-sv-gray-text whitespace-nowrap">
                  {t.category?.name || '—'}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <span
                    className="font-medium"
                    style={{ color: transactionTypeColors[t.type] }}
                  >
                    {t.type === 'income' || t.type === 'gap_contribution' ? '+' : '-'}
                    {formatCurrency(t.usd_amount)}
                  </span>
                  {t.original_currency !== 'USD' && (
                    <span className="text-sv-gray-text text-xs block">
                      {formatCurrency(t.original_amount, t.original_currency)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => onEdit(t)}
                      className="p-1.5 rounded-lg text-sv-gray-text hover:text-sv-lime hover:bg-sv-gray transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(t)}
                      className="p-1.5 rounded-lg text-sv-gray-text hover:text-red-400 hover:bg-sv-gray transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sv-gray-text">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-sv-gray">
          <span className="text-sv-gray-text text-xs">
            Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, sorted.length)} of{' '}
            {sorted.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg text-sv-gray-text hover:text-sv-white hover:bg-sv-gray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg text-sv-gray-text hover:text-sv-white hover:bg-sv-gray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
